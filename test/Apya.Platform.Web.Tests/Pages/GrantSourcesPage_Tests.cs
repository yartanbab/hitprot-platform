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
/// 1a · Kaynak &amp; Kazıma Konsolu ve 3a · Elle Hibe Girme.
/// Test host'u AddAlwaysAllowAuthorization kullanır; gerçek host'ta erişimi
/// <c>[Authorize(PlatformPermissions.Grants.Edit)]</c> (host-only izin) kapatır.
/// </summary>
public class GrantSourcesPage_Tests : PlatformWebTestBase
{
    /// <summary>Tasarım 3a'daki örnek çağrı metninin kısaltılmış hâli.</summary>
    private const string SampleText =
        "Sabancı Vakfı — Yeşil Dönüşüm Hibe Programı 2026\n" +
        "Program, küçük ve orta ölçekli işletmeleri desteklemektedir.\n" +
        "Azami destek tutarı 2.500.000 TL olup, destek oranı %70'tir.\n" +
        "Proje süresi en fazla 18 aydır. Başvurular 14 Ekim 2026 tarihine kadar alınır.";

    private static CreateUpdateGrantSourceDto Source(string name, string? url = null)
        => new() { Name = name, Url = url, IsActive = true };

    [Fact]
    public async Task Konsol_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Sources");

        html.ShouldContain("apya-src-layout");
        html.ShouldContain("Taslak Kuyruğu");
        html.ShouldContain("Kazıma taslak üretir");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Sources[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Sources.js içermeli");
    }

    [Fact]
    public async Task Elle_Giris_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Import");

        html.ShouldContain("apya-imp-layout");
        html.ShouldContain("Metinden çıkar");
        html.ShouldContain("kaynağa bağlanmaz");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Import[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Import.js içermeli");
    }

    [Fact]
    public async Task Kaynak_Eklenince_Konsolda_Hic_Taranmamis_Gorunur()
    {
        var service = GetRequiredService<IGrantSourceAppService>();

        var created = await service.CreateAsync(Source("TÜBİTAK Çağrılar"));

        created.Initial.ShouldBe("T");
        var console = await service.GetConsoleAsync();
        var row = console.Sources.Single(s => s.Id == created.Id);
        row.LastRunStatus.ShouldBeNull("hiç taranmamış kaynağın koşusu yoktur");
        row.CallCount.ShouldBe(0);
    }

    [Fact]
    public async Task Adressiz_Kaynak_Taranmaz_Ama_Kosu_Kaydedilir()
    {
        var service = GetRequiredService<IGrantSourceAppService>();
        var runRepo = GetRequiredService<IRepository<GrantScrapeRun, Guid>>();
        var created = await service.CreateAsync(Source("Adressiz Kaynak"));

        await service.ScrapeAllAsync();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var runs = await runRepo.GetListAsync(r => r.SourceId == created.Id);
        runs.ShouldNotBeEmpty("sessizce başarısız olmak yerine koşu kaydedilmeli");
        runs.ShouldAllBe(r => r.Status == GrantScrapeRunStatus.Atlandi);
    }

    [Fact]
    public async Task Kaziyici_Bagli_Degilken_Adresli_Kaynak_Da_Atlanir()
    {
        var service = GetRequiredService<IGrantSourceAppService>();
        await service.CreateAsync(Source("Adresli Kaynak", "https://ornek.gov.tr/cagrilar"));

        var result = await service.ScrapeAllAsync();

        // NotConfiguredGrantScraper geçerli olduğu sürece hiçbir koşu başarılı olmaz.
        result.SourceCount.ShouldBeGreaterThan(0);
        result.SucceededCount.ShouldBe(0);
        result.NewDraftCount.ShouldBe(0);
        result.SkippedCount.ShouldBe(result.SourceCount);
    }

