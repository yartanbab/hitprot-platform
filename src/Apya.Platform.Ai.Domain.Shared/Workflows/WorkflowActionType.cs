namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// The action a matched <c>AiWorkflowRule</c> triggers. Actions are dispatched as events and
/// handled by decoupled handlers that reuse existing infrastructure
/// (Notify → NotificationManager, Webhook → existing WebhookSenderJob).
/// </summary>
public enum WorkflowActionType
{
    /// <summary>Sets the evaluation decision to an approved/auto-accepted state.</summary>
    Approve = 0,

    /// <summary>Sends an in-app notification to a target user/role.</summary>
    Notify = 1,

    /// <summary>Tags the evaluation/response with a label for filtering.</summary>
    Tag = 2,

    /// <summary>Invokes an outbound webhook with the result payload.</summary>
    Webhook = 3
}
