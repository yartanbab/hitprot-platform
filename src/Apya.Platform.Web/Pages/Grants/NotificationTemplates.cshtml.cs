using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Import;
using Apya.Platform.Web.Pages;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 6d · Host: Bildirim ve E-posta Şablonları.
///
/// <para>Yalnız host görür; servis kiracı bağlamında ayrıca yetki hatası verir
/// (izin kapısı tek başına yetmez, kiracı yöneticisi de Grants.Edit taşıyabilir).</para>
///
/// <para>JSON aktarımı: şablonlar tetikleyici × kitle × (ilk bildirim | yükseltme) başına TEKTİR, bu
/// yüzden içe aktarma yeni kayıt açmaz; eşleşen metni DEĞİŞTİRİR, olmayan rol kopyasını/yükseltmeyi
/// ekler, dosyada olmayan şablona dokunmaz (silmez). Önce önizleme, onaydan sonra tek işlemde yazılır.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class NotificationTemplatesModel : PlatformPageModel
{
    public const string TransferFormat = "apya.grant-notification-templates";

    public sealed class NotificationTransfer
    {
        public List<NotificationTransferTemplate> Templates { get; set; } = new();
    }

    public sealed class NotificationTransferTemplate
    {
        public GrantNotificationTrigger Trigger { get; set; }
        public GrantNotificationAudience Audience { get; set; }
        public bool IsEscalation { get; set; }
        public int? AfterDays { get; set; }
        public bool IsEnabled { get; set; }
        public bool InApp { get; set; }
        public bool Email { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }

    private enum PlanAction { Same, Change, Add, Skip }

    private sealed record PlanRow(NotificationTransferTemplate Entry, PlanAction Action, GrantNotificationTemplateDto? Current);

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetExportAsync([FromServices] IGrantNotificationTemplateAppService templates)
    {
        var console = await templates.GetAsync();
        var data = new NotificationTransfer
        {
            Templates = console.Templates
                .OrderBy(t => t.Trigger).ThenBy(t => t.IsEscalation).ThenBy(t => t.Audience)
                .Select(t => new NotificationTransferTemplate
                {
                    Trigger = t.Trigger, Audience = t.Audience, IsEscalation = t.IsEscalation, AfterDays = t.AfterDays,
                    IsEnabled = t.IsEnabled, InApp = t.InApp, Email = t.Email, Subject = t.Subject, Body = t.Body
                }).ToList()
        };
        return File(ConfigTransfer.Write(TransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(L["Transfer:Name:NotificationTemplates"], Clock.Now));
    }

    /// <summary>Hiçbir şey yazmadan, dosyanın neyi değiştireceğini listeler.</summary>
    public async Task<IActionResult> OnPostPreviewAsync(IFormFile? file, [FromServices] IGrantNotificationTemplateAppService templates)
    {
        var (plan, error) = await PlanAsync(file, templates);
        if (error != null) return new JsonResult(new { ok = false, message = error });

        var rows = plan!.Where(p => p.Action != PlanAction.Same).Select(p => new
        {
            label = Label(p.Entry),
            action = L["Transfer:Notify:Action:" + p.Action].Value
        }).ToList();
        var changes = plan!.Count(p => p.Action is PlanAction.Change or PlanAction.Add);
        return new JsonResult(new
        {
            ok = changes > 0,
            rows,
            message = changes > 0 ? L["Transfer:Notify:Preview", changes].Value : L["Transfer:Notify:NothingToChange"].Value
        });
    }

    /// <summary>Önizlemedeki değişiklikleri tek işlemde yazar; biri reddedilirse hiçbiri yazılmaz.</summary>
    public async Task<IActionResult> OnPostImportAsync(IFormFile? file,
        [FromServices] IGrantNotificationTemplateAppService templates, [FromServices] IUnitOfWorkManager unitOfWorkManager)
    {
        var (plan, error) = await PlanAsync(file, templates);
        if (error != null) return new JsonResult(new { ok = false, message = error });

        var applied = 0;
        try
        {
            using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            // Önce ilk bildirimler (Genel, sonra rol kopyaları), en son yükseltmeler: kopya/yükseltme Genel'den doğar.
            foreach (var row in plan!.Where(p => p.Action is PlanAction.Change or PlanAction.Add)
                         .OrderBy(p => p.Entry.IsEscalation).ThenBy(p => p.Entry.Audience))
            {
                var target = row.Current ?? await AddAsync(row.Entry, templates);
                await templates.SaveAsync(new SaveGrantNotificationTemplateInput
                {
                    Id = target.Id, Subject = row.Entry.Subject, Body = row.Entry.Body, IsEnabled = row.Entry.IsEnabled,
                    InApp = row.Entry.InApp, Email = row.Entry.Email, AfterDays = row.Entry.AfterDays
                });
                applied++;
            }

            await uow.CompleteAsync();
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Bildirim şablonu içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }

        return new JsonResult(new { ok = true, message = L["Transfer:Notify:Done", applied].Value });
    }

    private async Task<(List<PlanRow>? Plan, string? Error)> PlanAsync(IFormFile? file, IGrantNotificationTemplateAppService templates)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<NotificationTransfer>(file, TransferFormat);
        error ??= data!.Templates.Any(t => !Enum.IsDefined(t.Trigger) || !Enum.IsDefined(t.Audience))
                  || data.Templates.GroupBy(t => (t.Trigger, t.Audience, t.IsEscalation)).Any(g => g.Count() > 1)
            ? "Transfer:Error:NotJson"
            : null;
        if (error != null) return (null, L[error, L["Transfer:Name:NotificationTemplates"]].Value);

        var current = (await templates.GetAsync()).Templates;
        var plan = data!.Templates.Select(entry =>
        {
            var match = current.FirstOrDefault(c => Same(c, entry));
            if (match != null)
            {
                var unchanged = match.Subject == entry.Subject && match.Body == entry.Body && match.IsEnabled == entry.IsEnabled
                                && match.InApp == entry.InApp && match.Email == entry.Email
                                && (!entry.IsEscalation || match.AfterDays == entry.AfterDays);
                return new PlanRow(entry, unchanged ? PlanAction.Same : PlanAction.Change, match);
            }

            // Eksik rol kopyası / yükseltme yalnız Genel ilk bildirimin sunduğu seçeneklerden eklenebilir.
            var general = GeneralOf(current, entry.Trigger);
            var canAdd = general != null && (entry.IsEscalation
                ? general.EscalationAudiences.Contains(entry.Audience) && entry.AfterDays is > 0
                : general.DuplicableAudiences.Contains(entry.Audience));
            return new PlanRow(entry, canAdd ? PlanAction.Add : PlanAction.Skip, null);
        }).ToList();
        return (plan, null);
    }

    private static bool Same(GrantNotificationTemplateDto c, NotificationTransferTemplate e)
        => c.Trigger == e.Trigger && c.Audience == e.Audience && c.IsEscalation == e.IsEscalation;

    private static GrantNotificationTemplateDto? GeneralOf(IEnumerable<GrantNotificationTemplateDto> list, GrantNotificationTrigger trigger)
        => list.FirstOrDefault(t => t.Trigger == trigger && t.Audience == GrantNotificationAudience.Genel && !t.IsEscalation);

    /// <summary>Eksik rol kopyasını ya da yükseltmeyi ekranın kendi uçlarıyla açar.</summary>
    private static async Task<GrantNotificationTemplateDto> AddAsync(NotificationTransferTemplate entry, IGrantNotificationTemplateAppService templates)
    {
        var general = GeneralOf((await templates.GetAsync()).Templates, entry.Trigger)!;
        var console = entry.IsEscalation
            ? await templates.AddEscalationAsync(new AddGrantNotificationEscalationInput { Id = general.Id, Audience = entry.Audience, AfterDays = entry.AfterDays!.Value })
            : await templates.DuplicateAsync(new DuplicateGrantNotificationTemplateInput { Id = general.Id, Audience = entry.Audience });
        return console.Templates.First(t => Same(t, entry));
    }

    private string Label(NotificationTransferTemplate e)
    {
        var trigger = L[$"Grants:Notify:Trigger:{e.Trigger}:Name"].Value;
        var audience = e.IsEscalation
            ? L["Grants:Notify:Escalation:Audience:" + e.Audience].Value
            : L["Grants:Notify:Audience:" + e.Audience].Value;
        return e.IsEscalation ? $"{trigger} · {L["Transfer:Notify:Escalation"]} · {audience}" : $"{trigger} · {audience}";
    }
}
