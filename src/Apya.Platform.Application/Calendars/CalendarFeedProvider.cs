using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Grants;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Apya.Platform.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Settings;
using Volo.Abp.Timing;
using Volo.Abp.Users;
using TaskStatusEnum = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.Calendars;

/// <summary>
/// Takvimin tek veri kaynağı: bir tarih aralığındaki görev, fatura, hibe, gider,
/// gelir ve kasa hareketlerini TEK şekle (<see cref="CalendarItemDto"/>) indirger.
/// <para>
/// KİLİT SÖZLEŞMESİ (DashboardStatisticsProvider ile aynı ray): her kaynak bir izne
/// bağlıdır ve izin yoksa o kaynağın sorgusu HİÇ ATILMAZ — ray satırı
/// <c>IsAvailable=false</c> ile döner, sayaç sızdırmaz.
/// </para>
/// <para>
/// Görev gizliliği (APYA-22) TaskAppService ile AYNI kuralı uygular: gizli görev yalnız
/// oluşturana, atanana veya Projects.ManageTeam yetkisi olana görünür; impersonate
/// oturumu hiçbir gizli görevi göremez. Kural ayrışırsa takvim, listede görünmeyen
/// gizli görevi ele verir.
/// </para>
/// </summary>
public class CalendarFeedProvider : ITransientDependency
{
    /// <summary>Kaynak başına üst sınır — bir ay grid'i 42 gün, bu sınıra dayanmak
    /// veri hatasına işarettir. Dayanılırsa <c>IsTruncated</c> ile bildirilir.</summary>
    public const int MaxItemsPerSource = 500;

    /// <summary>En geniş sorgulanabilir aralık (gün). Yıl görünümü yok; koruma sınırı.</summary>
    public const int MaxRangeDays = 366;

    private readonly IRepository<TaskItem, Guid> _taskRepo;
    private readonly IRepository<Invoice, Guid> _invoiceRepo;
    private readonly IRepository<Expense, Guid> _expenseRepo;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepo;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepo;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepo;
    private readonly IRepository<GrantApplication, Guid> _grantAppRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<Project, Guid> _projectRepo;
    private readonly IRepository<Customer, Guid> _customerRepo;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepo;
    private readonly IRepository<IdentityUser, Guid> _userRepo;

    private readonly IPermissionChecker _permissionChecker;
    private readonly IAsyncQueryableExecuter _executer;
    private readonly ICurrentUser _currentUser;
    private readonly IDataFilter _dataFilter;
    private readonly ISettingProvider _settingProvider;
    private readonly IClock _clock;

    public CalendarFeedProvider(
        IRepository<TaskItem, Guid> taskRepo,
        IRepository<Invoice, Guid> invoiceRepo,
        IRepository<Expense, Guid> expenseRepo,
        IRepository<IncomeEntry, Guid> incomeRepo,
        IRepository<CashMovement, Guid> cashMovementRepo,
        IRepository<GrantMilestone, Guid> milestoneRepo,
        IRepository<GrantApplication, Guid> grantAppRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<Project, Guid> projectRepo,
        IRepository<Customer, Guid> customerRepo,
        IRepository<CashAccount, Guid> cashAccountRepo,
        IRepository<IdentityUser, Guid> userRepo,
        IPermissionChecker permissionChecker,
        IAsyncQueryableExecuter executer,
        ICurrentUser currentUser,
        IDataFilter dataFilter,
        ISettingProvider settingProvider,
        IClock clock)
    {
        _taskRepo          = taskRepo;
        _invoiceRepo       = invoiceRepo;
        _expenseRepo       = expenseRepo;
        _incomeRepo        = incomeRepo;
        _cashMovementRepo  = cashMovementRepo;
        _milestoneRepo     = milestoneRepo;
        _grantAppRepo      = grantAppRepo;
        _callRepo          = callRepo;
        _grantRepo         = grantRepo;
        _projectRepo       = projectRepo;
        _customerRepo      = customerRepo;
        _cashAccountRepo   = cashAccountRepo;
        _userRepo          = userRepo;
        _permissionChecker = permissionChecker;
        _executer          = executer;
        _currentUser       = currentUser;
        _dataFilter        = dataFilter;
        _settingProvider   = settingProvider;
        _clock             = clock;
    }

