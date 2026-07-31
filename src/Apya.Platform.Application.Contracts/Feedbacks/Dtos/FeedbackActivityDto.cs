using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

/// <summary>Zaman çizelgesi satırı. Yalnızca yönetici panelinde gösterilir.</summary>
public class FeedbackActivityDto : EntityDto<Guid>
{
    public FeedbackActivityType Type { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string? Note { get; set; }
    public string? ActorName { get; set; }
    public bool IsInternal { get; set; }
    public DateTime CreationTime { get; set; }
}

/// <summary>Atama açılır listesi için hafif kullanıcı bilgisi.</summary>
public class FeedbackAssigneeDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? Name { get; set; }
}
