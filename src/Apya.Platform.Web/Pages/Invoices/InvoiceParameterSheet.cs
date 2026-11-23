using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Web.Import;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Invoices;

/// <summary>
/// Faturanın tek satırlık Excel karşılığı. Kalemler tek hücrede: "Açıklama | Miktar | Birim fiyat",
/// noktalı virgülle ayrılır. Tahsilat, durum ve cari sayfada yoktur.
/// </summary>
internal sealed class InvoiceParameterSheet : FinanceParameterSheet<InvoiceDto, CreateInvoiceDto>
{
    private const int MaxNumberLength = 64;
    private const int MaxLineLength = 256;
    private const decimal DefaultTaxRate = 20m;

    // Hücre metni Türkçe yazılır: "1.500" içe aktarmada bin ayracı sayılır, ondalık virgüldür.
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly List<(InvoiceDirection Value, string Label)> _directions;

    public InvoiceParameterSheet(IStringLocalizer l, IReadOnlyList<string> tenantNames)
        : base(l)
    {
        _directions = Enum.GetValues<InvoiceDirection>().Select(d => (d, l[$"Invoice:Direction:{d}"].Value)).ToList();

        Fields =
        [
            TenantField(tenantNames),
            Text("Number", s => s.Record.InvoiceNumber, (t, v) => t.InvoiceNumber = v ?? string.Empty, required: true, maxLength: MaxNumberLength)
                with { Hint = Guide("InvoiceNumber") },
            DirectionField(),
            ProjectField(r => r.ProjectId, (t, v) => t.ProjectId = v ?? Guid.Empty, required: true),
            TaskField(r => r.TaskId, ProjectOf, (t, v) => t.ProjectId = v ?? Guid.Empty, (t, v) => t.TaskId = v),
            BudgetLineField(r => r.ProjectId, r => r.BudgetLineId, ProjectOf, (t, v) => t.BudgetLineId = v),
            Date("Date", s => s.Record.InvoiceDate, (t, v) => t.InvoiceDate = v ?? default) with { Required = true },
            Date("DueDate", s => s.Record.DueDate, (t, v) => t.DueDate = v ?? default) with { Hint = Guide("InvoiceDueDate") },
            Amount("TaxRate", s => s.Record.TaxRate, (t, v) => t.TaxRate = v ?? DefaultTaxRate) with { Hint = Guide("TaxRate") },
            YesNo("PricesIncludeTax", _ => false, (t, v) => t.PricesIncludeTax = v) with { Hint = Guide("PricesIncludeTax") },
            Text("Exemption", s => s.Record.VatExemptionReference, (t, v) => t.VatExemptionReference = v, maxLength: VatExemptionConsts.MaxReferenceLength)
                with { Hint = Guide("Exemption") },
            CurrencyField(r => r.Currency, (t, v) => t.Currency = v, _ => null, Guide("Currency")),
            Text("Notes", s => s.Record.Notes, (t, v) => t.Notes = v),
            ItemsField(),
        ];
    }

    public string NumberHeader => H("Number");

    public override Guid RecordId(InvoiceDto record) => record.Id;

    private static Guid? ProjectOf(CreateInvoiceDto input) => input.ProjectId == Guid.Empty ? null : input.ProjectId;

    protected override void Validate(ImportRow row, CreateInvoiceDto input)
    {
        Require(row, NumberHeader, input.InvoiceNumber);
        RequireCell(row, H("Date"));

        // Proje boşsa görevden gelmiş olabilir.
        if (input.ProjectId == Guid.Empty && row.Text(H("Project")).Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", H("Project")]);
        }

        if (input.DueDate == default)
        {
            input.DueDate = input.InvoiceDate;
        }
        else if (input.InvoiceDate != default && input.DueDate < input.InvoiceDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", H("DueDate"), H("Date")]);
        }

        if (input.TaxRate is < 0 or > 100)
        {
            row.Errors.Add(L["Import:Error:Percent", H("TaxRate")]);
        }

        if (input.Items.Count == 0 && Entries(row.Text(H("Items"))).Count == 0)
        {
            row.Errors.Add(L["Import:Error:Required", H("Items")]);
        }
    }

    private Field DirectionField()
    {
        var header = H("Direction");
        return new(header, Guide("Pick"), s => _directions.FirstOrDefault(d => d.Value == s.Record.Direction).Label,
            (s, t) => t.Direction = s.Record.Direction,
            (row, t) =>
            {
                var text = row.Text(header);
                t.Direction = text.Length > 0 && TryPick(row, header, text, _directions, d => [d.Label, d.Value.ToString()], out var match)
                    ? match.Value
                    : InvoiceDirection.Sales;
            },
            Options: _directions.Select(d => d.Label).ToList());
    }

    private Field ItemsField()
    {
        var header = H("Items");
        return new(header, Guide("InvoiceItems"), s => JoinItems(s.Record.Items),
            (s, t) => t.Items = s.Record.Items
                .Select(i => new CreateInvoiceItemDto { Description = i.Description, Quantity = i.Quantity, UnitPrice = i.UnitPrice })
                .ToList(),
            (row, t) => t.Items = ReadItems(row, header),
            Required: true);
    }

    // Veritabanı kalem sırasını garanti etmez: sıra değişirse aynı hücre "değişti" sayılırdı.
    private static string? JoinItems(IEnumerable<InvoiceItemDto> items)
        => JoinCell(items
            .OrderBy(i => i.Description, StringComparer.Ordinal)
            .ThenBy(i => i.Quantity)
            .ThenBy(i => i.UnitPrice)
            .Select(i => $"{Escape(i.Description)} | {Number(i.Quantity)} | {Number(i.UnitPrice)}"));

    private static string? JoinCell(IEnumerable<string> entries)
    {
        var text = string.Join("; ", entries);
        return text.Length > 0 ? text : null;
    }

    private static string Number(decimal value) => value.ToString("0.######", Turkish);

    private List<CreateInvoiceItemDto> ReadItems(ImportRow row, string header)
    {
        var items = new List<CreateInvoiceItemDto>();
        foreach (var entry in Entries(row.Text(header)))
        {
            var parts = SplitCell(entry, '|');
            var description = Unescape(parts[0]);
            var quantity = parts.Count == 3 ? ExcelImport.Decimal(parts[1]) : null;
            var price = parts.Count == 3 && ExcelImport.Decimal(parts[2]) is { } value ? Math.Round(value, 2) : (decimal?)null;
            if (description.Length is 0 or > MaxLineLength || quantity is not > 0 || price is not > 0)
            {
                row.Errors.Add(L["Import:Error:InvoiceItems", header, Unescape(entry)]);
                continue;
            }

            items.Add(new CreateInvoiceItemDto { Description = description, Quantity = quantity.Value, UnitPrice = price.Value });
        }

        return items;
    }
}
