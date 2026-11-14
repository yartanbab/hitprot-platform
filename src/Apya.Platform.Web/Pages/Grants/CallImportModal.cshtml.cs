using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Hibe çağrısı içe aktarmanın istek boyu seçenekleri.</summary>
public sealed class GrantCallImportLookups
{
    internal List<(Guid Id, string Name, string Issuer)> Programs { get; init; } = [];
    internal List<(GrantCallStatus Value, string Name)> Statuses { get; init; } = [];

    /// <summary>Kurumda ve dosyada görülen çağrılar: "program|dönem".</summary>
    internal HashSet<string> Calls { get; init; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Hibe çağrılarını Excel/CSV'den host kataloğuna aktarır. Her satır çağrı penceresinin servisinden
/// (<see cref="IGrantCallAppService.CreateAsync"/>) geçer; çağrı programa bağlıdır, program adla (gerekirse
/// kurumla) bulunur. Aynı program + dönem ikinci kez açılmaz. Dışa aktarmadaki "Çağrı yok" satırları
/// (çağrısı olmayan program) atlanır.
/// <para>İçe aktarılan açık çağrılar firmalara DUYURULMAZ (ürün kararı 2026-11-14): duyuru taramasında
/// "işlendi" sayılır. Duyurulacak çağrı ekrandan yayınlanır.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
public class CallImportModalModel : ExcelImportPageModel<GrantCallImportLookups, CreateUpdateGrantCallDto?>
{
    private const int MaxPeriodLength = 32;
    private const int MaxReferenceLength = 64;

    private readonly IGrantCallAppService _callAppService;
    private readonly IGrantAppService _grantAppService;
    private readonly GrantCallAnnouncer _announcer;

    public CallImportModalModel(IGrantCallAppService callAppService, IGrantAppService grantAppService,
        GrantCallAnnouncer announcer)
    {
        _callAppService = callAppService;
        _grantAppService = grantAppService;
        _announcer = announcer;
    }

    protected override string NameKey => "Export:GrantCalls:Name";

    private sealed record Headers(string Program, string Issuer, string Period, string Reference, string Status,
        string OpenDate, string Deadline, string Budget);

    // Başlıklar dışa aktarmayla aynı (çağrı bütçesi dışa aktarmada yok, yalnız içe aktarmada).
    private Headers H => new(L["Export:Col:Program"], L["Export:Col:Issuer"], L["Export:Col:Period"],
        L["Export:Col:Reference"], L["Export:Col:Status"], L["Export:Col:OpenDate"], L["Export:Col:DueDate"],
        L["Export:Col:Budget"]);

    protected override IReadOnlyList<ImportColumn> Columns(GrantCallImportLookups lookups)
    {
        var h = H;
        return
        [
            new(h.Program, Required: true, Options: lookups.Programs.Select(p => p.Name).Distinct().ToList()),
            new(h.Issuer),
            new(h.Period, Required: true),
            new(h.Reference),
            new(h.Status, Options: lookups.Statuses.Select(s => s.Name).ToList()),
            new(h.OpenDate),
            new(h.Deadline),
            new(h.Budget),
        ];
    }

    protected override async Task<GrantCallImportLookups> LoadLookupsAsync()
    {
        var programs = (await _grantAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 })).Items
            .Select(g => (g.Id, g.Name, g.Issuer)).ToList();

        // Mevcut çağrıların hepsi (taslak ve kapanmış dahil): aynı program + dönem ikinci kez açılmaz.
        var existing = await ExcelTable.CollectAsync((skip, take) =>
            _callAppService.GetListAsync(new GetGrantCallListDto { SkipCount = skip, MaxResultCount = take }));
        var calls = existing.Items.Select(c => $"{c.GrantId}|{c.Period}").ToHashSet(StringComparer.OrdinalIgnoreCase);

        return new GrantCallImportLookups
        {
            Programs = programs,
            Statuses =
            [
                (GrantCallStatus.Taslak, L["Grants:Calls:State:Draft"].Value),
                (GrantCallStatus.Planlandi, L["Grants:Calls:State:Planned"].Value),
                (GrantCallStatus.Acik, L["Grants:Calls:State:Live"].Value),
                (GrantCallStatus.Kapandi, L["Grants:Calls:State:Closed"].Value),
            ],
            Calls = calls
        };
    }

