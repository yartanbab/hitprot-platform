using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Expenses;

/// <summary>APYA-135: Expense modal'larının ortak dropdown doldurma yardımcısı.</summary>
public static class ExpenseLookups
{
    public static async Task<(List<SelectListItem> accounts, List<SelectListItem> projects, List<SelectListItem> customers, List<SelectListItem> categories)>
        LoadAsync(ICashAccountAppService cashSvc, IProjectAppService projectSvc, ICustomerAppService customerSvc)
    {
        var accounts = (await cashSvc.GetListAsync(new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true }))
            .Items.Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString())).ToList();

        var projects = (await projectSvc.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 }))
            .Items.Select(p => new SelectListItem(p.Name, p.Id.ToString())).ToList();

        var customers = (await customerSvc.GetListAsync(new GetCustomersInput { MaxResultCount = 1000, IsActive = true }))
            .Items.Select(c => new SelectListItem(c.Name, c.Id.ToString())).ToList();

        var categories = new List<SelectListItem>
        {
            new("Genel / Diğer", ((int)ExpenseCategory.Other).ToString()),
            new("Ofis / Kira", ((int)ExpenseCategory.Office).ToString()),
            new("Seyahat / Ulaşım", ((int)ExpenseCategory.Travel).ToString()),
            new("Personel / Maaş", ((int)ExpenseCategory.Personnel).ToString()),
            new("Malzeme / Sarf", ((int)ExpenseCategory.Material).ToString()),
            new("Hizmet / Danışmanlık", ((int)ExpenseCategory.Service).ToString()),
            new("Vergi / Harç", ((int)ExpenseCategory.Tax).ToString())
        };

        return (accounts, projects, customers, categories);
    }
}
