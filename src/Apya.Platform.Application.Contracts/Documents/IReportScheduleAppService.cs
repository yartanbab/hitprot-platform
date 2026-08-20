using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Zamanlanmış rapor üretimi ve aboneleri.
///
/// Zamanlama MEVCUT bir teslim paketini periyodik olarak yeniden üretir; her
/// üretim sürüm arşivine yeni bir satır ekler. Üretimi worker yapar
/// (Web katmanında — PDF üreteci orada yaşıyor); bu servis yalnız tanımı yönetir.
/// </summary>
public interface IReportScheduleAppService : IApplicationService
{
    Task<List<ReportScheduleDto>> GetListAsync(Guid projectId);

    Task<ReportScheduleDto> CreateAsync(CreateUpdateReportScheduleDto input);

    Task<ReportScheduleDto> UpdateAsync(Guid id, CreateUpdateReportScheduleDto input);

    Task<ReportScheduleDto> SetEnabledAsync(Guid id, bool isEnabled);

    Task DeleteAsync(Guid id);

    Task<ReportSubscriberDto> AddSubscriberAsync(Guid scheduleId, CreateUpdateReportSubscriberDto input);

    Task RemoveSubscriberAsync(Guid subscriberId);
}
