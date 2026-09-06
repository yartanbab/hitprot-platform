using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.RateLimiting;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Volo.Abp.MultiTenancy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.RequestLocalization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Volo.Abp.Emailing;
using Microsoft.Extensions.Hosting;
using Apya.Platform.EntityFrameworkCore;
using Apya.Platform.Localization;
using Apya.Platform.MultiTenancy;
using Apya.Platform.Web.Menus;
using Apya.Platform.Web.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.OpenApi.Models;
using OpenIddict.Validation.AspNetCore;
using Volo.Abp;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.SignalR;
using Volo.Abp.AspNetCore.Mvc.Localization;
using Volo.Abp.AspNetCore.Mvc.UI;
using Volo.Abp.AspNetCore.Mvc.UI.Bootstrap;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Toolbars;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity.Web;
using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy.Localization;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.Web;
using Volo.Abp.Security.Claims;
using Volo.Abp.SettingManagement.Web;
using Volo.Abp.Swashbuckle;
using Volo.Abp.TenantManagement.Web;
using Volo.Abp.OpenIddict;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.UI;
using Volo.Abp.UI.Navigation;
using Volo.Abp.VirtualFileSystem;

namespace Apya.Platform.Web;

[DependsOn(
    typeof(PlatformHttpApiModule),
    typeof(PlatformApplicationModule),
    typeof(PlatformEntityFrameworkCoreModule),
    typeof(Apya.Platform.Ai.PlatformAiHttpApiModule),
    typeof(Apya.Platform.Ai.PlatformAiApplicationModule),
    typeof(Apya.Platform.Ai.PlatformAiEntityFrameworkCoreModule),
    typeof(AbpAutofacModule),
    typeof(AbpIdentityWebModule),
    typeof(AbpSettingManagementWebModule),
    typeof(AbpAccountWebOpenIddictModule),
    typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule),
    typeof(AbpAspNetCoreSignalRModule),
    typeof(AbpTenantManagementWebModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpSwashbuckleModule)
    )]
public class PlatformWebModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        context.Services.PreConfigure<AbpMvcDataAnnotationsLocalizationOptions>(options =>
        {
            options.AddAssemblyResource(
                typeof(PlatformResource),
                typeof(PlatformDomainModule).Assembly,
                typeof(PlatformDomainSharedModule).Assembly,
                typeof(PlatformApplicationModule).Assembly,
                typeof(PlatformApplicationContractsModule).Assembly,
                typeof(PlatformWebModule).Assembly
            );
        });

        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                options.AddAudiences("Platform");
                options.UseLocalServer();
                options.UseAspNetCore();
            });
        });

        if (!hostingEnvironment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                // ARCH-008: Cert password must come from User Secrets / appsettings.secrets.json,
                // never hardcoded. Source-controlled secret = key leak via repo clone.
                // Fail-fast in non-dev — silent fallback to a default would be worse.
                var certificatePassword = configuration["OpenIddict:CertificatePassword"];
                if (string.IsNullOrWhiteSpace(certificatePassword))
                {
                    throw new InvalidOperationException(
                        "OpenIddict:CertificatePassword yapılandırmada eksik. " +
                        "Production'da openiddict.pfx açılamaz; lütfen User Secrets veya " +
                        "appsettings.secrets.json üzerinden sağlayın. Detay: ARCH-008.");
                }
                var certificate = LoadOpenIddictCertificate(certificatePassword);
                serverBuilder.AddEncryptionCertificate(certificate);
                serverBuilder.AddSigningCertificate(certificate);
            });
        }
    }

    /// <summary>
    /// OpenIddict imzalama/şifreleme sertifikasını paylaşımlı Windows hosting'de de açılacak
    /// biçimde yükler.
    ///
    /// İki ayrı tuzak var, ikisi de aynı yanıltıcı hatayı verir
    /// (<c>CryptographicException: The system cannot find the file specified</c>) ve dışarıdan
    /// ANCM 502.5 olarak görünür:
    ///
    /// 1. <b>Yol:</b> göreli "openiddict.pfx" çalışma dizinine göre çözülür; IIS/ANCM altında
    ///    çalışma dizini site kökü olmayabilir. Bu yüzden <see cref="AppContext.BaseDirectory"/>
    ///    ile MUTLAK yol kullanılır.
    /// 2. <b>Anahtar deposu:</b> varsayılan (UserKeySet) özel anahtarı uygulama havuzu kimliğinin
    ///    profil deposuna yazar; "Load User Profile" kapalıysa o depo yoktur. MachineKeySet makine
    ///    deposuna yazma izni ister, EphemeralKeySet ise bazı ortamlarda desteklenmez.
    ///
    /// Hangisinin çalışacağı sunucuya göre değiştiği için seçenekler SIRAYLA denenir; ilk başarılı
    /// olan kullanılır. Hiçbiri olmazsa her denemenin hatası tek mesajda toplanır — böylece log
    /// tek turda teşhis verir, deneme-yanılma turu gerekmez.
    /// </summary>
    private static X509Certificate2 LoadOpenIddictCertificate(string password)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "openiddict.pfx");
        if (!File.Exists(path))
        {
            throw new InvalidOperationException(
                $"openiddict.pfx bulunamadı: {path} — sertifikayı uygulamanın yanına koyun.");
        }

        var attempts = new[]
        {
            X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet | X509KeyStorageFlags.Exportable,
            X509KeyStorageFlags.MachineKeySet,
            X509KeyStorageFlags.EphemeralKeySet,
            X509KeyStorageFlags.UserKeySet | X509KeyStorageFlags.PersistKeySet,
            X509KeyStorageFlags.DefaultKeySet
        };

        var failures = new List<string>();
        foreach (var flags in attempts)
        {
            try
            {
                return X509CertificateLoader.LoadPkcs12FromFile(path, password, flags);
            }
            catch (Exception ex)
            {
                failures.Add($"  - {flags}: {ex.GetType().Name}: {ex.Message}");
            }
        }

        throw new InvalidOperationException(
            $"openiddict.pfx hiçbir anahtar deposu seçeneğiyle açılamadı ({path}). " +
            "Parola yanlış olabilir ya da uygulama havuzunun anahtar deposuna erişimi yok. Denemeler:" +
            Environment.NewLine + string.Join(Environment.NewLine, failures));
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

