using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Süreli dış paylaşım linki (denetçi görünümü).
///
/// 🔐 Token'ın KENDİSİ saklanmaz — yalnız SHA-256 özeti. Veritabanı sızsa bile
/// linkler kullanılamaz; doğrulama gelen token'ı hash'leyip karşılaştırarak yapılır.
/// Token kullanıcıya YALNIZ üretim anında bir kez gösterilir.
/// </summary>
public class ExternalShareLink : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public ShareTargetType TargetType { get; private set; }

    public Guid TargetId { get; private set; }

    /// <summary>Token'ın SHA-256 hex özeti. Aramada bu kolon kullanılır.</summary>
    public string TokenHash { get; private set; } = null!;

    public DateTime ExpiresAt { get; private set; }

    /// <summary>Kapalıysa denetçi yalnız görüntüler, dosya indiremez.</summary>
    public bool AllowDownload { get; private set; }

    /// <summary>Önizlemeye basılacak filigran metni (alıcı adı / "gizli").</summary>
    public string? Watermark { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public int AccessCount { get; private set; }

    protected ExternalShareLink() { }

    public ExternalShareLink(
        Guid id,
        Guid? tenantId,
        ShareTargetType targetType,
        Guid targetId,
        string tokenHash,
        DateTime expiresAt,
        bool allowDownload = false,
        string? watermark = null) : base(id)
    {
        TenantId = tenantId;
        TargetType = targetType;
        TargetId = targetId;
        TokenHash = Check.NotNullOrWhiteSpace(tokenHash, nameof(tokenHash), maxLength: ReportingConsts.ShareTokenHashLength);
        ExpiresAt = expiresAt;
        AllowDownload = allowDownload;
        Watermark = watermark;
    }

    public bool IsRevoked => RevokedAt.HasValue;

    public void Revoke(DateTime now) => RevokedAt ??= now;

    public void RegisterAccess() => AccessCount++;

    /// <summary>Linkin şu an kullanılabilir olduğunu doğrular; değilse sebebini fırlatır.</summary>
    public void EnsureUsable(DateTime now)
    {
        if (IsRevoked)
            throw new BusinessException(PlatformDomainErrorCodes.ShareLinkRevoked);

        if (ExpiresAt <= now)
            throw new BusinessException(PlatformDomainErrorCodes.ShareLinkExpired)
                .WithData("ExpiresAt", ExpiresAt);
    }

    public void EnsureDownloadAllowed()
    {
        if (!AllowDownload)
            throw new BusinessException(PlatformDomainErrorCodes.ShareLinkDownloadNotAllowed);
    }
}
