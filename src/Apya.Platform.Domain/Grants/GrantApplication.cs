using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Firma başvurusu. Faz C: ApprovedAmount + pipeline aşama ilerletme eklendi (host ilerletir,
/// bkz <see cref="AdvanceStage"/>). Tahsilat dilimleri (<see cref="GrantDisbursementTranche"/>)
/// ve milestone'lar (<see cref="GrantMilestone"/>) ayrı child entity'lerdir.
///
/// 2a · Başvuru sihirbazı: proje özeti alanları, adım imleci ve sıranın kimde olduğu
/// (<see cref="PendingParty"/>) burada tutulur. Bütçe satırları, alan kilitleri ve
/// yazışma ayrı entity'lerdedir.
/// </summary>
public class GrantApplication : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    /// <summary>Sihirbazın adım sayısı. 2a'da 4 adım var: firma · özet · bütçe · gönder.</summary>
    public const int StepCount = 4;

    public Guid? TenantId { get; set; }
    public Guid GrantCallId { get; private set; }
    public GrantApplicationStage Stage { get; private set; }

    /// <summary>
    /// 2c · Başvurunun panodaki yeri: çağrının aşama ŞABLONUNDAKİ adım.
    /// Programda şablon tanımlı değilse null kalır ve pano dört değerli
    /// <see cref="Stage"/> enum'una düşer.
    ///
    /// 🔴 <see cref="Stage"/> KALDIRILMADI: eski başvurular ve şablonsuz programlar
    /// onu kullanmayı sürdürür. Şablonlu başvuruda tek doğru kaynak bu alandır;
    /// enum o satırlarda yazılmaz, ekranlar adım adını gösterir.
    /// </summary>
    public Guid? CurrentStepId { get; private set; }

    /// <summary>
    /// 2c · Başvuruyu yürüten danışman. 1c'deki öneri ataması (GrantRecommendation)
    /// ÇAĞRI bazlıdır ve firma başvurmadan önce yapılır; başvuru açıldıktan sonra
    /// sorumluluk buraya taşınır — pano kart bazında atama yapabilsin.
    /// </summary>
    public Guid? AssignedUserId { get; private set; }

    public void AssignTo(Guid? userId) => AssignedUserId = userId;

    /// <summary>
    /// 2d · Danışmanlık sözleşmesindeki başarı primi (%). Tahmini danışmanlık geliri
    /// bu oranla hesaplanır; onaylı tutar yoksa talep edilen destek üzerinden.
    /// Kiracıya GÖSTERİLMEZ — ücretlendirme verisidir.
    /// </summary>
    public decimal? SuccessFeePercent { get; private set; }

    public void SetSuccessFee(decimal? percent)
    {
        if (percent is < 0 or > 100)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantSuccessFeeInvalid);
        }
        SuccessFeePercent = percent;
    }
    public DateTime AppliedDate { get; private set; }
    public decimal? ApprovedAmount { get; private set; }

    // --- 2a · Sihirbaz ---

    /// <summary>Kullanıcının en son bulunduğu adım (1..<see cref="StepCount"/>).</summary>
    public int CurrentStep { get; private set; }

    /// <summary>Sıra kimde — "Danışmana devret" bunu değiştirir, iki taraf da aynı rozeti görür.</summary>
    public GrantPartyRole PendingParty { get; private set; }

    public string? ProjectTitle { get; private set; }
    public string? ProjectSummary { get; private set; }
    public int? ProjectDurationMonths { get; private set; }

    /// <summary>Başvurunun kuruma gönderildiği an; doluysa sihirbaz kilitlenir.</summary>
    public DateTime? SubmittedAt { get; private set; }

    // --- 2b · Gönderim paketi ---
    // Paket TEK dosyadır ve yenisi üretildiğinde eskisinin yerini alır; sürüm
    // geçmişi evrakların kendisinde tutulur, paketin geçmişine gerek yok.
    public string? PackageStoredFileName { get; private set; }
    public DateTime? PackageCreatedAt { get; private set; }

    public ICollection<GrantApplicationBudgetLine> BudgetLines { get; set; }
        = new List<GrantApplicationBudgetLine>();

    protected GrantApplication() { }

    public GrantApplication(Guid id, Guid? tenantId, Guid grantCallId) : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        Stage = GrantApplicationStage.Basvuru;
        AppliedDate = DateTime.Now;
        CurrentStep = 1;
        PendingParty = GrantPartyRole.Firma;
    }

    /// <summary>
    /// 2c · Başvuruyu şablondaki bir adıma taşır (pano sürükle-bırak).
    /// Onaylanan tutar aşamadan bağımsızdır; <see cref="AdvanceStage"/> ile girilir.
    /// </summary>
    public void MoveToStep(Guid stepId) => CurrentStepId = stepId;

    /// <summary>Aşamayı ilerletir (host). <paramref name="approvedAmount"/> verilmezse mevcut değer korunur.</summary>
    public void AdvanceStage(GrantApplicationStage stage, decimal? approvedAmount = null)
    {
        Stage = stage;
        if (approvedAmount.HasValue)
        {
            ApprovedAmount = approvedAmount;
        }
    }

    public void SetStep(int step)
    {
        if (step < 1 || step > StepCount)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantWizardStepInvalid);
        }
        CurrentStep = step;
    }

    public void SetProjectSummary(string? title, string? summary, int? durationMonths)
    {
        if (durationMonths is < 1 or > 120)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantWizardDurationInvalid);
        }
        ProjectTitle = title;
        ProjectSummary = summary;
        ProjectDurationMonths = durationMonths;
    }

    /// <summary>Sırayı karşı tarafa devreder ("Danışmana devret" / "Firmaya geri ver").</summary>
    public void HandOverTo(GrantPartyRole party) => PendingParty = party;

    /// <summary>Üretilen gönderim paketini başvuruya bağlar.</summary>
    public void SetPackage(string storedFileName, DateTime now)
    {
        PackageStoredFileName = storedFileName;
        PackageCreatedAt = now;
    }

    /// <summary>Kuruma gönderim. İkinci kez gönderilemez.</summary>
    public void Submit(DateTime now)
    {
        if (SubmittedAt.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantApplicationAlreadySubmitted);
        }
        SubmittedAt = now;
        CurrentStep = StepCount;
    }
}
