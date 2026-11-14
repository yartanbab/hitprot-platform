using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurumsal Veriler ekranının servisi: kurumun ELLE girdiği parametreler.
///
/// <para>Değeri platformun başka alanında yaşayan sistem parametreleri (ölçek, ciro, NACE…)
/// burada listelenmez; onlar kendi ekranlarından düzenlenir.</para>
///
/// <para>Okuma her kurum kullanıcısına açık, yazma kurum yöneticisine
/// (<c>TenantSettings</c>) — Kurum Profili ile aynı kural.</para>
/// </summary>
[Authorize]
public class FirmDataAppService : PlatformAppService, IFirmDataAppService
{
    private const string DateFormat = "yyyy-MM-dd";

    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly IRepository<FirmProfile, Guid> _profileRepository;
    private readonly FirmParameterManager _manager;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepository;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly FirmDataGapCalculator _gapCalculator;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;

    public FirmDataAppService(
        IRepository<FirmParameterDefinition, Guid> definitionRepository,
        IRepository<FirmParameterValue, Guid> valueRepository,
        IRepository<FirmProfile, Guid> profileRepository,
        FirmParameterManager manager,
        IRepository<Grant, Guid> grantRepository,
        IRepository<GrantCall, Guid> callRepository,
        IRepository<GrantCriteriaTag, Guid> criteriaRepository,
        FirmSignalsBuilder signalsBuilder,
        FirmDataGapCalculator gapCalculator,
        IDataFilter<IMultiTenant> tenantFilter)
    {
        _grantRepository = grantRepository;
        _callRepository = callRepository;
        _criteriaRepository = criteriaRepository;
        _signalsBuilder = signalsBuilder;
        _gapCalculator = gapCalculator;
        _tenantFilter = tenantFilter;
        _definitionRepository = definitionRepository;
        _valueRepository = valueRepository;
        _profileRepository = profileRepository;
        _manager = manager;
    }

