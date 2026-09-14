using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Grants;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Resolves the live options of a dropdown bound to a <see cref="FormChoiceSources"/> source. Used when
/// the public form is rendered (options shown), when a response is submitted (answer validated against
/// the CURRENT list) and by the builder's live preview.
/// </summary>
public class FormChoiceProvider : ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;

    public FormChoiceProvider(
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IDataFilter<IMultiTenant> multiTenantFilter)
    {
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _multiTenantFilter = multiTenantFilter;
    }

    /// <summary>Options of the source, or <c>null</c> when the source is unknown or empty (fixed options).</summary>
    public async Task<List<FormChoiceDto>?> GetChoicesAsync(string? source)
    {
        if (source != FormChoiceSources.OpenGrantCalls)
        {
            return null;
        }

        List<GrantCall> calls;
        Dictionary<Guid, Grant> grants;
        // Katalog host'undur; form kiracıda ya da anonim açılabilir. Süzgeç kapatılınca kapsam TÜM
        // kiracılara genişler, bu yüzden TenantId == null elle konur.
        using (_multiTenantFilter.Disable())
        {
            calls = await _callRepository.GetListAsync(c => c.TenantId == null && c.Status == GrantCallStatus.Acik);
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            grants = (await _grantRepository.GetListAsync(g => g.TenantId == null && grantIds.Contains(g.Id)))
                .ToDictionary(g => g.Id);
        }

        return calls
            .Where(c => grants.ContainsKey(c.GrantId))
            .Select(c => new FormChoiceDto { Value = c.Id.ToString(), Label = LabelOf(grants[c.GrantId], c) })
            .OrderBy(c => c.Label, StringComparer.Create(Turkish, ignoreCase: true))
            .ToList();
    }

    /// <summary>The block's <c>source</c> setting; only dropdowns can be bound to a live list.</summary>
    public static string? SourceOf(BlockType type, string? settingsJson)
    {
        if (type != BlockType.Dropdown || string.IsNullOrWhiteSpace(settingsJson))
        {
            return null;
        }

        try
        {
            using var settings = JsonDocument.Parse(settingsJson);
            return settings.RootElement.ValueKind == JsonValueKind.Object
                   && settings.RootElement.TryGetProperty("source", out var source)
                   && source.ValueKind == JsonValueKind.String
                ? source.GetString()
                : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static string LabelOf(Grant grant, GrantCall call) => $"{grant.Issuer} · {grant.Name} ({call.Period})";
}
