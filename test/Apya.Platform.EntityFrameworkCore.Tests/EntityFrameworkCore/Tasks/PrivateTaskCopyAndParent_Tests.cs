using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Tasks.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// QA 10-22 · Gizli görev (APYA-22) iki yoldan sızıyordu:
/// <list type="bullet">
/// <item>"Çoğalt" / başka projeye kopyala alt görevleri süzgeçsiz kopyalıyordu; kopya çağıranın olduğu için
/// göremediği gizli alt görevin başlığı, açıklaması ve kontrol listesi ona açılıyordu.</item>
/// <item>Liste ve detay, gizli üst görevin BAŞLIĞINI (ParentTaskTitle) o görevi göremeyen herkese gönderiyordu.</item>
/// </list>
/// Barındırıcı her izne "evet" dediği için gizliyi göremeyen çağıran bürünme oturumuyla kurulur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class PrivateTaskCopyAndParent_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _tasks;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public PrivateTaskCopyAndParent_Tests()
    {
        _tasks = GetRequiredService<ITaskAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    /// <summary>Gizli görevi hiçbir koşulda göremeyen çağıran: bürünme oturumu.</summary>
    private IDisposable AsOutsider() => _principalAccessor.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test")));

    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Kopya gizliliği " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-KGZ" + Guid.NewGuid().ToString("N")[..4], "", 1_000_000m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<TaskItem> NewTaskAsync(string title, bool isPrivate, Guid projectId, Guid? parentId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title, projectId, parentTaskId: parentId,
            description: title + " açıklaması", isPrivate: isPrivate,
            tenantId: _currentTenant.Id, now: _clock.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task Kopyalama_goremedigi_gizli_alt_gorevi_kopyalamaz()
    {
        var projectId = await NewProjectAsync();
        var parent = await NewTaskAsync("Ortak ana iş", isPrivate: false, projectId);
        await NewTaskAsync("Açık alt iş", isPrivate: false, projectId, parent.Id);
        await NewTaskAsync("Gizli alt iş", isPrivate: true, projectId, parent.Id);

        TransferTaskResultDto result;
        using (AsOutsider())
        {
            result = await WithUnitOfWorkAsync(() => _tasks.TransferAsync(parent.Id, new TransferTaskDto
            {
                Mode = TaskTransferMode.Copy,
                TargetProjectIds = new List<Guid> { projectId },
                Include = new TransferTaskIncludeDto { Subtasks = true }
            }));
        }

        var copyId = result.CreatedTaskIds.Single();
        var copiedChildren = await WithUnitOfWorkAsync(() => _taskRepository.GetListAsync(t => t.ParentTaskId == copyId));
        copiedChildren.Select(t => t.Title).ShouldBe(new[] { "Açık alt iş" });
    }

    [Fact]
    public async Task Gorebilen_kopyalayinca_gizli_alt_gorev_de_kopyalanir()
    {
        var projectId = await NewProjectAsync();
        var parent = await NewTaskAsync("Ortak ana iş", isPrivate: false, projectId);
        await NewTaskAsync("Gizli alt iş", isPrivate: true, projectId, parent.Id);

        var result = await WithUnitOfWorkAsync(() => _tasks.TransferAsync(parent.Id, new TransferTaskDto
        {
            Mode = TaskTransferMode.Copy,
            TargetProjectIds = new List<Guid> { projectId },
            Include = new TransferTaskIncludeDto { Subtasks = true }
        }));

        var copyId = result.CreatedTaskIds.Single();
        (await WithUnitOfWorkAsync(() => _taskRepository.GetListAsync(t => t.ParentTaskId == copyId)))
            .Select(t => t.Title).ShouldBe(new[] { "Gizli alt iş" });
    }

    [Fact]
    public async Task Gizli_ust_gorevin_basligi_onu_goremeyene_gitmez()
    {
        var projectId = await NewProjectAsync();
        var parent = await NewTaskAsync("Gizli ana iş başlığı", isPrivate: true, projectId);
        var child = await NewTaskAsync("Açık alt iş", isPrivate: false, projectId, parent.Id);

        using (AsOutsider())
        {
            var list = await WithUnitOfWorkAsync(() => _tasks.GetListAsync(new GetTasksInput { ProjectId = projectId, MaxResultCount = 50 }));
            var row = list.Items.Single(t => t.Id == child.Id);
            row.ParentTaskTitle.ShouldBeNull();

            var detail = await WithUnitOfWorkAsync(() => _tasks.GetAsync(child.Id));
            detail.ParentTaskTitle.ShouldBeNull();
        }

        // Görebilen (gizli görevin sahibi) başlığı görmeye devam eder.
        var own = await WithUnitOfWorkAsync(() => _tasks.GetListAsync(new GetTasksInput { ProjectId = projectId, MaxResultCount = 50 }));
        own.Items.Single(t => t.Id == child.Id).ParentTaskTitle.ShouldBe("Gizli ana iş başlığı");
    }
}
