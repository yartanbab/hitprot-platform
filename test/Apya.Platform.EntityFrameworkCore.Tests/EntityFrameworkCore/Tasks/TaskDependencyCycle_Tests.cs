using System;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// D-1 · Görev kendine ve kendi ardılına (dolaylı da) öncül bağlanamaz; sunucu reddeder. Arayüz bu seçenekleri
/// sunmuyordu ama doğrudan istek döngü kurabiliyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskDependencyCycle_Tests : PlatformEntityFrameworkCoreTestBase
{
    private async Task<Guid> TaskAsync(string title)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<TaskItem, Guid>>()
            .InsertAsync(new TaskItem(id, title, now: DateTime.Today), autoSave: true));
        return id;
    }

    private Task LinkAsync(Guid taskId, Guid predecessorId)
        => WithUnitOfWorkAsync(() => GetRequiredService<IRepository<TaskDependency, Guid>>()
            .InsertAsync(new TaskDependency(Guid.NewGuid(), taskId, predecessorId), autoSave: true));

    private Task EnsureAsync(Guid taskId, params Guid[] predecessors)
        => WithUnitOfWorkAsync(() => GetRequiredService<TaskManager>().EnsureNoDependencyCycleAsync(taskId, predecessors));

    [Fact]
    public async Task Gorev_kendine_baglanamaz()
    {
        var a = await TaskAsync("Analiz");

        var ex = await Should.ThrowAsync<BusinessException>(() => EnsureAsync(a, a));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskDependencySelf);
    }

    [Fact]
    public async Task Dolayli_dongu_reddedilir()
    {
        // Analiz → Tasarım → Uygulama zinciri: Analiz'e Uygulama'yı öncül yapmak döngüdür.
        var analiz = await TaskAsync("Analiz");
        var tasarim = await TaskAsync("Tasarım");
        var uygulama = await TaskAsync("Uygulama");
        await LinkAsync(tasarim, analiz);
        await LinkAsync(uygulama, tasarim);

        var ex = await Should.ThrowAsync<BusinessException>(() => EnsureAsync(analiz, uygulama));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskDependencyCycle);
    }

    [Fact]
    public async Task Gecerli_bag_kabul_edilir()
    {
        var analiz = await TaskAsync("Analiz");
        var tasarim = await TaskAsync("Tasarım");
        var uygulama = await TaskAsync("Uygulama");
        await LinkAsync(tasarim, analiz);

        await Should.NotThrowAsync(() => EnsureAsync(uygulama, tasarim, analiz, analiz));
    }

    [Fact]
    public void Guncelleme_baglari_yazmadan_once_denetler()
    {
        var root = Directory.GetCurrentDirectory();
        while (!File.Exists(Path.Combine(root, "Apya.Platform.slnx"))) { root = Path.GetDirectoryName(root)!; }
        var src = File.ReadAllText(Path.Combine(root, "src", "Apya.Platform.Application", "Tasks", "TaskAppService.cs"));
        var check = src.IndexOf("await _taskManager.EnsureNoDependencyCycleAsync(id, input.PredecessorIds);", StringComparison.Ordinal);
        check.ShouldBeGreaterThan(0);
        check.ShouldBeLessThan(src.IndexOf("await _dependencyRepository.DeleteDirectAsync(x => x.TaskId == id);", StringComparison.Ordinal));
    }
}
