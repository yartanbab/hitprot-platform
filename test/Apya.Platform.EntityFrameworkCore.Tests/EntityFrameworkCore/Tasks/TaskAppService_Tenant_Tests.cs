using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
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
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentPrincipalAccessor _currentPrincipalAccessor;

    public TaskAppService_Tenant_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _commentRepository = GetRequiredService<IRepository<TaskComment, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _currentPrincipalAccessor = GetRequiredService<ICurrentPrincipalAccessor>();
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

    // Başka tenant'ta bir görev + o göreve bağlı bir kök yorum tohumlar.
    // ReplyToCommentAsync/UpdateCommentAsync/DeleteCommentAsync commentId üzerinden çalıştığı için
    // taskId değil, doğrudan commentId'ye ihtiyaç duyarlar.
    private async Task<(Guid TaskId, Guid CommentId)> CreateCommentInTenantAsync(Guid tenantId)
    {
        var taskId = await CreateTaskInTenantAsync(tenantId);
        using (_currentTenant.Change(tenantId))
        {
            var comment = new TaskComment(taskId, "Diğer tenant yorumu");
            await _commentRepository.InsertAsync(comment, autoSave: true);
            return (taskId, comment.Id);
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

    // Yanlış-yeşil koruması: tohumlanan yorum gerçekten KENDİ tenant'ında var mı?
    // Bu geçmezse aşağıdaki yorum testleri EntityNotFoundException'ı yanlış sebepten
    // (tohumlama hiç kalıcı olmadığı için) alıyor olabilir.
    [Fact]
    public async Task CreateCommentInTenantAsync_yorum_kendi_tenantinda_gercekten_var_olur()
    {
        var otherTenantId = Guid.NewGuid();
        var (_, commentId) = await CreateCommentInTenantAsync(otherTenantId);

        using (_currentTenant.Change(otherTenantId))
        {
            var comment = await _commentRepository.GetAsync(commentId);
            comment.ShouldNotBeNull();
            comment.Text.ShouldBe("Diğer tenant yorumu");
        }
    }

    [Fact]
    public async Task AddCommentAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.AddCommentAsync(taskId, "yorum"));
    }

    [Fact]
    public async Task ReplyToCommentAsync_baska_tenantin_yorumunda_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var (_, commentId) = await CreateCommentInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.ReplyToCommentAsync(commentId, "cevap"));
    }

    [Fact]
    public async Task UpdateCommentAsync_baska_tenantin_yorumunda_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var (_, commentId) = await CreateCommentInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.UpdateCommentAsync(commentId, "yeni metin"));
    }

    [Fact]
    public async Task DeleteCommentAsync_baska_tenantin_yorumunda_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var (_, commentId) = await CreateCommentInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.DeleteCommentAsync(commentId));
    }

    // Gizli görevde impersonation ile erişim testleri (APYA-22, EnsureTaskPrivacyAllowedAsync).
    //
    // NOT: Görev tarifi "ManageTeam yetkisi yok, oluşturan/atanan değil" senaryosunu istiyordu,
    // ancak bu test host'unda kanıtlanamaz: PlatformTestBaseModule.AddAlwaysAllowAuthorization()
    // IAuthorizationService'i, her izin adı için (var olmayan/rastgele bir izin adı dahil) her
    // zaman true dönen bir uygulamayla DEĞİŞTİRİYOR — bir diagnostik testle doğrulandı
    // (authorizationService.IsGrantedAsync("Bu.Izin.Hicbir.Yerde.Tanimli.Degil") == true).
    // Yani canManageTeam bu host'ta asla false olamaz; "ManageTeam yok" dalı test edilemez
    // hale geliyor. Bunu çözmek AddAlwaysAllowAuthorization'ı bu test sınıfı için DI'da
    // override eden yeni bir test modülü/host gerektirir — kapsam dışı, kırılgan bir çözüm
    // olurdu (bkz. görev talimatı).
    //
    // Bunun yerine EnsureTaskPrivacyAllowedAsync'in İKİNCİ, ManageTeam'den BAĞIMSIZ dalı
    // (impersonation) test ediliyor: task.IsPrivate + isImpersonated true ise ManageTeam/
    // creator/assignee kontrolüne hiç bakılmadan BusinessException fırlatılır. Bu, düzeltmenin
    // kapattığı asıl regresyonu da kanıtlıyor: eskiden yalnızca GetAsync impersonation'ı
    // reddediyordu, yorum/dosya uçları (taskId üzerinden doğrudan çağrılınca) reddetmiyordu.
    private async Task<Guid> CreateGizliTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Gizli görev",
            tenantId: _currentTenant.Id, isPrivate: true, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    private static ClaimsPrincipal BuildImpersonatedPrincipal()
    {
        return new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new Claim(AbpClaimTypes.UserId, Guid.NewGuid().ToString()),
            new Claim(AbpClaimTypes.UserName, "impersonated-user"),
            new Claim(AbpClaimTypes.ImpersonatorUserId, Guid.NewGuid().ToString())
        }));
    }

    // Yanlış-yeşil koruması: tohumlanan görev gerçekten gizli olarak var oluyor mu?
    // Bu geçmezse aşağıdaki iki test BusinessException'ı yanlış sebepten alıyor olabilir.
    [Fact]
    public async Task CreateGizliTaskInCurrentTenantAsync_gorev_gercekten_gizli_olarak_var_olur()
    {
        var taskId = await CreateGizliTaskInCurrentTenantAsync();

        var task = await _taskRepository.GetAsync(taskId);
        task.ShouldNotBeNull();
        task.IsPrivate.ShouldBeTrue();
    }

    [Fact]
    public async Task GetCommentsAsync_gizli_gorevde_impersonation_erisimi_reddeder()
    {
        var taskId = await CreateGizliTaskInCurrentTenantAsync();

        using (_currentPrincipalAccessor.Change(BuildImpersonatedPrincipal()))
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _taskAppService.GetCommentsAsync(taskId));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
        }
    }

    [Fact]
    public async Task AddAttachmentAsync_gizli_gorevde_impersonation_erisimi_reddeder()
    {
        var taskId = await CreateGizliTaskInCurrentTenantAsync();

        using (_currentPrincipalAccessor.Change(BuildImpersonatedPrincipal()))
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _taskAppService.AddAttachmentAsync(taskId, "a.pdf", "stored.pdf", 10));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskViewImpersonationDenied);
        }
    }
}
