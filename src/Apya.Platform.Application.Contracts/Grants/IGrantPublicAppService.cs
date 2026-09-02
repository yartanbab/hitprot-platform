using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 1f / 1g / 5b · Kamuya açık hibe yüzeyi.
///
/// <para>🔴 ANONİM: her yol oturumsuz çağrılabilir. Bu yüzden servis YALNIZ host
/// kataloğunun YAYINLANMIŞ çağrılarını okur; kiracıya ait hiçbir kayda dokunmaz.</para>
/// </summary>
public interface IGrantPublicAppService : IApplicationService
{
    /// <summary>1f · Açık çağrılarda arama ve süzme.</summary>
    Task<GrantPublicSearchResultDto> SearchAsync(GrantPublicSearchInput input);

    /// <summary>1g · Çağrı detayı ve o çağrının ölçtüğü şartlara göre test soruları.</summary>
    Task<GrantPublicDetailDto> GetDetailAsync(Guid callId);

    /// <summary>1g · Testi hesapla. KAYIT AÇMAZ — e-posta duvarı yok, sonuç doğrudan görünür.</summary>
    Task<GrantPublicTestResultDto> EvaluateAsync(GrantPublicTestInput input);

    /// <summary>1g CTA · Ön değerlendirme talebi bırak.</summary>
    Task<GrantLeadSubmittedDto> SubmitLeadAsync(SubmitGrantLeadInput input);

    /// <summary>5b · Randevu ekranının önden dolu alanları.</summary>
    Task<GrantMeetingPrefillDto> GetMeetingPrefillAsync(Guid leadId);

    /// <summary>5b · Görüşme TERCİHİ bildir. Onaylanmış slot değildir.</summary>
    Task RequestMeetingAsync(RequestGrantMeetingInput input);
}
