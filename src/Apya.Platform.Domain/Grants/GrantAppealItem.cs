using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6b · Red kararındaki tek bir gerekçe maddesi ve danışmanın ona karşı görüşü.
///
/// <para>Kurum metni ALINTIDIR, değiştirilmez; danışman görüşü ayrı alanda durur.
/// İkisini tek metne birleştirseydik "kurum ne dedi, biz ne dedik" ayrımı kaybolurdu.</para>
///
/// <para>Görüş kısa hüküm (<see cref="OpinionSummary"/> — "Haklı." / "Usul hatası.")
/// ve gerekçe (<see cref="OpinionDetail"/>) olarak ikiye ayrılır; ekranda ilki
/// vurgulu, ikincisi altında okunur.</para>
/// </summary>
public class GrantAppealItem : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid DecisionId { get; private set; }
    public int Order { get; set; }

    /// <summary>Maddenin başlığı — karar yazısındaki gerekçe cümlesi.</summary>
    public string Title { get; private set; } = null!;

    /// <summary>Kurumun kendi metni (alıntı kutusunda gösterilir).</summary>
    public string? InstitutionText { get; private set; }

    public string? OpinionSummary { get; private set; }
    public string? OpinionDetail { get; private set; }
    public GrantAppealStance Stance { get; private set; }

    /// <summary>Görüşü yazan danışmanın adı — kopya, kiracı host kullanıcısını sorgulayamaz.</summary>
    public string? OpinionByName { get; private set; }

    protected GrantAppealItem() { }

    public GrantAppealItem(
        Guid id,
        Guid? tenantId,
        Guid decisionId,
        int order,
        string title,
        string? institutionText) : base(id)
    {
        TenantId = tenantId;
        DecisionId = decisionId;
        Order = order;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 256).Trim();
        InstitutionText = institutionText;
        Stance = GrantAppealStance.Belirsiz;
    }

    public void SetTitle(string title, string? institutionText)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 256).Trim();
        InstitutionText = institutionText;
    }

    /// <summary>Danışman görüşü. Tutum belirlenmeden madde itiraz dosyasına giremez.</summary>
    public void SetOpinion(GrantAppealStance stance, string? summary, string? detail, string? byName)
    {
        Stance = stance;
        OpinionSummary = summary;
        OpinionDetail = detail;
        OpinionByName = byName;
    }
}
