using Apya.Platform.IssueTasks;
using Apya.Platform.Localization;
using Volo.Abp.Localization;
using Volo.Abp.Settings;

namespace Apya.Platform.Settings;

public class PlatformSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        // Uygulama genelinde varsayılan dili Türkçe yap. Bu, dil seçicinin ve
        // setting-temelli varsayılan kültürün de "tr" olmasını sağlar (WebModule'daki
        // DefaultRequestCulture'ı tamamlar). Kullanıcı/kiracı yine override edebilir.
        var defaultLanguage = context.GetOrNull(LocalizationSettingNames.DefaultLanguage);
        if (defaultLanguage != null)
        {
            defaultLanguage.DefaultValue = "tr";
        }

        // --- Kullanıcı arayüz tercihleri ---
        // Kullanıcıya özel: .WithProviders() ile KISITLANMAZ ki User provider zincirde
        // kalsın (SetForCurrentUserAsync buraya yazar). Böylece DefaultValueSettingValueProvider
        // de zincirde kalır ve "v2" varsayılanı sorunsuz döner.
        context.Add(
            new SettingDefinition(
                PlatformSettings.TaskDetail.Ui,
                defaultValue: PlatformSettingDefaults.TaskDetailUi,
                displayName: L("Setting:TaskDetail.Ui"),
                description: L("Setting:TaskDetail.Ui.Description"))
        );

        // Projeler ekranı açılış görünümü — TaskDetail.Ui ile aynı ray (kullanıcı seviyesi).
        context.Add(
            new SettingDefinition(
                PlatformSettings.Projects.DefaultView,
                defaultValue: PlatformSettingDefaults.ProjectsDefaultView,
                displayName: L("Setting:Projects.DefaultView"),
                description: L("Setting:Projects.DefaultView.Description"))
        );

        // Proje görev paneli (sağdan açılan drawer) — DefaultView ile aynı ray.
        // Varsayılan KAPALI ("false"): şimdilik gizli, kullanıcı ayardan açar.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Projects.DetailPanel,
                defaultValue: PlatformSettingDefaults.ProjectsDetailPanel.ToString().ToLowerInvariant(),
                displayName: L("Setting:Projects.DetailPanel"),
                description: L("Setting:Projects.DetailPanel.Description"))
        );

        // Gizlenen sistem kategorileri — kiracı seviyesi, virgülle ayrık Id listesi.
        // Boş varsayılan = hiçbiri gizli değil.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Projects.HiddenCategories,
                defaultValue: "",
                displayName: L("Setting:Projects.HiddenCategories"),
                description: L("Setting:Projects.HiddenCategories.Description"))
        );

        // Görev oluşturma modalının ekstraları — Projects.DetailPanel ile aynı ray.
        // .WithProviders() ile KISITLANMAZ: DefaultMode/ShowKeyboardHints kullanıcı
        // seviyesinde yazılır, ShowInfoBanner kiracı seviyesinde; ikisi de zincirde
        // DefaultValueSettingValueProvider'a düşebilmeli.
        context.Add(
            new SettingDefinition(
                PlatformSettings.TaskCreate.DefaultMode,
                defaultValue: PlatformSettingDefaults.TaskCreateDefaultMode,
                displayName: L("Setting:TaskCreate.DefaultMode"),
                description: L("Setting:TaskCreate.DefaultMode.Description")),

            new SettingDefinition(
                PlatformSettings.TaskCreate.ShowKeyboardHints,
                defaultValue: PlatformSettingDefaults.TaskCreateShowKeyboardHints.ToString().ToLowerInvariant(),
                displayName: L("Setting:TaskCreate.ShowKeyboardHints"),
                description: L("Setting:TaskCreate.ShowKeyboardHints.Description")),

            new SettingDefinition(
                PlatformSettings.TaskCreate.ShowInfoBanner,
                defaultValue: PlatformSettingDefaults.TaskCreateShowInfoBanner.ToString().ToLowerInvariant(),
                displayName: L("Setting:TaskCreate.ShowInfoBanner"),
                description: L("Setting:TaskCreate.ShowInfoBanner.Description"))
        );

        // Takvim günlük kapasitesi — Projects.DefaultView ile aynı ray (kullanıcı seviyesi).
        // .WithProviders() ile KISITLANMAZ: hem User provider zincirde kalsın hem de
        // varsayılan (8 sa) DefaultValueSettingValueProvider'dan dönebilsin.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Calendar.DailyCapacityHours,
                defaultValue: PlatformSettingDefaults.CalendarDailyCapacityHours,
                displayName: L("Setting:Calendar.DailyCapacityHours"),
                description: L("Setting:Calendar.DailyCapacityHours.Description"))
        );

        // Kurulum sihirbazı bayrağı ve kaynak seçimi — kullanıcı seviyesi iç değerler
        // (ayar ekranında GÖSTERİLMEZ; takvimin kendi kurulum akışı yazar).
        // Dokümanlar kurulum sihirbazı — Calendar.SetupCompleted ile aynı ray, ama
        // KİRACI seviyesinde yazılır (klasör şeması kiracının tamamına kurulur).
        // .WithProviders() ile KISITLANMAZ: hem Tenant provider zincirde kalsın hem
        // de "false" varsayılanı dönebilsin.
        context.Add(new SettingDefinition(PlatformSettings.Documents.SetupCompleted, defaultValue: "false"));
        context.Add(new SettingDefinition(PlatformSettings.Documents.SetupSchema, defaultValue: ""));

        context.Add(new SettingDefinition(PlatformSettings.Calendar.SetupCompleted, defaultValue: "false"));
        context.Add(new SettingDefinition(PlatformSettings.Calendar.Sources, defaultValue: ""));

        // İlk giriş tanıtım turu — Calendar.SetupCompleted ile aynı ray: kullanıcı
        // seviyesi iç bayrak, ayar ekranında GÖSTERİLMEZ. .WithProviders() ile
        // KISITLANMAZ ki hem User provider zincirde kalsın (SetForCurrentUserAsync
        // buraya yazar) hem de "false" varsayılanı zincirden dönebilsin.
        context.Add(new SettingDefinition(PlatformSettings.Tour.Completed, defaultValue: "false"));

        // Çerez bilgilendirme şeridinin "Anladım" onayı — Tour.Completed ile aynı
        // ray: kullanıcı seviyesi iç bayrak, ayar ekranında GÖSTERİLMEZ.
        // .WithProviders() ile KISITLANMAZ ki User provider zincirde kalsın
        // (SetForCurrentUserAsync buraya yazar) ve "false" varsayılanı dönebilsin.
        context.Add(new SettingDefinition(PlatformSettings.CookieNotice.Acknowledged, defaultValue: "false"));

        // Sürüm notları "en son görülen sürüm" — kullanıcı seviyesi iç değer (ayar ekranında GÖSTERİLMEZ).
        // Boş varsayılan = hiç görmedi → ilk açılışta "Yenilikler" penceresi açılır.
        context.Add(
            new SettingDefinition(
                PlatformSettings.ReleaseNotes.LastSeenVersion,
                defaultValue: "")
        );

        // Sabitlenen menü öğeleri — TaskDetail.Ui ile aynı ray: .WithProviders()
        // ile KISITLANMAZ ki User provider zincirde kalsın (SetForCurrentUserAsync
        // buraya yazar) ve varsayılan da zincirden dönebilsin.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Shell.Pins,
                defaultValue: PlatformSettingDefaults.ShellPins,
                displayName: L("Setting:Shell.Pins"),
                description: L("Setting:Shell.Pins.Description"))
        );

        // Kayıtlı görünümler — Pins ile aynı ray (kullanıcı seviyesi, JSON değer).
        context.Add(
            new SettingDefinition(
                PlatformSettings.Shell.SavedViews,
                defaultValue: PlatformSettingDefaults.ShellSavedViews,
                displayName: L("Setting:Shell.SavedViews"),
                description: L("Setting:Shell.SavedViews.Description"))
        );

        // Kenar çubuğu düzeni — SavedViews ile aynı ray (kullanıcı seviyesi, JSON değer).
        context.Add(
            new SettingDefinition(
                PlatformSettings.Shell.MenuLayout,
                defaultValue: PlatformSettingDefaults.ShellMenuLayout,
                displayName: L("Setting:Shell.MenuLayout"),
                description: L("Setting:Shell.MenuLayout.Description"))
        );

        // Pano sekmeleri — MenuLayout ile aynı ray (kullanıcı seviyesi, JSON değer).
        context.Add(
            new SettingDefinition(
                PlatformSettings.Shell.BoardTabs,
                defaultValue: PlatformSettingDefaults.ShellBoardTabs,
                displayName: L("Setting:Shell.BoardTabs"),
                description: L("Setting:Shell.BoardTabs.Description"))
        );

        // --- Telemetri ---
        // Global (host) ayarları: tenant'lar değiştiremez.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Telemetry.Enabled,
                defaultValue: "true",
                displayName: L("Setting:Telemetry.Enabled"),
                description: L("Setting:Telemetry.Enabled.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Telemetry.RetentionDays,
                defaultValue: "90",
                displayName: L("Setting:Telemetry.RetentionDays"),
                description: L("Setting:Telemetry.RetentionDays.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );

        // --- Satış paketi bedelleri --- (host seviyesinde)
        // Varsayılan "0" = TANIMLI DEĞİL. Uydurulmuş bir rakamın sözleşmeye geçmesindense
        // alanın boş kalması yeğdir; host onay ekranında elle girer.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Pricing.StandardPlan,
                defaultValue: "0",
                displayName: L("Setting:Pricing.StandardPlan"),
                description: L("Setting:Pricing.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Pricing.CorporatePlan,
                defaultValue: "0",
                displayName: L("Setting:Pricing.CorporatePlan"),
                description: L("Setting:Pricing.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Pricing.JointPlan,
                defaultValue: "0",
                displayName: L("Setting:Pricing.JointPlan"),
                description: L("Setting:Pricing.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );

        // --- Giriş ekranı --- (host seviyesinde)
        // isVisibleToClients: giriş sayfası oturumsuz render edilir; ayar Global
        // provider'dan anonim de okunabilir.
        context.Add(
            new SettingDefinition(
                PlatformSettings.Account.ShowTenantSwitch,
                defaultValue: PlatformSettingDefaults.AccountShowTenantSwitch.ToString().ToLowerInvariant(),
                displayName: L("Setting:Account.ShowTenantSwitch"),
                description: L("Setting:Account.ShowTenantSwitch.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Account.ShowSocialLogin,
                defaultValue: PlatformSettingDefaults.AccountShowSocialLogin.ToString().ToLowerInvariant(),
                displayName: L("Setting:Account.ShowSocialLogin"),
                description: L("Setting:Account.ShowSocialLogin.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );

        // --- Geri bildirim modülü --- (hepsi host seviyesinde)
        context.Add(
            new SettingDefinition(
                PlatformSettings.Feedback.TriggerEnabled,
                defaultValue: PlatformSettingDefaults.FeedbackTriggerEnabled.ToString().ToLowerInvariant(),
                displayName: L("Setting:Feedback.TriggerEnabled"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.TriggerPlacement,
                defaultValue: PlatformSettingDefaults.FeedbackTriggerPlacement,
                displayName: L("Setting:Feedback.TriggerPlacement"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.EnabledTypes,
                defaultValue: "",
                displayName: L("Setting:Feedback.EnabledTypes"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.MaxFileSizeMb,
                defaultValue: PlatformSettingDefaults.FeedbackMaxFileSizeMb.ToString(),
                displayName: L("Setting:Feedback.MaxFileSizeMb"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.AllowedFileExtensions,
                defaultValue: PlatformSettingDefaults.FeedbackAllowedExtensions,
                displayName: L("Setting:Feedback.AllowedFileExtensions"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.AllowAnonymous,
                defaultValue: PlatformSettingDefaults.FeedbackAllowAnonymous.ToString().ToLowerInvariant(),
                displayName: L("Setting:Feedback.AllowAnonymous"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Feedback.AttachmentRetentionDays,
                defaultValue: PlatformSettingDefaults.FeedbackAttachmentRetentionDays.ToString(),
                displayName: L("Setting:Feedback.AttachmentRetentionDays"),
                description: L("Setting:Feedback.AttachmentRetentionDays.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );

        // --- Sinyalden göreve köprüsü --- (hepsi host seviyesinde)
        context.Add(
            new SettingDefinition(
                PlatformSettings.IssueTasks.TargetProjectId,
                defaultValue: "",
                displayName: L("Setting:IssueTasks.TargetProjectId"),
                description: L("Setting:IssueTasks.TargetProjectId.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.DefaultAssigneeId,
                defaultValue: "",
                displayName: L("Setting:IssueTasks.DefaultAssigneeId"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.AutoCreateEnabled,
                defaultValue: PlatformSettingDefaults.IssueTaskAutoCreateEnabled.ToString().ToLowerInvariant(),
                displayName: L("Setting:IssueTasks.AutoCreateEnabled"),
                description: L("Setting:IssueTasks.AutoCreateEnabled.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.FeedbackMinPriority,
                defaultValue: PlatformSettingDefaults.IssueTaskFeedbackMinPriority.ToString(),
                displayName: L("Setting:IssueTasks.FeedbackMinPriority"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.ClientErrorThreshold,
                defaultValue: IssueTaskConsts.DefaultClientErrorThreshold.ToString(),
                displayName: L("Setting:IssueTasks.ClientErrorThreshold"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.ServerErrorThreshold,
                defaultValue: IssueTaskConsts.DefaultServerErrorThreshold.ToString(),
                displayName: L("Setting:IssueTasks.ServerErrorThreshold"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.IssueTasks.CloseSourceOnTaskDone,
                defaultValue: PlatformSettingDefaults.IssueTaskCloseSourceOnTaskDone.ToString().ToLowerInvariant(),
                displayName: L("Setting:IssueTasks.CloseSourceOnTaskDone"),
                description: L("Setting:IssueTasks.CloseSourceOnTaskDone.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );

        // --- Paket süresi / abonelik --- (hepsi host seviyesinde)
        context.Add(
            new SettingDefinition(
                PlatformSettings.Subscription.AutoDowngradeEnabled,
                defaultValue: PlatformSettingDefaults.SubscriptionAutoDowngradeEnabled.ToString().ToLowerInvariant(),
                displayName: L("Setting:Subscription.AutoDowngradeEnabled"),
                description: L("Setting:Subscription.AutoDowngradeEnabled.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Subscription.GraceDays,
                defaultValue: PlatformSettingDefaults.SubscriptionGraceDays.ToString(),
                displayName: L("Setting:Subscription.GraceDays"),
                description: L("Setting:Subscription.GraceDays.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Subscription.WarningDays,
                defaultValue: PlatformSettingDefaults.SubscriptionWarningDays,
                displayName: L("Setting:Subscription.WarningDays"),
                description: L("Setting:Subscription.WarningDays.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            // Yükseltme kanalı: host doldurur, KİRACI okur. Provider Global kalır (kiracı
            // değiştiremez) ama okuma tenant bağlamında da çalışır — Global zincirdedir.
            new SettingDefinition(
                PlatformSettings.Subscription.UpgradeContactEmail,
                displayName: L("Setting:Subscription.UpgradeContactEmail"),
                description: L("Setting:Subscription.UpgradeContactEmail.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Subscription.UpgradeContactPhone,
                displayName: L("Setting:Subscription.UpgradeContactPhone"),
                description: L("Setting:Subscription.UpgradeContactPhone.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName),

            new SettingDefinition(
                PlatformSettings.Subscription.UpgradeUrl,
                displayName: L("Setting:Subscription.UpgradeUrl"),
                description: L("Setting:Subscription.UpgradeUrl.Description"))
                .WithProviders(GlobalSettingValueProvider.ProviderName)
        );
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
