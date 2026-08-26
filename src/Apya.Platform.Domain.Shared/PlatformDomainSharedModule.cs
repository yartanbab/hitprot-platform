using Apya.Platform.Localization;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.Localization;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace Apya.Platform;

[DependsOn(
    typeof(AbpAuditLoggingDomainSharedModule),
    typeof(AbpBackgroundJobsDomainSharedModule),
    typeof(AbpFeatureManagementDomainSharedModule),
    typeof(AbpIdentityDomainSharedModule),
    typeof(AbpOpenIddictDomainSharedModule),
    typeof(AbpPermissionManagementDomainSharedModule),
    typeof(AbpSettingManagementDomainSharedModule),
    typeof(AbpTenantManagementDomainSharedModule)    
    )]
public class PlatformDomainSharedModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PlatformGlobalFeatureConfigurator.Configure();
        PlatformModuleExtensionConfigurator.Configure();
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // Performans eşikleri (yavaş istek/sorgu logu + dashboard cache TTL).
        // En alt katmanda bağlanır ki EFCore, Application ve Web aynı seçenekleri tüketsin.
        var configuration = context.Services.GetConfiguration();
        Configure<PlatformPerformanceOptions>(configuration.GetSection(PlatformPerformanceOptions.SectionName));

        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<PlatformDomainSharedModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<PlatformResource>("tr")
                .AddBaseTypes(typeof(AbpValidationResource))
                .AddVirtualJson("/Localization/Platform");

            options.DefaultResourceType = typeof(PlatformResource);

            // ABP'nin TR çevirisinde kiracı = "Müşteri" ("Müşteri yönetimi", "Müşteriler");
            // platformda "Müşteri/Cari" ayrı bir domain (Customers) olduğu için karışıyordu.
            // Sonradan eklenen contributor öncekini ezer → yalnızca aşağıdaki anahtarlar değişir.
            options.Resources
                .Get<AbpTenantManagementResource>()
                .AddVirtualJson("/Localization/TenantManagement");

            // Doğrulama mesajı şablonları ABP'nin KENDİ kaynağında ezilir, PlatformResource'ta
            // değil: Account/Identity/TenantManagement gibi ABP modül sayfaları kendi
            // localizer'larını kullanır ve PlatformResource'a hiç bakmaz. Şablon orada
            // olmazsa aynı hata iki farklı üslupla çıkar ("... alanı zorunludur." ve
            // "... boş bırakılamaz."). Buraya konunca tüm modüller tek ifadeyi paylaşır;
            // PlatformResource da AbpValidationResource'u temel aldığı için oradan alır.
            options.Resources
                .Get<AbpValidationResource>()
                .AddVirtualJson("/Localization/Validation");
        });

        Configure<AbpExceptionLocalizationOptions>(options =>
        {
            options.MapCodeNamespace("Platform", typeof(PlatformResource));

            // BusinessException kodlarının ilk parçası (":" öncesi) burada eşlenmezse
            // ABP çeviriyi HİÇ aramaz ve kullanıcıya "Sayfa işlenirken sunucu tarafında
            // beklenmedik bir hata oluştu!" döner. "Apya:BoardColumn:*" ve "Project:*"
            // kodları bu yüzden ekrana çıkmıyordu.
            options.MapCodeNamespace("Apya", typeof(PlatformResource));
            options.MapCodeNamespace("Project", typeof(PlatformResource));
        });
    }
}
