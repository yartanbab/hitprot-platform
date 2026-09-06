using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tenants;

namespace Apya.Platform.Agreements.Dtos;

/// <summary>
/// Davet bağlantısıyla açılan protokol sayfasının yükü. Adayın GÖRMESİ gereken her şey
/// burada; talebin iç notu, IP'si ve host'un değerlendirme alanları BİLEREK yok.
/// </summary>
public class ProtocolInviteDto
{
    public Guid RegistrationRequestId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string AuthorizedTitle { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public SalesPlan Plan { get; set; }

    public string PlanName { get; set; } = string.Empty;

    /// <summary>Yıllık bedel (TL, KDV hariç). Null = sözleşmede "ayrıca belirlenecek" yazar.</summary>
    public decimal? Amount { get; set; }

    /// <summary>Onay öncesi belge — onay bloğu boştur, hash yoktur.</summary>
    public string PreviewHtml { get; set; } = string.Empty;

    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Ortak Paket: ikinci kurumun hesabı bu akışta AÇILMAZ, host elle kurar. Sayfa bunu
    /// adaya söyler ki "diğer kurum niye yok" sorusu destek hattına düşmesin.
    /// </summary>
    public bool RequiresSecondTenant { get; set; }
}

/// <summary>
/// Protokol onayı + hesap açılışı. Aday kendi şifresini burada belirler: SMTP henüz
/// yapılandırılmadığı için "şifre belirleme bağlantısı" gönderilemiyor, jeton da zaten
/// tek kullanımlık bir kimlik doğrulama görevi görüyor.
/// </summary>
public class ApproveProtocolInput
{
    [Required(ErrorMessage = "Davet bağlantısı geçersiz.")]
    public string Token { get; set; } = string.Empty;

    [Range(typeof(bool), "true", "true", ErrorMessage = "Protokolü kabul etmeden devam edilemez.")]
    public bool AcceptAgreement { get; set; }

    [Range(typeof(bool), "true", "true", ErrorMessage = "KVKK taahhütlerini onaylamadan devam edilemez.")]
    public bool AcceptKvkk { get; set; }

    /// <summary>
    /// Kiracının yönetici şifresi. Alt sınır ABP'nin parola politikasıyla UYUMLU tutuldu;
    /// nihai denetim tohumlama sırasında Identity tarafından yapılır.
    /// </summary>
    [Required(ErrorMessage = "Şifre zorunludur.")]
    [StringLength(128, MinimumLength = 8, ErrorMessage = "Şifre en az {2}, en fazla {1} karakter olmalıdır.")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre tekrarı zorunludur.")]
    [Compare(nameof(Password), ErrorMessage = "Şifreler eşleşmiyor.")]
    public string PasswordConfirm { get; set; } = string.Empty;

    /// <summary>Web sınırında SUNUCUDA doldurulur; istemciden gelen değer ezilir.</summary>
    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}

/// <summary>Onay sonucu — sayfanın "hesabınız açıldı" ekranını kurması için yeter.</summary>
public class ProtocolApprovalResultDto
{
    public Guid AgreementId { get; set; }

    public string AgreementNumber { get; set; } = string.Empty;

    public string ContentHash { get; set; } = string.Empty;

    /// <summary>Kiracının giriş yaparken kullanacağı ad.</summary>
    public string TenantName { get; set; } = string.Empty;

    public string AdminEmail { get; set; } = string.Empty;
}

/// <summary>Kiracının kendi sözleşmesini gördüğü ekranın yükü.</summary>
public class MyAgreementDto
{
    public string Number { get; set; } = string.Empty;

    public string PlanName { get; set; } = string.Empty;

    public decimal? Amount { get; set; }

    public decimal SuccessFeePercent { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public ServiceAgreementStatus Status { get; set; }

    public string ApproverName { get; set; } = string.Empty;

    public string ApproverTitle { get; set; } = string.Empty;

    public DateTime ApprovedAt { get; set; }

    public string? ApprovedIp { get; set; }

    public string ContentHash { get; set; } = string.Empty;

    /// <summary>Onaylanan metnin birebir kopyası.</summary>
    public string RenderedHtml { get; set; } = string.Empty;

    /// <summary>
    /// Saklanan metin, saklanan özetle tutarlı mı? <c>false</c> ise belge kurcalanmıştır —
    /// ekran uyarı basar. Sessizce geçmek, delil değerini yitirmiş bir belgeyi geçerli
    /// göstermek olurdu.
    /// </summary>
    public bool HashVerified { get; set; }
}
