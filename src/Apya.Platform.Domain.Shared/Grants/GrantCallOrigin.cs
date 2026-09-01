namespace Apya.Platform.Grants;

/// <summary>
/// 1a/3a · Çağrı taslağının nereden geldiği. <see cref="Elle"/> girilen program bir
/// kaynağa bağlı DEĞİLDİR; güncelleme takibi yapılmaz (3a alt bilgisi).
/// </summary>
public enum GrantCallOrigin
{
    Elle = 0,
    Kazima = 1
}
