using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Storage;
using Apya.Platform.Web.Pages.Grants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 1b · Hibe Parametre Formu — sayfa render'ı ve canlı eşleşme ucu.
/// Test host'u AddAlwaysAllowAuthorization kullanır; gerçek host'ta erişimi
/// <c>[Authorize(PlatformPermissions.Grants.Edit)]</c> (host-only izin) kapatır.
/// </summary>
public class GrantParametersPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> FirstGrantIdAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<Grant, Guid>>();
        var grants = await repo.GetListAsync();
        grants.ShouldNotBeEmpty("tohum verisinde en az bir hibe programı olmalı");
        return grants.OrderBy(g => g.Name).First().Id;
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var id = await FirstGrantIdAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Parameters?id={id}");

        // 10b düzeni: başlık + canlı eşleşme kartı, sekme grubu, şart kartları, alt sabit çubuk.
        html.ShouldContain("apya-param-hero");
        html.ShouldContain("Şu an kaç firma uygun");
        html.ShouldContain("apya-param-tabs");
        html.ShouldContain("Kimler başvurabilir");
        html.ShouldContain("RuleList");
        html.ShouldContain("Nereden geldi");
        html.ShouldContain("Kaç firmayı eliyor");
        html.ShouldContain("RuleConflicts");
        html.ShouldContain("apya-param-bar");
        // 12b · Kimlik bölümünde afiş alanı; önizleme kiracı kartıyla aynı zemin betiğini kullanır.
        html.ShouldContain("PosterPreview");
        html.ShouldContain("PosterUploadBtn");
        // Resmî duyurunun metin başlıkları ve asgari destek tutarı.
        html.ShouldContain("ParamObjective");
        html.ShouldContain("ParamPriorities");
        html.ShouldContain("ParamEligibleApplicants");
        html.ShouldContain("ParamMinAmount");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Poster[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Poster.js içermeli");
        // Eski sol menü ve sağ panel geri gelmemeli.
        html.ShouldNotContain("apya-param-nav");
        html.ShouldNotContain("apya-param-side");
        // STK hedeflemesi: firma profilindekiyle aynı sabit tematik alan listesi.
        html.ShouldContain("ParamThematic");
        html.ShouldContain("Kültür ve Sanat");
        // Sayfa script/stili ABP demetine girer (/__bundles/...Parameters.<hash>.js),
        // ham dosya yolu HTML'de görünmez.
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Parameters[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Parameters.js içermeli");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Parameters[^""]*\.css")
            .ShouldBeTrue("sayfa demeti Parameters.css içermeli");
    }

    // ---------- 12b · Program afişi ----------

    // Sunucu görseli çözmez, yalnız ilk baytlara bakar; imzadan sonrası dolgu yeter.
    private static readonly byte[] PngBytes = Convert.FromHexString("89504E470D0A1A0A0000000D49484452");
    private static readonly byte[] JpegBytes = Convert.FromHexString("FFD8FFE000104A464946000101000001");

    /// <summary>Açık çağrısı olan bir program: afişin kiracı akışına taşındığını görmek için.</summary>
    private async Task<(Guid GrantId, Guid CallId)> OpenCallGrantAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = (await repo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).FirstOrDefault();
        call.ShouldNotBeNull("tohum verisinde en az bir açık çağrı olmalı");
        return (call!.GrantId, call.Id);
    }

    /// <summary>
    /// Parametre sayfasında form yok (kaydetme JS ile); jeton, form basan bir sayfadan alınır.
    /// Antiforgery jetonu sayfaya değil oturuma bağlıdır — aynı istemcide geçerlidir.
    /// </summary>
    private async Task<string> AntiforgeryTokenAsync()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Admin/Billing"));
        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("antiforgery jetonu alınamadı");
        return input.GetAttributeValue("value", "");
    }

    private async Task<HttpResponseMessage> PostPosterAsync(Guid grantId, string token, string fileName, byte[] bytes, string contentType)
    {
        using var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(bytes);
        file.Headers.ContentType = new MediaTypeHeaderValue(contentType);
        content.Add(file, "file", fileName);
        content.Add(new StringContent(token), "__RequestVerificationToken");
        return await Client.PostAsync($"/Grants/Parameters?handler=UploadPoster&id={grantId}", content);
    }

    private async Task<string> UploadPosterAsync(Guid grantId, string token, string fileName, byte[] bytes, string contentType)
    {
        var response = await PostPosterAsync(grantId, token, fileName, bytes, contentType);
        response.StatusCode.ShouldBe(HttpStatusCode.OK, await response.Content.ReadAsStringAsync());
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var stored = json.RootElement.GetProperty("posterFileName").GetString();
        stored.ShouldNotBeNullOrWhiteSpace();
        return stored!;
    }

    /// <summary>
    /// 12b uçtan uca: afiş diske yazılır ve programa bağlanır, kiracı akışı adı taşır; yeni afiş
    /// eskisini diskten siler; kaldırma dosyayı siler ve kart kuruma özel zemine döner.
    /// </summary>
    [Fact]
    public async Task Afis_Yuklenir_Degisir_Kaldirilir()
    {
        var (grantId, callId) = await OpenCallGrantAsync();
        var root = GetRequiredService<IUploadedFileRootFolderProvider>();
        var parameters = GetRequiredService<IGrantParameterAppService>();
        var feed = GetRequiredService<IGrantRecommendationAppService>();
        var written = new List<string>();

        try
        {
            var token = await AntiforgeryTokenAsync();

            var first = await UploadPosterAsync(grantId, token, "afis.png", PngBytes, "image/png");
            written.Add(first);
            File.Exists(root.ResolveSafePath(first)!).ShouldBeTrue("afiş App_Data/uploads'a yazılır");
            (await parameters.GetAsync(grantId)).PosterFileName.ShouldBe(first);
            (await feed.GetOpenCallsAsync()).Single(r => r.GrantCallId == callId).PosterFileName.ShouldBe(first);

            var second = await UploadPosterAsync(grantId, token, "afis.jpg", JpegBytes, "image/jpeg");
            written.Add(second);
            File.Exists(root.ResolveSafePath(first)!).ShouldBeFalse("yerine geçen afiş diskten silinir");
            (await parameters.GetAsync(grantId)).PosterFileName.ShouldBe(second);

            var removed = await Client.PostAsync($"/Grants/Parameters?handler=RemovePoster&id={grantId}",
                new FormUrlEncodedContent(new Dictionary<string, string> { ["__RequestVerificationToken"] = token }));
            removed.StatusCode.ShouldBe(HttpStatusCode.OK);
            File.Exists(root.ResolveSafePath(second)!).ShouldBeFalse("kaldırılan afiş diskten silinir");
            (await parameters.GetAsync(grantId)).PosterFileName.ShouldBeNull();
            (await feed.GetOpenCallsAsync()).Single(r => r.GrantCallId == callId).PosterFileName.ShouldBeNull();
        }
        finally
        {
            foreach (var name in written)
            {
                var path = root.ResolveSafePath(name);
                if (path != null && File.Exists(path)) { File.Delete(path); }
            }
        }
    }

    /// <summary>
    /// ".png" adıyla gelen HTML reddedilir: /file/get görsel türüyle servis ederdi. Program
    /// değişmez, diske dosya yazılmaz.
    /// </summary>
    [Fact]
    public async Task Png_Adiyla_Gelen_Baska_Icerik_Reddedilir()
    {
        var grantId = await FirstGrantIdAsync();
        var parameters = GetRequiredService<IGrantParameterAppService>();
        var root = GetRequiredService<IUploadedFileRootFolderProvider>();
        var before = (await parameters.GetAsync(grantId)).PosterFileName;
        var filesBefore = Directory.GetFiles(root.GetRootFolder()).Length;

        var response = await PostPosterAsync(grantId, await AntiforgeryTokenAsync(), "afis.png",
            Encoding.UTF8.GetBytes("<html><script>alert(1)</script></html>"), "image/png");

        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        (await response.Content.ReadAsStringAsync()).ShouldContain("JPG veya PNG");
        (await parameters.GetAsync(grantId)).PosterFileName.ShouldBe(before);
        Directory.GetFiles(root.GetRootFolder()).Length.ShouldBe(filesBefore, "reddedilen dosya diske yazılmaz");
    }

    [Theory]
    [InlineData(".png", "89504E470D0A1A0A", true)]
    [InlineData(".PNG", "89504E470D0A1A0A", true)]
    [InlineData(".jpg", "FFD8FFE000104A46", true)]
    [InlineData(".jpeg", "FFD8FFDB", true)]
    [InlineData(".jpg", "89504E470D0A1A0A", false)] // PNG içerik JPG adıyla
    [InlineData(".png", "3C68746D6C3E", false)]     // "<html>"
    [InlineData(".gif", "4749463839610000", false)] // tasarım: yalnız JPG/PNG
    [InlineData(".png", "89504E47", false)]         // kesik başlık
    [InlineData("", "89504E470D0A1A0A", false)]
    public void Afis_Imzasi_Uzantiyla_Eslesmeli(string extension, string headHex, bool expected)
    {
        ParametersModel.IsSupportedPoster(extension, Convert.FromHexString(headHex)).ShouldBe(expected);
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Parameters");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Sayfada_Ham_Renk_Degeri_Yok()
    {
        // Tasarım kuralı: her renk token'dan gelir. Sayfanın kendi markup'ında
        // hex renk bulunmamalı (LeptonX/Bootstrap demetleri bu kontrole girmez).
        var id = await FirstGrantIdAsync();
        var html = await GetResponseAsStringAsync($"/Grants/Parameters?id={id}");

        // Yalnız SAYFANIN kendi bloğu ölçülür; LeptonX kabuğunun satır içi stilleri
        // bu kuralın konusu değil.
        var start = html.IndexOf("apya-param-hero", StringComparison.Ordinal);
        start.ShouldBeGreaterThan(-1);
        var end = html.IndexOf("apya-param-bar-actions", start, StringComparison.Ordinal);
        end.ShouldBeGreaterThan(start);
        var body = html[start..end];

        System.Text.RegularExpressions.Regex
            .IsMatch(body, @"style\s*=\s*""[^""]*#[0-9A-Fa-f]{3,6}")
            .ShouldBeFalse("sayfa markup'ında satır içi hex renk olmamalı");
    }

    [Fact]
    public async Task Parametre_Ucu_Programi_Doner()
    {
        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        var dto = await service.GetAsync(id);

        dto.Id.ShouldBe(id);
        dto.Issuer.ShouldNotBeNullOrWhiteSpace();
        // Yayınlanacak taslak çağrı yoksa Yayınla kapalı kalır.
        dto.CanPublish.ShouldBe(dto.MissingRequiredFields.Count == 0 && dto.DraftCallCount > 0);
    }

    /// <summary>Ar-Ge personeli 1 olan tek firmalık bir kiracı kurar.</summary>
    private async Task<Guid> CreateFirmAsync(int rdStaffCount)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        var profileRepo = GetRequiredService<IRepository<FirmProfile, Guid>>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Firma-" + Guid.NewGuid().ToString("N")[..8]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (currentTenant.Change(tenantId))
            {
                await profileRepo.InsertAsync(
                    new FirmProfile(Guid.NewGuid(), tenantId) { RdStaffCount = rdStaffCount },
                    autoSave: true);
            }
            await uow.CompleteAsync();
        }

        return tenantId;
    }

    [Fact]
    public async Task Canli_Eslesme_Sart_Eklendikce_Daralir()
    {
        await CreateFirmAsync(rdStaffCount: 1);

        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        var bos = await service.PreviewMatchAsync(id, new UpdateGrantParameterDto
        {
            Name = "P",
            Issuer = "K"
        });

        // Hiç şart yokken kural üretilmez; her firma "karşılıyor" sayılır.
        bos.TotalFirms.ShouldBeGreaterThan(0);
        bos.RuleImpacts.ShouldBeEmpty();
        bos.MatchingFirms.ShouldBe(bos.TotalFirms);
        bos.TopEliminatingRule.ShouldBeNull();

        var sartli = await service.PreviewMatchAsync(id, new UpdateGrantParameterDto
        {
            Name = "P",
            Issuer = "K",
            MinRdStaffCount = 2
        });

        // Şart tanımlandı → kural üretildi ve Ar-Ge personeli 1 olan firma ELENDİ.
        var etki = sartli.RuleImpacts.Single(i => i.Rule == GrantEligibilityRule.RdStaffCount);
        etki.EliminatedCount.ShouldBeGreaterThan(0);
        sartli.TopEliminatingRule.ShouldBe(GrantEligibilityRule.RdStaffCount);
        sartli.MatchingFirms.ShouldBeLessThan(bos.MatchingFirms);
    }

    [Fact]
    public async Task Zorunlu_Alan_Eksikken_Yayin_Reddedilir()
    {
        var id = await FirstGrantIdAsync();
        var service = GetRequiredService<IGrantParameterAppService>();

        // Destek oranı ve proje süresi boş → yayın kapısı kapalı.
        await service.UpdateAsync(id, new UpdateGrantParameterDto
        {
            Name = "Yayın kapısı testi",
            Issuer = "Kurum"
        });

        var ex = await Should.ThrowAsync<Volo.Abp.BusinessException>(
            () => service.PublishAsync(id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantPublishRequiredFieldsMissing);
    }

    [Fact]
    public async Task Kimlik_Metinleri_Ve_Asgari_Destek_Kiraci_Detayina_Tasinir()
    {
        var (grantId, callId) = await OpenCallGrantAsync();
        var service = GetRequiredService<IGrantParameterAppService>();
        var current = await service.GetAsync(grantId);

        var saved = await service.UpdateAsync(grantId, new UpdateGrantParameterDto
        {
            Name = current.Name,
            Issuer = current.Issuer,
            Objective = "Yaratıcı endüstrilerin katkısını artırmak",
            Priorities = "Öncelik 1\r\nÖncelik 2",
            EligibleApplicants = "Dernekler\nVakıflar",
            MinAmount = 5_000_000m,
            MaxAmount = 20_000_000m
        });

        saved.Objective.ShouldBe("Yaratıcı endüstrilerin katkısını artırmak");
        saved.MinAmount.ShouldBe(5_000_000m);

        var reread = await service.GetAsync(grantId);
        reread.Priorities.ShouldBe("Öncelik 1\r\nÖncelik 2");
        reread.EligibleApplicants.ShouldBe("Dernekler\nVakıflar");
        reread.MinAmount.ShouldBe(5_000_000m);

        // Kiracı detayı aynı değerleri taşır; satırları listeye istemci çevirir.
        var detail = await GetRequiredService<IGrantRecommendationAppService>().GetCallDetailAsync(callId);
        detail.Objective.ShouldBe("Yaratıcı endüstrilerin katkısını artırmak");
        detail.Priorities.ShouldBe("Öncelik 1\r\nÖncelik 2");
        detail.EligibleApplicants.ShouldBe("Dernekler\nVakıflar");
        detail.MinAmount.ShouldBe(5_000_000m);
        detail.MaxAmount.ShouldBe(20_000_000m);
    }
}
