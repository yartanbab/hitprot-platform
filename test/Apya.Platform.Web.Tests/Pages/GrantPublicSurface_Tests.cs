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
/// 1f / 1g / 5b / 5a · Kamu yüzeyi ve lead kutusu.
///
/// <para>Asıl risk anonim yüzeyin fazla veri göstermesi: taslak çağrı ya da
/// kiracıya ait kayıt kamuya sızmamalı.</para>
/// </summary>
public class GrantPublicSurface_Tests : PlatformWebTestBase
{
    private readonly IGrantPublicAppService _public;
    private readonly IGrantLeadAppService _leads;
    private readonly ICurrentTenant _currentTenant;

    public GrantPublicSurface_Tests()
    {
        _public = GetRequiredService<IGrantPublicAppService>();
        _leads = GetRequiredService<IGrantLeadAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> OpenCallAsync()
    {
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        return (await repo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
    }

    // ─────────────────────────────────────────── 1f

    [Fact]
    public async Task Arama_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Hibeler");

        html.ShouldContain("apya-pub-hero");
        html.ShouldContain("Türkiye'nin açık hibe çağrıları");
        // Uygulama kabuğu KULLANILMAZ; kenar çubuğu bu sayfada olmamalı.
        html.ShouldNotContain("lpx-nav-menu");
    }

    [Fact]
    public async Task Arama_Yalniz_Yayindaki_Cagrilari_Doner()
    {
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();

        Guid draftId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var open = await OpenCallAsync();
            var draft = new GrantCall(Guid.NewGuid(), open.GrantId, "Taslak dönem", GrantCallStatus.Taslak);
            await repo.InsertAsync(draft, autoSave: true);
            draftId = draft.Id;
            await uow.CompleteAsync();
        }

        var result = await _public.SearchAsync(new GrantPublicSearchInput());

        result.Items.ShouldNotBeEmpty();
        result.Items.ShouldNotContain(i => i.CallId == draftId, "taslak çağrı kamu yüzeyinde görünmemeli");
    }

    [Fact]
    public async Task Taslak_Cagrinin_Detayi_Acilmaz()
    {
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var open = await OpenCallAsync();

        var draft = new GrantCall(Guid.NewGuid(), open.GrantId, "Gizli dönem", GrantCallStatus.Taslak);
        await repo.InsertAsync(draft, autoSave: true);

        await Should.ThrowAsync<BusinessException>(async () => await _public.GetDetailAsync(draft.Id));
    }

    [Fact]
    public async Task Sayaclar_Suzgecten_ONCE_Hesaplanir()
    {
        var all = await _public.SearchAsync(new GrantPublicSearchInput());
        all.IssuerFacets.ShouldNotBeEmpty();

        var issuer = all.IssuerFacets[0].Value;
        var filtered = await _public.SearchAsync(new GrantPublicSearchInput { Issuers = { issuer } });

        // Bir kurum seçilince diğer kurumların sayacı SIFIRLANMAMALI; yoksa panel
        // kullanılamaz hâle gelir.
        filtered.IssuerFacets.Count.ShouldBe(all.IssuerFacets.Count);
        filtered.Items.ShouldAllBe(i => i.Issuer == issuer);
    }

    // ─────────────────────────────────────────── 1g

    [Fact]
    public async Task Detay_Sayfasi_Render_Oluyor()
    {
        var call = await OpenCallAsync();

        var html = await GetResponseAsStringAsync($"/Hibeler/{call.Id}");

        html.ShouldContain("apya-pub-detail");
        html.ShouldContain("Üyelik yok, e-posta yok");
    }

