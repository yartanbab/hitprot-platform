using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tasks;

namespace Apya.Platform.IssueTasks.Dtos;

/// <summary>Bir kaynağın (geri bildirim / hata) bağlı olduğu görevin özeti — panelde rozet.</summary>
public class IssueTaskLinkDto
{
    public Guid Id { get; set; }

    public IssueSourceType SourceType { get; set; }
    public Guid? SourceId { get; set; }
    public string SourceKey { get; set; } = string.Empty;
    public string? SourceLabel { get; set; }

    public Guid TaskId { get; set; }

    /// <summary>Kullanıcıya gösterilen görev kodunun sayısal kaynağı ("GRV-42" → 42).</summary>
    public int TaskNumber { get; set; }

    public string TaskTitle { get; set; } = string.Empty;
    public TaskStatus TaskStatus { get; set; }

    /// <summary>Görev silinmişse rozet "kaldırıldı" olarak çizilir.</summary>
    public bool TaskExists { get; set; }

    public bool IsAutomatic { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? SourceClosedAt { get; set; }
}

/// <summary>Göreve dönüştürme modalının ortak alanları.</summary>
public class CreateIssueTaskInput
{
    /// <summary>Boşsa kaynaktan üretilir.</summary>
    [StringLength(200)]
    public string? Title { get; set; }

    /// <summary>Yöneticinin ek notu — görev açıklamasının başına konur.</summary>
    [StringLength(2000)]
    public string? Note { get; set; }

    public TaskPriority? Priority { get; set; }

    public Guid? AssigneeId { get; set; }

    public DateTime? DueDate { get; set; }

    /// <summary>Ayarlardaki hedef proje yerine başka bir host projesi seçildiyse.</summary>
    public Guid? ProjectId { get; set; }
}

/// <summary>Sunucu hatasından görev açma — kaynak audit log satırlarıdır, Id'si yoktur.</summary>
public class CreateServerErrorTaskInput : CreateIssueTaskInput
{
    [Required]
    [StringLength(2048)]
    public string Url { get; set; } = string.Empty;

    /// <summary>Audit log'un hangi pencereden derleneceği (gün).</summary>
    [Range(1, 365)]
    public int WindowDays { get; set; } = 7;
}

/// <summary>Dönüştürme modalını besleyen bağlam: hedef proje hazır mı, kime atanabilir?</summary>
public class IssueTaskTargetDto
{
    /// <summary>Ayarlarda seçili hedef proje. Boşsa dönüştürme düğmesi çalışmaz.</summary>
    public Guid? TargetProjectId { get; set; }

    public string? TargetProjectName { get; set; }

    /// <summary>Hedef proje ayarlanmış ve hâlâ mevcut mu?</summary>
    public bool IsReady { get; set; }

    public Guid? DefaultAssigneeId { get; set; }

    /// <summary>Görev atanabilecek host kullanıcıları.</summary>
    public List<IssueTaskAssigneeDto> Assignees { get; set; } = new();

    /// <summary>Hedef olarak seçilebilecek host projeleri.</summary>
    public List<IssueTaskProjectDto> Projects { get; set; } = new();
}

public class IssueTaskAssigneeDto
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? Name { get; set; }
}

public class IssueTaskProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
}

/// <summary>Göreve dönüştürme ayarları — Geri Bildirim Ayarları ekranının "Görev otomasyonu" bölümü.</summary>
public class IssueTaskSettingsDto
{
    public Guid? TargetProjectId { get; set; }

    public Guid? DefaultAssigneeId { get; set; }

    public bool AutoCreateEnabled { get; set; }

    /// <summary>Otomatik görev açılacak en düşük geri bildirim önceliği.</summary>
    public Feedbacks.FeedbackPriority FeedbackMinPriority { get; set; }

    [Range(IssueTaskConsts.MinOccurrenceThreshold, IssueTaskConsts.MaxOccurrenceThreshold)]
    public int ClientErrorThreshold { get; set; }

    [Range(IssueTaskConsts.MinOccurrenceThreshold, IssueTaskConsts.MaxOccurrenceThreshold)]
    public int ServerErrorThreshold { get; set; }

    public bool CloseSourceOnTaskDone { get; set; }
}
