using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Reports;

public interface IReportAppService : IApplicationService
{
    Task<DashboardReportDto> GetDashboardStatsAsync();
}
