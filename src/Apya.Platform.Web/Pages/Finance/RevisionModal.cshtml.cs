using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Bütçe revizyonu: kalemlerin onaylanan tutarlarını yeni bir sürüme taşır.
///
/// Kesinti satırındaki "Bütçeye işle" bunu <see cref="DeductionId"/> ile açar;
/// o zaman revizyon kesintiye bağlanır ve kesinti "Bütçeye işlendi · Rev.N" olur.
/// </summary>
public class RevisionModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    /// <summary>Revizyonu tetikleyen kesinti; doğrudan açıldıysa boştur.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? DeductionId { get; set; }

    [BindProperty]
    public string Reason { get; set; } = string.Empty;

    [BindProperty]
    public DateTime EffectiveDate { get; set; }

    [BindProperty]
    public List<RevisionLineInput> Lines { get; set; } = new();

    /// <summary>Bilgi amaçlı: dağıtılması beklenen kesinti tutarı.</summary>
    public decimal SourceDeductionAmount { get; set; }

    public int NextRevisionNo { get; set; }

    public RevisionModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var overview = await _budgetAppService.GetOverviewAsync(ProjectId);
        NextRevisionNo = overview.LatestRevisionNo + 1;
        EffectiveDate = Clock.Now.Date;

        Lines = overview.Lines
            .Select(l => new RevisionLineInput
            {
                LineId = l.Id,
                Name = string.IsNullOrWhiteSpace(l.Code) ? l.Name : $"{l.Code} · {l.Name}",
                CurrentAmount = l.ApprovedAmount,
                NewAmount = l.ApprovedAmount
            })
            .ToList();

        if (DeductionId.HasValue)
        {
            var deduction = (await _budgetAppService.GetTranchesAsync(ProjectId))
                .SelectMany(t => t.Deductions)
                .FirstOrDefault(d => d.Id == DeductionId.Value);

            SourceDeductionAmount = deduction?.Amount ?? 0m;
            Reason = deduction == null ? string.Empty : $"Kesinti: {deduction.Reason}";
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        // Yalnız GERÇEKTEN değişen kalemler gönderilir — değişmeyeni revizyon
        // satırı olarak yazmak geçmişi gürültüyle doldurur.
        var changes = Lines
            .Where(l => l.NewAmount != l.CurrentAmount)
            .ToDictionary(l => l.LineId, l => l.NewAmount);

        await _budgetAppService.ApplyRevisionAsync(ProjectId, new ApplyBudgetRevisionDto
        {
            Reason = Reason,
            EffectiveDate = EffectiveDate,
            Changes = changes,
            SourceDeductionId = DeductionId
        });

        return NoContent();
    }

    public class RevisionLineInput
    {
        public Guid LineId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal CurrentAmount { get; set; }
        public decimal NewAmount { get; set; }
    }
}
