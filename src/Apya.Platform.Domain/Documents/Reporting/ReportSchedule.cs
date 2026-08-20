using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Zamanlanmış rapor üretimi.
///
/// Zamanlama MEVCUT bir teslim paketine bağlanır ve onu periyodik olarak
/// YENİDEN üretir; her üretim yeni bir <see cref="ReportRun"/> sürümü doğurur
/// (arşivdeki v10, v11, v12). Paketi otomatik kurmuyoruz: hangi belgelerin
/// hangi sırayla ek olacağı kullanıcı kararıdır ve tahmin edilirse kuruma
/// yanlış dosya gider.
/// </summary>
public class ReportSchedule : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DeliveryPackageId { get; private set; }

    public ReportScheduleFrequency Frequency { get; private set; }

    /// <summary>Aylık/üç aylık için ayın günü (1-28).</summary>
    public int DayOfMonth { get; private set; }

    /// <summary>Haftalık için haftanın günü.</summary>
    public DayOfWeek DayOfWeek { get; private set; }

    public int HourOfDay { get; private set; }

    public bool IsEnabled { get; private set; } = true;

    public DateTime NextRunAt { get; private set; }

    public DateTime? LastRunAt { get; private set; }

    /// <summary>
    /// Son denemenin hatası. Zamanlanmış üretim SESSİZCE başarısız olmamalı —
    /// preflight bloke ettiyse ya da dosya yazılamadıysa kullanıcı sebebini
    /// ekranda görür.
    /// </summary>
    public string? LastError { get; private set; }

    protected ReportSchedule() { }

    public ReportSchedule(
        Guid id,
        Guid? tenantId,
        Guid deliveryPackageId,
        ReportScheduleFrequency frequency,
        int dayOfMonth,
        DayOfWeek dayOfWeek,
        int hourOfDay,
        DateTime now) : base(id)
    {
        TenantId = tenantId;
        DeliveryPackageId = deliveryPackageId;
        Update(frequency, dayOfMonth, dayOfWeek, hourOfDay, now);
    }

    public void Update(
        ReportScheduleFrequency frequency,
        int dayOfMonth,
        DayOfWeek dayOfWeek,
        int hourOfDay,
        DateTime now)
    {
        Frequency = frequency;
        DayOfMonth = ReportScheduleCalculator.NormalizeDayOfMonth(dayOfMonth);
        DayOfWeek = dayOfWeek;
        HourOfDay = ReportScheduleCalculator.NormalizeHour(hourOfDay);

        NextRunAt = ReportScheduleCalculator.ComputeNextRun(
            Frequency, DayOfMonth, DayOfWeek, HourOfDay, now, isFirstRun: true);
    }

    public void SetEnabled(bool isEnabled, DateTime now)
    {
        IsEnabled = isEnabled;

        // Yeniden açılan zamanlama GEÇMİŞTE kalmış bir NextRunAt ile uyanmasın:
        // aksi halde açar açmaz üretim tetiklenirdi.
        if (isEnabled && NextRunAt <= now)
        {
            NextRunAt = ReportScheduleCalculator.ComputeNextRun(
                Frequency, DayOfMonth, DayOfWeek, HourOfDay, now, isFirstRun: true);
        }
    }

    public bool IsDue(DateTime now) => IsEnabled && NextRunAt <= now;

    /// <summary>
    /// Denemeyi kaydeder ve sıradaki anı hesaplar. Hata olsa da NextRunAt İLERLER:
    /// takılı kalan bir zamanlama her turda aynı hatayı tekrar üretirdi.
    /// </summary>
    public void MarkRun(DateTime now, string? error = null)
    {
        LastRunAt = now;
        LastError = string.IsNullOrWhiteSpace(error)
            ? null
            : error.Length > ReportingConsts.MaxScheduleErrorLength
                ? error[..ReportingConsts.MaxScheduleErrorLength]
                : error;

        NextRunAt = ReportScheduleCalculator.ComputeNextRun(
            Frequency, DayOfMonth, DayOfWeek, HourOfDay, now);
    }
}
