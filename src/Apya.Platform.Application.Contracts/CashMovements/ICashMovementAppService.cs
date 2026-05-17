using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.CashMovements;

public interface ICashMovementAppService :
    ICrudAppService<
        CashMovementDto,
        Guid,
        GetCashMovementsInput,
        CreateUpdateCashMovementDto>
{
    /// <summary>Bir kasanın güncel bakiye özetini döndürür (açılış + Σgiriş − Σçıkış).</summary>
    Task<CashAccountBalanceDto> GetBalanceAsync(Guid cashAccountId);
}
