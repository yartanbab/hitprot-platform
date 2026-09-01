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
///
/// İKİ KİP (tasarım 2b):
///   • Kesintiden açıldıysa "DÜŞÜLECEK" kipi: kullanıcı kalemden ne kadar
///     düşüleceğini yazar, yeni tutar hesaplanır ve dağıtılmayan kalan canlı
///     gösterilir. Bilinen bir toplamı dağıtırken doğal olan giriş budur.
///   • Doğrudan açıldıysa "YENİ TUTAR" kipi: dağıtılacak bir toplam yoktur,
///     kullanıcı hedef tutarı yazar.
/// Aynı modal, çünkü ikisi de tek bir <c>ApplyRevisionAsync</c> çağrısına iner.
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

    /// <summary>Dağıtılması beklenen kesinti tutarı; doğrudan açıldıysa 0.</summary>
    public decimal SourceDeductionAmount { get; set; }

    /// <summary>Kesinti kipinde iki seçenek: "revise" (varsayılan) | "unfunded".</summary>
    [BindProperty]
    public string Mode { get; set; } = "revise";

    /// <summary>Kesintiden mi açıldı — görünüm bu bayrağa göre kip seçer.</summary>
    public bool IsDeductionMode => DeductionId.HasValue;

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
                NewAmount = l.ApprovedAmount,
                TransferLimitPercent = l.TransferLimitPercent
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
        // "Açık bırak" revizyon DEĞİL: kesinti finanse edilmeyen olarak kapanır,
        // bütçe olduğu gibi kalır. Gerekçe/tarih/kalem alanları hiç okunmaz.
        if (IsDeductionMode && Mode == "unfunded")
        {
            await _budgetAppService.MarkDeductionUnfundedAsync(DeductionId!.Value);
            return NoContent();
        }

        ValidateModel();

        // Kesinti kipinde kullanıcı DÜŞÜLECEK tutarı yazar; hedef tutar buradan
        // türer. Tek bir doğruluk kaynağı olsun diye dönüşüm burada yapılır,
        // görünümde değil.
        if (IsDeductionMode)
        {
            foreach (var line in Lines)
            {
                line.NewAmount = line.CurrentAmount - line.Reduction;
            }
        }

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

        /// <summary>"Yeni tutar" kipinde doğrudan yazılır.</summary>
        public decimal NewAmount { get; set; }

        /// <summary>"Düşülecek" kipinde yazılır; yeni tutar = mevcut − bu.</summary>
        public decimal Reduction { get; set; }

        /// <summary>Aktarım payı sınırı (%). Tanımlıysa aşım AMBER UYARI üretir —
        /// engellemez: sınır bugün sunucuda uygulanmıyor, uygulanıyormuş gibi
        /// davranmak yalan olurdu.</summary>
        public decimal? TransferLimitPercent { get; set; }
    }
}
