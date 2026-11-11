using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Rapor derleyici: Bölümler / Önizleme / Dağıtım.
///
/// Önizleme, üretimle AYNI kurucuyu (<see cref="DeliveryReportModelBuilder"/>) ve
/// AYNI exporter'ı kullanır — ekranda görülen ile kuruma giden PDF ayrışmasın diye.
/// Önizleme çıktısına "ÖNİZLEME" damgası basılır.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ReportBuilderModel : AbpPageModel
{
    private readonly IReportTemplateAppService _templateAppService;
    private readonly IDeliveryPackageAppService _packageAppService;
    private readonly IExternalShareAppService _shareAppService;
    private readonly IReportScheduleAppService _scheduleAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly DeliveryReportModelBuilder _reportModelBuilder;

    public ReportBuilderModel(
        IReportTemplateAppService templateAppService,
        IDeliveryPackageAppService packageAppService,
        IExternalShareAppService shareAppService,
        IReportScheduleAppService scheduleAppService,
        IProjectAppService projectAppService,
        DeliveryReportModelBuilder reportModelBuilder)
    {
        _templateAppService = templateAppService;
        _packageAppService = packageAppService;
        _shareAppService = shareAppService;
        _scheduleAppService = scheduleAppService;
        _projectAppService = projectAppService;
        _reportModelBuilder = reportModelBuilder;
    }

    public void OnGet()
    {
    }

    /* ─── Bölümler sekmesi ────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetTemplatesAsync()
        => new JsonResult(await _templateAppService.GetListAsync());

    public async Task<IActionResult> OnPostUpdateSectionsAsync([FromBody] UpdateReportSectionsDto input)
        => new JsonResult(await _templateAppService.UpdateSectionsAsync(input));

    /* ─── Şablon aktarımı (.json) ─────────────────────────────────────── */

    public const string TemplateTransferFormat = "apya.report-template";

    /// <summary>Şablonun künyesi ve bölüm düzeni; bölüm içeriği şablonda tutulmaz, aktarılmaz da.</summary>
    public sealed class TemplateTransfer
    {
        public string Name { get; set; } = string.Empty;
        public ReportRecipient Recipient { get; set; }
        public string? Issuer { get; set; }
        public int Order { get; set; }
        public List<TemplateTransferSection> Sections { get; set; } = new();
    }

    public sealed class TemplateTransferSection
    {
        public ReportSectionKey Key { get; set; }
        public int Order { get; set; }
        public bool IsEnabled { get; set; }
    }

    public async Task<IActionResult> OnGetExportTemplateAsync(Guid id)
    {
        var template = (await _templateAppService.GetListAsync()).FirstOrDefault(t => t.Id == id);
        if (template == null)
        {
            return NotFound();
        }

        var data = new TemplateTransfer
        {
            Name = template.Name,
            Recipient = template.Recipient,
            Issuer = template.Issuer,
            Order = template.Order,
            Sections = template.Sections.OrderBy(s => s.Order)
                .Select(s => new TemplateTransferSection { Key = s.SectionKey, Order = s.Order, IsEnabled = s.IsEnabled }).ToList()
        };
        return File(ConfigTransfer.Write(TemplateTransferFormat, data, Clock.Now), ConfigTransfer.ContentType,
            ConfigTransfer.FileName(template.Name, Clock.Now));
    }

    /// <summary>
    /// Dosyadan YENİ (kiracının kendi) şablonunu açar: önce "Yeni şablon"un servisi, sonra bölüm düzeni.
    /// İkisi tek işlemde; bölüm düzeni reddedilirse şablon da açılmaz. Dosyada olmayan bölüm varsayılanında kalır.
    /// </summary>
    public async Task<IActionResult> OnPostImportTemplateAsync(IFormFile? file, [FromServices] IUnitOfWorkManager unitOfWorkManager)
    {
        var (data, error) = await ConfigTransfer.ReadAsync<TemplateTransfer>(file, TemplateTransferFormat);
        error ??= data!.Name.Trim().Length == 0
                  || !Enum.IsDefined(data.Recipient)
                  || data.Sections.Any(s => !Enum.IsDefined(s.Key))
                  || data.Sections.Select(s => s.Key).Distinct().Count() != data.Sections.Count
            ? "Transfer:Error:NotJson"
            : null;
        if (error != null)
        {
            return new JsonResult(new { ok = false, message = L[error, L["Transfer:Name:ReportTemplate"]].Value });
        }

        try
        {
            using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            var created = await _templateAppService.CreateAsync(new CreateUpdateReportTemplateDto
            {
                Name = data!.Name.Trim(), Recipient = data.Recipient, Issuer = data.Issuer, Order = data.Order
            });

            var wanted = data.Sections.ToDictionary(s => s.Key);
            await _templateAppService.UpdateSectionsAsync(new UpdateReportSectionsDto
            {
                TemplateId = created.Id,
                Sections = created.Sections.Select(s => wanted.TryGetValue(s.SectionKey, out var w)
                    ? new ReportSectionOrderDto { SectionId = s.Id, Order = w.Order, IsEnabled = w.IsEnabled }
                    : new ReportSectionOrderDto { SectionId = s.Id, Order = s.Order, IsEnabled = s.IsEnabled }).ToList()
            });
            await uow.CompleteAsync();

            return new JsonResult(new { ok = true, id = created.Id, message = L["Transfer:Done", created.Name].Value });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Rapor şablonu içe aktarma reddedildi");
            return new JsonResult(new { ok = false, message = this.UserMessage(ex) });
        }
    }

    public async Task<IActionResult> OnPostCreateTemplateAsync([FromBody] CreateUpdateReportTemplateDto input)
        => new JsonResult(await _templateAppService.CreateAsync(input));

    public async Task<IActionResult> OnPostUpdateTemplateAsync(Guid id, [FromBody] CreateUpdateReportTemplateDto input)
        => new JsonResult(await _templateAppService.UpdateAsync(id, input));

    public async Task<IActionResult> OnPostDuplicateTemplateAsync(Guid id)
        => new JsonResult(await _templateAppService.DuplicateAsync(id));

    public async Task<IActionResult> OnPostDeleteTemplateAsync(Guid id)
    {
        await _templateAppService.DeleteAsync(id);
        return NoContent();
    }

    /* ─── Önizleme sekmesi ────────────────────────────────────────────── */

    /// <summary>Proje seçici — derleyici bir proje bağlamı olmadan önizleyemez.</summary>
    public async Task<IActionResult> OnGetProjectsAsync()
    {
        var projects = await _projectAppService.GetListAsync(
            new PagedAndSortedResultRequestDto { MaxResultCount = 200, Sorting = "Name" });

        // Host bağlamında ProjectAppService tenant süzgecini bilinçli olarak KAPATIR
        // (host tüm kiracıların projesini görür). Rapor derleyici zinciri ise süzgeci
        // açık bırakır: yabancı bir proje seçilince Preview "Project bulunamadı" (404)
        // döner. Seçici bu yüzden derleyicinin gerçekten derleyebildiği kümeye indirilir.
        // Kiracı bağlamında süzgeç zaten açık olduğundan bu satır etkisizdir.
        return new JsonResult(projects.Items
            .Where(p => p.TenantId == CurrentTenant.Id)
            .Select(p => new { id = p.Id, name = p.Name, code = p.Code })
            .ToList());
    }

    /// <summary>Ekranda gösterilen önizleme verisi (PDF'in kaynağıyla birebir aynı model).</summary>
    public async Task<IActionResult> OnGetPreviewAsync(Guid projectId, Guid? templateId, string? periodCode)
        => new JsonResult(await _reportModelBuilder.BuildPreviewAsync(projectId, templateId, periodCode));

    /// <summary>Aynı modelden gerçek PDF — tarayıcıda satır içi açılır, indirilmez.</summary>
    public async Task<IActionResult> OnGetPreviewPdfAsync(Guid projectId, Guid? templateId, string? periodCode)
    {
        var model = await _reportModelBuilder.BuildPreviewAsync(projectId, templateId, periodCode);
        var pdf = DeliveryPackageExporter.ToPdf(model);

        // inline: kullanıcı önizlemeyi indirmek yerine görsün; dosya adında da ÖNİZLEME geçer.
        Response.Headers.ContentDisposition = "inline; filename=\"onizleme.pdf\"";
        return File(pdf, "application/pdf");
    }

    /* ─── Dağıtım sekmesi ─────────────────────────────────────────────── */

    /// <summary>
    /// Dağıtım, ÜRETİLMİŞ paketler üzerinden yürür: paylaşım linki bir pakete
    /// bağlanır, şablona değil. Şablon neyin basılacağını, paket ne basıldığını
    /// tutar — link ikincisine verilir.
    /// </summary>
    public async Task<IActionResult> OnGetPackagesAsync(Guid projectId)
        => new JsonResult(await _packageAppService.GetListAsync(projectId));

    /* ─── Zamanlanmış üretim + aboneler (Faz E) ───────────────────────── */

    public async Task<IActionResult> OnGetSchedulesAsync(Guid projectId)
        => new JsonResult(await _scheduleAppService.GetListAsync(projectId));

    public async Task<IActionResult> OnPostCreateScheduleAsync([FromBody] CreateUpdateReportScheduleDto input)
        => new JsonResult(await _scheduleAppService.CreateAsync(input));

    public async Task<IActionResult> OnPostUpdateScheduleAsync(Guid id, [FromBody] CreateUpdateReportScheduleDto input)
        => new JsonResult(await _scheduleAppService.UpdateAsync(id, input));

    public async Task<IActionResult> OnPostSetScheduleEnabledAsync(Guid id, bool isEnabled)
        => new JsonResult(await _scheduleAppService.SetEnabledAsync(id, isEnabled));

    public async Task<IActionResult> OnPostDeleteScheduleAsync(Guid id)
    {
        await _scheduleAppService.DeleteAsync(id);
        return NoContent();
    }

    public async Task<IActionResult> OnPostAddSubscriberAsync(Guid scheduleId, [FromBody] CreateUpdateReportSubscriberDto input)
        => new JsonResult(await _scheduleAppService.AddSubscriberAsync(scheduleId, input));

    public async Task<IActionResult> OnPostRemoveSubscriberAsync(Guid subscriberId)
    {
        await _scheduleAppService.RemoveSubscriberAsync(subscriberId);
        return NoContent();
    }

    public async Task<IActionResult> OnGetShareLinksAsync(Guid packageId)
        => new JsonResult(await _shareAppService.GetListAsync(ShareTargetType.DeliveryPackage, packageId));

    public async Task<IActionResult> OnPostCreateShareLinkAsync([FromBody] CreateShareLinkDto input)
        => new JsonResult(await _shareAppService.CreateAsync(input));

    public async Task<IActionResult> OnPostRevokeShareLinkAsync(Guid id)
    {
        await _shareAppService.RevokeAsync(id);
        return NoContent();
    }
}
