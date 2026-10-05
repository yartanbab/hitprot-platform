using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// 🔴 CNV-01 / FIN-04 geri dolumu: kaynak kimliği alanları eklenmeden ÖNCE dönüştürülmüş
/// projelerde bütçe kalemini ve fon dilimini doğdukları hibe kaydına bağlar.
///
/// <para>Yeni dönüşümler bağı kendisi yazar (<c>GrantApplicationConversionAppService</c>);
/// bu sınıf yalnız geçmişi tamamlar. Eşleştirme kuralı
/// <see cref="GrantSourceLinkMatcher"/>'da ve bilerek TUTUCU: emin olunamayan kayıt
/// bağlanmaz, alanı boş kalır.</para>
///
/// <para>Yalnız BOŞ alana yazar ve dolu olanı ezmez; bu yüzden her DbMigrator turunda
/// güvenle koşar. İkinci turda yazacak bir şey bulamaz.</para>
/// </summary>
public class GrantSourceLinkBackfillDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _grantLineRepository;
    private readonly IRepository<GrantDisbursementTranche, Guid> _grantTrancheRepository;
    private readonly IRepository<ProjectBudgetLine, Guid> _projectLineRepository;
    private readonly IRepository<FundingTranche, Guid> _projectTrancheRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<GrantSourceLinkBackfillDataSeedContributor> _logger;

    public GrantSourceLinkBackfillDataSeedContributor(
        IRepository<GrantApplication, Guid> appRepository,
        IRepository<GrantApplicationBudgetLine, Guid> grantLineRepository,
        IRepository<GrantDisbursementTranche, Guid> grantTrancheRepository,
        IRepository<ProjectBudgetLine, Guid> projectLineRepository,
        IRepository<FundingTranche, Guid> projectTrancheRepository,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant,
        ILogger<GrantSourceLinkBackfillDataSeedContributor> logger)
    {
        _appRepository = appRepository;
        _grantLineRepository = grantLineRepository;
        _grantTrancheRepository = grantTrancheRepository;
        _projectLineRepository = projectLineRepository;
        _projectTrancheRepository = projectTrancheRepository;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            // Dönüştürülmüş projeler kiracılara dağınık; tek turda hepsi taranır.
            return;
        }

        List<GrantApplication> applications;
        List<ProjectBudgetLine> projectLines;
        List<FundingTranche> projectTranches;
        List<GrantApplicationBudgetLine> grantLines;
        List<GrantDisbursementTranche> grantTranches;

        // 🔴 Kayıtlar kiracı bağlamında yaşıyor: OKUMA için filtre bilinçli kapatılır,
        // YAZMA aşağıda her projenin kendi kiracı bağlamında yapılır.
        using (_mtFilter.Disable())
        {
            applications = await _appRepository.GetListAsync(a => a.ProjectId != null);
            if (applications.Count == 0)
            {
                return;
            }

            var projectIds = applications.Select(a => a.ProjectId!.Value).Distinct().ToList();
            projectLines = await _projectLineRepository.GetListAsync(l => projectIds.Contains(l.ProjectId));
            projectTranches = await _projectTrancheRepository.GetListAsync(t => projectIds.Contains(t.ProjectId));

            // Bağlanacak hiçbir şey yoksa hibe tarafını hiç okuma — ikinci turun maliyeti bu kadar.
            if (projectLines.All(l => l.SourceGrantLineId != null)
                && projectTranches.All(t => t.SourceGrantTrancheId != null))
            {
                return;
            }

            var applicationIds = applications.Select(a => a.Id).ToList();
            grantLines = await _grantLineRepository.GetListAsync(l => applicationIds.Contains(l.GrantApplicationId));
            grantTranches = await _grantTrancheRepository.GetListAsync(t => applicationIds.Contains(t.GrantApplicationId));
        }

        var linkedLines = 0;
        var linkedTranches = 0;

        foreach (var application in applications)
        {
            var projectId = application.ProjectId!.Value;

            var lines = projectLines.Where(l => l.ProjectId == projectId).ToList();
            var tranches = projectTranches.Where(t => t.ProjectId == projectId).ToList();

            // Zaten bir proje kaydına bağlanmış hibe kaydı ikinci kez aday OLAMAZ.
            var takenLines = lines.Where(l => l.SourceGrantLineId != null)
                .Select(l => l.SourceGrantLineId!.Value).ToHashSet();
            var takenTranches = tranches.Where(t => t.SourceGrantTrancheId != null)
                .Select(t => t.SourceGrantTrancheId!.Value).ToHashSet();

            var lineMatches = GrantSourceLinkMatcher.MatchBudgetLines(
                grantLines.Where(l => l.GrantApplicationId == application.Id && !takenLines.Contains(l.Id))
                    .Select(l => new GrantSourceLinkMatcher.GrantLine(l.Id, l.Amount)).ToList(),
                lines.Where(l => l.SourceGrantLineId == null)
                    .Select(l => new GrantSourceLinkMatcher.ProjectLine(l.Id, l.PlannedAmount)).ToList());

            var trancheMatches = GrantSourceLinkMatcher.MatchTranches(
                grantTranches.Where(t => t.GrantApplicationId == application.Id && !takenTranches.Contains(t.Id))
                    .Select(t => new GrantSourceLinkMatcher.GrantTranche(t.Id, t.SequenceNo, t.Amount)).ToList(),
                tranches.Where(t => t.SourceGrantTrancheId == null)
                    .Select(t => new GrantSourceLinkMatcher.ProjectTranche(t.Id, t.SequenceNo, t.PlannedAmount)).ToList());

            if (lineMatches.Count == 0 && trancheMatches.Count == 0)
            {
                continue;
            }

            using (_currentTenant.Change(application.TenantId))
            {
                foreach (var line in lines.Where(l => lineMatches.ContainsKey(l.Id)))
                {
                    line.LinkToGrantLine(lineMatches[line.Id]);
                    await _projectLineRepository.UpdateAsync(line, autoSave: true);
                    linkedLines++;
                }

                foreach (var tranche in tranches.Where(t => trancheMatches.ContainsKey(t.Id)))
                {
                    tranche.LinkToGrantTranche(trancheMatches[tranche.Id]);
                    await _projectTrancheRepository.UpdateAsync(tranche, autoSave: true);
                    linkedTranches++;
                }
            }
        }

        if (linkedLines > 0 || linkedTranches > 0)
        {
            _logger.LogWarning(
                "CNV-01/FIN-04 geri dolumu: {Lines} bütçe kalemi ve {Tranches} fon dilimi doğduğu hibe " +
                "kaydına bağlandı. Bağlanamayanlar (belirsiz eşleşme) boş bırakıldı.",
                linkedLines, linkedTranches);
        }
    }
}
