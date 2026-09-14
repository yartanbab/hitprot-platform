using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>Kurumun kendi profilini görmesi ve düzenlemesi.</summary>
public interface IMyCompanyProfileAppService : IApplicationService
{
    Task<MyCompanyProfileDto> GetAsync();

    /// <summary>
    /// Kurumun gösterilen adı (resmî unvan; yoksa kiracı adı) — yazdırılan başlıklar için hafif
    /// okuma. Host bağlamında <c>null</c>.
    /// </summary>
    Task<string?> GetDisplayNameAsync();

    Task UpdateAsync(UpdateTenantProfileDto input);
}
