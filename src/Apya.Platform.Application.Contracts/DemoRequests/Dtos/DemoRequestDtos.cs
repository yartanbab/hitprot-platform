using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.DemoRequests;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.DemoRequests.Dtos;

/// <summary>
/// Giriş ekranındaki demo talep formunun girdisi.
/// <para>
/// Hata metinleri BİLEREK açıkça yazıldı: DataAnnotations, <c>ErrorMessage</c> boş
/// bırakıldığında localizer'a hiç uğramaz ve İngilizce çerçeve metnini basar.
/// </para>
/// <para>
/// <c>IpAddress</c> / <c>UserAgent</c> Web sınırında SUNUCUDA doldurulur; formdan
/// gelen değer varsa ezilir.
/// </para>
/// </summary>
public class CreateDemoRequestDto
{
    [Required(ErrorMessage = "Ad soyad zorunludur.")]
    [StringLength(DemoRequestConsts.MaxFullNameLength, ErrorMessage = "Ad soyad en fazla {1} karakter olabilir.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Kurum / firma adı zorunludur.")]
    [StringLength(DemoRequestConsts.MaxCompanyNameLength, ErrorMessage = "Kurum adı en fazla {1} karakter olabilir.")]
    public string CompanyName { get; set; } = string.Empty;

    [Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi girin.")]
    [StringLength(DemoRequestConsts.MaxEmailLength, ErrorMessage = "E-posta adresi en fazla {1} karakter olabilir.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefon numarası zorunludur.")]
    [StringLength(DemoRequestConsts.MaxPhoneLength, ErrorMessage = "Telefon numarası en fazla {1} karakter olabilir.")]
    public string Phone { get; set; } = string.Empty;

    public DemoRequestOrganizationKind? OrganizationKind { get; set; }

    public DemoRequestCompanySize? CompanySize { get; set; }

    /// <summary>Seçilen modül anahtarları; tanınmayanlar kayıt sırasında elenir.</summary>
    public List<string> InterestedModules { get; set; } = new();

    [StringLength(DemoRequestConsts.MaxMessageLength, ErrorMessage = "Mesaj en fazla {1} karakter olabilir.")]
    public string? Message { get; set; }

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }
}

/// <summary>Panelde listelenen / görüntülenen demo talebi.</summary>
public class DemoRequestDto : EntityDto<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DemoRequestOrganizationKind? OrganizationKind { get; set; }
    public DemoRequestCompanySize? CompanySize { get; set; }
    public string? InterestedModules { get; set; }
    public string? Message { get; set; }
    public DemoRequestStatus Status { get; set; }
    public string? AdminNote { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreationTime { get; set; }
    public DateTime? LastModificationTime { get; set; }

    /// <summary>CSV olarak saklanan modül anahtarlarını liste hâlinde verir.</summary>
    public string[] InterestedModuleKeys => DemoRequestConsts.SplitModules(InterestedModules);
}

/// <summary>
/// Panel listesinin filtresi. Sıralama BİLEREK dışarı açılmadı: liste her zaman
/// en yeni talepten eskiye gider, paneldeki soru "kimi henüz aramadık".
/// </summary>
public class DemoRequestListFilterDto : PagedResultRequestDto
{
    /// <summary>Null = tüm durumlar.</summary>
    public DemoRequestStatus? Status { get; set; }

    /// <summary>Ad, kurum, e-posta ve telefonda geçen metin.</summary>
    public string? Filter { get; set; }
}

/// <summary>Takip durumu ve iç not güncellemesi.</summary>
public class UpdateDemoRequestDto
{
    public DemoRequestStatus Status { get; set; }

    [StringLength(DemoRequestConsts.MaxAdminNoteLength, ErrorMessage = "Not en fazla {1} karakter olabilir.")]
    public string? AdminNote { get; set; }
}

/// <summary>Panel başlığındaki durum rozetleri için sayımlar.</summary>
public class DemoRequestSummaryDto
{
    public int NewCount { get; set; }
    public int ContactedCount { get; set; }
    public int ClosedCount { get; set; }
    public int TotalCount => NewCount + ContactedCount + ClosedCount;
}
