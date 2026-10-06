using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev taslağı içe aktarma penceresi (PDF yükleme) — üç açık.
///
/// <para>1) Sayfa modelinde yetki işareti yoktu: OTURUMSUZ ziyaretçi formu (ve doğrulama jetonunu)
/// alabiliyordu. 2) Yükleme, yetkiyi denetleyen servis çağrısından ÖNCE diske yazılıyordu: servis
/// oturumsuz isteği reddediyor ama dosya çoktan yazılmış oluyordu. 3) Saklanan yol istemcinin
/// gönderdiği DOSYA ADINDAN kuruluyordu: adın içindeki <c>../</c> dosyayı yükleme klasörünün
/// dışına çıkarıyordu. Diğer bütün yükleme yolları ortak depoyu (<c>IUploadedFileStorage</c>:
/// rastgele ad, uzantı listesi, boyut sınırı) kullanır; bu sayfa onu atlıyordu.</para>
///
/// <para>Yükleme klasörü bütün test sınıflarının ortak malı: test kendi dosyasını İÇERİĞİNDEN
/// tanır ve klasöre yazan sınıflarla aynı koleksiyonda sırayla koşar.</para>
/// </summary>
[Collection("Yükleme klasörünü kullanan testler")]
public class DraftImportUploadSecurity_Tests : PlatformWebTestBase
{
    private const string PageUrl = "/Tasks/Drafts/ImportModal";

