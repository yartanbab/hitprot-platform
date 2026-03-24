using System;
using System.Collections.Generic;

namespace Apya.Platform.AiTasks;

/// <summary>
/// AI dosya analizi sonucunda donen ustverileri ve gorev onerilerini icerir.
/// </summary>
public class DocumentParseResultDto
{
    public string FileName { get; set; } = string.Empty;
    public int TotalSuggestedTasks { get; set; }
    public int EstimatedDurationDays { get; set; }
    public double ConfidenceScore { get; set; }
    public List<AiTaskSuggestionDto> Suggestions { get; set; } = new();
    public List<string> DetectedSections { get; set; } = new();
}

/// <summary>
/// AI tarafindan dokumandan cikarilmis tekil bir gorev onerisi.
/// </summary>
public class AiTaskSuggestionDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SuggestedPriority { get; set; } = 2; // 1=Low, 2=Medium, 3=High, 4=Critical
    public DateTime? SuggestedDueDate { get; set; }
    public bool IsSelected { get; set; } = true;
    public string SourceSection { get; set; } = string.Empty;
}

/// <summary>
/// Kullanicinin onayladigi gorevleri topluca olusturmak icin giris modeli.
/// </summary>
public class CreateTasksFromAiInput
{
    public Guid ProjectId { get; set; }
    public List<AiTaskSuggestionDto> ApprovedTasks { get; set; } = new();
}
