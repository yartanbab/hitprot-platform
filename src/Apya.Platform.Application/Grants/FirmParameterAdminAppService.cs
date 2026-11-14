using System;
using System.Collections.Generic;
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
/// Kurum parametre kataloğunun yönetimi: yeni parametre kod değişikliği olmadan buradan eklenir.
/// Katalog host verisidir — yalnız host bağlamında çalışır (<c>Grants.Edit</c> zaten host'a özgü).
///
/// <para>Sistem parametreleri (değeri platformun kendi alanında yaşayanlar) motorun kodda okuduğu
/// alanlardır: adı, açıklaması, zorunluluğu, geçerlilik süresi ve sırası değişir; tipi,
/// eşleştirmedeki rolü ve etkinliği buradan DEĞİŞMEZ, tanım silinmez.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class FirmParameterAdminAppService : PlatformAppService, IFirmParameterAdminAppService
{
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly FirmParameterManager _manager;

    public FirmParameterAdminAppService(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        FirmParameterManager manager)
    {
        _definitionRepository = definitionRepository;
        _manager = manager;
    }

    public async Task<List<FirmParameterDefinitionDto>> GetListAsync()
    {
        EnsureHost();
        var definitions = (await _definitionRepository.GetListAsync())
            .OrderBy(d => d.Group)
            .ThenBy(d => d.Order)
            .ThenBy(d => d.Name)
            .ToList();

        var result = new List<FirmParameterDefinitionDto>();
        foreach (var definition in definitions)
        {
            result.Add(await MapAsync(definition));
        }
        return result;
    }

    public async Task<FirmParameterDefinitionDto> GetAsync(Guid id)
    {
        EnsureHost();
        return await MapAsync(await _definitionRepository.GetAsync(id));
    }

    public async Task<FirmParameterDefinitionDto> CreateAsync(SaveFirmParameterDefinitionDto input)
    {
        EnsureHost();
        EnsureInputValid(input);
        var definition = new FirmParameterDefinition(
            GuidGenerator.Create(), input.Code ?? string.Empty, input.Name, input.DataType, input.Group);
        Apply(definition, input);
        return await MapAsync(await _manager.CreateDefinitionAsync(definition));
    }

    public async Task<FirmParameterDefinitionDto> UpdateAsync(Guid id, SaveFirmParameterDefinitionDto input)
    {
        EnsureHost();
        EnsureInputValid(input);
        var definition = await _definitionRepository.GetAsync(id);

        if (definition.IsSystem)
        {
            // Kodda yaşayan özellik değiştirilmek istendiyse sessizce yok sayılmaz: host
            // kaydettiğini sanıp sonuç göremezdi.
            if (input.MatchUsage != definition.MatchUsage || !input.IsActive)
            {
                throw new BusinessException(PlatformDomainErrorCodes.FirmParameterSystemLocked).WithData("Name", definition.Name);
            }
            definition.SetText(input.Name, input.Description);
            definition.Requirement = input.Requirement;
            definition.Order = input.Order;
            definition.SetValidity(input.ValidityMonths);
        }
        else
        {
            Apply(definition, input);
        }

        await _definitionRepository.UpdateAsync(definition, autoSave: true);
        return await MapAsync(definition);
    }

    public async Task DeleteAsync(Guid id)
    {
        EnsureHost();
        await _manager.DeleteDefinitionAsync(id);
    }

    /// <summary>Kullanıcının girdiği parametrenin değiştirilebilir bütün özellikleri (kod ve tip hariç).</summary>
    private static void Apply(FirmParameterDefinition definition, SaveFirmParameterDefinitionDto input)
    {
        definition.SetText(input.Name, input.Description);
        definition.Group = input.Group;
        definition.Requirement = input.Requirement;
        definition.Audience = input.Audience;
        definition.AllowedSources = input.AllowDocumentSource
            ? FirmParameterSource.Kullanici | FirmParameterSource.BelgeAi
            : FirmParameterSource.Kullanici;
        definition.IsActive = input.IsActive;
        definition.Order = input.Order;
        definition.SetValidity(input.ValidityMonths);

        var isNumber = definition.DataType is FirmParameterDataType.Number or FirmParameterDataType.Money or FirmParameterDataType.Percent;
        definition.SetNumberRange(isNumber ? input.MinNumber : null, isNumber ? input.MaxNumber : null);

        var isText = definition.DataType is FirmParameterDataType.Text or FirmParameterDataType.LongText;
        definition.SetMaxLength(isText ? input.MaxLength : null);

        if (definition.DataType is FirmParameterDataType.Select or FirmParameterDataType.MultiSelect)
        {
            definition.SetOptions((input.OptionsText ?? string.Empty).Split('\n').Select(o => o.Trim('\r', ' ', '\t')));
        }

        definition.SetMatchUsage(input.MatchUsage);
    }

    private async Task<FirmParameterDefinitionDto> MapAsync(FirmParameterDefinition d) => new()
    {
        Id = d.Id,
        Code = d.Code,
        Name = d.Name,
        Description = d.Description,
        DataType = d.DataType,
        Group = d.Group,
        Requirement = d.Requirement,
        Audience = d.Audience,
        AllowDocumentSource = d.AllowedSources.HasFlag(FirmParameterSource.BelgeAi),
        ValidityMonths = d.ValidityMonths,
        MinNumber = d.MinNumber,
        MaxNumber = d.MaxNumber,
        MaxLength = d.MaxLength,
        Options = d.GetOptions().ToList(),
        MatchUsage = d.MatchUsage,
        Version = d.Version,
        IsActive = d.IsActive,
        Order = d.Order,
        IsSystem = d.IsSystem,
        ValueOwnerCount = d.IsSystem ? 0 : await _manager.CountValueOwnersAsync(d.Id)
    };

    /// <summary>Alan kuralları varlığa yazılmadan önce denetlenir; aksi halde ham bağımsız değişken hatası 500 olarak dönerdi.</summary>
    private static void EnsureInputValid(SaveFirmParameterDefinitionDto input)
    {
        if (string.IsNullOrWhiteSpace(input.Name) || input.Name.Trim().Length > FirmParameterConsts.MaxNameLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterNameRequired);
        }
        if (input.ValidityMonths is <= 0 || input.MaxLength is <= 0 or > FirmParameterConsts.MaxLongTextLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterLimitInvalid);
        }
        if (input.Description?.Trim().Length > FirmParameterConsts.MaxDescriptionLength)
        {
            input.Description = input.Description.Trim()[..FirmParameterConsts.MaxDescriptionLength];
        }
    }

    private void EnsureHost()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Kurum parametreleri yalnızca host bağlamında yönetilebilir.");
        }
    }
}
