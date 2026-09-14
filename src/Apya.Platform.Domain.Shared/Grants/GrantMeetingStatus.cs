namespace Apya.Platform.Grants;

/// <summary>18e · Firmanın önerdiği ön görüşme saatlerinin durumu. Değerler kalıcıdır, yeniden numaralanmaz.</summary>
public enum GrantMeetingStatus
{
    /// <summary>Firma üç saat önerdi, danışmanın cevabı bekleniyor.</summary>
    Bekliyor = 0,

    /// <summary>Danışman saatlerden birini onayladı.</summary>
    Onaylandi = 1,

    /// <summary>Danışman önerilen saatlere uymadığını notla bildirdi; firma yeniden önerebilir.</summary>
    BaskaSaatIstendi = 2
}
