using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Uygulamanın kendi uçlarının yetki sözleşmesi — sayfa modelleri dışındaki katmanlar
/// (<see cref="PageModelAuthorization_Tests"/> sayfaları ölçer).
///
/// <para>Uygulamada "işaret yoksa oturum şart" diyen genel bir kural yok; her uç kendi işaretini
/// taşır. Burada ölçülen, ÇALIŞAN uygulamanın uç tablosudur (kaynak dosya değil): denetleyiciler,
/// uygulama servislerinden üretilen API uçları, SignalR merkezleri ve doğrudan eşlenen uçlar.</para>
///
/// <para>🔴 Ayrıca: <c>[RemoteService(IsEnabled = false)]</c> ile işaretli METOT uç değildir. ABP bu
/// işareti görünce yalnız API rotasını kaldırıyor, eylemi bırakıyordu; eylem genel
/// <c>{controller}/{action}</c> rotasından çağrılabiliyordu. Saklanan dosyanın sunucudaki yolunu
/// çağırandan alan metot (<c>/DraftTask/UploadPdfForExtraction</c>) böyle açıktı.</para>
/// </summary>
public class EndpointAuthorization_Tests : PlatformWebTestBase
{
    private List<RouteEndpoint> Endpoints() =>
        GetRequiredService<IEnumerable<EndpointDataSource>>()
            .SelectMany(source => source.Endpoints)
            .OfType<RouteEndpoint>()
            .ToList();

    private static bool IsOurs(Assembly assembly) =>
        assembly.GetName().Name?.StartsWith("Apya.Platform", StringComparison.Ordinal) == true;

    private static bool IsRemoteDisabled(MethodInfo method) =>
        method.GetCustomAttributes<RemoteServiceAttribute>(inherit: true).Any(a => !a.IsEnabled);

    private static string Name(ControllerActionDescriptor action) =>
        $"{action.ControllerTypeInfo.Name}.{action.MethodInfo.Name}";

    private List<(RouteEndpoint Endpoint, ControllerActionDescriptor Action)> OurActions() =>
        Endpoints()
            .Select(e => (Endpoint: e, Action: e.Metadata.GetMetadata<ControllerActionDescriptor>()))
            .Where(x => x.Action != null && IsOurs(x.Action.ControllerTypeInfo.Assembly))
            .Select(x => (x.Endpoint, x.Action!))
            .ToList();

    // ── "Uzaktan kapalı" metot uç değildir ────────────────────────────────────

    [Fact]
    public void Uzaktan_Kapatilan_Metot_Uc_Tablosunda_Yoktur()
    {
        // Ölçülecek bir şey var mı? Bugün üç metot böyle işaretli; hiç kalmazsa test boşa döner.
        var marked = AppDomain.CurrentDomain.GetAssemblies()
            .Where(IsOurs)
            .SelectMany(a => a.GetTypes())
            .Where(t => t.IsClass && !t.IsAbstract && typeof(IRemoteService).IsAssignableFrom(t))
            .SelectMany(t => t.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            .Count(IsRemoteDisabled);
        marked.ShouldBeGreaterThan(0, "uzaktan kapalı işaretli metot kalmamış; bu test artık bir şey ölçmüyor");

        var exposed = OurActions()
            .Where(x => IsRemoteDisabled(x.Action.MethodInfo))
            .Select(x => $"{Name(x.Action)}  →  /{x.Action.ControllerName}/{x.Action.ActionName}")
            .Distinct()
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();

        exposed.ShouldBeEmpty(
            "Şu metotlar 'uzaktan kapalı' işaretli ama uç tablosunda duruyor (genel rotadan çağrılabilir):\n" +
            string.Join("\n", exposed));
    }

    [Fact]
    public async Task Genel_Rota_Uzaktan_Kapali_Metodu_Calistirmaz()
    {
        // Oturumsuz sayaç metodu: eskiden 204 dönüyordu (çalışıyordu).
        var counter = await Client.GetAsync($"/GrantFunnel/RecordPublicView?callId={Guid.NewGuid()}");
        counter.IsSuccessStatusCode.ShouldBeFalse("uzaktan kapalı sayaç metodu genel rotadan çalıştı");

        // Dosya YOLUNU çağırandan alan metot: eskiden 200 ile iş kimliği dönüyordu.
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Admin/Billing"));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']")!
            .GetAttributeValue("value", "");

        var json = "{\"fileName\":\"deneme.pdf\",\"fileBytes\":\""
                   + Convert.ToBase64String(Encoding.ASCII.GetBytes("%PDF-1.4 deneme"))
                   + "\",\"storedFileName\":\"\",\"storedFilePath\":\"C:\\\\Windows\\\\win.ini\"}";
        using var request = new HttpRequestMessage(HttpMethod.Post, "/DraftTask/UploadPdfForExtraction")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Add("RequestVerificationToken", token);
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");

        var upload = await Client.SendAsync(request);
        var body = await upload.Content.ReadAsStringAsync();

        upload.IsSuccessStatusCode.ShouldBeFalse("uzaktan kapalı yükleme metodu genel rotadan çalıştı: " + body);
        Guid.TryParse(body.Trim('"'), out _).ShouldBeFalse("yanıt bir iş kimliği: metot çalışmış");
    }

