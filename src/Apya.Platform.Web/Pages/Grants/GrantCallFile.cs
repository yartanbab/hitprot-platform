using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Çağrı dosyasının satırı: çağrı (çağrısız programda null) ve programının bütün parametreleri.</summary>
public sealed class GrantCallFileRow
{
    public GrantParameterDto Program { get; init; } = null!;

    public GrantCallDto? Call { get; init; }

    public int? DaysRemaining { get; init; }

    public int? MatchingFirms { get; init; }

    public int? Interests { get; init; }
}

/// <summary>
/// Hibe çağrısı dosyası: her satırda çağrının alanları ve programının bütün parametreleri. Hibe ekranından
/// da İçe / Dışa Aktarma'dan da bu dosya iner; aynen geri yüklenebilir (<see cref="CallImportModalModel"/>).
/// Kalan gün, uygun firma, ilgi talebi ve afiş dosyası yalnız bilgidir, içe aktarmada okunmaz.
/// </summary>
internal sealed class GrantCallFile
{
    private readonly IStringLocalizer _l;

    public GrantCallFile(IStringLocalizer l, IReadOnlyList<(Guid Id, string Name)> stages)
    {
        _l = l;
        Program = new GrantProgramSheet(l, stages, inCallFile: true);
        Call = new GrantCallSheet(l);
    }

    public GrantProgramSheet Program { get; }

    public GrantCallSheet Call { get; }

    /// <summary>Sütun sırası: iki kimlik, program adı ve kurum, çağrının alanları, programın kalan parametreleri.</summary>
    private static List<T> Ordered<T>(IReadOnlyList<T> program, IReadOnlyList<T> call, params T[] afterCall)
        => [call[0], program[0], .. program.Skip(1).Take(2), .. call.Skip(1), .. afterCall, .. program.Skip(3)];

    public IReadOnlyList<ImportColumn> Columns => Ordered(Program.Columns, Call.Columns);

    public IReadOnlyList<ExcelColumn<GrantCallFileRow>> ExportColumns
    {
        get
        {
            var program = Program.ExportColumns
                .Select(c => new ExcelColumn<GrantCallFileRow>(c.Header, r => c.Value(r.Program), c.Format)).ToList();
            var call = Call.ExportColumns
                .Select(c => new ExcelColumn<GrantCallFileRow>(c.Header, r => r.Call == null ? null : c.Value(r.Call), c.Format)).ToList();
            return
            [
                .. Ordered(program, call, new ExcelColumn<GrantCallFileRow>(_l["Export:Col:DaysRemaining"], r => r.DaysRemaining)),
                new(_l["Export:Col:MatchingFirms"], r => r.MatchingFirms),
                new(_l["Export:Col:Interests"], r => r.Interests),
                // Yüklenmiş afişin saklanan adı: yalnız bilgi, içe aktarmada okunmaz (olmayan dosya adı yazılamasın).
                new(_l["Export:Col:PosterFile"], r => r.Program.PosterFileName),
            ];
        }
    }

    public void AddGuide(ClosedXML.Excel.XLWorkbook workbook)
        => GrantProgramSheet.WriteGuide(workbook, _l, Ordered(Program.GuideRows, Call.GuideRows));

    /// <summary>Dolu çıktı: açılır listeler ve alan rehberiyle.</summary>
    public IActionResult File(PageModel page, IEnumerable<GrantCallFileRow> rows)
        => page.TableFile(_l["Export:GrantCalls:Name"].Value, ExportColumns, rows, finish: workbook =>
        {
            ExcelImport.AddOptions(workbook, workbook.Worksheet(1), _l["Import:OptionsSheet"], Columns);
            AddGuide(workbook);
        });

    /// <summary>Pano kartlarından dosya satırları; program parametreleri her program için bir kez okunur.</summary>
    public static async Task<List<GrantCallFileRow>> RowsAsync(IEnumerable<GrantCallCardDto> cards,
        IGrantParameterAppService parameters, IGrantCallAppService calls)
    {
        var allCalls = (await ExcelTable.CollectAsync((skip, take) =>
            calls.GetListAsync(new GetGrantCallListDto { SkipCount = skip, MaxResultCount = take }))).Items.ToDictionary(c => c.Id);
        var programs = new Dictionary<Guid, GrantParameterDto>();
        var rows = new List<GrantCallFileRow>();
        foreach (var card in cards)
        {
            if (!programs.TryGetValue(card.GrantId, out var program))
            {
                programs[card.GrantId] = program = await parameters.GetAsync(card.GrantId);
            }

            rows.Add(new GrantCallFileRow
            {
                Program = program,
                Call = card.GrantCallId is { } id && allCalls.TryGetValue(id, out var call) ? call : null,
                DaysRemaining = card.DaysRemaining,
                MatchingFirms = card.MatchingFirmCount,
                Interests = card.InterestCount
            });
        }

        return rows;
    }
}
