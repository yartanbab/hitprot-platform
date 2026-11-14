using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Hibe çağrılarını Excel/CSV'den host kataloğuna aktarma: çağrı programa adla (gerekirse kurumla)
/// bağlanır, aynı program + dönem ikinci kez açılmaz. İçe aktarılan açık çağrı firmalara duyurulmaz:
/// duyuru taramasında "işlendi" sayılır (ürün kararı 2026-11-14).
/// </summary>
public class GrantCallImport_Tests : PlatformWebTestBase
{
    private const string Modal = "/Grants/CallImportModal";

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
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes(csv)), "file", "cagrilar.csv");
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, Modal + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        response.IsSuccessStatusCode.ShouldBeTrue();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement.Clone();
    }

    private async Task<string> SeedProgramAsync(string issuer, string? name = null)
    {
        name ??= "Aktarım programı " + _code;
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(new Grant(Guid.NewGuid(), name, issuer, 0, 0), autoSave: true);
        await uow.CompleteAsync();
        return name;
    }

    private async Task<(GrantCall? Call, bool Announced)> FindAsync(string period)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var call = (await GetRequiredService<IRepository<GrantCall, Guid>>().GetListAsync(c => c.Period == period)).SingleOrDefault();
        var announced = call != null && await GetRequiredService<IRepository<GrantNotificationLog, Guid>>()
            .AnyAsync(l => l.Trigger == GrantNotificationTrigger.CallPublished && l.EntityId == call.Id && l.TenantId == null);
        return (call, announced);
    }

    [Fact]
    public async Task Cagri_programa_baglanir_acik_cagri_duyurulmadan_islendi_sayilir()
    {
        var program = await SeedProgramAsync("Kurum " + _code);
        // Program; Kurum; Dönem; Referans; Durum; Açılış; Son tarih; Bütçe
        var csv = await HeaderAsync() + "\r\n"
            + $"{program};;A{_code};REF-{_code};Yayında;01.02.2027;31.03.2027;2.500.000\r\n"
            + $"{program};;T{_code};;;;;\r\n";

        var import = await PostAsync("Import", csv);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.ToString());

        var (open, announced) = await FindAsync("A" + _code);
        open.ShouldNotBeNull();
        open.Status.ShouldBe(GrantCallStatus.Acik);
        open.Reference.ShouldBe("REF-" + _code);
        open.Deadline.ShouldBe(new DateTime(2027, 3, 31));
        open.Budget.ShouldBe(2_500_000m);
        announced.ShouldBeTrue("içe aktarılan açık çağrı duyuru taramasında işlendi sayılmalı");

        var (draft, draftMarked) = await FindAsync("T" + _code);
        draft.ShouldNotBeNull();
        draft.Status.ShouldBe(GrantCallStatus.Taslak);
        draftMarked.ShouldBeFalse("taslak ileride ekrandan yayınlanınca duyurulabilmeli");
    }

    [Fact]
    public async Task Ayni_program_ve_donem_ikinci_kez_acilmaz_ayni_adli_program_kurumla_secilir()
    {
        var name = "Ortak ad " + _code;
        await SeedProgramAsync("Birinci kurum " + _code, name);
        await SeedProgramAsync("İkinci kurum " + _code, name);

        var csv = await HeaderAsync() + "\r\n"
            + $"{name};;X{_code};;;;;\r\n"                                   // ad iki programla eşleşir
            + $"{name};İkinci kurum {_code};D{_code};;;;;\r\n"              // kurumla tekil
            + $"{name};İkinci kurum {_code};D{_code};;;;;\r\n"              // dosyada tekrar
            + $"{name};İkinci kurum {_code};R{_code};;;31.12.2027;01.01.2027;\r\n"; // ters tarih

        var preview = await PostAsync("Preview", csv);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(1, "ad birden fazla programla eşleşiyor");
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1, "aynı program + dönem");
        rows[3].GetProperty("errors").GetArrayLength().ShouldBe(1, "son tarih açılıştan önce");

        (await PostAsync("Import", csv)).GetProperty("done").GetBoolean().ShouldBeFalse();
        (await FindAsync("D" + _code)).Call.ShouldBeNull();
    }

    /// <summary>
    /// Gidiş-dönüş: host panosunun dışa aktarımı tanınır. Çağrısı olmayan program satırları ("Çağrı yok")
    /// atlanır; var olan çağrılar "zaten kullanılıyor" der — sütun ya da eşleşme hatası çıkmaz.
    /// </summary>
    [Fact]
    public async Task Pano_disa_aktarimi_okunur_cagri_yok_satirlari_atlanir()
    {
        var program = await SeedProgramAsync("Gidiş dönüş kurumu " + _code);
        (await PostAsync("Import", await HeaderAsync() + "\r\n" + $"{program};;G{_code};;Taslak;;;\r\n"))
            .GetProperty("done").GetBoolean().ShouldBeTrue();

        var export = Encoding.UTF8.GetString(await (await GetResponseAsync("/Grants?handler=CallsExcel&tab=Draft&format=csv"))
            .Content.ReadAsByteArrayAsync()).TrimStart('﻿');
        export.ShouldContain("G" + _code);

        var preview = await PostAsync("Preview", export);
        preview.GetProperty("rows").EnumerateArray()
            .SelectMany(r => r.GetProperty("errors").EnumerateArray().Select(e => e.GetString()!))
            .ShouldAllBe(e => e.Contains("zaten kullanılıyor") || e.Contains("birden fazla"));
    }
}
