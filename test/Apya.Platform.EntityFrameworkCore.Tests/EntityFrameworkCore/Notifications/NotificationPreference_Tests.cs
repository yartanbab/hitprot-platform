using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// Kanal tercihlerinin sözleşmesi: kayıt yoksa varsayılan geçerli, uygulama içi
/// kapatılan kategoride bildirim hiç üretilmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationPreference_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly INotificationAppService _appService;
    private readonly NotificationManager _manager;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ICurrentUser _currentUser;

    public NotificationPreference_Tests()
    {
        _appService             = GetRequiredService<INotificationAppService>();
        _manager                = GetRequiredService<NotificationManager>();
        _notificationRepository = GetRequiredService<IRepository<Notification, Guid>>();
        _currentUser            = GetRequiredService<ICurrentUser>();
    }

    [Fact]
    public async Task Every_Category_Should_Come_Back_With_Defaults_When_Nothing_Is_Stored()
    {
        var preferences = await _appService.GetPreferencesAsync();

        preferences.Count.ShouldBe(Enum.GetValues<NotificationCategory>().Length);
        preferences.ShouldAllBe(p => p.InApp);        // varsayılan: uygulama içi açık
        preferences.ShouldAllBe(p => !p.Email);       // varsayılan: e-posta kapalı
    }

    [Fact]
    public async Task Update_Should_Persist_And_Be_Read_Back()
    {
        await _appService.UpdatePreferenceAsync(new UpdateNotificationPreferenceInput
        {
            Category = NotificationCategory.Grants, InApp = false, Email = true
        });

        var grants = (await _appService.GetPreferencesAsync())
            .Single(p => p.Category == NotificationCategory.Grants);

        grants.InApp.ShouldBeFalse();
        grants.Email.ShouldBeTrue();

        // Diğer kategoriler varsayılanda kalmalı
        (await _appService.GetPreferencesAsync())
            .Single(p => p.Category == NotificationCategory.Tasks)
            .InApp.ShouldBeTrue();
    }

    [Fact]
    public async Task Update_Twice_Should_Not_Create_A_Second_Row()
    {
        var input = new UpdateNotificationPreferenceInput
        {
            Category = NotificationCategory.Ai, InApp = false, Email = false
        };

        await _appService.UpdatePreferenceAsync(input);
        input.InApp = true;
        await _appService.UpdatePreferenceAsync(input);

        var ai = (await _appService.GetPreferencesAsync())
            .Single(p => p.Category == NotificationCategory.Ai);

        ai.InApp.ShouldBeTrue();
    }

    [Fact]
    public async Task Muted_Category_Should_Not_Produce_A_Notification()
    {
        var userId = _currentUser.GetId();

        await _appService.UpdatePreferenceAsync(new UpdateNotificationPreferenceInput
        {
            Category = NotificationCategory.Documents, InApp = false, Email = false
        });

        await WithUnitOfWorkAsync(() => _manager.PublishAsync(
            userId, "başlık", "gövde", NotificationType.DocumentExpiring,
            entityType: "Document", entityId: Guid.NewGuid()));

        var rows = await _notificationRepository.GetListAsync(n => n.UserId == userId);
        rows.ShouldBeEmpty();
    }

    [Fact]
    public async Task Muting_One_Category_Should_Leave_Others_Working()
    {
        var userId = _currentUser.GetId();

        await _appService.UpdatePreferenceAsync(new UpdateNotificationPreferenceInput
        {
            Category = NotificationCategory.Documents, InApp = false, Email = false
        });

        await WithUnitOfWorkAsync(() => _manager.PublishAsync(
            userId, "görev", "gövde", NotificationType.TaskAssigned,
            entityType: "Task", entityId: Guid.NewGuid()));

        var rows = await _notificationRepository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1);
        rows[0].Category.ShouldBe(NotificationCategory.Tasks);
    }
}
