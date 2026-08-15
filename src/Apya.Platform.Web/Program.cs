using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace Apya.Platform.Web;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        // ARCH-013: Bootstrap IConfiguration — Serilog'u kurmadan ÖNCE Elasticsearch URI'sini
        // okumak için. Hardcoded "http://localhost:9200" → config-driven. URI yoksa ES sink
        // hiç eklenmez → container startup'ı ES erişilemezliği yüzünden gecikmez.
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        var bootstrapConfiguration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true)
            .AddJsonFile("appsettings.secrets.json", optional: true)
            .AddEnvironmentVariables()
            .AddCommandLine(args)
            .Build();

        var elasticsearchUri = bootstrapConfiguration["Serilog:Elasticsearch:Uri"];

        var logConfiguration = new LoggerConfiguration()
#if DEBUG
            .MinimumLevel.Debug()
#else
            .MinimumLevel.Information()
#endif
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            // İstek-başına 2+ Information satırı (Hosting.Diagnostics) log dosyasına I/O
            // üretiyordu; uygulamanın kendi [PERF] telemetrisi varken gereksiz gürültü.
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console());

        // GAP-012 + ARCH-013: Elasticsearch sink yalnızca URI yapılandırılmışsa eklenir.
        // appsettings.json'da Serilog:Elasticsearch:Uri = "http://localhost:9200" şeklinde
        // tanımlanırsa eskisiyle aynı davranış.
        if (!string.IsNullOrWhiteSpace(elasticsearchUri))
        {
            logConfiguration = logConfiguration.WriteTo.Elasticsearch(
                new Serilog.Sinks.Elasticsearch.ElasticsearchSinkOptions(new Uri(elasticsearchUri))
                {
                    AutoRegisterTemplate = true,
                    AutoRegisterTemplateVersion = Serilog.Sinks.Elasticsearch.AutoRegisterTemplateVersion.ESv7,
                    IndexFormat = "apya-platform-auditlogs-{0:yyyy.MM}",
                    MinimumLogEventLevel = LogEventLevel.Information
                });
        }

        Log.Logger = logConfiguration.CreateLogger();

        try
        {
            Log.Information("Starting web host.");
            var builder = WebApplication.CreateBuilder(args);
            builder.Host.AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog();
            await builder.AddApplicationAsync<PlatformWebModule>();
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
