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
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
