using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

// NOT: Brief `test/Apya.Platform.Application.Tests/Tasks/` altında tasarlanmıştı, ancak o proje
// hiçbir EF Core / repository implementasyonuna bağlı değil (yalnızca NSubstitute mock'larıyla
// çalışan birim testleri barındırıyor) — DI, ITaskAppService'i inşa etmeden önce
// AbpFeatureManagementDomainModule modülünü başlatırken IFeatureGroupDefinitionRecordRepository
// çözemediği için patlıyor. Bu dosya bu yüzden gerçek repository + in-memory Sqlite DB sağlayan
// PlatformEntityFrameworkCoreTestModule'e bağlı bu projede, EfCoreSampleAppServiceTests /
// SampleRepositoryTests ile aynı desende yaşıyor.
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Tenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Tenant_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Diğer tenant görevi",
                tenantId: tenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    // Yanlış-yeşil koruması: tohumlanan görev gerçekten KENDİ tenant'ında var mı?
    // Bu geçmezse aşağıdaki üç test EntityNotFoundException'ı yanlış sebepten (tohumlama
    // hiç kalıcı olmadığı için) alıyor olabilir ve tenant izolasyonu hakkında hiçbir şey kanıtlamaz.
    [Fact]
    public async Task CreateTaskInTenantAsync_gorev_kendi_tenantinda_gercekten_var_olur()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        using (_currentTenant.Change(otherTenantId))
        {
            var task = await _taskRepository.GetAsync(taskId);
            task.ShouldNotBeNull();
            task.TenantId.ShouldBe(otherTenantId);
        }
    }

    [Fact]
    public async Task GetAttachmentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetAttachmentsAsync(taskId));
    }

    [Fact]
    public async Task GetCommentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetCommentsAsync(taskId));
    }

    [Fact]
    public async Task AddAttachmentAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.AddAttachmentAsync(taskId, "a.pdf", "stored.pdf", 10));
    }
}
