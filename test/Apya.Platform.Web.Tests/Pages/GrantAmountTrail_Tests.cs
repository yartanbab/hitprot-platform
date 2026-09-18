using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Denetim H-07 · Para olayları iz bırakmıyordu: onaylanan tutar 500 binden 5 milyona çekilse, dilim eklense,
/// silinse ya da ödendi işaretlense akışta tek satır çıkmıyordu; entity geçmişi de hibe tablolarını kapsamıyordu.
/// Artık her para olayı başvurunun akışına (danışmanın gördüğü DetailHost) kim/ne zaman/eski → yeni ile düşer.
/// </summary>
public class GrantAmountTrail_Tests : PlatformWebTestBase
{
    private readonly IGrantApplicationHostAppService _host;
    private readonly IGrantApplicationDetailAppService _detail;
    private readonly IGrantImplementationAppService _impl;

    public GrantAmountTrail_Tests()
    {
        _host = GetRequiredService<IGrantApplicationHostAppService>();
        _detail = GetRequiredService<IGrantApplicationDetailAppService>();
        _impl = GetRequiredService<IGrantImplementationAppService>();
    }

    /// <summary>Kiracı + ödeme aşamasında, 1.000.000 onaylı, 400.000'lik 1. dilimi olan başvuru.</summary>
    private async Task<(Guid ApplicationId, Guid TrancheId)> ArrangeAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await GetRequiredService<ITenantManager>().CreateAsync("Iz-" + Guid.NewGuid().ToString("N")[..6]);
            await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var call = (await GetRequiredService<IRepository<GrantCall, Guid>>()
                .GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            application.AdvanceStage(GrantApplicationStage.Odeme, 1_000_000m);
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

            var tranche = new GrantDisbursementTranche(Guid.NewGuid(), tenantId, application.Id, 1, 400_000m, null);
            await GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>().InsertAsync(tranche, autoSave: true);

            await uow.CompleteAsync();
            return (application.Id, tranche.Id);
        }
    }

    private async Task<GrantDetailActivityDto[]> TrailAsync(Guid applicationId, GrantActivityKind kind) =>
        (await _detail.GetAsync(applicationId)).Activities.Where(a => a.Kind == kind).ToArray();

    [Fact]
    public async Task Onaylanan_Tutar_Degisince_Eski_Ve_Yeni_Deger_Akisa_Duser()
    {
        var (id, _) = await ArrangeAsync();

        await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
        {
            ApplicationId = id, Stage = GrantApplicationStage.Odeme, ApprovedAmount = 5_000_000m
        });
        // Aynı tutar yeniden girilir ya da tutarsız ilerletilirse iz çoğalmaz.
        await _host.AdvanceStageAsync(new AdvanceApplicationStageInput
        {
            ApplicationId = id, Stage = GrantApplicationStage.Odeme, ApprovedAmount = 5_000_000m
        });
        await _host.AdvanceStageAsync(new AdvanceApplicationStageInput { ApplicationId = id, Stage = GrantApplicationStage.Odeme });

        var trail = await TrailAsync(id, GrantActivityKind.ApprovedAmountChanged);
        trail.Length.ShouldBe(1);
        trail[0].Text.ShouldBe("1.000.000 ₺ → 5.000.000 ₺");
        trail[0].ActorName.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Dilim_Eklenmesi_Degismesi_Odenmesi_Ve_Silinmesi_Akisa_Duser()
    {
        var (id, firstId) = await ArrangeAsync();

        var second = await _host.AddTrancheAsync(id, new CreateUpdateTrancheDto { SequenceNo = 2, Amount = 250_000m });
        await _host.UpdateTrancheAsync(second.Id, new CreateUpdateTrancheDto { SequenceNo = 2, Amount = 300_000m });
        await _impl.MarkTranchePaidAsync(firstId);
        await _host.DeleteTrancheAsync(second.Id);

        (await TrailAsync(id, GrantActivityKind.TrancheAdded)).Single().Text.ShouldBe("#2 · 250.000 ₺");
        (await TrailAsync(id, GrantActivityKind.TrancheAmountChanged)).Single().Text.ShouldBe("#2 · 250.000 ₺ → 300.000 ₺");
        (await TrailAsync(id, GrantActivityKind.TranchePaid)).Single().Text.ShouldBe("#1 · 400.000 ₺");
        (await TrailAsync(id, GrantActivityKind.TrancheRemoved)).Single().Text.ShouldBe("#2 · 300.000 ₺");
    }

    [Fact]
    public async Task Dilim_Penceresinden_Odendi_Secilmesi_De_Odeme_Izi_Birakir()
    {
        var (id, firstId) = await ArrangeAsync();

        await _host.UpdateTrancheAsync(firstId, new CreateUpdateTrancheDto
        {
            SequenceNo = 1, Amount = 400_000m, Status = GrantDisbursementTrancheStatus.Odendi
        });

        (await TrailAsync(id, GrantActivityKind.TranchePaid)).Single().Text.ShouldBe("#1 · 400.000 ₺");
        (await TrailAsync(id, GrantActivityKind.TrancheAmountChanged)).ShouldBeEmpty("tutar değişmedi");
    }

    /// <summary>Alan bazlı geçmiş (AbpEntityChanges): fatura ve giderde vardı, hibede yoktu.</summary>
    [Theory]
    [InlineData(typeof(GrantApplication))]
    [InlineData(typeof(GrantDisbursementTranche))]
    [InlineData(typeof(GrantDecision))]
    public void Parasal_Hibe_Kayitlari_Entity_Gecmisinde(Type type)
    {
        var options = GetRequiredService<IOptions<AbpAuditingOptions>>().Value;

        options.EntityHistorySelectors.Any(s => s.Predicate(type)).ShouldBeTrue($"{type.Name} geçmişe yazılmıyor");
    }
}
