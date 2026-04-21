using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Agentic.Dtos;

namespace Apya.Platform.Agentic;

/// <summary>
/// Application service interface for Microsoft Semantic Kernel AI integration.
/// Provides capabilities like generating dynamic forms from text
/// and analyzing submitted document responses.
/// </summary>
public interface IAiAssistantAppService : IApplicationService
{
    /// <summary>
    /// Generates a new form template (AppDocument) based on a text prompt
    /// and persists it automatically into the system.
    /// </summary>
    Task<AgentResponseDto> GenerateFormFromPromptAsync(AgentPromptDto input);

    /// <summary>
    /// Analyzes all JSON responses of a specific document 
    /// and extracts a 3-point summary and trends for the admin.
    /// </summary>
    Task<AgentResponseDto> AnalyzeResponsesAsync(Guid documentId);

    /// <summary>
    /// Orchestrates a multi-step plan using Semantic Kernel to achieve a user-defined goal.
    /// E.g., "Find all overdue tasks and summarize them".
    /// </summary>
    Task<AgentResponseDto> RunPlanAsync(string goal);
}
