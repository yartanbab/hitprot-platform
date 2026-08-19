namespace Apya.Platform.Documents;

/// <summary>Raporun kime gittiği — şablon seti bu alıcıya göre seçilir.</summary>
public enum ReportRecipient
{
    Institution = 1,
    Bank = 2,
    Customer = 3,
    Auditor = 4,
    Internal = 5
}

/// <summary>
/// Rapor bölümü anahtarı. Bölümün İÇERİĞİ koddan üretilir (veri sunucudan gelir);
/// şablon yalnızca hangi bölümlerin, hangi sırayla ve açık/kapalı olduğunu tutar.
/// </summary>
public enum ReportSectionKey
{
    ProjectSummary = 1,
    WorkStepProgress = 2,
    Timeline = 3,
    ExpenseDocumentMatch = 4,
    TeamContribution = 5,
    MissingDocuments = 6,
    ComplianceStatus = 7,
    AnnexIndex = 8,
    Risks = 9,
    AuditTrail = 10,
    Milestones = 11,
    CoverPage = 12
}

/// <summary>Teslim paketinin yaşam döngüsü. Üretim yalnız Preflight temizse yapılabilir.</summary>
public enum DeliveryPackageStatus
{
    Draft = 1,
    Generated = 2,
    Sent = 3
}

/// <summary>Üretilen çıktı biçimleri (bit maskesi — bir paket birden çok biçim üretebilir).</summary>
[System.Flags]
public enum ReportOutputFormat
{
    None = 0,
    Pdf = 1,
    Zip = 2,
    Excel = 4
}

/// <summary>Süreli dış paylaşım linkinin neyi açtığı.</summary>
public enum ShareTargetType
{
    DeliveryPackage = 1,
    ReportRun = 2,
    DocumentFile = 3
}

/// <summary>Preflight bulgusunun neden kaynaklandığı — UI gruplaması ve teşhis için.</summary>
public enum PreflightIssueKind
{
    /// <summary>Kurum kontrol listesinde eksik ve bloke işaretli kalem.</summary>
    BlockingComplianceItem = 1,

    /// <summary>Geçerlilik tarihi geçmiş belge pakete girmiş.</summary>
    ExpiredDocument = 2,

    /// <summary>Belge tipinin zorunlu meta alanı boş.</summary>
    MissingRequiredField = 3,

    /// <summary>Maskeli/gizli alan taşıyan belge dış alıcıya gidiyor.</summary>
    MaskedFieldWarning = 4,

    /// <summary>Pakette hiç kalem yok.</summary>
    EmptyPackage = 5
}
