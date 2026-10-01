using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Manages forms (non-template AppDocuments) across their full lifecycle:
/// draft → published → archived, plus listing, statistics and CRUD.
/// </summary>
[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class FormAppService : PlatformAppService, IFormAppService
{
    private readonly IAppDocumentRepository _documentRepository;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly ILogger<FormAppService> _logger;
    private readonly FormChoiceProvider _choiceProvider;

    /// <summary>Yeniden yazılan alan ayarında Türkçe metin (ı, ş, ğ) \uXXXX kaçışına dönüşmesin.</summary>
    private static readonly JsonSerializerOptions RelaxedJson = new() { Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };

    public FormAppService(
        IAppDocumentRepository documentRepository,
        IRepository<AppResponse, Guid> responseRepository,
        ILogger<FormAppService> logger,
        FormChoiceProvider choiceProvider)
    {
        _documentRepository = documentRepository;
        _responseRepository = responseRepository;
        _logger = logger;
        _choiceProvider = choiceProvider;
    }

    public async Task<PagedResultDto<FormListItemDto>> GetListAsync(FormListFilterDto input)
    {
        var queryable = await _documentRepository.GetQueryableAsync();

        queryable = queryable.Where(d => !d.IsTemplate);

        if (input.Status.HasValue)
        {
            queryable = queryable.Where(d => d.Status == input.Status.Value);
        }

        if (input.CategoryId.HasValue)
        {
            queryable = queryable.Where(d => d.CategoryId == input.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(input.Filter))
        {
            var filter = input.Filter.Trim();
            queryable = queryable.Where(d => d.Title.Contains(filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(queryable);

        var query = queryable
            .OrderByDescending(d => d.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var items = await AsyncExecuter.ToListAsync(query);

        return new PagedResultDto<FormListItemDto>(
            totalCount,
            ObjectMapper.Map<List<AppDocument>, List<FormListItemDto>>(items));
    }

    public async Task<DocumentDto> GetAsync(Guid id)
    {
        var document = await _documentRepository.GetWithBlocksAsync(id);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Create)]
    public async Task<DocumentDto> CreateAsync(CreateUpdateFormDto input)
    {
        var document = new AppDocument(
            GuidGenerator.Create(),
            input.Title,
            GenerateSlugFromTitle(input.Title),
            isTemplate: false);

        document.SetDescription(input.Description);
        document.SetCategory(input.CategoryId);
        document.SetTheme(input.ThemeJson);

        ApplyBlocks(document, input.Blocks);

        await _documentRepository.InsertAsync(document, autoSave: true);

        _logger.LogInformation("Form oluşturuldu. FormId: {FormId}, Title: {Title}", document.Id, document.Title);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<DocumentDto> UpdateAsync(Guid id, CreateUpdateFormDto input)
    {
        var document = await _documentRepository.GetAsync(id);

        document.SetTitle(input.Title);
        document.SetDescription(input.Description);
        document.SetCategory(input.CategoryId);
        document.SetTheme(input.ThemeJson);

        await _documentRepository.UpdateAsync(document, autoSave: true);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Edit)]
    public async Task<DocumentDto> UpdateBlocksAsync(Guid id, UpdateFormBlocksDto input)
    {
        var document = await _documentRepository.GetWithBlocksAsync(id);

        // Yanıtlar alan kimliğiyle saklanır (yanıt ekranı, rapor dışa aktarımı, webhook). Hepsini
        // silip yeniden eklemek her kayıtta kimlikleri değiştirir ve eski yanıtları sorularından
        // koparırdı: kimliği gelen alan YERİNDE güncellenir. Listede olmayan alan yalnız
        // RemovedBlockIds'te bildirildiyse silinir; yüklenemeyen editör ya da bayat sekme başkasının
        // sorusunu silmesin diye bildirilmemiş silmede hiçbir şey yazılmadan reddedilir.
        var keptIds = input.Blocks.Where(b => b.Id.HasValue).Select(b => b.Id!.Value).ToHashSet();
        document.RemoveBlocksNotIn(keptIds, input.RemovedBlockIds);

        ApplyBlocks(document, input.Blocks);

        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation(
            "Form blokları güncellendi. FormId: {FormId}, BlockCount: {BlockCount}",
            document.Id, input.Blocks.Count);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await _documentRepository.DeleteAsync(id);
        _logger.LogInformation("Form silindi. FormId: {FormId}", id);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> PublishAsync(Guid id, PublishFormDto input)
    {
        var document = await _documentRepository.GetAsync(id);

        if (!string.IsNullOrWhiteSpace(input.Slug))
        {
            document.SetSlug(input.Slug.Trim());
        }

        document.SetPublishSettings(input.PublishSettingsJson);
        document.Publish();

        await _documentRepository.UpdateAsync(document, autoSave: true);

        _logger.LogInformation("Form yayınlandı. FormId: {FormId}, Slug: {Slug}", document.Id, document.Slug);

        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> ArchiveAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        document.Archive();
        await _documentRepository.UpdateAsync(document, autoSave: true);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.Publish)]
    public async Task<DocumentDto> MoveToDraftAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);
        document.MoveToDraft();
        await _documentRepository.UpdateAsync(document, autoSave: true);
        return ObjectMapper.Map<AppDocument, DocumentDto>(document);
    }

    [Authorize(PlatformPermissions.DynamicAssets.ViewResponses)]
    public async Task<FormStatisticsDto> GetStatisticsAsync(Guid id)
    {
        var document = await _documentRepository.GetAsync(id);

        // Host formuna kiracıların verdiği yanıtlar o kiracılarda durur; host'un sayımı süzgeç kapalı
        // yapılır. Form kimliği tekil olduğundan başka formun yanıtı sayılmaz.
        using var _ = CurrentTenant.Id is null ? DataFilter.Disable<IMultiTenant>() : NullDisposable.Instance;
        var responseQueryable = await _responseRepository.GetQueryableAsync();
        responseQueryable = responseQueryable.Where(r => r.DocumentId == id);

        var todayUtc = DateTime.UtcNow.Date;

        var todayCount = await AsyncExecuter.CountAsync(
            responseQueryable.Where(r => r.CreationTime >= todayUtc));

        var pendingCount = await AsyncExecuter.CountAsync(
            responseQueryable.Where(r => r.Status == ResponseStatus.Pending));

        return new FormStatisticsDto
        {
            ViewCount = document.ViewCount,
            ResponseCount = document.ResponseCount,
            TodayResponseCount = todayCount,
            PendingResponseCount = pendingCount
        };
    }

    public async Task<List<FormChoiceDto>> GetChoicesAsync(string source)
    {
        return await _choiceProvider.GetChoicesAsync(source) ?? new List<FormChoiceDto>();
    }

    /// <summary>
    /// 16a · Veri kaynakları kataloğu. Kullanım sayısı bulunulan bağlamdaki formlardan sayılır; aynı formda
    /// aynı kaynağa bağlı iki alan varsa form BİR kez sayılır.
    /// </summary>
    public async Task<List<FormChoiceSourceDto>> GetChoiceSourcesAsync()
    {
        var query = (await _documentRepository.GetQueryableAsync())
            .Where(d => !d.IsTemplate)
            .Select(d => d.Blocks
                .Where(b => b.Type == BlockType.Dropdown)
                .Select(b => b.Settings)
                .ToList());

        var usage = new Dictionary<string, int>();
        foreach (var settings in await AsyncExecuter.ToListAsync(query))
        {
            var used = settings
                .Select(s => FormChoiceProvider.SourceOf(BlockType.Dropdown, s))
                .Where(s => s != null)
                .Distinct();
            foreach (var source in used)
            {
                usage[source!] = usage.GetValueOrDefault(source!) + 1;
            }
        }

        var catalog = new List<FormChoiceSourceDto>();
        foreach (var source in _choiceProvider.Sources.OrderBy(s => s.Key, StringComparer.Ordinal))
        {
            catalog.Add(new FormChoiceSourceDto
            {
                Key = source.Key,
                Scope = source.Scope,
                DependsOnSourceKey = source.DependsOnSourceKey,
                // Firma kapsamlı kaynakta tek bir sayı yok (her firmada başka); kaynak null döndürür.
                RecordCount = await source.CountAsync(),
                UsedInFormCount = usage.GetValueOrDefault(source.Key),
                Flags = source.Flags.ToList()
            });
        }

        return catalog;
    }

    /// <summary>
    /// Kaydedilen alanları forma uygular: kimliği formda olan alan YERİNDE güncellenir, formda olmayan ya da
    /// aynı istekte ikinci kez gelen kimlik yeni alan sayılır. Yeni alanın kimliği önceden üretilir; aynı
    /// istekteki koşul (visibleWhen.blockId) ve zincir (dependsOn) ayarları, alanın düzenleyicideki geçici
    /// kimliğini (ClientId) ya da formda olmayan eski kimliğini gösteriyorsa yeni kimliğe çevrilir. Böylece
    /// ilk kayıtta kurulan koşul, ikinci bir kayda gerek kalmadan kalıcı alana bağlanır.
    /// </summary>
    private void ApplyBlocks(AppDocument document, IEnumerable<CreateBlockDto> blocks)
    {
        var existing = document.Blocks.Select(b => b.Id).ToHashSet();
        var updated = new HashSet<Guid>();
        var refs = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);
        var plan = new List<(CreateBlockDto Dto, Guid Id, bool IsNew)>();

        foreach (var dto in blocks.OrderBy(b => b.Order))
        {
            if (dto.Id is { } id && existing.Contains(id) && updated.Add(id))
            {
                plan.Add((dto, id, false));
                continue;
            }

            // Formda VAR olan kimliğin ikinci kopyası anahtar olmaz: orijinale bağlı ayarlar kopyaya kaymasın.
            var newId = GuidGenerator.Create();
            var key = dto.ClientId ?? (dto.Id is { } stale && !existing.Contains(stale) ? stale.ToString() : null);
            if (key != null)
            {
                refs.TryAdd(key, newId);
            }

            plan.Add((dto, newId, true));
        }

        foreach (var (dto, id, isNew) in plan)
        {
            var settings = RemapBlockReferences(dto.Settings, refs);
            if (isNew)
            {
                document.AddBlock(id, dto.Type, dto.Order, dto.Content, settings, dto.AgentContext);
            }
            else
            {
                document.UpdateBlock(id, dto.Type, dto.Order, dto.Content, settings, dto.AgentContext);
            }
        }
    }

    /// <summary>
    /// Ayardaki alan referanslarını (kökteki dependsOn ve visibleWhen.blockId) eşlemeye göre yeni kimliğe
    /// çevirir. Eşleşme yoksa ya da ayar JSON nesnesi değilse ayar AYNEN döner.
    /// </summary>
    private static string RemapBlockReferences(string settings, IReadOnlyDictionary<string, Guid> refs)
    {
        if (refs.Count == 0 || string.IsNullOrWhiteSpace(settings))
        {
            return settings;
        }

        JsonNode? root;
        try
        {
            root = JsonNode.Parse(settings);
        }
        catch (JsonException)
        {
            return settings;
        }

        if (root is not JsonObject obj)
        {
            return settings;
        }

        var changed = false;
        if (obj[FormChoiceSources.DependsOnSetting] is JsonValue dependsOn
            && dependsOn.TryGetValue<string>(out var parentKey)
            && refs.TryGetValue(parentKey, out var parentId))
        {
            obj[FormChoiceSources.DependsOnSetting] = parentId.ToString();
            changed = true;
        }

        if (obj[FormChoiceSources.VisibleWhenSetting] is JsonObject rule
            && rule["blockId"] is JsonValue blockId
            && blockId.TryGetValue<string>(out var ruleKey)
            && refs.TryGetValue(ruleKey, out var ruleId))
        {
            rule["blockId"] = ruleId.ToString();
            changed = true;
        }

        return changed ? obj.ToJsonString(RelaxedJson) : settings;
    }

    /// <summary>
    /// Generates a URL-friendly slug from a title with a short unique suffix.
    /// </summary>
    private string GenerateSlugFromTitle(string title)
    {
        var baseSlug = title
            .Trim()
            .ToLowerInvariant()
            .Replace(' ', '-')
            .Replace("ş", "s")
            .Replace("ç", "c")
            .Replace("ğ", "g")
            .Replace("ı", "i")
            .Replace("ö", "o")
            .Replace("ü", "u");

        var suffix = Guid.NewGuid().ToString("N")[..6];
        return $"{baseSlug}-{suffix}";
    }
}
