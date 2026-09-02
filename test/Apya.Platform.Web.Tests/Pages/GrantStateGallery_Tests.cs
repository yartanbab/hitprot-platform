using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 7a / 7b / 7c · Durum galerisi.
///
/// <para>Bu testler METNİ değil DAVRANIŞI sınar: boş durum bir sonraki adımı
/// söylüyor mu, iskelet kabı gerçekten boş doğuyor mu, hatalı kaynak son
/// BAŞARILI taramayı ayrı tutuyor mu.</para>
/// </summary>
public class GrantStateGallery_Tests : PlatformWebTestBase
{
    private readonly IGrantPublicAppService _public;
    private readonly IGrantSourceAppService _sources;

    public GrantStateGallery_Tests()
    {
        _public = GetRequiredService<IGrantPublicAppService>();
        _sources = GetRequiredService<IGrantSourceAppService>();
    }

    // ─────────────────────────────────────────── 7a

    /// <summary>
    /// Boş sonuçta "filtreleri gözden geçirin" demek yetmez; hangi süzgecin kaç
    /// sonuç açacağı söylenmeli.
    /// </summary>
    [Fact]
    public async Task Bos_Sonucta_Hangi_Suzgecin_Kac_Sonuc_Actigi_Soylenir()
    {
        // Hiçbir çağrının eşleşmeyeceği bir tutar aralığı + gerçek bir kurum.
        var all = await _public.SearchAsync(new GrantPublicSearchInput());
        all.Items.ShouldNotBeEmpty("test verisinde açık çağrı olmalı");

        var result = await _public.SearchAsync(new GrantPublicSearchInput
        {
            MinAmount = 999_000_000_000m
        });

        result.Items.ShouldBeEmpty();
        result.Relaxations.ShouldNotBeEmpty("gevşetme önerisi üretilmeli");
        result.Relaxations.ShouldContain(r => r.Filter == "Amount");
        result.Relaxations.ShouldAllBe(r => r.Count > 0, "sonuç açmayan öneri listelenmemeli");
    }

    /// <summary>Uygulanmamış süzgeç için öneri üretilmez — gürültü olurdu.</summary>
    [Fact]
    public async Task Uygulanmamis_Suzgec_Icin_Oneri_Uretilmez()
    {
        var result = await _public.SearchAsync(new GrantPublicSearchInput
        {
            MinAmount = 999_000_000_000m
        });

        result.Relaxations.ShouldNotContain(r => r.Filter == "Issuer");
        result.Relaxations.ShouldNotContain(r => r.Filter == "Difficulty");
    }

    [Fact]
    public async Task Suzgecsiz_Bos_Sonucta_Oneri_Uretilmez()
    {
        // Süzgeç yokken gevşetilecek bir şey de yok.
        var result = await _public.SearchAsync(new GrantPublicSearchInput());

        if (result.Items.Count == 0)
        {
            result.Relaxations.ShouldBeEmpty();
        }
    }

    // ─────────────────────────────────────────── 7b

    /// <summary>
    /// İskelet SAF CSS ve <c>:empty</c> üzerine kurulu: kap boş DOĞMALI, yoksa
    /// kural hiç eşleşmez ve iskelet hiç görünmez.
    /// </summary>
    [Fact]
    public async Task Iskelet_Kaplari_Bos_Dogar()
    {
        foreach (var (url, id) in new[]
                 {
                     ("/Grants/Leads", "LeadRows"),
                     ("/Grants/NotificationTemplates", "NtRows")
                 })
        {
            var html = await GetResponseAsStringAsync(url);

            html.ShouldContain("apya-skel-rows", Case.Sensitive,
                $"{url} iskelet sınıfı taşımalı");

            // Kap boş mu — <div id="X" ...></div>
            System.Text.RegularExpressions.Regex
                .IsMatch(html, "<div id=\"" + id + "\"[^>]*></div>")
                .ShouldBeTrue($"{url} · #{id} boş doğmalı, yoksa :empty eşleşmez");
        }
    }

    [Fact]
    public async Task Kpi_Yer_Tutuculari_Bos_Dogar()
    {
        var html = await GetResponseAsStringAsync("/Grants/Leads");

        html.ShouldContain("apya-skel-num");
        // "—" ya da "0" ile doğan KPI iskelet gösteremez.
        System.Text.RegularExpressions.Regex
            .IsMatch(html, "id=\"KpiWeek\"[^>]*>\\s*(—|0)\\s*<")
            .ShouldBeFalse("KPI yer tutucusu boş doğmalı");
    }

    // ─────────────────────────────────────────── 7c

    /// <summary>
    /// Hatalı kaynakta "en son ne zaman VERİ geldi" ayrı tutulur.
    /// <c>LastScrapedAt</c> başarısız koşuyu da sayar ve "dün tarandı" diyerek
    /// yanıltır.
    /// </summary>
    [Fact]
    public async Task Hatali_Kaynakta_Son_Basarili_Tarama_Ayri_Tutulur()
    {
        var (sourceId, successAt) = await SetupFailingSourceAsync();

        var console = await _sources.GetConsoleAsync();
        var source = console.Sources.Single(s => s.Id == sourceId);

        source.LastRunStatus.ShouldBe(GrantScrapeRunStatus.Hatali);
        source.LastRunMessage.ShouldBe("401 yetki reddedildi");

        source.LastSuccessAt.ShouldNotBeNull();
        source.LastSuccessAt!.Value.Date.ShouldBe(successAt.Date);

        // 🔴 Asıl mesele: son BAŞARILI tarama, son taramadan ESKİ olmalı.
        source.LastSuccessAt.Value.ShouldBeLessThan(source.LastScrapedAt!.Value);
    }

    [Fact]
    public async Task Basarili_Kaynakta_Hata_Mesaji_Dolmaz()
    {
        var console = await _sources.GetConsoleAsync();

        foreach (var s in console.Sources.Where(s => s.LastRunStatus != GrantScrapeRunStatus.Hatali))
        {
            s.LastRunMessage.ShouldBeNull($"{s.Name} hatalı değil, mesaj taşımamalı");
        }
    }

    // ─────────────────────────────────────────── kurulum

    private async Task<(Guid SourceId, DateTime SuccessAt)> SetupFailingSourceAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var sourceRepo = GetRequiredService<IRepository<GrantSource, Guid>>();
        var runRepo = GetRequiredService<IRepository<GrantScrapeRun, Guid>>();

        using var uow = uowManager.Begin(requiresNew: true);

        var source = new GrantSource(Guid.NewGuid(), "Ticaret Bakanlığı " + Guid.NewGuid().ToString("N")[..4])
        {
            Url = "https://example.local/feed",
            IsActive = true
        };

        var successAt = DateTime.Now.AddDays(-9);
        source.LastScrapedAt = DateTime.Now.AddHours(-2);
        await sourceRepo.InsertAsync(source, autoSave: true);

        // Önce başarılı, sonra hatalı koşu.
        await runRepo.InsertAsync(new GrantScrapeRun(Guid.NewGuid(), source.Id, successAt)
        {
            FinishedAt = successAt,
            Status = GrantScrapeRunStatus.Basarili,
            FoundCount = 12,
            NewCount = 3
        }, autoSave: true);

        await runRepo.InsertAsync(new GrantScrapeRun(Guid.NewGuid(), source.Id, DateTime.Now.AddHours(-2))
        {
            FinishedAt = DateTime.Now.AddHours(-2),
            Status = GrantScrapeRunStatus.Hatali,
            Message = "401 yetki reddedildi"
        }, autoSave: true);

        await uow.CompleteAsync();
        return (source.Id, successAt);
    }
}
