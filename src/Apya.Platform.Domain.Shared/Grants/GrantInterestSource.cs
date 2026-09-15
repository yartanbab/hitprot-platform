namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Kaydı kim girdi. Çağrıya bırakılan talep hep firmanındır; havuza fikri danışman da
/// firma adına girebilir ("Kim girdi" sütunu ve kaynak süzgeci buna bakar).
///
/// <para>Tasarımdaki "Host yöneticisi" ayrı değer DEĞİL: platformda danışman rolü yok, hibe
/// işini yürüten her host kullanıcısı danışmandır (Talepler'in danışman süzgeciyle aynı küme).
/// Girenin kendisi <c>CreatorId</c>'de durur.</para>
/// </summary>
public enum GrantInterestSource
{
    /// <summary>Firma kendisi girdi — çağrıya ilgi ya da havuza fikir.</summary>
    Tenant = 0,

    /// <summary>Host kullanıcısı firma adına havuza girdi.</summary>
    Consultant = 1
}
