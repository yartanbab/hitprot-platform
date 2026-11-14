using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>Programların kurum parametrelerine koyduğu ölçütlerin host yönetimi.</summary>
public interface IGrantParameterCriterionAppService : IApplicationService
{
    Task<GrantParameterCriteriaDto> GetAsync(Guid grantId);

    Task<GrantParameterCriteriaDto> AddAsync(AddGrantParameterCriterionDto input);

    Task DeleteAsync(Guid id);
}