    protected override Task<CreateUpdateGrantCallDto?> MapAsync(ImportRow row, GrantCallImportLookups lookups)
    {
        var h = H;

        // Dışa aktarmanın "Çağrı yok" satırı: programın çağrısı yok, aktarılacak bir şey yok.
        if (Same(row.Text(h.Status), L["Grants:Calls:State:NoCall"].Value))
        {
            return Task.FromResult<CreateUpdateGrantCallDto?>(null);
        }

        var dto = new CreateUpdateGrantCallDto { Status = GrantCallStatus.Taslak };

        var program = row.Text(h.Program);
        var issuer = row.Text(h.Issuer);
        if (program.Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", h.Program]);
        }
        else
        {
            // Aynı adlı iki program olabilir (farklı kurum): kurum yazılmışsa adayları daraltır.
            var candidates = lookups.Programs.Where(p => issuer.Length == 0 || Same(p.Issuer, issuer));
            if (TryMatch(row, h.Program, program, candidates, p => [p.Name], out var match))
            {
                dto.GrantId = match.Id;
            }
        }

        dto.Period = row.Text(h.Period);
        if (dto.Period.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Period]);
        else if (dto.Period.Length > MaxPeriodLength) row.Errors.Add(L["Import:Error:TooLong", h.Period, MaxPeriodLength]);
        else if (dto.GrantId != Guid.Empty && !lookups.Calls.Add($"{dto.GrantId}|{dto.Period}"))
        {
            row.Errors.Add(L["Import:Error:Duplicate", h.Period, $"{program} {dto.Period}"]);
        }

        var reference = row.Text(h.Reference);
        if (reference.Length > MaxReferenceLength) row.Errors.Add(L["Import:Error:TooLong", h.Reference, MaxReferenceLength]);
        dto.Reference = reference.Length > 0 ? reference : null;

        var status = row.Text(h.Status);
        if (status.Length > 0 && TryMatch(row, h.Status, status, lookups.Statuses, s => [s.Name, s.Value.ToString()], out var st))
        {
            dto.Status = st.Value;
        }

        dto.OpenDate = OptionalDate(row, h.OpenDate);
        dto.Deadline = OptionalDate(row, h.Deadline);
        if (dto.OpenDate.HasValue && dto.Deadline < dto.OpenDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", h.Deadline, h.OpenDate]);
        }

        if (row.Text(h.Budget).Length > 0)
        {
            var budget = ExcelImport.Decimal(row.Value(h.Budget));
            if (budget == null) row.Errors.Add(L["Import:Error:Number", h.Budget]);
            else if (budget < 0) row.Errors.Add(L["Import:Error:Negative", h.Budget]);
            else dto.Budget = Math.Round(budget.Value, 2);
        }

        return Task.FromResult<CreateUpdateGrantCallDto?>(dto);
    }

    private DateTime? OptionalDate(ImportRow row, string header)
    {
        if (row.Text(header).Length == 0)
        {
            return null;
        }

        var date = ExcelImport.Date(row.Value(header));
        if (date == null) row.Errors.Add(L["Import:Error:Date", header]);
        return date;
    }

    protected override async Task CreateAsync(CreateUpdateGrantCallDto? row)
    {
        if (row == null)
        {
            return;
        }

        var call = await _callAppService.CreateAsync(row);
        if (row.Status == GrantCallStatus.Acik)
        {
            await _announcer.MarkProcessedAsync(call.Id, Clock.Now);
        }
    }
}
