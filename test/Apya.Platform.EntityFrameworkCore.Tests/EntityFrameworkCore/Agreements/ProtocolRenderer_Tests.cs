using System;
using Apya.Platform.Agreements;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Agreements;

/// <summary>
/// Belgenin bütünlüğü — protokolün 9. maddesindeki doğrulama kodunun anlamı bu testlerde.
/// Veritabanı gerektirmez: renderer saf bir dönüşümdür.
/// </summary>
public class ProtocolRenderer_Tests
{
    private static readonly ProtocolRenderer Renderer = new();

    private static RegistrationRequest NewRequest(string companyName = "Örnek Gençlik Derneği")
    {
        var request = new RegistrationRequest(
            Guid.NewGuid(),
            "Ayşe Yılmaz",
            "Yönetim Kurulu Başkanı",
            "aday@ornek.com",
            "05551112233",
            companyName,
            CompanyType.Association,
            "1234567890",
            "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            SalesPlan.Corporate);

        request.SetOptionalDetails("Halkalı", null, null, null, null, null);

        return request;
    }

    [Fact]
    public void Onaylanan_belgede_doldurulmamis_yer_tutucu_kalmaz()
    {
        var (html, hash) = Renderer.RenderApproved(
            NewRequest(), "APYA-PRT-2026-0001", SalesPlan.Corporate, 24_000m,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, "203.0.113.42");

        html.ShouldNotContain("{{");
        html.ShouldContain("APYA-PRT-2026-0001");
        html.ShouldContain("203.0.113.42");
        html.ShouldContain(hash);
        hash.Length.ShouldBe(64);
    }

    /// <summary>
    /// Hash zinciri kapanmalı: saklanan metinden özet yeniden hesaplanabiliyor.
    /// Bu kapanmazsa doğrulama kodu süs olur.
    /// </summary>
    [Fact]
    public void Saklanan_metin_kendi_ozetini_dogrular()
    {
        var (html, hash) = Renderer.RenderApproved(
            NewRequest(), "APYA-PRT-2026-0002", SalesPlan.Standard, 12_000m,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, "198.51.100.7");

        Renderer.VerifyHash(html, hash).ShouldBeTrue();
    }

    [Fact]
    public void Kurcalanan_metin_dogrulamayi_gecemez()
    {
        var (html, hash) = Renderer.RenderApproved(
            NewRequest(), "APYA-PRT-2026-0003", SalesPlan.Standard, 12_000m,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, "198.51.100.7");

        // Bedeli sessizce düşüren bir müdahale.
        var tampered = html.Replace("12.000,00", "1.000,00");
        tampered.ShouldNotBe(html);

        Renderer.VerifyHash(tampered, hash).ShouldBeFalse();
    }

    /// <summary>
    /// 🔐 Kurum unvanı adayın serbest metnidir. Ham basılsaydı protokol sayfası saklanmış
    /// XSS taşırdı — belge iki ayrı ekranda <c>@Html.Raw</c> ile basılıyor.
    /// </summary>
    [Fact]
    public void Aday_metni_HTML_olarak_kacirilir()
    {
        var request = NewRequest("<script>alert('xss')</script> Derneği");

        var (html, _) = Renderer.RenderApproved(
            request, "APYA-PRT-2026-0004", SalesPlan.Standard, null,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, null);

        html.ShouldNotContain("<script>alert");
        html.ShouldContain("&lt;script&gt;");
    }

    /// <summary>Bedel girilmemişse metne rakam UYDURULMAZ.</summary>
    [Fact]
    public void Bedelsiz_sozlesmede_rakam_uydurulmaz()
    {
        var (html, _) = Renderer.RenderApproved(
            NewRequest(), "APYA-PRT-2026-0005", SalesPlan.Joint, null,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, null);

        html.ShouldContain("Taraflarca ayrıca belirlenecektir");
        html.ShouldContain("Ortak Paket Sistemi");
    }

    /// <summary>
    /// Satır sonu farkı özeti DEĞİŞTİRMEMELİ: aynı belge Windows'ta doğrulanıp Linux'ta
    /// düşseydi doğrulama kodu taşınamaz olurdu.
    /// </summary>
    [Fact]
    public void Satir_sonu_farki_ozeti_degistirmez()
    {
        var (html, hash) = Renderer.RenderApproved(
            NewRequest(), "APYA-PRT-2026-0006", SalesPlan.Standard, 1_000m,
            ServiceAgreementConsts.DefaultSuccessFeePercent, DateTime.Now, null);

        var crlf = html.Replace("\r\n", "\n").Replace("\n", "\r\n");

        Renderer.VerifyHash(crlf, hash).ShouldBeTrue();
    }

    [Fact]
    public void Jeton_ozeti_kararli_ve_jetonun_kendisinden_farkli()
    {
        var token = InviteToken.Generate();

        token.ShouldNotContain("+");
        token.ShouldNotContain("/");
        token.ShouldNotContain("=");

        InviteToken.Hash(token).ShouldBe(InviteToken.Hash(token));
        InviteToken.Hash(token).ShouldNotBe(token);
        InviteToken.Hash(token).Length.ShouldBe(ServiceAgreementConsts.InviteTokenHashLength);
        InviteToken.Generate().ShouldNotBe(token);
    }
}
