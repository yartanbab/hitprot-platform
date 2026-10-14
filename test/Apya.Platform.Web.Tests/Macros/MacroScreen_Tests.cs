using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Macros;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran (/Makro): görünürlük, sıralama ve katalog sözleşmesi.
///
/// <para>Görünürlüğün iki kaynağı var ve ikisi de makroya özgü değil: menüye bağlı bağlantıda menü
/// ağacı, adresli makroda katalogdaki izin. Testler gerçek barındırıcının çözücüsünü kullanır; yalnız
/// izin denetleyicisi, testin o an verdiği izinlere "evet" diyen bir sahteyle değiştirilir.</para>
/// </summary>
public class MacroScreen_Tests : PlatformWebTestBase
{
    private readonly GrantedPermissionChecker _permissions = new();

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        services.Replace(ServiceDescriptor.Singleton<IPermissionChecker>(_permissions));
    }

    private async Task<List<string>> VisibleKeysWithAsync(params string[] permissions)
    {
        _permissions.Granted = new HashSet<string>(permissions, StringComparer.Ordinal);

        // Menü çözücü istek başına yaşar ve sonucunu saklar; her ölçüm kendi kapsamında.
        using var scope = ServiceProvider.CreateScope();
        var items = await scope.ServiceProvider.GetRequiredService<MacroLauncher>().GetVisibleAsync();
        return items.Select(item => item.Key).ToList();
    }

    [Fact]
    public async Task Pencere_makrosu_yalniz_izni_olana_gorunur()
    {
        (await VisibleKeysWithAsync(PlatformPermissions.Tasks.Create)).ShouldBe(new[] { "TaskCreate" });
        (await VisibleKeysWithAsync(PlatformPermissions.Expenses.Create))
            .ShouldBe(new[] { "ExpenseCapture", "ExpenseCreate" });
    }

    /// <summary>Menüye bağlı makro görünürlüğü menü ağacından alır: ikinci bir izin kaynağı yok.</summary>
    [Fact]
    public async Task Menuye_bagli_makro_menu_ogesiyle_birlikte_gorunur()
    {
        // Panolar = Tasks.Default; görev OLUŞTURMA izni yok → "Görev aç" görünmez.
        (await VisibleKeysWithAsync(PlatformPermissions.Tasks.Default)).ShouldBe(new[] { "Boards" });
        (await VisibleKeysWithAsync()).ShouldBeEmpty();
    }

    [Fact]
    public async Task Host_baglaminda_kiraci_menusu_makrosu_basilmaz()
    {
        var keys = await VisibleKeysWithAsync(PlatformPermissions.Grants.Default, PlatformPermissions.Grants.Edit);

        // Web testleri host bağlamında koşar: "Başvurularım" yalnız kiracı menüsünde.
        keys.ShouldContain("GrantsRequests");
        keys.ShouldNotContain("GrantsMyApplications");
    }

    [Fact]
    public void Sabitlenenler_once_sabitlenme_sirasiyla_gerisi_katalog_sirasiyla()
    {
        var items = MacroCatalog.All
            .Select((definition, index) => new MacroItem(definition, index, definition.Key, "/x", "fa fa-x", "alan"))
            .ToList();

        var ordered = MacroLauncher.Order(items, new[]
        {
            MacroDefinition.PinPrefix + "IncomeCreate",
            "Apya.Bilinmeyen.Oge",     // izin değişmiş / menüden kalkmış — sessizce atlanır
            "Apya.Work.Boards"
        });

        ordered.Select(item => item.Key).Take(3).ShouldBe(new[] { "IncomeCreate", "Boards", "TaskCreate" });
        ordered.Count(item => item.IsPinned).ShouldBe(2);
        ordered.Count.ShouldBe(MacroCatalog.All.Count);
    }

    /// <summary>
    /// Sabitlenmeyenler son 30 günlük kullanıma göre çoktan aza dizilir; eşitlikte katalog sırası
    /// korunur. Sabitlenen, kullanımı az olsa da önde kalır.
    /// </summary>
    [Fact]
    public void Sabitlenmeyenler_kullanima_gore_dizilir_esitlikte_katalog_sirasi()
    {
        var items = MacroCatalog.All
            .Select((definition, index) => new MacroItem(definition, index, definition.Key, "/x", "fa fa-x", "alan"))
            .ToList();

        var ordered = MacroLauncher.Order(items,
            new[] { "Apya.Work.Boards" },
            new Dictionary<string, int> { ["InvoiceCreate"] = 9, ["IncomeCreate"] = 4, ["ExpenseCreate"] = 4, ["Boards"] = 1 });

        ordered.Select(item => item.Key).Take(5)
            .ShouldBe(new[] { "Boards", "InvoiceCreate", "ExpenseCreate", "IncomeCreate", "TaskCreate" });
        ordered.Single(item => item.Key == "InvoiceCreate").UsageCount.ShouldBe(9);
        ordered.Single(item => item.Key == "TaskCreate").UsageCount.ShouldBe(0);
    }

    /// <summary>
    /// İğne adı kenar çubuğuyla ORTAK ayarda durur: virgül listeyi böler, alt çizgi LeptonX'in
    /// <c>MenuItem_*</c> kimliğiyle karışır, aynı ad iki makroda olursa biri öbürünün iğnesini taşır.
    /// </summary>
    [Fact]
    public void Katalog_sozlesmesi_tutarli()
    {
        MacroCatalog.All.Select(d => d.Key).ShouldBeUnique();
        MacroCatalog.All.Select(d => d.PinName).ShouldBeUnique();

        foreach (var definition in MacroCatalog.All)
        {
            definition.Key.ShouldMatch("^[A-Z][A-Za-z]+$");
            definition.PinName.ShouldStartWith("Apya.");
            definition.PinName.ShouldNotContain("_");
            definition.PinName.ShouldNotContain(",");

            if (definition.MenuName != null)
            {
                definition.Url.ShouldBeNull(definition.Key);
                definition.Permission.ShouldBeNull(definition.Key);
                definition.Kind.ShouldBe(MacroKind.Link, definition.Key);
            }
            else
            {
                definition.Url.ShouldNotBeNull(definition.Key).ShouldStartWith("/");
                definition.Permission.ShouldNotBeNullOrWhiteSpace(definition.Key);
                definition.TitleKey.ShouldNotBeNullOrWhiteSpace(definition.Key);
                definition.Icon.ShouldNotBeNullOrWhiteSpace(definition.Key);
            }
        }
    }

    /// <summary>
    /// Menüye bağlı makronun adı menü ağacında olmalı. Host ve kiracı ağaçları ayrı olduğu için
    /// (ör. "Başvurularım" yalnız kiracıda) ad, ağacın kurulduğu kaynakta aranır.
    /// </summary>
    [Fact]
    public void Menuye_bagli_makrolarin_adi_menu_agacinda_var()
    {
        var source = File.ReadAllText(Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Menus", "PlatformNavigationResolver.cs"));

        foreach (var definition in MacroCatalog.All.Where(d => d.MenuName != null))
        {
            // Çağrı satır kırılarak da yazılıyor: new ApplicationMenuItem(\n "Apya.Work.Boards", …
            Regex.IsMatch(source, @"new ApplicationMenuItem\(\s*""" + Regex.Escape(definition.MenuName!) + @"""")
                .ShouldBeTrue($"{definition.Key} → {definition.MenuName} menü ağacında yok");
        }
    }

    [Theory]
    [InlineData("tr.json")]
    [InlineData("en.json")]
    public void Katalog_metinleri_yerellestirilmis(string file)
    {
        var path = Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Domain.Shared", "Localization", "Platform", file);
        using var json = JsonDocument.Parse(File.ReadAllText(path));
        var texts = json.RootElement.GetProperty("texts");

        foreach (var key in MacroCatalog.All.SelectMany(d => new[] { d.TitleKey, d.AreaKey }).OfType<string>().Distinct())
        {
            texts.TryGetProperty(key, out _).ShouldBeTrue($"{file}: '{key}' yok");
        }
    }

    /// <summary>Yalnız <see cref="Granted"/> kümesindeki izinlere "evet" diyen izin denetleyicisi.</summary>
    private sealed class GrantedPermissionChecker : IPermissionChecker
    {
        public HashSet<string> Granted { get; set; } = new(StringComparer.Ordinal);

        public Task<bool> IsGrantedAsync(string name) => Task.FromResult(Granted.Contains(name));

        public Task<bool> IsGrantedAsync(ClaimsPrincipal? claimsPrincipal, string name) => IsGrantedAsync(name);

        public Task<MultiplePermissionGrantResult> IsGrantedAsync(string[] names)
        {
            var result = new MultiplePermissionGrantResult();
            foreach (var name in names)
            {
                result.Result[name] = Granted.Contains(name) ? PermissionGrantResult.Granted : PermissionGrantResult.Undefined;
            }

            return Task.FromResult(result);
        }

        public Task<MultiplePermissionGrantResult> IsGrantedAsync(ClaimsPrincipal? claimsPrincipal, string[] names)
            => IsGrantedAsync(names);
    }
}

/// <summary>
/// /Makro sayfasının gerçek render'ı. Test barındırıcısı her izni verir (AlwaysAllow) ve host
/// bağlamında koşar.
/// </summary>
public class MacroPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Sayfa_acilir_kartlari_ve_menu_girisini_basar()
    {
        var html = await GetResponseAsStringAsync("/Makro");

        html.ShouldContain("id=\"ApyaMacros\"");
        html.ShouldContain("data-macro-key=\"TaskCreate\"");
        html.ShouldContain("data-modal-url=\"/Tasks/CreateModal\"");
        html.ShouldContain("data-macro-key=\"GrantsRequests\"");
        html.ShouldContain("MenuItem_Apya_Macros");
        // Sayfa betiği/stili demetlenip özetli adla basılır.
        Regex.IsMatch(html, @"Macros[^""]*\.js").ShouldBeTrue("sayfa demeti Index.js içermeli");
        Regex.IsMatch(html, @"Macros[^""]*\.css").ShouldBeTrue("sayfa demeti Index.css içermeli");
    }

    /// <summary>
    /// İğne listesi istemciye BÜTÜN olarak gider (sunucuya da bütün yazılır). JSON &lt;script&gt;
    /// bloğuna basılıyor: içerik bloğu erken kapatamamalı.
    /// </summary>
    [Fact]
    public async Task Igne_listesi_gomulu_ve_guvenli()
    {
        var html = await GetResponseAsStringAsync("/Makro");

        var start = html.IndexOf("id=\"apya-macro-pins\">", StringComparison.Ordinal);
        start.ShouldBeGreaterThan(0);
        start += "id=\"apya-macro-pins\">".Length;
        var json = html.Substring(start, html.IndexOf("</script>", start, StringComparison.Ordinal) - start);

        using var doc = JsonDocument.Parse(json);
        doc.RootElement.GetProperty("pins").ValueKind.ShouldBe(JsonValueKind.Array);
        doc.RootElement.GetProperty("max").GetInt32().ShouldBeGreaterThan(0);
    }

    private const string EditButton = "class=\"btn btn-sm btn-outline-secondary apya-macros-edit\"";

    /// <summary>Boş durum (3a): kullanım verisi yokken boş kutu değil, başlangıç seti basılır.</summary>
    [Fact]
    public async Task Kullanimi_olmayana_baslangic_seti_basilir()
    {
        var html = await GetResponseAsStringAsync("/Makro");

        html.ShouldContain("apya-macros is-starter");
        html.ShouldContain("class=\"apya-macros-starter\"");
        // Düzenle düğmesi bilgi kutusuna taşınır, bölüm başlığında ikinci kopyası olmaz.
        Regex.Matches(html, Regex.Escape(EditButton)).Count.ShouldBe(1);
    }

    /// <summary>Güncelleme rozeti: kullanıcının okunmamış görev bildirimi "Panolar" kartında sayılır.</summary>
    [Fact]
    public async Task Okunmamis_bildirim_kartta_rozet_olarak_basilir()
    {
        var userId = Guid.NewGuid();
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var notifications = GetRequiredService<IRepository<Notification, Guid>>();
            for (var i = 0; i < 2; i++)
            {
                await notifications.InsertAsync(new Notification(Guid.NewGuid(), null, userId,
                    NotificationType.TaskAssigned, "Atandı", "Gövde", entityType: "Task", entityId: Guid.NewGuid()));
            }

            await uow.CompleteAsync();
        }

        Server.PreserveExecutionContext = true;
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "admin")
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        {
            using var client = CreateClient();
            var html = await client.GetStringAsync("/Makro");

            var boards = Regex.Match(html, "data-macro-key=\"Boards\"[\\s\\S]*?</a>").Value;
            boards.ShouldContain("class=\"apya-macro-card-badge\" aria-hidden=\"true\">2<");
            Regex.Matches(html, "apya-macro-card-badge").Count.ShouldBe(1);
        }
    }

    [Fact]
    public async Task Kullanim_birikince_baslangic_seti_kalkar()
    {
        var userId = Guid.NewGuid();
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            await GetRequiredService<MacroUsageManager>().RecordAsync(userId, "TaskCreate", GetRequiredService<IClock>().Now);
            await uow.CompleteAsync();
        }

        Server.PreserveExecutionContext = true;
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, userId.ToString()),
            new Claim(AbpClaimTypes.UserName, "admin")
        }, "Test"));

        using (GetRequiredService<ICurrentPrincipalAccessor>().Change(principal))
        {
            using var client = CreateClient();
            var html = await client.GetStringAsync("/Makro");

            html.ShouldNotContain("is-starter");
            html.ShouldNotContain("class=\"apya-macros-starter\"");
            Regex.Matches(html, Regex.Escape(EditButton)).Count.ShouldBe(1);
        }
    }
}
