using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı: çağrıya ilgi bildirme ve kendi taleplerini izleme.
///
/// <para>Başvuruyu kiracı AÇMAZ; host talebi değerlendirip süreci başlatır
/// (<see cref="IGrantInterestHostAppService"/>).</para>
/// </summary>
public interface IGrantInterestAppService : IApplicationService
{
    Task<MyGrantInterestDto> ExpressAsync(ExpressGrantInterestInput input);

    Task<List<MyGrantInterestDto>> GetMineAsync();
}
