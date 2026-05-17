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
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