    /// <summary>Kaynak → gerektirdiği izin. Ray satırı ve kilit kararı bunu kullanır.</summary>
    public static string RequiredPermission(CalendarSourceType source) => source switch
    {
        CalendarSourceType.Task         => PlatformPermissions.Tasks.Default,
        CalendarSourceType.Invoice      => PlatformPermissions.Invoices.Default,
        CalendarSourceType.Grant        => PlatformPermissions.Grants.Default,
        CalendarSourceType.Expense      => PlatformPermissions.Expenses.Default,
        CalendarSourceType.Income       => PlatformPermissions.Incomes.Default,
        CalendarSourceType.CashMovement => PlatformPermissions.CashMovements.Default,
        _ => throw new ArgumentOutOfRangeException(nameof(source))
    };

    public async Task<CalendarFeedDto> BuildAsync(GetCalendarFeedInput input)
    {
        var from = input.From.Date;
        var to   = input.To.Date;
        if (to < from)
        {
            (from, to) = (to, from);
        }
        if ((to - from).TotalDays > MaxRangeDays)
        {
            to = from.AddDays(MaxRangeDays);
        }
        // Bitiş günü DAHİL: yarı açık aralıkla karşılaştırılır ki gün içi saat
        // bileşeni olan kayıtlar (ör. 14:30 girilmiş bir gider) son günde düşmesin.
        var toExclusive = to.AddDays(1);

        var today = _clock.Now.Date;

        var feed = new CalendarFeedDto { From = from, To = to };

        foreach (var source in CalendarSources.Internal)
        {
            var permission = RequiredPermission(source);
            var granted    = await _permissionChecker.IsGrantedAsync(permission);
            var requested  = input.Sources == null || input.Sources.Count == 0 || input.Sources.Contains(source);

            var summary = new CalendarSourceSummaryDto
            {
                Source             = source,
                IsAvailable        = granted,
                RequiredPermission = permission
            };
            feed.Sources.Add(summary);

            // İzin yoksa veya kaynak istenmediyse sorgu ATILMAZ.
            if (!granted || !requested)
            {
                continue;
            }

            var items = source switch
            {
                CalendarSourceType.Task         => await LoadTasksAsync(input, from, toExclusive, today),
                CalendarSourceType.Invoice      => await LoadInvoicesAsync(input, from, toExclusive, today),
                CalendarSourceType.Grant        => await LoadGrantsAsync(from, toExclusive, today),
                CalendarSourceType.Expense      => await LoadExpensesAsync(input, from, toExclusive),
                CalendarSourceType.Income       => await LoadIncomesAsync(input, from, toExclusive),
                CalendarSourceType.CashMovement => await LoadCashMovementsAsync(from, toExclusive),
                _ => new List<CalendarItemDto>()
            };

            summary.Count = items.Count;
            if (items.Count >= MaxItemsPerSource)
            {
                feed.IsTruncated = true;
            }

            feed.Items.AddRange(items);
        }

        feed.Items = feed.Items.OrderBy(i => i.Date).ThenBy(i => i.Source).ThenBy(i => i.Title).ToList();
        feed.DailyCapacityHours = await GetDailyCapacityAsync();

        return feed;
    }

    /// <summary>Günlük kapasite ayarı. "0" / boş = kapasite takibi kapalı → null.</summary>
    private async Task<decimal?> GetDailyCapacityAsync()
    {
        var raw = await _settingProvider.GetOrNullAsync(PlatformSettings.Calendar.DailyCapacityHours);
        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        return decimal.TryParse(raw, System.Globalization.NumberStyles.Number,
                   System.Globalization.CultureInfo.InvariantCulture, out var hours) && hours > 0
            ? hours
            : null;
    }

    /* ── Kaynaklar ─────────────────────────────────────────────────────────── */

