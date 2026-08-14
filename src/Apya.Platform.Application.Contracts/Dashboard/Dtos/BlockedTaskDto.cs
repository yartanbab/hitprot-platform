using System;

namespace Apya.Platform.Dashboard.Dtos;

/// <summary>"Tıkanan işler &amp; risk" kartının bir satırı.</summary>
public class BlockedTaskDto
{
    public Guid TaskId { get; set; }

    /// <summary>Görev kodu — <c>TaskItem.Number</c>'dan üretilir (örn. "#142").</summary>
    public string Code { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public TaskBlockReason BlockReason { get; set; }

    /// <summary>Son değişiklikten bu yana geçen gün.</summary>
    public int IdleDays { get; set; }

    /// <summary>Bu göreve bağımlı açık görev sayısı — kaç iş bekliyor.</summary>
    public int DependentCount { get; set; }
}
