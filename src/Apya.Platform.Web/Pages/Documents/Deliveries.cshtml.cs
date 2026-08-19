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
    private readonly IExternalShareAppService _shareAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    // Rapor modelini kuran altı bağımlılık (proje, uygunluk, iş adımı, belge,
    // etkinlik, saat) buradan çıkıp DeliveryReportModelBuilder'a taşındı —
    // Rapor Derleyici önizlemesi ile üretim aynı kodu kullansın diye.
    private readonly DeliveryReportModelBuilder _reportModelBuilder;

    public DeliveriesModel(
        IDeliveryPackageAppService packageAppService,
        IReportTemplateAppService templateAppService,
        IExternalShareAppService shareAppService,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider,
        DeliveryReportModelBuilder reportModelBuilder)
    {
        _packageAppService = packageAppService;
        _templateAppService = templateAppService;
        _shareAppService = shareAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
        _reportModelBuilder = reportModelBuilder;
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
        var model = await _reportModelBuilder.BuildAsync(package);

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

}
