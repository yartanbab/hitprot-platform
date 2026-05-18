using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Reports;

public interface ITrialBalanceAppService : IApplicationService
{
    /// <summary>Yönetim özet mizanı: Kasa/Cari(AR/AP)/Gelir/Gider hesap grupları, Borç/Alacak/Bakiye.</summary>
    Task<TrialBalanceReportDto> GetAsync(GetTrialBalanceInput input);
}
