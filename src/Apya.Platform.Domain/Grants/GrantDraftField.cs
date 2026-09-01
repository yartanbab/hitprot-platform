using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a/3a · Bir çağrı taslağının TEK alanı: ham değer, güven skoru ve host'un onay durumu.
///
/// <para>Taslağın birimi ÇAĞRIDIR; <see cref="FieldKey"/> alanın hangi varlığa gittiğini
/// adlandırır ("Name", "Issuer" programa; "Deadline", "Period" çağrıya). Bir programın
/// ikinci dönemi ayrı bir taslak olarak kendi alan kümesiyle gelir.</para>
///
/// <para>Güveni %80'in altındaki alanlar parametre formunda sarı işaretlenir ve yayın
/// öncesi elle onay ister (1a alt notu).</para>
/// </summary>
public class GrantDraftField : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    /// <summary>%80 ve üstü "yüksek güven" sayılır; altı elle onay ister.</summary>
    public const int HighConfidenceThreshold = 80;

    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }

    public string FieldKey { get; private set; } = null!;

    /// <summary>Metinden okunan ham değer. null = alan çıkarılamadı ("boş" durumu).</summary>
    public string? RawValue { get; set; }

    /// <summary>0-100. Elle girilen alanda 100.</summary>
    public int Confidence { get; set; }

    public GrantDraftFieldStatus Status { get; set; }

    /// <summary>Değerin okunduğu pasaj — 3a'da metinde vurgulanır.</summary>
    public string? SourceExcerpt { get; set; }

    protected GrantDraftField() { }

    public GrantDraftField(Guid id, Guid grantCallId, string fieldKey) : base(id)
    {
        GrantCallId = grantCallId;
        FieldKey = Check.NotNullOrWhiteSpace(fieldKey, nameof(fieldKey), maxLength: 64).Trim();
    }

    public bool IsHighConfidence => Confidence >= HighConfidenceThreshold;
}
