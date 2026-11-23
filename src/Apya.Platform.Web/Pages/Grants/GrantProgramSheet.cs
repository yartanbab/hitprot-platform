using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Json;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Hibe programının tek satırlık Excel karşılığı: parametre formundaki her alan bir sütundur.
/// Çok değerli alanlar hücrede noktalı virgülle ayrılır; değerin içindeki ayraç ters eğik çizgiyle
/// korunur, böylece dışa aktarılan dosya aynen geri yüklenir. Afiş dosya olduğu için sayfada yoktur.
/// </summary>
internal sealed class GrantProgramSheet
{
    private const int MaxDocumentNameLength = 128;

    /// <param name="Keep">Sütun dosyadan silinmişse mevcut değeri korur.</param>
    /// <param name="Options">Hücrede açılır liste olan değerler.</param>
    /// <param name="Allowed">Çok değerli sütunun geçerli değerleri (yalnız rehberde).</param>
    internal sealed record Field(
        string Header,
        string Hint,
        Func<GrantParameterDto, object?> Export,
        Action<GrantParameterDto, UpdateGrantParameterDto> Keep,
        Action<ImportRow, UpdateGrantParameterDto> Read,
        bool Required = false,
        IReadOnlyList<string>? Options = null,
        IReadOnlyList<string>? Allowed = null);

    private readonly IStringLocalizer _l;
    private readonly IReadOnlyList<(Guid Id, string Name)> _stages;
    private readonly string _yes;
    private readonly string _no;

    public GrantProgramSheet(IStringLocalizer l, IReadOnlyList<(Guid Id, string Name)> stages)
    {
        _l = l;
        _stages = stages;
        _yes = l["Import:Value:Yes"].Value;
        _no = l["Import:Value:No"].Value;
        IdHeader = H("Id");

        var sizes = Enum.GetValues<CompanySize>()
            .Select(s => ((int)s, s.ToString(), l[$"Grants:CompanySize:{s}"].Value)).ToList();
        var types = Enum.GetValues<OrganizationType>()
            .Select(o => (o.ToMaskBit(), o.ToString(), l[$"Grants:OrgType:{o}"].Value)).ToList();

        Fields =
        [
            Text("Name", d => d.Name, (t, v) => t.Name = v ?? string.Empty, required: true),
            Text("Issuer", d => d.Issuer, (t, v) => t.Issuer = v ?? string.Empty, required: true),
            Text("Description", d => d.Description, (t, v) => t.Description = v),
            Text("SourceUrl", d => d.SourceUrl, (t, v) => t.SourceUrl = v),
            Text("Objective", d => d.Objective, (t, v) => t.Objective = v),
            Text("Priorities", d => d.Priorities, (t, v) => t.Priorities = v),
            Text("EligibleApplicants", d => d.EligibleApplicants, (t, v) => t.EligibleApplicants = v),

            Mask("CompanySizes", sizes, d => d.EligibleCompanySizes, (t, v) => t.EligibleCompanySizes = v),
            Mask("ApplicantTypes", types, d => d.EligibleApplicantTypes, (t, v) => t.EligibleApplicantTypes = v),
            YesNo("ClosedToPlatform", d => d.ClosedToPlatformApplicants, (t, v) => t.ClosedToPlatformApplicants = v),
            Whole("MinCompanyAge", d => d.MinCompanyAgeYears, (t, v) => t.MinCompanyAgeYears = v),
            Whole("MaxCompanyAge", d => d.MaxCompanyAgeYears, (t, v) => t.MaxCompanyAgeYears = v),
            Whole("MinTrl", d => d.MinTrl, (t, v) => t.MinTrl = v),
            Whole("MaxTrl", d => d.MaxTrl, (t, v) => t.MaxTrl = v),
            Whole("MinStaff", d => d.MinStaffCount, (t, v) => t.MinStaffCount = v),
            Whole("MinRdStaff", d => d.MinRdStaffCount, (t, v) => t.MinRdStaffCount = v),
            Amount("MinRevenue", d => d.MinRevenue, (t, v) => t.MinRevenue = v),
            Amount("MaxRevenue", d => d.MaxRevenue, (t, v) => t.MaxRevenue = v),
            YesNo("RequiresConsortium", d => d.RequiresConsortium, (t, v) => t.RequiresConsortium = v),
            Whole("MinPartners", d => d.MinConsortiumPartners, (t, v) => t.MinConsortiumPartners = v),
            YesNo("PrefersFemale", d => d.PrefersFemaleEntrepreneur, (t, v) => t.PrefersFemaleEntrepreneur = v),
            YesNo("PrefersYoung", d => d.PrefersYoungEntrepreneur, (t, v) => t.PrefersYoungEntrepreneur = v),

            Tags(GrantCriteriaKind.Sektor, "Sectors"),
            Tags(GrantCriteriaKind.Bolge, "Provinces", "Provinces", v => TurkeyProvinces.Find(v)?.Name),
            Tags(GrantCriteriaKind.AnahtarKelime, "Keywords"),
            Tags(GrantCriteriaKind.NaceKodu, "Nace"),
            ThematicTags(),

            Amount("MinAmount", d => d.MinAmount, (t, v) => t.MinAmount = v),
            Amount("MaxAmount", d => d.MaxAmount, (t, v) => t.MaxAmount = v),
            Currency(),
            Whole("SupportRate", d => d.SupportRatePercent, (t, v) => t.SupportRatePercent = v),
            Whole("Duration", d => d.ProjectDurationMonths, (t, v) => t.ProjectDurationMonths = v),
            Repayment(),
            YesNo("Advance", d => d.HasAdvancePayment, (t, v) => t.HasAdvancePayment = v),
            YesNo("Guarantee", d => d.RequiresGuaranteeLetter, (t, v) => t.RequiresGuaranteeLetter = v),
            CostItems(),
            Documents(),
            StageTemplate(),
            Score(),
        ];
    }

