using System;

namespace Apya.Platform.Documents;

/// <summary>
/// Belgenin bağlı olduğu kayıt türü. Detay panelindeki "İlişkili kayıtlar"
/// listesi bunu ikona ve derin linke çevirir; URL istemcide kurulur —
/// yol bilgisi uygulama katmanına ait değildir.
/// </summary>
public enum RelatedRecordKind
{
    Project = 1,
    WorkStep = 2,

    /// <summary>Belgenin eşleştirildiği harcama kalemi.</summary>
    Expense = 3,

    /// <summary>Belgeyi ek olarak taşıyan teslim paketi (EK numarasıyla).</summary>
    DeliveryPackage = 4,

    /// <summary>Belgenin karşıladığı kontrol listesi kalemi.</summary>
    ComplianceRequirement = 5
}

/// <summary>Detay panelinde tek bir ilişkili kayıt satırı.</summary>
public class RelatedRecordDto
{
    public RelatedRecordKind Kind { get; set; }

    /// <summary>Derin linkin hedefi; kayıt silinmişse null olabilir.</summary>
    public Guid? EntityId { get; set; }

    public string Label { get; set; } = string.Empty;

    /// <summary>İkinci satır: tutar, EK numarası, dönem gibi ayırt edici bilgi.</summary>
    public string? Detail { get; set; }
}
