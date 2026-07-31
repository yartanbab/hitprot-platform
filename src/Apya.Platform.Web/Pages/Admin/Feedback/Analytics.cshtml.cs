using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

[Authorize(PlatformPermissions.Feedbacks.Default)]
public class AnalyticsModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;

    public FeedbackStatsDto Stats { get; set; } = default!;

    public AnalyticsModel(IFeedbackAdminAppService feedbackAdminAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
    }

    public async Task OnGetAsync()
    {
        Stats = await _feedbackAdminAppService.GetStatsAsync();
    }

    /// <summary>Saat cinsinden süreyi okunur biçime çevirir (36,5 → "1,5 gün").</summary>
    public string FormatHours(double? hours)
    {
        if (hours is null)
        {
            return "—";
        }

        if (hours < 1)
        {
            return $"{hours.Value * 60:0} dk";
        }

        return hours < 48
            ? $"{hours.Value:0.#} saat"
            : $"{hours.Value / 24:0.#} gün";
    }
}
