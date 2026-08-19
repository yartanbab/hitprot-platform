using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.DbMigrator.DemoWorld;

public partial class DemoWorldSeeder
{
    /// <summary>Bir bağlamdaki demo ekibi — görev ataması ve üyelik için kullanılır.</summary>
    private sealed record DemoTeam(
        Guid CeoId,
        IReadOnlyList<Guid> ManagerIds,
        IReadOnlyList<Guid> EmployeeIds,
        Guid InternId,
        IReadOnlyList<Guid> All)
    {
        /// <summary>Görev atanabilecek kişiler — stajyer dahil, herkes.</summary>
        public IReadOnlyList<Guid> Assignable => All;
    }

    /// <summary>
    /// Rol izin haritası. Kademeler arasında GERÇEK fark var: CEO her şeyi yapar,
    /// Proje Yöneticisi yönetir ama silemez, Çalışan kendi işini yürütür,
    /// Stajyer yalnız okur. Demo'da farklı kullanıcılarla girip fark görülebilir.
    /// </summary>
    private static string[] PermissionsFor(string roleName) => roleName switch
    {
        DemoWorldData.RoleCeo => CeoPermissions,
        DemoWorldData.RoleProjectManager => ManagerPermissions,
        DemoWorldData.RoleEmployee => EmployeePermissions,
        DemoWorldData.RoleIntern => InternPermissions,
        _ => Array.Empty<string>()
    };

    private static readonly string[] CeoPermissions =
    {
        PlatformPermissions.Projects.Default, PlatformPermissions.Projects.Create,
        PlatformPermissions.Projects.Edit, PlatformPermissions.Projects.Delete,
        PlatformPermissions.Projects.ViewBudget, PlatformPermissions.Projects.ManageTeam,
        PlatformPermissions.Projects.UseAiFeatures,

        PlatformPermissions.Tasks.Default, PlatformPermissions.Tasks.Create,
        PlatformPermissions.Tasks.Edit, PlatformPermissions.Tasks.Delete,
        PlatformPermissions.Tasks.Assign, PlatformPermissions.Tasks.ChangeStatus,

        PlatformPermissions.Customers.Default, PlatformPermissions.Customers.Create,
        PlatformPermissions.Customers.Edit, PlatformPermissions.Customers.Delete,

        PlatformPermissions.CashAccounts.Default, PlatformPermissions.CashAccounts.Create,
        PlatformPermissions.CashAccounts.Edit, PlatformPermissions.CashAccounts.Delete,

        PlatformPermissions.CashMovements.Default, PlatformPermissions.CashMovements.Create,
        PlatformPermissions.CashMovements.Edit, PlatformPermissions.CashMovements.Delete,

        PlatformPermissions.Invoices.Default, PlatformPermissions.Invoices.Create,
        PlatformPermissions.Invoices.Edit, PlatformPermissions.Invoices.Delete,

        PlatformPermissions.Expenses.Default, PlatformPermissions.Expenses.Create,
        PlatformPermissions.Expenses.Edit, PlatformPermissions.Expenses.Delete,

        PlatformPermissions.Incomes.Default, PlatformPermissions.Incomes.Create,
        PlatformPermissions.Incomes.Edit, PlatformPermissions.Incomes.Delete,

        PlatformPermissions.ExchangeRates.Default, PlatformPermissions.ExchangeRates.Create,
        PlatformPermissions.ExchangeRates.Edit, PlatformPermissions.ExchangeRates.Delete,

        PlatformPermissions.FxRevaluations.Default, PlatformPermissions.FxRevaluations.Run,
        PlatformPermissions.FxRevaluations.Delete,

        PlatformPermissions.Grants.Default, PlatformPermissions.Grants.Create,
        PlatformPermissions.Grants.Edit, PlatformPermissions.Grants.Delete,

        PlatformPermissions.Documents.Default, PlatformPermissions.Documents.Create,
        PlatformPermissions.Documents.Edit, PlatformPermissions.Documents.Delete,
        PlatformPermissions.Documents.ViewAccessLog,

        PlatformPermissions.DynamicAssets.Default, PlatformPermissions.DynamicAssets.Create,
        PlatformPermissions.DynamicAssets.Edit, PlatformPermissions.DynamicAssets.Delete,
        PlatformPermissions.DynamicAssets.Publish, PlatformPermissions.DynamicAssets.ViewResponses,
        PlatformPermissions.DynamicAssets.Export, PlatformPermissions.DynamicAssets.ManageCategories,

        PlatformPermissions.Reports.Default, PlatformPermissions.Reports.TrialBalance,

        PlatformPermissions.Feedbacks.Default, PlatformPermissions.Feedbacks.Respond,
        PlatformPermissions.Feedbacks.Assign, PlatformPermissions.Feedbacks.Delete,
        PlatformPermissions.Feedbacks.Export, PlatformPermissions.Feedbacks.ManageSettings,

        PlatformPermissions.Notifications.Default,
        PlatformPermissions.Calendars.Default, PlatformPermissions.Calendars.Connect,
        PlatformPermissions.TenantSettings.Default, PlatformPermissions.TenantSettings.ManageAi,
        PlatformPermissions.SystemHealth.Default, PlatformPermissions.SystemHealth.Resolve,
        PlatformPermissions.Consents.Default,
    };

