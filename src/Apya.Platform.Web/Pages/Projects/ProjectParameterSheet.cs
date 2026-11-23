using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Import;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>
/// Projenin tek satırlık Excel karşılığı. Kapak görseli dosya, cari bağı kullanılmayan alan olduğu
/// için sayfada yoktur; mevcut projede ikisi de korunur.
/// </summary>
internal sealed class ProjectParameterSheet : ParameterSheet<ProjectDto, CreateProjectDto>
{
    private const int MaxNameLength = 128;
    private const int MaxCodeLength = 32;

    private readonly IReadOnlyDictionary<Guid, string> _tenantNames;
    private readonly IReadOnlyList<(Guid Id, string Label)> _grants;

    public ProjectParameterSheet(IStringLocalizer l, IReadOnlyList<(Guid Id, string Name)> tenants,
        IReadOnlyList<(Guid Id, string Label)> grants)
        : base(l, "Import:ProjectFull:")
    {
        _tenantNames = tenants.ToDictionary(t => t.Id, t => t.Name);
        _grants = grants;

        Fields =
        [
            Tenant(tenants),
            Text("Code", d => d.Code, (t, v) => t.Code = v ?? string.Empty, maxLength: MaxCodeLength) with { Hint = Guide("Code") },
            Text("Name", d => d.Name, (t, v) => t.Name = v ?? string.Empty, required: true, maxLength: MaxNameLength),
            Category(),
            Grant(),
            Text("Description", d => d.Description, (t, v) => t.Description = v),
            Text("Purpose", d => d.Purpose, (t, v) => t.Purpose = v),
            Text("TargetAudience", d => d.TargetAudience, (t, v) => t.TargetAudience = v),
            Text("Activities", d => d.Activities, (t, v) => t.Activities = v),
            Date("StartDate", d => d.StartDate, (t, v) => t.StartDate = v),
            Date("EndDate", d => d.EndDate, (t, v) => t.EndDate = v),
            Amount("TotalBudget", d => d.TotalBudget, (t, v) => t.TotalBudget = v ?? 0m),
            Amount("HourlyRate", d => d.HourlyRate, (t, v) => t.HourlyRate = v ?? 0m),
            Currency(),
            YesNo("TemplateTasks", _ => false, (t, v) => t.AddTemplateTasks = v) with { Hint = Guide("TemplateTasks") },
        ];
    }

    public string TenantHeader => H("Tenant");

    public string CodeHeader => H("Code");

    public string TemplateTasksHeader => H("TemplateTasks");

    public string TotalBudgetHeader => H("TotalBudget");

    /// <summary>Satırın hedef kiracısı; sayfa okumadan önce belirler.</summary>
    public Guid? TargetTenantId { get; set; }

    /// <summary>Hedef kiracının seçilebilir kategorileri.</summary>
    public IReadOnlyList<(Guid Id, string Name)> TargetCategories { get; set; } = [];

    public string TenantName(Guid? id) => id is { } value && _tenantNames.TryGetValue(value, out var name) ? name : string.Empty;

    protected override Guid IdOf(ProjectDto source) => source.Id;

    protected override void Validate(ImportRow row, CreateProjectDto input)
    {
        Require(row, H("Name"), input.Name);
        if (input.StartDate.HasValue && input.EndDate < input.StartDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", H("EndDate"), H("StartDate")]);
        }

        if (input.TotalBudget < 0) row.Errors.Add(L["Import:Error:Negative", H("TotalBudget")]);
        if (input.HourlyRate < 0) row.Errors.Add(L["Import:Error:Negative", H("HourlyRate")]);
    }

    private Field Tenant(IReadOnlyList<(Guid Id, string Name)> tenants)
        => new(TenantHeader, Guide("Tenant"), d => TenantName(d.TenantId), (d, t) => t.TenantId = d.TenantId,
            (_, t) => t.TenantId = TargetTenantId, Options: tenants.Select(x => x.Name).ToList());

    private Field Category()
    {
        var header = H("Category");
        return new(header, Guide("Category"), d => d.CategoryName, (d, t) => t.CategoryId = d.CategoryId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.CategoryId = text.Length > 0 && TryPick(row, header, text, TargetCategories, c => [c.Name], out var match)
                    ? match.Id
                    : null;
            });
    }

    private Field Grant()
    {
        var header = H("Grant");
        return new(header, Guide("GrantLink"),
            d => d.GrantId is { } id ? _grants.FirstOrDefault(g => g.Id == id).Label : null,
            (d, t) => t.GrantId = d.GrantId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.GrantId = text.Length > 0 && TryPick(row, header, text, _grants, g => [g.Label], out var match)
                    ? match.Id
                    : null;
            },
            Options: _grants.Select(g => g.Label).ToList());
    }

    private Field Currency()
    {
        var header = H("Currency");
        return new(header, Guide("Currency"), d => d.Currency, (d, t) => t.Currency = d.Currency,
            (row, t) =>
            {
                var text = row.Text(header).ToUpperInvariant();
                if (text.Length > 0 && !Regex.IsMatch(text, "^[A-Z]{3}$"))
                {
                    row.Errors.Add(L["Import:Error:Currency", header]);
                }

                t.Currency = text.Length > 0 ? text : "TRY";
            },
            Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList());
    }
}
