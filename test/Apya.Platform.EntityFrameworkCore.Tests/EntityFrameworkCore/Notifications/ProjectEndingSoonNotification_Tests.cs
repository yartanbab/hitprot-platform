using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// 🔴 NTF-05 · Proje bitiş tarihi hiçbir iş tarafından okunmuyordu; kapanışa yaklaşan
/// proje için kimse uyarılmıyordu.
///
/// <para>İki yarı ayrı ölçülür: TARAMA (hangi proje, hangi eşik, kime) ve BİLDİRİM
/// (eşik başına bir kez). Worker'ın kendisi elle çağrılmaz — tarama bu yüzden ayrı
/// bir servise alındı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectEndingSoonNotification_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ProjectEndDateReminderScanner _scanner;
    private readonly ILocalEventBus _eventBus;
    private readonly IRepository<Notification, Guid> _notifications;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly DateTime _now;

    public ProjectEndingSoonNotification_Tests()
    {
        _scanner = GetRequiredService<ProjectEndDateReminderScanner>();
        _eventBus = GetRequiredService<ILocalEventBus>();
        _notifications = GetRequiredService<IRepository<Notification, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _memberRepository = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _now = GetRequiredService<IClock>().Now;
    }

    private async Task<Project> NewProjectAsync(int? endsInDays, Guid? tenantId = null)
    {
        var code = "PE-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), tenantId ?? _currentTenant.Id, null, "Bitiş testi " + code, code, "",
            startDate: _now.Date.AddDays(-60),
            endDate: endsInDays.HasValue ? _now.Date.AddDays(endsInDays.Value).AddHours(17) : null);
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<ProjectEndingSoonEto?> ScanForAsync(Guid projectId)
        => (await WithUnitOfWorkAsync(() => _scanner.ScanAsync(_now)))
            .Select(r => r.Event)
            .SingleOrDefault(e => e.ProjectId == projectId);

    /* ─── Tarama ──────────────────────────────────────────────────────── */

    [Theory]
    [InlineData(30, 30)]
    [InlineData(10, 14)]
    [InlineData(3, 3)]
    [InlineData(0, 3)]
    public async Task Bitisi_yaklasan_proje_dogru_esikle_bulunur(int endsInDays, int expectedThreshold)
    {
        var project = await NewProjectAsync(endsInDays);

        var found = await ScanForAsync(project.Id);

        found.ShouldNotBeNull();
        found!.Threshold.ShouldBe(expectedThreshold);
        found.DaysRemaining.ShouldBe(endsInDays);
        found.ProjectName.ShouldBe(project.Name);
    }

    [Theory]
    [InlineData(31)]    // henüz erken
    [InlineData(-1)]    // bitişi geçmiş — bu hatırlatma kapanış HAZIRLIĞI için
    [InlineData(null)]  // bitiş tarihi yok
    public async Task Pencerenin_disindaki_proje_bulunmaz(int? endsInDays)
    {
        var project = await NewProjectAsync(endsInDays);

        (await ScanForAsync(project.Id)).ShouldBeNull();
    }

    /// <summary>
    /// Alıcı: proje LİDERLERİ. Sıradan üye alıcı değildir (kapanış hazırlığı liderin işi);
    /// açık görev sayısı Done ve Cancelled'ı saymaz.
    /// </summary>
    [Fact]
    public async Task Liderler_alici_olur_acik_gorevler_sayilir()
    {
        var project = await NewProjectAsync(endsInDays: 14);
        var lead = Guid.NewGuid();
        var member = Guid.NewGuid();

        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, lead, ProjectMemberRole.Lead, project.TenantId), autoSave: true);
        await _memberRepository.InsertAsync(
            new ProjectMember(Guid.NewGuid(), project.Id, member, ProjectMemberRole.Member, project.TenantId), autoSave: true);

        async Task TaskAsync(TaskStatus status)
        {
            var task = new TaskItem(Guid.NewGuid(), "Görev", project.Id, tenantId: project.TenantId, now: _now);
            if (status != TaskStatus.Todo) { task.ChangeStatus(status, _now); }
            await _taskRepository.InsertAsync(task, autoSave: true);
        }

        await TaskAsync(TaskStatus.Todo);
        await TaskAsync(TaskStatus.InProgress);
        await TaskAsync(TaskStatus.Done);
        await TaskAsync(TaskStatus.Cancelled);

        var found = await ScanForAsync(project.Id);

        found.ShouldNotBeNull();
        found!.RecipientIds.ShouldContain(lead);
        found.RecipientIds.ShouldNotContain(member);
        found.OpenTaskCount.ShouldBe(2, "Done ve Cancelled açık görev değildir");
    }

    /// <summary>Tarama kiracılar arasıdır; olay hangi kiracıda yayınlanacağını taşır.</summary>
    [Fact]
    public async Task Baska_kiracinin_projesi_de_taranir_ve_kiracisiyla_doner()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("bitis-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        Project project;
        using (_currentTenant.Change(tenant.Id))
        {
            project = await NewProjectAsync(endsInDays: 3, tenantId: tenant.Id);
        }

        var result = (await WithUnitOfWorkAsync(() => _scanner.ScanAsync(_now)))
            .SingleOrDefault(r => r.Event.ProjectId == project.Id);

        result.ShouldNotBeNull("host bağlamındaki tarama kiracı projesini de görmeli");
        result!.TenantId.ShouldBe(tenant.Id);
    }

    /* ─── Bildirim ────────────────────────────────────────────────────── */

    private Task PublishAsync(Guid projectId, Guid userId, DateTime endDate, int threshold, int daysRemaining, int openTasks = 4)
        => WithUnitOfWorkAsync(() => _eventBus.PublishAsync(new ProjectEndingSoonEto
        {
            ProjectId = projectId,
            ProjectName = "Isı Geri Kazanım",
            EndDate = endDate,
            Threshold = threshold,
            DaysRemaining = daysRemaining,
            OpenTaskCount = openTasks,
            RecipientIds = new List<Guid> { userId },
        }));

    /// <summary>Worker saatte bir koşuyor; aynı eşik tekrar bildirilmemeli.</summary>
    [Fact]
    public async Task Ayni_esik_icin_tek_bildirim_uretilir()
    {
        var projectId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var end = new DateTime(2026, 11, 5);

        await PublishAsync(projectId, userId, end, threshold: 14, daysRemaining: 14);
        await PublishAsync(projectId, userId, end, threshold: 14, daysRemaining: 13);
        await PublishAsync(projectId, userId, end, threshold: 14, daysRemaining: 12);

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1);
        rows[0].Type.ShouldBe(NotificationType.ProjectEndingSoon);
        rows[0].EntityId.ShouldBe(projectId);
        rows[0].Title.ShouldContain("14", Case.Sensitive);
        rows[0].Body.ShouldContain("Isı Geri Kazanım", Case.Sensitive);
        rows[0].Body.ShouldContain("05.11.2026", Case.Sensitive);
        rows[0].Body.ShouldContain("4", Case.Sensitive);
        rows[0].Body.ShouldNotContain("Notification:", Case.Sensitive, "ham anahtar değil, çevrilmiş metin");
    }

    [Fact]
    public async Task Her_esik_ayri_bildirilir_ve_son_esikte_onem_yukselir()
    {
        var projectId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var end = new DateTime(2026, 11, 5);

        await PublishAsync(projectId, userId, end, threshold: 30, daysRemaining: 30);
        await PublishAsync(projectId, userId, end, threshold: 14, daysRemaining: 14);
        await PublishAsync(projectId, userId, end, threshold: 3, daysRemaining: 3);

        var rows = await _notifications.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(3, "üç eşik üç ayrı hatırlatmadır");
        rows.Count(r => r.Severity == NotificationSeverity.High)
            .ShouldBe(1, "yalnız son eşik (3 gün) yüksek önemle gider");
    }

    /// <summary>Bitiş ertelenirse eşikler YENİ tarih için yeniden çalışır.</summary>
    [Fact]
    public async Task Bitis_tarihi_ertelenirse_ayni_esik_yeniden_bildirilir()
    {
        var projectId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        await PublishAsync(projectId, userId, new DateTime(2026, 11, 5), threshold: 14, daysRemaining: 14);
        await PublishAsync(projectId, userId, new DateTime(2026, 12, 20), threshold: 14, daysRemaining: 14);

        (await _notifications.GetListAsync(n => n.UserId == userId)).Count.ShouldBe(2);
    }

    [Fact]
    public async Task Bugun_biten_ve_acik_gorevi_olmayan_proje_icin_metin_degisir()
    {
        var userId = Guid.NewGuid();

        await PublishAsync(Guid.NewGuid(), userId, new DateTime(2026, 10, 6), threshold: 3, daysRemaining: 0, openTasks: 0);

        var row = (await _notifications.GetListAsync(n => n.UserId == userId)).ShouldHaveSingleItem();
        row.Title.ShouldBe("Proje bugün bitiyor");
        row.Body.ShouldContain("Açık görev kalmadı", Case.Sensitive);
    }
}
