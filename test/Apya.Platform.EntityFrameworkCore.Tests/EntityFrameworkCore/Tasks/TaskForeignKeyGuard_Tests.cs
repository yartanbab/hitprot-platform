using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Tasks.Dtos;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Çağırandan gelen iki kimlik hiç doğrulanmıyordu: önkoşul görev (bağımlılık satırına düz
/// yazılıyordu) ve taşıma/kopyalama hedefi proje. İkisi de başka kiracının ya da kullanıcının
/// göremediği bir kaydı gösterebiliyordu. Okuma tarafı süzüldüğü için veri sızmıyordu, ama
/// kayıt başka kiracının kaydına sarkık bir bağ taşıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskForeignKeyGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000051");

    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ITaskTemplateAppService _templateAppService;
    private readonly TaskTemplateManager _templateManager;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;
    private readonly ICurrentPrincipalAccessor _principalAccessor;

    public TaskForeignKeyGuard_Tests()
    {
        _templateAppService = GetRequiredService<ITaskTemplateAppService>();
        _templateManager = GetRequiredService<TaskTemplateManager>();
        _timeLogRepository = GetRequiredService<IRepository<TaskTimeLog, Guid>>();
        _principalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _dependencyRepository = GetRequiredService<IRepository<TaskDependency, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> OtherTenantTaskAsync()
    {
        using (_currentTenant.Change(OtherTenant))
        {
            var task = new TaskItem(Guid.NewGuid(), "Başka kiracının görevi", tenantId: OtherTenant, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    private async Task<Guid> OtherTenantProjectAsync()
    {
        using (_currentTenant.Change(OtherTenant))
        {
            var project = new Project(
                Guid.NewGuid(), OtherTenant, null, "Başka kiracının projesi",
                "YBN-" + Guid.NewGuid().ToString("N")[..8], "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    }

    private async Task<Guid> OwnTaskAsync(string title, List<Guid>? predecessors = null)
        => (await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = title,
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = predecessors ?? new List<Guid>()
        })).Id;

    [Fact]
    public async Task Baska_kiracinin_gorevi_onkosul_olarak_yazilamaz()
    {
        var foreign = await OtherTenantTaskAsync();

        await Should.ThrowAsync<EntityNotFoundException>(
            () => OwnTaskAsync("Sarkık bağ denemesi", new List<Guid> { foreign }));

        (await _dependencyRepository.GetListAsync(d => d.PredecessorTaskId == foreign)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Guncellemede_eklenen_yabanci_onkosul_reddedilir_var_olan_bag_korunur()
    {
        var predecessor = await OwnTaskAsync("Gerçek önkoşul");
        var taskId = await OwnTaskAsync("Bağımlı görev", new List<Guid> { predecessor });
        var foreign = await OtherTenantTaskAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Bağımlı görev",
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = new List<Guid> { predecessor, foreign }
        }));

        // Karşı yön: var olan bağı olduğu gibi geri gönderen güncelleme çalışır.
        await _taskAppService.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Bağımlı görev (yeniden adlandırıldı)",
            StartDate = new DateTime(2026, 10, 12),
            PredecessorIds = new List<Guid> { predecessor }
        });

        (await _dependencyRepository.GetListAsync(d => d.TaskId == taskId))
            .Select(d => d.PredecessorTaskId).ShouldBe(new[] { predecessor });
    }

    [Theory]
    [InlineData(TaskTransferMode.Move)]
    [InlineData(TaskTransferMode.Copy)]
    public async Task Gorev_baska_kiracinin_projesine_tasinamaz_ve_kopyalanamaz(TaskTransferMode mode)
    {
        var taskId = await OwnTaskAsync("Taşınacak görev");
        var foreignProject = await OtherTenantProjectAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.TransferAsync(taskId, new TransferTaskDto
        {
            TargetProjectIds = new List<Guid> { foreignProject },
            Mode = mode,
            Include = new TransferTaskIncludeDto()
        }));

        (await _taskRepository.GetAsync(taskId)).ProjectId.ShouldBeNull();
        using (_currentTenant.Change(OtherTenant))
        {
            (await _taskRepository.GetListAsync(t => t.ProjectId == foreignProject)).ShouldBeEmpty();
        }
    }

    /* ═══════════════ Görevin projesi ═══════════════ */

    private async Task AssertNoTaskOnAsync(Guid projectId)
    {
        using (_currentTenant.Change(OtherTenant))
        {
            (await _taskRepository.GetListAsync(t => t.ProjectId == projectId)).ShouldBeEmpty();
        }
        (await _taskRepository.GetListAsync(t => t.ProjectId == projectId)).ShouldBeEmpty();
    }

    /// <summary>
    /// Üst görev verilmediğinde proje kimliği hiç doğrulanmıyordu. Görev başka kiracının projesini
    /// gösterince host'un kiracılar üstü proje görünümünde o projenin görevi gibi sayılıyordu.
    /// </summary>
    [Fact]
    public async Task Baska_kiracinin_projesine_gorev_acilamaz()
    {
        var foreignProject = await OtherTenantProjectAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Yabancı projeye görev",
            StartDate = new DateTime(2026, 10, 12),
            ProjectId = foreignProject
        }));

        await AssertNoTaskOnAsync(foreignProject);
    }

    [Fact]
    public async Task Guncellemede_gorev_baska_kiracinin_projesine_alinamaz()
    {
        var taskId = await OwnTaskAsync("Projesi değişecek görev");
        var foreignProject = await OtherTenantProjectAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.UpdateAsync(taskId, new CreateUpdateTaskDto
        {
            Title = "Projesi değişecek görev",
            StartDate = new DateTime(2026, 10, 12),
            ProjectId = foreignProject
        }));

        (await _taskRepository.GetAsync(taskId)).ProjectId.ShouldBeNull();
    }

    /// <summary>Karşı yön: kayıtlı projesi artık okunamayan görev düzenlenebilir kalır.</summary>
    [Fact]
    public async Task Projesi_degismeyen_gorev_guncellenir()
    {
        var orphanProject = Guid.NewGuid();
        var task = new TaskItem(
            Guid.NewGuid(), "Projesi silinmiş görev", projectId: orphanProject,
            startDate: new DateTime(2026, 10, 12), tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);

        var dto = await _taskAppService.UpdateAsync(task.Id, new CreateUpdateTaskDto
        {
            Title = "Yeni başlık",
            StartDate = new DateTime(2026, 10, 12),
            ProjectId = orphanProject
        });

        dto.Title.ShouldBe("Yeni başlık");
    }

    [Fact]
    public async Task Sablon_baska_kiracinin_projesine_uygulanamaz()
    {
        var sourceId = await OwnTaskAsync("Şablon kaynağı");
        var template = await _templateManager.CreateFromTaskAsync(sourceId, "Yabancı proje şablonu");
        var foreignProject = await OtherTenantProjectAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _templateAppService.ApplyAsync(
            new ApplyTaskTemplateDto { TemplateId = template.Id, ProjectId = foreignProject }));

        await AssertNoTaskOnAsync(foreignProject);
    }

    /* ═══════════════ Süre sayacı ═══════════════ */

    /// <summary>
    /// Sayaç görev kimliğini hiç doğrulamıyordu: süre başka kiracının görevine yazılabiliyor,
    /// host'un proje maliyetine sayılıyordu.
    /// </summary>
    [Fact]
    public async Task Baska_kiracinin_gorevinde_sure_sayaci_baslatilamaz()
    {
        var foreignTask = await OtherTenantTaskAsync();

        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.StartTimeTrackingAsync(foreignTask));
        await Should.ThrowAsync<EntityNotFoundException>(() => _taskAppService.GetTimeLogsAsync(foreignTask));

        (await _timeLogRepository.GetListAsync(l => l.TaskId == foreignTask)).ShouldBeEmpty();
    }

    /// <summary>Aynı kiracıda: göremediğiniz gizli göreve süre yazılamaz, kayıtları okunamaz.</summary>
    [Fact]
    public async Task Gorulemeyen_gizli_gorevde_sure_sayaci_baslatilamaz()
    {
        var secret = new TaskItem(
            Guid.NewGuid(), "Gizli görev", isPrivate: true, tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(secret, autoSave: true);

        // Gizli göreve hiçbir koşulda erişemeyen çağıran: bürünme oturumu.
        using (_principalAccessor.Change(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test"))))
        {
            (await Should.ThrowAsync<Volo.Abp.BusinessException>(
                () => _taskAppService.StartTimeTrackingAsync(secret.Id)))
                .Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
            await Should.ThrowAsync<Volo.Abp.BusinessException>(() => _taskAppService.GetTimeLogsAsync(secret.Id));
        }

        (await _timeLogRepository.GetListAsync(l => l.TaskId == secret.Id)).ShouldBeEmpty();
    }


    /* ═══════════════ Üst görev ═══════════════ */

    /// <summary>
    /// Üst görev yalnız kiracıya göre doğrulanıyordu. Göremediğiniz gizli bir görevin altına alt
    /// görev açabiliyor, yanıttaki üst görev başlığından o görevin adını öğrenebiliyordunuz.
    /// </summary>
    [Fact]
    public async Task Gorulemeyen_gizli_gorevin_altina_alt_gorev_acilamaz()
    {
        var secret = new TaskItem(
            Guid.NewGuid(), "Fesih hazırlığı", isPrivate: true, tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(secret, autoSave: true);

        using (_principalAccessor.Change(new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new(AbpClaimTypes.UserName, "gizliyi-goremeyen"),
            new(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }, "Test"))))
        {
            (await Should.ThrowAsync<Volo.Abp.BusinessException>(() => _taskAppService.CreateAsync(new CreateUpdateTaskDto
            {
                Title = "Sızıntı alt görevi",
                StartDate = new DateTime(2026, 10, 12),
                ParentTaskId = secret.Id
            }))).Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
        }

        (await _taskRepository.GetListAsync(t => t.ParentTaskId == secret.Id)).ShouldBeEmpty();
    }

}
