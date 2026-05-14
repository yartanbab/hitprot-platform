using System;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Customers;

public interface ICustomerAppService :
    ICrudAppService<
        CustomerDto,
        Guid,
        GetCustomersInput,
        CreateUpdateCustomerDto>
{
}
