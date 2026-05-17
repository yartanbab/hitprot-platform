using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.ExchangeRates;

public interface IExchangeRateAppService :
    ICrudAppService<
        ExchangeRateDto,
        Guid,
        GetExchangeRatesInput,
        CreateUpdateExchangeRateDto>
{
    /// <summary>TCMB günlük kurlarını çekip USD/EUR/GBP → TRY kayıtlarını upsert eder.</summary>
    Task<int> SyncFromTcmbAsync();
}
