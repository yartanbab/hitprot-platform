using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// QA 10-22 · Görevi DEĞİŞTİREN uçların bir kısmı yalnız "görevi görebiliyor mu" diye bakıyordu: düzenleme izni
/// olan herkes BAŞKASININ görevinde eki kalıcı silebiliyor, belge açıp silebiliyor, özellik sekmesi ekleyip
/// kaldırabiliyordu. Artık görevi değiştiren öteki uçlarla aynı kural geçerli: oluşturan, atanan ya da ekip
/// yöneticisi (<c>EnsureCanMutateTaskAsync</c>). Dosyayı yükleyen kişi kendi dosyasını kaldırabilir.
///
/// <para>Barındırıcı ekip yöneticisi iznini reddeder; çağıran görevin sahibi de sorumlusu da değildir.</para>
/// </summary>
public class TaskForeignMutation_Tests : PlatformWebTestBase
{
    private static readonly Guid Me = Guid.NewGuid();

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Projects.ManageTeam);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    private IDisposable AsMe() => GetRequiredService<ICurrentPrincipalAccessor>().Change(new ClaimsPrincipal(
        new ClaimsIdentity(new[]
        {
            new Claim(AbpClaimTypes.UserId, Me.ToString()),
            new Claim(AbpClaimTypes.UserName, "baskasinin-gorevinde")
        }, "Test")));

    /// <summary>Başka birinin oluşturduğu, kimseye atanmamış görev + o kişinin yüklediği ek + benim yüklediğim ek.</summary>
    private async Task<(Guid TaskId, Guid ForeignAttachment, Guid MyAttachment)> SeedAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var projectId = Guid.NewGuid();
        var code = "FM-" + Guid.NewGuid().ToString("N")[..6];
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Sahiplik " + code, code, "test"), autoSave: true);

        var task = new TaskItem(Guid.NewGuid(), "Başkasının görevi", projectId, startDate: DateTime.Today);
        ObjectHelper.TrySetProperty(task, t => t.CreatorId, () => Guid.NewGuid());
        await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);

        var attachments = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        var foreign = new TaskAttachment { TaskId = task.Id, FileName = "a.pdf", StoredFileName = "a_" + code + ".pdf", ContentType = "application/pdf", FileSize = 1 };
        ObjectHelper.TrySetProperty(foreign, a => a.CreatorId, () => Guid.NewGuid());
        var mine = new TaskAttachment { TaskId = task.Id, FileName = "b.pdf", StoredFileName = "b_" + code + ".pdf", ContentType = "application/pdf", FileSize = 1 };
        ObjectHelper.TrySetProperty(mine, a => a.CreatorId, () => Me);
        await attachments.InsertAsync(foreign, autoSave: true);
        await attachments.InsertAsync(mine, autoSave: true);

        await uow.CompleteAsync();
        return (task.Id, foreign.Id, mine.Id);
    }

    private static async Task ShouldBeDeniedAsync(Func<Task> call)
        => (await Should.ThrowAsync<BusinessException>(call)).Code.ShouldBe(PlatformDomainErrorCodes.TaskUpdateDenied);

    [Fact]
    public async Task Baskasinin_gorevinde_ek_belge_ve_ozellik_degistirilemez()
    {
        var (taskId, foreign, _) = await SeedAsync();
        var tasks = GetRequiredService<ITaskAppService>();

        using (AsMe())
        {
            await ShouldBeDeniedAsync(() => tasks.DeleteAttachmentAsync(foreign));
            await ShouldBeDeniedAsync(() => tasks.CreateDocumentAsync(taskId, "Not"));
            await ShouldBeDeniedAsync(() => tasks.AddFeatureAsync(taskId, "history"));
        }
    }

    [Fact]
    public async Task Yukleyen_kendi_ekini_kaldirabilir()
    {
        var (taskId, _, mine) = await SeedAsync();

        using (AsMe())
        {
            await GetRequiredService<ITaskAppService>().DeleteAttachmentAsync(mine);
        }

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        (await GetRequiredService<IRepository<TaskAttachment, Guid>>().FindAsync(mine)).ShouldBeNull();
    }
}
