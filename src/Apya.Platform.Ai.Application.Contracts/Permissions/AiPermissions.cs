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

    // ============================================================
    // AI Değerlendirme Merkezi (AI Evaluation Center)
    // ============================================================

    public static class Dashboard
    {
        public const string Default = GroupName + ".Dashboard";
        public const string View = Default + ".View";
    }

    public static class Prompts
    {
        public const string Default = GroupName + ".Prompts";
        public const string View = Default + ".View";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string Publish = Default + ".Publish";
    }

    public static class Evaluations
    {
        public const string Default = GroupName + ".Evaluations";
        public const string View = Default + ".View";
        public const string Trigger = Default + ".Trigger";
        public const string Retry = Default + ".Retry";
    }

    public static class Results
    {
        public const string Default = GroupName + ".Results";
        public const string View = Default + ".View";
        public const string Export = Default + ".Export";
    }

    public static class Workflows
    {
        public const string Default = GroupName + ".Workflows";
        public const string Manage = Default + ".Manage";
    }

    public static class Providers
    {
        public const string Default = GroupName + ".Providers";
        public const string Manage = Default + ".Manage";
    }

    public static class Reports
    {
        public const string Default = GroupName + ".Reports";
        public const string View = Default + ".View";
    }

    public static class UsageLogs
    {
        public const string Default = GroupName + ".UsageLogs";
        public const string View = Default + ".View";
    }
}
