using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using Volo.Abp.Domain.Services;
using Apya.Platform.Tasks.Drafts;

namespace Apya.Platform.AI;

public class TaskAiAgentManager : DomainService
{
    private readonly IConfiguration _configuration;

    public TaskAiAgentManager(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<List<DraftTaskResult>> ExtractTasksFromTextAsync(string text)
    {
        var apiKey = _configuration["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            Logger.LogWarning("OpenAI:ApiKey is missing in settings. Returning empty task list.");
            return new List<DraftTaskResult>();
        }

        try
        {
            // OpenAPI resmi NuGet paketi (v2+) ChatClient kullanımı:
            var chatClient = new ChatClient("gpt-4o-mini", apiKey);

            var systemPrompt = @"Sen, yazılım ve iş dünyası uzmanı kıdemli bir Proje Yöneticisisin.
Sana bir proje yönergesi, toplantı dökümü veya gereksinim listesi içeren bir PDF metni vereceğim. 
Görevin, bu metindeki süreçleri analiz edip çalışılabilir görevlere (tasks) bölmektir.

KURALLAR:
1. Sonuç KESİNLİKLE VE YALNIZCA JSON formatında olmalıdır. JSON dışında hiçbir açıklama, selamlama veya markdown ('```json' vb.) ekleme! 
2. Metinde mantıklı bir görev bulamazsan boş liste '[]' dön.
3. Her bir görev yapısı aşağıdaki gibi olmalıdır:
[
  {
    ""Title"": ""Kısa ve açıklayıcı görev başlığı (Max 200 karakter)"",
    ""Description"": ""Bağlamı koruyan detaylı görev tanımı"",
    ""Priority"": 2, // (Low: 1, Medium: 2, High: 3)
    ""EstimatedHours"": 4.5 // Ondalıklı rakam olarak tahmin
  }
]
4. Çıktı dili tamamen Türkçe olmalıdır.";

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(systemPrompt),
                new UserChatMessage("Aşağıdaki doküman metnini analiz et:\n\n" + text)
            };

            var response = await chatClient.CompleteChatAsync(messages);

            var jsonContent = response.Value.Content[0].Text;
            
            // Temizlik (Eğer AI inatla markdown dönerse)
            if (jsonContent.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                jsonContent = jsonContent.Substring(7);
                if (jsonContent.EndsWith("```"))
                {
                    jsonContent = jsonContent.Substring(0, jsonContent.Length - 3);
                }
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var tasks = JsonSerializer.Deserialize<List<DraftTaskResult>>(jsonContent.Trim(), options);
            return tasks ?? new List<DraftTaskResult>();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "OpenAI API ile bağlantı veya parse sırasında hata oluştu. Dönen metnin limit veya yapı sorunu olabilir.");
            return new List<DraftTaskResult>(); // Hata durumunda fail safe olarak boş dön
        }
    }
}
