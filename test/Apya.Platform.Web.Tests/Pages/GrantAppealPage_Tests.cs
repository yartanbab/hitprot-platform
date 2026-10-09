using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 6b · Red &amp; İtiraz. Test host'u host bağlamında koşar (danışman rolü);
/// firma tarafı <c>ICurrentTenant.Change</c> ile okunur.
/// </summary>
public class GrantAppealPage_Tests : PlatformWebTestBase
{
    private readonly IGrantAppealAppService _appeal;
    private readonly ICurrentTenant _currentTenant;

    public GrantAppealPage_Tests()
    {
        _appeal = GetRequiredService<IGrantAppealAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid TenantId, Guid ApplicationId)> SetupAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Itiraz-" + Guid.NewGuid().ToString("N")[..6]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        Guid applicationId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            await appRepo.InsertAsync(application, autoSave: true);
            applicationId = application.Id;
            await uow.CompleteAsync();
        }

        return (tenantId, applicationId);
    }

    private async Task<GrantAppealConsoleDto> RejectAsync(Guid applicationId, int appealDays = 10)
    {
        return await _appeal.SaveDecisionAsync(new SaveGrantDecisionInput
        {
            ApplicationId = applicationId,
            Outcome = GrantDecisionOutcome.Reddedildi,
            DecidedOn = DateTime.Now.Date,
            ReferenceNo = "TYD-2026-1184",
            AppealDeadline = DateTime.Now.Date.AddDays(appealDays)
        });
    }

    /// <summary>
    /// "Bir daha denemek için" önerisi aynı programın açık çağrısıdır. Tarihi geçmiş çağrı durumu
    /// "Açık" kalsa da önerilmemeli — öneri tarihe göre sıralandığı için tam da o seçiliyordu.
    /// </summary>
    [Fact]
    public async Task Sonraki_Cagri_Onerisi_Son_Tarihi_Gecmis_Cagriyi_Atlar()
    {
        var (tenantId, id) = await SetupAsync();

        Guid expiredId, liveId;
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            GrantApplication application;
            using (GetRequiredService<Volo.Abp.MultiTenancy.ICurrentTenant>().Change(tenantId))
            {
                application = await GetRequiredService<IRepository<GrantApplication, Guid>>().GetAsync(id);
            }
            var grantId = (await callRepo.GetAsync(application.GrantCallId)).GrantId;

            var expired = new GrantCall(Guid.NewGuid(), grantId, "2026/8", GrantCallStatus.Acik);
            expired.SetSchedule(null, DateTime.Now.Date.AddDays(-2));
            var live = new GrantCall(Guid.NewGuid(), grantId, "2027/1", GrantCallStatus.Acik);
            live.SetSchedule(null, DateTime.Now.Date.AddDays(1));
            await callRepo.InsertAsync(expired, autoSave: true);
            await callRepo.InsertAsync(live, autoSave: true);
            expiredId = expired.Id;
            liveId = live.Id;
            await uow.CompleteAsync();
        }

        var dto = await _appeal.GetAsync(id);

        dto.NextCallId.ShouldNotBe(expiredId);
        dto.NextCallId.ShouldBe(liveId);
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var (_, id) = await SetupAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Appeal?id={id}");

        html.ShouldContain("apya-ap-layout");
        html.ShouldContain("Kurum gerekçeleri");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Appeal[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Appeal.js içermeli");
    }

    /// <summary>
    /// H-02 · Host boş durumda "kararı gir" der ama düğmesi yoktu; itiraz sonucunu işleyen uç
    /// (ResolveAppealAsync) de UI'sızdı — itiraz istatistiği hiç veri almıyordu.
    /// </summary>
    [Fact]
    public async Task Karar_Girisine_Ve_Itiraz_Sonucuna_Yol_Var()
    {
        var (_, id) = await SetupAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Appeal?id={id}");

        html.ShouldContain($"/Grants/DetailHost?id={id}#decision");
        html.ShouldContain("ResolveBox");
        html.ShouldContain("Kurum itirazı nasıl sonuçlandırdı?");
    }

    [Fact]
    public async Task Karar_Yokken_Ekran_Bos_Doner()
    {
        var (_, id) = await SetupAsync();

        var dto = await _appeal.GetAsync(id);

        dto.DecisionId.ShouldBeNull();
        dto.Items.ShouldBeEmpty();
        dto.CanEditOpinion.ShouldBeTrue("test host'u danışman bağlamında koşar");
    }

    [Fact]
    public async Task Red_Karari_Ve_Itiraz_Penceresi_Kaydedilir()
    {
        var (_, id) = await SetupAsync();

        var dto = await RejectAsync(id);

        dto.Outcome.ShouldBe(GrantDecisionOutcome.Reddedildi);
        dto.ReferenceNo.ShouldBe("TYD-2026-1184");
        dto.IsAppealWindowOpen.ShouldBeTrue();
        dto.AppealDaysLeft.ShouldBe(10);
    }

    [Fact]
    public async Task Suresi_Gecmis_Pencere_Kapalidir()
    {
        var (_, id) = await SetupAsync();

        var dto = await RejectAsync(id, appealDays: -1);

        dto.IsAppealWindowOpen.ShouldBeFalse();
        dto.AppealDaysLeft.ShouldBeNull();
    }

    [Fact]
    public async Task Gerekce_Maddesi_Ve_Danisman_Gorusu_Kaydedilir()
    {
        var (_, id) = await SetupAsync();
        await RejectAsync(id);

        var withItem = await _appeal.AddItemAsync(new AddGrantAppealItemInput
        {
            ApplicationId = id,
            Title = "Teknolojik yenilik düzeyi yeterli bulunmamıştır",
            InstitutionText = "Sunulan çözümün muadillerinden ayrışan özellikleri ortaya konulamamıştır."
        });

        var item = withItem.Items.Single();
        item.Order.ShouldBe(1);
        item.Stance.ShouldBe(GrantAppealStance.Belirsiz);

        var withOpinion = await _appeal.SaveOpinionAsync(new SaveGrantAppealOpinionInput
        {
            ItemId = item.Id,
            Stance = GrantAppealStance.Itiraz,
            Summary = "İtiraz edilebilir.",
            Detail = "Karşılaştırma tablosu ve test raporu elimizde var."
        });

        var updated = withOpinion.Items.Single();
        updated.Stance.ShouldBe(GrantAppealStance.Itiraz);
        updated.OpinionByName.ShouldNotBeNullOrWhiteSpace("görüşü yazan danışmanın adı kopyalanır");
        withOpinion.AppealedCount.ShouldBe(1);
    }

    [Fact]
    public async Task Itiraza_Konu_Madde_Yoksa_Gonderilemez()
    {
        var (_, id) = await SetupAsync();
        await RejectAsync(id);
        var dto = await _appeal.AddItemAsync(new AddGrantAppealItemInput
        {
            ApplicationId = id, Title = "Kapsam dışı kalemler"
        });
        await _appeal.SaveOpinionAsync(new SaveGrantAppealOpinionInput
        {
            ItemId = dto.Items.Single().Id,
            Stance = GrantAppealStance.Kabul,
            Summary = "Kurum haklı."
        });

        // Tek madde de "kabul" ise dosya boş gider; kurum nezdinde güvenilirliği zedeler.
        await Should.ThrowAsync<BusinessException>(async () => await _appeal.SubmitAppealAsync(id));
    }

    [Fact]
    public async Task Itiraz_Gonderilir_Ve_Ikinci_Kez_Gonderilemez()
    {
        var (_, id) = await SetupAsync();
        await RejectAsync(id);
        var dto = await _appeal.AddItemAsync(new AddGrantAppealItemInput
        {
            ApplicationId = id, Title = "Ekip deneyimi belgelenmemiştir"
        });
        await _appeal.SaveOpinionAsync(new SaveGrantAppealOpinionInput
        {
            ItemId = dto.Items.Single().Id,
            Stance = GrantAppealStance.Itiraz,
            Summary = "Usul hatası."
        });

        var submitted = await _appeal.SubmitAppealAsync(id);
        submitted.AppealSubmittedAt.ShouldNotBeNull();
        submitted.IsAppealWindowOpen.ShouldBeFalse("gönderildikten sonra pencere kapanır");

        await Should.ThrowAsync<BusinessException>(async () => await _appeal.SubmitAppealAsync(id));
    }

    [Fact]
    public async Task Onaylanan_Basvuruda_Itiraz_Gonderilemez()
    {
        var (_, id) = await SetupAsync();
        await _appeal.SaveDecisionAsync(new SaveGrantDecisionInput
        {
            ApplicationId = id,
            Outcome = GrantDecisionOutcome.Onaylandi,
            DecidedOn = DateTime.Now.Date
        });

        await Should.ThrowAsync<BusinessException>(async () => await _appeal.SubmitAppealAsync(id));
    }

    [Fact]
    public async Task Ornek_Kucukken_Istatistik_Gosterilmez()
    {
        var (_, id) = await SetupAsync();

        var dto = await RejectAsync(id);

        // 🔴 Birkaç karardan çıkan yüzde güven veriyormuş gibi durup yanlış yönlendirir.
        dto.Stats.HasEnoughData.ShouldBeFalse();
        dto.Stats.AcceptanceRatePercent.ShouldBeNull();
        dto.Stats.SampleSize.ShouldBeLessThan(GrantAppealAppService.MinimumStatsSample);
    }

    [Fact]
    public async Task Firma_Karari_Okur_Ama_Gorus_Yazamaz()
    {
        var (tenantId, id) = await SetupAsync();
        await RejectAsync(id);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _appeal.GetAsync(id);
            dto.Outcome.ShouldBe(GrantDecisionOutcome.Reddedildi);
            dto.CanEditOpinion.ShouldBeFalse("görüş yazmak danışmanın işi");

            await Should.ThrowAsync<Volo.Abp.Authorization.AbpAuthorizationException>(async () =>
                await _appeal.AddItemAsync(new AddGrantAppealItemInput
                {
                    ApplicationId = id, Title = "Firma kendi maddesini ekleyemez"
                }));
        }
    }

    // ── LIF-12 · Danışman görüşü tek pencerede ───────────────────────────────

    /// <summary>
    /// Görüş iki ARDIŞIK istem kutusuyla giriliyordu: önce karar (itiraz / kabul), sonra gerekçe.
    /// İkincisinde vazgeçilince ilk seçim de kayboluyordu ve gerekçe tek satırlık bir kutuya
    /// yazılıyordu (sunucu 2000 karaktere izin verdiği hâlde). Artık ikisi tek pencerede.
    /// </summary>
    [Fact]
    public async Task Gorus_Penceresi_Karari_Ve_Gerekceyi_Birlikte_Sorar()
    {
        var (_, id) = await SetupAsync();

        var doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync($"/Grants/Appeal?id={id}"));

        var modal = doc.DocumentNode.SelectSingleNode("//div[@id='OpinionModal']");
        modal.ShouldNotBeNull("görüş penceresi sayfada yok");

        // Karar: yalnız iki gerçek seçenek (1 = itiraz, 2 = kabul); "görüş yok" seçilemez.
        modal!.SelectNodes(".//select[@id='OpinionStance']/option")!
            .Select(o => o.GetAttributeValue("value", ""))
            .ShouldBe(new[] { "1", "2" });

        // Gerekçe çok satırlı ve sunucudaki sınırla aynı uzunlukta.
        var detail = modal.SelectSingleNode(".//textarea[@id='OpinionDetail']");
        detail.ShouldNotBeNull("gerekçe çok satırlı alan olmalı");
        detail!.GetAttributeValue("maxlength", "").ShouldBe("2000");

        modal.SelectSingleNode(".//button[@id='OpinionSaveBtn']").ShouldNotBeNull();
    }

    /// <summary>
    /// Betik tarafı: istem kutusu hiç kalmadı — görüş de madde de kendi penceresinden giriliyor.
    /// </summary>
    [Fact]
    public void Gorus_Icin_Ardisik_Istem_Kutusu_Kalmadi()
    {
        var script = System.IO.File.ReadAllText(System.IO.Path.Combine(WebProjectRoot(), "Pages", "Grants", "Appeal.js"));

        System.Text.RegularExpressions.Regex.Matches(script, @"abp\.message\.prompt\(").Count
            .ShouldBe(0, "görüş ya da madde girişi istem kutusuna geri dönmüş");
        script.ShouldNotContain("Grants:Appeal:OpinionDetailPrompt", Case.Sensitive);
        script.ShouldContain("#OpinionSaveBtn", Case.Sensitive);
        script.ShouldContain("#ItemSaveBtn", Case.Sensitive);
        // Kurumun ifadesi sunucuya gidiyor; eskiden yalnız başlık gönderiliyordu.
        script.ShouldContain("institutionText: String($('#ItemInstitutionText').val()", Case.Sensitive);
    }

    /// <summary>
    /// LIF-12'nin kalanı: madde tek satırlık istem kutusuyla ekleniyor, kurumun ifadesi hiç
    /// girilemiyordu. Pencere iki alanı da sunucudaki sınırlarla taşır.
    /// </summary>
    [Fact]
    public async Task Madde_Penceresi_Basligi_Ve_Kurum_Ifadesini_Birlikte_Sorar()
    {
        var (_, id) = await SetupAsync();

        var doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync($"/Grants/Appeal?id={id}"));

        var modal = doc.DocumentNode.SelectSingleNode("//div[@id='ItemModal']");
        modal.ShouldNotBeNull("madde penceresi sayfada yok");

        modal!.SelectSingleNode(".//input[@id='ItemTitle']")!
            .GetAttributeValue("maxlength", "").ShouldBe("256");
        modal.SelectSingleNode(".//textarea[@id='ItemInstitutionText']")!
            .GetAttributeValue("maxlength", "").ShouldBe("2000");
        modal.SelectSingleNode(".//button[@id='ItemSaveBtn']").ShouldNotBeNull();

        // Yerelleştirme anahtarı ham basılmamalı.
        modal.InnerText.ShouldNotContain("Grants:Appeal:");
    }

    private static string WebProjectRoot()
    {
        var dir = new System.IO.DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = System.IO.Path.Combine(dir.FullName, "src", "Apya.Platform.Web");
            if (System.IO.Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new System.IO.DirectoryNotFoundException("Apya.Platform.Web proje kökü bulunamadı.");
    }
}
