using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Apya.Platform.EntityFrameworkCore;
using Apya.Platform.Localization;
using Apya.Platform.MultiTenancy;
using Apya.Platform.Web.Menus;
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
                serverBuilder.AddProductionEncryptionAndSigningCertificate(
                    "openiddict.pfx", certificatePassword);
            });
        }
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        // New configurations from the instruction
        // ConfigureMenus(context.Services.GetConfiguration()); // This method is not defined in the original code. Assuming it's a placeholder or needs to be added elsewhere.
        // ConfigureErrorPageOptions(); // This method is not defined in the original code. Assuming it's a placeholder or needs to be added elsewhere.

        // Layout Hook for Impersonation Alert + site-wide tema head (PWA + FOUC)
        Configure<Volo.Abp.Ui.LayoutHooks.AbpLayoutHookOptions>(options =>
        {
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Body.First, typeof(Apya.Platform.Web.Components.ImpersonationAlert.ImpersonationAlertViewComponent));
            options.Add(Volo.Abp.Ui.LayoutHooks.LayoutHooks.Head.Last, typeof(Apya.Platform.Web.Components.ApyaThemeHead.ApyaThemeHeadViewComponent));
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
        ConfigureUrls(configuration);
        ConfigureBundles(context);
        ConfigureVirtualFileSystem(hostingEnvironment);
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

    private void ConfigureDataProtection(ServiceConfigurationContext context)
    {
        // Data Protection için SABİT application name. Varsayılan "purpose" content-root yoluna
        // bağlıdır; uygulama farklı bir yoldan çalıştığında (git worktree, farklı deploy dizini)
        // ya da çok-örnekli (load-balanced) ortamda bir örneğin ürettiği antiforgery/auth
        // cookie'lerini diğeri çözemez → "The antiforgery token could not be decrypted" / gövdesiz
        // 400. Sabit isim, anahtar halkası paylaşıldığı sürece tüm örnekler arasında uyumlu kılar.
        context.Services.AddDataProtection()
            .SetApplicationName("Apya.Platform");
    }

    private void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
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
                }
            );

            // --- BURAYI EKLEY�N ---
            // Script (JS) dosyalar� ayar�
            options.ScriptBundles.Configure(
                LeptonXLiteThemeBundles.Scripts.Global,
                bundle =>
                {
                    // Olu�turdu�umuz dosyay� buraya ekliyoruz
                    bundle.AddFiles("/js/jquery-fix.js");
                    bundle.AddFiles("/Pages/Notifications/notification-bell.js");
                    bundle.AddFiles("/js/dark-mode.js");
                    bundle.AddFiles("/js/ai-hub-client.js");
                    bundle.AddFiles("/js/ajax-error-detail.js");
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

    private void ConfigureNavigationServices()
    {
        Configure<AbpNavigationOptions>(options =>
        {
            options.MenuContributors.Add(new PlatformMenuContributor());
        });

        Configure<AbpToolbarOptions>(options =>
        {
            // Tema toggle bildirim zilinden ÖNCE → header'da zilin solunda.
            options.Contributors.Add(new Apya.Platform.Web.Theme.ThemeToggleToolbarContributor());
            options.Contributors.Add(new Apya.Platform.Web.Notifications.NotificationToolbarContributor());
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

        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
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
                            Path = "/",
                            SameSite = SameSiteMode.Lax
                        });
                    }
                }
            }

            await next();
        });

        app.UseSwagger();
        app.UseAbpSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Platform API");
        });

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
}
