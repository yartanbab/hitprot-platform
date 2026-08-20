using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;

namespace Apya.Platform.Documents;

/// <summary>
/// İlk kurulum sihirbazı.
///
/// Yeni bir mekanizma KURMUYOR: klasörler mevcut Document aggregate'i, kurum
/// listesi mevcut ComplianceAppService ile kurulur. Sihirbazın katkısı bunları
/// tek akışta sıraya dizmek ve "kurulum yapıldı mı" bilgisini tutmak.
///
/// Bayrak KİRACI ayarında (tablo yok — takvimin sihirbazıyla aynı ray). Kiracı
/// seviyesi doğru olan: klasör şeması kiracının tamamına kurulur, ikinci
/// kullanıcı aynı sihirbazı yeniden görmemeli.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentSetupAppService : ApplicationService, IDocumentSetupAppService
{
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IDocumentAppService _documentAppService;
    private readonly IComplianceAppService _complianceAppService;
    private readonly ISettingManager _settingManager;

    public DocumentSetupAppService(
        IRepository<Document, Guid> documentRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IDocumentAppService documentAppService,
        IComplianceAppService complianceAppService,
        ISettingManager settingManager)
    {
        _documentRepository = documentRepository;
        _projectRepository = projectRepository;
        _workStepRepository = workStepRepository;
        _documentAppService = documentAppService;
        _complianceAppService = complianceAppService;
        _settingManager = settingManager;
    }

    public virtual async Task<DocumentSetupStateDto> GetStateAsync()
    {
        var completedRaw = await SettingProvider.GetOrNullAsync(PlatformSettings.Documents.SetupCompleted);
        var schemaRaw = await SettingProvider.GetOrNullAsync(PlatformSettings.Documents.SetupSchema);

        var folderCount = await _documentRepository.CountAsync();

        var projects = await AsyncExecuter.ToListAsync(
            (await _projectRepository.GetQueryableAsync()).AsNoTracking()
                .OrderBy(p => p.Name)
                .Select(p => new { p.Id, p.Name, p.Code }));

        var projectIds = projects.Select(p => p.Id).ToList();

        var stepCounts = projectIds.Count == 0
            ? new Dictionary<Guid, int>()
            : (await AsyncExecuter.ToListAsync(
                    (await _workStepRepository.GetQueryableAsync()).AsNoTracking()
                        .Where(s => projectIds.Contains(s.ProjectId))
                        .GroupBy(s => s.ProjectId)
                        .Select(g => new { ProjectId = g.Key, Count = g.Count() })))
                .ToDictionary(k => k.ProjectId, v => v.Count);

        var foldered = projectIds.Count == 0
            ? new HashSet<Guid>()
            : (await AsyncExecuter.ToListAsync(
                    (await _documentRepository.GetQueryableAsync()).AsNoTracking()
                        .Where(d => d.ProjectId != null && projectIds.Contains(d.ProjectId.Value))
                        .Select(d => d.ProjectId!.Value)))
                .ToHashSet();

        return new DocumentSetupStateDto
        {
            SetupCompleted = string.Equals(completedRaw, "true", StringComparison.OrdinalIgnoreCase),
            Schema = ParseSchema(schemaRaw),
            FolderCount = (int)folderCount,
            ProjectCount = projects.Count,
            Packages = await _complianceAppService.GetPackagesAsync(),
            Projects = projects.Select(p => new DocumentSetupProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                WorkStepCount = stepCounts.GetValueOrDefault(p.Id),
                HasFolders = foldered.Contains(p.Id),
            }).ToList(),
        };
    }

    [Authorize(PlatformPermissions.Documents.Create)]
    public virtual async Task<DocumentSetupResultDto> ApplyAsync(ApplyDocumentSetupDto input)
    {
        var project = await _projectRepository.GetAsync(input.ProjectId);

        var root = await _documentAppService.CreateAsync(new CreateUpdateDocumentDto
        {
            ProjectId = project.Id,
            Title = project.Name,
            Content = string.Empty,
            Icon = "📁",
        });

        var created = 1;

        foreach (var title in await BuildChildTitlesAsync(project.Id, input.Schema))
        {
            await _documentAppService.CreateAsync(new CreateUpdateDocumentDto
            {
                ProjectId = project.Id,
                ParentDocumentId = root.Id,
                Title = title,
                Content = string.Empty,
            });

            created++;
        }

        var packageApplied = false;
        if (input.CompliancePackageId.HasValue)
        {
            // Kurum listesi zaten uygulanmışsa AppService hata fırlatır; sihirbaz
            // yüzünden kurulum yarıda kalmasın diye yutuluyor — klasörler kuruldu.
            try
            {
                await _complianceAppService.ApplyPackageAsync(new ApplyCompliancePackageDto
                {
                    ProjectId = project.Id,
                    PackageId = input.CompliancePackageId.Value,
                    PeriodCode = input.PeriodCode,
                });

                packageApplied = true;
            }
            catch (Volo.Abp.BusinessException)
            {
                packageApplied = false;
            }
        }

        await _settingManager.SetForCurrentTenantAsync(
            PlatformSettings.Documents.SetupSchema, input.Schema.ToString().ToLowerInvariant());

        await _settingManager.SetForCurrentTenantAsync(
            PlatformSettings.Documents.SetupCompleted, "true");

        return new DocumentSetupResultDto
        {
            CreatedFolderCount = created,
            CompliancePackageApplied = packageApplied,
            RootFolderId = root.Id,
        };
    }

    public virtual async Task CompleteAsync()
        => await _settingManager.SetForCurrentTenantAsync(
            PlatformSettings.Documents.SetupCompleted, "true");

    /* ─────────────────────────── Şema ─────────────────────────── */

    /// <summary>
    /// Şemanın alt klasör adları. İş adımı bazlı şema projenin GERÇEK iş
    /// adımlarını kullanır; adım tanımlanmamışsa klasör de üretilmez — uydurma
    /// "1. Adım / 2. Adım" klasörleri kullanıcıya iş çıkarırdı.
    /// </summary>
    private async Task<List<string>> BuildChildTitlesAsync(Guid projectId, DocumentFolderSchema schema)
    {
        var titles = new List<string>();

        if (schema is DocumentFolderSchema.WorkStep or DocumentFolderSchema.Mixed)
        {
            var steps = await AsyncExecuter.ToListAsync(
                (await _workStepRepository.GetQueryableAsync()).AsNoTracking()
                    .Where(s => s.ProjectId == projectId)
                    .OrderBy(s => s.Order)
                    .Select(s => new { s.Order, s.Name }));

            titles.AddRange(steps.Select(s => $"{s.Order} · {s.Name}"));
        }

        if (schema == DocumentFolderSchema.Period)
        {
            var year = Clock.Now.Year;
            titles.AddRange(Enumerable.Range(1, 4).Select(q => $"{year} Q{q}"));
        }

        if (schema == DocumentFolderSchema.Mixed)
        {
            titles.AddRange(new[] { "Finans", "Personel / İK", "Sözleşmeler" });
        }

        return titles;
    }

    private static DocumentFolderSchema? ParseSchema(string? raw) => raw?.ToLowerInvariant() switch
    {
        "workstep" => DocumentFolderSchema.WorkStep,
        "period" => DocumentFolderSchema.Period,
        "mixed" => DocumentFolderSchema.Mixed,
        _ => null,
    };
}
