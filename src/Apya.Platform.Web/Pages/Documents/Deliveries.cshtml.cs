using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Storage;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Timing;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Teslimler & arşiv. Paket kurucu, preflight ve çıktı üretimi.
///
/// Üretim akışı bilinçli olarak burada toplanır: app service'ler veriyi ve kararı
/// verir, bu sayfa baytları üretip depoya yazar ve sonucu servise geri bildirir.
/// QuestPDF/ClosedXML bu katmanda yaşıyor (bkz. Pages/Reports/ReportExporter).
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DeliveriesModel : AbpPageModel
{
    private readonly IDeliveryPackageAppService _packageAppService;
    private readonly IReportTemplateAppService _templateAppService;
    private readonly IComplianceAppService _complianceAppService;
    private readonly IProjectWorkStepAppService _workStepAppService;
    private readonly IDocumentActivityAppService _activityAppService;
    private readonly IDocumentFileAppService _documentFileAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly IExternalShareAppService _shareAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;
    private readonly IClock _clock;

    public DeliveriesModel(
        IDeliveryPackageAppService packageAppService,
        IReportTemplateAppService templateAppService,
        IComplianceAppService complianceAppService,
        IProjectWorkStepAppService workStepAppService,
        IDocumentActivityAppService activityAppService,
        IDocumentFileAppService documentFileAppService,
        IProjectAppService projectAppService,
        IExternalShareAppService shareAppService,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider,
        IClock clock)
    {
        _packageAppService = packageAppService;
        _templateAppService = templateAppService;
        _complianceAppService = complianceAppService;
        _workStepAppService = workStepAppService;
        _activityAppService = activityAppService;
        _documentFileAppService = documentFileAppService;
        _projectAppService = projectAppService;
        _shareAppService = shareAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
        _clock = clock;
    }

    public void OnGet()
    {
    }

    /* ─── Paket yönetimi ──────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetPackagesAsync(Guid projectId)
        => new JsonResult(await _packageAppService.GetListAsync(projectId));

    public async Task<IActionResult> OnGetPackageAsync(Guid id)
        => new JsonResult(await _packageAppService.GetAsync(id));

    public async Task<IActionResult> OnPostCreatePackageAsync([FromBody] CreateUpdateDeliveryPackageDto input)
        => new JsonResult(await _packageAppService.CreateAsync(input));

    public async Task<IActionResult> OnPostUpdatePackageAsync(Guid id, [FromBody] CreateUpdateDeliveryPackageDto input)
        => new JsonResult(await _packageAppService.UpdateAsync(id, input));

    public async Task<IActionResult> OnPostDeletePackageAsync(Guid id)
    {
        await _packageAppService.DeleteAsync(id);
        return NoContent();
    }

    public async Task<IActionResult> OnPostAddItemsAsync([FromBody] AddDeliveryPackageItemsDto input)
        => new JsonResult(await _packageAppService.AddItemsAsync(input));

    public async Task<IActionResult> OnPostRemoveItemAsync(Guid itemId)
        => new JsonResult(await _packageAppService.RemoveItemAsync(itemId));

    public async Task<IActionResult> OnPostReorderItemsAsync([FromBody] ReorderDeliveryPackageItemsDto input)
        => new JsonResult(await _packageAppService.ReorderItemsAsync(input));

    public async Task<IActionResult> OnGetPreflightAsync(Guid packageId)
        => new JsonResult(await _packageAppService.PreflightAsync(packageId));

    public async Task<IActionResult> OnGetTemplatesAsync()
        => new JsonResult(await _templateAppService.GetListAsync());

    public async Task<IActionResult> OnGetRunsAsync(Guid projectId)
        => new JsonResult(await _packageAppService.GetRunsAsync(projectId));

    /* ─── Üretim ──────────────────────────────────────────────────────── */

    /// <summary>
    /// Paketi üretir. Preflight bloke ediyorsa AppService hata fırlatır —
    /// istemci düğmeyi kapatmış olsa da sunucu kontrolü atlanmaz.
    /// </summary>
    public async Task<IActionResult> OnPostGenerateAsync(Guid packageId)
    {
        // Handler metoduna konan [Authorize] ASP.NET Core tarafından SESSİZCE yok sayılır
        // (derleyici uyarısı MVC1001). Sınıftaki izin yalnızca Documents.Default olduğu için
        // kontrol burada çalışma anında yapılmalı — yoksa sadece görüntüleme yetkisi olan
        // kullanıcı da paket üretebilirdi.
        await AuthorizationService.CheckAsync(PlatformPermissions.Documents.GenerateReports);

        var package = await _packageAppService.GetAsync(packageId);
        var model = await BuildReportModelAsync(package);

        var pdf = DeliveryPackageExporter.ToPdf(model);

        byte[] output;
        string extension;

        if (package.Formats.HasFlag(ReportOutputFormat.Zip))
        {
            var excel = package.Formats.HasFlag(ReportOutputFormat.Excel)
                ? DeliveryPackageExporter.AnnexIndexToExcel(model)
                : null;

            var annexFiles = (await _packageAppService.GetAnnexFilesAsync(packageId))
                .Where(a => !string.IsNullOrEmpty(a.AnnexNumber))
                .ToDictionary(a => a.AnnexNumber);

            output = DeliveryPackageExporter.ToZip(
                model, pdf, excel, annex => ResolveAnnexContent(annexFiles, annex));
            extension = ".zip";
        }
        else if (package.Formats == ReportOutputFormat.Excel)
        {
            output = DeliveryPackageExporter.AnnexIndexToExcel(model);
            extension = ".xlsx";
        }
        else
        {
            output = pdf;
            extension = ".pdf";
        }

        var storedFileName = await _fileStorage.StoreGeneratedAsync(output, extension);

        var run = await _packageAppService.MarkGeneratedAsync(
            packageId, storedFileName, output.LongLength, model.Sections.Count);

        return new JsonResult(run);
    }

    public async Task<IActionResult> OnGetDownloadRunAsync(Guid runId)
        => Serve(await _packageAppService.PrepareRunDownloadAsync(runId));

    public async Task<IActionResult> OnGetDownloadPackageAsync(Guid packageId)
        => Serve(await _packageAppService.PrepareDownloadAsync(packageId));

    /* ─── Paylaşım linkleri ───────────────────────────────────────────── */

    public async Task<IActionResult> OnGetShareLinksAsync(Guid packageId)
        => new JsonResult(await _shareAppService.GetListAsync(ShareTargetType.DeliveryPackage, packageId));

    public async Task<IActionResult> OnPostCreateShareLinkAsync([FromBody] CreateShareLinkDto input)
        => new JsonResult(await _shareAppService.CreateAsync(input));

    public async Task<IActionResult> OnPostRevokeShareLinkAsync(Guid id)
    {
        await _shareAppService.RevokeAsync(id);
        return NoContent();
    }

    /* ─── Yardımcılar ─────────────────────────────────────────────────── */

    private async Task<DeliveryReportModel> BuildReportModelAsync(DeliveryPackageDetailDto package)
    {
        var project = await _projectAppService.GetAsync(package.ProjectId);
        var overview = await _complianceAppService.GetOverviewAsync(package.ProjectId, package.PeriodCode);
        var workSteps = await _workStepAppService.GetListAsync(package.ProjectId);

        var sections = await ResolveSectionsAsync(package.ReportTemplateId);

        var model = new DeliveryReportModel
        {
            PackageName = package.Name,
            ProjectName = project.Name,
            ProjectCode = project.Code,
            PeriodCode = package.PeriodCode,
            TemplateName = package.ReportTemplateName,
            GeneratedAt = _clock.Now,
            GeneratedBy = CurrentUser.UserName ?? "Sistem",
            Sections = sections,
        };

        model.Summary = new DeliveryReportModel.ProjectSummaryBlock
        {
            CompliancePercent = overview.Summary.Percent,
            DocumentCount = package.Items.Count,
            MissingCount = overview.Summary.MissingCount,
            BlockingCount = overview.Summary.BlockingMissingCount,
            Currency = project.Currency ?? "TRY",
        };

        model.WorkSteps = workSteps.Select(s => new DeliveryReportModel.WorkStepProgressRow
        {
            Order = s.Order,
            Name = s.Name,
            ProgressPercent = s.ProgressPercent,
            DocumentCount = s.DocumentCount,
        }).ToList();

        model.Compliance = overview.Checklists
            .SelectMany(c => c.Items.Select(i => new DeliveryReportModel.ComplianceRow
            {
                PackageName = c.PackageName,
                Title = i.Title,
                Scope = i.WorkStepName ?? i.PeriodCode ?? "Proje",
                Status = i.Status,
                IsBlocking = i.IsBlocking,
                DocumentName = i.DocumentFileName,
            }))
            .ToList();

        model.MissingDocuments = model.Compliance
            .Where(c => c.Status == ComplianceItemStatus.Missing)
            .Select(c => c.IsBlocking ? $"{c.Title} ({c.Scope}) — teslimi bloke ediyor" : $"{c.Title} ({c.Scope})")
            .ToList();

        // Ekler: paketteki sıraya göre, tutar/tür bilgisi belge detayından.
        foreach (var item in package.Items.OrderBy(i => i.Order))
        {
            var file = await _documentFileAppService.GetAsync(item.DocumentFileId);

            model.Annexes.Add(new DeliveryReportModel.AnnexRow
            {
                AnnexNumber = item.AnnexNumber ?? string.Empty,
                DocumentName = file.DisplayName,
                TypeName = file.DocumentTypeName,
                DocumentDate = file.DocumentDate,
                Amount = file.Amount,
                FileSize = file.FileSize,
            });

            if (file.Amount.HasValue)
            {
                model.Summary.DocumentedAmount += file.Amount.Value;
            }
        }

        if (sections.Contains(ReportSectionKey.AuditTrail))
        {
            var activity = await _activityAppService.GetListAsync(new GetDocumentActivityInput
            {
                ProjectId = package.ProjectId,
                MaxResultCount = 100,
            });

            model.AuditTrail = activity.Items.Select(a => new DeliveryReportModel.AuditRow
            {
                At = a.CreationTime,
                Actor = a.ActorName,
                Action = ActionLabel(a.Action),
                Target = a.DocumentFileName,
                Detail = a.Detail,
            }).ToList();
        }

        return model;
    }

    /// <summary>
    /// Şablonun AÇIK bölümleri, sıralı. Şablon seçilmemişse makul bir varsayılan
    /// set kullanılır — paket yine de üretilebilmeli.
    /// </summary>
    private async Task<List<ReportSectionKey>> ResolveSectionsAsync(Guid? templateId)
    {
        if (!templateId.HasValue)
        {
            return new List<ReportSectionKey>
            {
                ReportSectionKey.ProjectSummary,
                ReportSectionKey.ComplianceStatus,
                ReportSectionKey.MissingDocuments,
                ReportSectionKey.AnnexIndex,
            };
        }

        var templates = await _templateAppService.GetListAsync();
        var template = templates.FirstOrDefault(t => t.Id == templateId.Value);

        if (template == null)
        {
            return new List<ReportSectionKey> { ReportSectionKey.ProjectSummary, ReportSectionKey.AnnexIndex };
        }

        return template.Sections
            .Where(s => s.IsEnabled)
            .OrderBy(s => s.Order)
            .Select(s => s.SectionKey)
            .ToList();
    }

    /// <summary>
    /// ZIP'e konacak ek dosyasını diskten okur. Dosya yoksa null döner ve exporter
    /// EKSIK-EKLER.txt notu üretir — sessizce atlamak, eksik ekli paketi fark
    /// edilmeden kuruma göndermek demek olurdu.
    /// </summary>
    private (string FileName, byte[]? Content) ResolveAnnexContent(
        IReadOnlyDictionary<string, AnnexFileDto> annexFiles, DeliveryReportModel.AnnexRow annex)
    {
        if (!annexFiles.TryGetValue(annex.AnnexNumber, out var file) || string.IsNullOrEmpty(file.StoredFileName))
        {
            return (annex.DocumentName, null);
        }

        var path = _rootFolderProvider.ResolveSafePath(file.StoredFileName);

        if (path == null || !System.IO.File.Exists(path))
        {
            return (file.FileName, null);
        }

        return (file.FileName, System.IO.File.ReadAllBytes(path));
    }

    private IActionResult Serve(GeneratedFileDownloadDto download)
    {
        var path = _rootFolderProvider.ResolveSafePath(download.StoredFileName);

        if (path == null || !System.IO.File.Exists(path))
        {
            return NotFound();
        }

        return PhysicalFile(path, download.ContentType, download.FileName);
    }

    private static string ActionLabel(DocumentAccessAction action) => action switch
    {
        DocumentAccessAction.Uploaded => "Yüklendi",
        DocumentAccessAction.Downloaded => "İndirildi",
        DocumentAccessAction.Deleted => "Silindi",
        DocumentAccessAction.Viewed => "Görüntülendi",
        DocumentAccessAction.MetaChanged => "Meta değişti",
        DocumentAccessAction.Moved => "Taşındı",
        _ => "—",
    };
}
