using System;
using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Emailing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Web.Mailing;

/// <summary>
/// GELİŞTİRME ORTAMI e-posta göndericisi: postayı yollamak yerine
/// <c>App_Data/mail-drop</c> altına <c>.eml</c> olarak yazar.
///
/// <para><b>Neden var:</b> önceden yerelde <c>NullEmailSender</c> devredeydi ve e-postalar
/// SESSİZCE yutuluyordu. Davet bağlantısı, şifre sıfırlama, bildirim özeti — hiçbirinin
/// içeriği doğrulanamıyordu; "gönderildi" logu tek kanıttı. Dosyaya yazınca konu, alıcı
/// ve gövde gerçekten okunabiliyor.</para>
///
/// <para>Üretilen dosya standart MIME değil, okunabilir bir dökümdür; amaç posta
/// istemcisiyle açmak değil, içeriği gözle doğrulamaktır.</para>
///
/// <para>🔴 Yalnız <c>#if DEBUG</c> altında kaydedilir (bkz. <c>PlatformWebModule</c>).
/// Release derlemede ABP'nin gerçek SMTP göndericisi devrededir.</para>
/// </summary>
public class FileDropEmailSender : EmailSenderBase
{
    private readonly IHostEnvironment _environment;
    private readonly ILogger<FileDropEmailSender> _logger;

    public FileDropEmailSender(
        ICurrentTenant currentTenant,
        IEmailSenderConfiguration configuration,
        IBackgroundJobManager backgroundJobManager,
        IHostEnvironment environment,
        ILogger<FileDropEmailSender> logger)
        : base(currentTenant, configuration, backgroundJobManager)
    {
        _environment = environment;
        _logger = logger;
    }

    protected override async Task SendEmailAsync(MailMessage mail)
    {
        var folder = Path.Combine(_environment.ContentRootPath, "App_Data", "mail-drop");
        Directory.CreateDirectory(folder);

        // Dosya adı zamana göre sıralanır ve konuyu taşır: klasöre bakan kişi aradığı
        // postayı açmadan bulabilsin.
        var fileName = $"{DateTime.Now:yyyyMMdd-HHmmss-fff}_{Sanitize(mail.Subject)}.eml";
        var path = Path.Combine(folder, fileName);

        var content = $"""
            From: {mail.From}
            To: {string.Join(", ", mail.To)}
            Subject: {mail.Subject}
            Date: {DateTime.Now:R}
            Content-Type: {(mail.IsBodyHtml ? "text/html" : "text/plain")}; charset=utf-8

            {mail.Body}
            """;

        await File.WriteAllTextAsync(path, content);

        _logger.LogInformation("E-posta gönderilmedi, dosyaya yazıldı: {Path}", path);
    }

    /// <summary>Konudaki dosya adında kullanılamayan karakterleri temizler.</summary>
    private static string Sanitize(string? subject)
    {
        if (string.IsNullOrWhiteSpace(subject))
        {
            return "konusuz";
        }

        var cleaned = subject.Trim();
        foreach (var invalid in Path.GetInvalidFileNameChars())
        {
            cleaned = cleaned.Replace(invalid, '-');
        }

        return cleaned.Length <= 60 ? cleaned : cleaned[..60];
    }
}
