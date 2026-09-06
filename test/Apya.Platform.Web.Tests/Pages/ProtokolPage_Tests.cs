using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Protokol sayfasının SAYFA sözleşmesi: jetonsuz açılmaz, jetonla belgeyi ve onay
/// kapısının kancalarını basar.
///
/// <para>Onayın kendisi (sözleşme yazımı + hesap açılışı) <c>ProtocolApproval_Tests</c>'te
/// uçtan uca ölçülüyor; burada ölçülen YAPIDIR — Razor, DI ve tag-helper hataları bu
/// suite'te yakalanır.</para>
/// </summary>
public class ProtokolPage_Tests : PlatformWebTestBase
{
    /// <summary>Davet bağlantısı üretilmiş, protokol bekleyen bir talep kurar.</summary>
    private async Task<string> CreateInvitedRequestAsync(string companyName)
    {
        var token = InviteToken.Generate();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();

            var request = new RegistrationRequest(
                Guid.NewGuid(),
                "Zeynep Demir",
                "Genel Sekreter",
                $"protokol-{Guid.NewGuid():N}@ornek.com",
                "05551112233",
                companyName,
                CompanyType.Association,
                Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
                "Merkez Mah. Atatürk Cad. No:1, İstanbul",
                SalesPlan.Corporate);

            request.SetOffer(SalesPlan.Corporate, 24_000m);
            request.SetStatus(RegistrationRequestStatus.Approved);
            request.IssueInvite(InviteToken.Hash(token), DateTime.Now, DateTime.Now.AddDays(30));

            await repository.InsertAsync(request, autoSave: true);
            await uow.CompleteAsync();
        }

