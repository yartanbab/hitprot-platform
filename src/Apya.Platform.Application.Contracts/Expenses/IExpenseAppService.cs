using System;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Expenses;

public interface IExpenseAppService :
    ICrudAppService<
        ExpenseDto,
        Guid,
        GetExpensesInput,
        CreateUpdateExpenseDto>
{
}
