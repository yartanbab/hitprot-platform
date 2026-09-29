using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Apya.Platform.Web.Pages.Shared;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Html;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Razor ortak boş durumu — <c>EmptyStateModel</c> + <c>_EmptyState</c> (CON-14; Faz 4 G2a,
/// kararlar 5/PD2=A ve 10).
///
/// <para>Partial <c>.apya-console-state</c> dilini basar: ikon balonu + başlık + açıklama + eylem
/// yuvası. Error varyantı <c>apya.loadState.errorHtml</c>'in sunucu karşılığıdır (soluk balon, uyarı
/// üçgeni, <c>role="alert"</c>, kanonik "Tekrar dene": btn-outline-primary + fa-rotate-right).
/// Eylem çizimi C#'ta (<c>BuildAction</c>) olduğu için birim test edilir; görünüm sözleşmesi sayfa
/// render'ıyla (<see cref="Render"/>).</para>
///
/// <para>Bozulma ekranda hata vermez: varsayılan sınıf kayarsa CTA ile "Tekrar dene" aynı görünür,
/// kodlama düşerse metin HTML olarak basılır, Id/CssClass kökten düşerse alt görev/dosya eklenince
/// boş durum JS'ten kaldırılamaz.</para>
/// </summary>
public class EmptyStateModel_Tests
{
    /// <summary>TagBuilder çıktısı; Razor da aynı kodlayıcıyı (HtmlEncoder.Default) kullanıyor.</summary>
    private static string Html(IHtmlContent content)
    {
        using var writer = new StringWriter();
        content.WriteTo(writer, HtmlEncoder.Default);
        return writer.ToString();
    }

    private static HtmlNode Action(EmptyStateModel model)
    {
        var action = model.BuildAction();
        action.ShouldNotBeNull("eylem metni verildiyse eylem basılmalı");

        var doc = new HtmlDocument();
        doc.LoadHtml(Html(action!));
        return doc.DocumentNode.FirstChild;
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Eylem_metni_yoksa_eylem_basilmaz(string? text)
    {
        new EmptyStateModel { Title = "Boş", ActionText = text, ActionUrl = "/x", ActionIcon = "fa-plus" }
            .BuildAction().ShouldBeNull();
    }

    [Fact]
    public void Adres_yoksa_type_button_dugmesi_varsa_baglanti()
    {
        var button = Action(new EmptyStateModel { ActionText = "Ekle" });
        button.Name.ShouldBe("button");
        button.GetAttributeValue("type", "").ShouldBe("button");
        button.Attributes.Contains("href").ShouldBeFalse();

        var link = Action(new EmptyStateModel { ActionText = "Git", ActionUrl = "/Finance?projectId=1&tab=kalemler" });
        link.Name.ShouldBe("a");
        WebUtility.HtmlDecode(link.GetAttributeValue("href", "")).ShouldBe("/Finance?projectId=1&tab=kalemler");
        link.Attributes.Contains("type").ShouldBeFalse();
    }

    /// <summary>
    /// Karar 10: hata varyantının eylemi kanonik "Tekrar dene" görünümündedir (JS errorHtml ile aynı);
    /// boş ve kilit durumlarında CTA birincil düğmedir ve ikon yalnız verilirse basılır.
    /// </summary>
    [Theory]
    [InlineData(EmptyStateVariant.Default, "btn btn-sm btn-primary", null)]
    [InlineData(EmptyStateVariant.Locked, "btn btn-sm btn-primary", null)]
    [InlineData(EmptyStateVariant.Error, "btn btn-sm btn-outline-primary", "fa fa-rotate-right me-1")]
    public void Eylemin_varsayilan_gorunumu_varyanta_gore(EmptyStateVariant variant, string buttonClass, string? iconClass)
    {
        var action = Action(new EmptyStateModel { Variant = variant, ActionText = "Tekrar dene" });

        action.GetAttributeValue("class", "").ShouldBe(buttonClass);
        var icon = action.SelectSingleNode("i");
        if (iconClass == null)
        {
            icon.ShouldBeNull();
        }
        else
        {
            icon.ShouldNotBeNull();
            icon!.GetAttributeValue("class", "").ShouldBe(iconClass);
            icon.GetAttributeValue("aria-hidden", "").ShouldBe("true");
        }

        action.InnerText.Trim().ShouldBe("Tekrar dene");
    }

    [Fact]
    public void Verilen_ikon_metinden_once_aria_hidden_basilir()
    {
        var action = Action(new EmptyStateModel { Variant = EmptyStateVariant.Error, ActionText = "Yenile", ActionIcon = "fa-plus" });

        action.FirstChild.Name.ShouldBe("i");
        action.FirstChild.GetAttributeValue("class", "").ShouldBe("fa fa-plus me-1");
        action.FirstChild.GetAttributeValue("aria-hidden", "").ShouldBe("true");
        action.LastChild.InnerText.ShouldBe("Yenile");
    }

    [Fact]
    public void Oznitelikler_birlesir_class_varsayilanin_yerine_gecer()
    {
        var hooked = Action(new EmptyStateModel
        {
            ActionText = "Yeni Kasa Ekle",
            ActionAttributes = new Dictionary<string, string> { ["data-cash-account-new"] = "" }
        });
        hooked.Attributes.Contains("data-cash-account-new").ShouldBeTrue();
        hooked.GetAttributeValue("class", "").ShouldBe("btn btn-sm btn-primary");

        var overridden = Action(new EmptyStateModel
        {
            ActionText = "Ekle",
            ActionAttributes = new Dictionary<string, string> { ["class"] = "btn btn-link" }
        });
        overridden.GetAttributeValue("class", "").ShouldBe("btn btn-link");
    }

    [Fact]
    public void Metin_ve_oznitelik_degerleri_kodlanir()
    {
        var html = Html(new EmptyStateModel
        {
            ActionText = "<b>\"Ekle\"</b>",
            ActionAttributes = new Dictionary<string, string> { ["data-x"] = "\"><script>alert(1)</script>" }
        }.BuildAction()!);

        html.ShouldNotContain("<b>");
        html.ShouldNotContain("<script>");
        html.ShouldContain("&lt;b&gt;&quot;Ekle&quot;&lt;/b&gt;");
        html.ShouldContain("data-x=\"&quot;&gt;&lt;script&gt;");
    }

    [Theory]
    [InlineData(EmptyStateVariant.Default, null, "fa-inbox")]
    [InlineData(EmptyStateVariant.Error, null, "fa-triangle-exclamation")]
    [InlineData(EmptyStateVariant.Locked, null, "fa-lock")]
    [InlineData(EmptyStateVariant.Error, "fa-plug", "fa-plug")]
    public void Ikon_verilmezse_varyantin_varsayilani(EmptyStateVariant variant, string? icon, string expected)
    {
        new EmptyStateModel { Variant = variant, Icon = icon }.IconClass.ShouldBe(expected);
    }

    [Theory]
    [InlineData(EmptyStateVariant.Default, false, null)]
    [InlineData(EmptyStateVariant.Error, true, "alert")]
    [InlineData(EmptyStateVariant.Locked, true, null)]
    public void Soluk_balon_ve_rol_varyanta_gore(EmptyStateVariant variant, bool muted, string? role)
    {
        var model = new EmptyStateModel { Variant = variant };
        model.IsMuted.ShouldBe(muted);
        model.Role.ShouldBe(role);
    }

    /// <summary>
    /// Görünüm sözleşmesi sayfa render'ıyla (PD2=A: tüm kullanımlar .apya-console-state diline geçti).
    /// Ayrı sınıf: birim testleri test host'u kurmasın.
    /// </summary>
    public class Render : PlatformWebTestBase
    {
        [Fact]
        public async Task Projeler_bos_durumu_konsol_diliyle_basilir()
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(await GetResponseAsStringAsync("/Projects"));

            var state = doc.DocumentNode.SelectSingleNode("//div[@id='ProjectsEmpty']/div[contains(@class,'apya-console-state')]");
            state.ShouldNotBeNull("boş durum .apya-console-state köküyle basılmalı");
            // Id/CssClass/Role verilmediyse öznitelik ya da artık boşluk basılmaz.
            state!.GetAttributeValue("class", "").ShouldBe("apya-console-state");
            state.Attributes.Contains("id").ShouldBeFalse();
            state.Attributes.Contains("role").ShouldBeFalse();

            var bubble = state.SelectSingleNode("span[contains(@class,'apya-console-state-icon')]");
            bubble.ShouldNotBeNull();
            bubble!.GetAttributeValue("class", "").ShouldBe("apya-console-state-icon", "boş durum balonu soluk değil (accent)");
            bubble.SelectSingleNode("i")!.GetAttributeValue("class", "").ShouldBe("fa fa-rocket");

            WebUtility.HtmlDecode(state.SelectSingleNode("strong")!.InnerText).ShouldBe("Henüz proje yok");
            WebUtility.HtmlDecode(state.SelectSingleNode("p")!.InnerText).ShouldStartWith("İlk projenizi ekleyin");
            state.SelectSingleNode("span[contains(@class,'apya-console-state-actions')]").ShouldBeNull("eylem verilmedi");

            // Eski Bootstrap işaretlemesi (text-muted py-5, fa-2x) kalmadı.
            doc.DocumentNode.SelectSingleNode("//div[@id='ProjectsEmpty']//*[contains(@class,'text-muted') or contains(@class,'fa-2x')]")
                .ShouldBeNull();
        }
    }
}