    /// <summary>
    /// Sayfaların sunucu içinden kullandığı oturumsuz metotlar API ucu olarak da açıktı; tarayıcı
    /// onları hiç çağırmıyordu. Ne API adresinden ne genel rotadan çağrılabilirler. (Paylaşım
    /// uçları geçersiz anahtarda zaten "bulunamadı" döndüğü için durum koduyla ayırt edilemez;
    /// onları yukarıdaki uç tablosu listesi ölçer. Burada her zaman 200 dönen uç ölçülür.)
    /// </summary>
    [Theory]
    [InlineData("/api/app/login-screen-settings")]
    [InlineData("/LoginScreenSettings/Get")]
    public async Task Sunucu_Ici_Oturumsuz_Metotlar_Uc_Degildir(string url)
    {
        var response = await Client.GetAsync(url);

        response.IsSuccessStatusCode.ShouldBeFalse($"{url} hâlâ bir uç");
    }

    // ── Her eylem ucu karar taşır ─────────────────────────────────────────────

    [Fact]
    public void Uygulamanin_Her_Eylem_Ucu_Yetki_Karari_Tasir()
    {
        var actions = OurActions();
        // Tarama bozulursa test SESSİZCE geçmemeli.
        actions.Count.ShouldBeGreaterThan(500, "beklenenden az eylem ucu bulundu");

        var undecided = actions
            .Where(x => !x.Endpoint.Metadata.GetOrderedMetadata<IAuthorizeData>().Any()
                        && x.Endpoint.Metadata.GetMetadata<IAllowAnonymous>() == null)
            .Select(x => $"{Name(x.Action)}  →  {x.Endpoint.RoutePattern.RawText}")
            .Distinct()
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();

        undecided.ShouldBeEmpty(
            "Şu uçlarda yetki işareti yok. [Authorize] ekleyin; gerçekten herkese açıksa [AllowAnonymous] " +
            "yazıp aşağıdaki listeye ekleyin:\n" + string.Join("\n", undecided));
    }

    /// <summary>
    /// Oturumsuz çağrılabilen eylemler SAYILIDIR (sınıfta <c>[Authorize]</c> olsa bile metottaki
    /// <c>[AllowAnonymous]</c> kazanır). Bir ucu herkese açmak bu listeye dokunmadan yapılamaz.
    /// </summary>
    [Fact]
    public void Oturumsuz_Cagrilabilen_Eylemler_Bilinen_Listeden_Ibaret()
    {
        var open = OurActions()
            .Where(x => x.Endpoint.Metadata.GetMetadata<IAllowAnonymous>() != null)
            .Select(x => Name(x.Action))
            .Distinct()
            .OrderBy(n => n, StringComparer.Ordinal)
            .ToList();

        open.ShouldBe(KnownAnonymousActions.OrderBy(n => n, StringComparer.Ordinal).ToList(), ignoreOrder: false);
    }

