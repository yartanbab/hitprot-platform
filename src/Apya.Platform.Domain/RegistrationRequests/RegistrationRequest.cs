using System;
using Apya.Platform.Tenants;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Giriş ekranından gelen kayıt talebi. Talebi gönderen henüz bir kiracıya ait
/// olmadığı için kayıt <b>host seviyesindedir</b>: <c>IMultiTenant</c> UYGULANMAZ,
/// böylece kiracı filtresi paneli sessizce boşaltmaz.
/// <para>
/// Oturumsuz bir uçtan doldurulur; IP ve tarayıcı bilgisi kötüye kullanımı
/// ayıklamak için SUNUCUDA yakalanır, istemciden alınmaz.
/// </para>
/// <para>
/// Alanlar protokolün 1. ve 3. maddesindeki yer tutucularla birebir eşleşir
/// (unvan, vergi/kütük no, tebligat adresi, yetkili kişi, seçilen paket): onay
/// adımında sözleşme metni bu kayıttan doldurulacak, hesap açılışında da aynı
/// veri <see cref="TenantProfile"/>'a taşınacaktır.
/// </para>
/// </summary>
public class RegistrationRequest : AuditedAggregateRoot<Guid>
{
    // --- Yetkili kişi (protokol Madde 9'daki "işlemi yapan yetkili") ---

    public string FullName { get; private set; }

    /// <summary>Yetkilinin kurumdaki görevi/unvanı (protokol: KURUM_YETKILI_GOREV).</summary>
    public string AuthorizedTitle { get; private set; }

    /// <summary>Yetkili e-postası. Hesap açılınca yönetici kullanıcı adı bu olur.</summary>
    public string Email { get; private set; }

    public string Phone { get; private set; }

    // --- Kurum (protokol Madde 1'deki KURUM sütunu) ---

    /// <summary>Kurumun resmî unvanı (protokol: KURUM_UNVANI).</summary>
    public string CompanyName { get; private set; }

    public CompanyType CompanyType { get; private set; }

    /// <summary>Vergi numarası veya dernek kütük numarası (protokol: KURUM_VERGI_KUTUK_NO).</summary>
    public string TaxNumber { get; private set; }

    public string? TaxOffice { get; private set; }

    /// <summary>Tebligat adresi (protokol: KURUM_ADRES).</summary>
    public string Address { get; private set; }

    public string? CorporateEmail { get; private set; }

    public RegistrationRequestCompanySize? CompanySize { get; private set; }

    // --- Operasyonel iletişim (isteğe bağlı; TenantProfile'da karşılığı var) ---

    public string? OperationalContactName { get; private set; }

    public string? OperationalContactPhone { get; private set; }

    // --- Paket ve teklif ---

    /// <summary>Adayın formda seçtiği satış paketi.</summary>
    public SalesPlan RequestedPlan { get; private set; }

    /// <summary>
    /// Onay anında kesinleşen paket. Adayın seçtiğinden FARKLI olabilir: görüşmede
    /// paket değişirse sözleşmeye bu yazılır, adayın ilk tercihi de kaybolmaz.
    /// </summary>
    public SalesPlan? ApprovedPlan { get; private set; }

    /// <summary>
    /// Yıllık lisans bedeli (TL, KDV hariç — protokol Madde 3/5). Onay anında host
    /// girer; pazarlığa açık olduğu için pakete sabitlenmedi.
    /// </summary>
    public decimal? OfferedAmount { get; private set; }

    public string? Message { get; private set; }

    public RegistrationRequestStatus Status { get; private set; }

    /// <summary>Ekibin iç notu — talebi gönderene GÖSTERİLMEZ (ret gerekçesi dahil).</summary>
    public string? AdminNote { get; private set; }

    public string? IpAddress { get; private set; }

    public string? UserAgent { get; private set; }

    protected RegistrationRequest()
    {
        FullName = string.Empty;
        AuthorizedTitle = string.Empty;
        Email = string.Empty;
        Phone = string.Empty;
        CompanyName = string.Empty;
        TaxNumber = string.Empty;
        Address = string.Empty;
    }

