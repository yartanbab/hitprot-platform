using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-14: "itiraz sürecinde" dilim durumu tutardan türemez, elle konur. Servis ucu vardı ama
/// arayüzde çağıran düğme yoktu; durum yalnız rozet olarak görünüyordu.
/// </summary>
public class TrancheDisputeButton_Tests : PlatformWebTestBase
{
    private async Task<Guid> ProjectAsync()
    {
        var projectId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var code = "DSP-" + Guid.NewGuid().ToString("N")[..6];
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, null, null, "Itiraz dugmesi " + code, code, ""), autoSave: true);
            await uow.CompleteAsync();
        }
        return projectId;
    }

    /// <summary>Dilimin kimliğini taşıyan her formun devamı (gizli alanlar kimlikten hemen sonra gelir).</summary>
    private static List<string> FormsOf(string html, Guid trancheId)
    {
        var marker = $"name=\"TrancheId\" value=\"{trancheId}\"";
        var forms = new List<string>();
        for (var i = html.IndexOf(marker, StringComparison.Ordinal); i >= 0;
             i = html.IndexOf(marker, i + marker.Length, StringComparison.Ordinal))
        {
            forms.Add(html.Substring(i, Math.Min(160, html.Length - i)));
        }
        return forms;
    }

    [Fact]
    public async Task Dilim_satirinda_itiraz_isaretleme_ve_kaldirma_dugmesi_cikar()
    {
        var projectId = await ProjectAsync();
        var budget = GetRequiredService<IProjectBudgetAppService>();

        var pending = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 1_000m });
        var disputed = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 2_000m });
        var collected = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 3_000m });

        await budget.SetDisputedAsync(disputed.Id, true);
        await budget.RegisterCollectionAsync(collected.Id, new RegisterCollectionDto
        {
            ReceivedAmount = 3_000m, ReceivedDate = new DateTime(2026, 9, 2)
        });

        var html = WebUtility.HtmlDecode(
            await GetResponseAsStringAsync($"/Finance?projectId={projectId}&tab={FinanceContextTab}"));

        html.ShouldContain("handler=SetTrancheDisputed");

        FormsOf(html, pending.Id).ShouldContain(f => f.Contains("name=\"Disputed\" value=\"true\""),
            "bekleyen dilimde işaretleme düğmesi olmalı");
        FormsOf(html, disputed.Id).ShouldContain(f => f.Contains("name=\"Disputed\" value=\"false\""),
            "itirazdaki dilimde işareti kaldırma düğmesi olmalı");
        FormsOf(html, collected.Id).ShouldNotContain(f => f.Contains("name=\"Disputed\""),
            "tahsil edilmiş dilimde itiraz düğmesi olmamalı");
    }

    [Fact]
    public async Task Isaret_konur_ve_kaldirilinca_durum_tutardan_yeniden_turer()
    {
        var projectId = await ProjectAsync();
        var budget = GetRequiredService<IProjectBudgetAppService>();
        var tranche = await budget.CreateTrancheAsync(projectId, new CreateUpdateTrancheDto { PlannedAmount = 1_000m });

        (await budget.SetDisputedAsync(tranche.Id, true)).Status.ShouldBe(FundingTrancheStatus.Disputed);
        (await budget.SetDisputedAsync(tranche.Id, false)).Status.ShouldBe(FundingTrancheStatus.Pending);
    }

    private const string FinanceContextTab = Apya.Platform.Web.Pages.Finance.FinanceContext.TabTranches;
}
