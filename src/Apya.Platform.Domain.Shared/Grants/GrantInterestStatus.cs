namespace Apya.Platform.Grants;

/// <summary>
/// Kiracının bir çağrıya bıraktığı ilgi talebinin durumu.
///
/// <para>Kiracı artık başvuruyu kendi açmaz: "İlgileniyorum" der, host değerlendirir.
/// Başvuru ancak <see cref="BasvuruAcildi"/> ile doğar — o ana kadar ortada
/// <c>GrantApplication</c> yoktur.</para>
///
/// <para>"Vazgeçildi" durumu YOK: talebi geri çekme ekranı kurulmadı. Uygun
/// bulunmayan talep kapanır ama çağrıyı kilitlemez; kiracı yeniden bildirebilir
/// ve bu YENİ bir kayıt açar — eski gerekçe geçmişte kalır.</para>
/// </summary>
public enum GrantInterestStatus
{
    Yeni = 0,

    /// <summary>Danışman kaydı üstlendi; firmayla irtibat sürüyor.</summary>
    Inceleniyor = 1,

    /// <summary>Host başvuru sürecini başlattı; kayıt bir başvuruya bağlandı.</summary>
    BasvuruAcildi = 2,

    /// <summary>Gerekçesiyle birlikte kapatıldı; gerekçe kiracıya gösterilir.</summary>
    UygunDegil = 3
}
