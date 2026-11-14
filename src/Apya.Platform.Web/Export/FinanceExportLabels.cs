using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Export;

/// <summary>
/// Gider/gelir dışa aktarımının proje ve bütçe kalemi adları — içe aktarmanın eşleştirdiği yazımla
/// (proje adı; kalem "kod - ad"), böylece indirilen dosya geri yüklenince bağlar kopmaz. Kişinin
/// göremediği ad boş kalır: projeyi görme izni yoksa proje, bütçeyi görme izni yoksa kalem.
/// </summary>
internal sealed class FinanceExportLabels
{
    private readonly Dictionary<Guid, string> _projects = new();
    private readonly Dictionary<Guid, string> _lines = new();

    public string? Project(Guid? id) => id.HasValue && _projects.TryGetValue(id.Value, out var name) ? name : null;

    public string? BudgetLine(Guid? id) => id.HasValue && _lines.TryGetValue(id.Value, out var name) ? name : null;

    public static async Task<FinanceExportLabels> LoadAsync(PageModel page, IEnumerable<Guid?> projectIds)
    {
        var labels = new FinanceExportLabels();
        var ids = projectIds.Where(id => id.HasValue).Select(id => id!.Value).ToHashSet();
        if (ids.Count == 0)
        {
            return labels;
        }

        var services = page.HttpContext.RequestServices;
        var authorization = services.GetRequiredService<IAuthorizationService>();
        if (!await authorization.IsGrantedAsync(PlatformPermissions.Projects.Default))
        {
            return labels;
        }

        var projects = await services.GetRequiredService<IProjectAppService>()
            .GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 });
        foreach (var project in projects.Items.Where(p => ids.Contains(p.Id)))
        {
            labels._projects[project.Id] = project.Name;
        }

        if (await authorization.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
        {
            var budgets = services.GetRequiredService<IProjectBudgetAppService>();
            foreach (var projectId in labels._projects.Keys)
            {
                foreach (var line in (await budgets.GetRecordFormLookupAsync(projectId)).Lines)
                {
                    labels._lines[line.Id] = line.Code.Length > 0 ? $"{line.Code} - {line.Name}" : line.Name;
                }
            }
        }

        return labels;
    }
}
