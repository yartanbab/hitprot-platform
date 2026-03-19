using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Notifications;

public class GetNotificationsInput : PagedResultRequestDto
{
    /// <summary>null = hepsi, true = sadece okunmayanlar, false = sadece okunanlar</summary>
    public bool? IsRead { get; set; }
}
