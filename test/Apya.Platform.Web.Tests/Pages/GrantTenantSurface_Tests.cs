using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 1d · 9a · 1e — kiracı hibe yüzeyi. Test host'u AddAlwaysAllowAuthorization kullanır.
/// </summary>
public class GrantTenantSurface_Tests : PlatformWebTestBase
{
    /// <summary>Açık (yayında) bir çağrı bulur; katalog yüzeyleri yalnız bunları gösterir.</summary>
    private async Task<Guid> OpenCallIdAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin();
        var repo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var call = (await repo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).FirstOrDefault();
        call.ShouldNotBeNull("tohum verisinde en az bir açık çağrı olmalı");
        return call!.Id;
    }

    [Fact]
    public async Task Katalog_Sayfasi_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/Catalog");

        html.ShouldContain("apya-bucket-grid");
        html.ShouldContain("Sadece giderilebilir eksikleri göster");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Catalog[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Catalog.js içermeli");
    }

    [Fact]
    public async Task Detay_Sayfasi_Render_Oluyor()
    {
        var id = await OpenCallIdAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Detail?id={id}");

        html.ShouldContain("apya-detail-layout");
        html.ShouldContain("Uygunluk kontrolü");
        html.ShouldContain("Bütçe hesaplayıcı");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Detail[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Detail.js içermeli");
    }

    [Fact]
    public async Task Detay_Id_Verilmezse_Listeye_Yonlendirir()
    {
        var response = await Client.GetAsync("/Grants/Detail");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants");
    }

    [Fact]
    public async Task Katalog_Tum_Acik_Cagrilari_Kova_Ile_Doner()
    {
        var service = GetRequiredService<IGrantRecommendationAppService>();

        var items = await service.GetOpenCallsAsync();

        items.ShouldNotBeEmpty();
        // Hiçbir açık çağrı gizlenmez; her satır bir kovaya düşer ve zorluk taşır.
        items.ShouldAllBe(r => r.Difficulty >= 1 && r.Difficulty <= 5);
        items.Select(r => r.Bucket).Distinct()
            .ShouldAllBe(b => b == GrantEligibilityBucket.Uygun
                              || b == GrantEligibilityBucket.Kosullu
                              || b == GrantEligibilityBucket.UygunDegil);
    }

    [Fact]
    public async Task Sarti_Karsilanamayan_Cagri_UygunDegil_Kovasina_Duser()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var service = GetRequiredService<IGrantRecommendationAppService>();

        var callId = await OpenCallIdAsync();
        Guid grantId;
        using (var uow = uowManager.Begin())
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            grantId = (await callRepo.GetAsync(callId)).GrantId;
            var grant = await grantRepo.GetAsync(grantId);
            // Ölçek şartı koy; host bağlamında firma profili yok → ölçülemez (Koşullu).
            grant.EligibleCompanySizes = (int)CompanySize.Buyuk;
            await grantRepo.UpdateAsync(grant, autoSave: true);
            await uow.CompleteAsync();
        }

        var item = (await service.GetOpenCallsAsync()).Single(r => r.GrantCallId == callId);

        item.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
        item.UnknownRules.ShouldContain(GrantEligibilityRule.CompanySize);
        item.ReasonRule.ShouldBe(GrantEligibilityRule.CompanySize);
        // Eksik veri daima giderilebilir: profili doldurmak yeter.
        item.IsFixable.ShouldBeTrue();
    }

    [Fact]
    public async Task Detay_Uygunluk_Butce_Ve_Zorluk_Doner()
    {
        var service = GetRequiredService<IGrantRecommendationAppService>();
        var id = await OpenCallIdAsync();

        var d = await service.GetCallDetailAsync(id);

        d.GrantCallId.ShouldBe(id);
        d.GrantName.ShouldNotBeNullOrWhiteSpace();
        d.Difficulty.ShouldBeInRange(1, 5);
        d.IsHard.ShouldBe(d.Difficulty >= 4);
        // Eş finansman türetilir, saklanmaz.
        if (d.SupportRatePercent.HasValue)
        {
            d.CoFinancingRatePercent.ShouldBe(100 - d.SupportRatePercent.Value);
        }
        // Skor kırılımı toplam skorla aynı hesaptan gelir.
        d.Score.ShouldBeInRange(0, 100);
        d.ScoreDimensions.ShouldAllBe(x => x.Value >= 0 && x.Value <= 100);
    }

    [Fact]
    public async Task Taslak_Cagrinin_Detayi_Kiraciya_Acilmaz()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var service = GetRequiredService<IGrantRecommendationAppService>();

        Guid draftCallId;
        using (var uow = uowManager.Begin())
        {
            var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var grant = await grantRepo.InsertAsync(
                new Grant(Guid.NewGuid(), "Taslak program", "Kurum", 1000m, 0), autoSave: true);
            var call = await callRepo.InsertAsync(
                new GrantCall(Guid.NewGuid(), grant.Id, "2026/9", GrantCallStatus.Taslak), autoSave: true);
            draftCallId = call.Id;
            await uow.CompleteAsync();
        }

        // 🔴 Modülün temel kuralı: yayınlanmayan çağrı kiracıda YOK sayılır.
        await Should.ThrowAsync<Volo.Abp.Domain.Entities.EntityNotFoundException>(
            () => service.GetCallDetailAsync(draftCallId));

        (await service.GetOpenCallsAsync()).ShouldNotContain(r => r.GrantCallId == draftCallId);
    }

    [Fact]
    public async Task Takip_Isareti_Acilip_Kapanir()
    {
        var service = GetRequiredService<IGrantRecommendationAppService>();
        var id = await OpenCallIdAsync();

        (await service.ToggleBookmarkAsync(id)).ShouldBeTrue();
        (await service.GetOpenCallsAsync()).Single(r => r.GrantCallId == id).IsBookmarked.ShouldBeTrue();

        (await service.ToggleBookmarkAsync(id)).ShouldBeFalse();
        (await service.GetOpenCallsAsync()).Single(r => r.GrantCallId == id).IsBookmarked.ShouldBeFalse();
    }

    [Fact]
    public async Task Profil_Dolulugu_Alan_Doldukca_Artar()
    {
        var service = GetRequiredService<IFirmProfileAppService>();

        var bos = await service.UpdateMyProfileAsync(new UpdateFirmProfileDto());
        bos.CompletionPercent.ShouldBe(0);
        bos.MissingFieldCount.ShouldBe(9);

        var dolu = await service.UpdateMyProfileAsync(new UpdateFirmProfileDto
        {
            Size = CompanySize.Kucuk,
            FoundedOn = new DateTime(2020, 1, 1),
            StaffCount = 40,
            RdStaffCount = 3,
            AnnualRevenue = 10_000_000m,
            Trl = 5,
            HasConsortiumPartner = true,
            Tags =
            {
                new GrantCriteriaTagDto { Kind = GrantCriteriaKind.NaceKodu, Value = "62.01" },
                new GrantCriteriaTagDto { Kind = GrantCriteriaKind.Sektor, Value = "Yazılım" }
            }
        });

        dolu.CompletionPercent.ShouldBe(100);
        dolu.MissingFieldCount.ShouldBe(0);
    }
}
