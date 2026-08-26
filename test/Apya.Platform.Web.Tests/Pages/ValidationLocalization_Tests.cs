using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Doğrulama ve hata metinlerinin Türkçeliği.
///
/// Üç ayrı boşluk vardı ve üçü de kullanıcıya İngilizce metin olarak çıkıyordu:
///
///  1. ASP.NET Core, <c>ErrorMessage</c>'ı açıkça verilmemiş DataAnnotations
///     attribute'larını HİÇ yerelleştirmez — repodaki 259 attribute'un ikisi hariç
///     hepsi bu durumda. ("The Name field is required.")
///  2. <c>MvcOptions.ModelBindingMessageProvider</c> yapılandırılmamıştı; tarih/sayı
///     alanına geçersiz değer girildiğinde İngilizce metin çıkıyordu.
///  3. Alan adları property adı olarak basılıyordu ("Name alanı ..."), çünkü tüm kod
///     tabanında yalnız bir <c>[Display]</c> vardı.
///
/// Bunların hiçbiri derleme veya mevcut testlerle yakalanmıyordu: sayfa 200 dönüyor,
/// yalnız METİN yanlış oluyordu. Aşağıdaki testler o metinleri doğrudan ölçer.
/// </summary>
public class ValidationLocalization_Tests : PlatformWebTestBase
{
    private readonly IStringLocalizer<PlatformResource> _localizer;

    public ValidationLocalization_Tests()
    {
        _localizer = GetRequiredService<IStringLocalizer<PlatformResource>>();
    }

    // ── Yardımcılar ──────────────────────────────────────────────────────────

    private async Task<Guid> CreateProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            var currentTenant = GetRequiredService<ICurrentTenant>();

            await repository.InsertAsync(
                new Project(projectId, currentTenant.Id, null, "Doğrulama Testi", code, "Metin testi"),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return projectId;
    }

    private static string AntiforgeryToken(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");

        return input.GetAttributeValue("value", "");
    }

    /// <summary>
    /// Razor çıktısı @ifadelerini HtmlEncoder.Default ile kodlar; varsayılan aralık
    /// yalnız Basic Latin olduğu için "ş/ı/ü" sayısal varlığa (&amp;#x15F;) dönüşür.
    /// Tarayıcı doğru gösterir, string karşılaştırması göstermez → önce çöz.
    /// </summary>
    private static string Decode(string html) => WebUtility.HtmlDecode(html);

    private async Task<HttpResponseMessage> PostInfoTabAsync(Guid projectId, Dictionary<string, string> overrides)
    {
        var url = $"/Projects/Edit/{projectId}";
        var token = AntiforgeryToken(await GetResponseAsStringAsync(url));

        var form = new Dictionary<string, string>
        {
            ["Project.Name"] = "Doğrulama Testi",
            ["Project.Code"] = "VAL-1",
            ["Project.Category"] = "0",
            ["__RequestVerificationToken"] = token
        };

        foreach (var (key, value) in overrides)
        {
            form[key] = value;
        }

        return await Client.PostAsync(url, new FormUrlEncodedContent(form));
    }

    /// <summary>
    /// Doğrulama HATASI beklenen post: sayfa yeniden basılır (200) ve özet burada çıkar.
    /// Test istemcisi yönlendirmeyi izlemez; 302 dönmesi "ModelState geçerliydi" demektir.
    /// </summary>
    private async Task<string> PostInvalidInfoTabAsync(Guid projectId, Dictionary<string, string> overrides)
    {
        var response = await PostInfoTabAsync(projectId, overrides);

        response.StatusCode.ShouldBe(
            HttpStatusCode.OK,
            "Doğrulama hatası bekleniyordu ama post kabul edildi.");

        return Decode(await response.Content.ReadAsStringAsync());
    }

    // ── 1. Kullanıcının görmediği alan için doğrulama hatası ─────────────────

    /// <summary>
    /// "The Tab field is required." — sayfadaki hiçbir form Tab alanını post etmiyor;
    /// non-nullable string olduğu için .NET örtük [Required] uyguluyordu ve KAYIT HİÇ
    /// GEÇMİYORDU. Kullanıcı böyle bir alan görmediği için hatayı da düzeltemiyordu.
    /// </summary>
    [Fact]
    public async Task Bilgiler_formu_kaydedilir_gorunmeyen_alanlar_dogrulamaya_takilmaz()
    {
        var projectId = await CreateProjectAsync("VAL-1");

        var response = await PostInfoTabAsync(projectId, new Dictionary<string, string>());

        // OnPost yalnız ModelState geçerliyse yönlendirir; hata olsa sayfayı 200 ile
        // yeniden basardı. Düzeltme öncesi burada "The Tab field is required." vardı.
        response.StatusCode.ShouldBe(HttpStatusCode.Found);

        // Yönlendirme hedefi kaydedildi şeridini basar (TempData çerezle taşınır).
        var saved = Decode(await GetResponseAsStringAsync(response.Headers.Location!.ToString()));
        saved.ShouldContain("Değişiklikler kaydedildi.");
    }

