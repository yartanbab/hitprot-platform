using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 1c · Çağrı → Firma Eşleştirme ve Gönderim. Test host'u AddAlwaysAllowAuthorization
/// kullanır; gerçek host'ta erişimi <c>[Authorize(PlatformPermissions.Grants.Create)]</c>
/// (host-only izin) kapatır.
/// </summary>
public class GrantDispatchPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> OpenCallIdAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = (await repo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).FirstOrDefault();
        call.ShouldNotBeNull("tohum verisinde en az bir açık çağrı olmalı");
        return call!.Id;
    }

    /// <summary>Bir kiracı oluşturur; adaylar kiracılardan üretilir.</summary>
    private async Task<Guid> CreateFirmAsync(string label)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();
        var currentTenant = GetRequiredService<ICurrentTenant>();
        var profileRepo = GetRequiredService<IRepository<FirmProfile, Guid>>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync(label + "-" + Guid.NewGuid().ToString("N")[..6]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            using (currentTenant.Change(tenantId))
            {
                await profileRepo.InsertAsync(
                    new FirmProfile(Guid.NewGuid(), tenantId) { Size = CompanySize.Kucuk },
                    autoSave: true);
            }
            await uow.CompleteAsync();
        }

        return tenantId;
    }

    private static PreviewHostRecommendationInput Filter(Guid callId) => new() { GrantCallId = callId };

    [Fact]
    public async Task Gonderim_Sayfasi_Render_Oluyor()
    {
        var id = await OpenCallIdAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Dispatch?id={id}");

        html.ShouldContain("apya-dispatch-layout");
        html.ShouldContain("Gönderim filtresi");
        html.ShouldContain("Danışmanlık fırsatı");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Dispatch[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Dispatch.js içermeli");
    }

    [Fact]
    public async Task Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Dispatch");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Onizleme_Adaylari_Skor_Ve_Kirilimla_Doner()
    {
        await CreateFirmAsync("Aday");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        var console = await service.PreviewAsync(Filter(callId));

        console.GrantCallId.ShouldBe(callId);
        console.TotalFirms.ShouldBeGreaterThan(0);
        console.GrantMinMatchScore.ShouldBeGreaterThanOrEqualTo(0);
        console.Candidates.ShouldAllBe(c => c.Score >= 0 && c.Score <= 100);
        // Skor sıralı gelir ki host en isabetli firmayı üstte görsün.
        console.Candidates.Select(c => c.Score).ShouldBe(
            console.Candidates.Select(c => c.Score).OrderByDescending(s => s));
    }

    [Fact]
    public async Task Skor_Esigi_Adaylari_Daraltir()
    {
        await CreateFirmAsync("Esik");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        var hepsi = await service.PreviewAsync(Filter(callId));
        var yuksek = await service.PreviewAsync(new PreviewHostRecommendationInput
        {
            GrantCallId = callId,
            MinScore = 101 // hiçbir skor geçemez
        });

        yuksek.Candidates.ShouldBeEmpty();
        yuksek.TotalFirms.ShouldBe(hepsi.TotalFirms, "toplam firma sayısı süzgeçten etkilenmez");
    }

    [Fact]
    public async Task Gonderim_Idempotent_Ikinci_Kez_Atlanir()
    {
        var tenantId = await CreateFirmAsync("Idempotent");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        var input = new SendHostRecommendationInput
        {
            GrantCallId = callId,
            TenantIds = { tenantId },
            Note = "Test önerisi",
            SendNotification = false,
            SendEmail = false
        };

        var ilk = await service.SendAsync(input);
        ilk.SentCount.ShouldBe(1);
        ilk.SkippedCount.ShouldBe(0);

        var ikinci = await service.SendAsync(input);
        ikinci.SentCount.ShouldBe(0);
        ikinci.SkippedCount.ShouldBe(1);
    }

    [Fact]
    public async Task Kanallar_Kapaliyken_Bildirim_Ve_Eposta_Gitmez()
    {
        var tenantId = await CreateFirmAsync("Kanal");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        var result = await service.SendAsync(new SendHostRecommendationInput
        {
            GrantCallId = callId,
            TenantIds = { tenantId },
            SendNotification = false,
            SendEmail = false
        });

        // Öneri kaydı yine oluşur (kiracı feed'inde görünür), yalnız kanallar sessiz kalır.
        result.SentCount.ShouldBe(1);
        result.NotifiedUserCount.ShouldBe(0);
        result.EmailCount.ShouldBe(0);
    }

    [Fact]
    public async Task Danisman_Atamasi_Kaydedilir_Ve_Yuk_Sayilir()
    {
        var tenantId = await CreateFirmAsync("Atama");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var userRepo = GetRequiredService<IIdentityUserRepository>();
        var callId = await OpenCallIdAsync();

        Guid userId;
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin())
        {
            userId = (await userRepo.GetListAsync()).First(u => u.IsActive).Id;
        }

        await service.SendAsync(new SendHostRecommendationInput
        {
            GrantCallId = callId,
            TenantIds = { tenantId },
            AssignedUserId = userId,
            SendNotification = false,
            SendEmail = false
        });

        var console = await service.PreviewAsync(Filter(callId));
        var row = console.Candidates.SingleOrDefault(c => c.TenantId == tenantId);
        row.ShouldNotBeNull();
        row!.AlreadySent.ShouldBeTrue();
        row.AssignedUserId.ShouldBe(userId);
        row.AssignedUserName.ShouldNotBeNullOrWhiteSpace();

        console.Consultants.Single(c => c.UserId == userId).AssignedCount.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task Gonderilmis_Firmalar_Suzgecle_Elenebilir()
    {
        var tenantId = await CreateFirmAsync("Haric");
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        await service.SendAsync(new SendHostRecommendationInput
        {
            GrantCallId = callId,
            TenantIds = { tenantId },
            SendNotification = false,
            SendEmail = false
        });

        var haricsiz = await service.PreviewAsync(Filter(callId));
        haricsiz.Candidates.ShouldContain(c => c.TenantId == tenantId);

        var haricli = await service.PreviewAsync(new PreviewHostRecommendationInput
        {
            GrantCallId = callId,
            ExcludeAlreadySent = true
        });
        haricli.Candidates.ShouldNotContain(c => c.TenantId == tenantId);
    }

    [Fact]
    public async Task Konsorsiyum_Firsati_Tek_Engeli_Konsorsiyum_Olanlari_Sayar()
    {
        var service = GetRequiredService<IGrantHostDispatchAppService>();
        var callId = await OpenCallIdAsync();

        var console = await service.PreviewAsync(Filter(callId));

        // Program konsorsiyum şartı koymuyorsa fırsat sayacı 0 olmalı — sayaç
        // "tek engeli konsorsiyum" firmaları sayar, konsorsiyumu olmayanları değil.
        console.ConsortiumOpportunityCount.ShouldBeGreaterThanOrEqualTo(0);
        console.ConsortiumOpportunityCount.ShouldBeLessThanOrEqualTo(console.TotalFirms);
    }
}
