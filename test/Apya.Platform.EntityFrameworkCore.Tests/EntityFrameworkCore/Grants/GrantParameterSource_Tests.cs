using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 10b · "Nereden geldi": programın bugünkü şart değeri son taslak çağrının resmî metninden
/// okunan değerle karşılaştırılır. Çelişkide host metne dönebilir ya da kendi değerini korur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantParameterSource_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantParameterAppService _service;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantDraftField, Guid> _fieldRepository;

    public GrantParameterSource_Tests()
    {
        _service = GetRequiredService<IGrantParameterAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _fieldRepository = GetRequiredService<IRepository<GrantDraftField, Guid>>();
    }

    private async Task<Grant> CreateGrantAsync(Action<Grant> setup)
    {
        var grant = new Grant(Guid.NewGuid(), "Kaynak Programı " + Guid.NewGuid().ToString("N")[..6], "Kurum", 0m, 0);
        setup(grant);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        return grant;
    }

    private async Task<GrantCall> CreateCallWithFieldsAsync(Guid grantId, string period,
        params (string Key, string Value, GrantDraftFieldStatus Status)[] fields)
    {
        var call = new GrantCall(Guid.NewGuid(), grantId, period, GrantCallStatus.Taslak);
        await _callRepository.InsertAsync(call, autoSave: true);
        foreach (var (key, value, status) in fields)
        {
            await _fieldRepository.InsertAsync(new GrantDraftField(Guid.NewGuid(), call.Id, key)
            {
                RawValue = value,
                Confidence = 90,
                Status = status
            }, autoSave: true);
        }
        return call;
    }

    private static GrantParameterSource SourceOf(Apya.Platform.Grants.Dtos.GrantParameterDto dto, GrantEligibilityRule rule)
        => dto.RuleSources.Single(s => s.Rule == rule).Source;

    [Fact]
    public async Task Metinle_ayni_deger_kabul_edildiyse_metinden_onaylanmadiysa_onay_bekliyor()
    {
        var grant = await CreateGrantAsync(g =>
        {
            g.MinCompanyAgeYears = 2;
            g.MinTrl = 3;
            g.MaxTrl = 7;
            g.MinStaffCount = 10;
        });
        await CreateCallWithFieldsAsync(grant.Id, "2026/1",
            (GrantTextExtractor.FieldCompanyAge, "2", GrantDraftFieldStatus.Kabul),
            (GrantTextExtractor.FieldTrl, "3-7", GrantDraftFieldStatus.Beklemede));

        var dto = await _service.GetAsync(grant.Id);

        SourceOf(dto, GrantEligibilityRule.CompanyAge).ShouldBe(GrantParameterSource.Metinden);
        SourceOf(dto, GrantEligibilityRule.Trl).ShouldBe(GrantParameterSource.OnayBekliyor);
        // Çıkarıcı personeli hiç okumuyor: kaynağı bilinmiyorsa "metinden" DENMEZ.
        SourceOf(dto, GrantEligibilityRule.StaffCount).ShouldBe(GrantParameterSource.Elle);
        dto.RuleSources.Count.ShouldBe(7);
        dto.DraftFieldCount.ShouldBe(2);
        dto.DraftPendingCount.ShouldBe(1);
    }

    [Fact]
    public async Task Farkli_deger_celiski_uretir_ve_metindeki_degeri_tasir()
    {
        var grant = await CreateGrantAsync(g => g.MinRdStaffCount = 5);
        await CreateCallWithFieldsAsync(grant.Id, "2026/1",
            (GrantTextExtractor.FieldRdStaff, "2", GrantDraftFieldStatus.Kabul));

        var source = (await _service.GetAsync(grant.Id)).RuleSources
            .Single(s => s.Rule == GrantEligibilityRule.RdStaffCount);

        source.Source.ShouldBe(GrantParameterSource.MetindenFarkli);
        source.SourceValues.ShouldNotBeNull();
        source.SourceValues!.MinRdStaffCount.ShouldBe(2);
    }

    [Fact]
    public async Task Kendi_degerini_koru_programa_dokunmaz_ve_uyariyi_kapatir()
    {
        var grant = await CreateGrantAsync(g => g.MinRdStaffCount = 5);
        await CreateCallWithFieldsAsync(grant.Id, "2026/1",
            (GrantTextExtractor.FieldRdStaff, "2", GrantDraftFieldStatus.Kabul));

        var dto = await _service.KeepOwnValueAsync(grant.Id, GrantEligibilityRule.RdStaffCount);

        dto.MinRdStaffCount.ShouldBe(5);
        SourceOf(dto, GrantEligibilityRule.RdStaffCount).ShouldBe(GrantParameterSource.Elle);
        SourceOf(await _service.GetAsync(grant.Id), GrantEligibilityRule.RdStaffCount)
            .ShouldBe(GrantParameterSource.Elle, "karar kalıcı olmalı");
    }

    [Fact]
    public async Task Metne_don_degeri_geri_yazar_ve_kaynagi_metinden_yapar()
    {
        var grant = await CreateGrantAsync(g => g.RequiresConsortium = false);
        await CreateCallWithFieldsAsync(grant.Id, "2026/1",
            (GrantTextExtractor.FieldConsortium, "true", GrantDraftFieldStatus.Beklemede));

        SourceOf(await _service.GetAsync(grant.Id), GrantEligibilityRule.Consortium)
            .ShouldBe(GrantParameterSource.MetindenFarkli);

        var dto = await _service.ApplySourceValueAsync(grant.Id, GrantEligibilityRule.Consortium);

        dto.RequiresConsortium.ShouldBeTrue();
        SourceOf(dto, GrantEligibilityRule.Consortium).ShouldBe(GrantParameterSource.Metinden);
    }

    [Fact]
    public async Task Kaynagi_olmayan_sartta_eylem_reddedilir()
    {
        var grant = await CreateGrantAsync(g => g.MinStaffCount = 10);

        (await Should.ThrowAsync<BusinessException>(
                () => _service.ApplySourceValueAsync(grant.Id, GrantEligibilityRule.StaffCount)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantParameterNoSourceValue);
        (await Should.ThrowAsync<BusinessException>(
                () => _service.KeepOwnValueAsync(grant.Id, GrantEligibilityRule.CompanyAge)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantParameterNoSourceValue);
    }

    [Fact]
    public async Task Karsilastirma_yalniz_son_taslak_cagriya_bakar()
    {
        var grant = await CreateGrantAsync(g => g.MinCompanyAgeYears = 2);
        await CreateCallWithFieldsAsync(grant.Id, "2025/1",
            (GrantTextExtractor.FieldCompanyAge, "5", GrantDraftFieldStatus.Kabul));
        await Task.Delay(20); // CreationTime sıralaması kararlı olsun
        await CreateCallWithFieldsAsync(grant.Id, "2026/1",
            (GrantTextExtractor.FieldCompanyAge, "2", GrantDraftFieldStatus.Kabul));

        SourceOf(await _service.GetAsync(grant.Id), GrantEligibilityRule.CompanyAge)
            .ShouldBe(GrantParameterSource.Metinden, "eski dönemin metni bugünkü değerle çelişki üretmemeli");
    }
}
