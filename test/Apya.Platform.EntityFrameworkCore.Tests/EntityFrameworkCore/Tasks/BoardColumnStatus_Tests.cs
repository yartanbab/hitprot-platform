using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Özel kanban kolonu bir DURUM gibi işler: her özel kolon bir temel duruma bağlıdır
/// (raporlar onu sayar) ve kart kolona hangi yoldan girerse girsin (pano taşıması,
/// görev detayı/modal kaydı) aynı kural uygulanır — Status kolonun temel durumuna
/// çekilir, özel kolon bağı korunur. Önceden eşlemesiz kolona taşınan kartın durumu
/// değişmiyor, modal yolu eşlemeli özel kolonun bağını düşürüyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class BoardColumnStatus_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IBoardColumnAppService _columnAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<BoardColumn, Guid> _columnRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public BoardColumnStatus_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _columnAppService = GetRequiredService<IBoardColumnAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _columnRepository = GetRequiredService<IRepository<BoardColumn, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(),
            _currentTenant.Id,
            grantId: null,
            name: "Kanban projesi",
            code: "PRJ-" + Guid.NewGuid().ToString("N").Substring(0, 6),
            description: "test");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> CreateTaskAsync(Guid projectId)
    {
        var task = new TaskItem(Guid.NewGuid(), "Kanban görevi", projectId: projectId,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    private async Task<TaskItem> ReadTaskAsync(Guid id)
        => await WithUnitOfWorkAsync(() => _taskRepository.GetAsync(id));

    [Fact]
    public async Task Yeni_ozel_kolon_durum_secilmezse_Suruyor_sayilir()
    {
        var projectId = await CreateProjectAsync();

        var col = await _columnAppService.CreateAsync(new CreateBoardColumnDto { ProjectId = projectId, Name = "Test" });

        col.IsSystem.ShouldBeFalse();
        col.StatusValue.ShouldBe((int)TaskStatus.InProgress);
    }

    [Fact]
    public async Task Ozel_kolona_tasinan_kart_kolonun_durumunu_alir_ve_kolonda_kalir()
    {
        var projectId = await CreateProjectAsync();
        var col = await _columnAppService.CreateAsync(new CreateBoardColumnDto
            { ProjectId = projectId, Name = "Test", StatusValue = (int)TaskStatus.InReview });
        var taskId = await CreateTaskAsync(projectId);

        await _columnAppService.MoveTaskToColumnAsync(taskId, col.Id);

        var task = await ReadTaskAsync(taskId);
        task.Status.ShouldBe(TaskStatus.InReview);
        task.BoardColumnId.ShouldBe(col.Id);
    }

    [Fact]
    public async Task Eslemesiz_eski_ozel_kolon_Suruyor_sayilir()
    {
        var projectId = await CreateProjectAsync();
        // Eşlemesiz eski kayıt (yeni kolon artık hep eşlemeli doğuyor) doğrudan yazılır.
        var legacy = new BoardColumn(Guid.NewGuid(), projectId, "Eski kolon", 9, tenantId: _currentTenant.Id);
        await _columnRepository.InsertAsync(legacy, autoSave: true);
        var taskId = await CreateTaskAsync(projectId);

        await _columnAppService.MoveTaskToColumnAsync(taskId, legacy.Id);

        (await ReadTaskAsync(taskId)).Status.ShouldBe(TaskStatus.InProgress);
        var dto = (await _columnAppService.GetListByProjectAsync(projectId)).Single(c => c.Id == legacy.Id);
        dto.StatusValue.ShouldBe((int)TaskStatus.InProgress);
    }

    [Fact]
    public async Task Gorev_kaydinda_ozel_kolon_secimi_bagi_korur_ve_durumu_hizalar()
    {
        var projectId = await CreateProjectAsync();
        var col = await _columnAppService.CreateAsync(new CreateBoardColumnDto
            { ProjectId = projectId, Name = "Test", StatusValue = (int)TaskStatus.InReview });
        var created = await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Detaydan kaydedilen",
            StartDate = new DateTime(2026, 10, 1),
            ProjectId = projectId,
        });

        await _taskAppService.UpdateAsync(created.Id, new CreateUpdateTaskDto
        {
            Title = created.Title,
            StartDate = new DateTime(2026, 10, 1),
            ProjectId = projectId,
            Status = TaskStatus.Todo,
            BoardColumnId = col.Id,
        });

        var after = await _taskAppService.GetAsync(created.Id);
        after.BoardColumnId.ShouldBe(col.Id);
        after.Status.ShouldBe(TaskStatus.InReview);
        after.BoardColumnName.ShouldBe("Test");
    }

    [Fact]
    public async Task Kolonun_durumundan_cikarilan_kart_kolondan_duser()
    {
        var projectId = await CreateProjectAsync();
        var col = await _columnAppService.CreateAsync(new CreateBoardColumnDto
            { ProjectId = projectId, Name = "Test", StatusValue = (int)TaskStatus.InReview });
        var taskId = await CreateTaskAsync(projectId);
        await _columnAppService.MoveTaskToColumnAsync(taskId, col.Id);

        await _taskAppService.UpdateStatusAsync(taskId, TaskStatus.Done);

        var task = await ReadTaskAsync(taskId);
        task.Status.ShouldBe(TaskStatus.Done);
        task.BoardColumnId.ShouldBeNull();
    }

    [Fact]
    public async Task Ayni_duruma_cekilen_kart_kolonunda_kalir()
    {
        var projectId = await CreateProjectAsync();
        var col = await _columnAppService.CreateAsync(new CreateBoardColumnDto
            { ProjectId = projectId, Name = "Test", StatusValue = (int)TaskStatus.InReview });
        var taskId = await CreateTaskAsync(projectId);
        await _columnAppService.MoveTaskToColumnAsync(taskId, col.Id);

        await _taskAppService.UpdateStatusAsync(taskId, TaskStatus.InReview);

        (await ReadTaskAsync(taskId)).BoardColumnId.ShouldBe(col.Id);
    }

    [Fact]
    public async Task Baska_projenin_kolonuna_tasima_reddedilir()
    {
        var projectA = await CreateProjectAsync();
        var projectB = await CreateProjectAsync();
        var colB = await _columnAppService.CreateAsync(new CreateBoardColumnDto { ProjectId = projectB, Name = "Test" });
        var taskId = await CreateTaskAsync(projectA);

        var ex = await Should.ThrowAsync<BusinessException>(() => _columnAppService.MoveTaskToColumnAsync(taskId, colB.Id));

        ex.Code.ShouldBe("Apya:BoardColumn:CrossProjectMove");
        (await ReadTaskAsync(taskId)).BoardColumnId.ShouldBeNull();
    }
}
