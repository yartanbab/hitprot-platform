using System;
using Apya.Platform.Tasks;

namespace Apya.Platform.IssueTasks;

/// <summary>Göreve dönüştürme sırasında yöneticinin (ya da otomatik kuralın) verdiği kararlar.</summary>
public class IssueTaskOptions
{
    /// <summary>Görevin açılacağı HOST projesi. Ayarlardan gelir; boş olamaz.</summary>
    public Guid ProjectId { get; set; }

    public Guid? AssigneeId { get; set; }

    /// <summary>Boşsa kaynağın kendi önem derecesinden türetilir.</summary>
    public TaskPriority? Priority { get; set; }

    public DateTime? DueDate { get; set; }

    /// <summary>Yönetici başlığı düzenlediyse; boşsa kaynaktan üretilir.</summary>
    public string? Title { get; set; }

    /// <summary>Yönetici açıklamaya not eklediyse — üretilen teşhis metninin BAŞINA konur.</summary>
    public string? Note { get; set; }

    /// <summary>Bağı otomatik kural mı kurdu?</summary>
    public bool IsAutomatic { get; set; }
}
