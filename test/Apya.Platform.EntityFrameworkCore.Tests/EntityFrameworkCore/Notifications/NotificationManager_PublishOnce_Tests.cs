using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Notifications;

/// <summary>
/// "Bir kez gönder" sözleşmesi: eşik uyarıları durum başına tek bildirim üretir.
/// <para>
/// Eşik koşulu ("kalem %90'ı geçti") bir kez doğru olduktan sonra kalıcı olarak
/// doğru kalır. Worker her gün koştuğu için normal <c>PublishAsync</c> kullanılsaydı
/// kullanıcı aynı uyarıyı her sabah alırdı. Testler hafızanın okuma ve silme
/// karşısında da ayakta kaldığını doğrular — kullanıcının uyarıyı silmesi
/// "bu durum bildirildi" gerçeğini değiştirmemeli.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class NotificationManager_PublishOnce_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly NotificationManager _manager;
    private readonly IRepository<Notification, Guid> _repository;

    public NotificationManager_PublishOnce_Tests()
    {
        _manager    = GetRequiredService<NotificationManager>();
        _repository = GetRequiredService<IRepository<Notification, Guid>>();
    }

    private Task<bool> PublishOnceAsync(Guid userId, string onceKey, string body = "gövde")
        => WithUnitOfWorkAsync(() => _manager.PublishOnceAsync(
            userId, onceKey, "başlık", body,
            NotificationType.BudgetUsageThresholdReached,
            entityType: "Project", entityId: Guid.NewGuid()));

    [Fact]
    public async Task Same_Key_Should_Produce_Exactly_One_Row()
    {
        var userId  = Guid.NewGuid();
        var onceKey = $"29:BudgetLine:{Guid.NewGuid()}:90";

        (await PublishOnceAsync(userId, onceKey, "ilk")).ShouldBeTrue();
        (await PublishOnceAsync(userId, onceKey, "ikinci")).ShouldBeFalse();
        (await PublishOnceAsync(userId, onceKey, "üçüncü")).ShouldBeFalse();

        var rows = await _repository.GetListAsync(n => n.UserId == userId);

        rows.Count.ShouldBe(1);
        rows[0].Body.ShouldBe("ilk");                 // metin TAZELENMEZ; gruplama değil bu
        rows[0].OccurrenceCount.ShouldBe(1);
        rows[0].GroupKey.ShouldBe(onceKey);
        rows[0].Category.ShouldBe(NotificationCategory.Finance);
    }

    [Fact]
    public async Task Reading_The_Row_Should_Not_Reopen_The_Door()
    {
        // Gruplama okunmuş satırdan sonra yenisini açar; "bir kez" bunun tam tersi.
        var userId  = Guid.NewGuid();
        var onceKey = $"29:BudgetLine:{Guid.NewGuid()}:90";

        await PublishOnceAsync(userId, onceKey);

        await WithUnitOfWorkAsync(async () =>
        {
            var row = (await _repository.GetListAsync(n => n.UserId == userId)).Single();
            row.MarkAsRead();
            await _repository.UpdateAsync(row);
        });

        (await PublishOnceAsync(userId, onceKey)).ShouldBeFalse();

        (await _repository.GetListAsync(n => n.UserId == userId)).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Deleting_The_Row_Should_Not_Reopen_The_Door()
    {
        // Silinen satır global filtre yüzünden sorguya girmez; arama soft-delete
        // filtresini kapatmasaydı kullanıcı uyarıyı sildiği gün yenisini alırdı.
        var userId  = Guid.NewGuid();
        var onceKey = $"29:BudgetLine:{Guid.NewGuid()}:90";

        await PublishOnceAsync(userId, onceKey);

        await WithUnitOfWorkAsync(async () =>
        {
            var row = (await _repository.GetListAsync(n => n.UserId == userId)).Single();
            await _repository.DeleteAsync(row);
        });

        (await PublishOnceAsync(userId, onceKey)).ShouldBeFalse();

        (await _repository.GetListAsync(n => n.UserId == userId)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Different_Thresholds_Should_Each_Fire_Once()
    {
        // %90 uyarısı %100 uyarısını engellememeli: eşik anahtarın parçasıdır.
        var userId = Guid.NewGuid();
        var lineId = Guid.NewGuid();

        (await PublishOnceAsync(userId, $"29:BudgetLine:{lineId}:75")).ShouldBeTrue();
        (await PublishOnceAsync(userId, $"29:BudgetLine:{lineId}:90")).ShouldBeTrue();
        (await PublishOnceAsync(userId, $"29:BudgetLine:{lineId}:90")).ShouldBeFalse();

        (await _repository.GetListAsync(n => n.UserId == userId)).Count.ShouldBe(2);
    }

    [Fact]
    public async Task Once_Memory_Should_Not_Leak_Across_Users()
    {
        var onceKey    = $"29:BudgetLine:{Guid.NewGuid()}:90";
        var firstUser  = Guid.NewGuid();
        var secondUser = Guid.NewGuid();

        (await PublishOnceAsync(firstUser,  onceKey)).ShouldBeTrue();
        (await PublishOnceAsync(secondUser, onceKey)).ShouldBeTrue();

        (await _repository.GetListAsync(n => n.UserId == firstUser)).Count.ShouldBe(1);
        (await _repository.GetListAsync(n => n.UserId == secondUser)).Count.ShouldBe(1);
    }

    [Fact]
    public async Task Silenced_Category_Should_Produce_Nothing()
    {
        var userId = Guid.NewGuid();
        var preferenceRepository = GetRequiredService<IRepository<NotificationPreference, Guid>>();

        await WithUnitOfWorkAsync(() => preferenceRepository.InsertAsync(
            new NotificationPreference(
                Guid.NewGuid(), null, userId, NotificationCategory.Finance,
                inApp: false, email: false)));

        (await PublishOnceAsync(userId, $"29:BudgetLine:{Guid.NewGuid()}:90")).ShouldBeFalse();

        (await _repository.GetListAsync(n => n.UserId == userId)).ShouldBeEmpty();
    }
}
