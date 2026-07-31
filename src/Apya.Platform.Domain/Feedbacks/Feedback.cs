using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Kullanıcının uygulama içinden gönderdiği geri bildirim.
/// Kayıt kullanıcının tenant'ına yazılır; tüm tenant'ların havuzunu yalnızca host
/// yöneticisi görür (AppService tarafında IDataFilter&lt;IMultiTenant&gt; kapatılarak).
/// </summary>
public class Feedback : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>İnsan-okur takip numarası ("FB-2026-000123"). Sequence'tan üretilir, değişmez.</summary>
    public string FeedbackNumber { get; set; } = string.Empty;

    /* --- Kullanıcının girdiği --- */

    public FeedbackType Type { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;

    /// <summary>1-5 memnuniyet puanı. Kullanıcı boş bırakabilir.</summary>
    public int? Rating { get; set; }

    /// <summary>Kullanıcının kendi önem değerlendirmesi — yönetici Priority'sinden bağımsız.</summary>
    public FeedbackPriority? Severity { get; set; }

    /// <summary>
    /// Türe özel alanlar JSON nesnesi (hata: beklenen/gerçekleşen/adımlar; öneri:
    /// problem/çözüm/fayda). Sorgulanmaz, yalnızca formda ve panelde gösterilir.
    /// </summary>
    public string? DetailsJson { get; set; }

    /// <summary>Kimlik yönetici panelinde gizlenir; DB'de tutulur (kötüye kullanım kontrolü).</summary>
    public bool IsAnonymous { get; set; }

    /// <summary>Kullanıcı gerekirse kendisiyle iletişime geçilmesine izin verdi mi?</summary>
    public bool AllowContact { get; set; }

    /// <summary>Eklenen ekran görüntüsünün diskte saklanan dosya adı.</summary>
    public string? ScreenshotFileName { get; set; }

    /* --- Otomatik yakalanan bağlam: kullanıcı bunları yazmaz --- */

    public string? PageUrl { get; set; }
    public string? PageTitle { get; set; }
    public string? UserAgent { get; set; }
    public string? ScreenResolution { get; set; }
    public string? AppVersion { get; set; }

    /* --- Bağlamsal kodlar: _FeedbackLink / ApyaFeedback.open ile gelir --- */

    public string? ModuleCode { get; set; }
    public string? ComponentCode { get; set; }
    public string? ActionCode { get; set; }
    public string? RelatedEntityType { get; set; }
    public Guid? RelatedEntityId { get; set; }

    /// <summary>Gönderimden hemen önce oluşan istemci hatasının referansı (telemetri bağı).</summary>
    public Guid? LastClientErrorId { get; set; }

    /// <summary>Gönderenin adı — kullanıcı sonradan silinse de kayıt okunabilir kalsın.</summary>
    public string? SubmittedByUserName { get; set; }

    /// <summary>
    /// Gönderim anına kadarki davranış izi (JSON dizi). Sürekli toplanmaz;
    /// istemcideki tampondan yalnızca bu gönderimle birlikte bir kez iletilir.
    /// Form alanı DEĞERLERİ hiçbir koşulda burada yer almaz.
    /// </summary>
    public string? BreadcrumbJson { get; set; }

    /* --- Yönetim tarafı --- */

    public FeedbackStatus Status { get; set; }
    public FeedbackPriority Priority { get; set; }

    /// <summary>İş sürecine etki genişliği — Priority'den ayrı eksen.</summary>
    public FeedbackImpact? Impact { get; set; }

    /// <summary>Atanan yönetici/geliştirici.</summary>
    public Guid? AssignedUserId { get; set; }

    /// <summary>Atananın adı — listede join'siz gösterim (SubmittedByUserName deseni).</summary>
    public string? AssignedUserName { get; set; }

    /// <summary>Yöneticinin serbest etiketleri, virgülle ayrık.</summary>
    public string? AdminTags { get; set; }

    /// <summary>Completed veya Rejected'a geçildiği an.</summary>
    public DateTime? ResolvedAt { get; set; }

    /// <summary>Kullanıcıya görünen son cevabın zamanı — "cevaplandı mı?" filtresi için.</summary>
    public DateTime? LastRespondedAt { get; set; }

    public ICollection<FeedbackComment> Comments { get; set; }

    protected Feedback()
    {
        Comments = new List<FeedbackComment>();
    }

    public Feedback(
        Guid id,
        Guid? tenantId,
        FeedbackType type,
        string subject,
        string body,
        int? rating = null)
        : base(id)
    {
        TenantId = tenantId;
        Type     = type;
        Subject  = subject;
        Body     = body;
        Rating   = NormalizeRating(rating);
        Status   = FeedbackStatus.New;
        Priority = FeedbackPriority.Normal;
        Comments = new List<FeedbackComment>();
    }

    /// <summary>Gönderim anında istemciden gelen bağlamı yerleştirir.</summary>
    public void SetContext(
        string? pageUrl,
        string? pageTitle,
        string? userAgent,
        string? screenResolution,
        string? appVersion,
        string? submittedByUserName,
        string? breadcrumbJson)
    {
        PageUrl             = pageUrl;
        PageTitle           = pageTitle;
        UserAgent           = userAgent;
        ScreenResolution    = screenResolution;
        AppVersion          = appVersion;
        SubmittedByUserName = submittedByUserName;
        BreadcrumbJson      = breadcrumbJson;
    }

    public void AttachScreenshot(string fileName)
    {
        ScreenshotFileName = fileName;
    }

    /// <summary>
    /// Durumu değiştirir ve çözüm zamanını tutarlı tutar. Geçişin geçerli olup
    /// olmadığı FeedbackManager'da kontrol edilir.
    /// </summary>
    public void ChangeStatus(FeedbackStatus newStatus, DateTime now)
    {
        Status = newStatus;

        // Açık olmayan her durum bir kapanıştır (Completed/Released/Rejected/Duplicate/...).
        ResolvedAt = newStatus.IsOpen() ? null : now;
    }

    public void MarkResponded(DateTime now)
    {
        LastRespondedAt = now;
    }

    /// <summary>Atamayı değiştirir; null ile atama kaldırılır.</summary>
    public void Assign(Guid? userId, string? userName)
    {
        AssignedUserId = userId;
        AssignedUserName = userId is null ? null : userName;
    }

    private static int? NormalizeRating(int? rating)
    {
        if (rating is null)
        {
            return null;
        }

        // Savunma amaçlı kırpma; asıl doğrulama DTO'daki [Range] ile yapılır.
        if (rating < FeedbackConsts.MinRating || rating > FeedbackConsts.MaxRating)
        {
            return null;
        }

        return rating;
    }
}
