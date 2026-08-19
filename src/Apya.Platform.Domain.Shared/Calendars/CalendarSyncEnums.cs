namespace Apya.Platform.Calendars;

/// <summary>
/// İki taraf da düzenlendiğinde ne olacağı. Varsayılan "son değişen kazanır":
/// kullanıcı hangi ekranda çalışıyorsa oradaki değişiklik geçerli olur ve ekranda
/// kalıcı bir geri alma şeridi çıkar. "APYA kazanır" seçilirse dış takvim salt-okunur
/// bir aynaya döner — dışarıdaki düzenleme sessizce geri alınır.
/// </summary>
public enum CalendarConflictRule
{
    LastWriteWins = 0,
    ApyaWins = 1
}

/// <summary>Senkron günlüğü satırının türü — ekranda ikon ve rengi bu belirler.</summary>
public enum CalendarSyncLogKind
{
    /// <summary>Öğe(ler) dış takvime yazıldı.</summary>
    Written = 0,

    /// <summary>Çakışma çözüldü (kural uygulandı).</summary>
    ConflictResolved = 1,

    /// <summary>Yazılamadı — yetki süresi doldu, ağ hatası vb.</summary>
    Error = 2
}
