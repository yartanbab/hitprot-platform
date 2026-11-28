using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Web.Import;
using Microsoft.Extensions.Localization;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>Hibe çağrısının kendi alanları; çağrı dosyasında programın sütunlarıyla aynı satırda durur.</summary>
internal sealed class GrantCallSheet : ParameterSheet<GrantCallDto, CreateUpdateGrantCallDto>
{
    private const int MaxPeriodLength = 32;
    private const int MaxReferenceLength = 64;
    private const int MaxUrlLength = 512;

    public GrantCallSheet(IStringLocalizer l)
        : base(l, "Import:GrantCall:")
    {
        Statuses =
        [
            (GrantCallStatus.Taslak, l["Grants:Calls:State:Draft"].Value),
            (GrantCallStatus.Planlandi, l["Grants:Calls:State:Planned"].Value),
            (GrantCallStatus.Acik, l["Grants:Calls:State:Live"].Value),
            (GrantCallStatus.Kapandi, l["Grants:Calls:State:Closed"].Value),
        ];

        Fields =
        [
            Text("Period", c => c.Period, (t, v) => t.Period = v ?? string.Empty, maxLength: MaxPeriodLength),
            Text("Reference", c => c.Reference, (t, v) => t.Reference = v, maxLength: MaxReferenceLength),
            Status(),
            Date("OpenDate", c => c.OpenDate, (t, v) => t.OpenDate = v),
            Date("Deadline", c => c.Deadline, (t, v) => t.Deadline = v),
            Amount("Budget", c => c.Budget, (t, v) => t.Budget = v),
            Text("SourceUrl", c => c.SourceUrl, (t, v) => t.SourceUrl = v, maxLength: MaxUrlLength),
            Choice("ClosureReason", "Grants:ClosureReason", c => c.ClosureReason, (t, v) => t.ClosureReason = v),
            Date("LastVerifiedAt", c => c.LastVerifiedAt, (t, v) => t.LastVerifiedAt = v),
            Choice("VerificationStatus", "Grants:Verification", c => c.VerificationStatus, (t, v) => t.VerificationStatus = v),
            // Duyuru görseli: yalnız adres taşınır, dosya indirilmez (karar 2026-11-28).
            Text("AnnouncementImageUrl", c => c.AnnouncementImageUrl, (t, v) => t.AnnouncementImageUrl = v, maxLength: MaxUrlLength),
            Text("ImageSourceUrl", c => c.ImageSourceUrl, (t, v) => t.ImageSourceUrl = v, maxLength: MaxUrlLength),
            Choice("ImageLicense", "Grants:ImageLicense", c => c.ImageLicense, (t, v) => t.ImageLicense = v),
            Choice("ImageStatus", "Grants:ImageStatus", c => c.ImageStatus, (t, v) => t.ImageStatus = v),
            Date("ImageLastCheckedAt", c => c.ImageLastCheckedAt, (t, v) => t.ImageLastCheckedAt = v),
        ];
    }

    public IReadOnlyList<(GrantCallStatus Value, string Name)> Statuses { get; }

    protected override Guid IdOf(GrantCallDto source) => source.Id;

    protected override string IdHint => Guide("CallId");

    protected override void Validate(ImportRow row, CreateUpdateGrantCallDto input)
    {
        Require(row, Fields[0].Header, input.Period);

        if (input.OpenDate.HasValue && input.Deadline < input.OpenDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", H("Deadline"), H("OpenDate")]);
        }

        if (input.Budget < 0)
        {
            row.Errors.Add(L["Import:Error:Negative", H("Budget")]);
        }

        // Domain de reddeder; kayıttan önce satırda gösterilir.
        if (input.ClosureReason != GrantCallClosureReason.Belirtilmemis && input.Status != GrantCallStatus.Kapandi)
        {
            row.Errors.Add(L["Import:Error:ClosureNeedsClosed", H("ClosureReason"), H("Status")]);
        }
    }

    /// <summary>Boş hücre Taslak: çağrı penceresinin varsayılanı.</summary>
    private Field Status()
    {
        var header = H("Status");
        return new(header, Guide("List"), c => Statuses.First(s => s.Value == c.Status).Name, (s, t) => t.Status = s.Status,
            (row, t) =>
            {
                var text = row.Text(header);
                t.Status = GrantCallStatus.Taslak;
                if (text.Length > 0 && TryPick(row, header, text, Statuses, s => [s.Name, s.Value.ToString()], out var match))
                {
                    t.Status = match.Value;
                }
            },
            Options: Statuses.Select(s => s.Name).ToList());
    }
}
