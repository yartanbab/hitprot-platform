using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kiracının kendi paketini görmesi. <see cref="IPackageAppService"/> host uçudur
/// (paket içeriğini DÜZENLER); bu uç kiracıya açıktır ve yalnız OKUR.
/// </summary>
public interface IMySubscriptionAppService : IApplicationService
{
    /// <summary>Yürürlükteki paket, süre, kota kullanımı ve üst paketlerin getirileri.</summary>
    Task<MySubscriptionDto> GetAsync();
}
