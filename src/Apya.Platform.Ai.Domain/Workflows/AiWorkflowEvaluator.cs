using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Ai.Workflows;

public class AiWorkflowEvaluator : IAiWorkflowEvaluator, ITransientDependency
{
    public IReadOnlyList<WorkflowActionMatch> Evaluate(string resultJson, IEnumerable<AiWorkflowRule> rules)
    {
        var matches = new List<WorkflowActionMatch>();
        if (string.IsNullOrWhiteSpace(resultJson))
            return matches;

        JsonDocument doc;
        try
        {
            doc = JsonDocument.Parse(resultJson);
        }
        catch (JsonException)
        {
            return matches;
        }

        using (doc)
        {
            if (doc.RootElement.ValueKind != JsonValueKind.Object)
                return matches;

            foreach (var rule in rules.OrderBy(r => r.Order))
            {
                if (Matches(doc.RootElement, rule))
                    matches.Add(new WorkflowActionMatch(rule.ActionType, rule.ActionPayload));
            }
        }

        return matches;
    }

    private static bool Matches(JsonElement root, AiWorkflowRule rule)
    {
        var name = rule.JsonPath.TrimStart('$', '.');
        var element = FindProperty(root, name);
        if (element is null)
            return false;

        var el = element.Value;
        var compare = rule.CompareValue ?? string.Empty;

        var elementIsNumber = el.ValueKind == JsonValueKind.Number && el.TryGetDouble(out _);
        double elementNumber = elementIsNumber ? el.GetDouble() : 0;
        var compareIsNumber = double.TryParse(compare, NumberStyles.Any, CultureInfo.InvariantCulture, out var compareNumber);
        var bothNumeric = elementIsNumber && compareIsNumber;

        var elementText = el.ValueKind == JsonValueKind.String ? (el.GetString() ?? string.Empty) : el.ToString();

        return rule.Operator switch
        {
            RuleOperator.GreaterThan => bothNumeric && elementNumber > compareNumber,
            RuleOperator.GreaterOrEqual => bothNumeric && elementNumber >= compareNumber,
            RuleOperator.LessThan => bothNumeric && elementNumber < compareNumber,
            RuleOperator.LessOrEqual => bothNumeric && elementNumber <= compareNumber,
            RuleOperator.Equal => bothNumeric
                ? elementNumber.Equals(compareNumber)
                : string.Equals(elementText, compare, StringComparison.OrdinalIgnoreCase),
            RuleOperator.NotEqual => bothNumeric
                ? !elementNumber.Equals(compareNumber)
                : !string.Equals(elementText, compare, StringComparison.OrdinalIgnoreCase),
            RuleOperator.Contains => elementText.Contains(compare, StringComparison.OrdinalIgnoreCase),
            RuleOperator.NotContains => !elementText.Contains(compare, StringComparison.OrdinalIgnoreCase),
            _ => false
        };
    }

    private static JsonElement? FindProperty(JsonElement obj, string name)
    {
        foreach (var p in obj.EnumerateObject())
            if (string.Equals(p.Name, name, StringComparison.OrdinalIgnoreCase))
                return p.Value;
        return null;
    }
}
