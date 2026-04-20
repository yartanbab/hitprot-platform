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
using Apya.Platform.AI;

namespace Apya.Platform.Application.AiTasks;

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

    /// <summary>
    /// Byte dizisinden dokuman analiz eder. UI veya Controller katmanindan cagirilir.
    /// </summary>
    public async Task<DocumentParseResultDto> ParseDocumentFromBytesAsync(Guid projectId, byte[] fileBytes, string fileName)
    {
        if (fileBytes == null || fileBytes.Length == 0)
        {
            throw new UserFriendlyException("Lutfen gecerli bir dosya yukleyin.");
        }

        var project = await _projectRepository.GetAsync(projectId);

        using var stream = new MemoryStream(fileBytes);
        var text = ExtractTextFromPdf(stream);
        
        // Cok buyuk PDF ise maliyet/hata onlemek icin kirp
        if (text.Length > 40000) text = text.Substring(0, 40000);

        Logger.LogInformation("AI gorev olusturucu: Dosya analiz ediliyor. Proje: {ProjectId}, Dosya: {FileName}",
            projectId, fileName);

        // Eski regex motoru yerine direkt yeni gelistirdigimiz OpenAI Agent'ina gonder
        var aiTasks = await _taskAiAgentManager.ExtractTasksFromTextAsync(text);
        
        var result = new DocumentParseResultDto();
        result.FileName = fileName;
        result.TotalSuggestedTasks = aiTasks.Count;
        result.EstimatedDurationDays = 30; // Gecici sabitleme
        result.ConfidenceScore = aiTasks.Count > 0 ? 95 : 0;
        result.DetectedSections = new List<string> { "AI Doküman Analizi" };
        
        var suggestions = new List<AiTaskSuggestionDto>();
        foreach (var t in aiTasks)
        {
            suggestions.Add(new AiTaskSuggestionDto
            {
                Title = t.Title,
                Description = t.Description,
                SuggestedPriority = (int)t.Priority, 
                SuggestedDueDate = project.StartDate?.AddDays(t.EstimatedHours / 8.0) ?? DateTime.Now.AddDays(7),
                IsSelected = true,
                SourceSection = "AI Analizi"
            });
        }
        result.Suggestions = suggestions;

        Logger.LogInformation("AI gorev olusturucu: {TaskCount} gorev onerisi olusturuldu. Proje: {ProjectId}",
            result.TotalSuggestedTasks, projectId);

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
        {
            throw new UserFriendlyException("Lutfen en az bir gorev onerisi secin.");
        }

        int createdCount = 0;

        foreach (var suggestion in approvedTasks)
        {
            var taskItem = new TaskItem(
                id: GuidGenerator.Create(),
                title: suggestion.Title,
                projectId: input.ProjectId,
                parentTaskId: null,
                description: suggestion.Description,
                startDate: DateTime.Now,
                dueDate: suggestion.SuggestedDueDate,
                priority: (TaskPriority)suggestion.SuggestedPriority
            );
            
            // IMultiTenant interface setter
            taskItem.TenantId = project.TenantId;

            await _taskRepository.InsertAsync(taskItem, autoSave: true);
            createdCount++;
        }

        Logger.LogInformation("AI gorev olusturucu: {Count} gorev basariyla olusturuldu. Proje: {ProjectId}",
            createdCount, input.ProjectId);

        return createdCount;
    }

    // ─── PDF Metin Cikarma ───
    private string ExtractTextFromPdf(Stream stream)
    {
        try
        {
            using var document = PdfDocument.Open(stream);
            var allText = new System.Text.StringBuilder();

            foreach (var page in document.GetPages())
            {
                allText.AppendLine(page.Text);
            }

            return allText.ToString();
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "PDF dosyasi okunurken hata olustu.");
            throw new UserFriendlyException("PDF dosyasi okunamadi. Lutfen gecerli bir PDF dosyasi yukleyin.");
        }
    }

    // ─── Kural Tabanli Gorev Analiz Motoru ───
    private DocumentParseResultDto AnalyzeTextAndGenerateSuggestions(string text, Project project)
    {
        var result = new DocumentParseResultDto();
        var suggestions = new List<AiTaskSuggestionDto>();
        var sections = new List<string>();

        if (string.IsNullOrWhiteSpace(text))
        {
            result.ConfidenceScore = 0;
            result.TotalSuggestedTasks = 0;
            return result;
        }

        var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                        .Select(l => l.Trim())
                        .Where(l => l.Length > 3)
                        .ToList();

        string currentSection = "Genel";
        int taskIndex = 0;

        // Proje takviminden gorev tarihlerini dagit
        var projectStart = project.StartDate ?? DateTime.Now;
        var projectEnd = project.EndDate ?? projectStart.AddMonths(3);
        var totalDays = (projectEnd - projectStart).TotalDays;

        foreach (var line in lines)
        {
            // Bolum basligi tespiti
            if (IsLikelySectionHeader(line))
            {
                currentSection = CleanSectionName(line);
                if (!sections.Contains(currentSection))
                {
                    sections.Add(currentSection);
                }
                continue;
            }

            // Gorev adayi tespiti
            if (IsLikelyTaskLine(line))
            {
                taskIndex++;
                var cleanTitle = CleanTaskTitle(line);

                if (cleanTitle.Length < 5 || cleanTitle.Length > 200) continue;

                var taskLineCount = lines.Count(IsLikelyTaskLine);
                var dayOffset = totalDays > 0 ? (totalDays / Math.Max(taskLineCount, 1)) * taskIndex : 7 * taskIndex;
                var suggestedDate = projectStart.AddDays(Math.Min(dayOffset, totalDays));

                suggestions.Add(new AiTaskSuggestionDto
                {
                    Title = cleanTitle,
                    Description = $"[{currentSection}] bolumunden otomatik olusturuldu.",
                    SuggestedPriority = GetPriorityFromContext(line, taskIndex),
                    SuggestedDueDate = suggestedDate,
                    IsSelected = true,
                    SourceSection = currentSection
                });
            }
        }

        // Eger hicbir gorev tespit edemediyse, metinden paragraf bazli cikar
        if (!suggestions.Any() && lines.Count > 2)
        {
            suggestions = ExtractFromParagraphs(lines, projectStart, projectEnd);
        }

        result.Suggestions = suggestions;
        result.TotalSuggestedTasks = suggestions.Count;
        result.DetectedSections = sections;
        result.EstimatedDurationDays = (int)totalDays;
        result.ConfidenceScore = CalculateConfidence(suggestions.Count, lines.Count);

        return result;
    }

    // ─── Yardimci Metodlar ───

    private bool IsLikelySectionHeader(string line)
    {
        if (line.Length > 80) return false;
        if (line.EndsWith(":")) return true;
        if (line == line.ToUpperInvariant() && line.Length > 3 && line.Length < 60) return true;
        if (Regex.IsMatch(line, @"^(\d+\.|\w+\.)\s+[A-Z\u00C7\u011E\u0130\u00D6\u015E\u00DC]")) return true;
        return false;
    }

    private bool IsLikelyTaskLine(string line)
    {
        if (Regex.IsMatch(line, @"^(\d+[\.\)]|\d+\.\d+[\.\)]?|[a-zA-Z][\.\)])\s+")) return true;
        if (Regex.IsMatch(line, @"^[\-\u2022\*\u25BA\u2192]\s+")) return true;

        var actionVerbs = new[] { "haz\u0131rla", "olu\u015ftur", "yap", "ger\u00e7ekle\u015ftir", "planla", "belirle",
            "analiz", "de\u011ferlendir", "geli\u015ftir", "tasarla", "uygula", "raporla", "kontrol",
            "organize", "koordine", "izle", "takip", "tamamla", "y\u00f6net", "incele",
            "prepare", "create", "develop", "design", "implement", "review", "manage",
            "organize", "plan", "analyze", "conduct", "establish", "define", "monitor" };

        var lowerLine = line.ToLowerInvariant();
        if (actionVerbs.Any(v => lowerLine.StartsWith(v))) return true;

        return false;
    }

    private string CleanSectionName(string line)
    {
        return Regex.Replace(line, @"^[\d\.\)\:\-]+\s*", "").Trim().TrimEnd(':');
    }

    private string CleanTaskTitle(string line)
    {
        var cleaned = Regex.Replace(line, @"^(\d+[\.\)]|\d+\.\d+[\.\)]?|[a-zA-Z][\.\)]|[\-\u2022\*\u25BA\u2192])\s*", "");
        return cleaned.Trim().TrimEnd('.').TrimEnd(',');
    }

    private int GetPriorityFromContext(string line, int taskIndex)
    {
        var lower = line.ToLowerInvariant();

        if (lower.Contains("kritik") || lower.Contains("acil") || lower.Contains("critical") || lower.Contains("urgent"))
            return 4;
        if (lower.Contains("\u00f6nemli") || lower.Contains("zorunlu") || lower.Contains("important") || lower.Contains("required"))
            return 3;
        if (taskIndex <= 2) return 3;
        if (taskIndex <= 5) return 2;

        return 2;
    }

    private List<AiTaskSuggestionDto> ExtractFromParagraphs(List<string> lines, DateTime projectStart, DateTime projectEnd)
    {
        var suggestions = new List<AiTaskSuggestionDto>();
        var totalDays = (projectEnd - projectStart).TotalDays;

        var candidateLines = lines
            .Where(l => l.Length >= 15 && l.Length <= 200)
            .Where(l => !IsLikelySectionHeader(l))
            .Take(10)
            .ToList();

        for (int i = 0; i < candidateLines.Count; i++)
        {
            var dayOffset = totalDays > 0 ? (totalDays / candidateLines.Count) * (i + 1) : 7 * (i + 1);

            suggestions.Add(new AiTaskSuggestionDto
            {
                Title = candidateLines[i].Length > 100
                    ? candidateLines[i].Substring(0, 100) + "..."
                    : candidateLines[i],
                Description = "Paragraf bazli otomatik cikarildi.",
                SuggestedPriority = 2,
                SuggestedDueDate = projectStart.AddDays(Math.Min(dayOffset, totalDays)),
                IsSelected = true,
                SourceSection = "Genel"
            });
        }

        return suggestions;
    }

    private double CalculateConfidence(int taskCount, int lineCount)
    {
        if (taskCount == 0) return 0;
        if (lineCount == 0) return 0;

        double ratio = (double)taskCount / lineCount;
        double score = Math.Min(95, ratio * 300 + 40);

        return Math.Round(score, 1);
    }
}
