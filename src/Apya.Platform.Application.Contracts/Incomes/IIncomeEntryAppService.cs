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
}