    /// <summary>
    /// Sorular çağrının BEYAN ETTİĞİ şartlardan türer. Sabit beş soru sorulsaydı
    /// çağrının ölçmediği şey de sorulur, cevabı hiçbir sonuca bağlanmazdı.
    /// </summary>
    [Fact]
    public async Task Sorular_Cagriinin_Sartlarindan_Turer()
    {
        var call = await OpenCallAsync();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var grant = await grantRepo.GetAsync(call.GrantId);

        var detail = await _public.GetDetailAsync(call.Id);

        detail.Questions.Select(q => q.Rule).ShouldBeUnique();

        if (grant.RequiresConsortium)
        {
            detail.Questions.ShouldContain(q => q.Rule == GrantEligibilityRule.Consortium);
        }
        else
        {
            detail.Questions.ShouldNotContain(q => q.Rule == GrantEligibilityRule.Consortium,
                "çağrı konsorsiyum istemiyorsa soru sorulmamalı");
        }
    }

    [Fact]
    public async Task Test_Kayit_Acmaz()
    {
        var call = await OpenCallAsync();
        var before = await CountLeadsAsync();

        var result = await _public.EvaluateAsync(new GrantPublicTestInput
        {
            CallId = call.Id,
            Size = CompanySize.Orta,
            CompanyAgeYears = 5,
            RdStaffCount = 3
        });

        result.CallId.ShouldBe(call.Id);
        (await CountLeadsAsync()).ShouldBe(before, "e-posta duvarı yok: test kayıt açmamalı");
    }

    // ─────────────────────────────────────────── talep

    [Fact]
    public async Task Talep_Kaydedilir_Ve_Isi_Hesaplanir()
    {
        var call = await OpenCallAsync();

        var result = await _public.SubmitLeadAsync(NewLead(call.Id, "atlas@test.local"));

        result.LeadId.ShouldNotBe(Guid.Empty);
        result.HeatScore.ShouldBeInRange(0, 100);

        var console = await _leads.GetAsync();
        console.Items.ShouldContain(i => i.Id == result.LeadId);
    }

    /// <summary>Aynı e-posta ve çağrıyla ikinci gönderim MÜKERRER satır açmamalı.</summary>
    [Fact]
    public async Task Ayni_Eposta_Ikinci_Kez_Yeni_Kayit_Acmaz()
    {
        var call = await OpenCallAsync();
        var email = $"tekrar-{Guid.NewGuid():N}@test.local";

        var first = await _public.SubmitLeadAsync(NewLead(call.Id, email));
        var second = await _public.SubmitLeadAsync(NewLead(call.Id, email));

        second.LeadId.ShouldBe(first.LeadId);
    }

    [Fact]
    public async Task Randevu_Tercihi_Kaydedilir()
    {
        var call = await OpenCallAsync();
        var lead = await _public.SubmitLeadAsync(NewLead(call.Id, $"randevu-{Guid.NewGuid():N}@test.local"));

        var prefill = await _public.GetMeetingPrefillAsync(lead.LeadId);
        prefill.FirmName.ShouldNotBeNullOrWhiteSpace();
        prefill.AlreadyRequested.ShouldBeFalse();

        await _public.RequestMeetingAsync(new RequestGrantMeetingInput
        {
            LeadId = lead.LeadId,
            PreferredAt = DateTime.Now.AddDays(3),
            Note = "Öğleden sonra uygunum."
        });

        (await _public.GetMeetingPrefillAsync(lead.LeadId)).AlreadyRequested.ShouldBeTrue();

        var detail = await _leads.GetDetailAsync(lead.LeadId);
        detail.Status.ShouldBe(GrantLeadStatus.RandevuVerildi);
        detail.PreferredMeetingAt.ShouldNotBeNull();
    }

    [Fact]
    public async Task Randevu_Sayfasi_Render_Oluyor()
    {
        var call = await OpenCallAsync();
        var lead = await _public.SubmitLeadAsync(NewLead(call.Id, $"sayfa-{Guid.NewGuid():N}@test.local"));

        var html = await GetResponseAsStringAsync($"/Hibeler/Randevu?lead={lead.LeadId}");

        html.ShouldContain("satış görüşmesi değil");
        // 🔴 Müsaitlik takvimi olmadığı ekranda AÇIKÇA yazmalı.
        html.ShouldContain("Onaylanmış bir randevu saati değildir");
    }

