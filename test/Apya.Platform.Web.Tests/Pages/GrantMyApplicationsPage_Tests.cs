using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 6a · Kiracı · Başvurularım. Servis kiracı bağlamında okunur; test host'u host
/// bağlamında koştuğu için okumalar <c>ICurrentTenant.Change</c> ile kiracıya
/// geçirilir — gerçek kullanımdaki filtre davranışının aynısı.
/// </summary>
public class GrantMyApplicationsPage_Tests : PlatformWebTestBase
{
    private readonly IGrantMyApplicationsAppService _mine;
    private readonly ICurrentTenant _currentTenant;

    public GrantMyApplicationsPage_Tests()
    {
        _mine = GetRequiredService<IGrantMyApplicationsAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<(Guid TenantId, Guid ApplicationId)> SetupAsync(
        bool submitted = false, decimal? approved = null, bool withProject = false)
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var tenantManager = GetRequiredService<ITenantManager>();
        var tenantRepo = GetRequiredService<ITenantRepository>();

        Guid tenantId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var tenant = await tenantManager.CreateAsync("Benim-" + Guid.NewGuid().ToString("N")[..6]);
            await tenantRepo.InsertAsync(tenant, autoSave: true);
            tenantId = tenant.Id;
            await uow.CompleteAsync();
        }

        Guid applicationId;
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
            var appRepo = GetRequiredService<IRepository<GrantApplication, Guid>>();
            var trancheRepo = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();

            var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            if (approved.HasValue) { application.AdvanceStage(GrantApplicationStage.Onay, approved); }
            if (submitted) { application.Submit(DateTime.Now); }
            if (withProject) { application.LinkToProject(Guid.NewGuid()); }
            await appRepo.InsertAsync(application, autoSave: true);
            applicationId = application.Id;

            var tranche = new GrantDisbursementTranche(
                Guid.NewGuid(), tenantId, application.Id, 1, 250_000m, DateTime.Now.AddDays(30));
            tranche.MarkPaid();
            await trancheRepo.InsertAsync(tranche, autoSave: true);

            await uow.CompleteAsync();
        }

        return (tenantId, applicationId);
    }

    private async Task<GrantMyApplicationsDto> ReadAsAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            return await _mine.GetAsync();
        }
    }

    [Fact]
    public async Task Sayfa_Render_Oluyor()
    {
        var html = await GetResponseAsStringAsync("/Grants/MyApplications");

        html.ShouldContain("apya-my-kpis");
        html.ShouldContain("Sıradaki iş");
        System.Text.RegularExpressions.Regex.IsMatch(html, @"MyApplications[^""]*\.js")
            .ShouldBeTrue("sayfa demeti MyApplications.js içermeli");
    }

    [Fact]
    public async Task Yalniz_Kendi_Basvurularim_Doner()
    {
        var (mine, mineApp) = await SetupAsync();
        var (other, otherApp) = await SetupAsync();

        var dto = await ReadAsAsync(mine);

        dto.Items.ShouldContain(i => i.Id == mineApp);
        dto.Items.ShouldNotContain(i => i.Id == otherApp,
            "kiracı başka firmanın başvurusunu görmemeli");
    }

    [Fact]
    public async Task Tahsil_Edilen_Tutar_Toplanir()
    {
        var (tenantId, _) = await SetupAsync();

        var dto = await ReadAsAsync(tenantId);

        dto.CollectedAmount.ShouldBe(250_000m, "yalnız ödenmiş dilimler sayılır");
    }

    [Fact]
    public async Task Onaylanan_Tutar_Sayaca_Yansir()
    {
        var (tenantId, _) = await SetupAsync(approved: 1_500_000m);

        var dto = await ReadAsAsync(tenantId);

        dto.ApprovedCount.ShouldBe(1);
        var row = dto.Items.Single();
        row.IsApprovedAmount.ShouldBeTrue();
        row.Amount.ShouldBe(1_500_000m);
    }

    [Fact]
    public async Task Gonderilen_Basvuruda_Sira_Kurumda()
    {
        var (tenantId, _) = await SetupAsync(submitted: true);

        var dto = await ReadAsAsync(tenantId);

        dto.Items.Single().NextAction.ShouldBe(GrantNextAction.WaitingOnInstitution,
            "gönderildikten sonra firmanın yapacağı bir şey yok");
    }

    [Fact]
    public async Task Projeye_Donusen_Basvuru_Kapanmis_Sayilir()
    {
        var (tenantId, _) = await SetupAsync(withProject: true);

        var dto = await ReadAsAsync(tenantId);
        var row = dto.Items.Single();

        row.IsClosed.ShouldBeTrue();
        row.NextAction.ShouldBe(GrantNextAction.InProject);
        row.ProjectId.ShouldNotBeNull();
        dto.OpenCount.ShouldBe(0);
    }

    [Fact]
    public async Task Eksik_Form_Sizden_Bekleniyor_Sayacina_Girer()
    {
        var (tenantId, _) = await SetupAsync();

        var dto = await ReadAsAsync(tenantId);
        var row = dto.Items.Single();

        // Yeni başvuruda proje özeti boş: sıradaki iş firmada.
        row.NextAction.ShouldBeOneOf(GrantNextAction.CompleteForm, GrantNextAction.UploadDocuments);
        dto.WaitingOnYouCount.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task En_Yakin_Son_Tarih_Acik_Basvurulardan_Secilir()
    {
        var (tenantId, _) = await SetupAsync();

        var dto = await ReadAsAsync(tenantId);

        if (dto.Items.Any(i => !i.IsClosed && i.DaysRemaining >= 0))
        {
            dto.NearestDeadlineDays.ShouldNotBeNull();
            dto.NearestDeadlineDays.ShouldBe(
                dto.Items.Where(i => !i.IsClosed && i.DaysRemaining >= 0).Min(i => i.DaysRemaining!.Value));
        }
    }
}
