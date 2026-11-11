using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Apya.Platform.Web.Import;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;

namespace Apya.Platform.Web.Pages.AiCenter.Prompts;

[Authorize(AiPermissions.Prompts.Default)]
public class IndexModel : PlatformPageModel
{
    public const string TransferFormat = "apya.ai-prompt";

    private readonly IPromptCategoryAppService _promptCategoryAppService;

    public List<SelectListItem> Categories { get; set; } = new();

    /// <summary>
    /// Aktarılan istem: künye + TEK sürümün içeriği (yayındaki, yoksa en yenisi). Kategori ADLA taşınır;
    /// hedefte aynı adlı kategori yoksa kategorisiz açılır. Sağlayıcı/anahtar bilgisi istemde yoktur.
    /// </summary>
    public sealed class PromptTransfer
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? CategoryName { get; set; }
        public string SystemPrompt { get; set; } = string.Empty;
        public string UserPromptTemplate { get; set; } = string.Empty;
        public string? JsonSchema { get; set; }
        public string? ExpectedOutputSample { get; set; }
    }

    public IndexModel(IPromptCategoryAppService promptCategoryAppService)
    {
        _promptCategoryAppService = promptCategoryAppService;
    }

    public async Task OnGetAsync()
    {
        var categories = await _promptCategoryAppService.GetListAsync();
        Categories = new List<SelectListItem> { new SelectListItem("Tüm kategoriler", "") };
        Categories.AddRange(categories.Select(c => new SelectListItem(c.Name, c.Id.ToString())));
    }

    public async Task<IActionResult> OnGetExportAsync(Guid id, [FromServices] IPromptAppService prompts)
    {
        var prompt = await prompts.GetAsync(id);
        var version = prompt.Versions.FirstOrDefault(v => v.Id == prompt.ActiveVersionId)
                      ?? prompt.Versions.OrderByDescending(v => v.VersionNo).FirstOrDefault();
        var category = prompt.CategoryId is { } categoryId
            ? (await _promptCategoryAppService.GetListAsync()).FirstOrDefault(c => c.Id == categoryId)?.Name
            : null;

        var data = new PromptTransfer
        {
            Code = prompt.Code,
            Name = prompt.Name,
            Description = prompt.Description,
            CategoryName = category,
            SystemPrompt = version?.SystemPrompt ?? string.Empty,
            UserPromptTemplate = version?.UserPromptTemplate ?? string.Empty,
            JsonSchema = version?.JsonSchema,
            ExpectedOutputSample = version?.ExpectedOutputSample
        };
        return File(ConfigTransfer.Write(TransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(prompt.Code, Clock.Now));
    }

    /// <summary>
    /// Dosyadan YENİ istem açar ("Yeni İstem"in servisi): içerik ilk sürüm olur ve yayında DEĞİLDİR —
    /// başka ortamdan gelen istem gözden geçirilmeden çalışmaya başlamasın. Kod bu ortamda varsa servis reddeder.
    /// </summary>
    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IPromptAppService prompts)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<PromptTransfer>(file, TransferFormat);
        error ??= data!.Code.Trim().Length == 0 || data.Name.Trim().Length == 0 ? "Transfer:Error:NotJson" : null;
        if (error != null)
        {
            return new JsonResult(new { ok = false, message = L[error, L["Transfer:Name:Prompt"]].Value });
        }

        try
        {
            var categoryId = string.IsNullOrWhiteSpace(data!.CategoryName)
                ? null
                : (await _promptCategoryAppService.GetListAsync())
                    .FirstOrDefault(c => string.Equals(c.Name, data.CategoryName.Trim(), StringComparison.CurrentCultureIgnoreCase))?.Id;

            var created = await prompts.CreateAsync(new CreatePromptDto
            {
                Code = data.Code.Trim(),
                Name = data.Name.Trim(),
                Description = data.Description,
                CategoryId = categoryId,
                SystemPrompt = data.SystemPrompt,
                UserPromptTemplate = data.UserPromptTemplate,
                JsonSchema = data.JsonSchema,
                ExpectedOutputSample = data.ExpectedOutputSample
            });
            return new JsonResult(new { ok = true, id = created.Id, message = L["Transfer:Done", created.Name].Value });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "İstem içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }
    }
}
