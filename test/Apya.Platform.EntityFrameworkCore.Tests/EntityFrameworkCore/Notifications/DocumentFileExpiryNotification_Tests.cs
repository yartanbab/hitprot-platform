using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Belgeye girilen geçerlilik tarihi hiçbir iş tarafından okunmuyordu:
/// mevcut hatırlatma yalnız KLASÖR düzeyindeki eski tarihi izliyor, tek seferlik çalışıyor ve
/// "süresi doldu" anını hiç duyurmuyordu.
///
/// <para>İki yarı ayrı ölçülür: TARAMA (hangi belge, hangi eşik, kime) ve BİLDİRİM (eşik
/// başına bir kez). Worker'ın kendisi elle çağrılmaz — tarama bu yüzden ayrı bir serviste.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class DocumentFileExpiryNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly DocumentFileExpiryScanner _scanner;
    private readonly ILocalEventBus _eventBus;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly DateTime _now;

    public DocumentFileExpiryNotification_Tests()
    {
        _scanner = GetRequiredService<DocumentFileExpiryScanner>();
        _eventBus = GetRequiredService<ILocalEventBus>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _folderRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _now = GetRequiredService<IClock>().Now;
    }

    private async Task<DocumentFile> NewFileAsync(int? expiresInDays, Guid? tenantId = null, Guid? projectId = null)
    {
        var tenant = tenantId ?? _currentTenant.Id;
        var folder = new Document(Guid.NewGuid(), tenant, "Geçerlilik klasörü " + Guid.NewGuid().ToString("N")[..6], string.Empty);
        await _folderRepository.InsertAsync(folder, autoSave: true);

        var file = new DocumentFile(Guid.NewGuid(), tenant, folder.Id, "Sözleşme.pdf", projectId: projectId);
        file.SetDates(null, null, expiresInDays.HasValue ? _now.Date.AddDays(expiresInDays.Value).AddHours(17) : null);
        await _fileRepository.InsertAsync(file, autoSave: true);
        return file;
    }

    private async Task<DocumentFileExpiryEto?> ScanForAsync(Guid fileId)
        => (await WithUnitOfWorkAsync(() => _scanner.ScanAsync(_now)))
            .Select(r => r.Event)
            .SingleOrDefault(e => e.DocumentFileId == fileId);

    /* ─── Tarama ──────────────────────────────────────────────────────── */

    [Theory]
    [InlineData(30, 30)]
    [InlineData(12, 30)]
    [InlineData(7, 7)]
    [InlineData(2, 7)]
    [InlineData(0, 0)]
    [InlineData(-3, 0)]
    public async Task Gecerliligi_yaklasan_ya_da_yeni_dolan_belge_dogru_esikle_bulunur(int expiresInDays, int expectedThreshold)
    {
        var file = await NewFileAsync(expiresInDays);

        var found = await ScanForAsync(file.Id);

        found.ShouldNotBeNull();
        found!.Threshold.ShouldBe(expectedThreshold);
        found.DaysRemaining.ShouldBe(expiresInDays);
        found.DisplayName.ShouldBe("Sözleşme.pdf");
        found.DocumentId.ShouldBe(file.DocumentId);
    }

    [Theory]
    [InlineData(31)]    // henüz erken
    [InlineData(-8)]    // çoktan dolmuş — geriye dönük duyurulmaz
    [InlineData(null)]  // geçerlilik tarihi yok
    public async Task Pencerenin_disindaki_belge_bulunmaz(int? expiresInDays)
    {
        var file = await NewFileAsync(expiresInDays);

        (await ScanForAsync(file.Id)).ShouldBeNull();
    }

    /// <summary>
    /// Alıcı: belge bir projeye bağlıysa o projenin LİDERLERİ. Sıradan üye alıcı değildir.
    /// (Yükleyen de alıcıdır; test bağlamında oturum açmış kullanıcı olmadığı için boş kalır.)
    /// </summary>
    [Fact]
    public async Task Projeye_bagli_belgede_liderler_alici_olur()
    {
        var code = "DG-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, "Geçerlilik " + code, code, "");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var lead = Guid.NewGuid();
        var member = Guid.NewGuid();
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, lead, ProjectMemberRole.Lead, project.TenantId), autoSave: true);
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, member, ProjectMemberRole.Member, project.TenantId), autoSave: true);

        var file = await NewFileAsync(expiresInDays: 7, projectId: project.Id);

        var found = await ScanForAsync(file.Id);

        found.ShouldNotBeNull();
        found!.RecipientIds.ShouldContain(lead);
        found.RecipientIds.ShouldNotContain(member);
    }

    [Fact]
    public async Task Baska_kiracinin_belgesi_de_taranir_ve_kiracisiyla_doner()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("gecerlilik-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        DocumentFile file;
        using (_currentTenant.Change(tenant.Id))
        {
            file = await NewFileAsync(expiresInDays: 3, tenantId: tenant.Id);
        }

        var result = (await WithUnitOfWorkAsync(() => _scanner.ScanAsync(_now)))
            .SingleOrDefault(r => r.Event.DocumentFileId == file.Id);

        result.ShouldNotBeNull("host bağlamındaki tarama kiracı belgesini de görmeli");
        result!.TenantId.ShouldBe(tenant.Id);
    }

    /* ─── Bildirim ────────────────────────────────────────────────────── */

    private Task PublishAsync(Guid fileId, Guid folderId, Guid userId, DateTime expiry, int threshold, int daysRemaining)
        => WithUnitOfWorkAsync(() => _eventBus.PublishAsync(new DocumentFileExpiryEto
        {
            DocumentFileId = fileId,
            DocumentId = folderId,
            DisplayName = "Kira Sözleşmesi.pdf",
            ExpiryDate = expiry,
            Threshold = threshold,
            DaysRemaining = daysRemaining,
            RecipientIds = new List<Guid> { userId },
        }));

    /// <summary>Worker saatte bir koşuyor; aynı eşik tekrar bildirilmemeli.</summary>
    [Fact]
    public async Task Ayni_esik_icin_tek_bildirim_uretilir()
    {
        var fileId = Guid.NewGuid();
        var folderId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var expiry = new DateTime(2026, 11, 5);

        await PublishAsync(fileId, folderId, userId, expiry, threshold: 30, daysRemaining: 30);
        await PublishAsync(fileId, folderId, userId, expiry, threshold: 30, daysRemaining: 29);
        await PublishAsync(fileId, folderId, userId, expiry, threshold: 30, daysRemaining: 12);

        var row = (await _notifications.GetListAsync(n => n.UserId == userId)).ShouldHaveSingleItem();

        row.Type.ShouldBe(NotificationType.DocumentFileExpiry);
        // Bağlantı belgenin durduğu klasörü açar.
        row.EntityId.ShouldBe(folderId);
        row.Title.ShouldBe("Belgenin geçerliliğine 30 gün kaldı");
        row.Body.ShouldBe("\"Kira Sözleşmesi.pdf\" belgesinin geçerlilik tarihi 05.11.2026.");
        row.Severity.ShouldBe(NotificationSeverity.Normal);
    }

    [Fact]
    public async Task Her_esik_ayri_bildirilir_ve_son_iki_esikte_onem_yukselir()
    {
        var fileId = Guid.NewGuid();
        var folderId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var expiry = new DateTime(2026, 11, 5);

        await PublishAsync(fileId, folderId, userId, expiry, threshold: 30, daysRemaining: 30);
        await PublishAsync(fileId, folderId, userId, expiry, threshold: 7, daysRemaining: 7);
        await PublishAsync(fileId, folderId, userId, expiry, threshold: 0, daysRemaining: 0);
        // Dolduktan sonraki turlar aynı eşiktedir: "doldu" ikinci kez bildirilmez.
        await PublishAsync(fileId, folderId, userId, expiry, threshold: 0, daysRemaining: -2);

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(3, "üç eşik üç ayrı bildirimdir");
        rows.Count(r => r.Severity == NotificationSeverity.High)
            .ShouldBe(2, "7 gün ve 'doldu' yüksek önemle gider; 30 gün bir hatırlatmadır");
        rows.ShouldContain(r => r.Title == "Belgenin geçerliliği bugün doluyor");
    }

    /// <summary>Tarama o gün çalışmadıysa "doldu" ertesi gün de duyurulur — metin geçmiş zamana döner.</summary>
    [Fact]
    public async Task Dolduktan_sonra_ilk_kez_gorulen_belge_doldu_diye_bildirilir()
    {
        var userId = Guid.NewGuid();

        await PublishAsync(Guid.NewGuid(), Guid.NewGuid(), userId, new DateTime(2026, 10, 4), threshold: 0, daysRemaining: -2);

        var row = (await _notifications.GetListAsync(n => n.UserId == userId)).ShouldHaveSingleItem();
        row.Title.ShouldBe("Belgenin geçerliliği doldu");
        row.Severity.ShouldBe(NotificationSeverity.High);
    }

    /// <summary>Tarih uzatılırsa eşikler YENİ tarih için yeniden çalışır.</summary>
    [Fact]
    public async Task Tarih_uzatilirsa_ayni_esik_yeniden_bildirilir()
    {
        var fileId = Guid.NewGuid();
        var folderId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(fileId, folderId, userId, new DateTime(2026, 11, 5), threshold: 7, daysRemaining: 7);
        await PublishAsync(fileId, folderId, userId, new DateTime(2027, 11, 5), threshold: 7, daysRemaining: 7);

        (await _notifications.GetListAsync(n => n.UserId == userId)).Count.ShouldBe(2);
    }
}
