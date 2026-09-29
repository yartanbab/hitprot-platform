using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe ekranlarının YÜKLEME HATASI sözleşmesi (CON-04, GRH-08, GRT-07 — Faz 4 G2a).
///
/// <para>Hibe betikleri $(fn), bootstrap.Modal, SignalR ve ABP proxy'leri kullandığı için vitest'te
/// koşulamıyor; sözleşme kaynaktan kilitlenir. Ortak yardımcılar (apya.latest, apya.loadState)
/// <c>apyaLatest.test.js</c> / <c>apyaLoadState.test.js</c>'te davranışsal test ediliyor.</para>
///
/// <para>Tarif (Faz 4 kararları 2, 5, 10): yükleme isteği <c>{ abpHandleError: false }</c> taşır
/// (ABP'nin engelleyici penceresi açılmaz, 401 yine merkezi pencerede); hata dalı iskeleti kaldırıp
/// sayfaya özgü başlıklı kartı + kanonik "Tekrar dene"yi basar, açıklama hata nesnesinden (G1
/// kanalı) gelir; Tekrar dene düğmesi basılınca pasifleşir. Yeniden girilen yüklemeler
/// <c>apya.latest</c> bileti alır. Detay/form sayfalarında veri ekrandayken yenileme düşerse ekran
/// korunur (kart yok, tek kanal ABP penceresi).</para>
///
/// <para>Bozulma ekranda hata vermez: iskelet sonsuza dek parlar, sayaçlar yanlış "0" gösterir,
/// hata anında sekme/süzgeç tıklaması TypeError atar ya da boş form kaydedilip veri silinir.</para>
/// </summary>
public class GrantLoadFailureScripts_Tests
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

    private static string Grants(string file) =>
        ReadSource("src", "Apya.Platform.Web", "Pages", "Grants", file);

    /// <summary>4 boşluk girintili fonksiyon bildiriminin gövdesi (kapanan '    }' satırına kadar).</summary>
    private static string Body(string source, string declaration)
    {
        var from = source.IndexOf(declaration, StringComparison.Ordinal);
        from.ShouldBeGreaterThanOrEqualTo(0, $"'{declaration}' bulunamadı.");
        var to = source.IndexOf("\n    }\n", from, StringComparison.Ordinal);
        to.ShouldBeGreaterThan(from, $"'{declaration}' gövdesinin sonu bulunamadı.");
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

    // ─────────────────────────── Ortak tarif ───────────────────────────

    /// <summary>
    /// Her yükleme: sessiz istek (pencere yok) → iki dallı söz → hata kartı (sayfaya özgü başlık,
    /// hata nesnesi) → kendi Tekrar dene bağlaması (basılınca pasif).
    /// </summary>
    [Theory]
    // Kiracı
    [InlineData("Today.js", "function load()", "service.get({ abpHandleError: false })", "Grants:Today:LoadFailed", "js-today-retry")]
    [InlineData("Catalog.js", "function load()", "service.getOpenCalls({ abpHandleError: false })", "Grants:Catalog:LoadFailed", "js-catalog-retry")]
    [InlineData("Implementation.js", "function load()", "service.get(appId, { abpHandleError: false })", "Grants:Impl:LoadFailed", "js-impl-retry")]
    [InlineData("Journey.js", "function load()", "service.get({ abpHandleError: false })", "Grants:Journey:LoadFailed", "js-journey-retry")]
    [InlineData("MyApplications.js", "function load()", "service.get({ abpHandleError: false })", "Grants:Mine:LoadFailed", "js-mine-retry")]
    [InlineData("MyApplications.js", "function loadInterests()", "interestService.getMine({ abpHandleError: false })", "Grants:Mine:Interests:LoadFailed", "js-mine-interests-retry")]
    [InlineData("Appeal.js", "function load()", "service.get(appId, { abpHandleError: false })", "Grants:Appeal:LoadFailed", "js-appeal-retry")]
    [InlineData("Documents.js", "function load()", "service.get(appId, { abpHandleError: !initial })", "Grants:Documents:LoadFailed", "js-docs-retry")]
    [InlineData("Detail.js", "function load()", "service.getCallDetail(callId, { abpHandleError: false })", "Grants:Detail:LoadFailed", "js-detail-retry")]
    [InlineData("Wizard.js", "function load()", "service.get(appId, { abpHandleError: !initial })", "Grants:Wizard:LoadFailed", "js-wizard-retry")]
    [InlineData("Tenant.js", "function loadApplications()", "appSvc.getMyApplications({ abpHandleError: false })", "Grants:Mine:LoadFailed", "js-grants-apps-retry")]
    // Host
    [InlineData("Dispatch.js", "function load()", "service.preview(collectFilter(), { abpHandleError: false })", "Grants:Dispatch:LoadFailed", "js-dispatch-retry")]
    [InlineData("Dispatch.js", "function loadIdeas()", "ideaService.getCallMatches(callId, { abpHandleError: false })", "Grants:Dispatch:Ideas:LoadFailed", "js-dispatch-ideas-retry")]
    [InlineData("Ideas.js", "function load()", "service.getList(filters, { abpHandleError: false })", "Grants:Ideas:LoadFailed", "js-ideas-retry")]
    [InlineData("Requests.js", "function load()", "service.getInbox(filters, { abpHandleError: false })", "Grants:Requests:LoadFailed", "js-requests-retry")]
    [InlineData("Pipeline.js", "function load()", "service.getBoard(callId || null, userId || null, { abpHandleError: false })", "Grants:Pipeline:LoadFailed", "js-pipeline-retry")]
    [InlineData("Leads.js", "function load()", "service.get({ abpHandleError: false })", "Grants:Leads:LoadFailed", "js-leads-retry")]
    [InlineData("InterestReview.js", "function load()", "service.getReview(interestId, { abpHandleError: !initial })", "Grants:InterestReview:LoadFailed", "js-review-retry")]
    [InlineData("NotificationTemplates.js", "function load()", "service.get({ abpHandleError: false })", "Grants:Notify:LoadFailed", "js-nt-retry")]
    [InlineData("StageTemplates.js", "function load()", "service.getList({ abpHandleError: false })", "Grants:StageTemplates:LoadFailed", "js-tpl-retry")]
    [InlineData("Applications.js", "function loadList()", "hostSvc.getList({ abpHandleError: false })", "Grants:Applications:LoadFailed", "js-apps-retry")]
    [InlineData("MatchWeights.js", "function load()", "service.get(grantId, { abpHandleError: false })", "Grants:Weights:LoadFailed", "js-weights-retry")]
    [InlineData("MatchWeights.js", "function loadCampaign()", "service.getMissingData({ abpHandleError: false })", "Common:ListLoadFailed", "js-weights-campaign-retry")]
    public void Yukleme_hatasi_sessiz_istek_kart_ve_Tekrar_dene_tasir(
        string file, string declaration, string call, string titleKey, string retryClass)
    {
        var script = Grants(file);
        var load = Body(script, declaration);

        ShouldAppearInOrder(load,
            "Promise.resolve(" + call + ")",
            "}, function (err) {",
            $"apya.loadState.errorHtml(l('{titleKey}'), '{retryClass}', err)");

        script.ShouldContain(
            $".on('click', '.{retryClass}', function () {{\n        $(this).prop('disabled', true);",
            Case.Sensitive, "Tekrar dene kendi kabına bağlanmalı ve basılınca pasifleşmeli");
    }

    [Theory]
    [InlineData("Grants:Today:LoadFailed")]
    [InlineData("Grants:Catalog:LoadFailed")]
    [InlineData("Grants:Impl:LoadFailed")]
    [InlineData("Grants:Journey:LoadFailed")]
    [InlineData("Grants:Mine:LoadFailed")]
    [InlineData("Grants:Mine:Interests:LoadFailed")]
    [InlineData("Grants:Appeal:LoadFailed")]
    [InlineData("Grants:Documents:LoadFailed")]
    [InlineData("Grants:Detail:LoadFailed")]
    [InlineData("Grants:Wizard:LoadFailed")]
    [InlineData("Grants:Dispatch:LoadFailed")]
    [InlineData("Grants:Dispatch:Ideas:LoadFailed")]
    [InlineData("Grants:Ideas:LoadFailed")]
    [InlineData("Grants:Requests:LoadFailed")]
    [InlineData("Grants:Pipeline:LoadFailed")]
    [InlineData("Grants:Leads:LoadFailed")]
    [InlineData("Grants:InterestReview:LoadFailed")]
    [InlineData("Grants:Notify:LoadFailed")]
    [InlineData("Grants:Calls:LoadFailed")]
    [InlineData("Grants:Parameters:LoadFailed")]
    [InlineData("Grants:StageTemplates:LoadFailed")]
    [InlineData("Grants:Applications:LoadFailed")]
    [InlineData("Grants:Weights:LoadFailed")]
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

    // ─────────────────────────── Yeniden girilen yüklemeler: bilet ───────────────────────────

    /// <summary>Süzgeç, eylem, hub ya da pencere sonrası yeniden girilen yüklemeler: geç dönen eski yanıt (başarı ya da ret) yeniyi ezmez.</summary>
    [Theory]
    [InlineData("Journey.js", "function load()", "nextLoad")]
    [InlineData("Documents.js", "function load()", "nextLoad")]
    [InlineData("Wizard.js", "function load()", "nextLoad")]
    [InlineData("Dispatch.js", "function load()", "nextLoad")]
    [InlineData("Dispatch.js", "function loadIdeas()", "nextIdeas")]
    [InlineData("Ideas.js", "function load()", "nextLoad")]
    [InlineData("Requests.js", "function load()", "nextLoad")]
    [InlineData("Pipeline.js", "function load()", "nextLoad")]
    [InlineData("InterestReview.js", "function load()", "nextLoad")]
    [InlineData("Index.js", "function load()", "nextLoad")]
    [InlineData("StageTemplates.js", "function load()", "nextLoad")]
    [InlineData("Applications.js", "function loadList()", "nextList")]
    public void Yeniden_girilen_yukleme_bayat_yaniti_yutar(string file, string declaration, string ticket)
    {
        var script = Grants(file);
        script.ShouldContain(ticket + " = apya.latest()");

        var load = Body(script, declaration);
        load.ShouldContain($"var isLatest = {ticket}();");
        Count(load, "if (!isLatest()").ShouldBe(2, "başarı ve hata dalı ikisi de bayat yanıtı yutmalı");
    }

    // ─────────────────────────── Hata anında yeniden boyama korumaları ───────────────────────────

    /// <summary>Hata anında sekme/çip/süzgeç tıklaması boş modelle boyayıp TypeError atmaz ya da kartı sahte boş durumla ezmez.</summary>
    [Fact]
    public void Hata_aninda_sekme_ve_suzgecler_karti_ezmez()
    {
        Grants("Today.js").ShouldContain(
            "$('.apya-today-tabs').on('click', '[data-owner]', function () {\n" +
            "        // Yükleme düştüyse boyanacak model yok (hata kartı kalır).\n" +
            "        if (!model) { return; }");

        Grants("Catalog.js").ShouldContain("$('#OnlyFixable').on('change', function () { if (loaded) { paint(); } });");
        Count(Grants("Catalog.js"), "loaded = true;").ShouldBe(1, "yalnız başarılı yükleme süzgeci açmalı");

        foreach (var file in new[] { "MyApplications.js", "Documents.js" })
        {
            Grants(file).ShouldContain(
                "$('.apya-choice-row').on('click', '.apya-choice', function () {\n" +
                "        // Yükleme düştüyse süzülecek model yok (hata kartı kalır).\n" +
                "        if (!model) { return; }");
        }
    }

    // ─────────────────────────── Detay/form: veri ekrandayken yenileme ───────────────────────────

    /// <summary>
    /// İlk yükleme düşerse kart; veri ekrandayken (yükleme/onay, hub olayı, kilit) yenileme düşerse
    /// ekran ve açık form korunur — kart basılmaz, pencere bildirir (tek kanal). Evraklarda veri
    /// gelmeden "Evrak ekle / Hatırlat" gizli, "Paketi oluştur" pasif kalır.
    /// </summary>
    [Fact]
    public void Detay_ve_form_sayfalari_veri_ekrandayken_ekrani_korur()
    {
        foreach (var file in new[] { "Documents.js", "Wizard.js" })
        {
            var load = Body(Grants(file), "function load()");
            ShouldAppearInOrder(load,
                "var initial = !model;",
                "{ abpHandleError: !initial }",
                "}, function (err) {",
                "if (!isLatest() || !initial || model) { return",
                "apya.loadState.errorHtml(");
        }

        var docs = Body(Grants("Documents.js"), "function load()");
        ShouldAppearInOrder(docs,
            "apya.loadState.errorHtml(",
            "$('#KpiTotal, #KpiApproved, #KpiOnYou, #KpiOnOther, #KpiReady').text('—');",
            "$('#AddDocBtn, #RemindBtn').addClass('d-none');",
            "$('#CreatePackageBtn').prop('disabled', true);");
    }

    /// <summary>
    /// Sihirbaz canlı kanala (SignalR) yalnız ilk BAŞARILI yüklemeden sonra, bir kez bağlanır. Eskiden
    /// <c>load().then(connect)</c> başarısız yüklemede de bağlanıyor, PresenceChanged boş modelle boyanıyordu.
    /// Bağlantı hangi yükleme ilk başarılı olursa onda kurulur (açılış bayatlasa da kanal kaybolmaz).
    /// </summary>
    [Fact]
    public void Sihirbaz_hub_a_yalniz_basarili_yuklemeden_sonra_baglanir()
    {
        var script = Grants("Wizard.js");

        script.ShouldNotContain("load().then(function () { connect();");
        script.ShouldContain("var live = false;");

        var load = Body(script, "function load()");
        ShouldAppearInOrder(load,
            "if (!isLatest()) { return; }",
            "paint();",
            "if (!live) {",
            "live = true;",
            "connect();",
            "startHeartbeat();",
            "}, function (err) {");
        load.Substring(load.IndexOf("}, function (err) {", StringComparison.Ordinal)).ShouldNotContain("connect(");
        Count(script, "connect();").ShouldBe(1, "canlı kanal yalnız başarılı yüklemede kurulmalı");
    }

    // ─────────────────────────── Host ekranları: sayfaya özgü korumalar ───────────────────────────

    /// <summary>
    /// Firmalara Gönder: aday listesi düşünce gönderim kapanır, "tümünü seç" hata kartını boş listeyle
    /// ezmez; fikir eşleşmeleri düşünce eski eşleşmeler "Tümünü bağla"ya kalmaz.
    /// </summary>
    [Fact]
    public void Firmalara_gonder_hata_aninda_gonderim_ve_toplu_baglama_kapali()
    {
        var script = Grants("Dispatch.js");

        script.ShouldContain("$('#SelectAll').on('change', function () {\n        if (candidatesFailed) { return; }");

        var load = Body(script, "function load()");
        ShouldAppearInOrder(load,
            "candidatesFailed = false;",
            "}, function (err) {",
            "candidatesFailed = true;",
            "$('#SendBtn').prop('disabled', true);");

        var ideas = Body(script, "function loadIdeas()");
        ShouldAppearInOrder(ideas, "}, function (err) {", "ideaMatches = null;", "$('#IdeaEmpty, #IdeaStrip, #IdeaBelowBlock').addClass('d-none');");
    }

    [Fact]
    public void Liste_hatasinda_sahte_bos_metin_ve_sifir_kalmaz()
    {
        // Fikir havuzu: "yalnız bekleyenler" düğmesi eski listeyle boyamaz.
        Body(Grants("Ideas.js"), "function load()").ShouldContain("lastDto = null;");

        // Talepler: "Kapanmış" süzgecindeki eski boş metin kalkar; gelmemiş sekme sayacı "—".
        ShouldAppearInOrder(Body(Grants("Requests.js"), "function load()"),
            "}, function (err) {",
            "$('#RequestEmpty, #DueStrip').addClass('d-none');",
            "$('[data-request-count]').filter(':empty').text('—');");

        // Pano/Liste sekme sayaçları: iskelet sonsuza dek parlamaz.
        var tabs = Grants("RequestTabs.js");
        tabs.ShouldContain("Promise.resolve(apya.platform.grants.grantRequest.getTabCounts({ abpHandleError: false }))");
        tabs.ShouldContain("}, function () {\n        $counts.text('—');");

        // Pano: özetler hatada "—", işaretlemede de "0" yalanı yok; çağrı listesi düşse de pano yüklenir.
        ShouldAppearInOrder(Body(Grants("Pipeline.js"), "function load()"),
            "}, function (err) {",
            "$('#SumRisky, #SumDocs, #SumReady, #SumAmount').text('—');");
        Grants("Pipeline.js").ShouldContain("}, function () { }).then(load);");
        var pipeline = Grants("Pipeline.cshtml");
        foreach (var id in new[] { "SumRisky", "SumDocs", "SumReady", "SumAmount" })
        {
            Regex.IsMatch(pipeline, $"id=\"{id}\">—</span>").ShouldBeTrue($"{id} yer tutucusu '—' olmalı");
        }

        // Ön değerlendirme: beş KPI + sayaç "—".
        Body(Grants("Leads.js"), "function load()")
            .ShouldContain("$('#KpiWeek, #KpiQualified, #KpiMeetings, #KpiConverted, #KpiPipeline, #LeadCount').text('—');");
    }

    /// <summary>Çağrılar: kart 3 kolonlu ızgarada tek hücreye sıkışmaz; liste ve boş kutu gizlenir.</summary>
    [Fact]
    public void Cagrilar_hata_karti_izgarayi_kaplar()
    {
        var load = Body(Grants("Index.js"), "function load()");
        ShouldAppearInOrder(load,
            "return Promise.resolve(board.get({",
            "}, { abpHandleError: false })).then(function (dto) {",
            "}, function (err) {",
            "$('#CallGrid').removeClass('apya-skel-cards d-none')",
            "apya.loadState.errorHtml(l('Grants:Calls:LoadFailed'), 'js-calls-retry', err)",
            "$('#CallList, #CallEmpty').addClass('d-none');");
        Grants("Index.js").ShouldContain(
            ".on('click', '.js-calls-retry', function () {\n        $(this).prop('disabled', true);");

        Grants("Calls.css").ShouldContain("#CallGrid > .apya-console-state { grid-column: 1 / -1; }");
    }

    /// <summary>
    /// İlgi incelemesi: "Başvuruya başlat / Reddet" veri görülmeden basılamaz, "Devret" pasif, not
    /// kaydı (tam yazım) veri gelmeden boş notla eski notu silemez.
    /// </summary>
    [Fact]
    public void Ilgi_incelemesi_veri_gelmeden_karar_ve_not_kilitli()
    {
        var markup = Grants("InterestReview.cshtml");
        markup.ShouldContain("<div class=\"apya-irv-actions d-none\" id=\"ReviewActions\">");
        markup.ShouldContain("id=\"AssignBtn\" disabled>");
        markup.ShouldContain("id=\"SaveNoteBtn\" disabled>");
        ShouldAppearInOrder(markup, "class=\"apya-irv-head\"", "<div id=\"ReviewLoadState\"></div>", "class=\"apya-irv-layout\"");

        Body(Grants("InterestReview.js"), "function paint(d)").ShouldContain("$('#SaveNoteBtn').prop('disabled', false);");
        ShouldAppearInOrder(Body(Grants("InterestReview.js"), "function load()"),
            "var initial = !model;",
            "}, function (err) {",
            "if (!isLatest() || !initial || model) { return; }",
            "apya.loadState.errorHtml(");
    }

    /// <summary>
    /// VERİ KAYBI: Parametreler ve Eşleştirme ağırlıkları kayıt uçları TAM güncellemedir. Yükleme düşünce
    /// etkin "Kaydet" boş formu yazıp program parametrelerini / ağırlıkları silebiliyordu. Kaydet
    /// işaretlemede kilitli, yalnız fill() form sunucu değerleriyle dolunca açar.
    /// </summary>
    [Fact]
    public void Tam_guncelleme_formlari_veri_gelmeden_kaydedilemez()
    {
        var parameters = Grants("Parameters.js");
        Grants("Parameters.cshtml").ShouldContain("<button type=\"button\" id=\"ParamSaveBtn\" class=\"btn btn-outline-secondary\" disabled>");
        Count(parameters, "$('#ParamSaveBtn').prop('disabled', false)").ShouldBe(1, "kilidi yalnız fill() açmalı");
        ShouldAppearInOrder(Body(parameters, "function fill(dto)"), "loading = false;", "$('#ParamSaveBtn').prop('disabled', false);", "refreshPreview();");

        // Açılış zinciri: şablon listesi → program → fill; TEK ret dalı iki adımı da kapsar.
        var load = Body(parameters, "function load()");
        ShouldAppearInOrder(load,
            "Promise.resolve(templateService.getList({ abpHandleError: false }))",
            "$sel.empty()",
            "return service.get(grantId, { abpHandleError: false });",
            "}).then(function (dto) {",
            "fill(dto);",
            "}, function (err) {",
            "apya.loadState.errorHtml(l('Grants:Parameters:LoadFailed'), 'js-params-retry', err)");
        Count(load, "function (err)").ShouldBe(1);
        ShouldAppearInOrder(Grants("Parameters.cshtml"), "class=\"apya-param-hero\"", "<div id=\"ParamLoadState\"></div>", "apya-param-tabs");

        var weights = Grants("MatchWeights.js");
        var weightsMarkup = Grants("MatchWeights.cshtml");
        weightsMarkup.ShouldContain("<button type=\"button\" id=\"WeightSaveBtn\" class=\"btn btn-sm btn-primary\" disabled>");
        weightsMarkup.ShouldContain("<button type=\"button\" id=\"WeightResetBtn\" class=\"btn btn-sm btn-link text-secondary d-none\">");
        Count(weights, "$('#WeightSaveBtn').prop('disabled', false)").ShouldBe(1, "kilidi yalnız fill() açmalı");
        ShouldAppearInOrder(Body(weights, "function fill(dto)"), "loading = false;", "$('#WeightSaveBtn').prop('disabled', false);", "refreshImpact();");
    }

    /// <summary>Aşama şablonları: veri gelene kadar editör ve yan panel görünmez (boş editör etkin "Şablonu kaydet" ile açılıyordu).</summary>
    [Fact]
    public void Asama_sablonu_editoru_veri_gelmeden_gizli()
    {
        var markup = Grants("StageTemplates.cshtml");
        markup.ShouldContain("<section class=\"card mb-0 apya-tpl-editor d-none\" id=\"TplEditor\">");
        markup.ShouldContain("<aside class=\"apya-tpl-side d-none\">");

        Body(Grants("StageTemplates.js"), "function load()")
            .ShouldContain("$('#TplEditor, .apya-tpl-side, #TplEmpty').addClass('d-none');");
    }

    // ─────────────────────────── İşaretleme: kart kapları ───────────────────────────

    [Theory]
    [InlineData("Journey.cshtml", "<ol class=\"apya-jny-list apya-skel-cards\" id=\"JourneyItems\"></ol>", "<div id=\"JourneyLoadState\"></div>")]
    [InlineData("Detail.cshtml", "id=\"CallMetrics\"", "<div id=\"DetailLoadState\"></div>")]
    [InlineData("Wizard.cshtml", "id=\"Steps\"", "<div id=\"WizardLoadState\"></div>")]
    public void Hata_karti_kabi_isaretlemede_yerinde(string file, string before, string container)
    {
        var markup = Grants(file);

        ShouldAppearInOrder(markup, before, container);
        Count(markup, container).ShouldBe(1);
    }
}
