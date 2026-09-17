using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.ChoiceSources;
using Apya.Platform.DynamicAssets.Dtos;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// 16 · Canlı listeye bağlı açılır listenin seçeneklerini çözen kayıt defteri. Form açılırken (seçenekler
/// gösterilir), yanıt gönderilirken (cevap GÜNCEL listeye karşı doğrulanır) ve düzenleyicinin önizlemesinde
/// aynı yol kullanılır.
///
/// <para>Kaynaklar <see cref="IFormChoiceSource"/> uygulamalarıdır; buraya kaynak adı GÖMÜLMEZ, yeni kaynak
/// eklemek yalnız yeni bir sınıf yazmaktır.</para>
/// </summary>
public class FormChoiceProvider : ITransientDependency
{
    private readonly Dictionary<string, IFormChoiceSource> _sources;

    public FormChoiceProvider(IEnumerable<IFormChoiceSource> sources)
    {
        _sources = sources.ToDictionary(s => s.Key);
    }

    /// <summary>Katalog: kaynaklar, kapsamları ve zincir bağları.</summary>
    public IReadOnlyCollection<IFormChoiceSource> Sources => _sources.Values;

    public IFormChoiceSource? Find(string? source)
        => source != null && _sources.TryGetValue(source, out var found) ? found : null;

    /// <summary>
    /// Kaynağın seçenekleri, kaynak tanınmıyorsa (sabit seçenekli alan) <c>null</c>.
    /// <paramref name="parentValue"/> zincirli kaynakta üst alanda seçilen kaydın kimliğidir.
    /// </summary>
    public async Task<List<FormChoiceDto>?> GetChoicesAsync(string? source, string? parentValue = null)
    {
        var found = Find(source);
        return found == null ? null : await found.GetAsync(parentValue);
    }

    /// <summary>The block's <c>source</c> setting; only dropdowns can be bound to a live list.</summary>
    public static string? SourceOf(BlockType type, string? settingsJson)
        => type != BlockType.Dropdown ? null : StringSetting(settingsJson, "source");

    /// <summary>Zincirli alanın üst alanı (blok kimliği); bağımsız alanda null.</summary>
    public static Guid? DependsOnBlockOf(BlockType type, string? settingsJson)
        => type == BlockType.Dropdown
           && Guid.TryParse(StringSetting(settingsJson, FormChoiceSources.DependsOnSetting), out var blockId)
            ? blockId
            : null;

    private static string? StringSetting(string? settingsJson, string name)
    {
        if (string.IsNullOrWhiteSpace(settingsJson))
        {
            return null;
        }

        try
        {
            using var settings = JsonDocument.Parse(settingsJson);
            return settings.RootElement.ValueKind == JsonValueKind.Object
                   && settings.RootElement.TryGetProperty(name, out var value)
                   && value.ValueKind == JsonValueKind.String
                ? value.GetString()
                : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
