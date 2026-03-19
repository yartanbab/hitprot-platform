using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Calendars;

public class CalendarAccountDto : EntityDto<Guid>
{
    public CalendarProviderType Provider { get; set; }
    public string ExternalEmail { get; set; }
    public bool IsSyncEnabled { get; set; }
    public DateTime? LastSyncTime { get; set; }
}

public class ConnectCalendarInput
{
    public CalendarProviderType Provider { get; set; }
    public string ExternalEmail { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}
