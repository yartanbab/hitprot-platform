using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Bütçe kalemi ekleme/düzenleme. Tek modal iki iş yapar: <see cref="Id"/> boşsa
/// ekler, doluysa günceller — alanlar birebir aynı, iki kopya markup istemiyoruz.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class BudgetLineModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    /// <summary>Boşsa yeni kalem.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    /// <summary>"Alt kalem ekle" düğmesinden gelir: yeni kalemin üst kalemi önceden seçilir.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? ParentId { get; set; }

    [BindProperty]
    public CreateUpdateBudgetLineDto Line { get; set; } = new();

    public bool IsEdit => Id.HasValue;

    /// <summary>Üst kalem seçenekleri — ağaç sırasıyla; düzenlenen kalem ve kendi alt ağacı hariç.</summary>
    public List<ProjectBudgetLineDto> ParentOptions { get; private set; } = new();

    /// <summary>Geçerli destek oranı; hibe payı boşken öneri bunun üzerinden hesaplanır.</summary>
    public decimal? SupportRatePercent { get; private set; }

    public BudgetLineModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var overview = await _budgetAppService.GetOverviewAsync(ProjectId);
        SupportRatePercent = overview.SupportRatePercent;

        // Kalem kendi alt ağacının altına taşınamaz (sunucu da reddeder); seçenekte hiç gösterme.
        var excluded = new HashSet<Guid>();
        if (Id.HasValue)
        {
            excluded.Add(Id.Value);
            foreach (var l in overview.Lines.Where(l => l.ParentId.HasValue))
            {
                // Lines ağaç sırasında: üst kalem her zaman alt kaleminden önce gelir.
                if (excluded.Contains(l.ParentId!.Value)) excluded.Add(l.Id);
            }
        }
        ParentOptions = overview.Lines.Where(l => !excluded.Contains(l.Id)).ToList();

        if (Id.HasValue)
        {
            var existing = overview.Lines.First(x => x.Id == Id.Value);
            Line = new CreateUpdateBudgetLineDto
            {
                Code = existing.Code,
                Name = existing.Name,
                PlannedAmount = existing.PlannedAmount,
                ApprovedAmount = existing.ApprovedAmount,
                TransferLimitPercent = existing.TransferLimitPercent,
                ParentId = existing.ParentId,
                GrantAmount = existing.GrantAmount
            };
        }
        else
        {
            Line.ParentId = ParentId;
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        if (Id.HasValue)
        {
            await _budgetAppService.UpdateLineAsync(Id.Value, Line);
        }
        else
        {
            await _budgetAppService.CreateLineAsync(ProjectId, Line);
        }

        return NoContent();
    }
}
