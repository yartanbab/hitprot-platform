using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 1e · Çağrı detayındaki bütçe hesaplayıcısı. Hesap önceden istemcide AYRI bir formülle yapılıyordu:
/// kalem limitini satırın kendi tutarından ve destek oranı uygulamadan kırpıyordu, tavanda satırları
/// kırpmıyordu — firma sihirbazda gördüğünden farklı bir destek rakamı görüyordu. Artık sihirbazla aynı
/// <see cref="GrantBudgetCalculator"/> sunucuda çalışır; oran, limit ve tavan katalogdan okunur.
/// </summary>
public class GrantBudgetEstimate_Tests : PlatformWebTestBase
{
    private readonly IGrantRecommendationAppService _service;

    public GrantBudgetEstimate_Tests()
    {
        _service = GetRequiredService<IGrantRecommendationAppService>();
    }

    /// <summary>Açık çağrının programı: %50 destek, Personel limitsiz, Makine toplam bütçenin %40'ı.</summary>
    private async Task<Guid> ArrangeCallAsync(decimal maxAmount)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = GetRequiredService<IRepository<Grant, Guid>>();
        var costRepo = GetRequiredService<IRepository<GrantEligibleCostItem, Guid>>();

        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null)).First();
        var grant = await grantRepo.GetAsync(call.GrantId);
        grant.SupportRatePercent = 50;
        grant.MaxAmount = maxAmount;
        await grantRepo.UpdateAsync(grant, autoSave: true);

        await costRepo.DeleteManyAsync(await costRepo.GetListAsync(c => c.GrantId == grant.Id), autoSave: true);
        await costRepo.InsertAsync(new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.Personel, null), autoSave: true);
        await costRepo.InsertAsync(new GrantEligibleCostItem(Guid.NewGuid(), grant.Id, GrantCostItemKind.MakineTechizat, 40), autoSave: true);

        await uow.CompleteAsync();
        return call.Id;
    }

    private static EstimateGrantBudgetInput Input(Guid callId, params (GrantCostItemKind Kind, decimal Amount)[] lines)
        => new()
        {
            GrantCallId = callId,
            Lines = lines.Select(l => new GrantBudgetAmountDto { Kind = l.Kind, Amount = l.Amount }).ToList()
        };

    [Fact]
    public async Task Kalem_Limiti_Toplam_Proje_Butcesi_Ve_Destek_Oraniyla_Kirpilir()
    {
        var callId = await ArrangeCallAsync(maxAmount: 0); // 0 = üst limit yok

        var result = await _service.EstimateBudgetAsync(Input(callId,
            (GrantCostItemKind.Personel, 200_000m),
            (GrantCostItemKind.MakineTechizat, 800_000m),
            (GrantCostItemKind.Seyahat, 1_000_000m))); // programda yok → hesaba girmez

        result.TotalProject.ShouldBe(1_000_000m);
        result.Lines.Single(l => l.Kind == GrantCostItemKind.Personel).SupportAmount.ShouldBe(100_000m);

        // Makine: 800.000 × %50 = 400.000; limit 1.000.000 × %40 × %50 = 200.000.
        // Eski istemci hesabı 800.000 × %40 = 320.000 gösteriyordu.
        var makine = result.Lines.Single(l => l.Kind == GrantCostItemKind.MakineTechizat);
        makine.SupportAmount.ShouldBe(200_000m);
        makine.LimitApplied.ShouldBeTrue();

        result.Lines.ShouldNotContain(l => l.Kind == GrantCostItemKind.Seyahat);
        result.TotalSupport.ShouldBe(300_000m);
        result.OwnContribution.ShouldBe(700_000m);
        result.CapApplied.ShouldBeFalse();
    }

    [Fact]
    public async Task Program_Tavani_Asilinca_Satirlar_Da_Oransal_Kirpilir()
    {
        var callId = await ArrangeCallAsync(maxAmount: 150_000m);

        var result = await _service.EstimateBudgetAsync(Input(callId,
            (GrantCostItemKind.Personel, 200_000m),
            (GrantCostItemKind.MakineTechizat, 800_000m)));

        result.CapApplied.ShouldBeTrue();
        result.TotalSupport.ShouldBe(150_000m);
        result.Lines.Sum(l => l.SupportAmount).ShouldBe(150_000m, "satırların toplamı gösterilen toplamı tutmalı");
    }

    [Fact]
    public async Task Katalogda_Acik_Olmayan_Cagri_Icin_Hesap_Yapilmaz()
    {
        await Should.ThrowAsync<EntityNotFoundException>(async () =>
            await _service.EstimateBudgetAsync(Input(Guid.NewGuid(), (GrantCostItemKind.Personel, 1_000m))));
    }

    [Fact]
    public async Task Negatif_Tutar_Dogrulamada_Reddedilir()
    {
        var callId = await ArrangeCallAsync(maxAmount: 0);

        await Should.ThrowAsync<AbpValidationException>(async () =>
            await _service.EstimateBudgetAsync(Input(callId, (GrantCostItemKind.Personel, -1m))));
    }
}
