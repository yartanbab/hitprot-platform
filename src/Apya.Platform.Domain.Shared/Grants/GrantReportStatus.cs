namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Rapor-dilim zincirindeki bir raporun durumu. Sıra tasarımdaki akışı
/// izler: planlandı → hazırlanıyor → gönderildi → onaylandı.
/// </summary>
public enum GrantReportStatus
{
    Planlandi = 0,
    Hazirlaniyor = 1,
    Gonderildi = 2,
    Onaylandi = 3,

    /// <summary>Kurum revizyon istedi.</summary>
    RevizyonIstendi = 4
}
