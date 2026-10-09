using System;
using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Notifications;

/// <summary>
/// NTF-10: Günlük özet e-postası doğrudan gönderiliyordu; geçici bir SMTP hatasında o günün
/// özeti tamamen düşüyordu. Anlık bildirim e-postaları (<c>NotificationManager</c>) zaten
/// kuyruğa alınıyor — kuyruk hatada yeniden dener. İşçi korumalı bir metot içinde çalıştığı
/// için kural kaynaktan okunur.
/// </summary>
public class NotificationDigestQueue_Tests
{
    [Fact]
    public void Gunluk_Ozet_Dogrudan_Gonderilmez_Kuyruga_Alinir()
    {
        var source = File.ReadAllText(Path.Combine(
            RepoRoot(), "src", "Apya.Platform.Domain", "Notifications", "NotificationDigestWorker.cs"));

        source.ShouldContain("emailSender.QueueAsync(");
        source.ShouldNotContain("emailSender.SendAsync(");
    }

    private static string RepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (Directory.Exists(Path.Combine(dir.FullName, "src", "Apya.Platform.Domain")))
            {
                return dir.FullName;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Depo kökü bulunamadı.");
    }
}
