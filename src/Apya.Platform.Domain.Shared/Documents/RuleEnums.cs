namespace Apya.Platform.Documents;

/// <summary>Kuralın ne zaman değerlendirileceği.</summary>
public enum DocumentRuleTrigger
{
    /// <summary>Belge yüklendiğinde/meta değiştiğinde anında.</summary>
    Upload = 1,

    /// <summary>Zamanlı çalışma (gece işi). Faz D'de yalnız elle tetiklenir.</summary>
    Scheduled = 2
}

/// <summary>
/// Koşulun baktığı belge alanı. Serbest JSON yolu YERİNE kapalı liste:
/// kullanıcı yanlış bir yol yazıp sessizce hiç eşleşmeyen kural üretemesin.
/// </summary>
public enum DocumentRuleField
{
    DisplayName = 1,
    DocumentTypeId = 2,
    Amount = 3,
    PeriodCode = 4,
    Status = 5,
    WorkStepId = 6,
    ExpiryDate = 7,
    FolderId = 8,

    /// <summary>Zorunlu meta alanlarından kaçı boş — "eksik meta" kuralları için.</summary>
    MissingRequiredFieldCount = 9
}

public enum DocumentRuleOperator
{
    Equals = 1,
    NotEquals = 2,
    Contains = 3,
    GreaterThan = 4,
    LessThan = 5,
    IsEmpty = 6,
    IsNotEmpty = 7
}

/// <summary>Koşulların birbirine nasıl bağlandığı (mockup: "Eğer" / "Ve").</summary>
public enum DocumentRuleLogicalOperator
{
    And = 1,
    Or = 2
}

/// <summary>
/// Kuralın uyguladığı eylem. Hepsi GERİ ALINABİLİR olacak şekilde seçildi —
/// kural motorunun sessizce yıkıcı bir şey yapması kabul edilemez
/// (silme, dışa gönderme gibi eylemler bilinçli olarak YOK).
/// </summary>
public enum DocumentRuleActionType
{
    MoveToFolder = 1,
    SetDocumentType = 2,
    AddTag = 3,
    SetStatus = 4,
    SetWorkStep = 5,
    SetPeriodCode = 6
}
