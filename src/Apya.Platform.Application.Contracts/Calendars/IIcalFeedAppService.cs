using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

/// <summary>Salt-okunur iCal abonelik bağlantısı (dışa aktarım).</summary>
public interface IIcalFeedAppService : IApplicationService
{
    /// <summary>Kullanıcının bağlantısı — yoksa üretilir. Kayıt OLUŞTURDUĞU için
    /// GET değil POST: yan etkisi olan bir çağrı GET gibi görünmemeli.</summary>
    Task<IcalFeedTokenDto> EnsureAsync();

    /// <summary>Token'ı yeniler; eski bağlantı anında geçersizleşir.</summary>
    Task<IcalFeedTokenDto> RegenerateAsync();

    /// <summary>Anonim uç için .ics gövdesi. Token geçersizse null.</summary>
    Task<string?> RenderAsync(string token);
}

public class IcalFeedTokenDto
{
    public string Token { get; set; } = string.Empty;

    /// <summary>Uygulama köküne göre yol — tam URL'i istemci kendi origin'iyle kurar.</summary>
    public string Path { get; set; } = string.Empty;

    public DateTime? LastAccessedAt { get; set; }
}
