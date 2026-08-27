using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// SÖZLEŞME: süreli link, ekip dışındaki kişiye YALNIZ kendi görev ağacını ve YALNIZ
/// kendisine ayrılmış içeriği açar.
///
/// <para>Bu testler anonim yolun tek savunmasını ölçer. İki sızıntı biçimi ayrı ayrı
/// kapatılır:</para>
/// <list type="bullet">
/// <item><b>Kapsam:</b> geçerli bir token, kimliğini bilen birine sistemdeki BAŞKA
/// görevleri açmamalı — ne okuma ne yazma.</item>
/// <item><b>Görünürlük:</b> ekip içi yorumlar ve dışa açılmamış dosyalar misafire hiç
/// ulaşmamalı.</item>
/// </list>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskShareAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskShareAppService _shareAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly IRepository<TaskShareLink, Guid> _linkRepository;
    private readonly ICurrentTenant _currentTenant;

    private static readonly GuestRequestContextDto NoContext = new();

    public TaskShareAppService_Tests()
    {
        _shareAppService = GetRequiredService<ITaskShareAppService>();
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _commentRepository = GetRequiredService<IRepository<TaskComment, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        _linkRepository = GetRequiredService<IRepository<TaskShareLink, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskAsync(string title, Guid? parentTaskId = null)
    {
        var task = new TaskItem(
            Guid.NewGuid(), title,
            parentTaskId: parentTaskId,
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    /// <summary>Link üretir ve URL'den token'ı ayıklar — token yalnız bu yanıtta vardır.</summary>
    private async Task<(Guid Id, string Token)> CreateLinkAsync(
        Guid taskId, bool allowComment = true, bool allowUpload = true, bool allowDownload = true)
    {
        var created = await _shareAppService.CreateAsync(new CreateTaskShareLinkDto
        {
            TaskId = taskId,
            RecipientName = "Ahmet Yılmaz",
            LifetimeDays = 7,
            AllowComment = allowComment,
            AllowUpload = allowUpload,
            AllowDownload = allowDownload
        });

        return (created.Id, created.Url.Split('/').Last());
    }

    /* ═══════════════ Token çözümlemesi ═══════════════ */

    [Fact]
    public async Task Gecerli_token_gorevi_acar()
    {
        var taskId = await CreateTaskAsync("Logo tasarımı");
        var (_, token) = await CreateLinkAsync(taskId);

        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.Id.ShouldBe(taskId);
        view.Root.Title.ShouldBe("Logo tasarımı");
        view.RecipientName.ShouldBe("Ahmet Yılmaz");
    }

    [Fact]
    public async Task Var_olmayan_token_reddedilir()
    {
        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.ResolveAsync("uydurma-token", NoContext));
    }

    /// <summary>
    /// Token SAKLANMAZ — yalnız SHA-256 özeti. DB'de düz metin token bulunursa sızıntıda
    /// tüm linkler kullanılabilir hale gelirdi.
    /// </summary>
    [Fact]
    public async Task Tokenin_kendisi_veritabaninda_tutulmaz()
    {
        var taskId = await CreateTaskAsync("Gizlilik");
        var (linkId, token) = await CreateLinkAsync(taskId);

        var link = await _linkRepository.GetAsync(linkId);

        link.TokenHash.ShouldNotBe(token);
        link.TokenHash.Length.ShouldBe(TaskShareConsts.TokenHashLength);
    }

    [Fact]
    public async Task Iptal_edilen_link_artik_acilmaz()
    {
        var taskId = await CreateTaskAsync("İptal");
        var (linkId, token) = await CreateLinkAsync(taskId);

        await _shareAppService.RevokeAsync(linkId);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _shareAppService.ResolveAsync(token, NoContext));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareLinkRevoked);
    }

    /* ═══════════════ Kapsam: kök + alt görevler ═══════════════ */

    [Fact]
    public async Task Alt_gorevler_kapsama_dahildir()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var childId = await CreateTaskAsync("Anasayfa", parentTaskId: rootId);
        var grandChildId = await CreateTaskAsync("Hero görseli", parentTaskId: childId);

        var (_, token) = await CreateLinkAsync(rootId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        var child = view.Root.SubTasks.ShouldHaveSingleItem();
        child.Id.ShouldBe(childId);
        child.SubTasks.ShouldHaveSingleItem().Id.ShouldBe(grandChildId);
    }

    [Fact]
    public async Task Alt_goreve_yorum_yapilabilir()
    {
        var rootId = await CreateTaskAsync("Web sitesi");
        var childId = await CreateTaskAsync("Anasayfa", parentTaskId: rootId);
        var (_, token) = await CreateLinkAsync(rootId);

        await _shareAppService.AddGuestCommentAsync(token, childId, "Taslağı yükledim", NoContext);

        var view = await _shareAppService.ResolveAsync(token, NoContext);
        view.Root.SubTasks.ShouldHaveSingleItem()
            .Comments.ShouldHaveSingleItem().Text.ShouldBe("Taslağı yükledim");
    }

    /// <summary>
    /// 🔴 EN KRİTİK KAPI: token bir görev AĞACINI açar, sistemdeki her görevi değil.
    /// Bu doğrulama olmadan geçerli bir token, id'sini bilen birine tüm görevleri açardı.
    /// </summary>
    [Fact]
    public async Task Kapsam_disindaki_goreve_yorum_yapilamaz()
    {
        var sharedId = await CreateTaskAsync("Paylaşılan");
        var unrelatedId = await CreateTaskAsync("İlgisiz görev");
        var (_, token) = await CreateLinkAsync(sharedId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, unrelatedId, "sızıntı", NoContext));
    }

    /// <summary>Kardeş görev de kapsam dışıdır — aynı ebeveyn "erişim" demek değildir.</summary>
    [Fact]
    public async Task Kardes_gorev_kapsam_disindadir()
    {
        var rootId = await CreateTaskAsync("Kök");
        var sharedChildId = await CreateTaskAsync("Paylaşılan dal", parentTaskId: rootId);
        var siblingId = await CreateTaskAsync("Kardeş dal", parentTaskId: rootId);

        var (_, token) = await CreateLinkAsync(sharedChildId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, siblingId, "sızıntı", NoContext));
    }

    /// <summary>Üst göreve tırmanmak da yasak — link aşağı açar, yukarı değil.</summary>
    [Fact]
    public async Task Ust_gorev_kapsam_disindadir()
    {
        var rootId = await CreateTaskAsync("Üst görev");
        var childId = await CreateTaskAsync("Alt görev", parentTaskId: rootId);

        var (_, token) = await CreateLinkAsync(childId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, rootId, "sızıntı", NoContext));
    }

    /* ═══════════════ Görünürlük: ekip içi içerik sızmaz ═══════════════ */

    /// <summary>
    /// 🔴 Ekip içi yorumlar (ShareLinkId == null) misafire ASLA gösterilmez. Görev
    /// yazışması müşteriye/taşerona açılmayacak bilgi taşıyabilir.
    /// </summary>
    [Fact]
    public async Task Ekip_ici_yorumlar_misafire_gosterilmez()
    {
        var taskId = await CreateTaskAsync("Gizli yazışma");
        await _taskAppService.AddCommentAsync(taskId, "Bütçeyi 50 bine kadar zorlayabiliriz");

        var (_, token) = await CreateLinkAsync(taskId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.Comments.ShouldBeEmpty();
    }

    /// <summary>İki farklı misafir birbirinin thread'ini görmez.</summary>
    [Fact]
    public async Task Misafir_baska_bir_linkin_yorumlarini_gormez()
    {
        var taskId = await CreateTaskAsync("İki taşeron");
        var (_, tokenA) = await CreateLinkAsync(taskId);
        var (_, tokenB) = await CreateLinkAsync(taskId);

        await _shareAppService.AddGuestCommentAsync(tokenA, taskId, "A'nın notu", NoContext);

        var viewB = await _shareAppService.ResolveAsync(tokenB, NoContext);
        viewB.Root.Comments.ShouldBeEmpty();

        var viewA = await _shareAppService.ResolveAsync(tokenA, NoContext);
        viewA.Root.Comments.ShouldHaveSingleItem().Text.ShouldBe("A'nın notu");
    }

    /// <summary>
    /// 🔴 Ekibin göreve iliştirdiği dosya, açıkça dışa açılmadıkça misafire görünmez.
    /// Kapsamdaki her ek açılsaydı iç belgeler de sızardı.
    /// </summary>
    [Fact]
    public async Task Disa_acilmamis_ek_misafire_gorunmez()
    {
        var taskId = await CreateTaskAsync("İç belge");
        await _taskAppService.AddAttachmentAsync(taskId, "maliyet.xlsx", "stored-ic.xlsx", 2048);

        var (_, token) = await CreateLinkAsync(taskId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        view.Root.Attachments.ShouldBeEmpty();
    }

    [Fact]
    public async Task Disa_acilan_ek_misafire_gorunur()
    {
        var taskId = await CreateTaskAsync("Brief");
        await _taskAppService.AddAttachmentAsync(taskId, "brief.pdf", "stored-brief.pdf", 2048);
        var attachmentId = (await _taskAppService.GetAttachmentsAsync(taskId)).ShouldHaveSingleItem().Id;

        await _shareAppService.SetAttachmentGuestVisibilityAsync(attachmentId, true);

        var (_, token) = await CreateLinkAsync(taskId);
        var view = await _shareAppService.ResolveAsync(token, NoContext);

        var visible = view.Root.Attachments.ShouldHaveSingleItem();
        visible.FileName.ShouldBe("brief.pdf");
        visible.IsGuestUpload.ShouldBeFalse();
    }

    /* ═══════════════ Yükleme ve indirme ═══════════════ */

    [Fact]
    public async Task Misafirin_yukledigi_dosya_goreve_dusler_ve_kendisine_gorunur()
    {
        var taskId = await CreateTaskAsync("Teslim");
        var (_, token) = await CreateLinkAsync(taskId);

        await _shareAppService.RegisterGuestUploadAsync(
            token, taskId, "tasarim.png", "stored-guest.png", 4096, NoContext);

        var view = await _shareAppService.ResolveAsync(token, NoContext);
        var uploaded = view.Root.Attachments.ShouldHaveSingleItem();
        uploaded.FileName.ShouldBe("tasarim.png");
        uploaded.IsGuestUpload.ShouldBeTrue();

        // Ekip de görmeli — dosya görevin ekleri arasına düşer.
        (await _taskAppService.GetAttachmentsAsync(taskId)).ShouldContain(a => a.FileName == "tasarim.png");
    }

    [Fact]
    public async Task Yuklemeye_kapali_linkte_yukleme_reddedilir()
    {
        var taskId = await CreateTaskAsync("Salt okunur");
        var (_, token) = await CreateLinkAsync(taskId, allowUpload: false);

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _shareAppService.RegisterGuestUploadAsync(
                token, taskId, "x.png", "stored-x.png", 10, NoContext));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareUploadNotAllowed);
    }

    [Fact]
    public async Task Misafir_kendi_yukledigi_dosyayi_indirebilir()
    {
        var taskId = await CreateTaskAsync("İndirme");
        var (_, token) = await CreateLinkAsync(taskId);
        await _shareAppService.RegisterGuestUploadAsync(
            token, taskId, "tasarim.png", "stored-dl.png", 4096, NoContext);

        var attachmentId = (await _shareAppService.ResolveAsync(token, NoContext))
            .Root.Attachments.ShouldHaveSingleItem().Id;

        var download = await _shareAppService.PrepareGuestDownloadAsync(token, attachmentId, NoContext);

        download.StoredFileName.ShouldBe("stored-dl.png");
        download.FileName.ShouldBe("tasarim.png");
    }

    /// <summary>
    /// 🔴 İndirme ucu, ek id'si bilinse bile dışa açılmamış dosyayı vermemeli — aksi halde
    /// görünürlük kuralı yalnız listede geçerli olur, asıl kapı açık kalırdı.
    /// </summary>
    [Fact]
    public async Task Disa_acilmamis_ek_id_bilinse_bile_indirilemez()
    {
        var taskId = await CreateTaskAsync("Gizli ek");
        await _taskAppService.AddAttachmentAsync(taskId, "maliyet.xlsx", "stored-gizli.xlsx", 2048);
        var attachmentId = (await _taskAppService.GetAttachmentsAsync(taskId)).ShouldHaveSingleItem().Id;

        var (_, token) = await CreateLinkAsync(taskId);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.PrepareGuestDownloadAsync(token, attachmentId, NoContext));
    }

    [Fact]
    public async Task Indirmeye_kapali_linkte_indirme_reddedilir()
    {
        var taskId = await CreateTaskAsync("İndirme kapalı");
        var (_, token) = await CreateLinkAsync(taskId, allowDownload: false);
        await _shareAppService.RegisterGuestUploadAsync(
            token, taskId, "a.png", "stored-kapali.png", 10, NoContext);

        var attachmentId = (await _shareAppService.ResolveAsync(token, NoContext))
            .Root.Attachments.ShouldHaveSingleItem().Id;

        var ex = await Should.ThrowAsync<BusinessException>(
            () => _shareAppService.PrepareGuestDownloadAsync(token, attachmentId, NoContext));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareDownloadNotAllowed);
    }

    /* ═══════════════ Çapraz kiracı ═══════════════ */

    /// <summary>
    /// Anonim yolda kiracı filtresi KAPATILIR (token yetki taşır). Bu, kapsam kontrolünün
    /// kiracıyı ayrıca doğrulamasını zorunlu kılar — yoksa bir kiracının token'ı başka bir
    /// kiracının görevine erişebilirdi.
    /// </summary>
    [Fact]
    public async Task Baska_kiracinin_gorevi_kapsam_disindadir()
    {
        var taskId = await CreateTaskAsync("Bizim görev");
        var (_, token) = await CreateLinkAsync(taskId);

        Guid otherTenantTaskId;
        var otherTenantId = Guid.NewGuid();
        using (_currentTenant.Change(otherTenantId))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Başka kiracının görevi",
                tenantId: otherTenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            otherTenantTaskId = task.Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _shareAppService.AddGuestCommentAsync(token, otherTenantTaskId, "sızıntı", NoContext));
    }
}
