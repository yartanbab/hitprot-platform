using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurum verisinin önceliklendirilmesi ve hibe profili yüzdesi için açık çağrılar, programları,
/// etiketleri ve parametre ölçütleri. İkisi aynı kaynaktan okur; çelişmezler.
/// </summary>
public class FirmDataOpenCallReader : ITransientDependency
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;
    private readonly GrantParameterCriterionManager _parameterCriteria;
    private readonly IClock _clock;

    public FirmDataOpenCallReader(
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository,
        IDataFilter<IMultiTenant> tenantFilter,
        GrantParameterCriterionManager parameterCriteria,
        IClock clock)
    {
        _grantRepository = grantRepository;
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
        _tenantFilter = tenantFilter;
        _parameterCriteria = parameterCriteria;
        _clock = clock;
    }

    /// <summary>
    /// Katalog host verisidir (TenantId null): kiracı süzgeci yalnız host satırlarına ERİŞMEK için
    /// kapatılır, her sorguya <c>TenantId == null</c> koşulu elle konur — konmazsa başka
    /// kurumların satırları da gelirdi.
    /// </summary>
    public async Task<List<FirmDataOpenCall>> ReadAsync()
    {
        using (_tenantFilter.Disable())
        {
            var calls = (await _callRepository.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null))
                .Where(c => c.IsOpenOn(_clock.Now))
                .ToList();
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepository.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);
            var tags = (await _criteriaRepository.GetListAsync(t => grantIds.Contains(t.GrantId) && t.TenantId == null))
                .ToLookup(t => t.GrantId);

            var criteria = await _parameterCriteria.ResolveManyAsync(grantIds);

            return calls
                .Where(c => grants.ContainsKey(c.GrantId))
                .Select(c => new FirmDataOpenCall(grants[c.GrantId], tags[c.GrantId].ToList(), criteria.GetValueOrDefault(c.GrantId)))
                .ToList();
        }
    }
}

/// <summary>Hibe profili yüzdesinin TEK hesabı (kurum ekranı ve host'un aday dönüştürmesi).</summary>
public class FirmProfileCompletenessReader : ITransientDependency
{
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly FirmDataOpenCallReader _openCalls;
    private readonly FirmDataGapCalculator _calculator;
    private readonly IClock _clock;

    public FirmProfileCompletenessReader(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        FirmDataOpenCallReader openCalls,
        FirmDataGapCalculator calculator,
        IClock clock)
    {
        _definitionRepository = definitionRepository;
        _openCalls = openCalls;
        _calculator = calculator;
        _clock = clock;
    }

    public async Task<FirmProfileCompleteness> CalculateAsync(
        FirmProfile? profile, IEnumerable<GrantCriteriaKind> tagKinds, OrganizationType organizationType)
        => _calculator.CalculateProfileCompleteness(
            await _definitionRepository.GetListAsync(d => d.IsActive),
            profile,
            tagKinds.ToHashSet(),
            organizationType,
            await _openCalls.ReadAsync(),
            _clock.Now.Date);
}
