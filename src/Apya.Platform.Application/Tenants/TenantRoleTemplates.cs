using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Permissions;

namespace Apya.Platform.Tenants;

/// <summary>
/// SEC-07 · Kiracıya hazır gelen roller (ürün kararı, 2026-10-13). Roller eskiden yalnız demo
/// tohumlamasında vardı; gerçek kiracı tek "admin" rolüyle başlıyor, her rolü elle kurması
/// gerekiyordu.
///
/// <para>"Yönetici" burada YOK: o, kimlik tohumlayıcısının kurduğu statik "admin" rolüdür.</para>
///
/// <para>İzin kümeleri MODÜL ADIYLA tanımlanır, tek tek izin adıyla değil. İleride bir modüle
/// eklenen yeni izin, o modülün "tamamını" alan role kendiliğinden girer; yalnız görüntüleme alan
/// role girmez. Yeni bir MODÜL ise hiçbir şablona kendiliğinden girmez — bilerek eklenmelidir.</para>
///
/// <para>Şablon paketi bilmez: paketin kapsamadığı modülün izni role yazılır ama paket tavanı
/// (<c>PackagePermissionStateChecker</c>) onu kapalı tutar; paket yükseltilince kendiliğinden açılır.</para>
/// </summary>
public static class TenantRoleTemplates
{
    public const string ProjectLead = "Proje Sorumlusu";
    public const string Accounting = "Muhasebe";
    public const string Observer = "Gözlemci";

    /// <param name="Name">Rol adı (kiracıda görünen).</param>
    /// <param name="FullModules">Tüm izinleri (görme + alt izinler) verilen modül kökleri.</param>
    /// <param name="Exact">Ayrıca tek tek verilen izinler (çoğunlukla yalnız görüntüleme).</param>
    public sealed record Template(string Name, string[] FullModules, string[] Exact);

    /// <summary>Her modülün yalnız GÖRÜNTÜLEME izni — Gözlemci'nin tamamı, diğerlerinin tabanı.</summary>
    private static readonly string[] ViewAll =
    {
        PlatformPermissions.Projects.Default,
        PlatformPermissions.Projects.ViewBudget,
        PlatformPermissions.Projects.ViewIndicators,
        PlatformPermissions.Tasks.Default,
        PlatformPermissions.Documents.Default,
        PlatformPermissions.DynamicAssets.Default,
        PlatformPermissions.Grants.Default,
        PlatformPermissions.Expenses.Default,
        PlatformPermissions.Incomes.Default,
        PlatformPermissions.Invoices.Default,
        PlatformPermissions.Customers.Default,
        PlatformPermissions.CashAccounts.Default,
        PlatformPermissions.CashMovements.Default,
        PlatformPermissions.ExchangeRates.Default,
        PlatformPermissions.FxRevaluations.Default,
        PlatformPermissions.Notifications.Default,
        PlatformPermissions.Calendars.Default,
    };

    public static readonly IReadOnlyList<Template> All = new[]
    {
        // Proje, görev, belge, form ve hibe başvurusunu yönetir; bütçeyi ve finans kayıtlarını görür.
        new Template(
            ProjectLead,
            FullModules: new[]
            {
                PlatformPermissions.Projects.Default,
                PlatformPermissions.Tasks.Default,
                PlatformPermissions.Documents.Default,
                PlatformPermissions.DynamicAssets.Default,
                PlatformPermissions.Calendars.Default,
                PlatformPermissions.Notifications.Default,
            },
            Exact: new[]
            {
                PlatformPermissions.Grants.Default,
                PlatformPermissions.Grants.ManageApplications,
                PlatformPermissions.Expenses.Default,
                PlatformPermissions.Incomes.Default,
                PlatformPermissions.Invoices.Default,
                PlatformPermissions.Customers.Default,
            }),

        // Finans kayıtlarının tamamı; projeleri, bütçeyi ve belgeleri görür, bütçe kalemlerini düzenler.
        new Template(
            Accounting,
            FullModules: new[]
            {
                PlatformPermissions.Expenses.Default,
                PlatformPermissions.Incomes.Default,
                PlatformPermissions.Invoices.Default,
                PlatformPermissions.Customers.Default,
                PlatformPermissions.CashAccounts.Default,
                PlatformPermissions.CashMovements.Default,
                PlatformPermissions.ExchangeRates.Default,
                PlatformPermissions.FxRevaluations.Default,
                PlatformPermissions.Reports.Default,
                PlatformPermissions.Calendars.Default,
                PlatformPermissions.Notifications.Default,
            },
            Exact: new[]
            {
                PlatformPermissions.Projects.Default,
                PlatformPermissions.Projects.ViewBudget,
                PlatformPermissions.Projects.ManageBudget,
                PlatformPermissions.Projects.ViewIndicators,
                PlatformPermissions.Tasks.Default,
                PlatformPermissions.Documents.Default,
            }),

        // Her modülü görür, hiçbir şeyi değiştiremez. Raporlar salt-okurdur, tamamı verilir.
        new Template(
            Observer,
            FullModules: new[] { PlatformPermissions.Reports.Default },
            Exact: ViewAll),
    };

    /// <summary>
    /// Şablonun izin adlarını, kiracı tarafında TANIMLI izinler içinden çözer. Host'a özel ya da
    /// artık tanımlı olmayan ad sessizce düşer.
    /// </summary>
    public static List<string> Resolve(Template template, IEnumerable<string> tenantPermissionNames)
    {
        var defined = tenantPermissionNames.ToHashSet(StringComparer.Ordinal);

        return defined
            .Where(name =>
                template.Exact.Contains(name, StringComparer.Ordinal)
                || template.FullModules.Any(root =>
                    name == root || name.StartsWith(root + ".", StringComparison.Ordinal)))
            .OrderBy(name => name, StringComparer.Ordinal)
            .ToList();
    }
}
