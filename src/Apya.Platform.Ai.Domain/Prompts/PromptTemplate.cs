using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp;

namespace Apya.Platform.Ai.Prompts;

public class PromptTemplate
{
    public string Name { get; }
    public string Version { get; }
    public string SystemPrompt { get; }
    public string UserMessageTemplate { get; }

    public PromptTemplate(string name, string version, string systemPrompt, string userMessageTemplate)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name));
        Version = Check.NotNullOrWhiteSpace(version, nameof(version));
        SystemPrompt = systemPrompt ?? string.Empty;
        UserMessageTemplate = userMessageTemplate ?? string.Empty;
    }

    /// <summary>
    /// Substitutes {{key}} placeholders in UserMessageTemplate with values.
    /// Missing keys are left unchanged (no exception — fail-soft).
    /// </summary>
    public string RenderUserMessage(IDictionary<string, string> variables)
    {
        if (variables == null || variables.Count == 0)
            return UserMessageTemplate;

        var sb = new StringBuilder(UserMessageTemplate);
        foreach (var (key, value) in variables)
        {
            sb.Replace("{{" + key + "}}", value ?? string.Empty);
        }
        return sb.ToString();
    }

    public string FullName => $"{Name}@{Version}";
}
