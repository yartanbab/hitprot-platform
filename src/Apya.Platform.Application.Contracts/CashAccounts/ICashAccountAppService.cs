using System;
using Volo.Abp.Application.Services;

namespace Apya.Platform.CashAccounts;

public interface ICashAccountAppService :
    ICrudAppService<
        CashAccountDto,
        Guid,
        GetCashAccountsInput,
        CreateUpdateCashAccountDto>
{
}
