using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ReleaseNotes;
using Apya.Platform.Tenants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Sürüm notu yayın kapısının HOST yüzü.
///
/// <para>Test host'u <c>AddAlwaysAllowAuthorization</c> kullanır ve kiracı bağlamı yoktur
/// → istek host olarak akar. Ayrıca tohumlayıcılar koştuğu için tablo geri doldurulmuş
/// (hepsi onaylı) gelir — yani burası tam olarak "özellik canlıya yeni indi" hâlidir.
/// Kapının kiracı tarafı (paket / seviye eleme) burada ölçülemez; o kural
/// <c>ReleaseNoteVisibility_Tests</c>'te sabitlenmiştir.</para>
/// </summary>
public class ReleaseNotesPublishing_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>
    /// Yönetim ekranı her madde için POST'a giden alanları basmalı. Gizli Version/ItemKey
    /// düşerse form sessizce boş kaydeder: hiçbir hata çıkmaz, hiçbir karar da yazılmaz.
    /// </summary>
    [Fact]
    public async Task Yonetim_ekrani_her_madde_icin_karar_alanlarini_basar()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Admin/ReleaseNotes"));

        var versions = doc.DocumentNode.SelectNodes("//input[@type='hidden' and contains(@name,'.Version')]");
        versions.ShouldNotBeNull("hiçbir madde satırı basılmadı");
        versions.Count.ShouldBeGreaterThan(0);

        foreach (var suffix in new[] { "IsApproved", "ShowInModal", "ShowInHistory", "Basic", "Enterprise" })
        {
            doc.DocumentNode
                .SelectNodes($"//input[@type='checkbox' and contains(@name,'.{suffix}')]")
                .ShouldNotBeNull($"'{suffix}' onay kutusu basılmadı");
        }

        // Seviye seçicisinin değerleri enum ADI olmalı — sayı verilirse hiçbir seçenek
        // seçili gelmez ve kayıt her seferinde "Herkes"e döner.
        var audience = doc.DocumentNode
            .SelectNodes("//select[contains(@name,'.Audience')]/option")
            .Select(o => o.GetAttributeValue("value", ""))
            .Distinct()
            .ToList();

        audience.ShouldBe(new[] { "Everyone", "TenantAdmins", "HostOnly" });
    }

    /// <summary>
    /// Onay kutusu POST'ta yalnız işaretliyken görünür; işaretsiz kutu hiç gönderilmez.
    /// Tag helper'ın ürettiği gizli "false" alanı düşerse, host bir kutuyu KALDIRAMAZ —
    /// kaydeder, değer eski hâlinde kalır.
    /// </summary>
    [Fact]
    public async Task Onay_kutularinin_gizli_false_alani_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Admin/ReleaseNotes"));

        doc.DocumentNode
            .SelectNodes("//input[@type='hidden' and contains(@name,'.IsApproved') and @value='false']")
            .ShouldNotBeNull("gizli 'false' alanı yok — kutular kaldırılamaz");
    }

    /// <summary>
    /// Geri doldurma tohumu, kapı devreye girmeden önce yayında olan maddeleri korumak
    /// içindir: tohumdan sonra katalogdaki HER madde onaylı bir karara sahip olmalı.
    /// Eksik kalan madde, özellik canlıya indiği an kullanıcının gözünden kaybolur.
    /// </summary>
    [Fact]
    public async Task Tohum_katalogdaki_her_maddeyi_onayli_geri_doldurur()
    {
        var repository = GetRequiredService<IRepository<ReleaseNotePublication, Guid>>();
        var rows = await repository.GetListAsync();

        var beklenen = ReleaseNoteCatalog.All.SelectMany(r => r.Items.Select(i => r.Version + "/" + i.Key)).ToList();
        var gelen = rows.Select(r => r.Version + "/" + r.ItemKey).ToHashSet();

        foreach (var key in beklenen)
        {
            gelen.ShouldContain(key, $"'{key}' için karar satırı tohumlanmadı");
        }

        rows.ShouldAllBe(r => r.IsApproved && r.ShowInModal && r.ShowInHistory,
            "tohum, o güne kadar yayında olan maddeleri kapatmamalı");
        rows.ShouldAllBe(r => r.Packages == "Basic,Standard,Premium,Enterprise");
    }

    /// <summary>
    /// Kaydetme yolunun tamamı: karar yazılır VE önbellek tazelenir. Önbellek
    /// geçersizleştirilmezse ekran kaydettiğini gösterir ama kullanıcıya giden liste
    /// eski kararla akmaya devam eder — sessiz ve en tehlikeli hata biçimi.
    /// </summary>
    [Fact]
    public async Task Kaydedilen_karar_geri_okundugunda_gecerlidir()
    {
        var service = GetRequiredService<IReleaseNotePublicationAppService>();

        var release = ReleaseNoteCatalog.Latest;
        var hedef = release.Items[0];

        await service.SaveAsync(new SaveReleaseNotePublicationsInput
        {
            Items =
            {
                new ReleaseNotePublicationInput
                {
                    Version = release.Version,
                    ItemKey = hedef.Key,
                    IsApproved = false,
                    ShowInModal = false,
                    ShowInHistory = true,
                    Packages = { PackageCode.Premium, PackageCode.Enterprise },
                    Audience = ReleaseNoteAudience.TenantAdmins
                }
            }
        });

        var okunan = (await service.GetForManagementAsync())
            .Single(r => r.Version == release.Version)
            .Items.Single(i => i.Key == hedef.Key);

        okunan.IsPending.ShouldBeFalse("karar satırı yazıldı, artık 'karar verilmedi' değil");
        okunan.IsApproved.ShouldBeFalse();
        okunan.ShowInModal.ShouldBeFalse();
        okunan.ShowInHistory.ShouldBeTrue();
        okunan.Audience.ShouldBe(ReleaseNoteAudience.TenantAdmins);
        okunan.Packages.ShouldBe(new[] { PackageCode.Premium, PackageCode.Enterprise });
    }

    /// <summary>
    /// Geçmiş sayfası kararları uygular ama katalogla arasına başka bir eleme koymaz:
    /// tohumlanmış (hepsi onaylı) bir kurulumda her madde basılmalı.
    /// </summary>
    [Fact]
    public async Task Gecmis_sayfasi_onayli_maddelerin_tamamini_basar()
    {
        var doc = Parse(await GetResponseAsStringAsync("/ReleaseNotes"));

        var rows = doc.DocumentNode.SelectNodes("//div[@class='apya-rn-row-title']");
        rows.ShouldNotBeNull();
        rows.Count.ShouldBe(ReleaseNoteCatalog.All.Sum(r => r.Items.Count));

        // Host'a yayın onayı bağlantısı basılır; kiracıda bu şerit hiç doğmaz.
        doc.DocumentNode
            .SelectSingleNode("//a[@href='/Admin/ReleaseNotes']")
            .ShouldNotBeNull("host'a yayın onayı bağlantısı basılmadı");
    }

    private static HtmlNodeCollection WithClass(HtmlDocument doc, string cssClass) =>
        doc.DocumentNode.SelectNodes(
            $"//input[contains(concat(' ', normalize-space(@class), ' '), ' {cssClass} ')]");

    /// <summary>
    /// "Hepsini onayla" / "Bu sürümün tümünü onayla" mantığı sayfa betiğindedir
    /// (<c>Pages/Admin/ReleaseNotes/Index.js</c>; davranışı <c>adminReleaseNotes.test.js</c>
    /// kilitler). Betik işaretlemedeki kancalara bağlanır: biri düşerse toplu kutular
    /// sessizce tepkisiz kalır. Toplu kutuların <c>name</c>'i OLMAMALI — olursa POST'a
    /// girer ve model bağlamaya sızar.
    /// </summary>
    [Fact]
    public async Task Toplu_onay_betiginin_kancalari_basilir()
    {
        var html = await GetResponseAsStringAsync("/Admin/ReleaseNotes");
        var doc = Parse(html);

        // Yol DÜZ metinle aranmaz: ABP demetleme betiğin adresine sürüm/minify eki ekliyor.
        System.Text.RegularExpressions.Regex.IsMatch(html, @"ReleaseNotes[./]Index[^""]*\.js")
            .ShouldBeTrue("Toplu onay betiği sayfaya bağlanmamış — 'Hepsini onayla' çalışmaz.");

        // Eski satır içi betik toplu kutuyu kaldırınca önceki onayları da siliyordu.
        html.ShouldNotContain("approves.forEach");

        var all = doc.DocumentNode.SelectNodes("//input[@id='rnSelectAll']");
        all.ShouldNotBeNull("'Hepsini onayla' kutusu basılmadı");
        all.Count.ShouldBe(1);
        all[0].GetAttributeValue("type", "").ShouldBe("checkbox");
        all[0].Attributes["name"].ShouldBeNull("'Hepsini onayla' kutusu POST'a girmemeli");

        var versionBoxes = WithClass(doc, "rn-select-version");
        versionBoxes.ShouldNotBeNull("sürüm kutuları basılmadı");
        versionBoxes.Select(b => b.GetAttributeValue("data-version", "")).ToList()
            .ShouldBe(ReleaseNoteCatalog.All.Select(r => r.Version).ToArray());
        versionBoxes.ShouldAllBe(b => b.Attributes["name"] == null, "sürüm kutusu POST'a girmemeli");

        var approves = WithClass(doc, "rn-approve");
        approves.ShouldNotBeNull("madde kutuları basılmadı");
        approves.Select(b => b.GetAttributeValue("data-version", "")).ToList()
            .ShouldBe(ReleaseNoteCatalog.All.SelectMany(r => r.Items.Select(_ => r.Version)).ToArray());
    }

    /// <summary>
    /// Betiğin "maddenin kendi kararı" kaynağı HTML'deki <c>checked</c> özniteliğidir
    /// (tarayıcının form geri yüklemesinden etkilenmeyen tek değer). Sunucu kararı bu
    /// öznitelikle basmazsa "hepsini onayla → geri al" yanlış duruma döner ve Kaydet'te
    /// istenmeyen onay / onay kaldırma yazılır.
    /// </summary>
    [Fact]
    public async Task Onayli_madde_kutusu_checked_ozniteligiyle_basilir()
    {
        // Tohum sonrası: katalogdaki her madde onaylı → her kutu checked.
        var once = WithClass(Parse(await GetResponseAsStringAsync("/Admin/ReleaseNotes")), "rn-approve");
        once.ShouldNotBeNull("madde kutuları basılmadı");
        once.ShouldAllBe(b => b.Attributes["checked"] != null, "onaylı madde checked özniteliği taşımıyor");

        var release = ReleaseNoteCatalog.Latest;
        var hedef = release.Items[0];

        await GetRequiredService<IReleaseNotePublicationAppService>().SaveAsync(new SaveReleaseNotePublicationsInput
        {
            Items =
            {
                new ReleaseNotePublicationInput
                {
                    Version = release.Version,
                    ItemKey = hedef.Key,
                    IsApproved = false,
                    ShowInModal = true,
                    ShowInHistory = true,
                    Packages = { PackageCode.Basic, PackageCode.Standard, PackageCode.Premium, PackageCode.Enterprise },
                    Audience = ReleaseNoteAudience.Everyone
                }
            }
        });

        var sonra = WithClass(Parse(await GetResponseAsStringAsync("/Admin/ReleaseNotes")), "rn-approve");
        var isaretsiz = sonra.Where(b => b.Attributes["checked"] == null).ToList();

        isaretsiz.Count.ShouldBe(1, "yalnız onayı kaldırılan madde checked'sız basılmalı");
        sonra.Count.ShouldBe(once.Count);

        // Kutu, aynı hücredeki gizli Version / ItemKey alanlarıyla eşleşir.
        var hucre = isaretsiz[0].ParentNode;
        hucre.SelectSingleNode(".//input[@type='hidden' and contains(@name,'.ItemKey')]")
            .GetAttributeValue("value", "").ShouldBe(hedef.Key);
        hucre.SelectSingleNode(".//input[@type='hidden' and contains(@name,'.Version')]")
            .GetAttributeValue("value", "").ShouldBe(release.Version);
    }
}
