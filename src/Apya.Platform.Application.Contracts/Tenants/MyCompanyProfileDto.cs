using System;
using Apya.Platform.RegistrationRequests;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kurumun kendi profili: kayıt talebinden taşınan kimlik ve iletişim bilgisi + hesabın
/// özeti. Profil alanları <see cref="TenantProfile"/>'dan eşlenir; özet alanları servis
/// ayrı kaynaklardan doldurur.
/// </summary>
public class MyCompanyProfileDto
{
    /// <summary>Hesap (kiracı) adı — girişte ve menüde görünen kısa ad.</summary>
    public string TenantName { get; set; } = string.Empty;

    public string LegalName { get; set; } = string.Empty;
    public CompanyType CompanyType { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
    public string TaxOffice { get; set; } = string.Empty;
    public RegistrationRequestCompanySize? EmployeeCount { get; set; }

    public string Address { get; set; } = string.Empty;
    public string CorporateEmail { get; set; } = string.Empty;

    public string LegalRepresentativeName { get; set; } = string.Empty;
    public string LegalRepresentativeTitle { get; set; } = string.Empty;
    public string LegalRepresentativeEmail { get; set; } = string.Empty;
    public string LegalRepresentativePhone { get; set; } = string.Empty;

    public string OperationalContactName { get; set; } = string.Empty;
    public string OperationalContactPhone { get; set; } = string.Empty;

    // --- Hesap özeti ---
    public string PackageName { get; set; } = string.Empty;

    /// <summary>Paketin geçerlilik bitişi. <c>null</c> = süresiz.</summary>
    public DateTime? SubscriptionEndDate { get; set; }

    /// <summary>Hizmet protokolü numarası. <c>null</c> = protokol akışından önce açılmış hesap.</summary>
    public string? AgreementNumber { get; set; }

    public DateTime? AgreementApprovedAt { get; set; }

    public int UserCount { get; set; }

    public DateTime MemberSince { get; set; }
}
