using System;
using Volo.Abp.EventBus;

namespace Apya.Platform.Tasks;

/// <summary>
/// 🔴 NTF-03: Vadesi geçmiş görev. <see cref="TaskDueSoonEto"/> yalnız "önümüzdeki
/// 48 saat" penceresini tarıyordu; vadeyi geçen görev sorguya hiç girmiyordu ve
/// geciken iş tamamen sessiz kalıyordu.
///
/// <para><see cref="DueDate"/> tekillik anahtarının parçasıdır: vade ertelenip
/// yeniden geçilirse ikinci bir uyarı üretilir, aynı vade için üretilmez.</para>
/// </summary>
[EventName("Apya.Platform.Tasks.TaskOverdue")]
public class TaskOverdueEto
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public Guid AssigneeId { get; set; }
    public DateTime DueDate { get; set; }

    /// <summary>Vadeyi kaç tam gün geçti — gövdede kullanıcıya gösterilir.</summary>
    public int DaysOverdue { get; set; }
}
