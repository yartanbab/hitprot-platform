using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// N-07 · Yeni geri bildirim panel yetkisi olan host ekibine anında düşer (anonimse ad yazılmaz, "Kritik"
/// ise önem Yüksek); atama atanan kişiye gider. Eskiden yalnız gönderene "alındı" gidiyordu.
/// </summary>
public class FeedbackTeamNotification_Tests : PlatformWebTestBase
{
    /// <summary>Takip numarası SQLite'ta olmayan nextval'dan üretilir; sayaç sahtesiyle değiştirilir.</summary>
    private sealed class CountingNumberGenerator : IFeedbackNumberGenerator
    {
        private int _next;
        public Task<string> NextAsync()
            => Task.FromResult("FB-EKIP-" + System.Threading.Interlocked.Increment(ref _next).ToString("D6"));
    }

    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);
        services.Replace(ServiceDescriptor.Singleton<IFeedbackNumberGenerator>(new CountingNumberGenerator()));
    }

    private readonly IUnitOfWorkManager _uow;

    public FeedbackTeamNotification_Tests()
    {
        _uow = GetRequiredService<IUnitOfWorkManager>();
    }

    [Fact]
    public void Izin_adi_PlatformPermissions_ile_ayni()
        => FeedbackManager.TeamPermission.ShouldBe(PlatformPermissions.Feedbacks.Default);

    private async Task<(Guid Allowed, Guid Other)> ArrangeTeamAsync()
    {
        using var uow = _uow.Begin(requiresNew: true);
        var users = GetRequiredService<IdentityUserManager>();
        var allowed = new IdentityUser(Guid.NewGuid(), "geribildirim-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test");
        var other = new IdentityUser(Guid.NewGuid(), "satis-" + Guid.NewGuid().ToString("N")[..6], Guid.NewGuid().ToString("N")[..8] + "@ornek.test");
        (await users.CreateAsync(allowed)).Succeeded.ShouldBeTrue();
        (await users.CreateAsync(other)).Succeeded.ShouldBeTrue();
        await GetRequiredService<IPermissionGrantRepository>().InsertAsync(new PermissionGrant(
            Guid.NewGuid(), PlatformPermissions.Feedbacks.Default,
            UserPermissionValueProvider.ProviderName, allowed.Id.ToString()), autoSave: true);
        await uow.CompleteAsync();
        return (allowed.Id, other.Id);
    }

    private async Task<Feedback> SubmitAsync(bool anonymous, FeedbackPriority? severity = null)
    {
        using var uow = _uow.Begin(requiresNew: true);
        var feedback = await GetRequiredService<FeedbackManager>().CreateAsync(
            FeedbackType.Bug, "Kaydet düğmesi tepki vermiyor", "Görev detayında kaydet çalışmadı.", null,
            Guid.NewGuid(),
            new FeedbackSubmissionContext("/Tasks", "Görevler", null, null, null, "Ayşe Yılmaz", null, null),
            severity: severity, isAnonymous: anonymous);
        await uow.CompleteAsync();
        return feedback;
    }

    private async Task<List<Notification>> NotificationsAsync(Guid feedbackId, NotificationType type)
    {
        using var uow = _uow.Begin(requiresNew: true);
        return await GetRequiredService<IRepository<Notification, Guid>>()
            .GetListAsync(n => n.EntityId == feedbackId && n.Type == type);
    }

    [Fact]
    public async Task Yeni_geri_bildirim_yalniz_panel_yetkilisine_duser()
    {
        var (allowed, other) = await ArrangeTeamAsync();

        var feedback = await SubmitAsync(anonymous: false, severity: FeedbackPriority.Critical);

        var rows = await NotificationsAsync(feedback.Id, NotificationType.FeedbackSubmitted);
        rows.ShouldContain(n => n.UserId == allowed);
        rows.ShouldNotContain(n => n.UserId == other);
        var mine = rows.Find(n => n.UserId == allowed)!;
        mine.TenantId.ShouldBeNull();
        mine.Body.ShouldContain("Ayşe Yılmaz");
        mine.Severity.ShouldBe(NotificationSeverity.High, "gönderen Kritik işaretledi");
    }

    [Fact]
    public async Task Anonim_gonderimde_ad_yazilmaz()
    {
        var (allowed, _) = await ArrangeTeamAsync();

        var feedback = await SubmitAsync(anonymous: true);

        var mine = (await NotificationsAsync(feedback.Id, NotificationType.FeedbackSubmitted)).Find(n => n.UserId == allowed)!;
        mine.Body.ShouldNotContain("Ayşe");
        mine.Body.ShouldContain(feedback.FeedbackNumber);
    }

    [Fact]
    public async Task Atanan_kisi_haberdar_olur()
    {
        var (allowed, _) = await ArrangeTeamAsync();
        var feedback = await SubmitAsync(anonymous: false);

        using (var uow = _uow.Begin(requiresNew: true))
        {
            var entity = await GetRequiredService<IRepository<Feedback, Guid>>().GetAsync(feedback.Id);
            await GetRequiredService<FeedbackManager>().AssignAsync(entity, allowed, "geribildirim", "admin");
            await uow.CompleteAsync();
        }

        (await NotificationsAsync(feedback.Id, NotificationType.FeedbackAssigned))
            .ShouldHaveSingleItem().UserId.ShouldBe(allowed);
    }

    [Fact]
    public void Panel_bildirimden_gelen_kaydi_acar()
    {
        var js = System.IO.File.ReadAllText(System.IO.Path.Combine(WebSourceFiles.RepoRoot(),
            "src", "Apya.Platform.Web", "Pages", "Admin", "Feedback", "Index.js"));
        js.ShouldContain("new URLSearchParams(window.location.search).get('open')");
        NotificationTypeRegistry.BuildDeepLink(NotificationType.FeedbackSubmitted, Guid.Empty)
            .ShouldBe("/Admin/Feedback?open=" + Guid.Empty);
    }
}
