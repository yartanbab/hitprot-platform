using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 3b · Şablonun tek bir aşaması. Sıra <see cref="Order"/> ile tutulur (sürükle-bırak
/// bunu yeniden numaralar).
///
/// <para><b>Zorunlu evrak</b> ve <b>tamamlanma koşulu</b> bilinçli olarak SERBEST METİN:
/// tasarımdaki değerler ("7 evrak", "değişken", "ara raporlar", "Form %100",
/// "Kurum yanıtı girildi") tek bir yapıya oturmuyor ve şablon programlar arası
/// paylaşıldığı için programa özel <see cref="GrantDocumentRequirement"/> satırlarına
/// bağlanamaz. Otomatik tamamlanma (2c) gerekirse buraya enum EKLENİR, metin kalır.</para>
/// </summary>
public class GrantStageTemplateStep : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid StageTemplateId { get; private set; }

    /// <summary>0'dan başlar; şablon içinde benzersizdir.</summary>
    public int Order { get; set; }

    public string Name { get; private set; } = null!;

    /// <summary>Aşama adının altındaki kısa açıklama ("dış süreç · beklemede", "koşullu aşama").</summary>
    public string? Note { get; set; }

    public GrantPartyRole Owner { get; set; }

    /// <summary>
    /// 🔴 DOM-01: Bu adımın karşılık geldiği SABİT AŞAMA — başvurunun özeti.
    ///
    /// <para>Pano programa özel adımlarda kalır, ama huni, "bugün", Hibe Yolculuğum ve
    /// Başvurularım dört değerli <see cref="GrantApplicationStage"/> okur. Üç eksen
    /// senkronsuzdu: <c>MoveToStep</c> Stage'i yazmıyordu, karar kaydı da ilerletmiyordu;
    /// şablonlu başvuru panoda son adıma gelse bile firma "tamamlandı" göremiyordu.
    /// Adım taşıma artık Stage'i BU eşlemeden türetip yazıyor.</para>
    ///
    /// <para><c>null</c> = eşlenmedi; o adıma taşımak Stage'e DOKUNMAZ (eski davranış).
    /// Mevcut adımlar tohumlamada <see cref="GrantStageMapping"/> kuralıyla doldurulur.</para>
    /// </summary>
    public GrantApplicationStage? Stage { get; set; }

    public string? RequiredDocumentsNote { get; set; }

    public string? CompletionCondition { get; set; }

    /// <summary>Aşama açıldıktan kaç gün sonra hatırlatma gider. null = hatırlatma yok.</summary>
    public int? ReminderDays { get; set; }

    protected GrantStageTemplateStep() { }

    public GrantStageTemplateStep(Guid id, Guid stageTemplateId, int order, string name) : base(id)
    {
        StageTemplateId = stageTemplateId;
        Order = order;
        SetName(name);
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 96).Trim();
    }
}
