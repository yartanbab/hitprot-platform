using System;
using System.Collections;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Sistem yöneticisine özel tam parametreli program aktarımı: çıktı formdaki her alanı taşır,
/// aynen geri yüklenince hiçbir şey değişmez; kimlikli satır günceller, kimliksiz satır yeni açar.
/// </summary>
public class GrantProgramImport_Tests : PlatformWebTestBase
{
    private const string Url = "/Grants/ProgramImportModal";

    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private static UpdateGrantParameterDto FullInput(string name, string issuer) => new()
    {
        Name = name,
        Issuer = issuer,
        Description = "Açıklama; noktalı virgüllü",
        SourceUrl = "https://example.org/cagri",
        Objective = "Amaç",
        Priorities = "Öncelik",
        EligibleApplicants = "KOBİ",
        EligibleCompanySizes = (int)(CompanySize.Mikro | CompanySize.Orta),
        EligibleApplicantTypes = OrganizationType.Sirket.ToMaskBit() | OrganizationType.Vakif.ToMaskBit(),
        ClosedToPlatformApplicants = true,
        ExternalApplicantTypes = ExternalApplicantType.Universite.ToMaskBit() | ExternalApplicantType.Belediye.ToMaskBit(),
        TurkeyParticipation = GrantTurkeyParticipation.YalnizOrtak,
        GeographicScope = GrantGeographicScope.IllerdeUygulama,
        CallCycle = GrantCallCycle.Donemsel,
        LogoUrl = "https://example.org/logo.png",
        MinCompanyAgeYears = 1,
        MaxCompanyAgeYears = 10,
        MinTrl = 3,
        MaxTrl = 7,
        MinStaffCount = 2,
        MinRdStaffCount = 1,
        MinRevenue = 1000.5m,
        MaxRevenue = 2500000m,
        RequiresConsortium = true,
        MinConsortiumPartners = 3,
        PrefersFemaleEntrepreneur = true,
        PrefersYoungEntrepreneur = true,
        CriteriaTags =
        [
            new() { Kind = GrantCriteriaKind.Sektor, Value = "Yazılım; Bilişim" },
            new() { Kind = GrantCriteriaKind.Bolge, Value = "İstanbul" },
            new() { Kind = GrantCriteriaKind.AnahtarKelime, Value = "ihracat" },
            new() { Kind = GrantCriteriaKind.NaceKodu, Value = "62.01" },
            new() { Kind = GrantCriteriaKind.TematikAlan, Value = nameof(GrantThematicArea.Egitim) },
        ],
        MinAmount = 5000m,
        MaxAmount = 90000m,
        Currency = "EUR",
        SupportRatePercent = 75,
        ProjectDurationMonths = 18,
        RepaymentType = GrantRepaymentType.GeriOdemeli,
        SupportType = GrantSupportType.FaizsizKredi,
        HasAdvancePayment = true,
        RequiresGuaranteeLetter = true,
        EligibleCostItems =
        [
            new() { Kind = GrantCostItemKind.Personel, LimitPercent = 40 },
            new() { Kind = GrantCostItemKind.Seyahat },
        ],
        DocumentRequirements =
        [
            new()
            {
                Order = 0, Name = "Bilanço | özet; son yıl", Obligation = GrantDocumentObligation.Kosullu,
                UploaderParty = GrantPartyRole.Danisman, RequiresESignature = true, RequiresWetSignature = true, RequiresStamp = true
            },
            new() { Order = 1, Name = "Faaliyet belgesi" },
        ],
        StageTemplateId = null,
        MinMatchScore = 62.5
    };

