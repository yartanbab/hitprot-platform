using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp;
using Apya.Platform.MultiTenancy;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Emailing;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.OpenIddict;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.PermissionManagement.OpenIddict;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Volo.Abp.BackgroundWorkers;
using Apya.Platform.Tasks;
using Apya.Platform.Documents;
using System.Threading.Tasks;

namespace Apya.Platform;

[DependsOn(
    typeof(PlatformDomainSharedModule),
    typeof(AbpAuditLoggingDomainModule),
    typeof(AbpBackgroundJobsDomainModule),
    typeof(AbpBackgroundWorkersModule),
    typeof(AbpFeatureManagementDomainModule),
    typeof(AbpIdentityDomainModule),
    typeof(AbpOpenIddictDomainModule),
    typeof(AbpPermissionManagementDomainOpenIddictModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(AbpSettingManagementDomainModule),
    typeof(AbpTenantManagementDomainModule),
    typeof(AbpEmailingModule)
)]
public class PlatformDomainModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // NTF-08 · VAPID anahtarları: açık anahtar yapılandırmadan, özel anahtar sırlardan / ortamdan.
        Configure<Apya.Platform.Notifications.WebPushOptions>(
            context.Services.GetConfiguration().GetSection("WebPush"));

        // N-02 · Arka plan iş kuyruğu (push, kritik e-posta) saniyede bir yoklanır; ABP varsayılanı 5 sn idi
        // ve bildirim kilit ekranına 5 sn'ye kadar gecikiyordu. Sorgu hafif (dizinli NextTryTime).
        Configure<Volo.Abp.BackgroundJobs.AbpBackgroundJobWorkerOptions>(options => options.JobPollPeriod = 1000);

        // Dil seçicide yalnız platform çevirisi olan diller durur (X-05). Şablondan gelen öbür 16 dilin
        // dosyasında 5 anahtar vardı; o dili seçen ekranın neredeyse tamamını Türkçe görüyordu. Yeni dil,
        // çevirisiyle birlikte eklenir — LanguageSelector_Tests eşiği ölçer.
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Languages.Add(new LanguageInfo("en", "en", "English"));
            options.Languages.Add(new LanguageInfo("tr", "tr", "Türkçe"));
        });

        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = MultiTenancyConsts.IsEnabled;
        });

        // Şifrelerin baş/son boşluğunu kırpan UserManager. Bkz. ApyaIdentityUserManager.
        // İki kayıt birden değiştirilir: SignInManager (yani giriş) UserManager<IdentityUser>'ı,
        // ABP'nin kendi servisleri IdentityUserManager'ı ister. ASP.NET Identity ikisini aynı
        // örneğe bağlar (AddUserManager); o düzeni bozmuyoruz, yalnızca sınıfı değiştiriyoruz.
        context.Services.Replace(
            ServiceDescriptor.Scoped<Microsoft.AspNetCore.Identity.UserManager<IdentityUser>, Identity.ApyaIdentityUserManager>());
        context.Services.Replace(
            ServiceDescriptor.Scoped<IdentityUserManager>(
                sp => (IdentityUserManager)sp.GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<IdentityUser>>()));

#if DEBUG
        context.Services.Replace(ServiceDescriptor.Singleton<IEmailSender, NullEmailSender>());
#endif
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        context.AddBackgroundWorkerAsync<TaskDeadlineWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Projects.ProjectEndDateReminderWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Projects.ProjectIndicatorBehindWorker>();
        context.AddBackgroundWorkerAsync<DocumentExpiryWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Documents.DocumentFileExpiryWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Telemetry.TelemetryRetentionWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Notifications.NotificationDigestWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Notifications.NotificationCleanupWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Macros.MacroUsageCleanupWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.IssueTasks.IssueTaskAutomationWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Grants.GrantDeadlineReminderWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Grants.GrantIdeaInvitationReminderWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Grants.GrantCallAnnouncementWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Grants.GrantEscalationWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Invoices.InvoiceOverdueWorker>(); // B-16
    }
}
