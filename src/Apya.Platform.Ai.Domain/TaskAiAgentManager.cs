using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Domain.Services;
using Apya.Platform.Ai.Drafts;
using Apya.Platform.Ai.Prompts;

namespace Apya.Platform.Ai;

public class TaskAiAgentManager : DomainService
{
    private readonly IAiProvider _aiProvider;
    private readonly IAiResponseValidator _validator;

    private static readonly PromptTemplate Template = new(
        name: "task-extraction",
        version: "v1",
        systemPrompt:
            "Sen, yazılım ve iş dünyası uzmanı kıdemli bir Proje Yöneticisisin.\n" +
            "Sana bir proje yönergesi, toplantı dökümü veya gereksinim listesi içeren bir PDF metni vereceğim.\n" +
            "Görevin, bu metindeki süreçleri analiz edip çalışılabilir görevlere (tasks) bölmektir.\n\n" +
            "KURALLAR:\n" +
            "1. Sonuç KESİNLİKLE VE YALNIZCA JSON array formatında olmalıdır. JSON dışında hiçbir açıklama ekleme!\n" +
            "2. Metinde mantıklı bir görev bulamazsan boş liste '[]' dön.\n" +
            "3. Her bir görev yapısı:\n" +
            "[\n" +
            "  { \"Title\": \"Kısa başlık (Max 200 karakter)\", \"Description\": \"Detaylı tanım\", \"Priority\": 2, \"EstimatedHours\": 4.5 }\n" +
            "]\n" +
            "4. Çıktı dili tamamen Türkçe olmalıdır.",
        userMessageTemplate: "Aşağıdaki doküman metnini analiz et:\n\n{{text}}");

    private const int MaxRepairAttempts = 1;

    public TaskAiAgentManager(IAiProvider aiProvider, IAiResponseValidator validator)
    {
        _aiProvider = aiProvider;
        _validator = validator;
    }

    public async Task<List<DraftTaskResult>> ExtractTasksFromTextAsync(string text)
    {
        try
        {
            var userMessage = Template.RenderUserMessage(new Dictionary<string, string> { ["text"] = text });

            var response = await _aiProvider.CompleteAsync(Template.SystemPrompt, userMessage);
            var validation = _validator.Validate(response);

            // Repair pipeline: if invalid, retry once with corrective hint
            for (var attempt = 0; !validation.IsValid && attempt < MaxRepairAttempts; attempt++)
            {
                Logger.LogWarning("AI response validation failed (attempt {Attempt}). Errors: {Errors}",
                    attempt + 1, string.Join("; ", validation.Errors));

                var repairMessage = userMessage + "\n\nDÜZELTME: " + (validation.RepairHint ?? "Yanıtın geçerli JSON array değildi.");
                response = await _aiProvider.CompleteAsync(Template.SystemPrompt, repairMessage);
                validation = _validator.Validate(response);
            }

            if (!validation.IsValid)
            {
                Logger.LogError("AI response failed validation after {Max} repair attempts. Errors: {Errors}",
                    MaxRepairAttempts, string.Join("; ", validation.Errors));
                return new List<DraftTaskResult>();
            }

            // Strip fences if present (validator already handles this internally; we re-strip for parsing)
            var jsonContent = response.Trim();
            if (jsonContent.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                jsonContent = jsonContent.Substring(7);
                if (jsonContent.EndsWith("```"))
                    jsonContent = jsonContent.Substring(0, jsonContent.Length - 3);
                jsonContent = jsonContent.Trim();
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tasks = JsonSerializer.Deserialize<List<DraftTaskResult>>(jsonContent, options);
            return tasks ?? new List<DraftTaskResult>();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "AI provider ile iletişim sırasında hata oluştu.");
            return new List<DraftTaskResult>();
        }
    }
}
