using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Documents;
using Apya.Platform.DynamicAssets;
using Apya.Platform.Expenses;
using Apya.Platform.Features;
using Apya.Platform.FxRevaluations;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.Timing;
using TaskStatusEnum = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Dashboard;

/// <summary>
/// İstatistik bandının veri sağlayıcısı.
/// <para>
/// KİLİT SÖZLEŞMESİ: her istatistik bir izne bağlıdır. İzin yoksa hesaplama fonksiyonu
/// HİÇ ÇAĞRILMAZ — sorgu atılmaz, <c>Locked=true</c> ve <c>Value=null</c> döner.
/// Kilitli kutucuk sayı sızdırmaz.
/// </para>
/// <para>
/// Setten BİLEREK çıkarılanlar (veri kaynağı yok):
/// <c>calendar-conflicts</c> (yerel takvim etkinliği saklanmıyor, yalnız dış takvim
/// eşleme kaydı var), <c>avg-approval-time</c> (onay iş akışı yok),
/// <c>ai-acceptance</c> (çekirdek modül AI modülüne referans veremez — UI ayrı uçtan okur),
/// <c>reopened-tasks</c> / <c>assignment-transfers</c> (audit log taraması gerektirir;
/// ayrı bir iş olarak bırakıldı).
/// </para>
/// </summary>
public class DashboardStatisticsProvider : ITransientDependency
{
    private readonly IRepository<TaskItem, Guid> _taskRepo;
    private readonly IRepository<Apya.Platform.Tasks.TaskComment, Guid> _commentRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<Expense, Guid> _expenseRepo;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo;
    private readonly IRepository<Invoice, Guid> _invoiceRepo;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepo;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepo;
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepo;
    private readonly IRepository<FxRevaluationSnapshot, Guid> _fxRepo;
    private readonly IRepository<Notification, Guid> _notificationRepo;
    private readonly IRepository<Document, Guid> _documentRepo;
    private readonly IRepository<AppResponse, Guid> _responseRepo;
    private readonly IRepository<GrantApplication, Guid> _grantAppRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<ClientError, Guid> _clientErrorRepo;
    private readonly IRepository<IdentityUser, Guid> _userRepo;
    private readonly Apya.Platform.Reports.ITrialBalanceAppService _trialBalance;

    private readonly IPermissionChecker _permissionChecker;
    private readonly IFeatureChecker _featureChecker;
    private readonly IAsyncQueryableExecuter _executer;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IClock _clock;
    private readonly DashboardOptions _options;
    private readonly IDistributedCache<DashboardStatCacheItem> _statCache;
    private readonly PlatformPerformanceOptions _performanceOptions;

    public DashboardStatisticsProvider(
        IRepository<TaskItem, Guid> taskRepo,
        IRepository<Apya.Platform.Tasks.TaskComment, Guid> commentRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<Expense, Guid> expenseRepo,
        IRepository<IncomeEntry, Guid> incomeRepo,
        IRepository<Invoice, Guid> invoiceRepo,
        IRepository<CashAccount, Guid> cashAccountRepo,
        IRepository<CashMovement, Guid> cashMovementRepo,
        IRepository<CustomerLedgerEntry, Guid> ledgerRepo,
        IRepository<FxRevaluationSnapshot, Guid> fxRepo,
        IRepository<Notification, Guid> notificationRepo,
        IRepository<Document, Guid> documentRepo,
        IRepository<AppResponse, Guid> responseRepo,
        IRepository<GrantApplication, Guid> grantAppRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<ClientError, Guid> clientErrorRepo,
        IRepository<IdentityUser, Guid> userRepo,
        Apya.Platform.Reports.ITrialBalanceAppService trialBalance,
        IPermissionChecker permissionChecker,
        IFeatureChecker featureChecker,
        IAsyncQueryableExecuter executer,
        IStringLocalizer<PlatformResource> l,
        IClock clock,
        IOptions<DashboardOptions> options,
        IDistributedCache<DashboardStatCacheItem> statCache,
        IOptions<PlatformPerformanceOptions> performanceOptions)
    {
        _taskRepo = taskRepo;
        _commentRepo = commentRepo;
        _projectRepo = projectRepo;
        _expenseRepo = expenseRepo;
        _incomeRepo = incomeRepo;
        _invoiceRepo = invoiceRepo;
        _cashAccountRepo = cashAccountRepo;
        _cashMovementRepo = cashMovementRepo;
        _ledgerRepo = ledgerRepo;
        _fxRepo = fxRepo;
        _notificationRepo = notificationRepo;
        _documentRepo = documentRepo;
        _responseRepo = responseRepo;
        _grantAppRepo = grantAppRepo;
        _milestoneRepo = milestoneRepo;
        _trancheRepo = trancheRepo;
        _clientErrorRepo = clientErrorRepo;
        _userRepo = userRepo;
        _trialBalance = trialBalance;
        _permissionChecker = permissionChecker;
        _featureChecker = featureChecker;
        _executer = executer;
        _l = l;
        _clock = clock;
        _options = options.Value;
        _statCache = statCache;
        _performanceOptions = performanceOptions.Value;
    }

