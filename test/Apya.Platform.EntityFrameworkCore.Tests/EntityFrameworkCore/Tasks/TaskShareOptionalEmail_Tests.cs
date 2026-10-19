using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// QA-41 · Dış paylaşım bağlantısında e-posta isteğe bağlı: boş metin "yok" sayılır (eskiden
/// [EmailAddress] boş metni reddediyordu, formdan e-postasız bağlantı üretilemiyordu). Geçersiz
/// bir adres yine reddedilir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskShareOptionalEmail_Tests : PlatformEntityFrameworkCoreTestBase
{
    private async Task<Guid> NewTaskAsync()
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(() => GetRequiredService<IRepository<TaskItem, Guid>>()
            .InsertAsync(new TaskItem(id, "Paylaşılan görev", now: DateTime.Now), autoSave: true));
        return id;
    }

    [Fact]
    public async Task Bos_eposta_ile_baglanti_uretilir()
    {
        var taskId = await NewTaskAsync();

        var created = await WithUnitOfWorkAsync(() => GetRequiredService<ITaskShareAppService>().CreateAsync(
            new CreateTaskShareLinkDto { TaskId = taskId, RecipientName = "Ayşe Yılmaz", RecipientEmail = "" }));

        created.RecipientEmail.ShouldBeNull();
        created.Url.ShouldNotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Gecersiz_eposta_reddedilir()
    {
        var taskId = await NewTaskAsync();

        await Should.ThrowAsync<AbpValidationException>(() => WithUnitOfWorkAsync(() =>
            GetRequiredService<ITaskShareAppService>().CreateAsync(
                new CreateTaskShareLinkDto { TaskId = taskId, RecipientName = "Ayşe Yılmaz", RecipientEmail = "abc" })));
    }
}
