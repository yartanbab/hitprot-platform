using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.CustomerLedger;

public interface ICustomerLedgerAppService : IApplicationService
{
    /// <summary>Bir müşterinin cari ekstresi (hareketler + yürüyen bakiye + toplamlar).</summary>
    /// <param name="currency">Belirtilirse yalnız bu para birimindeki hareketler dahil edilir (null = tümü).</param>
    Task<CustomerStatementDto> GetStatementAsync(Guid customerId, DateTime? fromDate = null, DateTime? toDate = null, string? currency = null);

    /// <summary>Müşterinin güncel net bakiyesi (Σ Borç − Σ Alacak).</summary>
    Task<decimal> GetBalanceAsync(Guid customerId);
}
