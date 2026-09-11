using System.Collections.Generic;

namespace Apya.Platform.Shell.Dtos;

/// <summary>
/// Kart Panosu (kanban) görünüm tercihi — Shell.KanbanView ayarının gövdesi.
/// Üç kanban yüzeyi (/Tasks, proje detay, /Board) aynı değeri paylaşır.
/// Doğrulama ve saklama biçimi ShellKanbanViewSetting'de.
/// </summary>
public class ShellKanbanViewDto
{
    /// <summary>Kart yoğunluğu: "card" | "compact" | "list" | "title".</summary>
    public string Density { get; set; } = ShellKanbanViewSetting.DefaultDensity;

    /// <summary>
    /// Kartta gösterilen alanlar (anahtar → açık mı). Geçerli anahtarlar
    /// ShellKanbanViewSetting.FieldKeys; listede olmayan alan AÇIK sayılır —
    /// böylece yeni bir alan eklendiğinde eski kayıtlar onu gizlemez.
    /// </summary>
    public Dictionary<string, bool> Fields { get; set; } = new();

    /// <summary>Boş kolonlar dar bir raya insin mi? (varsayılan: evet)</summary>
    public bool CollapseEmpty { get; set; } = true;

    /// <summary>Tamamlandı kolonu tamamen gizlensin mi? (varsayılan: hayır)</summary>
    public bool HideDone { get; set; }
}
