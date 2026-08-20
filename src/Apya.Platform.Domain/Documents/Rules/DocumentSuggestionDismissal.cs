using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kullanıcının reddettiği öneri.
///
/// Önerilerin KENDİSİ saklanmaz (her okumada kural motoru + eşleşme
/// skorlayıcısından üretilir); saklanan tek şey veriden türetilemeyen karardır:
/// "bu belgeye bunu bir daha önerme".
///
/// Anahtar önerinin İÇERİĞİDİR (<c>DocumentSuggestionBuilder.KeyOf</c>): aynı
/// hedef yeniden önerilirse gizli kalır, ama başka bir hedef önerilirse
/// kullanıcı onu yeniden görür — reddedilen şey öneri kutusu değil, o öneriydi.
/// </summary>
public class DocumentSuggestionDismissal : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentFileId { get; private set; }

    /// <summary>Tür + hedef birleşimi ("2:{guid}").</summary>
    public string SuggestionKey { get; private set; } = null!;

    protected DocumentSuggestionDismissal() { }

    public DocumentSuggestionDismissal(
        Guid id,
        Guid? tenantId,
        Guid documentFileId,
        string suggestionKey) : base(id)
    {
        TenantId = tenantId;
        DocumentFileId = documentFileId;
        SuggestionKey = Check.NotNullOrWhiteSpace(
            suggestionKey, nameof(suggestionKey), maxLength: DocumentConsts.MaxSuggestionKeyLength);
    }
}
