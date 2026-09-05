using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kayıt talebi akışının SAYFA sözleşmesi: giriş ekranı adayı doğru kapıya
/// yönlendirir, oturumsuz sihirbaz render olur, panel kaydı gösterir ve
/// değerlendirme kararı yazılır.
///
/// <para>Test host'u <c>AddAlwaysAllowAuthorization</c> kullanır: panel izin kapısı
/// burada ölçülmez (gerçek kapı <c>[Authorize]</c> ile konur ve izin tohumu
/// DbMigrator tarafından verilir). Buradaki iddialar YAPI hakkındadır — Razor,
/// DI ve tag-helper hataları bu suite'te yakalanır.</para>
/// </summary>
public class RegistrationRequestPages_Tests : PlatformWebTestBase
{
    /// <summary>
    /// Razor'un bastığı antiforgery jetonu. Jeton olmadan POST 400 döner ve
    /// test "kaydetmedi" diye YANLIŞ bir kusur raporlar.
    /// </summary>
    private static string AntiforgeryToken(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");

        return input.GetAttributeValue("value", "");
    }

    private async Task<Guid> CreateRegistrationRequestAsync(
        string fullName,
        string company,
        SalesPlan plan = SalesPlan.Standard)
    {
        var id = Guid.NewGuid();

        // Web test tabanında WithUnitOfWorkAsync yok — UoW elle açılır.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();

            var request = new RegistrationRequest(
                id,
                fullName,
                "Yönetim Kurulu Başkanı",
                "aday@ornek.com",
                "05551112233",
                company,
                CompanyType.Association,
                "1234567890",
                "Merkez Mah. Atatürk Cad. No:1, Küçükçekmece / İstanbul",
                plan);

            request.SetOptionalDetails(
                "Halkalı",
                "info@ornek.com",
                RegistrationRequestCompanySize.From11To50,
                "Mehmet Kaya",
                "05559998877",
                "Hibe takibi için bakıyoruz.");

            await repository.InsertAsync(request, autoSave: true);

            await uow.CompleteAsync();
        }

