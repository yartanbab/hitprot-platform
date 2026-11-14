using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Projeleri Excel/CSV'den içe aktarma: satırlar "Yeni Proje"nin servisinden geçer. Kod boşsa
/// sıradaki kod verilir; dolu kod veritabanında ya da dosyada tekrar ediyorsa satır reddedilir.
/// Host'ta "Kiracı" sütunu projenin açılacağı kiracıyı seçer.
/// </summary>
public class ProjectImport_Tests : PlatformWebTestBase
{
    private const string Modal = "/Projects/ImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();

    private async Task<string> HeaderAsync()
        => Encoding.UTF8.GetString(await (await GetResponseAsync(Modal + "?handler=Template&format=csv")).Content.ReadAsByteArrayAsync())
            .TrimStart('﻿').TrimEnd();

    private async Task<JsonElement> PostAsync(string handler, string csv, string fileName = "projeler.csv")
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Modal));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");

        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes(csv)), "file", fileName);
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, Modal + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        response.IsSuccessStatusCode.ShouldBeTrue();
        return JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement.Clone();
    }

    private async Task<Guid> NewTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    private async Task<Project?> FindAsync(Guid? tenantId, string name)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            return (await GetRequiredService<IRepository<Project, Guid>>().GetListAsync(p => p.Name == name)).SingleOrDefault();
        }
    }

    [Fact]
    public async Task Sablon_host_tarafinda_kiraci_ve_butce_sutunlarini_tasir()
    {
        var header = await HeaderAsync();
        // Kod; Ad *; Kiracı; Kategori; Başlangıç; Bitiş; Bütçe; Para birimi
        header.Split(';').Length.ShouldBe(8);
        header.Split(';')[1].ShouldEndWith(" *");
    }

    [Fact]
    public async Task Gecerli_dosya_kiraciya_proje_acar_bos_koda_siradaki_kod_verilir()
    {
        var tenantName = "proje-aktar-" + _code.ToLowerInvariant();
        var tenantId = await NewTenantAsync(tenantName);
        var withCode = "Aktarılan proje " + _code + " A";
        var withoutCode = "Aktarılan proje " + _code + " B";

        // Kod; Ad; Kiracı; Kategori; Başlangıç; Bitiş; Bütçe; Para birimi
        var csv = await HeaderAsync() + "\r\n"
            + $"IMP-{_code};{withCode};{tenantName};;01.03.2027;31.12.2027;150.000;EUR\r\n"
            + $";{withoutCode};{tenantName};;;;;\r\n";

        var import = await PostAsync("Import", csv);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.ToString());

        var first = await FindAsync(tenantId, withCode);
        first.ShouldNotBeNull();
        first.Code.ShouldBe($"IMP-{_code}");
        first.TotalBudget.ShouldBe(150000m);
        first.Currency.ShouldBe("EUR");
        first.StartDate.ShouldBe(new DateTime(2027, 3, 1));

        var second = await FindAsync(tenantId, withoutCode);
        second.ShouldNotBeNull();
        second.Code.ShouldNotBeNullOrWhiteSpace();
        second.Code.ShouldNotBe(first.Code);

        // Kiracıya açıldı, host'ta yok.
        (await FindAsync(null, withCode)).ShouldBeNull();
    }

    [Fact]
    public async Task Tekrar_eden_kod_ve_ters_tarih_satirda_gosterilir_hicbiri_yazilmaz()
    {
        var name = "Reddedilen proje " + _code;
        var csv = await HeaderAsync() + "\r\n"
            + $"DUP-{_code};{name} 1;;;;;;\r\n"
            + $"DUP-{_code};{name} 2;;;;;;\r\n"
            + $"TAR-{_code};{name} 3;;;31.12.2027;01.01.2027;;\r\n";

        var preview = await PostAsync("Preview", csv);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(1, "dosyada tekrar eden kod");
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1, "bitiş başlangıçtan önce");

        (await PostAsync("Import", csv)).GetProperty("done").GetBoolean().ShouldBeFalse();
        (await FindAsync(null, name + " 1")).ShouldBeNull();
    }

    /// <summary>
    /// Gidiş-dönüş: dışa aktarılan proje dosyası içe aktarmanın bütün sütunlarını taşır ve başlıkları
    /// tanınır. Aynı kuruma geri yüklenince kodlar dolu olduğundan satırlar "zaten kullanılıyor" der —
    /// sütun ya da eşleşme hatası çıkmaz.
    /// </summary>
    [Fact]
    public async Task Disa_aktarilan_dosya_okunur_yalniz_dolu_kodlar_reddedilir()
    {
        var name = "Gidiş dönüş projesi " + _code;
        (await PostAsync("Import", await HeaderAsync() + "\r\n" + $"GD-{_code};{name};;;;;;\r\n")).GetProperty("done").GetBoolean().ShouldBeTrue();

        var export = await (await GetResponseAsync("/Projects?handler=Excel&format=csv")).Content.ReadAsByteArrayAsync();
        var exportHeaders = Encoding.UTF8.GetString(export).TrimStart('﻿').Split("\r\n")[0].Split(';');
        foreach (var column in (await HeaderAsync()).Split(';').Select(h => h.Replace(" *", "")))
        {
            exportHeaders.ShouldContain(column);
        }

        var preview = await PostAsync("Preview", Encoding.UTF8.GetString(export));
        preview.GetProperty("rows").EnumerateArray()
            .SelectMany(r => r.GetProperty("errors").EnumerateArray().Select(e => e.GetString()!))
            .ShouldAllBe(e => e.Contains("zaten kullanılıyor") || e.Contains("already"));
        preview.GetProperty("rows").EnumerateArray()
            .Any(r => r.GetProperty("values").EnumerateArray().Any(v => v.GetString() == $"GD-{_code}")).ShouldBeTrue();
    }
}
