using System;

namespace Apya.Platform.Incomes;

/// <summary>
/// "İlişkiyi değiştir…" girdisi — gider eşiyle (SetExpenseScopeDto) aynı üç
/// hedef: göreve bağla (ProjectId görevden türetilir) · yalnız projeye bağla ·
/// bağımsız (ikisi boş).
/// </summary>
public class SetIncomeScopeDto
{
    public Guid? TaskId { get; set; }
    public Guid? ProjectId { get; set; }
}