    // ─────────────────────────────────────────── 5a

    [Fact]
    public async Task Lead_Kutusu_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Leads");

        html.ShouldContain("apya-lead-layout");
        html.ShouldContain("Neden nitelikli");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Leads[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Leads.js içermeli");
    }

    /// <summary>
    /// 🔴 Oran örneklem küçükken GÖSTERİLMEZ: üç talepten çıkan "%64" güven
    /// veriyormuş gibi durup yanlış yönlendirir (6b ile aynı ilke).
    /// </summary>
    [Fact]
    public async Task Orneklem_Kucukse_Oran_Gosterilmez()
    {
        var console = await _leads.GetAsync();

        if (console.QualifiedCount < GrantLeadAppService.MinimumRateSample)
        {
            console.MeetingRatePercent.ShouldBeNull();
        }
    }

    [Fact]
    public async Task Talep_Musteriye_Donusturulur_Ve_Profil_Dolar()
    {
        var call = await OpenCallAsync();
        var lead = await _public.SubmitLeadAsync(NewLead(call.Id, $"donus-{Guid.NewGuid():N}@test.local"));

        var result = await _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.LeadId });

        result.TenantId.ShouldNotBe(Guid.Empty);
        result.ProfileCompletionPercent.ShouldBeGreaterThan(0, "test cevapları profile aktarılmalı");

        // Profil KİRACININ bağlamında yazılmış olmalı; host'ta yazılsaydı firma
        // kendi profilini göremezdi.
        using (_currentTenant.Change(result.TenantId))
        {
            var profiles = await GetRequiredService<IRepository<FirmProfile, Guid>>().GetListAsync();
            profiles.ShouldNotBeEmpty();
        }

        var detail = await _leads.GetDetailAsync(lead.LeadId);
        detail.IsConverted.ShouldBeTrue();

        // İkinci dönüştürme reddedilir.
        await Should.ThrowAsync<BusinessException>(async () =>
            await _leads.ConvertToTenantAsync(new ConvertGrantLeadInput { LeadId = lead.LeadId }));
    }

    [Fact]
    public async Task Lead_Kutusu_Kiraci_Baglamindan_Erisilemez()
    {
        var tenantId = await CreateTenantAsync();

        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<Volo.Abp.Authorization.AbpAuthorizationException>(
                async () => await _leads.GetAsync());
        }
    }

    // ─────────────────────────────────────────── kurulum

    private static SubmitGrantLeadInput NewLead(Guid callId, string email) => new()
    {
        CallId = callId,
        FirmName = "Atlas Makine A.Ş.",
        ContactName = "Ozan Yıldız",
        ContactTitle = "Ar-Ge Müdürü",
        Email = email,
        Phone = "0532 000 00 00",
        Answers = new GrantPublicTestInput
        {
            CallId = callId,
            Size = CompanySize.Orta,
            CompanyAgeYears = 6,
            RdStaffCount = 3,
            Trl = 3,
            AnnualRevenue = 40_000_000m,
            HasConsortiumPartner = false
        }
    };

    /// <summary>Repo okuması kendi UoW'unda yapılır; dışarıda bağlam kapanmış olabiliyor.</summary>
    private async Task<long> CountLeadsAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var count = await GetRequiredService<IRepository<GrantLead, Guid>>().CountAsync();
        await uow.CompleteAsync();
        return count;
    }

    private async Task<Guid> CreateTenantAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();

        using var uow = uowManager.Begin(requiresNew: true);
        var tenant = await tenantManager.CreateAsync("Kamu-" + Guid.NewGuid().ToString("N")[..6]);
        await tenantRepo.InsertAsync(tenant, autoSave: true);
        await uow.CompleteAsync();
        return tenant.Id;
    }
}