    public string IdHeader { get; }

    public IReadOnlyList<Field> Fields { get; }

    public IReadOnlyList<ImportColumn> Columns =>
        [new(IdHeader), .. Fields.Select(f => new ImportColumn(f.Header, f.Required, f.Options))];

    public IReadOnlyList<ExcelColumn<GrantParameterDto>> ExportColumns =>
        [new(IdHeader, d => d.Id.ToString()), .. Fields.Select(f => new ExcelColumn<GrantParameterDto>(f.Header, f.Export))];

    /// <summary>
    /// Satırı yazma modeline çevirir. Dosyada olan sütun hücrenin değerini alır (boş hücre alanı
    /// temizler); dosyadan silinmiş sütun mevcut programın değerini korur.
    /// <para><c>Unchanged</c>: satır programın bugünkü hâliyle aynı, yazılmaz. Form kuralından eski bir
    /// değer taşıyan program (katalogda "en az 1 ortak") dokunulmadıkça dosyayı tıkamaz.</para>
    /// </summary>
    public (UpdateGrantParameterDto Input, bool Unchanged) Read(ImportRow row, GrantParameterDto? current)
    {
        var input = Parse(row, current);
        if (current != null && row.Errors.Count == 0 && IsSame(row, input, current))
        {
            return (input, true);
        }

        var results = new List<ValidationResult>();
        Validator.TryValidateObject(input, new ValidationContext(input), results, validateAllProperties: true);
        row.Errors.AddRange(results.Select(r => r.ErrorMessage ?? string.Empty).Where(m => m.Length > 0));
        return (input, false);
    }

    private UpdateGrantParameterDto Parse(ImportRow row, GrantParameterDto? current)
    {
        var input = new UpdateGrantParameterDto();
        foreach (var field in Fields)
        {
            if (row.Has(field.Header))
            {
                field.Read(row, input);
            }
            else if (current != null)
            {
                field.Keep(current, input);
            }
        }

        // Etiket ve kalemlerin sırası anlam taşımaz; belgelerin sırası taşır.
        input.CriteriaTags = input.CriteriaTags.OrderBy(t => t.Kind).ThenBy(t => t.Value, StringComparer.Ordinal).ToList();
        input.EligibleCostItems = input.EligibleCostItems.OrderBy(i => i.Kind).ToList();
        return input;
    }

