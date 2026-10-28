using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Incomes;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Incomes;

/// <summary>APYA-142d: Gelir modal'larının ortak dropdown yardımcısı.</summary>
public static class IncomeLookups
{
    /// <remarks>Kasalar gelir servisinden gelir, cari listesi çekilmez — bkz. ExpenseLookups.</remarks>
    public static async Task<(List<SelectListItem> accounts, List<SelectListItem> projects, List<SelectListItem> categories, string projectDatesJson)>
        LoadAsync(IIncomeEntryAppService incomeSvc, IProjectAppService projectSvc)
    {
        var accounts = (await incomeSvc.GetCashAccountLookupAsync())
            .Items.Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString())).ToList();

        var projectItems = (await projectSvc.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 })).Items;
        var projects = projectItems.Select(p => new SelectListItem(p.Name, p.Id.ToString())).ToList();
        var projectDatesJson = FinanceLookupShared.BuildProjectDatesJson(projectItems);

        var categories = new List<SelectListItem>
        {
            new("Diğer", ((int)IncomeCategory.Other).ToString()),
            new("Hibe", ((int)IncomeCategory.Grant).ToString()),
            new("Bağış / Sponsorluk", ((int)IncomeCategory.Donation).ToString()),
            new("Faturasız Satış / Nakit", ((int)IncomeCategory.CashSale).ToString()),
            new("Faiz / Finansal", ((int)IncomeCategory.Financial).ToString())
        };

        return (accounts, projects, categories, projectDatesJson);
    }
}
