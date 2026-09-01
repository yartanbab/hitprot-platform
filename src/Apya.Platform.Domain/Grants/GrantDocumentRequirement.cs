using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1b · Evrak &amp; Belgeler: programın istediği bir belge. Kiracı tarafında evrak kontrol
/// listesini (2b) türetecek olan kaynak budur.
///
/// <para>Şablon dosyası (indirilebilir form) BİLEREK yok: yükleme akışı 2b'de kuruluyor,
/// alanı şimdi eklemek UI'sı olmayan ölü kolon olurdu.</para>
/// </summary>
public class GrantDocumentRequirement : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantId { get; private set; }

    /// <summary>0'dan başlar; program içinde listeleme sırasıdır.</summary>
    public int Order { get; set; }

    public string Name { get; private set; } = null!;

    public GrantDocumentObligation Obligation { get; set; }

    /// <summary>Belgeyi kimin yükleyeceği — kiracı tarafında "siz / danışman" rozetini besler.</summary>
    public GrantPartyRole UploaderParty { get; set; }

    public bool RequiresESignature { get; set; }

    protected GrantDocumentRequirement() { }

    public GrantDocumentRequirement(Guid id, Guid grantId, int order, string name) : base(id)
    {
        GrantId = grantId;
        Order = order;
        SetName(name);
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 128).Trim();
    }
}
