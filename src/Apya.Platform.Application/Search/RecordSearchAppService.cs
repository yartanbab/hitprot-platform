using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants;
using Apya.Platform.Invoices;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Search;

/// <summary>
/// X-01 · Ctrl K kayıt araması. Her tür kendi ekranının kuralıyla aranır:
/// <list type="bullet">
/// <item>Görev: <see cref="ITaskAppService.GetListAsync"/> — görev listesinin kiracı ve gizli görev süzgeci aynen geçerli.</item>
/// <item>Proje: proje listesiyle aynı kapsam (host tüm kiracılar, kiracı kendi projeleri).</item>
/// <item>Hibe başvurusu: kiracı kendi başvuruları (sihirbaz), host tüm başvurular (danışman ayrıntısı).</item>
/// <item>Fatura: kiracının kendi faturaları; numaraya göre.</item>
/// </list>
/// İzni olmayan tür aranmaz (403 yerine boş).
/// </summary>
[Authorize]
public class RecordSearchAppService : PlatformAppService, IRecordSearchAppService
{
    private readonly ITaskAppService _tasks;
    private readonly IRepository<Project, Guid> _projects;
    private readonly IRepository<GrantApplication, Guid> _applications;
    private readonly IRepository<GrantCall, Guid> _calls;
    private readonly IRepository<Grant, Guid> _grants;
    private readonly IRepository<Invoice, Guid> _invoices;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ITenantRepository _tenants;

    public RecordSearchAppService(
        ITaskAppService tasks,
        IRepository<Project, Guid> projects,
        IRepository<GrantApplication, Guid> applications,
        IRepository<GrantCall, Guid> calls,
        IRepository<Grant, Guid> grants,
        IRepository<Invoice, Guid> invoices,
        IDataFilter<IMultiTenant> mtFilter,
        ITenantRepository tenants)
    {
        _tasks = tasks;
        _projects = projects;
        _applications = applications;
        _calls = calls;
        _grants = grants;
        _invoices = invoices;
        _mtFilter = mtFilter;
        _tenants = tenants;
    }

