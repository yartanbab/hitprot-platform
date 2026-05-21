namespace Apya.Platform.Permissions;

public static class PlatformPermissions
{
    public const string GroupName = "Platform";

    // --- GELİR YETKİLERİ ---
    public static class Incomes
    {
        public const string Default = GroupName + ".Incomes";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- YIL SONU DEĞERLEME YETKİLERİ ---
    public static class FxRevaluations
    {
        public const string Default = GroupName + ".FxRevaluations";
        public const string Run = Default + ".Run";
        public const string Delete = Default + ".Delete";
    }

    // --- CARİ (MÜŞTERİ) YETKİLERİ ---
    public static class Customers
    {
        public const string Default = GroupName + ".Customers";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- KASA YETKİLERİ ---
    public static class CashAccounts
    {
        public const string Default = GroupName + ".CashAccounts";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- DÖVİZ KURU YETKİLERİ ---
    public static class ExchangeRates
    {
        public const string Default = GroupName + ".ExchangeRates";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- GİDER YETKİLERİ ---
    public static class Expenses
    {
        public const string Default = GroupName + ".Expenses";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- KASA HAREKETİ YETKİLERİ ---
    public static class CashMovements
    {
        public const string Default = GroupName + ".CashMovements";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- PROJE YETKİLERİ ---
    public static class Projects
    {
        public const string Default = GroupName + ".Projects"; // Projeleri görme yetkisi
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
        public const string ViewBudget = Default + ".ViewBudget"; // Bütçe alanını görme yetkisi (Özel)
        public const string ManageTeam = Default + ".ManageTeam"; // Projeye üye ekleme/çıkarma
        public const string UseAiFeatures = Default + ".UseAiFeatures";
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

    // --- WIKI / DOKÜMANTASYON YETKİLERİ ---
    public static class Documents
    {
        public const string Default = GroupName + ".Documents";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
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

    // --- FATURA YETKİLERİ ---
    public static class Invoices
    {
        public const string Default = GroupName + ".Invoices";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- RAPOR YETKİLERİ ---
    public static class Reports
    {
        public const string Default = GroupName + ".Reports";
        public const string TrialBalance = Default + ".TrialBalance";
    }

    // --- DİNAMİK VARLIK (FORM/ŞABLON) YETKİLERİ ---
    public static class DynamicAssets
    {
        public const string Default = GroupName + ".DynamicAssets";
        public const string Create = Default + ".Create";
        public const string Edit = Default + ".Edit";
        public const string Delete = Default + ".Delete";
    }

    // --- TENANT AYAR YETKİLERİ (AI vb.) ---
    public static class TenantSettings
    {
        public const string Default = GroupName + ".TenantSettings";
        public const string ManageAi = Default + ".ManageAi";
    }
}