    /// <summary>
    /// Kurucu yalnız ZORUNLU alanları alır. İsteğe bağlı bloklar ayrı setter'larla
    /// verilir; hepsi buraya girseydi parametre listesi on beşi geçer ve çağrı
    /// yerinde sıra hatası kaçınılmaz olurdu.
    /// </summary>
    public RegistrationRequest(
        Guid id,
        string fullName,
        string authorizedTitle,
        string email,
        string phone,
        string companyName,
        CompanyType companyType,
        string taxNumber,
        string address,
        SalesPlan requestedPlan,
        string? ipAddress = null,
        string? userAgent = null)
        : base(id)
    {
        FullName = Check.NotNullOrWhiteSpace(fullName, nameof(fullName), RegistrationRequestConsts.MaxFullNameLength);
        AuthorizedTitle = Check.NotNullOrWhiteSpace(authorizedTitle, nameof(authorizedTitle), RegistrationRequestConsts.MaxAuthorizedTitleLength);
        Email = Check.NotNullOrWhiteSpace(email, nameof(email), RegistrationRequestConsts.MaxEmailLength);
        Phone = Check.NotNullOrWhiteSpace(phone, nameof(phone), RegistrationRequestConsts.MaxPhoneLength);
        CompanyName = Check.NotNullOrWhiteSpace(companyName, nameof(companyName), RegistrationRequestConsts.MaxCompanyNameLength);
        CompanyType = companyType;
        TaxNumber = Check.NotNullOrWhiteSpace(taxNumber, nameof(taxNumber), RegistrationRequestConsts.MaxTaxNumberLength);
        Address = Check.NotNullOrWhiteSpace(address, nameof(address), RegistrationRequestConsts.MaxAddressLength);
        RequestedPlan = requestedPlan;
        IpAddress = Truncate(ipAddress, RegistrationRequestConsts.MaxIpAddressLength);
        UserAgent = Truncate(userAgent, RegistrationRequestConsts.MaxUserAgentLength);
        Status = RegistrationRequestStatus.New;
    }

    /// <summary>Formun isteğe bağlı kurum/iletişim alanlarını doldurur.</summary>
    public void SetOptionalDetails(
        string? taxOffice,
        string? corporateEmail,
        RegistrationRequestCompanySize? companySize,
        string? operationalContactName,
        string? operationalContactPhone,
        string? message)
    {
        TaxOffice = Truncate(taxOffice, RegistrationRequestConsts.MaxTaxOfficeLength);
        CorporateEmail = Truncate(corporateEmail, RegistrationRequestConsts.MaxCorporateEmailLength);
        CompanySize = companySize;
        OperationalContactName = Truncate(operationalContactName, RegistrationRequestConsts.MaxOperationalContactNameLength);
        OperationalContactPhone = Truncate(operationalContactPhone, RegistrationRequestConsts.MaxOperationalContactPhoneLength);
        Message = Truncate(message, RegistrationRequestConsts.MaxMessageLength);
    }

    /// <summary>
    /// Takip durumunu değiştirir. Geçiş serbesttir: yanlış işaretleme geri alınabilmeli
    /// ve süreç ileri-geri gidebilir (onaylanan aday vazgeçebilir).
    /// </summary>
    public void SetStatus(RegistrationRequestStatus status)
    {
        Status = status;
    }

    /// <summary>
    /// Onay kararının ticari şartlarını yazar. Durumdan AYRI tutuldu: host paketi ve
    /// bedeli, kararı vermeden önce de not edebilmeli (görüşme sırasında).
    /// </summary>
    public void SetOffer(SalesPlan? approvedPlan, decimal? offeredAmount)
    {
        if (offeredAmount is < 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.RegistrationRequestOfferAmountInvalid);
        }

        ApprovedPlan = approvedPlan;
        OfferedAmount = offeredAmount;
    }

    public void SetAdminNote(string? note)
    {
        AdminNote = Truncate(note, RegistrationRequestConsts.MaxAdminNoteLength);
    }

    /// <summary>Sözleşmeye yazılacak paket: onayda değiştiyse o, değilse adayın seçtiği.</summary>
    public SalesPlan EffectivePlan => ApprovedPlan ?? RequestedPlan;

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
