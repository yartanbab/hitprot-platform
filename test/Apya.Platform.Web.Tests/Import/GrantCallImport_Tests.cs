using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Hibe çağrısı dosyası: her satırda çağrının alanları ve programının bütün parametreleri. Program kimlikle ya
/// da ad + kurumla bulunur, yoksa açılır; kimlikli çağrı güncellenir, kimliksiz yeni açılır. Yayında'ya geçen
/// çağrı firmalara duyurulmaz: duyuru taramasında "işlendi" sayılır (ürün kararı 2026-11-14).
/// </summary>
public class GrantCallImport_Tests : PlatformWebTestBase
{
    private const string Modal = "/Grants/CallImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();

    private async Task<List<string>> HeadersAsync(string url)
        => Encoding.UTF8.GetString(await (await GetResponseAsync(url)).Content.ReadAsByteArrayAsync())
            .TrimStart('﻿').Split("\r\n")[0].Split(';').Select(h => h.Trim().TrimEnd('*').Trim()).ToList();

    /// <summary>Başlık → değer; yazılmayan sütun boş kalır.</summary>
    private static string Line(List<string> headers, Dictionary<string, string> values)
        => string.Join(';', headers.Select(h => values.TryGetValue(h, out var v) ? v : string.Empty));

    private async Task<JsonElement> PostAsync(string handler, byte[] file, string fileName)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Modal));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        if (fileName.EndsWith(".xlsx"))
        {
            part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }

        content.Add(part, "file", fileName);
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, Modal + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    private Task<JsonElement> PostCsvAsync(string handler, List<string> headers, params Dictionary<string, string>[] rows)
        => PostAsync(handler, Encoding.UTF8.GetBytes(string.Join("\r\n", [string.Join(';', headers), .. rows.Select(r => Line(headers, r))])),
            "cagrilar.csv");

    private static string Describe(JsonElement result)
    {
        var errors = result.TryGetProperty("rows", out var rows)
            ? rows.EnumerateArray().SelectMany(r => r.GetProperty("errors").EnumerateArray()
                .Select(e => $"satır {r.GetProperty("number").GetInt32()}: {e.GetString()}"))
            : [];
        return $"{result.GetProperty("message").GetString()} {string.Join(" | ", errors)}";
    }

    private async Task<Guid> SeedProgramAsync(string name, string issuer)
    {
        var id = Guid.NewGuid();
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(new Grant(id, name, issuer, 0, 0), autoSave: true);
        await uow.CompleteAsync();
        return id;
    }

    private async Task<Guid> SeedCallAsync(Guid grantId, string period)
    {
        var id = Guid.NewGuid();
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<GrantCall, Guid>>()
            .InsertAsync(new GrantCall(id, grantId, period, GrantCallStatus.Taslak) { Reference = "ESKİ-" + period }, autoSave: true);
        await uow.CompleteAsync();
        return id;
    }

    private async Task<GrantParameterDto> ProgramAsync(Guid id)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        return await GetRequiredService<IGrantParameterAppService>().GetAsync(id);
    }

    private async Task<Grant?> FindProgramAsync(string name)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        return (await GetRequiredService<IRepository<Grant, Guid>>().GetListAsync(g => g.Name == name)).SingleOrDefault();
    }

    private async Task<(GrantCall? Call, bool Marked)> FindCallAsync(string period)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var call = (await GetRequiredService<IRepository<GrantCall, Guid>>().GetListAsync(c => c.Period == period)).SingleOrDefault();
        var marked = call != null && await GetRequiredService<IRepository<GrantNotificationLog, Guid>>()
            .AnyAsync(l => l.Trigger == GrantNotificationTrigger.CallPublished && l.EntityId == call.Id && l.TenantId == null);
        return (call, marked);
    }

    [Fact]
    public async Task Sablon_ve_ekran_ciktisi_cagrinin_ve_programin_butun_sutunlarini_tasir()
    {
        var template = await HeadersAsync(Modal + "?handler=Template&format=csv");
        template.Take(6).ShouldBe(["Çağrı kimliği", "Program kimliği", "Program adı", "Kurum", "Dönem", "Referans"]);
        template.ShouldContain("Çağrı durumu");
        template.ShouldContain("Çağrı bütçesi");
        template.ShouldContain("Destek oranı (%)");
        template.ShouldContain("Başvurabilecek kurum türleri");
        template.ShouldContain("İstenen belgeler");
        template.ShouldContain("Süreç şablonu");
        template.Count.ShouldBeGreaterThan(45);
        template.ShouldNotContain("Kalan gün", "bilgi sütunu içe aktarılmaz");

        // Ekrandaki "Excel'e aktar" aynı sütunları (ve bilgi sütunlarını) verir: dosya geri yüklenebilir.
        var screen = await HeadersAsync("/Grants?handler=CallsExcel&tab=Draft&format=csv");
        template.ShouldAllBe(h => screen.Contains(h));
        screen.ShouldContain("Kalan gün");
        screen.ShouldContain("Uygun firma");
        screen.ShouldContain("İlgi talebi");
        screen.ShouldContain("Afiş dosyası");
    }

    [Fact]
    public async Task Yeni_program_ve_cagrilari_tek_dosyadan_acilir_mevcut_programa_dokunmadan_cagri_eklenir()
    {
        var name = "Yeni program " + _code;
        var issuer = "Yeni kurum " + _code;
        var existing = "Mevcut program " + _code;
        var existingId = await SeedProgramAsync(existing, "Mevcut kurum " + _code);
        var headers = await HeadersAsync(Modal + "?handler=Template&format=csv");

        var import = await PostCsvAsync("Import", headers,
            new()
            {
                ["Program adı"] = name, ["Kurum"] = issuer, ["Destek oranı (%)"] = "60", ["En yüksek destek"] = "100000",
                ["Dönem"] = "A" + _code, ["Referans"] = "R-" + _code, ["Çağrı durumu"] = "Yayında",
                ["Açılış"] = "01.02.2027", ["Son tarih"] = "31.03.2027", ["Çağrı bütçesi"] = "2.500.000"
            },
            // Aynı program: parametreler boş, yalnız yeni çağrı.
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Dönem"] = "T" + _code },
            // Mevcut program ad + kurumla bulunur; parametreleri boş satır programa dokunmaz.
            new() { ["Program adı"] = existing, ["Kurum"] = "Mevcut kurum " + _code, ["Dönem"] = "M" + _code });
        import.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(import));

        var program = await FindProgramAsync(name);
        program.ShouldNotBeNull();
        var parameters = await ProgramAsync(program.Id);
        parameters.SupportRatePercent.ShouldBe(60);
        parameters.MaxAmount.ShouldBe(100000m);

        var (open, openMarked) = await FindCallAsync("A" + _code);
        open.ShouldNotBeNull();
        open.GrantId.ShouldBe(program.Id);
        open.Status.ShouldBe(GrantCallStatus.Acik);
        open.Reference.ShouldBe("R-" + _code);
        open.Deadline.ShouldBe(new DateTime(2027, 3, 31));
        open.Budget.ShouldBe(2_500_000m);
        openMarked.ShouldBeTrue("içe aktarılan açık çağrı duyuru taramasında işlendi sayılmalı");

        var (draft, draftMarked) = await FindCallAsync("T" + _code);
        draft.ShouldNotBeNull();
        draft.GrantId.ShouldBe(program.Id, "aynı programın ikinci satırı ikinci program açmamalı");
        draft.Status.ShouldBe(GrantCallStatus.Taslak);
        draftMarked.ShouldBeFalse("taslak ileride ekrandan yayınlanınca duyurulabilmeli");

        (await FindCallAsync("M" + _code)).Call!.GrantId.ShouldBe(existingId);
        (await ProgramAsync(existingId)).SupportRatePercent.ShouldBeNull();
    }

    [Fact]
    public async Task Disa_aktarim_aynen_geri_yuklenir_duzenlenen_cagri_ve_program_guncellenir()
    {
        var programId = await SeedProgramAsync("Gidiş dönüş " + _code, "Gidiş dönüş kurumu " + _code);
        var callId = await SeedCallAsync(programId, "G" + _code);

        var export = await (await GetResponseAsync("/Grants?handler=CallsExcel&all=true")).Content.ReadAsByteArrayAsync();

        var untouched = await PostAsync("Preview", export, "cagrilar.xlsx");
        untouched.GetProperty("ok").GetBoolean().ShouldBeTrue(Describe(untouched));

        using var wb = new XLWorkbook(new MemoryStream(export));
        var ws = wb.Worksheet(1);
        int Col(string header) => ws.Row(1).CellsUsed().First(c => c.GetString().TrimEnd(' ', '*') == header).Address.ColumnNumber;
        var row = ws.Column(Col("Çağrı kimliği")).CellsUsed().First(c => c.GetString() == callId.ToString()).Address.RowNumber;
        ws.Cell(row, Col("Program kimliği")).GetString().ShouldBe(programId.ToString());
        ws.Cell(row, Col("Referans")).Value = "YENİ-" + _code;
        ws.Cell(row, Col("Destek oranı (%)")).Value = 55;
        using var edited = new MemoryStream();
        wb.SaveAs(edited);

        var import = await PostAsync("Import", edited.ToArray(), "cagrilar.xlsx");
        import.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(import));

        var (call, _) = await FindCallAsync("G" + _code);
        call.ShouldNotBeNull();
        call.Id.ShouldBe(callId, "kimlikli satır yeni çağrı açmamalı");
        call.Reference.ShouldBe("YENİ-" + _code);
        (await ProgramAsync(programId)).SupportRatePercent.ShouldBe(55);
    }

    [Fact]
    public async Task Farkli_parametreli_program_satiri_tekrar_eden_donem_ve_baska_programin_cagrisi_reddedilir()
    {
        var name = "Çelişkili program " + _code;
        var issuer = "Kurum " + _code;
        var ownerId = await SeedProgramAsync("Sahip program " + _code, issuer);
        var foreignCall = await SeedCallAsync(ownerId, "S" + _code);
        await SeedProgramAsync("Başka program " + _code, issuer);
        var headers = await HeadersAsync(Modal + "?handler=Template&format=csv");

        var preview = await PostCsvAsync("Preview", headers,
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Destek oranı (%)"] = "60", ["Dönem"] = "P" + _code },
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Destek oranı (%)"] = "70", ["Dönem"] = "Q" + _code },
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Dönem"] = "P" + _code },
            new() { ["Çağrı kimliği"] = foreignCall.ToString(), ["Program adı"] = "Başka program " + _code, ["Kurum"] = issuer, ["Dönem"] = "S" + _code });

        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(0, Describe(preview));
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(1, "aynı program farklı parametreyle");
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1, "aynı program + dönem");
        rows[3].GetProperty("errors").GetArrayLength().ShouldBe(1, "çağrı başka programa taşınamaz");

        var import = await PostCsvAsync("Import", headers,
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Destek oranı (%)"] = "60", ["Dönem"] = "P" + _code },
            new() { ["Program adı"] = name, ["Kurum"] = issuer, ["Destek oranı (%)"] = "70", ["Dönem"] = "Q" + _code });
        import.GetProperty("done").GetBoolean().ShouldBeFalse();
        (await FindProgramAsync(name)).ShouldBeNull("hatalı dosyadan hiçbir satır yazılmamalı");
    }

    [Fact]
    public async Task Katilim_kapsam_ve_dogrulama_sutunlari_yazilir_kapanis_nedeni_yalniz_kapali_cagriya()
    {
        var name = "Kapsam programı " + _code;
        var issuer = "Kapsam kurumu " + _code;
        var headers = await HeadersAsync(Modal + "?handler=Template&format=csv");
        headers.ShouldContain("Destek türü");
        headers.ShouldContain("Türkiye'den katılım");
        headers.ShouldContain("Çağrı duyuru adresi");
        headers.ShouldContain("Kapanış nedeni");

        // Açık çağrıda kapanış nedeni çelişkidir: satır reddedilir, dosyadan hiçbir şey yazılmaz.
        var rejected = await PostCsvAsync("Import", headers,
            new Dictionary<string, string> { ["Program adı"] = name, ["Kurum"] = issuer, ["Dönem"] = "X" + _code, ["Çağrı durumu"] = "Yayında", ["Kapanış nedeni"] = "İptal edildi" });
        rejected.GetProperty("done").GetBoolean().ShouldBeFalse();
        (await FindProgramAsync(name)).ShouldBeNull();

        var import = await PostCsvAsync("Import", headers,
            new Dictionary<string, string>
            {
                ["Program adı"] = name, ["Kurum"] = issuer,
                ["Destek türü"] = "Teknik destek (danışmanlık, eğitim hizmeti)", ["Çağrı döngüsü"] = "Sürekli açık",
                ["Türkiye'den katılım"] = "Yalnız ortak olarak (koordinatör olamaz)", ["Coğrafi kapsam"] = "Proje bu illerde uygulanmalı",
                // Test CSV'si hücreyi tırnaklamaz: çok değerli hücrede ";" sütun ayıracıyla karışır, tek değer yazılır.
                ["Platform dışı başvuranlar"] = "Üniversite / yükseköğretim kurumu", ["Para birimi"] = "JPY",
                ["Dönem"] = "K" + _code, ["Çağrı durumu"] = "Kapandı", ["Kapanış nedeni"] = "Bütçe tükendi",
                ["Çağrı duyuru adresi"] = "https://ornek.gov.tr/cagri-" + _code, ["Son doğrulama"] = "28.11.2026",
                ["Doğrulama durumu"] = "Resmî kaynaktan doğrulandı",
                ["Program logosu adresi"] = "https://ornek.gov.tr/logo-" + _code + ".png",
                ["Duyuru görseli adresi"] = "https://ornek.gov.tr/banner-" + _code + ".jpg",
                ["Görselin bulunduğu sayfa"] = "https://ornek.gov.tr/cagri-" + _code,
                ["Görsel lisansı"] = "İzin gerekli", ["Görsel durumu"] = "Yalnız adres kaydedildi",
                ["Görsel son kontrol"] = "27.11.2026"
            });
        import.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(import));

        var program = await ProgramAsync((await FindProgramAsync(name))!.Id);
        program.SupportType.ShouldBe(GrantSupportType.TeknikDestek);
        program.CallCycle.ShouldBe(GrantCallCycle.SurekliAcik);
        program.TurkeyParticipation.ShouldBe(GrantTurkeyParticipation.YalnizOrtak);
        program.GeographicScope.ShouldBe(GrantGeographicScope.IllerdeUygulama);
        program.ExternalApplicantTypes.ShouldBe(ExternalApplicantType.Universite.ToMaskBit());
        program.Currency.ShouldBe("JPY");

        var (call, _) = await FindCallAsync("K" + _code);
        call.ShouldNotBeNull();
        call.ClosureReason.ShouldBe(GrantCallClosureReason.ButceTukendi);
        call.SourceUrl.ShouldBe("https://ornek.gov.tr/cagri-" + _code);
        call.LastVerifiedAt.ShouldBe(new DateTime(2026, 11, 28));
        call.VerificationStatus.ShouldBe(GrantCallVerificationStatus.ResmiKaynak);

        // Görseller: yalnız adres tutulur, dosya indirilmez.
        program.LogoUrl.ShouldBe("https://ornek.gov.tr/logo-" + _code + ".png");
        call.AnnouncementImageUrl.ShouldBe("https://ornek.gov.tr/banner-" + _code + ".jpg");
        call.ImageSourceUrl.ShouldBe("https://ornek.gov.tr/cagri-" + _code);
        call.ImageLicense.ShouldBe(GrantImageLicense.IzinGerekli);
        call.ImageStatus.ShouldBe(GrantImageStatus.YalnizAdres);
        call.ImageLastCheckedAt.ShouldBe(new DateTime(2026, 11, 27));
        headers.ShouldNotContain("Afiş dosyası", "afiş yalnız bilgi sütunu, içe aktarılmaz");
    }
}
