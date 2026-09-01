using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Dilim tahsilatı. Tutar KÜMÜLATİFTİR — "bugüne kadar gelen toplam", fark değil.
/// Gelir kaydı seçilebilir: para iki kez kaydedilmesin, dilim mevcut gelire bağlansın.
/// </summary>
public class CollectionModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IIncomeEntryAppService _incomeAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public RegisterCollectionDto Collection { get; set; } = new();

    public FundingTrancheDto? Tranche { get; set; }
    public List<SelectListItem> IncomeEntries { get; set; } = new();

    public CollectionModalModel(
        IProjectBudgetAppService budgetAppService,
        IIncomeEntryAppService incomeAppService)
    {
        _budgetAppService = budgetAppService;
        _incomeAppService = incomeAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Tranche = (await _budgetAppService.GetTranchesAsync(ProjectId)).First(x => x.Id == Id);

        Collection = new RegisterCollectionDto
        {
            ReceivedAmount = Tranche.ReceivedAmount,
            ReceivedDate = Tranche.ReceivedDate ?? Clock.Now.Date,
            IncomeEntryId = Tranche.IncomeEntryId
        };

        await LoadIncomeEntriesAsync();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _budgetAppService.RegisterCollectionAsync(Id, Collection);
        return NoContent();
    }

    /// <summary>
    /// Bu projenin gelir kayıtları. Gelirleri görme yetkisi yoksa liste boş kalır
    /// ve alan opsiyonel olduğu için akış bozulmaz.
    /// </summary>
    private async Task LoadIncomeEntriesAsync()
    {
        try
        {
            var page = await _incomeAppService.GetListAsync(
                new GetIncomeEntriesInput { MaxResultCount = 200, ProjectId = ProjectId, Sorting = "IncomeDate desc" });

            IncomeEntries = page.Items
                .Select(x => new SelectListItem(
                    $"{x.IncomeDate:dd.MM.yyyy} · {x.Title} · {x.Amount:N2}",
                    x.Id.ToString()))
                .ToList();
        }
        catch (AbpAuthorizationException)
        {
            IncomeEntries = new List<SelectListItem>();
        }
    }
}
