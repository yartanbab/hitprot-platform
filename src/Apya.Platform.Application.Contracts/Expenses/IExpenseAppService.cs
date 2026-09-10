using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Expenses;

public interface IExpenseAppService :
    ICrudAppService<
        ExpenseDto,
        Guid,
        GetExpensesInput,
        CreateUpdateExpenseDto>
{
    /// <summary>
    /// Kaydın kapsamını taşır: görev / yalnız proje / bağımsız (Genel gider).
    /// Tam-DTO UpdateAsync yerine granüler uç — taşıma tutar/kasa alanlarına
    /// dokunmaz. Yetki: Expenses.Edit + Tasks.Edit BİRLİKTE (taşıma bütçe
    /// toplamlarını değiştirir); değişim audit'e otomatik düşer.
    /// </summary>
    Task<ExpenseDto> SetScopeAsync(Guid id, SetExpenseScopeDto input);

    /// <summary>
    /// /Tasks Finans paneli: giderler proje gruplu, ara toplamlar sunucuda
    /// GROUP BY ile, Genel gider ayrı grup. Girdi mevcut süzgeç sözleşmesi
    /// (GetExpensesInput — Proje pill'i ProjectId'yi kullanır).
    /// </summary>
    Task<ExpenseProjectGroupsDto> GetProjectGroupedAsync(GetExpensesInput input);
}
