using System;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Donör &amp; raporlama sekmesinin uygunluk özeti GERÇEKTEN çizilen HTML'de (FIN-07): denetlenemeyen
/// başlık varken sabit olumlu cümle ("… her harcamanın belgesi var …") basılamaz.
/// <para>
/// Test host'u AlwaysAllow + 'en' kültüründe koşar: yetki kilitleri burada görünmez (onlar
/// <see cref="FinanceIndexLocks_Tests"/>'te), yerelleştirilmiş metne de bakılmaz — kültürden
/// bağımsız <c>data-eligibility</c> kancasına ve sabit Türkçe cümleye bakılır. Denetlenemeyen yol
/// tarihsiz projeyle üretilir (izin gerektirmeyen tek yol).
/// </para>
/// </summary>
public class DonorEligibilityPage_Tests : PlatformWebTestBase
{
    private const string PositiveSentence = "her harcamanın belgesi var";

    private async Task<Guid> CreateGrantProjectAsync(string code, bool withDates, bool withDonor = true)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var project = new Project(projectId, null, null, "Donör Denetimi " + code, code,
                "FIN-07 uygunluk özeti", 100_000m, 0m, "TRY",
                startDate: withDates ? new DateTime(2026, 1, 1) : null,
                endDate: withDates ? new DateTime(2026, 12, 31) : null,
                categoryId: ProjectCategoryConsts.SystemIds.GrantProject);
            if (withDonor)
            {
                project.SetFxBridge("EUR", FxPolicy.FixedContract, 0.03m);
            }

            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);
            await uow.CompleteAsync();
        }

        return projectId;
    }

    private async Task<string> DonorTabAsync(Guid projectId)
        => WebUtility.HtmlDecode(await GetResponseAsStringAsync($"/Finance?projectId={projectId}&tab=donor"));

    [Fact]
    public async Task Tarihsiz_projede_olumlu_cumle_basilmaz_denetlenemedi_satiri_cikar()
    {
        var html = await DonorTabAsync(await CreateGrantProjectAsync("FIN07-1", withDates: false));

        html.ShouldContain("data-eligibility=\"unverified\"");
        html.ShouldNotContain(PositiveSentence);
    }

    /// <summary>Regresyon: üç başlık da gerçekten koştu ve temiz → olumlu cümle yine basılır.</summary>
    [Fact]
    public async Task Tarihli_temiz_projede_olumlu_cumle_basilir()
    {
        var html = await DonorTabAsync(await CreateGrantProjectAsync("FIN07-2", withDates: true));

        html.ShouldContain(PositiveSentence);
        html.ShouldNotContain("data-eligibility=\"unverified\"");
    }

    /// <summary>
    /// Donörsüz projede "Kur köprüsünü aç" boş durum kartının eylem yuvasında (CON-14): partial'ın
    /// altına elle konan bağlantı kartın alt dolgusundan kopuyordu.
    /// </summary>
    [Fact]
    public async Task Donorsuz_projede_kur_koprusu_eylemi_bos_durum_kartinda()
    {
        var projectId = await CreateGrantProjectAsync("FIN07-3", withDates: true, withDonor: false);
        var html = await DonorTabAsync(projectId);

        var actions = html.IndexOf("apya-console-state-actions", StringComparison.Ordinal);
        actions.ShouldBeGreaterThan(0, "eylem yuvası yok");
        html.IndexOf($"href=\"/Finance?projectId={projectId}&tab=kur-koprusu\"", actions, StringComparison.Ordinal)
            .ShouldBeGreaterThan(actions, "kur köprüsü bağlantısı eylem yuvasında değil");
    }
}
