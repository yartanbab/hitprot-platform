using System;
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

    /// <summary>Kullanıcının kendi önem değerlendirmesi (opsiyonel).</summary>
    public FeedbackPriority? Severity { get; set; }

    /// <summary>
    /// Türe özel alanlar JSON nesnesi (hata: beklenen/gerçekleşen/adımlar/sıklık;
    /// öneri: problem/çözüm/fayda). İstemci paketler, sunucu şemasız saklar.
    /// </summary>
    [StringLength(FeedbackConsts.MaxDetailsJsonLength)]
    public string? DetailsJson { get; set; }

    /// <summary>Kimlik yönetici panelinde gizlenir (DB'de tutulur — kötüye kullanım kontrolü).</summary>
    public bool IsAnonymous { get; set; }

    /// <summary>Gerekirse kullanıcıyla iletişime geçilebilir mi?</summary>
    public bool AllowContact { get; set; }

    /* --- Aşağıdakiler istemci tarafından sessizce doldurulur; kullanıcı görmez --- */

    [StringLength(FeedbackConsts.MaxPageUrlLength)]
    public string? PageUrl { get; set; }

    [StringLength(FeedbackConsts.MaxPageTitleLength)]
    public string? PageTitle { get; set; }

    [StringLength(FeedbackConsts.MaxScreenSizeLength)]
    public string? ScreenResolution { get; set; }

    [StringLength(FeedbackConsts.MaxAppVersionLength)]
    public string? AppVersion { get; set; }

    /* --- Bağlamsal kodlar: _FeedbackLink / ApyaFeedback.open doldurur --- */

    [StringLength(FeedbackConsts.MaxModuleCodeLength)]
    public string? ModuleCode { get; set; }

    [StringLength(FeedbackConsts.MaxComponentCodeLength)]
    public string? ComponentCode { get; set; }

    [StringLength(FeedbackConsts.MaxActionCodeLength)]
    public string? ActionCode { get; set; }

    [StringLength(FeedbackConsts.MaxEntityTypeLength)]
    public string? RelatedEntityType { get; set; }

    public Guid? RelatedEntityId { get; set; }

    /// <summary>Gönderimden hemen önce oluşan istemci hatasının referansı (telemetri bağı).</summary>
    public Guid? LastClientErrorId { get; set; }

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

    /// <summary>Önceden yüklenmiş ek dosyalar (en fazla MaxAttachmentsPerFeedback).</summary>
    [MaxLength(FeedbackConsts.MaxAttachmentsPerFeedback)]
    public System.Collections.Generic.List<CreateFeedbackAttachmentDto>? Attachments { get; set; }
}
