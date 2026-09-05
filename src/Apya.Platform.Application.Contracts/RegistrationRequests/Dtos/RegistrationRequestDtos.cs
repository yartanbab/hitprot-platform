using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tenants;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.RegistrationRequests.Dtos;

/// <summary>
/// Giriş ekranındaki kayıt talebi sihirbazının girdisi.
/// <para>
/// Hata metinleri BİLEREK açıkça yazıldı: DataAnnotations, <c>ErrorMessage</c> boş
/// bırakıldığında localizer'a hiç uğramaz ve İngilizce çerçeve metnini basar.
/// </para>
/// <para>
/// <c>IpAddress</c> / <c>UserAgent</c> Web sınırında SUNUCUDA doldurulur; formdan
/// gelen değer varsa ezilir.
/// </para>
/// </summary>
public class CreateRegistrationRequestDto
{
    // --- 1. adım: paket ---

    /// <summary>
    /// Değer tipi olduğu için ÖRTÜK [Required] taşır: seçim yapılmadan gönderilen
    /// form, "Paket seçimi zorunludur" yerine çerçevenin İngilizce metnini basardı.
    /// Bu yüzden nullable tanımlanıp kendi mesajımızla zorunlu kılındı.
    /// </summary>
    [Required(ErrorMessage = "Devam etmek için bir paket seçin.")]
    public SalesPlan? RequestedPlan { get; set; }

    // --- 2. adım: kurum ---

    [Required(ErrorMessage = "Kurumun resmî unvanı zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxCompanyNameLength, ErrorMessage = "Kurum unvanı en fazla {1} karakter olabilir.")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kurum türü zorunludur.")]
    public CompanyType? CompanyType { get; set; }

    [Required(ErrorMessage = "Vergi / kütük numarası zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxTaxNumberLength, ErrorMessage = "Vergi / kütük numarası en fazla {1} karakter olabilir.")]
    public string TaxNumber { get; set; } = string.Empty;

    [StringLength(RegistrationRequestConsts.MaxTaxOfficeLength, ErrorMessage = "Vergi dairesi en fazla {1} karakter olabilir.")]
    public string? TaxOffice { get; set; }

    [Required(ErrorMessage = "Tebligat adresi zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxAddressLength, ErrorMessage = "Tebligat adresi en fazla {1} karakter olabilir.")]
    public string Address { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Geçerli bir kurumsal e-posta adresi girin.")]
    [StringLength(RegistrationRequestConsts.MaxCorporateEmailLength, ErrorMessage = "Kurumsal e-posta en fazla {1} karakter olabilir.")]
    public string? CorporateEmail { get; set; }

    public RegistrationRequestCompanySize? CompanySize { get; set; }

    // --- 3. adım: yetkili ve iletişim ---

    [Required(ErrorMessage = "Ad soyad zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxFullNameLength, ErrorMessage = "Ad soyad en fazla {1} karakter olabilir.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Yetkilinin görevi zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxAuthorizedTitleLength, ErrorMessage = "Görev en fazla {1} karakter olabilir.")]
    public string AuthorizedTitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
    [StringLength(RegistrationRequestConsts.MaxEmailLength, ErrorMessage = "E-posta adresi en fazla {1} karakter olabilir.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon numarası zorunludur.")]
    [StringLength(RegistrationRequestConsts.MaxPhoneLength, ErrorMessage = "Telefon numarası en fazla {1} karakter olabilir.")]
    public string Phone { get; set; } = string.Empty;

    [StringLength(RegistrationRequestConsts.MaxOperationalContactNameLength, ErrorMessage = "Operasyonel iletişim kişisi en fazla {1} karakter olabilir.")]
    public string? OperationalContactName { get; set; }

    [StringLength(RegistrationRequestConsts.MaxOperationalContactPhoneLength, ErrorMessage = "Telefon numarası en fazla {1} karakter olabilir.")]
    public string? OperationalContactPhone { get; set; }

    [StringLength(RegistrationRequestConsts.MaxMessageLength, ErrorMessage = "Mesaj en fazla {1} karakter olabilir.")]
    public string? Message { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}

/// <summary>Panelde listelenen / görüntülenen kayıt talebi.</summary>
public class RegistrationRequestDto : EntityDto<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public string AuthorizedTitle { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;
    public CompanyType CompanyType { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
    public string? TaxOffice { get; set; }
    public string Address { get; set; } = string.Empty;
    public string? CorporateEmail { get; set; }
    public RegistrationRequestCompanySize? CompanySize { get; set; }

    public string? OperationalContactName { get; set; }
    public string? OperationalContactPhone { get; set; }

    public SalesPlan RequestedPlan { get; set; }
    public SalesPlan? ApprovedPlan { get; set; }
    public SalesPlan EffectivePlan { get; set; }
    public decimal? OfferedAmount { get; set; }

    public string? Message { get; set; }
    public RegistrationRequestStatus Status { get; set; }
    public string? AdminNote { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }
}

/// <summary>
/// Panel listesinin filtresi. Sıralama BİLEREK dışarı açılmadı: liste her zaman
/// en yeni talepten eskiye gider, paneldeki soru "kimi henüz değerlendirmedik".
/// </summary>
public class RegistrationRequestListFilterDto : PagedResultRequestDto
{
    /// <summary>Null = tüm durumlar.</summary>
    public RegistrationRequestStatus? Status { get; set; }

    /// <summary>Ad, kurum unvanı, vergi no, e-posta ve telefonda geçen metin.</summary>
    public string? Filter { get; set; }
}

/// <summary>Takip durumu, ticari şartlar ve iç not güncellemesi.</summary>
public class UpdateRegistrationRequestDto
{
    public RegistrationRequestStatus Status { get; set; }

    /// <summary>Null bırakılırsa adayın seçtiği paket geçerli kalır.</summary>
    public SalesPlan? ApprovedPlan { get; set; }

    [Range(0, 99_999_999, ErrorMessage = "Bedel 0 ile {2} arasında olmalıdır.")]
    public decimal? OfferedAmount { get; set; }

    [StringLength(RegistrationRequestConsts.MaxAdminNoteLength, ErrorMessage = "Not en fazla {1} karakter olabilir.")]
    public string? AdminNote { get; set; }
}

/// <summary>Panel başlığındaki durum rozetleri için sayımlar.</summary>
public class RegistrationRequestSummaryDto
{
    public int NewCount { get; set; }
    public int InReviewCount { get; set; }
    public int ApprovedCount { get; set; }
    public int RejectedCount { get; set; }
    public int ClosedCount { get; set; }

    public int TotalCount => NewCount + InReviewCount + ApprovedCount + RejectedCount + ClosedCount;
}
