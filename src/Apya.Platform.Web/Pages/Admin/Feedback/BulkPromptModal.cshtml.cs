using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Permissions;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Apya.Platform.Web.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

/// <summary>
/// Listede seçilen geri bildirimlerden tek bir geliştirme prompt'u üretir.
/// Kimlikler virgülle ayrılmış gelir; üst sınır sunucuda da denetlenir.
/// </summary>
[Authorize(PlatformPermissions.Feedbacks.Default)]
public class BulkPromptModalModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly ISystemHealthAppService _systemHealthAppService;

    [BindProperty(SupportsGet = true)]
    public string? Ids { get; set; }

    /// <summary>Prompt üretilemediyse kullanıcıya gösterilecek neden; doluysa diğer alanlar boştur.</summary>
    public string? ErrorMessage { get; set; }

    public int Count { get; set; }

    /// <summary>Seçim ile prompt arasında silinmiş kayıt sayısı.</summary>
    public int MissingCount { get; set; }

    public string Prompt { get; set; } = string.Empty;

    /// <summary>İç notlar dahil sürüm; seçilen kayıtlarda iç not yoksa null.</summary>
    public string? PromptWithNotes { get; set; }

    public BulkPromptModalModel(
        IFeedbackAdminAppService feedbackAdminAppService,
        ISystemHealthAppService systemHealthAppService)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _systemHealthAppService = systemHealthAppService;
    }

    public async Task OnGetAsync()
    {
        var ids = ParseIds(Ids);
        if (ids.Count == 0)
        {
            ErrorMessage = "İstem için en az bir geri bildirim seçin.";
            return;
        }
        if (ids.Count > FeedbackPromptBuilder.BulkLimit)
        {
            ErrorMessage = $"Tek seferde en çok {FeedbackPromptBuilder.BulkLimit} geri bildirim seçilebilir; {ids.Count} seçildi.";
            return;
        }

        var canSeeErrors = await AuthorizationService.IsGrantedAsync(PlatformPermissions.SystemHealth.Default);
        var items = new List<FeedbackPromptSource>();

        foreach (var id in ids)
        {
            try
            {
                var feedback = await _feedbackAdminAppService.GetAsync(id);
                var clientError = canSeeErrors && feedback.LastClientErrorId.HasValue
                    ? await FindClientErrorAsync(feedback.LastClientErrorId.Value)
                    : null;

                items.Add(new FeedbackPromptSource(
                    feedback,
                    DetailModalModel.ParseDetails(feedback.DetailsJson),
                    BreadcrumbParser.Parse(feedback.BreadcrumbJson),
                    clientError));
            }
            catch (EntityNotFoundException)
            {
                // Seçimden sonra başka bir yönetici silmiş olabilir.
                MissingCount++;
            }
        }

        if (items.Count == 0)
        {
            ErrorMessage = "Seçilen geri bildirimler artık mevcut değil.";
            return;
        }

        // Eskiden yeniye: asistan kayıtları oluşma sırasıyla okur.
        items = items.OrderBy(i => i.Feedback.CreationTime).ToList();
        Count = items.Count;

        Prompt = FeedbackPromptBuilder.BuildBulk(items, includeInternalNotes: false);
        if (items.Any(i => i.Feedback.Comments.Any(c => c.IsInternal)))
        {
            PromptWithNotes = FeedbackPromptBuilder.BuildBulk(items, includeInternalNotes: true);
        }
    }

    private async Task<ClientErrorDto?> FindClientErrorAsync(Guid id)
    {
        try
        {
            return await _systemHealthAppService.GetClientErrorAsync(id);
        }
        catch (EntityNotFoundException)
        {
            // Saklama süresiyle silinmiş; prompt onsuz üretilir.
            return null;
        }
    }

    internal static List<Guid> ParseIds(string? raw) =>
        (raw ?? string.Empty)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => Guid.TryParse(s, out var id) ? id : Guid.Empty)
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList();
}
