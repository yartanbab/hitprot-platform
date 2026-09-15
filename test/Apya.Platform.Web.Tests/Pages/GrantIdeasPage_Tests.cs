using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 19a/22 · Fikir Havuzu: host'ta sekmesiz tek liste + "Fikir ekle"; kiracı fikrini
/// /Grants/Idea'dan paylaşır. Test host'u host bağlamında koşar.
/// </summary>
public class GrantIdeasPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Fikir_Havuzu_Sayfasi_Liste_Suzgec_Ve_Ekleme_Penceresiyle_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Ideas");

        html.ShouldContain("IdeaRows");
        html.ShouldContain("SourceFilter");
        html.ShouldContain("SortFilter");
        html.ShouldContain("IdeaAddBtn");
        html.ShouldContain("IdeaModal");
        html.ShouldContain("IdeaCreateModal");
        html.ShouldContain("IdeaFirm");
        // 20a/22 · Çağrı eşleşmesi sütunu, "Eşleşme bekleyen" şeridi ve varsayılan sıra eşleşme gücü.
        html.ShouldContain("Çağrı eşleşmesi");
        html.ShouldContain("AwaitingStrip");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"id=""SortFilter""[^>]*>\s*<option value=""2"">").ShouldBeTrue("ilk seçenek eşleşme gücü");
        // Firma adına giriş kiracı formunun aynı dokuz sorusunu sorar; havuz ipucu çağrıdan söz etmez.
        html.ShouldContain("id=\"InterestStakeholders\"");
        html.ShouldContain("Nasıl bir proje geliştirmek istiyorsunuz?");
        html.ShouldNotContain("Bu çağrı kapsamında");
        Regex.IsMatch(html, @"IdeaForm[^""]*\.js").ShouldBeTrue("ortak form betiği yüklenmeli");
        Regex.IsMatch(html, @"Ideas[^""]*\.js").ShouldBeTrue("sayfa demeti Ideas.js içermeli");
        // 22 · Sekme yok: bağlanan fikir talep olur, Talepler'de yaşar.
        html.ShouldNotContain("apya-grant-tabs");
    }

    [Fact]
    public async Task Host_Fikir_Paylas_Sayfasinda_Havuza_Yonlenir()
    {
        var response = await Client.GetAsync("/Grants/Idea");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants/Ideas");
    }

    /// <summary>Kiracı gözüyle: çağrısız form, akıştaki kart ve yolculuk başlığındaki giriş noktası.</summary>
    [Fact]
    public async Task Kiraci_Fikir_Paylas_Formu_Ve_Giris_Noktalari_Render_Oluyor()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("fikir-" + Guid.NewGuid().ToString("N")[..8]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        await WithTenantClientAsync(tenant.Id, async client =>
        {
            var idea = await client.GetStringAsync("/Grants/Idea");
            idea.ShouldContain("IdeaForm");
            idea.ShouldContain("id=\"InterestNote\"");
            idea.ShouldContain("id=\"InterestStakeholders\"");
            idea.ShouldContain("Şimdilik boş");
            // Çağrı yok → konsorsiyum sorusu da yok.
            idea.ShouldNotContain("InterestPartnerBlock");
            Regex.IsMatch(idea, @"IdeaForm[^""]*\.js").ShouldBeTrue("ortak form betiği yüklenmeli");
            Regex.IsMatch(idea, @"Grants\.Idea\.[0-9A-F]+\.js").ShouldBeTrue("sayfa demeti Idea.js içermeli");

            (await client.GetStringAsync("/Grants/Journey")).ShouldContain("href=\"/Grants/Idea\"");
            (await client.GetStringAsync("/Grants")).ShouldContain("href=\"/Grants/Idea\"");
        });
    }

    [Fact]
    public async Task Cagriya_Ilgi_Formu_Ortak_Sorulari_Tasimaya_Devam_Eder()
    {
        var html = await GetResponseAsStringAsync("/Grants/Detail?id=6f2f3a1e-0000-4000-8000-00000000ab01");

        // Sorular _IdeaQuestions'a taşındı; çağrı bağlamında ipucu çağrıdan söz eder.
        html.ShouldContain("Bu çağrı kapsamında");
        Regex.IsMatch(html, @"IdeaForm[^""]*\.js").ShouldBeTrue("ortak form betiği Detail'de de yüklenmeli");
    }
}
