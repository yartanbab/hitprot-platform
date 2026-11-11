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

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 3b · Aşama Şablonu Düzenleyicisi. Grants.Edit izni tanım gereği host-only
/// (PlatformPermissionDefinitionProvider), sayfa da yalnız host'ta açılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class StageTemplatesModel : PlatformPageModel
{
    public const string TransferFormat = "apya.grant-stage-template";

    /// <summary>Şablon ve adımları; "varsayılan" işareti ve program bağları aktarılmaz.</summary>
    public sealed class StageTemplateTransfer
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<StageTemplateTransferStep> Steps { get; set; } = new();
    }

    public sealed class StageTemplateTransferStep
    {
        public int Order { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Note { get; set; }
        public GrantPartyRole Owner { get; set; }
        public string? RequiredDocumentsNote { get; set; }
        public string? CompletionCondition { get; set; }
        public int? ReminderDays { get; set; }
        public GrantApplicationStage? Stage { get; set; }
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetExportAsync(Guid id, [FromServices] IGrantStageTemplateAppService templates)
    {
        var t = await templates.GetAsync(id);
        var data = new StageTemplateTransfer
        {
            Name = t.Name,
            Description = t.Description,
            Steps = t.Steps.OrderBy(s => s.Order).Select(s => new StageTemplateTransferStep
            {
                Order = s.Order, Name = s.Name, Note = s.Note, Owner = s.Owner, RequiredDocumentsNote = s.RequiredDocumentsNote,
                CompletionCondition = s.CompletionCondition, ReminderDays = s.ReminderDays, Stage = s.Stage
            }).ToList()
        };
        return File(ConfigTransfer.Write(TransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(t.Name, Clock.Now));
    }

    /// <summary>
    /// Dosyadan YENİ şablon açar ("Yeni şablon"un servisi; doğrulama orada). Varsayılan yapılmaz:
    /// başka ortamdan gelen dosya bu ortamın varsayılan şablonunu sessizce değiştirmesin.
    /// </summary>
    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IGrantStageTemplateAppService templates)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<StageTemplateTransfer>(file, TransferFormat);
        error ??= data!.Name.Trim().Length == 0
                  || data.Steps.Any(s => !Enum.IsDefined(s.Owner) || (s.Stage.HasValue && !Enum.IsDefined(s.Stage.Value)))
            ? "Transfer:Error:NotJson"
            : null;
        if (error != null)
        {
            return new JsonResult(new { ok = false, message = L[error, L["Transfer:Name:StageTemplate"]].Value });
        }

        try
        {
            var created = await templates.CreateAsync(new CreateUpdateGrantStageTemplateDto
            {
                Name = data!.Name.Trim(),
                Description = data.Description,
                IsDefault = false,
                StepsCarryIds = true,
                Steps = data.Steps.OrderBy(s => s.Order).Select(s => new GrantStageTemplateStepDto
                {
                    Order = s.Order, Name = s.Name, Note = s.Note, Owner = s.Owner, RequiredDocumentsNote = s.RequiredDocumentsNote,
                    CompletionCondition = s.CompletionCondition, ReminderDays = s.ReminderDays, Stage = s.Stage
                }).ToList()
            });
            return new JsonResult(new { ok = true, id = created.Id, message = L["Transfer:Done", created.Name].Value });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Aşama şablonu içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }
    }
}
