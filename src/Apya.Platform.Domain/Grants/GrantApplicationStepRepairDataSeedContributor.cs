using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 🔴 LIF-02 veri onarımı: <see cref="GrantApplication.CurrentStepId"/> artık var olmayan
/// ya da başvurunun programına ait OLMAYAN bir adımı gösteriyorsa düzeltir.
///
/// <para>Nasıl oluştu: şablon kaydı eskiden her kayıtta tüm adımları silip yeni GUID'lerle
/// yeniden yaratıyordu (#460'ta eşleştirerek güncellemeye çevrildi). O tarihe kadar host
/// yalnız bir adımın adını düzeltse bile o şablondaki TÜM başvuruların adım kimliği yetim
/// kalıyordu. Ayrıca programın şablonu değiştirilirse adım kimliği başka şablonda kalır.</para>
///
/// <para>Belirti sessizdi: pano kartı, kimliği tanımadığı için ilk sütuna düşüyordu —
/// kullanıcı başvurunun geri sarıldığını sanıyordu.</para>
///
/// <para>Onarım, DOM-01 ile gelen aşama eşlemesini kullanır: yetim kayıt, başvurunun
/// SABİT AŞAMASINA karşılık gelen adıma taşınır. Böylece kart ilk sütuna değil, özet
/// eksenin gösterdiği yere oturur. Program şablonsuzsa kimlik temizlenir (pano o
/// başvuruyu zaten dört sabit aşamaya göre dizer).</para>
///
/// <para>Yalnız BOZUK kayda dokunur, bu yüzden her DbMigrator turunda güvenle koşar.</para>
/// </summary>
public class GrantApplicationStepRepairDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILogger<GrantApplicationStepRepairDataSeedContributor> _logger;

    public GrantApplicationStepRepairDataSeedContributor(
        IRepository<GrantApplication, Guid> appRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantStageTemplateStep, Guid> stepRepository,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant,
        ILogger<GrantApplicationStepRepairDataSeedContributor> logger)
    {
        _appRepository = appRepository;
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _stepRepository = stepRepository;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
        _logger = logger;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            // Başvurular kiracılara dağınık; tek turda hepsi taranır. Kiracı başına
            // çağrılırsa aynı tarama kiracı sayısı kadar tekrarlanırdı.
            return;
        }

        List<GrantApplication> candidates;
        Dictionary<Guid, Guid?> templateByCall;
        List<GrantStageTemplateStep> allSteps;

        // 🔴 Başvurular kiracı bağlamında yaşıyor: OKUMA için filtre bilinçli kapatılır,
        // YAZMA aşağıda her kaydın kendi kiracı bağlamında yapılır.
        using (_mtFilter.Disable())
        {
            candidates = await _appRepository.GetListAsync(a => a.CurrentStepId != null);
            if (candidates.Count == 0)
            {
                return;
            }

            allSteps = await _stepRepository.GetListAsync();
            var liveStepIds = allSteps.Select(s => s.Id).ToHashSet();

            var callIds = candidates.Select(a => a.GrantCallId).Distinct().ToList();
            var calls = await _callRepository.GetListAsync(c => callIds.Contains(c.Id));
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var templateByGrant = (await _grantRepository.GetListAsync(g => grantIds.Contains(g.Id)))
                .ToDictionary(g => g.Id, g => g.StageTemplateId);
            templateByCall = calls.ToDictionary(
                c => c.Id,
                c => templateByGrant.TryGetValue(c.GrantId, out var t) ? t : null);

            // Adımı duran VE kendi programının şablonunda olan kayıtlar sağlamdır.
            candidates = candidates
                .Where(a => !IsHealthy(a, liveStepIds, templateByCall, allSteps))
                .ToList();
        }

        if (candidates.Count == 0)
        {
            return;
        }

        var repaired = 0;
        var cleared = 0;

        foreach (var group in candidates.GroupBy(a => a.TenantId))
        {
            using (_currentTenant.Change(group.Key))
            {
                foreach (var application in group)
                {
                    var templateId = templateByCall.TryGetValue(application.GrantCallId, out var t) ? t : null;
                    var target = templateId == null
                        ? null
                        : PickStep(allSteps.Where(s => s.StageTemplateId == templateId.Value), application.Stage);

                    if (target == null)
                    {
                        application.ClearStep();
                        cleared++;
                    }
                    else
                    {
                        application.MoveToStep(target.Id, target.Stage);
                        repaired++;
                    }

                    await _appRepository.UpdateAsync(application, autoSave: true);
                }
            }
        }

        _logger.LogWarning(
            "LIF-02 onarımı: {Repaired} başvurunun yetim aşama adımı sabit aşamasına göre düzeltildi, " +
            "{Cleared} başvurunun adım kimliği temizlendi (programın şablonu yok).",
            repaired, cleared);
    }

    private static bool IsHealthy(
        GrantApplication application,
        HashSet<Guid> liveStepIds,
        Dictionary<Guid, Guid?> templateByCall,
        List<GrantStageTemplateStep> allSteps)
    {
        var stepId = application.CurrentStepId!.Value;
        if (!liveStepIds.Contains(stepId))
        {
            return false; // adım silinmiş
        }

        if (!templateByCall.TryGetValue(application.GrantCallId, out var templateId) || templateId == null)
        {
            return false; // program şablonsuz ama kayıtta adım kimliği duruyor
        }

        return allSteps.Any(s => s.Id == stepId && s.StageTemplateId == templateId.Value);
    }

    /// <summary>
    /// Başvurunun sabit aşamasına karşılık gelen adım: tam eşleşme yoksa aşamayı AŞMAYAN
    /// en ileri adım, o da yoksa ilk adım. Kartı ileri taşımamak önemli — onarım
    /// başvuruyu hiç gelmediği bir aşamada göstermemeli.
    /// </summary>
    private static GrantStageTemplateStep? PickStep(
        IEnumerable<GrantStageTemplateStep> steps, GrantApplicationStage stage)
    {
        var ordered = steps.OrderBy(s => s.Order).ToList();
        if (ordered.Count == 0)
        {
            return null;
        }

        return ordered.LastOrDefault(s => s.Stage == stage)
               ?? ordered.LastOrDefault(s => s.Stage != null && s.Stage < stage)
               ?? ordered[0];
    }
}
