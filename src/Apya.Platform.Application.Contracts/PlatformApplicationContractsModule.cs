using Apya.Platform.Features;
using Volo.Abp.Account;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform;

[DependsOn(
    typeof(PlatformDomainSharedModule),
    typeof(AbpAccountApplicationContractsModule),
    typeof(AbpFeatureManagementApplicationContractsModule),
    typeof(AbpIdentityApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationContractsModule),
    typeof(AbpSettingManagementApplicationContractsModule),
    typeof(AbpTenantManagementApplicationContractsModule),
    typeof(AbpObjectExtendingModule)
)]
public class PlatformApplicationContractsModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PlatformDtoExtensions.Configure();
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // EN SONA eklenir: feature değer zinciri ters sırayla sorulur, yani host sağlayıcısı
        // tenant/edition/default'tan ÖNCE söz alır. Bkz. HostFeatureValueProvider.
        Configure<AbpFeatureOptions>(options =>
        {
            options.ValueProviders.Add<HostFeatureValueProvider>();
        });
    }
}