    /// <summary>Programın çıktı hücreleri aynı okuyucudan geçirilir: yazım farkı değişiklik sayılmaz.</summary>
    private bool IsSame(ImportRow row, UpdateGrantParameterDto input, GrantParameterDto current)
    {
        var cells = Fields.Where(f => row.Has(f.Header)).ToDictionary(f => f.Header, f => f.Export(current) switch
        {
            null => null,
            string text => text,
            var number => (object?)Convert.ToDouble(number, CultureInfo.InvariantCulture)
        });
        var baseline = Parse(new ImportRow(row.Number, cells), current);
        return JsonSerializer.Serialize(baseline) == JsonSerializer.Serialize(input);
    }

    /// <summary>Her sütunun ne istediğini anlatan sayfa; içe aktarma yalnız ilk sayfayı okur.</summary>
    public void AddGuide(XLWorkbook workbook)
    {
        var ws = workbook.AddWorksheet(_l["Import:Guide:Sheet"].Value);
        string[] heads = [_l["Import:Guide:Column"], _l["Import:Guide:Required"], _l["Import:Guide:How"], _l["Import:Guide:Values"]];
        for (var c = 0; c < heads.Length; c++)
        {
            ws.Cell(1, c + 1).Value = heads[c];
            ws.Cell(1, c + 1).Style.Font.Bold = true;
            ws.Cell(1, c + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
        }

        var rows = new List<(string Header, bool Required, string Hint, IReadOnlyList<string>? Values)>
        {
            (IdHeader, false, Guide("Id"), null)
        };
        rows.AddRange(Fields.Select(f => (f.Header, f.Required, f.Hint, f.Allowed ?? f.Options)));

        for (var i = 0; i < rows.Count; i++)
        {
            ws.Cell(i + 2, 1).Value = rows[i].Header;
            ws.Cell(i + 2, 2).Value = rows[i].Required ? _yes : _no;
            ws.Cell(i + 2, 3).Value = rows[i].Hint;
            ws.Cell(i + 2, 4).Value = rows[i].Values == null ? string.Empty : string.Join(", ", rows[i].Values!);
        }

        ws.SheetView.FreezeRows(1);
        ws.Column(1).Width = 32;
        ws.Column(2).Width = 10;
        ws.Column(3).Width = 70;
        ws.Column(4).Width = 70;
        ws.Columns(3, 4).Style.Alignment.WrapText = true;
    }

    private string H(string key) => _l[$"Import:GrantProgram:{key}"].Value;

    private string Guide(string key) => _l[$"Import:Guide:{key}"].Value;

    private static bool Same(string a, string b) => ExcelImport.Normalize(a) == ExcelImport.Normalize(b);

    // ── Sütun türleri ──

    private Field Text(string key, Func<GrantParameterDto, string?> get, Action<UpdateGrantParameterDto, string?> set, bool required = false)
    {
        var header = H(key);
        return new(header, Guide("Text"), get, (d, t) => set(t, get(d)),
            (row, t) =>
            {
                var text = row.Text(header);
                set(t, text.Length > 0 ? text : null);
            },
            Required: required);
    }

    private Field Whole(string key, Func<GrantParameterDto, int?> get, Action<UpdateGrantParameterDto, int?> set)
    {
        var header = H(key);
        return new(header, Guide("Whole"), d => get(d), (d, t) => set(t, get(d)), (row, t) => set(t, ReadWhole(row, header)));
    }

    private Field Amount(string key, Func<GrantParameterDto, decimal?> get, Action<UpdateGrantParameterDto, decimal?> set)
    {
        var header = H(key);
        return new(header, Guide("Amount"), d => get(d), (d, t) => set(t, get(d)),
            (row, t) =>
            {
                var value = ReadNumber(row, header);
                set(t, value == null ? null : Math.Round(value.Value, 2));
            });
    }

    private Field YesNo(string key, Func<GrantParameterDto, bool> get, Action<UpdateGrantParameterDto, bool> set)
    {
        var header = H(key);
        return new(header, Guide("YesNo"), d => get(d) ? _yes : _no, (d, t) => set(t, get(d)),
            (row, t) =>
            {
                var text = row.Text(header);
                if (text.Length == 0 || Same(text, _no) || Same(text, bool.FalseString))
                {
                    set(t, false);
                }
                else if (Same(text, _yes) || Same(text, bool.TrueString))
                {
                    set(t, true);
                }
                else
                {
                    row.Errors.Add(_l["Import:Error:YesNo", header, _yes, _no]);
                }
            },
            Options: [_yes, _no]);
    }

    /// <summary>Bit maskesi: hücrede etiketler. Boş hücre "kısıt yok" (0) demektir.</summary>
    private Field Mask(string key, List<(int Bit, string Name, string Label)> options,
        Func<GrantParameterDto, int> get, Action<UpdateGrantParameterDto, int> set)
    {
        var header = H(key);
        return new(header, Guide("List"),
            d => JoinEntries(options.Where(o => (get(d) & o.Bit) != 0).Select(o => o.Label)),
            (d, t) => set(t, get(d)),
            (row, t) =>
            {
                var mask = 0;
                foreach (var entry in Entries(row.Text(header)).Select(Unescape))
                {
                    if (TryPick(row, header, entry, options, o => [o.Label, o.Name], out var match))
                    {
                        mask |= match.Bit;
                    }
                }

                set(t, mask);
            },
            Allowed: options.Select(o => o.Label).ToList());
    }

    /// <param name="canonical">Değeri kayıt biçimine çevirir; tanınmıyorsa <c>null</c>.</param>
    private Field Tags(GrantCriteriaKind kind, string key, string hint = "List", Func<string, string?>? canonical = null,
        Func<string, string>? display = null, IReadOnlyList<string>? allowed = null)
    {
        var header = H(key);
        return new(header, Guide(hint),
            d => JoinEntries(d.CriteriaTags.Where(x => x.Kind == kind).Select(x => display?.Invoke(x.Value) ?? x.Value)),
            (d, t) => t.CriteriaTags.AddRange(d.CriteriaTags.Where(x => x.Kind == kind)),
            (row, t) =>
            {
                var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var entry in Entries(row.Text(header)).Select(Unescape))
                {
                    var value = canonical == null ? entry : canonical(entry);
                    if (value == null)
                    {
                        row.Errors.Add(_l["Import:Error:NotFound", header, entry]);
                    }
                    else if (seen.Add(value))
                    {
                        t.CriteriaTags.Add(new GrantCriteriaTagDto { Kind = kind, Value = value });
                    }
                }
            },
            Allowed: allowed);
    }

