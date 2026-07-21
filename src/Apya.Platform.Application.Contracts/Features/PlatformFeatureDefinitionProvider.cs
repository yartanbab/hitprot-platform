using Apya.Platform.Localization;
using Volo.Abp.Features;
using Volo.Abp.Localization;
using Volo.Abp.Validation.StringValues;

namespace Apya.Platform.Features;

public class PlatformFeatureDefinitionProvider : FeatureDefinitionProvider
{
    public override void Define(IFeatureDefinitionContext context)
    {
        var group = context.AddGroup(PlatformFeatures.GroupName, L("Feature:Platform"));

        group.AddFeature(
            PlatformFeatures.AiAssist,
            defaultValue: "false",
            displayName: L("Feature:Platform:AiAssist"),
            description: L("Feature:Platform:AiAssist:Description"),
            valueType: new ToggleStringValueType());

        group.AddFeature(
            PlatformFeatures.MultiCurrency,
            defaultValue: "true",
            displayName: L("Feature:Platform:MultiCurrency"),
            description: L("Feature:Platform:MultiCurrency:Description"),
            valueType: new ToggleStringValueType());

        group.AddFeature(
            PlatformFeatures.AdvancedReports,
            defaultValue: "false",
            displayName: L("Feature:Platform:AdvancedReports"),
            description: L("Feature:Platform:AdvancedReports:Description"),
            valueType: new ToggleStringValueType());

        // ── Paket yetenek kapıları (defaultValue "true": host + paketsiz tenant bozulmasın;
        //    paketler düşük tier'larda KAPATIR. Bkz. PackageDefinitions) ──
        group.AddFeature(PlatformFeatures.Grants, defaultValue: "true",
            displayName: L("Feature:Platform:Grants"), valueType: new ToggleStringValueType());
        group.AddFeature(PlatformFeatures.Finance, defaultValue: "true",
            displayName: L("Feature:Platform:Finance"), valueType: new ToggleStringValueType());
        group.AddFeature(PlatformFeatures.Documents, defaultValue: "true",
            displayName: L("Feature:Platform:Documents"), valueType: new ToggleStringValueType());
        group.AddFeature(PlatformFeatures.Forms, defaultValue: "true",
            displayName: L("Feature:Platform:Forms"), valueType: new ToggleStringValueType());
        group.AddFeature(PlatformFeatures.Calendar, defaultValue: "true",
            displayName: L("Feature:Platform:Calendar"), valueType: new ToggleStringValueType());

        // ── Sayısal limitler (defaultValue yüksek: host/paketsiz ≈ sınırsız) ──
        group.AddFeature(PlatformFeatures.MaxUsers, defaultValue: "100000",
            displayName: L("Feature:Platform:MaxUsers"), valueType: new FreeTextStringValueType());
        group.AddFeature(PlatformFeatures.MaxProjects, defaultValue: "100000",
            displayName: L("Feature:Platform:MaxProjects"), valueType: new FreeTextStringValueType());
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
