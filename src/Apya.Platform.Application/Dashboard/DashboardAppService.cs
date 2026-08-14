using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Expenses;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Users;
using TaskStatusEnum = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Dashboard;

/// <summary>
/// /Dashboard ekranının okuma servisi. Sınıf seviyesi izin <c>Platform.Projects</c>;
/// finansal alanlar ayrıca kontrol edilir ve yetki yoksa SORGU ATILMAZ, null döner.
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class DashboardAppService : PlatformAppService, IDashboardAppService
{
    private readonly IRepository<TaskItem, Guid> _taskRepo;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<Invoice, Guid> _invoiceRepo;
    private readonly IRepository<Expense, Guid> _expenseRepo;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepo;
    private readonly IRepository<DashboardLayout, Guid> _layoutRepo;
    private readonly IRepository<IdentityUser, Guid> _userRepo;
    private readonly DashboardStatisticsProvider _statistics;
    private readonly DashboardOptions _options;

    public DashboardAppService(
        IRepository<TaskItem, Guid> taskRepo,
        IRepository<TaskDependency, Guid> dependencyRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<Invoice, Guid> invoiceRepo,
        IRepository<Expense, Guid> expenseRepo,
        IRepository<IncomeEntry, Guid> incomeRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantDisbursementTranche, Guid> trancheRepo,
        IRepository<DashboardLayout, Guid> layoutRepo,
        IRepository<IdentityUser, Guid> userRepo,
        DashboardStatisticsProvider statistics,
        IOptions<DashboardOptions> options)
    {
        _taskRepo = taskRepo;
        _dependencyRepo = dependencyRepo;
        _projectRepo = projectRepo;
        _invoiceRepo = invoiceRepo;
        _expenseRepo = expenseRepo;
        _incomeRepo = incomeRepo;
        _milestoneRepo = milestoneRepo;
        _trancheRepo = trancheRepo;
        _layoutRepo = layoutRepo;
        _userRepo = userRepo;
        _statistics = statistics;
        _options = options.Value;
    }

    // ─────────────────────────── Özet şeridi ───────────────────────────

    public async Task<DashboardSummaryDto> GetSummaryAsync(DashboardQueryDto input)
    {
        var today = Clock.Now.Date;
        var period = DashboardPeriod.Resolve(input.Range, Clock.Now);

        var openTasks = await ListOpenTasksAsync(input.ProjectId);

        var dueInPeriod = openTasks
            .Where(t => t.DueDate!.Value.Date >= period.Start && t.DueDate.Value.Date < period.EndExclusive)
            .ToList();

        var weekStart = DashboardPeriod.StartOfWeek(today);
        var overdue = openTasks.Where(t => t.DueDate!.Value.Date < today).ToList();

        var blocked = await ListBlockedAsync();

        var dto = new DashboardSummaryDto
        {
            DueThisPeriod = dueInPeriod.Count,
            DueThisWeek = dueInPeriod.Count(t =>
                t.DueDate!.Value.Date >= weekStart && t.DueDate.Value.Date < weekStart.AddDays(7)),
            Overdue = overdue.Count,
            OldestOverdueDays = overdue.Count == 0
                ? null
                : overdue.Max(t => (int)(today - t.DueDate!.Value.Date).TotalDays),
            OverdueProjectCount = overdue.Where(t => t.ProjectId.HasValue)
                .Select(t => t.ProjectId!.Value).Distinct().Count(),
            Blocked = blocked.Count,
            BlockedAvgIdleDays = blocked.Count == 0
                ? 0m
                : Math.Round((decimal)blocked.Average(b => b.IdleDays), 1),
            DueTrend = BuildDueTrend(dueInPeriod, period),
            Currency = await ResolveCurrencyAsync(input.ProjectId)
        };

        // Onay kuyruğu — Platform.Invoices yoksa sorgu ATILMAZ, alanlar null kalır.
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Invoices.Default))
        {
            var drafts = await ListDraftInvoicesAsync(input.ProjectId);
            dto.PendingApprovals = drafts.Count;
            dto.PendingApprovalAmount = drafts.Sum(i => i.TotalAmount);
            dto.PendingApprovalAvgAgeHours = drafts.Count == 0
                ? 0m
                : Math.Round((decimal)drafts.Average(i => (Clock.Now - i.CreationTime).TotalHours), 1);
        }

        // Bütçe — Platform.Projects.ViewBudget yoksa sorgu ATILMAZ.
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
        {
            var (spent, total) = await GetBudgetTotalsAsync(input.ProjectId);
            dto.BudgetSpent = spent;
            dto.BudgetTotal = total;
            dto.BudgetUsedRatio = total > 0 ? Math.Round(spent / total, 4) : null;
        }

        return dto;
    }

    private static List<int> BuildDueTrend(List<TaskItem> dueInPeriod, DashboardPeriod period)
    {
        var days = Math.Max(period.DayCount, 1);
        var trend = new int[days];
        foreach (var task in dueInPeriod)
        {
            var index = (int)(task.DueDate!.Value.Date - period.Start).TotalDays;
            if (index >= 0 && index < days) trend[index]++;
        }
        return trend.ToList();
    }

    // ─────────────────────────── Teslimler ───────────────────────────

    public async Task<List<DeliveryItemDto>> GetDeliveriesAsync(DashboardQueryDto input)
    {
        var today = Clock.Now.Date;
        var period = DashboardPeriod.Resolve(input.Range, Clock.Now);

        var query = (await _taskRepo.GetQueryableAsync())
            .Where(t => t.DueDate != null
                        && t.Status != TaskStatusEnum.Done
                        && t.Status != TaskStatusEnum.Cancelled
                        && t.DueDate!.Value < period.EndExclusive);

        if (input.ProjectId.HasValue)
        {
            query = query.Where(t => t.ProjectId == input.ProjectId.Value);
        }

        var tasks = await AsyncExecuter.ToListAsync(
            query.OrderBy(t => t.DueDate).Take(_options.MaxListRows));

        // N+1 önleme: proje adları ve atanan kullanıcılar tek sorguda toplanır.
        var projectNames = await GetProjectNamesAsync(tasks.Select(t => t.ProjectId));
        var users = await GetUserLabelsAsync(tasks.Select(t => t.AssigneeId));

        return tasks.Select(t =>
        {
            var due = t.DueDate!.Value;
            var group = DashboardPeriod.GroupFor(due, today);
            var isOverdue = due.Date < today;
            var user = t.AssigneeId.HasValue && users.TryGetValue(t.AssigneeId.Value, out var u) ? u : null;

            return new DeliveryItemDto
            {
                TaskId = t.Id,
                Title = t.Title,
                ProjectId = t.ProjectId,
                ProjectName = t.ProjectId.HasValue && projectNames.TryGetValue(t.ProjectId.Value, out var pn)
                    ? pn
                    : string.Empty,
                DueDate = due,
                State = isOverdue ? DeliveryState.Overdue
                    : t.Status == TaskStatusEnum.InReview ? DeliveryState.InReview
                    : group == DeliveryGroup.Later ? DeliveryState.Upcoming
                    : DeliveryState.OnTrack,
                OverdueDays = isOverdue ? (int)(today - due.Date).TotalDays : null,
                AssigneeName = user?.Name ?? string.Empty,
                AssigneeInitials = user?.Initials ?? string.Empty,
                GroupKey = group
            };
        }).ToList();
    }

    // ─────────────────────────── Proje sağlığı ───────────────────────────

    public async Task<List<ProjectHealthDto>> GetProjectHealthAsync(DashboardQueryDto input)
    {
        var today = Clock.Now.Date;
        var canSeeBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);

        var projectQuery = await _projectRepo.GetQueryableAsync();
        if (input.ProjectId.HasValue)
        {
            projectQuery = projectQuery.Where(p => p.Id == input.ProjectId.Value);
        }

        var projects = await AsyncExecuter.ToListAsync(
            projectQuery.OrderBy(p => p.EndDate == null).ThenBy(p => p.EndDate).Take(_options.MaxListRows));

        var projectIds = projects.Select(p => p.Id).ToList();

        // Görev sayıları — proje başına tek gruplu sorgu (N+1 yok).
        var taskCounts = await AsyncExecuter.ToListAsync(
            (await _taskRepo.GetQueryableAsync())
                .Where(t => t.ProjectId != null && projectIds.Contains(t.ProjectId!.Value))
                .GroupBy(t => new { ProjectId = t.ProjectId!.Value, t.Status })
                .Select(g => new { g.Key.ProjectId, g.Key.Status, Count = g.Count() }));

        // Harcama yalnız yetki varsa sorgulanır.
        var spentByProject = canSeeBudget
            ? await GetSpentByProjectAsync(projectIds)
            : new Dictionary<Guid, decimal>();

        return projects.Select(p =>
        {
            var counts = taskCounts.Where(c => c.ProjectId == p.Id).ToList();
            var total = counts.Sum(c => c.Count);
            var done = counts.Where(c => c.Status == TaskStatusEnum.Done).Sum(c => c.Count);

            decimal? timeRatio = null;
            int? daysRemaining = null;
            if (p.StartDate.HasValue && p.EndDate.HasValue && p.EndDate.Value > p.StartDate.Value)
            {
                var span = (decimal)(p.EndDate.Value - p.StartDate.Value).TotalDays;
                var elapsed = (decimal)(today - p.StartDate.Value.Date).TotalDays;
                timeRatio = Math.Round(Math.Clamp(elapsed / span, 0m, 2m), 4);
                daysRemaining = (int)(p.EndDate.Value.Date - today).TotalDays;
            }

            decimal? budgetRatio = null;
            if (canSeeBudget && p.TotalBudget > 0)
            {
                spentByProject.TryGetValue(p.Id, out var spent);
                budgetRatio = Math.Round(spent / p.TotalBudget, 4);
            }

            return new ProjectHealthDto
            {
                ProjectId = p.Id,
                Name = p.Name,
                State = ResolveHealth(timeRatio, budgetRatio),
                DaysRemaining = daysRemaining,
                TimeRatio = timeRatio,
                BudgetRatio = budgetRatio,
                TasksDone = done,
                TasksTotal = total
            };
        }).ToList();
    }

    /// <summary>Zaman ve bütçe oranlarının kötü olanı durumu belirler.</summary>
    private ProjectHealthState ResolveHealth(decimal? timeRatio, decimal? budgetRatio)
    {
        var worst = new[] { timeRatio, budgetRatio }.Where(r => r.HasValue).Select(r => r!.Value).ToList();
        if (worst.Count == 0) return ProjectHealthState.Healthy;

        var max = worst.Max();
        if (max >= _options.RiskyRatio) return ProjectHealthState.Risky;
        return max >= _options.AttentionRatio ? ProjectHealthState.Attention : ProjectHealthState.Healthy;
    }

    // ─────────────────────────── Onay kuyruğu ───────────────────────────

    /// <summary>
    /// Taslak faturalar. <c>Platform.Invoices</c> yoksa BOŞ liste döner (403 değil) —
    /// dashboard'ın geri kalanı çalışmaya devam etsin, kart boş durumunu çizsin.
    /// </summary>
    public async Task<List<PendingApprovalDto>> GetPendingApprovalsAsync()
    {
        if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Invoices.Default))
        {
            return new List<PendingApprovalDto>();
        }

        var drafts = await ListDraftInvoicesAsync(null);
        var users = await GetUserLabelsAsync(drafts.Select(i => i.CreatorId));

        return drafts.Select(i => new PendingApprovalDto
        {
            Id = i.Id,
            Type = DashboardApprovalType.Invoice,
            Title = i.InvoiceNumber,
            RequesterName = i.CreatorId.HasValue && users.TryGetValue(i.CreatorId.Value, out var u)
                ? u.Name
                : string.Empty,
            Amount = i.TotalAmount,
            Currency = i.Currency,
            AgeHours = (int)Math.Max(0, (Clock.Now - i.CreationTime).TotalHours),
            TargetUrl = $"/Invoices?invoiceId={i.Id}"
        }).ToList();
    }

    // ─────────────────────────── Tıkanan işler ───────────────────────────

    public async Task<List<BlockedTaskDto>> GetBlockedTasksAsync() => await ListBlockedAsync();

    private async Task<List<BlockedTaskDto>> ListBlockedAsync()
    {
        var now = Clock.Now;
        var staleBefore = now.AddDays(-_options.StaleAfterDays);

        var stale = await AsyncExecuter.ToListAsync(
            (await _taskRepo.GetQueryableAsync())
                .Where(t => t.Status != TaskStatusEnum.Done
                            && t.Status != TaskStatusEnum.Cancelled
                            && (t.LastModificationTime ?? t.CreationTime) < staleBefore));

        if (stale.Count == 0) return new List<BlockedTaskDto>();

        var staleIds = stale.Select(t => t.Id).ToList();

        // Bağımlılıklar tek sorguda; hem "benim beklediğim" hem "beni bekleyen" yön.
        var dependencies = await AsyncExecuter.ToListAsync(
            (await _dependencyRepo.GetQueryableAsync())
                .Where(d => staleIds.Contains(d.TaskId) || staleIds.Contains(d.PredecessorTaskId)));

        var openTaskIds = (await AsyncExecuter.ToListAsync(
            (await _taskRepo.GetQueryableAsync())
                .Where(t => t.Status != TaskStatusEnum.Done && t.Status != TaskStatusEnum.Cancelled)
                .Select(t => t.Id))).ToHashSet();

        var result = new List<BlockedTaskDto>();
        foreach (var task in stale)
        {
            var hasOpenPredecessor = dependencies
                .Any(d => d.TaskId == task.Id && openTaskIds.Contains(d.PredecessorTaskId));

            TaskBlockReason? reason =
                task.Status == TaskStatusEnum.InReview ? TaskBlockReason.WaitingReview
                : hasOpenPredecessor ? TaskBlockReason.Dependency
                : !task.AssigneeId.HasValue ? TaskBlockReason.Unassigned
                : null;

            if (reason == null) continue;

            result.Add(new BlockedTaskDto
            {
                TaskId = task.Id,
                Code = $"#{task.Number}",
                Title = task.Title,
                BlockReason = reason.Value,
                IdleDays = (int)(now.Date - (task.LastModificationTime ?? task.CreationTime).Date).TotalDays,
                DependentCount = dependencies
                    .Count(d => d.PredecessorTaskId == task.Id && openTaskIds.Contains(d.TaskId))
            });
        }

        return result
            .OrderByDescending(b => b.IdleDays)
            .Take(_options.MaxListRows)
            .ToList();
    }

    // ─────────────────────────── İstatistikler ───────────────────────────

    public Task<List<DashboardStatDto>> GetStatisticsAsync(DashboardQueryDto input)
        => _statistics.BuildAsync(input);

    // ─────────────────────────── Gelir / gider ───────────────────────────

    public async Task<IncomeExpenseDto> GetIncomeExpenseAsync(DashboardQueryDto input)
    {
        var canSeeIncome = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Incomes.Default);
        var canSeeExpense = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Expenses.Default);

        var dto = new IncomeExpenseDto { Currency = await ResolveCurrencyAsync(input.ProjectId) };
        if (!canSeeIncome && !canSeeExpense) return dto;

        var now = Clock.Now.Date;
        var firstMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, now.Kind)
            .AddMonths(-(_options.IncomeExpenseMonths - 1));

        var incomes = canSeeIncome
            ? await SumByMonthAsync(
                (await _incomeRepo.GetQueryableAsync())
                    .Where(i => i.IncomeDate >= firstMonth
                                && (input.ProjectId == null || i.ProjectId == input.ProjectId))
                    .Select(i => new MonthlyAmount { Date = i.IncomeDate, Amount = i.Amount }))
            : new Dictionary<DateTime, decimal>();

        var expenses = canSeeExpense
            ? await SumByMonthAsync(
                (await _expenseRepo.GetQueryableAsync())
                    .Where(e => e.ExpenseDate >= firstMonth
                                && (input.ProjectId == null || e.ProjectId == input.ProjectId))
                    .Select(e => new MonthlyAmount { Date = e.ExpenseDate, Amount = e.Amount }))
            : new Dictionary<DateTime, decimal>();

        for (var i = 0; i < _options.IncomeExpenseMonths; i++)
        {
            var month = firstMonth.AddMonths(i);
            dto.Points.Add(new IncomeExpensePointDto
            {
                Month = month,
                Income = incomes.TryGetValue(month, out var inc) ? inc : 0m,
                Expense = expenses.TryGetValue(month, out var exp) ? exp : 0m
            });
        }

        dto.Net = dto.Points.Sum(p => p.Income) - dto.Points.Sum(p => p.Expense);
        return dto;
    }

    private sealed class MonthlyAmount
    {
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
    }

    private async Task<Dictionary<DateTime, decimal>> SumByMonthAsync(IQueryable<MonthlyAmount> query)
    {
        var rows = await AsyncExecuter.ToListAsync(
            query.GroupBy(x => new { x.Date.Year, x.Date.Month })
                 .Select(g => new { g.Key.Year, g.Key.Month, Total = g.Sum(x => x.Amount) }));

        return rows.ToDictionary(r => new DateTime(r.Year, r.Month, 1), r => r.Total);
    }

    // ─────────────────────────── Isı takvimi ───────────────────────────

    public async Task<List<DeliveryHeatmapCellDto>> GetDeliveryHeatmapAsync(DashboardQueryDto input)
    {
        var start = DashboardPeriod.StartOfWeek(Clock.Now.Date);
        var end = start.AddDays(_options.HeatmapWeeks * 7);

        var query = (await _taskRepo.GetQueryableAsync())
            .Where(t => t.DueDate != null
                        && t.Status != TaskStatusEnum.Done
                        && t.Status != TaskStatusEnum.Cancelled
                        && t.DueDate!.Value >= start
                        && t.DueDate!.Value < end);

        if (input.ProjectId.HasValue)
        {
            query = query.Where(t => t.ProjectId == input.ProjectId.Value);
        }

        var counts = (await AsyncExecuter.ToListAsync(
                query.GroupBy(t => t.DueDate!.Value.Date)
                     .Select(g => new { Day = g.Key, Count = g.Count() })))
            .ToDictionary(x => x.Day, x => x.Count);

        // Hibe son tarihleri — Platform.Grants yoksa sorgu ATILMAZ, gün sarı boyanmaz.
        var grantDays = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Grants.Default)
            ? await GetGrantDeadlineDaysAsync(start, end)
            : new HashSet<DateTime>();

        var cells = new List<DeliveryHeatmapCellDto>();
        for (var day = start; day < end; day = day.AddDays(1))
        {
            cells.Add(new DeliveryHeatmapCellDto
            {
                Date = day,
                Count = counts.TryGetValue(day, out var c) ? c : 0,
                IsGrantDeadline = grantDays.Contains(day)
            });
        }

        return cells;
    }

    private async Task<HashSet<DateTime>> GetGrantDeadlineDaysAsync(DateTime start, DateTime end)
    {
        var milestoneDays = await AsyncExecuter.ToListAsync(
            (await _milestoneRepo.GetQueryableAsync())
                .Where(m => !m.IsCompleted && m.DueDate != null
                            && m.DueDate!.Value >= start && m.DueDate!.Value < end)
                .Select(m => m.DueDate!.Value.Date));

        var trancheDays = await AsyncExecuter.ToListAsync(
            (await _trancheRepo.GetQueryableAsync())
                .Where(t => t.DueDate != null
                            && t.DueDate!.Value >= start && t.DueDate!.Value < end)
                .Select(t => t.DueDate!.Value.Date));

        return milestoneDays.Concat(trancheDays).ToHashSet();
    }

    // ─────────────────────────── Kart düzeni ───────────────────────────

    public async Task<DashboardLayoutDto> GetLayoutAsync(string viewKey)
    {
        viewKey = NormalizeViewKey(viewKey);
        var userId = CurrentUser.GetId();

        var saved = await _layoutRepo.FindAsync(l => l.UserId == userId && l.ViewKey == viewKey);
        if (saved == null)
        {
            return new DashboardLayoutDto
            {
                ViewKey = viewKey,
                Cards = DashboardDefaultLayouts.For(viewKey),
                IsDefault = true
            };
        }

        return new DashboardLayoutDto
        {
            ViewKey = viewKey,
            Cards = JsonSerializer.Deserialize<List<DashboardCardDto>>(saved.CardsJson) ?? new List<DashboardCardDto>(),
            IsDefault = false
        };
    }

    public async Task SaveLayoutAsync(SaveDashboardLayoutInput input)
    {
        var viewKey = NormalizeViewKey(input.ViewKey);
        var userId = CurrentUser.GetId();

        var json = JsonSerializer.Serialize(input.Cards ?? new List<DashboardCardDto>());
        if (json.Length > DashboardConsts.MaxCardsJsonLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DashboardLayoutTooLarge)
                .WithData("Max", DashboardConsts.MaxCardsJsonLength);
        }

        var existing = await _layoutRepo.FindAsync(l => l.UserId == userId && l.ViewKey == viewKey);
        if (existing == null)
        {
            await _layoutRepo.InsertAsync(
                new DashboardLayout(GuidGenerator.Create(), CurrentTenant.Id, userId, viewKey, json));
            return;
        }

        existing.SetCards(json);
        await _layoutRepo.UpdateAsync(existing);
    }

    public async Task ResetLayoutAsync(string viewKey)
    {
        viewKey = NormalizeViewKey(viewKey);
        var userId = CurrentUser.GetId();

        var existing = await _layoutRepo.FindAsync(l => l.UserId == userId && l.ViewKey == viewKey);
        if (existing != null)
        {
            await _layoutRepo.DeleteAsync(existing);
        }
    }

    private static string NormalizeViewKey(string? viewKey)
    {
        var key = (viewKey ?? string.Empty).Trim().ToLowerInvariant();
        return DashboardDefaultLayouts.IsKnown(key) ? key : DashboardDefaultLayouts.DefaultViewKey;
    }

    // ─────────────────────────── Ortak yardımcılar ───────────────────────────

    private async Task<List<TaskItem>> ListOpenTasksAsync(Guid? projectId)
    {
        var query = (await _taskRepo.GetQueryableAsync())
            .Where(t => t.DueDate != null
                        && t.Status != TaskStatusEnum.Done
                        && t.Status != TaskStatusEnum.Cancelled);

        if (projectId.HasValue)
        {
            query = query.Where(t => t.ProjectId == projectId.Value);
        }

        return await AsyncExecuter.ToListAsync(query);
    }

    private async Task<List<Invoice>> ListDraftInvoicesAsync(Guid? projectId)
    {
        var query = (await _invoiceRepo.GetQueryableAsync())
            .Where(i => i.Status == InvoiceStatus.Draft);

        if (projectId.HasValue)
        {
            query = query.Where(i => i.ProjectId == projectId.Value);
        }

        return await AsyncExecuter.ToListAsync(
            query.OrderBy(i => i.CreationTime).Take(_options.MaxListRows));
    }

    private async Task<(decimal Spent, decimal Total)> GetBudgetTotalsAsync(Guid? projectId)
    {
        var projectQuery = await _projectRepo.GetQueryableAsync();
        if (projectId.HasValue)
        {
            projectQuery = projectQuery.Where(p => p.Id == projectId.Value);
        }

        var total = await AsyncExecuter.SumAsync(projectQuery, p => p.TotalBudget);

        var expenseQuery = (await _expenseRepo.GetQueryableAsync())
            .Where(e => e.ProjectId != null);
        if (projectId.HasValue)
        {
            expenseQuery = expenseQuery.Where(e => e.ProjectId == projectId.Value);
        }

        var spent = await AsyncExecuter.SumAsync(expenseQuery, e => e.Amount);
        return (spent, total);
    }

    private async Task<Dictionary<Guid, decimal>> GetSpentByProjectAsync(List<Guid> projectIds)
    {
        if (projectIds.Count == 0) return new Dictionary<Guid, decimal>();

        var rows = await AsyncExecuter.ToListAsync(
            (await _expenseRepo.GetQueryableAsync())
                .Where(e => e.ProjectId != null && projectIds.Contains(e.ProjectId!.Value))
                .GroupBy(e => e.ProjectId!.Value)
                .Select(g => new { ProjectId = g.Key, Total = g.Sum(x => x.Amount) }));

        return rows.ToDictionary(r => r.ProjectId, r => r.Total);
    }

    private async Task<Dictionary<Guid, string>> GetProjectNamesAsync(IEnumerable<Guid?> projectIds)
    {
        var ids = projectIds.Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();

        var rows = await AsyncExecuter.ToListAsync(
            (await _projectRepo.GetQueryableAsync())
                .Where(p => ids.Contains(p.Id))
                .Select(p => new { p.Id, p.Name }));

        return rows.ToDictionary(r => r.Id, r => r.Name);
    }

    private sealed record UserLabel(string Name, string Initials);

    private async Task<Dictionary<Guid, UserLabel>> GetUserLabelsAsync(IEnumerable<Guid?> userIds)
    {
        var ids = userIds.Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, UserLabel>();

        var rows = await AsyncExecuter.ToListAsync(
            (await _userRepo.GetQueryableAsync())
                .Where(u => ids.Contains(u.Id))
                .Select(u => new { u.Id, u.Name, u.Surname, u.UserName }));

        return rows.ToDictionary(
            r => r.Id,
            r =>
            {
                var full = string.Join(' ', new[] { r.Name, r.Surname }
                    .Where(s => !string.IsNullOrWhiteSpace(s)));
                if (string.IsNullOrWhiteSpace(full)) full = r.UserName;
                return new UserLabel(full, BuildInitials(full));
            });
    }

    private static string BuildInitials(string fullName)
    {
        var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return string.Empty;
        if (parts.Length == 1) return parts[0][..1].ToUpperInvariant();
        return (parts[0][..1] + parts[^1][..1]).ToUpperInvariant();
    }

    /// <summary>Tenant'ın baskın para birimi — en çok projede kullanılan; proje yoksa "TRY".</summary>
    private async Task<string> ResolveCurrencyAsync(Guid? projectId)
    {
        var query = await _projectRepo.GetQueryableAsync();
        if (projectId.HasValue)
        {
            query = query.Where(p => p.Id == projectId.Value);
        }

        var rows = await AsyncExecuter.ToListAsync(
            query.GroupBy(p => p.Currency)
                 .Select(g => new { Currency = g.Key, Count = g.Count() }));

        return rows.OrderByDescending(r => r.Count).Select(r => r.Currency).FirstOrDefault() ?? "TRY";
    }
}
