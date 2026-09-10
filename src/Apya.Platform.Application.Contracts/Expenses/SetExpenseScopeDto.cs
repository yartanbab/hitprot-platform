using System;

namespace Apya.Platform.Expenses;

/// <summary>
/// "İlişkiyi değiştir…" girdisi (birleşik sekme sistemi PR-3a). Üç hedef:
/// TaskId dolu → göreve bağla (ProjectId görevden türetilir, buradaki değer
/// yok sayılır) · yalnız ProjectId dolu → projeye bağla (görevsiz) ·
/// ikisi boş → bağımsız (Genel gider havuzu, hiçbir bütçeye sayılmaz).
/// </summary>
public class SetExpenseScopeDto
{
    public Guid? TaskId { get; set; }
    public Guid? ProjectId { get; set; }
}
