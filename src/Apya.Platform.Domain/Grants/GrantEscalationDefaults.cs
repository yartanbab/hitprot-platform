using System.Linq;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Grants;

/// <summary>
/// Faz 2 · Varsayılan yükseltme zinciri ve metni (kullanıcı kararı 10-29). Firmanın işi: 3. gün hatırlatma,
/// 7. gün firma yöneticisi, 14. gün danışmana bilgi. Danışmanın işi: 2. gün hatırlatma, 5. gün host yöneticisi.
///
/// <para>Metin tetikleyici başına tek "bekleyen iş" cümlesi ile kitle başına bir çerçeveden kurulur
/// (hatırlatma / yönetici / karşı taraf). Kayda yazılan metin yalnız gerçek değişkenler taşır.</para>
/// </summary>
public static class GrantEscalationDefaults
{
    public static int DaysOf(GrantNotificationTrigger trigger, GrantNotificationAudience audience)
    {
        // Firma yöneticisine yükselemeyen tetikleyicinin işi yalnız danışmandadır: daha kısa süreler.
        var consultantOnly = !GrantNotificationTriggerRegistry.EscalationAudiencesOf(trigger)
            .Contains(GrantNotificationAudience.FirmaYoneticisi);

        return audience switch
        {
            GrantNotificationAudience.Genel => consultantOnly ? 2 : 3,
            GrantNotificationAudience.HostYoneticisi => consultantOnly ? 5 : 7,
            GrantNotificationAudience.FirmaYoneticisi => 7,
            _ => 14
        };
    }

    public static (string Subject, string Body) TextOf(
        IStringLocalizer l, GrantNotificationTrigger trigger, GrantNotificationAudience audience)
    {
        var frame = audience switch
        {
            GrantNotificationAudience.Genel => "Reminder",
            GrantNotificationAudience.FirmaYoneticisi or GrantNotificationAudience.HostYoneticisi => "Manager",
            _ => "CounterParty"
        };

        return (
            l[$"Grants:Notify:Escalation:Subject:{frame}", l[$"Grants:Notify:Trigger:{trigger}:Name"].Value],
            l[$"Grants:Notify:Escalation:Body:{frame}", l[$"Grants:Notify:Escalation:Pending:{trigger}"].Value]);
    }
}
