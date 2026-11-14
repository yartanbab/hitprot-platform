using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Uçtan uca: host programa parametre ölçütü ekler, kurumun girdiği değer çağrının kovasını ve
/// uygunluk tablosunu belirler. Eş finansman şartı ölçüt eklenmeden, destek oranından doğar.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantParameterCriterion_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.CofinancingCapacityId;
    private static readonly Guid PublicDebt = FirmParameterCatalog.IdOf(34);

    private readonly IGrantParameterCriterionAppService _criteria;
    private readonly IGrantRecommendationAppService _recommendations;
    private readonly IFirmDataAppService _firmData;
    private readonly GrantParameterCriterionManager _manager;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantParameterCriterion_Tests()
    {
        _criteria = GetRequiredService<IGrantParameterCriterionAppService>();
        _recommendations = GetRequiredService<IGrantRecommendationAppService>();
        _firmData = GetRequiredService<IFirmDataAppService>();
        _manager = GetRequiredService<GrantParameterCriterionManager>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid GrantId, Guid CallId)> CreateOpenCallAsync(int? supportRate = null)
    {
        var grant = new Grant(Guid.NewGuid(), "Ölçütlü program", "Kurum", 100_000m, 0) { SupportRatePercent = supportRate };
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await WithUnitOfWorkAsync(async () =>
        {
            await _grantRepository.InsertAsync(grant, autoSave: true);
            await _callRepository.InsertAsync(call, autoSave: true);
        });
        return (grant.Id, call.Id);
    }

    private Task SaveAsync(Guid definitionId, string raw) => _firmData.SaveMineAsync(new SaveFirmDataDto
    {
        Items = { new SaveFirmDataItemDto { DefinitionId = definitionId, RawValue = raw } }
    });

    private static AddGrantParameterCriterionDto NoPublicDebt(Guid grantId, bool eliminating = true) => new()
    {
        GrantId = grantId,
        DefinitionId = PublicDebt,
        Operator = GrantParameterOperator.Esit,
        Value = "false",
        IsEliminating = eliminating
    };

    [Fact]
    public async Task Olcut_eklenince_kurumun_degeri_cagrinin_kovasini_belirler()
    {
        var (grantId, callId) = await CreateOpenCallAsync();
        await _criteria.AddAsync(NoPublicDebt(grantId));

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var unknown = await _recommendations.GetCallDetailAsync(callId);
            unknown.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu, "bilgi girilmemiş: kurum elenmez");
            var row = unknown.ParameterRules.Single();
            row.Code.ShouldBe("has_public_debt");
            row.Outcome.ShouldBe(GrantRuleOutcome.Unknown);
            row.FirmValue.ShouldBeNull();
            row.GrantValue.ShouldBe("false");

            await SaveAsync(PublicDebt, "false");
            (await _recommendations.GetCallDetailAsync(callId)).Bucket.ShouldBe(GrantEligibilityBucket.Uygun);

            await SaveAsync(PublicDebt, "true");
            var failed = await _recommendations.GetCallDetailAsync(callId);
            failed.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
            failed.ParameterRules.Single().FirmValue.ShouldBe("true");

            var card = (await _recommendations.GetOpenCallsAsync()).Single(r => r.GrantCallId == callId);
            card.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
            card.FailedParameter.ShouldBe("Vadesi geçmiş kamu borcu");
        }
    }

    [Fact]
    public async Task Uyari_olcutu_tutmasa_da_kurumu_elemez()
    {
        var (grantId, callId) = await CreateOpenCallAsync();
        await _criteria.AddAsync(NoPublicDebt(grantId, eliminating: false));

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await SaveAsync(PublicDebt, "true");

            var detail = await _recommendations.GetCallDetailAsync(callId);
            detail.Bucket.ShouldBe(GrantEligibilityBucket.Uygun);
            detail.ParameterRules.Single().IsEliminating.ShouldBeFalse();
        }
    }

    [Fact]
    public async Task Es_finansman_sarti_olcut_eklenmeden_destek_oranindan_dogar()
    {
        var (_, callId) = await CreateOpenCallAsync(supportRate: 75);

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var unknown = await _recommendations.GetCallDetailAsync(callId);
            unknown.Bucket.ShouldBe(GrantEligibilityBucket.Kosullu);
            unknown.ParameterRules.Single().Code.ShouldBe(FirmParameterCatalog.CofinancingCapacityCode);
            unknown.ParameterRules.Single().Operator.ShouldBeNull("şart ölçütten değil, programın destek oranından geliyor");
            (await _recommendations.GetOpenCallsAsync()).Single(r => r.GrantCallId == callId)
                .UnknownParameter.ShouldBe("Eş finansman kapasitesi (TL)");

            await SaveAsync(Cofinancing, "150000");
            (await _recommendations.GetCallDetailAsync(callId)).Bucket.ShouldBe(GrantEligibilityBucket.Uygun);

            await SaveAsync(Cofinancing, "0");
            (await _recommendations.GetCallDetailAsync(callId)).Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
        }
    }

    [Fact]
    public async Task Olcutu_olculemeyen_cagri_eksik_veri_sayimina_girer()
    {
        var tenantId = Guid.NewGuid();
        int before;
        using (_currentTenant.Change(tenantId))
        {
            before = (await _firmData.GetMyGapsAsync()).Single(g => g.Code == "has_public_debt").UnlockCount;
        }

        var (grantId, _) = await CreateOpenCallAsync();
        await _criteria.AddAsync(NoPublicDebt(grantId));

        using (_currentTenant.Change(tenantId))
        {
            (await _firmData.GetMyGapsAsync()).Single(g => g.Code == "has_public_debt").UnlockCount.ShouldBe(before + 1);
        }
    }

    [Fact]
    public async Task Ayni_olcut_iki_kez_eklenemez_gecersiz_deger_reddedilir()
    {
        var (grantId, _) = await CreateOpenCallAsync();
        await _criteria.AddAsync(NoPublicDebt(grantId));

        (await Should.ThrowAsync<BusinessException>(() => _criteria.AddAsync(NoPublicDebt(grantId))))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantCriterionDuplicate);

        (await Should.ThrowAsync<BusinessException>(() => _criteria.AddAsync(new AddGrantParameterCriterionDto
        {
            GrantId = grantId,
            DefinitionId = Cofinancing,
            Operator = GrantParameterOperator.EnAz,
            Value = "yüz bin"
        }))).Code.ShouldBe(PlatformDomainErrorCodes.GrantCriterionValueRequired);
    }

    [Fact]
    public async Task Olcut_listesi_ve_eklenebilir_parametreler_host_ekranina_doner_silinebilir()
    {
        var (grantId, _) = await CreateOpenCallAsync(supportRate: 80);
        var data = await _criteria.AddAsync(new AddGrantParameterCriterionDto
        {
            GrantId = grantId,
            DefinitionId = Cofinancing,
            Operator = GrantParameterOperator.EnAz,
            Value = "100000.5"
        });

        data.CoFinancingRatePercent.ShouldBe(20);
        data.Criteria.Single().Value.ShouldBe("100000.5");
        data.Parameters.ShouldContain(p => p.Id == PublicDebt);
        data.Parameters.ShouldNotContain(p => p.Name == "Stratejik hedefler", "serbest metne ölçüt konamaz");

        await _criteria.DeleteAsync(data.Criteria.Single().Id);
        (await _criteria.GetAsync(grantId)).Criteria.ShouldBeEmpty();
    }

    [Fact]
    public async Task Baska_kurumun_satiri_olcut_olarak_okunmaz_ve_katalog_kurumdan_yonetilemez()
    {
        var (grantId, _) = await CreateOpenCallAsync();

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            // Kurum bağlamında yazılmış bir ölçüt satırı (olmamalı ama olursa) hiçbir kurumu etkilememeli.
            await WithUnitOfWorkAsync(async () =>
            {
                var definition = await GetRequiredService<IRepository<FirmParameterDefinition, Guid>>().GetAsync(PublicDebt);
                await GetRequiredService<IRepository<GrantParameterCriterion, Guid>>().InsertAsync(
                    new GrantParameterCriterion(Guid.NewGuid(), grantId, definition, GrantParameterOperator.Esit, null, null, false, true),
                    autoSave: true);
            });
            await Should.ThrowAsync<AbpAuthorizationException>(() => _criteria.GetAsync(grantId));
        }

        (await WithUnitOfWorkAsync(() => _manager.ResolveAsync(grantId))).ShouldBeEmpty();
    }
}
