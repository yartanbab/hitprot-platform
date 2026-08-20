using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Süreli dış paylaşım linkleri (denetçi görünümü).
///
/// 🔐 Token üretimi kriptografik rastgeledir ve sunucuda SAKLANMAZ; yalnız SHA-256
/// özeti tutulur. Çözümleme gelen token'ı hash'leyip aramayla yapılır — veritabanı
/// sızsa bile linkler yeniden üretilemez.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ExternalShareAppService : ApplicationService, IExternalShareAppService
{
    private readonly IRepository<ExternalShareLink, Guid> _linkRepository;
    private readonly IRepository<ExternalShareAccessLog, Guid> _accessLogRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;
    private readonly IRepository<DeliveryPackageItem, Guid> _itemRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public ExternalShareAppService(
        IRepository<ExternalShareLink, Guid> linkRepository,
        IRepository<ExternalShareAccessLog, Guid> accessLogRepository,
        IRepository<DeliveryPackage, Guid> packageRepository,
        IRepository<DeliveryPackageItem, Guid> itemRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IRepository<Project, Guid> projectRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _linkRepository = linkRepository;
        _accessLogRepository = accessLogRepository;
        _packageRepository = packageRepository;
        _itemRepository = itemRepository;
        _fileRepository = fileRepository;
        _attachmentRepository = attachmentRepository;
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
        _projectRepository = projectRepository;
        _mtFilter = mtFilter;
    }

    public virtual async Task<List<ExternalShareLinkDto>> GetListAsync(ShareTargetType targetType, Guid targetId)
    {
        var links = (await _linkRepository.GetListAsync(l => l.TargetType == targetType && l.TargetId == targetId))
            .OrderByDescending(l => l.CreationTime)
            .ToList();

        return links.Select(Map).ToList();
    }

    [Authorize(PlatformPermissions.Documents.ShareExternally)]
    public virtual async Task<CreatedShareLinkDto> CreateAsync(CreateShareLinkDto input)
    {
        await EnsureTargetVisibleAsync(input.TargetType, input.TargetId);

        var token = GenerateToken();

        var link = new ExternalShareLink(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.TargetType,
            input.TargetId,
            Hash(token),
            Clock.Now.AddDays(input.LifetimeDays),
            input.AllowDownload,
            input.Watermark);

        await _linkRepository.InsertAsync(link, autoSave: true);

        var dto = Map(link);
        return new CreatedShareLinkDto
        {
            Id = dto.Id,
            TargetType = dto.TargetType,
            TargetId = dto.TargetId,
            ExpiresAt = dto.ExpiresAt,
            AllowDownload = dto.AllowDownload,
            Watermark = dto.Watermark,
            RevokedAt = dto.RevokedAt,
            AccessCount = dto.AccessCount,
            CreationTime = dto.CreationTime,
            IsActive = dto.IsActive,
            // Token YALNIZ burada döner; sunucu onu bir daha üretemez.
            Url = "/Share/" + token,
        };
    }

    [Authorize(PlatformPermissions.Documents.ShareExternally)]
    public virtual async Task RevokeAsync(Guid id)
    {
        var link = await _linkRepository.GetAsync(id);
        link.Revoke(Clock.Now);
        await _linkRepository.UpdateAsync(link);
    }

    /// <summary>
    /// Anonim denetçi sayfası. Kiracı bağlamı olmadığı için çok-kiracılı filtre
    /// kapatılarak aranır — token'ın kendisi yetki taşır.
    /// </summary>
    [AllowAnonymous]
    public virtual async Task<SharedPackageViewDto> ResolveAsync(string token, string? ipHash, string? userAgent)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolvePackageLinkAsync(token);

            var view = await BuildPackageViewAsync(link);

            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);

            await _accessLogRepository.InsertAsync(new ExternalShareAccessLog(
                GuidGenerator.Create(), link.TenantId, link.Id, isDownload: false, ipHash, userAgent));

            return view;
        }
    }

    /// <summary>
    /// Anonim denetçi indirmesi.
    ///
    /// 🔐 Token bir PAKETİ açar, sistemdeki her belgeyi değil: istenen dosyanın
    /// linkin paketine ait olduğu burada doğrulanır. Doğrulama olmadan geçerli bir
    /// token, kimliğini bilen herkese tüm belgeleri indirtirdi.
    /// </summary>
    [AllowAnonymous]
    public virtual async Task<GeneratedFileDownloadDto> PrepareDownloadAsync(
        string token, Guid documentFileId, string? ipHash, string? userAgent)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolvePackageLinkAsync(token);

            link.EnsureDownloadAllowed();

            var itemQueryable = await _itemRepository.GetQueryableAsync();
            var belongsToPackage = await AsyncExecuter.AnyAsync(
                itemQueryable.Where(i => i.PackageId == link.TargetId && i.DocumentFileId == documentFileId));

            if (!belongsToPackage)
            {
                throw new EntityNotFoundException(typeof(DocumentFile), documentFileId);
            }

            var file = await _fileRepository.GetAsync(documentFileId);

            if (!file.LatestAttachmentId.HasValue)
            {
                throw new EntityNotFoundException(typeof(DocumentAttachment), documentFileId);
            }

            var attachment = await _attachmentRepository.GetAsync(file.LatestAttachmentId.Value);

            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);

            await _accessLogRepository.InsertAsync(new ExternalShareAccessLog(
                GuidGenerator.Create(), link.TenantId, link.Id, isDownload: true, ipHash, userAgent));

            return new GeneratedFileDownloadDto
            {
                StoredFileName = attachment.StoredFileName,
                FileName = attachment.FileName,
                ContentType = attachment.ContentType,
            };
        }
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    /// <summary>
    /// Token'ı çözüp kullanılabilirliğini doğrular. ÇAĞIRAN, çok-kiracılı filtreyi
    /// kapatmış olmalıdır — anonim istekte kiracı bağlamı yoktur.
    /// </summary>
    private async Task<ExternalShareLink> ResolvePackageLinkAsync(string token)
    {
        var tokenHash = Hash(token);

        var queryable = await _linkRepository.GetQueryableAsync();
        var link = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(l => l.TokenHash == tokenHash));

        if (link == null)
        {
            throw new EntityNotFoundException(typeof(ExternalShareLink), tokenHash);
        }

        link.EnsureUsable(Clock.Now);

        if (link.TargetType != ShareTargetType.DeliveryPackage)
        {
            throw new EntityNotFoundException(typeof(ExternalShareLink), link.Id);
        }

        return link;
    }

    /// <summary>256 bit kriptografik rastgele, URL güvenli base64.</summary>
    private static string GenerateToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes)
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }

    private static string Hash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private async Task EnsureTargetVisibleAsync(ShareTargetType targetType, Guid targetId)
    {
        switch (targetType)
        {
            case ShareTargetType.DeliveryPackage:
                await _packageRepository.GetAsync(targetId);
                break;
            case ShareTargetType.DocumentFile:
                await _fileRepository.GetAsync(targetId);
                break;
            default:
                // ReportRun paylaşımı Faz C kapsamında UI'dan sunulmuyor.
                throw new EntityNotFoundException(typeof(ExternalShareLink), targetId);
        }
    }

    private async Task<SharedPackageViewDto> BuildPackageViewAsync(ExternalShareLink link)
    {
        var package = await _packageRepository.GetAsync(link.TargetId);
        var project = await _projectRepository.FindAsync(package.ProjectId);

        var items = (await _itemRepository.GetListAsync(i => i.PackageId == package.Id))
            .OrderBy(i => i.Order)
            .ToList();

        var fileIds = items.Select(i => i.DocumentFileId).ToList();
        var files = await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id));
        var fileById = files.ToDictionary(f => f.Id);

        var typeIds = files.Where(f => f.DocumentTypeId.HasValue)
            .Select(f => f.DocumentTypeId!.Value).Distinct().ToList();

        var typeQueryable = await _typeRepository.GetQueryableAsync();
        var typeNames = (await AsyncExecuter.ToListAsync(
                typeQueryable.AsNoTracking().Where(t => typeIds.Contains(t.Id)).Select(t => new { t.Id, t.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        // Gizli alan taşıyan tipler dış görünümde maskeli işaretlenir.
        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var confidentialTypeIds = (await AsyncExecuter.ToListAsync(
                fieldQueryable.AsNoTracking()
                    .Where(f => typeIds.Contains(f.DocumentTypeId) && f.Visibility == DocumentFieldVisibility.Confidential)
                    .Select(f => f.DocumentTypeId)))
            .ToHashSet();

        return new SharedPackageViewDto
        {
            PackageName = package.Name,
            ProjectName = project?.Name,
            PeriodCode = package.PeriodCode,
            GeneratedAt = package.GeneratedAt,
            ExpiresAt = link.ExpiresAt,
            AllowDownload = link.AllowDownload,
            Watermark = link.Watermark,
            Items = items.Select(i =>
            {
                var file = fileById.GetValueOrDefault(i.DocumentFileId);
                return new SharedPackageItemDto
                {
                    AnnexNumber = i.AnnexNumber ?? string.Empty,
                    DocumentFileName = file?.DisplayName ?? "(silinmiş belge)",
                    DocumentTypeName = file?.DocumentTypeId != null
                        ? typeNames.GetValueOrDefault(file.DocumentTypeId.Value)
                        : null,
                    DocumentDate = file?.DocumentDate,
                    DocumentFileId = i.DocumentFileId,
                    CanDownload = file?.LatestAttachmentId != null,
                    IsMasked = file?.DocumentTypeId != null && confidentialTypeIds.Contains(file.DocumentTypeId.Value),
                };
            }).ToList(),
        };
    }

    private ExternalShareLinkDto Map(ExternalShareLink link) => new()
    {
        Id = link.Id,
        TargetType = link.TargetType,
        TargetId = link.TargetId,
        ExpiresAt = link.ExpiresAt,
        AllowDownload = link.AllowDownload,
        Watermark = link.Watermark,
        RevokedAt = link.RevokedAt,
        AccessCount = link.AccessCount,
        CreationTime = link.CreationTime,
        IsActive = !link.IsRevoked && link.ExpiresAt > Clock.Now,
    };
}
