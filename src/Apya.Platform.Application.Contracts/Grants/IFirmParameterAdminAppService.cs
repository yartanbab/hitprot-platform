using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>Kurum parametre kataloğunun host yönetimi.</summary>
public interface IFirmParameterAdminAppService : IApplicationService
{
    Task<List<FirmParameterDefinitionDto>> GetListAsync();

    Task<FirmParameterDefinitionDto> GetAsync(Guid id);

    Task<FirmParameterDefinitionDto> CreateAsync(SaveFirmParameterDefinitionDto input);

    Task<FirmParameterDefinitionDto> UpdateAsync(Guid id, SaveFirmParameterDefinitionDto input);

    Task DeleteAsync(Guid id);
}
