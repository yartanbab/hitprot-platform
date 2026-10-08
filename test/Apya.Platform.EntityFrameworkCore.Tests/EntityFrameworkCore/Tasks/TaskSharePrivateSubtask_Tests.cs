using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: GİZLİ bir görev, üst görevinin dış paylaşım bağlantısıyla dışarı çıkmaz.
///
/// <para>Bağlantı kök görevi ve alt görev AĞACINI açar. Ağaç gizlilik bayrağına bakmadan
/// kuruluyordu: gizli bir alt görevin başlığı ve açıklaması hem firma DIŞINDAKİ kişiye hem de
/// o görevi göremeyen ama üst görevi paylaşabilen ekip üyesine açılıyordu (bağlantıyı üretip
/// kendisi açması yeter). Ekip içinde yalnız oluşturanın, atananın ve ekip yöneticisinin
/// gördüğü kayıt, sırf üstü paylaşıldı diye dışarıya gitmemeli.</para>
///
/// <para>Gizli görevin KENDİSİ paylaşılabilir: bağlantıyı doğrudan o görev üzerinde üretmek
/// bilinçli bir karardır ve üreten kişinin görevi görebildiği zaten doğrulanır.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskSharePrivateSubtask_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskShareAppService _shareAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    private static readonly GuestRequestContextDto NoContext = new();

    public TaskSharePrivateSubtask_Tests()
    {
        _shareAppService = GetRequiredService<ITaskShareAppService>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskAsync(string title, Guid? parentTaskId = null, bool isPrivate = false)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title,
            description: title + " açıklaması",
            parentTaskId: parentTaskId,
            isPrivate: isPrivate,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    private async Task<string> CreateLinkAsync(Guid taskId)
    {
        var created = await _shareAppService.CreateAsync(new CreateTaskShareLinkDto
        {
            TaskId = taskId,
            RecipientName = "Ahmet Yılmaz",
            LifetimeDays = 7,
            AllowComment = true,
            AllowUpload = true,
            AllowDownload = true
        });

        return created.Url.Split('/').Last();
    }

    [Fact]
    public async Task Gizli_alt_gorev_misafire_gorunmez()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var openChildId = await CreateTaskAsync("Anasayfa", parentTaskId: rootId);
        await CreateTaskAsync("Maaş görüşmesi", parentTaskId: rootId, isPrivate: true);

        var token = await CreateLinkAsync(rootId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.SubTasks.ShouldHaveSingleItem().Id.ShouldBe(openChildId);
    }

    /// <summary>
    /// Gizli düğümün ALTI da gitmez: üstü gösterilmeyen bir alt görev ağaçta asılı kalırdı ve
    /// gizli görevin varlığını (ve konusunu) ele verirdi.
    /// </summary>
    [Fact]
    public async Task Gizli_alt_gorevin_altindakiler_de_misafire_gorunmez()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var privateChildId = await CreateTaskAsync("Fesih hazırlığı", parentTaskId: rootId, isPrivate: true);
        await CreateTaskAsync("İhtarname taslağı", parentTaskId: privateChildId);

        var token = await CreateLinkAsync(rootId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.SubTasks.ShouldBeEmpty();
    }

    /// <summary>
    /// Görünmeyen göreve yazılamaz da: kimliği bilen misafir yorum bırakıp dosya yükleyebilseydi
    /// gizli görevin sahibine dışarıdan içerik düşerdi.
    /// </summary>
    [Fact]
    public async Task Gizli_alt_goreve_misafir_yorum_yazamaz_dosya_yukleyemez()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var privateChildId = await CreateTaskAsync("Fesih hazırlığı", parentTaskId: rootId, isPrivate: true);
        var underPrivateId = await CreateTaskAsync("İhtarname taslağı", parentTaskId: privateChildId);

        var token = await CreateLinkAsync(rootId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, privateChildId, "sızıntı", NoContext));
        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, underPrivateId, "sızıntı", NoContext));
        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.EnsureGuestUploadAllowedAsync(token, privateChildId));
        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.RegisterGuestUploadAsync(
                token, privateChildId, "x.png", "stored-gizli-x.png", 10, NoContext));
    }

    /// <summary>
    /// "Dışa açık" işaretli ek bile gizli alt görevden indirilemez: işaret ekin görünürlüğünü
    /// söyler, görevin kapsamda olduğunu değil.
    /// </summary>
    [Fact]
    public async Task Gizli_alt_gorevin_disa_acik_eki_indirilemez()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var privateChildId = await CreateTaskAsync("Fesih hazırlığı", parentTaskId: rootId, isPrivate: true);

        await _taskAppService.AddAttachmentAsync(privateChildId, "ihtar.pdf", "stored-gizli-ihtar.pdf", 2048);
        var attachmentId = (await _taskAppService.GetAttachmentsAsync(privateChildId)).ShouldHaveSingleItem().Id;
        await _shareAppService.SetAttachmentGuestVisibilityAsync(attachmentId, true);

        var token = await CreateLinkAsync(rootId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.PrepareGuestDownloadAsync(token, attachmentId, NoContext));
    }

    /// <summary>
    /// Karşı yön: bağlantı doğrudan gizli görev üzerinde üretildiyse o görev (ve açık alt
    /// görevleri) misafire açılır — kural paylaşımı yasaklamaz, yalnız üstten sızmayı keser.
    /// </summary>
    [Fact]
    public async Task Gizli_gorevin_kendi_baglantisi_calisir()
    {
        var privateId = await CreateTaskAsync("Fesih hazırlığı", isPrivate: true);
        var childId = await CreateTaskAsync("İhtarname taslağı", parentTaskId: privateId);

        var token = await CreateLinkAsync(privateId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.Id.ShouldBe(privateId);
        view.Root.SubTasks.ShouldHaveSingleItem().Id.ShouldBe(childId);

        await _shareAppService.AddGuestCommentAsync(token, privateId, "Okudum", NoContext);
        await _shareAppService.AddGuestCommentAsync(token, childId, "Taslak hazır", NoContext);
    }
}
