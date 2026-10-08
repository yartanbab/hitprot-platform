using System;
using System.Collections.Generic;
using System.IO;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Web.Pages.Reports;
using ClosedXML.Excel;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Host formuna kiracılar yanıt verdiğinde Excel'de satırın hangi firmaya ait olduğu görünmeli;
/// firma bilgisi olmayan (kiracının kendi formu) dışa aktarım eskisi gibi kalır.
/// </summary>
public class FormResponsesExcel_Tests
{
    private static readonly Guid QuestionId = Guid.NewGuid();

    private static DocumentDto Form() => new()
    {
        Title = "Proje fikri",
        Blocks = new List<BlockDto> { new() { Id = QuestionId, Type = BlockType.ShortText, Order = 1, Content = "Fikriniz" } }
    };

    private static ResponseListItemDto Response(string? tenantName) => new()
    {
        CreationTime = new DateTime(2026, 9, 14, 10, 0, 0),
        Status = ResponseStatus.Pending,
        CompletionSeconds = 42,
        Answers = $"{{\"{QuestionId}\":\"Sensör\"}}",
        TenantName = tenantName
    };

    private static IXLWorksheet Sheet(byte[] bytes) => new XLWorkbook(new MemoryStream(bytes)).Worksheet(1);

    [Fact]
    public void Kiraci_yaniti_varsa_firma_sutunu_eklenir()
    {
        var sheet = Sheet(ReportExporter.FormResponsesToExcel(Form(), new List<ResponseListItemDto> { Response("Akım Teknoloji"), Response(null) }));

        sheet.Cell(1, 2).GetString().ShouldBe("Firma");
        sheet.Cell(2, 2).GetString().ShouldBe("Akım Teknoloji");
        sheet.Cell(2, 3).GetString().ShouldBe("Bekliyor");
        sheet.Cell(2, 4).GetValue<int>().ShouldBe(42);
        sheet.Cell(2, 5).GetString().ShouldBe("Sensör");
        sheet.Cell(3, 2).GetString().ShouldBe("");
    }

    [Fact]
    public void Firma_bilgisi_yoksa_sutunlar_degismez()
    {
        var sheet = Sheet(ReportExporter.FormResponsesToExcel(Form(), new List<ResponseListItemDto> { Response(null) }));

        sheet.Cell(1, 2).GetString().ShouldBe("Durum");
        sheet.Cell(2, 3).GetValue<int>().ShouldBe(42);
        sheet.Cell(2, 4).GetString().ShouldBe("Sensör");
    }

    /// <summary>Tur 15 · canlı listeden seçilen çağrı { value, label } saklanır; Excel'e kimlik değil ad yazılır.</summary>
    [Fact]
    public void Canli_liste_secimi_adiyla_yazilir()
    {
        var response = Response(null);
        response.Answers = $"{{\"{QuestionId}\":{{\"value\":\"3f2b8c1e-9d4a-4c7e-8b21-5a6f0e9d1c34\",\"label\":\"TÜBİTAK · 1501 (2026/1)\"}}}}";

        var sheet = Sheet(ReportExporter.FormResponsesToExcel(Form(), new List<ResponseListItemDto> { response }));

        sheet.Cell(2, 4).GetString().ShouldBe("TÜBİTAK · 1501 (2026/1)");
    }

    /// <summary>
    /// Yanıtı oturumsuz ziyaretçi yazar; dosyayı yönetici Excel'de açar. "=", "+", "-", "@" ile başlayan
    /// yanıt FORMÜL olarak çalışmamalı. Koruma kütüphanenin davranışına dayanıyor (metin, formül diye
    /// yorumlanmaz); hücre bir gün formül atamasıyla ya da tür tahminiyle yazılırsa bu test kırılır.
    /// </summary>
    [Theory]
    [InlineData("=HYPERLINK(\"http://kotu.example\",\"tıkla\")")]
    [InlineData("=1+1")]
    [InlineData("+SUM(A1:A9)")]
    [InlineData("-2+3")]
    [InlineData("@SUM(1,2)")]
    public void Formul_gibi_gorunen_yanit_metin_olarak_yazilir(string answer)
    {
        // Firma adı da kiracının yazdığı metindir.
        var response = Response("=Firma()");
        response.Answers = System.Text.Json.JsonSerializer.Serialize(
            new Dictionary<string, string> { [QuestionId.ToString()] = answer });

        var sheet = Sheet(ReportExporter.FormResponsesToExcel(Form(), new List<ResponseListItemDto> { response }));

        foreach (var cell in new[] { sheet.Cell(2, 2), sheet.Cell(2, 5) })
        {
            cell.HasFormula.ShouldBeFalse();
            cell.DataType.ShouldBe(XLDataType.Text);
        }
        sheet.Cell(2, 5).GetString().ShouldBe(answer);
    }

    /// <summary>Aynı kural geri bildirim dışa aktarımında: konu ve sayfa adresi kullanıcının yazdığı metindir.</summary>
    [Fact]
    public void Geri_bildirim_konusu_formul_olarak_yazilmaz()
    {
        var item = new Apya.Platform.Feedbacks.Dtos.FeedbackDto
        {
            CreationTime = new DateTime(2026, 9, 14, 10, 0, 0),
            TenantName = "=Firma()",
            Subject = "=HYPERLINK(\"http://kotu.example\",\"tıkla\")",
            PageUrl = "=1+1",
            AdminTags = "+etiket",
        };

        var sheet = Sheet(ReportExporter.FeedbackListToExcel(new List<Apya.Platform.Feedbacks.Dtos.FeedbackDto> { item }));

        foreach (var column in new[] { 2, 4, 8, 10 })
        {
            sheet.Cell(2, column).HasFormula.ShouldBeFalse();
            sheet.Cell(2, column).DataType.ShouldBe(XLDataType.Text);
        }
        sheet.Cell(2, 4).GetString().ShouldBe(item.Subject);
    }
}
