using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// 2a girdileri. DataAnnotations yerelleştirilmediği için hata metinleri
/// ELLE Türkçe yazılır (repo kararı, bkz. PR #261).
/// </summary>
public class SaveWizardBudgetLineInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    public GrantCostItemKind Kind { get; set; }

    [Range(0, 999_999_999_999, ErrorMessage = "Tutar negatif olamaz.")]
    public decimal Amount { get; set; }

    [StringLength(512, ErrorMessage = "Gerekçe en fazla 512 karakter olabilir.")]
    public string? Justification { get; set; }
}

public class SaveWizardSummaryInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [StringLength(200, ErrorMessage = "Proje adı en fazla 200 karakter olabilir.")]
    public string? ProjectTitle { get; set; }

    [StringLength(2000, ErrorMessage = "Proje özeti en fazla 2000 karakter olabilir.")]
    public string? ProjectSummary { get; set; }

    [Range(1, 120, ErrorMessage = "Proje süresi 1 ile 120 ay arasında olmalıdır.")]
    public int? ProjectDurationMonths { get; set; }
}

public class GrantFieldLockInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Alan anahtarı zorunludur.")]
    [StringLength(64, ErrorMessage = "Alan anahtarı en fazla 64 karakter olabilir.")]
    public string FieldKey { get; set; } = null!;
}

public class SendWizardMessageInput
{
    [Required(ErrorMessage = "Başvuru zorunludur.")]
    public Guid ApplicationId { get; set; }

    [Required(ErrorMessage = "Mesaj boş olamaz.")]
    [StringLength(1000, ErrorMessage = "Mesaj en fazla 1000 karakter olabilir.")]
    public string Body { get; set; } = null!;
}

/// <summary>Kilit isteğinin sonucu — alan alındıysa <see cref="Acquired"/> true döner.</summary>
public class GrantFieldLockResultDto
{
    public bool Acquired { get; set; }
    public GrantFieldLockDto? Lock { get; set; }
}
