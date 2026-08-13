using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Liste şeridi sayaçları. Barlar aynı zamanda filtre düğmesi olduğu için sayı,
/// bara basınca GetListAsync'ten dönecek adetle AYNI olmak zorunda — testler bu
/// eşdeğerliği doğrular, yalnız sayının "makul" olmasını değil.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Summary_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly Guid _projectId = Guid.NewGuid();

    public TaskAppService_Summary_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<TaskItem> CreateAsync(
        string title,
        DateTime? dueDate = null,
        Apya.Platform.Tasks.TaskStatus? status = null,
        Guid? projectId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(),
            title,
            projectId: projectId ?? _projectId,
            dueDate: dueDate,
            tenantId: _currentTenant.Id,
            now: DateTime.Now);

        if (status.HasValue)
        {
            task.ChangeStatus(status.Value, DateTime.Now);
        }

        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    [Fact]
    public async Task Gecikmis_sayaci_ayni_filtrenin_sonuc_adediyle_ayni()
    {
        var today = DateTime.Now.Date;
        await CreateAsync("Dün biten açık", dueDate: today.AddDays(-1));
        await CreateAsync("Çok gecikmiş açık", dueDate: today.AddDays(-30));
        // Kapanmış görev gecikmiş SAYILMAZ
        await CreateAsync("Dün biten ama tamamlanmış", dueDate: today.AddDays(-1),
            status: Apya.Platform.Tasks.TaskStatus.Done);
        // Bugün biten gecikmiş DEĞİL (sınır: dün 23:59:59)
        await CreateAsync("Bugün biten", dueDate: today);

        var summary = await _taskAppService.GetSummaryAsync(new GetTasksInput { ProjectId = _projectId });

        // İstemcinin "Gecikmiş" chip'inin kurduğu girdinin AYNISI
        var list = await _taskAppService.GetListAsync(new GetTasksInput
        {
            ProjectId = _projectId,
            Statuses = new() { Apya.Platform.Tasks.TaskStatus.Todo, Apya.Platform.Tasks.TaskStatus.InProgress, Apya.Platform.Tasks.TaskStatus.InReview },
            MaxDueDate = today.AddSeconds(-1),
            MaxResultCount = 1000
        });

        summary.Overdue.ShouldBe(2);
        summary.Overdue.ShouldBe((int)list.TotalCount);
    }

    [Fact]
    public async Task Yedi_gun_sayaci_ayni_filtrenin_sonuc_adediyle_ayni()
    {
        var today = DateTime.Now.Date;
        await CreateAsync("Bugün biten", dueDate: today);
        await CreateAsync("3 gün sonra", dueDate: today.AddDays(3));
        await CreateAsync("7. gün sonu", dueDate: today.AddDays(7).AddHours(23));
        // Sınır dışı: 8. gün
        await CreateAsync("8 gün sonra", dueDate: today.AddDays(8));
        // Kapanmış sayılmaz
        await CreateAsync("3 gün sonra ama iptal", dueDate: today.AddDays(3),
            status: Apya.Platform.Tasks.TaskStatus.Cancelled);

        var summary = await _taskAppService.GetSummaryAsync(new GetTasksInput { ProjectId = _projectId });

        var list = await _taskAppService.GetListAsync(new GetTasksInput
        {
            ProjectId = _projectId,
            Statuses = new() { Apya.Platform.Tasks.TaskStatus.Todo, Apya.Platform.Tasks.TaskStatus.InProgress, Apya.Platform.Tasks.TaskStatus.InReview },
            MinDueDate = today,
            MaxDueDate = today.AddDays(8).AddSeconds(-1),
            MaxResultCount = 1000
        });

        summary.DueIn7Days.ShouldBe(3);
        summary.DueIn7Days.ShouldBe((int)list.TotalCount);
    }

    [Fact]
    public async Task Toplam_ve_tamamlanan_ilerleme_cubugunu_besler()
    {
        await CreateAsync("Açık 1");
        await CreateAsync("Açık 2");
        await CreateAsync("Biten", status: Apya.Platform.Tasks.TaskStatus.Done);

        var summary = await _taskAppService.GetSummaryAsync(new GetTasksInput { ProjectId = _projectId });

        summary.Total.ShouldBe(3);
        summary.Done.ShouldBe(1);
    }

    [Fact]
    public async Task Sayaclar_chip_filtrelerinden_ETKILENMEZ()
    {
        var today = DateTime.Now.Date;
        await CreateAsync("Gecikmiş açık", dueDate: today.AddDays(-2));
        await CreateAsync("Tamamlanmış", status: Apya.Platform.Tasks.TaskStatus.Done);

        // Girdide "yalnız Tamamlandı" filtresi olsa bile Gecikmiş sayacı düşmemeli —
        // aksi halde bar, kendi filtresini uygulayınca 0 gösterip anlamsızlaşır.
        var summary = await _taskAppService.GetSummaryAsync(new GetTasksInput
        {
            ProjectId = _projectId,
            Statuses = new() { Apya.Platform.Tasks.TaskStatus.Done }
        });

        summary.Overdue.ShouldBe(1);
        summary.Total.ShouldBe(2);
    }

    [Fact]
    public async Task RootOnly_sayimi_etkilemez_alt_gorevler_de_sayilir()
    {
        var parent = await CreateAsync("Kök");
        await CreateAsync("Alt", projectId: _projectId);
        var child = new TaskItem(Guid.NewGuid(), "Gerçek alt görev",
            projectId: _projectId, parentTaskId: parent.Id,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(child, autoSave: true);

        var summary = await _taskAppService.GetSummaryAsync(
            new GetTasksInput { ProjectId = _projectId, RootOnly = true });

        summary.Total.ShouldBe(3);
    }

    [Fact]
    public async Task Baska_projenin_gorevleri_kapsama_girmez()
    {
        await CreateAsync("Bu projede");
        await CreateAsync("Başka projede", projectId: Guid.NewGuid());

        var summary = await _taskAppService.GetSummaryAsync(new GetTasksInput { ProjectId = _projectId });

        summary.Total.ShouldBe(1);
    }
}
