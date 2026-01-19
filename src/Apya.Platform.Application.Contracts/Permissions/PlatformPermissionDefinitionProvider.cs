using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apya.Platform.Permissions;

public class PlatformPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PlatformPermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(PlatformPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
