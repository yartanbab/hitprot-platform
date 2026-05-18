using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.ProjectFinance;

public interface IProjectFinanceAppService : IApplicationService
{
    /// <summary>Proje bütçe-vs-gerçekleşen özeti (gider/gelir/net/kalan + task kırılımı).</summary>
    Task<ProjectFinanceSummaryDto> GetSummaryAsync(Guid projectId);
}
