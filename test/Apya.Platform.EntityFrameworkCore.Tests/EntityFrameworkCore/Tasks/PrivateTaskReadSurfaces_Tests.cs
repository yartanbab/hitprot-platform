using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: gizli görev (APYA-22) yalnız görev listesinde değil, görev BAŞLIĞI basan öteki
/// okuma yüzeylerinde de süzülür: proje detayı, Genel Bakış (teslimler, tıkanan işler) ve
/// proje bütçesi (görev seçicisi, kalem×görev matrisi, görev kırılımı).
///
/// <para>Bu yüzeyler görevi doğrudan depodan okuyordu; kural yalnız <c>TaskAppService</c>'te
/// yaşadığı için gizli görevin başlığı, açıklaması ve tutarı o görevi göremeyen herkese
/// gidiyordu.</para>
///
/// <para>Barındırıcı her izne "evet" dediği için "ekip yöneticisi değil" dalı burada koşmaz;
/// süzgecin BAĞLANDIĞI, kuralın yetkiden bağımsız dalıyla (bürünme oturumu gizli görevi hiç
/// görmez) ölçülür. Kuralın dalları <c>TaskPrivacyQueryFilter_Tests</c>'te.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PrivateTaskReadSurfaces_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectAppService _projectAppService;
    private readonly IDashboardAppService _dashboard;
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public PrivateTaskReadSurfaces_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _dashboard = GetRequiredService<IDashboardAppService>();
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _lineRepository = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    /// <summary>Gizli görevi hiçbir koşulda göremeyen çağıran: bürünme oturumu.</summary>
    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Gizlilik testi " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-GZL", "", 1_000_000m, 0m, "TRY");

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<TaskItem> NewTaskAsync(
        string title, bool isPrivate, Guid? projectId = null, DateTime? dueDate = null,
        DateTime? createdAt = null, Guid? budgetLineId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId,
            description: title + " açıklaması",
            dueDate: dueDate,
            isPrivate: isPrivate,
            tenantId: _currentTenant.Id, now: _clock.Now.AddDays(-30));

        if (budgetLineId.HasValue)
        {
            task.SetBudgetLink(budgetLineId, 10_000m);
        }

        // Denetim, oluşturma zamanını yalnız BOŞSA doldurur → "bayat görev" böyle kurulur.
        if (createdAt.HasValue)
        {
            ObjectHelper.TrySetProperty(task, x => x.CreationTime, () => createdAt.Value);
        }

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    /* ═══════════════ Proje detayı ═══════════════ */

    [Fact]
    public async Task Proje_detayi_gizli_gorevi_goremeyene_dondurmez()
    {
        var projectId = await NewProjectAsync();
        var open = await NewTaskAsync("Anasayfa tasarımı", isPrivate: false, projectId);
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId);

        // Karşı yön: görebilen (oluşturan / ekip yöneticisi) ikisini de alır.
        var full = await _projectAppService.GetDetailAsync(projectId);
        full.Tasks.Select(t => t.Id).ShouldBe(new[] { open.Id, secret.Id }, ignoreOrder: true);

        using (AsOutsider())
        {
            var detail = await _projectAppService.GetDetailAsync(projectId);

            detail.Tasks.ShouldHaveSingleItem().Id.ShouldBe(open.Id);
        }
    }

    /* ═══════════════ Genel Bakış ═══════════════ */

    [Fact]
    public async Task Teslimler_listesi_gizli_gorevi_goremeyene_basmaz()
    {
        // Sıralama bitiş tarihine göre ve liste tavanlı: en eski tarih listeye kesin girer.
        var due = _clock.Now.Date.AddDays(-900);
        var open = await NewTaskAsync("açık-" + Guid.NewGuid().ToString("N"), isPrivate: false, dueDate: due);
        var secret = await NewTaskAsync("gizli-" + Guid.NewGuid().ToString("N"), isPrivate: true, dueDate: due);

        (await _dashboard.GetDeliveriesAsync(new DashboardQueryDto()))
            .Select(d => d.TaskId).ShouldContain(secret.Id);

        using (AsOutsider())
        {
            var ids = (await _dashboard.GetDeliveriesAsync(new DashboardQueryDto())).Select(d => d.TaskId).ToList();

            ids.ShouldContain(open.Id);
            ids.ShouldNotContain(secret.Id);
        }
    }

    [Fact]
    public async Task Tikanan_isler_gizli_gorevi_goremeyene_basmaz()
    {
        // Atanmamış + uzun süredir dokunulmamış görev "tıkanan iş"tir.
        var longAgo = _clock.Now.AddDays(-2000);
        var open = await NewTaskAsync("açık-" + Guid.NewGuid().ToString("N"), isPrivate: false, createdAt: longAgo);
        var secret = await NewTaskAsync("gizli-" + Guid.NewGuid().ToString("N"), isPrivate: true, createdAt: longAgo);

        (await _dashboard.GetBlockedTasksAsync()).Select(b => b.TaskId).ShouldContain(secret.Id);

        using (AsOutsider())
        {
            var ids = (await _dashboard.GetBlockedTasksAsync()).Select(b => b.TaskId).ToList();

            ids.ShouldContain(open.Id);
            ids.ShouldNotContain(secret.Id);
        }
    }

    /* ═══════════════ Proje bütçesi ═══════════════ */

    [Fact]
    public async Task Butce_kayit_formu_gorev_secicisi_gizli_gorevi_listelemez()
    {
        var projectId = await NewProjectAsync();
        var open = await NewTaskAsync("Anasayfa tasarımı", isPrivate: false, projectId);
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId);

        (await _budgetAppService.GetRecordFormLookupAsync(projectId))
            .Tasks.Select(t => t.Id).ShouldBe(new[] { open.Id, secret.Id }, ignoreOrder: true);

        using (AsOutsider())
        {
            (await _budgetAppService.GetRecordFormLookupAsync(projectId))
                .Tasks.ShouldHaveSingleItem().Id.ShouldBe(open.Id);
        }
    }

    [Fact]
    public async Task Butce_kalem_gorev_matrisi_gizli_gorev_icin_satir_uretmez()
    {
        var projectId = await NewProjectAsync();
        var line = new ProjectBudgetLine(Guid.NewGuid(), _currentTenant.Id, projectId, "1", "Personel", 60_000m, 60_000m);
        await _lineRepository.InsertAsync(line, autoSave: true);

        var open = await NewTaskAsync("Anasayfa tasarımı", isPrivate: false, projectId, budgetLineId: line.Id);
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId, budgetLineId: line.Id);
        await InsertExpenseAsync(projectId, 7_000m, secret.Id, line.Id);

        (await _budgetAppService.GetLineTaskMatrixAsync(projectId))
            .Lines.Single().Tasks.Select(t => t.TaskId).ShouldBe(new[] { open.Id, secret.Id }, ignoreOrder: true);

        using (AsOutsider())
        {
            var row = (await _budgetAppService.GetLineTaskMatrixAsync(projectId)).Lines.Single();

            row.Tasks.ShouldHaveSingleItem().TaskId.ShouldBe(open.Id);
            // Para kaybolmaz: gizli görevin harcaması kalem toplamında durur.
            row.SpentAmount.ShouldBe(7_000m);
        }
    }

    [Fact]
    public async Task Butce_gorev_kiriliminda_gizli_gorevin_adi_donmez_tutari_kalir()
    {
        var projectId = await NewProjectAsync();
        var secret = await NewTaskAsync("Maaş görüşmesi", isPrivate: true, projectId);
        await InsertExpenseAsync(projectId, 30_000m, secret.Id, budgetLineId: null);

        (await _budgetAppService.GetOverviewAsync(projectId))
            .TaskBreakdown.Single(x => x.TaskId == secret.Id).TaskName.ShouldBe("Maaş görüşmesi");

        using (AsOutsider())
        {
            var line = (await _budgetAppService.GetOverviewAsync(projectId))
                .TaskBreakdown.Single(x => x.TaskId == secret.Id);

            line.TaskName.ShouldBeNull();
            line.Expense.ShouldBe(30_000m);
        }
    }

    private async Task InsertExpenseAsync(Guid projectId, decimal amount, Guid taskId, Guid? budgetLineId)
    {
        var account = new CashAccount(Guid.NewGuid(), "Test Kasası", tenantId: _currentTenant.Id);
        await _cashAccountRepository.InsertAsync(account, autoSave: true);

        var expense = new Expense(
            Guid.NewGuid(),
            "Gider " + amount,
            amount,
            account.Id,
            new DateTime(2026, 8, 10),
            projectId: projectId,
            taskId: taskId,
            tenantId: _currentTenant.Id)
        {
            BudgetLineId = budgetLineId
        };

        await _expenseRepository.InsertAsync(expense, autoSave: true);
    }
}
