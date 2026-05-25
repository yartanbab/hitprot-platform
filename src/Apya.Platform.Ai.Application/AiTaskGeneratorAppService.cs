using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.AiTasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Ai;

[Authorize]
public class AiTaskGeneratorAppService : ApplicationService, IAiTaskGeneratorAppService
{
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly TaskAiAgentManager _taskAiAgentManager;

    public AiTaskGeneratorAppService(
        IRepository<Project, Guid> projectRepository,
        IRepository<TaskItem, Guid> taskRepository,
        TaskAiAgentManager taskAiAgentManager)
    {
        _projectRepository = projectRepository;
        _taskRepository = taskRepository;
        _taskAiAgentManager = taskAiAgentManager;
    }

    public async Task<DocumentParseResultDto> ParseDocumentFromBytesAsync(Guid projectId, byte[] fileBytes, string fileName)
    {
        if (fileBytes == null || fileBytes.Length == 0)
            throw new UserFriendlyException("Lutfen gecerli bir dosya yukleyin.");

        var project = await _projectRepository.GetAsync(projectId);

        using var stream = new MemoryStream(fileBytes);
        var text = ExtractTextFromPdf(stream);
        if (text.Length > 40000) text = text.Substring(0, 40000);

        var aiTasks = await _taskAiAgentManager.ExtractTasksFromTextAsync(text);

        var result = new DocumentParseResultDto
        {
            FileName = fileName,
            TotalSuggestedTasks = aiTasks.Count,
            EstimatedDurationDays = 30,
            ConfidenceScore = aiTasks.Count > 0 ? 95 : 0,
            DetectedSections = new List<string> { "AI Doküman Analizi" }
        };

        result.Suggestions = aiTasks.Select(t => new AiTaskSuggestionDto
        {
            Title = t.Title,
            Description = t.Description,
            SuggestedPriority = (int)t.Priority,
            SuggestedDueDate = project.StartDate?.AddDays(t.EstimatedHours / 8.0) ?? Clock.Now.AddDays(7),
            IsSelected = true,
            SourceSection = "AI Analizi"
        }).ToList();

        return result;
    }

    public async Task<DocumentParseResultDto> ParseExistingDocumentAsync(Guid projectId)
    {
        throw new UserFriendlyException("Bu islem su anda desteklenmiyor. Lutfen yeni bir dosya yukleyin.");
    }

    public async Task<int> CreateTasksFromSuggestionsAsync(CreateTasksFromAiInput input)
    {
        var project = await _projectRepository.GetAsync(input.ProjectId);
        var approvedTasks = input.ApprovedTasks.Where(t => t.IsSelected).ToList();

        if (!approvedTasks.Any())
            throw new UserFriendlyException("Lutfen en az bir gorev onerisi secin.");

        int createdCount = 0;
        foreach (var suggestion in approvedTasks)
        {
            var taskItem = new TaskItem(
                id: GuidGenerator.Create(),
                title: suggestion.Title,
                projectId: input.ProjectId,
                parentTaskId: null,
                description: suggestion.Description,
                startDate: Clock.Now,
                dueDate: suggestion.SuggestedDueDate,
                priority: (TaskPriority)suggestion.SuggestedPriority,
                tenantId: CurrentTenant.Id
            );
            await _taskRepository.InsertAsync(taskItem, autoSave: true);
            createdCount++;
        }

        return createdCount;
    }

    private string ExtractTextFromPdf(Stream stream)
    {
        try
        {
            using var document = PdfDocument.Open(stream);
            var allText = new System.Text.StringBuilder();
            foreach (var page in document.GetPages())
                allText.AppendLine(page.Text);
            return allText.ToString();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "PDF dosyasi okunurken hata olustu.");
            throw new UserFriendlyException("PDF dosyasi okunamadi. Lutfen gecerli bir PDF dosyasi yukleyin.");
        }
    }
}
