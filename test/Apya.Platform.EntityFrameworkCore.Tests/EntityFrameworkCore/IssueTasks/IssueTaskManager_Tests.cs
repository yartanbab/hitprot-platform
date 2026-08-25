using System;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.IssueTasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Telemetry;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;
using TaskStatus = Apya.Platform.Tasks.TaskStatus;

namespace Apya.Platform.EntityFrameworkCore.IssueTasks;

/// <summary>
/// Köprünün sözleşmesi: bir kaynak yalnızca BİR görev açar, görev host bağlamında
/// ve seçilen projede doğar, teşhis metni göreve kopyalanır.
/// <para>
/// Her test tek bir <c>WithUnitOfWorkAsync</c> içinde koşar — domain servisi doğrudan
/// çağrıldığında ambient UoW olmazsa repository'ler kapatılmış DbContext'e düşer.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class IssueTaskManager_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IssueTaskManager _manager;
    private readonly IssueTaskSourceCloseHandler _closeHandler;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<IssueTaskLink, Guid> _linkRepository;

    public IssueTaskManager_Tests()
    {
        _manager               = GetRequiredService<IssueTaskManager>();
        _closeHandler          = GetRequiredService<IssueTaskSourceCloseHandler>();
        _projectRepository     = GetRequiredService<IRepository<Project, Guid>>();
        _feedbackRepository    = GetRequiredService<IRepository<Feedback, Guid>>();
        _clientErrorRepository = GetRequiredService<IRepository<ClientError, Guid>>();
        _taskRepository        = GetRequiredService<IRepository<TaskItem, Guid>>();
        _linkRepository        = GetRequiredService<IRepository<IssueTaskLink, Guid>>();
    }

    private async Task<Project> CreateHostProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(),
            tenantId: null,
            grantId: null,
            name: "Ürün Geliştirme",
            code: "URN-" + Guid.NewGuid().ToString("N")[..6],
            description: "Geri bildirim ve hatalardan doğan işler");

        return await _projectRepository.InsertAsync(project, autoSave: true);
    }

    private async Task<Feedback> CreateFeedbackAsync(FeedbackPriority priority = FeedbackPriority.High)
    {
        var feedback = new Feedback(
            Guid.NewGuid(),
            tenantId: null,
            FeedbackType.Bug,
            "Kaydet düğmesi çalışmıyor",
            "Projeyi kaydederken hata alıyorum")
        {
            FeedbackNumber = "FB-2026-" + Guid.NewGuid().ToString("N")[..6],
            Priority = priority,
            PageUrl = "/Projects/Edit/17"
        };

        return await _feedbackRepository.InsertAsync(feedback, autoSave: true);
    }

    [Fact]
    public Task Geri_bildirimden_acilan_gorev_host_baglaminda_ve_hedef_projede_dogar()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();
            var feedback = await CreateFeedbackAsync();

            var link = await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            var task = await _taskRepository.GetAsync(link.TaskId);

            task.TenantId.ShouldBeNull();              // görev HOST'ta yaşar
            task.ProjectId.ShouldBe(project.Id);
            task.Number.ShouldBeGreaterThan(0);        // GRV-N kodu atanmış olmalı
            task.Title.ShouldContain(feedback.FeedbackNumber);
            task.Description.ShouldNotBeNull();
            task.Description!.ShouldContain("Projeyi kaydederken hata alıyorum");

            // Yüksek öncelikli geri bildirim yüksek öncelikli göreve dönüşür.
            task.Priority.ShouldBe(TaskPriority.High);

            link.SourceType.ShouldBe(IssueSourceType.Feedback);
            link.SourceId.ShouldBe(feedback.Id);
            link.SourceLabel.ShouldBe(feedback.FeedbackNumber);
            link.IsAutomatic.ShouldBeFalse();
        });

    [Fact]
    public Task Ayni_geri_bildirim_ikinci_kez_goreve_donusturulemez()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();
            var feedback = await CreateFeedbackAsync();

            await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            var ex = await Assert.ThrowsAsync<BusinessException>(() =>
                _manager.CreateFromFeedbackAsync(
                    feedback, "Host", new IssueTaskOptions { ProjectId = project.Id }));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.IssueTaskAlreadyLinked);
        });

    [Fact]
    public Task Hedef_proje_secilmemisse_donusturme_calismaz()
        => WithUnitOfWorkAsync(async () =>
        {
            var feedback = await CreateFeedbackAsync();

            var ex = await Assert.ThrowsAsync<BusinessException>(() =>
                _manager.CreateFromFeedbackAsync(feedback, "Host", new IssueTaskOptions()));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.IssueTaskTargetProjectNotSet);
        });

    [Fact]
    public Task Var_olmayan_hedef_proje_reddedilir()
        => WithUnitOfWorkAsync(async () =>
        {
            var feedback = await CreateFeedbackAsync();

            var ex = await Assert.ThrowsAsync<BusinessException>(() =>
                _manager.CreateFromFeedbackAsync(
                    feedback, "Host", new IssueTaskOptions { ProjectId = Guid.NewGuid() }));

            ex.Code.ShouldBe(PlatformDomainErrorCodes.IssueTaskTargetProjectNotFound);
        });

    [Fact]
    public Task Istemci_hatasinin_anahtari_parmak_izidir()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();

            var error = new ClientError(
                Guid.NewGuid(), tenantId: null, fingerprint: Guid.NewGuid().ToString("N")[..32],
                ClientErrorSource.JsError, "boom", DateTime.UtcNow);
            await _clientErrorRepository.InsertAsync(error, autoSave: true);

            var link = await _manager.CreateFromClientErrorAsync(
                error, "Host", new IssueTaskOptions { ProjectId = project.Id });

            link.SourceKey.ShouldBe(error.Fingerprint);

            var found = await _manager.FindLinkAsync(IssueSourceType.ClientError, error.Fingerprint);
            found.ShouldNotBeNull();
            found!.TaskId.ShouldBe(link.TaskId);
        });

    [Fact]
    public Task Gorev_silinince_bag_da_temizlenir_ve_kaynak_yeniden_donusturulebilir()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();
            var feedback = await CreateFeedbackAsync();

            var link = await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            await _manager.RemoveLinksOfTaskAsync(link.TaskId);

            (await _linkRepository.FindAsync(link.Id)).ShouldBeNull();

            // Bağ soft-delete olsaydı unique index yüzünden bu çağrı patlardı.
            var again = await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            again.TaskId.ShouldNotBe(link.TaskId);
        });

    [Fact]
    public Task Gorev_tamamlaninca_bagli_geri_bildirim_kapanir()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();
            var feedback = await CreateFeedbackAsync();

            var link = await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            await _closeHandler.HandleEventAsync(new TaskStatusChangedEto
            {
                TaskId    = link.TaskId,
                TaskTitle = "test",
                OldStatus = TaskStatus.InProgress,
                NewStatus = TaskStatus.Done
            });

            var closed = await _feedbackRepository.GetAsync(feedback.Id);
            closed.Status.ShouldBe(FeedbackStatus.Completed);
            closed.ResolvedAt.ShouldNotBeNull();

            var updatedLink = await _linkRepository.GetAsync(link.Id);
            updatedLink.SourceClosedAt.ShouldNotBeNull();
        });

    [Fact]
    public Task Gorev_tamamlanmadikca_kaynak_kapatilmaz()
        => WithUnitOfWorkAsync(async () =>
        {
            var project = await CreateHostProjectAsync();
            var feedback = await CreateFeedbackAsync();

            var link = await _manager.CreateFromFeedbackAsync(
                feedback, "Host", new IssueTaskOptions { ProjectId = project.Id });

            await _closeHandler.HandleEventAsync(new TaskStatusChangedEto
            {
                TaskId    = link.TaskId,
                TaskTitle = "test",
                OldStatus = TaskStatus.Todo,
                NewStatus = TaskStatus.InProgress
            });

            (await _feedbackRepository.GetAsync(feedback.Id)).Status.ShouldBe(FeedbackStatus.New);
            (await _linkRepository.GetAsync(link.Id)).SourceClosedAt.ShouldBeNull();
        });
}