    public async Task<List<RecordSearchResultDto>> SearchAsync(string term)
    {
        var q = (term ?? string.Empty).Trim();
        var results = new List<RecordSearchResultDto>();
        if (q.Length < RecordSearchLimits.MinTermLength)
        {
            return results;
        }

        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            var tasks = await _tasks.GetListAsync(new GetTasksInput { Filter = q, MaxResultCount = RecordSearchLimits.PerKind });
            results.AddRange(tasks.Items.Select(t => new RecordSearchResultDto
            {
                Kind = "task",
                Title = t.Title,
                Subtitle = string.IsNullOrWhiteSpace(t.ProjectName) ? t.Code : t.Code + " · " + t.ProjectName,
                Url = "/Tasks/Detail/" + t.Id
            }));
        }

        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.Default))
        {
            // Proje listesiyle aynı kapsam: host yaşayan kiracıların ve kendi projelerini görür (D-2: silinmiş
            // kiracının projesi listede olmadığı gibi aramada da çıkmaz).
            using (CurrentTenant.Id == null ? _mtFilter.Disable() : null)
            {
                var tenantNames = CurrentTenant.Id == null
                    ? (await _tenants.GetListAsync()).ToDictionary(t => t.Id, t => t.Name)
                    : new Dictionary<Guid, string>();
                var liveTenantIds = tenantNames.Keys.ToList();

                var projectQuery = (await _projects.GetQueryableAsync())
                    .Where(p => p.Name.Contains(q) || p.Code.Contains(q));
                if (CurrentTenant.Id == null)
                {
                    projectQuery = projectQuery.Where(p => p.TenantId == null || liveTenantIds.Contains(p.TenantId.Value));
                }
                var projects = await AsyncExecuter.ToListAsync(projectQuery
                    .OrderBy(p => p.Name)
                    .Take(RecordSearchLimits.PerKind));
                // Host aynı adlı projeleri kiracıdan ayırır (QA-03 ile aynı gerekçe).
                results.AddRange(projects.Select(p => new RecordSearchResultDto
                {
                    Kind = "project",
                    Title = p.Name,
                    // Savunma: kiracı adı bulunamazsa (yarış durumu) "bilinmeyen müşteri" yazılır.
                    Subtitle = !p.TenantId.HasValue || CurrentTenant.Id != null
                        ? p.Code
                        : p.Code + " · " + (tenantNames.TryGetValue(p.TenantId.Value, out var tenantName)
                            ? tenantName
                            : L["RecordSearch:UnknownTenant"].Value),
                    Url = "/Projects/ProjectDetails/" + p.Id
                }));
            }
        }

        // Host danışman ayrıntısını (DetailHost) Grants.Edit ile açar; kiracı sihirbazı Grants.Default ile.
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Grants.Default)
            && (CurrentTenant.Id != null || await AuthorizationService.IsGrantedAsync(PlatformPermissions.Grants.Edit)))
        {
            results.AddRange(await SearchApplicationsAsync(q));
        }

        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Invoices.Default))
        {
            var invoices = await AsyncExecuter.ToListAsync((await _invoices.GetQueryableAsync())
                .Where(i => i.InvoiceNumber.Contains(q))
                .OrderByDescending(i => i.InvoiceDate)
                .Take(RecordSearchLimits.PerKind));
            results.AddRange(invoices.Select(i => new RecordSearchResultDto
            {
                Kind = "invoice",
                Title = i.InvoiceNumber,
                Subtitle = i.InvoiceDate.ToString("dd.MM.yyyy") + " · " + i.TotalAmount.ToString("N0") + " " + i.Currency,
                Url = "/Invoices?invoiceId=" + i.Id
            }));
        }

        return results;
    }

    /// <summary>
    /// Başvuru programın adıyla ya da proje başlığıyla bulunur. Program ve çağrı host kataloğundadır
    /// (TenantId == null — 🔴 Disable() tüm kiracılara açtığı için koşul elle konur); başvuru kiracıda
    /// kendi kapsamıyla, host'ta tüm kiracılarda aranır.
    /// </summary>
    private async Task<List<RecordSearchResultDto>> SearchApplicationsAsync(string q)
    {
        Dictionary<Guid, string> grantNames;
        Dictionary<Guid, Guid> callGrant;
        using (_mtFilter.Disable())
        {
            grantNames = (await _grants.GetListAsync(g => g.TenantId == null)).ToDictionary(g => g.Id, g => g.Name);
            callGrant = (await _calls.GetListAsync(c => c.TenantId == null)).ToDictionary(c => c.Id, c => c.GrantId);
        }

        var matchingCalls = callGrant
            .Where(kv => grantNames.TryGetValue(kv.Value, out var name)
                         && name.Contains(q, StringComparison.CurrentCultureIgnoreCase))
            .Select(kv => kv.Key)
            .ToList();

        var isHost = CurrentTenant.Id == null;
        List<GrantApplication> applications;
        using (isHost ? _mtFilter.Disable() : null)
        {
            applications = await AsyncExecuter.ToListAsync((await _applications.GetQueryableAsync())
                .Where(a => matchingCalls.Contains(a.GrantCallId)
                            || (a.ProjectTitle != null && a.ProjectTitle.Contains(q)))
                .OrderByDescending(a => a.CreationTime)
                .Take(RecordSearchLimits.PerKind));
        }

        return applications.Select(a => new RecordSearchResultDto
        {
            Kind = "grant",
            Title = callGrant.TryGetValue(a.GrantCallId, out var grantId) && grantNames.TryGetValue(grantId, out var name)
                ? name
                : (a.ProjectTitle ?? "—"),
            Subtitle = a.ProjectTitle,
            Url = (isHost ? "/Grants/DetailHost?id=" : "/Grants/Wizard?id=") + a.Id
        }).ToList();
    }
}