    /// <summary>Bir istatistiğin cari ve önceki dönem değeri. Karşılaştırma yoksa Previous null.</summary>
    private readonly record struct StatValue(decimal? Current, decimal? Previous)
    {
        public static StatValue Of(decimal current) => new(current, null);
    }

    private sealed record StatDef(
        string Key,
        DashboardStatGroup Group,
        string Permission,
        StatUnit Unit,
        Func<DashboardPeriod, Guid?, Task<StatValue>> Compute,
        string? RequiredFeature = null);

    private enum StatUnit { None, Percent, Days, Hours, Money, Count }

    public async Task<List<DashboardStatDto>> BuildAsync(DashboardQueryDto input)
    {
        var period = DashboardPeriod.Resolve(input.Range, _clock.Now);
        var projectId = input.ProjectId;
        var result = new List<DashboardStatDto>();

        // İzinler istatistik başına değil, benzersiz izin başına bir kez sorulur.
        var definitions = BuildDefinitions();
        var grants = new Dictionary<string, bool>();
        foreach (var permission in definitions.Select(d => d.Permission).Distinct())
        {
            grants[permission] = await _permissionChecker.IsGrantedAsync(permission);
        }

        foreach (var def in definitions)
        {
            // Özellik (feature) kapalıysa kutucuk hiç listelenmez — modül kiracıda yok.
            if (def.RequiredFeature != null && !await _featureChecker.IsEnabledAsync(def.RequiredFeature))
            {
                continue;
            }

            var dto = new DashboardStatDto
            {
                Key = def.Key,
                Group = def.Group,
                Label = _l[$"Dashboard:Stat:{def.Key}"],
                Unit = UnitSymbol(def.Unit),
                RequiredPermission = def.Permission
            };

            if (!grants[def.Permission])
            {
                // Yetki yok → Compute ÇAĞRILMAZ. Değer hesaplanmaz, sorgu atılmaz.
                dto.Locked = true;
                result.Add(dto);
                continue;
            }

            // İzin kontrolü YUKARIDA, cache'ten önce: yetkisiz kullanıcı cache'e hiç bakmaz,
            // kilit sözleşmesi bozulmaz.
            var value = await ComputeWithCacheAsync(def, input.Range, period, projectId);
            Fill(dto, value, def.Unit);
            result.Add(dto);
        }

        return result;
    }

    /// <summary>
    /// Stat hesabını TTL'li cache ile sarar. Değerler tenant-genelidir (CurrentUser'a
    /// bağlı stat yok) ve ABP cache anahtarı tenant'a göre otomatik öneklenir →
    /// aynı kiracının kullanıcıları arasında paylaşım güvenlidir. Geçersiz kılma
    /// bilinçli olarak yalnız TTL: KPI birkaç dakika bayat kalabilir, 17+ entity'ye
    /// event handler yazmak gereksiz karmaşıklık olurdu.
    /// </summary>
    private async Task<StatValue> ComputeWithCacheAsync(
        StatDef def, DashboardDateRange range, DashboardPeriod period, Guid? projectId)
    {
        var ttlSeconds = _performanceOptions.DashboardCacheSeconds;
        if (ttlSeconds <= 0)
        {
            return await def.Compute(period, projectId);
        }

        var key = $"dash:{def.Key}:{range}:{projectId?.ToString("N") ?? "all"}";
        var cached = await _statCache.GetOrAddAsync(
            key,
            async () =>
            {
                var value = await def.Compute(period, projectId);
                return new DashboardStatCacheItem { Current = value.Current, Previous = value.Previous };
            },
            () => new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(ttlSeconds)
            });

