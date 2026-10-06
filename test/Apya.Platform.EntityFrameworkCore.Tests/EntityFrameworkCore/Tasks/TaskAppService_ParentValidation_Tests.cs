using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// 🔴 PRJ-07 · Görev oluşturma, gönderilen üst görev kimliğini hiç doğrulamıyordu.
///
/// <para>Var olmayan bir üst görevle açılan alt görev erişilmez bir yetimdir: kök listeler
/// onu "alt görev" diye dışarıda bırakır, üst görevi ise yoktur.</para>
///
/// <para>Derinlik (alt görevin altına görev) burada BİLEREK ölçülmüyor ve zorlanmıyor:
/// arayüz bugün buna izin veriyor, yasaklamak ürün kararı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_ParentValidation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public TaskAppService_ParentValidation_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<Guid> NewProjectAsync()
    {
        var code = "PV-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, null, "Üst görev testi " + code, code, "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<TaskItem> NewRootTaskAsync(Guid? projectId, Guid? tenantId = null)
    {
        var task = new TaskItem(Guid.NewGuid(), "Üst görev", projectId: projectId,
            tenantId: tenantId ?? _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task;
    }

    private static CreateUpdateTaskDto Subtask(Guid parentId, Guid? projectId) => new()
    {
        Title = "Alt görev",
        ParentTaskId = parentId,
        ProjectId = projectId,
        StartDate = DateTime.Today,
    };

    [Fact]
    public async Task Ayni_projedeki_ust_goreve_alt_gorev_acilir()
    {
        var projectId = await NewProjectAsync();
        var parent = await NewRootTaskAsync(projectId);

        var created = await _taskAppService.CreateAsync(Subtask(parent.Id, projectId));

        created.ParentTaskId.ShouldBe(parent.Id);
        created.ProjectId.ShouldBe(projectId);
    }

    /// <summary>Var olmayan üst görev: alt görev HİÇ yazılmamalı (erişilmez yetim doğardı).</summary>
    [Fact]
    public async Task Var_olmayan_ust_gorev_reddedilir_ve_gorev_yazilmaz()
    {
        var ghostParent = Guid.NewGuid();

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _taskAppService.CreateAsync(Subtask(ghostParent, projectId: null)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskParentNotFound);

        using var uow = _uowManager.Begin(requiresNew: true);
        (await _taskRepository.CountAsync(t => t.ParentTaskId == ghostParent))
            .ShouldBe(0, "doğrulama görev yazılmadan ÖNCE çalışmalı");
        await uow.CompleteAsync();
    }

    /// <summary>
    /// Başka kiracının görevi "bulunamadı" olur — kimliğini bilmek ona alt görev asmaya yetmez.
    /// </summary>
    [Fact]
    public async Task Baska_kiracinin_gorevi_ust_gorev_olamaz()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("ust-" + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);

        TaskItem foreignParent;
        using (_currentTenant.Change(tenant.Id))
        {
            foreignParent = await NewRootTaskAsync(projectId: null, tenantId: tenant.Id);
        }

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _taskAppService.CreateAsync(Subtask(foreignParent.Id, projectId: null)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskParentNotFound);
    }

    [Fact]
    public async Task Ust_gorevden_farkli_proje_gonderilirse_reddedilir()
    {
        var parentProject = await NewProjectAsync();
        var otherProject = await NewProjectAsync();
        var parent = await NewRootTaskAsync(parentProject);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _taskAppService.CreateAsync(Subtask(parent.Id, otherProject)));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskParentProjectMismatch);
    }

    /// <summary>
    /// Proje GÖNDERİLMEDİYSE dokunulmaz. Eski düzenleme penceresi alt görevi projesiz açıyor
    /// (<c>EditModal.OnPostAddSubTaskAsync</c>); o yol çalışmaya devam etmeli. Alt görevin
    /// projesini üst görevden türetmek ayrı bir karar — bu test onu sessizce değiştirmeyi önler.
    /// </summary>
    [Fact]
    public async Task Proje_gonderilmezse_alt_gorev_eskisi_gibi_acilir()
    {
        var projectId = await NewProjectAsync();
        var parent = await NewRootTaskAsync(projectId);

        var created = await _taskAppService.CreateAsync(Subtask(parent.Id, projectId: null));

        created.ParentTaskId.ShouldBe(parent.Id);
        created.ProjectId.ShouldBeNull("davranış değiştirilmedi: proje üst görevden türetilmiyor");
    }

    [Fact]
    public async Task Ust_gorevsiz_gorev_etkilenmez()
    {
        var created = await _taskAppService.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "Kök görev", StartDate = DateTime.Today,
        });

        created.ParentTaskId.ShouldBeNull();
    }
}