#if DEBUG
        // Yerelde e-postayı DOSYAYA yaz (App_Data/mail-drop), sessizce yutma.
        // PlatformDomainModule DEBUG'da NullEmailSender kaydeder ve testler onu kullanır;
        // burası Web uygulaması için onu EZER. Web modülü Domain'e bağımlı olduğu için
        // ConfigureServices'i sonra koşar ve bu Replace kazanır.
        // Release derlemede iki kayıt da devrede olmaz; ABP'nin SMTP göndericisi çalışır.
        context.Services.Replace(
            ServiceDescriptor.Transient<IEmailSender, Apya.Platform.Web.Mailing.FileDropEmailSender>());
#endif

        // New configurations from the instruction
        // ConfigureMenus(context.Services.GetConfiguration()); // This method is not defined in the original code. Assuming it's a placeholder or needs to be added elsewhere.
        // ConfigureErrorPageOptions(); // This method is not defined in the original code. Assuming it's a placeholder or needs to be added elsewhere.

        // Türkçe varsayılan dil: culture çerezi/tercihi olmayan ziyaretçilerde uygulama Türkçe açılsın.
        // Kullanıcı dil seçiciyle yine değiştirebilir (cookie/AcceptLanguage override eder).
        // ABP'nin varsayılan configurator'ından SONRA eklendiği için DefaultRequestCulture'ı ezer.
        Configure<AbpRequestLocalizationOptions>(options =>
        {
            options.RequestLocalizationOptionConfigurators.Add((serviceProvider, requestLocalizationOptions) =>
            {
                requestLocalizationOptions.DefaultRequestCulture = new RequestCulture("tr", "tr");
                return Task.CompletedTask;
            });
        });

        // Layout Hook for Impersonation Alert + site-wide tema head (PWA + FOUC)
        Configure<Volo.Abp.Ui.LayoutHooks.AbpLayoutHookOptions>(options =>
        {
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.First, typeof(Apya.Platform.Web.Components.ImpersonationAlert.ImpersonationAlertViewComponent));
            // Body.Last: sidebar (#lpx-sidebar .lpx-logo-container) bu noktada DOM'da zaten
            // hazır → bileşenin kendi senkron script'i ilk paint'ten ÖNCE taşıyabiliyor
            // (bkz. TenantBadge/Default.cshtml). Body.First'te sidebar henüz yok, taşıma
            // jQuery ready'ye kalıyordu — bu da sidebar'ın anlık aşağı kaymasına sebep oluyordu.
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.Last, typeof(Apya.Platform.Web.Components.TenantBadge.TenantBadgeViewComponent));
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Head.Last, typeof(Apya.Platform.Web.Components.ApyaThemeHead.ApyaThemeHeadViewComponent));
            // Zorunlu çerez bilgilendirme şeridi — ack çerezi yoksa gösterilir (KVKK).
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.Last, typeof(Apya.Platform.Web.Components.CookieNotice.CookieNoticeViewComponent));
            // "Yenilikler" penceresi — kullanıcı en yeni sürümü görmediyse ilk açılışta modal açar.
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.Last, typeof(Apya.Platform.Web.Components.ReleaseNotes.ReleaseNotesViewComponent));
            // İlk giriş tanıtım turu — turu görmemiş kullanıcıda modal açar. "Yenilikler"den
            // SONRA kaydedilir ki DOM'da sonra gelsin; zaten ikisi aynı anda açılmaz
            // (ReleaseNotesViewComponent tur tamamlanana kadar boş döner).
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.Last, typeof(Apya.Platform.Web.Components.ProductTour.ProductTourViewComponent));
        });

        // GAP-012 + ARCH-010: Audit Logging Selectors.
        // Tasks + DynamicAssets'e ek olarak FİNANSAL aggregate root'lar audit'lenmeli —
        // KVKK / vergi audit / iç inceleme için "kim, ne zaman, ne değiştirdi" zorunlu.
        // CashAccount + ExchangeRate config-ish; transactional değil → şu an dışarıda.
        // FxRevaluationSnapshot append-only/snapshot → modify edilmez, gereksiz.
        Configure<Volo.Abp.Auditing.AbpAuditingOptions>(options =>
        {
            options.EntityHistorySelectors.Add(
                new Volo.Abp.NamedTypeSelector(
                    "SensitiveEntities",
                    type => typeof(Apya.Platform.Tasks.TaskItem).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.DynamicAssets.AppDocument).IsAssignableFrom(type) ||
                            // ARCH-010: finansal transactional aggregate'ler
                            typeof(Apya.Platform.Invoices.Invoice).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Invoices.InvoiceItem).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Invoices.Payment).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.CashMovements.CashMovement).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.CustomerLedger.CustomerLedgerEntry).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Expenses.Expense).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Incomes.IncomeEntry).IsAssignableFrom(type)
                )
            );

            // S5b: AI governance — prompt/workflow/provider/binding değişiklikleri "kim, ne zaman,
            // ne değiştirdi" audit'i (yönetişim). ApiKey şifreli saklandığı için ciphertext audit'lenir.
            options.EntityHistorySelectors.Add(
                new Volo.Abp.NamedTypeSelector(
                    "AiGovernanceEntities",
                    type => typeof(Apya.Platform.Ai.Prompts.Prompt).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Ai.Prompts.PromptVersion).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Ai.Workflows.AiWorkflow).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Ai.Workflows.AiWorkflowRule).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Ai.Providers.AiProviderConfig).IsAssignableFrom(type) ||
                            typeof(Apya.Platform.Ai.Bindings.AiFormBinding).IsAssignableFrom(type)
                )
            );
        });

        ConfigureAuthentication(context);
        ConfigureValidationLocalization(context);
        ConfigureUrls(configuration);
        ConfigureResponseCompression(context);
        ConfigureRateLimiting(context);
        ConfigureBundles(context);
        ConfigureVirtualFileSystem(hostingEnvironment);
        ConfigureMultiTenancyLocalization();
        ConfigureNavigationServices();
        ConfigureAutoApiControllers();
        ConfigureSwaggerServices(context.Services);

        // ARCH-013: Health checks. Şu an check listesi boş ama altyapı hazır —
        // /health/live (predicate=false, hep 200) liveness probe için; /health/ready
        // default check seti çalıştırır (gelecekte DbContextCheck eklenebilir, paket
        // gerektirir). K8s / Cloud Run / load balancer ihtiyaçlarını karşılar.
        context.Services.AddHealthChecks();

        context.Services.AddMapperlyObjectMapper<PlatformWebModule>();

        ConfigureDataProtection(context);
    }

    private void ConfigureResponseCompression(ServiceConfigurationContext context)
    {
        // TD-PERF-002: Plesk'te OutOfProcess (IIS ters vekil) çalıştığımız için IIS'in
        // dinamik sıkıştırması yanıtlara uygulanmıyor — HTML/JSON sıkıştırmasız gidiyordu.
        // Uygulama içi Brotli/Gzip bunu sunucudan bağımsız garantiler.
        // EnableForHttps + BREACH: antiforgery token her HTML GET'inde yenilendiği için
        // (aşağıdaki XSRF-TOKEN middleware'i) sabit-secret varsayımı bozulur, pratik risk düşük.
        context.Services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<BrotliCompressionProvider>();
            options.Providers.Add<GzipCompressionProvider>();
            options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[]
            {
                "image/svg+xml"
            });
        });

        // Paylaşımlı hosting'de CPU bütçesi dar — en hızlı seviye yeterli kazanç sağlar.
        context.Services.Configure<BrotliCompressionProviderOptions>(o => o.Level = CompressionLevel.Fastest);
        context.Services.Configure<GzipCompressionProviderOptions>(o => o.Level = CompressionLevel.Fastest);
    }

    private void ConfigureRateLimiting(ServiceConfigurationContext context)
    {
        // Gürültücü komşu koruması: bir kiracının istek fırtınası paylaşımlı sunucuda
        // diğer kiracıları yavaşlatmasın. Bölüm anahtarı tenant; oturumsuz istekler IP'ye
        // göre ayrılır (yoksa kimliksiz bir bot herkesin kovasını tüketebilirdi), host
        // kullanıcıları ortak "host" kovasında. Statik dosyalar bu middleware'e hiç
        // ulaşmaz (MapAbpStaticAssets pipeline'da daha önce kısa devre eder). SignalR
        // bağlantısı tek istek sayılır. Tavan: Platform:Performance:TenantRateLimitPerMinute
        // (0 = kapalı) — canlıda sorun çıkarırsa konfigden kapatılabilir, deploy gerekmez.
        context.Services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            {
                var limit = httpContext.RequestServices
                    .GetRequiredService<IOptions<PlatformPerformanceOptions>>()
                    .Value.TenantRateLimitPerMinute;
                if (limit <= 0)
                {
                    return RateLimitPartition.GetNoLimiter("kapali");
                }

                var tenantId = httpContext.RequestServices.GetRequiredService<ICurrentTenant>().Id;
                var partitionKey = tenantId?.ToString("N")
                    ?? (httpContext.User?.Identity?.IsAuthenticated == true
                        ? "host"
                        : "anon:" + (httpContext.Connection.RemoteIpAddress?.ToString() ?? "bilinmiyor"));

                return RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = limit,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0
                });
            });

            options.OnRejected = async (rejectionContext, cancellationToken) =>
            {
                var httpContext = rejectionContext.HttpContext;
                httpContext.Response.Headers.RetryAfter = "60";

                httpContext.RequestServices.GetRequiredService<ILogger<PlatformWebModule>>()
                    .LogWarning("[PERF] Rate limit aşıldı: {Method} {Path}",
                        httpContext.Request.Method, httpContext.Request.Path.Value);

                var localizer = httpContext.RequestServices
                    .GetRequiredService<IStringLocalizer<PlatformResource>>();
                await httpContext.Response.WriteAsync(
                    localizer["Platform:RateLimitExceeded"], cancellationToken);
            };
        });
    }

    private void ConfigureDataProtection(ServiceConfigurationContext context)
    {
        // Data Protection için SABİT application name. Varsayılan "purpose" content-root yoluna
        // bağlıdır; uygulama farklı bir yoldan çalıştığında (git worktree, farklı deploy dizini)
        // ya da çok-örnekli (load-balanced) ortamda bir örneğin ürettiği antiforgery/auth
        // cookie'lerini diğeri çözemez → "The antiforgery token could not be decrypted" / gövdesiz
        // 400. Sabit isim, anahtar halkası paylaşıldığı sürece tüm örnekler arasında uyumlu kılar.
        //
        // Anahtar halkası uygulama dizininde KALICI tutulur. Varsayılan konum kullanıcı
        // profilidir; IIS/Plesk'te app pool profili yüklenmediğinde ASP.NET Core belleğe
        // düşer → her app pool recycle'ında anahtarlar yenilenir, tüm oturumlar düşer ve
        // antiforgery doğrulaması 400 verir. App_Data web kökü dışındadır, dışarıdan okunamaz.
        var keysFolder = Path.Combine(
            context.Services.GetHostingEnvironment().ContentRootPath,
            "App_Data",
            "DataProtection-Keys");
        Directory.CreateDirectory(keysFolder);

        context.Services.AddDataProtection()
            .SetApplicationName("Apya.Platform")
            .PersistKeysToFileSystem(new DirectoryInfo(keysFolder));
    }

    private void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }

    /// <summary>
    /// Doğrulama ve model bağlama hata metinlerinin Türkçeleştirilmesi.
    ///
    /// Üç ayrı kaynak var, üçü de burada kapatılır:
    ///  1. DataAnnotations mesajları — ErrorMessage'ı boş attribute'lar yerelleştirilmez
    ///     (bkz. <see cref="PlatformValidationAttributeAdapterProvider"/>).
    ///  2. Model bağlama mesajları — MvcOptions.ModelBindingMessageProvider varsayılanı
    ///     İngilizce sabittir; geçersiz tarih/sayı/enum girişlerinde bu çıkıyordu.
    ///  3. Alan adları — ABP genel "DisplayName:{Alan}" karşılığını zaten çözüyor; buna
    ///     bağlama özel katman eklenir (bkz. <see cref="PlatformDisplayMetadataProvider"/>).
    /// </summary>
    private void ConfigureValidationLocalization(ServiceConfigurationContext context)
    {
        context.Services.AddSingleton<IValidationAttributeAdapterProvider, PlatformValidationAttributeAdapterProvider>();

        context.Services
            .AddOptions<MvcOptions>()
            .Configure<IStringLocalizerFactory>((options, localizerFactory) =>
            {
                // Non-nullable referans tipleri ÖRTÜK olarak [Required] sayılmasın.
                // Bu kural, kullanıcının hiç görmediği teknik bağlama alanları için
                // ("Tab", "LayoutJson", "Currency") sahte doğrulama hatası üretiyordu:
                // form o alanı post etmediği için sayfa kaydedilemiyordu. Gerçek
                // zorunluluklar 84 açık [Required] ile tanımlı, onlar etkilenmez.
                options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;

                options.ModelMetadataDetailsProviders.Add(
                    new PlatformDisplayMetadataProvider(localizerFactory));

                // Localizer singleton; kültürü her erişimde CurrentUICulture'dan okur.
                var l = localizerFactory.Create(typeof(PlatformResource));
                var p = options.ModelBindingMessageProvider;

                p.SetMissingBindRequiredValueAccessor(field => l["Validation:MissingBindRequiredValue", field]);
                p.SetMissingKeyOrValueAccessor(() => l["Validation:MissingKeyOrValue"]);
                p.SetMissingRequestBodyRequiredValueAccessor(() => l["Validation:MissingRequestBodyRequiredValue"]);
                p.SetValueMustNotBeNullAccessor(value => l["Validation:ValueMustNotBeNull", value]);
                p.SetAttemptedValueIsInvalidAccessor((value, field) => l["Validation:AttemptedValueIsInvalid", value, field]);
                p.SetNonPropertyAttemptedValueIsInvalidAccessor(value => l["Validation:NonPropertyAttemptedValueIsInvalid", value]);
                p.SetUnknownValueIsInvalidAccessor(field => l["Validation:UnknownValueIsInvalid", field]);
                p.SetNonPropertyUnknownValueIsInvalidAccessor(() => l["Validation:NonPropertyUnknownValueIsInvalid"]);
                p.SetValueIsInvalidAccessor(value => l["Validation:ValueIsInvalid", value]);
                p.SetValueMustBeANumberAccessor(field => l["Validation:ValueMustBeANumber", field]);
                p.SetNonPropertyValueMustBeANumberAccessor(() => l["Validation:NonPropertyValueMustBeANumber"]);
            });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
        });
    }

    private void ConfigureBundles(ServiceConfigurationContext context)
    {
        Configure<AbpBundlingOptions>(options =>
        {
            // TD-PERF-001: Development'ta varsayılan (Mode=Auto) bundle/minify YAPMIYOR —
            // her sayfa geçişinde ~70 ayrı CSS/JS isteği + aşamalı boyanma (menü "küçülüp
            // büyüyor" hissi) buradan geliyordu. Prod zaten otomatik bundle ediyordu; burada
            // dev'i de aynı davranışa zorluyoruz. Bedel: CSS/JS dosyası değiştirince tarayıcı
            // yenilemesi tek başına yetmeyebilir (bundle cache) — gerekirse sunucuyu yeniden başlat.
            options.Mode = BundlingMode.BundleAndMinify;
            // Stil (CSS) dosyalar� ayar� (Zaten vard�r, dokunmay�n)
            options.StyleBundles.Configure(
                LeptonXLiteThemeBundles.Styles.Global,
                bundle =>
                {
                    // Apya design token'lar� (--apya-*) — apya-shell ve apya-theme-bridge
                    // bu de�i�kenleri t�ketir; global y�klenmezse var() de�erleri bo� kal�r.
                    // Kaynak: React island'la ayn� dosya (tek kaynak, kopya de�il).
                    // Self-hosted fontlar (Inter + JetBrains Mono) — @font-face önce gelsin.
                    bundle.AddFiles("/css/apya-fonts.css");
                    bundle.AddFiles("/dynamic-assets/src/styles/tokens.css");
                    // LeptonX/Bootstrap de�i�kenlerini token'lara ba�layan k�pr�
                    bundle.AddFiles("/css/apya-theme-bridge.css");
                    bundle.AddFiles("/global.css");
                    bundle.AddFiles("/css/apya-shell.css");
                    // Sayfa yüklenirken üst-seviye blokların kademeli girişi (saf CSS).
                    bundle.AddFiles("/css/apya-entrance.css");
                }
            );

            // --- BURAYI EKLEY�N ---
            // Script (JS) dosyalar� ayar�
            options.ScriptBundles.Configure(
                LeptonXLiteThemeBundles.Scripts.Global,
                bundle =>
                {
                    // jQuery Validation'ın KENDİ varsayılan mesajları (min/max/number/email/url
                    // gibi HTML5 özniteliklerinden türeyen kurallar) sunucudan gelmez, istemcide
                    // gömülüdür ve İngilizcedir. Tema demetinden SONRA yüklendiği için
                    // $.validator.messages'ı Türkçeyle ezer. data-val-* mesajları zaten
                    // sunucudan yerelleştirilmiş gelir; bu dosya yalnız o boşluğu kapatır.
                    bundle.AddFiles("/libs/jquery-validation/localization/messages_tr.js");
                    // Olu�turdu�umuz dosyay� buraya ekliyoruz
                    bundle.AddFiles("/js/jquery-fix.js");
                    // Erken kayıt: window.onerror/unhandledrejection dinleyicileri mümkün olduğunca
                    // erken bağlansın diye jQuery hemen sonrasında.
                    bundle.AddFiles("/js/apya-telemetry.js");
                    bundle.AddFiles("/js/apya-feedback.js");
                    bundle.AddFiles("/js/apya-money.js"); // apya.money.format → "1.000,00 TRY" (tüm sayfalarda)
                    bundle.AddFiles("/js/apya-money-input.js"); // tutar giriş maskesi (data-money-input, gizli ham alan)
                    bundle.AddFiles("/js/apya-finance-modal.js"); // gelir/gider modalı: proje tarih aralığı kontrolü
                    bundle.AddFiles("/Pages/Notifications/notification-bell.js");
                    bundle.AddFiles("/js/dark-mode.js");
                    bundle.AddFiles("/js/sidebar-toggle.js");
                    // sidebar-toggle.js'ten SONRA: o, 2. seviye grupları kapatıp
                    // menü DOM'unu son hâline getiriyor; kabuk zenginleştirmeleri
                    // (iğne/rozet/alt liste) o hâlin üstüne biner.
                    bundle.AddFiles("/js/apya-sidebar-shell.js");
                    // apya-sidebar-shell.js'ten SONRA: paylaşılan
                    // window.apyaShellState promise'ini o kuruyor.
                    bundle.AddFiles("/js/apya-topbar-shell.js");
                    // Kenar çubuğu genişlik tutamağı — yalnız --apya-sidebar-w yazar;
                    // boyanma öncesi uygulama ApyaThemeHead'deki FOUC betiğinde.
                    bundle.AddFiles("/js/apya-sidebar-resize.js");
                    // Sıra serbest: paleti açarken #ApyaCommandPaletteTrigger'a
                    // tıklanıyor ve command-palette.js onu DELEGE dinleyiciyle
                    // yakalıyor → bu dosya ondan önce yüklense de çalışır.
                    bundle.AddFiles("/js/apya-shell-actions.js");
                    bundle.AddFiles("/js/apya-saved-views.js");
                    bundle.AddFiles("/js/density-toggle.js");
                    bundle.AddFiles("/js/command-palette.js");
                    // dark-mode.js'ten SONRA gelmeli: window.apyaHeader.setViewLabel'ı kullanıyor.
                    bundle.AddFiles("/js/apya-header-views.js");
                    bundle.AddFiles("/js/ai-hub-client.js");
                    bundle.AddFiles("/js/ajax-error-detail.js");
                    // ajax-error-detail.js'ten SONRA: ikisi de abp.ajax'ın hata yolunu
                    // sarmalıyor, bu dosya showError'u override ediyor. Sıra bilinçli —
                    // en son sarmalayan, kota kodlarını ilk gören olur.
                    bundle.AddFiles("/js/apya-quota-upsell.js");
                    bundle.AddFiles("/js/apya-hint.js"); // bilgi ipucu (ⓘ) — body'ye delege tooltip init
                    // Yeni Görev modalı (hızlı giriş ayrıştırıcısı + meta çipleri). Modal AJAX ile
                    // yüklendiği için modülün GLOBAL demette olması şart: modalın kendi <script>'i
                    // apya.taskCreate.init'i çağırır, o an dosya zaten yüklü olmalı.
                    bundle.AddFiles("/js/apya-quick-task.js");
                }
            );
            // ----------------------
        });
    }

    private void ConfigureVirtualFileSystem(IWebHostEnvironment hostingEnvironment)
    {
        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.ReplaceEmbeddedByPhysical<PlatformDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Apya.Platform.Domain.Shared"));
                options.FileSets.ReplaceEmbeddedByPhysical<PlatformDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Apya.Platform.Domain"));
                options.FileSets.ReplaceEmbeddedByPhysical<PlatformApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Apya.Platform.Application.Contracts"));
                options.FileSets.ReplaceEmbeddedByPhysical<PlatformApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Apya.Platform.Application"));
                options.FileSets.ReplaceEmbeddedByPhysical<PlatformWebModule>(hostingEnvironment.ContentRootPath);
            });
        }
    }

    // Kiracı seçici ("MÜŞTERİ / Seçili değil / değiştir") ABP'nin AYRI bir kaynağından gelir;
    // Domain.Shared'daki AbpTenantManagementResource override'ı buraya ulaşmaz. JSON dosyası
    // Domain.Shared'ın sanal dosya sisteminde. Bkz. PlatformDomainSharedModule.
    private void ConfigureMultiTenancyLocalization()
    {
        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Get<AbpUiMultiTenancyResource>()
                .AddVirtualJson("/Localization/MultiTenancyUi");
        });
    }

    private void ConfigureNavigationServices()
    {
        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new PlatformMenuContributor());
        });

        Configure<AbpToolbarOptions>(options =>
        {
            // Komut paleti tetikleyici EN SOLDA (sayfa başlığına en yakın), sonra
            // tema toggle, sonra bildirim zili → header ikon kümesi bu sırayla.
            options.Contributors.Add(new Apya.Platform.Web.Theme.CommandPaletteToggleToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Theme.ThemeToggleToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Theme.DensityToggleToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Theme.SidebarModeToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Notifications.NotificationToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Feedbacks.FeedbackToolbarContributor());
        });
    }

    private void ConfigureAutoApiControllers()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers.Create(typeof(PlatformApplicationModule).Assembly);
            options.ConventionalControllers.Create(typeof(PlatformApplicationContractsModule).Assembly);
            options.ConventionalControllers.Create(typeof(Apya.Platform.Ai.PlatformAiApplicationModule).Assembly);
        });
    }

    private void ConfigureSwaggerServices(IServiceCollection services)
    {
        services.AddAbpSwaggerGen(
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Platform API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.CustomSchemaIds(type => type.FullName);
            }
        );
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        // QuestPDF Community lisansı — gelir <$1M USD için ücretsiz
        QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

        // KVKK-004: Geri bildirim eklerinin saklama süresini uygulayan worker. Web'de
        // çünkü dosya silme FeedbackFileStorage'a bağlı (yalnız Web katmanında).
        context.AddBackgroundWorkerAsync<Apya.Platform.Web.Feedbacks.FeedbackAttachmentRetentionWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Web.Documents.ScheduledReportWorker>();
        context.AddBackgroundWorkerAsync<Apya.Platform.Web.Tenants.SubscriptionExpiryWorker>();

        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        // Yanıt gövdesini saran middleware'lerin en dışında olmalı ki sonraki tüm
        // dinamik çıktılar (HTML, JSON) sıkıştırılsın.
        app.UseResponseCompression();

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            // Dostane hata sayfası YALNIZ gerçek HTML gezinmelerinde — bkz. IsHtmlNavigation.
            app.UseWhen(IsHtmlNavigation, branch => branch.UseErrorPage());

            // HSTS: yalnızca HTTPS isteklerinde başlık eklenir, bu yüzden SSL kurulmadan
            // önce de güvenle açık kalabilir. HTTP→HTTPS yönlendirmesi uygulamada DEĞİL,
            // Plesk/IIS seviyesinde yapılır (reverse proxy arkasında döngü riski olmasın).
            app.UseHsts();
        }

        app.UseCorrelationId();

        // ARCH-039 + ARCH-CSP: Güvenlik başlıkları.
        // CSP report-only: LeptonX inline script/style kullandığından enforce edilmiyor;
        // ihlaller /csp-violations'a POST edilir → Serilog'a düşer. Birkaç sprint
        // veri toplandıktan sonra 'unsafe-inline' elimine edilip enforce moduna alınabilir.
        app.Use(async (ctx, next) =>
        {
            ctx.Response.Headers["X-Frame-Options"] = "SAMEORIGIN";
            ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
            ctx.Response.Headers["X-XSS-Protection"] = "1; mode=block";
            ctx.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
            ctx.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
            ctx.Response.Headers["Content-Security-Policy-Report-Only"] =
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline' data:; " +
                "img-src 'self' data: blob:; " +
                "font-src 'self' data:; " +
                "connect-src 'self' wss: blob:; " +
                "worker-src blob:; " +
                "frame-ancestors 'self'; " +
                "object-src 'none'; " +
                "base-uri 'self'; " +
                "report-uri /csp-violations";
            await next();
        });

        app.MapAbpStaticAssets();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAbpOpenIddictValidation();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        // UseMultiTenancy'den SONRA: tenant AsyncLocal scope'u ancak bu noktadan içeride
        // aktif kalır — daha dışarı konursa log anında CurrentTenant.Id hep null görünür.
        app.UseMiddleware<Middleware.SlowRequestLoggingMiddleware>();

        // UseMultiTenancy'den SONRA: bölüm anahtarı CurrentTenant.Id'den türetiliyor.
        app.UseRateLimiter();

        app.UseUnitOfWork();
        app.UseDynamicClaims();
        app.UseAuthorization();

        // ANTIFORGERY REFRESH: abp.ajax / abp.ModalManager, POST'larda antiforgery token'ını
        // JS-okunur 'XSRF-TOKEN' cookie'sinden okuyup 'RequestVerificationToken' header'ı olarak
        // gönderir. Bu cookie bayatlarsa (eski instance/DP-purpose, restart, worktree) POST
        // "The antiforgery token could not be decrypted" ile gövdesiz 400 alır — kullanıcı elle
        // cookie temizlemeden kurtulamaz. Her HTML GET'inde token'ları yeniden üretip XSRF-TOKEN'ı
        // tazeleyerek bunu kökten çözüyoruz: GetAndStoreTokens hem .AspNetCore.Antiforgery
        // cookie'sini hem (aynı request içinde) form-field token'ını set eder; biz de request
        // token'ını XSRF-TOKEN'a yazarız → header her zaman taze ve eşleşmiş olur.
        app.Use(async (ctx, next) =>
        {
            if (HttpMethods.IsGet(ctx.Request.Method))
            {
                var path = ctx.Request.Path.Value ?? string.Empty;
                // API, swagger, statik asset ve sağlık uçlarını atla — yalnız HTML sayfaları.
                if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/health", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/css", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/js", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/libs", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/images", StringComparison.OrdinalIgnoreCase) &&
                    !path.StartsWith("/icons", StringComparison.OrdinalIgnoreCase))
                {
                    var antiforgery = ctx.RequestServices.GetRequiredService<IAntiforgery>();
                    var tokens = antiforgery.GetAndStoreTokens(ctx);
                    if (!string.IsNullOrEmpty(tokens.RequestToken))
                    {
                        ctx.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken, new CookieOptions
                        {
                            HttpOnly = false, // abp.jquery JS'ten okuyabilmeli
                            Secure = true,    // Yalnız HTTPS üzerinden gönderilsin.
                            Path = "/",
                            SameSite = SameSiteMode.Lax
                        });
                    }
                }
            }

            await next();
        });

        // Swagger yalnızca Development'ta: production'da tüm API yüzeyini (endpoint,
        // parametre, DTO şeması) kimliksiz ziyaretçiye açmamak için kapalı.
        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseAbpSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Platform API");
            });
        }

        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints(endpoints =>
        {
            // ARCH-013: Health endpoints.
            // /health/live → pure liveness (predicate _ => false hiçbir check çalıştırmaz,
            // app process'i ayakta = 200). K8s livenessProbe için.
            // /health/ready → readiness (kayıtlı tüm check'leri çalıştırır, şu an boş = 200).
            endpoints.MapHealthChecks("/health/live",
                new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
                {
                    Predicate = _ => false
                });
            endpoints.MapHealthChecks("/health/ready");

            endpoints.MapHub<Apya.Platform.Web.Hubs.NotificationHub>("/notification-hub");
            endpoints.MapHub<Apya.Platform.Web.Hubs.TaskHub>("/task-hub");
            endpoints.MapHub<Apya.Platform.Web.Hubs.AiHub>("/ai-hub");
            endpoints.MapHub<Apya.Platform.Web.Hubs.GrantApplicationHub>("/grant-application-hub");

            // CSP ihlal raporları — tarayıcı POST eder, biz Serilog'a yazarız.
            // AllowAnonymous zorunlu: tarayıcı raporu auth cookie olmadan gönderir.
            endpoints.MapPost("/csp-violations", async (HttpContext httpCtx) =>
            {
                var logger = httpCtx.RequestServices.GetRequiredService<ILogger<PlatformWebModule>>();
                using var reader = new StreamReader(httpCtx.Request.Body);
                var body = await reader.ReadToEndAsync();
                logger.LogWarning("[CSP] İhlal: {Report}", body);
                return Results.NoContent();
            }).AllowAnonymous();
        });
    }

    /// <summary>
    /// ABP'nin <c>UseErrorPage()</c>'i durum kodu sayfalarını YÖNLENDİRME ile kurar
    /// (gövdesiz her 4xx/5xx → <c>302 ~/Error?httpStatusCode={0}</c>). Bu, yalnızca
    /// tam sayfa gezinmelerinde doğru davranıştır:
    /// <list type="bullet">
    /// <item>Tarayıcı 302'de HTTP yöntemini <b>yalnız POST için</b> GET'e düşürür;
    /// PUT/PATCH/DELETE korunur. Gövdesiz 4xx alan bir PUT böylece <c>PUT /Error</c>'a
    /// gider, ABP'nin otomatik antiforgery filtresi (muaf yöntemler yalnız
    /// GET/HEAD/OPTIONS/TRACE) onu yine gövdesiz 400 ile reddeder ve döngü tarayıcının
    /// 20 yönlendirme sınırına kadar sürer. Belirti: istemcide
    /// <c>ERR_TOO_MANY_REDIRECTS</c>, Sistem Sağlığı'nda <c>6|PUT|/Error</c> altında
    /// bir kullanıcı eylemi başına 20 kayıt (audit middleware bu sarmalın İÇİNDE olduğu
    /// için her sıçrama ayrı satır olur).</item>
    /// <item>AJAX POST'ta yönlendirme izlenir ama <c>GET /Error</c> <b>200 + HTML</b>
    /// döner; JSON bekleyen JS <c>Unexpected token '&lt;'</c> ile patlar.</item>
    /// </list>
    /// Her iki durumda da istemci gerçek hata zarfını hiç göremez. Bu yüzden hata
    /// sayfası yalnız HTML gezinmelerine bağlanır; API/AJAX ham durum kodunu alır.
    /// </summary>
    private static bool IsHtmlNavigation(HttpContext ctx)
    {
        var request = ctx.Request;

        // Hata sayfası ASLA kendine yönlendirilmez. Tarayıcı POST'u GET'e düşürdüğü için
        // pratikte oraya yalnız GET gelir, ama yöntemi koruyan istemcilerde (curl, bazı
        // HTTP kütüphaneleri) döngü buradan doğar — yapısal olarak kapatıyoruz.
        if (request.Path.StartsWithSegments("/Error", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // 302 yalnız POST'ta yöntemi GET'e düşürür; diğer mutasyonlarda döngü doğar.
        if (!HttpMethods.IsGet(request.Method) &&
            !HttpMethods.IsHead(request.Method) &&
            !HttpMethods.IsPost(request.Method))
        {
            return false;
        }

        if (request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // abp.ajax, jQuery ve React httpClient bu başlığı gönderir.
        if (string.Equals(request.Headers["X-Requested-With"].ToString(), "XMLHttpRequest",
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        // fetch/XHR çoğunlukla Accept: application/json der; tarayıcı gezinmesi text/html.
        var accept = request.Headers.Accept.ToString();
        if (!string.IsNullOrEmpty(accept) &&
            !accept.Contains("text/html", StringComparison.OrdinalIgnoreCase) &&
            !accept.Contains("*/*", StringComparison.Ordinal))
        {
            return false;
        }

        return true;
    }
}
