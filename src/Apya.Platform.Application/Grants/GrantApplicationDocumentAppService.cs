using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 2b · İki taraflı evrak takibi.
///
/// <para>Kontrol listesi çağrının evrak şablonundan TÜRETİLİR ve ilk okumada
/// oluşturulur; ad/sorumluluk oraya KOPYALANIR. Program şartı sonradan değişse
/// bile başvurunun o günkü yükümlülüğü değişmemelidir.</para>
///
/// <para>İNCELEME YALNIZ DANIŞMANDA: firma kendi yüklediği evrakı onaylayamaz.
/// Rol <see cref="ICurrentTenant"/>'tan türetilir, istemciden gelmez.</para>
///
/// <para>Dosya baytları burada DEĞİL: depolama Web katmanındadır. Bu servis
/// yalnız diskteki adı kaydeder ve okur.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantApplicationDocumentAppService : ApplicationService, IGrantApplicationDocumentAppService
{
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationDocumentVersion, Guid> _versionRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _requirementRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly NotificationManager _notificationManager;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantApplicationDocumentAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationDocumentVersion, Guid> versionRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantDocumentRequirement, Guid> requirementRepo,
        IIdentityUserRepository userRepo,
        NotificationManager notificationManager,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _appRepo = appRepo;
        _docRepo = docRepo;
        _versionRepo = versionRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _requirementRepo = requirementRepo;
        _userRepo = userRepo;
        _notificationManager = notificationManager;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
        _notifyDispatcher = notifyDispatcher;
    }

    private GrantPartyRole ViewerRole =>
        _currentTenant.Id == null ? GrantPartyRole.Danisman : GrantPartyRole.Firma;

    private Guid ViewerUserId => CurrentUser.GetId();

    private string ViewerName =>
        CurrentUser.Name.IsNullOrWhiteSpace()
            ? (CurrentUser.UserName ?? "?")
            : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim();

    public async Task<GrantDocumentConsoleDto> GetAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        await EnsureChecklistAsync(application);
        return await BuildAsync(application);
    }

    public async Task<GrantDocumentConsoleDto> RegisterVersionAsync(RegisterGrantDocumentVersionInput input)
    {
        var document = await GetDocumentAsync(input.DocumentId);
        var application = await GetEditableApplicationAsync(document.GrantApplicationId);

        document.RegisterUpload();
        await _docRepo.UpdateAsync(document, autoSave: true);

        await _versionRepo.InsertAsync(new GrantApplicationDocumentVersion(
            GuidGenerator.Create(), document.TenantId, document.Id, document.LatestVersionNo,
            input.StoredFileName, input.OriginalFileName, input.SizeBytes,
            ViewerUserId, ViewerName, ViewerRole, input.Note), autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantDocumentConsoleDto> ApproveAsync(ReviewGrantDocumentInput input)
    {
        var document = await GetDocumentAsync(input.DocumentId);
        var application = await GetEditableApplicationAsync(document.GrantApplicationId);
        EnsureCanReview();

        document.Approve(input.Note);
        await _docRepo.UpdateAsync(document, autoSave: true);
        return await BuildAsync(application);
    }

    public async Task<GrantDocumentConsoleDto> RequestRevisionAsync(RequestGrantDocumentRevisionInput input)
    {
        var document = await GetDocumentAsync(input.DocumentId);
        var application = await GetEditableApplicationAsync(document.GrantApplicationId);
        EnsureCanReview();

        document.RequestRevision(input.Note);
        await _docRepo.UpdateAsync(document, autoSave: true);

        // 6d · Revizyon isteği firmaya duyurulur. Danışman isteği yazdı ama firma
        // ekranı açmadan haberi olmazdı; evrak beklerken en pahalı gecikme bu.
        await NotifyFirmAsync(application, GrantNotificationTrigger.DocumentRevisionRequested,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = (await GetCatalogAsync(application)).Grant.Name,
                ["{evrak_adı}"] = document.Name,
                ["{danışman_notu}"] = input.Note
            });

        return await BuildAsync(application);
    }

    private Task NotifyFirmAsync(
        GrantApplication application,
        GrantNotificationTrigger trigger,
        Dictionary<string, string?> values)
        => _notifyDispatcher.DispatchToTenantAsync(
            trigger, application.TenantId, values, nameof(GrantApplication), application.Id);

    public async Task<GrantDocumentConsoleDto> AddAsync(AddGrantDocumentInput input)
    {
        var application = await GetEditableApplicationAsync(input.ApplicationId);
        var existing = await ReadDocumentsAsync(application.Id);

        await _docRepo.InsertAsync(new GrantApplicationDocument(
            GuidGenerator.Create(), application.TenantId, application.Id,
            requirementId: null, input.Name,
            // Şablon dışı evrak KOŞULLU sayılır: kurum istemiş olabilir ama programın
            // zorunlu listesinde yoktur; gönderim paketini bloke etmemeli.
            GrantDocumentObligation.Kosullu, input.UploaderParty,
            requiresESignature: false,
            order: existing.Count == 0 ? 0 : existing.Max(d => d.Order) + 1), autoSave: true);

        return await BuildAsync(application);
    }

    public async Task<GrantDocumentReminderResultDto> SendReminderAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        var documents = await ReadDocumentsAsync(application.Id);

        // Hatırlatma KARŞI tarafa gider: kendi eksiğini kendine hatırlatmanın anlamı yok.
        var otherParty = ViewerRole == GrantPartyRole.Firma ? GrantPartyRole.Danisman : GrantPartyRole.Firma;
        var missing = documents
            .Where(d => d.UploaderParty == otherParty
                        && d.Obligation == GrantDocumentObligation.Zorunlu
                        && d.Status != GrantDocumentStatus.Onaylandi)
            .ToList();

        var result = new GrantDocumentReminderResultDto { MissingCount = missing.Count };
        if (missing.Count == 0)
        {
            return result;
        }

        var (call, grant) = await GetCatalogAsync(application);

        // 6d · Elle gönderilen hatırlatma da otomatik olanla AYNI şablonu kullanır:
        // aynı olayın iki farklı metinle gitmesi kullanıcı için tutarsızlık olurdu.
        // Tür de düzeltildi — daha önce "hibe önerisi" tipiyle gidiyordu, yani
        // bildirim listesinde ödül ikonuyla çıkıp katalog sayfasına götürüyordu.
        var values = new Dictionary<string, string?>
        {
            ["{çağrı_adı}"] = grant.Name,
            ["{eksik_evrak_sayısı}"] = missing.Count.ToString(),
            ["{son_tarih}"] = call.Deadline?.ToString("dd.MM.yyyy"),
            ["{kalan_gün}"] = call.Deadline.HasValue
                ? Math.Max(0, (call.Deadline.Value.Date - Clock.Now.Date).Days).ToString()
                : null
        };

        // Firmadan danışmana giden hatırlatma host kullanıcılarına, danışmandan
        // firmaya giden ise kiracı kullanıcılarına düşer.
        var targetTenantId = otherParty == GrantPartyRole.Firma ? application.TenantId : null;
        using (_currentTenant.Change(targetTenantId))
        {
            var userIds = (await _userRepo.GetListAsync())
                .Where(u => u.IsActive).Select(u => u.Id).ToList();

            if (await _notifyDispatcher.DispatchAsync(
                    GrantNotificationTrigger.DocumentDeadlineNear, userIds, values,
                    nameof(GrantApplication), application.Id))
            {
                result.NotifiedUserCount = userIds.Count;
            }
        }

        return result;
    }

    public async Task<GrantDocumentFileRefDto> GetFileRefAsync(Guid versionId)
    {
        var version = await _versionRepo.FirstOrDefaultAsync(v => v.Id == versionId)
                      ?? throw new EntityNotFoundException(typeof(GrantApplicationDocumentVersion), versionId);

        // Erişim kontrolü: sürümün bağlı olduğu başvuru okunabiliyor mu?
        var document = await GetDocumentAsync(version.DocumentId);
        await GetApplicationAsync(document.GrantApplicationId);

        return new GrantDocumentFileRefDto
        {
            StoredFileName = version.StoredFileName,
            OriginalFileName = version.OriginalFileName
        };
    }

    public async Task<GrantDocumentPackageContentDto> GetPackageContentAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        var (_, grant) = await GetCatalogAsync(application);
        var documents = (await ReadDocumentsAsync(application.Id))
            .OrderBy(d => d.Order).ToList();
        var versions = await GetVersionsAsync(documents);

        var approved = documents.Where(d => d.Status == GrantDocumentStatus.Onaylandi).ToList();
        var entries = new List<GrantDocumentPackageEntryDto>();
        var index = 1;

        foreach (var document in approved)
        {
            var latest = versions
                .Where(v => v.DocumentId == document.Id)
                .OrderByDescending(v => v.VersionNo)
                .FirstOrDefault();
            if (latest == null) { continue; }

            var extension = System.IO.Path.GetExtension(latest.OriginalFileName);
            entries.Add(new GrantDocumentPackageEntryDto
            {
                StoredFileName = latest.StoredFileName,
                // Kurumun beklediği isimlendirme: sıra numarası + evrak adı.
                EntryName = $"{index:00}-{Sanitize(document.Name)}{extension}"
            });
            index++;
        }

        var missing = documents.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                           && d.Status != GrantDocumentStatus.Onaylandi);

        return new GrantDocumentPackageContentDto
        {
            ApplicationId = application.Id,
            GrantName = grant.Name,
            IsComplete = missing == 0 && entries.Count > 0,
            MissingMandatoryCount = missing,
            Entries = entries
        };
    }

    public async Task<GrantDocumentFileRefDto> GetPackageRefAsync(Guid applicationId)
    {
        var application = await GetApplicationAsync(applicationId);
        if (application.PackageStoredFileName.IsNullOrWhiteSpace())
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantDocumentPackageIncomplete);
        }

        var (_, grant) = await GetCatalogAsync(application);
        return new GrantDocumentFileRefDto
        {
            StoredFileName = application.PackageStoredFileName!,
            OriginalFileName = $"{Sanitize(grant.Name)}-basvuru-paketi.zip"
        };
    }

    public async Task<GrantDocumentConsoleDto> RegisterPackageAsync(RegisterGrantDocumentPackageInput input)
    {
        var application = await GetApplicationAsync(input.ApplicationId);
        application.SetPackage(input.StoredFileName, Clock.Now);
        await _appRepo.UpdateAsync(application, autoSave: true);
        return await BuildAsync(application);
    }

    // ------------------------------------------------------------------ yardımcılar

    /// <summary>Dosya adında sorun çıkarabilecek karakterleri temizler.</summary>
    private static string Sanitize(string name)
    {
        var invalid = System.IO.Path.GetInvalidFileNameChars();
        var cleaned = new string(name.Select(c => invalid.Contains(c) ? '-' : c).ToArray());
        return cleaned.Trim().Replace(' ', '-');
    }

    private void EnsureCanReview()
    {
        if (ViewerRole != GrantPartyRole.Danisman)
        {
            // Firma kendi yüklediği evrakı onaylayamaz — inceleme danışmanın işi.
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        if (_currentTenant.Id == null)
        {
            using (_mtFilter.Disable())
            {
                return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
                       ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
            }
        }

        return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
               ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
    }

    private async Task<GrantApplication> GetEditableApplicationAsync(Guid id)
    {
        var application = await GetApplicationAsync(id);
        if (application.SubmittedAt.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantApplicationLocked);
        }
        return application;
    }

    private async Task<GrantApplicationDocument> GetDocumentAsync(Guid id)
    {
        if (_currentTenant.Id == null)
        {
            using (_mtFilter.Disable())
            {
                return await _docRepo.FirstOrDefaultAsync(d => d.Id == id)
                       ?? throw new EntityNotFoundException(typeof(GrantApplicationDocument), id);
            }
        }

        return await _docRepo.FirstOrDefaultAsync(d => d.Id == id)
               ?? throw new EntityNotFoundException(typeof(GrantApplicationDocument), id);
    }

    private async Task<(GrantCall Call, Grant Grant)> GetCatalogAsync(GrantApplication application)
    {
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                           c => c.Id == application.GrantCallId && c.TenantId == null)
                       ?? throw new EntityNotFoundException(typeof(GrantCall), application.GrantCallId);
            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                        ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);
            return (call, grant);
        }
    }

    /// <summary>
    /// Başvurunun evrak satırları.
    ///
    /// <para>🔴 Danışman HOST bağlamında çalışır, evrak satırları ise KİRACIYA aittir.
    /// Filtre açık okunursa host tarafında liste BOŞ döner: ekran boş görünür ve daha
    /// kötüsü <see cref="EnsureChecklistAsync"/> "hiç evrak yok" sanıp kontrol
    /// listesini her açılışta yeniden üretir. <see cref="GetDocumentAsync"/> bu kapıyı
    /// zaten kapatıyordu; liste okumaları atlanmıştı.</para>
    ///
    /// <para><c>Disable()</c> kapsamı tüm kiracılara açar; burada güvenli çünkü
    /// sorgu TEK bir başvuruya bağlı ve o başvuruya erişim zaten doğrulandı.</para>
    /// </summary>
    private async Task<List<GrantApplicationDocument>> ReadDocumentsAsync(Guid applicationId)
    {
        using (_mtFilter.Disable())
        {
            return await _docRepo.GetListAsync(d => d.GrantApplicationId == applicationId);
        }
    }

    private async Task<List<GrantApplicationDocumentVersion>> GetVersionsAsync(
        List<GrantApplicationDocument> documents)
    {
        if (documents.Count == 0) { return new List<GrantApplicationDocumentVersion>(); }
        var ids = documents.Select(d => d.Id).ToList();

        // Sürümler de kiracıya ait; aynı gerekçeyle filtre kapatılır.
        using (_mtFilter.Disable())
        {
            return await _versionRepo.GetListAsync(v => ids.Contains(v.DocumentId));
        }
    }

    /// <summary>
    /// Kontrol listesini çağrının şablonuyla eşitler. Şablonda olup listede olmayan
    /// satır eklenir; listede olup şablondan çıkarılmış satır SİLİNMEZ — yüklenmiş
    /// evrakı ve sürüm geçmişini yok etmek denetim izini koparırdı.
    /// </summary>
    private async Task EnsureChecklistAsync(GrantApplication application)
    {
        var (_, grant) = await GetCatalogAsync(application);

        List<GrantDocumentRequirement> requirements;
        using (_mtFilter.Disable())
        {
            requirements = (await _requirementRepo.GetListAsync(r => r.GrantId == grant.Id && r.TenantId == null))
                .OrderBy(r => r.Order).ToList();
        }
        if (requirements.Count == 0) { return; }

        var existing = await ReadDocumentsAsync(application.Id);
        var known = existing.Where(d => d.RequirementId.HasValue)
            .Select(d => d.RequirementId!.Value).ToHashSet();

        foreach (var requirement in requirements.Where(r => !known.Contains(r.Id)))
        {
            await _docRepo.InsertAsync(new GrantApplicationDocument(
                GuidGenerator.Create(), application.TenantId, application.Id,
                requirement.Id, requirement.Name, requirement.Obligation,
                requirement.UploaderParty, requirement.RequiresESignature,
                requirement.Order), autoSave: true);
        }
    }

    private async Task<GrantDocumentConsoleDto> BuildAsync(GrantApplication application)
    {
        var (_, grant) = await GetCatalogAsync(application);
        var documents = (await ReadDocumentsAsync(application.Id))
            .OrderBy(d => d.Order).ThenBy(d => d.Name).ToList();
        var versions = await GetVersionsAsync(documents);

        var dto = new GrantDocumentConsoleDto
        {
            ApplicationId = application.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            ViewerRole = ViewerRole,
            CanReview = ViewerRole == GrantPartyRole.Danisman,
            IsReadOnly = application.SubmittedAt.HasValue,
            HasPackage = !application.PackageStoredFileName.IsNullOrWhiteSpace(),
            PackageCreatedAt = application.PackageCreatedAt
        };

        foreach (var document in documents)
        {
            var mine = versions.Where(v => v.DocumentId == document.Id)
                .OrderByDescending(v => v.VersionNo).ToList();

            dto.Documents.Add(new GrantApplicationDocumentDto
            {
                Id = document.Id,
                Name = document.Name,
                Obligation = document.Obligation,
                UploaderParty = document.UploaderParty,
                RequiresESignature = document.RequiresESignature,
                Status = document.Status,
                ReviewNote = document.ReviewNote,
                LatestVersionNo = document.LatestVersionNo,
                Order = document.Order,
                IsOnViewer = IsWaitingOn(document, ViewerRole),
                LatestVersion = mine.Count == 0 ? null : ToDto(mine[0]),
                Versions = mine.Select(ToDto).ToList()
            });
        }

        dto.TotalCount = documents.Count;
        dto.ApprovedCount = documents.Count(d => d.Status == GrantDocumentStatus.Onaylandi);
        dto.WaitingOnViewerCount = documents.Count(d => IsWaitingOn(d, ViewerRole));
        dto.WaitingOnOtherCount = documents.Count(d =>
            d.Status != GrantDocumentStatus.Onaylandi && !IsWaitingOn(d, ViewerRole));

        dto.MandatoryCount = documents.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu);
        dto.MandatoryApprovedCount = documents.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                                          && d.Status == GrantDocumentStatus.Onaylandi);
        // Hazırlık ZORUNLU evrak üzerinden ölçülür: koşullu evrak eksikken de
        // paket kuruma gidebilir.
        dto.ReadyPercent = dto.MandatoryCount == 0
            ? 0
            : (int)Math.Round(dto.MandatoryApprovedCount * 100.0 / dto.MandatoryCount);

        dto.ESignatureItems = documents
            .Where(d => d.RequiresESignature)
            .Select(d => new GrantESignatureItemDto
            {
                DocumentId = d.Id,
                Name = d.Name,
                Status = d.Status,
                IsUploaded = d.LatestVersionNo > 0
            })
            .ToList();

        dto.LastActivityAt = versions.Count == 0 ? null : versions.Max(v => v.CreationTime);
        return dto;
    }

    /// <summary>Evrak bu tarafta mı bekliyor — onaylı evrak kimsede beklemez.</summary>
    private static bool IsWaitingOn(GrantApplicationDocument document, GrantPartyRole role)
    {
        if (document.Status == GrantDocumentStatus.Onaylandi) { return false; }

        // Yüklenmiş ve incelemede olan evrak DANIŞMANDA bekler, yükleyende değil.
        if (document.Status == GrantDocumentStatus.Incelemede) { return role == GrantPartyRole.Danisman; }

        // Bekleyen ya da revizyon istenen evrak, yüklemesi beklenen tarafta.
        return document.UploaderParty == role || document.UploaderParty == GrantPartyRole.Ortak;
    }

    private static GrantDocumentVersionDto ToDto(GrantApplicationDocumentVersion v) => new()
    {
        Id = v.Id,
        VersionNo = v.VersionNo,
        OriginalFileName = v.OriginalFileName,
        SizeBytes = v.SizeBytes,
        UploaderName = v.UploaderName,
        UploaderRole = v.UploaderRole,
        Note = v.Note,
        CreationTime = v.CreationTime
    };
}
