using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Application.Projects;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages.Projects;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Proje düzenleme ekranı (/Projects/Edit/{id}).
///
/// Test host'u AddAlwaysAllowAuthorization kullanır — yani sayfa burada TAM olarak
/// render olur ve Razor/DI/tag-helper hataları yakalanır. Gerçek host'taki izin
/// kapısı ayrıca reflection ile doğrulanır (aşağıdaki iki test).
/// </summary>
public class ProjectEditPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();

        // Web test tabanında WithUnitOfWorkAsync yok — UoW elle açılır.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            var currentTenant = GetRequiredService<ICurrentTenant>();

            await repository.InsertAsync(
                new Project(projectId, currentTenant.Id, null, "Düzenleme Testi", code, "Düzenleme ekranı testi"),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Sayfa_uc_sekmeyle_render_olur()
    {
        var projectId = await CreateProjectAsync("EDIT-1");

        var html = await GetResponseAsStringAsync($"/Projects/Edit/{projectId}");

        html.ShouldContain("data-tab=\"info\"");
        html.ShouldContain("data-tab=\"files\"");
        html.ShouldContain("data-tab=\"danger\"");
        html.ShouldContain("Kapak görseli");
        html.ShouldContain("Proje dosyaları");
    }

    [Fact]
    public async Task Silme_yalniz_proje_kodu_yazilarak_yapilir()
    {
        var projectId = await CreateProjectAsync("EDIT-2");

        var html = await GetResponseAsStringAsync($"/Projects/Edit/{projectId}?tab=danger");

        // Onay kutusu var ve düğme kod eşleşene kadar kapalı doğuyor.
        html.ShouldContain("DeleteConfirmCode");
        html.ShouldContain("EDIT-2");
        html.ShouldContain("id=\"DeleteProjectButton\" disabled");
    }

    [Fact]
    public async Task Guid_olmayan_id_sayfayi_acmaz()
    {
        // Rota kısıtı {id:Guid} — serbest metin bu sayfaya hiç ulaşmamalı.
        // Kesin durum koduna bağlanmıyoruz: gerçek host'ta 404 (ölçüldü), test
        // host'unda eşleşmeyen rota yönlendirmeye düşüyor (302). Değişmez olan,
        // sayfanın RENDER OLMAMASI.
        var response = await Client.GetAsync("/Projects/Edit/not-a-guid");

        ((int)response.StatusCode).ShouldNotBe(200);
    }

    [Fact]
    public void Sayfa_Edit_iznine_bagli()
    {
        typeof(EditModel).IsDefined(typeof(AuthorizeAttribute), inherit: true)
            .ShouldBeTrue("EditModel [Authorize] taşımıyor — düzenleme ekranı izinsiz açılır");
    }

    /// <summary>
    /// SEC: CrudAppService'in Update/Create politika adları set edilmediği ve override'lar
    /// CheckPolicy çağırmadığı için güncelleme/oluşturma yalnız Projects.Default'a bakıyordu.
    /// Bu test o boşluğun geri gelmesini engeller.
    /// </summary>
    [Theory]
    [InlineData(nameof(ProjectAppService.UpdateAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.CreateAsync), PlatformPermissions.Projects.Create)]
    [InlineData(nameof(ProjectAppService.DeleteAsync), PlatformPermissions.Projects.Delete)]
    [InlineData(nameof(ProjectAppService.AddAttachmentAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.DeleteAttachmentAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.SetCoverImageAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.RemoveCoverImageAsync), PlatformPermissions.Projects.Edit)]
    public void Yazma_metotlari_dogru_izne_bagli(string methodName, string expectedPolicy)
    {
        var method = typeof(ProjectAppService).GetMethod(methodName);
        method.ShouldNotBeNull($"{methodName} bulunamadı");

        var attribute = (AuthorizeAttribute?)Attribute.GetCustomAttribute(method!, typeof(AuthorizeAttribute));

        attribute.ShouldNotBeNull($"{methodName} [Authorize] taşımıyor");
        attribute!.Policy.ShouldBe(expectedPolicy);
    }

    // ── PRJ-01: iş kuralı hatası aynı sayfada; yazılan değer korunur, yarım kayıt olmaz ──────────
    // Düzeltme öncesi negatif bütçe / ters tarih / desteklenmeyen dosya 500 veriyordu. Sayfa hatayı
    // yakalayınca iş birimi tamamlanır → Project.Update'in "önce doğrula" sırası da burada kilitlenir
    // (ad bütçe kuralından ÖNCE atanıyordu; test host'u işlemsiz koştuğu için yarım hâl kalıcı olurdu).

    private static string AntiforgeryToken(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");

        return input!.GetAttributeValue("value", "");
    }

    private async Task<HttpResponseMessage> PostInfoAsync(Guid projectId, params (string Key, string Value)[] fields)
    {
        var url = $"/Projects/Edit/{projectId}";
        var form = new List<KeyValuePair<string, string>>
        {
            new("__RequestVerificationToken", AntiforgeryToken(await GetResponseAsStringAsync(url)))
        };

        foreach (var (key, value) in fields)
        {
            form.Add(new KeyValuePair<string, string>(key, value));
        }

        return await Client.PostAsync(url, new FormUrlEncodedContent(form));
    }

    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>abp-input'un alan altı doğrulama satırı (Razor Türkçe harfleri sayısal varlığa kodlar → çözülür).</summary>
    private static string FieldError(HtmlDocument doc, string field)
        => WebUtility.HtmlDecode(
            doc.DocumentNode.SelectSingleNode($"//span[@data-valmsg-for='{field}']")?.InnerText ?? string.Empty);

    /// <summary>Servis okuması tuzağı gizleyebilir: yeni iş biriminde doğrudan depodan okunur.</summary>
    private async Task<Project> ReadStoredAsync(Guid projectId)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var project = await GetRequiredService<IRepository<Project, Guid>>().GetAsync(projectId);
        await uow.CompleteAsync();
        return project;
    }

    [Fact]
    public async Task Negatif_butce_ayni_sayfada_alan_alti_hata_verir_yazilan_deger_korunur()
    {
        var projectId = await CreateProjectAsync("EDIT-3");

        var response = await PostInfoAsync(projectId,
            ("Project.Name", "QA-UX yeni ad"),
            ("Project.Code", "EDIT-3"),
            ("Project.TotalBudget", "-5"));

        // 500 (istisna) ya da 302 (kaydedildi) değil: form aynı sayfada yeniden çizilir.
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var doc = Parse(await response.Content.ReadAsStringAsync());

        FieldError(doc, "Project.TotalBudget").ShouldContain("Geçersiz bütçe. Bütçe negatif olamaz.");
        doc.DocumentNode.SelectSingleNode("//input[@name='Project.Name']")!
            .GetAttributeValue("value", "").ShouldBe("QA-UX yeni ad");
        doc.DocumentNode.SelectSingleNode("//*[@data-active-tab]")!
            .GetAttributeValue("data-active-tab", "").ShouldBe("info");

        (await ReadStoredAsync(projectId)).Name.ShouldBe("Düzenleme Testi", "reddedilen kayıttan ad yazılmamalı");
    }

    [Fact]
    public async Task Ters_tarih_araligi_ayni_sayfada_alan_alti_hata_verir_yarim_kayit_olmaz()
    {
        var projectId = await CreateProjectAsync("EDIT-4");

        var response = await PostInfoAsync(projectId,
            ("Project.Name", "QA-UX yeni ad"),
            ("Project.Code", "EDIT-4"),
            ("Project.StartDate", "2026-09-27"),
            ("Project.EndDate", "2026-09-01"),
            // Tarayıcı tarih alanlarının yanına bu işaretçiyi basar: ISO değer değişmez kültürle çözülür.
            ("__Invariant", "Project.StartDate"),
            ("__Invariant", "Project.EndDate"));

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var doc = Parse(await response.Content.ReadAsStringAsync());

        FieldError(doc, "Project.EndDate").ShouldContain("Geçersiz tarih aralığı.");
        (await ReadStoredAsync(projectId)).Name.ShouldBe("Düzenleme Testi", "reddedilen kayıttan ad yazılmamalı");

        // İstemci kuralı: bitiş alanı aynı metni taşır (min'i Edit.js başlangıçtan kurar).
        var endInput = doc.DocumentNode.SelectSingleNode("//input[@name='Project.EndDate']");
        endInput.ShouldNotBeNull();
        WebUtility.HtmlDecode(endInput!.GetAttributeValue("data-msg-min", ""))
            .ShouldContain("Geçersiz tarih aralığı.");
    }

    [Fact]
    public async Task Desteklenmeyen_dosya_turu_dosyalar_sekmesinde_hata_verir()
    {
        var projectId = await CreateProjectAsync("EDIT-5");
        var url = $"/Projects/Edit/{projectId}";
        var token = AntiforgeryToken(await GetResponseAsStringAsync(url));

        using var form = new MultipartFormDataContent
        {
            { new StringContent(token), "__RequestVerificationToken" },
            { new ByteArrayContent(new byte[] { 0x4D, 0x5A, 0x90, 0x00 }), "AttachmentFile", "kurulum.exe" },
            { new StringContent("QA-UX"), "AttachmentTitle" }
        };

        var response = await Client.PostAsync(url + "?handler=UploadAttachment", form);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var html = WebUtility.HtmlDecode(await response.Content.ReadAsStringAsync());
        html.ShouldContain("data-active-tab=\"files\"");
        html.ShouldContain("Desteklenmeyen dosya türü");
    }
}
