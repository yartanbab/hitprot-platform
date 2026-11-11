using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Tenants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Yazdırılan başlıklarda kurum, Kurum Profili'ndeki bilgisiyle anılır: fatura başlığında
/// unvan + vergi dairesi/no + adres (önce sabit "APYA PLATFORM / VDK 1234567890" basılıyordu),
/// pano baskısında resmî unvan (önce unvandan türetilmiş kısa kiracı adı).
/// </summary>
public class IssuerNamePrint_Tests : PlatformWebTestBase
{
    private const string LegalName = "Baskı Testi Eğitim Derneği";

    [Fact]
    public async Task Fatura_basligi_kurumun_kendi_bilgisini_basar()
    {
        var tenantId = await CreateTenantAsync();
        var invoiceId = Guid.NewGuid();

        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            await GetRequiredService<IRepository<Invoice, Guid>>().InsertAsync(
                new Invoice(invoiceId, tenantId, Guid.NewGuid(), "QA-BASKI-1", DateTime.Today, DateTime.Today.AddDays(15),
                    20, "TRY", InvoiceDirection.Sales, customerId: null, taskId: null),
                autoSave: true);
        }

        await WithTenantClientAsync(tenantId, async client =>
        {
            var html = HtmlEntity.DeEntitize(await client.GetStringAsync("/Invoices/Print/" + invoiceId));

            html.ShouldContain(LegalName);
            html.ShouldContain("Halkalı V.D. · 4567891230");
            html.ShouldContain("Merkez Mah. Atatürk Cad. No:1, İstanbul");
            html.ShouldNotContain("VDK 1234567890");
        });
    }

    /// <summary>
    /// "PDF indir": aynı faturanın PDF kopyası kurumun kendi bilgisini ve fatura numarasını taşır,
    /// e-fatura yerine geçmediğini yazar; yazdırma sayfasındaki yer tutucu VDK/IBAN PDF'e girmez.
    /// </summary>
    [Fact]
    public async Task Fatura_pdf_kurum_bilgisi_ve_uyari_ile_iner()
    {
        var tenantId = await CreateTenantAsync();
        var invoiceId = Guid.NewGuid();

        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            await GetRequiredService<IRepository<Invoice, Guid>>().InsertAsync(
                new Invoice(invoiceId, tenantId, Guid.NewGuid(), "QA-PDF-1", DateTime.Today, DateTime.Today.AddDays(15),
                    20, "TRY", InvoiceDirection.Sales, customerId: null, taskId: null),
                autoSave: true);
        }

        await WithTenantClientAsync(tenantId, async client =>
        {
            var response = await client.GetAsync($"/Invoices/Print/{invoiceId}?handler=Pdf");
            response.IsSuccessStatusCode.ShouldBeTrue();
            response.Content.Headers.ContentType!.MediaType.ShouldBe("application/pdf");
            response.Content.Headers.ContentDisposition!.FileName!.ShouldContain("QA-PDF-1");

            using var pdf = UglyToad.PdfPig.PdfDocument.Open(await response.Content.ReadAsByteArrayAsync());
            // PDF metninde sözcük boşlukları güvenilir değil; boşluksuz karşılaştırılır. Yazı tipi
            // "ti"yi bitişik harfle çizer ve okuyucu onu tek işaret olarak çıkarır: unvanın "ti"
            // içermeyen parçasıyla bakılır.
            var text = string.Concat(pdf.GetPages().Select(p => p.Text)).Replace(" ", "");
            text.ShouldContain("Derneği");
            text.ShouldContain("QA-PDF-1");
            text.ShouldContain("4567891230");
            text.ShouldContain("e-faturayadae-arşivfaturayerinegeçmez");
            text.ShouldNotContain("1234567890");
            text.ShouldNotContain("TR00");
        });
    }

    [Fact]
    public async Task Pano_baski_kunyesi_resmi_unvani_tasir()
    {
        var tenantId = await CreateTenantAsync();

        await WithTenantClientAsync(tenantId, async client =>
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(await client.GetStringAsync("/Dashboard"));
            var json = doc.DocumentNode.SelectSingleNode("//script[@id='apya-dashboard-print-context']")?.InnerText;
            json.ShouldNotBeNull();

            using var context = JsonDocument.Parse(json);
            context.RootElement.GetProperty("tenantName").GetString().ShouldBe(LegalName);
        });
    }

    private async Task<Guid> CreateTenantAsync()
    {
        // Sabit vergi numarası: her test kendi test sunucusunu (ve bellek içi veritabanını) kurar,
        // numara tekilliği testler arasında çakışmaz.
        var created = await GetRequiredService<ITenantProfileAppService>().CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "baski-" + Guid.NewGuid().ToString("N")[..12],
            LegalName = LegalName,
            AdminEmailAddress = "baski-" + Guid.NewGuid().ToString("N") + "@ornek.org",
            AdminPassword = "1q2w3E*asd",
            CompanyType = CompanyType.Association,
            TaxNumber = "4567891230",
            TaxOffice = "Halkalı",
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul"
        });

        return created.TenantId;
    }
}
