using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.Extensions.Localization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// "Excel'den içe aktar" ortak okuyucusu: şablon başlıkları geri okunur, zorunlu sütun aranır,
/// boş satır atlanır, Türkçe sayı ve tarih metinleri doğru çözülür.
/// </summary>
public class ExcelImport_Tests
{
    /// <summary>Anahtarı ve argümanları aynen döndürür; testler mesaj metnine değil anahtara bakar.</summary>
    private sealed class KeyLocalizer : IStringLocalizer
    {
        public LocalizedString this[string name] => new(name, name);
        public LocalizedString this[string name, params object[] arguments] => new(name, name + "|" + string.Join("|", arguments));
        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [];
    }

    private static readonly KeyLocalizer L = new();

    private static readonly List<ImportColumn> Columns =
    [
        new("Tarih", Required: true),
        new("Başlık", Required: true),
        new("Kasa", Options: ["Merkez", "Banka"]),
        new("Açıklama"),
    ];

    private static MemoryStream Workbook(Action<IXLWorksheet> fill)
    {
        using var wb = new XLWorkbook();
        fill(wb.AddWorksheet("Sayfa"));
        var stream = new MemoryStream();
        wb.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }

    [Fact]
    public void Sablon_basliklari_geri_okunur_ve_listeli_sutun_secenek_sayfasina_baglanir()
    {
        var bytes = ExcelImport.Template("Giderler", "Seçenekler", Columns);
        using var wb = new XLWorkbook(new MemoryStream(bytes));

        var sheet = wb.Worksheet(1);
        sheet.Cell(1, 1).GetString().ShouldBe("Tarih *");
        sheet.Cell(1, 3).GetString().ShouldBe("Kasa");
        wb.Worksheet("Seçenekler").Cell(3, 1).GetString().ShouldBe("Banka");
        sheet.Cell(2, 3).HasDataValidation.ShouldBeTrue();
        sheet.Cell(2, 1).HasDataValidation.ShouldBeFalse();

        sheet.Cell(2, 1).Value = new DateTime(2026, 11, 5);
        sheet.Cell(2, 2).Value = "Kırtasiye";
        var stream = new MemoryStream();
        wb.SaveAs(stream);
        stream.Position = 0;

        var result = ExcelImport.Read(stream, Columns, L);
        result.Errors.ShouldBeEmpty();
        result.Rows.Count.ShouldBe(1);
        result.Rows[0].Number.ShouldBe(2);
        result.Rows[0].Text("Başlık").ShouldBe("Kırtasiye");
        ExcelImport.Date(result.Rows[0].Value("Tarih")).ShouldBe(new DateTime(2026, 11, 5));
        result.Headers.ShouldBe(["Tarih", "Başlık", "Kasa", "Açıklama"]);
    }

    [Fact]
    public void Zorunlu_sutun_yoksa_hata_isteğe_bagli_sutun_eksik_olabilir()
    {
        var missing = ExcelImport.Read(Workbook(ws => { ws.Cell(1, 1).Value = "Tarih"; ws.Cell(2, 1).Value = "x"; }), Columns, L);
        missing.Errors.ShouldBe(["Import:Error:MissingColumn|Başlık"]);
        missing.Rows.ShouldBeEmpty();

        // Başlık sırası ve harf büyüklüğü önemsiz; Kasa ve Açıklama hiç yok.
        var ok = ExcelImport.Read(Workbook(ws =>
        {
            ws.Cell(1, 1).Value = "başlık";
            ws.Cell(1, 2).Value = "TARİH *";
            ws.Cell(2, 1).Value = "Kira";
            ws.Cell(2, 2).Value = "05.11.2026";
        }), Columns, L);
        ok.Errors.ShouldBeEmpty();
        ok.Rows[0].Text("Başlık").ShouldBe("Kira");
        ok.Rows[0].Text("Kasa").ShouldBe(string.Empty);
    }

    [Fact]
    public void Bos_satirlar_atlanir_hic_satir_yoksa_hata()
    {
        var result = ExcelImport.Read(Workbook(ws =>
        {
            ws.Cell(1, 1).Value = "Tarih";
            ws.Cell(1, 2).Value = "Başlık";
            ws.Cell(4, 2).Value = "Yalnız bu";
        }), Columns, L);
        result.Rows.Select(r => r.Number).ShouldBe([4]);

        var empty = ExcelImport.Read(Workbook(ws => { ws.Cell(1, 1).Value = "Tarih"; ws.Cell(1, 2).Value = "Başlık"; }), Columns, L);
        empty.Errors.ShouldBe(["Import:Error:NoRows"]);
    }

    [Fact]
    public void Satir_siniri_asilirsa_hicbir_satir_donmez()
    {
        var result = ExcelImport.Read(Workbook(ws =>
        {
            ws.Cell(1, 1).Value = "Tarih";
            ws.Cell(1, 2).Value = "Başlık";
            for (var r = 2; r <= ExcelImport.MaxRows + 2; r++) ws.Cell(r, 2).Value = "x";
        }), Columns, L);

        result.Rows.ShouldBeEmpty();
        result.Errors.ShouldBe([$"Import:Error:TooManyRows|{ExcelImport.MaxRows}"]);
    }

    [Fact]
    public void Excel_olmayan_dosya_okunamaz()
    {
        var result = ExcelImport.Read(new MemoryStream([1, 2, 3]), Columns, L);
        result.Errors.ShouldBe(["Import:Error:NotExcel"]);
    }

    [Theory]
    [InlineData("1.234,56", 1234.56)]
    [InlineData("1.500", 1500)]
    [InlineData("12.5", 12.5)]
    [InlineData("250", 250)]
    [InlineData("1 250,5", 1250.5)]
    public void Sayi_metni_turkce_ve_noktali_okunur(string text, double expected)
    {
        ExcelImport.Decimal(text).ShouldBe((decimal)expected);
    }

    [Fact]
    public void Sayi_ve_tarih_okunamazsa_bos_doner()
    {
        ExcelImport.Decimal(42.5d).ShouldBe(42.5m);
        ExcelImport.Decimal("abc").ShouldBeNull();
        ExcelImport.Decimal(null).ShouldBeNull();
        ExcelImport.Date("2026-11-05").ShouldBe(new DateTime(2026, 11, 5));
        ExcelImport.Date("5.11.2026").ShouldBe(new DateTime(2026, 11, 5));
        ExcelImport.Date("32.13.2026").ShouldBeNull();
        ExcelImport.Date(12d).ShouldBeNull();
    }
}
