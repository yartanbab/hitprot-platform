using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Ai.Dashboard;

public interface IAiDashboardAppService : IApplicationService
{
    Task<AiDashboardDto> GetAsync();
}
