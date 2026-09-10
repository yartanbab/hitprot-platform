using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Expenses;

[Authorize(PlatformPermissions.Expenses.Default)]
public class ExpenseAppService :
    CrudAppService<
        Expense,
        ExpenseDto,
        Guid,
        GetExpensesInput,
        CreateUpdateExpenseDto>,
    IExpenseAppService
{
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ProjectBudgetManager _budgetManager;
    private readonly FxLedgerStamper _fxStamper;

    public ExpenseAppService(
        IRepository<Expense, Guid> repository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        ProjectBudgetManager budgetManager,
        FxLedgerStamper fxStamper)
        : base(repository)
    {
        _cashMovementRepository = cashMovementRepository;
        _cashAccountRepository = cashAccountRepository;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _budgetManager = budgetManager;
        _fxStamper = fxStamper;
        GetPolicyName = PlatformPermissions.Expenses.Default;
        GetListPolicyName = PlatformPermissions.Expenses.Default;
        CreatePolicyName = PlatformPermissions.Expenses.Create;
        UpdatePolicyName = PlatformPermissions.Expenses.Edit;
        DeletePolicyName = PlatformPermissions.Expenses.Delete;
    }

    protected override async Task<IQueryable<Expense>> CreateFilteredQueryAsync(GetExpensesInput input)
    {
        var query = await ReadOnlyRepository.GetQueryableAsync();

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var f = input.Filter.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(f)
                || (x.Description != null && x.Description.ToLower().Contains(f)));
        }
        if (input.Category.HasValue)
            query = query.Where(x => x.Category == input.Category.Value);
        if (input.CashAccountId.HasValue)
            query = query.Where(x => x.CashAccountId == input.CashAccountId.Value);
        if (input.ProjectId.HasValue)
            query = query.Where(x => x.ProjectId == input.ProjectId.Value);
        if (input.TaskId.HasValue)
            query = query.Where(x => x.TaskId == input.TaskId.Value);
        if (input.CustomerId.HasValue)
            query = query.Where(x => x.CustomerId == input.CustomerId.Value);
        if (input.FromDate.HasValue)
            query = query.Where(x => x.ExpenseDate >= input.FromDate.Value);
        if (input.ToDate.HasValue)
            query = query.Where(x => x.ExpenseDate <= input.ToDate.Value);

        return query;
    }

    protected override IQueryable<Expense> ApplyDefaultSorting(IQueryable<Expense> query)
    {
        return query.OrderByDescending(x => x.ExpenseDate);
    }

    /* --- ÜÇ DEFTER DAMGASI ---
       Kaydın ₺ ve donör karşılığı, entity DB'ye gitmeden ÖNCE yazılır. Ayrı bir
       "kaydet sonra güncelle" turu yapılmıyor: iki yazma arasında kalan kayıt,
       raporlarda bir an için ₺ defterde 0 görünürdü.

       GÜNCELLEMEDE DE YENİDEN DAMGALANIR. "Kilit" politika değişiminden korur,
       kaydın kendisinin değişmesinden değil: tutarı ya da tarihi değiştirilen bir
       kaydın eski donör karşılığını korumak, sessizce yanlış rakam üretirdi. */

    protected override async Task<Expense> MapToEntityAsync(CreateUpdateExpenseDto createInput)
    {
        var entity = await base.MapToEntityAsync(createInput);
        // Kapsam kuralı DAMGADAN ÖNCE: donör defteri, türetilmiş projenin
        // para birimine göre basılmalı.
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
        return entity;
    }

    protected override async Task MapToEntityAsync(CreateUpdateExpenseDto updateInput, Expense entity)
    {
        await base.MapToEntityAsync(updateInput, entity);
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
    }

    /* --- KAPSAM TUTARLILIĞI (birleşik sekme sistemi PR-3a) ---
       TaskId dolu kayıtta ProjectId GÖREVDEN türetilir; istemcinin gönderdiği
       değer yok sayılır. Aksi halde "görev A projesinde, harcaması B projesinin
       bütçesinde" gibi ikili kayıt oluşur ve proje toplamları görev kırılımıyla
       çelişirdi. Görev projesizse harcama da projesiz kalır (Genel gider).
       İkisi de boş = bağımsız kayıt; hiçbir proje bütçesine sayılmaz. */
    private async Task ApplyScopeRuleAsync(Expense entity)
    {
        if (entity.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(entity.TaskId.Value); // tenant süzgeçli
            entity.ProjectId = task.ProjectId;
        }
    }

    private async Task ApplyFxStampAsync(Expense entity)
    {
        // entity.ProjectId kullanılır (girdi değil): kapsam kuralı projeyi
        // türetmiş olabilir, damga gerçek projeye göre basılmalı.
        var stamp = await _fxStamper.StampAsync(entity.ProjectId, entity.Currency, entity.Amount, entity.ExpenseDate);
        entity.BookAmount = stamp.BookAmount;
        entity.BookRate = stamp.BookRate;
        entity.DonorAmount = stamp.DonorAmount;
        entity.DonorRate = stamp.DonorRate;
        // Kur bulunamadıysa kilitlemiyoruz: kilit "bu rakam kesinleşti" demek,
        // boş bir donör karşılığı kesinleşmiş sayılmaz.
        entity.RateLocked = stamp.DonorAmount != null;
    }

    /// <summary>Kalem doğrulaması türetilmiş projeye göre yapılır — TaskId dolu
    /// girdide istemcinin ProjectId'si bağlayıcı değildir (kapsam kuralı).</summary>
    private async Task<Guid?> ResolveEffectiveProjectIdAsync(CreateUpdateExpenseDto input)
        => input.TaskId.HasValue
            ? (await _taskRepository.GetAsync(input.TaskId.Value)).ProjectId
            : input.ProjectId;

    public override async Task<ExpenseDto> CreateAsync(CreateUpdateExpenseDto input)
    {
        // Kalem kuralı DTO attribute'uyla ifade edilemez (projeye bağlı koşullu
        // zorunluluk) — kaydetmeden önce burada doğrulanır.
        await _budgetManager.EnsureBudgetLineIsValidAsync(
            await ResolveEffectiveProjectIdAsync(input), input.BudgetLineId);

        var dto = await base.CreateAsync(input);

        // Otomatik kasa çıkış hareketi
        await _cashMovementRepository.InsertAsync(new CashMovement(
            GuidGenerator.Create(),
            input.CashAccountId,
            CashMovementDirection.Out,
            input.Amount,
            input.ExpenseDate,
            "Gider: " + input.Title,
            CashMovementSource.Expense,
            dto.Id,
            CurrentTenant.Id), autoSave: true);

        return dto;
    }

    public override async Task<ExpenseDto> UpdateAsync(Guid id, CreateUpdateExpenseDto input)
    {
        await _budgetManager.EnsureBudgetLineIsValidAsync(
            await ResolveEffectiveProjectIdAsync(input), input.BudgetLineId);

        var dto = await base.UpdateAsync(id, input);

        // Bağlı kasa hareketini senkronla
        var linked = await _cashMovementRepository.FirstOrDefaultAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Expense);
        if (linked != null)
        {
            linked.CashAccountId = input.CashAccountId;
            linked.SetAmount(input.Amount);
            linked.MovementDate = input.ExpenseDate;
            linked.Description = "Gider: " + input.Title;
            await _cashMovementRepository.UpdateAsync(linked, autoSave: true);
        }

        return dto;
    }

    public override async Task DeleteAsync(Guid id)
    {
        // ARCH-014: Önceki kod tüm linked CashMovement'leri belleğe yüklüyor sonra
        // foreach ile siliyor. Predicate overload'u tek aksiyonda halleder; audit
        // history korunur (change tracker üzerinden, DeleteDirectAsync DEĞİL).
        await _cashMovementRepository.DeleteAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Expense);

        await base.DeleteAsync(id);
    }

    /// <summary>
    /// "İlişkiyi değiştir…" — kaydın kapsamını taşır (görev / yalnız proje /
    /// bağımsız). Tam-DTO UpdateAsync yerine granüler uç: round-trip'te düşen
    /// bir alan kaydı sessizce silerdi (bkz. görev-form DTO tuzağı) ve taşıma
    /// tutar/kasa alanlarına hiç dokunmamalı.
    ///
    /// Yetki (handoff matrisi): taşıma bütçe toplamlarını değiştirir → finans
    /// yetkisi (Expenses.Edit) TEK BAŞINA yetmez, Tasks.Edit de aranır.
    /// Audit: değişiklik change-tracker'dan geçer; Expense entity-history
    /// seçicisinde olduğundan eski/yeni değerler otomatik audit'e düşer.
    /// </summary>
    public async Task<ExpenseDto> SetScopeAsync(Guid id, SetExpenseScopeDto input)
    {
        await CheckPolicyAsync(PlatformPermissions.Expenses.Edit);
        await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);

        var expense = await Repository.GetAsync(id);
        var oldProjectId = expense.ProjectId;

        if (input.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(input.TaskId.Value); // varlık + tenant
            expense.TaskId = task.Id;
            expense.ProjectId = task.ProjectId; // türetilir — girdideki ProjectId yok sayılır
        }
        else if (input.ProjectId.HasValue)
        {
            await _projectRepository.GetAsync(input.ProjectId.Value); // varlık + tenant
            expense.TaskId = null;
            expense.ProjectId = input.ProjectId;
        }
        else
        {
            expense.TaskId = null;
            expense.ProjectId = null; // bağımsız → Genel gider havuzu
        }

        if (expense.ProjectId != oldProjectId)
        {
            // Bütçe kalemi projeye özgü: kayıt başka projeye (ya da havuza)
            // taşınınca eski kalem bağı geçersizleşir. Sessizce yanlış kaleme
            // yazmaktansa bağ düşürülür; kullanıcı yeni kalemi panelden seçer.
            expense.BudgetLineId = null;

            // Donör defteri projeye bağlı — taşınan kayıt yeni projenin
            // parasına göre yeniden damgalanır (güncellemedeki kuralla aynı).
            await ApplyFxStampAsync(expense);
        }

        await Repository.UpdateAsync(expense, autoSave: true);
        return await MapToGetOutputDtoAsync(expense);
    }

    /// <summary>
    /// /Tasks Finans paneli (PR-3b, tasarım 2b/3c). İki sorgu: (1) ara
    /// toplamlar DB'de GROUP BY (proje × para birimi) — kabul kriteri:
    /// istemcide toplama yok; (2) satırlar en yeni RowLimit kayıt, görev
    /// başlığı GİZLİLİK süzgeçli left join'den. Grupta görünen satır sayısı
    /// TotalCount'tan az olabilir; toplamlar yine tüm kümedendir.
    /// Genel gider (ProjectId boş) ayrı grup ve EN SONDA.
    /// </summary>
    public async Task<ExpenseProjectGroupsDto> GetProjectGroupedAsync(GetExpensesInput input)
    {
        const int RowLimit = 500;

        var query = await CreateFilteredQueryAsync(input);

        var totals = await AsyncExecuter.ToListAsync(
            query.GroupBy(e => new { e.ProjectId, e.Currency })
                 .Select(g => new
                 {
                     g.Key.ProjectId,
                     g.Key.Currency,
                     Total = g.Sum(x => x.Amount),
                     Count = g.Count()
                 }));

        bool isImpersonated = CurrentUser.FindClaim(Volo.Abp.Security.Claims.AbpClaimTypes.ImpersonatorUserId) != null;
        bool canManageTeam = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageTeam);
        var taskQuery = Apya.Platform.Tasks.TaskPrivacyQueryFilter.Apply(
            await _taskRepository.GetQueryableAsync(), isImpersonated, canManageTeam, CurrentUser.Id);

        var rows = await AsyncExecuter.ToListAsync(
            (from e in query
             join t in taskQuery on e.TaskId equals (Guid?)t.Id into tt
             from t in tt.DefaultIfEmpty()
             orderby e.ExpenseDate descending
             select new
             {
                 e.Id, e.Title, e.Amount, e.Currency, e.ExpenseDate, e.Category,
                 e.ProjectId, e.TaskId,
                 TaskTitle = t != null ? t.Title : null
             }).Take(RowLimit));

        var projectIds = totals.Where(x => x.ProjectId.HasValue)
            .Select(x => x.ProjectId!.Value).Distinct().ToList();
        var projects = projectIds.Count > 0
            ? await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id))
            : new System.Collections.Generic.List<Project>();
        var projectMap = projects.ToDictionary(p => p.Id);

        var rowsByProject = rows.GroupBy(r => r.ProjectId)
            .ToDictionary(g => g.Key ?? Guid.Empty, g => g.ToList());

        ExpenseProjectGroupDto BuildGroup(Guid? projectId, string name, string? code)
        {
            var groupTotals = totals.Where(x => x.ProjectId == projectId).ToList();
            return new ExpenseProjectGroupDto
            {
                ProjectId = projectId,
                ProjectName = name,
                ProjectCode = code,
                TotalCount = groupTotals.Sum(x => x.Count),
                Totals = groupTotals
                    .GroupBy(x => x.Currency)
                    .Select(g => new ExpenseCurrencyTotalDto
                    {
                        Currency = g.Key,
                        Total = g.Sum(x => x.Total),
                        Count = g.Sum(x => x.Count)
                    })
                    .OrderBy(x => x.Currency)
                    .ToList(),
                Rows = rowsByProject.TryGetValue(projectId ?? Guid.Empty, out var list)
                    ? list.Select(r => new ExpenseGroupRowDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Amount = r.Amount,
                        Currency = r.Currency,
                        ExpenseDate = r.ExpenseDate,
                        Category = r.Category,
                        TaskId = r.TaskId,
                        TaskTitle = r.TaskTitle
                    }).ToList()
                    : new System.Collections.Generic.List<ExpenseGroupRowDto>()
            };
        }

        var groups = projectMap.Values
            .OrderBy(p => p.Name)
            .Select(p => BuildGroup(p.Id, p.Name, p.Code))
            .ToList();

        // Genel gider EN SONDA (README toplama kuralı: "Bağımsız grubu en altta").
        if (totals.Any(x => x.ProjectId == null))
        {
            groups.Add(BuildGroup(null, "Genel gider", null));
        }

        return new ExpenseProjectGroupsDto
        {
            Groups = groups,
            GrandTotals = totals
                .GroupBy(x => x.Currency)
                .Select(g => new ExpenseCurrencyTotalDto
                {
                    Currency = g.Key,
                    Total = g.Sum(x => x.Total),
                    Count = g.Sum(x => x.Count)
                })
                .OrderBy(x => x.Currency)
                .ToList(),
            RowsTruncated = rows.Count >= RowLimit
        };
    }

    public override async Task<PagedResultDto<ExpenseDto>> GetListAsync(GetExpensesInput input)
    {
        var result = await base.GetListAsync(input);

        var accountIds = result.Items.Select(x => x.CashAccountId).Distinct().ToList();
        if (accountIds.Count > 0)
        {
            var accounts = await _cashAccountRepository.GetListAsync(a => accountIds.Contains(a.Id));
            var nameMap = accounts.ToDictionary(a => a.Id, a => a.Name);
            foreach (var dto in result.Items)
                if (nameMap.TryGetValue(dto.CashAccountId, out var name))
                    dto.CashAccountName = name;
        }

        return result;
    }
}
