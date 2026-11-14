using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Web.Export;
using ClosedXML.Excel;
using Shouldly;
using Volo.Abp.Application.Dtos;
using Xunit;

namespace Apya.Platform.Export;

/// <summary>
/// Liste ekranlarının ortak Excel çıktısı: başlık satırı, tür biçimleri, kesilme notu ve
/// sayfalı ucun 1000'erli toplanması.
/// </summary>
public class ExcelTable_Tests
{
    private sealed record Row(string Name, decimal? Amount, DateTime? Date);

    private static readonly List<ExcelColumn<Row>> Columns =
    [
        new("Ad", r => r.Name),
        new("Tutar", r => r.Amount),
        new("Tarih", r => r.Date),
    ];

    private static IXLWorksheet Sheet(byte[] bytes) => new XLWorkbook(new MemoryStream(bytes)).Worksheet(1);

    [Fact]
    public void Baslik_ilk_satirda_degerler_turune_gore_yazilir()
    {
        var sheet = Sheet(ExcelTable.Build("Liste", Columns,
            [new Row("=1+1", 1234.5m, new DateTime(2026, 11, 5)), new Row("Boş", null, null)]));

        sheet.Name.ShouldBe("Liste");
        sheet.Cell(1, 1).GetString().ShouldBe("Ad");
        sheet.Cell(1, 3).GetString().ShouldBe("Tarih");

        // "=" ile başlayan metin formül olarak çalışmaz.
        sheet.Cell(2, 1).HasFormula.ShouldBeFalse();
        sheet.Cell(2, 1).GetString().ShouldBe("=1+1");

        sheet.Cell(2, 2).GetValue<decimal>().ShouldBe(1234.5m);
        sheet.Cell(2, 2).Style.NumberFormat.Format.ShouldBe("#,##0.00");
        sheet.Cell(2, 3).GetDateTime().ShouldBe(new DateTime(2026, 11, 5));
        sheet.Cell(2, 3).Style.DateFormat.Format.ShouldBe("dd.MM.yyyy");

        sheet.Cell(3, 2).IsEmpty().ShouldBeTrue();
        sheet.Cell(3, 3).IsEmpty().ShouldBeTrue();
    }

    [Fact]
    public void Not_verilirse_verinin_bir_satir_altina_yazilir()
    {
        var sheet = Sheet(ExcelTable.Build("Liste", Columns, [new Row("A", 1, null)], "Kesildi"));

        sheet.Cell(3, 1).IsEmpty().ShouldBeTrue();
        sheet.Cell(4, 1).GetString().ShouldBe("Kesildi");
    }

    [Fact]
    public void Gecersiz_sayfa_adi_temizlenir_ve_31_karakterde_kesilir()
    {
        var sheet = Sheet(ExcelTable.Build("Gelir/Gider: [2026] ve çok uzun bir başlık", Columns, []));

        sheet.Name.Length.ShouldBeLessThanOrEqualTo(31);
        sheet.Name.IndexOfAny(['/', ':', '[', ']']).ShouldBe(-1);
    }

    [Fact]
    public void Csv_noktali_virgulle_ayrilir_sayi_virgullu_tarih_gunlu_yazilir()
    {
        var bytes = ExcelTable.BuildCsv(Columns,
        [
            new Row("Kira; \"ofis\"", 1234.5m, new DateTime(2026, 11, 5)),
            new Row("=1+1", null, new DateTime(2026, 11, 5, 14, 30, 0)),
        ]);

        // BOM: Excel dosyayı UTF-8 olarak açsın (Türkçe harfler bozulmasın).
        bytes.Take(3).ShouldBe(new byte[] { 0xEF, 0xBB, 0xBF });
        var lines = Encoding.UTF8.GetString(bytes, 3, bytes.Length - 3).Split("\r\n");
        lines[0].ShouldBe("Ad;Tutar;Tarih");
        lines[1].ShouldBe("\"Kira; \"\"ofis\"\"\";1234,5;05.11.2026");
        // "=" ile başlayan metin Excel'de formül olarak çalışmasın.
        lines[2].ShouldBe("'=1+1;;05.11.2026 14:30");
    }

    [Fact]
    public void En_buyuk_liste_iki_bicimde_de_saniyeler_icinde_uretilir()
    {
        var rows = Enumerable.Range(0, ExcelTable.MaxRows)
            .Select(i => new Row("Satır " + i, i * 1.5m, new DateTime(2026, 1, 1).AddDays(i % 365))).ToList();

        var watch = Stopwatch.StartNew();
        ExcelTable.Build("Liste", Columns, rows).Length.ShouldBeGreaterThan(0);
        ExcelTable.BuildCsv(Columns, rows).Length.ShouldBeGreaterThan(0);

        // Sınır bol: ölçülen süre birkaç saniyedir; yüklü test makinesinde de geçsin.
        watch.Elapsed.ShouldBeLessThan(TimeSpan.FromSeconds(60));
    }

    [Fact]
    public async Task Toplama_toplam_sayiya_ulasinca_durur()
    {
        var calls = new List<(int Skip, int Take)>();
        var rows = await ExcelTable.CollectAsync((skip, take) =>
        {
            calls.Add((skip, take));
            var count = Math.Min(take, 2500 - skip);
            return Task.FromResult(new PagedResultDto<int>(2500, Enumerable.Range(skip, count).ToList()));
        });

        rows.Items.Count.ShouldBe(2500);
        rows.Truncated.ShouldBeFalse();
        calls.ShouldBe([(0, 1000), (1000, 1000), (2000, 1000)]);
    }

    [Fact]
    public async Task Toplama_sinirda_keser_ve_isaretler()
    {
        var rows = await ExcelTable.CollectAsync((skip, take) =>
            Task.FromResult(new PagedResultDto<int>(50_000, Enumerable.Range(skip, take).ToList())));

        rows.Items.Count.ShouldBe(ExcelTable.MaxRows);
        rows.Truncated.ShouldBeTrue();
    }
}
