using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Host: İlgi Talepleri kutusu. Talep değerlendirilir; süreç başlatılırsa başvuru
/// BURADA doğar, uygun bulunmazsa gerekçe firmaya bildirim olarak gider.
///
/// <para>🔴 HOST-ONLY: kutu kiracılar arası bakar.</para>
/// </summary>
public interface IGrantInterestHostAppService : IApplicationService
{
    /// <param name="onlyPending">true = yalnız karara bağlanmamış talepler.</param>
    Task<GrantInterestConsoleDto> GetAsync(bool onlyPending);

    Task<GrantInterestConsoleDto> StartReviewAsync(Guid interestId);

    /// <summary>Başvuru sürecini başlatır: kiracı bağlamında başvuru açılır.</summary>
    Task<GrantInterestConsoleDto> StartApplicationAsync(Guid interestId);

    Task<GrantInterestConsoleDto> RejectAsync(RejectGrantInterestInput input);
}
