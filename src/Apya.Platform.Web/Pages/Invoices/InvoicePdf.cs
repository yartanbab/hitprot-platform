using System;
using System.Linq;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Localization;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Apya.Platform.Web.Pages.Invoices;

/// <summary>
/// Faturanın indirilebilir PDF kopyası (Yazdır sayfasının içeriği). Yalnız kayıtta OLAN bilgi
/// basılır: kesen kurum Kurum Profili'nden, yoksa (host) yalnız platform adı. Bilgi amaçlıdır;
/// e-fatura / e-arşiv fatura yerine geçmediği altbilgide yazar.
/// </summary>
internal static class InvoicePdf
{
    public static byte[] Build(InvoiceDto inv, MyCompanyProfileDto? issuer, IStringLocalizer l, DateTime now)
    {
        var subTotal = inv.Items.Sum(x => x.TotalPrice);
        var taxAmount = subTotal * (inv.TaxRate / 100);
        string Money(decimal v) => $"{v:N2} {inv.Currency}";
        var status = inv.IsOverdue ? l["Invoice:Status:Overdue"] : l["Invoice:Status:" + inv.Status];

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().PaddingBottom(10).BorderBottom(1).Row(row =>
                {
                    row.RelativeItem().Column(c =>
                    {
                        if (issuer != null)
                        {
                            c.Item().Text(string.IsNullOrWhiteSpace(issuer.LegalName) ? issuer.TenantName : issuer.LegalName)
                                .Bold().FontSize(15);
                            if (!string.IsNullOrWhiteSpace(issuer.Address)) c.Item().Text(issuer.Address).FontSize(9);
                            var tax = string.Join(" · ", new[]
                            {
                                string.IsNullOrWhiteSpace(issuer.TaxOffice) ? null : issuer.TaxOffice + " V.D.",
                                string.IsNullOrWhiteSpace(issuer.TaxNumber) ? null : issuer.TaxNumber
                            }.Where(x => x != null));
                            if (tax.Length > 0) c.Item().Text(tax).FontSize(9);
                            if (!string.IsNullOrWhiteSpace(issuer.CorporateEmail)) c.Item().Text(issuer.CorporateEmail).FontSize(9);
                        }
                        else
                        {
                            c.Item().Text("APYA").Bold().FontSize(15);
                        }
                    });

                    row.ConstantItem(200).AlignRight().Column(c =>
                    {
                        c.Item().AlignRight().Text(l["Invoice:Pdf:Title"].Value.ToUpper(new System.Globalization.CultureInfo("tr-TR")))
                            .Bold().FontSize(16).FontColor(Colors.Grey.Darken2);
                        c.Item().AlignRight().Text($"{l["Export:Col:InvoiceNumber"]}: {inv.InvoiceNumber}");
                        c.Item().AlignRight().Text($"{l["Export:Col:Date"]}: {inv.InvoiceDate:dd.MM.yyyy}");
                        c.Item().AlignRight().Text($"{l["Invoice:Pdf:DueDate"]}: {inv.DueDate:dd.MM.yyyy}");
                        c.Item().AlignRight().Text($"{l["Export:Col:Status"]}: {status}").SemiBold();
                    });
                });

                page.Content().PaddingVertical(12).Column(col =>
                {
                    col.Spacing(12);

                    col.Item().Column(c =>
                    {
                        if (!string.IsNullOrWhiteSpace(inv.CustomerName)) c.Item().Text($"{l["Export:Col:Customer"]}: {inv.CustomerName}");
                        c.Item().Text($"{l["Export:Col:Project"]}: {inv.ProjectName}");
                    });

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn();
                            c.ConstantColumn(60);
                            c.ConstantColumn(95);
                            c.ConstantColumn(105);
                        });
                        static IContainer Head(IContainer c) => c.PaddingVertical(4).BorderBottom(1).BorderColor(Colors.Grey.Darken1);
                        static IContainer Cell(IContainer c) => c.PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2);

                        table.Header(h =>
                        {
                            h.Cell().Element(Head).Text(l["Export:Col:Description"]).Bold();
                            h.Cell().Element(Head).AlignRight().Text(l["Invoice:Pdf:Quantity"]).Bold();
                            h.Cell().Element(Head).AlignRight().Text(l["Invoice:Pdf:UnitPrice"]).Bold();
                            h.Cell().Element(Head).AlignRight().Text(l["Export:Col:Amount"]).Bold();
                        });

                        foreach (var item in inv.Items)
                        {
                            table.Cell().Element(Cell).Text(item.Description);
                            table.Cell().Element(Cell).AlignRight().Text(item.Quantity.ToString("0.##"));
                            table.Cell().Element(Cell).AlignRight().Text(item.UnitPrice.ToString("N2"));
                            table.Cell().Element(Cell).AlignRight().Text(item.TotalPrice.ToString("N2"));
                        }
                    });

                    col.Item().AlignRight().Width(260).Column(t =>
                    {
                        void Line(string label, string value, bool strong = false)
                        {
                            t.Item().PaddingVertical(2).Row(r =>
                            {
                                var left = r.RelativeItem().Text(label);
                                var right = r.AutoItem().Text(value);
                                if (strong) { left.Bold(); right.Bold(); }
                            });
                        }

                        Line(l["Invoice:Pdf:Subtotal"], Money(subTotal));
                        Line($"{l["Export:Col:VatAmount"]} (%{inv.TaxRate:0.##})", Money(taxAmount));
                        if (inv.VatExemptionReference != null)
                        {
                            t.Item().Text(l["Invoice:Pdf:VatExemption", inv.VatExemptionReference]).FontSize(8).FontColor(Colors.Grey.Darken1);
                        }
                        Line(l["Invoice:Pdf:Total"], Money(inv.TotalAmount), strong: true);
                        if (inv.PaidAmount > 0)
                        {
                            Line(l["Export:Col:Paid"], Money(inv.PaidAmount));
                            Line(l["Export:Col:Balance"], Money(inv.Balance), strong: true);
                        }
                    });

                    if (!string.IsNullOrWhiteSpace(inv.Notes))
                    {
                        col.Item().Text(inv.Notes).FontSize(9);
                    }
                });

                page.Footer().Column(f =>
                {
                    f.Item().AlignCenter().Text(l["Invoice:Pdf:Disclaimer"]).FontSize(8).FontColor(Colors.Grey.Darken1);
                    f.Item().AlignRight().Text(l["Invoice:Pdf:Generated", now.ToString("dd.MM.yyyy HH:mm")])
                        .FontSize(7).Italic().FontColor(Colors.Grey.Medium);
                });
            });
        }).GeneratePdf();
    }
}
