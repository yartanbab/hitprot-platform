using System;
using Apya.Platform.Macros;
using Apya.Platform.Notifications;
using Shouldly;
using Xunit;

namespace Apya.Platform.Application.Tests.Macros;

/// <summary>
/// Güncelleme rozeti eşlemesi: bildirim bağlantısı → makro. En uzun yol parçası kazanır; parça
/// sınırı gözetilir; eşlenmeyen bildirim rozete girmez.
/// </summary>
public class MacroNotificationLink_Tests
{
    [Theory]
    [InlineData("/Tasks/Detail/3fa85f64-5717-4562-b3fc-2c963f66afa6", "Boards")]
    [InlineData("/Projects/ProjectDetails/3fa85f64-5717-4562-b3fc-2c963f66afa6?view=indicators", "Projects")]
    [InlineData("/Grants/Wizard?id=1", "GrantsMyApplications")]
    [InlineData("/Grants/Appeal?id=1", "GrantsMyApplications")]
    [InlineData("/Grants?x=1", "GrantsCalls")]
    [InlineData("/Grants/Detail?id=1", "GrantsCalls")]
    [InlineData("/Grants/Requests", "GrantsRequests")]
    [InlineData("/Grants/DetailHost?id=1", "GrantsApplications")]
    [InlineData("/Reports/ProjectBudget?ProjectId=1", "FinanceHub")]
    [InlineData("/Documents?folder=1", "Documents")]
    [InlineData("/Feedback", null)]
    [InlineData("/GrantsX", null)]
    [InlineData(null, null)]
    public void Baglanti_dogru_makroya_eslenir(string? link, string? key)
    {
        MacroCatalog.MatchNotificationLink(link).ShouldBe(key);
    }

    /// <summary>
    /// Kayıtlı her bildirim türünün bağlantısı ya bilinçli bir makroya ya da hiçbirine düşer — yeni tür
    /// eklenince buradaki "rozetsiz" listesi gözden geçirilir.
    /// </summary>
    [Fact]
    public void Rozetsiz_turler_bilincli()
    {
        var unmapped = new System.Collections.Generic.List<string>();
        foreach (NotificationType type in Enum.GetValues(typeof(NotificationType)))
        {
            var link = NotificationTypeRegistry.BuildDeepLink(type, Guid.NewGuid());
            if (link != null && MacroCatalog.MatchNotificationLink(link) == null)
            {
                unmapped.Add(link.Split('?')[0]);
            }
        }

        // N-05 · Kayıt talepleri host yönetim sayfasıdır; makrosu yok, rozete bilinçli olarak girmez.
        unmapped.ShouldAllBe(path =>
            path == "/Feedback" || path == "/Subscription" || path == "/AiCenter/Evaluations" || path.StartsWith("/Calendars")
            || path == "/Admin/RegistrationRequests");
    }
}