    // Yalnız TARAYICININ doğrudan çağırdığı uçlar. Bağlantıyla paylaşım (görev, teslim paketi),
    // takvim beslemesinin üretimi ve giriş ekranı ayarı oturumsuz ÇALIŞIR ama uç DEĞİLDİR: onları
    // sayfalar sunucu içinden çağırır (metotlar "uzaktan kapalı"). API ucu olarak açıkken misafir
    // yükleme kaydı saklanan dosya ADINI, yorum/indirme ise iz kaydına yazılacak IP ve tarayıcı
    // bilgisini çağırandan alıyordu.
    private static readonly string[] KnownAnonymousActions =
    {
        // Çerez bildirimi (oturum açmadan önce)
        "ConsentController.AckCookieNoticeAsync",
        // Herkese açık form: görüntüleme ve gönderme
        "PublicDocumentAppService.GetBySlugAsync",
        "PublicDocumentAppService.GetBlockChoicesAsync",
        "ResponseAppService.SubmitAsync",
        // Takvim beslemesi — anahtar adresin kendisinde
        "IcalController.GetAsync"
    };

    // ── SignalR merkezleri ────────────────────────────────────────────────────

    [Fact]
    public void Her_SignalR_Merkezi_Oturum_Ister()
    {
        var hubs = Endpoints()
            .Select(e => (Endpoint: e, Hub: e.Metadata.GetMetadata<HubMetadata>()))
            .Where(x => x.Hub != null)
            .ToList();
        hubs.Select(x => x.Hub!.HubType).Distinct().Count().ShouldBeGreaterThan(3, "beklenenden az merkez bulundu");

        var open = hubs
            .Where(x => !x.Endpoint.Metadata.GetOrderedMetadata<IAuthorizeData>().Any())
            .Select(x => $"{x.Hub!.HubType.Name}  →  {x.Endpoint.RoutePattern.RawText}")
            .ToList();

        open.ShouldBeEmpty("Şu merkez uçları oturum istemiyor:\n" + string.Join("\n", open));
    }

    // ── Doğrudan eşlenen uçlar ────────────────────────────────────────────────

    /// <summary>
    /// Denetleyici, sayfa ya da merkez OLMAYAN uçlar (<c>app.MapPost(…)</c> gibi) sayılıdır: yenisi
    /// eklenince kararı (yetki / bilerek açık) burada yazılır. Statik dosya uçları (adında uzantı
    /// olanlar) kapsam dışıdır.
    /// </summary>
    [Fact]
    public void Dogrudan_Eslenen_Uclar_Bilinen_Listeden_Ibaret()
    {
        var mapped = Endpoints()
            .Where(e => e.Metadata.GetMetadata<ControllerActionDescriptor>() == null
                        && e.Metadata.GetMetadata<PageActionDescriptor>() == null
                        && e.Metadata.GetMetadata<HubMetadata>() == null)
            .Select(e => e.RoutePattern.RawText ?? string.Empty)
            .Where(pattern => !pattern.Contains('.'))
            .Distinct()
            .OrderBy(p => p, StringComparer.Ordinal)
            .ToList();

        mapped.ShouldBe(KnownMappedEndpoints.OrderBy(p => p, StringComparer.Ordinal).ToList(), ignoreOrder: false);
    }

    private static readonly string[] KnownMappedEndpoints =
    {
        // Tarayıcının güvenlik ihlali raporu: çerezsiz gönderilir, bilerek açık
        "/csp-violations",
        // Barındırma ortamının canlılık yoklaması
        "/health/live",
        "/health/ready",
        // Çerçevenin genel rotaları (eylemleri yukarıdaki testler ölçer) ve statik dosya yedeği
        "{area}/{controller=Home}/{action=Index}/{id?}",
        "{controller=Home}/{action=Index}/{id?}",
        "{**path:file}"
    };
}
