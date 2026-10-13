using System;
using System.Collections.Generic;
using Volo.Abp.EventBus;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Göstergenin hedef tarihi geçti, hedefe ulaşılmadı.
///
/// <para><see cref="TargetDate"/> tekillik anahtarının parçasıdır: gösterge hedef tarihi başına
/// BİR KEZ bildirilir; hedef tarihi ertelenip yeniden kaçırılırsa yeniden bildirilir.</para>
/// </summary>
[EventName("Apya.Platform.Projects.ProjectIndicatorBehind")]
public class ProjectIndicatorBehindEto
{
    public Guid IndicatorId { get; set; }
    public Guid ProjectId { get; set; }
    public string IndicatorName { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public string? Unit { get; set; }
    public decimal TargetValue { get; set; }
    public decimal CurrentValue { get; set; }
    public int ProgressPercent { get; set; }
    public DateTime TargetDate { get; set; }

    /// <summary>Proje liderleri + projeyi açan. Boşsa bildirim üretilmez (worker loglar).</summary>
    public List<Guid> RecipientIds { get; set; } = new();
}
