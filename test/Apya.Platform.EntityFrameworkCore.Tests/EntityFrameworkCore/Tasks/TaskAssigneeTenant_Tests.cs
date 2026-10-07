using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Görev yalnız çağıranın KENDİ kiracısının kullanıcısına atanır.
///
/// <para>Atanan kişinin kimliği istekten geliyor ve hiç doğrulanmıyordu. Ekran yalnız kendi
/// kullanıcılarını sunar, ama doğrudan API çağrısıyla kimliği bilinen başka bir kiracının (ya da
/// host'un) kullanıcısı atanabiliyordu; görev kaydedilince o kullanıcının bağlı dış takvimine
/// (Google / Outlook) görev etkinliği yazılıyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAssigneeTenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("55550000-cccc-4000-8000-0000000000a5");
    private static readonly Guid TenantB = Guid.Parse("55550000-cccc-4000-8000-0000000000b5");

    private readonly ITaskAppService _tasks;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAssigneeTenant_Tests()
    {
        _tasks = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _userRepository = GetRequiredService<IRepository<IdentityUser, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task AsAsync(Guid tenantId, Func<Task> action) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            await action();
        }
    });

    private async Task<Guid> CreateUserAsync(Guid tenantId)
    {
        var id = Guid.NewGuid();
        var name = "kisi-" + id.ToString("N")[..10];
        await AsAsync(tenantId, async () =>
            await _userRepository.InsertAsync(new IdentityUser(id, name, name + "@ornek.com", tenantId), autoSave: true));
        return id;
    }

    private async Task<Guid> InsertTaskAsync(Guid tenantId, Guid? assigneeId = null)
    {
        var id = Guid.NewGuid();
        await AsAsync(tenantId, async () =>
            await _taskRepository.InsertAsync(
                new TaskItem(id, "Atama sınaması", assigneeId: assigneeId, tenantId: tenantId, now: DateTime.Now),
                autoSave: true));
        return id;
    }

    private static CreateUpdateTaskDto Input(Guid? assigneeId, string title = "Atama sınaması")
        => new() { Title = title, StartDate = DateTime.Today, AssigneeId = assigneeId };

    private async Task<Guid?> AssigneeOfAsync(Guid tenantId, Guid taskId)
    {
        Guid? assignee = null;
        await AsAsync(tenantId, async () => assignee = (await _taskRepository.GetAsync(taskId)).AssigneeId);
        return assignee;
    }

    [Fact]
    public async Task Yeni_gorev_baska_kiracinin_kullanicisina_atanamaz()
    {
        var foreignUser = await CreateUserAsync(TenantA);

        await AsAsync(TenantB, async () =>
        {
            var ex = await Should.ThrowAsync<BusinessException>(async () => await _tasks.CreateAsync(Input(foreignUser)));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskAssigneeNotFound);
        });
    }

    [Fact]
    public async Task Var_olan_gorev_baska_kiracinin_kullanicisina_atanamaz()
    {
        var foreignUser = await CreateUserAsync(TenantA);
        var taskId = await InsertTaskAsync(TenantB);

        await AsAsync(TenantB, async () =>
        {
            var onAssign = await Should.ThrowAsync<BusinessException>(
                async () => await _tasks.SetAssigneeAsync(taskId, foreignUser));
            onAssign.Code.ShouldBe(PlatformDomainErrorCodes.TaskAssigneeNotFound);
        });

        await AsAsync(TenantB, async () =>
        {
            var onUpdate = await Should.ThrowAsync<BusinessException>(
                async () => await _tasks.UpdateAsync(taskId, Input(foreignUser)));
            onUpdate.Code.ShouldBe(PlatformDomainErrorCodes.TaskAssigneeNotFound);
        });

        (await AssigneeOfAsync(TenantB, taskId)).ShouldBeNull();
    }

    [Fact]
    public async Task Gorev_kendi_kiracisinin_kullanicisina_atanir()
    {
        var ownUser = await CreateUserAsync(TenantB);
        var taskId = await InsertTaskAsync(TenantB);

        await AsAsync(TenantB, async () => await _tasks.SetAssigneeAsync(taskId, ownUser));
        (await AssigneeOfAsync(TenantB, taskId)).ShouldBe(ownUser);

        await AsAsync(TenantB, async () => await _tasks.SetAssigneeAsync(taskId, null));
        (await AssigneeOfAsync(TenantB, taskId)).ShouldBeNull();

        var createdId = Guid.Empty;
        await AsAsync(TenantB, async () => createdId = (await _tasks.CreateAsync(Input(ownUser))).Id);
        (await AssigneeOfAsync(TenantB, createdId)).ShouldBe(ownUser);
    }

    [Fact]
    public async Task Eski_kayitta_kalmis_atama_baska_alanlarin_duzenlenmesini_engellemez()
    {
        // Kural gelmeden önce yazılmış olabilecek bir kayıt: atanan kişi başka kiracıda.
        var foreignUser = await CreateUserAsync(TenantA);
        var taskId = await InsertTaskAsync(TenantB, assigneeId: foreignUser);

        await AsAsync(TenantB, async () => await _tasks.UpdateAsync(taskId, Input(foreignUser, "Başlık değişti")));

        await AsAsync(TenantB, async () => (await _taskRepository.GetAsync(taskId)).Title.ShouldBe("Başlık değişti"));
    }
}
