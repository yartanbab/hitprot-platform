using System;
using System.Collections.Generic;
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

namespace Apya.Platform.Incomes;

[Authorize(PlatformPermissions.Incomes.Default)]
public class IncomeEntryAppService :
    CrudAppService<
        IncomeEntry,
        IncomeEntryDto,
        Guid,
        GetIncomeEntriesInput,
        CreateUpdateIncomeEntryDto>,
    IIncomeEntryAppService
{
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ProjectBudgetManager _budgetManager;
    private readonly FxLedgerStamper _fxStamper;
    private readonly CashMovementAmountResolver _cashAmountResolver;

    public IncomeEntryAppService(
        IRepository<IncomeEntry, Guid> repository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        ProjectBudgetManager budgetManager,
        FxLedgerStamper fxStamper,
        CashMovementAmountResolver cashAmountResolver)
        : base(repository)
    {
        _cashMovementRepository = cashMovementRepository;
        _cashAccountRepository = cashAccountRepository;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _budgetManager = budgetManager;
        _fxStamper = fxStamper;
        _cashAmountResolver = cashAmountResolver;
        GetPolicyName = PlatformPermissions.Incomes.Default;
        GetListPolicyName = PlatformPermissions.Incomes.Default;
        CreatePolicyName = PlatformPermissions.Incomes.Create;
        UpdatePolicyName = PlatformPermissions.Incomes.Edit;
        DeletePolicyName = PlatformPermissions.Incomes.Delete;
    }

    protected override async Task<IQueryable<IncomeEntry>> CreateFilteredQueryAsync(GetIncomeEntriesInput input)
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
            query = query.Where(x => x.IncomeDate >= input.FromDate.Value);
        if (input.ToDate.HasValue)
            query = query.Where(x => x.IncomeDate <= input.ToDate.Value);

        return query;
    }

    protected override IQueryable<IncomeEntry> ApplyDefaultSorting(IQueryable<IncomeEntry> query)
        => query.OrderByDescending(x => x.IncomeDate);

    /* --- ÜÇ DEFTER DAMGASI — gerekçe ExpenseAppService'teki notla aynı --- */

    protected override async Task<IncomeEntry> MapToEntityAsync(CreateUpdateIncomeEntryDto createInput)
    {
        var entity = await base.MapToEntityAsync(createInput);
        // Kapsam kuralı damgadan önce — gerekçe ExpenseAppService'teki notta.
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
        return entity;
    }

    protected override async Task MapToEntityAsync(CreateUpdateIncomeEntryDto updateInput, IncomeEntry entity)
    {
        await base.MapToEntityAsync(updateInput, entity);
        await ApplyScopeRuleAsync(entity);
        await ApplyFxStampAsync(entity);
    }

    /* Kapsam tutarlılığı (PR-3a) — gerekçe ExpenseAppService'teki notla aynı:
       TaskId doluysa ProjectId görevden türetilir, istemci değeri yok sayılır. */
    private async Task ApplyScopeRuleAsync(IncomeEntry entity)
    {
        if (entity.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(entity.TaskId.Value); // tenant süzgeçli
            entity.ProjectId = task.ProjectId;
        }
    }

    private async Task ApplyFxStampAsync(IncomeEntry entity)
    {
        // entity.ProjectId: kapsam kuralı projeyi türetmiş olabilir.
        var stamp = await _fxStamper.StampAsync(entity.ProjectId, entity.Currency, entity.Amount, entity.IncomeDate);
        entity.BookAmount = stamp.BookAmount;
        entity.BookRate = stamp.BookRate;
        entity.DonorAmount = stamp.DonorAmount;
        entity.DonorRate = stamp.DonorRate;
        entity.RateLocked = stamp.DonorAmount != null;
    }

    /// <summary>Kalem doğrulaması türetilmiş projeye göre — bkz. ExpenseAppService.</summary>
    private async Task<Guid?> ResolveEffectiveProjectIdAsync(CreateUpdateIncomeEntryDto input)
        => input.TaskId.HasValue
            ? (await _taskRepository.GetAsync(input.TaskId.Value)).ProjectId
            : input.ProjectId;

    /// <summary>
    /// Görevsiz kayıtta proje doğrudan istekten gelir ve hiç okunmuyordu: kayıt başka kiracının
    /// (ya da var olmayan) bir projesini gösterebiliyor, host'un kiracılar üstü bütçe özetinde o
    /// projenin toplamına sayılıyordu. Süzgeçli okuma yabancı projeyi "bulunamadı" sayar.
    /// Güncellemede yalnız DEĞİŞEN proje doğrulanır — projesi silinmiş kayıt düzenlenebilir kalır.
    /// </summary>
    private async Task EnsureProjectIsValidAsync(CreateUpdateIncomeEntryDto input, Guid? currentProjectId)
    {
        if (!input.TaskId.HasValue && input.ProjectId.HasValue && input.ProjectId != currentProjectId)
        {
            await _projectRepository.GetAsync(input.ProjectId.Value);
        }
    }

    public override async Task<IncomeEntryDto> CreateAsync(CreateUpdateIncomeEntryDto input)
    {
        await EnsureProjectIsValidAsync(input, currentProjectId: null);
        // Giderdeki ile aynı koşullu kural; bkz. ExpenseAppService.
        await _budgetManager.EnsureBudgetLineIsValidAsync(
            await ResolveEffectiveProjectIdAsync(input), input.BudgetLineId);

        var dto = await base.CreateAsync(input);

        if (input.CashAccountId.HasValue)
        {
            // FIN-01: Kasa hareketinde para birimi alanı yok; tutar kasanın para biriminde
            // sayılır. Kasasız gelirde çözümleme HİÇ çalışmaz — kur aranmaz, kilit doğmaz.
            var cashAmount = await _cashAmountResolver.ResolveAsync(
                input.CashAccountId.Value, input.Currency, input.Amount, input.IncomeDate);

            await _cashMovementRepository.InsertAsync(new CashMovement(
                GuidGenerator.Create(),
                input.CashAccountId.Value,
                CashMovementDirection.In,
                cashAmount.Amount,
                input.IncomeDate,
                "Gelir: " + input.Title + cashAmount.DescribeRate(input.Currency),
                CashMovementSource.Income,
                dto.Id,
                CurrentTenant.Id), autoSave: true);
        }

        return dto;
    }

    public override async Task<IncomeEntryDto> UpdateAsync(Guid id, CreateUpdateIncomeEntryDto input)
    {
        await EnsureProjectIsValidAsync(input, (await Repository.GetAsync(id)).ProjectId);
        var effectiveProjectId = await ResolveEffectiveProjectIdAsync(input);

        await _budgetManager.EnsureBudgetLineIsValidAsync(effectiveProjectId, input.BudgetLineId);

        // FIN-06: bir dilimin tahsilatına bağlı gelir başka projeye taşınamaz — bağ
        // "aynı projenin geliri" kuralıyla kurulmuştu, taşıma onu sessizce bozardı.
        await _budgetManager.EnsureIncomeEntryCanMoveToProjectAsync(id, effectiveProjectId);

        var dto = await base.UpdateAsync(id, input);

        var linked = await _cashMovementRepository.FirstOrDefaultAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Income);

        if (input.CashAccountId.HasValue)
        {
            var cashAmount = await _cashAmountResolver.ResolveAsync(
                input.CashAccountId.Value, input.Currency, input.Amount, input.IncomeDate);
            var description = "Gelir: " + input.Title + cashAmount.DescribeRate(input.Currency);

            if (linked == null)
            {
                await _cashMovementRepository.InsertAsync(new CashMovement(
                    GuidGenerator.Create(), input.CashAccountId.Value, CashMovementDirection.In,
                    cashAmount.Amount, input.IncomeDate, description,
                    CashMovementSource.Income, id, CurrentTenant.Id), autoSave: true);
            }
            else
            {
                linked.CashAccountId = input.CashAccountId.Value;
                linked.SetAmount(cashAmount.Amount);
                linked.MovementDate = input.IncomeDate;
                linked.Description = description;
                await _cashMovementRepository.UpdateAsync(linked, autoSave: true);
            }
        }
        else if (linked != null)
        {
            await _cashMovementRepository.DeleteAsync(linked);
        }

        return dto;
    }

    public override async Task DeleteAsync(Guid id)
    {
        // FIN-06: kasa hareketine dokunmadan ÖNCE doğrula. Silme reddedilecekse hiçbir
        // şey silinmemiş olmalı (ABP denetimi istisnada da SaveChanges çağırır).
        await _budgetManager.EnsureIncomeEntryCanBeDeletedAsync(id);

        var linked = await _cashMovementRepository.GetListAsync(
            x => x.ReferenceId == id && x.Source == CashMovementSource.Income);
        foreach (var m in linked)
            await _cashMovementRepository.DeleteAsync(m);

        // DOC-08: gelir silinince belge bağları da gider; belgeler silinmez.
        await LinkRepository.DeleteAsync(l => l.IncomeEntryId == id);

        await base.DeleteAsync(id);
    }

    /// <summary>"İlişkiyi değiştir…" — gerekçe ve kurallar ExpenseAppService
    /// .SetScopeAsync ile aynı (granüler uç, çifte yetki, otomatik audit).</summary>
    public async Task<IncomeEntryDto> SetScopeAsync(Guid id, SetIncomeScopeDto input)
    {
        await CheckPolicyAsync(PlatformPermissions.Incomes.Edit);
        await CheckPolicyAsync(PlatformPermissions.Tasks.Edit);

        var income = await Repository.GetAsync(id);
        var oldProjectId = income.ProjectId;

        Guid? newTaskId = null;
        Guid? newProjectId = null; // ikisi de boş = bağımsız
        if (input.TaskId.HasValue)
        {
            var task = await _taskRepository.GetAsync(input.TaskId.Value);
            newTaskId = task.Id;
            newProjectId = task.ProjectId; // türetilir
        }
        else if (input.ProjectId.HasValue)
        {
            await _projectRepository.GetAsync(input.ProjectId.Value);
            newProjectId = input.ProjectId;
        }

        // FIN-06: bir dilimin tahsilatına bağlı gelir başka projeye taşınamaz. Tam güncelleme
        // (UpdateAsync) bunu soruyordu; bu granüler uç sormuyor, aynı taşımayı denetimsiz
        // yapıyordu. Doğrulama DEĞİŞİKLİKTEN önce: reddedilen çağrı hiçbir alanı yazmamalı.
        await _budgetManager.EnsureIncomeEntryCanMoveToProjectAsync(id, newProjectId);

        income.TaskId = newTaskId;
        income.ProjectId = newProjectId;

        if (income.ProjectId != oldProjectId)
        {
            income.BudgetLineId = null;          // kalem projeye özgü
            await ApplyFxStampAsync(income);     // donör defteri yeni projeye göre
        }

        await Repository.UpdateAsync(income, autoSave: true);
        return await MapToGetOutputDtoAsync(income);
    }

    /* --- DOC-08 · Gelire belge bağlama ---------------------------------------------------- */

    private IRepository<Apya.Platform.Documents.DocumentIncomeLink, Guid> LinkRepository
        => LazyServiceProvider.LazyGetRequiredService<IRepository<Apya.Platform.Documents.DocumentIncomeLink, Guid>>();

    private IRepository<Apya.Platform.Documents.DocumentFile, Guid> DocumentFileRepository
        => LazyServiceProvider.LazyGetRequiredService<IRepository<Apya.Platform.Documents.DocumentFile, Guid>>();

    public async Task<List<IncomeDocumentOptionDto>> GetDocumentOptionsAsync(Guid id)
    {
        await CheckPolicyAsync(PlatformPermissions.Incomes.Edit);
        await CheckPolicyAsync(PlatformPermissions.Documents.Default);

        var income = await Repository.GetAsync(id);
        if (!income.ProjectId.HasValue)
        {
            return new List<IncomeDocumentOptionDto>();
        }

        var linkedIds = (await LinkRepository.GetListAsync(l => l.IncomeEntryId == id))
            .Select(l => l.DocumentFileId).ToList();
        var projectId = income.ProjectId.Value;

        var files = await AsyncExecuter.ToListAsync(
            (await DocumentFileRepository.GetQueryableAsync())
                .Where(f => f.ProjectId == projectId && !linkedIds.Contains(f.Id))
                .OrderBy(f => f.DisplayName)
                .Select(f => new IncomeDocumentOptionDto { DocumentFileId = f.Id, Name = f.DisplayName }));
        return files;
    }

    public async Task<List<IncomeDocumentOptionDto>> GetLinkedDocumentsAsync(Guid id)
    {
        await CheckPolicyAsync(PlatformPermissions.Documents.Default);
        await Repository.GetAsync(id);

        var linkQ = await LinkRepository.GetQueryableAsync();
        var fileQ = await DocumentFileRepository.GetQueryableAsync();
        return await AsyncExecuter.ToListAsync(
            from l in linkQ
            join f in fileQ on l.DocumentFileId equals f.Id
            where l.IncomeEntryId == id
            orderby f.DisplayName
            select new IncomeDocumentOptionDto { DocumentFileId = f.Id, Name = f.DisplayName });
    }

    public async Task LinkDocumentAsync(Guid id, Guid documentFileId)
    {
        await CheckPolicyAsync(PlatformPermissions.Incomes.Edit);
        await CheckPolicyAsync(PlatformPermissions.Documents.Default);

        // İkisi de kiracı süzgeçli okunur: başka kiracının geliri ya da belgesi "bulunamadı".
        var income = await Repository.GetAsync(id);
        var file = await DocumentFileRepository.GetAsync(documentFileId);

        // Belge başka bir projeye aitse bağ, o projenin dosyasını bu projenin tahsilatına iliştirirdi.
        if (file.ProjectId.HasValue && file.ProjectId != income.ProjectId)
        {
            throw new Volo.Abp.BusinessException(PlatformDomainErrorCodes.IncomeDocumentProjectMismatch);
        }

        if (await LinkRepository.AnyAsync(l => l.IncomeEntryId == id && l.DocumentFileId == documentFileId))
        {
            return;
        }

        await LinkRepository.InsertAsync(
            new Apya.Platform.Documents.DocumentIncomeLink(GuidGenerator.Create(), income.TenantId, documentFileId, id),
            autoSave: true);
    }

    public async Task UnlinkDocumentAsync(Guid id, Guid documentFileId)
    {
        await CheckPolicyAsync(PlatformPermissions.Incomes.Edit);
        await Repository.GetAsync(id);

        await LinkRepository.DeleteAsync(
            l => l.IncomeEntryId == id && l.DocumentFileId == documentFileId, autoSave: true);
    }

    public async Task<ListResultDto<CashAccountLookupDto>> GetCashAccountLookupAsync()
    {
        var q = await _cashAccountRepository.GetQueryableAsync();
        var accounts = await AsyncExecuter.ToListAsync(q
            .Where(a => a.IsActive)
            .OrderBy(a => a.Name)
            .Select(a => new CashAccountLookupDto { Id = a.Id, Name = a.Name, Currency = a.Currency }));
        return new ListResultDto<CashAccountLookupDto>(accounts);
    }

    public override async Task<PagedResultDto<IncomeEntryDto>> GetListAsync(GetIncomeEntriesInput input)
    {
        var result = await base.GetListAsync(input);

        // DOC-08 · Bağlı belgeler yalnız DÖNEN satırlar için ve yalnız belge izni olana okunur
        // (gider satırındaki kalıpla aynı — bkz. ExpenseAppService.GetListAsync).
        var incomeIds = result.Items.Select(x => x.Id).ToList();
        if (incomeIds.Count > 0
            && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Default))
        {
            var linkQ = await LinkRepository.GetQueryableAsync();
            var fileQ = await DocumentFileRepository.GetQueryableAsync();
            var documents = await AsyncExecuter.ToListAsync(
                from l in linkQ
                join f in fileQ on l.DocumentFileId equals f.Id
                where incomeIds.Contains(l.IncomeEntryId) && f.LatestAttachmentId != null
                orderby l.CreationTime, l.Id
                select new { l.IncomeEntryId, AttachmentId = f.LatestAttachmentId!.Value, f.DisplayName });

            var byIncome = documents.ToLookup(d => d.IncomeEntryId);
            foreach (var dto in result.Items)
            {
                dto.Documents = byIncome[dto.Id]
                    .Select(d => new Apya.Platform.ProjectBudgets.Dtos.ProjectExpenseDocumentDto
                    {
                        AttachmentId = d.AttachmentId,
                        Name = d.DisplayName,
                        DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + d.AttachmentId
                    })
                    .ToList();
            }
        }

        var accountIds = result.Items
            .Where(x => x.CashAccountId.HasValue)
            .Select(x => x.CashAccountId!.Value).Distinct().ToList();
        if (accountIds.Count > 0)
        {
            var accounts = await _cashAccountRepository.GetListAsync(a => accountIds.Contains(a.Id));
            var nameMap = accounts.ToDictionary(a => a.Id, a => a.Name);
            foreach (var dto in result.Items)
                if (dto.CashAccountId.HasValue && nameMap.TryGetValue(dto.CashAccountId.Value, out var name))
                    dto.CashAccountName = name;
        }

        return result;
    }
}
