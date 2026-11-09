using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Fatura düzenleme penceresi: Taslak fatura baştan düzenlenir (kalemler invariant değerle basılır ve
/// geri bağlanır); ödeme alınmış faturada yalnız cari ve yön kilitlidir, tutar ve kalemler düzelir.
/// </summary>
public class InvoiceEditModal_Tests : PlatformWebTestBase
{
    private async Task<InvoiceDto> InvoiceAsync()
    {
        var projectId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, GetRequiredService<ICurrentTenant>().Id, null, "Fatura düzenleme", "FDM-" + projectId.ToString("N")[..6], ""),
                autoSave: true);
            await uow.CompleteAsync();
        }

        return await GetRequiredService<IInvoiceAppService>().CreateAsync(new CreateInvoiceDto
        {
            ProjectId = projectId,
            Direction = InvoiceDirection.Purchase,
            InvoiceNumber = "FDM-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = new DateTime(2026, 10, 17),
            DueDate = new DateTime(2026, 11, 20),
            TaxRate = 20,
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Tablet", Quantity = 1, UnitPrice = 16739.07m } }
        });
    }

    private static string Token(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");
    }

    // Pencere formu jeton basmaz (ABP ModalManager başlıkla gönderir): jeton, basan bir sayfadan alınır.
    private async Task<HttpResponseMessage> PostAsync(InvoiceDto invoice, List<KeyValuePair<string, string>> fields)
    {
        fields.Add(new("Id", invoice.Id.ToString()));
        fields.Add(new("__RequestVerificationToken", Token(await GetResponseAsStringAsync("/Projects/Edit/" + invoice.ProjectId))));
        return await Client.PostAsync("/Invoices/EditModal", new FormUrlEncodedContent(fields));
    }

    [Fact]
    public async Task Taslak_fatura_penceresi_kalemleri_invariant_basar_ve_kaydeder()
    {
        var invoice = await InvoiceAsync();

        var html = await GetResponseAsStringAsync("/Invoices/EditModal?id=" + invoice.Id);

        html.ShouldContain("value=\"16739.07\"", Case.Sensitive);
        html.ShouldContain("value=\"InvoiceInfo.Items[0].UnitPrice\"", Case.Sensitive);
        html.ShouldContain("optionalLine: true", Case.Sensitive);

        // Kalem tutarı noktalı (invariant) gider: işaretçi olmadan 1234.5 → 12345 bağlanırdı.
        var response = await PostAsync(invoice, new()
        {
            new("InvoiceInfo.ProjectId", invoice.ProjectId.ToString()),
            new("InvoiceInfo.Direction", "1"),
            new("InvoiceInfo.InvoiceNumber", invoice.InvoiceNumber + "-D"),
            new("InvoiceInfo.InvoiceDate", "2026-10-18"),
            new("InvoiceInfo.DueDate", "2026-11-30"),
            new("InvoiceInfo.TaxRate", "10"),
            new("__Invariant", "InvoiceInfo.TaxRate"),
            new("InvoiceInfo.Items[0].Description", "Tablet"),
            new("InvoiceInfo.Items[0].Quantity", "2"),
            new("__Invariant", "InvoiceInfo.Items[0].Quantity"),
            new("InvoiceInfo.Items[0].UnitPrice", "1234.5"),
            new("__Invariant", "InvoiceInfo.Items[0].UnitPrice")
        });

        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);
        var saved = await GetRequiredService<IInvoiceAppService>().GetAsync(invoice.Id);
        saved.InvoiceNumber.ShouldBe(invoice.InvoiceNumber + "-D");
        saved.TotalAmount.ShouldBe(2715.9m); // 2 × 1234,5 × 1,10
    }

    [Fact]
    public async Task Odeme_alinmis_faturada_cari_ve_yon_kilitli_tutar_duzeltilir()
    {
        var invoice = await InvoiceAsync();
        await GetRequiredService<IInvoiceAppService>().AddPaymentAsync(invoice.Id, 100m, "Nakit", "fdm-odeme");

        var html = await GetResponseAsStringAsync("/Invoices/EditModal?id=" + invoice.Id);

        html.ShouldContain("name=\"InvoiceInfo.Items[0].UnitPrice\"", Case.Sensitive);
        html.ShouldContain("id=\"EditInvoiceAddItemBtn\"", Case.Sensitive);

        // Cari ve yön disabled basılır, tarayıcıdan gelmez: sunucu ikisini faturadan alır. Gelmeyen
        // yön varsayılana (Satış) düşseydi alış faturası kilit hatasıyla reddedilirdi.
        var response = await PostAsync(invoice, new()
        {
            new("InvoiceInfo.ProjectId", invoice.ProjectId.ToString()),
            new("InvoiceInfo.InvoiceNumber", invoice.InvoiceNumber),
            new("InvoiceInfo.InvoiceDate", "2026-10-17"),
            new("InvoiceInfo.DueDate", "2026-12-31"),
            new("InvoiceInfo.Notes", "vade uzadı"),
            new("InvoiceInfo.TaxRate", "20"),
            new("__Invariant", "InvoiceInfo.TaxRate"),
            new("InvoiceInfo.Items[0].Description", "Tablet"),
            new("InvoiceInfo.Items[0].Quantity", "1"),
            new("__Invariant", "InvoiceInfo.Items[0].Quantity"),
            new("InvoiceInfo.Items[0].UnitPrice", "1000"),
            new("__Invariant", "InvoiceInfo.Items[0].UnitPrice")
        });

        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);
        var saved = await GetRequiredService<IInvoiceAppService>().GetAsync(invoice.Id);
        saved.DueDate.ShouldBe(new DateTime(2026, 12, 31));
        saved.Notes.ShouldBe("vade uzadı");
        saved.Direction.ShouldBe(InvoiceDirection.Purchase);
        saved.TotalAmount.ShouldBe(1200m);
        saved.Status.ShouldBe(InvoiceStatus.Sent);
    }

    [Fact]
    public async Task KDV_dahil_isaretlenince_fiyat_KDV_haric_kaydedilir()
    {
        var invoice = await InvoiceAsync();

        var html = await GetResponseAsStringAsync("/Invoices/EditModal?id=" + invoice.Id);
        html.ShouldContain("name=\"InvoiceInfo.PricesIncludeTax\"", Case.Sensitive);

        var response = await PostAsync(invoice, new()
        {
            new("InvoiceInfo.ProjectId", invoice.ProjectId.ToString()),
            new("InvoiceInfo.Direction", "1"),
            new("InvoiceInfo.InvoiceNumber", invoice.InvoiceNumber),
            new("InvoiceInfo.InvoiceDate", "2026-10-17"),
            new("InvoiceInfo.DueDate", "2026-11-20"),
            new("InvoiceInfo.TaxRate", "20"),
            new("__Invariant", "InvoiceInfo.TaxRate"),
            new("InvoiceInfo.PricesIncludeTax", "true"),
            new("InvoiceInfo.Items[0].Description", "Tablet"),
            new("InvoiceInfo.Items[0].Quantity", "1"),
            new("__Invariant", "InvoiceInfo.Items[0].Quantity"),
            new("InvoiceInfo.Items[0].UnitPrice", "1200"),
            new("__Invariant", "InvoiceInfo.Items[0].UnitPrice")
        });

        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);
        var saved = await GetRequiredService<IInvoiceAppService>().GetAsync(invoice.Id);
        saved.Items.ShouldHaveSingleItem().UnitPrice.ShouldBe(1000m);
        saved.TotalAmount.ShouldBe(1200m);
    }

    [Fact]
    public async Task Projenin_istisna_belgesi_kaydedilir_yeni_fatura_penceresine_tasinir()
    {
        var invoice = await InvoiceAsync();

        var modal = await GetResponseAsStringAsync("/Finance/VatExemptionModal?projectId=" + invoice.ProjectId);
        modal.ShouldContain("name=\"Exemption.VatExemptionCertificateNo\"", Case.Sensitive);

        var response = await Client.PostAsync("/Finance/VatExemptionModal?projectId=" + invoice.ProjectId, new FormUrlEncodedContent(new List<KeyValuePair<string, string>>
        {
            new("Exemption.VatExemptionCertificateNo", "TB-77"),
            new("Exemption.VatExemptionValidUntil", "2026-12-31"),
            new("__RequestVerificationToken", Token(await GetResponseAsStringAsync("/Projects/Edit/" + invoice.ProjectId)))
        }));
        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);

        // Yeni fatura penceresi, betiğin belge no'yu önden doldurması için projenin belgesini taşır.
        var create = await GetResponseAsStringAsync("/Invoices/CreateModal");
        create.ShouldContain(invoice.ProjectId.ToString(), Case.Sensitive);
        create.ShouldContain("TB-77", Case.Sensitive);
        create.ShouldContain("name=\"InvoiceInfo.VatExemptionReference\"", Case.Sensitive);
    }
}
