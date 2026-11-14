using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.DataTransfers;
using Apya.Platform.Localization;
using Apya.Platform.Web;
using Apya.Platform.Web.Import;
using Apya.Platform.Web.Transfer;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.Extensions.Localization;
using Shouldly;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.Transfer;

/// <summary>
/// Aktarım kataloğu çalışan uygulamayla aynı şeyi söylüyor mu? Erişim kuralı ve çalışma alanı
/// kataloğa bakar: katalogda olmayan bir "Excel'e aktar" ucu izin denetiminin dışında kalır,
/// katalogda olup uygulamada olmayan uç ise ölü bağlantıdır.
/// </summary>
public class TransferCatalog_Tests : PlatformWebTestBase
{
    private sealed record Handler(string Page, string Name, Type? Model);

    /// <summary>Uygulamanın kendi Razor sayfalarındaki bütün adlı handler'lar (ABP modül sayfaları hariç).</summary>
    private async Task<List<Handler>> HandlersAsync()
    {
        var loader = GetRequiredService<PageLoader>();
        var handlers = new List<Handler>();
        foreach (var page in GetRequiredService<IActionDescriptorCollectionProvider>().ActionDescriptors.Items.OfType<PageActionDescriptor>())
        {
            var compiled = await loader.LoadAsync(page);
            var model = compiled.DeclaredModelTypeInfo?.AsType();
            if (model?.Assembly != typeof(PlatformWebModule).Assembly)
            {
                continue;
            }

            // "OnPageHandlerExecuted" gibi süzgeç kancaları handler değildir (ad "Handler..." çıkar).
            handlers.AddRange(compiled.HandlerMethods.Where(h => !string.IsNullOrEmpty(h.Name) && !h.Name.StartsWith("Handler", StringComparison.Ordinal))
                .Select(h => new Handler(compiled.ViewEnginePath, h.Name!, model)));
        }

        return handlers;
    }

    [Fact]
    public async Task Katalogdaki_her_uc_uygulamada_var()
    {
        var handlers = await HandlersAsync();
        foreach (var endpoint in TransferCatalog.Endpoints)
        {
            handlers.ShouldContain(
                h => string.Equals(h.Page, endpoint.Page, StringComparison.OrdinalIgnoreCase)
                     && string.Equals(h.Name, endpoint.Handler, StringComparison.OrdinalIgnoreCase),
                $"{endpoint.Page}?handler={endpoint.Handler} katalogda var ama uygulamada yok");
        }
    }

    [Fact]
    public async Task Aktarim_ucu_gibi_gorunen_her_handler_katalogda()
    {
        var missing = (await HandlersAsync())
            .Where(h => Regex.IsMatch(h.Name, "Excel|Csv|Export|Import") || IsExcelImportPage(h.Model))
            .Where(h => TransferCatalog.Find(h.Page, h.Name) == null)
            .Select(h => $"{h.Page}?handler={h.Name}")
            .Distinct()
            .ToList();

        missing.ShouldBeEmpty(
            "Bu uçlar TransferCatalog'da yok: aktarım izni denetimine girmez ve çalışma alanında görünmez. " +
            "Kataloğa ekleyin.");
    }

    private static bool IsExcelImportPage(Type? model)
    {
        for (var type = model; type != null; type = type.BaseType)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(ExcelImportPageModel<,>)) return true;
        }

        return false;
    }

    [Fact]
    public void Her_modulun_bir_ekrani_var_ve_yonleri_tutarli()
    {
        DataTransferModules.All.Select(m => m.Key).ShouldBeUnique();
        TransferCatalog.Screens.Select(s => s.Module.Key).OrderBy(k => k)
            .ShouldBe(DataTransferModules.All.Select(m => m.Key).OrderBy(k => k));

        foreach (var screen in TransferCatalog.Screens)
        {
            screen.HasExport.ShouldBeTrue($"{screen.Module.Key}: her modülün dışa aktarımı var");
            screen.HasImport.ShouldBe(screen.Module.ImportPermission != null,
                $"{screen.Module.Key}: içe aktarma ucu ile içe aktarma izni birlikte tanımlanır");
            if (screen.ImportUrl != null) screen.HasImport.ShouldBeTrue(screen.Module.Key);
        }
    }

    [Fact]
    public void Modul_ve_grup_adlari_sozlukte_var()
    {
        var l = GetRequiredService<IStringLocalizer<PlatformResource>>();
        foreach (var key in TransferCatalog.Screens.SelectMany(s => new[] { s.Module.NameKey, s.Group }).Distinct())
        {
            l[key].ResourceNotFound.ShouldBeFalse(key);
        }
    }

    [Fact]
    public void Baska_modullerin_izin_adlari_asillariyla_ayni()
    {
        DataTransferModules.AiPrompts.ShouldBe(AiPermissions.Prompts.Default);
        DataTransferModules.AiWorkflows.ShouldBe(AiPermissions.Workflows.Default);
        DataTransferModules.AiUsageLogsView.ShouldBe(AiPermissions.UsageLogs.View);
        DataTransferModules.AiReportsView.ShouldBe(AiPermissions.Reports.View);
        DataTransferModules.Tenants.ShouldBe(TenantManagementPermissions.Tenants.Default);
    }
}
