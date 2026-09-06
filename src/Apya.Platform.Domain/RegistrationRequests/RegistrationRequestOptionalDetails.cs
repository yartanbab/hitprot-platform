namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebinin isteğe bağlı kurum/iletişim bloğu. Altı alanı tek parametreye
/// toplar; aksi halde <see cref="RegistrationRequestManager.CreateAsync"/> on yediyi
/// aşan bir parametre listesine çıkardı ve çağrı yerinde sıra hatası kaçınılmaz olurdu.
/// </summary>
public class RegistrationRequestOptionalDetails
{
    public string? TaxOffice { get; set; }
    public string? CorporateEmail { get; set; }
    public RegistrationRequestCompanySize? CompanySize { get; set; }
    public string? OperationalContactName { get; set; }
    public string? OperationalContactPhone { get; set; }
    public string? Message { get; set; }
}
