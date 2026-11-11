using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Import;

namespace Apya.Platform.Web.Pages.DynamicAssets;

[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class IndexModel : PlatformPageModel
{
    public const string TransferFormat = "apya.form";
    private const int MaxBlocks = 500;

    /// <summary>Aktarılan form: yanıtlar, yayın ayarları (alan adı, parola) ve kategori BİLEREK yok.</summary>
    public sealed class FormTransfer
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ThemeJson { get; set; }
        public List<FormTransferBlock> Blocks { get; set; } = new();
    }

    /// <summary>Alan; <c>Id</c> yalnız koşul/zincir bağları içindir, içe aktarmada yeni kimlik üretilir.</summary>
    public sealed class FormTransferBlock
    {
        public Guid Id { get; set; }
        public BlockType Type { get; set; }
        public int Order { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Settings { get; set; } = string.Empty;
        public string? AgentContext { get; set; }
    }

    public void OnGet()
    {
    }

    /// <summary>Formun tanımını .json olarak indirir (formu görebilen herkes).</summary>
    public async Task<IActionResult> OnGetExportAsync(Guid id, [FromServices] IFormAppService forms)
    {
        var form = await forms.GetAsync(id);
        var data = new FormTransfer
        {
            Title = form.Title,
            Description = form.Description,
            ThemeJson = form.ThemeJson,
            Blocks = form.Blocks.OrderBy(b => b.Order).Select(b => new FormTransferBlock
            {
                Id = b.Id, Type = b.Type, Order = b.Order, Content = b.Content, Settings = b.Settings, AgentContext = b.AgentContext
            }).ToList()
        };
        return File(ConfigTransfer.Write(TransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(form.Title, Clock.Now));
    }

    /// <summary>
    /// Dosyadan YENİ taslak form açar; formu oluşturma servisinden geçer (oluşturma izni orada). Eski alan
    /// kimlikleri yeni alanlara eşlenir, koşul ve zincir bağları kopyada da çalışır.
    /// </summary>
    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IFormAppService forms)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<FormTransfer>(file, TransferFormat);
        error ??= data!.Title.Trim().Length == 0 ? "Transfer:Error:NotJson"
            : data.Blocks.Count > MaxBlocks || data.Blocks.Any(b => !Enum.IsDefined(b.Type)) ? "Transfer:Error:NotJson"
            : null;
        if (error != null)
        {
            return new JsonResult(new { ok = false, message = L[error, L["Transfer:Name:Form"]].Value });
        }

        DocumentDto created;
        try
        {
            created = await forms.CreateAsync(new CreateUpdateFormDto
            {
                Title = data!.Title.Trim(),
                Description = data.Description,
                ThemeJson = data.ThemeJson,
                Blocks = data.Blocks.Select(b => new CreateBlockDto
                {
                    Id = b.Id, Type = b.Type, Order = b.Order, Content = b.Content, Settings = b.Settings, AgentContext = b.AgentContext
                }).ToList()
            });
        }
        catch (Exception ex)
        {
            // Yetki, doğrulama (başlık uzunluğu) ya da iş kuralı: kullanıcıya kendi metniyle döner.
            Logger.LogWarning(ex, "Form içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }

        return new JsonResult(new { ok = true, id = created.Id, message = L["Transfer:Done", created.Title].Value });
    }
}
