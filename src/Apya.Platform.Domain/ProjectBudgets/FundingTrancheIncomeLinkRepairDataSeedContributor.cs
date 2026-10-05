using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Incomes;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// 🔴 FIN-06 veri onarımı: gösterdiği gelir kaydı ARTIK VAR OLMAYAN tahsilat bağını temizler.
///
/// <para>Nasıl oluştu: gelir kaydı silinirken ona bağlı fon dilimi hiç sorulmuyordu; dilim
/// "tahsil edildi" + silinmiş bir kaydın kimliğiyle kalıyordu. Silme artık engelleniyor
/// (<c>ProjectBudgetManager.EnsureIncomeEntryCanBeDeletedAsync</c>); bu sınıf yalnız
/// engelden ÖNCE doğmuş sarkık bağları toplar.</para>
///
/// <para>Yalnız bağı kaldırır, tahsil edilen TUTARA dokunmaz: paranın gelip gelmediğini
/// bu sınıf bilemez. Bağsız tahsilat modelde zaten geçerli bir durumdur.</para>
///
/// <para>🔴 Yalnız HEDEFİ YOK olan bağa dokunur. Başka projenin gelirine ya da iki dilimden
/// aynı gelire kurulmuş bağlar da yeni kurala aykırıdır ama hangisinin doğru olduğu
/// buradan bilinemez; düzeltilmez, sayısı loglanır.</para>
/// </summary>
public class FundingTrancheIncomeLinkRepairDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<FundingTrancheIncomeLinkRepairDataSeedContributor> _logger;

    public FundingTrancheIncomeLinkRepairDataSeedContributor(
        IRepository<FundingTranche, Guid> trancheRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant,
        ILogger<FundingTrancheIncomeLinkRepairDataSeedContributor> logger)
    {
        _trancheRepository = trancheRepository;
        _incomeRepository = incomeRepository;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            // Dilimler kiracılara dağınık; tek turda hepsi taranır.
            return;
        }

        List<FundingTranche> linked;
        Dictionary<Guid, Guid?> incomeProjects;

        // OKUMA filtre kapalı; YAZMA her dilimin kendi kiracı bağlamında.
        using (_mtFilter.Disable())
        {
            linked = await _trancheRepository.GetListAsync(t => t.IncomeEntryId != null);
            if (linked.Count == 0)
            {
                return;
            }

            var incomeIds = linked.Select(t => t.IncomeEntryId!.Value).Distinct().ToList();

            // Silinmiş (soft-delete) gelir depoda görünmez → "yok" sayılır; istenen de bu.
            incomeProjects = (await _incomeRepository.GetListAsync(i => incomeIds.Contains(i.Id)))
                .ToDictionary(i => i.Id, i => i.ProjectId);
        }

        var dangling = linked.Where(t => !incomeProjects.ContainsKey(t.IncomeEntryId!.Value)).ToList();

        foreach (var group in dangling.GroupBy(t => t.TenantId))
        {
            using (_currentTenant.Change(group.Key))
            {
                foreach (var tranche in group)
                {
                    tranche.UnlinkIncomeEntry();
                    await _trancheRepository.UpdateAsync(tranche, autoSave: true);
                }
            }
        }

        var alive = linked.Except(dangling).ToList();
        var mismatched = alive.Count(t => incomeProjects[t.IncomeEntryId!.Value] != t.ProjectId);
        var shared = alive.GroupBy(t => t.IncomeEntryId!.Value).Count(g => g.Count() > 1);

        if (dangling.Count > 0 || mismatched > 0 || shared > 0)
        {
            _logger.LogWarning(
                "FIN-06 onarımı: {Dangling} fon diliminin silinmiş gelir kaydına giden bağı temizlendi. " +
                "Düzeltilmeden bırakılanlar: {Mismatched} dilim başka projenin gelirine bağlı, " +
                "{Shared} gelir kaydı birden çok dilime bağlı — elle incelenmeli.",
                dangling.Count, mismatched, shared);
        }
    }
}
