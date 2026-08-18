using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Teslim paketi kurucusu ve preflight'ı.
///
/// Üretimin BAYTLARI burada üretilmez: QuestPDF/ClosedXML Web katmanında yaşıyor
/// (Pages/Reports/ReportExporter deseni). Bu servis paketi yönetir, üretilebilirliği
/// karara bağlar ve sonucu sürüm arşivine yazar.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DeliveryPackageAppService : ApplicationService, IDeliveryPackageAppService
{
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _itemRepository;
    private readonly IRepository<ReportRun, Guid> _runRepository;
    private readonly IRepository<ReportTemplate, Guid> _templateRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<DocumentFieldValue, Guid> _fieldValueRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly IComplianceAppService _complianceAppService;

    public DeliveryPackageAppService(
        IRepository<DeliveryPackage, Guid> packageRepository,
        IRepository<DeliveryPackageItem, Guid> itemRepository,
        IRepository<ReportRun, Guid> runRepository,
        IRepository<ReportTemplate, Guid> templateRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IRepository<DocumentFieldValue, Guid> fieldValueRepository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        IComplianceAppService complianceAppService)
    {
        _packageRepository = packageRepository;
        _itemRepository = itemRepository;
        _runRepository = runRepository;
        _templateRepository = templateRepository;
        _fileRepository = fileRepository;
        _fieldRepository = fieldRepository;
        _fieldValueRepository = fieldValueRepository;
        _attachmentRepository = attachmentRepository;
        _projectRepository = projectRepository;
        _identityRepository = identityRepository;
        _complianceAppService = complianceAppService;
    }

    public virtual async Task<List<DeliveryPackageDto>> GetListAsync(Guid projectId)
    {
        var packages = (await _packageRepository.GetListAsync(p => p.ProjectId == projectId))
            .OrderByDescending(p => p.CreationTime)
            .ToList();

        return await MapListAsync(packages);
    }

    public virtual async Task<DeliveryPackageDetailDto> GetAsync(Guid id)
    {
        var package = await _packageRepository.GetAsync(id);
        return await MapDetailAsync(package);
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<DeliveryPackageDto> CreateAsync(CreateUpdateDeliveryPackageDto input)
    {
        await _projectRepository.GetAsync(input.ProjectId);

        var package = new DeliveryPackage(
            GuidGenerator.Create(), CurrentTenant.Id, input.ProjectId, input.Name,
            input.ReportTemplateId, input.PeriodCode, input.Formats);

        await _packageRepository.InsertAsync(package, autoSave: true);

        return (await MapListAsync(new List<DeliveryPackage> { package }))[0];
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<DeliveryPackageDto> UpdateAsync(Guid id, CreateUpdateDeliveryPackageDto input)
    {
        var package = await _packageRepository.GetAsync(id);
        package.Update(input.Name, input.ReportTemplateId, input.PeriodCode, input.Formats);
        await _packageRepository.UpdateAsync(package);

        return (await MapListAsync(new List<DeliveryPackage> { package }))[0];
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var package = await _packageRepository.GetAsync(id);

        var items = await _itemRepository.GetListAsync(i => i.PackageId == id);
        if (items.Count > 0)
        {
            await _itemRepository.DeleteManyAsync(items);
        }

        await _packageRepository.DeleteAsync(package);
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<DeliveryPackageDetailDto> AddItemsAsync(AddDeliveryPackageItemsDto input)
    {
        var package = await _packageRepository.GetAsync(input.PackageId);
        package.EnsureEditable();

        var existing = await _itemRepository.GetListAsync(i => i.PackageId == package.Id);
        var existingFileIds = existing.Select(i => i.DocumentFileId).ToHashSet();

        // Belgelerin bu kiracıda görülebilir olduğu repository filtresiyle doğrulanır.
        var files = await _fileRepository.GetListAsync(f => input.DocumentFileIds.Contains(f.Id));

        var toAdd = files
            .Where(f => !existingFileIds.Contains(f.Id))
            .Select((f, index) => new DeliveryPackageItem(
                GuidGenerator.Create(), CurrentTenant.Id, package.Id, f.Id, existing.Count + index + 1))
            .ToList();

        if (existing.Count + toAdd.Count > ReportingConsts.MaxPackageItems)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DeliveryPackageItemLimit)
                .WithData("Max", ReportingConsts.MaxPackageItems);
        }

        if (toAdd.Count > 0)
        {
            await _itemRepository.InsertManyAsync(toAdd, autoSave: true);
        }

        await RenumberAsync(package);
        return await MapDetailAsync(package);
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<DeliveryPackageDetailDto> RemoveItemAsync(Guid itemId)
    {
        var item = await _itemRepository.GetAsync(itemId);
        var package = await _packageRepository.GetAsync(item.PackageId);
        package.EnsureEditable();

        await _itemRepository.DeleteAsync(item, autoSave: true);

        await RenumberAsync(package);
        return await MapDetailAsync(package);
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<DeliveryPackageDetailDto> ReorderItemsAsync(ReorderDeliveryPackageItemsDto input)
    {
        var package = await _packageRepository.GetAsync(input.PackageId);
        package.EnsureEditable();

        var items = await _itemRepository.GetListAsync(i => i.PackageId == package.Id);

        // İstenen sıra uygulanır; listede olmayan kalemler sona kayar.
        var order = 0;
        foreach (var itemId in input.ItemIds)
        {
            var item = items.FirstOrDefault(i => i.Id == itemId);
            if (item == null) continue;
            item.SetOrder(++order);
        }

        foreach (var item in items.Where(i => !input.ItemIds.Contains(i.Id)))
        {
            item.SetOrder(++order);
        }

        DeliveryPreflight.AssignAnnexNumbers(items);
        await _itemRepository.UpdateManyAsync(items, autoSave: true);

        return await MapDetailAsync(package);
    }

    public virtual async Task<PreflightResultDto> PreflightAsync(Guid packageId)
    {
        var package = await _packageRepository.GetAsync(packageId);
        var result = await RunPreflightAsync(package);

        return new PreflightResultDto
        {
            CanGenerate = result.CanGenerate,
            BlockingCount = result.BlockingCount,
            WarningCount = result.WarningCount,
            Issues = result.Issues.Select(i => new PreflightIssueDto
            {
                Kind = i.Kind,
                IsBlocking = i.IsBlocking,
                Message = i.Message,
                DocumentFileId = i.DocumentFileId,
            }).ToList(),
        };
    }

    [Authorize(PlatformPermissions.Documents.GenerateReports)]
    public virtual async Task<ReportRunDto> MarkGeneratedAsync(
        Guid packageId, string storedFileName, long outputSize, int sectionCount)
    {
        var package = await _packageRepository.GetAsync(packageId);

        // İstemcinin preflight geçtiğini söylemesi yetmez — üretim anında yeniden bakılır.
        var preflight = await RunPreflightAsync(package);
        if (!preflight.CanGenerate)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DeliveryPackageBlocked)
                .WithData("BlockingCount", preflight.BlockingCount);
        }

        var items = await _itemRepository.GetListAsync(i => i.PackageId == package.Id);

        // Aynı (proje, şablon, dönem) için sürüm numarası artar.
        var previous = await _runRepository.GetListAsync(r =>
            r.ProjectId == package.ProjectId &&
            r.ReportTemplateId == package.ReportTemplateId &&
            r.PeriodCode == package.PeriodCode);
        var version = previous.Count == 0 ? 1 : previous.Max(r => r.Version) + 1;

        package.MarkGenerated(storedFileName, outputSize, items.Count, Clock.Now);
        await _packageRepository.UpdateAsync(package);

        var run = new ReportRun(
            GuidGenerator.Create(), CurrentTenant.Id, package.ProjectId, package.ReportTemplateId,
            package.Id, package.PeriodCode, version, package.Formats,
            storedFileName, outputSize, sectionCount, items.Count);

        await _runRepository.InsertAsync(run, autoSave: true);

        return (await MapRunsAsync(new List<ReportRun> { run }))[0];
    }

    public virtual async Task<List<ReportRunDto>> GetRunsAsync(Guid projectId)
    {
        var runs = (await _runRepository.GetListAsync(r => r.ProjectId == projectId))
            .OrderByDescending(r => r.CreationTime)
            .ToList();

        return await MapRunsAsync(runs);
    }

    public virtual async Task<GeneratedFileDownloadDto> PrepareDownloadAsync(Guid packageId)
    {
        var package = await _packageRepository.GetAsync(packageId);

        if (string.IsNullOrEmpty(package.StoredFileName))
        {
            throw new EntityNotFoundException(typeof(DeliveryPackage), packageId);
        }

        return BuildDownload(package.StoredFileName, package.Name);
    }

    public virtual async Task<GeneratedFileDownloadDto> PrepareRunDownloadAsync(Guid runId)
    {
        var run = await _runRepository.GetAsync(runId);
        var name = $"{run.PeriodCode ?? "rapor"}-v{run.Version}";
        return BuildDownload(run.StoredFileName, name);
    }

    /// <summary>
    /// ZIP üretimi için eklerin fiziksel dosya adları.
    /// Denetim izine "indirildi" YAZMAZ: paketleme, kullanıcının belgeyi indirmesi
    /// değildir — aksi halde tek üretim onlarca sahte indirme kaydı üretirdi.
    /// </summary>
    public virtual async Task<List<AnnexFileDto>> GetAnnexFilesAsync(Guid packageId)
    {
        await _packageRepository.GetAsync(packageId);

        var items = (await _itemRepository.GetListAsync(i => i.PackageId == packageId))
            .OrderBy(i => i.Order)
            .ToList();

        if (items.Count == 0)
        {
            return new List<AnnexFileDto>();
        }

        var fileIds = items.Select(i => i.DocumentFileId).ToList();
        var files = await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id));
        var fileById = files.ToDictionary(f => f.Id);

        var attachmentIds = files.Where(f => f.LatestAttachmentId.HasValue)
            .Select(f => f.LatestAttachmentId!.Value).ToList();
        var attachmentQueryable = await _attachmentRepository.GetQueryableAsync();
        var attachments = (await AsyncExecuter.ToListAsync(
                attachmentQueryable.AsNoTracking().Where(a => attachmentIds.Contains(a.Id))
                    .Select(a => new { a.Id, a.FileName, a.StoredFileName })))
            .ToDictionary(k => k.Id);

        return items.Select(i =>
        {
            var file = fileById.GetValueOrDefault(i.DocumentFileId);
            var attachment = file?.LatestAttachmentId != null
                ? attachments.GetValueOrDefault(file.LatestAttachmentId.Value)
                : null;

            return new AnnexFileDto
            {
                AnnexNumber = i.AnnexNumber ?? string.Empty,
                DisplayName = file?.DisplayName ?? "(silinmiş belge)",
                FileName = attachment?.FileName ?? file?.DisplayName ?? "belge",
                StoredFileName = attachment?.StoredFileName,
            };
        }).ToList();
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private static GeneratedFileDownloadDto BuildDownload(string storedFileName, string displayName)
    {
        var extension = System.IO.Path.GetExtension(storedFileName).ToLowerInvariant();

        return new GeneratedFileDownloadDto
        {
            StoredFileName = storedFileName,
            FileName = SanitizeFileName(displayName) + extension,
            ContentType = extension switch
            {
                ".pdf" => "application/pdf",
                ".zip" => "application/zip",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _ => "application/octet-stream",
            },
        };
    }

    private static string SanitizeFileName(string name)
    {
        var invalid = System.IO.Path.GetInvalidFileNameChars();
        var cleaned = new string(name.Select(c => invalid.Contains(c) ? '_' : c).ToArray()).Trim();
        return string.IsNullOrWhiteSpace(cleaned) ? "teslim-paketi" : cleaned;
    }

    private async Task<PreflightResult> RunPreflightAsync(DeliveryPackage package)
    {
        var items = (await _itemRepository.GetListAsync(i => i.PackageId == package.Id))
            .OrderBy(i => i.Order)
            .ToList();

        var fileIds = items.Select(i => i.DocumentFileId).ToList();
        var files = await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id));

        var missingByFile = await CountMissingRequiredFieldsAsync(files);
        var confidentialTypeIds = await GetTypesWithConfidentialFieldAsync(
            files.Where(f => f.DocumentTypeId.HasValue).Select(f => f.DocumentTypeId!.Value).Distinct().ToList());

        var documents = files.Select(f => new PreflightDocument(
            f.Id,
            f.DisplayName,
            f.ExpiryDate,
            missingByFile.GetValueOrDefault(f.Id),
            f.DocumentTypeId.HasValue && confidentialTypeIds.Contains(f.DocumentTypeId.Value))).ToList();

        // Uygunluk: paketin dönemi neyse o dönemin bloke eksikleri sayılır.
        var overview = await _complianceAppService.GetOverviewAsync(package.ProjectId, package.PeriodCode);
        var blockingTitles = overview.Checklists
            .SelectMany(c => c.Items)
            .Where(i => i.Status == ComplianceItemStatus.Missing && i.IsBlocking)
            .Select(i => i.Title)
            .Distinct()
            .ToList();

        var isExternal = await IsExternalRecipientAsync(package.ReportTemplateId);

        return DeliveryPreflight.Evaluate(
            documents,
            overview.Summary.BlockingMissingCount,
            blockingTitles,
            isExternal,
            Clock.Now);
    }

    /// <summary>Belge başına doldurulmamış ZORUNLU alan sayısı.</summary>
    private async Task<Dictionary<Guid, int>> CountMissingRequiredFieldsAsync(List<DocumentFile> files)
    {
        var result = new Dictionary<Guid, int>();

        var typeIds = files.Where(f => f.DocumentTypeId.HasValue)
            .Select(f => f.DocumentTypeId!.Value).Distinct().ToList();

        if (typeIds.Count == 0)
        {
            return result;
        }

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var requiredFields = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking()
                .Where(f => typeIds.Contains(f.DocumentTypeId) && f.IsRequired)
                .Select(f => new { f.Id, f.DocumentTypeId }));

        var fileIds = files.Select(f => f.Id).ToList();
        var valueQueryable = await _fieldValueRepository.GetQueryableAsync();
        var filledValues = await AsyncExecuter.ToListAsync(
            valueQueryable.AsNoTracking()
                .Where(v => fileIds.Contains(v.DocumentFileId)
                    && (v.ValueText != null || v.ValueNumber != null || v.ValueDate != null))
                .Select(v => new { v.DocumentFileId, v.FieldId }));

        var filledLookup = filledValues
            .GroupBy(v => v.DocumentFileId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.FieldId).ToHashSet());

        foreach (var file in files.Where(f => f.DocumentTypeId.HasValue))
        {
            var required = requiredFields.Where(f => f.DocumentTypeId == file.DocumentTypeId!.Value).ToList();
            var filled = filledLookup.GetValueOrDefault(file.Id) ?? new HashSet<Guid>();
            var missing = required.Count(f => !filled.Contains(f.Id));

            if (missing > 0)
            {
                result[file.Id] = missing;
            }
        }

        return result;
    }

    private async Task<HashSet<Guid>> GetTypesWithConfidentialFieldAsync(List<Guid> typeIds)
    {
        if (typeIds.Count == 0)
        {
            return new HashSet<Guid>();
        }

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var rows = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking()
                .Where(f => typeIds.Contains(f.DocumentTypeId) && f.Visibility == DocumentFieldVisibility.Confidential)
                .Select(f => f.DocumentTypeId));

        return rows.ToHashSet();
    }

    /// <summary>İç yönetim dışındaki her alıcı dıştır — gizli alan uyarısı buna bakar.</summary>
    private async Task<bool> IsExternalRecipientAsync(Guid? templateId)
    {
        if (!templateId.HasValue)
        {
            return true;
        }

        var template = await _templateRepository.FindAsync(templateId.Value);
        return template == null || template.Recipient != ReportRecipient.Internal;
    }

    private async Task RenumberAsync(DeliveryPackage package)
    {
        var items = await _itemRepository.GetListAsync(i => i.PackageId == package.Id);
        DeliveryPreflight.AssignAnnexNumbers(items);
        await _itemRepository.UpdateManyAsync(items, autoSave: true);

        package.SetItemCount(items.Count);
        await _packageRepository.UpdateAsync(package);
    }

    private async Task<List<DeliveryPackageDto>> MapListAsync(List<DeliveryPackage> packages)
    {
        if (packages.Count == 0)
        {
            return new List<DeliveryPackageDto>();
        }

        var projectIds = packages.Select(p => p.ProjectId).Distinct().ToList();
        var projectQueryable = await _projectRepository.GetQueryableAsync();
        var projectNames = (await AsyncExecuter.ToListAsync(
                projectQueryable.AsNoTracking().Where(p => projectIds.Contains(p.Id)).Select(p => new { p.Id, p.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        var templateNames = await GetTemplateNamesAsync(
            packages.Where(p => p.ReportTemplateId.HasValue).Select(p => p.ReportTemplateId!.Value).Distinct().ToList());

        return packages.Select(p => new DeliveryPackageDto
        {
            Id = p.Id,
            TenantId = p.TenantId,
            CreationTime = p.CreationTime,
            CreatorId = p.CreatorId,
            ProjectId = p.ProjectId,
            ProjectName = projectNames.GetValueOrDefault(p.ProjectId),
            ReportTemplateId = p.ReportTemplateId,
            ReportTemplateName = p.ReportTemplateId.HasValue ? templateNames.GetValueOrDefault(p.ReportTemplateId.Value) : null,
            Name = p.Name,
            PeriodCode = p.PeriodCode,
            Status = p.Status,
            Formats = p.Formats,
            GeneratedAt = p.GeneratedAt,
            OutputSize = p.OutputSize,
            ItemCount = p.ItemCount,
            HasOutput = !string.IsNullOrEmpty(p.StoredFileName),
        }).ToList();
    }

    private async Task<DeliveryPackageDetailDto> MapDetailAsync(DeliveryPackage package)
    {
        var head = (await MapListAsync(new List<DeliveryPackage> { package }))[0];

        var detail = new DeliveryPackageDetailDto
        {
            Id = head.Id,
            TenantId = head.TenantId,
            CreationTime = head.CreationTime,
            CreatorId = head.CreatorId,
            ProjectId = head.ProjectId,
            ProjectName = head.ProjectName,
            ReportTemplateId = head.ReportTemplateId,
            ReportTemplateName = head.ReportTemplateName,
            Name = head.Name,
            PeriodCode = head.PeriodCode,
            Status = head.Status,
            Formats = head.Formats,
            GeneratedAt = head.GeneratedAt,
            OutputSize = head.OutputSize,
            ItemCount = head.ItemCount,
            HasOutput = head.HasOutput,
        };

        var items = (await _itemRepository.GetListAsync(i => i.PackageId == package.Id))
            .OrderBy(i => i.Order)
            .ToList();

        if (items.Count == 0)
        {
            return detail;
        }

        var fileIds = items.Select(i => i.DocumentFileId).ToList();
        var files = await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id));
        var fileById = files.ToDictionary(f => f.Id);

        var attachmentIds = files.Where(f => f.LatestAttachmentId.HasValue)
            .Select(f => f.LatestAttachmentId!.Value).ToList();
        var attachmentQueryable = await _attachmentRepository.GetQueryableAsync();
        var sizes = (await AsyncExecuter.ToListAsync(
                attachmentQueryable.AsNoTracking().Where(a => attachmentIds.Contains(a.Id))
                    .Select(a => new { a.Id, a.FileSize })))
            .ToDictionary(k => k.Id, v => v.FileSize);

        detail.Items = items.Select(i =>
        {
            var file = fileById.GetValueOrDefault(i.DocumentFileId);
            return new DeliveryPackageItemDto
            {
                Id = i.Id,
                PackageId = i.PackageId,
                DocumentFileId = i.DocumentFileId,
                DocumentFileName = file?.DisplayName ?? "(silinmiş belge)",
                Order = i.Order,
                AnnexNumber = i.AnnexNumber,
                ExpiryDate = file?.ExpiryDate,
                FileSize = file?.LatestAttachmentId != null ? sizes.GetValueOrDefault(file.LatestAttachmentId.Value) : 0,
            };
        }).ToList();

        return detail;
    }

    private async Task<List<ReportRunDto>> MapRunsAsync(List<ReportRun> runs)
    {
        if (runs.Count == 0)
        {
            return new List<ReportRunDto>();
        }

        var templateNames = await GetTemplateNamesAsync(
            runs.Where(r => r.ReportTemplateId.HasValue).Select(r => r.ReportTemplateId!.Value).Distinct().ToList());

        var userIds = runs.Where(r => r.CreatorId.HasValue).Select(r => r.CreatorId!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var userNames = (await AsyncExecuter.ToListAsync(
                userQueryable.AsNoTracking().Where(u => userIds.Contains(u.Id)).Select(u => new { u.Id, u.UserName })))
            .ToDictionary(k => k.Id, v => v.UserName);

        return runs.Select(r => new ReportRunDto
        {
            Id = r.Id,
            CreationTime = r.CreationTime,
            CreatorId = r.CreatorId,
            ProjectId = r.ProjectId,
            ReportTemplateId = r.ReportTemplateId,
            ReportTemplateName = r.ReportTemplateId.HasValue ? templateNames.GetValueOrDefault(r.ReportTemplateId.Value) : null,
            DeliveryPackageId = r.DeliveryPackageId,
            PeriodCode = r.PeriodCode,
            Version = r.Version,
            Formats = r.Formats,
            OutputSize = r.OutputSize,
            SectionCount = r.SectionCount,
            AnnexCount = r.AnnexCount,
            GeneratedByName = r.CreatorId.HasValue ? userNames.GetValueOrDefault(r.CreatorId.Value) ?? "Sistem" : "Sistem",
            DownloadUrl = "/Documents/Deliveries?handler=DownloadRun&runId=" + r.Id,
        }).ToList();
    }

    private async Task<Dictionary<Guid, string>> GetTemplateNamesAsync(List<Guid> templateIds)
    {
        if (templateIds.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var templates = await _templateRepository.GetListAsync(t => templateIds.Contains(t.Id));
        return templates.ToDictionary(t => t.Id, t => t.Name);
    }
}
