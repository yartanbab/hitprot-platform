using System.Collections.Generic;

namespace Apya.Platform.Ai.Prompts;

public interface IAiResponseValidator
{
    ValidationOutcome Validate(string response);
}

public class ValidationOutcome
{
    public bool IsValid { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = new List<string>();
    public string? RepairHint { get; init; }

    public static ValidationOutcome Ok() => new() { IsValid = true };

    public static ValidationOutcome Invalid(string error, string? repairHint = null) =>
        new()
        {
            IsValid = false,
            Errors = new List<string> { error },
            RepairHint = repairHint
        };
}
