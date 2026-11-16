using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;
using Apya.Platform.Documents;
using Apya.Platform.Features;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Storage;
using Apya.Platform.Tenants;

namespace Apya.Platform.Grants;

/// <summary>
/// Belgeden kurum verisi okuma (veri zenginleştirme 6. adım).
///
/// <para>Akış: aydınlatma metni onayı → belge Belge Merkezi'nde kurumun "Kurumsal" klasörüne →
/// metin sayfa sayfa okunur → yapay zekâ belgeden okunabilen parametreler için değer önerir →
/// kurum her öneriye karar verir. Okunamayan belge ve yapay zekâ hatası istisna değil
/// kayıttaki durumdur; belge yine Belge Merkezi'nde kalır.</para>
///
/// <para>Yetki: kurum verisini yazan kişi (<c>TenantSettings</c>). Okutmak ayrıca belge yükleme
/// iznini ve paketin yapay zekâ özelliğini ister (Premium/Enterprise).</para>
///
/// <para>🔴 Uzaktan ÇAĞRILAMAZ: saklanan dosya adını çağırandan alır.</para>
/// </summary>
[Authorize]
[RemoteService(IsEnabled = false)]
public class FirmDataExtractionAppService : PlatformAppService, IFirmDataExtractionAppService
{
    /// <summary>Kurumsal belgelerin kiracı kökündeki klasörü.</summary>
    public const string FolderTitle = "Kurumsal";

    private readonly IRepository<FirmDataExtraction, Guid> _extractionRepository;
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly IRepository<FirmProfile, Guid> _profileRepository;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IDocumentAppService _documentAppService;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;
    private readonly FirmDocumentTextReader _textReader;
    private readonly FirmDataExtractionManager _manager;

    public FirmDataExtractionAppService(
        IRepository<FirmDataExtraction, Guid> extractionRepository,
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<FirmParameterValue, Guid> valueRepository,
        IRepository<FirmProfile, Guid> profileRepository,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        IRepository<Document, Guid> folderRepository,
        IDocumentAppService documentAppService,
        IUploadedFileRootFolderProvider rootFolderProvider,
        FirmDocumentTextReader textReader,
        FirmDataExtractionManager manager)
    {
        _extractionRepository = extractionRepository;
        _definitionRepository = definitionRepository;
        _valueRepository = valueRepository;
        _profileRepository = profileRepository;
        _tenantProfileRepository = tenantProfileRepository;
        _folderRepository = folderRepository;
        _documentAppService = documentAppService;
        _rootFolderProvider = rootFolderProvider;
        _textReader = textReader;
        _manager = manager;
    }

