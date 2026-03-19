namespace Apya.Platform.Permissions;

public static class PlatformPermissions
{
    public const string GroupName = "Platform";

    // --- PROJE YETKİLERİ ---
    public static class Projects
    {
        public const string Default = GroupName + ".Projects"; // Projeleri görme yetkisi
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string ViewBudget = Default + ".ViewBudget"; // Bütçe alanını görme yetkisi (Özel)
        public const string ManageTeam = Default + ".ManageTeam"; // Projeye üye ekleme/çıkarma
    }

    // --- GÖREV (TASK) YETKİLERİ ---
    public static class Tasks
    {
        public const string Default = GroupName + ".Tasks"; // Görevleri listeleme
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit"; // İçerik düzenleme
        public const string Delete = Default + ".Delete";
        public const string Assign = Default + ".Assign"; // Başkasına görev atama
        public const string ChangeStatus = Default + ".ChangeStatus"; // Durum değiştirme (Tamamla/Geri Al)
    }

    // --- BİLDİRİM YETKİLERİ ---
    public static class Notifications
    {
        public const string Default  = GroupName + ".Notifications";
        public const string MarkRead = Default + ".MarkRead";
        public const string Delete   = Default + ".Delete";
    }

    // --- TAKVİM YETKİLERİ ---
    public static class Calendars
    {
        public const string Default = GroupName + ".Calendars";
        public const string Connect = Default + ".Connect";
    }
}