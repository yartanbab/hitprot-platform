namespace Apya.Platform.Documents;

/// <summary>
/// Belgenin yaşam döngüsü durumu.
/// Matched, belgenin bir harcama/fatura kalemine bağlandığını gösterir (Faz E).
///
/// <para>🔴 <see cref="Expired"/> hiçbir kod yolunda ATANMAZ (DOC-05). Ekranlar "süresi doldu"
/// bilgisini bu durumdan değil, belgenin geçerlilik tarihinden türetir; dolma anı da bir durum
/// değişikliğiyle değil bildirimle duyurulur (DocumentFileExpiryWorker). Değer tutuluyor çünkü
/// sayısal karşılığı kayıtlarda geçebilir; atanmaya başlanacaksa önce şu soru cevaplanmalı:
/// harcamaya bağlı (Matched) bir belge dolunca bağ bilgisi nereye gider, tarih uzatılınca
/// hangi duruma dönülür.</para>
/// </summary>
public enum DocumentFileStatus
{
    Draft = 1,
    Final = 2,
    Matched = 3,
    Expired = 4
}