    /// <summary>
    /// Test barındırıcısı normalde HER isteğe "evet" der; oturumsuz istek bile <c>[Authorize]</c>'dan
    /// geçer ve bu sınıfın ölçtüğü şey hiç görülmez. Burada kural üretimdekinin kaba hâli:
    /// oturum açmış kullanıcıya evet, oturumsuza hayır.
    /// </summary>
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(
            sp => new SignedInOnlyAuthorizationService(sp, sp.GetRequiredService<ICurrentPrincipalAccessor>())));
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(
            sp => sp.GetRequiredService<IAbpAuthorizationService>()));
        // Uygulama servislerindeki [Authorize] ayrı bir kapıdan geçer; test barındırıcısı onu da
        // "hep evet"e çevirmiştir. Gerçeğini geri koy: servis oturumsuz çağrıyı REDDETSİN ki
        // "servis reddetti ama dosya çoktan yazıldı" durumu ölçülebilsin.
        services.Replace(ServiceDescriptor.Transient<IMethodInvocationAuthorizationService, MethodInvocationAuthorizationService>());
    }

    private sealed class SignedInOnlyAuthorizationService : IAbpAuthorizationService
    {
        private readonly ICurrentPrincipalAccessor _principalAccessor;

        public SignedInOnlyAuthorizationService(IServiceProvider serviceProvider, ICurrentPrincipalAccessor principalAccessor)
        {
            ServiceProvider = serviceProvider;
            _principalAccessor = principalAccessor;
        }

        public IServiceProvider ServiceProvider { get; }

        public ClaimsPrincipal CurrentPrincipal => _principalAccessor.Principal;

        // Karar, isteğin taşıdığı kullanıcıya (HttpContext.User) göre DEĞİL, testin "kim çağırıyor"
        // dediği kimliğe göre verilir: test sunucusunda kimlik doğrulama ara katmanı çalışmaz,
        // HttpContext.User hep kimliksizdir; kimi taklit ettiğimizi erişimci taşır.
        private AuthorizationResult Decide() =>
            _principalAccessor.Principal?.Identity?.IsAuthenticated == true
                ? AuthorizationResult.Success()
                : AuthorizationResult.Failed();

        public Task<AuthorizationResult> AuthorizeAsync(
            ClaimsPrincipal user, object? resource, IEnumerable<IAuthorizationRequirement> requirements)
            => Task.FromResult(Decide());

        public Task<AuthorizationResult> AuthorizeAsync(ClaimsPrincipal user, object? resource, string policyName)
            => Task.FromResult(Decide());
    }

    // İçerik koşuya özgü: diskteki dosyanın BU testin dosyası olduğu içerikten anlaşılır.
    private readonly byte[] _payload = Encoding.UTF8.GetBytes("%PDF-1.4 taslak içe aktarma denemesi " + Guid.NewGuid());

    private string RootFolder => GetRequiredService<IUploadedFileRootFolderProvider>().GetRootFolder();

    /// <summary>Verilen klasörde (alt klasörler HARİÇ) bu testin içeriğini taşıyan dosyalar.</summary>
    private List<string> PayloadFilesIn(string folder)
    {
        var found = new List<string>();
        foreach (var path in Directory.GetFiles(folder))
        {
            try
            {
                if (new FileInfo(path).Length == _payload.Length && File.ReadAllBytes(path).SequenceEqual(_payload))
                {
                    found.Add(path);
                }
            }
            catch (IOException)
            {
                // Dosya bu arada silindi ya da kilitli: bizim dosyamız değil.
            }
        }

        return found;
    }

    private void Cleanup(IEnumerable<string> paths)
    {
        foreach (var path in paths)
        {
            try { File.Delete(path); } catch (IOException) { }
        }
    }

    /// <summary>İsteği OTURUMSUZ atar (sahte principal boş kimlikle değiştirilir).</summary>
    private async Task AnonymousAsync(Func<HttpClient, Task> action)
    {
        Server.PreserveExecutionContext = true;
        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(new ClaimsPrincipal(new ClaimsIdentity())))
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
            await action(client);
        }
    }

    /// <summary>
    /// İsteği OTURUM AÇMIŞ host kullanıcısıyla atar. Tabanın hazır istemcisi kimlik taşımaz
    /// (barındırıcı normalde herkese "evet" dediği için gerekmez); bu sınıfın barındırıcısında
    /// kimliksiz istek reddedilir.
    /// </summary>
    private async Task SignedInAsync(Func<HttpClient, Task> action)
    {
        Server.PreserveExecutionContext = true;
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new Claim(AbpClaimTypes.UserName, "admin")
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        {
            using var client = CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
            await action(client);
        }
    }

    private static string? TokenIn(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc.DocumentNode
            .SelectSingleNode("//input[@name='__RequestVerificationToken']")
            ?.GetAttributeValue("value", null);
    }

    private async Task<HttpResponseMessage> PostPdfAsync(HttpClient client, string? token, string fileName)
    {
        using var content = new MultipartFormDataContent();
        var file = new ByteArrayContent(_payload);
        file.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        content.Add(file, "PdfInput.File", fileName);
        if (token != null)
        {
            content.Add(new StringContent(token), "__RequestVerificationToken");
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, PageUrl) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        if (token != null)
        {
            request.Headers.Add("RequestVerificationToken", token);
        }

        return await client.SendAsync(request);
    }

    [Fact]
    public async Task Oturumsuz_Ziyaretci_Ice_Aktarma_Formunu_Alamaz()
    {
        await AnonymousAsync(async client =>
        {
            var response = await client.GetAsync(PageUrl);
            var body = await response.Content.ReadAsStringAsync();

            response.StatusCode.ShouldNotBe(HttpStatusCode.OK, "oturumsuz istek yükleme formunu almamalı");
            body.ShouldNotContain("PdfInput", Case.Sensitive);
        });
    }

    [Fact]
    public async Task Oturumsuz_Yukleme_Diske_Dosya_Yazmaz()
    {
        await AnonymousAsync(async client =>
        {
            // Saldırganın yapacağı gibi: önce sayfayı iste (jeton + çerez verirse al), sonra dosyayı gönder.
            var page = await client.GetAsync(PageUrl);
            var token = TokenIn(await page.Content.ReadAsStringAsync());

            var response = await PostPdfAsync(client, token, "taslak.pdf");

            var written = PayloadFilesIn(RootFolder);
            try
            {
                response.IsSuccessStatusCode.ShouldBeFalse();
                written.ShouldBeEmpty("oturumsuz yükleme sunucu diskine dosya yazmamalı");
            }
            finally
            {
                Cleanup(written);
            }
        });
    }

    [Fact]
    public async Task Dosya_Adi_Dosyayi_Yukleme_Klasorunun_Disina_Cikaramaz()
    {
        var parent = Directory.GetParent(RootFolder)!.FullName;
        var escapeName = $"kacak-{Guid.NewGuid():N}.pdf";

        await SignedInAsync(async client =>
        {
            var page = await client.GetAsync(PageUrl);
            page.StatusCode.ShouldBe(HttpStatusCode.OK, "oturum açmış kullanıcı formu almalı");
            var token = TokenIn(await page.Content.ReadAsStringAsync());
            token.ShouldNotBeNull("formda doğrulama jetonu olmalı");

            using var response = await PostPdfAsync(client, token, $"x/../../{escapeName}");

            var outside = PayloadFilesIn(parent);
            var inside = PayloadFilesIn(RootFolder);
            try
            {
                File.Exists(Path.Combine(parent, escapeName))
                    .ShouldBeFalse("dosya adındaki ../ dosyayı yükleme klasörünün dışına çıkardı");
                outside.ShouldBeEmpty("yükleme klasörünün dışına dosya yazıldı");

                // Yükleme kabul edilir ve dosya klasörün İÇİNDE, sunucunun ürettiği adla durur.
                response.StatusCode.ShouldBe(HttpStatusCode.OK);
                inside.Count.ShouldBe(1);
                Path.GetFileName(inside[0]).ShouldNotContain("kacak-");
                Guid.TryParse(Path.GetFileNameWithoutExtension(inside[0]), out _)
                    .ShouldBeTrue("saklanan ad sunucuda üretilmiş olmalı: " + Path.GetFileName(inside[0]));
            }
            finally
            {
                Cleanup(outside);
                Cleanup(inside);
            }
        });
    }

    /// <summary>
    /// Servis metodu saklanan dosya YOLUNU çağırandan alır (sayfa, dosyayı kendisi yazdıktan sonra
    /// verir). Bu metot otomatik API ucu olarak da açıktı: uzaktan çağıran, sunucudaki herhangi bir
    /// yolu "işlenecek dosya" diye verebiliyordu. Yalnız süreç içinden çağrılmalı.
    /// </summary>
    [Fact]
    public void Yukleme_Servisi_Uzaktan_Cagrilamaz()
    {
        var exposed = GetRequiredService<IApiDescriptionGroupCollectionProvider>()
            .ApiDescriptionGroups.Items
            .SelectMany(g => g.Items)
            .Where(d => (d.RelativePath ?? string.Empty).Contains("upload-pdf-for-extraction", StringComparison.OrdinalIgnoreCase))
            .Select(d => $"{d.HttpMethod} /{d.RelativePath}")
            .ToList();

        exposed.ShouldBeEmpty("dosya yolunu çağırandan alan metot API ucu olarak açık: " + string.Join(", ", exposed));
    }
}
