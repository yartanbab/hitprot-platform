namespace Apya.Platform.Documents;

public enum DocumentAccessAction
{
    Uploaded = 1,
    Downloaded = 2,
    Deleted = 3,

    /// <summary>Detay panelinin açılması. Liste render'ı KAYDEDİLMEZ — bkz. DocumentFileAppService.GetAsync.</summary>
    Viewed = 4,

    /// <summary>Meta veri (tür, tutar, dönem, özel alanlar) değişikliği.</summary>
    MetaChanged = 5,

    /// <summary>Belgenin başka klasöre taşınması.</summary>
    Moved = 6,

    /// <summary>Çöp kutusundan geri alınması.</summary>
    Restored = 7
}