    /// <summary>Tematik alan etikete enum adıyla yazılır (bkz. <see cref="GrantThematicArea"/>); hücrede okunur adı durur.</summary>
    private Field ThematicTags()
    {
        var areas = Enum.GetValues<GrantThematicArea>()
            .Select(a => (Key: a.ToString(), Label: _l[$"Grants:Thematic:{a}"].Value))
            .ToList();
        return Tags(GrantCriteriaKind.TematikAlan, "Thematic",
            canonical: v => areas.FirstOrDefault(a => Same(a.Label, v) || Same(a.Key, v)).Key,
            display: v => areas.FirstOrDefault(a => a.Key == v).Label ?? v,
            allowed: areas.Select(a => a.Label).ToList());
    }

    private Field Currency()
    {
        var header = H("Currency");
        return new(header, Guide("Currency"), d => d.Currency, (d, t) => t.Currency = d.Currency,
            (row, t) =>
            {
                var text = row.Text(header).ToUpperInvariant();
                t.Currency = text.Length > 0 ? text : null;
            },
            Options: GrantCurrencies.All);
    }

    private Field Repayment()
    {
        var header = H("Repayment");
        List<(GrantRepaymentType Value, string Label)> options =
        [
            (GrantRepaymentType.GeriOdemesiz, _l["Grants:Parameters:RepaymentNone"].Value),
            (GrantRepaymentType.GeriOdemeli, _l["Grants:Parameters:RepaymentYes"].Value),
        ];
        return new(header, Guide("Pick"), d => options.First(o => o.Value == d.RepaymentType).Label,
            (d, t) => t.RepaymentType = d.RepaymentType,
            (row, t) =>
            {
                var text = row.Text(header);
                t.RepaymentType = text.Length > 0 && TryPick(row, header, text, options, o => [o.Label, o.Value.ToString()], out var match)
                    ? match.Value
                    : GrantRepaymentType.GeriOdemesiz;
            },
            Options: options.Select(o => o.Label).ToList());
    }

    private Field StageTemplate()
    {
        var header = H("StageTemplate");
        return new(header, Guide("Pick"), d => d.StageTemplateName, (d, t) => t.StageTemplateId = d.StageTemplateId,
            (row, t) =>
            {
                var text = row.Text(header);
                t.StageTemplateId = text.Length > 0 && TryPick(row, header, text, _stages, s => [s.Name], out var match)
                    ? match.Id
                    : null;
            },
            Options: _stages.Select(s => s.Name).ToList());
    }

