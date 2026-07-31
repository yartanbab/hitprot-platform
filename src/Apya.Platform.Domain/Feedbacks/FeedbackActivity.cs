using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirim zaman çizelgesinin bir satırı. Append-only: FeedbackManager ilgili
/// işlemde yazar, güncellenmez/silinmez. CreatorId + CreationTime audit'ten gelir.
/// </summary>
public class FeedbackActivity : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid FeedbackId { get; set; }

    public FeedbackActivityType Type { get; set; }

    /// <summary>Değişim öncesi değer (durum/öncelik için enum sayısal değeri, atama için ad).</summary>
    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    /// <summary>Serbest açıklama — ör. yorum özeti.</summary>
    public string? Note { get; set; }

    /// <summary>İşlemi yapanın adı — kullanıcı silinse de çizelge okunur kalsın.</summary>
    public string? ActorName { get; set; }

    /// <summary>true → yalnızca yönetici panelinde görünür (iç not olayları).</summary>
    public bool IsInternal { get; set; }

    protected FeedbackActivity() { }

    public FeedbackActivity(
        Guid id,
        Guid? tenantId,
        Guid feedbackId,
        FeedbackActivityType type,
        string? oldValue = null,
        string? newValue = null,
        string? note = null,
        string? actorName = null,
        bool isInternal = false)
        : base(id)
    {
        TenantId   = tenantId;
        FeedbackId = feedbackId;
        Type       = type;
        OldValue   = oldValue;
        NewValue   = newValue;
        Note       = note;
        ActorName  = actorName;
        IsInternal = isInternal;
    }
}
