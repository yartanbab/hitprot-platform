using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apya.Platform.Permissions;

public class PlatformPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PlatformPermissions.GroupName, L("Permission:Platform"));

        // --- PROJE YETKİLERİ ---
        var projectsPermission = myGroup.AddPermission(PlatformPermissions.Projects.Default, L("Permission:Projects"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Create, L("Permission:Projects.Create"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Edit, L("Permission:Projects.Edit"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Delete, L("Permission:Projects.Delete"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ViewBudget, L("Permission:Projects.ViewBudget"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ManageTeam, L("Permission:Projects.ManageTeam"));

        // --- GÖREV (TASK) YETKİLERİ --- (Burası Eksik Olabilir)
        var tasksPermission = myGroup.AddPermission(PlatformPermissions.Tasks.Default, L("Permission:Tasks"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Create, L("Permission:Tasks.Create"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Edit, L("Permission:Tasks.Edit"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Delete, L("Permission:Tasks.Delete"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Assign, L("Permission:Tasks.Assign"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.ChangeStatus, L("Permission:Tasks.ChangeStatus"));

        // --- DOKÜMAN YETKİLERİ ---
        var docsPermission = myGroup.AddPermission(PlatformPermissions.Documents.Default, L("Permission:Documents"));
        docsPermission.AddChild(PlatformPermissions.Documents.Create, L("Permission:Documents.Create"));
        docsPermission.AddChild(PlatformPermissions.Documents.Edit, L("Permission:Documents.Edit"));
        docsPermission.AddChild(PlatformPermissions.Documents.Delete, L("Permission:Documents.Delete"));

        // --- BİLDİRİM YETKİLERİ ---
        var notificationsPermission = myGroup.AddPermission(PlatformPermissions.Notifications.Default, L("Permission:Notifications"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.MarkRead, L("Permission:Notifications.MarkRead"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.Delete, L("Permission:Notifications.Delete"));

        // --- TAKVİM YETKİLERİ ---
        var calendarsPermission = myGroup.AddPermission(PlatformPermissions.Calendars.Default, L("Permission:Calendars"));
        calendarsPermission.AddChild(PlatformPermissions.Calendars.Connect, L("Permission:Calendars.Connect"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}