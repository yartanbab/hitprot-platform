namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// _TaskShortcutsModal.cshtml için görünüm modeli. Yetkiye bağlı satırlar
/// (satır seçme / durum değiştirme) kullanıcının gerçekten yapabildiği
/// kısayolları göstersin diye buradan geçirilir.
/// </summary>
public class TaskShortcutsModalModel
{
    public bool CanBulk { get; set; }
    public bool CanChangeStatus { get; set; }
}
