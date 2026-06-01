namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// Field-length constraints for the workflow aggregates.
/// ActionPayload is stored as an unbounded "text" column.
/// </summary>
public static class WorkflowConsts
{
    public const int MaxNameLength = 200;
    public const int MaxJsonPathLength = 200;
    public const int MaxCompareValueLength = 500;
}
