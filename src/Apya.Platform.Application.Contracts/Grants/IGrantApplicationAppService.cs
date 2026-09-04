using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracının kendi başvuruları — salt okuma. Başvuru açan uç YOK: kiracı çağrıya
/// ilgi bildirir (<see cref="IGrantInterestAppService"/>), başvuruyu host'un kararı
/// doğurur (<see cref="IGrantInterestHostAppService"/>).
/// </summary>
public interface IGrantApplicationAppService : IApplicationService
{
    Task<List<GrantApplicationDto>> GetMyApplicationsAsync();
    Task<TenantGrantDashboardDto> GetMyDashboardAsync();
}
