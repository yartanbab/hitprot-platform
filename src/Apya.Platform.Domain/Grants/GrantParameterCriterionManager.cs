using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Programların kurum parametrelerine koyduğu ölçütler: eklemenin tek yolu ve eşleştirme
/// ekranlarının ortak okuma yolu.
/// </summary>
public class GrantParameterCriterionManager : DomainService
{
    private readonly IRepository<GrantParameterCriterion, Guid> _criterionRepository;
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;

    public GrantParameterCriterionManager(
        IRepository<GrantParameterCriterion, Guid> criterionRepository,
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<Grant, Guid> grantRepository,
        IDataFilter<IMultiTenant> tenantFilter)
    {
        _criterionRepository = criterionRepository;
        _definitionRepository = definitionRepository;
        _grantRepository = grantRepository;
        _tenantFilter = tenantFilter;
    }

    /// <summary>Programa ölçüt ekler. Aynı parametre için aynı işleçle ikinci ölçüt açılmaz.</summary>
    public async Task<GrantParameterCriterion> AddAsync(
        Guid grantId,
        Guid definitionId,
        GrantParameterOperator @operator,
        decimal? number,
        string? text,
        bool? flag,
        bool isEliminating)
    {
        await _grantRepository.GetAsync(grantId);
        var definition = await _definitionRepository.GetAsync(definitionId);

        if (await _criterionRepository.AnyAsync(c => c.GrantId == grantId && c.DefinitionId == definitionId && c.Operator == @operator))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantCriterionDuplicate).WithData("Name", definition.Name);
        }

        var criterion = new GrantParameterCriterion(
            GuidGenerator.Create(), grantId, definition, @operator, number, text, flag, isEliminating);
        return await _criterionRepository.InsertAsync(criterion, autoSave: true);
    }

    /// <summary>
    /// Verilen programların ölçütleri. Katalog host verisidir: kiracı süzgeci yalnız host
    /// satırlarına ERİŞMEK için kapatılır ve <c>TenantId == null</c> koşulu elle konur —
    /// kurum bağlamından da güvenle çağrılır.
    /// </summary>
    public async Task<Dictionary<Guid, IReadOnlyList<GrantParameterCriterion>>> ResolveManyAsync(IEnumerable<Guid> grantIds)
    {
        var ids = grantIds.Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, IReadOnlyList<GrantParameterCriterion>>();
        }

        using (_tenantFilter.Disable())
        {
            return (await _criterionRepository.GetListAsync(c => ids.Contains(c.GrantId) && c.TenantId == null))
                .GroupBy(c => c.GrantId)
                .ToDictionary(g => g.Key, g => (IReadOnlyList<GrantParameterCriterion>)g.ToList());
        }
    }

    public async Task<IReadOnlyList<GrantParameterCriterion>> ResolveAsync(Guid grantId)
        => (await ResolveManyAsync(new[] { grantId })).GetValueOrDefault(grantId) ?? Array.Empty<GrantParameterCriterion>();
}