    [Fact]
    public async Task Metinden_Alanlar_Cikarilir_Ve_Bos_Alanlar_Da_Doner()
    {
        var service = GetRequiredService<IGrantDraftAppService>();

        var result = await service.ExtractAsync(new ExtractGrantTextInput { Text = SampleText });

        // Boş alanlar da listede döner ki form "elle girin" satırını gösterebilsin.
        result.Fields.Count.ShouldBe(result.TotalCount);
        result.FilledCount.ShouldBeGreaterThan(0);
        result.FilledCount.ShouldBeLessThan(result.TotalCount);
        result.Fields.ShouldAllBe(f => f.Status == GrantDraftFieldStatus.Beklemede);

        var amount = result.Fields.Single(f => f.FieldKey == GrantTextExtractor.FieldMaxAmount);
        amount.Value.ShouldBe("2500000");
        amount.Excerpt.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Taslak_Kaydedilince_Cagri_TASLAK_Olarak_Dogar()
    {
        var draftService = GetRequiredService<IGrantDraftAppService>();
        var sourceService = GetRequiredService<IGrantSourceAppService>();
        var extraction = await draftService.ExtractAsync(new ExtractGrantTextInput { Text = SampleText });

        var created = await draftService.CreateDraftAsync(new CreateGrantDraftInput
        {
            Fields = extraction.Fields.ToList(),
            SourceUrl = "https://ornek.org/cagri"
        });

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin())
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();

            var call = await callRepo.GetAsync(created.GrantCallId);
            // 🔴 Modülün temel kuralı: elle/kazımayla gelen çağrı TASLAK doğar.
            call.Status.ShouldBe(GrantCallStatus.Taslak);
            call.Origin.ShouldBe(GrantCallOrigin.Elle);
            call.Deadline!.Value.Date.ShouldBe(new DateTime(2026, 10, 14));
            call.Period.ShouldBe("2026/1", "dönem son başvuru yılından türetilir");

            var grant = await grantRepo.GetAsync(created.GrantId);
            grant.Name.ShouldBe("Yeşil Dönüşüm Hibe Programı 2026");
            grant.Issuer.ShouldBe("Sabancı Vakfı");
            grant.MaxAmount.ShouldBe(2_500_000m);
            grant.SupportRatePercent.ShouldBe(70);
            grant.ProjectDurationMonths.ShouldBe(18);
            grant.SourceUrl.ShouldBe("https://ornek.org/cagri");
        }

        var console = await sourceService.GetConsoleAsync();
        console.Drafts.ShouldContain(d => d.GrantCallId == created.GrantCallId);
        console.DraftQueueCount.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task Ad_Veya_Kurum_Yoksa_Taslak_Reddedilir()
    {
        var service = GetRequiredService<IGrantDraftAppService>();

        var ex = await Should.ThrowAsync<Volo.Abp.BusinessException>(
            () => service.CreateDraftAsync(new CreateGrantDraftInput
            {
                Fields = new()
                {
                    new GrantExtractedFieldDto { FieldKey = GrantTextExtractor.FieldName, Value = "Yalnız ad" }
                }
            }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantDraftIdentityRequired);
    }

    [Fact]
    public async Task Alan_Guveni_Kuyrukta_Ortalama_Olarak_Gosterilir()
    {
        var draftService = GetRequiredService<IGrantDraftAppService>();
        var sourceService = GetRequiredService<IGrantSourceAppService>();

        var created = await draftService.CreateDraftAsync(new CreateGrantDraftInput
        {
            Fields = new()
            {
                new() { FieldKey = GrantTextExtractor.FieldName, Value = "Güven testi", Confidence = 100 },
                new() { FieldKey = GrantTextExtractor.FieldIssuer, Value = "Kurum", Confidence = 60 },
                // Değeri olmayan alan güveni 0 sayılır — ortalamayı aşağı çeker.
                new() { FieldKey = GrantTextExtractor.FieldNace, Value = null, Confidence = 90 }
            }
        });

        var console = await sourceService.GetConsoleAsync();
        var row = console.Drafts.Single(d => d.GrantCallId == created.GrantCallId);

        row.FieldConfidence.ShouldBe(53); // (100 + 60 + 0) / 3
        row.Title.ShouldBe("Güven testi");
    }
}
