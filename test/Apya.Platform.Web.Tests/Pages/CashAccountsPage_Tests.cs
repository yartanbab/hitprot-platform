using System;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /CashAccounts — hareket yazmalarından sonra kartlar ve konsolide toplam sayfa yenilenmeden
/// <c>?handler=AccountSummary</c> parçasıyla tazelenir (STA-14, FIN-09). Parça sayfanın ilk
/// basımıyla AYNI işaretlemedir; burada o parçanın yazmaları gerçekten yansıttığı ölçülür —
/// transferin iki bacağı dahil (tek kart değil özetin tamamının basılma gerekçesi).
///
/// Test host'u AddAlwaysAllowAuthorization kullanır ve host bağlamında koşar. Başka testlerin
/// kasaları da bulunabildiği için kartlar sayıyla değil kimlikle bulunur.
/// </summary>
public class CashAccountsPage_Tests : PlatformWebTestBase
{
    private const string SummaryUrl = "/CashAccounts?handler=AccountSummary";

    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private async Task<Guid> SeedAccountAsync(string name, decimal openingBalance)
    {
        var id = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var accounts = GetRequiredService<IRepository<CashAccount, Guid>>();
            await accounts.InsertAsync(new CashAccount(id, name + " " + id.ToString("N")[..6], openingBalance: openingBalance), autoSave: true);
            await uow.CompleteAsync();
        }

        return id;
    }

    /// <summary>Verilen kök altında, kimliği verilen kartın bakiye metni.</summary>
    private static string CardBalance(HtmlNode root, Guid accountId)
    {
        var card = root.SelectSingleNode($".//button[@data-account-id='{accountId}']");
        card.ShouldNotBeNull($"{accountId} kartı basılmadı");

        var balance = card!.SelectSingleNode(".//div[contains(@class,'apya-numeric')]");
        balance.ShouldNotBeNull("kartta bakiye satırı yok");
        return HtmlEntity.DeEntitize(balance!.InnerText).Trim();
    }

    private static string TotalBalance(HtmlDocument doc)
    {
        var total = doc.DocumentNode.SelectSingleNode("//h2[contains(@class,'apya-numeric')]");
        total.ShouldNotBeNull("konsolide toplam basılmadı");
        return HtmlEntity.DeEntitize(total!.InnerText).Trim();
    }

    [Fact]
    public async Task Hesap_ozeti_parca_olarak_sunulur_ve_sayfa_ayni_parcayi_basar()
    {
        var id = await SeedAccountAsync("QA özet kasa", 1000m);

        var partial = await GetResponseAsStringAsync(SummaryUrl);
        partial.ShouldContain("apya-account-card");
        partial.ShouldNotContain("<html", Case.Insensitive, "parça tam sayfa değil, yalnız özet olmalı");

        var page = Parse(await GetResponseAsStringAsync("/CashAccounts"));
        var wrapper = page.DocumentNode.SelectSingleNode("//div[@id='AccountSummary']");
        wrapper.ShouldNotBeNull("sayfa özeti #AccountSummary sarmalayıcısı içinde basmalı (JS parçayı oraya koyuyor)");

        CardBalance(wrapper!, id).ShouldBe(CardBalance(Parse(partial).DocumentNode, id));
    }

    [Fact]
    public async Task Hesap_ozeti_sonraki_hareketi_yansitir()
    {
        var id = await SeedAccountAsync("QA hareket kasa", 1000m);

        var before = Parse(await GetResponseAsStringAsync(SummaryUrl));
        var t1 = CardBalance(before.DocumentNode, id);
        var total1 = TotalBalance(before);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var movements = GetRequiredService<IRepository<CashMovement, Guid>>();
            await movements.InsertAsync(new CashMovement(
                Guid.NewGuid(), id, CashMovementDirection.In, 250.50m, DateTime.Today, "QA giriş"), autoSave: true);
            await uow.CompleteAsync();
        }

        var after = Parse(await GetResponseAsStringAsync(SummaryUrl));
        CardBalance(after.DocumentNode, id).ShouldNotBe(t1, "parça sonradan eklenen hareketi yansıtmıyor (bayat)");
        TotalBalance(after).ShouldNotBe(total1, "konsolide toplam sonradan eklenen hareketi yansıtmıyor");
    }

    [Fact]
    public async Task Transfer_sonrasi_ozet_iki_hesabi_da_yansitir()
    {
        var from = await SeedAccountAsync("QA gönderen kasa", 1000m);
        var to = await SeedAccountAsync("QA alıcı kasa", 1000m);

        var before = Parse(await GetResponseAsStringAsync(SummaryUrl)).DocumentNode;
        var fromBefore = CardBalance(before, from);
        var toBefore = CardBalance(before, to);

        await GetRequiredService<ICashMovementAppService>().TransferAsync(new CreateCashTransferDto
        {
            FromCashAccountId = from,
            ToCashAccountId = to,
            Amount = 100m
        });

        var after = Parse(await GetResponseAsStringAsync(SummaryUrl)).DocumentNode;
        CardBalance(after, from).ShouldNotBe(fromBefore, "transferin çıkış bacağı parçaya yansımadı");
        CardBalance(after, to).ShouldNotBe(toBefore, "transferin giriş bacağı parçaya yansımadı");
    }
}