    private async Task<List<CalendarItemDto>> LoadTasksAsync(
        GetCalendarFeedInput input, DateTime from, DateTime toExclusive, DateTime today)
    {
        var query = await _taskRepo.GetQueryableAsync();
        query = await ApplyTaskPrivacyFilterAsync(query);

        query = query.Where(t => t.DueDate != null && t.DueDate >= from && t.DueDate < toExclusive);

        if (input.AssigneeId.HasValue)
        {
            query = query.Where(t => t.AssigneeId == input.AssigneeId.Value);
        }
        if (input.ProjectId.HasValue)
        {
            query = query.Where(t => t.ProjectId == input.ProjectId.Value);
        }

        var tasks = await _executer.ToListAsync(query.OrderBy(t => t.DueDate).Take(MaxItemsPerSource));
        if (tasks.Count == 0)
        {
            return new List<CalendarItemDto>();
        }

        var projectNames  = await GetProjectNamesAsync(tasks.Where(t => t.ProjectId.HasValue).Select(t => t.ProjectId!.Value));
        var assigneeNames = await GetUserNamesAsync(tasks.Where(t => t.AssigneeId.HasValue).Select(t => t.AssigneeId!.Value));

        return tasks.Select(t =>
        {
            var isDone = t.Status == TaskStatusEnum.Done;
            var day    = t.DueDate!.Value.Date;
            return new CalendarItemDto
            {
                Key           = $"{(int)CalendarSourceType.Task}:{t.Id}",
                Source        = CalendarSourceType.Task,
                SourceId      = t.Id,
                Title         = t.Title,
                Date          = day,
                IsDone        = isDone,
                Risk          = Risk(day, today, isDone),
                Subtitle      = t.ProjectId.HasValue ? projectNames.GetValueOrDefault(t.ProjectId.Value) : null,
                AssigneeId    = t.AssigneeId,
                AssigneeName  = t.AssigneeId.HasValue ? assigneeNames.GetValueOrDefault(t.AssigneeId.Value) : null,
                // Yük yalnız AÇIK görevlerden toplanır: tamamlanmış işin kalan kapasiteye etkisi yok.
                LoadHours     = isDone ? null : t.EstimatedHours,
                Href          = "/Tasks",
                CanReschedule = true
            };
        }).ToList();
    }

    private async Task<List<CalendarItemDto>> LoadInvoicesAsync(
        GetCalendarFeedInput input, DateTime from, DateTime toExclusive, DateTime today)
    {
        var query = await _invoiceRepo.GetQueryableAsync();
        query = query.Where(i => i.DueDate >= from && i.DueDate < toExclusive
                                 && i.Status != InvoiceStatus.Cancelled);

        if (input.ProjectId.HasValue)
        {
            query = query.Where(i => i.ProjectId == input.ProjectId.Value);
        }

        var invoices = await _executer.ToListAsync(query.OrderBy(i => i.DueDate).Take(MaxItemsPerSource));
        if (invoices.Count == 0)
        {
            return new List<CalendarItemDto>();
        }

        var customerNames = await GetCustomerNamesAsync(invoices.Where(i => i.CustomerId.HasValue).Select(i => i.CustomerId!.Value));

        return invoices.Select(i =>
        {
            var isDone   = i.Status == InvoiceStatus.Paid;
            var day      = i.DueDate.Date;
            var customer = i.CustomerId.HasValue ? customerNames.GetValueOrDefault(i.CustomerId.Value) : null;
            return new CalendarItemDto
            {
                Key           = $"{(int)CalendarSourceType.Invoice}:{i.Id}",
                Source        = CalendarSourceType.Invoice,
                SourceId      = i.Id,
                Title         = string.IsNullOrWhiteSpace(customer) ? i.InvoiceNumber : $"{i.InvoiceNumber} · {customer}",
                Date          = day,
                IsDone        = isDone,
                Risk          = Risk(day, today, isDone),
                Subtitle      = customer,
                Amount        = i.TotalAmount,
                Currency      = i.Currency,
                Href          = "/Invoices",
                // Fatura vadesi muhasebe kaydıdır — takvimden sürüklenerek taşınmaz.
                CanReschedule = false
            };
        }).ToList();
    }

