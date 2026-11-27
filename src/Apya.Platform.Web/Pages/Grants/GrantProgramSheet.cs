using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Web.Import;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Hibe programının tek satırlık Excel karşılığı: parametre formundaki her alan bir sütundur.
/// Afiş dosya olduğu için sayfada yoktur.
/// </summary>
internal sealed class GrantProgramSheet : ParameterSheet<GrantParameterDto, UpdateGrantParameterDto>
{
    private const int MaxDocumentNameLength = 128;

    private readonly IReadOnlyList<(Guid Id, string Name)> _stages;

    private readonly string? _idHint;

    /// <param name="inCallFile">Çağrı dosyasında: kimlik sütunu "Program kimliği" olur, çağrınınkiyle karışmaz.</param>
    public GrantProgramSheet(IStringLocalizer l, IReadOnlyList<(Guid Id, string Name)> stages, bool inCallFile = false)
        : base(l, "Import:GrantProgram:")
    {
        _stages = stages;
        if (inCallFile)
        {
            IdHeader = l["Import:GrantCall:ProgramId"].Value;
            _idHint = l["Import:Guide:CallProgramId"].Value;
        }

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

    protected override Guid IdOf(GrantParameterDto source) => source.Id;

    protected override string IdHint => _idHint ?? base.IdHint;

    /// <summary>Yazma modelinin kuralları ve Türkçe iletileri DTO'da.</summary>
    protected override void Validate(ImportRow row, UpdateGrantParameterDto input)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(input, new ValidationContext(input), results, validateAllProperties: true);
        row.Errors.AddRange(results.Select(r => r.ErrorMessage ?? string.Empty).Where(m => m.Length > 0));
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
            d => JoinEntries(d.CriteriaTags.Where(x => x.Kind == kind)
                .Select(x => display?.Invoke(x.Value) ?? x.Value)
                .OrderBy(v => v, StringComparer.Ordinal)),
            (d, t) => t.CriteriaTags.AddRange(d.CriteriaTags.Where(x => x.Kind == kind)),
            (row, t) =>
            {
                var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var entry in Entries(row.Text(header)).Select(Unescape))
                {
                    var value = canonical == null ? entry : canonical(entry);
                    if (value == null)
                    {
                        row.Errors.Add(L["Import:Error:NotFound", header, entry]);
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
            .Select(a => (Key: a.ToString(), Label: L[$"Grants:Thematic:{a}"].Value))
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
            (GrantRepaymentType.GeriOdemesiz, L["Grants:Parameters:RepaymentNone"].Value),
            (GrantRepaymentType.GeriOdemeli, L["Grants:Parameters:RepaymentYes"].Value),
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
            .Select(k => (Kind: k, Label: L[$"Grants:CostItem:{k}"].Value))
            .ToList();

        return new(header, Guide("CostItems"),
            d => JoinEntries(d.EligibleCostItems.OrderBy(i => i.Kind).Select(i =>
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
                            row.Errors.Add(L["Import:Error:Percent", header]);
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
                        row.Errors.Add(L["Import:Error:Duplicate", header, name]);
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
            .Select(o => (Value: o, Label: L[$"Grants:Obligation:{o}"].Value)).ToList();
        var parties = Enum.GetValues<GrantPartyRole>()
            .Select(p => (Value: p, Label: L[$"Grants:Party:{p}"].Value)).ToList();
        var eSignature = L["Grants:Parameters:Documents:ESignature"].Value;
        var wetSignature = L["Grants:Parameters:Documents:WetSignature"].Value;
        var stamp = L["Grants:Parameters:Documents:Stamp"].Value;

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
                        row.Errors.Add(L["Import:Error:Required", header]);
                        continue;
                    }

                    if (parts[0].Length > MaxDocumentNameLength)
                    {
                        row.Errors.Add(L["Import:Error:TooLong", header, MaxDocumentNameLength]);
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
                        else row.Errors.Add(L["Import:Error:NotFound", header, flag]);
                    }

                    t.DocumentRequirements.Add(doc);
                }
            });
    }
}
