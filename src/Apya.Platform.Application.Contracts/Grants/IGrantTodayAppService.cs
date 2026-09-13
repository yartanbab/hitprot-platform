using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 11a/11b · "Bugün". Kiracı bağlamında firmanın kendi işleri; host bağlamında danışman
/// ekibinin kiracılar arası gelen kutusu. Tek uç, bağlama göre iki görünüm.
/// </summary>
public interface IGrantTodayAppService : IApplicationService
{
    Task<GrantTodayDto> GetAsync();
}
