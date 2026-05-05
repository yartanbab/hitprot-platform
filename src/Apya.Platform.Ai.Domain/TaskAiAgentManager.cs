using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Domain.Services;
using Apya.Platform.Ai.Drafts;

namespace Apya.Platform.Ai;

public class TaskAiAgentManager : DomainService
{
    private readonly IAiProvider _aiProvider;

    private const string SystemPrompt =
        "Sen, yazılım ve iş dünyası uzmanı kıdemli bir Proje Yöneticisisin.\n" +
        "Sana bir proje yönergesi, toplantı dökümü veya gereksinim listesi içeren bir PDF metni vereceğim.\n" +
        "Görevin, bu metindeki süreçleri analiz edip çalışılabilir görevlere (tasks) bölmektir.\n\n" +
        "KURALLAR:\n" +
        "1. Sonuç KESİNLİKLE VE YALNIZCA JSON formatında olmalıdır. JSON dışında hiçbir açıklama ekleme!\n" +
        "2. Metinde mantıklı bir görev bulamazsan boş liste '[]' dön.\n" +
        "3. Her bir görev yapısı:\n" +
        "[\n" +
        "  {\n" +
        "    \"Title\": \"Kısa başlık (Max 200 karakter)\",\n" +
        "    \"Description\": \"Detaylı görev tanımı\",\n" +
        "    \"Priority\": 2,\n" +
        "    \"EstimatedHours\": 4.5\n" +
        "  }\n" +
        "]\n" +
        "4. Çıktı dili tamamen Türkçe olmalıdır.";

    public TaskAiAgentManager(IAiProvider aiProvider)
    {
        _aiProvider = aiProvider;
    }

    public async Task<List<DraftTaskResult>> ExtractTasksFromTextAsync(string text)
    {
        try
        {
            var userMessage = "Aşağıdaki doküman metnini analiz et:\n\n" + text;
            var jsonContent = await _aiProvider.CompleteAsync(SystemPrompt, userMessage);

            if (jsonContent.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                jsonContent = jsonContent.Substring(7);
                if (jsonContent.EndsWith("```"))
                    jsonContent = jsonContent.Substring(0, jsonContent.Length - 3);
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var tasks = JsonSerializer.Deserialize<List<DraftTaskResult>>(jsonContent.Trim(), options);
            return tasks ?? new List<DraftTaskResult>();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "AI provider ile iletişim sırasında hata oluştu.");
            return new List<DraftTaskResult>();
        }
    }
}
