using System;
using System.Collections.Generic;

namespace Apya.Platform.Tasks;

/// <summary>Transfer diyaloğundaki "Neler taşınsın?" anahtarları.
/// Etiketler her zaman taşınır (tasarımda ayrı anahtarı yok).</summary>
public class TaskTransferOptions
{
    public bool Subtasks { get; set; } = true;
    public bool Checklist { get; set; } = true;
    public bool Comments { get; set; }
    public bool Files { get; set; } = true;
    public bool KeepAssignee { get; set; } = true;
    public bool KeepLinks { get; set; } = true;
    public bool ShiftDates { get; set; }

    /// <summary>
    /// Kopyalanabilecek alt görevler: çağıranın gizlilik kuralına (APYA-22) göre GÖREBİLDİKLERİ.
    /// <c>null</c> = hepsi. Kopya çağıranın olur; göremediği gizli alt görevi kopyalamak içeriğini ona açardı.
    /// </summary>
    public ISet<Guid>? VisibleSubtaskIds { get; set; }
}
