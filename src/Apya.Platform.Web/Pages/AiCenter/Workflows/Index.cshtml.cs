using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.Ai.Workflows.Dtos;
using Apya.Platform.Web.Import;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Apya.Platform.Ai.Permissions;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Pages.AiCenter.Workflows;

[Authorize(AiPermissions.Workflows.Default)]
public class IndexModel : PlatformPageModel
{
    public const string TransferFormat = "apya.ai-workflow";

    /// <summary>
    /// Aktarılan iş akışı: ad, istem KODU ve kurallar. Form bağı ortama özgü kimlik olduğu için taşınmaz;
    /// webhook kuralının yükü (adres, jeton olabilir) BOŞ yazılır.
    /// </summary>
    public sealed class WorkflowTransfer
    {
        public string Name { get; set; } = string.Empty;
        public string? PromptCode { get; set; }
        public List<WorkflowTransferRule> Rules { get; set; } = new();
    }

    public sealed class WorkflowTransferRule
    {
        public int Order { get; set; }
        public string JsonPath { get; set; } = string.Empty;
        public RuleOperator Operator { get; set; }
        public string CompareValue { get; set; } = string.Empty;
        public WorkflowActionType ActionType { get; set; }
        public string? ActionPayload { get; set; }
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetExportAsync(Guid id,
        [FromServices] IAiWorkflowAppService workflows, [FromServices] IPromptAppService prompts)
    {
        var workflow = await workflows.GetAsync(id);
        var promptCode = workflow.PromptId is { } promptId ? (await prompts.GetAsync(promptId)).Code : null;

        var data = new WorkflowTransfer
        {
            Name = workflow.Name,
            PromptCode = promptCode,
            Rules = workflow.Rules.OrderBy(r => r.Order).Select(r => new WorkflowTransferRule
            {
                Order = r.Order, JsonPath = r.JsonPath, Operator = r.Operator, CompareValue = r.CompareValue, ActionType = r.ActionType,
                ActionPayload = r.ActionType == WorkflowActionType.Webhook ? null : r.ActionPayload
            }).ToList()
        };
        return File(ConfigTransfer.Write(TransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(workflow.Name, Clock.Now));
    }

    /// <summary>
    /// Dosyadan YENİ ve KAPALI iş akışı açar; kurallar ekranın kendi "kural ekle" servisiyle, hepsi tek işlemde.
    /// İstem bu ortamda aynı kodla varsa bağlanır. Form bağı ve webhook adresi kullanıcı tarafından girilir.
    /// </summary>
    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IAiWorkflowAppService workflows,
        [FromServices] IPromptAppService prompts, [FromServices] IUnitOfWorkManager unitOfWorkManager)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<WorkflowTransfer>(file, TransferFormat);
        error ??= data!.Name.Trim().Length == 0
                  || data.Rules.Any(r => !Enum.IsDefined(r.Operator) || !Enum.IsDefined(r.ActionType))
            ? "Transfer:Error:NotJson"
            : null;
        if (error != null)
        {
            return new JsonResult(new { ok = false, message = L[error, L["Transfer:Name:Workflow"]].Value });
        }

        try
        {
            Guid? promptId = null;
            if (!string.IsNullOrWhiteSpace(data!.PromptCode))
            {
                var found = await prompts.GetListAsync(new GetPromptsInput { Filter = data.PromptCode, MaxResultCount = 50 });
                promptId = found.Items.FirstOrDefault(p => string.Equals(p.Code, data.PromptCode, StringComparison.OrdinalIgnoreCase))?.Id;
            }

            using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            var created = await workflows.CreateAsync(new CreateUpdateAiWorkflowDto
            {
                Name = data.Name.Trim(), DocumentId = null, PromptId = promptId, IsActive = false
            });
            foreach (var rule in data.Rules.OrderBy(r => r.Order))
            {
                await workflows.AddRuleAsync(created.Id, new CreateWorkflowRuleDto
                {
                    JsonPath = rule.JsonPath, Operator = rule.Operator, CompareValue = rule.CompareValue,
                    ActionType = rule.ActionType, ActionPayload = rule.ActionType == WorkflowActionType.Webhook ? null : rule.ActionPayload
                });
            }
            await uow.CompleteAsync();

            var message = L["Transfer:Workflow:Done", created.Name].Value;
            if (!string.IsNullOrWhiteSpace(data.PromptCode) && promptId == null)
            {
                message += " " + L["Transfer:Workflow:PromptMissing", data.PromptCode].Value;
            }
            return new JsonResult(new { ok = true, id = created.Id, message });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "İş akışı içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }
    }
}
