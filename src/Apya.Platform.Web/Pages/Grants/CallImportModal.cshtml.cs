using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Hibe çağrısı aktarımının istek boyu seçenekleri.</summary>
public sealed class GrantCallImportLookups
{
    internal GrantCallFile File { get; init; } = null!;

    internal List<(Guid Id, string Name, string Issuer)> Programs { get; init; } = [];

    internal Dictionary<Guid, GrantCallDto> Calls { get; init; } = [];

    /// <summary>Katalogda ve dosyada görülen "program|dönem" çiftleri.</summary>
    internal HashSet<string> CallKeys { get; init; } = [];

    /// <summary>Katalogda ve dosyada görülen "AD|KURUM" çiftleri.</summary>
    internal HashSet<string> ProgramKeys { get; init; } = [];

    internal Dictionary<Guid, GrantParameterDto> Parameters { get; } = [];

    /// <summary>Dosyada parametreleri yazılmış programlar: anahtar → program hücreleri.</summary>
    internal Dictionary<string, string> SeenPrograms { get; } = [];

    internal HashSet<Guid> SeenCalls { get; } = [];
}

/// <summary>Dosya satırı: program yazılacaksa <see cref="Program"/>, çağrı yazılacaksa <see cref="Call"/> dolu.</summary>
public sealed class GrantCallImportRow : IFullParameterRow
{
    public Guid? ProgramId { get; init; }

    /// <summary>Yeni programın dosyadaki anahtarı: aynı programın sonraki satırları kayıtta onu bulur.</summary>
    public string ProgramKey { get; init; } = string.Empty;

    public UpdateGrantParameterDto? Program { get; init; }

    public Guid? CallId { get; init; }

    public CreateUpdateGrantCallDto? Call { get; init; }

    /// <summary>Çağrı bu satırla Yayında'ya geçiyor: firmalara duyurulmadan "işlendi" sayılır.</summary>
    public bool Silence { get; init; }

    /// <summary>Yeni çağrı ya da yeni program açan satır "yeni" sayılır.</summary>
    public Guid? Id => CallId ?? (Call != null ? null : ProgramId);

    public bool Unchanged => Program == null && Call == null;
}

/// <summary>
/// Sistem yöneticisine özel hibe çağrısı aktarımı: her satırda çağrının alanları ve programının bütün
/// parametreleri. Program kimliğiyle ya da adı + kurumuyla bulunur, yoksa açılır; program sütunları programı
/// günceller. Çağrı kimliği doluysa çağrı güncellenir, boşsa yeni çağrı açılır; çağrı sütunları boşsa satırda
/// çağrı yoktur. Aynı programın satırlarında program sütunları aynı olmalıdır.
/// <para>Yayında'ya geçen çağrı firmalara DUYURULMAZ (ürün kararı 2026-11-14): duyuru taramasında "işlendi"
/// sayılır. Duyurulacak çağrı ekrandan yayınlanır. Kapandı'ya geçen çağrıda ekrandaki kapanış zinciri çalışır.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
[Authorize(PlatformPermissions.Grants.Edit)]
public class CallImportModalModel : FullParameterImportPageModel<GrantCallImportLookups, GrantCallImportRow>
{
    private readonly IGrantCallAppService _callAppService;
    private readonly IGrantAppService _grantAppService;
    private readonly IGrantParameterAppService _parameterAppService;
    private readonly IGrantStageTemplateAppService _stageTemplateAppService;
    private readonly GrantCallAnnouncer _announcer;

    /// <summary>Bu yüklemede açılan programlar (aynı programın sonraki satırları için).</summary>
    private readonly Dictionary<string, Guid> _created = [];

    public CallImportModalModel(IGrantCallAppService callAppService, IGrantAppService grantAppService,
        IGrantParameterAppService parameterAppService, IGrantStageTemplateAppService stageTemplateAppService,
        GrantCallAnnouncer announcer)
    {
        _callAppService = callAppService;
        _grantAppService = grantAppService;
        _parameterAppService = parameterAppService;
        _stageTemplateAppService = stageTemplateAppService;
        _announcer = announcer;
    }

    protected override string NameKey => "Export:GrantCalls:Name";

    protected override IReadOnlyList<ImportColumn> Columns(GrantCallImportLookups lookups) => lookups.File.Columns;

