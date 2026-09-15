using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 22b · Host "Talepler" ekranı. İlgi talepleri ile ön değerlendirme talepleri tek listede:
/// ikisi de aynı iş, firmaya dönmek. Karar ve eylemler kaydın kendi ekranında kalır
/// (İlgi inceleme, Ön değerlendirme); bu servis yalnız okur.
///
/// <para>🔴 HOST-ONLY: kiracılar arası bakar.</para>
/// </summary>
public interface IGrantRequestAppService : IApplicationService
{
    Task<GrantRequestInboxDto> GetInboxAsync(GetGrantRequestInboxInput input);

    Task<GrantRequestTabCountsDto> GetTabCountsAsync();
}