        return id;
    }

    /// <summary>
    /// Self-servis kayıt kapatıldı: giriş ekranı artık ABP'nin kayıt sayfasına DEĞİL
    /// kayıt talebine götürmeli. Bağlantının geri sızması sessiz bir gerileme olurdu.
    /// </summary>
    [Fact]
    public async Task Giris_ekrani_kayit_yerine_kayit_talebine_yonlendirir()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Account/Login"));

        html.ShouldContain("/Account/RegistrationRequest");
        html.ShouldContain("Kayıt talebi oluşturun");
        html.ShouldNotContain("/Account/Register");
    }

    [Fact]
    public async Task Sihirbaz_oturumsuz_render_olur()
    {
        var html = await GetResponseAsStringAsync("/Account/RegistrationRequest");

        // 1. adım: paket seçimi
        html.ShouldContain("name=\"Input.RequestedPlan\"");

        // 2. adım: kurum kimliği — protokolün istediği alanlar
        html.ShouldContain("name=\"Input.CompanyName\"");
        html.ShouldContain("name=\"Input.CompanyType\"");
        html.ShouldContain("name=\"Input.TaxNumber\"");
        html.ShouldContain("name=\"Input.Address\"");

        // 3. adım: yetkili
        html.ShouldContain("name=\"Input.FullName\"");
        html.ShouldContain("name=\"Input.AuthorizedTitle\"");
        html.ShouldContain("name=\"Input.Email\"");
        html.ShouldContain("name=\"Input.Phone\"");

        // 4. adım: KVKK onayı
        html.ShouldContain("name=\"AcceptKvkk\"");

        // Demo talebi döneminin proje soruları KALDIRILDI; geri sızmamalı.
        html.ShouldNotContain("Input.TargetAudience");
        html.ShouldNotContain("Input.ProblemStatement");
        html.ShouldNotContain("Input.BudgetRange");

        // Bal küpü render EDİLMELİ ama ekran dışına atılmış olmalı.
        html.ShouldContain("apya-auth__hp");
        html.ShouldContain("id=\"Website\"");

        // Antiforgery olmadan POST reddedilirdi; token basıldığından emin ol.
        html.ShouldContain("__RequestVerificationToken");
    }

    /// <summary>
    /// Sihirbaz iskeleti JS'e bağlı. Panellerin ve adım göstergesinin kancaları
    /// markup'ta yoksa script hiçbir şey yapmaz ve form sessizce tek sayfaya döner —
    /// görünüşte çalıştığı için gözden kaçar.
    /// </summary>
    [Fact]
    public async Task Sihirbaz_adim_kancalarini_basar()
    {
        var html = await GetResponseAsStringAsync("/Account/RegistrationRequest");

        html.ShouldContain("data-wizard-form");
        html.ShouldContain("data-wizard-panel=\"1\"");
        html.ShouldContain("data-wizard-panel=\"2\"");
        html.ShouldContain("data-wizard-panel=\"3\"");
        html.ShouldContain("data-wizard-panel=\"4\"");
        html.ShouldContain("data-wizard-next");
        html.ShouldContain("data-wizard-back");
        html.ShouldContain("data-wizard-submit");

        // Yol DÜZ metinle aranmaz: ABP demetleme betiğin adresine sürüm/minify eki
        // ekliyor. Repodaki diğer sayfa testleri de bu yüzden regex kullanıyor.
        System.Text.RegularExpressions.Regex.IsMatch(html, @"RegistrationRequest[^""]*\.js")
            .ShouldBeTrue("Sihirbaz betiği sayfaya bağlanmamış — adımlar çalışmaz.");
    }

    /// <summary>
    /// Üç satış paketi de kartlarıyla görünmeli. Protokolün 3. maddesi bu üçünü
    /// sayar; biri düşerse aday sözleşmede olmayan bir ürün seçmiş olur.
    /// </summary>
    [Fact]
    public async Task Uc_paket_de_secenek_olarak_basilir()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Account/RegistrationRequest"));

        html.ShouldContain("Standart Paket");
        html.ShouldContain("Kurumsal Paket");
        html.ShouldContain("Ortak Paket Sistemi");

        html.ShouldContain("value=\"Standard\"");
        html.ShouldContain("value=\"Corporate\"");
        html.ShouldContain("value=\"Joint\"");
    }

    [Fact]
    public async Task Panel_talebi_ve_degerlendirme_alanlarini_gosterir()
    {
        var id = await CreateRegistrationRequestAsync("Zeynep Demir", "Ege Kalkınma Vakfı", SalesPlan.Corporate);

        // Razor, @-ifadelerinden gelen Türkçe harfleri sayısal varlığa çevirir
        // ("ı" → "&#x131;"), .cshtml'e düz yazılan metni ise çevirmez. Model'den
        // gelen değeri ham HTML'de aramak bu yüzden YANLIŞ negatif verir.
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Admin/RegistrationRequests"));

        html.ShouldContain("Zeynep Demir");
        html.ShouldContain("Ege Kalkınma Vakfı");

        // Kurum kimliği panelde görünmeli — onay kararı buna bakılarak veriliyor.
        html.ShouldContain("1234567890");
        html.ShouldContain("Kurumsal Paket");

        // Değerlendirme yüzeyi: durum, paket, bedel, iç not.
        html.ShouldContain($"id=\"status-{id}\"");
        html.ShouldContain($"id=\"plan-{id}\"");
        html.ShouldContain($"id=\"amount-{id}\"");
        html.ShouldContain($"id=\"note-{id}\"");
        html.ShouldContain("İncelemede");

        // Detay satırı çöken bölümle açılıyor.
        html.ShouldContain($"registration-detail-{id}");
    }

    /// <summary>
    /// Panelden "Kaydet" gerçekten yazıyor mu?
    ///
    /// <para>Bu yol demo talebi panelinde bir kez sessizce kırılmıştı: satırdaki durum
    /// seçicisi <c>name="status"</c> iken form, süzgeci korumak için ayrıca
    /// <c>Status</c> gizli alanını taşıyordu. Model bağlama alan adlarında
    /// büyük/küçük harfe DUYARSIZ olduğu için iki değer tek parametreye düşüyor ve
    /// bağlama İLKİNİ alıyordu — gizli alan formda seçiciden önce geldiği için satır,
    /// seçilen duruma değil SÜZGECİN durumuna geçiyordu. Seçici bu yüzden
    /// <c>newStatus</c>; bu test çakışmanın geri gelmesini engelliyor.</para>
    /// </summary>
    [Fact]
    public async Task Panelden_karar_ve_not_kaydedilir()
    {
        var id = await CreateRegistrationRequestAsync("Kayit Testi", "Kayit Kurumu");

        var listHtml = await GetResponseAsStringAsync("/Admin/RegistrationRequests");
        var token = AntiforgeryToken(listHtml);

        // ALAN SIRASI ÖNEMLİ — gerçek formdaki sırayla aynı olmalı: süzgeci koruyan
        // gizli alanlar ÖNCE, satırın seçicisi SONRA gelir. Süzgeç bilerek DOLU:
        // hatanın çıktığı durum "listeyi süz, sonra bir satırı kaydet".
        var response = await Client.PostAsync(
            "/Admin/RegistrationRequests?handler=Update",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["id"] = id.ToString(),
                ["Status"] = nameof(RegistrationRequestStatus.New),
                ["Filter"] = string.Empty,
                ["PageIndex"] = "1",
                ["newStatus"] = nameof(RegistrationRequestStatus.Approved),
                ["approvedPlan"] = nameof(SalesPlan.Corporate),
                // 🔴 __Invariant ŞART: onsuz tr-TR bağlaması noktayı BİNLİK ayracı
                // sayar ve 24000.50 → 2400050 olur. Gerçek form da bu gizli alanı
                // basıyor; testte atlanırsa çalışan alan bozuk sanılır.
                ["offeredAmount"] = "24000.50",
                ["__Invariant"] = "offeredAmount",
                ["adminNote"] = "Onaylandı, protokol gönderilecek.",
                ["__RequestVerificationToken"] = token
            }));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<RegistrationRequest, Guid>>();
            var saved = await repository.GetAsync(id);

            saved.Status.ShouldBe(RegistrationRequestStatus.Approved);
            saved.ApprovedPlan.ShouldBe(SalesPlan.Corporate);
            saved.OfferedAmount.ShouldBe(24000.50m);
            saved.AdminNote.ShouldBe("Onaylandı, protokol gönderilecek.");

            await uow.CompleteAsync();
        }
    }

    /// <summary>
    /// Panelde basılan bedel, HTML sayı alanının beklediği NOKTALI biçimde olmalı.
    /// Türkçe kültürle basılsaydı ("24.000,50") tarayıcı alanı boş gösterir ve
    /// kaydeden host bedeli sessizce siler.
    /// </summary>
    [Fact]
    public async Task Bedel_alani_noktali_basilir()
    {
        var id = await CreateRegistrationRequestAsync("Bedel Testi", "Bedel Kurumu");

        var listHtml = await GetResponseAsStringAsync("/Admin/RegistrationRequests");
        var token = AntiforgeryToken(listHtml);

        await Client.PostAsync(
            "/Admin/RegistrationRequests?handler=Update",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["id"] = id.ToString(),
                ["Status"] = string.Empty,
                ["Filter"] = string.Empty,
                ["PageIndex"] = "1",
                ["newStatus"] = nameof(RegistrationRequestStatus.Approved),
                ["offeredAmount"] = "18500.75",
                ["__Invariant"] = "offeredAmount",
                ["__RequestVerificationToken"] = token
            }));

        var html = await GetResponseAsStringAsync("/Admin/RegistrationRequests");

        html.ShouldContain("value=\"18500.75\"");
        html.ShouldContain("name=\"__Invariant\" value=\"offeredAmount\"");
        // Kültüre bağlı biçim sızarsa alan tarayıcıda boş görünür.
        html.ShouldNotContain("18.500,75");
    }

    [Fact]
    public async Task Panel_bos_susgecte_uyari_basar()
    {
        // Var olmayan bir metinle süzülünce tablo değil bilgilendirme çıkmalı.
        var html = await GetResponseAsStringAsync("/Admin/RegistrationRequests?Filter=zzz-eslesmeyen-kayit-zzz");

        html.ShouldContain("Bu süzgece uyan kayıt talebi yok.");
    }

    /// <summary>
    /// Talep alındı sayfası sürecin devamını anlatmalı: aday, hesabının hemen
    /// açılmadığını burada öğreniyor. Boş bir "teşekkürler" ekranı, protokol
    /// bağlantısını bekleyen adayı destek hattına yönlendirirdi.
    /// </summary>
    [Fact]
    public async Task Talep_alindi_sayfasi_sonraki_adimlari_anlatir()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Account/RegistrationRequestSent"));

        html.ShouldContain("Talebiniz Alındı");
        html.ShouldContain("protokol");
    }
}
