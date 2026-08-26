using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Projects.Dtos;

public class CreateProjectDto
{
    [Required]
    [MaxLength(128)]
    public string Name { get; set; } = string.Empty;

    // Uzunluk DB ile hizalı: PlatformDbContext'te Code kolonu HasMaxLength(32).
    // 64 kalırsa 33+ karakterlik kod doğrulamadan geçip INSERT'te patlıyordu.
    [Required]
    [MaxLength(32)]
    public string Code { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? Purpose { get; set; }
    public string? TargetAudience { get; set; }
    public string? Activities { get; set; }

    public Guid? TenantId { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public Guid? GrantId { get; set; }

    /// <summary>APYA-132 — opsiyonel cari bağlantısı</summary>
    public Guid? CustomerId { get; set; }

    /// <summary>Seçilen kategori tanımının Id.si. Boş bırakılırsa "Diğer / Genel".</summary>
    public Guid? CategoryId { get; set; }

    public decimal TotalBudget { get; set; }
    public decimal HourlyRate { get; set; }
    public string Currency { get; set; } = "TRY";

    /// <summary>
    /// Kategoriye bağlı hazır görev takvimi projeyle birlikte kurulsun mu?
    /// Yalnız OLUŞTURMADA dikkate alınır — güncellemede yok sayılır, yoksa her
    /// kayıtta görevler yeniden eklenirdi. Takvimi olmayan kategoride (Diğer)
    /// etkisizdir. Bkz. <see cref="ProjectTaskTemplate"/>.
    /// </summary>
    public bool AddTemplateTasks { get; set; }
}
