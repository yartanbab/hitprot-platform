using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Bir geri bildirim üzerindeki not. İki amaca hizmet eder:
/// <list type="bullet">
///   <item><see cref="IsInternal"/> = true → yalnızca yöneticinin gördüğü iç not</item>
///   <item><see cref="IsInternal"/> = false → kullanıcıya görünen cevap (bildirim tetikler)</item>
/// </list>
/// </summary>
public class FeedbackComment : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid FeedbackId { get; set; }

    public string Text { get; set; } = string.Empty;

    /// <summary>true ise kullanıcıya hiçbir yerde gösterilmez.</summary>
    public bool IsInternal { get; set; }

    /// <summary>Yazanın adı — kullanıcı sonradan silinse de not okunabilir kalsın.</summary>
    public string? AuthorName { get; set; }

    protected FeedbackComment() { }

    public FeedbackComment(
        Guid id,
        Guid? tenantId,
        Guid feedbackId,
        string text,
        bool isInternal,
        string? authorName)
        : base(id)
    {
        TenantId   = tenantId;
        FeedbackId = feedbackId;
        Text       = text;
        IsInternal = isInternal;
        AuthorName = authorName;
    }
}
