using System;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Security.Encryption;

namespace Apya.Platform.Calendars;

/// <summary>
/// Dış takvim OAuth token'larını (AccessToken/RefreshToken) veritabanında şifreli tutmak için
/// <see cref="IStringEncryptionService"/>'i sarmalar. Entity daima ciphertext taşır:
/// her yazım <see cref="Protect"/>, her okuma <see cref="Unprotect"/> çağırır.
/// </summary>
public class CalendarTokenProtector : ITransientDependency
{
    private readonly IStringEncryptionService _encryptionService;
    private readonly ILogger<CalendarTokenProtector> _logger;

    public CalendarTokenProtector(
        IStringEncryptionService encryptionService,
        ILogger<CalendarTokenProtector> logger)
    {
        _encryptionService = encryptionService;
        _logger = logger;
    }

    /// <summary>Düz metin token'ı şifreler. Boş/null aynen (boş) döner.</summary>
    public string Protect(string? plainText)
    {
        if (string.IsNullOrEmpty(plainText))
            return string.Empty;

        return _encryptionService.Encrypt(plainText) ?? string.Empty;
    }

    /// <summary>
    /// Şifreli token'ı çözer. Boş/null aynen (boş) döner. Çözme başarısızsa (eski düz-metin kayıt
    /// veya parola rotasyonu) boş döner → çağıran hesabı "yeniden bağla" akışına düşer, çökme olmaz.
    /// </summary>
    public string Unprotect(string? cipherText)
    {
        if (string.IsNullOrEmpty(cipherText))
            return string.Empty;

        try
        {
            return _encryptionService.Decrypt(cipherText) ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex,
                "Takvim token'ı çözülemedi (eski düz-metin kayıt veya parola değişikliği olabilir); hesabın yeniden bağlanması gerekir.");
            return string.Empty;
        }
    }
}
