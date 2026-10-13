using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Apya.Platform.Tasks.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// PRJ-04 · Görev iş adımına bağlanır; adımın ilerlemesi bağlı görevlerden hesaplanır.
///
/// <para>Yüzde yalnız elle giriliyordu: görevler ilerlese de adım yerinde sayıyor, ya da adım %100
/// görünürken altında açık iş kalıyordu. Bağlı görevi olmayan adımda elle girilen değer geçerli kalır.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class WorkStepProgressFromTasks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _tasks;
    private readonly IProjectWorkStepAppService _steps;
    private readonly IProjectTimelineAppService _timeline;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;

    public WorkStepProgressFromTasks_Tests()
    {
        _tasks = GetRequiredService<ITaskAppService>();
        _steps = GetRequiredService<IProjectWorkStepAppService>();
        _timeline = GetRequiredService<IProjectTimelineAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
    }

    private async Task<Guid> ProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "İş adımı projesi", "IAP-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> StepAsync(Guid projectId, int manualPercent)
        => (await _steps.CreateAsync(new CreateUpdateProjectWorkStepDto
        {
            ProjectId = projectId, Order = 1, Name = "Saha çalışması", ProgressPercent = manualPercent
        })).Id;

    private async Task<Guid> TaskOnStepAsync(Guid projectId, Guid stepId, TaskStatus status)
    {
        var id = (await _tasks.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Adım görevi", StartDate = new DateTime(2026, 10, 13), ProjectId = projectId
        })).Id;
        await _tasks.SetWorkStepAsync(id, stepId);
        if (status != TaskStatus.Todo)
        {
            await _tasks.UpdateStatusAsync(id, status);
        }
        return id;
    }

    private async Task<ProjectWorkStepDto> ReadStepAsync(Guid projectId, Guid stepId)
        => (await _steps.GetListAsync(projectId)).Single(s => s.Id == stepId);

    [Fact]
    public async Task Bagli_gorevi_olan_adimin_ilerlemesi_gorevlerden_hesaplanir()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId, manualPercent: 90);
        await TaskOnStepAsync(projectId, stepId, TaskStatus.Done);
        await TaskOnStepAsync(projectId, stepId, TaskStatus.InProgress);
        await TaskOnStepAsync(projectId, stepId, TaskStatus.Todo);
        await TaskOnStepAsync(projectId, stepId, TaskStatus.Done);
        // İptal edilen görev ne paya ne paydaya girer.
        await TaskOnStepAsync(projectId, stepId, TaskStatus.Cancelled);

        var step = await ReadStepAsync(projectId, stepId);

        step.ProgressFromTasks.ShouldBeTrue();
        step.TaskCount.ShouldBe(4);
        step.CompletedTaskCount.ShouldBe(2);
        step.ProgressPercent.ShouldBe(50, "elle girilen %90 değil, görevlerden gelen %50");

        // Zaman çizelgesi aynı hesabı okur.
        var timelineStep = (await _timeline.GetAsync(projectId)).Steps.Single(s => s.Id == stepId);
        timelineStep.ProgressPercent.ShouldBe(50);
        timelineStep.ProgressFromTasks.ShouldBeTrue();
    }

    /// <summary>Karşı yön: bağlı görevi olmayan adımda elle girilen yüzde geçerli kalır.</summary>
    [Fact]
    public async Task Bagli_gorevi_olmayan_adimda_elle_girilen_yuzde_gecerlidir()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId, manualPercent: 35);

        var step = await ReadStepAsync(projectId, stepId);

        step.ProgressFromTasks.ShouldBeFalse();
        step.ProgressPercent.ShouldBe(35);
    }

    [Fact]
    public async Task Gorev_baska_projenin_adimina_baglanamaz()
    {
        var projectId = await ProjectAsync();
        var otherStep = await StepAsync(await ProjectAsync(), manualPercent: 0);
        var taskId = (await _tasks.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Yanlış adım", StartDate = new DateTime(2026, 10, 13), ProjectId = projectId
        })).Id;

        (await Should.ThrowAsync<BusinessException>(() => _tasks.SetWorkStepAsync(taskId, otherStep)))
            .Code.ShouldBe(PlatformDomainErrorCodes.TaskWorkStepProjectMismatch);

        (await _taskRepository.GetAsync(taskId)).WorkStepId.ShouldBeNull();
    }

    /// <summary>
    /// Bağ granüler uçtan yazılır; tam güncelleme alanı taşımadığı hâlde bağı SİLMEZ. Görev başka
    /// projeye geçince bağ kalkar (adım proje-kapsamlıdır).
    /// </summary>
    [Fact]
    public async Task Tam_guncelleme_bagi_korur_proje_degisince_bag_kalkar()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId, manualPercent: 0);
        var taskId = await TaskOnStepAsync(projectId, stepId, TaskStatus.Todo);

        await _tasks.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Başlığı değişti", StartDate = new DateTime(2026, 10, 13), ProjectId = projectId
        });
        (await _taskRepository.GetAsync(taskId)).WorkStepId.ShouldBe(stepId);

        await _tasks.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Başlığı değişti", StartDate = new DateTime(2026, 10, 13), ProjectId = await ProjectAsync()
        });
        (await _taskRepository.GetAsync(taskId)).WorkStepId.ShouldBeNull();
    }

    [Fact]
    public async Task Adim_silinince_gorev_silinmez_bagi_kalkar()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId, manualPercent: 0);
        var taskId = await TaskOnStepAsync(projectId, stepId, TaskStatus.Todo);

        await _steps.DeleteAsync(stepId);

        (await _taskRepository.GetAsync(taskId)).WorkStepId.ShouldBeNull();
    }
}
