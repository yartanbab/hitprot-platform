using System.Linq;

namespace Apya.Platform.Grants;

/// <summary>
/// <see cref="GrantEligibilityRule.OrganizationType"/> kuralının gerekçe/uygunluk tablosundaki
/// (kurumdaki değer, programın istediği) çifti. Metin üretilmez: değerler <see cref="OrganizationType"/>
/// adlarıdır (virgülle), platforma kapalı program <see cref="Closed"/> taşır; istemci
/// <c>Grants:OrgType:*</c> anahtarlarıyla yerelleştirir.
/// </summary>
public static class OrganizationTypeRuleValues
{
    public const string Closed = "Closed";

    public static (string? FirmValue, string? GrantValue) Of(FirmSignals firm, Grant grant)
        => (firm.IsTypeKnown ? firm.Type.ToString() : null, GrantValueOf(grant));

    /// <summary>Programın istediği: tür adları (virgülle) ya da <see cref="Closed"/>. Şart yoksa boş.</summary>
    public static string GrantValueOf(Grant grant)
        => grant.ClosedToPlatformApplicants
            ? Closed
            : string.Join(",", OrganizationTypeExtensions.TypesIn(grant.EligibleApplicantTypes).Select(t => t.ToString()));
}
