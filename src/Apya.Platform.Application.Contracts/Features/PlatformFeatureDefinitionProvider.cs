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
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}