    public async Task<FirmDataDto> GetMineAsync()
    {
        RequireTenant();
        var definitions = await GetEditableDefinitionsAsync();
        var values = (await _valueRepository.GetListAsync()).ToDictionary(v => v.DefinitionId);
        return Build(definitions, values);
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public async Task<FirmDataDto> SaveMineAsync(SaveFirmDataDto input)
    {
        RequireTenant();
        var definitions = await GetEditableDefinitionsAsync();
        var byId = definitions.ToDictionary(d => d.Id);
        var values = (await _valueRepository.GetListAsync()).ToDictionary(v => v.DefinitionId);

        // Önce HEPSİ doğrulanır, sonra yazılır: tek hatalı alan diğerlerini yarım kaydetmesin
        // (işlemsiz bir iş biriminde ilk yazılanlar geri alınmazdı).
        // Listede olmayan (sistem, pasif, başka kurum türüne ait) tanım yok sayılır.
        var parsedItems = input.Items
            .Where(i => byId.ContainsKey(i.DefinitionId))
            .Select(i => (Definition: byId[i.DefinitionId], Input: Parse(byId[i.DefinitionId], i)))
            .ToList();
        foreach (var (definition, parsedInput) in parsedItems)
        {
            if (parsedInput != null)
            {
                _ = new FirmParameterValue(Guid.Empty, CurrentTenant.Id, definition, parsedInput, FirmParameterOrigin.UserEntry, Clock.Now);
            }
        }

        foreach (var (definition, parsed) in parsedItems)
        {
            values.TryGetValue(definition.Id, out var existing);

            if (parsed == null)
            {
                // Boş alan = "bilmiyorum": satır silinir, sıfır YAZILMAZ.
                if (existing != null)
                {
                    await _manager.ClearValueAsync(definition.Id);
                    values.Remove(definition.Id);
                }
                continue;
            }

            // Değişmeyen değer yeniden yazılmaz: yazılsaydı kaynağı "kullanıcı"ya döner
            // (belgeden gelmiş olabilir) ve güncellik saati her kayıtta sıfırlanırdı.
            if (existing != null && SameValue(definition, existing, parsed))
            {
                continue;
            }

            values[definition.Id] = await _manager.SetValueAsync(definition.Id, parsed, FirmParameterOrigin.UserEntry);
        }

        return Build(definitions, values);
    }

    [Authorize(PlatformPermissions.Grants.Default)]
    public async Task<List<FirmDataGapDto>> GetMyGapsAsync()
    {
        RequireTenant();

        var definitions = await _definitionRepository.GetListAsync(d => d.IsActive);
        var values = (await _valueRepository.GetListAsync()).ToDictionary(v => v.DefinitionId);
        var profile = await _profileRepository.FirstOrDefaultAsync();
        var signals = await _signalsBuilder.BuildAsync(CurrentTenant.Id);
        var openCalls = await GetOpenCallsAsync();

        return _gapCalculator.Calculate(definitions, values, profile, signals, openCalls, Clock.Now.Date)
            .Select(g => new FirmDataGapDto
            {
                Code = g.Definition.Code,
                Name = g.Definition.Name,
                Description = g.Definition.Description,
                IsStale = g.IsStale,
                UnlockCount = g.UnlockCount,
                // Sistem parametreleri hibe profilinden, diğerleri Kurumsal Veriler'den girilir.
                Url = g.Definition.IsSystem ? "/Grants#profil" : "/CompanyProfile/Data#firm-data-" + g.Definition.Code
            })
            .ToList();
    }

    /// <summary>
    /// Açık çağrılar ve programları. Katalog host verisidir (TenantId null): kiracı süzgeci
    /// yalnız host satırlarına ERİŞMEK için kapatılır, her sorguya <c>TenantId == null</c>
    /// koşulu elle konur — konmazsa başka kurumların satırları da gelirdi.
    /// </summary>
    private async Task<List<FirmDataOpenCall>> GetOpenCallsAsync()
    {
        using (_tenantFilter.Disable())
        {
            var calls = (await _callRepository.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null))
                .Where(c => c.IsOpenOn(Clock.Now))
                .ToList();
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepository.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);
            var tags = (await _criteriaRepository.GetListAsync(t => grantIds.Contains(t.GrantId) && t.TenantId == null))
                .ToLookup(t => t.GrantId);

            return calls
                .Where(c => grants.ContainsKey(c.GrantId))
                .Select(c => new FirmDataOpenCall(grants[c.GrantId], tags[c.GrantId].ToList()))
                .ToList();
        }
    }

    /// <summary>Kurumun elle doldurabileceği, kendi türüne uyan canlı tanımlar.</summary>
    private async Task<List<FirmParameterDefinition>> GetEditableDefinitionsAsync()
    {
        var profile = await _profileRepository.FirstOrDefaultAsync();
        var definitions = await _definitionRepository.GetListAsync(d => d.IsActive && d.SystemKey == null);
        return definitions
            .Where(d => d.AllowedSources.HasFlag(FirmParameterSource.Kullanici))
            // Türü henüz bilinmeyen kurumdan hiçbir parametre gizlenmez.
            .Where(d => profile == null || d.AppliesTo(profile.Type))
            .OrderBy(d => d.Group)
            .ThenBy(d => d.Order)
            .ThenBy(d => d.Name)
            .ToList();
    }

    private FirmDataDto Build(
        List<FirmParameterDefinition> definitions,
        IReadOnlyDictionary<Guid, FirmParameterValue> values)
    {
        var today = Clock.Now.Date;
        var items = definitions.Select(d => MapItem(d, values.GetValueOrDefault(d.Id), today)).ToList();

        return new FirmDataDto
        {
            Groups = definitions
                .Select(d => d.Group)
                .Distinct()
                .Select(g => new FirmDataGroupDto
                {
                    Group = g,
                    Items = items.Where(i => i.Group == g).Select(i => i.Item).ToList()
                })
                .ToList(),
            FilledCount = items.Count(i => i.Item.HasValue),
            TotalCount = items.Count
        };
    }

    private static (FirmParameterGroup Group, FirmDataItemDto Item) MapItem(
        FirmParameterDefinition definition, FirmParameterValue? value, DateTime today)
    {
        var dto = new FirmDataItemDto
        {
            DefinitionId = definition.Id,
            Code = definition.Code,
            Name = definition.Name,
            Description = definition.Description,
            DataType = definition.DataType,
            Requirement = definition.Requirement,
            Options = definition.GetOptions().ToList(),
            MinNumber = definition.MinNumber,
            MaxNumber = definition.MaxNumber,
            MaxLength = definition.MaxLength
        };

        if (value != null)
        {
            dto.HasValue = true;
            dto.RawValue = Format(definition, value);
            dto.Choices = value.GetChoices(definition).ToList();
            dto.Source = value.Source;
            dto.Verification = value.Verification;
            dto.ConfirmedAt = value.ConfirmedAt;
            dto.IsStale = value.IsStale(definition, today);
            dto.Reliability = value.ReliabilityAt(definition, today);
        }

        return (definition.Group, dto);
    }

    private static string? Format(FirmParameterDefinition definition, FirmParameterValue value) => definition.DataType switch
    {
        FirmParameterDataType.Number or FirmParameterDataType.Money or FirmParameterDataType.Percent
            => value.ValueNumber?.ToString("0.##", CultureInfo.InvariantCulture),
        FirmParameterDataType.Date => value.ValueDate?.ToString(DateFormat, CultureInfo.InvariantCulture),
        FirmParameterDataType.Boolean => value.ValueBool?.ToString().ToLowerInvariant(),
        FirmParameterDataType.MultiSelect => null,
        _ => value.ValueText
    };

    /// <summary>
    /// Gönderilen ham değeri tanımın tipine çevirir. null = alan boş bırakıldı ("bilmiyorum").
    /// Okunamayan değer sessizce boş sayılmaz: kullanıcının yazdığı bilgi kaybolurdu.
    /// </summary>
    private static FirmParameterInput? Parse(FirmParameterDefinition definition, SaveFirmDataItemDto item)
    {
        if (definition.DataType == FirmParameterDataType.MultiSelect)
        {
            var choices = item.Choices.Where(c => !string.IsNullOrWhiteSpace(c)).ToList();
            return choices.Count == 0 ? null : new FirmParameterInput(Choices: choices);
        }

        var raw = item.RawValue?.Trim();
        if (string.IsNullOrEmpty(raw))
        {
            return null;
        }

        switch (definition.DataType)
        {
            case FirmParameterDataType.Number:
            case FirmParameterDataType.Money:
            case FirmParameterDataType.Percent:
                return decimal.TryParse(raw, NumberStyles.Number & ~NumberStyles.AllowThousands, CultureInfo.InvariantCulture, out var number)
                    ? new FirmParameterInput(Number: number)
                    : throw Invalid(definition);
            case FirmParameterDataType.Date:
                return DateTime.TryParseExact(raw, DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
                    ? new FirmParameterInput(Date: date)
                    : throw Invalid(definition);
            case FirmParameterDataType.Boolean:
                return bool.TryParse(raw, out var flag)
                    ? new FirmParameterInput(Bool: flag)
                    : throw Invalid(definition);
            default:
                return new FirmParameterInput(Text: raw);
        }
    }

    private static bool SameValue(FirmParameterDefinition definition, FirmParameterValue existing, FirmParameterInput input)
        => definition.DataType switch
        {
            FirmParameterDataType.Number or FirmParameterDataType.Money or FirmParameterDataType.Percent
                => existing.ValueNumber == input.Number,
            FirmParameterDataType.Date => existing.ValueDate == input.Date?.Date,
            FirmParameterDataType.Boolean => existing.ValueBool == input.Bool,
            FirmParameterDataType.MultiSelect => existing.GetChoices(definition)
                .ToHashSet(StringComparer.Ordinal)
                .SetEquals((input.Choices ?? Array.Empty<string>()).Select(c => c.Trim())),
            _ => existing.ValueText == input.Text?.Trim()
        };

    private static BusinessException Invalid(FirmParameterDefinition definition)
        => new BusinessException(PlatformDomainErrorCodes.FirmParameterValueInvalid).WithData("Name", definition.Name);

    private void RequireTenant()
    {
        if (CurrentTenant.Id == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FirmParameterTenantRequired);
        }
    }
}
