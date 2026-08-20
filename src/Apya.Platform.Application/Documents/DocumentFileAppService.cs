using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Permissions;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge listesi, detayı ve meta yönetimi.
///
/// Sayfalama ve sıralama SUNUCU tarafındadır — 128 satırlık bir klasörde bile
/// istemciye tüm koleksiyon gönderilmez. İlişkili adlar (klasör, tip, proje,
/// iş adımı, yükleyen) sayfa sonuçları üzerinden TEK sorgu ile toplu doldurulur;
/// satır başına sorgu (N+1) yoktur.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentFileAppService : ApplicationService, IDocumentFileAppService
{
    /// <summary>Sorting girdisi doğrudan SQL'e gittiği için beyaz liste zorunlu.</summary>
    private static readonly string[] AllowedSortFields =
        { "displayname", "amount", "documentdate", "creationtime", "status" };

    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<DocumentFieldValue, Guid> _fieldValueRepository;
    private readonly IRepository<DocumentTag, Guid> _tagRepository;
    private readonly IRepository<DocumentFileTag, Guid> _fileTagRepository;
    private readonly IRepository<DocumentFieldPermission, Guid> _fieldPermissionRepository;
    private readonly IRepository<DocumentAccessLog, Guid> _accessLogRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<DocumentExpenseMatch, Guid> _matchRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _packageItemRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<ComplianceItemState, Guid> _itemStateRepository;
    private readonly IRepository<ComplianceRequirement, Guid> _requirementRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IDataFilter<ISoftDelete> _softDeleteFilter;

    public DocumentFileAppService(
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<Document, Guid> documentRepository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IRepository<DocumentFieldValue, Guid> fieldValueRepository,
        IRepository<DocumentTag, Guid> tagRepository,
        IRepository<DocumentFileTag, Guid> fileTagRepository,
        IRepository<DocumentFieldPermission, Guid> fieldPermissionRepository,
        IRepository<DocumentAccessLog, Guid> accessLogRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<DocumentExpenseMatch, Guid> matchRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<DeliveryPackageItem, Guid> packageItemRepository,
        IRepository<DeliveryPackage, Guid> packageRepository,
        IRepository<ComplianceItemState, Guid> itemStateRepository,
        IRepository<ComplianceRequirement, Guid> requirementRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        IDataFilter<IMultiTenant> mtFilter,
        IDataFilter<ISoftDelete> softDeleteFilter)
    {
        _fileRepository = fileRepository;
        _documentRepository = documentRepository;
        _attachmentRepository = attachmentRepository;
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
        _fieldValueRepository = fieldValueRepository;
        _tagRepository = tagRepository;
        _fileTagRepository = fileTagRepository;
        _fieldPermissionRepository = fieldPermissionRepository;
        _accessLogRepository = accessLogRepository;
        _projectRepository = projectRepository;
        _workStepRepository = workStepRepository;
        _matchRepository = matchRepository;
        _expenseRepository = expenseRepository;
        _packageItemRepository = packageItemRepository;
        _packageRepository = packageRepository;
        _itemStateRepository = itemStateRepository;
        _requirementRepository = requirementRepository;
        _identityRepository = identityRepository;
        _mtFilter = mtFilter;
        _softDeleteFilter = softDeleteFilter;
    }

    public virtual async Task<PagedResultDto<DocumentFileDto>> GetListAsync(GetDocumentFilesInput input)
    {
        if (input.OnlyDeleted != true)
        {
            return await QueryPageAsync(input);
        }

        // Çöp kutusu. Sorgu bu bloğun İÇİNDE koşmak ZORUNDA: filtreyi kapatıp
        // dışarı IQueryable taşırsak EF yürütme anında filtreyi yeniden uygular
        // ve liste sessizce boş döner.
        using (_softDeleteFilter.Disable())
        {
            return await QueryPageAsync(input, onlyDeleted: true);
        }
    }

    private async Task<PagedResultDto<DocumentFileDto>> QueryPageAsync(
        GetDocumentFilesInput input, bool onlyDeleted = false)
    {
        var queryable = (await _fileRepository.GetQueryableAsync()).AsNoTracking();

        if (onlyDeleted)
        {
            queryable = queryable.Where(f => f.IsDeleted);
        }

        queryable = await ApplyFiltersAsync(queryable, input);

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        queryable = ApplySorting(queryable, input.Sorting);

        var files = await AsyncExecuter.ToListAsync(
            queryable.Skip(input.SkipCount).Take(input.MaxResultCount));

        var dtos = await MapWithRelatedNamesAsync(files);

        return new PagedResultDto<DocumentFileDto>(totalCount, dtos);
    }

    /// <summary>
    /// Çöp kutusundan geri alma. Belge, ekleri, alan değerleri ve etiketleri
    /// BİRLİKTE geri gelir — yalnız üst satırı geri almak, açılamayan bir belge
    /// bırakırdı.
    /// </summary>
    [Authorize(PlatformPermissions.Documents.Delete)]
    public virtual async Task RestoreAsync(Guid id)
    {
        using (_softDeleteFilter.Disable())
        {
            var file = await _fileRepository.GetAsync(id);

            if (!file.IsDeleted)
            {
                return;
            }

            file.IsDeleted = false;
            await _fileRepository.UpdateAsync(file);

            var attachments = await _attachmentRepository.GetListAsync(a => a.DocumentFileId == id && a.IsDeleted);
            foreach (var attachment in attachments)
            {
                attachment.IsDeleted = false;
            }
            if (attachments.Count > 0)
            {
                await _attachmentRepository.UpdateManyAsync(attachments);
            }

            var values = await _fieldValueRepository.GetListAsync(v => v.DocumentFileId == id && v.IsDeleted);
            foreach (var value in values)
            {
                value.IsDeleted = false;
            }
            if (values.Count > 0)
            {
                await _fieldValueRepository.UpdateManyAsync(values);
            }

            var fileTags = await _fileTagRepository.GetListAsync(t => t.DocumentFileId == id && t.IsDeleted);
            foreach (var fileTag in fileTags)
            {
                fileTag.IsDeleted = false;
            }
            if (fileTags.Count > 0)
            {
                await _fileTagRepository.UpdateManyAsync(fileTags);
            }

            await LogAsync(file, DocumentAccessAction.Restored, $"{attachments.Count} versiyonla birlikte");
        }
    }

    public virtual async Task<DocumentFileDetailDto> GetAsync(Guid id)
    {
        var file = await _fileRepository.GetAsync(id);

        var dto = ObjectMapper.Map<DocumentFile, DocumentFileDetailDto>(file);
        await FillRelatedNamesAsync(new List<DocumentFile> { file }, new List<DocumentFileDto> { dto });

        dto.Fields = await BuildFieldsAsync(file);
        dto.Versions = await BuildVersionsAsync(file.Id);
        dto.Related = await BuildRelatedAsync(file);

        // Detay panelinin açılması = belgenin görüntülenmesi. Liste render'ı LOGLANMAZ
        // (128 satırlık bir sayfa 128 log satırı üretirdi); iz yalnız bilinçli erişimde tutulur.
        await LogAsync(file, DocumentAccessAction.Viewed);

        return dto;
    }

    [Authorize(PlatformPermissions.Documents.ManageMeta)]
    public virtual async Task<DocumentFileDto> UpdateMetaAsync(Guid id, UpdateDocumentFileMetaDto input)
    {
        var file = await _fileRepository.GetAsync(id);
        file.EnsureNotLocked();

        if (input.DocumentTypeId.HasValue)
        {
            await EnsureTypeVisibleAsync(input.DocumentTypeId.Value);
        }

        if (input.ProjectId.HasValue)
        {
            await _projectRepository.GetAsync(input.ProjectId.Value);
        }

        if (input.WorkStepId.HasValue)
        {
            var step = await _workStepRepository.GetAsync(input.WorkStepId.Value);
            if (input.ProjectId.HasValue && step.ProjectId != input.ProjectId.Value)
            {
                throw new BusinessException(PlatformDomainErrorCodes.DocumentWorkStepMismatch)
                    .WithData("WorkStepId", input.WorkStepId.Value)
                    .WithData("ProjectId", input.ProjectId.Value);
            }
        }

        var previousTypeId = file.DocumentTypeId;
        var previousStatus = file.Status;

        file.SetDisplayName(input.DisplayName);
        file.SetClassification(input.DocumentTypeId, input.ProjectId, input.WorkStepId);
        file.SetAmount(input.Amount, input.Currency);
        file.SetDates(input.DocumentDate, input.PeriodCode, input.ExpiryDate);
        file.SetExternalRef(input.ExternalRef);
        file.ChangeStatus(input.Status);

        // Saklama süresi tipten gelir; belge tarihi yoksa yükleme tarihine göre hesaplanır.
        if (input.DocumentTypeId.HasValue)
        {
            var type = await _typeRepository.FindAsync(input.DocumentTypeId.Value);
            file.ApplyRetention(type?.RetentionMonths, input.DocumentDate ?? file.CreationTime);
        }
        else
        {
            file.ApplyRetention(null, file.CreationTime);
        }

        await _fileRepository.UpdateAsync(file);

        await SaveFieldValuesAsync(file, input.Fields);
        await SaveTagsAsync(file.Id, input.Tags);

        var changes = new List<string>();
        if (previousTypeId != file.DocumentTypeId) changes.Add("tür");
        if (previousStatus != file.Status) changes.Add($"durum: {previousStatus} → {file.Status}");

        await LogAsync(file, DocumentAccessAction.MetaChanged,
            changes.Count > 0 ? string.Join(", ", changes) : "alan güncellemesi");

        var dtos = await MapWithRelatedNamesAsync(new List<DocumentFile> { file });
        return dtos[0];
    }

    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task<DocumentFileDto> MoveAsync(Guid id, Guid targetDocumentId)
    {
        var file = await _fileRepository.GetAsync(id);
        file.EnsureNotLocked();

        // Hedef klasör bu kiracıda görülebilir olmalı.
        await _documentRepository.GetAsync(targetDocumentId);

        var sourceDocumentId = file.DocumentId;
        file.MoveTo(targetDocumentId);
        await _fileRepository.UpdateAsync(file);

        // Ekler de yeni klasöre taşınır — indirme yolu ve klasör bazlı sorgular tutarlı kalsın.
        var attachments = await _attachmentRepository.GetListAsync(x => x.DocumentFileId == file.Id);
        foreach (var attachment in attachments)
        {
            attachment.DocumentId = targetDocumentId;
        }

        if (attachments.Count > 0)
        {
            await _attachmentRepository.UpdateManyAsync(attachments);
        }

        var target = await _documentRepository.GetAsync(targetDocumentId);
        await _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, sourceDocumentId, file.LatestAttachmentId,
            DocumentAccessAction.Moved, file.Id, $"hedef klasör: {target.Title}", CurrentActorRole()));

        var dtos = await MapWithRelatedNamesAsync(new List<DocumentFile> { file });
        return dtos[0];
    }

    [Authorize(PlatformPermissions.Documents.BulkOperations)]
    public virtual async Task BulkMoveAsync(BulkMoveDocumentFilesDto input)
    {
        if (input.DocumentFileIds.Count == 0)
        {
            return;
        }

        await _documentRepository.GetAsync(input.TargetDocumentId);

        var files = await _fileRepository.GetListAsync(f => input.DocumentFileIds.Contains(f.Id));

        foreach (var file in files)
        {
            file.EnsureNotLocked();
            file.MoveTo(input.TargetDocumentId);
        }

        await _fileRepository.UpdateManyAsync(files);

        var fileIds = files.Select(f => f.Id).ToList();
        var attachments = await _attachmentRepository.GetListAsync(x => fileIds.Contains(x.DocumentFileId));
        foreach (var attachment in attachments)
        {
            attachment.DocumentId = input.TargetDocumentId;
        }

        if (attachments.Count > 0)
        {
            await _attachmentRepository.UpdateManyAsync(attachments);
        }
    }

    [Authorize(PlatformPermissions.Documents.BulkOperations)]
    public virtual async Task BulkTagAsync(BulkTagDocumentFilesDto input)
    {
        if (input.DocumentFileIds.Count == 0 || input.Tags.Count == 0)
        {
            return;
        }

        // Belgelerin bu kiracıda görülebilir olduğu doğrulanır (filtre otomatik uygulanır).
        var files = await _fileRepository.GetListAsync(f => input.DocumentFileIds.Contains(f.Id));
        var fileIds = files.Select(f => f.Id).ToList();

        if (fileIds.Count == 0)
        {
            return;
        }

        var tagIds = await ResolveTagIdsAsync(input.Tags, createMissing: !input.Remove);

        if (tagIds.Count == 0)
        {
            return;
        }

        var existing = await _fileTagRepository.GetListAsync(
            x => fileIds.Contains(x.DocumentFileId) && tagIds.Contains(x.TagId));

        if (input.Remove)
        {
            if (existing.Count > 0)
            {
                await _fileTagRepository.DeleteManyAsync(existing);
            }

            return;
        }

        var existingPairs = existing
            .Select(x => (x.DocumentFileId, x.TagId))
            .ToHashSet();

        var toInsert = new List<DocumentFileTag>();
        foreach (var fileId in fileIds)
        {
            foreach (var tagId in tagIds)
            {
                if (!existingPairs.Contains((fileId, tagId)))
                {
                    toInsert.Add(new DocumentFileTag(GuidGenerator.Create(), fileId, tagId));
                }
            }
        }

        if (toInsert.Count > 0)
        {
            await _fileTagRepository.InsertManyAsync(toInsert);
        }
    }

    [Authorize(PlatformPermissions.Documents.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var file = await _fileRepository.GetAsync(id);
        file.EnsureNotLocked();

        var attachments = await _attachmentRepository.GetListAsync(x => x.DocumentFileId == id);

        await LogAsync(file, DocumentAccessAction.Deleted, $"{attachments.Count} versiyonla birlikte");

        if (attachments.Count > 0)
        {
            await _attachmentRepository.DeleteManyAsync(attachments);
        }

        var values = await _fieldValueRepository.GetListAsync(v => v.DocumentFileId == id);
        if (values.Count > 0)
        {
            await _fieldValueRepository.DeleteManyAsync(values);
        }

        var fileTags = await _fileTagRepository.GetListAsync(t => t.DocumentFileId == id);
        if (fileTags.Count > 0)
        {
            await _fileTagRepository.DeleteManyAsync(fileTags);
        }

        await _fileRepository.DeleteAsync(file);
    }

    public virtual async Task<List<string>> GetTagsAsync()
    {
        var queryable = await _tagRepository.GetQueryableAsync();
        return await AsyncExecuter.ToListAsync(
            queryable.AsNoTracking().OrderBy(t => t.Name).Select(t => t.Name));
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    /// <summary>
    /// Belgenin bağlı olduğu kayıtlar. Proje ve iş adımı DTO'da zaten ayrı alan
    /// olarak var, burada TEKRARLANMAZ — bu liste yalnız panelde başka türlü
    /// görünmeyen bağları taşır: eşleştiği harcama, içinde bulunduğu teslim
    /// paketi ve karşıladığı kontrol listesi kalemi.
    /// </summary>
    private async Task<List<RelatedRecordDto>> BuildRelatedAsync(DocumentFile file)
    {
        var related = new List<RelatedRecordDto>();

        /* --- Eşleştiği harcama --- */
        var matchQueryable = await _matchRepository.GetQueryableAsync();
        var matches = await AsyncExecuter.ToListAsync(
            matchQueryable.AsNoTracking()
                .Where(m => m.DocumentFileId == file.Id)
                .Select(m => new { m.ExpenseId, m.AnnexNumber, m.Score }));

        if (matches.Count > 0)
        {
            var expenseIds = matches.Select(m => m.ExpenseId).ToList();
            var expenseQueryable = await _expenseRepository.GetQueryableAsync();
            var expenses = (await AsyncExecuter.ToListAsync(
                    expenseQueryable.AsNoTracking()
                        .Where(e => expenseIds.Contains(e.Id))
                        .Select(e => new { e.Id, e.Title, e.Amount, e.Currency, e.ExpenseDate })))
                .ToDictionary(k => k.Id);

            foreach (var match in matches)
            {
                var expense = expenses.GetValueOrDefault(match.ExpenseId);

                related.Add(new RelatedRecordDto
                {
                    Kind = RelatedRecordKind.Expense,
                    EntityId = match.ExpenseId,
                    Label = expense?.Title ?? "(silinmiş harcama)",
                    Detail = expense == null
                        ? null
                        : $"{expense.Amount:N2} {expense.Currency} · {expense.ExpenseDate:dd.MM.yyyy}"
                          + (string.IsNullOrWhiteSpace(match.AnnexNumber) ? string.Empty : $" · {match.AnnexNumber}"),
                });
            }
        }

        /* --- İçinde bulunduğu teslim paketleri --- */
        var itemQueryable = await _packageItemRepository.GetQueryableAsync();
        var packageItems = await AsyncExecuter.ToListAsync(
            itemQueryable.AsNoTracking()
                .Where(i => i.DocumentFileId == file.Id)
                .Select(i => new { i.PackageId, i.AnnexNumber }));

        if (packageItems.Count > 0)
        {
            var packageIds = packageItems.Select(i => i.PackageId).ToList();
            var packageQueryable = await _packageRepository.GetQueryableAsync();
            var packages = (await AsyncExecuter.ToListAsync(
                    packageQueryable.AsNoTracking()
                        .Where(p => packageIds.Contains(p.Id))
                        .Select(p => new { p.Id, p.Name, p.PeriodCode, p.Status })))
                .ToDictionary(k => k.Id);

            foreach (var item in packageItems)
            {
                var package = packages.GetValueOrDefault(item.PackageId);

                related.Add(new RelatedRecordDto
                {
                    Kind = RelatedRecordKind.DeliveryPackage,
                    EntityId = item.PackageId,
                    Label = package?.Name ?? "(silinmiş paket)",
                    Detail = string.Join(" · ", new[] { item.AnnexNumber, package?.PeriodCode }
                        .Where(x => !string.IsNullOrWhiteSpace(x))),
                });
            }
        }

        /* --- Karşıladığı kontrol listesi kalemleri --- */
        var stateQueryable = await _itemStateRepository.GetQueryableAsync();
        var states = await AsyncExecuter.ToListAsync(
            stateQueryable.AsNoTracking()
                .Where(s => s.DocumentFileId == file.Id)
                .Select(s => new { s.RequirementId, s.PeriodCode }));

        if (states.Count > 0)
        {
            var requirementIds = states.Select(s => s.RequirementId).ToList();
            var requirementQueryable = await _requirementRepository.GetQueryableAsync();
            var requirements = (await AsyncExecuter.ToListAsync(
                    requirementQueryable.AsNoTracking()
                        .Where(r => requirementIds.Contains(r.Id))
                        .Select(r => new { r.Id, r.Title, r.IsBlocking })))
                .ToDictionary(k => k.Id);

            foreach (var state in states)
            {
                var requirement = requirements.GetValueOrDefault(state.RequirementId);

                related.Add(new RelatedRecordDto
                {
                    Kind = RelatedRecordKind.ComplianceRequirement,
                    EntityId = state.RequirementId,
                    Label = requirement?.Title ?? "(kaldırılmış kalem)",
                    Detail = string.Join(" · ", new[]
                    {
                        state.PeriodCode,
                        requirement?.IsBlocking == true ? "teslimi bloke eden" : null,
                    }.Where(x => !string.IsNullOrWhiteSpace(x))),
                });
            }
        }

        return related;
    }

    /// <summary>
    /// Denetim izi kaydı. Rol, olay ANINDAKİ haliyle kopyalanır — kullanıcının rolü
    /// sonradan değişse bile iz "o gün kim, hangi yetkiyle" sorusunu doğru yanıtlasın.
    /// </summary>
    private Task LogAsync(DocumentFile file, DocumentAccessAction action, string? detail = null)
        => _accessLogRepository.InsertAsync(new DocumentAccessLog(
            GuidGenerator.Create(), CurrentTenant.Id, file.DocumentId, file.LatestAttachmentId,
            action, file.Id, detail, CurrentActorRole()));

    private string? CurrentActorRole() => CurrentUser.Roles?.FirstOrDefault();

    private async Task<IQueryable<DocumentFile>> ApplyFiltersAsync(
        IQueryable<DocumentFile> queryable, GetDocumentFilesInput input)
    {
        if (input.DocumentId.HasValue)
        {
            if (input.IncludeSubFolders)
            {
                var folderIds = await GetFolderSubtreeIdsAsync(input.DocumentId.Value);
                queryable = queryable.Where(f => folderIds.Contains(f.DocumentId));
            }
            else
            {
                queryable = queryable.Where(f => f.DocumentId == input.DocumentId.Value);
            }
        }

        if (!string.IsNullOrWhiteSpace(input.FilterText))
        {
            var text = input.FilterText.Trim();
            queryable = queryable.Where(f =>
                f.DisplayName.Contains(text) ||
                (f.ExternalRef != null && f.ExternalRef.Contains(text)));
        }

        if (input.ProjectId.HasValue)
        {
            queryable = queryable.Where(f => f.ProjectId == input.ProjectId.Value);
        }

        if (input.WorkStepId.HasValue)
        {
            queryable = queryable.Where(f => f.WorkStepId == input.WorkStepId.Value);
        }

        if (input.DocumentTypeId.HasValue)
        {
            queryable = queryable.Where(f => f.DocumentTypeId == input.DocumentTypeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(input.PeriodCode))
        {
            var period = input.PeriodCode.Trim();
            queryable = queryable.Where(f => f.PeriodCode == period);
        }

        if (input.Status.HasValue)
        {
            queryable = queryable.Where(f => f.Status == input.Status.Value);
        }

        if (input.DocumentFileIds is { Count: > 0 })
        {
            var ids = input.DocumentFileIds;
            queryable = queryable.Where(f => ids.Contains(f.Id));
        }

        if (input.UploadedAfter.HasValue)
        {
            // Belge tarihi değil YÜKLEME anı: "bu ay yüklenen" sayacı, geçmiş
            // tarihli bir faturayı bu ay yüklediğimizde de saymalı.
            var after = input.UploadedAfter.Value;
            queryable = queryable.Where(f => f.CreationTime >= after);
        }

        if (!string.IsNullOrWhiteSpace(input.Tag))
        {
            var tag = input.Tag.Trim().ToLowerInvariant();
            var tagQueryable = await _tagRepository.GetQueryableAsync();
            var fileTagQueryable = await _fileTagRepository.GetQueryableAsync();

            var taggedFileIds =
                from ft in fileTagQueryable
                join t in tagQueryable on ft.TagId equals t.Id
                where t.Name == tag
                select ft.DocumentFileId;

            queryable = queryable.Where(f => taggedFileIds.Contains(f.Id));
        }

        if (input.ExpiringWithinDays.HasValue)
        {
            var threshold = Clock.Now.Date.AddDays(input.ExpiringWithinDays.Value);
            queryable = queryable.Where(f => f.ExpiryDate != null && f.ExpiryDate <= threshold);
        }

        if (input.MissingRequiredFields == true)
        {
            var fieldQueryable = await _fieldRepository.GetQueryableAsync();
            var valueQueryable = await _fieldValueRepository.GetQueryableAsync();

            // Tipi olmayan belge de "eksik meta" sayılır — sınıflandırılmamış demektir.
            queryable = queryable.Where(f =>
                f.DocumentTypeId == null ||
                fieldQueryable.Any(fld =>
                    fld.DocumentTypeId == f.DocumentTypeId!.Value &&
                    fld.IsRequired &&
                    !valueQueryable.Any(v =>
                        v.DocumentFileId == f.Id &&
                        v.FieldId == fld.Id &&
                        (v.ValueText != null || v.ValueNumber != null || v.ValueDate != null))));
        }

        return queryable;
    }

    private static IQueryable<DocumentFile> ApplySorting(IQueryable<DocumentFile> queryable, string? sorting)
    {
        var normalized = (sorting ?? string.Empty).Trim();
        var descending = normalized.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);
        var field = normalized.Split(' ')[0].ToLowerInvariant();

        if (!AllowedSortFields.Contains(field))
        {
            // Varsayılan: en yeni belge üstte.
            return queryable.OrderByDescending(f => f.CreationTime);
        }

        return field switch
        {
            "displayname" => descending ? queryable.OrderByDescending(f => f.DisplayName) : queryable.OrderBy(f => f.DisplayName),
            "amount" => descending ? queryable.OrderByDescending(f => f.Amount) : queryable.OrderBy(f => f.Amount),
            "documentdate" => descending ? queryable.OrderByDescending(f => f.DocumentDate) : queryable.OrderBy(f => f.DocumentDate),
            "status" => descending ? queryable.OrderByDescending(f => f.Status) : queryable.OrderBy(f => f.Status),
            _ => descending ? queryable.OrderByDescending(f => f.CreationTime) : queryable.OrderBy(f => f.CreationTime),
        };
    }

    /// <summary>Klasör ve tüm alt klasörlerinin id'leri. Klasör sayısı küçük olduğu için bellekte yürünür.</summary>
    private async Task<List<Guid>> GetFolderSubtreeIdsAsync(Guid rootId)
    {
        var queryable = await _documentRepository.GetQueryableAsync();
        var all = await AsyncExecuter.ToListAsync(
            queryable.AsNoTracking().Select(d => new { d.Id, d.ParentDocumentId }));

        var childrenByParent = all
            .Where(x => x.ParentDocumentId.HasValue)
            .GroupBy(x => x.ParentDocumentId!.Value)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Id).ToList());

        var result = new List<Guid> { rootId };
        var queue = new Queue<Guid>();
        queue.Enqueue(rootId);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            if (!childrenByParent.TryGetValue(current, out var children))
            {
                continue;
            }

            foreach (var child in children)
            {
                result.Add(child);
                queue.Enqueue(child);
            }
        }

        return result;
    }

    private async Task<List<DocumentFileDto>> MapWithRelatedNamesAsync(List<DocumentFile> files)
    {
        var dtos = ObjectMapper.Map<List<DocumentFile>, List<DocumentFileDto>>(files);
        await FillRelatedNamesAsync(files, dtos);
        return dtos;
    }

    /// <summary>
    /// Sayfa sonucundaki tüm satırların ilişkili adlarını 6 toplu sorguyla doldurur.
    /// Satır başına sorgu açılmaz.
    /// </summary>
    private async Task FillRelatedNamesAsync(List<DocumentFile> files, List<DocumentFileDto> dtos)
    {
        if (files.Count == 0)
        {
            return;
        }

        var fileIds = files.Select(f => f.Id).ToList();

        var folderIds = files.Select(f => f.DocumentId).Distinct().ToList();
        var documentQueryable = await _documentRepository.GetQueryableAsync();
        var folderNames = (await AsyncExecuter.ToListAsync(
                documentQueryable.AsNoTracking().Where(d => folderIds.Contains(d.Id)).Select(d => new { d.Id, d.Title })))
            .ToDictionary(k => k.Id, v => v.Title);

        var typeIds = files.Where(f => f.DocumentTypeId.HasValue).Select(f => f.DocumentTypeId!.Value).Distinct().ToList();
        var typeQueryable = await _typeRepository.GetQueryableAsync();
        var types = await AsyncExecuter.ToListAsync(
            typeQueryable.AsNoTracking().Where(t => typeIds.Contains(t.Id)).Select(t => new { t.Id, t.Name, t.Code, t.Icon }));
        var typeById = types.ToDictionary(t => t.Id);

        var projectIds = files.Where(f => f.ProjectId.HasValue).Select(f => f.ProjectId!.Value).Distinct().ToList();
        var projectQueryable = await _projectRepository.GetQueryableAsync();
        var projectNames = (await AsyncExecuter.ToListAsync(
                projectQueryable.AsNoTracking().Where(p => projectIds.Contains(p.Id)).Select(p => new { p.Id, p.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        var stepIds = files.Where(f => f.WorkStepId.HasValue).Select(f => f.WorkStepId!.Value).Distinct().ToList();
        var stepQueryable = await _workStepRepository.GetQueryableAsync();
        var steps = await AsyncExecuter.ToListAsync(
            stepQueryable.AsNoTracking().Where(s => stepIds.Contains(s.Id)).Select(s => new { s.Id, s.Name, s.Order }));
        var stepById = steps.ToDictionary(s => s.Id);

        var attachmentIds = files.Where(f => f.LatestAttachmentId.HasValue).Select(f => f.LatestAttachmentId!.Value).Distinct().ToList();
        var attachmentQueryable = await _attachmentRepository.GetQueryableAsync();
        var attachments = await AsyncExecuter.ToListAsync(
            attachmentQueryable.AsNoTracking()
                .Where(a => attachmentIds.Contains(a.Id))
                .Select(a => new { a.Id, a.FileName, a.ContentType, a.FileSize, a.CreatorId }));
        var attachmentById = attachments.ToDictionary(a => a.Id);

        var uploaderIds = attachments.Where(a => a.CreatorId.HasValue).Select(a => a.CreatorId!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var userNames = (await AsyncExecuter.ToListAsync(
                userQueryable.AsNoTracking().Where(u => uploaderIds.Contains(u.Id)).Select(u => new { u.Id, u.UserName })))
            .ToDictionary(k => k.Id, v => v.UserName);

        var fileTagQueryable = await _fileTagRepository.GetQueryableAsync();
        var tagQueryable = await _tagRepository.GetQueryableAsync();
        var tagRows = await AsyncExecuter.ToListAsync(
            from ft in fileTagQueryable.AsNoTracking()
            join t in tagQueryable.AsNoTracking() on ft.TagId equals t.Id
            where fileIds.Contains(ft.DocumentFileId)
            select new { ft.DocumentFileId, t.Name });
        var tagsByFile = tagRows
            .GroupBy(x => x.DocumentFileId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Name).OrderBy(n => n).ToList());

        foreach (var dto in dtos)
        {
            dto.FolderName = folderNames.TryGetValue(dto.DocumentId, out var folderName) ? folderName : null;

            if (dto.DocumentTypeId.HasValue && typeById.TryGetValue(dto.DocumentTypeId.Value, out var type))
            {
                dto.DocumentTypeName = type.Name;
                dto.DocumentTypeCode = type.Code;
                dto.DocumentTypeIcon = type.Icon;
            }

            if (dto.ProjectId.HasValue && projectNames.TryGetValue(dto.ProjectId.Value, out var projectName))
            {
                dto.ProjectName = projectName;
            }

            if (dto.WorkStepId.HasValue && stepById.TryGetValue(dto.WorkStepId.Value, out var step))
            {
                dto.WorkStepName = step.Name;
                dto.WorkStepOrder = step.Order;
            }

            if (dto.LatestAttachmentId.HasValue && attachmentById.TryGetValue(dto.LatestAttachmentId.Value, out var attachment))
            {
                dto.FileName = attachment.FileName;
                dto.ContentType = attachment.ContentType;
                dto.FileSize = attachment.FileSize;
                dto.DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + attachment.Id;
                dto.UploaderName = attachment.CreatorId.HasValue && userNames.TryGetValue(attachment.CreatorId.Value, out var userName)
                    ? userName
                    : "Sistem";
            }

            dto.Tags = tagsByFile.TryGetValue(dto.Id, out var tags) ? tags : new List<string>();
        }
    }

    /// <summary>
    /// Tipin şeması + belgenin değerleri — değeri olmayan alanlar da boş olarak döner.
    ///
    /// Alan bazlı izinler BURADA uygulanır (Faz D): Hidden alanlar hiç dönmez,
    /// Masked alanların gerçek değeri DTO'ya konmaz. Maskelemeyi istemciye
    /// bırakmak, değeri zaten tel üzerinden göndermek demek olurdu.
    /// </summary>
    private async Task<List<DocumentFieldValueDto>> BuildFieldsAsync(DocumentFile file)
    {
        if (!file.DocumentTypeId.HasValue)
        {
            return new List<DocumentFieldValueDto>();
        }

        var typeId = file.DocumentTypeId.Value;

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var fields = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking()
                .Where(f => f.DocumentTypeId == typeId)
                .OrderBy(f => f.Order));

        var valueQueryable = await _fieldValueRepository.GetQueryableAsync();
        var values = await AsyncExecuter.ToListAsync(
            valueQueryable.AsNoTracking().Where(v => v.DocumentFileId == file.Id));
        var valueByField = values.ToDictionary(v => v.FieldId);

        var permissions = await _fieldPermissionRepository.GetListAsync(p => p.DocumentTypeId == typeId);
        var roles = CurrentUser.Roles ?? Array.Empty<string>();

        var result = new List<DocumentFieldValueDto>();

        foreach (var field in fields)
        {
            var level = DocumentFieldMasker.ResolveLevel(
                new MaskableField(field.Id, typeId, field.Visibility), roles, permissions);

            if (!DocumentFieldMasker.IsVisible(level))
            {
                continue;
            }

            var dto = new DocumentFieldValueDto
            {
                FieldId = field.Id,
                Key = field.Key,
                Label = field.Label,
                FieldType = field.FieldType,
                IsRequired = field.IsRequired,
                FillSource = field.FillSource,
                Visibility = field.Visibility,
                Order = field.Order,
                OptionsJson = field.OptionsJson,
                AccessLevel = level,
                IsMasked = DocumentFieldMasker.IsMasked(level),
                IsEditable = DocumentFieldMasker.IsEditable(level),
            };

            if (valueByField.TryGetValue(field.Id, out var value))
            {
                if (dto.IsMasked)
                {
                    // Gerçek değer DTO'ya HİÇ konmaz; yalnız biçimi korunmuş gösterim.
                    dto.MaskedDisplay = DocumentFieldMasker.MaskDisplay(
                        value.ValueText
                        ?? value.ValueNumber?.ToString(System.Globalization.CultureInfo.InvariantCulture)
                        ?? value.ValueDate?.ToString("dd.MM.yyyy"));
                }
                else
                {
                    dto.ValueText = value.ValueText;
                    dto.ValueNumber = value.ValueNumber;
                    dto.ValueDate = value.ValueDate;
                }

                dto.Confidence = value.Confidence;
                dto.FilledBy = value.FilledBy;
            }

            result.Add(dto);
        }

        return result;
    }

    private async Task<List<DocumentAttachmentDto>> BuildVersionsAsync(Guid documentFileId)
    {
        var attachments = await _attachmentRepository.GetListAsync(a => a.DocumentFileId == documentFileId);

        var uploaderIds = attachments.Where(a => a.CreatorId.HasValue).Select(a => a.CreatorId!.Value).Distinct().ToList();
        var userQueryable = await _identityRepository.GetQueryableAsync();
        var userNames = (await AsyncExecuter.ToListAsync(
                userQueryable.AsNoTracking().Where(u => uploaderIds.Contains(u.Id)).Select(u => new { u.Id, u.UserName })))
            .ToDictionary(k => k.Id, v => v.UserName);

        return attachments
            .OrderByDescending(a => a.VersionNumber)
            .Select(a => new DocumentAttachmentDto
            {
                Id = a.Id,
                CreationTime = a.CreationTime,
                DocumentId = a.DocumentId,
                FileName = a.FileName,
                ContentType = a.ContentType,
                FileSize = a.FileSize,
                DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + a.Id,
                UploaderName = a.CreatorId.HasValue && userNames.TryGetValue(a.CreatorId.Value, out var name) ? name : "Sistem",
                VersionGroupId = a.VersionGroupId,
                VersionNumber = a.VersionNumber,
                IsLatest = a.IsLatest
            }).ToList();
    }

    private async Task SaveFieldValuesAsync(DocumentFile file, List<DocumentFieldValueInputDto> inputs)
    {
        if (!file.DocumentTypeId.HasValue)
        {
            return;
        }

        var typeId = file.DocumentTypeId.Value;

        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var schemaFields = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking().Where(f => f.DocumentTypeId == typeId));

        // Yazma izni OKUMA ile aynı kaynaktan çözülür: düzenleyemediği bir alanı
        // istemci yine de gönderebilir — maskeleme yalnız görüntüde kalırsa
        // güvenlik sınırı olmaz.
        var permissions = await _fieldPermissionRepository.GetListAsync(p => p.DocumentTypeId == typeId);
        var roles = CurrentUser.Roles ?? Array.Empty<string>();

        var schemaById = schemaFields
            .Where(f => DocumentFieldMasker.IsEditable(
                DocumentFieldMasker.ResolveLevel(new MaskableField(f.Id, typeId, f.Visibility), roles, permissions)))
            .ToDictionary(f => f.Id);

        var existing = await _fieldValueRepository.GetListAsync(v => v.DocumentFileId == file.Id);
        var existingByField = existing.ToDictionary(v => v.FieldId);

        var toInsert = new List<DocumentFieldValue>();
        var toUpdate = new List<DocumentFieldValue>();

        foreach (var input in inputs)
        {
            // Şemaya ait olmayan alan id'si sessizce yok sayılır — istemci bayat şema göndermiş olabilir.
            if (!schemaById.ContainsKey(input.FieldId))
            {
                continue;
            }

            if (existingByField.TryGetValue(input.FieldId, out var value))
            {
                value.SetValue(input.ValueText, input.ValueNumber, input.ValueDate);
                toUpdate.Add(value);
            }
            else
            {
                var created = new DocumentFieldValue(
                    GuidGenerator.Create(), CurrentTenant.Id, file.Id, input.FieldId);
                created.SetValue(input.ValueText, input.ValueNumber, input.ValueDate);
                toInsert.Add(created);
            }
        }

        if (toInsert.Count > 0)
        {
            await _fieldValueRepository.InsertManyAsync(toInsert);
        }

        if (toUpdate.Count > 0)
        {
            await _fieldValueRepository.UpdateManyAsync(toUpdate);
        }
    }

    private async Task SaveTagsAsync(Guid documentFileId, List<string> tags)
    {
        var tagIds = await ResolveTagIdsAsync(tags, createMissing: true);

        var existing = await _fileTagRepository.GetListAsync(t => t.DocumentFileId == documentFileId);

        var toRemove = existing.Where(t => !tagIds.Contains(t.TagId)).ToList();
        if (toRemove.Count > 0)
        {
            await _fileTagRepository.DeleteManyAsync(toRemove);
        }

        var existingIds = existing.Select(t => t.TagId).ToHashSet();
        var toAdd = tagIds
            .Where(id => !existingIds.Contains(id))
            .Select(id => new DocumentFileTag(GuidGenerator.Create(), documentFileId, id))
            .ToList();

        if (toAdd.Count > 0)
        {
            await _fileTagRepository.InsertManyAsync(toAdd);
        }
    }

    /// <summary>Etiket adlarını id'lere çevirir; yoksa (ve isteniyorsa) oluşturur.</summary>
    private async Task<List<Guid>> ResolveTagIdsAsync(List<string> tags, bool createMissing)
    {
        var names = tags
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Select(t => t.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        if (names.Count == 0)
        {
            return new List<Guid>();
        }

        var existing = await _tagRepository.GetListAsync(t => names.Contains(t.Name));
        var result = existing.Select(t => t.Id).ToList();

        if (!createMissing)
        {
            return result;
        }

        var existingNames = existing.Select(t => t.Name).ToHashSet();
        var toCreate = names
            .Where(n => !existingNames.Contains(n))
            .Select(n => new DocumentTag(GuidGenerator.Create(), n, CurrentTenant.Id))
            .ToList();

        if (toCreate.Count > 0)
        {
            await _tagRepository.InsertManyAsync(toCreate);
            result.AddRange(toCreate.Select(t => t.Id));
        }

        return result;
    }

    /// <summary>
    /// Seçilen belge tipi bu kiracıya görünür mü? Sistem tipleri host'ta (TenantId = null)
    /// durduğu için kiracı filtresi kapatılıp sahiplik elle doğrulanır.
    /// </summary>
    private async Task EnsureTypeVisibleAsync(Guid documentTypeId)
    {
        var tenantId = CurrentTenant.Id;

        using (_mtFilter.Disable())
        {
            var queryable = await _typeRepository.GetQueryableAsync();
            var visible = await AsyncExecuter.AnyAsync(
                queryable.Where(t => t.Id == documentTypeId && (t.TenantId == null || t.TenantId == tenantId)));

            if (!visible)
            {
                throw new EntityNotFoundException(typeof(DocumentType), documentTypeId);
            }
        }
    }
}
