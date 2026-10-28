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

    /// <summary>
    /// FIN-05 · Projeye yazılmış giderin karşılığı olan alış faturası var mı? Projesiz giderde
    /// ve fatura görme izni olmayan kullanıcıda uyarı çıkmaz.
    /// </summary>
    Task<Apya.Platform.Invoices.Dtos.FinanceCrossCheckDto> GetInvoiceCrossCheckAsync(Guid id);

    /// <summary>
    /// Gider formunun kasa seçicisi: etkin kasalar, ada göre. Gider izniyle gelir —
    /// gider giren kişiden ayrıca kasa yönetme izni (CashAccounts.Default) istenmez.
    /// </summary>
    Task<Volo.Abp.Application.Dtos.ListResultDto<Apya.Platform.CashAccounts.CashAccountLookupDto>> GetCashAccountLookupAsync();
}
