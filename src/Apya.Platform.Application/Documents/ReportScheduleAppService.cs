using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Permissions;

namespace Apya.Platform.Documents;

/// <summary>
/// Zamanlanmış rapor üretiminin TANIMI. Üretimin kendisini Web katmanındaki
/// worker yapar (PDF/Excel üreteci orada yaşıyor).
/// </summary>
[Authorize(PlatformPermissions.Documents.GenerateReports)]
public class ReportScheduleAppService : ApplicationService, IReportScheduleAppService
{
    private readonly IRepository<ReportSchedule, Guid> _scheduleRepository;
    private readonly IRepository<ReportSubscriber, Guid> _subscriberRepository;
    private readonly IRepository<DeliveryPackage, Guid> _packageRepository;

    public ReportScheduleAppService(
        IRepository<ReportSchedule, Guid> scheduleRepository,
        IRepository<ReportSubscriber, Guid> subscriberRepository,
        IRepository<DeliveryPackage, Guid> packageRepository)
    {
        _scheduleRepository = scheduleRepository;
        _subscriberRepository = subscriberRepository;
        _packageRepository = packageRepository;
    }

    public virtual async Task<List<ReportScheduleDto>> GetListAsync(Guid projectId)
    {
        var packageIds = (await AsyncExecuter.ToListAsync(
                (await _packageRepository.GetQueryableAsync()).AsNoTracking()
                    .Where(p => p.ProjectId == projectId)
                    .Select(p => new { p.Id, p.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        if (packageIds.Count == 0)
        {
            return new List<ReportScheduleDto>();
        }

        var ids = packageIds.Keys.ToList();
        var schedules = (await _scheduleRepository.GetListAsync(s => ids.Contains(s.DeliveryPackageId)))
            .OrderBy(s => s.NextRunAt)
            .ToList();

        if (schedules.Count == 0)
        {
            return new List<ReportScheduleDto>();
        }

        var scheduleIds = schedules.Select(s => s.Id).ToList();
        var subscribers = await _subscriberRepository.GetListAsync(x => scheduleIds.Contains(x.ScheduleId));

        return schedules.Select(s => Map(s, packageIds.GetValueOrDefault(s.DeliveryPackageId) ?? "(silinmiş paket)",
            subscribers.Where(x => x.ScheduleId == s.Id))).ToList();
    }

    public virtual async Task<ReportScheduleDto> CreateAsync(CreateUpdateReportScheduleDto input)
    {
        var package = await _packageRepository.GetAsync(input.DeliveryPackageId);

        var schedule = new ReportSchedule(
            GuidGenerator.Create(), CurrentTenant.Id, package.Id,
            input.Frequency, input.DayOfMonth, input.DayOfWeek, input.HourOfDay, Clock.Now);

        await _scheduleRepository.InsertAsync(schedule, autoSave: true);

        return Map(schedule, package.Name, Array.Empty<ReportSubscriber>());
    }

    public virtual async Task<ReportScheduleDto> UpdateAsync(Guid id, CreateUpdateReportScheduleDto input)
    {
        var schedule = await _scheduleRepository.GetAsync(id);
        schedule.Update(input.Frequency, input.DayOfMonth, input.DayOfWeek, input.HourOfDay, Clock.Now);
        await _scheduleRepository.UpdateAsync(schedule);

        return await MapWithContextAsync(schedule);
    }

    public virtual async Task<ReportScheduleDto> SetEnabledAsync(Guid id, bool isEnabled)
    {
        var schedule = await _scheduleRepository.GetAsync(id);
        schedule.SetEnabled(isEnabled, Clock.Now);
        await _scheduleRepository.UpdateAsync(schedule);

        return await MapWithContextAsync(schedule);
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var subscribers = await _subscriberRepository.GetListAsync(s => s.ScheduleId == id);
        if (subscribers.Count > 0)
        {
            await _subscriberRepository.DeleteManyAsync(subscribers);
        }

        await _scheduleRepository.DeleteAsync(id);
    }

    public virtual async Task<ReportSubscriberDto> AddSubscriberAsync(
        Guid scheduleId, CreateUpdateReportSubscriberDto input)
    {
        await _scheduleRepository.GetAsync(scheduleId);

        var subscriber = new ReportSubscriber(
            GuidGenerator.Create(), CurrentTenant.Id, scheduleId, input.Name, input.Email, input.UserId);

        await _subscriberRepository.InsertAsync(subscriber, autoSave: true);

        return MapSubscriber(subscriber);
    }

    public virtual async Task RemoveSubscriberAsync(Guid subscriberId)
        => await _subscriberRepository.DeleteAsync(subscriberId);

    /* ─────────────────────────── Eşleme ─────────────────────────── */

    private async Task<ReportScheduleDto> MapWithContextAsync(ReportSchedule schedule)
    {
        var package = await _packageRepository.FindAsync(schedule.DeliveryPackageId);
        var subscribers = await _subscriberRepository.GetListAsync(s => s.ScheduleId == schedule.Id);

        return Map(schedule, package?.Name ?? "(silinmiş paket)", subscribers);
    }

    private static ReportScheduleDto Map(
        ReportSchedule schedule, string packageName, IEnumerable<ReportSubscriber> subscribers) => new()
    {
        Id = schedule.Id,
        DeliveryPackageId = schedule.DeliveryPackageId,
        PackageName = packageName,
        Frequency = schedule.Frequency,
        DayOfMonth = schedule.DayOfMonth,
        DayOfWeek = schedule.DayOfWeek,
        HourOfDay = schedule.HourOfDay,
        IsEnabled = schedule.IsEnabled,
        NextRunAt = schedule.NextRunAt,
        LastRunAt = schedule.LastRunAt,
        LastError = schedule.LastError,
        Subscribers = subscribers.Select(MapSubscriber).ToList(),
    };

    private static ReportSubscriberDto MapSubscriber(ReportSubscriber subscriber) => new()
    {
        Id = subscriber.Id,
        ScheduleId = subscriber.ScheduleId,
        Name = subscriber.Name,
        Email = subscriber.Email,
        UserId = subscriber.UserId,
        IsEnabled = subscriber.IsEnabled,
    };
}
