using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
/// PRJ-08 · Hedef tarihi geçmiş, hedefe ulaşmamış gösterge proje liderlerine bildirilir.
/// İki yarı ayrı ölçülür: TARAMA (hangi gösterge, kime) ve BİLDİRİM (hedef tarihi başına bir kez).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectIndicatorBehindNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ProjectIndicatorBehindScanner _scanner;
    private readonly ILocalEventBus _eventBus;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<ProjectIndicator, Guid> _indicatorRepository;
    private readonly IRepository<ProjectIndicatorEntry, Guid> _entryRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly DateTime _now;

    public ProjectIndicatorBehindNotification_Tests()
    {
        _scanner = GetRequiredService<ProjectIndicatorBehindScanner>();
        _eventBus = GetRequiredService<ILocalEventBus>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _indicatorRepository = GetRequiredService<IRepository<ProjectIndicator, Guid>>();
        _entryRepository = GetRequiredService<IRepository<ProjectIndicatorEntry, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _now = GetRequiredService<IClock>().Now;
    }

    private async Task<Project> NewProjectAsync(Guid? tenantId = null)
    {
        var code = "GB-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), tenantId ?? _currentTenant.Id, null, "Gösterge bildirimi " + code, code, "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    /// <summary>Hedef 200 kişi; <paramref name="targetInDays"/> eksi ise hedef tarihi geçmiştir.</summary>
    private async Task<ProjectIndicator> NewIndicatorAsync(Project project, int? targetInDays, decimal? measured = null)
    {
        var indicator = new ProjectIndicator(
            Guid.NewGuid(), project.TenantId, project.Id, "Eğitilen kişi sayısı", "kişi", 0m, 200m,
            targetInDays.HasValue ? _now.Date.AddDays(targetInDays.Value) : null);
        await _indicatorRepository.InsertAsync(indicator, autoSave: true);

        if (measured.HasValue)
        {
            await _entryRepository.InsertAsync(
                new ProjectIndicatorEntry(Guid.NewGuid(), project.TenantId, indicator.Id, _now.Date.AddDays(-40), measured.Value),
                autoSave: true);
        }

        return indicator;
    }

    private async Task<ProjectIndicatorBehindScanner.Result?> ScanForAsync(Guid indicatorId)
        => (await WithUnitOfWorkAsync(() => _scanner.ScanAsync(_now)))
            .SingleOrDefault(r => r.Event.IndicatorId == indicatorId);

    /* ─── Tarama ──────────────────────────────────────────────────────── */

    [Fact]
    public async Task Hedef_tarihi_gecmis_hedefe_ulasmamis_gosterge_bulunur_liderler_alici_olur()
    {
        var project = await NewProjectAsync();
        var lead = Guid.NewGuid();
        var member = Guid.NewGuid();
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, lead, ProjectMemberRole.Lead, project.TenantId), autoSave: true);
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, member, ProjectMemberRole.Member, project.TenantId), autoSave: true);

        var indicator = await NewIndicatorAsync(project, targetInDays: -1, measured: 90m);

        var found = await ScanForAsync(indicator.Id);

        found.ShouldNotBeNull();
        found!.Event.ProjectId.ShouldBe(project.Id);
        found.Event.CurrentValue.ShouldBe(90m);
        found.Event.ProgressPercent.ShouldBe(45);
        found.Event.RecipientIds.ShouldContain(lead);
        found.Event.RecipientIds.ShouldNotContain(member);
    }

    [Theory]
    [InlineData(0, 90)]      // hedef tarihi bugün: henüz geçmedi
    [InlineData(5, 90)]      // hedef tarihi ileride
    [InlineData(-1, 200)]    // tarih geçti ama hedefe ulaşıldı
    [InlineData(-31, 90)]    // çok eski: geriye bakış penceresinin dışında
    [InlineData(null, 90)]   // hedef tarihi yok
    public async Task Geride_olmayan_ya_da_pencere_disindaki_gosterge_bulunmaz(int? targetInDays, int measured)
    {
        var indicator = await NewIndicatorAsync(await NewProjectAsync(), targetInDays, measured);

        (await ScanForAsync(indicator.Id)).ShouldBeNull();
    }

    [Fact]
    public async Task Olcumu_olmayan_gosterge_baslangic_degeriyle_geride_sayilir()
    {
        var indicator = await NewIndicatorAsync(await NewProjectAsync(), targetInDays: -30);

        var found = await ScanForAsync(indicator.Id);

        found.ShouldNotBeNull("30. gün pencerenin kenarıdır, sayılır");
        found!.Event.ProgressPercent.ShouldBe(0);
    }

    /// <summary>Tarama kiracılar arasıdır; olay hangi kiracıda yayınlanacağını taşır.</summary>
    [Fact]
    public async Task Baska_kiracinin_gostergesi_de_taranir_ve_kiracisiyla_doner()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("gosterge-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        ProjectIndicator indicator;
        using (_currentTenant.Change(tenant.Id))
        {
            indicator = await NewIndicatorAsync(await NewProjectAsync(tenant.Id), targetInDays: -2, measured: 10m);
        }

        var found = await ScanForAsync(indicator.Id);

        found.ShouldNotBeNull("host bağlamındaki tarama kiracı göstergesini de görmeli");
        found!.TenantId.ShouldBe(tenant.Id);
    }

    /* ─── Bildirim ────────────────────────────────────────────────────── */

    private Task PublishAsync(Guid indicatorId, Guid projectId, Guid userId, DateTime targetDate)
        => WithUnitOfWorkAsync(() => _eventBus.PublishAsync(new ProjectIndicatorBehindEto
        {
            IndicatorId = indicatorId,
            ProjectId = projectId,
            IndicatorName = "Eğitilen kişi sayısı",
            ProjectName = "Isı Geri Kazanım",
            Unit = "kişi",
            TargetValue = 200m,
            CurrentValue = 90m,
            ProgressPercent = 45,
            TargetDate = targetDate,
            RecipientIds = new List<Guid> { userId },
        }));

    [Fact]
    public async Task Ayni_hedef_tarihi_icin_tek_bildirim_uretilir_tarih_ertelenirse_yeniden()
    {
        var indicatorId = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(indicatorId, projectId, userId, new DateTime(2026, 10, 1));
        await PublishAsync(indicatorId, projectId, userId, new DateTime(2026, 10, 1));

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1, "worker saatte bir koşuyor; aynı hedef tarihi yeniden bildirilmemeli");
        rows[0].Type.ShouldBe(NotificationType.ProjectIndicatorBehind);
        rows[0].EntityId.ShouldBe(projectId, "bağlantı projenin Göstergeler sekmesine iner");
        rows[0].Severity.ShouldBe(NotificationSeverity.High);
        rows[0].Body.ShouldContain("Isı Geri Kazanım", Case.Sensitive);
        rows[0].Body.ShouldContain("Eğitilen kişi sayısı", Case.Sensitive);
        rows[0].Body.ShouldContain("01.10.2026", Case.Sensitive);
        rows[0].Body.ShouldContain("90 kişi", Case.Sensitive);
        rows[0].Body.ShouldContain("200 kişi", Case.Sensitive);
        rows[0].Body.ShouldContain("%45", Case.Sensitive);
        rows[0].Title.ShouldNotContain("Notification:", Case.Sensitive, "ham anahtar değil, çevrilmiş metin");

        // Hedef tarihi ertelendi ve yeniden kaçırıldı.
        await PublishAsync(indicatorId, projectId, userId, new DateTime(2026, 12, 1));
        (await _notifications.GetListAsync(n => n.UserId == userId)).Count.ShouldBe(2);
    }
}
