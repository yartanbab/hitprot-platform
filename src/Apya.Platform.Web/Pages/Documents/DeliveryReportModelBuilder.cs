using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Projects;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Timing;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Rapor modelini kurar. İki çağıran var ve İKİSİ DE AYNI kodu kullanmalı:
/// Teslimler ekranı (gerçek paketten üretim) ve Rapor Derleyici (önizleme).
///
/// Ayrı kurucular yazmak, önizlemenin üretilen çıktıdan sapması demek olurdu —
/// kullanıcı ekranda gördüğünden farklı bir PDF alırdı. Bu yüzden kurucu Razor
/// sayfasından çıkarılıp tek yere alındı.
///
/// Web katmanında yaşıyor çünkü çıktı üretimiyle (QuestPDF/ClosedXML) aynı
/// katmanda; app service'ler veriyi ve kararı verir, biçimleme burada olur.
/// </summary>
public class DeliveryReportModelBuilder : ITransientDependency
{
    /// <summary>Önizlemede gösterilecek en fazla ek sayısı — tam liste üretimde çıkar.</summary>
    private const int PreviewAnnexLimit = 25;

    private const int AuditTrailLimit = 100;

    private readonly IProjectAppService _projectAppService;
    private readonly IComplianceAppService _complianceAppService;
    private readonly IProjectWorkStepAppService _workStepAppService;
    private readonly IReportTemplateAppService _templateAppService;
    private readonly IDocumentFileAppService _documentFileAppService;
    private readonly IDocumentActivityAppService _activityAppService;
    private readonly ICurrentUser _currentUser;
    private readonly IClock _clock;

    public DeliveryReportModelBuilder(
        IProjectAppService projectAppService,
        IComplianceAppService complianceAppService,
        IProjectWorkStepAppService workStepAppService,
        IReportTemplateAppService templateAppService,
        IDocumentFileAppService documentFileAppService,
        IDocumentActivityAppService activityAppService,
        ICurrentUser currentUser,
        IClock clock)
    {
        _projectAppService = projectAppService;
        _complianceAppService = complianceAppService;
        _workStepAppService = workStepAppService;
        _templateAppService = templateAppService;
        _documentFileAppService = documentFileAppService;
        _activityAppService = activityAppService;
        _currentUser = currentUser;
        _clock = clock;
    }

    /* ─── Gerçek üretim: paketten ──────────────────────────────────────── */

    public async Task<DeliveryReportModel> BuildAsync(DeliveryPackageDetailDto package)
    {
        var sections = await ResolveSectionsAsync(package.ReportTemplateId);

        var model = await BuildCoreAsync(
            package.ProjectId, package.PeriodCode, sections,
            package.Name, package.ReportTemplateName);

        // Ekler paketteki SIRAYA göre; tutar/tür bilgisi belge detayından gelir.
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

        model.Summary.DocumentCount = package.Items.Count;

        await FillAuditTrailAsync(model, package.ProjectId, sections);

        return model;
    }

    /* ─── Önizleme: paket yokken, projenin belgelerinden ───────────────── */

    /// <summary>
    /// Rapor Derleyici önizlemesi. Henüz paket yok, bu yüzden ekler projenin
    /// belgelerinden ilk <see cref="PreviewAnnexLimit"/> tanesiyle temsil edilir;
    /// EK numarası üretimde atanacağı için burada sıra numarası gösterilir.
    /// </summary>
    public async Task<DeliveryReportModel> BuildPreviewAsync(
        Guid projectId, Guid? templateId, string? periodCode)
    {
        var sections = await ResolveSectionsAsync(templateId);

        var templates = await _templateAppService.GetListAsync();
        var templateName = templates.FirstOrDefault(t => t.Id == templateId)?.Name;

        var model = await BuildCoreAsync(
            projectId, periodCode, sections,
            packageName: "Önizleme", templateName: templateName);

        model.IsPreview = true;

        var files = await _documentFileAppService.GetListAsync(new GetDocumentFilesInput
        {
            ProjectId = projectId,
            PeriodCode = periodCode,
            MaxResultCount = PreviewAnnexLimit,
            Sorting = "documentDate",
        });

        var index = 1;

        foreach (var file in files.Items)
        {
            model.Annexes.Add(new DeliveryReportModel.AnnexRow
            {
                AnnexNumber = $"EK-{index++}",
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

        // Toplam belge sayısı önizlemede kesilmiş listeye değil GERÇEK sayıya bakar,
        // yoksa "25 belge" gibi yanıltıcı bir özet çıkar.
        model.Summary.DocumentCount = (int)files.TotalCount;
        model.TruncatedAnnexCount = Math.Max(0, (int)files.TotalCount - model.Annexes.Count);

        await FillAuditTrailAsync(model, projectId, sections);

        return model;
    }

    /* ─── Ortak gövde ──────────────────────────────────────────────────── */

    private async Task<DeliveryReportModel> BuildCoreAsync(
        Guid projectId, string? periodCode, List<ReportSectionKey> sections,
        string packageName, string? templateName)
    {
        var project = await _projectAppService.GetAsync(projectId);
        var overview = await _complianceAppService.GetOverviewAsync(projectId, periodCode);
        var workSteps = await _workStepAppService.GetListAsync(projectId);

        var model = new DeliveryReportModel
        {
            PackageName = packageName,
            ProjectName = project.Name,
            ProjectCode = project.Code,
            PeriodCode = periodCode,
            TemplateName = templateName,
            GeneratedAt = _clock.Now,
            GeneratedBy = _currentUser.UserName ?? "Sistem",
            Sections = sections,
        };

        model.Summary = new DeliveryReportModel.ProjectSummaryBlock
        {
            CompliancePercent = overview.Summary.Percent,
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

        return model;
    }

    private async Task FillAuditTrailAsync(
        DeliveryReportModel model, Guid projectId, List<ReportSectionKey> sections)
    {
        if (!sections.Contains(ReportSectionKey.AuditTrail))
        {
            return;
        }

        var activity = await _activityAppService.GetListAsync(new GetDocumentActivityInput
        {
            ProjectId = projectId,
            MaxResultCount = AuditTrailLimit,
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