    /// <summary>Proje Yöneticisi: yönetir, atar, mali kayıt girer — ama hiçbir şeyi SİLEMEZ.</summary>
    private static readonly string[] ManagerPermissions =
    {
        PlatformPermissions.Projects.Default, PlatformPermissions.Projects.Create,
        PlatformPermissions.Projects.Edit, PlatformPermissions.Projects.ViewBudget,
        PlatformPermissions.Projects.ManageTeam, PlatformPermissions.Projects.UseAiFeatures,

        PlatformPermissions.Tasks.Default, PlatformPermissions.Tasks.Create,
        PlatformPermissions.Tasks.Edit, PlatformPermissions.Tasks.Assign,
        PlatformPermissions.Tasks.ChangeStatus,

        PlatformPermissions.Customers.Default, PlatformPermissions.Customers.Create,
        PlatformPermissions.Customers.Edit,

        PlatformPermissions.CashAccounts.Default,
        PlatformPermissions.CashMovements.Default,

        PlatformPermissions.Invoices.Default, PlatformPermissions.Invoices.Create,
        PlatformPermissions.Invoices.Edit,

        PlatformPermissions.Expenses.Default, PlatformPermissions.Expenses.Create,
        PlatformPermissions.Expenses.Edit,

        PlatformPermissions.Incomes.Default, PlatformPermissions.Incomes.Create,
        PlatformPermissions.Incomes.Edit,

        PlatformPermissions.ExchangeRates.Default,
        PlatformPermissions.Grants.Default, PlatformPermissions.Grants.Create,
        PlatformPermissions.Grants.Edit,

        PlatformPermissions.Documents.Default, PlatformPermissions.Documents.Create,
        PlatformPermissions.Documents.Edit,

        PlatformPermissions.DynamicAssets.Default, PlatformPermissions.DynamicAssets.Create,
        PlatformPermissions.DynamicAssets.Edit, PlatformPermissions.DynamicAssets.Publish,
        PlatformPermissions.DynamicAssets.ViewResponses, PlatformPermissions.DynamicAssets.Export,

        PlatformPermissions.Reports.Default, PlatformPermissions.Reports.TrialBalance,
        PlatformPermissions.Feedbacks.Default, PlatformPermissions.Feedbacks.Respond,
        PlatformPermissions.Notifications.Default,
        PlatformPermissions.Calendars.Default, PlatformPermissions.Calendars.Connect,
    };

    /// <summary>Çalışan: kendi işini yürütür — görev açar/düzenler, durum değiştirir. Finansı yalnız görmez.</summary>
    private static readonly string[] EmployeePermissions =
    {
        PlatformPermissions.Projects.Default,
        PlatformPermissions.Tasks.Default, PlatformPermissions.Tasks.Create,
        PlatformPermissions.Tasks.Edit, PlatformPermissions.Tasks.ChangeStatus,
        PlatformPermissions.Documents.Default, PlatformPermissions.Documents.Create,
        PlatformPermissions.Documents.Edit,
        PlatformPermissions.DynamicAssets.Default,
        PlatformPermissions.Notifications.Default,
        PlatformPermissions.Calendars.Default,
        PlatformPermissions.Feedbacks.Default,
    };

