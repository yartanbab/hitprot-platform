using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Billing;
using Apya.Platform.Billing.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Faturalama panelinin SAYFA sözleşmesi: liste render olur, fatura açılır ve tahsilat
/// kaydı gerçekten yazılır.
///
/// <para>Test host'u <c>AddAlwaysAllowAuthorization</c> kullanır; izin kapısı burada
/// ölçülmez (gerçek kapı <c>[Authorize]</c> + DbMigrator tohumu). Ölçülen YAPIDIR —
/// Razor, DI, tag-helper ve <b>ondalık bağlama</b> hataları bu suite'te yakalanır.</para>
/// </summary>
public class BillingPage_Tests : PlatformWebTestBase
{
    private readonly IBillingAppService _billing;

    public BillingPage_Tests()
    {
        _billing = GetRequiredService<IBillingAppService>();
    }

    private static string AntiforgeryToken(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");

        return input.GetAttributeValue("value", "");
    }

    [Fact]
    public async Task Panel_render_olur_ve_yeni_fatura_formunu_basar()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Admin/Billing"));

        html.ShouldContain("Faturalar");
        html.ShouldContain("Tahsil edilmemiş toplam");

        // Yeni fatura formu
        html.ShouldContain("name=\"NewInvoice.TenantId\"");
        html.ShouldContain("name=\"NewInvoice.NetAmount\"");
        html.ShouldContain("name=\"NewInvoice.VatMode\"");

        // 🔴 Ondalık alanlar elle name= ile yazıldı → __Invariant işaretçisi ŞART.
        // Onsuz tr-TR bağlaması noktayı binlik sayar ve tutar bin kat sapar.
        html.ShouldContain("name=\"__Invariant\" value=\"NewInvoice.NetAmount\"");
        html.ShouldContain("name=\"__Invariant\" value=\"NewInvoice.VatRate\"");

        html.ShouldContain("__RequestVerificationToken");
    }

    /// <summary>
    /// Uçtan uca: formdan fatura açılır ve listede görünür. Tutar KESİRLİ seçildi —
    /// bağlama bozuk olsaydı 1234.56 → 123456 olurdu (bu repoda bir kez yaşandı).
    /// </summary>
    [Fact]
    public async Task Formdan_fatura_acilir_ve_tutar_bin_kat_sapmaz()
    {
        var tenantId = Guid.NewGuid();
        var pageHtml = await GetResponseAsStringAsync("/Admin/Billing");
        var token = AntiforgeryToken(pageHtml);

        var response = await Client.PostAsync("/Admin/Billing?handler=Create", new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                ["NewInvoice.TenantId"] = tenantId.ToString(),
                ["NewInvoice.Type"] = nameof(SubscriptionInvoiceType.License),
                ["NewInvoice.IssueDate"] = "2026-03-10",
                ["NewInvoice.NetAmount"] = "1234.56",
                ["__Invariant"] = "NewInvoice.NetAmount",
                ["NewInvoice.VatMode"] = nameof(VatMode.TeknoparkExempt),
                ["NewInvoice.VatRate"] = "0",
                ["__RequestVerificationToken"] = token
            }));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var list = await _billing.GetListAsync(new SubscriptionInvoiceFilterDto { TenantId = tenantId });
        var invoice = list.Items.ShouldHaveSingleItem();

        invoice.NetAmount.ShouldBe(1234.56m);
        invoice.TotalAmount.ShouldBe(1234.56m);       // Teknopark istisnası → KDV yok
        invoice.DueDate.ShouldBe(new DateTime(2026, 3, 10).AddDays(15));
        invoice.Status.ShouldBe(SubscriptionInvoiceStatus.Issued);
    }

    /// <summary>
    /// Satırdaki tahsilat formu gerçekten yazıyor mu? Alan adları <c>payment*</c> ön ekli:
    /// sayfa süzgeç değerlerini de taşıyor ve model bağlama alan adlarında büyük/küçük
    /// harfe DUYARSIZ — aynı adı kullanmak süzgecin değerini forma sızdırırdı.
    /// </summary>
    [Fact]
    public async Task Panelden_tahsilat_kaydedilir()
    {
        var tenantId = Guid.NewGuid();
        var invoice = await _billing.CreateAsync(new CreateSubscriptionInvoiceDto
        {
            TenantId = tenantId,
            Type = SubscriptionInvoiceType.License,
            IssueDate = DateTime.Today,
            NetAmount = 2_000m,
            VatMode = VatMode.TeknoparkExempt
        });

        var pageHtml = await GetResponseAsStringAsync("/Admin/Billing");
        var token = AntiforgeryToken(pageHtml);

        var response = await Client.PostAsync("/Admin/Billing?handler=RecordPayment", new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                ["id"] = invoice.Id.ToString(),
                ["paymentPaidAt"] = DateTime.Today.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                ["paymentAmount"] = "750.25",
                ["__Invariant"] = "paymentAmount",
                ["paymentMethod"] = nameof(PaymentMethod.BankTransfer),
                ["paymentReference"] = "EFT-QA",
                ["__RequestVerificationToken"] = token
            }));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var saved = await _billing.GetAsync(invoice.Id);

        saved.PaidAmount.ShouldBe(750.25m);
        saved.RemainingAmount.ShouldBe(1_249.75m);
        saved.Status.ShouldBe(SubscriptionInvoiceStatus.PartiallyPaid);
        saved.Payments.ShouldHaveSingleItem().IsConfirmed.ShouldBeTrue();
    }

    /// <summary>Vadesi geçen fatura listede AYRI işaretlenmeli — host'un ilk baktığı şey.</summary>
    [Fact]
    public async Task Vadesi_gecen_fatura_listede_isaretlenir()
    {
        var past = DateTime.Today.AddDays(-40);
        var tenantId = Guid.NewGuid();

        await _billing.CreateAsync(new CreateSubscriptionInvoiceDto
        {
            TenantId = tenantId,
            Type = SubscriptionInvoiceType.License,
            IssueDate = past,
            DueDate = past.AddDays(15),
            NetAmount = 100m,
            VatMode = VatMode.TeknoparkExempt
        });

        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Admin/Billing?TenantId={tenantId}"));

        html.ShouldContain("Vadesi geçti");
    }

    [Fact]
    public async Task Bos_susgecte_uyari_basar()
    {
        var html = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Admin/Billing?TenantId={Guid.NewGuid()}"));

        html.ShouldContain("Bu süzgece uyan fatura yok.");
    }
}
