namespace Apya.Platform.Ai.Permissions;

public static class AiPermissions
{
    public const string GroupName = "Ai";

    public static class Generation
    {
        public const string Default = GroupName + ".Generation";
        public const string Request = Default + ".Request";
    }

    public static class Drafts
    {
        public const string Default = GroupName + ".Drafts";
        public const string View = Default + ".View";
        public const string Edit = Default + ".Edit";
        public const string Approve = Default + ".Approve";
    }

    public static class TenantSettings
    {
        public const string Default = GroupName + ".TenantSettings";
        public const string Manage = Default + ".Manage";
    }
}
