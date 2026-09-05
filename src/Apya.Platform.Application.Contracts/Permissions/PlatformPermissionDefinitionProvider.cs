using Apya.Platform.Features;
using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Permissions;

public class PlatformPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        // ============================================================
        // PROJE & GÖREV YÖNETİMİ
        // ============================================================
        var workGroup = context.AddGroup(PlatformPermissions.Groups.Work, L("Permission:Group:Work"));

        var projectsPermission = workGroup.AddPermission(PlatformPermissions.Projects.Default, L("Permission:Projects"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Create, L("Permission:Projects.Create"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Edit, L("Permission:Projects.Edit"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Delete, L("Permission:Projects.Delete"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ViewBudget, L("Permission:Projects.ViewBudget"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ManageTeam, L("Permission:Projects.ManageTeam"));
        projectsPermission.AddChild(PlatformPermissions.Projects.UseAiFeatures, L("Permission:Projects.UseAiFeatures"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ManageCategories, L("Permission:Projects.ManageCategories"));

        var tasksPermission = workGroup.AddPermission(PlatformPermissions.Tasks.Default, L("Permission:Tasks"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Create, L("Permission:Tasks.Create"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Edit, L("Permission:Tasks.Edit"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Delete, L("Permission:Tasks.Delete"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Assign, L("Permission:Tasks.Assign"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.ChangeStatus, L("Permission:Tasks.ChangeStatus"));

        // Görev oluşturma ekranının ekstra konfigürasyonları — paket kapısı arkasında.
        // Oluşturmanın kendisi (Tasks.Create) KAPISIZ kalır: paket düşürülünce kullanıcı
        // görev açamaz hâle gelmemeli, yalnız kısayolları ve planlama alanları kaybolmalı.
        tasksPermission.AddChild(PlatformPermissions.Tasks.QuickCreate, L("Permission:Tasks.QuickCreate"))
            .RequireFeatures(PlatformFeatures.TaskQuickEntry);
        tasksPermission.AddChild(PlatformPermissions.Tasks.ManagePlanning, L("Permission:Tasks.ManagePlanning"))
            .RequireFeatures(PlatformFeatures.TaskQuickEntry);

        // Dış paylaşım BİLEREK kapısız: her pakette açılabilir olmalı, çünkü ekip dışına iş
        // verdirmek pakete göre kısıtlanan bir "ekstra" değil, görevin temel kullanımı.
        tasksPermission.AddChild(PlatformPermissions.Tasks.ShareExternally, L("Permission:Tasks.ShareExternally"));

        // ============================================================
        // HİBE YÖNETİMİ
        // ============================================================
        var grantsGroup = context.AddGroup(PlatformPermissions.Groups.Grants, L("Permission:Group:Grants"));

        var grantsPermission = grantsGroup.AddPermission(PlatformPermissions.Grants.Default, L("Permission:Grants"));
        grantsPermission.RequireFeatures(PlatformFeatures.Grants);
        // Katalog yazma izinleri HOST'a özeldir: hibe programını ve çağrısını yalnız host açar,
        // kiracı kendisine yayınlananı görüntüler ve başvurur. Host-only olmasaydı bu izne sahip
        // bir kiracı kullanıcısı, ekranda buton olmasa bile /api/app/grant üzerinden kendi
        // kiracısında program/çağrı açabilirdi (GrantAppService düz CrudAppService'tir).
        grantsPermission.AddChild(PlatformPermissions.Grants.Create, L("Permission:Grants.Create"), MultiTenancySides.Host);
        grantsPermission.AddChild(PlatformPermissions.Grants.Edit,   L("Permission:Grants.Edit"),   MultiTenancySides.Host);
        grantsPermission.AddChild(PlatformPermissions.Grants.Delete, L("Permission:Grants.Delete"), MultiTenancySides.Host);

        // ============================================================
        // FİNANS & MUHASEBE
        // ============================================================
        var financeGroup = context.AddGroup(PlatformPermissions.Groups.Finance, L("Permission:Group:Finance"));

        var incomesPermission = financeGroup.AddPermission(PlatformPermissions.Incomes.Default, L("Permission:Incomes"));
        incomesPermission.RequireFeatures(PlatformFeatures.Finance);
        incomesPermission.AddChild(PlatformPermissions.Incomes.Create, L("Permission:Incomes.Create"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Edit, L("Permission:Incomes.Edit"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Delete, L("Permission:Incomes.Delete"));

        var expensesPermission = financeGroup.AddPermission(PlatformPermissions.Expenses.Default, L("Permission:Expenses"));
        expensesPermission.RequireFeatures(PlatformFeatures.Finance);
        expensesPermission.AddChild(PlatformPermissions.Expenses.Create, L("Permission:Expenses.Create"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Edit, L("Permission:Expenses.Edit"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Delete, L("Permission:Expenses.Delete"));

        var invoicesPermission = financeGroup.AddPermission(PlatformPermissions.Invoices.Default, L("Permission:Invoices"));
        invoicesPermission.RequireFeatures(PlatformFeatures.Finance);
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Create, L("Permission:Invoices.Create"));
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Edit, L("Permission:Invoices.Edit"));
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Delete, L("Permission:Invoices.Delete"));

        var exchangeRatesPermission = financeGroup.AddPermission(PlatformPermissions.ExchangeRates.Default, L("Permission:ExchangeRates"));
        exchangeRatesPermission.RequireFeatures(PlatformFeatures.Finance);
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Create, L("Permission:ExchangeRates.Create"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Edit, L("Permission:ExchangeRates.Edit"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Delete, L("Permission:ExchangeRates.Delete"));

        // FX değerleme: finans modülünün gelişmiş raporu → Finance + AdvancedReports ikisi de şart.
        // (Yalnız AdvancedReports'a bağlıyken, Finance kapalı bir pakette de görünüyordu.)
        var fxRevaluationPermission = financeGroup.AddPermission(PlatformPermissions.FxRevaluations.Default, L("Permission:FxRevaluations"));
        fxRevaluationPermission.RequireFeatures(PlatformFeatures.Finance, PlatformFeatures.AdvancedReports);
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Run, L("Permission:FxRevaluations.Run"));
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Delete, L("Permission:FxRevaluations.Delete"));

        var reportsPermission = financeGroup.AddPermission(PlatformPermissions.Reports.Default, L("Permission:Reports"));
        reportsPermission.RequireFeatures(PlatformFeatures.Finance);
        // Mizan: gelişmiş rapor → AdvancedReports (menüyle hizalı).
        reportsPermission.AddChild(PlatformPermissions.Reports.TrialBalance, L("Permission:Reports.TrialBalance"))
            .RequireFeatures(PlatformFeatures.AdvancedReports);

        // ============================================================
        // CARİ & KASA
        // ============================================================
        var accountingGroup = context.AddGroup(PlatformPermissions.Groups.Accounting, L("Permission:Group:Accounting"));

        var customersPermission = accountingGroup.AddPermission(PlatformPermissions.Customers.Default, L("Permission:Customers"));
        customersPermission.RequireFeatures(PlatformFeatures.Finance);
        customersPermission.AddChild(PlatformPermissions.Customers.Create, L("Permission:Customers.Create"));
        customersPermission.AddChild(PlatformPermissions.Customers.Edit, L("Permission:Customers.Edit"));
        customersPermission.AddChild(PlatformPermissions.Customers.Delete, L("Permission:Customers.Delete"));

        var cashAccountsPermission = accountingGroup.AddPermission(PlatformPermissions.CashAccounts.Default, L("Permission:CashAccounts"));
        cashAccountsPermission.RequireFeatures(PlatformFeatures.Finance);
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Create, L("Permission:CashAccounts.Create"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Edit, L("Permission:CashAccounts.Edit"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Delete, L("Permission:CashAccounts.Delete"));

        var cashMovementsPermission = accountingGroup.AddPermission(PlatformPermissions.CashMovements.Default, L("Permission:CashMovements"));
        cashMovementsPermission.RequireFeatures(PlatformFeatures.Finance);
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Create, L("Permission:CashMovements.Create"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Edit, L("Permission:CashMovements.Edit"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Delete, L("Permission:CashMovements.Delete"));

        // ============================================================
        // İÇERİK & DOKÜMAN
        // ============================================================
        var contentGroup = context.AddGroup(PlatformPermissions.Groups.Content, L("Permission:Group:Content"));

        var docsPermission = contentGroup.AddPermission(PlatformPermissions.Documents.Default, L("Permission:Documents"));
        docsPermission.RequireFeatures(PlatformFeatures.Documents);
        docsPermission.AddChild(PlatformPermissions.Documents.Create, L("Permission:Documents.Create"));
        docsPermission.AddChild(PlatformPermissions.Documents.Edit, L("Permission:Documents.Edit"));
        docsPermission.AddChild(PlatformPermissions.Documents.Delete, L("Permission:Documents.Delete"));
        docsPermission.AddChild(PlatformPermissions.Documents.ViewAccessLog, L("Permission:Documents.ViewAccessLog"));
        docsPermission.AddChild(PlatformPermissions.Documents.ManageMeta, L("Permission:Documents.ManageMeta"));
        docsPermission.AddChild(PlatformPermissions.Documents.BulkOperations, L("Permission:Documents.BulkOperations"));
        docsPermission.AddChild(PlatformPermissions.Documents.ManageCompliance, L("Permission:Documents.ManageCompliance"));
        docsPermission.AddChild(PlatformPermissions.Documents.GenerateReports, L("Permission:Documents.GenerateReports"));
        docsPermission.AddChild(PlatformPermissions.Documents.ShareExternally, L("Permission:Documents.ShareExternally"));
        docsPermission.AddChild(PlatformPermissions.Documents.Administer, L("Permission:Documents.Administer"));

        var dynamicAssetsPermission = contentGroup.AddPermission(PlatformPermissions.DynamicAssets.Default, L("Permission:DynamicAssets"));
        dynamicAssetsPermission.RequireFeatures(PlatformFeatures.Forms);
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Create, L("Permission:DynamicAssets.Create"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Edit, L("Permission:DynamicAssets.Edit"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Delete, L("Permission:DynamicAssets.Delete"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Publish, L("Permission:DynamicAssets.Publish"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.ViewResponses, L("Permission:DynamicAssets.ViewResponses"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Export, L("Permission:DynamicAssets.Export"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.ManageCategories, L("Permission:DynamicAssets.ManageCategories"));

        // ============================================================
        // SİSTEM & ENTEGRASYON
        // ============================================================
        var systemGroup = context.AddGroup(PlatformPermissions.Groups.System, L("Permission:Group:System"));

        systemGroup.AddPermission(PlatformPermissions.Notifications.Default, L("Permission:Notifications"));

        var calendarsPermission = systemGroup.AddPermission(PlatformPermissions.Calendars.Default, L("Permission:Calendars"));
        calendarsPermission.RequireFeatures(PlatformFeatures.Calendar);
        calendarsPermission.AddChild(PlatformPermissions.Calendars.Connect, L("Permission:Calendars.Connect"));

        var tenantSettingsPermission = systemGroup.AddPermission(PlatformPermissions.TenantSettings.Default, L("Permission:TenantSettings"));
        tenantSettingsPermission.AddChild(PlatformPermissions.TenantSettings.ManageAi, L("Permission:TenantSettings.ManageAi"));

        // Geri bildirim YÖNETİMİ (gönderme izin gerektirmez, bkz. PlatformPermissions.Feedbacks).
        // Feature'a bağlanmadı: geri bildirim her pakette açık olmalı.
        var feedbacksPermission = systemGroup.AddPermission(PlatformPermissions.Feedbacks.Default, L("Permission:Feedbacks"));
        feedbacksPermission.AddChild(PlatformPermissions.Feedbacks.Respond, L("Permission:Feedbacks.Respond"));
        feedbacksPermission.AddChild(PlatformPermissions.Feedbacks.Assign, L("Permission:Feedbacks.Assign"));
        feedbacksPermission.AddChild(PlatformPermissions.Feedbacks.Delete, L("Permission:Feedbacks.Delete"));
        feedbacksPermission.AddChild(PlatformPermissions.Feedbacks.Export, L("Permission:Feedbacks.Export"));
        feedbacksPermission.AddChild(PlatformPermissions.Feedbacks.ManageSettings, L("Permission:Feedbacks.ManageSettings"));

        // Giriş ekranı yapılandırması — host seviyesinde tek izin, alt izni yok.
        systemGroup.AddPermission(PlatformPermissions.LoginScreen.Default, L("Permission:LoginScreen"));

        var systemHealthPermission = systemGroup.AddPermission(PlatformPermissions.SystemHealth.Default, L("Permission:SystemHealth"));
        systemHealthPermission.AddChild(PlatformPermissions.SystemHealth.Resolve, L("Permission:SystemHealth.Resolve"));

        // Sinyalden göreve köprüsü — geri bildirim/hata kaydını host projesinde göreve dönüştürme.
        var issueTasksPermission = systemGroup.AddPermission(PlatformPermissions.IssueTasks.Default, L("Permission:IssueTasks"));
        issueTasksPermission.AddChild(PlatformPermissions.IssueTasks.ManageSettings, L("Permission:IssueTasks.ManageSettings"));

        // Rıza/KVKK analiz paneli — host/yönetici seviyesinde tek izin, alt izni yok.
        systemGroup.AddPermission(PlatformPermissions.Consents.Default, L("Permission:Consents"));

        // Kayıt talepleri — giriş ekranından gelen talepler HOST kaydıdır; kiracıya
        // ait değildir, bu yüzden feature kapısı yoktur.
        var registrationRequestsPermission = systemGroup.AddPermission(PlatformPermissions.RegistrationRequests.Default, L("Permission:RegistrationRequests"));
        registrationRequestsPermission.AddChild(PlatformPermissions.RegistrationRequests.Manage, L("Permission:RegistrationRequests.Manage"));

        // Sürüm notu yayın onayı — karar TÜM kiracılar için tektir ve host bağlamında
        // verilir; kiracı yöneticisine sızmasın diye MultiTenancySides.Host.
        systemGroup.AddPermission(
            PlatformPermissions.ReleaseNotes.Manage,
            L("Permission:ReleaseNotes.Manage"),
            MultiTenancySides.Host);
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}