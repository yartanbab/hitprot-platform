using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Süreli görev paylaşım linki — ekipte olmayan birinin (taşeron, danışman, müşteri)
/// hesap açmadan tek bir göreve ve ALT GÖREVLERİNE erişmesini sağlar.
///
/// 🔐 Token'ın KENDİSİ saklanmaz — yalnız SHA-256 özeti. Veritabanı sızsa bile linkler
/// kullanılamaz; doğrulama gelen token'ı hash'leyip karşılaştırarak yapılır. Token
/// kullanıcıya YALNIZ üretim anında bir kez gösterilir.
///
/// <para><b>Documents'taki <c>ExternalShareLink</c>'ten farkı:</b> o salt okunurdur, bu
/// YAZMA yetkisi taşır (yorum + dosya yükleme). Bu yüzden burada üç ayrı izin bayrağı ve
/// bir yükleme sayacı var: anonim bir ucu açtığımız için tavan entity'nin kendisinde
/// durur, çağıranın iyi niyetinde değil.</para>
///
/// <para>Tasks alanına ayrı entity olarak konuldu; Documents'taki linke bağlanmadı çünkü
/// çekirdek alanlar arası tek yönlü bağımlılık kuralı Tasks → Documents referansını
/// haklı çıkarmıyor — paylaşılan tek şey ~40 satırlık token deseni.</para>
/// </summary>
public class TaskShareLink : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>Paylaşımın kökü. Kapsam = bu görev + tüm alt görev ağacı.</summary>
    public Guid TaskId { get; private set; }

    /// <summary>Token'ın SHA-256 hex özeti. Aramada bu kolon kullanılır.</summary>
    public string TokenHash { get; private set; } = null!;

    /// <summary>Linkin kime verildiği — misafirin yorum/dosyalarında görünen ad.</summary>
    public string RecipientName { get; private set; } = null!;

    public string? RecipientEmail { get; private set; }

    public DateTime ExpiresAt { get; private set; }

    public bool AllowComment { get; private set; }

    public bool AllowUpload { get; private set; }

    public bool AllowDownload { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public int AccessCount { get; private set; }

    /// <summary>Bu link üzerinden yüklenmiş dosya sayısı — <see cref="TaskShareConsts.MaxUploadsPerLink"/> tavanı.</summary>
    public int UploadCount { get; private set; }

    protected TaskShareLink() { }

    public TaskShareLink(
        Guid id,
        Guid? tenantId,
        Guid taskId,
        string tokenHash,
        string recipientName,
        string? recipientEmail,
        DateTime expiresAt,
        bool allowComment,
        bool allowUpload,
        bool allowDownload) : base(id)
    {
        TenantId = tenantId;
        TaskId = taskId;
        TokenHash = Check.NotNullOrWhiteSpace(tokenHash, nameof(tokenHash), maxLength: TaskShareConsts.TokenHashLength);
        SetRecipient(recipientName, recipientEmail);
        ExpiresAt = expiresAt;
        AllowComment = allowComment;
        AllowUpload = allowUpload;
        AllowDownload = allowDownload;
    }

    public bool IsRevoked => RevokedAt.HasValue;

    public void SetRecipient(string recipientName, string? recipientEmail)
    {
        if (string.IsNullOrWhiteSpace(recipientName))
        {
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareRecipientNameRequired);
        }

        RecipientName = recipientName.Trim().Length > TaskShareConsts.MaxRecipientNameLength
            ? recipientName.Trim()[..TaskShareConsts.MaxRecipientNameLength]
            : recipientName.Trim();

        RecipientEmail = string.IsNullOrWhiteSpace(recipientEmail) ? null : recipientEmail.Trim();
    }

    public void Revoke(DateTime now) => RevokedAt ??= now;

    public void RegisterAccess() => AccessCount++;

    public void RegisterUpload() => UploadCount++;

    /// <summary>Linkin şu an kullanılabilir olduğunu doğrular; değilse sebebini fırlatır.</summary>
    public void EnsureUsable(DateTime now)
    {
        if (IsRevoked)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareLinkRevoked);

        if (ExpiresAt <= now)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareLinkExpired)
                .WithData("ExpiresAt", ExpiresAt);
    }

    public void EnsureCommentAllowed()
    {
        if (!AllowComment)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareCommentNotAllowed);
    }

    /// <summary>Yükleme izni + link başına dosya tavanı. İkisi tek yerde: çağıran atlayamasın.</summary>
    public void EnsureUploadAllowed()
    {
        if (!AllowUpload)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareUploadNotAllowed);

        if (UploadCount >= TaskShareConsts.MaxUploadsPerLink)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareUploadLimitExceeded)
                .WithData("Limit", TaskShareConsts.MaxUploadsPerLink);
    }

    public void EnsureDownloadAllowed()
    {
        if (!AllowDownload)
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareDownloadNotAllowed);
    }
}
