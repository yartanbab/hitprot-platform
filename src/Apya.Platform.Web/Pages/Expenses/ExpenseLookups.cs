using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;

namespace Apya.Platform.Web.Pages.Expenses;

/// <summary>APYA-135: Expense modal'larının ortak dropdown doldurma yardımcısı.</summary>
public static class ExpenseLookups
{
    /// <remarks>
    /// Kasalar gider servisinden gelir: kasa yönetme izni (CashAccounts.Default) olmayan gider
    /// girişçisi pencereyi 403 ile açamıyordu. Cari listesi çekilmez — form cari sormuyor
    /// (CustomerId gizli alanla taşınır) ve Customers.Default'u boşuna istiyordu.
    /// </remarks>
    public static async Task<(List<SelectListItem> accounts, List<SelectListItem> projects, List<SelectListItem> categories, string projectDatesJson)>
        LoadAsync(IExpenseAppService expenseSvc, IProjectAppService projectSvc)
    {
        var accounts = (await expenseSvc.GetCashAccountLookupAsync())
            .Items.Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString())).ToList();

        var projectItems = (await projectSvc.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 })).Items;
        var projects = projectItems.Select(p => new SelectListItem(p.Name, p.Id.ToString())).ToList();
        var projectDatesJson = FinanceLookupShared.BuildProjectDatesJson(projectItems);

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

        return (accounts, projects, categories, projectDatesJson);
    }

}
