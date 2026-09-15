using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 21a/22 · Host Çağrılar ekranı. Kart = çağrı + programı. Sayılar Parametreler ekranıyla aynı
/// hesaptan gelmeli — iki ekran aynı program için farklı sayı gösterirse host hangisine inanacağını bilemez.
///
/// <para>Koleksiyondaki diğer testler de kayıt bıraktığı için her test kurum adıyla süzüp kendi kartlarına bakar.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantCallBoard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantCallBoardAppService _board;
    private readonly IGrantParameterAppService _parameters;
    private readonly IGrantInterestAppService _interestAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<FirmProfile, Guid> _profileRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantCallBoard_Tests()
    {
        _board = GetRequiredService<IGrantCallBoardAppService>();
        _parameters = GetRequiredService<IGrantParameterAppService>();
        _interestAppService = GetRequiredService<IGrantInterestAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _profileRepository = GetRequiredService<IRepository<FirmProfile, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static string UniqueIssuer() => "Kurum " + Guid.NewGuid().ToString("N")[..8];

    private async Task<Grant> CreateGrantAsync(string issuer, string name, Action<Grant>? change = null)
    {
        var grant = new Grant(Guid.NewGuid(), name, issuer, maxAmount: 1_000_000m, minMatchScore: 0);
        change?.Invoke(grant);
        return await _grantRepository.InsertAsync(grant, autoSave: true);
    }

    private async Task<GrantCall> CreateCallAsync(Guid grantId, string period, GrantCallStatus status, DateTime? deadline = null)
    {
        var call = new GrantCall(Guid.NewGuid(), grantId, period, status);
        call.SetSchedule(null, deadline);
        return await _callRepository.InsertAsync(call, autoSave: true);
    }

    private async Task<Guid> CreateTenantAsync(string prefix)
    {
        var tenant = await _tenantManager.CreateAsync(prefix + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    private Task<GrantCallBoardDto> BoardAsync(string issuer, GrantCallBoardTab tab, bool closed = false)
        => _board.GetAsync(new GetGrantCallBoardInput { Tab = tab, Closed = closed, Issuer = issuer });

    [Fact]
    public async Task Sekmeler_dogru_cagrilari_ve_cagrisiz_programi_tasir()
    {
        var issuer = UniqueIssuer();
        var grant = await CreateGrantAsync(issuer, "Sekme Programı");
        var open = await CreateCallAsync(grant.Id, "2026/1", GrantCallStatus.Acik, DateTime.Today.AddDays(30));
        var planned = await CreateCallAsync(grant.Id, "2026/2", GrantCallStatus.Planlandi, DateTime.Today.AddDays(90));
        var closedCall = await CreateCallAsync(grant.Id, "2025/2", GrantCallStatus.Kapandi, DateTime.Today.AddDays(-10));
        var draft = await CreateCallAsync(grant.Id, "2027/1", GrantCallStatus.Taslak);
        var callless = await CreateGrantAsync(issuer, "Çağrısız Program");

        var live = await BoardAsync(issuer, GrantCallBoardTab.Live);
        live.Items.Select(c => c.GrantCallId).ShouldBe(new Guid?[] { open.Id, planned.Id }, "yaklaşan son tarih önce");
        live.Items.First().DaysRemaining.ShouldBe(30);

        var closed = await BoardAsync(issuer, GrantCallBoardTab.Live, closed: true);
        closed.Items.Single().GrantCallId.ShouldBe(closedCall.Id);

        var drafts = await BoardAsync(issuer, GrantCallBoardTab.Draft);
        drafts.Items.Count.ShouldBe(2);
        drafts.Items.ShouldContain(c => c.GrantCallId == draft.Id && c.Status == GrantCallStatus.Taslak);
        drafts.Items.ShouldContain(c => c.GrantId == callless.Id && c.GrantCallId == null && c.Status == null);

        // Sekme sayaçları kurum süzgecinden bağımsızdır ve en az bu testin kayıtlarını içerir.
        live.LiveCount.ShouldBeGreaterThanOrEqualTo(2);
        live.ClosedCount.ShouldBeGreaterThanOrEqualTo(1);
        live.DraftCount.ShouldBeGreaterThanOrEqualTo(2);
        live.Issuers.ShouldContain(issuer);
    }

    [Fact]
    public async Task Ilgi_sayisi_geri_cekileni_saymaz()
    {
        var issuer = UniqueIssuer();
        var grant = await CreateGrantAsync(issuer, "İlgi Programı");
        var call = await CreateCallAsync(grant.Id, "2026/1", GrantCallStatus.Acik, DateTime.Today.AddDays(20));
        var keeps = await CreateTenantAsync("Kalan Firma");
        var withdraws = await CreateTenantAsync("Vazgeçen Firma");

        using (_currentTenant.Change(keeps))
        {
            await _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "Sorun" });
        }
        using (_currentTenant.Change(withdraws))
        {
            var interest = await _interestAppService.ExpressAsync(new ExpressGrantInterestInput { GrantCallId = call.Id, Note = "Fikir", ProblemStatement = "Sorun" });
            await _interestAppService.WithdrawAsync(interest.Id);
        }

        var card = (await BoardAsync(issuer, GrantCallBoardTab.Live)).Items.Single();

        card.InterestCount.ShouldBe(1);
        card.CompletionPercent.ShouldBeNull("yüzde yalnız taslak kartta");
    }

    [Fact]
    public async Task Eslesen_firma_parametre_onizlemesiyle_ayni_sayidir()
    {
        var issuer = UniqueIssuer();
        var grant = await CreateGrantAsync(issuer, "Eşleşme Programı", g => g.MinRdStaffCount = 2);
        await CreateCallAsync(grant.Id, "2026/1", GrantCallStatus.Acik, DateTime.Today.AddDays(40));

        var strong = await CreateTenantAsync("Ar-Ge Güçlü");
        using (_currentTenant.Change(strong))
        {
            await _profileRepository.InsertAsync(new FirmProfile(Guid.NewGuid(), strong) { RdStaffCount = 3 }, autoSave: true);
        }

        var card = (await BoardAsync(issuer, GrantCallBoardTab.Live)).Items.Single();
        var preview = await _parameters.PreviewMatchAsync(grant.Id, new UpdateGrantParameterDto
        {
            Name = grant.Name,
            Issuer = issuer,
            MaxAmount = grant.MaxAmount,
            MinRdStaffCount = 2
        });

        card.MatchingFirmCount.ShouldBe(preview.MatchingFirms);
        card.MatchingFirmCount.ShouldNotBeNull();
        card.MatchingFirmCount!.Value.ShouldBeGreaterThanOrEqualTo(1);
    }

    [Fact]
    public async Task Taslak_kartin_tamamlanmasi_parametre_ekraniyla_ayni()
    {
        var issuer = UniqueIssuer();
        var grant = await CreateGrantAsync(issuer, "Tamamlanma Programı", g => g.SupportRatePercent = 70);
        await CreateCallAsync(grant.Id, "2026/1", GrantCallStatus.Taslak);

        var card = (await BoardAsync(issuer, GrantCallBoardTab.Draft)).Items.Single();
        var parameters = await _parameters.GetAsync(grant.Id);

        card.CompletionPercent.ShouldBe(parameters.CompletionPercent);
        card.MissingRequiredFields.ShouldBe(parameters.MissingRequiredFields);
        card.MissingRequiredFields.ShouldNotContain(GrantParameterAppService.FieldSupportRate);
        card.MatchingFirmCount.ShouldBeNull("taslakta firma sayısı hesaplanmaz");
    }

    [Fact]
    public async Task Kiraci_baglaminda_cagri_panosu_okunamaz()
    {
        var tenant = await CreateTenantAsync("Meraklı Firma");

        using (_currentTenant.Change(tenant))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(
                () => _board.GetAsync(new GetGrantCallBoardInput()));
        }
    }
}