    protected override void CompleteTemplate(XLWorkbook workbook, GrantCallImportLookups lookups)
        => lookups.File.AddGuide(workbook);

    protected override async Task<GrantCallImportLookups> LoadLookupsAsync()
    {
        var programs = await ExcelTable.CollectAsync((skip, take) => _grantAppService.GetListAsync(
            new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));
        var calls = await ExcelTable.CollectAsync((skip, take) =>
            _callAppService.GetListAsync(new GetGrantCallListDto { SkipCount = skip, MaxResultCount = take }));
        var stages = await _stageTemplateAppService.GetListAsync();

        return new GrantCallImportLookups
        {
            File = new GrantCallFile(L, stages.Select(s => (s.Id, s.Name)).ToList()),
            Programs = programs.Items.Select(p => (p.Id, p.Name, p.Issuer)).ToList(),
            Calls = calls.Items.ToDictionary(c => c.Id),
            CallKeys = calls.Items.Select(c => CallKey(c.GrantId.ToString(), c.Period)).ToHashSet(),
            ProgramKeys = programs.Items.Select(p => ProgramKey(p.Name, p.Issuer)).ToHashSet()
        };
    }

    protected override async Task<GrantCallImportRow> MapAsync(ImportRow row, GrantCallImportLookups lookups)
    {
        var program = lookups.File.Program;
        var nameHeader = program.Fields[0].Header;
        var name = row.Text(nameHeader);
        var issuer = row.Text(program.Fields[1].Header);

        // ── Program: kimlikle, yoksa ad + kurumla ──
        Guid? programId = null;
        var idText = row.Text(program.IdHeader);
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || lookups.Programs.All(p => p.Id != parsed))
            {
                row.Errors.Add(L["Import:Error:NotFound", program.IdHeader, idText]);
            }
            else
            {
                programId = parsed;
            }
        }
        else if (name.Length > 0)
        {
            var matches = lookups.Programs.Where(p => Same(p.Name, name) && Same(p.Issuer, issuer)).ToList();
            if (matches.Count > 1)
            {
                row.Errors.Add(L["Import:Error:Ambiguous", nameHeader, $"{name} / {issuer}"]);
            }
            else if (matches.Count == 1)
            {
                programId = matches[0].Id;
            }
        }

        var current = programId is { } id ? await ParameterAsync(lookups, id) : null;
        var key = programId?.ToString() ?? ProgramKey(name, issuer);
        var programInput = MapProgram(row, lookups, key, current);

        // ── Çağrı ──
        var (callId, callInput, silence) = MapCall(row, lookups, programId, key, name);

        return new GrantCallImportRow
        {
            ProgramId = programId,
            ProgramKey = key,
            Program = programInput,
            CallId = callId,
            Call = callInput,
            Silence = silence
        };
    }

    /// <summary>
    /// Programın yazılacak hâli; yazılmayacaksa null. Parametre sütunları boş satır (yalnız ad ve kurum)
    /// programı yalnız gösterir, dokunmaz: yeni çağrı satırı program bilgisini tekrar yazmak zorunda değil.
    /// </summary>
    private UpdateGrantParameterDto? MapProgram(ImportRow row, GrantCallImportLookups lookups, string key, GrantParameterDto? current)
    {
        var sheet = lookups.File.Program;
        var parameters = sheet.Fields.Skip(2).ToList();
        if (parameters.All(f => row.Text(f.Header).Length == 0) && (current != null || lookups.SeenPrograms.ContainsKey(key)))
        {
            return null;
        }

        var cells = string.Join('\u001f', sheet.Fields.Select(f =>
            Convert.ToString(row.Value(f.Header), CultureInfo.InvariantCulture)?.Trim()));
        if (lookups.SeenPrograms.TryGetValue(key, out var seen))
        {
            if (seen != cells)
            {
                row.Errors.Add(L["Import:Error:ProgramRowsDiffer", row.Text(sheet.Fields[0].Header)]);
            }

            return null;
        }

        lookups.SeenPrograms[key] = cells;
        var (input, unchanged) = sheet.Read(row, current);
        if (unchanged)
        {
            return null;
        }

        // Adı ya da kurumu değişen program katalogdaki başka bir programla aynı ada düşmesin.
        var identity = ProgramKey(input.Name, input.Issuer);
        var sameIdentity = current != null && identity == ProgramKey(current.Name, current.Issuer);
        if (current != null && !sameIdentity && !lookups.ProgramKeys.Add(identity))
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

        return input;
    }

    private (Guid? Id, CreateUpdateGrantCallDto? Input, bool Silence) MapCall(ImportRow row, GrantCallImportLookups lookups,
        Guid? programId, string key, string programName)
    {
        var sheet = lookups.File.Call;
        var idText = row.Text(sheet.IdHeader);

        // Çağrı sütunları boşsa satırda çağrı yok; eski dosyanın "Çağrı yok" durumu da öyle.
        var noCall = Same(row.Text(sheet.Fields[2].Header), L["Grants:Calls:State:NoCall"].Value);
        if (idText.Length == 0 && (noCall || sheet.Fields.All(f => row.Text(f.Header).Length == 0)))
        {
            return (null, null, false);
        }

        GrantCallDto? current = null;
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || !lookups.Calls.TryGetValue(parsed, out current))
            {
                row.Errors.Add(L["Import:Error:NotFound", sheet.IdHeader, idText]);
                return (null, null, false);
            }

            if (!lookups.SeenCalls.Add(parsed))
            {
                row.Errors.Add(L["Import:Error:Duplicate", sheet.IdHeader, idText]);
                return (null, null, false);
            }

            // Çağrı başka programa (ya da dosyada yeni açılan programa) taşınmaz.
            if (current.GrantId != programId)
            {
                row.Errors.Add(L["Import:Error:CallOtherProgram", sheet.IdHeader, idText]);
                return (null, null, false);
            }
        }

        var (input, unchanged) = sheet.Read(row, current);
        if (unchanged)
        {
            return (current!.Id, null, false);
        }

        input.GrantId = programId ?? Guid.Empty;
        var periodChanged = current == null || !Same(current.Period, input.Period);
        if (input.Period.Length > 0 && periodChanged && !lookups.CallKeys.Add(CallKey(key, input.Period)))
        {
            row.Errors.Add(L["Import:Error:Duplicate", sheet.Fields[0].Header, $"{programName} {input.Period}"]);
        }

        var silence = input.Status == GrantCallStatus.Acik && current?.Status != GrantCallStatus.Acik;
        return (current?.Id, input, silence);
    }

    protected override async Task SaveAsync(GrantCallImportRow row)
    {
        var programId = row.ProgramId ?? (_created.TryGetValue(row.ProgramKey, out var made) ? made : null);
        if (row.Program != null)
        {
            if (programId == null)
            {
                // Kolonları NOT NULL: form da boş açıklamayı ve "üst limit yok"u (0) böyle yazar.
                var created = await _grantAppService.CreateAsync(new CreateUpdateGrantDto
                {
                    Name = row.Program.Name,
                    Issuer = row.Program.Issuer,
                    Description = row.Program.Description ?? string.Empty,
                    MaxAmount = row.Program.MaxAmount ?? 0m,
                    MinMatchScore = row.Program.MinMatchScore
                });
                programId = _created[row.ProgramKey] = created.Id;
            }

            await _parameterAppService.UpdateAsync(programId.Value, row.Program);
        }

        if (row.Call == null)
        {
            return;
        }

        row.Call.GrantId = programId!.Value;
        var call = row.CallId is { } callId
            ? await _callAppService.UpdateAsync(callId, row.Call)
            : await _callAppService.CreateAsync(row.Call);
        if (row.Silence)
        {
            await _announcer.MarkProcessedAsync(call.Id, Clock.Now);
        }
    }

    private async Task<GrantParameterDto> ParameterAsync(GrantCallImportLookups lookups, Guid id)
    {
        if (!lookups.Parameters.TryGetValue(id, out var dto))
        {
            lookups.Parameters[id] = dto = await _parameterAppService.GetAsync(id);
        }

        return dto;
    }

    private static string ProgramKey(string name, string issuer)
        => $"{ExcelImport.Normalize(name)}|{ExcelImport.Normalize(issuer)}";

    private static string CallKey(string program, string period) => $"{program}|{ExcelImport.Normalize(period)}";
}
