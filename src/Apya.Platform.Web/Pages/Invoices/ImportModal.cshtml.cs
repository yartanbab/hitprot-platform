using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Invoices;

/// <summary>
/// Bir dosya satırı. Aynı fatura numaralı satırların ilki faturayı taşır (<see cref="Invoice"/>);
/// sonrakiler yalnız kalemini o faturaya ekler ve kayıtta atlanır.
/// </summary>
public sealed class InvoiceImportRow
{
    public CreateInvoiceDto? Invoice { get; init; }
}

/// <summary>Fatura içe aktarmanın istek boyu seçenekleri.</summary>
public sealed class InvoiceImportLookups
{
    internal List<(Guid Id, string Name, string Code)> Projects { get; init; } = [];
    internal List<(InvoiceDirection Value, string Name)> Directions { get; init; } = [];
    internal HashSet<string> ExistingNumbers { get; init; } = new(StringComparer.OrdinalIgnoreCase);
    internal bool CanSeeBudget { get; init; }
    internal Dictionary<Guid, ProjectRecordFormLookupDto> Lines { get; } = new();

    /// <summary>Dosyada görülen faturalar: numara → (fatura, ilk satırdaki proje metni).</summary>
    internal Dictionary<string, (CreateInvoiceDto Invoice, string Project)> Seen { get; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Faturaları Excel/CSV'den içe aktarır. Her fatura "Yeni fatura" penceresinin servisinden
/// (<see cref="IInvoiceAppService.CreateAsync"/>) geçer: proje, bütçe kalemi kuralı, KDV ve istisna,
/// fatura numarası orada uygulanır. Aynı numaralı satırlar tek faturanın kalemleridir. Kalem
/// sütunları boşsa "Toplam" KDV dahil tek kalem sayılır (dışa aktarılan dosya böyle geri yüklenir).
/// Tahsilat, durum ve cari alınmaz: tahsilat kasa hareketi yazar, ekrandan girilir.
/// </summary>
[Authorize(PlatformPermissions.Invoices.Create)]
public class ImportModalModel : ExcelImportPageModel<InvoiceImportLookups, InvoiceImportRow>
{
    private const int MaxNumberLength = 64;
    private const int MaxLineLength = 256;

    private readonly IInvoiceAppService _invoiceAppService;
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IProjectAppService _projectAppService;

    public ImportModalModel(IInvoiceAppService invoiceAppService, IProjectBudgetAppService budgetAppService,
        IProjectAppService projectAppService)
    {
        _projectAppService = projectAppService;
        _invoiceAppService = invoiceAppService;
        _budgetAppService = budgetAppService;
    }

    protected override string NameKey => "Export:Invoices:Name";

    private sealed record Headers(string Number, string Direction, string Project, string Date, string DueDate,
        string TaxRate, string Currency, string BudgetLine, string Line, string Quantity, string UnitPrice,
        string Total, string Exemption, string Note);

    // Başlıklar dışa aktarmayla aynı; kalem sütunları içe aktarmaya özgü.
    private Headers H => new(L["Export:Col:InvoiceNumber"], L["Export:Col:Direction"], L["Export:Col:Project"],
        L["Export:Col:Date"], L["Export:Col:DueDate"], L["Export:Col:TaxRate"], L["Export:Col:Currency"],
        L["Export:Col:BudgetLine"], L["Import:Col:InvoiceLine"], L["Import:Col:Quantity"], L["Import:Col:UnitPrice"],
        L["Export:Col:Total"], L["Import:Col:VatExemption"], L["Export:Col:Note"]);

    protected override IReadOnlyList<ImportColumn> Columns(InvoiceImportLookups lookups)
    {
        var h = H;
        return
        [
            new(h.Number, Required: true),
            new(h.Direction, Options: lookups.Directions.Select(d => d.Name).ToList()),
            new(h.Project, Required: true, Options: lookups.Projects.Select(p => p.Name).ToList()),
            new(h.Date, Required: true),
            new(h.DueDate),
            new(h.TaxRate),
            new(h.Currency, Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList()),
            new(h.BudgetLine),
            new(h.Line),
            new(h.Quantity),
            new(h.UnitPrice),
            new(h.Total),
            new(h.Exemption),
            new(h.Note),
        ];
    }

    protected override async Task<InvoiceImportLookups> LoadLookupsAsync()
    {
        // Fatura numarası kurumda tekildir (veritabanında tekil indeks): mevcut numaralar bir kez okunur.
        var existing = await ExcelTable.CollectAsync((skip, take) => _invoiceAppService.GetListAsync(
            new GetInvoicesInput { SkipCount = skip, MaxResultCount = take }));

        return new InvoiceImportLookups
        {
            // Proje adıyla ya da koduyla eşleşir (host bütün kiracıların projelerini görür; ad tekil olmayabilir).
            Projects = (await _projectAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 }))
                .Items.Select(p => (p.Id, p.Name, p.Code)).ToList(),
            Directions = Enum.GetValues<InvoiceDirection>().Select(d => (d, L[$"Invoice:Direction:{d}"].Value)).ToList(),
            ExistingNumbers = existing.Items.Select(i => i.InvoiceNumber).ToHashSet(StringComparer.OrdinalIgnoreCase),
            CanSeeBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget)
        };
    }

    protected override async Task<InvoiceImportRow> MapAsync(ImportRow row, InvoiceImportLookups lookups)
    {
        var h = H;
        var number = row.Text(h.Number);
        if (number.Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", h.Number]);
            return new InvoiceImportRow();
        }

        if (number.Length > MaxNumberLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Number, MaxNumberLength]);
        }

        // Aynı numaranın sonraki satırı: yalnız kalem; proje ilk satırdakiyle aynı olmalı.
        if (lookups.Seen.TryGetValue(number, out var seen))
        {
            var project = row.Text(h.Project);
            if (project.Length > 0 && !Same(project, seen.Project))
            {
                row.Errors.Add(L["Import:Error:InvoiceHeaderMismatch", h.Number, number, h.Project]);
            }

            AddLine(row, seen.Invoice, number, lookups);
            return new InvoiceImportRow();
        }

        if (lookups.ExistingNumbers.Contains(number))
        {
            row.Errors.Add(L["Import:Error:Duplicate", h.Number, number]);
        }

        var invoice = new CreateInvoiceDto { InvoiceNumber = number, Items = [] };
        lookups.Seen[number] = (invoice, row.Text(h.Project));

        var direction = row.Text(h.Direction);
        if (direction.Length > 0 && TryMatch(row, h.Direction, direction, lookups.Directions,
                d => [d.Name, d.Value.ToString()], out var dir))
        {
            invoice.Direction = dir.Value;
        }

        var projectText = row.Text(h.Project);
        if (projectText.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Project]);
        else if (TryMatch(row, h.Project, projectText, lookups.Projects, p => [p.Name, p.Code], out var match))
        {
            invoice.ProjectId = match.Id;
            await MapBudgetLineAsync(row, invoice, lookups);
        }

        var date = ExcelImport.Date(row.Value(h.Date));
        if (date == null) row.Errors.Add(row.Text(h.Date).Length == 0 ? L["Import:Error:Required", h.Date] : L["Import:Error:Date", h.Date]);
        else invoice.InvoiceDate = date.Value;

        invoice.DueDate = invoice.InvoiceDate;
        if (row.Text(h.DueDate).Length > 0)
        {
            var due = ExcelImport.Date(row.Value(h.DueDate));
            if (due == null) row.Errors.Add(L["Import:Error:Date", h.DueDate]);
            else if (date != null && due < date) row.Errors.Add(L["Import:Error:DueBeforeStart", h.DueDate, h.Date]);
            else invoice.DueDate = due.Value;
        }

        if (row.Text(h.TaxRate).Length > 0)
        {
            var rate = ExcelImport.Decimal(row.Value(h.TaxRate));
            if (rate == null) row.Errors.Add(L["Import:Error:Number", h.TaxRate]);
            else if (rate < 0 || rate > 100) row.Errors.Add(L["Import:Error:Percent", h.TaxRate]);
            else invoice.TaxRate = rate.Value;
        }

        var currency = row.Text(h.Currency).ToUpperInvariant();
        if (currency.Length == 0) invoice.Currency = "TRY";
        else if (Regex.IsMatch(currency, "^[A-Z]{3}$")) invoice.Currency = currency;
        else row.Errors.Add(L["Import:Error:Currency", h.Currency]);

        var exemption = row.Text(h.Exemption);
        if (exemption.Length > Apya.Platform.Invoices.VatExemptionConsts.MaxReferenceLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Exemption, Apya.Platform.Invoices.VatExemptionConsts.MaxReferenceLength]);
        }
        invoice.VatExemptionReference = exemption.Length > 0 ? exemption : null;
        invoice.Notes = row.Text(h.Note) is { Length: > 0 } note ? note : null;

        AddLine(row, invoice, number, lookups);
        return new InvoiceImportRow { Invoice = invoice };
    }

    /// <summary>
    /// Satırın kalemi: "Birim fiyat" doluysa KDV hariç kalem (miktar boşsa 1); değilse "Toplam" KDV
    /// dahil tek kalem. Bir faturanın bütün satırları aynı yolu kullanmalı (fiyatların KDV'si fatura
    /// düzeyinde tek bayraktır).
    /// </summary>
    private void AddLine(ImportRow row, CreateInvoiceDto invoice, string number, InvoiceImportLookups lookups)
    {
        var h = H;
        var hasUnitPrice = row.Text(h.UnitPrice).Length > 0;
        var priceHeader = hasUnitPrice ? h.UnitPrice : h.Total;
        if (!hasUnitPrice && row.Text(h.Total).Length == 0)
        {
            row.Errors.Add(L["Import:Error:InvoiceAmountRequired", h.UnitPrice, h.Total]);
            return;
        }

        var includesTax = !hasUnitPrice;
        if (invoice.Items.Count > 0 && invoice.PricesIncludeTax != includesTax)
        {
            row.Errors.Add(L["Import:Error:InvoiceMixedPrice", h.UnitPrice, h.Total]);
            return;
        }
        invoice.PricesIncludeTax = includesTax;

        var price = ExcelImport.Decimal(row.Value(priceHeader));
        if (price == null) { row.Errors.Add(L["Import:Error:Number", priceHeader]); return; }
        if (price <= 0) { row.Errors.Add(L["Import:Error:Positive", priceHeader]); return; }

        decimal quantity = 1;
        if (hasUnitPrice && row.Text(h.Quantity).Length > 0)
        {
            var q = ExcelImport.Decimal(row.Value(h.Quantity));
            if (q == null) { row.Errors.Add(L["Import:Error:Number", h.Quantity]); return; }
            if (q <= 0) { row.Errors.Add(L["Import:Error:Positive", h.Quantity]); return; }
            quantity = q.Value;
        }

        var description = row.Text(h.Line);
        if (description.Length > MaxLineLength) row.Errors.Add(L["Import:Error:TooLong", h.Line, MaxLineLength]);

        invoice.Items.Add(new CreateInvoiceItemDto
        {
            Description = description.Length > 0 ? description : L["Import:Invoice:DefaultLine", number].Value,
            Quantity = quantity,
            UnitPrice = Math.Round(price.Value, 2)
        });
    }

    /// <summary>
    /// Bütçe kalemi kodla, adla, "kod - ad" ya da dışa aktarmadaki "kod · ad" ile eşleşir. Bütçeyi
    /// görme izni yoksa eşleme yapılamaz.
    /// </summary>
    private async Task MapBudgetLineAsync(ImportRow row, CreateInvoiceDto invoice, InvoiceImportLookups lookups)
    {
        var h = H;
        var text = row.Text(h.BudgetLine);
        if (text.Length == 0)
        {
            return;
        }

        if (!lookups.CanSeeBudget)
        {
            row.Errors.Add(L["Import:Error:NotFound", h.BudgetLine, text]);
            return;
        }

        if (!lookups.Lines.TryGetValue(invoice.ProjectId, out var lookup))
        {
            lookup = await _budgetAppService.GetRecordFormLookupAsync(invoice.ProjectId);
            lookups.Lines[invoice.ProjectId] = lookup;
        }

        if (TryMatch(row, h.BudgetLine, text, lookup.Lines,
                l => [l.Code, l.Name, $"{l.Code} - {l.Name}", $"{l.Code} · {l.Name}"], out var line))
        {
            invoice.BudgetLineId = line!.Id;
        }
    }

    protected override Task CreateAsync(InvoiceImportRow row)
        => row.Invoice == null ? Task.CompletedTask : _invoiceAppService.CreateAsync(row.Invoice);
}
