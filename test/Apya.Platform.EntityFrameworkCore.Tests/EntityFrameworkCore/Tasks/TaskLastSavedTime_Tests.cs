using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// QA-38 · Görev alt çubuğundaki "Son kayıt" görevin değişiklik zamanını gösterir. Yalnız etiket değişen
/// kayıtta görev satırı değişmediği için saat eski kalıyordu; kullanıcı kaydın gerçekleşip gerçekleşmediğini
/// anlayamıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskLastSavedTime_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _tasks;

    public TaskLastSavedTime_Tests()
    {
        _tasks = GetRequiredService<ITaskAppService>();
    }

    private async Task<Guid> ProjectAsync()
    {
        var id = Guid.NewGuid();
        var suffix = id.ToString("N")[..6];
        await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(id, null, null, "Etiket Projesi " + suffix, "ET-" + suffix[..4], "açıklama"), autoSave: true));
        return id;
    }

    [Fact]
    public async Task Yalniz_etiket_degisince_son_kayit_saati_ilerler()
    {
        var projectId = await ProjectAsync();
        var created = await _tasks.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Etiketlenen görev",
            StartDate = new DateTime(2026, 10, 1),
            ProjectId = projectId
        });
        // İlk kayıttan sonra bir kez daha aynı değerlerle kaydet: satır "değişmemiş" hâle gelsin.
        var stable = await _tasks.GetAsync(created.Id);
        await Task.Delay(50);

        await _tasks.UpdateAsync(created.Id, new CreateUpdateTaskDto
        {
            Title = stable.Title,
            Description = stable.Description,
            StartDate = stable.StartDate,
            DueDate = stable.DueDate,
            Priority = stable.Priority,
            Status = stable.Status,
            AssigneeId = stable.AssigneeId,
            IsPrivate = stable.IsPrivate,
            ProjectId = projectId,
            TagNames = new List<string> { "saha" }
        });

        var after = await _tasks.GetAsync(created.Id);
        after.Tags.ShouldContain(t => t.Name == "saha");
        after.LastModificationTime.ShouldNotBeNull();
        (stable.LastModificationTime == null || after.LastModificationTime > stable.LastModificationTime)
            .ShouldBeTrue("yalnız etiket değişen kayıt da görevin son kayıt saatini ilerletmeli");
    }
}
