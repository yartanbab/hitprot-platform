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
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
