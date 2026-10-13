using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Incomes;

public interface IIncomeEntryAppService :
    ICrudAppService<
        IncomeEntryDto,
        Guid,
        GetIncomeEntriesInput,
        CreateUpdateIncomeEntryDto>
{
    /// <summary>Kaydın kapsamını taşır — bkz. IExpenseAppService.SetScopeAsync.</summary>
    Task<IncomeEntryDto> SetScopeAsync(Guid id, SetIncomeScopeDto input);

    /// <summary>DOC-08 · Gelire bağlanabilecek belgeler (gelirin projesindeki, henüz bağlı olmayanlar).</summary>
    Task<System.Collections.Generic.List<IncomeDocumentOptionDto>> GetDocumentOptionsAsync(Guid id);

    /// <summary>DOC-08 · Gelire bağlı belgeler.</summary>
    Task<System.Collections.Generic.List<IncomeDocumentOptionDto>> GetLinkedDocumentsAsync(Guid id);

    /// <summary>DOC-08 · Bir belgeyi gelire bağlar (aynı bağ ikinci kez kurulmaz).</summary>
    Task LinkDocumentAsync(Guid id, Guid documentFileId);

    /// <summary>DOC-08 · Belge bağını kaldırır; belge silinmez.</summary>
    Task UnlinkDocumentAsync(Guid id, Guid documentFileId);
}