        return new StatValue(cached!.Current, cached.Previous);
    }

    private static void Fill(DashboardStatDto dto, StatValue value, StatUnit unit)
    {
        dto.Value = value.Current;
        dto.Formatted = Format(value.Current, unit);

        if (value.Current.HasValue && value.Previous.HasValue)
        {
            var delta = value.Current.Value - value.Previous.Value;
            dto.DeltaValue = delta;
            dto.DeltaFormatted = (delta > 0 ? "+" : string.Empty) + Format(delta, unit);
            dto.Trend = delta > 0 ? DashboardTrend.Up : delta < 0 ? DashboardTrend.Down : DashboardTrend.Flat;
        }
        else
        {
            dto.Trend = DashboardTrend.Flat;
        }
    }

    private static string UnitSymbol(StatUnit unit) => unit switch
    {
        StatUnit.Percent => "%",
        StatUnit.Days => "g",
        StatUnit.Hours => "sa",
        StatUnit.Money => "₺",
        _ => string.Empty
    };

    private static string Format(decimal? value, StatUnit unit)
    {
        if (!value.HasValue) return string.Empty;
        var culture = CultureInfo.CurrentUICulture;

        return unit switch
        {
            StatUnit.Percent => "%" + Math.Round(value.Value * 100, 0).ToString("0", culture),
            StatUnit.Days => Math.Round(value.Value, 1).ToString("0.#", culture) + " g",
            StatUnit.Hours => Math.Round(value.Value, 1).ToString("0.#", culture) + " sa",
            StatUnit.Money => value.Value.ToString("N0", culture),
            _ => Math.Round(value.Value, 0).ToString("0", culture)
        };
    }

    // ─────────────────────────── Tanımlar ───────────────────────────

    private List<StatDef> BuildDefinitions() => new()
    {
        // --- İş & teslim ---
        new("ontime-delivery", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Percent, OnTimeDeliveryAsync),
        new("avg-delay", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Days, AverageDelayAsync),
        new("task-cycle-time", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Days, CycleTimeAsync),
        new("comment-response-time", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Hours, CommentResponseTimeAsync),
        new("scope-growth", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Count, ScopeGrowthAsync),
        new("blocked-count", DashboardStatGroup.Work, PlatformPermissions.Tasks.Default,
            StatUnit.Count, BlockedCountAsync),

        // --- İletişim ---
        new("unread-notifications", DashboardStatGroup.Communication, PlatformPermissions.Notifications.Default,
            StatUnit.Count, UnreadNotificationsAsync),
        new("document-uploads", DashboardStatGroup.Communication, PlatformPermissions.Documents.Default,
            StatUnit.Count, DocumentUploadsAsync),
        new("form-responses", DashboardStatGroup.Communication, PlatformPermissions.DynamicAssets.ViewResponses,
            StatUnit.Count, FormResponsesAsync),

        // --- Finans ---
        new("budget-usage", DashboardStatGroup.Finance, PlatformPermissions.Projects.ViewBudget,
            StatUnit.Percent, BudgetUsageAsync),
        new("budget-overrun-risk", DashboardStatGroup.Finance, PlatformPermissions.Projects.ViewBudget,
            StatUnit.Count, BudgetOverrunRiskAsync),
        new("pending-approval-amount", DashboardStatGroup.Finance, PlatformPermissions.Invoices.Default,
            StatUnit.Money, PendingApprovalAmountAsync),
        new("expense-items", DashboardStatGroup.Finance, PlatformPermissions.Expenses.Default,
            StatUnit.Count, ExpenseItemsAsync),
        new("monthly-net", DashboardStatGroup.Finance, PlatformPermissions.Incomes.Default,
            StatUnit.Money, MonthlyNetAsync),
        new("cash-balance", DashboardStatGroup.Finance, PlatformPermissions.CashAccounts.Default,
            StatUnit.Money, CashBalanceAsync),
        new("receivables-payables", DashboardStatGroup.Finance, PlatformPermissions.Customers.Default,
            StatUnit.Money, ReceivablesPayablesAsync),
        new("fx-revaluation", DashboardStatGroup.Finance, PlatformPermissions.FxRevaluations.Default,
            StatUnit.Money, FxRevaluationAsync, PlatformFeatures.MultiCurrency),
        new("trial-balance", DashboardStatGroup.Finance, PlatformPermissions.Reports.TrialBalance,
            StatUnit.Money, TrialBalanceDifferenceAsync),

        // --- Hibe ---
        new("active-grants", DashboardStatGroup.Grants, PlatformPermissions.Grants.Default,
            StatUnit.Count, ActiveGrantsAsync, PlatformFeatures.Grants),
        new("grant-upcoming-docs", DashboardStatGroup.Grants, PlatformPermissions.Grants.Default,
            StatUnit.Count, GrantUpcomingDocsAsync, PlatformFeatures.Grants),
        new("grant-collected-ratio", DashboardStatGroup.Grants, PlatformPermissions.Grants.Default,
            StatUnit.Percent, GrantCollectedRatioAsync, PlatformFeatures.Grants),

        // --- Sistem ---
        new("active-users", DashboardStatGroup.System, PlatformPermissions.TenantSettings.Default,
            StatUnit.Count, ActiveUsersAsync),
        new("client-errors", DashboardStatGroup.System, PlatformPermissions.SystemHealth.Default,
            StatUnit.Count, ClientErrorsAsync)
    };

    // ─────────────────────────── İş & teslim ───────────────────────────

    private async Task<StatValue> OnTimeDeliveryAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Ratio(DashboardPeriod p)
        {
            var done = await _executer.ToListAsync(
                (await _taskRepo.GetQueryableAsync())
                    .Where(t => t.Status == TaskStatusEnum.Done
                                && t.CompletedDate != null
                                && t.CompletedDate!.Value >= p.Start
                                && t.CompletedDate!.Value < p.EndExclusive
                                && (projectId == null || t.ProjectId == projectId))
                    .Select(t => new { t.CompletedDate, t.DueDate }));

            if (done.Count == 0) return null;
            var onTime = done.Count(d => d.DueDate == null || d.CompletedDate!.Value.Date <= d.DueDate!.Value.Date);
            return Math.Round((decimal)onTime / done.Count, 4);
        }

        return new StatValue(await Ratio(period), await Ratio(period.Previous()));
    }

    private async Task<StatValue> AverageDelayAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Avg(DashboardPeriod p)
        {
            var late = await _executer.ToListAsync(
                (await _taskRepo.GetQueryableAsync())
                    .Where(t => t.Status == TaskStatusEnum.Done
                                && t.CompletedDate != null && t.DueDate != null
                                && t.CompletedDate!.Value > t.DueDate!.Value
                                && t.CompletedDate!.Value >= p.Start
                                && t.CompletedDate!.Value < p.EndExclusive
                                && (projectId == null || t.ProjectId == projectId))
                    .Select(t => new { t.CompletedDate, t.DueDate }));

            if (late.Count == 0) return 0m;
            return Math.Round(
                (decimal)late.Average(l => (l.CompletedDate!.Value.Date - l.DueDate!.Value.Date).TotalDays), 1);
        }

        return new StatValue(await Avg(period), await Avg(period.Previous()));
    }

    private async Task<StatValue> CycleTimeAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Avg(DashboardPeriod p)
        {
            var done = await _executer.ToListAsync(
                (await _taskRepo.GetQueryableAsync())
                    .Where(t => t.Status == TaskStatusEnum.Done
                                && t.CompletedDate != null
                                && t.CompletedDate!.Value >= p.Start
                                && t.CompletedDate!.Value < p.EndExclusive
                                && (projectId == null || t.ProjectId == projectId))
                    .Select(t => new { t.CompletedDate, t.StartDate }));

            if (done.Count == 0) return null;
            return Math.Round(
                (decimal)done.Average(d => Math.Max(0, (d.CompletedDate!.Value.Date - d.StartDate.Date).TotalDays)), 1);
        }

        return new StatValue(await Avg(period), await Avg(period.Previous()));
    }

    /// <summary>Bir göreve gelen ilk yorum ile görevin açılışı arasındaki ortalama süre (saat).</summary>
    private async Task<StatValue> CommentResponseTimeAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Avg(DashboardPeriod p)
        {
            var comments = await _executer.ToListAsync(
                (await _commentRepo.GetQueryableAsync())
                    .Where(c => c.CreationTime >= p.Start && c.CreationTime < p.EndExclusive)
                    .GroupBy(c => c.TaskId)
                    .Select(g => new { TaskId = g.Key, FirstAt = g.Min(x => x.CreationTime) }));

            if (comments.Count == 0) return null;

            var taskIds = comments.Select(c => c.TaskId).ToList();
            var tasks = await _executer.ToListAsync(
                (await _taskRepo.GetQueryableAsync())
                    .Where(t => taskIds.Contains(t.Id) && (projectId == null || t.ProjectId == projectId))
                    .Select(t => new { t.Id, t.CreationTime }));

            var pairs = comments
                .Join(tasks, c => c.TaskId, t => t.Id, (c, t) => (c.FirstAt - t.CreationTime).TotalHours)
                .Where(h => h >= 0)
                .ToList();

            return pairs.Count == 0 ? null : Math.Round((decimal)pairs.Average(), 1);
        }

        return new StatValue(await Avg(period), await Avg(period.Previous()));
    }

    /// <summary>Dönemde açılan yeni görev sayısı — kapsam büyümesi.</summary>
    private async Task<StatValue> ScopeGrowthAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Count(DashboardPeriod p) => await _executer.CountAsync(
            (await _taskRepo.GetQueryableAsync())
                .Where(t => t.CreationTime >= p.Start && t.CreationTime < p.EndExclusive
                            && (projectId == null || t.ProjectId == projectId)));

        return new StatValue(await Count(period), await Count(period.Previous()));
    }

    private async Task<StatValue> BlockedCountAsync(DashboardPeriod period, Guid? projectId)
    {
        var staleBefore = _clock.Now.AddDays(-_options.StaleAfterDays);
        var count = await _executer.CountAsync(
            (await _taskRepo.GetQueryableAsync())
                .Where(t => t.Status != TaskStatusEnum.Done && t.Status != TaskStatusEnum.Cancelled
                            && (t.LastModificationTime ?? t.CreationTime) < staleBefore
                            && (t.Status == TaskStatusEnum.InReview || t.AssigneeId == null)
                            && (projectId == null || t.ProjectId == projectId)));

        return StatValue.Of(count);
    }

    // ─────────────────────────── İletişim ───────────────────────────

    private async Task<StatValue> UnreadNotificationsAsync(DashboardPeriod period, Guid? projectId)
        => StatValue.Of(await _executer.CountAsync(
            (await _notificationRepo.GetQueryableAsync()).Where(n => !n.IsRead)));

    private async Task<StatValue> DocumentUploadsAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Count(DashboardPeriod p) => await _executer.CountAsync(
            (await _documentRepo.GetQueryableAsync())
                .Where(d => d.CreationTime >= p.Start && d.CreationTime < p.EndExclusive
                            && (projectId == null || d.ProjectId == projectId)));

        return new StatValue(await Count(period), await Count(period.Previous()));
    }

    private async Task<StatValue> FormResponsesAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Count(DashboardPeriod p) => await _executer.CountAsync(
            (await _responseRepo.GetQueryableAsync())
                .Where(r => r.CreationTime >= p.Start && r.CreationTime < p.EndExclusive));

        return new StatValue(await Count(period), await Count(period.Previous()));
    }

    // ─────────────────────────── Finans ───────────────────────────

    private async Task<StatValue> BudgetUsageAsync(DashboardPeriod period, Guid? projectId)
    {
        var projectQuery = (await _projectRepo.GetQueryableAsync())
            .Where(p => projectId == null || p.Id == projectId);
        var total = await _executer.SumAsync(projectQuery, p => p.TotalBudget);
        if (total <= 0) return new StatValue(null, null);

        var spent = await _executer.SumAsync(
            (await _expenseRepo.GetQueryableAsync())
                .Where(e => e.ProjectId != null && (projectId == null || e.ProjectId == projectId)),
            e => e.Amount);

        return StatValue.Of(Math.Round(spent / total, 4));
    }

    /// <summary>Bütçesinin %90'ından fazlasını harcamış proje sayısı.</summary>
    private async Task<StatValue> BudgetOverrunRiskAsync(DashboardPeriod period, Guid? projectId)
    {
        var projects = await _executer.ToListAsync(
            (await _projectRepo.GetQueryableAsync())
                .Where(p => p.TotalBudget > 0 && (projectId == null || p.Id == projectId))
                .Select(p => new { p.Id, p.TotalBudget }));

        if (projects.Count == 0) return StatValue.Of(0);

        var ids = projects.Select(p => p.Id).ToList();
        var spent = (await _executer.ToListAsync(
                (await _expenseRepo.GetQueryableAsync())
                    .Where(e => e.ProjectId != null && ids.Contains(e.ProjectId!.Value))
                    .GroupBy(e => e.ProjectId!.Value)
                    .Select(g => new { ProjectId = g.Key, Total = g.Sum(x => x.Amount) })))
            .ToDictionary(x => x.ProjectId, x => x.Total);

        var atRisk = projects.Count(p =>
            spent.TryGetValue(p.Id, out var s) && s / p.TotalBudget >= _options.RiskyRatio);

        return StatValue.Of(atRisk);
    }

    private async Task<StatValue> PendingApprovalAmountAsync(DashboardPeriod period, Guid? projectId)
        => StatValue.Of(await _executer.SumAsync(
            (await _invoiceRepo.GetQueryableAsync())
                .Where(i => i.Status == InvoiceStatus.Draft
                            && (projectId == null || i.ProjectId == projectId)),
            i => i.TotalAmount));

    private async Task<StatValue> ExpenseItemsAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Count(DashboardPeriod p) => await _executer.CountAsync(
            (await _expenseRepo.GetQueryableAsync())
                .Where(e => e.ExpenseDate >= p.Start && e.ExpenseDate < p.EndExclusive
                            && (projectId == null || e.ProjectId == projectId)));

        return new StatValue(await Count(period), await Count(period.Previous()));
    }

    private async Task<StatValue> MonthlyNetAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Net(DashboardPeriod p)
        {
            var income = await _executer.SumAsync(
                (await _incomeRepo.GetQueryableAsync())
                    .Where(i => i.IncomeDate >= p.Start && i.IncomeDate < p.EndExclusive
                                && (projectId == null || i.ProjectId == projectId)),
                i => i.Amount);

            var expense = await _executer.SumAsync(
                (await _expenseRepo.GetQueryableAsync())
                    .Where(e => e.ExpenseDate >= p.Start && e.ExpenseDate < p.EndExclusive
                                && (projectId == null || e.ProjectId == projectId)),
                e => e.Amount);

            return income - expense;
        }

        return new StatValue(await Net(period), await Net(period.Previous()));
    }

    /// <summary>Aktif kasaların açılış bakiyesi + tüm hareketlerin net etkisi.</summary>
    private async Task<StatValue> CashBalanceAsync(DashboardPeriod period, Guid? projectId)
    {
        var opening = await _executer.SumAsync(
            (await _cashAccountRepo.GetQueryableAsync()).Where(a => a.IsActive),
            a => a.OpeningBalance);

        var movements = await _executer.ToListAsync(
            (await _cashMovementRepo.GetQueryableAsync())
                .GroupBy(m => m.Direction)
                .Select(g => new { Direction = g.Key, Total = g.Sum(x => x.Amount) }));

        var inflow = movements.Where(m => m.Direction == CashMovementDirection.In).Sum(m => m.Total);
        var outflow = movements.Where(m => m.Direction == CashMovementDirection.Out).Sum(m => m.Total);

        return StatValue.Of(opening + inflow - outflow);
    }

    /// <summary>Cari bakiye: borç − alacak. Pozitif = tahsil edilecek.</summary>
    private async Task<StatValue> ReceivablesPayablesAsync(DashboardPeriod period, Guid? projectId)
    {
        var rows = await _executer.ToListAsync(
            (await _ledgerRepo.GetQueryableAsync())
                .Where(e => projectId == null || e.ProjectId == projectId)
                .GroupBy(e => e.Direction)
                .Select(g => new { Direction = g.Key, Total = g.Sum(x => x.Amount) }));

        var debit = rows.Where(r => r.Direction == CustomerLedgerDirection.Debit).Sum(r => r.Total);
        var credit = rows.Where(r => r.Direction == CustomerLedgerDirection.Credit).Sum(r => r.Total);

        return StatValue.Of(debit - credit);
    }

    /// <summary>En son değerleme anlık görüntüsünün toplam TL karşılığı.</summary>
    private async Task<StatValue> FxRevaluationAsync(DashboardPeriod period, Guid? projectId)
    {
        var latest = await _executer.FirstOrDefaultAsync(
            (await _fxRepo.GetQueryableAsync())
                .OrderByDescending(s => s.AsOfDate)
                .Select(s => new { s.TotalTryValue }));

        return latest == null ? new StatValue(null, null) : StatValue.Of(latest.TotalTryValue);
    }

    /// <summary>
    /// Mizan denge farkı (borç − alacak). Sağlıklı bir defterde 0'dır; sıfırdan
    /// sapma incelenecek bir kayıt olduğunu gösterir. Mevcut
    /// <see cref="Apya.Platform.Reports.ITrialBalanceAppService"/> yeniden kullanılır.
    /// </summary>
    private async Task<StatValue> TrialBalanceDifferenceAsync(DashboardPeriod period, Guid? projectId)
    {
        var report = await _trialBalance.GetAsync(new Apya.Platform.Reports.GetTrialBalanceInput
        {
            FromDate = period.Start,
            ToDate = period.EndExclusive.AddDays(-1)
        });

        return StatValue.Of(report.TotalDebit - report.TotalCredit);
    }

    // ─────────────────────────── Hibe ───────────────────────────

    private async Task<StatValue> ActiveGrantsAsync(DashboardPeriod period, Guid? projectId)
        => StatValue.Of(await _executer.CountAsync(
            (await _grantAppRepo.GetQueryableAsync())
                .Where(a => a.Stage != GrantApplicationStage.Basvuru)));

    /// <summary>Önümüzdeki 30 gün içinde son tarihi dolan, tamamlanmamış kilometre taşları.</summary>
    private async Task<StatValue> GrantUpcomingDocsAsync(DashboardPeriod period, Guid? projectId)
    {
        var today = _clock.Now.Date;
        var horizon = today.AddDays(30);

        return StatValue.Of(await _executer.CountAsync(
            (await _milestoneRepo.GetQueryableAsync())
                .Where(m => !m.IsCompleted && m.DueDate != null
                            && m.DueDate!.Value >= today && m.DueDate!.Value < horizon)));
    }

    /// <summary>Ödenen dilim tutarı / toplam dilim tutarı.</summary>
    private async Task<StatValue> GrantCollectedRatioAsync(DashboardPeriod period, Guid? projectId)
    {
        var rows = await _executer.ToListAsync(
            (await _trancheRepo.GetQueryableAsync())
                .GroupBy(t => t.Status)
                .Select(g => new { Status = g.Key, Total = g.Sum(x => x.Amount) }));

        var total = rows.Sum(r => r.Total);
        if (total <= 0) return new StatValue(null, null);

        var paid = rows.Where(r => r.Status == GrantDisbursementTrancheStatus.Odendi).Sum(r => r.Total);
        return StatValue.Of(Math.Round(paid / total, 4));
    }

    // ─────────────────────────── Sistem ───────────────────────────

    /// <summary>Aktif kullanıcı sayısı. Kiracının MaxUsers özelliği varsa üst sınır da okunur.</summary>
    private async Task<StatValue> ActiveUsersAsync(DashboardPeriod period, Guid? projectId)
        => StatValue.Of(await _executer.CountAsync(
            (await _userRepo.GetQueryableAsync()).Where(u => u.IsActive)));

    private async Task<StatValue> ClientErrorsAsync(DashboardPeriod period, Guid? projectId)
    {
        async Task<decimal?> Count(DashboardPeriod p) => await _executer.CountAsync(
            (await _clientErrorRepo.GetQueryableAsync())
                .Where(e => !e.IsResolved && e.LastSeenAt >= p.Start && e.LastSeenAt < p.EndExclusive));

        return new StatValue(await Count(period), await Count(period.Previous()));
    }
}
