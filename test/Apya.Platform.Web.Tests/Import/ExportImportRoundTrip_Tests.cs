using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Gidiş-dönüş: ekrandan dışa aktarılan dosya (Excel ve CSV) aynı ekranın içe aktarmasına hatasız
/// girer ve içe aktarmanın okuduğu sütunların hepsini taşır. Veri CSV şablonuyla içeri alınır,
/// yani CSV şablonu ve CSV okuma da aynı yoldan ölçülür.
/// </summary>
public class ExportImportRoundTrip_Tests : PlatformWebTestBase
{
    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private static string With(string url, string query) => url + (url.Contains('?') ? "&" : "?") + query;

    private async Task<JsonElement> PostAsync(string modalUrl, string handler, byte[] file, string fileName)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(modalUrl));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(file), "file", fileName);
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, With(modalUrl, "handler=" + handler)) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    /// <summary>CSV şablonunu indirir (yalnız başlık satırı) ve altına verilen satırları ekler.</summary>
    private async Task<byte[]> CsvFromTemplateAsync(string modalUrl, params string[] lines)
    {
        var response = await GetResponseAsync(With(modalUrl, "handler=Template&format=csv"));
        response.Content.Headers.ContentType!.MediaType.ShouldBe("text/csv");
        var header = Encoding.UTF8.GetString(await response.Content.ReadAsByteArrayAsync()).TrimStart('﻿').TrimEnd();
        header.ShouldContain(" *");
        return Encoding.UTF8.GetBytes(header + "\r\n" + string.Join("\r\n", lines));
    }

    private async Task ImportAsync(string modalUrl, byte[] file, string fileName)
    {
        var result = await PostAsync(modalUrl, "Import", file, fileName);
        result.GetProperty("done").GetBoolean().ShouldBeTrue(result.ToString());
    }

    /// <summary>Dışa aktarılan dosyayı iki biçimde indirir ve içe aktarma önizlemesinden hatasız geçtiğini ölçer.</summary>
    private async Task<byte[]> ExportedFilesPreviewCleanAsync(string exportUrl, string modalUrl, int expectedRows)
    {
        var xlsx = await (await GetResponseAsync(exportUrl)).Content.ReadAsByteArrayAsync();
        var csvResponse = await GetResponseAsync(With(exportUrl, "format=csv"));
        csvResponse.Content.Headers.ContentType!.MediaType.ShouldBe("text/csv");
        csvResponse.Content.Headers.ContentDisposition!.ToString().ShouldContain(".csv");
        var csv = await csvResponse.Content.ReadAsByteArrayAsync();

        foreach (var (file, name) in new[] { (xlsx, "liste.xlsx"), (csv, "liste.csv") })
        {
            var preview = await PostAsync(modalUrl, "Preview", file, name);
            preview.GetProperty("ok").GetBoolean().ShouldBeTrue($"{name}: {preview}");
            preview.GetProperty("rows").GetArrayLength().ShouldBe(expectedRows, name);
        }

        return xlsx;
    }

    private static string Cell(byte[] xlsx, int row, string header)
    {
        using var wb = new XLWorkbook(new MemoryStream(xlsx));
        var ws = wb.Worksheet(1);
        var column = ws.Row(1).CellsUsed().FirstOrDefault(c => c.GetString() == header);
        column.ShouldNotBeNull($"dışa aktarımda \"{header}\" sütunu yok");
        return ws.Cell(row, column.Address.ColumnNumber).GetString();
    }

    private async Task<Project> SeedProjectAsync(string name)
    {
        var project = new Project(Guid.NewGuid(), null, null, name, ("RT-" + Guid.NewGuid().ToString("N")[..8]).ToUpperInvariant(), "");
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
        await uow.CompleteAsync();
        return project;
    }

    [Fact]
    public async Task Kur_listesi_indirilen_dosyayla_geri_yuklenir()
    {
        // Gerçekte olmayan üç harfli kod: liste yalnız bu testin satırlarına süzülebilsin.
        var currency = "Q" + new string(_code.Where(char.IsLetter).Concat("XYZ").Take(2).ToArray()).ToUpperInvariant();
        const string modal = "/ExchangeRates/ImportModal";
        await ImportAsync(modal, await CsvFromTemplateAsync(modal,
            $"05.01.2031;{currency};TRY;41,2575",
            $"06.01.2031;{currency};;38,5"), "kurlar.csv");

        var xlsx = await ExportedFilesPreviewCleanAsync($"/ExchangeRates?handler=Excel&fromCurrency={currency}", modal, 2);

        using var wb = new XLWorkbook(new MemoryStream(xlsx));
        var rates = wb.Worksheet(1).Column(4).CellsUsed().Skip(1).Select(c => c.GetValue<decimal>()).ToList();
        rates.ShouldBe([38.5m, 41.2575m], ignoreOrder: true);
    }

    [Fact]
    public async Task Gorev_listesi_aciklamayi_tasir_ve_geri_yuklenir()
    {
        const string modal = "/Tasks/ImportModal";
        var title = "Gidiş dönüş görevi " + _code;
        // Başlık, Proje, Başlangıç, Son tarih, Durum, Öncelik, Atanan, Etiketler, Açıklama
        await ImportAsync(modal, await CsvFromTemplateAsync(modal,
            $"{title};;03.11.2026;10.11.2026;;;;saha, rapor;\"Açıklama; noktalı virgüllü\""), "gorevler.csv");

        var xlsx = await ExportedFilesPreviewCleanAsync("/Tasks?handler=Excel&filter=" + Uri.EscapeDataString(title), modal, 1);

        using var wb = new XLWorkbook(new MemoryStream(xlsx));
        wb.Worksheet(1).Row(2).CellsUsed().Select(c => c.GetString()).ShouldContain("Açıklama; noktalı virgüllü");
    }

    [Fact]
    public async Task Gider_listesi_proje_ve_butce_kalemini_tasir_ve_geri_yuklenir()
    {
        var accountName = "Gidiş dönüş kasası " + _code;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(new CashAccount(Guid.NewGuid(), accountName), autoSave: true);
            await uow.CompleteAsync();
        }

        var project = await SeedProjectAsync("Gidiş dönüş projesi " + _code);
        var lineModal = "/Finance/BudgetLineImportModal?projectId=" + project.Id;
        await ImportAsync(lineModal, await CsvFromTemplateAsync(lineModal, "1;Personel;;1000"), "kalemler.csv");

        const string modal = "/Expenses/ImportModal";
        var title = "Gidiş dönüş gideri " + _code;
        // Tarih, Başlık, Kategori, Tutar, Para birimi, Kasa, Proje, Bütçe kalemi, Açıklama
        await ImportAsync(modal, await CsvFromTemplateAsync(modal,
            $"10.11.2026;{title};;250,5;TRY;{accountName};{project.Name};1;fiş no 12"), "giderler.csv");

        var exportUrl = "/Expenses?handler=Excel&filter=" + Uri.EscapeDataString(title);
        var xlsx = await ExportedFilesPreviewCleanAsync(exportUrl, modal, 1);

        // İçe aktarma şablonunun bütün sütunları dışa aktarımda var; proje ve kalem bağı kaybolmuyor.
        var template = await (await GetResponseAsync(modal + "?handler=Template")).Content.ReadAsByteArrayAsync();
        using (var wb = new XLWorkbook(new MemoryStream(template)))
        {
            var headers = wb.Worksheet(1).Row(1).CellsUsed().Select(c => c.GetString().Replace(" *", "")).ToList();
            headers.Count.ShouldBe(9);
            Cell(xlsx, 2, headers[6]).ShouldBe(project.Name);
            Cell(xlsx, 2, headers[7]).ShouldBe("1 - Personel");
            Cell(xlsx, 2, headers[8]).ShouldBe("fiş no 12");
        }

        // Dosya gerçekten kaydedilebiliyor: aynı satır ikinci kez, yine aynı projeye ve kaleme yazılır.
        await ImportAsync(modal, xlsx, "giderler.xlsx");
        using var check = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var saved = await GetRequiredService<IRepository<Expense, Guid>>().GetListAsync(e => e.Title == title);
        saved.Count.ShouldBe(2);
        saved.ShouldAllBe(e => e.ProjectId == project.Id && e.BudgetLineId != null && e.Amount == 250.5m);
    }

    /// <summary>
    /// Aynı adı taşıyan iki proje (host bütün kiracıların projelerini görür): ad tek başına eşleşmez.
    /// Dışa aktarma o projeyi KODUYLA yazar, içe aktarma kodu tanır — dosya yine hatasız geri yüklenir.
    /// </summary>
    [Fact]
    public async Task Ayni_adli_projede_gider_proje_koduyla_tasinir()
    {
        var accountName = "Aynı ad kasası " + _code;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(new CashAccount(Guid.NewGuid(), accountName), autoSave: true);
            await uow.CompleteAsync();
        }

        var name = "Aynı adlı proje " + _code;
        var first = await SeedProjectAsync(name);
        await SeedProjectAsync(name);

        const string modal = "/Expenses/ImportModal";
        var title = "Aynı ad gideri " + _code;

        // Adla yazılan satır reddedilir: hangi proje olduğu belli değil.
        var byName = await PostAsync(modal, "Preview", await CsvFromTemplateAsync(modal,
            $"10.11.2026;{title};;100;TRY;{accountName};{name};;"), "giderler.csv");
        byName.GetProperty("ok").GetBoolean().ShouldBeFalse();

        await ImportAsync(modal, await CsvFromTemplateAsync(modal,
            $"10.11.2026;{title};;100;TRY;{accountName};{first.Code};;"), "giderler.csv");

        var xlsx = await ExportedFilesPreviewCleanAsync("/Expenses?handler=Excel&filter=" + Uri.EscapeDataString(title), modal, 1);
        using var wb = new XLWorkbook(new MemoryStream(xlsx));
        wb.Worksheet(1).Row(2).CellsUsed().Select(c => c.GetString()).ShouldContain(first.Code);
    }

    [Fact]
    public async Task Butce_kalemleri_baska_projeye_agaciyla_geri_yuklenir()
    {
        var source = await SeedProjectAsync("Kaynak proje " + _code);
        var target = await SeedProjectAsync("Hedef proje " + _code);
        var sourceModal = "/Finance/BudgetLineImportModal?projectId=" + source.Id;
        var targetModal = "/Finance/BudgetLineImportModal?projectId=" + target.Id;

        // Kod, Kalem adı, Üst kalem, Sözleşme tutarı, Onaylanan tutar, Hibe payı
        await ImportAsync(sourceModal, await CsvFromTemplateAsync(sourceModal,
            "1;Personel;;1000;;",
            "1.1;Uzman;1;600;550;200"), "kalemler.csv");

        await ExportedFilesPreviewCleanAsync(sourceModal + "&handler=Export", targetModal, 2);

        var csv = await (await GetResponseAsync(sourceModal + "&handler=Export&format=csv")).Content.ReadAsByteArrayAsync();
        await ImportAsync(targetModal, csv, "kalemler.csv");

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var lines = await GetRequiredService<IRepository<ProjectBudgetLine, Guid>>().GetListAsync(l => l.ProjectId == target.Id);
        lines.Count.ShouldBe(2);
        var child = lines.Single(l => l.Code == "1.1");
        child.ParentId.ShouldBe(lines.Single(l => l.Code == "1").Id);
        child.PlannedAmount.ShouldBe(600m);
        child.ApprovedAmount.ShouldBe(550m);
        child.GrantAmount.ShouldBe(200m);
    }
}
