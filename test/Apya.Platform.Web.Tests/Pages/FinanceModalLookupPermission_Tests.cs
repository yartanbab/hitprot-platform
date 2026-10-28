using System;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Gider/gelir pencereleri, kasa yönetme ve cari izni OLMAYAN kullanıcıya da açılır.
///
/// <para>Canlıda görevin "Gider ekle" düğmesi (yalnız Expenses.Create'e bakar) pencereyi 403 ile
/// açamıyordu: pencere kasa listesini kasa servisinden (CashAccounts.Default) ve cari listesini
/// cari servisinden (Customers.Default) çekiyordu. Kasalar artık gider/gelir servisinden gelir,
/// cari listesi hiç çekilmez (form cari sormuyor).</para>
///
/// <para>Test barındırıcısı normalde her izne "evet" der; bu sınıf iki izni reddeder
/// (bkz. <see cref="DenyPermissionsAuthorizationService"/>).</para>
/// </summary>
public class FinanceModalLookupPermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(
            PlatformPermissions.CashAccounts.Default, PlatformPermissions.Customers.Default);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    private async Task<(string ActiveName, string InactiveName, Guid ExpenseId, Guid IncomeId)> SeedAsync()
    {
        var code = Guid.NewGuid().ToString("N")[..6];
        var activeName = "Etkin kasa " + code;
        var inactiveName = "Kapalı kasa " + code;
        var expenseId = Guid.NewGuid();
        var incomeId = Guid.NewGuid();

        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var accounts = GetRequiredService<IRepository<CashAccount, Guid>>();
            var activeId = Guid.NewGuid();
            await accounts.InsertAsync(new CashAccount(activeId, activeName), autoSave: true);
            var inactive = new CashAccount(Guid.NewGuid(), inactiveName);
            inactive.Deactivate();
            await accounts.InsertAsync(inactive, autoSave: true);

            await GetRequiredService<IRepository<Expense, Guid>>().InsertAsync(
                new Expense(expenseId, "Kasa izinsiz gider", 100m, activeId, DateTime.Today, ExpenseCategory.Service, "TRY"),
                autoSave: true);
            await GetRequiredService<IRepository<IncomeEntry, Guid>>().InsertAsync(
                new IncomeEntry(incomeId, "Kasa izinsiz gelir", 100m, DateTime.Today, cashAccountId: activeId),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return (activeName, inactiveName, expenseId, incomeId);
    }

    [Fact]
    public async Task Gider_ve_gelir_pencereleri_kasa_ve_cari_izni_olmadan_acilir()
    {
        var (activeName, inactiveName, expenseId, incomeId) = await SeedAsync();

        foreach (var url in new[]
                 {
                     "/Expenses/CreateModal?TaskId=" + Guid.NewGuid(),
                     "/Expenses/EditModal?id=" + expenseId,
                     "/Incomes/CreateModal?TaskId=" + Guid.NewGuid(),
                     "/Incomes/EditModal?id=" + incomeId,
                 })
        {
            var html = System.Net.WebUtility.HtmlDecode(await GetResponseAsStringAsync(url));

            html.ShouldContain(activeName + " (TRY)", Case.Sensitive, $"{url}: etkin kasa seçicide yok.");
            html.ShouldNotContain(inactiveName, Case.Sensitive, $"{url}: kapalı kasa seçicide çıktı.");
        }
    }
}
