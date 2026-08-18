using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using Apya.Platform.Documents;
using ClosedXML.Excel;
using QuestPDF.Fluent;   // Document adı Apya.Platform.Documents.Document ile çakışıyor → tam nitelikli kullanılır
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Teslim paketi çıktısı: birleşik PDF, numaralı ZIP ve Excel ek indeksi.
///
/// Mevcut <see cref="Reports.ReportExporter"/> deseniyle aynı: statik, veri
/// erişimi yok, yalnız model → bayt. QuestPDF ve ClosedXML zaten bu katmanda.
/// </summary>
internal static class DeliveryPackageExporter
{
    private const string Grey = "#6B7280";

    /* ─────────────────────────── PDF ─────────────────────────── */

    public static byte[] ToPdf(DeliveryReportModel model)
    {
        return QuestPDF.Fluent.Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.6f, Unit.Centimetre);
                page.DefaultTextStyle(t => t.FontSize(9.5f));

                page.Header().Element(c => Header(c, model));
                page.Content().PaddingVertical(10).Column(col =>
                {
                    col.Spacing(14);

                    foreach (var section in model.Sections)
                    {
                        switch (section)
                        {
                            case ReportSectionKey.ProjectSummary:
                                col.Item().Element(c => SummarySection(c, model));
                                break;
                            case ReportSectionKey.WorkStepProgress:
                                col.Item().Element(c => WorkStepSection(c, model));
                                break;
                            case ReportSectionKey.ComplianceStatus:
                                col.Item().Element(c => ComplianceSection(c, model));
                                break;
                            case ReportSectionKey.MissingDocuments:
                                col.Item().Element(c => MissingSection(c, model));
                                break;
                            case ReportSectionKey.AnnexIndex:
                                col.Item().Element(c => AnnexSection(c, model));
                                break;
                            case ReportSectionKey.AuditTrail:
                                col.Item().Element(c => AuditSection(c, model));
                                break;
                            // CoverPage başlıkta işlenir; kalan bölümlerin verisi
                            // henüz üretilemiyor (Faz E) ve şablonda zaten kapalı.
                        }
                    }
                });

