using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Attachment_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Attachment_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Ek silme test görevi",
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    [Fact]
    public async Task DeleteAttachmentAsync_var_olan_eki_siler()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        await _taskAppService.AddAttachmentAsync(taskId, "rapor.pdf", "stored-1.pdf", 1024);
        var before = await _taskAppService.GetAttachmentsAsync(taskId);
        var attachmentId = before.ShouldHaveSingleItem().Id;

        await _taskAppService.DeleteAttachmentAsync(attachmentId);

        var after = await _taskAppService.GetAttachmentsAsync(taskId);
        after.ShouldBeEmpty();
    }

    [Fact]
    public async Task DeleteAttachmentAsync_var_olmayan_ek_icin_EntityNotFoundException_verir()
    {
        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.DeleteAttachmentAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task DeleteAttachmentAsync_baska_tenantin_ekini_silmeye_calisinca_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        Guid attachmentId;
        using (_currentTenant.Change(otherTenantId))
        {
            var task = new TaskItem(Guid.NewGuid(), "Diğer tenant görevi", tenantId: otherTenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            await _taskAppService.AddAttachmentAsync(task.Id, "rapor.pdf", "stored-2.pdf", 1024);
            var atts = await _taskAppService.GetAttachmentsAsync(task.Id);
            attachmentId = atts.ShouldHaveSingleItem().Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.DeleteAttachmentAsync(attachmentId));
    }
}
