using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Telemetry.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Telemetry;

/// <summary>Host yöneticisi için teşhis paneli. Yalnızca host bağlamında çalışır.</summary>
public interface ISystemHealthAppService : IApplicationService
{
    Task<SystemHealthDto> GetAsync(int windowDays = 7);

    Task<PagedResultDto<ClientErrorDto>> GetClientErrorsAsync(GetClientErrorListInput input);

    Task<ClientErrorDto> GetClientErrorAsync(Guid id);

    Task SetClientErrorResolvedAsync(Guid id, bool isResolved);

    /// <summary>
    /// Bir ucun pencere içindeki sunucu hataları — "En Çok Hata Veren Uçlar"
    /// satırından açılan detay için. Yeni tablo yok; AbpAuditLogs okunur.
    /// </summary>
    Task<List<ServerErrorDetailDto>> GetServerErrorsAsync(GetServerErrorListInput input);

    /// <summary>
    /// Teşhis konsolunun birleşik olay listesi: istemci hataları, sunucu hataları ve
    /// performans ihlalleri TEK listede, varsayılan olarak etkiye göre sıralı.
    /// <para>
    /// Sunucu ve performans olayları ayrıktır: hata veren bir uç sunucu hatası sayılır,
    /// performans ihlali olarak İKİNCİ kez listelenmez.
    /// </para>
    /// </summary>
    Task<HealthIssueListDto> GetIssuesAsync(GetHealthIssueListInput input);

    /// <summary>
    /// Seçili olayın kanıt paneli. Dolu bölümler kanala göre değişir; boş bölüm için
    /// arayüz sekme çizmez.
    /// </summary>
    Task<HealthIssueDetailDto> GetIssueDetailAsync(GetHealthIssueDetailInput input);

    /// <summary>
    /// Bir istemci hatasının görülme anıyla ve kiracısıyla örtüşen sunucu kayıtları —
    /// "tarayıcıda patladı, o an sunucuda ne oldu?" Yakınlık kanıtıdır, nedensellik
    /// kanıtı DEĞİLDİR.
    /// </summary>
    Task<List<CorrelatedServerErrorDto>> GetCorrelatedServerErrorsAsync(GetCorrelationInput input);
}
