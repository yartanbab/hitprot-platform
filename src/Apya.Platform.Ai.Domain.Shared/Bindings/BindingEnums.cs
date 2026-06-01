namespace Apya.Platform.Ai.Bindings;

/// <summary>
/// When an <c>AiFormBinding</c> fires an evaluation for a submitted response.
/// </summary>
public enum BindingTriggerMode
{
    /// <summary>Evaluate automatically as soon as the form response is submitted.</summary>
    OnSubmit = 0,

    /// <summary>Only evaluate when explicitly triggered from the UI/API.</summary>
    Manual = 1
}

/// <summary>
/// Which prompt version an <c>AiFormBinding</c> runs.
/// </summary>
public enum PromptVersionPolicy
{
    /// <summary>Always use the prompt's current active (published) version.</summary>
    Active = 0,

    /// <summary>Pin to a specific version (PinnedVersionId) for reproducibility.</summary>
    Pinned = 1
}