        return token;
    }

    /// <summary>
    /// Jetonsuz açılan sayfa FORM BASMAMALI. Formun görünmesi, onay kutularının jetonsuz
    /// gönderilebileceği izlenimi verirdi.
    /// </summary>
    [Fact]
    public async Task Jetonsuz_acilan_sayfa_form_basmaz()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Account/Protokol"));

        html.ShouldNotContain("data-protocol-form");
        html.ShouldContain("Bu davet bağlantısı geçerli değil");
    }

    [Fact]
    public async Task Gecersiz_jetonla_acilan_sayfa_form_basmaz()
    {
        var html = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync("/Account/Protokol?token=boyle-bir-jeton-yok"));

        html.ShouldNotContain("data-protocol-form");
        html.ShouldContain("Bu davet bağlantısı geçerli değil");
    }

    [Fact]
    public async Task Gecerli_jetonla_belge_ve_onay_formu_basilir()
    {
        var token = await CreateInvitedRequestAsync("Protokol Sayfası Derneği");

        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Account/Protokol?token={token}"));

        // Belge ve kurum bilgisi
        html.ShouldContain("APYA PLATFORMU HİZMET, LİSANS VE DANIŞMANLIK PROTOKOLÜ");
        html.ShouldContain("Protokol Sayfası Derneği");
        html.ShouldContain("Kurumsal Paket");

        // Onay öncesi: zaman damgası/IP/hash HENÜZ YOK.
        html.ShouldContain("onay anında doldurulacaktır");
        html.ShouldNotContain("{{");

        // Form alanları
        html.ShouldContain("data-protocol-form");
        html.ShouldContain("name=\"Input.AcceptAgreement\"");
        html.ShouldContain("name=\"Input.AcceptKvkk\"");
        html.ShouldContain("name=\"Input.Password\"");
        html.ShouldContain("name=\"Input.PasswordConfirm\"");
        html.ShouldContain("__RequestVerificationToken");
    }

    /// <summary>
    /// Kaydırma kapısı JS'e bağlı. Kancalar markup'ta yoksa script hiçbir şey yapmaz ve
    /// kutular baştan açık kalır — görünüşte çalıştığı için gözden kaçar.
    /// </summary>
    [Fact]
    public async Task Kaydirma_kapisinin_kancalari_basilir()
    {
        var token = await CreateInvitedRequestAsync("Kapı Kancası Derneği");

        var html = await GetResponseAsStringAsync($"/Account/Protokol?token={token}");

        html.ShouldContain("data-protocol-doc");
        html.ShouldContain("data-protocol-gate");
        html.ShouldContain("data-protocol-accept");

        // Yol düz metinle aranmaz: ABP demetleme adrese sürüm/minify eki ekliyor.
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Protokol[^""]*\.js")
            .ShouldBeTrue("Kaydırma kapısı betiği sayfaya bağlanmamış.");
    }

    /// <summary>
    /// POST gerçekten çalışıyor mu?
    ///
    /// <para>Bu yol bir kez sessizce kırılmıştı: jeton sayfa özelliği olarak taşınıyor, forma
    /// <c>Input.Token</c> olarak BASILMIYORDU. DTO'daki <c>[Required]</c> daha model bağlama
    /// sırasında düşüyor, handler hiç çalışmıyor ve sayfa hatasız biçimde kendine dönüyordu —
    /// onay hiç kaydedilmiyordu. Yalnız GET ölçen testler bunu KAÇIRDI; tarayıcı QA'inde
    /// yakalandı. Bu test o boşluğu kapatıyor.</para>
    /// </summary>
    [Fact]
    public async Task Onay_gonderimi_hesabi_acar()
    {
        var token = await CreateInvitedRequestAsync("POST Yolu Derneği");

        var pageHtml = await GetResponseAsStringAsync($"/Account/Protokol?token={token}");

        // Jeton forma basılmalı; basılmazsa aşağıdaki POST bağlamada düşer.
        pageHtml.ShouldContain("name=\"Input.Token\"");

        var doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(pageHtml);
        var antiforgery = doc.DocumentNode
            .SelectSingleNode("//input[@name='__RequestVerificationToken']")
            .GetAttributeValue("value", "");

        var response = await Client.PostAsync("/Account/Protokol", new FormUrlEncodedContent(
            new System.Collections.Generic.Dictionary<string, string>
            {
                ["Input.Token"] = token,
                ["Input.AcceptAgreement"] = "true",
                ["Input.AcceptKvkk"] = "true",
                ["Input.Password"] = "Qa!Protokol2026",
                ["Input.PasswordConfirm"] = "Qa!Protokol2026",
                ["__RequestVerificationToken"] = antiforgery
            }));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);
        response.Headers.Location!.ToString().ShouldContain("ProtokolTamam");

        // Jeton yakılmış ve hesap bağlanmış olmalı.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
            var saved = await repository.FirstOrDefaultAsync(r => r.InviteTokenHash == InviteToken.Hash(token));

            saved.ShouldNotBeNull();
            saved!.Status.ShouldBe(RegistrationRequestStatus.AccountCreated);
            saved.TenantId.ShouldNotBeNull();
            saved.InviteUsedAt.ShouldNotBeNull();

            await uow.CompleteAsync();
        }
    }

    /// <summary>
    /// Süresi dolmuş davet, "geçersiz" değil KENDİ mesajını göstermeli: aday ne yapacağını
    /// (yeni bağlantı istemek) ancak böyle anlar.
    /// </summary>
    [Fact]
    public async Task Suresi_dolmus_davet_kendi_mesajini_gosterir()
    {
        var token = InviteToken.Generate();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();

            var request = new RegistrationRequest(
                Guid.NewGuid(), "Süresi Dolmuş", "Müdür",
                $"suresi-dolmus-{Guid.NewGuid():N}@ornek.com", "05551112233",
                "Süresi Dolmuş Derneği", CompanyType.Association,
                Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
                "Adres", SalesPlan.Standard);

            request.SetStatus(RegistrationRequestStatus.Approved);
            request.IssueInvite(InviteToken.Hash(token), DateTime.Now.AddDays(-40), DateTime.Now.AddDays(-10));

            await repository.InsertAsync(request, autoSave: true);
            await uow.CompleteAsync();
        }

        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Account/Protokol?token={token}"));

        html.ShouldContain("süresi dolmuş");
        html.ShouldNotContain("data-protocol-form");
    }
}
