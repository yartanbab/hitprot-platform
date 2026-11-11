using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Incomes;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Gelirleri Excel'den içe aktarma: gider akışıyla aynı ortak gövde (FinanceImportPageModel);
/// farkı kasanın isteğe bağlı olması. Kasasız satır kaydedilir, kasalı satır kasaya bağlanır.
/// </summary>
public class IncomeImport_Tests : PlatformWebTestBase
{
    private const string Url = "/Incomes/ImportModal";

    // Şablonun sütun sırası: Tarih, Başlık, Kategori, Tutar, Para birimi, Kasa, ...
    private const int DateCol = 1, TitleCol = 2, CategoryCol = 3, AmountCol = 4, AccountCol = 6;

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<(Guid Id, string Name)> SeedAccountAsync()
    {
        var account = new CashAccount(Guid.NewGuid(), "Gelir kasası " + _code);
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(account, autoSave: true);
        await uow.CompleteAsync();
        return (account.Id, account.Name);
    }

    private async Task<byte[]> FilledTemplateAsync(params (string Title, string Category, string Account)[] rows)
    {
        var response = await GetResponseAsync(Url + "?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        var ws = wb.Worksheet(1);
        ws.Cell(1, AccountCol).GetString().ShouldNotEndWith("*", customMessage: "gelirde kasa isteğe bağlı");
        for (var i = 0; i < rows.Length; i++)
        {
            var r = i + 2;
            ws.Cell(r, DateCol).Value = new DateTime(2026, 11, 11);
            ws.Cell(r, TitleCol).Value = rows[i].Title;
            ws.Cell(r, CategoryCol).Value = rows[i].Category;
            ws.Cell(r, AmountCol).Value = 250d;
            ws.Cell(r, AccountCol).Value = rows[i].Account;
        }

        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Url));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "gelirler.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Url + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Kasasiz_ve_kasali_satirlar_kaydedilir_kategori_enum_adiyla_da_eslesir()
    {
        var account = await SeedAccountAsync();
        var file = await FilledTemplateAsync(
            ("Gelir " + _code + " 1", "", ""),
            ("Gelir " + _code + " 2", "Grant", account.Name));

        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var prefix = "Gelir " + _code;
        var saved = (await GetRequiredService<IRepository<IncomeEntry, Guid>>().GetListAsync(e => e.Title.StartsWith(prefix)))
            .OrderBy(e => e.Title).ToList();
        saved.Count.ShouldBe(2);
        saved[0].CashAccountId.ShouldBeNull();
        saved[0].Category.ShouldBe(IncomeCategory.Other);
        saved[1].CashAccountId.ShouldBe(account.Id);
        saved[1].Category.ShouldBe(IncomeCategory.Grant);
    }

    [Fact]
    public async Task Bilinmeyen_kategori_onizlemede_satir_hatasi_olur()
    {
        var file = await FilledTemplateAsync(("Gelir " + _code + " x", "Kira geliri", ""));

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        preview.GetProperty("rows")[0].GetProperty("errors").GetArrayLength().ShouldBe(1);
    }
}
