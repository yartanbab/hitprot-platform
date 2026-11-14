using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir programa "şu kurum parametresi şunu sağlamalı" ölçütü ekler. Katalog host verisidir —
/// yalnız host bağlamında çalışır. Bir parametre, burada bir programa bağlanana kadar hiçbir
/// kurumun uygunluğunu etkilemez.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantParameterCriterionAppService : PlatformAppService, IGrantParameterCriterionAppService
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantParameterCriterion, Guid> _criterionRepository;
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly GrantParameterCriterionManager _manager;

    public GrantParameterCriterionAppService(
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantParameterCriterion, Guid> criterionRepository,
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        GrantParameterCriterionManager manager)
    {
        _grantRepository = grantRepository;
        _criterionRepository = criterionRepository;
        _definitionRepository = definitionRepository;
        _manager = manager;
    }

    public async Task<GrantParameterCriteriaDto> GetAsync(Guid grantId)
    {
        EnsureHost();
        var grant = await _grantRepository.GetAsync(grantId);
        var definitions = await _definitionRepository.GetListAsync(d => d.SystemKey == null);
        var byId = definitions.ToDictionary(d => d.Id);
        var criteria = await _criterionRepository.GetListAsync(c => c.GrantId == grantId);
        var c = CultureInfo.InvariantCulture;

        return new GrantParameterCriteriaDto
        {
            GrantId = grant.Id,
            GrantName = grant.Name,
            CoFinancingRatePercent = grant.SupportRatePercent is < 100 ? 100 - grant.SupportRatePercent : null,
            Criteria = criteria
                .Where(x => byId.ContainsKey(x.DefinitionId))
                .OrderBy(x => byId[x.DefinitionId].Name)
                .Select(x => new GrantParameterCriterionDto
                {
                    Id = x.Id,
                    DefinitionId = x.DefinitionId,
                    ParameterName = byId[x.DefinitionId].Name,
                    DataType = byId[x.DefinitionId].DataType,
                    Operator = x.Operator,
                    Value = x.ValueNumber?.ToString("0.##", c) ?? x.ValueBool?.ToString().ToLowerInvariant() ?? x.ValueText ?? string.Empty,
                    IsEliminating = x.IsEliminating
                })
                .ToList(),
            Parameters = definitions
                .Where(d => d.IsActive && SupportsCriterion(d.DataType))
                .OrderBy(d => d.Group).ThenBy(d => d.Order).ThenBy(d => d.Name)
                .Select(d => new GrantCriterionParameterDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    DataType = d.DataType,
                    Options = d.GetOptions().ToList()
                })
                .ToList()
        };
    }

    public async Task<GrantParameterCriteriaDto> AddAsync(AddGrantParameterCriterionDto input)
    {
        EnsureHost();
        var definition = await _definitionRepository.GetAsync(input.DefinitionId);
        var raw = input.Value?.Trim();

        decimal? number = null;
        bool? flag = null;
        string? text = null;
        switch (definition.DataType)
        {
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
            case FirmParameterDataType.Percent:
                if (decimal.TryParse(raw, NumberStyles.Number & ~NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out var parsed))
                {
                    number = parsed;
                }
                break;
            case FirmParameterDataType.Boolean:
                if (bool.TryParse(raw, out var parsedFlag))
                {
                    flag = parsedFlag;
                }
                break;
            default:
                text = raw;
                break;
        }

        await _manager.AddAsync(input.GrantId, input.DefinitionId, input.Operator, number, text, flag, input.IsEliminating);
        return await GetAsync(input.GrantId);
    }

    public async Task DeleteAsync(Guid id)
    {
        EnsureHost();
        await _criterionRepository.DeleteAsync(id, autoSave: true);
    }

    private static bool SupportsCriterion(FirmParameterDataType type) => type is
        FirmParameterDataType.Number or FirmParameterDataType.Money or FirmParameterDataType.Percent
        or FirmParameterDataType.Boolean or FirmParameterDataType.Select or FirmParameterDataType.MultiSelect;

    private void EnsureHost()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Program ölçütleri yalnızca host bağlamında yönetilebilir.");
        }
    }
}