    // ── 2. Gerçek doğrulama hatası: Türkçe metin + Türkçe alan adı ───────────

    [Fact]
    public async Task Zorunlu_alan_hatasi_turkce_ve_alan_adi_cozulur()
    {
        var projectId = await CreateProjectAsync("VAL-2");

        var html = await PostInvalidInfoTabAsync(projectId, new Dictionary<string, string>
        {
            ["Project.Name"] = ""
        });

        // Şablon tr.json'dan, alan adı DisplayName:CreateProjectDto.Name'den geliyor.
        html.ShouldContain("Proje adı boş bırakılamaz.");
        html.ShouldNotContain("field is required");
    }

    // ── 3. Model bağlama hatası (sayısal alana metin) ────────────────────────

    [Fact]
    public async Task Sayisal_alana_metin_girilince_baglama_hatasi_turkce()
    {
        var projectId = await CreateProjectAsync("VAL-3");

        var html = await PostInvalidInfoTabAsync(projectId, new Dictionary<string, string>
        {
            ["Project.TotalBudget"] = "abc"
        });

        // Şablon Validation:AttemptedValueIsInvalid, alan adı ABP'nin DisplayName:TotalBudget
        // karşılığı. Yalnız "Bütçe" aramak yanıltıcı olurdu — form etiketi de öyle yazıyor.
        html.ShouldContain("“abc”, Bütçe için geçerli bir değer değil.");
        html.ShouldNotContain("is not valid for");
    }

    // ── 4. Sayfada İngilizce doğrulama metni kalmamalı ──────────────────────

    [Fact]
    public async Task Dogrulama_ozetinde_ingilizce_cerceve_metni_kalmaz()
    {
        var projectId = await CreateProjectAsync("VAL-4");

        var html = await PostInvalidInfoTabAsync(projectId, new Dictionary<string, string>
        {
            ["Project.Name"] = "",
            ["Project.Code"] = new string('X', 64),   // MaxLength(32) ihlali
            ["Project.TotalBudget"] = "abc"
        });

        foreach (var english in new[]
                 {
                     "field is required",
                     "must be a string",
                     "is not valid for",
                     "The value",
                     "The field"
                 })
        {
            html.ShouldNotContain(english, Case.Sensitive);
        }

        html.ShouldContain("Proje kodu en fazla 32 karakter olabilir.");
    }

    // ── 5. İş kuralı hata kodları ───────────────────────────────────────────

    /// <summary>
    /// BusinessException kodunun ":" öncesi parçası AbpExceptionLocalizationOptions'ta
    /// eşlenmezse ABP çeviriyi hiç aramaz ve kullanıcıya "Sayfa işlenirken sunucu
    /// tarafında beklenmedik bir hata oluştu!" döner. "Apya" ve "Project" ad alanları
    /// eşlenmemişti — beş hata kodu bu yüzden ekrana hiç çıkmıyordu.
    /// </summary>
    [Theory]
    [InlineData("Project:NameEmpty", "Proje adı boş bırakılamaz.")]
    [InlineData("Project:CodeEmpty", "Proje kodu boş bırakılamaz.")]
    [InlineData("Apya:BoardColumn:SystemStatusImmutable", "Sistem kolonunun temsil ettiği durum değiştirilemez.")]
    public void Is_kurali_hata_kodlari_turkce_mesaja_donusur(string code, string expected)
    {
        var converter = GetRequiredService<IExceptionToErrorInfoConverter>();

        var info = converter.Convert(new BusinessException(code), includeSensitiveDetails: false);

        info.Message.ShouldBe(expected);
    }

    // ── 6. Sapma koruması: yeni alan eklenince Türkçe adı unutulmasın ───────

    /// <summary>
    /// Doğrulama attribute'u taşıyan HER property bir doğrulama mesajında görünebilir.
    /// Karşılığı yoksa mesaj sessizce İngilizce property adına düşer — sayfa yine 200
    /// döndüğü için hiçbir test bunu yakalamaz. Bu test kaynağı tarayıp listeyi kendisi
    /// üretir; elle güncellenen bir liste değildir.
    /// </summary>
    [Fact]
    public void Dogrulama_attribute_tasiyan_tum_alanlarin_turkce_adi_var()
    {
        var eksikler = ValidatedProperties()
            .Where(p => !HasDisplayName(p.Container, p.Property))
            .Select(p => $"{p.Container}.{p.Property}")
            .Distinct()
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        eksikler.ShouldBeEmpty(
            "tr.json'a DisplayName anahtarı eklenmemiş alanlar var: " + string.Join(", ", eksikler));
    }

