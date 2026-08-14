using System;
using System.Linq;
using Apya.Platform.Notifications;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Notifications;

/// <summary>
/// Bildirim hiyerarşisinin KİLİT SÖZLEŞMESİ testi.
/// <para>
/// Kategori, aciliyet, ikon ve derin link tek kaynaktan — registry'den — gelir.
/// Yeni bir <see cref="NotificationType"/> eklenip kaydı unutulursa bildirim
/// sessizce "System / Normal / tıklanamaz" olarak düşer; aşağıdaki kapsama
/// testi bunu derleme değil test hatasına çevirir.
/// </para>
/// </summary>
public class NotificationTypeRegistry_Tests
{
    [Fact]
    public void Every_NotificationType_Should_Have_A_Registry_Entry()
    {
        var unregistered = Enum.GetValues<NotificationType>()
            .Where(t => NotificationTypeRegistry.Get(t).Category == NotificationCategory.System)
            .ToList();

        unregistered.ShouldBeEmpty(
            $"Kaydı olmayan bildirim türleri: {string.Join(", ", unregistered)}");
    }

    [Fact]
    public void DeepLink_Should_Bind_EntityId_When_Template_Is_Record_Specific()
    {
        var taskId = Guid.NewGuid();

        NotificationTypeRegistry.BuildDeepLink(NotificationType.TaskAssigned, taskId)
            .ShouldBe($"/Tasks/Detail/{taskId}");
    }

    [Fact]
    public void DeepLink_Should_Never_Point_At_A_Layoutless_Modal_Page()
    {
        // Görev bildirimleri /Tasks/EditModal'a gidiyordu; o sayfa Layout = null
        // olduğu için tam sayfa gidildiğinde menüsüz bir form açılıyordu.
        var links = Enum.GetValues<NotificationType>()
            .Select(t => NotificationTypeRegistry.Get(t).DeepLinkTemplate)
            .Where(l => l != null);

        links.ShouldAllBe(l => !l!.Contains("Modal"));
    }

    [Fact]
    public void DeepLink_Should_Be_Null_When_Template_Needs_An_EntityId_But_None_Given()
    {
        NotificationTypeRegistry.BuildDeepLink(NotificationType.TaskAssigned, null)
            .ShouldBeNull();
    }

    [Fact]
    public void DeepLink_Should_Fall_Back_To_The_List_Page_When_Template_Is_Record_Agnostic()
    {
        // Belge/hibe/geri bildirim sayfaları henüz tekil kayda odaklanmayı
        // desteklemiyor; entityId olsa da olmasa da listeye gidilir.
        NotificationTypeRegistry.BuildDeepLink(NotificationType.DocumentExpiring, Guid.NewGuid())
            .ShouldBe("/Documents");

        NotificationTypeRegistry.BuildDeepLink(NotificationType.DocumentExpiring, null)
            .ShouldBe("/Documents");
    }

    [Fact]
    public void GroupKey_Should_Be_Produced_Only_For_Repeatable_Types()
    {
        var entityId = Guid.NewGuid();

        // Yorum tekrarlanır → gruplanır
        NotificationTypeRegistry.BuildGroupKey(NotificationType.TaskCommentAdded, "Task", entityId)
            .ShouldBe($"2:Task:{entityId}");

        // Atama tekil olaydır → gruplanmaz
        NotificationTypeRegistry.BuildGroupKey(NotificationType.TaskAssigned, "Task", entityId)
            .ShouldBeNull();

        // Kayda bağlı olmayan bildirim gruplanamaz
        NotificationTypeRegistry.BuildGroupKey(NotificationType.TaskCommentAdded, "Task", null)
            .ShouldBeNull();
    }

    [Fact]
    public void Every_Type_Should_Carry_An_Icon()
    {
        foreach (var type in Enum.GetValues<NotificationType>())
        {
            NotificationTypeRegistry.Get(type).Icon.ShouldNotBeNullOrWhiteSpace();
        }
    }
}
