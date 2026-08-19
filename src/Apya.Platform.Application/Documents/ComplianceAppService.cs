using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Kurum uygunluğu.
///
/// TASARIM: kontrol listesi satırlarının durumu VERİTABANINDA TUTULMAZ; her okumada
/// belgelerden hesaplanır. Materyalize edilmiş bir "durum" tablosu, belge yüklendiğinde
/// veya silindiğinde bayatlayan ikinci bir gerçeklik kaynağı olurdu ve yüzdeler
/// sessizce yanlışa kayardı. Veritabanı yalnızca veriden TÜRETİLEMEYEN kullanıcı
/// kararlarını tutar (feragat + elle bağlama → <see cref="ComplianceItemState"/>).
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ComplianceAppService : ApplicationService, IComplianceAppService
{
    private readonly IRepository<CompliancePackage, Guid> _packageRepository;
    private readonly IRepository<ComplianceRequirement, Guid> _requirementRepository;
    private readonly IRepository<ComplianceAssignment, Guid> _assignmentRepository;
    private readonly IRepository<ComplianceItemState, Guid> _stateRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public ComplianceAppService(
        IRepository<CompliancePackage, Guid> packageRepository,
        IRepository<ComplianceRequirement, Guid> requirementRepository,
        IRepository<ComplianceAssignment, Guid> assignmentRepository,
        IRepository<ComplianceItemState, Guid> stateRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<Project, Guid> projectRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _packageRepository = packageRepository;
        _requirementRepository = requirementRepository;
        _assignmentRepository = assignmentRepository;
        _stateRepository = stateRepository;
        _fileRepository = fileRepository;
        _typeRepository = typeRepository;
        _workStepRepository = workStepRepository;
        _projectRepository = projectRepository;
        _mtFilter = mtFilter;
    }

    public virtual async Task<List<CompliancePackageDto>> GetPackagesAsync(Guid? projectId = null)
    {
        var packages = await GetVisiblePackagesAsync();

        if (packages.Count == 0)
        {
            return new List<CompliancePackageDto>();
        }

        var packageIds = packages.Select(p => p.Id).ToList();

        var counts = (await GetRequirementsAsync(packageIds))
            .GroupBy(r => r.PackageId)
            .ToDictionary(g => g.Key, g => g.Count());

        var appliedIds = new HashSet<Guid>();
        if (projectId.HasValue)
        {
            var assignments = await _assignmentRepository.GetListAsync(a => a.ProjectId == projectId.Value);
            appliedIds = assignments.Select(a => a.PackageId).ToHashSet();
        }

        return packages.Select(p => new CompliancePackageDto
        {
            Id = p.Id,
            TenantId = p.TenantId,
            Name = p.Name,
            Issuer = p.Issuer,
            Code = p.Code,
            Description = p.Description,
            IsSystem = p.IsSystem,
            RequirementCount = counts.TryGetValue(p.Id, out var count) ? count : 0,
            IsApplied = appliedIds.Contains(p.Id),
        }).ToList();
    }

    public virtual async Task<ComplianceOverviewDto> GetOverviewAsync(Guid projectId, string? periodCode = null)
    {
        await _projectRepository.GetAsync(projectId);

        var assignments = (await _assignmentRepository.GetListAsync(a => a.ProjectId == projectId))
            .OrderBy(a => a.CreationTime)
            .ToList();

        var overview = new ComplianceOverviewDto();

        if (assignments.Count == 0)
        {
            return overview;
        }

        // Ortak veri tek seferde okunur; paket başına tekrar sorgu açılmaz.
        var workSteps = (await _workStepRepository.GetListAsync(s => s.ProjectId == projectId))
            .OrderBy(s => s.Order)
            .Select(s => (s.Id, s.Name, s.Order))
            .ToList();

        // Taslak belge kalemi karşılamaz — henüz kesinleşmemiş bir dosyayla
        // "uygunuz" demek teslim anında sürpriz üretirdi.
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var documents = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => f.ProjectId == projectId && f.Status != DocumentFileStatus.Draft)
                .Select(f => new ComplianceDocument(
                    f.Id, f.DisplayName, f.DocumentTypeId, f.WorkStepId, f.PeriodCode)));

        var packages = (await GetVisiblePackagesAsync())
            .Where(p => assignments.Any(a => a.PackageId == p.Id))
            .ToDictionary(p => p.Id);

        var packageIds = assignments.Select(a => a.PackageId).Distinct().ToList();
        var requirements = await GetRequirementsAsync(packageIds);

        var typeIds = requirements.Where(r => r.DocumentTypeId.HasValue)
            .Select(r => r.DocumentTypeId!.Value).Distinct().ToList();
        var typeNames = await GetTypeNamesAsync(typeIds);

        var assignmentIds = assignments.Select(a => a.Id).ToList();
        var states = await _stateRepository.GetListAsync(s => assignmentIds.Contains(s.AssignmentId));

        foreach (var assignment in assignments)
        {
            var package = packages.GetValueOrDefault(assignment.PackageId);
            if (package == null)
            {
                continue; // paket silinmiş/görünmez — sessizce atla
            }

            var effectivePeriod = string.IsNullOrWhiteSpace(periodCode) ? assignment.PeriodCode : periodCode.Trim();

            var checklist = BuildChecklist(
                assignment, package, effectivePeriod,
                requirements.Where(r => r.PackageId == assignment.PackageId).ToList(),
                workSteps, documents,
                states.Where(s => s.AssignmentId == assignment.Id).ToList(),
                typeNames);

            overview.Checklists.Add(checklist);
        }

        overview.Summary = CombineDtos(overview.Checklists.Select(c => c.Summary));
        return overview;
    }

    [Authorize(PlatformPermissions.Documents.ManageCompliance)]
    public virtual async Task<ComplianceChecklistDto> ApplyPackageAsync(ApplyCompliancePackageDto input)
    {
        await _projectRepository.GetAsync(input.ProjectId);
        await EnsurePackageVisibleAsync(input.PackageId);

        var period = string.IsNullOrWhiteSpace(input.PeriodCode) ? null : input.PeriodCode.Trim();

        var existing = await _assignmentRepository.FindAsync(a =>
            a.ProjectId == input.ProjectId && a.PackageId == input.PackageId && a.PeriodCode == period);

        if (existing != null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.CompliancePackageAlreadyApplied)
                .WithData("PackageId", input.PackageId)
                .WithData("ProjectId", input.ProjectId);
        }

        var assignment = new ComplianceAssignment(
            GuidGenerator.Create(), CurrentTenant.Id, input.ProjectId, input.PackageId, period);

        await _assignmentRepository.InsertAsync(assignment, autoSave: true);

        var overview = await GetOverviewAsync(input.ProjectId, period);
        return overview.Checklists.First(c => c.AssignmentId == assignment.Id);
    }

    [Authorize(PlatformPermissions.Documents.ManageCompliance)]
    public virtual async Task RemoveAssignmentAsync(Guid assignmentId)
    {
        var assignment = await _assignmentRepository.GetAsync(assignmentId);

        var states = await _stateRepository.GetListAsync(s => s.AssignmentId == assignmentId);
        if (states.Count > 0)
        {
            await _stateRepository.DeleteManyAsync(states);
        }

        await _assignmentRepository.DeleteAsync(assignment);
    }

    [Authorize(PlatformPermissions.Documents.ManageCompliance)]
    public virtual async Task<ComplianceItemDto> WaiveItemAsync(WaiveComplianceItemDto input)
    {
        var state = await GetOrCreateStateAsync(input.AssignmentId, input.RequirementId, input.WorkStepId, input.PeriodCode);

        if (input.Waive)
        {
            state.Waive(input.Reason ?? string.Empty);
        }
        else
        {
            state.RemoveWaiver();
        }

        await PersistStateAsync(state);
        return await BuildSingleItemAsync(input.AssignmentId, input.RequirementId, input.WorkStepId, input.PeriodCode);
    }

    [Authorize(PlatformPermissions.Documents.ManageCompliance)]
    public virtual async Task<ComplianceItemDto> LinkDocumentAsync(LinkComplianceDocumentDto input)
    {
        if (input.DocumentFileId.HasValue)
        {
            // Belge bu kiracıda görülebiliyor mu — yoksa EntityNotFoundException.
            await _fileRepository.GetAsync(input.DocumentFileId.Value);
        }

        var state = await GetOrCreateStateAsync(input.AssignmentId, input.RequirementId, input.WorkStepId, input.PeriodCode);
        state.LinkDocument(input.DocumentFileId);

        await PersistStateAsync(state);
        return await BuildSingleItemAsync(input.AssignmentId, input.RequirementId, input.WorkStepId, input.PeriodCode);
    }

    /* ─────────────────────────── Hesap çekirdeği ─────────────────────────── */

    /// <summary>
    /// Hesabın kendisi <see cref="ComplianceCalculator"/>'dadır (Domain, saf fonksiyon).
    /// Burada yalnızca sonuçlar DTO'ya çevrilir ve tip adları eklenir.
    /// </summary>
    private static ComplianceChecklistDto BuildChecklist(
        ComplianceAssignment assignment,
        CompliancePackage package,
        string? effectivePeriod,
        List<ComplianceRequirement> requirements,
        List<(Guid Id, string Name, int Order)> workSteps,
        List<ComplianceDocument> documents,
        List<ComplianceItemState> states,
        Dictionary<Guid, string> typeNames)
    {
        var evaluations = ComplianceCalculator.Evaluate(
            requirements, workSteps, documents, states, effectivePeriod);

        var summary = ComplianceCalculator.Summarize(evaluations);

        return new ComplianceChecklistDto
        {
            AssignmentId = assignment.Id,
            PackageId = package.Id,
            PackageName = package.Name,
            Issuer = package.Issuer,
            PeriodCode = effectivePeriod,
            Items = evaluations.Select(e => new ComplianceItemDto
            {
                RequirementId = e.Requirement.Id,
                Title = e.Requirement.Title,
                Scope = e.Requirement.Scope,
                IsBlocking = e.Requirement.IsBlocking,
                DocumentTypeId = e.Requirement.DocumentTypeId,
                DocumentTypeName = e.Requirement.DocumentTypeId.HasValue
                    ? typeNames.GetValueOrDefault(e.Requirement.DocumentTypeId.Value)
                    : null,
                WorkStepId = e.Instance.WorkStepId,
                WorkStepName = e.Instance.WorkStepName,
                WorkStepOrder = e.Instance.WorkStepOrder,
                PeriodCode = e.Instance.PeriodCode,
                Status = e.Status,
                DocumentFileId = e.DocumentFileId,
                DocumentFileName = e.DocumentFileName,
                WaiveReason = e.WaiveReason,
            }).ToList(),
            Summary = ToDto(summary),
        };
    }

    private static ComplianceSummaryDto ToDto(ComplianceSummary summary) => new()
    {
        TotalCount = summary.TotalCount,
        SatisfiedCount = summary.SatisfiedCount,
        WaivedCount = summary.WaivedCount,
        MissingCount = summary.MissingCount,
        BlockingMissingCount = summary.BlockingMissingCount,
        Percent = summary.Percent,
    };

    private static ComplianceSummaryDto CombineDtos(IEnumerable<ComplianceSummaryDto> summaries)
        => ToDto(ComplianceCalculator.Combine(summaries
            .Select(s => new ComplianceSummary(
                s.TotalCount, s.SatisfiedCount, s.WaivedCount, s.MissingCount, s.BlockingMissingCount, s.Percent))
            .ToList()));

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private async Task<List<CompliancePackage>> GetVisiblePackagesAsync()
    {
        var tenantId = CurrentTenant.Id;

        using (_mtFilter.Disable())
        {
            var queryable = await _packageRepository.GetQueryableAsync();
            return await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking()
                    .Where(p => p.TenantId == null || p.TenantId == tenantId)
                    .OrderBy(p => p.Order)
                    .ThenBy(p => p.Name));
        }
    }

    /// <summary>
    /// Sistem kalemleri host'ta (TenantId = null) durduğu için kiracı filtresi kapalı okunur.
    /// Sorgu, filtrenin AÇIK olduğu bir ana taşmasın diye blok İÇİNDE çalıştırılır —
    /// IQueryable döndürmek filtreyi etkisiz kılardı (yürütme anında yeniden uygulanır).
    /// Sahiplik kontrolü paket seviyesinde yapıldığından burada ek filtre gerekmez.
    /// </summary>
    private async Task<List<ComplianceRequirement>> GetRequirementsAsync(List<Guid> packageIds)
    {
        if (packageIds.Count == 0)
        {
            return new List<ComplianceRequirement>();
        }

        using (_mtFilter.Disable())
        {
            var queryable = await _requirementRepository.GetQueryableAsync();
            return await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking()
                    .Where(r => packageIds.Contains(r.PackageId))
                    .OrderBy(r => r.Order));
        }
    }

    private async Task<Dictionary<Guid, string>> GetTypeNamesAsync(List<Guid> typeIds)
    {
        if (typeIds.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        using (_mtFilter.Disable())
        {
            var queryable = await _typeRepository.GetQueryableAsync();
            return (await AsyncExecuter.ToListAsync(
                    queryable.AsNoTracking().Where(t => typeIds.Contains(t.Id)).Select(t => new { t.Id, t.Name })))
                .ToDictionary(k => k.Id, v => v.Name);
        }
    }

    private async Task EnsurePackageVisibleAsync(Guid packageId)
    {
        var tenantId = CurrentTenant.Id;

        using (_mtFilter.Disable())
        {
            var queryable = await _packageRepository.GetQueryableAsync();
            var visible = await AsyncExecuter.AnyAsync(
                queryable.Where(p => p.Id == packageId && (p.TenantId == null || p.TenantId == tenantId)));

            if (!visible)
            {
                throw new EntityNotFoundException(typeof(CompliancePackage), packageId);
            }
        }
    }

    private async Task<ComplianceItemState> GetOrCreateStateAsync(
        Guid assignmentId, Guid requirementId, Guid? workStepId, string? periodCode)
    {
        var assignment = await _assignmentRepository.GetAsync(assignmentId);
        var period = string.IsNullOrWhiteSpace(periodCode) ? null : periodCode.Trim();

        var state = await _stateRepository.FindAsync(s =>
            s.AssignmentId == assignmentId &&
            s.RequirementId == requirementId &&
            s.WorkStepId == workStepId &&
            s.PeriodCode == period);

        return state ?? new ComplianceItemState(
            GuidGenerator.Create(), assignment.TenantId, assignmentId, requirementId, workStepId, period);
    }

    private async Task PersistStateAsync(ComplianceItemState state)
    {
        var exists = await _stateRepository.FindAsync(state.Id) != null;

        if (state.IsEmpty)
        {
            // Karar geri alındı — satırı bırakmak gereksiz kayıt biriktirir.
            if (exists)
            {
                await _stateRepository.DeleteAsync(state);
            }

            return;
        }

        if (exists)
        {
            await _stateRepository.UpdateAsync(state);
        }
        else
        {
            await _stateRepository.InsertAsync(state);
        }
    }

    private async Task<ComplianceItemDto> BuildSingleItemAsync(
        Guid assignmentId, Guid requirementId, Guid? workStepId, string? periodCode)
    {
        var assignment = await _assignmentRepository.GetAsync(assignmentId);
        var overview = await GetOverviewAsync(assignment.ProjectId, periodCode ?? assignment.PeriodCode);

        var period = string.IsNullOrWhiteSpace(periodCode) ? assignment.PeriodCode : periodCode.Trim();

        var checklist = overview.Checklists.FirstOrDefault(c => c.AssignmentId == assignmentId);
        var item = checklist?.Items.FirstOrDefault(i =>
            i.RequirementId == requirementId
            && i.WorkStepId == workStepId
            && (i.Scope != ComplianceScope.Period || i.PeriodCode == period));

        return item ?? throw new EntityNotFoundException(typeof(ComplianceRequirement), requirementId);
    }

}
