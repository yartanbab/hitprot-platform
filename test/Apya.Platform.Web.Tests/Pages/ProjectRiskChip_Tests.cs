using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// PRJ-09 · Risk kütüğü yalnız zaman çizelgesi sayfasındaydı; proje konsolunda riske götüren bir
/// köprü yoktu. Konsolun kimlik şeridi artık "N açık risk" rozetiyle kütüğe bağlanır.
/// </summary>
public class ProjectRiskChip_Tests : PlatformWebTestBase
{
    private async Task<Guid> ProjectAsync(int openRisks, int closedRisks)
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Risk rozeti projesi", "RSK-" + Guid.NewGuid().ToString("N")[..8], "");
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);

        var risks = GetRequiredService<IRepository<ProjectRisk, Guid>>();
        for (var i = 0; i < openRisks + closedRisks; i++)
        {
            var risk = new ProjectRisk(Guid.NewGuid(), null, project.Id, "Risk " + (i + 1), 3, 3);
            if (i >= openRisks) { risk.Close(); }
            await risks.InsertAsync(risk, autoSave: true);
        }

        return project.Id;
    }

    private async Task<string> PageAsync(Guid projectId)
        => System.Net.WebUtility.HtmlDecode(await GetResponseAsStringAsync("/Projects/ProjectDetails/" + projectId));

    [Fact]
    public async Task Acik_riski_olan_projenin_konsolu_sayiyi_ve_kutuge_baglantiyi_basar()
    {
        var projectId = await ProjectAsync(openRisks: 2, closedRisks: 1);

        var html = await PageAsync(projectId);

        html.ShouldContain("data-project-risks", Case.Sensitive);
        html.ShouldContain("href=\"/Documents/Timeline?projectId=" + projectId + "\"", Case.Sensitive);
        html.ShouldContain("2 açık risk", Case.Sensitive);
    }

    [Fact]
    public async Task Acik_riski_olmayan_projede_rozet_basilmaz()
    {
        (await PageAsync(await ProjectAsync(openRisks: 0, closedRisks: 2))).ShouldNotContain("data-project-risks", Case.Sensitive);
        (await PageAsync(await ProjectAsync(openRisks: 0, closedRisks: 0))).ShouldNotContain("data-project-risks", Case.Sensitive);
    }
}
