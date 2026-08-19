using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

public interface ICalendarAppService : IApplicationService
{
    /// <summary>
    /// Takvimin tek veri ucu: verilen aralıktaki tüm kaynakları (görev, fatura, hibe,
    /// gider, gelir, kasa hareketi) tek şekle indirger. İzin verilmeyen kaynak
    /// sorgulanmaz, ray satırında <c>IsAvailable=false</c> döner.
    /// </summary>
    Task<CalendarFeedDto> GetFeedAsync(GetCalendarFeedInput input);

    /// <summary>
    /// Öğeyi başka güne taşır. Yalnız <see cref="CalendarItemDto.CanReschedule"/> olan
    /// kaynaklarda geçerlidir: fatura/gider/gelir vadeleri ve hibe son tarihleri
    /// muhasebe/kurum kaydıdır, takvimden sürüklenerek değiştirilmez.
    /// </summary>
    Task RescheduleItemAsync(RescheduleCalendarItemInput input);

    /// <summary>Öğeyi kapatır (görev → Tamamlandı). Kapatılamayan kaynakta hata döner.</summary>
    Task CompleteItemAsync(CompleteCalendarItemInput input);

    /// <summary>
    /// Bağlı dış takvimlerden aralıktaki etkinlikleri okur. İç feed'den ayrı uçtur:
    /// yavaş/kırılgan bir dış çağrı takvimin kalanını bekletmesin ve bir hesabın
    /// bozuk bağlantısı diğerlerini düşürmesin diye.
    /// </summary>
    Task<CalendarExternalEventsDto> GetExternalEventsAsync(GetCalendarFeedInput input);

    /// <summary>Takvim tercihleri: kapasite, açık kaynaklar, kurulum durumu.</summary>
    Task<CalendarPreferencesDto> GetPreferencesAsync();

    /// <summary>Tercihleri yazar (kurulum sihirbazı ve ayarlar buradan geçer).</summary>
    Task UpdatePreferencesAsync(UpdateCalendarPreferencesInput input);

    /// <summary>
    /// Birden çok öğeyi tek çağrıda taşır (akıllı toplu erteleme). Satır satır sonuç
    /// döner: biri başarısız olursa diğerleri uygulanmış kalır ve hata O SATIRDA görünür.
    /// </summary>
    Task<List<BulkRescheduleResultDto>> BulkRescheduleAsync(List<RescheduleCalendarItemInput> items);

    /// <summary>Senkron drawer.ının içeriği: bağlı hesaplar, kuralları ve senkron günlüğü.</summary>
    Task<CalendarSyncSettingsDto> GetSyncSettingsAsync();

    /// <summary>Bir hesabın senkron kurallarını günceller (hangi kaynaklar, hangi projeler, çakışma kuralı).</summary>
    Task UpdateSyncRulesAsync(UpdateCalendarSyncRulesInput input);

    Task<List<CalendarAccountDto>> GetMyAccountsAsync();
    Task ConnectAccountAsync(ConnectCalendarInput input);
    Task DisconnectAccountAsync(Guid id);
    Task<string> GetAuthUrlAsync(CalendarProviderType provider);
    Task ExchangeCodeAndConnectAsync(CalendarProviderType provider, string code, string redirectUri, string stateToken);
    Task ForceSyncAsync(Guid id);
}
