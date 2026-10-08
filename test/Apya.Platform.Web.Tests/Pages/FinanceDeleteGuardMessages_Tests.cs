using System;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Customers;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Cari ve kasa silme reddi kullanıcıya ham hata koduyla değil, ne yapacağını söyleyen Türkçe
/// metinle ulaşır (kodun <c>tr.json</c> karşılığı yoksa ABP kodu olduğu gibi basar).
/// </summary>
public class FinanceDeleteGuardMessages_Tests : PlatformWebTestBase
{
    [Fact]
    public void Cari_Silme_Reddi_Kullaniciya_Turkce_Metinle_Ulasir()
    {
        using (CultureHelper.Use("tr"))
        {
            var info = GetRequiredService<IExceptionToErrorInfoConverter>().Convert(
                new BusinessException(PlatformDomainErrorCodes.CustomerInUse), _ => { });

            info.Message.ShouldNotBeNull();
            info.Message.ShouldNotContain("Platform:Customer", Case.Sensitive);
            info.Message.ShouldContain("pasife alın");
        }
    }

    [Fact]
    public void Kasa_Silme_Reddi_Kullaniciya_Turkce_Metinle_Ulasir()
    {
        using (CultureHelper.Use("tr"))
        {
            var info = GetRequiredService<IExceptionToErrorInfoConverter>().Convert(
                new BusinessException(PlatformDomainErrorCodes.CashAccountInUse).WithData("MovementCount", 4), _ => { });

            info.Message.ShouldNotBeNull();
            info.Message.ShouldNotContain("Platform:CashAccount", Case.Sensitive);
            info.Message.ShouldContain("4 hareket");
            info.Message.ShouldContain("pasife alın");
        }
    }

    /// <summary>
    /// Cari ekranının bastığı yol: silme ucu reddi 403 + hata gövdesiyle döner (ABP onu pencerede
    /// gösterir) ve cari yerinde kalır.
    /// </summary>
    [Fact]
    public async Task Cari_Ekraninin_Cagirdigi_Silme_Ucu_Kaydi_Olan_Cariyi_Reddeder()
    {
        var customerId = Guid.NewGuid();
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var tenantId = GetRequiredService<ICurrentTenant>().Id;
            await GetRequiredService<IRepository<Customer, Guid>>().InsertAsync(
                new Customer(customerId, "Silinemeyen Cari", tenantId), autoSave: true);
            await GetRequiredService<IRepository<CustomerLedgerEntry, Guid>>().InsertAsync(
                new CustomerLedgerEntry(
                    Guid.NewGuid(), customerId, CustomerLedgerDirection.Debit, 250m, DateTime.Today, tenantId: tenantId),
                autoSave: true);
            await uow.CompleteAsync();
        }

        using var request = new HttpRequestMessage(HttpMethod.Delete, $"/api/app/customer/{customerId}");
        request.Headers.AcceptLanguage.ParseAdd("tr");
        var response = await Client.SendAsync(request);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var error = body.RootElement.GetProperty("error");
        error.GetProperty("code").GetString().ShouldBe(PlatformDomainErrorCodes.CustomerInUse);
        error.GetProperty("message").GetString()!.ShouldContain("pasife alın");

        (await Client.GetAsync($"/api/app/customer/{customerId}")).StatusCode.ShouldBe(HttpStatusCode.OK);
    }
}