                page.Footer().Row(row =>
                {
                    row.RelativeItem().Text($"Apya Platform · {model.GeneratedAt:dd.MM.yyyy HH:mm} tarihinde üretildi")
                        .FontSize(7.5f).FontColor(Grey);
                    row.ConstantItem(60).AlignRight().Text(t =>
                    {
                        t.DefaultTextStyle(s => s.FontSize(7.5f).FontColor(Grey));
                        t.CurrentPageNumber();
                        t.Span(" / ");
                        t.TotalPages();
                    });
                });
            });
        }).GeneratePdf();
    }

    private static void Header(IContainer container, DeliveryReportModel model)
    {
        container.PaddingBottom(8).BorderBottom(1.5f, Unit.Point).Column(col =>
        {
            col.Item().Text(model.TemplateName?.ToUpperInvariant() ?? "TESLİM DOSYASI")
                .FontSize(8).Bold().FontColor(Grey).LetterSpacing(0.1f);
            col.Item().PaddingTop(2).Text(model.ProjectName).FontSize(15).Bold();
            col.Item().PaddingTop(1).Text(BuildSubtitle(model)).FontSize(8.5f).FontColor(Grey);
        });
    }

    private static string BuildSubtitle(DeliveryReportModel model)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(model.ProjectCode)) parts.Add(model.ProjectCode!);
        if (!string.IsNullOrWhiteSpace(model.PeriodCode)) parts.Add(model.PeriodCode!);
        if (!string.IsNullOrWhiteSpace(model.Issuer)) parts.Add(model.Issuer!);
        parts.Add(model.PackageName);
        return string.Join(" · ", parts);
    }

    private static void SectionTitle(ColumnDescriptor col, string text)
        => col.Item().PaddingBottom(4).Text(text).FontSize(10).Bold();

    private static void SummarySection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "Proje özeti");

            col.Item().Row(row =>
            {
                Tile(row, "Uygunluk", $"%{model.Summary.CompliancePercent}");
                Tile(row, "Belge", model.Summary.DocumentCount.ToString());
                Tile(row, "Eksik", model.Summary.MissingCount.ToString());
                Tile(row, "Belgelenen tutar", $"{model.Summary.DocumentedAmount:N2} {model.Summary.Currency}");
            });

            if (model.Summary.BlockingCount > 0)
            {
                col.Item().PaddingTop(4)
                    .Text($"Uyarı: {model.Summary.BlockingCount} zorunlu kalem eksik.")
                    .FontSize(8.5f).FontColor(Colors.Red.Medium);
            }
        });

        static void Tile(RowDescriptor row, string label, string value)
        {
            row.RelativeItem().Background("#F9FAFB").Padding(7).Column(c =>
            {
                c.Item().Text(label.ToUpperInvariant()).FontSize(7).Bold().FontColor(Grey);
                c.Item().PaddingTop(2).Text(value).FontSize(12);
            });
        }
    }

    private static void WorkStepSection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "İş adımı ilerlemesi");

            if (model.WorkSteps.Count == 0)
            {
                col.Item().Text("Tanımlı iş adımı yok.").FontSize(8.5f).FontColor(Grey);
                return;
            }

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.ConstantColumn(28);
                    c.RelativeColumn();
                    c.ConstantColumn(60);
                    c.ConstantColumn(50);
                });

                table.Header(h =>
                {
                    foreach (var t in new[] { "#", "İş adımı", "İlerleme", "Belge" })
                        h.Cell().Element(HeaderCell).Text(t).Bold().FontSize(8);
                });

                foreach (var step in model.WorkSteps.OrderBy(s => s.Order))
                {
                    table.Cell().Element(DataCell).Text(step.Order.ToString());
                    table.Cell().Element(DataCell).Text(step.Name);
                    table.Cell().Element(DataCell).AlignRight().Text($"%{step.ProgressPercent}");
                    table.Cell().Element(DataCell).AlignRight().Text(step.DocumentCount.ToString());
                }
            });
        });
    }

    private static void ComplianceSection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "Kurum uygunluğu");

            if (model.Compliance.Count == 0)
            {
                col.Item().Text("Projeye uygulanmış kurum paketi yok.").FontSize(8.5f).FontColor(Grey);
                return;
            }

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.RelativeColumn(2);
                    c.ConstantColumn(70);
                    c.ConstantColumn(60);
                    c.RelativeColumn(2);
                });

                table.Header(h =>
                {
                    foreach (var t in new[] { "Kalem", "Kapsam", "Durum", "Belge" })
                        h.Cell().Element(HeaderCell).Text(t).Bold().FontSize(8);
                });

                foreach (var row in model.Compliance)
                {
                    table.Cell().Element(DataCell).Text(row.Title);
                    table.Cell().Element(DataCell).Text(row.Scope).FontSize(8);

                    var statusCell = table.Cell().Element(DataCell);
                    statusCell.Text(StatusText(row.Status))
                        .FontSize(8)
                        .FontColor(row.Status switch
                        {
                            ComplianceItemStatus.Satisfied => Colors.Green.Darken2,
                            ComplianceItemStatus.Waived => Grey,
                            _ => row.IsBlocking ? Colors.Red.Medium : Colors.Orange.Darken1,
                        });

                    table.Cell().Element(DataCell).Text(row.DocumentName ?? "—").FontSize(8);
                }
            });
        });

        static string StatusText(ComplianceItemStatus status) => status switch
        {
            ComplianceItemStatus.Satisfied => "Karşılandı",
            ComplianceItemStatus.Waived => "Feragat",
            _ => "Eksik",
        };
    }

    private static void MissingSection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "Eksik belgeler");

            if (model.MissingDocuments.Count == 0)
            {
                col.Item().Text("Eksik belge yok.").FontSize(8.5f).FontColor(Colors.Green.Darken2);
                return;
            }

            foreach (var item in model.MissingDocuments)
            {
                col.Item().Text($"• {item}").FontSize(8.5f);
            }
        });
    }

    private static void AnnexSection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "Ekler indeksi");

            if (model.Annexes.Count == 0)
            {
                col.Item().Text("Pakette ek yok.").FontSize(8.5f).FontColor(Grey);
                return;
            }

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.ConstantColumn(45);
                    c.RelativeColumn();
                    c.ConstantColumn(75);
                    c.ConstantColumn(60);
                    c.ConstantColumn(70);
                });

                table.Header(h =>
                {
                    foreach (var t in new[] { "Ek no", "Belge", "Tür", "Tarih", "Tutar" })
                        h.Cell().Element(HeaderCell).Text(t).Bold().FontSize(8);
                });

                foreach (var annex in model.Annexes)
                {
                    table.Cell().Element(DataCell).Text(annex.AnnexNumber).FontSize(8);
                    table.Cell().Element(DataCell).Text(annex.DocumentName).FontSize(8);
                    table.Cell().Element(DataCell).Text(annex.TypeName ?? "—").FontSize(8);
                    table.Cell().Element(DataCell).Text(annex.DocumentDate?.ToString("dd.MM.yyyy") ?? "—").FontSize(8);
                    table.Cell().Element(DataCell).AlignRight()
                        .Text(annex.Amount.HasValue ? annex.Amount.Value.ToString("N2") : "—").FontSize(8);
                }
            });
        });
    }

    private static void AuditSection(IContainer container, DeliveryReportModel model)
    {
        container.Column(col =>
        {
            SectionTitle(col, "Denetim izi");

            if (model.AuditTrail.Count == 0)
            {
                col.Item().Text("Kayıtlı etkinlik yok.").FontSize(8.5f).FontColor(Grey);
                return;
            }

            col.Item().Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.ConstantColumn(85);
                    c.ConstantColumn(80);
                    c.ConstantColumn(70);
                    c.RelativeColumn();
                });

                table.Header(h =>
                {
                    foreach (var t in new[] { "Zaman", "Kullanıcı", "İşlem", "Belge" })
                        h.Cell().Element(HeaderCell).Text(t).Bold().FontSize(8);
                });

                foreach (var row in model.AuditTrail)
                {
                    table.Cell().Element(DataCell).Text(row.At.ToString("dd.MM.yyyy HH:mm")).FontSize(7.5f);
                    table.Cell().Element(DataCell).Text(row.Actor).FontSize(7.5f);
                    table.Cell().Element(DataCell).Text(row.Action).FontSize(7.5f);
                    table.Cell().Element(DataCell).Text(row.Target ?? "—").FontSize(7.5f);
                }
            });
        });
    }

    private static IContainer HeaderCell(IContainer c)
        => c.Background("#F3F4F6").PaddingVertical(3).PaddingHorizontal(4);

    private static IContainer DataCell(IContainer c)
        => c.BorderBottom(0.5f, Unit.Point).BorderColor("#E5E7EB").PaddingVertical(3).PaddingHorizontal(4);

    /* ─────────────────────────── Excel ek indeksi ─────────────────────────── */

    public static byte[] AnnexIndexToExcel(DeliveryReportModel model)
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Ekler");

        sheet.Cell(1, 1).Value = model.ProjectName;
        sheet.Cell(1, 1).Style.Font.Bold = true;
        sheet.Cell(2, 1).Value = BuildSubtitle(model);

        var headerRow = 4;
        var headers = new[] { "Ek no", "Belge", "Tür", "Tarih", "Tutar", "Boyut (KB)" };
        for (var i = 0; i < headers.Length; i++)
        {
            sheet.Cell(headerRow, i + 1).Value = headers[i];
            sheet.Cell(headerRow, i + 1).Style.Font.Bold = true;
            sheet.Cell(headerRow, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#F3F4F6");
        }

        var row = headerRow + 1;
        foreach (var annex in model.Annexes)
        {
            sheet.Cell(row, 1).Value = annex.AnnexNumber;
            sheet.Cell(row, 2).Value = annex.DocumentName;
            sheet.Cell(row, 3).Value = annex.TypeName ?? string.Empty;
            if (annex.DocumentDate.HasValue)
            {
                sheet.Cell(row, 4).Value = annex.DocumentDate.Value;
                sheet.Cell(row, 4).Style.DateFormat.Format = "dd.MM.yyyy";
            }
            if (annex.Amount.HasValue)
            {
                sheet.Cell(row, 5).Value = annex.Amount.Value;
                sheet.Cell(row, 5).Style.NumberFormat.Format = "#,##0.00";
            }
            sheet.Cell(row, 6).Value = Math.Round(annex.FileSize / 1024d, 1);
            row++;
        }

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    /* ─────────────────────────── ZIP ─────────────────────────── */

    /// <summary>
    /// Numaralı ZIP: rapor PDF'i kökte, ekler <c>EK-1 - ad.pdf</c> biçiminde.
    /// <paramref name="annexContent"/> ek dosyasının diskteki yolunu çözer;
    /// bulunamayan ek sessizce ATLANMAZ, indeks metnine not düşülür.
    /// </summary>
    public static byte[] ToZip(
        DeliveryReportModel model,
        byte[] reportPdf,
        byte[]? annexIndexExcel,
        Func<DeliveryReportModel.AnnexRow, (string FileName, byte[]? Content)> annexContent)
    {
        using var stream = new MemoryStream();

        using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: true))
        {
            Write(archive, $"{Sanitize(model.PackageName)}.pdf", reportPdf);

            if (annexIndexExcel != null)
            {
                Write(archive, "ekler-indeksi.xlsx", annexIndexExcel);
            }

            var missing = new List<string>();

            foreach (var annex in model.Annexes)
            {
                var (fileName, content) = annexContent(annex);

                if (content == null)
                {
                    missing.Add($"{annex.AnnexNumber} - {annex.DocumentName}");
                    continue;
                }

                Write(archive, $"{annex.AnnexNumber} - {Sanitize(fileName)}", content);
            }

            if (missing.Count > 0)
            {
                var note = "Aşağıdaki eklerin dosyası depoda bulunamadı:\r\n" + string.Join("\r\n", missing);
                Write(archive, "EKSIK-EKLER.txt", System.Text.Encoding.UTF8.GetBytes(note));
            }
        }

        return stream.ToArray();
    }

    private static void Write(ZipArchive archive, string entryName, byte[] content)
    {
        var entry = archive.CreateEntry(entryName, CompressionLevel.Optimal);
        using var entryStream = entry.Open();
        entryStream.Write(content, 0, content.Length);
    }

    /// <summary>ZIP girdisi adında sorun çıkaran karakterleri temizler.</summary>
    private static string Sanitize(string name)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var cleaned = new string(name.Select(c => invalid.Contains(c) ? '_' : c).ToArray());
        return string.IsNullOrWhiteSpace(cleaned) ? "belge" : cleaned;
    }
}
