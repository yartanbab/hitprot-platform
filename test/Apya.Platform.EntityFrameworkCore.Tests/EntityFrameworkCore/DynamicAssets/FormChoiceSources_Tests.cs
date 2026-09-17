using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.DynamicAssets;

/// <summary>
/// 16a/16b · Açılır liste tek bir kaynağa değil, bir KATALOĞA bağlanır: çağrılar, firmanın projeleri,
/// seçilen projenin görevleri, firmalar. Zincirli kaynakta liste üst alandaki seçime göre daralır ve
/// gönderimde de o seçime karşı doğrulanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FormChoiceSources_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IFormAppService _formAppService;
    private readonly IPublicDocumentAppService _publicDocumentAppService;
    private readonly IResponseAppService _responseAppService;
    private readonly ICurrentTenant _currentTenant;

    public FormChoiceSources_Tests()
    {
        _formAppService = GetRequiredService<IFormAppService>();
        _publicDocumentAppService = GetRequiredService<IPublicDocumentAppService>();
        _responseAppService = GetRequiredService<IResponseAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static string Settings(string source, Guid? dependsOn = null)
        => dependsOn == null
            ? $"{{\"required\":true,\"source\":\"{source}\"}}"
            : $"{{\"required\":true,\"source\":\"{source}\",\"dependsOn\":\"{dependsOn}\"}}";

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    private async Task<Project> CreateProjectAsync(Guid tenantId, string name, DateTime? endDate = null)
        => await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
            new Project(Guid.NewGuid(), tenantId, null, name, "P" + Guid.NewGuid().ToString("N")[..6], "", endDate: endDate),
            autoSave: true);

    private async Task<TaskItem> CreateTaskAsync(Guid tenantId, Guid projectId, string title, TaskStatus? status = null)
    {
        var task = new TaskItem(Guid.NewGuid(), title, projectId, tenantId: tenantId, now: DateTime.Now);
        if (status != null)
        {
            task.ChangeStatus(status.Value, DateTime.Now);
        }

        return await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);
    }

    /// <summary>Projeye ve o projenin görevine bağlı iki alanlı, yayında bir kiracı formu.</summary>
    private async Task<DocumentDto> CreateProjectTaskFormAsync()
    {
        var form = await _formAppService.CreateAsync(new CreateUpdateFormDto
        {
            Title = "İlerleme bildirimi",
            Blocks = new List<CreateBlockDto>
            {
                new() { Type = BlockType.Dropdown, Order = 1, Content = "Projeniz", Settings = Settings(FormChoiceSources.TenantProjects) }
            }
        });

        // Görev alanı proje alanının KİMLİĞİNE bağlanır; kimlik ancak ilk kayıttan sonra bellidir.
        var projectBlockId = form.Blocks.Single().Id;
        await _formAppService.UpdateBlocksAsync(form.Id, new UpdateFormBlocksDto
        {
            Blocks = new List<CreateBlockDto>
            {
                new() { Id = projectBlockId, Type = BlockType.Dropdown, Order = 1, Content = "Projeniz", Settings = Settings(FormChoiceSources.TenantProjects) },
                new() { Type = BlockType.Dropdown, Order = 2, Content = "Göreviniz", Settings = Settings(FormChoiceSources.TenantProjectTasks, projectBlockId) }
            }
        });

        await _formAppService.PublishAsync(form.Id, new PublishFormDto { Slug = "ilerleme-" + Guid.NewGuid().ToString("N")[..6] });
        return await _formAppService.GetAsync(form.Id);
    }

    [Fact]
    public async Task Katalog_kaynaklari_kapsamlari_ve_zincir_bagiyla_listeler()
    {
        var catalog = await _formAppService.GetChoiceSourcesAsync();

        var projects = catalog.Single(s => s.Key == FormChoiceSources.TenantProjects);

        projects.Scope.ShouldBe(FormChoiceSourceScope.FillerTenant);
        projects.DependsOnSourceKey.ShouldBeNull();
        // Firma kapsamlı kaynakta tek bir kayıt sayısı yok: her firmada başka.
        projects.RecordCount.ShouldBeNull();

        var tasks = catalog.Single(s => s.Key == FormChoiceSources.TenantProjectTasks);
        tasks.DependsOnSourceKey.ShouldBe(FormChoiceSources.TenantProjects);

        catalog.Single(s => s.Key == FormChoiceSources.Firms).Scope.ShouldBe(FormChoiceSourceScope.HostOnly);
        catalog.Single(s => s.Key == FormChoiceSources.OpenGrantCalls).Scope.ShouldBe(FormChoiceSourceScope.HostCatalog);
    }

    [Fact]
    public async Task Katalog_kaynagin_kac_formda_kullanildigini_sayar()
    {
        var tenantId = await CreateTenantAsync("Sayan Firma");
        using (_currentTenant.Change(tenantId))
        {
            var before = (await _formAppService.GetChoiceSourcesAsync())
                .Single(s => s.Key == FormChoiceSources.TenantProjects).UsedInFormCount;

            await CreateProjectTaskFormAsync();

            var after = (await _formAppService.GetChoiceSourcesAsync())
                .Single(s => s.Key == FormChoiceSources.TenantProjects).UsedInFormCount;

            after.ShouldBe(before + 1);
        }
    }

    [Fact]
    public async Task Firmanin_yalniz_kendi_suren_projeleri_listelenir()
    {
        var mine = await CreateTenantAsync("Listeleyen Firma");
        var other = await CreateTenantAsync("Başka Firma");
        var open = await CreateProjectAsync(mine, "Süren proje");
        var finished = await CreateProjectAsync(mine, "Biten proje", DateTime.Today.AddDays(-1));
        var foreign = await CreateProjectAsync(other, "Yabancı proje");

        using (_currentTenant.Change(mine))
        {
            var choices = await _formAppService.GetChoicesAsync(FormChoiceSources.TenantProjects);

            choices.ShouldContain(c => c.Value == open.Id.ToString() && c.Label == "Süren proje");
            choices.ShouldNotContain(c => c.Value == finished.Id.ToString());
            choices.ShouldNotContain(c => c.Value == foreign.Id.ToString());
        }
    }

    [Fact]
    public async Task Gorev_listesi_yalniz_secilen_projeden_gelir()
    {
        var tenantId = await CreateTenantAsync("Zincir Firma");
        var project = await CreateProjectAsync(tenantId, "Ar-Ge projesi");
        var otherProject = await CreateProjectAsync(tenantId, "İkinci proje");
        var task = await CreateTaskAsync(tenantId, project.Id, "Prototip üretimi");
        var cancelled = await CreateTaskAsync(tenantId, project.Id, "Vazgeçilen iş", TaskStatus.Cancelled);
        var otherTask = await CreateTaskAsync(tenantId, otherProject.Id, "Başka projenin işi");

        using (_currentTenant.Change(tenantId))
        {
            var form = await CreateProjectTaskFormAsync();
            var taskBlockId = form.Blocks.Single(b => b.Order == 2).Id;

            // Form açılışında zincirli alanın listesi BOŞ gelir: üst alanda henüz seçim yok.
            var dto = await _publicDocumentAppService.GetBySlugAsync(form.Slug, tenantId);
            var taskBlock = dto.Blocks.Single(b => b.Order == 2);
            taskBlock.DependsOnBlockId.ShouldBe(form.Blocks.Single(b => b.Order == 1).Id);
            taskBlock.Choices.ShouldBeEmpty();

            var choices = await _publicDocumentAppService.GetBlockChoicesAsync(
                form.Slug, taskBlockId, project.Id.ToString(), tenantId);

            choices.ShouldContain(c => c.Value == task.Id.ToString() && c.Label == "Prototip üretimi");
            choices.ShouldNotContain(c => c.Value == cancelled.Id.ToString());
            choices.ShouldNotContain(c => c.Value == otherTask.Id.ToString());

            // Üst alan seçilmeden liste boş: "tüm görevler" göstermek zincirin anlamını bozardı.
            (await _publicDocumentAppService.GetBlockChoicesAsync(form.Slug, taskBlockId, null, tenantId)).ShouldBeEmpty();
        }
    }

    [Fact]
    public async Task Gonderimde_gorev_secilen_projeye_karsi_dogrulanir()
    {
        var tenantId = await CreateTenantAsync("Gönderen Firma");
        var project = await CreateProjectAsync(tenantId, "Ar-Ge projesi");
        var otherProject = await CreateProjectAsync(tenantId, "İkinci proje");
        var task = await CreateTaskAsync(tenantId, project.Id, "Prototip üretimi");
        var otherTask = await CreateTaskAsync(tenantId, otherProject.Id, "Başka projenin işi");

        using (_currentTenant.Change(tenantId))
        {
            var form = await CreateProjectTaskFormAsync();
            var projectBlockId = form.Blocks.Single(b => b.Order == 1).Id;
            var taskBlockId = form.Blocks.Single(b => b.Order == 2).Id;

            Task SubmitAsync(Guid projectId, Guid taskId) => _responseAppService.SubmitAsync(new SubmitResponseDto
            {
                DocumentSlug = form.Slug,
                Answers = JsonSerializer.Serialize(new Dictionary<string, object>
                {
                    [projectBlockId.ToString()] = new { value = projectId.ToString(), label = "x" },
                    [taskBlockId.ToString()] = new { value = taskId.ToString(), label = "x" }
                })
            });

            // Başka projenin görevi: liste o projeye göre çözüldüğü için cevap listede yok.
            var wrong = await Should.ThrowAsync<BusinessException>(() => SubmitAsync(project.Id, otherTask.Id));
            wrong.Code.ShouldBe(PlatformDomainErrorCodes.FormAnswersInvalid);

            await SubmitAsync(project.Id, task.Id);
        }
    }
}
