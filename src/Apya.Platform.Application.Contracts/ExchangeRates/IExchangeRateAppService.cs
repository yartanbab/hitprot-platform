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
    /// <summary>
    /// TCMB kur bülteninden USD/EUR/GBP → TRY döviz ALIŞ kurlarını (kullanıcı kararı 2026-10-19) bültenin
    /// kendi tarihiyle upsert eder. <paramref name="date"/> verilirse o günün arşiv bülteni çekilir.
    /// </summary>
    Task<int> SyncFromTcmbAsync(DateTime? date = null);
}