    private Field Score()
    {
        var header = H("MinMatchScore");
        return new(header, Guide("Score"), d => d.MinMatchScore, (d, t) => t.MinMatchScore = d.MinMatchScore,
            (row, t) => t.MinMatchScore = (double)(ReadNumber(row, header) ?? 0m));
    }

    /// <summary>Hücre biçimi: <c>Personel:40; Seyahat</c> (iki noktadan sonrası yüzde üst limit, isteğe bağlı).</summary>
    private Field CostItems()
    {
        var header = H("CostItems");
        var kinds = Enum.GetValues<GrantCostItemKind>()
            .Select(k => (Kind: k, Label: _l[$"Grants:CostItem:{k}"].Value))
            .ToList();

        return new(header, Guide("CostItems"),
            d => JoinEntries(d.EligibleCostItems.Select(i =>
            {
                var label = kinds.First(k => k.Kind == i.Kind).Label;
                return i.LimitPercent is { } limit ? $"{label}:{limit}" : label;
            })),
            (d, t) => t.EligibleCostItems.AddRange(d.EligibleCostItems),
            (row, t) =>
            {
                foreach (var entry in Entries(row.Text(header)).Select(Unescape))
                {
                    var colon = entry.LastIndexOf(':');
                    var name = (colon >= 0 ? entry[..colon] : entry).Trim();
                    int? limit = null;
                    if (colon >= 0)
                    {
                        if (!int.TryParse(entry[(colon + 1)..].Trim().Trim('%'), out var percent) || percent is < 0 or > 100)
                        {
                            row.Errors.Add(_l["Import:Error:Percent", header]);
                            continue;
                        }

                        limit = percent;
                    }

                    if (!TryPick(row, header, name, kinds, k => [k.Label, k.Kind.ToString()], out var match))
                    {
                        continue;
                    }

                    if (t.EligibleCostItems.Any(i => i.Kind == match.Kind))
                    {
                        row.Errors.Add(_l["Import:Error:Duplicate", header, name]);
                        continue;
                    }

                    t.EligibleCostItems.Add(new GrantEligibleCostItemDto { Kind = match.Kind, LimitPercent = limit });
                }
            },
            Allowed: kinds.Select(k => k.Label).ToList());
    }

