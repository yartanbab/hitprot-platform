using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apya.Platform.Ai.Permissions;

public class AiPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var aiGroup = context.AddGroup(AiPermissions.GroupName, L("Permission:Ai"));

        var generation = aiGroup.AddPermission(
            AiPermissions.Generation.Default,
            L("Permission:Ai.Generation"));
        generation.AddChild(
            AiPermissions.Generation.Request,
            L("Permission:Ai.Generation.Request"));

        var drafts = aiGroup.AddPermission(
            AiPermissions.Drafts.Default,
            L("Permission:Ai.Drafts"));
        drafts.AddChild(AiPermissions.Drafts.View, L("Permission:Ai.Drafts.View"));
        drafts.AddChild(AiPermissions.Drafts.Edit, L("Permission:Ai.Drafts.Edit"));
        drafts.AddChild(AiPermissions.Drafts.Approve, L("Permission:Ai.Drafts.Approve"));

        var tenantSettings = aiGroup.AddPermission(
            AiPermissions.TenantSettings.Default,
            L("Permission:Ai.TenantSettings"));
        tenantSettings.AddChild(
            AiPermissions.TenantSettings.Manage,
            L("Permission:Ai.TenantSettings.Manage"));

        // --- AI Değerlendirme Merkezi ---
        aiGroup.AddPermission(AiPermissions.Dashboard.View, L("Permission:Ai.Dashboard"));

        var prompts = aiGroup.AddPermission(AiPermissions.Prompts.Default, L("Permission:Ai.Prompts"));
        prompts.AddChild(AiPermissions.Prompts.View, L("Permission:Ai.Prompts.View"));
        prompts.AddChild(AiPermissions.Prompts.Create, L("Permission:Ai.Prompts.Create"));
        prompts.AddChild(AiPermissions.Prompts.Edit, L("Permission:Ai.Prompts.Edit"));
        prompts.AddChild(AiPermissions.Prompts.Delete, L("Permission:Ai.Prompts.Delete"));
        prompts.AddChild(AiPermissions.Prompts.Publish, L("Permission:Ai.Prompts.Publish"));

        var evaluations = aiGroup.AddPermission(AiPermissions.Evaluations.Default, L("Permission:Ai.Evaluations"));
        evaluations.AddChild(AiPermissions.Evaluations.View, L("Permission:Ai.Evaluations.View"));
        evaluations.AddChild(AiPermissions.Evaluations.Trigger, L("Permission:Ai.Evaluations.Trigger"));
        evaluations.AddChild(AiPermissions.Evaluations.Retry, L("Permission:Ai.Evaluations.Retry"));

        var results = aiGroup.AddPermission(AiPermissions.Results.Default, L("Permission:Ai.Results"));
        results.AddChild(AiPermissions.Results.View, L("Permission:Ai.Results.View"));
        results.AddChild(AiPermissions.Results.Export, L("Permission:Ai.Results.Export"));

        var workflows = aiGroup.AddPermission(AiPermissions.Workflows.Default, L("Permission:Ai.Workflows"));
        workflows.AddChild(AiPermissions.Workflows.Manage, L("Permission:Ai.Workflows.Manage"));

        var providers = aiGroup.AddPermission(AiPermissions.Providers.Default, L("Permission:Ai.Providers"));
        providers.AddChild(AiPermissions.Providers.Manage, L("Permission:Ai.Providers.Manage"));

        aiGroup.AddPermission(AiPermissions.Reports.View, L("Permission:Ai.Reports"));

        aiGroup.AddPermission(AiPermissions.UsageLogs.View, L("Permission:Ai.UsageLogs"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
