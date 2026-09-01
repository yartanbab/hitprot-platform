namespace Apya.Platform.Grants;

/// <summary>
/// 2b · Bir başvuru evrakının durumu. Sıra bilinçli: soldan sağa ilerleyen bir akış
/// değil, <see cref="RevizyonIstendi"/> geriye dönüştür.
/// </summary>
public enum GrantDocumentStatus
{
    /// <summary>Henüz yüklenmedi — sorumlu tarafta bekliyor.</summary>
    Bekleniyor = 0,

    /// <summary>Yüklendi, danışman incelemesi bekliyor.</summary>
    Incelemede = 1,

    /// <summary>Danışman onayladı; gönderim paketine bu sürüm girer.</summary>
    Onaylandi = 2,

    /// <summary>Danışman revizyon istedi; notu evrakın üstünde durur.</summary>
    RevizyonIstendi = 3
}
