namespace Apya.Platform.Documents;

/// <summary>
/// Baglanti turu. Webhook BURADA YOK — mevcut DynamicAssets webhook altyapisi
/// kullanilir, ikinci bir kayit tutmak iki gerceklik kaynagi yaratirdi.
/// </summary>
public enum DocumentIntegrationKind
{
    EmailInbox = 1,
    Accounting = 2,
    ColdArchive = 3,
    DriveSync = 4
}
