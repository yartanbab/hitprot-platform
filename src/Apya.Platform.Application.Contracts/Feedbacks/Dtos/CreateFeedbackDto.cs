using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Feedbacks.Dtos;

public class CreateFeedbackDto
{
    [Required]
    public FeedbackType Type { get; set; }

    [Required]
    [StringLength(FeedbackConsts.MaxSubjectLength)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [StringLength(FeedbackConsts.MaxBodyLength)]
    public string Body { get; set; } = string.Empty;

    [Range(FeedbackConsts.MinRating, FeedbackConsts.MaxRating)]
    public int? Rating { get; set; }

    /* --- Aşağıdakiler istemci tarafından sessizce doldurulur; kullanıcı görmez --- */

    [StringLength(FeedbackConsts.MaxPageUrlLength)]
    public string? PageUrl { get; set; }

    [StringLength(FeedbackConsts.MaxPageTitleLength)]
    public string? PageTitle { get; set; }

    [StringLength(FeedbackConsts.MaxScreenSizeLength)]
    public string? ScreenResolution { get; set; }

    [StringLength(FeedbackConsts.MaxAppVersionLength)]
    public string? AppVersion { get; set; }

    /// <summary>
    /// Davranış izi JSON dizisi. İstemci form alanı DEĞERLERİNİ buraya koymaz —
    /// yalnızca sayfa geçişi, tıklanan öğe etiketi, istek durum kodu ve hata olayları.
    /// </summary>
    [StringLength(FeedbackConsts.MaxBreadcrumbLength)]
    public string? BreadcrumbJson { get; set; }

    /// <summary>İstemciden (navigator.userAgent) gelir — yalnızca teşhis amaçlı, güvenlik kararı vermez.</summary>
    [StringLength(FeedbackConsts.MaxUserAgentLength)]
    public string? UserAgent { get; set; }

    /// <summary>Yüklenen ekran görüntüsünün saklanan dosya adı; Web katmanı doldurur.</summary>
    [StringLength(FeedbackConsts.MaxFileNameLength)]
    public string? ScreenshotFileName { get; set; }
}
