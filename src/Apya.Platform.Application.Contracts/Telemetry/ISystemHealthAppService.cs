using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Telemetry.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Telemetry;

/// <summary>Host yöneticisi için teşhis paneli. Yalnızca host bağlamında çalışır.</summary>
public interface ISystemHealthAppService : IApplicationService
{
    Task<SystemHealthDto> GetAsync(int windowDays = 7);

    Task<PagedResultDto<ClientErrorDto>> GetClientErrorsAsync(GetClientErrorListInput input);

    Task<ClientErrorDto> GetClientErrorAsync(Guid id);

    Task SetClientErrorResolvedAsync(Guid id, bool isResolved);

    /// <summary>
    /// Bir URL'in pencere içindeki sunucu hataları — "En Çok Hata Veren Sayfalar"
    /// satırından açılan detay için. Yeni tablo yok; AbpAuditLogs okunur.
    /// </summary>
    Task<List<ServerErrorDetailDto>> GetServerErrorsAsync(GetServerErrorListInput input);
}
