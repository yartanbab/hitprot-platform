using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;

namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// FUX-03: aktif kasa hesaplarını güncel bakiyeleriyle okur.
/// <para>Aynı "hesap listesi + hesap başına bakiye" döngüsü Kasa &amp; Banka sayfasında ve
/// Finans Merkezi'nde iki kez yazılmıştı ve zamanla ayrışıyordu. Okuma tek yerde; her sayfa
/// sonucu kendi görünüm modeline çevirir ve kendi kilit/hata durumunu kendisi yönetir.</para>
/// </summary>
public static class CashAccountBalanceLoader
{
    public sealed record Row(CashAccountDto Account, decimal Balance);

    public static async Task<List<Row>> LoadActiveAsync(
        ICashAccountAppService cashAccountAppService,
        ICashMovementAppService cashMovementAppService)
    {
        var result = await cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });

        var rows = new List<Row>(result.Items.Count);
        foreach (var account in result.Items)
        {
            var balance = await cashMovementAppService.GetBalanceAsync(account.Id);
            rows.Add(new Row(account, balance.CurrentBalance));
        }

        return rows;
    }
}