    private async Task<Guid> SeedProgramAsync(UpdateGrantParameterDto input)
    {
        var id = Guid.NewGuid();
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(new Grant(id, input.Name, input.Issuer, 0m, 0), autoSave: true);
            await uow.CompleteAsync();
        }

        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<IGrantParameterAppService>().UpdateAsync(id, input);
            await uow.CompleteAsync();
        }

        return id;
    }

    private async Task<GrantParameterDto> ReadProgramAsync(Guid id)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        return await GetRequiredService<IGrantParameterAppService>().GetAsync(id);
    }

    private async Task<byte[]> ExportAsync()
    {
        var response = await GetResponseAsync($"{Url}?handler=Export");
        return await response.Content.ReadAsByteArrayAsync();
    }

    private static byte[] Edit(byte[] file, Action<IXLWorksheet> edit)
    {
        using var wb = new XLWorkbook(new MemoryStream(file));
        edit(wb.Worksheet(1));
        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    private static int ColumnOf(IXLWorksheet ws, string header)
        => ws.Row(1).CellsUsed().First(c => c.GetString().TrimEnd(' ', '*') == header).Address.ColumnNumber;

    private static int RowOf(IXLWorksheet ws, Guid id)
        => ws.Column(1).CellsUsed().First(c => c.GetString() == id.ToString()).Address.RowNumber;

    private async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var html = await GetResponseAsStringAsync(Url);
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "programlar.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{Url}?handler={handler}") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    private static string Describe(JsonElement result)
    {
        var errors = result.TryGetProperty("rows", out var rows)
            ? rows.EnumerateArray().SelectMany(r => r.GetProperty("errors").EnumerateArray()
                .Select(e => $"satır {r.GetProperty("number").GetInt32()}: {e.GetString()}"))
            : [];
        return $"{result.GetProperty("message").GetString()} {string.Join(" | ", errors)}";
    }

    /// <summary>Yazma modeline yeni alan eklenirse bu test onu tohumlamayı ve sayfaya koymayı zorlar.</summary>
    [Fact]
    public async Task Cikti_her_parametreyi_tasir_ve_aynen_geri_yuklenince_hicbir_sey_degismez()
    {
        var input = FullInput("Tam parametre " + _code, "Kurum " + _code);
        foreach (var property in typeof(UpdateGrantParameterDto).GetProperties().Where(p => p.Name != nameof(UpdateGrantParameterDto.StageTemplateId)))
        {
            var value = property.GetValue(input);
            value.ShouldNotBeNull($"{property.Name} tohumlanmadı");
            if (value is IEnumerable list and not string) list.Cast<object>().ShouldNotBeEmpty(property.Name);
            else if (property.PropertyType.IsValueType && property.PropertyType != typeof(GrantRepaymentType))
                value.ShouldNotBe(Activator.CreateInstance(property.PropertyType), property.Name);
        }

        var id = await SeedProgramAsync(input);
        var before = await ReadProgramAsync(id);

        // Dokunulmamış dosya: bütün katalog "değişmeyen", hiçbir program yazılmaz.
        var file = await ExportAsync();
        var untouched = await PostAsync("Import", file);
        untouched.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(untouched));
        untouched.GetProperty("message").GetString().ShouldContain("Yeni: 0 · Güncellenen: 0");

        // Tek hücre değişince yalnız o alan yazılır: geri kalanı olduğu gibi kalmalı.
        var edited = Edit(file, ws => ws.Cell(RowOf(ws, id), ColumnOf(ws, "Destek oranı (%)")).Value = 80);
        var import = await PostAsync("Import", edited);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(import));
        import.GetProperty("message").GetString().ShouldContain("Güncellenen: 1");

        var after = await ReadProgramAsync(id);
        after.SupportRatePercent.ShouldBe(80);
        ShouldMatch(after, before, nameof(UpdateGrantParameterDto.SupportRatePercent));

        // Kimliksiz kopya: bütün hücreler okuyucudan geçer, hiçbir parametre kaybolmamalı.
        var copyName = "Kopya okuma " + _code;
        var copy = Edit(file, ws =>
        {
            var row = RowOf(ws, id);
            ws.Cell(row, 1).Clear(XLClearOptions.Contents);
            ws.Cell(row, ColumnOf(ws, "Program adı")).Value = copyName;
        });
        var copied = await PostAsync("Import", copy);
        copied.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(copied));

        Guid copyId;
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            copyId = (await GetRequiredService<IRepository<Grant, Guid>>().SingleAsync(g => g.Name == copyName)).Id;
        }

        ShouldMatch(await ReadProgramAsync(copyId), before, nameof(UpdateGrantParameterDto.Name));
    }

    private static void ShouldMatch(GrantParameterDto actual, GrantParameterDto expected, string except)
    {
        foreach (var property in typeof(UpdateGrantParameterDto).GetProperties().Where(p => p.Name != except))
        {
            var source = typeof(GrantParameterDto).GetProperty(property.Name);
            source.ShouldNotBeNull(property.Name);
            Canonical(source.GetValue(actual)).ShouldBe(Canonical(source.GetValue(expected)), property.Name);
        }
    }

    /// <summary>Etiket ve kalem satırları yeniden yazılınca veritabanı sırası değişebilir.</summary>
    private static string Canonical(object? value)
        => value is IEnumerable list and not string
            ? string.Join(",", list.Cast<object>().Select(i => JsonSerializer.Serialize(i)).OrderBy(s => s, StringComparer.Ordinal))
            : JsonSerializer.Serialize(value);

    [Fact]
    public async Task Eski_kural_disi_deger_tasiyan_program_degistirilirse_satirda_hata_verir()
    {
        var id = await SeedProgramAsync(FullInput("Eski değer " + _code, "Kurum " + _code));
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Grant, Guid>>();
            var grant = await repository.GetAsync(id);
            grant.MinConsortiumPartners = 1;
            await repository.UpdateAsync(grant, autoSave: true);
            await uow.CompleteAsync();
        }

        var file = await ExportAsync();
        (await PostAsync("Preview", file)).GetProperty("ok").GetBoolean().ShouldBeTrue();

        var edited = Edit(file, ws => ws.Cell(RowOf(ws, id), ColumnOf(ws, "Destek oranı (%)")).Value = 80);
        var preview = await PostAsync("Preview", edited);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(preview).ShouldContain("Konsorsiyum en az 2 ortak");
    }

    [Fact]
    public async Task Kimlikli_satir_gunceller_silinen_sutun_korunur_kimliksiz_satir_yeni_acar()
    {
        var id = await SeedProgramAsync(FullInput("Güncellenecek " + _code, "Kurum " + _code));
        var newName = "Yeni program " + _code;

        var file = Edit(await ExportAsync(), ws =>
        {
            var row = RowOf(ws, id);
            ws.Cell(row, ColumnOf(ws, "Destek oranı (%)")).Value = 50;
            ws.Cell(row, ColumnOf(ws, "Programın amacı")).Clear(XLClearOptions.Contents);
            ws.Column(ColumnOf(ws, "İstenen belgeler")).Delete();

            var last = ws.LastRowUsed()!.RowNumber() + 1;
            ws.Cell(last, ColumnOf(ws, "Program adı")).Value = newName;
            ws.Cell(last, ColumnOf(ws, "Kurum")).Value = "Kurum " + _code;
            ws.Cell(last, ColumnOf(ws, "Sektörler")).Value = "Tarım; Gıda";
        });

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeTrue(Describe(preview));
        preview.GetProperty("message").GetString().ShouldContain("Yeni: 1");

        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(Describe(import));

        var updated = await ReadProgramAsync(id);
        updated.SupportRatePercent.ShouldBe(50);
        updated.Objective.ShouldBeNull();
        updated.DocumentRequirements.Count.ShouldBe(2);

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var created = await GetRequiredService<IRepository<Grant, Guid>>().SingleAsync(g => g.Name == newName);
        var tags = await GetRequiredService<IRepository<GrantCriteriaTag, Guid>>().GetListAsync(t => t.GrantId == created.Id);
        tags.Select(t => t.Value).OrderBy(v => v).ShouldBe(["Gıda", "Tarım"]);
    }

    [Fact]
    public async Task Hatali_satir_onizlemede_gosterilir_ve_hicbir_satir_yazilmaz()
    {
        var id = await SeedProgramAsync(FullInput("Hatalı " + _code, "Kurum " + _code));
        var file = Edit(await ExportAsync(), ws =>
        {
            var row = RowOf(ws, id);
            ws.Cell(row, ColumnOf(ws, "En düşük TRL")).Value = 8;
            ws.Cell(row, ColumnOf(ws, "İller")).Value = "Atlantis";
            ws.Cell(row, ColumnOf(ws, "Konsorsiyum zorunlu")).Value = "belki";
        });

        var import = await PostAsync("Import", file);
        import.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var errors = import.GetProperty("rows").EnumerateArray()
            .SelectMany(r => r.GetProperty("errors").EnumerateArray().Select(e => e.GetString()!)).ToList();
        errors.ShouldContain(e => e.Contains("Atlantis"));
        errors.ShouldContain(e => e.Contains("Konsorsiyum zorunlu"));
        errors.Count.ShouldBeGreaterThanOrEqualTo(3);

        (await ReadProgramAsync(id)).MinTrl.ShouldBe(3);
    }

    [Fact]
    public async Task Kimligi_unutulmus_satir_mevcut_programin_kopyasini_acmaz()
    {
        var name = "Kopya " + _code;
        await SeedProgramAsync(FullInput(name, "Kurum " + _code));
        var file = Edit(await ExportAsync(), ws =>
        {
            var last = ws.LastRowUsed()!.RowNumber() + 1;
            ws.Cell(last, ColumnOf(ws, "Program adı")).Value = name.ToUpperInvariant();
            ws.Cell(last, ColumnOf(ws, "Kurum")).Value = "Kurum " + _code;
        });

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
    }

    [Fact]
    public async Task Sablonda_alan_rehberi_var_ve_ilk_sayfa_veri_sayfasidir()
    {
        var response = await GetResponseAsync($"{Url}?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        wb.Worksheet(1).Cell(1, 1).GetString().ShouldBe("Kayıt kimliği");
        wb.Worksheets.Select(w => w.Name).ShouldContain("Alan rehberi");
    }

    [Fact]
    public void Modul_yalniz_host_ve_ozel_izinle_acilir()
    {
        var module = DataTransferModules.Get("grant-programs");
        module.Side.ShouldBe(DataTransferSide.Host);
        module.Permission.ShouldBe(PlatformPermissions.DataTransfer.FullParameters);
        module.ImportPermission.ShouldBe(PlatformPermissions.DataTransfer.FullParameters);

        var attributes = typeof(Apya.Platform.Web.Pages.Grants.ProgramImportModalModel)
            .GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AuthorizeAttribute), inherit: true)
            .Cast<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>()
            .Select(a => a.Policy);
        attributes.ShouldContain(PlatformPermissions.DataTransfer.FullParameters);
    }

    [Fact]
    public async Task Calisma_alaninda_hostta_gorunur_kiracida_gorunmez_ve_uclari_kapalidir()
    {
        (await GetResponseAsStringAsync("/DataTransfer")).ShouldContain("data-transfer-module=\"grant-programs\"");
        (await GetResponseAsStringAsync("/DataTransfer?tab=import")).ShouldContain("data-transfer-module=\"grant-programs\"");

        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("tam-aktarim-" + _code);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        await WithTenantClientAsync(tenant.Id, async client =>
        {
            (await client.GetStringAsync("/DataTransfer")).ShouldNotContain("grant-programs");
            (await client.GetStringAsync("/DataTransfer?tab=import")).ShouldNotContain("grant-programs");
            (await client.GetAsync($"{Url}?handler=Export")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
            (await client.GetAsync($"{Url}?handler=Template")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
        });
    }
}

/// <summary>
/// Özel izni olmayan host kullanıcısı: "tek anahtar" kapalıyken bile modülü görmez, uçları çağıramaz.
/// Diğer aktarım modülleri bundan etkilenmez.
/// </summary>
public class GrantProgramImportAccess_Tests : PlatformWebTestBase
{
    private const string Url = "/Grants/ProgramImportModal";

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.DataTransfer.FullParameters);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Ozel_izni_olmayan_host_kullanicisi_erisemez()
    {
        (await Client.GetAsync($"{Url}?handler=Export")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
        (await Client.GetAsync($"{Url}?handler=Template")).StatusCode.ShouldNotBe(HttpStatusCode.OK);
        (await Client.GetAsync(Url)).StatusCode.ShouldNotBe(HttpStatusCode.OK);

        var workspace = await GetResponseAsStringAsync("/DataTransfer?tab=import");
        workspace.ShouldNotContain("grant-programs");
        workspace.ShouldContain("data-transfer-module=\"grant-calls\"");
    }
}
