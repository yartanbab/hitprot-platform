using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Agentic.Dtos;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.Agentic;

/// <summary>
/// AI Assistant implementation using Microsoft Semantic Kernel.
/// Injected SK Kernel takes actions directly within Apya modules.
/// </summary>
[Authorize]
public class AiAssistantAppService : PlatformAppService, IAiAssistantAppService
{
    private readonly Kernel _kernel;
    private readonly ITemplateAppService _templateAppService;
    private readonly IRepository<AppResponse, Guid> _responseRepository;
    private readonly IAppDocumentRepository _documentRepository;

    public AiAssistantAppService(
        Kernel kernel,
        ITemplateAppService templateAppService,
        IRepository<AppResponse, Guid> responseRepository,
        IAppDocumentRepository documentRepository)
    {
        _kernel = kernel;
        _templateAppService = templateAppService;
        _responseRepository = responseRepository;
        _documentRepository = documentRepository;
    }

    public async Task<AgentResponseDto> GenerateFormFromPromptAsync(AgentPromptDto input)
    {
        // 1. Resolve Chat Completion Service from the Kernel
        var chatCompletionService = _kernel.GetRequiredService<IChatCompletionService>();
        
        // 2. Strict System Prompt directing the LLM to output pure JSON matching CreateTemplateDto
        var systemPrompt = @"Sen Apya sisteminin form üretici asistanısın. 
Kullanıcının isteğine göre JSON formatında bir form şeması dönmelisin.
Çıktın SADECE geçerli bir JSON olmalıdır, markdown backtick (```) kullanma.

Şema formatı:
{
  ""title"": ""Form Başlığı"",
  ""slug"": ""form-basligi"",
  ""blocks"": [
    {
      ""type"": 0, // 0: TextInput, 1: NumberInput, 2: Select, 3: Checkbox, 4: Rating, 5: TableGrid
      ""order"": 1,
      ""content"": ""Soru metni"",
      ""settings"": ""{ """"required"""": true }""
    }
  ]
}";

        var chatHistory = new ChatHistory(systemPrompt);
        chatHistory.AddUserMessage(input.Prompt);

        // 3. Issue the prompt
        var result = await chatCompletionService.GetChatMessageContentAsync(chatHistory, kernel: _kernel);
        var jsonResponse = result.Content ?? string.Empty;

        // Clean up markdown code blocks if the AI stubbornly adds them
        jsonResponse = jsonResponse.Replace("```json", "").Replace("```", "").Trim();

        try
        {
            // 4. Parse the LLM's JSON into our standard DTO
            var createTemplateDto = JsonSerializer.Deserialize<CreateTemplateDto>(jsonResponse, new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true 
            });

            if (createTemplateDto == null || string.IsNullOrWhiteSpace(createTemplateDto.Title))
            {
                throw new UserFriendlyException("Yapay zeka geçerli bir form üretemedi.", code: PlatformDomainErrorCodes.AiFormGenerationFailed);
            }

            // 5. Agent TAKES ACTION: Directly updates the system by utilizing the core Feature AppService
            var createdTemplate = await _templateAppService.CreateAsync(createTemplateDto);

            return new AgentResponseDto
            {
                Result = $"Başarıyla üretildi ve sisteme kaydedildi! Yeni Şablon ID: {createdTemplate.Id}"
            };
        }
        catch (JsonException ex)
        {
            throw new UserFriendlyException(
                "Yapay zeka yanıtı sisteme uygun formatta deşifre edilemedi.", 
                code: PlatformDomainErrorCodes.AiFormParseFailed, 
                details: $"Gelen JSON:\n{jsonResponse}", 
                innerException: ex);
        }
    }

    public async Task<AgentResponseDto> AnalyzeResponsesAsync(Guid documentId)
    {
        // 1. Fetch domain data based on User's request
        var document = await _documentRepository.GetAsync(documentId);
        var responses = await _responseRepository.GetListAsync(r => r.DocumentId == documentId);

        if (!responses.Any())
        {
            return new AgentResponseDto { Result = "Bu dokümana ait henüz yanıt bulunmuyor." };
        }

        // We only care about the JSON answers for analytical context
        var responsesJson = JsonSerializer.Serialize(responses.Select(r => r.Answers));

        // 2. Prepare Context for Kernel
        var chatCompletionService = _kernel.GetRequiredService<IChatCompletionService>();
        
        var systemPrompt = $@"Sen Apya sisteminin yetkin bir veri analisti asistanısın.
Aşağıda '{document.Title}' formuna verilmiş {responses.Count} adet form yanıtı bulunmaktadır.
Bütün veriler JSON payload'udur.
Görevlerin:
- Bu form yanıtlarını analiz et.
- Ana trendleri ve genel durumu tespit et.
- Sistem yöneticisi için net, profesyonel ve kısa 3 maddelik bir özet çıkar.
Yanıtın doğrudan Türkçe ve 3 maddelik bir liste olmalıdır.";

        var chatHistory = new ChatHistory(systemPrompt);
        chatHistory.AddUserMessage(responsesJson);

        // 3. Let AI reason over data
        var result = await chatCompletionService.GetChatMessageContentAsync(chatHistory, kernel: _kernel);

        return new AgentResponseDto
        {
            Result = result.Content ?? "Analiz tamamlanamadı."
        };
    }
}
