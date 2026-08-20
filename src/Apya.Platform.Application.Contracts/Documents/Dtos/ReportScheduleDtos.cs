using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class ReportScheduleDto : EntityDto<Guid>
{
    public Guid DeliveryPackageId { get; set; }

    /// <summary>Paketin adı — listede zamanlamanın neyi ürettiğini söyler.</summary>
    public string PackageName { get; set; } = string.Empty;

    public ReportScheduleFrequency Frequency { get; set; }
    public int DayOfMonth { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public int HourOfDay { get; set; }

    public bool IsEnabled { get; set; }
    public DateTime NextRunAt { get; set; }
    public DateTime? LastRunAt { get; set; }

    /// <summary>Son denemenin hatası; zamanlanmış üretim sessizce başarısız olmaz.</summary>
    public string? LastError { get; set; }

    public List<ReportSubscriberDto> Subscribers { get; set; } = new();
}

public class ReportSubscriberDto : EntityDto<Guid>
{
    public Guid ScheduleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public bool IsEnabled { get; set; }
}

public class CreateUpdateReportScheduleDto
{
    public Guid DeliveryPackageId { get; set; }

    public ReportScheduleFrequency Frequency { get; set; } = ReportScheduleFrequency.Monthly;

    /// <summary>1-28 arası; büyük değerler kırpılır (şubatta atlanmasın diye).</summary>
    [Range(1, 31)]
    public int DayOfMonth { get; set; } = 1;

    public DayOfWeek DayOfWeek { get; set; } = DayOfWeek.Monday;

    [Range(0, 23)]
    public int HourOfDay { get; set; } = 6;
}

public class CreateUpdateReportSubscriberDto
{
    [Required]
    [StringLength(ReportingConsts.MaxSubscriberNameLength)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(ReportingConsts.MaxSubscriberEmailLength)]
    public string Email { get; set; } = string.Empty;

    /// <summary>Uygulama kullanıcısıysa uygulama içi bildirim de gönderilir.</summary>
    public Guid? UserId { get; set; }
}
