using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 21a/22 · Host Çağrılar ekranı. Yalnız okur; çağrı ve program yazımı mevcut servislerde
/// (GrantCall, GrantParameter). 🔴 HOST-ONLY: firma eşleşme sayısı kiracılar arası hesaplanır.
/// </summary>
public interface IGrantCallBoardAppService : IApplicationService
{
    Task<GrantCallBoardDto> GetAsync(GetGrantCallBoardInput input);
}
