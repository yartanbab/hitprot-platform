using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Liste ekranlarının YÜKLEME HATASI sözleşmesi (FIN-14, ADM-16, TSK-11, RES-06 — Faz 4 G2a).
///
/// <para>DataTables tabloları ortak sarmalayıcıdan (apya-latest.js createAjax + apya-load-state.js
/// failTable) geçer; o yardımcılar <c>apyaLatest.test.js</c> ve <c>apyaLoadState.test.js</c>'te
/// davranışsal test ediliyor. Sayfa betikleri $(fn), ModalManager ve ABP proxy'leri kullandığı için
/// vitest'te koşulamıyor; sayfaya düşen kısım kaynaktan kilitlenir.</para>
///
/// <para>Bozulma ekranda hata vermez: draw işleyicisi hata yanıtını başarı sanarsa hata kartının
/// yerine "Henüz görev yok" + "Yeni Görev" ve "0 görev" sayacı basılır; elle yazılmış ajax
/// fonksiyonu geri gelirse ret DataTables'a hiç ulaşmaz, tablo "İşleniyor…"da kalır.</para>
/// </summary>
public class ListLoadFailureScripts_Tests
{
    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        // Çalışma ağacı CRLF (autocrlf); eşleşmeler LF üzerinden yapılır.
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }

    private static string Web(params string[] relative) =>
        ReadSource(new[] { "src", "Apya.Platform.Web" }.Concat(relative).ToArray());

    /// <summary>Başlangıçtan bir sonraki bitişe kadar olan metin (işleyici gövdesi yaklaşımı).</summary>
    private static string Between(string source, string start, string end)
    {
        var from = source.IndexOf(start, StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{start}' bulunamadı.");
        var to = source.IndexOf(end, from + start.Length, StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{start}' sonrasında '{end}' bulunamadı.");
        return source.Substring(from, to - from);
    }

    private static void ShouldAppearInOrder(string text, params string[] parts)
    {
        var at = 0;
        foreach (var part in parts)
        {
            var next = text.IndexOf(part, at, StringComparison.Ordinal);
            next.ShouldBeGreaterThanOrEqualTo(0, $"'{part}' beklenen sırada bulunamadı.");
            at = next + part.Length;
        }
    }

    private static int Count(string text, string part) =>
        Regex.Matches(text, Regex.Escape(part)).Count;

    // ─────────────────────────── DataTables: sayfa draw işleyicileri ───────────────────────────

    [Theory]
    [InlineData("Tasks", "index.js")]
    [InlineData("Projects", "ProjectDetails.js")]
    public void Gorev_tablosu_yukleme_hatasini_bos_liste_saymaz(string folder, string file)
    {
        var script = Web("Pages", folder, file);

        var draw = Between(script, "dataTable.on('draw', function () {", "hierarchy.restore();");
        ShouldAppearInOrder(draw,
            "var failed = apya.loadState.tableFailed(dataTable);",
            "$('#console-task-count').text(failed ? '—'",
            "if (!failed)",
            "renderEmptyState(");
        Count(draw, "renderEmptyState(").ShouldBe(1, "boş durum yalnız başarılı yanıtta basılmalı");
    }

    /// <summary>
    /// Kart başlığı sayfaya özgü (PD5): görev tablosu "Görevler yüklenemedi." der — aynı sayfanın kanban,
    /// gantt, takvim ve pano görünümleri gibi. failTable başlığı tablonun data-load-failed özniteliğinden
    /// okur (davranışı apyaLoadState.test.js'te); öznitelik düşerse genel "Liste yüklenemedi." görünür.
    /// </summary>
    [Theory]
    [InlineData("Tasks", "Index.cshtml", "TasksTable")]
    [InlineData("Projects", "ProjectDetails.cshtml", "ProjectTasksTable")]
    public void Gorev_tablosu_hata_karti_basligi_sayfaya_ozgu(string folder, string file, string tableId)
    {
        Web("Pages", folder, file).ShouldContain(
            $"<abp-table class=\"apya-clean-table\" id=\"{tableId}\" data-load-failed=\"@L[\"Tasks:View:LoadFailed\"]\"></abp-table>");

        Between(Web("wwwroot", "js", "apya-load-state.js"), "function hookTable(", "function failTable(")
            .ShouldContain("settings.nTable.getAttribute('data-load-failed') || text('Common:ListLoadFailed', 'Liste yüklenemedi.')");
    }

    // ─────────────────────────── ADM-16: AiCenter elle yazılmış ajax ───────────────────────────

    /// <summary>
    /// Elle yazılmış <c>ajax: function (data, callback)</c> reddi DataTables'a hiç iletmiyordu
    /// ("İşleniyor…" kalıcı) ve bayat yanıtı süzmüyordu. createAjax ile ikisi de ortak sarmalayıcıdan gelir.
    /// </summary>
    [Theory]
    [InlineData("Providers")]
    [InlineData("Bindings")]
    [InlineData("PromptCategories")]
    public void AiCenter_tablolari_ortak_createAjax_sarmalayicisindan_gecer(string folder)
    {
        var script = Web("Pages", "AiCenter", folder, "Index.js");

        script.ShouldNotContain("ajax: function (data, callback)");
        script.ShouldContain(
            "ajax: abp.libs.datatables.createAjax(function () { return service.getList(); }, null, function (result) {\n" +
            "                return { data: result };\n" +
            "            }),");
    }

    // ─────────────────────────── Ortak sarmalayıcı ───────────────────────────

    /// <summary>
    /// Hata dalı Faz 3'ün GLOBAL sarmalayıcısında kurulur (bayat ret aynı biletle yutulur) ve WP6 canlı
    /// geçidi korunur: küçültülmüş demette de <c>createAjax.toString()</c> <c>apya.latest()</c> taşır.
    /// Yükleme isteği ABP'nin engelleyici penceresini açmaz (karar 2) — iptal kipinde ABP aynen kalır.
    /// </summary>
    [Fact]
    public void Ortak_sarmalayici_hata_dalini_ve_sessiz_yuklemeyi_tasir()
    {
        var latest = Web("wwwroot", "js", "apya-latest.js");

        var wrapper = Between(latest, "dt.createAjax = function (", "\n    }\n})();");
        ShouldAppearInOrder(wrapper,
            "if (cancelPreviousRequest) { return createAjax.apply(this, arguments); }",
            "var promise = quietly(serverMethod, this, arguments);",
            "if (request.isLatest() && loadState && loadState.failTable)",
            "loadState.failTable(request.settings, request.callback, error);",
            "return promise;",
            "var next = apya.latest();");

        Between(latest, "function quietly(", "\n    }\n").ShouldContain("{ abpHandleError: false }");

        var loadState = Web("wwwroot", "js", "apya-load-state.js");
        loadState.ShouldContain("failTable: failTable");
        loadState.ShouldContain("tableFailed: tableFailed");
    }

    // ─────────────────────────── PRJ-04, RES-05: Projeler ───────────────────────────

    /// <summary>
    /// Projeler iskeletle açılır; "Henüz proje yok" + şablon kartları yalnız başarılı ve gerçekten boş
    /// yanıtta basılır, KPI'lar liste gelene kadar "—". Liste hiç gelmeden yükleme düşerse ızgaranın
    /// DIŞINDAKİ kutuya kart + Tekrar dene (reload); devam sayfası düşerse eldeki liste korunur.
    /// </summary>
    [Fact]
    public void Projeler_yuklenirken_ve_hatada_bos_durum_ve_sifir_KPI_basmaz()
    {
        var script = Web("Pages", "Projects", "Index.js");

        ShouldAppearInOrder(Between(script, "var state = {", "};"), "loading: true,", "loadFailed: false,");

        var kpis = Between(script, "function renderKpis() {", "function renderFilters()");
        ShouldAppearInOrder(kpis,
            "if (!all.length && (state.loading || state.loadFailed)) {",
            "$('#KpiActiveProjects, #KpiTotalBudget, #KpiAvgProgress, #KpiAtRisk').text('—');",
            "} else {",
            "$('#KpiActiveProjects').text(");

        var body = Between(script, "function renderBody() {", "function renderSortIndicators()");
        ShouldAppearInOrder(body,
            "var waiting = !state.items.length && state.loading;",
            "var failed = !state.items.length && !state.loading && state.loadFailed;",
            "var noProjectsAtAll = !state.items.length && !waiting && !failed;",
            "$('#ProjectsEmpty').prop('hidden', !noProjectsAtAll);",
            "$('#ProjectsLoadError').prop('hidden', !failed);",
            "$('#ProjectsList').prop('hidden', failed || noProjectsAtAll",
            "$('#ProjectsGrid').prop('hidden', failed || noProjectsAtAll",
            "if (waiting) {",
            "$('#ProjectsListBody').html(ROW_SKELETON);",
            "$('#ProjectsGrid').html(CARD_SKELETON);",
            "} else if (noResult) {");
        // İskelet .apya-tile taşımaz: kutunun zemini parıltıyı ezer.
        Between(script, "var CARD_SKELETON", "function renderBody()").ShouldNotContain("apya-tile");

        var page = Web("Pages", "Projects", "Index.cshtml");
        ShouldAppearInOrder(page,
            "id=\"ProjectsGrid\"",
            "<div id=\"ProjectsLoadError\" hidden></div>",
            "<div id=\"ProjectsEmpty\" hidden>");
    }

    /// <summary>
    /// Yükleme isteği ABP penceresini açmaz (karar 2); liste hiç gelmediyse ızgaranın dışında kart.
    /// Devam sayfası (otomatik devam ya da "Daha fazla yükle") düşerse eldeki liste korunur ve kart
    /// "Daha fazla yükle"nin altına basılır — eskiden hiçbir yerde söylenmiyordu, eksik küme (KPI/çip
    /// sayaçları) tam sanılıyordu. Kart her yeni istekte kalkar; Tekrar dene aynı sayfayı ister.
    /// jQuery zincirinde kalır: Promise.resolve'a sarılsaydı "throw e" yakalanmamış ret (telemetri) olurdu.
    /// </summary>
    [Fact]
    public void Projeler_yukleme_hatasi_kart_ve_Tekrar_dene_tasir_devam_hatasi_listeyi_korur()
    {
        var script = Web("Pages", "Projects", "Index.js");

        var load = Between(script, "function load(append) {", "function reload()");
        ShouldAppearInOrder(load,
            "state.loadFailed = false;",
            "$('#ProjectsMoreError').prop('hidden', true).empty();",
            "if (!append && !state.items.length) { render(); }",
            "}, { abpHandleError: false }).then(function (res) {",
            "}).catch(function (e) {",
            "state.loading = false;",
            "if (!state.items.length) {",
            "state.loadFailed = true;",
            "apya.loadState.errorHtml(l('Project:List:LoadFailed'), 'js-projects-retry', e)",
            "} else {",
            "state.truncated = true;",
            "$('#ProjectsMoreError').html(apya.loadState.errorHtml(l('Project:List:LoadFailed'), 'js-projects-more-retry', e))",
            ".prop('hidden', false);",
            "render();",
            "throw e;");
        Count(load, "state.loadFailed = true;").ShouldBe(1);
        load.ShouldNotContain("Promise.resolve(");

        script.ShouldContain(
            "$('#ProjectsLoadError').on('click', '.js-projects-retry', function () {\n" +
            "        $(this).prop('disabled', true);\n" +
            "        reload();");
        script.ShouldContain(
            "$('#ProjectsMoreError').on('click', '.js-projects-more-retry', function () {\n" +
            "        $(this).prop('disabled', true);\n" +
            "        load(true);");

        // Kart ızgaranın ve "Daha fazla yükle" satırının DIŞINDA (flex satırda düğmenin yanına sıkışmaz).
        ShouldAppearInOrder(Web("Pages", "Projects", "Index.cshtml"),
            "<div class=\"apya-tile-grid-more\">",
            "id=\"ProjectsLoadMore\"",
            "</div>",
            "<div id=\"ProjectsMoreError\" hidden></div>");
    }

    /// <summary>
    /// Yan yüklemeler tek kanal kuralına uyar (karar 2): KPI şeridindeki görev sayaçları düşerse ABP
    /// penceresi açılmaz (liste kartıyla birlikte ikinci kanal olurdu); sayaç gelmemişse "—" kalır.
    /// </summary>
    [Fact]
    public void Projeler_gorev_sayaclari_yan_yukleme_pencere_acmaz()
    {
        var kpis = Between(Web("Pages", "Projects", "Index.js"), "function loadTaskKpis() {", "// ======");

        Count(kpis, "taskService.getList(").ShouldBe(2);
        Count(kpis, "}, { abpHandleError: false }).then(function (r) {").ShouldBe(2);
        Count(kpis, "renderKpis(); }, function () { });").ShouldBe(2, "reddin sessiz dalı olmalı");
    }

    // ─────────────────────────── RES-06: Bildirimler ───────────────────────────

    /// <summary>
    /// Spinner sonsuza dek dönmez: ilk yükleme/süzgeç hatası listeyi kartla değiştirir. "Daha fazla"
    /// düşerse eldeki liste korunur, ofset geri alınır (tekrar deneme aynı sayfayı ister — eskiden
    /// 15 bildirim sessizce atlanıyordu) ve kart listenin sonuna basılır. Bayat ret de yutulur.
    /// </summary>
    [Fact]
    public void Bildirimler_yukleme_hatasinda_kart_basar_Daha_fazla_hatasi_kayit_atlatmaz()
    {
        var script = Web("Pages", "Notifications", "Index.js");

        var load = Between(script, "function loadNotifications", "function reload");
        ShouldAppearInOrder(load,
            "Promise.resolve(notificationService.getMyNotifications(buildInput(), { abpHandleError: false }))",
            "if (!isLatest()) { return; }",
            "}, function (err) {",
            "if (!isLatest()) { return; }",
            "if (append) {",
            "state.skipCount = Math.max(0, state.skipCount - PAGE_SIZE);",
            "$list.append(apya.loadState.errorHtml(l('Notification:List:LoadFailed'), 'js-notif-more-retry', err));",
            "return;",
            "$list.html(apya.loadState.errorHtml(l('Notification:List:LoadFailed'), 'js-notif-retry', err));",
            "$('#load-more-btn, #no-more-notif').addClass('d-none');");
        Count(load, "if (!isLatest())").ShouldBe(2);

        script.ShouldContain(
            "$list.on('click', '.js-notif-retry', function () {\n" +
            "        $(this).prop('disabled', true);\n" +
            "        reload();");
        // "Daha fazla" kartı kalkar ve AYNI sayfa istenir (ofset düğmenin işleyicisinde yeniden artar).
        ShouldAppearInOrder(Between(script, "$list.on('click', '.js-notif-more-retry'", "});"),
            ".remove();",
            "$('#load-more-btn').trigger('click');");

        // İstek sürerken düğme pasif: çift tıklamada ilk istek düşerse ofset geri alma yanlış sayfaya
        // çekiyordu (15-29 atlanıyor, 30-44 çift geliyordu). İstek bitince (başarı ya da hata) açılır.
        ShouldAppearInOrder(Between(script, "$('#load-more-btn').click(function () {", "\n    });"),
            "var $btn = $(this).prop('disabled', true);",
            "state.skipCount += PAGE_SIZE;",
            "loadNotifications(true).then(function () { $btn.prop('disabled', false); });");
    }

    /// <summary>
    /// Özet (kategori sayaçları) yan yüklemedir (karar 2): açılışta ve her süzgeçte listeyle birlikte
    /// koşar; düşerse ABP penceresi açılmaz — tam kesintide liste kartıyla birlikte ikinci kanal olurdu.
    /// Kategori ağacı olduğu gibi kalır; bayat yanıt yine biletle yutulur.
    /// </summary>
    [Fact]
    public void Bildirimler_ozet_yan_yukleme_pencere_acmaz()
    {
        var summary = Between(Web("Pages", "Notifications", "Index.js"), "function refreshSummary() {", "function buildInput");

        ShouldAppearInOrder(summary,
            "var isLatest = nextSummary();",
            "Promise.resolve(notificationService.getSummary({ abpHandleError: false }))",
            "if (isLatest()) { renderCategories(summary); }",
            "}, function () { });");
    }

    // ─────────────────────────── TSK-11: Görevler yan yüklemeleri ───────────────────────────

    /// <summary>
    /// Tablo kartı sessizken şerit özeti ve iki seçici listesi ABP penceresi açıyordu (karar 2 ihlali,
    /// görev izni olmayan rolde 403'te de). Özet düşerse sayaçlar "—" (eski kapsamın sayısı kalmaz) ve
    /// geç düşen eski istek yeni kapsamı ezmesin diye bilet; seçiciler sessiz, menü boş kalır.
    /// </summary>
    [Fact]
    public void Gorevler_serit_ozeti_ve_seciciler_pencere_acmaz()
    {
        var script = Web("Pages", "Tasks", "index.js");

        script.ShouldContain("var nextSummary = apya.latest();");
        var summary = Between(script, "function loadSummary() {", "// ─── DataTable");
        ShouldAppearInOrder(summary,
            "var isLatest = nextSummary();",
            "Promise.resolve(taskService.getSummary(scope, { abpHandleError: false })).then(function (s) {",
            "if (!isLatest()) { return; }",
            "}, function () {",
            "if (!isLatest()) { return; }",
            "$('#sum-progress-pct, #sum-overdue, #sum-due7, #sum-mine').text('—');");

        script.ShouldContain("taskService.getUsersLookup({ abpHandleError: false }).then(function (res) {");
        script.ShouldContain("taskService.getProjectsLookup({ abpHandleError: false }).then(function (items) {");
        Count(script, "renderFilterUi();\n    }, function () { });").ShouldBe(2, "iki seçicinin de sessiz ret dalı olmalı");
    }

    // ─────────────────────────── RES-06: Faturalar ───────────────────────────

    /// <summary>
    /// Liste hiç gelmemişken yükleme hatası ABP penceresi açmaz; kart kanonik errorHtml'dir (açıklama
    /// G1 kanalından, "Tekrar dene" outline-primary + fa-rotate-right). Veri ekrandayken (oluştur/ödeme
    /// sonrası) yenileme düşerse liste korunur ve ABP penceresi bildirir — sessiz kalsaydı yeni fatura
    /// kaybolmuş sanılırdı (R2 kuralı).
    /// </summary>
    [Fact]
    public void Faturalar_ilk_yukleme_hatasi_kart_veri_varken_yenileme_hatasi_pencere()
    {
        var script = Web("Pages", "Invoices", "index.js");

        var load = Between(script, "function load(keepSelection) {", "// ── Olaylar ──");
        ShouldAppearInOrder(load,
            "var initial = !state.all.length;",
            "{ maxResultCount: 200, sorting: 'invoiceDate desc' }, { abpHandleError: !initial })",
            "}, function (err) {",
            "if (!isLatest()) { return; }",
            "if (!state.all.length) {",
            "$loadError.html(apya.loadState.errorHtml('Faturalar yüklenemedi.', 'js-invoices-retry', err));",
            "renderList();");

        script.ShouldContain(".on('click', '.js-invoices-retry', function () { $(this).prop('disabled', true); load(); })");
        // Kanonik dışı eski blok (ikonsuz outline-secondary "Tekrar dene", gömülü rol) kalmadı.
        script.ShouldNotContain("ABP hata penceresini zaten gösteriyor");
        script.ShouldNotContain("<span>Faturalar yüklenemedi.</span>");
    }

    // ─────────────────────────── CON-14: Kasalar boş durum eylemi ───────────────────────────

    /// <summary>
    /// "Yeni Kasa Ekle" eylemi yalnız CashAccounts.Create yetkisinde basılır (izinli dalın çıktısı
    /// CashAccountsPage_Tests'te); parça ?handler=AccountSummary ile yeniden basıldığı için Index.js
    /// kancaya #AccountSummary üzerinden delege bağlanır — doğrudan bağlama ilk tazelemede ölürdü.
    /// </summary>
    [Fact]
    public void Kasalar_bos_durum_eylemi_izne_bagli_ve_delege_baglanir()
    {
        var summary = Web("Pages", "CashAccounts", "_AccountSummary.cshtml");

        Between(summary, "var emptyState = new EmptyStateModel", "if (await").ShouldNotContain("Action");
        var granted = Between(summary,
            "if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.CashAccounts.Create))",
            "<partial name=\"_EmptyState\" model=\"emptyState\" />");
        granted.ShouldContain("emptyState.ActionText = \"Yeni Kasa Ekle\";");
        granted.ShouldContain("[\"data-cash-account-new\"] = \"\"");
        Count(summary, "data-cash-account-new").ShouldBe(1, "eylem kancası izin bloğunun dışında basılmamalı");

        Web("Pages", "CashAccounts", "Index.js").ShouldContain(
            "$('#AccountSummary').on('click', '[data-cash-account-new]', function (e) {\n" +
            "        e.preventDefault();\n" +
            "        createAccountModal.open();");
    }

    [Theory]
    [InlineData("Project:List:LoadFailed")]
    [InlineData("Notification:List:LoadFailed")]
    public void Kart_basliklari_iki_dilde_de_var(string key)
    {
        foreach (var culture in new[] { "tr", "en" })
        {
            var raw = ReadSource("src", "Apya.Platform.Domain.Shared", "Localization", "Platform", culture + ".json");
            // Yinelenen anahtar sessizce ezer (JSON birleştirmesi hata vermez).
            Count(raw, $"\"{key}\":").ShouldBe(1, $"{key} {culture}.json'da tam bir kez olmalı.");

            using var json = JsonDocument.Parse(raw);
            json.RootElement.GetProperty("texts").GetProperty(key).GetString()
                .ShouldNotBeNullOrWhiteSpace();
        }
    }
}
