namespace Apya.Platform.Feedbacks;

public static class FeedbackConsts
{
    public const int MaxSubjectLength    = 200;
    public const int MaxBodyLength       = 4000;
    public const int MaxCommentLength    = 4000;

    // Otomatik yakalanan bağlam alanları
    public const int MaxPageUrlLength    = 512;
    public const int MaxPageTitleLength  = 256;
    public const int MaxUserAgentLength  = 512;
    public const int MaxScreenSizeLength = 32;
    public const int MaxAppVersionLength = 64;
    public const int MaxUserNameLength   = 256;
    public const int MaxFileNameLength   = 256;

    /// <summary>Davranış izi (breadcrumb) JSON'u. İstemci en fazla 25 olay gönderir.</summary>
    public const int MaxBreadcrumbLength = 8000;

    /// <summary>Yöneticinin serbest etiketleri, virgülle ayrık.</summary>
    public const int MaxTagsLength       = 512;

    public const int MinRating = 1;
    public const int MaxRating = 5;

    /// <summary>İnsan-okur takip numarası: "FB-2026-000123".</summary>
    public const int MaxFeedbackNumberLength = 16;

    // Bağlamsal kodlar — _FeedbackLink / ApyaFeedback.open ile gelir
    public const int MaxModuleCodeLength    = 64;
    public const int MaxComponentCodeLength = 128;
    public const int MaxActionCodeLength    = 128;
    public const int MaxEntityTypeLength    = 64;

    /// <summary>Türe özel alanlar (beklenen/gerçekleşen sonuç vb.) JSON nesnesi.</summary>
    public const int MaxDetailsJsonLength = 8000;

    // Zaman çizelgesi (FeedbackActivity)
    public const int MaxActivityValueLength = 256;
    public const int MaxActivityNoteLength  = 1024;

    // Ek dosyalar (FeedbackAttachment)
    public const int MaxContentTypeLength      = 128;
    public const int MaxAttachmentsPerFeedback = 5;

    /// <summary>Spam koruması: bir kullanıcının verilen pencerede açabileceği kayıt sayısı.</summary>
    public const int RateLimitWindowMinutes = 1;
    public const int RateLimitMaxPerWindow  = 3;
}
