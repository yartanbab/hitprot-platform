namespace Apya.Platform.Grants;

/// <summary>
/// 10b · Parametre formundaki bir şartın "nereden geldi" bilgisi. Programın bugünkü
/// değeri, son taslak çağrının resmî metinden çıkarılan alanıyla karşılaştırılarak bulunur.
///
/// <para>Personel ve ciro gibi metin çıkarıcısının hiç okumadığı şartlar daima
/// <see cref="Elle"/>'dir — kaynak bilinmiyorsa "metinden" DENMEZ.</para>
/// </summary>
public enum GrantParameterSource
{
    /// <summary>Değer resmî metinden okundu ve host kabul etti.</summary>
    Metinden = 0,

    /// <summary>Metinde karşılığı yok, host reddetti ya da çıkarıcı bu alanı okumuyor.</summary>
    Elle = 1,

    /// <summary>Metinden okunan değer ile programın bugünkü değeri FARKLI — çelişki.</summary>
    MetindenFarkli = 2,

    /// <summary>Değer metinden okundu ve programa yazıldı ama host henüz onaylamadı.</summary>
    OnayBekliyor = 3
}
