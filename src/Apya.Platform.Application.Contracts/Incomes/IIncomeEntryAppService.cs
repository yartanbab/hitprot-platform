using System;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Incomes;

public interface IIncomeEntryAppService :
    ICrudAppService<
        IncomeEntryDto,
        Guid,
        GetIncomeEntriesInput,
        CreateUpdateIncomeEntryDto>
{
}
