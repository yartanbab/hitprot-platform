using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Web.Pages;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Import;

/// <summary>
/// Finans kaydının tek satırlık Excel karşılığının ortak sütunları. Cari bağı kullanılmayan alan olduğu
/// için sayfada yoktur; tahsilat ve durum kasa hareketi yazdığı için ekrandan girilir.
/// </summary>
internal abstract class FinanceParameterSheet<TRecord, TInput> : ParameterSheet<FinanceSheetRow<TRecord>, TInput>
    where TRecord : class
    where TInput : new()
{
    protected FinanceParameterSheet(IStringLocalizer l)
        : base(l, "Import:FinanceFull:")
    {
    }

    public string TenantHeader => H("Tenant");

    protected string BudgetLineHeader => H("BudgetLine");

    /// <summary>Satırın hedef kiracısı; sayfa okumadan önce belirler.</summary>
    public FinanceTenantContext Target { get; set; } = null!;

    public abstract Guid RecordId(TRecord record);

    protected override Guid IdOf(FinanceSheetRow<TRecord> source) => RecordId(source.Record);

    protected override string IdHint => Guide("FinanceId");

    protected Field TenantField(IReadOnlyList<string> tenantNames)
        => new(TenantHeader, Guide("Tenant"), s => s.Context.TenantName, (_, _) => { }, (_, _) => { }, Options: tenantNames);

    protected Field CurrencyField(Func<TRecord, string> get, Action<TInput, string> set, Func<TInput, string?> fallback, string hint)
    {
        var header = H("Currency");
        return new(header, hint, s => get(s.Record), (s, t) => set(t, get(s.Record)),
            (row, t) =>
            {
                var text = row.Text(header).ToUpperInvariant();
                if (text.Length > 0 && !Regex.IsMatch(text, "^[A-Z]{3}$"))
                {
                    row.Errors.Add(L["Import:Error:Currency", header]);
                }

                set(t, text.Length > 0 ? text : fallback(t) ?? "TRY");
            },
            Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList());
    }

    protected Field ProjectField(Func<TRecord, Guid?> get, Action<TInput, Guid?> set, bool required = false)
    {
        var header = H("Project");
        return new(header, Guide("ProjectRef"),
            s => get(s.Record) is { } id ? s.Context.Projects.FirstOrDefault(p => p.Id == id)?.Code : null,
            (s, t) => set(t, get(s.Record)),
            (row, t) =>
            {
                var text = row.Text(header);
                set(t, text.Length > 0 && TryPick(row, header, text, Target.Projects, p => [p.Code, p.Name], out var match)
                    ? match.Id
                    : null);
            },
            Required: required);
    }

    /// <summary>Görev koduyla bağlanır. Proje boşsa görevden gelir; doluysa görevin projesi olmalı.</summary>
    protected Field TaskField(Func<TRecord, Guid?> get, Func<TInput, Guid?> project, Action<TInput, Guid?> setProject, Action<TInput, Guid?> set)
    {
        var header = H("Task");
        return new(header, Guide("TaskRef"),
            s => get(s.Record) is { } id && s.Context.Tasks.TryGetValue(id, out var task) ? task.Code : null,
            (s, t) => set(t, get(s.Record)),
            (row, t) =>
            {
                set(t, null);
                var text = row.Text(header);
                if (text.Length == 0)
                {
                    return;
                }

                if (!Target.TaskCodes.TryGetValue(text, out var id))
                {
                    row.Errors.Add(L["Import:Error:NotFound", header, text]);
                    return;
                }

                var taskProject = Target.Tasks[id].ProjectId;
                if (project(t) == null && row.Text(H("Project")).Length == 0)
                {
                    setProject(t, taskProject);
                }
                else if (project(t) != taskProject)
                {
                    row.Errors.Add(L["Import:Error:TaskProjectMismatch", header, H("Project")]);
                }

                set(t, id);
            });
    }

    protected Field BudgetLineField(Func<TRecord, Guid?> getProject, Func<TRecord, Guid?> get, Func<TInput, Guid?> project, Action<TInput, Guid?> set)
    {
        var header = BudgetLineHeader;
        return new(header, Guide("FinanceBudgetLine"),
            s => get(s.Record) is { } id && getProject(s.Record) is { } projectId && s.Context.Lines.TryGetValue(projectId, out var lines)
                ? lines.FirstOrDefault(l => l.Id == id).Label
                : null,
            (s, t) => set(t, get(s.Record)),
            (row, t) =>
            {
                set(t, null);
                var text = row.Text(header);
                if (text.Length == 0)
                {
                    return;
                }

                if (project(t) is not { } projectId)
                {
                    row.Errors.Add(L["Import:Error:BudgetLineWithoutProject", header, H("Project")]);
                    return;
                }

                var lines = Target.Lines.GetValueOrDefault(projectId) ?? [];
                if (TryPick(row, header, text, lines, l => [l.Label, l.Name], out var match))
                {
                    set(t, match.Id);
                }
            });
    }

    /// <summary>Boş hücre "zorunlu", geçersiz metin zaten okunurken yazıldı; ikinci hata üretilmez.</summary>
    protected void RequireCell(ImportRow row, string header)
    {
        if (row.Text(header).Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", header]);
        }
    }
}

