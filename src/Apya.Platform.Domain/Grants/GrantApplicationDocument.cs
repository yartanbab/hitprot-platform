using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 2b · Başvurunun bir evrakı. Liste çağrının evrak şablonundan
/// (<see cref="GrantDocumentRequirement"/>) TÜRETİLİR; ad ve sorumluluk oradan
/// KOPYALANIR çünkü program şartı sonradan değişse bile başvurunun o günkü
/// yükümlülüğü değişmemelidir.
///
/// Şablonda karşılığı olmayan evrak da eklenebilir (<see cref="RequirementId"/> null):
/// kurum ek belge isteyebilir.
/// </summary>
public class GrantApplicationDocument : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }

    /// <summary>Türetildiği şablon satırı; elle eklenen evrakta null.</summary>
    public Guid? RequirementId { get; private set; }

    public string Name { get; private set; } = null!;
    public GrantDocumentObligation Obligation { get; private set; }

    /// <summary>Evrakı yüklemesi beklenen taraf (firma / danışman / kurum).</summary>
    public GrantPartyRole UploaderParty { get; private set; }

    public bool RequiresESignature { get; private set; }
    public GrantDocumentStatus Status { get; private set; }

    /// <summary>Danışmanın revizyon notu ya da onay notu.</summary>
    public string? ReviewNote { get; private set; }

    public int Order { get; set; }

    /// <summary>Son sürümün numarası; 0 = hiç yüklenmedi.</summary>
    public int LatestVersionNo { get; private set; }

    public ICollection<GrantApplicationDocumentVersion> Versions { get; set; }
        = new List<GrantApplicationDocumentVersion>();

    protected GrantApplicationDocument() { }

    public GrantApplicationDocument(
        Guid id,
        Guid? tenantId,
        Guid grantApplicationId,
        Guid? requirementId,
        string name,
        GrantDocumentObligation obligation,
        GrantPartyRole uploaderParty,
        bool requiresESignature,
        int order) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        RequirementId = requirementId;
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 128).Trim();
        Obligation = obligation;
        UploaderParty = uploaderParty;
        RequiresESignature = requiresESignature;
        Order = order;
        Status = GrantDocumentStatus.Bekleniyor;
    }

    /// <summary>Yeni sürüm yüklendi: evrak yeniden incelemeye düşer.</summary>
    public void RegisterUpload()
    {
        LatestVersionNo++;
        Status = GrantDocumentStatus.Incelemede;
        ReviewNote = null;
    }

    public void Approve(string? note)
    {
        if (LatestVersionNo == 0)
        {
            // Yüklenmemiş evrak onaylanamaz — pakete boş satır girerdi.
            throw new BusinessException(PlatformDomainErrorCodes.GrantDocumentNotUploaded);
        }
        Status = GrantDocumentStatus.Onaylandi;
        ReviewNote = note;
    }

    public void RequestRevision(string note)
    {
        if (LatestVersionNo == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantDocumentNotUploaded);
        }
        Status = GrantDocumentStatus.RevizyonIstendi;
        ReviewNote = Check.NotNullOrWhiteSpace(note, nameof(note), maxLength: 512).Trim();
    }
}
