using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets.Dtos;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// 17 · Koşullu alan: bir alan yalnız başka bir alanın cevabına (ya da o cevapta SEÇİLEN KAYDIN
/// özelliğine) göre görünür. Kural alan ayarındaki <c>visibleWhen</c> nesnesidir.
///
/// <para>Aynı hesap istemcide de yapılır (ekranda gizlemek için); buradaki sunucu tarafı ise KARAR
/// mercii: gizli alanın zorunluluğu aranmaz, gizli alana gelen cevap da yazılmaz — istemci gizli
/// alanı doldurup gönderse bile.</para>
///
/// <para>Kural her zaman YUKARIDAKİ bir alanı gösterir (düzenleyici başkasını seçtirmez), bu yüzden
/// tek geçiş yeter: sıraya göre yürünür, üst alan gizliyse ona bağlı alan da gizlenir.</para>
/// </summary>
public class FormConditionEvaluator : ITransientDependency
{
    private readonly FormChoiceProvider _choiceProvider;

    public FormConditionEvaluator(FormChoiceProvider choiceProvider)
    {
        _choiceProvider = choiceProvider;
    }

    public async Task<HashSet<Guid>> GetHiddenBlocksAsync(
        AppDocument document,
        IReadOnlyDictionary<Guid, JsonElement> answers)
    {
        var hidden = new HashSet<Guid>();
        var choiceCache = new Dictionary<string, List<FormChoiceDto>>();

        foreach (var block in document.Blocks.OrderBy(b => b.Order))
        {
            var rule = FormVisibilityRule.Parse(block.Settings);
            if (rule == null)
            {
                continue;
            }

            if (hidden.Contains(rule.BlockId))
            {
                hidden.Add(block.Id);
                continue;
            }

            var values = AnswerValues(answers.TryGetValue(rule.BlockId, out var answer) ? answer : default);
            if (!await IsSatisfiedAsync(rule, values, document, choiceCache))
            {
                hidden.Add(block.Id);
            }
        }

        return hidden;
    }

    private async Task<bool> IsSatisfiedAsync(
        FormVisibilityRule rule,
        List<string> values,
        AppDocument document,
        Dictionary<string, List<FormChoiceDto>> choiceCache)
    {
        switch (rule.Operator)
        {
            case FormConditionOperators.Answered:
                return values.Count > 0;

            case FormConditionOperators.Equals:
                return Matches(values, rule.Value);

            case FormConditionOperators.NotEquals:
                return !Matches(values, rule.Value);

            case FormConditionOperators.Flag:
                return await HasFlagAsync(rule, values, document, choiceCache);

            // Tanınmayan karşılaştırma alanı GİZLEMEZ: eski bir sürümün yazdığı kural yüzünden
            // form yarı yarıya kaybolmasın.
            default:
                return true;
        }
    }

    /// <summary>Üst alanda seçilen kaydın (ör. çağrının) kendi özelliği açık mı.</summary>
    private async Task<bool> HasFlagAsync(
        FormVisibilityRule rule,
        List<string> values,
        AppDocument document,
        Dictionary<string, List<FormChoiceDto>> choiceCache)
    {
        var selected = values.FirstOrDefault();
        var parent = document.Blocks.FirstOrDefault(b => b.Id == rule.BlockId);
        var source = parent == null ? null : FormChoiceProvider.SourceOf(parent.Type, parent.Settings);
        if (selected == null || source == null || rule.Value == null)
        {
            return false;
        }

        if (!choiceCache.TryGetValue(source, out var choices))
        {
            choices = await _choiceProvider.GetChoicesAsync(source) ?? new List<FormChoiceDto>();
            choiceCache[source] = choices;
        }

        var choice = choices.FirstOrDefault(c => string.Equals(c.Value, selected, StringComparison.OrdinalIgnoreCase));
        return choice?.Flags != null && choice.Flags.TryGetValue(rule.Value, out var on) && on;
    }

    private static bool Matches(List<string> values, string? expected)
        => expected != null && values.Any(v => string.Equals(v, expected, StringComparison.OrdinalIgnoreCase));

    /// <summary>
    /// Cevabın karşılaştırılabilir değerleri. Canlı listede cevap <c>{ value, label }</c>, çoklu seçimde
    /// dizi, diğerlerinde düz değerdir; boş metin cevap SAYILMAZ.
    /// </summary>
    private static List<string> AnswerValues(JsonElement answer)
    {
        var values = new List<string>();
        switch (answer.ValueKind)
        {
            case JsonValueKind.Object:
                if (answer.TryGetProperty("value", out var inner))
                {
                    values.AddRange(AnswerValues(inner));
                }

                break;

            case JsonValueKind.Array:
                foreach (var item in answer.EnumerateArray())
                {
                    values.AddRange(AnswerValues(item));
                }

                break;

            case JsonValueKind.String:
                var text = answer.GetString();
                if (!string.IsNullOrWhiteSpace(text))
                {
                    values.Add(text);
                }

                break;

            case JsonValueKind.Number:
                values.Add(answer.GetRawText());
                break;

            case JsonValueKind.True:
            case JsonValueKind.False:
                values.Add(answer.GetRawText());
                break;
        }

        return values;
    }
}

/// <summary>Alan ayarındaki <c>visibleWhen</c> nesnesi; okunamayan kural YOK sayılır (alan görünür).</summary>
public record FormVisibilityRule(Guid BlockId, string Operator, string? Value)
{
    public static FormVisibilityRule? Parse(string? settingsJson)
    {
        if (string.IsNullOrWhiteSpace(settingsJson))
        {
            return null;
        }

        try
        {
            using var settings = JsonDocument.Parse(settingsJson);
            if (settings.RootElement.ValueKind != JsonValueKind.Object
                || !settings.RootElement.TryGetProperty(FormChoiceSources.VisibleWhenSetting, out var rule)
                || rule.ValueKind != JsonValueKind.Object
                || !rule.TryGetProperty("blockId", out var blockId)
                || !Guid.TryParse(blockId.GetString(), out var parsedBlockId))
            {
                return null;
            }

            var op = rule.TryGetProperty("op", out var opValue) ? opValue.GetString() : null;
            var value = rule.TryGetProperty("value", out var expected) && expected.ValueKind == JsonValueKind.String
                ? expected.GetString()
                : null;

            return string.IsNullOrWhiteSpace(op) ? null : new FormVisibilityRule(parsedBlockId, op, value);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
