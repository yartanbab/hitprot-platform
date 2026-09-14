using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 18c · Host · Çağrı dönüşüm hunisi ve hunideki görüntülenme sayımı.
/// </summary>
public interface IGrantFunnelAppService : IApplicationService
{
    /// <summary>Host kataloğundaki çağrılar; açıklar önce.</summary>
    Task<List<GrantFunnelCallDto>> GetCallsAsync();

    /// <param name="callId">Host çağrısı.</param>
    /// <param name="days">Pencere: 30, 60 ya da 90 gün (başka değer 60'a yuvarlanır).</param>
    Task<GrantFunnelDto> GetAsync(Guid callId, int days = 60);

    /// <summary>pargetto.com çağrı detayı açıldı. Sayfa modeli çağırır; uzak API'ye açık değildir.</summary>
    Task RecordPublicViewAsync(Guid callId);

    /// <summary>Kiracı platformda çağrı detayını açtı. Sayfa modeli çağırır; uzak API'ye açık değildir.</summary>
    Task RecordTenantViewAsync(Guid callId);
}
