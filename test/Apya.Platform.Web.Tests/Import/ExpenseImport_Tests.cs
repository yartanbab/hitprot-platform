using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Giderleri Excel'den içe aktarma uçtan uca: şablon indirilir, doldurulur, önizlenir, kaydedilir.
/// Sunucu bir satırı reddederse önceki satırlar da geri alınır (ya hepsi ya hiçbiri).
/// </summary>
public class ExpenseImport_Tests : PlatformWebTestBase
{
    private const string Url = "/Expenses/ImportModal";

    // Şablonun sütun sırası (ImportModal.Columns): Tarih, Başlık, Kategori, Tutar, Para birimi, Kasa, ...
    private const int DateCol = 1, TitleCol = 2, AmountCol = 4, CurrencyCol = 5, AccountCol = 6;

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<string> SeedAccountAsync()
    {
        var name = "İçe aktarma kasası " + _code;
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(new CashAccount(Guid.NewGuid(), name), autoSave: true);
        await uow.CompleteAsync();
        return name;
    }

    private async Task<int> ImportedCountAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var prefix = "Aktarım " + _code;
        return (await GetRequiredService<IRepository<Expense, Guid>>().GetListAsync(e => e.Title.StartsWith(prefix))).Count;
    }

    /// <summary>Şablonu indirir ve verilen satırlarla doldurur: (başlık, tutar, para birimi, kasa).</summary>
    private async Task<byte[]> FilledTemplateAsync(params (string Title, object Amount, string Currency, string Account)[] rows)
    {
        var response = await GetResponseAsync(Url + "?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        var ws = wb.Worksheet(1);
        for (var i = 0; i < rows.Length; i++)
        {
            var r = i + 2;
            ws.Cell(r, DateCol).Value = new DateTime(2026, 11, 10);
            ws.Cell(r, TitleCol).Value = rows[i].Title;
            ws.Cell(r, AmountCol).Value = rows[i].Amount is string s ? s : Convert.ToDouble(rows[i].Amount);
            ws.Cell(r, CurrencyCol).Value = rows[i].Currency;
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
        content.Add(part, "file", "giderler.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Url + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Sablon_kasayi_secenek_olarak_tasir()
    {
        var account = await SeedAccountAsync();
        var response = await GetResponseAsync(Url + "?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));

        wb.Worksheets.Count.ShouldBe(2);
        wb.Worksheet(1).Cell(1, TitleCol).GetString().ShouldEndWith(" *");
        wb.Worksheet(2).CellsUsed().Select(c => c.GetString()).ShouldContain(account);
    }

    [Fact]
    public async Task Onizleme_bilinmeyen_kasayi_satirda_gosterir_ve_hicbir_sey_yazmaz()
    {
        var account = await SeedAccountAsync();
        var file = await FilledTemplateAsync(
            ("Aktarım " + _code + " 1", 100, "TRY", account),
            ("Aktarım " + _code + " 2", 50, "TRY", "Olmayan kasa " + _code));

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows.GetArrayLength().ShouldBe(2);
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[1].GetProperty("number").GetInt32().ShouldBe(3);
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(1);

        // Önizlemeyi atlayıp doğrudan kaydetmek de aynı hatayla durur.
        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeFalse();
        (await ImportedCountAsync()).ShouldBe(0);
    }

    /// <summary>
    /// Geri almanın kendisi burada ÖLÇÜLEMEZ: test modülü bütün iş birimi işlemlerini kapatır
    /// (<c>AddAlwaysDisableUnitOfWorkTransaction</c>, SQLite bellek içi), satırlar hemen yazılır.
    /// Ölçülen: kayıt reddedilen satırda durur, mesaj satır numarasını söyler, sayfa satırları
    /// ayrı ve işlemli iş biriminde yazar (gerçek veritabanında tamamlanmayan iş birimi geri alınır).
    /// </summary>
    [Fact]
    public async Task Sunucu_bir_satiri_reddederse_kayit_durur_ve_satir_islemli_is_biriminde_yazilir()
    {
        var account = await SeedAccountAsync();
        // XYZ biçimce geçerli ama kuru yok: kasa hareketi TRY kasaya çevrilemez, sunucu reddeder.
        var file = await FilledTemplateAsync(
            ("Aktarım " + _code + " 1", 100, "TRY", account),
            ("Aktarım " + _code + " 2", 50, "XYZ", account));

        (await PostAsync("Preview", file)).GetProperty("ok").GetBoolean().ShouldBeTrue();

        var import = await PostAsync("Import", file);
        import.GetProperty("ok").GetBoolean().ShouldBeFalse();
        import.GetProperty("done").GetBoolean().ShouldBeFalse();
        import.GetProperty("message").GetString()!.ShouldContain("3");

        var page = File.ReadAllText(Path.Combine(Directory.GetCurrentDirectory(),
            "..", "..", "..", "..", "..", "src", "Apya.Platform.Web", "Import", "ExcelImportPageModel.cs"));
        page.ShouldContain("unitOfWorkManager.Begin(requiresNew: true, isTransactional: true)", Case.Sensitive);
        page.ShouldContain("await uow.CompleteAsync();", Case.Sensitive);
    }

    [Fact]
    public async Task Gecerli_dosya_tum_satirlari_kaydeder()
    {
        var account = await SeedAccountAsync();
        var file = await FilledTemplateAsync(
            ("Aktarım " + _code + " 1", 100, "TRY", account),
            ("Aktarım " + _code + " 2", "1.500", "", account));

        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var prefix = "Aktarım " + _code;
        var saved = (await GetRequiredService<IRepository<Expense, Guid>>().GetListAsync(e => e.Title.StartsWith(prefix)))
            .OrderBy(e => e.Title).ToList();
        saved.Count.ShouldBe(2);
        saved[1].Amount.ShouldBe(1500m);
        saved[1].Currency.ShouldBe("TRY");
    }
}