/// <summary>Gider ya da gelir kaydı: sayfa bunu kendi oluşturma DTO'suna çevirir.</summary>
public sealed class FinanceEntry<TCategory> where TCategory : struct, Enum
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public TCategory Category { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TRY";

    public Guid? CashAccountId { get; set; }

    public string? CashAccountName { get; set; }

    public Guid? ProjectId { get; set; }

    public Guid? TaskId { get; set; }

    public Guid? BudgetLineId { get; set; }

    public string? Description { get; set; }
}

/// <summary>Gider ve gelirin ortak sayfası.</summary>
internal sealed class FinanceEntrySheet<TCategory> : FinanceParameterSheet<FinanceEntry<TCategory>, FinanceEntry<TCategory>>
    where TCategory : struct, Enum
{
    private readonly List<(TCategory Value, string Label)> _categories;
    private readonly TCategory _fallback;

    public FinanceEntrySheet(IStringLocalizer l, IReadOnlyList<string> tenantNames, string categoryKeyPrefix, TCategory fallback,
        int maxTitleLength, int maxDescriptionLength)
        : base(l)
    {
        _fallback = fallback;
        _categories = Enum.GetValues<TCategory>().Select(c => (c, l[categoryKeyPrefix + c].Value)).ToList();

        Fields =
        [
            TenantField(tenantNames),
            Text("Title", s => s.Record.Title, (t, v) => t.Title = v ?? string.Empty, required: true, maxLength: maxTitleLength),
            Date("Date", s => s.Record.Date, (t, v) => t.Date = v ?? default) with { Required = true },
            CategoryField(),
            Amount("Amount", s => s.Record.Amount, (t, v) => t.Amount = v ?? 0m) with { Hint = Guide("FinanceAmount"), Required = true },
            AccountField(),
            // Kasadan sonra okunur: boş para birimi kasanınkidir.
            CurrencyField(r => r.Currency, (t, v) => t.Currency = v,
                t => Target.Accounts.FirstOrDefault(a => a.Id == t.CashAccountId)?.Currency, Guide("FinanceCurrency")),
            ProjectField(r => r.ProjectId, (t, v) => t.ProjectId = v),
            TaskField(r => r.TaskId, t => t.ProjectId, (t, v) => t.ProjectId = v, (t, v) => t.TaskId = v),
            BudgetLineField(r => r.ProjectId, r => r.BudgetLineId, t => t.ProjectId, (t, v) => t.BudgetLineId = v),
            Text("Description", s => s.Record.Description, (t, v) => t.Description = v, maxLength: maxDescriptionLength),
        ];
    }

    public override Guid RecordId(FinanceEntry<TCategory> record) => record.Id;

    protected override void Validate(ImportRow row, FinanceEntry<TCategory> input)
    {
        Require(row, H("Title"), input.Title);
        RequireCell(row, H("Date"));

        var amount = H("Amount");
        RequireCell(row, amount);
        if (ExcelImport.Decimal(row.Value(amount)) != null && input.Amount <= 0)
        {
            row.Errors.Add(L["Import:Error:Positive", amount]);
        }

        // Servis de reddeder; önizlemede görünsün diye burada da sorulur.
        if (input.ProjectId is { } project && row.Text(BudgetLineHeader).Length == 0
            && Target.Lines.GetValueOrDefault(project)?.Count > 0)
        {
            row.Errors.Add(L["Import:Error:BudgetLineRequired", BudgetLineHeader]);
        }
    }

    private Field CategoryField()
    {
        var header = H("Category");
        return new(header, Guide("FinanceCategory"),
            s => _categories.FirstOrDefault(c => c.Value.Equals(s.Record.Category)).Label,
            (s, t) => t.Category = s.Record.Category,
            (row, t) =>
            {
                var text = row.Text(header);
                t.Category = text.Length > 0 && TryPick(row, header, text, _categories, c => [c.Label, c.Value.ToString()], out var match)
                    ? match.Value
                    : _fallback;
            },
            Options: _categories.Select(c => c.Label).ToList());
    }

    private Field AccountField()
    {
        var header = H("CashAccount");
        return new(header, Guide("CashAccount"), s => s.Record.CashAccountName,
            (s, t) => t.CashAccountId = s.Record.CashAccountId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.CashAccountId = text.Length > 0 && TryPick(row, header, text, Target.Accounts, a => [a.Name], out var match)
                    ? match.Id
                    : null;
            });
    }
}
