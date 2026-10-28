using System;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Görevden açılan fatura/gider penceresi bütçe kalemini görevin "Bütçe bağı"ndan önden
/// seçer. Önceden kalem her seferinde yeniden soruluyor, görevinkinden farklı bir kaleme
/// yazılması da sessizce mümkündü. Seçim değiştirilebilir kalır (yalnız ön değer).
/// </summary>
public class TaskBudgetLinePrefill_Tests : PlatformWebTestBase
{
    private async Task<(Guid TaskId, Guid LineId)> CreateTaskWithBudgetLinkAsync()
    {
        var projectId = Guid.NewGuid();
        var lineId = Guid.NewGuid();
        var taskId = Guid.NewGuid();
        var code = "BKON-" + Guid.NewGuid().ToString("N")[..6];

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Kalem ön dolumu " + code, code, "test"), autoSave: true);
        await GetRequiredService<IRepository<ProjectBudgetLine, Guid>>()
            .InsertAsync(new ProjectBudgetLine(lineId, null, projectId, "5.4", "Roll-up", 3_000m, 3_000m), autoSave: true);
        var task = new TaskItem(taskId, "Roll-up bastır", projectId: projectId, now: DateTime.Now);
        task.SetBudgetLink(lineId, 1_000m);
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);
        await uow.CompleteAsync();

        return (taskId, lineId);
    }

    [Theory]
    [InlineData("/Invoices/CreateModal")]
    [InlineData("/Expenses/CreateModal")]
    public async Task Gorevden_acilan_pencere_gorevin_butce_kalemini_onden_secer(string modalUrl)
    {
        var (taskId, lineId) = await CreateTaskWithBudgetLinkAsync();

        var html = await GetResponseAsStringAsync($"{modalUrl}?TaskId={taskId}");

        html.ShouldContain($"selectedLineId: '{lineId}'", Case.Insensitive);
    }
}
