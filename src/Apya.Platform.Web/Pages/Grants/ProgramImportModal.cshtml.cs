using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Dosya satırı: kimlik doluysa o program güncellenir, boşsa yeni program açılır.</summary>
public sealed class GrantProgramImportRow : IFullParameterRow
{
    public Guid? Id { get; init; }

    public UpdateGrantParameterDto Input { get; init; } = new();

    /// <summary>Program dosyadakiyle aynı; yazılmaz.</summary>
    public bool Unchanged { get; init; }
}

/// <summary>Hibe programı aktarımının istek boyu seçenekleri.</summary>
public sealed class GrantProgramImportLookups
{
    internal GrantProgramSheet Sheet { get; init; } = null!;

    internal List<Guid> ProgramIds { get; init; } = [];

    /// <summary>Katalogda ve dosyada görülen "AD|KURUM" çiftleri.</summary>
    internal HashSet<string> Keys { get; init; } = [];

    internal HashSet<Guid> SeenIds { get; } = [];
}

/// <summary>
/// Sistem yöneticisine özel toplu aktarım: hibe programlarının BÜTÜN parametreleri tek satırda.
/// Dolu çıktı dışarıda düzenlenip geri yüklenir. Her satır parametre formunun servisinden
/// (<see cref="IGrantParameterAppService.UpdateAsync"/>) geçer; çağrı açmaz, yayınlamaz, duyurmaz.
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
[Authorize(PlatformPermissions.Grants.Edit)]
public class ProgramImportModalModel : FullParameterImportPageModel<GrantProgramImportLookups, GrantProgramImportRow>
{
    private readonly IGrantAppService _grantAppService;
    private readonly IGrantParameterAppService _parameterAppService;
    private readonly IGrantStageTemplateAppService _stageTemplateAppService;

    public ProgramImportModalModel(IGrantAppService grantAppService, IGrantParameterAppService parameterAppService,
        IGrantStageTemplateAppService stageTemplateAppService)
    {
        _grantAppService = grantAppService;
        _parameterAppService = parameterAppService;
        _stageTemplateAppService = stageTemplateAppService;
    }

    protected override string NameKey => "DataTransfer:Module:GrantPrograms";

    protected override IReadOnlyList<ImportColumn> Columns(GrantProgramImportLookups lookups) => lookups.Sheet.Columns;

    protected override void CompleteTemplate(XLWorkbook workbook, GrantProgramImportLookups lookups)
        => lookups.Sheet.AddGuide(workbook);

    /// <summary>Mevcut programlar, içe aktarmanın sütunlarıyla: dosya düzenlenip aynen geri yüklenir.</summary>
    public async Task<IActionResult> OnGetExportAsync()
    {
        var lookups = await LoadLookupsAsync();
        var rows = new List<GrantParameterDto>();
        if (!Request.Query.ContainsKey(TableExport.ColumnsQueryKey))
        {
            foreach (var id in lookups.ProgramIds)
            {
                rows.Add(await _parameterAppService.GetAsync(id));
            }
        }

        return SheetFile(lookups.Sheet, rows);
    }

    protected override async Task<GrantProgramImportLookups> LoadLookupsAsync()
    {
        var programs = await ExcelTable.CollectAsync((skip, take) => _grantAppService.GetListAsync(
            new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));
        var stages = await _stageTemplateAppService.GetListAsync();

        return new GrantProgramImportLookups
        {
            Sheet = new GrantProgramSheet(L, stages.Select(s => (s.Id, s.Name)).ToList()),
            ProgramIds = programs.Items.Select(p => p.Id).ToList(),
            Keys = programs.Items.Select(p => ProgramKey(p.Name, p.Issuer)).ToHashSet()
        };
    }

    protected override async Task<GrantProgramImportRow> MapAsync(ImportRow row, GrantProgramImportLookups lookups)
    {
        var sheet = lookups.Sheet;
        Guid? id = null;
        GrantParameterDto? current = null;

        var idText = row.Text(sheet.IdHeader);
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || !lookups.ProgramIds.Contains(parsed))
            {
                row.Errors.Add(L["Import:Error:NotFound", sheet.IdHeader, idText]);
            }
            else if (!lookups.SeenIds.Add(parsed))
            {
                row.Errors.Add(L["Import:Error:Duplicate", sheet.IdHeader, idText]);
            }
            else
            {
                id = parsed;
                current = await _parameterAppService.GetAsync(parsed);
            }
        }

        var (input, unchanged) = sheet.Read(row, current);
        if (unchanged)
        {
            return new GrantProgramImportRow { Id = id, Input = input, Unchanged = true };
        }

        // Kimliği unutulmuş satır mevcut programın kopyasını açmasın. Adı ve kurumu değişmeyen satır
        // denetlenmez: katalogda aynı ad + kurumla iki program olabilir, dosya yine geri yüklenmeli.
        var key = ProgramKey(input.Name, input.Issuer);
        var sameIdentity = current != null && key == ProgramKey(current.Name, current.Issuer);
        if (!sameIdentity && !lookups.Keys.Add(key))
        {
            row.Errors.Add(L["Import:Error:Duplicate", sheet.Fields[0].Header, $"{input.Name} / {input.Issuer}"]);
        }

        // Aralık kuralı domain'de; kayıttan önce satırda gösterilir.
        try
        {
            Grant.EnsureRangesValid(input.MinCompanyAgeYears, input.MaxCompanyAgeYears, input.MinTrl, input.MaxTrl,
                input.MinRevenue, input.MaxRevenue, input.MinAmount, input.MaxAmount);
        }
        catch (BusinessException ex)
        {
            row.Errors.Add(this.UserMessage(ex));
        }

        return new GrantProgramImportRow { Id = id, Input = input };
    }

    protected override async Task SaveAsync(GrantProgramImportRow row)
    {
        var id = row.Id;
        if (id == null)
        {
            // Kolonları NOT NULL: form da boş açıklamayı ve "üst limit yok"u (0) böyle yazar.
            var created = await _grantAppService.CreateAsync(new CreateUpdateGrantDto
            {
                Name = row.Input.Name,
                Issuer = row.Input.Issuer,
                Description = row.Input.Description ?? string.Empty,
                MaxAmount = row.Input.MaxAmount ?? 0m,
                MinMatchScore = row.Input.MinMatchScore
            });
            id = created.Id;
        }

        await _parameterAppService.UpdateAsync(id.Value, row.Input);
    }

    private static string ProgramKey(string name, string issuer)
        => $"{ExcelImport.Normalize(name)}|{ExcelImport.Normalize(issuer)}";
}
