namespace Apya.Platform.Documents;

/// <summary>
/// Kontrol listesi kaleminin hangi kapsamda tekrarlandığı.
/// Project = proje başına bir belge yeter.
/// WorkStep = her iş adımı için ayrı belge gerekir.
/// Period = her dönem (2026-Q2) için ayrı belge gerekir.
/// </summary>
public enum ComplianceScope
{
    Project = 1,
    WorkStep = 2,
    Period = 3
}

/// <summary>
/// Kontrol listesi satırının HESAPLANMIŞ durumu — veritabanında saklanmaz,
/// her okumada belge verisinden türetilir (bkz. ComplianceAppService).
/// Yalnızca Waived kullanıcı kararıdır ve ComplianceItemState'te tutulur.
/// </summary>
public enum ComplianceItemStatus
{
    Satisfied = 1,
    Missing = 2,
    Waived = 3
}
