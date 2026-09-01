using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2b · Evrakın bir sürümü. Sürümler SİLİNMEZ; "hangi sürümü kim ne zaman yükledi"
/// sorusunun cevabı denetim izidir. Yükleyenin adı kopya olarak durur — danışman
/// host kullanıcısıdır, kiracı onun kullanıcı kaydını sorgulayamaz.
/// </summary>
public class GrantApplicationDocumentVersion : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid DocumentId { get; private set; }
    public int VersionNo { get; private set; }

    /// <summary>Diskteki ad (IUploadedFileStorage üretir); kullanıcıya gösterilmez.</summary>
    public string StoredFileName { get; private set; } = null!;

    public string OriginalFileName { get; private set; } = null!;
    public long SizeBytes { get; private set; }
    public Guid UploaderUserId { get; private set; }
    public string UploaderName { get; private set; } = null!;
    public GrantPartyRole UploaderRole { get; private set; }

    /// <summary>Sürüm notu — "bütçe bölümü dolduruldu" gibi.</summary>
    public string? Note { get; private set; }

    protected GrantApplicationDocumentVersion() { }

    public GrantApplicationDocumentVersion(
        Guid id,
        Guid? tenantId,
        Guid documentId,
        int versionNo,
        string storedFileName,
        string originalFileName,
        long sizeBytes,
        Guid uploaderUserId,
        string uploaderName,
        GrantPartyRole uploaderRole,
        string? note) : base(id)
    {
        TenantId = tenantId;
        DocumentId = documentId;
        VersionNo = versionNo;
        StoredFileName = Check.NotNullOrWhiteSpace(storedFileName, nameof(storedFileName), maxLength: 256);
        OriginalFileName = Check.NotNullOrWhiteSpace(originalFileName, nameof(originalFileName), maxLength: 256);
        SizeBytes = sizeBytes;
        UploaderUserId = uploaderUserId;
        UploaderName = uploaderName;
        UploaderRole = uploaderRole;
        Note = note;
    }
}
