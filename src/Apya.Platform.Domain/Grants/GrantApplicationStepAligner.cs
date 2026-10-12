using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 🔴 DOM-01 (ters yön): sabit aşama doğrudan yazıldığında şablon adımını ona hizalar.
///
/// <para>Adım taşıma aşamayı yazıyordu (<see cref="GrantApplication.MoveToStep"/>), tersi
/// yoktu: onay kararı, "Aşama İlerlet" penceresi ve tüm-çağrılar panosu yalnız
/// <see cref="GrantApplication.Stage"/>'i yazıyor, şablonlu başvurunun
/// <see cref="GrantApplication.CurrentStepId"/>'si eski adımda kalıyordu — program
/// panosunda kart geride duruyor, firma ise ilerlemiş aşamayı görüyordu.</para>
///
/// <para>Kural: başvurunun adımı zaten o aşamaya eşliyse dokunulmaz (aynı aşamanın
/// ayrıntısı korunur). Değilse o aşamaya eşlenen İLK adıma (sıraya göre) alınır — aşamaya
/// yeni girilmiştir. Aşamaya eşlenen adım yoksa ya da başvuru şablonsuzsa hiçbir şey
/// yapılmaz.</para>
/// </summary>
public class GrantApplicationStepAligner : DomainService
{
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantApplicationStepAligner(
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantStageTemplateStep, Guid> stepRepository,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _stepRepository = stepRepository;
        _mtFilter = mtFilter;
    }

    /// <summary>Adım değiştiyse true. Kaydı ÇAĞIRAN günceller.</summary>
    public async Task<bool> AlignToStageAsync(GrantApplication application)
    {
        if (!application.CurrentStepId.HasValue)
        {
            return false;
        }

        // Çağrı, program ve şablon host kataloğudur; başvuru kiracı bağlamında da
        // işlenebildiği için okuma filtresi bilinçli kapatılır.
        using (_mtFilter.Disable())
        {
            var call = await _callRepository.FirstOrDefaultAsync(c => c.Id == application.GrantCallId);
            if (call == null)
            {
                return false;
            }

            var grant = await _grantRepository.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null);
            if (grant?.StageTemplateId == null)
            {
                return false;
            }

            var steps = (await _stepRepository.GetListAsync(
                    s => s.StageTemplateId == grant.StageTemplateId.Value && s.TenantId == null))
                .OrderBy(s => s.Order)
                .ToList();

            var current = steps.FirstOrDefault(s => s.Id == application.CurrentStepId.Value);
            if (current?.Stage == application.Stage)
            {
                return false;
            }

            var target = steps.FirstOrDefault(s => s.Stage == application.Stage);
            if (target == null)
            {
                return false;
            }

            application.MoveToStep(target.Id);
            return true;
        }
    }
}
