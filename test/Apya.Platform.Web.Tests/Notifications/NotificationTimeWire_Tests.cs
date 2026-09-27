using System;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Notifications;

/// <summary>
/// Zil menüsü <c>moment(item.lastOccurredAt).fromNow()</c> yazar. Değer UTC tutulur;
/// JSON'da sonunda 'Z' yoksa moment onu YEREL saat sanar ve TR'de yeni bildirim
/// "3 saat önce" görünür. Derleyici bu sözleşmeyi görmez — kilit tel üzerindedir.
/// </summary>
public class NotificationTimeWire_Tests : PlatformWebTestBase
{
    // FakeCurrentPrincipalAccessor'ın oturumdaki kullanıcısı
    private static readonly Guid UserId = Guid.Parse("2e701e62-0953-4dd3-910b-dc6cc93ccb0d");

    [Fact]
    public async Task Api_Should_Send_Utc_Times_With_Z_Suffix()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var notification = new Notification(
                Guid.NewGuid(), tenantId: null, UserId,
                NotificationType.TaskAssigned, "başlık", "saat testi");
            notification.MarkAsRead();
            await GetRequiredService<IRepository<Notification, Guid>>().InsertAsync(notification, autoSave: true);
            await uow.CompleteAsync();
        }

        var json = await GetResponseAsStringAsync("/api/app/notification/my-notifications?filter=saat%20testi");

        var item = JsonDocument.Parse(json).RootElement.GetProperty("items")[0];
        item.GetProperty("lastOccurredAt").GetString().ShouldEndWith("Z");
        item.GetProperty("readAt").GetString().ShouldEndWith("Z");
    }
}