    /// <summary>
    /// Hibe son tarihleri: tamamlanmamış ara raporlar (milestone) + başvurulan
    /// çağrıların kapanış tarihi. Çağrı katalogu HOST'ta tutulur (TenantId null), bu
    /// yüzden çağrı okuması multi-tenant süzgeci kapatılarak yapılır.
    /// </summary>
    private async Task<List<CalendarItemDto>> LoadGrantsAsync(DateTime from, DateTime toExclusive, DateTime today)
    {
        var result = new List<CalendarItemDto>();

        var milestoneQuery = await _milestoneRepo.GetQueryableAsync();
        var milestones = await _executer.ToListAsync(
            milestoneQuery
                .Where(m => !m.IsCompleted && m.DueDate != null
                            && m.DueDate >= from && m.DueDate < toExclusive)
                .OrderBy(m => m.DueDate)
                .Take(MaxItemsPerSource));

        result.AddRange(milestones.Select(m =>
        {
            var day = m.DueDate!.Value.Date;
            return new CalendarItemDto
            {
                Key           = $"{(int)CalendarSourceType.Grant}:{m.Id}",
                Source        = CalendarSourceType.Grant,
                SourceId      = m.Id,
                Title         = m.Title,
                Date          = day,
                IsDone        = false,
                Risk          = Risk(day, today, false),
                Subtitle      = "Ara rapor",
                Href          = "/Grants/Applications",
                CanReschedule = false
            };
        }));

        // Başvurulan çağrıların son başvuru tarihleri.
        var appQuery = await _grantAppRepo.GetQueryableAsync();
        var callIds  = await _executer.ToListAsync(appQuery.Select(a => a.GrantCallId).Distinct());
        if (callIds.Count == 0)
        {
            return result;
        }

        List<GrantCall> calls;
        List<Grant> grants;
        using (_dataFilter.Disable<IMultiTenant>())
        {
            var callQuery = await _callRepo.GetQueryableAsync();
            calls = await _executer.ToListAsync(
                callQuery.Where(c => callIds.Contains(c.Id) && c.Deadline != null
                                     && c.Deadline >= from && c.Deadline < toExclusive)
                         .Take(MaxItemsPerSource));

            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grantQuery = await _grantRepo.GetQueryableAsync();
            grants = grantIds.Count == 0
                ? new List<Grant>()
                : await _executer.ToListAsync(grantQuery.Where(g => grantIds.Contains(g.Id)));
        }

        var grantNames = grants.ToDictionary(g => g.Id, g => g.Name);

        result.AddRange(calls.Select(c =>
        {
            var day = c.Deadline!.Value.Date;
            return new CalendarItemDto
            {
                Key           = $"{(int)CalendarSourceType.Grant}:{c.Id}",
                Source        = CalendarSourceType.Grant,
                SourceId      = c.Id,
                Title         = grantNames.GetValueOrDefault(c.GrantId) ?? c.Period,
                Date          = day,
                IsDone        = false,
                Risk          = Risk(day, today, false),
                Subtitle      = "Son başvuru",
                Href          = "/Grants/Applications",
                CanReschedule = false
            };
        }));

        return result;
    }

    private async Task<List<CalendarItemDto>> LoadExpensesAsync(
        GetCalendarFeedInput input, DateTime from, DateTime toExclusive)
    {
        var query = await _expenseRepo.GetQueryableAsync();
        query = query.Where(e => e.ExpenseDate >= from && e.ExpenseDate < toExclusive);

        if (input.ProjectId.HasValue)
        {
            query = query.Where(e => e.ProjectId == input.ProjectId.Value);
        }

        var expenses = await _executer.ToListAsync(query.OrderBy(e => e.ExpenseDate).Take(MaxItemsPerSource));

        return expenses.Select(e => new CalendarItemDto
        {
            Key           = $"{(int)CalendarSourceType.Expense}:{e.Id}",
            Source        = CalendarSourceType.Expense,
            SourceId      = e.Id,
            Title         = e.Title,
            Date          = e.ExpenseDate.Date,
            // Gider kaydı gerçekleşmiş bir harekettir — "gecikmiş" olamaz.
            IsDone        = true,
            Risk          = CalendarRiskLevel.None,
            Amount        = e.Amount,
            Currency      = e.Currency,
            Href          = "/Expenses",
            CanReschedule = false
        }).ToList();
    }

    private async Task<List<CalendarItemDto>> LoadIncomesAsync(
        GetCalendarFeedInput input, DateTime from, DateTime toExclusive)
    {
        var query = await _incomeRepo.GetQueryableAsync();
        query = query.Where(i => i.IncomeDate >= from && i.IncomeDate < toExclusive);

        if (input.ProjectId.HasValue)
        {
            query = query.Where(i => i.ProjectId == input.ProjectId.Value);
        }

        var incomes = await _executer.ToListAsync(query.OrderBy(i => i.IncomeDate).Take(MaxItemsPerSource));

        return incomes.Select(i => new CalendarItemDto
        {
            Key           = $"{(int)CalendarSourceType.Income}:{i.Id}",
            Source        = CalendarSourceType.Income,
            SourceId      = i.Id,
            Title         = i.Title,
            Date          = i.IncomeDate.Date,
            IsDone        = true,
            Risk          = CalendarRiskLevel.None,
            Amount        = i.Amount,
            Currency      = i.Currency,
            Href          = "/Incomes",
            CanReschedule = false
        }).ToList();
    }

