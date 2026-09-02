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
/// 6c · Uygulama &amp; Tahsilat. Test host'u host bağlamında koşar (danışman);
/// firma tarafı <c>ICurrentTenant.Change</c> ile okunur.
/// </summary>
public class GrantImplementationPage_Tests : PlatformWebTestBase
{
    private readonly IGrantImplementationAppService _impl;
    private readonly ICurrentTenant _currentTenant;

    public GrantImplementationPage_Tests()
    {
        _impl = GetRequiredService<IGrantImplementationAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid TenantId, Guid ApplicationId, Guid TrancheId)> SetupAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Uygulama-" + Guid.NewGuid().ToString("N")[..6]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        Guid applicationId, trancheId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var trancheRepo = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();

            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            application.AdvanceStage(GrantApplicationStage.Odeme, 1_000_000m);
            await appRepo.InsertAsync(application, autoSave: true);
            applicationId = application.Id;

            var tranche = new GrantDisbursementTranche(
                Guid.NewGuid(), tenantId, application.Id, 1, 400_000m, DateTime.Now.AddDays(20));
            await trancheRepo.InsertAsync(tranche, autoSave: true);
            trancheId = tranche.Id;

            await uow.CompleteAsync();
        }

        return (tenantId, applicationId, trancheId);
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var (_, id, _) = await SetupAsync();

        var html = await GetResponseAsStringAsync($"/Grants/Implementation?id={id}");

        html.ShouldContain("apya-im-layout");
        html.ShouldContain("Rapor-dilim zinciri");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"Implementation[^""]*\.js")
            .ShouldBeTrue("sayfa demeti Implementation.js içermeli");
    }

    [Fact]
    public async Task Tahsilat_Ozeti_Hesaplanir()
    {
        var (_, id, trancheId) = await SetupAsync();

        var before = await _impl.GetAsync(id);
        before.ApprovedAmount.ShouldBe(1_000_000m);
        before.CollectedAmount.ShouldBe(0m);
        before.RemainingAmount.ShouldBe(1_000_000m);
        before.CollectedPercent.ShouldBe(0);

        var after = await _impl.MarkTranchePaidAsync(trancheId);
        after.CollectedAmount.ShouldBe(400_000m);
        after.RemainingAmount.ShouldBe(600_000m);
        after.CollectedPercent.ShouldBe(40);
    }

    [Fact]
    public async Task Rapora_Bagli_Dilim_Rapor_Onaylanmadan_Odenemez()
    {
        var (_, id, trancheId) = await SetupAsync();

        var withReport = await _impl.SaveReportAsync(new SaveGrantReportInput
        {
            ApplicationId = id,
            Title = "1. ara rapor",
            DueDate = DateTime.Now.AddDays(15),
            TrancheId = trancheId
        });

        var link = withReport.Chain.Single(c => c.TrancheId == trancheId);
        link.PaymentBlocked.ShouldBeTrue("rapor onaylanmadan ödeme kapalı");

        await Should.ThrowAsync<BusinessException>(async () => await _impl.MarkTranchePaidAsync(trancheId));

        // Rapor onaylanınca ödeme açılır.
        await _impl.SetReportStatusAsync(new SetGrantReportStatusInput
        {
            ReportId = link.ReportId,
            Status = GrantReportStatus.Onaylandi
        });

        var paid = await _impl.MarkTranchePaidAsync(trancheId);
        paid.CollectedAmount.ShouldBe(400_000m);
    }

    [Fact]
    public async Task Rapora_Bagli_Olmayan_Dilim_Dogrudan_Odenir()
    {
        var (_, id, trancheId) = await SetupAsync();

        var dto = await _impl.MarkTranchePaidAsync(trancheId);

        dto.Chain.ShouldContain(c => c.TrancheId == trancheId && c.TrancheStatus == GrantDisbursementTrancheStatus.Odendi);
    }

    [Fact]
    public async Task Rapor_Bolumleri_Ayri_Durum_Tasir()
    {
        var (_, id, _) = await SetupAsync();
        var withReport = await _impl.SaveReportAsync(new SaveGrantReportInput
        {
            ApplicationId = id, Title = "2. ara rapor"
        });
        var reportId = withReport.Chain.First(c => c.ReportId != Guid.Empty).ReportId;

        await _impl.AddSectionAsync(new AddGrantReportSectionInput { ReportId = reportId, Name = "Teknik" });
        var withSections = await _impl.AddSectionAsync(new AddGrantReportSectionInput
        {
            ReportId = reportId, Name = "Mali"
        });

        var sections = withSections.Chain.Single(c => c.ReportId == reportId).Sections;
        sections.Count.ShouldBe(2);

        var updated = await _impl.SetSectionStatusAsync(new SetGrantReportSectionStatusInput
        {
            SectionId = sections.Single(s => s.Name == "Mali").Id,
            Status = GrantReportStatus.Hazirlaniyor,
            Note = "3 fatura eksik"
        });

        var mali = updated.Chain.Single(c => c.ReportId == reportId).Sections.Single(s => s.Name == "Mali");
        mali.Status.ShouldBe(GrantReportStatus.Hazirlaniyor);
        mali.Note.ShouldBe("3 fatura eksik");
    }

    [Fact]
    public async Task Yaklasan_Yukumlulukler_Tarihe_Gore_Siralanir()
    {
        var (_, id, _) = await SetupAsync();
        await _impl.SaveReportAsync(new SaveGrantReportInput
        {
            ApplicationId = id, Title = "Sonuç raporu", DueDate = DateTime.Now.AddDays(45)
        });

        var dto = await _impl.GetAsync(id);

        dto.Obligations.ShouldNotBeEmpty();
        dto.Obligations.Select(o => o.DueDate)
            .ShouldBe(dto.Obligations.Select(o => o.DueDate).OrderBy(d => d));
        dto.Obligations.ShouldContain(o => o.Kind == GrantObligationKind.TrancheDue);
    }

    [Fact]
    public async Task Proje_Yoksa_Butce_Gerceklesmesi_Bos_Doner()
    {
        var (_, id, _) = await SetupAsync();

        var dto = await _impl.GetAsync(id);

        dto.HasProject.ShouldBeFalse();
        dto.Budget.ShouldBeEmpty("harcama kayıtları projede tutulur; proje yoksa gerçekleşme yok");
    }

    [Fact]
    public async Task Firma_Okur_Ama_Rapor_Durumu_Degistiremez()
    {
        var (tenantId, id, _) = await SetupAsync();

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _impl.GetAsync(id);
            dto.ApprovedAmount.ShouldBe(1_000_000m);
            dto.CanManage.ShouldBeFalse("rapor ve tahsilat danışmanın işi");

            await Should.ThrowAsync<Volo.Abp.Authorization.AbpAuthorizationException>(async () =>
                await _impl.SaveReportAsync(new SaveGrantReportInput
                {
                    ApplicationId = id, Title = "Firma raporu"
                }));
        }
    }
}
