using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.DemoRequests;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Demo talebi akışının SAYFA sözleşmesi: giriş ekranı adayı doğru kapıya
/// yönlendirir, oturumsuz form render olur, panel kaydı gösterir.
///
/// <para>Test host'u <c>AddAlwaysAllowAuthorization</c> kullanır: panel izin kapısı
/// burada ölçülmez (gerçek kapı <c>[Authorize]</c> ile konur ve izin tohumu
/// DbMigrator tarafından verilir). Buradaki iddialar YAPI hakkındadır — Razor,
/// DI ve tag-helper hataları bu suite'te yakalanır.</para>
/// </summary>
public class DemoRequestPages_Tests : PlatformWebTestBase
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

    private async Task<Guid> CreateDemoRequestAsync(string fullName, string company)
    {
        var id = Guid.NewGuid();

        // Web test tabanında WithUnitOfWorkAsync yok — UoW elle açılır.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<DemoRequest, Guid>>();

            await repository.InsertAsync(
                new DemoRequest(
                    id,
                    fullName,
                    company,
                    "aday@ornek.com",
                    "05551112233",
                    DemoRequestOrganizationKind.Association,
                    DemoRequestCompanySize.From11To50,
                    "Projects,Grants",
                    "Hibe takibi için bakıyoruz."),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return id;
    }

    /// <summary>
    /// Self-servis kayıt kapatıldı: giriş ekranı artık kayıt sayfasına DEĞİL demo
    /// talebine götürmeli. Bağlantının geri sızması sessiz bir gerileme olurdu.
    /// </summary>
    [Fact]
    public async Task Giris_ekrani_kayit_yerine_demo_talebine_yonlendirir()
    {
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Account/Login"));

        html.ShouldContain("/Account/DemoRequest");
        html.ShouldContain("Demo talep edin");
        html.ShouldNotContain("/Account/Register");
    }

    [Fact]
    public async Task Demo_formu_oturumsuz_render_olur()
    {
        var html = await GetResponseAsStringAsync("/Account/DemoRequest");

        // Zorunlu alanlar
        html.ShouldContain("name=\"Input.FullName\"");
        html.ShouldContain("name=\"Input.CompanyName\"");
        html.ShouldContain("name=\"Input.Email\"");
        html.ShouldContain("name=\"Input.Phone\"");

        // Seçimlik alanlar ve modül kutuları
        html.ShouldContain("name=\"Input.OrganizationKind\"");
        html.ShouldContain("name=\"Input.CompanySize\"");
        html.ShouldContain("name=\"Input.InterestedModules\"");
        html.ShouldContain("name=\"AcceptKvkk\"");

        // Bal küpü render EDİLMELİ ama ekran dışına atılmış olmalı.
        html.ShouldContain("apya-auth__hp");
        html.ShouldContain("id=\"Website\"");

        // Antiforgery olmadan POST reddedilirdi; token basıldığından emin ol.
        html.ShouldContain("__RequestVerificationToken");
    }

    [Fact]
    public async Task Panel_talebi_ve_takip_alanlarini_gosterir()
    {
        var id = await CreateDemoRequestAsync("Zeynep Demir", "Ege Kalkınma Vakfı");

        // Razor, @-ifadelerinden gelen Türkçe harfleri sayısal varlığa çevirir
        // ("ı" → "&#x131;"), .cshtml'e düz yazılan metni ise çevirmez. Model'den
        // gelen değeri ham HTML'de aramak bu yüzden YANLIŞ negatif verir.
        var html = WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Admin/DemoRequests"));

        html.ShouldContain("Zeynep Demir");
        html.ShouldContain("Ege Kalkınma Vakfı");

        // Durum + iç not: "biz iletişime geçelim" akışının takip yüzeyi.
        html.ShouldContain($"id=\"status-{id}\"");
        html.ShouldContain($"id=\"note-{id}\"");
        html.ShouldContain("İletişime geçildi");

        // Detay satırı çöken bölümle açılıyor.
        html.ShouldContain($"demo-detail-{id}");
    }

    /// <summary>
    /// Panelden "Kaydet" gerçekten yazıyor mu?
    ///
    /// <para>Bu yol bir kez sessizce kırılmıştı: satırdaki durum seçicisi
    /// <c>name="status"</c> iken form, süzgeci korumak için ayrıca <c>Status</c>
    /// gizli alanını taşıyordu. Model bağlama alan adlarında büyük/küçük harfe
    /// DUYARSIZ olduğu için iki değer tek parametreye düşüyor ve bağlama İLKİNİ
    /// alıyordu — gizli alan formda seçiciden önce geldiği için satır, seçilen
    /// duruma değil SÜZGECİN durumuna geçiyordu. (Ölçüldü: süzgeç "Yeni" iken
    /// satırı "İletişime geçildi" yapmak kaydı "Yeni" bırakıyordu.)
    /// Seçici artık <c>newStatus</c>; bu test çakışmanın geri gelmesini engelliyor.</para>
    /// </summary>
    [Fact]
    public async Task Panelden_durum_ve_not_kaydedilir()
    {
        var id = await CreateDemoRequestAsync("Kayit Testi", "Kayit Kurumu");

        var listHtml = await GetResponseAsStringAsync("/Admin/DemoRequests");
        var token = AntiforgeryToken(listHtml);

        // ALAN SIRASI ÖNEMLİ — gerçek formdaki sırayla aynı olmalı: süzgeci koruyan
        // gizli alanlar ÖNCE, satırın seçicisi SONRA gelir. Bağlama aynı adı taşıyan
        // değerlerden İLKİNİ alır; sıra bozulursa çakışma gizlenir ve test yeşil
        // kalırken gerçek sayfa bozulur. Süzgeç bilerek DOLU: hatanın çıktığı durum
        // "listeyi süz, sonra bir satırı kaydet".
        var response = await Client.PostAsync(
            "/Admin/DemoRequests?handler=Update",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["id"] = id.ToString(),
                ["Status"] = nameof(DemoRequestStatus.New),
                ["Filter"] = string.Empty,
                ["PageIndex"] = "1",
                ["newStatus"] = nameof(DemoRequestStatus.Contacted),
                ["adminNote"] = "Arandı, salı 10:00 demo.",
                ["__RequestVerificationToken"] = token
            }));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<DemoRequest, Guid>>();
            var saved = await repository.GetAsync(id);

            saved.Status.ShouldBe(DemoRequestStatus.Contacted);
            saved.AdminNote.ShouldBe("Arandı, salı 10:00 demo.");

            await uow.CompleteAsync();
        }
    }

    [Fact]
    public async Task Panel_bos_susgecte_uyari_basar()
    {
        // Var olmayan bir metinle süzülünce tablo değil bilgilendirme çıkmalı.
        var html = await GetResponseAsStringAsync("/Admin/DemoRequests?Filter=zzz-eslesmeyen-kayit-zzz");

        html.ShouldContain("Bu süzgece uyan demo talebi yok.");
    }
}
