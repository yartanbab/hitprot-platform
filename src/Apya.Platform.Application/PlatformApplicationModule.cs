using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;

namespace Apya.Platform;

[DependsOn(
    typeof(PlatformDomainModule),
    typeof(PlatformApplicationContractsModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpAutoMapperModule) // <-- Bu modülün ekli olduğundan emin oluyoruz
    )]
public class PlatformApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // APYA-147 (BUG-A): IHttpClientFactory kaydı — ExchangeRateAppService TCMB
        // senkronu için inject ediyor; kayıt olmadan tüm servis construct edilemiyor (500).
        context.Services.AddHttpClient();

        // Webhook teslimatları: varsayılan 100 sn timeout, ResendDeliveryAsync web isteği
        // içinde senkron çalıştığı için asılı bir hedef URL kullanıcıyı o kadar bekletir.
        // SEC-011: SSRF savunması — ConnectCallback bağlantı anında çözülen IP'yi denetler
        // (DNS-rebinding'e karşı; her redirect için de çalışır) + auto-redirect kapalı
        // (redirect'le iç adrese sıçramayı engeller).
        context.Services.AddHttpClient("WebhookClient", client =>
        {
            client.Timeout = System.TimeSpan.FromSeconds(15);
        })
        .ConfigurePrimaryHttpMessageHandler(() => new System.Net.Http.SocketsHttpHandler
        {
            AllowAutoRedirect = false,
            ConnectCallback = Apya.Platform.DynamicAssets.Webhooks.WebhookUrlGuard.GuardedConnectAsync
        });

        Configure<AbpAutoMapperOptions>(options =>
        {
            // PROJE İÇİNDEKİ MAPPING PROFİLLERİNİ TARA VE YÜKLE
            options.AddMaps<PlatformApplicationModule>();
        });

        // GAP-011: ABAC İzin Yönetimi Entegrasyonu
        Configure<Volo.Abp.Authorization.Permissions.AbpPermissionOptions>(options =>
        {
            options.ValueProviders.Add<Apya.Platform.Permissions.AiAttributePermissionValueProvider>();
        });

        // Paket izin tavanı: TÜM izin tanımlarına uygulanır (host muaf).
        // Bkz. Apya.Platform.Tenants.PackagePermissionStateChecker.
        Configure<Volo.Abp.SimpleStateChecking.AbpSimpleStateCheckerOptions<Volo.Abp.Authorization.Permissions.PermissionDefinition>>(options =>
        {
            options.GlobalStateCheckers.Add<Apya.Platform.Tenants.PackagePermissionStateChecker>();
        });
    }
}