    private async Task<List<CalendarItemDto>> LoadCashMovementsAsync(DateTime from, DateTime toExclusive)
    {
        var query = await _cashMovementRepo.GetQueryableAsync();
        var movements = await _executer.ToListAsync(
            query.Where(m => m.MovementDate >= from && m.MovementDate < toExclusive)
                 .OrderBy(m => m.MovementDate)
                 .Take(MaxItemsPerSource));

        if (movements.Count == 0)
        {
            return new List<CalendarItemDto>();
        }

        var accountIds = movements.Select(m => m.CashAccountId).Distinct().ToList();
        var accountQuery = await _cashAccountRepo.GetQueryableAsync();
        var accounts = await _executer.ToListAsync(accountQuery.Where(a => accountIds.Contains(a.Id)));
        var accountNames = accounts.ToDictionary(a => a.Id, a => a.Name);

        return movements.Select(m => new CalendarItemDto
        {
            Key           = $"{(int)CalendarSourceType.CashMovement}:{m.Id}",
            Source        = CalendarSourceType.CashMovement,
            SourceId      = m.Id,
            Title         = string.IsNullOrWhiteSpace(m.Description)
                                ? (m.Direction == CashMovementDirection.In ? "Kasa girişi" : "Kasa çıkışı")
                                : m.Description!,
            Date          = m.MovementDate.Date,
            IsDone        = true,
            Risk          = CalendarRiskLevel.None,
            Subtitle      = accountNames.GetValueOrDefault(m.CashAccountId),
            Amount        = m.Direction == CashMovementDirection.In ? m.Amount : -m.Amount,
            Href          = "/CashAccounts",
            CanReschedule = false
        }).ToList();
    }

    /* ── Yardımcılar ───────────────────────────────────────────────────────── */

    /// <summary>Gecikmiş / bugün son gün ayrımı. Kapanmış öğe risk taşımaz.</summary>
    private static CalendarRiskLevel Risk(DateTime day, DateTime today, bool isDone)
    {
        if (isDone) return CalendarRiskLevel.None;
        if (day < today) return CalendarRiskLevel.Overdue;
        return day == today ? CalendarRiskLevel.DueToday : CalendarRiskLevel.None;
    }

    /// <summary>
    /// APYA-22 gizlilik süzgeci — TaskAppService.ApplyPrivacyFilterAsync ile AYNI kural.
    /// Değişirse ikisi birlikte değişmeli.
    /// </summary>
    private async Task<IQueryable<TaskItem>> ApplyTaskPrivacyFilterAsync(IQueryable<TaskItem> query)
    {
        var isImpersonated = _currentUser.FindClaim(AbpClaimTypes.ImpersonatorUserId) != null;
        var canManageTeam  = await _permissionChecker.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);
        var currentUserId  = _currentUser.Id;

        return query.Where(t =>
            !t.IsPrivate ||
            (!isImpersonated && (canManageTeam || t.CreatorId == currentUserId || t.AssigneeId == currentUserId))
        );
    }

    private async Task<Dictionary<Guid, string>> GetProjectNamesAsync(IEnumerable<Guid> projectIds)
    {
        var ids = projectIds.Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();

        var query = await _projectRepo.GetQueryableAsync();
        var projects = await _executer.ToListAsync(query.Where(p => ids.Contains(p.Id)));
        return projects.ToDictionary(p => p.Id, p => p.Name);
    }

    private async Task<Dictionary<Guid, string>> GetCustomerNamesAsync(IEnumerable<Guid> customerIds)
    {
        var ids = customerIds.Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();

        var query = await _customerRepo.GetQueryableAsync();
        var customers = await _executer.ToListAsync(query.Where(c => ids.Contains(c.Id)));
        return customers.ToDictionary(c => c.Id, c => c.Name);
    }

    private async Task<Dictionary<Guid, string>> GetUserNamesAsync(IEnumerable<Guid> userIds)
    {
        var ids = userIds.Distinct().ToList();
        if (ids.Count == 0) return new Dictionary<Guid, string>();

        var query = await _userRepo.GetQueryableAsync();
        var users = await _executer.ToListAsync(query.Where(u => ids.Contains(u.Id)));

        return users.ToDictionary(u => u.Id, u =>
        {
            var full = string.Join(" ", new[] { u.Name, u.Surname }.Where(s => !string.IsNullOrWhiteSpace(s)));
            return string.IsNullOrWhiteSpace(full) ? u.UserName : full;
        });
    }
}
