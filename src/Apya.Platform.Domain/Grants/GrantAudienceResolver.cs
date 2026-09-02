using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · "Bu hibeye uygunluk eşiğini geçen firmalar kimler?" sorusunun tek cevabı.
///
/// <para>Çağrı yayına alındığında bildirim TÜM kiracılara gitmez — tasarımın kuralı
/// "sadece uygunluk eşiğini geçenlere". Eşiği geçmeyen firmaya duyuru göndermek,
/// 1d'de bilerek kurulan "uygun / tüm çağrılar" ayrımını da bozardı.</para>
///
/// <para>Skorlama 1c'deki öneri ekranıyla AYNI yoldan geçer (<see cref="GrantMatchManager"/>
/// + kayıtlı ağırlıklar); iki yüzeyin farklı sayı üretmesi host için açıklanamaz olurdu.</para>
/// </summary>
public class GrantAudienceResolver : DomainService
{
    /// <summary>Yayın duyurusunun alt eşiği. 1c'nin varsayılan süzgeciyle aynı.</summary>
    public const int DefaultMinScore = 60;

    private readonly ITenantRepository _tenantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly IClock _clock;

    public GrantAudienceResolver(
        ITenantRepository tenantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        IClock clock)
    {
        _tenantRepo = tenantRepo;
        _criteriaRepo = criteriaRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _clock = clock;
    }

    /// <summary>Eşiği geçen kiracıların kimlik ve adları.</summary>
    public async Task<IReadOnlyList<(Guid TenantId, string Name)>> ResolveAsync(
        Grant grant, int minScore = DefaultMinScore)
    {
        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id);
        var weights = await _weightResolver.ResolveAsync(grant.Id);
        var today = _clock.Now.Date;

        var result = new List<(Guid, string)>();

        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            var signals = await _signalsBuilder.BuildAsync(tenant.Id);

            // Uygunluk şartını AÇIKÇA ihlal eden firma, skoru yüksek olsa bile
            // duyuru almaz: "size uygun" diyip başvuramayacağı çağrıyı göstermek
            // 1e'deki şart listesiyle çelişir.
            var eligibility = _matcher.Evaluate(signals, grant, today);
            if (eligibility.Bucket == GrantEligibilityBucket.UygunDegil)
            {
                continue;
            }

            if (_matcher.Explain(signals, grant, tags, weights).Total < minScore)
            {
                continue;
            }

            result.Add((tenant.Id, tenant.Name));
        }

        return result;
    }
}
