namespace Apya.Platform.Agentic.Dtos;

/// <summary>
/// Input DTO for providing instructions to the AI agent.
/// </summary>
public class AgentPromptDto
{
    public string Prompt { get; set; } = null!;
}

/// <summary>
/// Output DTO representing the AI agent's response or execution result.
/// </summary>
public class AgentResponseDto
{
    public string Result { get; set; } = null!;
}