    /// <summary>Stajyer: yalnız okur.</summary>
    private static readonly string[] InternPermissions =
    {
        PlatformPermissions.Projects.Default,
        PlatformPermissions.Tasks.Default,
        PlatformPermissions.Documents.Default,
        PlatformPermissions.Notifications.Default,
        PlatformPermissions.Calendars.Default,
    };

    /// <summary>
    /// Bir bağlamda dört rolü ve kademeli kullanıcıları kurar.
    /// <para>İzinler <c>IPermissionManager</c> yerine doğrudan <c>PermissionGrant</c> satırı
    /// olarak yazılır: 31 bağlam × 4 rol × ~30 izin = ~3.700 kayıt, manager üzerinden
    /// tek tek gitmek tohumlamayı dakikalarca uzatırdı.</para>
    /// </summary>
    private async Task<DemoTeam> SeedRolesAndUsersAsync(Guid? tenantId, string slug, bool isPrimary)
    {
        var roleNames = new[]
        {
            DemoWorldData.RoleCeo,
            DemoWorldData.RoleProjectManager,
            DemoWorldData.RoleEmployee,
            DemoWorldData.RoleIntern
        };

        var grants = new List<PermissionGrant>();

        foreach (var roleName in roleNames)
        {
            var role = new IdentityRole(_guid.Create(), roleName, tenantId);
            (await _roleManager.CreateAsync(role)).CheckDemoResult($"rol '{roleName}'");

            foreach (var permission in PermissionsFor(roleName))
            {
                // "R" = RolePermissionValueProvider.ProviderName; sağlayıcı anahtarı rol adıdır.
                grants.Add(new PermissionGrant(_guid.Create(), permission, "R", roleName, tenantId));
            }
        }

        await _permissionGrants.InsertManyAsync(grants, autoSave: true);

        // --- kullanıcılar ---
        var managerCount = isPrimary ? 2 : 1;
        var employeeCount = isPrimary ? 4 : 2;

        var ceoId = await CreateUserAsync(tenantId, slug, "ceo", DemoWorldData.RoleCeo, 0);

        var managerIds = new List<Guid>();
        for (var i = 0; i < managerCount; i++)
        {
            managerIds.Add(await CreateUserAsync(tenantId, slug, $"pm{i + 1}", DemoWorldData.RoleProjectManager, 1 + i));
        }

        var employeeIds = new List<Guid>();
        for (var i = 0; i < employeeCount; i++)
        {
            employeeIds.Add(await CreateUserAsync(tenantId, slug, $"calisan{i + 1}", DemoWorldData.RoleEmployee, 3 + i));
        }

        var internId = await CreateUserAsync(tenantId, slug, "stajyer", DemoWorldData.RoleIntern, 8);

        var all = new List<Guid> { ceoId };
        all.AddRange(managerIds);
        all.AddRange(employeeIds);
        all.Add(internId);

        return new DemoTeam(ceoId, managerIds, employeeIds, internId, all);
    }

    private async Task<Guid> CreateUserAsync(Guid? tenantId, string slug, string userName, string roleName, int personIndex)
    {
        var person = DemoWorldData.People[personIndex % DemoWorldData.People.Length];

        var user = new IdentityUser(
            _guid.Create(),
            userName,
            $"{userName}@{slug}.apya.demo",
            tenantId)
        {
            Name = person.Name,
            Surname = person.Surname
        };

        (await _userManager.CreateAsync(user, DemoPassword)).CheckDemoResult($"kullanici '{userName}'");
        (await _userManager.AddToRoleAsync(user, roleName)).CheckDemoResult($"rol atamasi '{userName}' -> '{roleName}'");

        return user.Id;
    }
}

internal static class DemoIdentityResultExtensions
{
    /// <summary>
    /// ABP'nin <c>CheckErrors()</c> uzantısı bu katmandan görünmediği için hata kontrolü elle yapılır.
    /// </summary>
    public static void CheckDemoResult(this Microsoft.AspNetCore.Identity.IdentityResult result, string what)
    {
        if (!result.Succeeded)
        {
            throw new AbpException(
                $"Demo dunyasi kurulamadi ({what}): " +
                string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
