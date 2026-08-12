using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Görev şablonu uçtan uca: görevden şablon çıkarma → şablondan görev üretme.
/// Asıl iddia "şablon kaydedildi" değil, ÜRETİLEN GÖREVİN şablonu birebir
/// yansıtması ve kopyalanmaması gerekenleri kopyalamaması.
///
/// NOT: TaskTemplateManager bir domain service — AppService gibi kendi UoW'unu
/// AÇMAZ. Repository çağrıları ambient UoW olmadan "disposed context" ile patlar,
/// bu yüzden her test WithUnitOfWorkAsync ile sarmalanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskTemplate_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskTemplateAppService _templateAppService;
    private readonly TaskTemplateManager _templateManager;
    private readonly TaskManager _taskManager;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskFeatureAssignment, Guid> _featureRepository;
    private readonly IRepository<Volo.Abp.Identity.IdentityUser, Guid> _userRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskTemplate_Tests()
    {
        _templateAppService = GetRequiredService<ITaskTemplateAppService>();
        _templateManager = GetRequiredService<TaskTemplateManager>();
        _taskManager = GetRequiredService<TaskManager>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _featureRepository = GetRequiredService<IRepository<TaskFeatureAssignment, Guid>>();
        _userRepository = GetRequiredService<IRepository<Volo.Abp.Identity.IdentityUser, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>
    /// AssigneeId, AbpUsers'a FK ile bağlı — uydurma bir Guid FOREIGN KEY hatası verir.
    /// "Sorumlu kopyalanmaz" iddiasını sınamak için kaynak görevde GERÇEK bir kullanıcı şart.
    /// </summary>
    private async Task<Guid> CreateUserAsync()
    {
        var id = Guid.NewGuid();
        var user = new Volo.Abp.Identity.IdentityUser(
            id, $"sablon-test-{id:N}", $"{id:N}@test.local", _currentTenant.Id);
        await _userRepository.InsertAsync(user, autoSave: true);
        return id;
    }

    /// <summary>Şablona kaynak olacak zengin bir görev: alt görevler + özellik sekmeleri.</summary>
    private async Task<Guid> CreateSourceTaskAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(),
            "Yeni müşteri kurulumu",
            description: "Kurulum adımlarını izle.",
            priority: TaskPriority.High,
            assigneeId: await CreateUserAsync(), // kopyalanMAMAlı
            dueDate: DateTime.Now.AddDays(5),     // kopyalanMAMAlı
            tenantId: _currentTenant.Id,
            now: DateTime.Now);
        task.AssignNumber(await _taskManager.GetNextNumberAsync());
        task.SetPlanningInfo(estimatedHours: 6m, taskType: "Kurulum", sprint: "S-1");
        await _taskRepository.InsertAsync(task, autoSave: true);

        foreach (var title in new[] { "Hesap aç", "Yetki ver", "Eğitim planla" })
        {
            var sub = new TaskItem(
                Guid.NewGuid(), title,
                parentTaskId: task.Id,
                tenantId: _currentTenant.Id, now: DateTime.Now);
            sub.AssignNumber(await _taskManager.GetNextNumberAsync());
            await _taskRepository.InsertAsync(sub, autoSave: true);
        }

        await _featureRepository.InsertAsync(new TaskFeatureAssignment(Guid.NewGuid(), task.Id, "gantt"), autoSave: true);
        await _featureRepository.InsertAsync(new TaskFeatureAssignment(Guid.NewGuid(), task.Id, "time-tracking"), autoSave: true);

        return task.Id;
    }

    [Fact]
    public async Task Gorevden_sablon_cikarir_iskelet_alt_gorev_ve_sekmeleri_tasir()
    {
        Guid templateId = Guid.Empty;

        await WithUnitOfWorkAsync(async () =>
        {
            var taskId = await CreateSourceTaskAsync();
            var created = await _templateManager.CreateFromTaskAsync(taskId, "Müşteri kurulumu", "Standart akış");
            templateId = created.Id;
        });

        var dto = await _templateAppService.GetAsync(templateId);

        dto.Name.ShouldBe("Müşteri kurulumu");
        dto.Description.ShouldBe("Standart akış");
        dto.TaskTitle.ShouldBe("Yeni müşteri kurulumu");
        dto.TaskDescription.ShouldBe("Kurulum adımlarını izle.");
        dto.Priority.ShouldBe(TaskPriority.High);
        dto.EstimatedHours.ShouldBe(6m);
        dto.TaskType.ShouldBe("Kurulum");

        dto.Items.Count.ShouldBe(3);
        dto.Items.ShouldContain("Hesap aç");
        dto.Features.Count.ShouldBe(2);
        dto.Features.ShouldContain("gantt");
        dto.Features.ShouldContain("time-tracking");
    }

    [Fact]
    public async Task Sablondan_gorev_uretir_alt_gorev_ve_sekmeler_olusur()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var sourceId = await CreateSourceTaskAsync();
            var template = await _templateManager.CreateFromTaskAsync(sourceId, "Kurulum şablonu");

            var produced = await _templateManager.ApplyAsync(template.Id);

            produced.Title.ShouldBe("Yeni müşteri kurulumu");
            produced.Priority.ShouldBe(TaskPriority.High);
            produced.EstimatedHours.ShouldBe(6m);
            produced.TaskType.ShouldBe("Kurulum");
            produced.Number.ShouldBeGreaterThan(0);

            var subs = await _taskRepository.GetListAsync(t => t.ParentTaskId == produced.Id);
            subs.Count.ShouldBe(3);
            subs.Select(s => s.Title).ShouldContain("Yetki ver");

            var features = await _featureRepository.GetListAsync(f => f.TaskId == produced.Id);
            features.Select(f => f.FeatureCode).OrderBy(x => x)
                .ShouldBe(new[] { "gantt", "time-tracking" });
        });
    }

    /// <summary>
    /// Şablonun ASIL kuralı: sorumlu / son tarih / durum taşınmaz. Bunlar her yeni
    /// görevde farklıdır; şablona girseydi her seferinde temizlenmeleri gerekirdi.
    /// </summary>
    [Fact]
    public async Task Sorumlu_son_tarih_ve_durum_sablondan_TASINMAZ()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var sourceId = await CreateSourceTaskAsync();
            var source = await _taskRepository.GetAsync(sourceId);
            source.AssigneeId.ShouldNotBeNull("kaynak görevde sorumlu olmalı ki testin anlamı olsun");
            source.DueDate.ShouldNotBeNull();

            var template = await _templateManager.CreateFromTaskAsync(sourceId, "Kurulum");
            var produced = await _templateManager.ApplyAsync(template.Id);

            produced.AssigneeId.ShouldBeNull();
            produced.DueDate.ShouldBeNull();
            produced.Status.ShouldBe(Apya.Platform.Tasks.TaskStatus.Todo);
        });
    }

    [Fact]
    public async Task Uygularken_verilen_sorumlu_ve_tarih_gorevde_kullanilir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var sourceId = await CreateSourceTaskAsync();
            var template = await _templateManager.CreateFromTaskAsync(sourceId, "Kurulum");

            var assignee = await CreateUserAsync();
            var due = DateTime.Now.Date.AddDays(10);
            var produced = await _templateManager.ApplyAsync(template.Id, assigneeId: assignee, dueDate: due);

            produced.AssigneeId.ShouldBe(assignee);
            produced.DueDate!.Value.Date.ShouldBe(due);
        });
    }

    [Fact]
    public async Task Liste_sablonu_ozet_sayilariyla_doner()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var sourceId = await CreateSourceTaskAsync();
            await _templateManager.CreateFromTaskAsync(sourceId, "Liste testi şablonu");
        });

        var list = await _templateAppService.GetListAsync();

        var item = list.FirstOrDefault(x => x.Name == "Liste testi şablonu");
        item.ShouldNotBeNull();
        item!.ItemCount.ShouldBe(3);
        item.FeatureCount.ShouldBe(2);
        item.TaskTitle.ShouldBe("Yeni müşteri kurulumu");
    }

    [Fact]
    public async Task Silinen_sablon_listede_gorunmez()
    {
        Guid templateId = Guid.Empty;

        await WithUnitOfWorkAsync(async () =>
        {
            var sourceId = await CreateSourceTaskAsync();
            var template = await _templateManager.CreateFromTaskAsync(sourceId, "Silinecek şablon");
            templateId = template.Id;
        });

        await _templateAppService.DeleteAsync(templateId);

        var list = await _templateAppService.GetListAsync();
        list.ShouldNotContain(x => x.Id == templateId);
    }
}
