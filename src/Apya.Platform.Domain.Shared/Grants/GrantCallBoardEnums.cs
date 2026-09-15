namespace Apya.Platform.Grants;

/// <summary>
/// 21a/22 · Host Çağrılar ekranının sekmesi. Kaynaklar üçüncü sekmedir ama ayrı sayfadır
/// (/Grants/Sources), bu yüzden burada yok.
/// </summary>
public enum GrantCallBoardTab
{
    /// <summary>Firmaların gördüğü ya da göreceği çağrılar: Açık + Planlandı. Kapanmış süzgeçle.</summary>
    Live = 0,

    /// <summary>Yayına alınmamış çağrılar + hiç çağrısı olmayan programlar.</summary>
    Draft = 1
}

public enum GrantCallBoardSort
{
    /// <summary>Son tarihe göre: yaklaşan önce (kapanmışta en son kapanan önce); tarihsiz en sonda.</summary>
    Deadline = 0,

    /// <summary>En yeni kayıt önce.</summary>
    Newest = 1,

    /// <summary>Program adına göre.</summary>
    Name = 2
}
