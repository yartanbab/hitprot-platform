using System;
using System.Linq;
using Apya.Platform.Grants.Dtos;
using Microsoft.Extensions.Localization;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Başvurunun PDF özeti: sihirbazın gösterdiği bilgiler (program künyesi, firma, proje özeti,
/// hedefler, bütçe ve toplamlar). Firma ve danışman aynı özeti alır; okuma sihirbazın
/// servisinden geçtiği için görme kuralı orada. Yalnız dolu bölümler basılır.
/// </summary>
internal static class GrantApplicationPdf
{
    public static byte[] Build(GrantApplicationWizardDto a, IStringLocalizer l, DateTime now)
    {
        string Money(decimal v) => $"{v:N2} ₺";
        string Or(string? v) => string.IsNullOrWhiteSpace(v) ? "—" : v;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.5f, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().PaddingBottom(8).BorderBottom(1).Column(h =>
                {
                    h.Item().Text(string.IsNullOrWhiteSpace(a.ProjectTitle) ? a.GrantName : a.ProjectTitle).Bold().FontSize(15);
                    var meta = string.Join(" · ", new[] { a.GrantName, a.Issuer, a.Period }.Where(x => !string.IsNullOrWhiteSpace(x)));
                    if (a.Deadline.HasValue) meta += " · " + l["Grants:Wizard:DeadlineOn", a.Deadline.Value.ToString("dd.MM.yyyy")];
                    h.Item().Text(meta).FontSize(9).FontColor(Colors.Grey.Darken1);
                    h.Item().Text(a.SubmittedAt.HasValue
                            ? l["Grants:Wizard:SubmittedOn", a.SubmittedAt.Value.ToString("dd.MM.yyyy")].Value
                            : $"{l["Grants:Wizard:Completion"]}: %{a.CompletionPercent}")
                        .FontSize(9).SemiBold();
                });

                page.Content().PaddingVertical(10).Column(col =>
                {
                    col.Spacing(14);

                    void Section(string title, Action<ColumnDescriptor> body) => col.Item().Column(s =>
                    {
                        s.Item().Text(title).Bold().FontSize(11);
                        s.Item().PaddingTop(4).Column(body);
                    });

                    static IContainer Cell(IContainer c) => c.PaddingVertical(3).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2);
                    static IContainer Head(IContainer c) => c.PaddingVertical(3).BorderBottom(1).BorderColor(Colors.Grey.Darken1);

                    if (a.Firm != null)
                    {
                        var f = a.Firm;
                        Section(l["Grants:Wizard:Step:Firm"], s => s.Item().Table(t =>
                        {
                            t.ColumnsDefinition(c => { c.ConstantColumn(150); c.RelativeColumn(); });
                            void Row(string label, string value)
                            {
                                t.Cell().Element(Cell).Text(label).FontColor(Colors.Grey.Darken1);
                                t.Cell().Element(Cell).Text(value);
                            }
                            Row(l["Grants:Wizard:Firm:Size"], f.Size.HasValue ? l["Grants:Size:" + f.Size.Value] : "—");
                            Row(l["Grants:Wizard:Firm:StaffCount"], f.StaffCount?.ToString() ?? "—");
                            Row(l["Grants:Wizard:Firm:RdStaffCount"], f.RdStaffCount?.ToString() ?? "—");
                            Row(l["Grants:Wizard:Firm:Trl"], f.Trl?.ToString() ?? "—");
                            Row(l["Grants:Wizard:Firm:Consortium"],
                                f.HasConsortiumPartner == null ? "—" : l[f.HasConsortiumPartner.Value ? "Grants:Pdf:Yes" : "Grants:Pdf:No"]);
                        }));
                    }

                    Section(l["Grants:Wizard:Step:Summary"], s =>
                    {
                        s.Item().Text($"{l["Grants:Wizard:ProjectTitle"]}: {Or(a.ProjectTitle)}");
                        s.Item().Text($"{l["Grants:Wizard:Duration"]}: {a.ProjectDurationMonths?.ToString() ?? "—"}");
                        if (!string.IsNullOrWhiteSpace(a.ProjectSummary)) s.Item().PaddingTop(4).Text(a.ProjectSummary);
                    });

                    if (a.Targets.Count > 0)
                    {
                        Section(l["Grants:Pdf:Targets"], s => s.Item().Table(t =>
                        {
                            t.ColumnsDefinition(c => { c.RelativeColumn(); c.ConstantColumn(60); c.ConstantColumn(70); c.ConstantColumn(70); c.ConstantColumn(70); });
                            t.Header(hd =>
                            {
                                hd.Cell().Element(Head).Text(l["Grants:Wizard:Target:Name"]).Bold();
                                hd.Cell().Element(Head).Text(l["Grants:Wizard:Target:Unit"]).Bold();
                                hd.Cell().Element(Head).AlignRight().Text(l["Grants:Wizard:Target:Baseline"]).Bold();
                                hd.Cell().Element(Head).AlignRight().Text(l["Grants:Wizard:Target:Value"]).Bold();
                                hd.Cell().Element(Head).AlignRight().Text(l["Grants:Wizard:Target:Date"]).Bold();
                            });
                            foreach (var x in a.Targets)
                            {
                                t.Cell().Element(Cell).Text(x.Name);
                                t.Cell().Element(Cell).Text(Or(x.Unit));
                                t.Cell().Element(Cell).AlignRight().Text(x.BaselineValue.ToString("0.##"));
                                t.Cell().Element(Cell).AlignRight().Text(x.TargetValue.ToString("0.##"));
                                t.Cell().Element(Cell).AlignRight().Text(x.TargetDate?.ToString("dd.MM.yyyy") ?? "—");
                            }
                        }));
                    }

                    var lines = a.BudgetLines.Where(b => b.IsEligible && (b.Amount > 0 || !string.IsNullOrWhiteSpace(b.Justification))).ToList();
                    Section(l["Grants:Wizard:Step:Budget"], s =>
                    {
                        if (lines.Count > 0)
                        {
                            s.Item().Table(t =>
                            {
                                t.ColumnsDefinition(c => { c.ConstantColumn(130); c.ConstantColumn(95); c.ConstantColumn(95); c.RelativeColumn(); });
                                t.Header(hd =>
                                {
                                    hd.Cell().Element(Head).Text(l["Grants:Wizard:Col:Item"]).Bold();
                                    hd.Cell().Element(Head).AlignRight().Text(l["Grants:Wizard:Col:Amount"]).Bold();
                                    hd.Cell().Element(Head).AlignRight().Text(l["Grants:Wizard:Col:Support"]).Bold();
                                    hd.Cell().Element(Head).PaddingLeft(8).Text(l["Grants:Pdf:Justification"]).Bold();
                                });
                                foreach (var b in lines)
                                {
                                    t.Cell().Element(Cell).Text(l["Grants:CostItem:" + b.Kind]);
                                    t.Cell().Element(Cell).AlignRight().Text(Money(b.Amount));
                                    t.Cell().Element(Cell).AlignRight().Text(Money(b.SupportAmount));
                                    t.Cell().Element(Cell).PaddingLeft(8).Text(Or(b.Justification)).FontSize(9);
                                }
                            });
                        }

                        s.Item().PaddingTop(6).AlignRight().Width(260).Column(tot =>
                        {
                            void Line(string label, decimal v, bool strong = false) => tot.Item().Row(r =>
                            {
                                var left = r.RelativeItem().Text(label);
                                var right = r.AutoItem().Text(Money(v));
                                if (strong) { left.Bold(); right.Bold(); }
                            });
                            Line(l["Grants:Wizard:TotalProject"], a.TotalProject, strong: true);
                            Line(l["Grants:Wizard:TotalSupport"], a.TotalSupport);
                            Line(l["Grants:Wizard:OwnContribution"], a.OwnContribution);
                        });

                        if (a.CapApplied && a.MaxAmount.HasValue)
                        {
                            s.Item().AlignRight().Text(l["Grants:Wizard:CapNote", a.MaxAmount.Value.ToString("N0"), a.SupportShareOfCapPercent ?? 0])
                                .FontSize(8).FontColor(Colors.Grey.Darken1);
                        }
                    });
                });

                page.Footer().AlignRight().Text(l["Grants:Pdf:Generated", now.ToString("dd.MM.yyyy HH:mm")])
                    .FontSize(7).Italic().FontColor(Colors.Grey.Medium);
            });
        }).GeneratePdf();
    }
}
