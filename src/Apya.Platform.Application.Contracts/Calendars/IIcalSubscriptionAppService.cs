using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

/// <summary>
/// Dışarıdan eklenen .ics abonelikleri (Apple Takvim, Notion, resmî tatiller…).
/// TEK YÖNLÜDÜR: etkinlikler APYA'da salt-okunur görünür, APYA öğeleri oraya yazılmaz.
/// </summary>
public interface IIcalSubscriptionAppService : IApplicationService
{
    Task<List<IcalSubscriptionDto>> GetListAsync();

    /// <summary>
    /// Bağlantıyı ekler. Adres ÖNCE doğrulanır (indirilir ve ayrıştırılır); geçersizse
    /// kayıt oluşturulmaz — kullanıcı bozuk bir aboneliği listede görmesin.
    /// </summary>
    Task<IcalSubscriptionDto> AddAsync(AddIcalSubscriptionInput input);

    Task<IcalSubscriptionDto> UpdateAsync(Guid id, AddIcalSubscriptionInput input);

    Task DeleteAsync(Guid id);

    /// <summary>Aboneliği şimdi yeniden çeker (kullanıcı "düzelt" dediğinde).</summary>
    Task<IcalSubscriptionDto> RefreshAsync(Guid id);

    /// <summary>
    /// Adresi kaydetmeden dener: kaç etkinlik bulundu? Ekleme formundaki
    /// "bağlantı doğrulandı · 38 etkinlik bulundu" satırı bunu kullanır.
    /// </summary>
    Task<IcalProbeResultDto> ProbeAsync(string url);
}

public class IcalSubscriptionDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Color { get; set; } = "accent";
    public int RefreshMinutes { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime? LastFetchedAt { get; set; }
    public int LastEventCount { get; set; }
    public string? LastError { get; set; }
}

public class AddIcalSubscriptionInput
{
    public string Url { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Color { get; set; } = "accent";
    public int RefreshMinutes { get; set; } = 60;
}

public class IcalProbeResultDto
{
    public bool IsValid { get; set; }
    public int EventCount { get; set; }

    /// <summary>Dosyadaki takvim adı — kullanıcı görünen ad yazmadıysa öneri olarak kullanılır.</summary>
    public string? SuggestedName { get; set; }

    public string? Error { get; set; }
}
