using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>"Bu ay teslim edilecekler" listesinin bir satırı.</summary>
public class DeliveryItemDto
{
    public Guid TaskId { get; set; }

    public string Title { get; set; } = string.Empty;

    public Guid? ProjectId { get; set; }

    /// <summary>Projesiz görevlerde boş string — UI proje pill'ini gizler.</summary>
    public string ProjectName { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    public DeliveryState State { get; set; }

    /// <summary>Yalnız <see cref="DeliveryState.Overdue"/> için dolu.</summary>
    public int? OverdueDays { get; set; }

    /// <summary>Atanan yoksa boş string.</summary>
    public string AssigneeInitials { get; set; } = string.Empty;

    public string AssigneeName { get; set; } = string.Empty;

    public DeliveryGroup GroupKey { get; set; }
}
