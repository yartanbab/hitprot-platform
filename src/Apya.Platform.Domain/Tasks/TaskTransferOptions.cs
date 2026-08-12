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
}