    /// <summary>Hücre biçimi: <c>Belge adı | Zorunlu | Firma | e-imza, kaşe; Sonraki belge</c>.</summary>
    private Field Documents()
    {
        var header = H("Documents");
        var obligations = Enum.GetValues<GrantDocumentObligation>()
            .Select(o => (Value: o, Label: _l[$"Grants:Obligation:{o}"].Value)).ToList();
        var parties = Enum.GetValues<GrantPartyRole>()
            .Select(p => (Value: p, Label: _l[$"Grants:Party:{p}"].Value)).ToList();
        var eSignature = _l["Grants:Parameters:Documents:ESignature"].Value;
        var wetSignature = _l["Grants:Parameters:Documents:WetSignature"].Value;
        var stamp = _l["Grants:Parameters:Documents:Stamp"].Value;

        string Describe(GrantDocumentRequirementDto doc)
        {
            var flags = new List<string>();
            if (doc.RequiresESignature) flags.Add(eSignature);
            if (doc.RequiresWetSignature) flags.Add(wetSignature);
            if (doc.RequiresStamp) flags.Add(stamp);
            return string.Join(" | ", new[]
            {
                Escape(doc.Name),
                obligations.First(o => o.Value == doc.Obligation).Label,
                parties.First(p => p.Value == doc.UploaderParty).Label,
                string.Join(", ", flags)
            }).TrimEnd(' ', '|');
        }

        return new(header, Guide("Documents"),
            d => d.DocumentRequirements.Count == 0 ? null : string.Join("; ", d.DocumentRequirements.Select(Describe)),
            (d, t) => t.DocumentRequirements.AddRange(d.DocumentRequirements),
            (row, t) =>
            {
                foreach (var entry in Entries(row.Text(header)))
                {
                    var parts = SplitCell(entry, '|').Select(Unescape).ToList();
                    if (parts[0].Length == 0)
                    {
                        row.Errors.Add(_l["Import:Error:Required", header]);
                        continue;
                    }

                    if (parts[0].Length > MaxDocumentNameLength)
                    {
                        row.Errors.Add(_l["Import:Error:TooLong", header, MaxDocumentNameLength]);
                        continue;
                    }

                    var doc = new GrantDocumentRequirementDto { Order = t.DocumentRequirements.Count, Name = parts[0] };
                    if (parts.Count > 1 && parts[1].Length > 0
                        && TryPick(row, header, parts[1], obligations, o => [o.Label, o.Value.ToString()], out var obligation))
                    {
                        doc.Obligation = obligation.Value;
                    }

                    if (parts.Count > 2 && parts[2].Length > 0
                        && TryPick(row, header, parts[2], parties, p => [p.Label, p.Value.ToString()], out var party))
                    {
                        doc.UploaderParty = party.Value;
                    }

                    foreach (var flag in parts.Skip(3).SelectMany(p => p.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)))
                    {
                        if (Same(flag, eSignature)) doc.RequiresESignature = true;
                        else if (Same(flag, wetSignature)) doc.RequiresWetSignature = true;
                        else if (Same(flag, stamp)) doc.RequiresStamp = true;
                        else row.Errors.Add(_l["Import:Error:NotFound", header, flag]);
                    }

                    t.DocumentRequirements.Add(doc);
                }
            });
    }

    // ── Hücre okuma ──

    private int? ReadWhole(ImportRow row, string header)
    {
        var value = ReadNumber(row, header);
        if (value == null)
        {
            return null;
        }

        if (value != Math.Truncate(value.Value) || value > int.MaxValue || value < int.MinValue)
        {
            row.Errors.Add(_l["Import:Error:Whole", header]);
            return null;
        }

        return (int)value.Value;
    }

    private decimal? ReadNumber(ImportRow row, string header)
    {
        if (row.Text(header).Length == 0)
        {
            return null;
        }

        var value = ExcelImport.Decimal(row.Value(header));
        if (value == null)
        {
            row.Errors.Add(_l["Import:Error:Number", header]);
        }

        return value;
    }

    private bool TryPick<T>(ImportRow row, string header, string text, IEnumerable<T> options,
        Func<T, IEnumerable<string>> names, out T match)
    {
        var found = options.Where(o => names(o).Any(n => Same(n, text))).ToList();
        match = found.Count == 1 ? found[0] : default!;
        if (found.Count != 1)
        {
            row.Errors.Add(_l[found.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", header, text]);
        }

        return found.Count == 1;
    }

    // ── Çok değerli hücre ──

    private static string? JoinEntries(IEnumerable<string> values)
    {
        var text = string.Join("; ", values.Select(Escape));
        return text.Length > 0 ? text : null;
    }

    private static List<string> Entries(string text) => SplitCell(text, ';').Where(e => e.Length > 0).ToList();

    private static string Escape(string value)
        => value.Replace("\\", "\\\\").Replace(";", "\\;").Replace("|", "\\|");

    private static bool IsEscapable(char ch) => ch is '\\' or ';' or '|';

    /// <summary>Ayraçtan böler; kaçışlı karakterler parçada kaçışlı kalır (iç içe bölme için). Satır sonu da liste ayracıdır.</summary>
    private static List<string> SplitCell(string text, char separator)
    {
        var parts = new List<string>();
        var current = new StringBuilder();
        for (var i = 0; i < text.Length; i++)
        {
            var ch = text[i];
            if (ch == '\\' && i + 1 < text.Length && IsEscapable(text[i + 1]))
            {
                current.Append(ch).Append(text[++i]);
            }
            else if (ch == separator || (separator == ';' && ch is '\r' or '\n'))
            {
                parts.Add(current.ToString().Trim());
                current.Clear();
            }
            else
            {
                current.Append(ch);
            }
        }

        parts.Add(current.ToString().Trim());
        return parts;
    }

    private static string Unescape(string value)
    {
        var result = new StringBuilder(value.Length);
        for (var i = 0; i < value.Length; i++)
        {
            if (value[i] == '\\' && i + 1 < value.Length && IsEscapable(value[i + 1]))
            {
                i++;
            }

            result.Append(value[i]);
        }

        return result.ToString();
    }
}