    // Belgeler ve yapay zekâ paketin özellikleridir; izinler paket kapalıysa zaten reddedilir.
    public virtual async Task<bool> CanExtractAsync()
        => CurrentTenant.Id != null
           && LazyServiceProvider.LazyGetService<IFirmDataExtractionAi>() != null
           && await FeatureChecker.IsEnabledAsync(PlatformFeatures.AiAssist)
           && await AuthorizationService.IsGrantedAsync(PlatformPermissions.TenantSettings.Default)
           && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Default)
           && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Edit);

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    [Authorize(PlatformPermissions.Documents.Default)]
    [Authorize(PlatformPermissions.Documents.Edit)]
    public virtual async Task<FirmDataExtractionDto> ExtractAsync(ExtractFirmDataInput input)
    {
        RequireTenant();
        if (!input.ConsentGiven)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmDataExtractionConsentRequired);
        }
        if (!FirmDocumentTextReader.IsSupported(input.FileName))
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmDataExtractionFileTypeNotSupported);
        }
        var ai = LazyServiceProvider.LazyGetService<IFirmDataExtractionAi>();
        if (ai == null || !await FeatureChecker.IsEnabledAsync(PlatformFeatures.AiAssist))
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmDataExtractionUnavailable);
        }

        var attachment = await _documentAppService.AddAttachmentAsync(
            await ResolveFolderAsync(), input.FileName, input.StoredFileName, input.ContentType, input.FileSize);

        // Onay, belge okunmadan ÖNCE kayda geçer: okuma düşse de iz kalır.
        var extraction = new FirmDataExtraction(
            GuidGenerator.Create(), CurrentTenant.Id, attachment.DocumentFileId, attachment.Id,
            input.FileName, CurrentUser.GetId(), Clock.Now);
        await _extractionRepository.InsertAsync(extraction, autoSave: true);

        var text = ReadText(input.StoredFileName, input.FileName);
        if (text.IsEmpty)
        {
            extraction.MarkUnreadable();
        }
        else
        {
            var candidates = FirmDataExtractionManager.SelectCandidates(
                await _definitionRepository.GetListAsync(), await OrganizationTypeAsync());
            try
            {
                var proposals = candidates.Count == 0
                    ? Array.Empty<FirmDataProposal>()
                    : await ai.ProposeAsync(extraction.Id, text.Pages, candidates);
                _manager.Complete(extraction, candidates, text.Pages, proposals, text.PageCount, text.IsTruncated);
            }
            catch (BusinessException ex)
            {
                // Kota, sağlayıcı ya da geçersiz yanıt: kurum nedenini görür, belge yerinde kalır.
                Logger.LogWarning(ex, "Kurum belgesi yapay zekâyla okunamadı. Okuma: {ExtractionId}", extraction.Id);
                extraction.MarkFailed(ErrorText(ex));
            }
        }

        await _extractionRepository.UpdateAsync(extraction, autoSave: true);
        return await MapAsync(extraction, withSuggestions: true);
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public virtual async Task<List<FirmDataExtractionDto>> GetListAsync()
    {
        RequireTenant();
        var extractions = await AsyncExecuter.ToListAsync((await _extractionRepository.WithDetailsAsync(x => x.Suggestions))
            .OrderByDescending(x => x.CreationTime));

        var result = new List<FirmDataExtractionDto>();
        foreach (var extraction in extractions)
        {
            result.Add(await MapAsync(extraction, withSuggestions: false));
        }
        return result;
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public virtual async Task<FirmDataExtractionDto> GetAsync(Guid id)
    {
        RequireTenant();
        return await MapAsync(await LoadAsync(id), withSuggestions: true);
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public virtual async Task<FirmDataExtractionDto> AcceptAsync(Guid id, Guid suggestionId, string? editedRawValue = null)
    {
        RequireTenant();
        var extraction = await LoadAsync(id);
        await _manager.AcceptAsync(extraction, suggestionId, editedRawValue, CurrentUser.Id);
        await _extractionRepository.UpdateAsync(extraction, autoSave: true);
        return await MapAsync(extraction, withSuggestions: true);
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public virtual async Task<FirmDataExtractionDto> RejectAsync(Guid id, Guid suggestionId)
    {
        RequireTenant();
        var extraction = await LoadAsync(id);
        _manager.Reject(extraction, suggestionId, CurrentUser.Id);
        await _extractionRepository.UpdateAsync(extraction, autoSave: true);
        return await MapAsync(extraction, withSuggestions: true);
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    private FirmDocumentText ReadText(string storedFileName, string fileName)
    {
        var path = _rootFolderProvider.ResolveSafePath(storedFileName);
        if (path == null || !File.Exists(path))
        {
            return new FirmDocumentText(Array.Empty<FirmDocumentPage>(), null, false);
        }
        using var stream = File.OpenRead(path);
        return _textReader.Read(stream, fileName);
    }

    /// <summary>Kiracı kökündeki "Kurumsal" klasörü; yoksa açılır.</summary>
    private async Task<Guid> ResolveFolderAsync()
    {
        var folderId = await AsyncExecuter.FirstOrDefaultAsync((await _folderRepository.GetQueryableAsync()).AsNoTracking()
            .Where(d => d.ProjectId == null && d.ParentDocumentId == null && d.Title == FolderTitle)
            .OrderBy(d => d.CreationTime)
            .Select(d => (Guid?)d.Id));
        if (folderId != null)
        {
            return folderId.Value;
        }

        var folder = new Document(GuidGenerator.Create(), CurrentTenant.Id, FolderTitle, string.Empty, null, icon: "📁");
        await _folderRepository.InsertAsync(folder, autoSave: true);
        return folder.Id;
    }

    /// <summary>Kurumsal Veriler ekranıyla aynı kural: hibe profilindeki tür, yoksa kurum profilindeki.</summary>
    private async Task<OrganizationType?> OrganizationTypeAsync()
    {
        var profile = await _profileRepository.FirstOrDefaultAsync();
        if (profile != null)
        {
            return profile.Type;
        }

        var tenantId = CurrentTenant.Id;
        using (CurrentTenant.Change(null))
        {
            var tenantProfile = await _tenantProfileRepository.FirstOrDefaultAsync(p => p.TenantId == tenantId);
            return tenantProfile?.CompanyType.ToOrganizationType();
        }
    }

    private async Task<FirmDataExtraction> LoadAsync(Guid id)
        => await AsyncExecuter.FirstOrDefaultAsync((await _extractionRepository.WithDetailsAsync(x => x.Suggestions))
               .Where(x => x.Id == id))
           ?? throw new Volo.Abp.Domain.Entities.EntityNotFoundException(typeof(FirmDataExtraction), id);

    private string ErrorText(BusinessException ex)
    {
        var text = ex.Code == null ? null : L[ex.Code];
        return text == null || text.ResourceNotFound ? L["FirmDataExtraction:AiFailed"] : text.Value;
    }

    private async Task<FirmDataExtractionDto> MapAsync(FirmDataExtraction extraction, bool withSuggestions)
    {
        var dto = new FirmDataExtractionDto
        {
            Id = extraction.Id,
            FileName = extraction.FileName,
            DocumentFileId = extraction.DocumentFileId,
            DownloadUrl = "/Documents?handler=DownloadAttachment&attachmentId=" + extraction.DocumentAttachmentId,
            CreationTime = extraction.CreationTime,
            ConsentedAt = extraction.ConsentedAt,
            Status = extraction.Status,
            Error = extraction.Error,
            PageCount = extraction.PageCount,
            IsTruncated = extraction.IsTruncated,
            SuggestionCount = extraction.Suggestions.Count,
            PendingCount = extraction.PendingCount
        };
        if (!withSuggestions || extraction.Suggestions.Count == 0)
        {
            return dto;
        }

        var definitionIds = extraction.Suggestions.Select(s => s.DefinitionId).Distinct().ToList();
        var definitions = (await _definitionRepository.GetListAsync(d => definitionIds.Contains(d.Id))).ToDictionary(d => d.Id);
        var values = (await _valueRepository.GetListAsync(v => definitionIds.Contains(v.DefinitionId))).ToDictionary(v => v.DefinitionId);

        foreach (var suggestion in extraction.Suggestions)
        {
            // Tanım sonradan (yumuşak) silinmiş olabilir: öneri gösterilmez.
            if (!definitions.TryGetValue(suggestion.DefinitionId, out var definition))
            {
                continue;
            }
            values.TryGetValue(definition.Id, out var current);

            dto.Suggestions.Add(new FirmDataSuggestionDto
            {
                Id = suggestion.Id,
                DefinitionId = definition.Id,
                Code = definition.Code,
                Name = definition.Name,
                DataType = definition.DataType,
                Options = definition.GetOptions().ToList(),
                RawValue = suggestion.RawValue,
                Confidence = suggestion.Confidence,
                Page = suggestion.Page,
                Excerpt = suggestion.Excerpt,
                Status = suggestion.Status,
                AcceptedRawValue = suggestion.AcceptedRawValue,
                DecidedAt = suggestion.DecidedAt,
                HasCurrentValue = current != null,
                CurrentRawValue = current == null ? null : FirmParameterRawValue.Format(definition, current),
                CurrentSource = current?.Source
            });
        }

        // Karar bekleyenler başta, sonra tanım sırası.
        dto.Suggestions = dto.Suggestions
            .OrderBy(s => s.Status == FirmDataSuggestionStatus.Beklemede ? 0 : 1)
            .ThenBy(s => definitions[s.DefinitionId].Group)
            .ThenBy(s => definitions[s.DefinitionId].Order)
            .ToList();
        return dto;
    }

    private void RequireTenant()
    {
        if (CurrentTenant.Id == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterTenantRequired);
        }
    }
}
