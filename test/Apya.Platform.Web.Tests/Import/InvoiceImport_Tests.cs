using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Faturaları Excel/CSV'den içe aktarma: aynı fatura numaralı satırlar tek faturanın kalemleridir;
/// kalem sütunları boşsa Toplam KDV dahil tek kalemdir (dışa aktarılan dosya böyle geri yüklenir).
/// Her fatura "Yeni fatura"nın servisinden geçer; tahsilat ve durum alınmaz.
/// </summary>
public class InvoiceImport_Tests : PlatformWebTestBase
{
    private const string Modal = "/Invoices/ImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();

    private async Task<string> HeaderAsync()
        => Encoding.UTF8.GetString(await (await GetResponseAsync(Modal + "?handler=Template&format=csv")).Content.ReadAsByteArrayAsync())
            .TrimStart('﻿').TrimEnd();

    private async Task<JsonElement> PostAsync(string handler, string csv)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Modal));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");

        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes(csv)), "file", "faturalar.csv");
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, Modal + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        response.IsSuccessStatusCode.ShouldBeTrue();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement.Clone();
    }

    private async Task<string> SeedProjectAsync()
    {
        var name = "Fatura aktarım projesi " + _code;
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(Guid.NewGuid(), null, null, name, "FA-" + _code, ""), autoSave: true);
        await uow.CompleteAsync();
        return name;
    }

    private async Task<Invoice?> FindAsync(string number)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var query = await GetRequiredService<IRepository<Invoice, Guid>>().WithDetailsAsync(i => i.Items);
        return await query.FirstOrDefaultAsync(i => i.InvoiceNumber == number);
    }

    [Fact]
    public async Task Ayni_numarali_satirlar_tek_faturanin_kalemleri_toplam_kdv_dahil_tek_kalemdir()
    {
        var project = await SeedProjectAsync();
        // Fatura no; Yön; Proje; Tarih; Son tarih; KDV %; Para birimi; Bütçe kalemi; Kalem; Miktar; Birim fiyat; Toplam; KDV istisna belge no; Not
        var csv = await HeaderAsync() + "\r\n"
            + $"A-{_code};Satış;{project};01.06.2027;30.06.2027;20;TRY;;Danışmanlık;2;100;;;\r\n"
            + $"A-{_code};;;;;;;;Eğitim;;300;;;\r\n"
            + $"B-{_code};Alış;{project};02.06.2027;;;;;;;;1.200;;ikinci\r\n"
            + $"C-{_code};;{project};03.06.2027;;;;;;;;500;IST-{_code};\r\n";

        var import = await PostAsync("Import", csv);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.ToString());

        var a = await FindAsync($"A-{_code}");
        a.ShouldNotBeNull();
        a.Direction.ShouldBe(InvoiceDirection.Sales);
        a.Items.Count.ShouldBe(2);
        a.Items.Sum(i => i.TotalPrice).ShouldBe(500m);
        a.TotalAmount.ShouldBe(600m);
        a.DueDate.ShouldBe(new DateTime(2027, 6, 30));
        a.Status.ShouldBe(InvoiceStatus.Draft);

        // Toplam KDV dahil: 1.200 → net 1.000 + %20 KDV. Son tarih boş → fatura tarihi.
        var b = await FindAsync($"B-{_code}");
        b.ShouldNotBeNull();
        b.Direction.ShouldBe(InvoiceDirection.Purchase);
        b.Items.Single().UnitPrice.ShouldBe(1000m);
        b.TotalAmount.ShouldBe(1200m);
        b.DueDate.ShouldBe(b.InvoiceDate);
        b.Notes.ShouldBe("ikinci");

        // İstisnalı fatura: KDV yok, girilen tutar nettir.
        var c = await FindAsync($"C-{_code}");
        c.ShouldNotBeNull();
        c.TaxRate.ShouldBe(0m);
        c.TotalAmount.ShouldBe(500m);
    }

    [Fact]
    public async Task Hatali_satirlar_gosterilir_ve_hicbir_fatura_yazilmaz()
    {
        var project = await SeedProjectAsync();
        (await PostAsync("Import", await HeaderAsync() + "\r\n" + $"VAR-{_code};;{project};01.06.2027;;;;;;;;100;;\r\n"))
            .GetProperty("done").GetBoolean().ShouldBeTrue();

        var csv = await HeaderAsync() + "\r\n"
            + $"VAR-{_code};;{project};01.06.2027;;;;;;;;100;;\r\n"          // kurumda var
            + $"KAR-{_code};;{project};01.06.2027;;;;;;;100;;;\r\n"          // birim fiyat
            + $"KAR-{_code};;;;;;;;;;;200;;\r\n"                              // aynı faturada toplam
            + $"BOS-{_code};;{project};01.06.2027;;;;;;;;;;\r\n"              // tutar yok
            + $"YUZ-{_code};;{project};01.06.2027;;150;;;;;;100;;\r\n";       // KDV %150

        var preview = await PostAsync("Preview", csv);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows.GetArrayLength().ShouldBe(5);
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(1, "fatura no kurumda var");
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1, "birim fiyat ile toplam karışık");
        rows[3].GetProperty("errors").GetArrayLength().ShouldBe(1, "tutar yok");
        rows[4].GetProperty("errors").GetArrayLength().ShouldBe(1, "KDV yüzdesi");

        (await PostAsync("Import", csv)).GetProperty("done").GetBoolean().ShouldBeFalse();
        (await FindAsync($"KAR-{_code}")).ShouldBeNull();
    }

    /// <summary>
    /// Aynı adlı iki proje (host bütün kiracıların projelerini görür): dışa aktarma faturanın projesini
    /// koduyla yazar, içe aktarma kodu tanır.
    /// </summary>
    [Fact]
    public async Task Ayni_adli_projenin_faturasi_proje_koduyla_tasinir()
    {
        var name = "Aynı adlı fatura projesi " + _code;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var repo = GetRequiredService<IRepository<Project, Guid>>();
            await repo.InsertAsync(new Project(Guid.NewGuid(), null, null, name, "AN1-" + _code, ""), autoSave: true);
            await repo.InsertAsync(new Project(Guid.NewGuid(), null, null, name, "AN2-" + _code, ""), autoSave: true);
            await uow.CompleteAsync();
        }

        var byName = await PostAsync("Preview", await HeaderAsync() + "\r\n" + $"AN-{_code};;{name};01.06.2027;;;;;;;;100;;\r\n");
        byName.GetProperty("ok").GetBoolean().ShouldBeFalse();

        (await PostAsync("Import", await HeaderAsync() + "\r\n" + $"AN-{_code};;AN2-{_code};01.06.2027;;;;;;;;100;;\r\n"))
            .GetProperty("done").GetBoolean().ShouldBeTrue();

        var export = Encoding.UTF8.GetString(await (await GetResponseAsync("/Invoices?handler=Excel&format=csv&q=AN-" + _code))
            .Content.ReadAsByteArrayAsync()).TrimStart('﻿');
        export.ShouldContain($";AN2-{_code};");

        var preview = await PostAsync("Preview", export.Replace($"AN-{_code}", $"AN3-{_code}"));
        preview.GetProperty("ok").GetBoolean().ShouldBeTrue(preview.ToString());
    }

    /// <summary>
    /// Gidiş-dönüş: dışa aktarılan fatura dosyası tanınır; aynı kuruma geri yüklenince numaralar dolu
    /// olduğu için satırlar "zaten kullanılıyor" der — sütun ya da eşleşme hatası çıkmaz.
    /// </summary>
    [Fact]
    public async Task Disa_aktarilan_dosya_okunur_yalniz_dolu_numaralar_reddedilir()
    {
        var project = await SeedProjectAsync();
        (await PostAsync("Import", await HeaderAsync() + "\r\n" + $"GD-{_code};;{project};01.06.2027;;;;;;;;240;;\r\n"))
            .GetProperty("done").GetBoolean().ShouldBeTrue();

        var export = Encoding.UTF8.GetString(await (await GetResponseAsync("/Invoices?handler=Excel&format=csv&q=GD-" + _code))
            .Content.ReadAsByteArrayAsync()).TrimStart('﻿');
        export.Split("\r\n", StringSplitOptions.RemoveEmptyEntries).Length.ShouldBe(2);

        var preview = await PostAsync("Preview", export);
        var errors = preview.GetProperty("rows")[0].GetProperty("errors").EnumerateArray().Select(e => e.GetString()!).ToList();
        errors.Count.ShouldBe(1);
        errors[0].ShouldContain("zaten kullanılıyor");

        // Numara değiştirilince aynı satır hatasız okunur; Toplam KDV dahil tek kalem olur.
        var renamed = export.Replace($"GD-{_code}", $"GD2-{_code}");
        (await PostAsync("Import", renamed)).GetProperty("done").GetBoolean().ShouldBeTrue();
        var copy = await FindAsync($"GD2-{_code}");
        copy.ShouldNotBeNull();
        copy.TotalAmount.ShouldBe(240m);
    }
}