    /// <summary>
    /// Attribute taramasından DAHA GENİŞ bir küme: <c>asp-for</c> ile basılan her alan
    /// için Razor <c>data-val-required</c> üretir — non-nullable DEĞER tiplerinde
    /// (decimal/bool/Guid/DateTime) örtük [Required] kapatılamaz, .NET her zaman ekler.
    ///
    /// Karşılığı yoksa istemciye "OpeningBalance boş bırakılamaz." basılır. Tarayıcı
    /// QA'inde tam olarak bu görüldü; attribute tabanlı test bunu KAÇIRIYORDU çünkü
    /// bu alanların üzerinde hiçbir doğrulama attribute'u yok.
    /// </summary>
    [Fact]
    public void Formda_basilan_tum_alanlarin_turkce_adi_var()
    {
        var srcRoot = FindSourceRoot();
        srcRoot.ShouldNotBeNull("Kaynak kökü bulunamadı.");

        var pagesRoot = Path.Combine(srcRoot!, "Apya.Platform.Web", "Pages");
        var aspFor = new Regex("asp-for=\"([\\w\\.]+)\"", RegexOptions.Compiled);

        var eksikler = Directory.EnumerateFiles(pagesRoot, "*.cshtml", SearchOption.AllDirectories)
            .SelectMany(f => aspFor.Matches(File.ReadAllText(f)).Select(m => m.Groups[1].Value))
            .Select(path => path.Split('.').Last())
            .Distinct()
            .Where(name => _localizer[$"DisplayName:{name}"].ResourceNotFound)
            .OrderBy(x => x, StringComparer.Ordinal)
            .ToList();

        eksikler.ShouldBeEmpty(
            "asp-for ile basılan ama Türkçe adı olmayan alanlar: " + string.Join(", ", eksikler));
    }

    private bool HasDisplayName(string container, string property)
    {
        return !_localizer[$"DisplayName:{container}.{property}"].ResourceNotFound
               || !_localizer[$"DisplayName:{property}"].ResourceNotFound;
    }

    private static readonly Regex AttributeLine = new(
        @"^\s*\[(Required|StringLength|MaxLength|MinLength|Range|EmailAddress|Url|Phone|RegularExpression|Compare)\b",
        RegexOptions.Compiled);

    private static readonly Regex PropertyLine = new(
        @"^\s*public\s+[\w<>\?,\.\[\]\s]+?\s+(\w+)\s*\{\s*get",
        RegexOptions.Compiled);

    private static readonly Regex TypeLine = new(
        @"^\s*(?:public|internal)\s+(?:sealed\s+|abstract\s+|partial\s+)*(?:class|record)\s+(\w+)",
        RegexOptions.Compiled);

    private static IEnumerable<(string Container, string Property)> ValidatedProperties()
    {
        var srcRoot = FindSourceRoot();
        srcRoot.ShouldNotBeNull("Kaynak kökü bulunamadı — test çıktı dizini beklenmedik yerde.");

        var files = Directory.EnumerateFiles(srcRoot, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}")
                        && !f.Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}")
                        && !f.Contains($"{Path.DirectorySeparatorChar}Migrations{Path.DirectorySeparatorChar}"));

        foreach (var file in files)
        {
            var container = "?";
            var pending = false;

            foreach (var line in File.ReadLines(file))
            {
                var typeMatch = TypeLine.Match(line);
                if (typeMatch.Success)
                {
                    container = typeMatch.Groups[1].Value;
                }

                if (AttributeLine.IsMatch(line))
                {
                    pending = true;
                    continue;
                }

                var propertyMatch = PropertyLine.Match(line);
                if (propertyMatch.Success)
                {
                    if (pending)
                    {
                        yield return (container, propertyMatch.Groups[1].Value);
                    }

                    pending = false;
                    continue;
                }

                var trimmed = line.Trim();
                if (trimmed.Length == 0 || trimmed.StartsWith("//") || trimmed.StartsWith("["))
                {
                    continue;
                }

                pending = false;
            }
        }
    }

    private static string? FindSourceRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Application.Contracts");
            if (Directory.Exists(candidate))
            {
                return Path.Combine(dir.FullName, "src");
            }

            dir = dir.Parent;
        }

        return null;
    }
}
