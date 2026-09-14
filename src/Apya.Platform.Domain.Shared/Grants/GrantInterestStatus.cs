namespace Apya.Platform.Grants;

/// <summary>
/// Kiracının bir çağrıya bıraktığı ilgi talebinin durumu.
///
/// <para>Kiracı artık başvuruyu kendi açmaz: "İlgileniyorum" der, host değerlendirir.
/// Başvuru ancak <see cref="BasvuruAcildi"/> ile doğar — o ana kadar ortada
/// <c>GrantApplication</c> yoktur.</para>
///
/// <para>Kapanan talep (uygun bulunmayan ya da firmanın geri çektiği) çağrıyı
/// kilitlemez; kiracı yeniden bildirebilir ve bu YENİ bir kayıt açar — eski kayıt
/// geçmişte kalır.</para>
/// </summary>
public enum GrantInterestStatus
{
    Yeni = 0,

    /// <summary>Danışman kaydı üstlendi; firmayla irtibat sürüyor.</summary>
    Inceleniyor = 1,

    /// <summary>Host başvuru sürecini başlattı; kayıt bir başvuruya bağlandı.</summary>
    BasvuruAcildi = 2,

    /// <summary>Gerekçesiyle birlikte kapatıldı; gerekçe kiracıya gösterilir.</summary>
    UygunDegil = 3,

    /// <summary>
    /// Firma, karar verilmeden ilgisini geri çekti. Yalnız bekleyen talep geri
    /// çekilebilir: başvuruya dönmüş ya da reddedilmiş kayıt tarihçedir.
    /// </summary>
    GeriCekildi = 4,

    /// <summary>
    /// 18b · Karara bağlanmadan çağrı kapandı. Gerekçe otomatik yazılır ve firmaya gösterilir;
    /// kayıt tarihçedir, çağrı yeniden açılırsa firma YENİ talep bırakabilir.
    /// </summary>
    Kacirildi = 5
}
