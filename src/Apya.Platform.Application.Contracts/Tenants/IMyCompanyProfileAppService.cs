using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>Kurumun kendi profilini görmesi ve düzenlemesi.</summary>
public interface IMyCompanyProfileAppService : IApplicationService
{
    Task<MyCompanyProfileDto> GetAsync();

    Task UpdateAsync(UpdateTenantProfileDto input);
}
