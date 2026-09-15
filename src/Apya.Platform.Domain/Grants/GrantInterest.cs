using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracının bir çağrıya bıraktığı ilgi talebi — "İlgileniyorum".
///
/// <para>🔴 Başvurunun KENDİSİ DEĞİLDİR: kiracı artık <c>GrantApplication</c> açamaz,
/// talep bırakır. Host değerlendirip firmayla irtibat kurar; süreci başlatırsa
/// başvuru o an doğar ve <see cref="GrantApplicationId"/> ile buraya bağlanır.
/// Uygun bulmazsa gerekçe <see cref="HostFeedback"/>'e yazılır ve kiracıya aynen
/// gösterilir.</para>
///
/// <para>Kiracıya AİTTİR (<see cref="IMultiTenant"/>): talebi bırakan oturumlu bir
/// firmadır. Oturumsuz ziyaretçinin bıraktığı ön değerlendirme talebi ayrı bir
/// kayıttır (<see cref="GrantLead"/>) ve host kataloğunda yaşar.</para>
///
/// <para>Kapanmış talep yeniden AÇILMAZ: kiracı aynı çağrıya tekrar ilgi bildirirse
/// YENİ satır doğar. Eski gerekçe geçmişte durur — "neden reddedildik, sonra ne
/// değişti" sorusunun cevabı tek satıra ezdirilmez.</para>
/// </summary>
public class GrantInterest : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>
    /// 19a · null = Fikir Havuzu kaydı: firma (ya da adına danışman) çağrı seçmeden fikrini bıraktı.
    /// Havuz kaydı talep DEĞİLDİR — yanıt süresi işlemez, Talepler'e düşmez; çağrıyla
    /// ilişkilendirilince talep olur. Başvuru ve görüşme çağrı ister (<see cref="EnsureLinked"/>).
    /// </summary>
    public Guid? GrantCallId { get; private set; }

    /// <summary>19a · Kaydı kim girdi: firma kendisi mi, danışman firma adına mı.</summary>
    public GrantInterestSource Source { get; private set; }

    /// <summary>Talebi bırakan kullanıcı. Cevap bildirimi ona gider.</summary>
    public Guid? RequestedByUserId { get; private set; }

    /// <summary>
    /// Firmanın proje fikri — host'un ön değerlendirmesi buradan başlar. Kolon adı
    /// tarihsel olarak "not"; ekranda "Proje fikrinizi birkaç cümleyle anlatın" diye sorulur.
    /// </summary>
    public string? Note { get; private set; }

    /// <summary>Firmanın öngördüğü toplam proje bütçesi (₺). Zorunlu değil.</summary>
    public decimal? EstimatedBudget { get; private set; }

    /// <summary>Hedeflenen başlangıç — çeyreğin ilk günü olarak saklanır. Null = belli değil.</summary>
    public DateTime? TargetStartDate { get; private set; }

    /// <summary>
    /// Konsorsiyum ortağı durumu. Soru yalnız ortaklık şartı taşıyan çağrıda sorulur:
    /// null = sorulmadı · true = ortak arıyor · false = ortağı belli (<see cref="PartnerName"/>).
    /// </summary>
    public bool? NeedsPartner { get; private set; }

    public string? PartnerName { get; private set; }

    // --- Proje fikri formu · 2-9. sorular (tur 19) ---
    // 1. soru (proje fikri) Note'ta durur. Zorunluluk (2. soru) girişte DTO'da denetlenir;
    // boş bırakılan cevap null yazılır, boş dize değil — host ekranı "yanıtlanmamış" der.

    /// <summary>2 · Projenin çözüm ürettiği problem ya da ihtiyaç.</summary>
    public string? ProblemStatement { get; private set; }

    /// <summary>3 · Hedef kitle.</summary>
    public string? TargetAudience { get; private set; }

    /// <summary>4 · Planlanan faaliyetler.</summary>
    public string? PlannedActivities { get; private set; }

    /// <summary>5 · Tahmini süre ve iş birliği yapılmak istenen kurumlar.</summary>
    public string? DurationAndPartners { get; private set; }

    /// <summary>6 · En çok destek ya da yönlendirme beklenen konu.</summary>
    public string? SupportNeeds { get; private set; }

    /// <summary>7 · Daha önce yürütülen benzer ulusal/uluslararası projeler.</summary>
    public string? PriorExperience { get; private set; }

    /// <summary>8 · Ekip yapısı ve anahtar kişilerin yetkinlikleri.</summary>
    public string? TeamStructure { get; private set; }

    /// <summary>9 · Mevcut paydaşlar, dernekler, çözüm ortakları ve rolleri.</summary>
    public string? Stakeholders { get; private set; }

    /// <summary>Firmanın ilgisini geri çektiği an; yalnız <see cref="GrantInterestStatus.GeriCekildi"/> durumunda dolu.</summary>
    public DateTime? WithdrawnAt { get; private set; }

    public GrantInterestStatus Status { get; private set; }

    /// <summary>Host'un gerekçesi. Red kararında ZORUNLU; kiracıya birebir gösterilir.</summary>
    public string? HostFeedback { get; private set; }

    public Guid? ReviewedByUserId { get; private set; }

    public DateTime? ReviewedAt { get; private set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru. Kiracı sihirbaza buradan geçer.</summary>
    public Guid? GrantApplicationId { get; private set; }

    /// <summary>
    /// 18a · Danışmanın iç notu. 🔴 FİRMAYA GİTMEZ — firmaya giden metin yalnız
    /// <see cref="HostFeedback"/>'tir. Kiracı DTO'larına bu alan konmaz.
    /// </summary>
    public string? ConsultantNote { get; private set; }

    /// <summary>18a · Talebin sorumlu danışmanı (host kullanıcısı). null = kimseye atanmadı.</summary>
    public Guid? AssignedUserId { get; private set; }

    /// <summary>Karara bağlanmamış talep — host kutusunda bekleyen satır.</summary>
    public bool IsPending => Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor;

    /// <summary>19a · Çağrıya bağlanmamış fikir — havuzda bekler.</summary>
    public bool IsPoolIdea => GrantCallId == null;

    protected GrantInterest() { }

    public GrantInterest(
        Guid id,
        Guid? tenantId,
        Guid? grantCallId,
        Guid? requestedByUserId,
        string? note,
        decimal? estimatedBudget = null,
        DateTime? targetStartDate = null,
        bool? needsPartner = null,
        string? partnerName = null,
        GrantInterestSource source = GrantInterestSource.Tenant)
        : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        Source = source;
        RequestedByUserId = requestedByUserId;
        var trimmedNote = note?.Trim();
        Note = Check.Length(string.IsNullOrEmpty(trimmedNote) ? null : trimmedNote, nameof(note), maxLength: 1000);

        if (estimatedBudget < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(estimatedBudget), "Bütçe negatif olamaz.");
        }
        EstimatedBudget = estimatedBudget;
        TargetStartDate = targetStartDate?.Date;

        // Ortağı belli değilse ad tutulmaz: "ortak arıyor" diyen kayıtta eski bir ad kalmasın.
        NeedsPartner = needsPartner;
        var trimmedPartner = partnerName?.Trim();
        PartnerName = needsPartner == false && !string.IsNullOrEmpty(trimmedPartner)
            ? Check.Length(trimmedPartner, nameof(partnerName), maxLength: 200)
            : null;

        Status = GrantInterestStatus.Yeni;
    }

    /// <summary>
    /// Proje fikri formunun 2-9. soruları. Boşluktan ibaret cevap yazılmamış sayılır (null);
    /// her cevap <see cref="GrantInterestConsts.MaxAnswerLength"/> ile sınırlıdır.
    /// </summary>
    public void SetIdeaDetails(
        string? problemStatement,
        string? targetAudience,
        string? plannedActivities,
        string? durationAndPartners,
        string? supportNeeds,
        string? priorExperience,
        string? teamStructure,
        string? stakeholders)
    {
        ProblemStatement = CleanAnswer(problemStatement, nameof(problemStatement));
        TargetAudience = CleanAnswer(targetAudience, nameof(targetAudience));
        PlannedActivities = CleanAnswer(plannedActivities, nameof(plannedActivities));
        DurationAndPartners = CleanAnswer(durationAndPartners, nameof(durationAndPartners));
        SupportNeeds = CleanAnswer(supportNeeds, nameof(supportNeeds));
        PriorExperience = CleanAnswer(priorExperience, nameof(priorExperience));
        TeamStructure = CleanAnswer(teamStructure, nameof(teamStructure));
        Stakeholders = CleanAnswer(stakeholders, nameof(stakeholders));
    }

    private static string? CleanAnswer(string? value, string name)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrEmpty(trimmed)
            ? null
            : Check.Length(trimmed, name, maxLength: GrantInterestConsts.MaxAnswerLength);
    }

    /// <summary>
    /// Firma ilgisini geri çekti. Yalnız karara bağlanmamış talep çekilebilir —
    /// başvuruya dönmüş ya da gerekçesiyle kapanmış kayıt tarihçedir, değiştirilmez.
    /// </summary>
    public void Withdraw(DateTime now)
    {
        if (!IsPending)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotWithdrawable);
        }

        Status = GrantInterestStatus.GeriCekildi;
        WithdrawnAt = now;
    }

    /// <summary>Danışman kaydı üstlendi; firmayla irtibat başladı. Sorumlu yoksa üstlenen olur.</summary>
    public void StartReview(Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = GrantInterestStatus.Inceleniyor;
        ReviewedByUserId = userId;
        ReviewedAt = now;
        AssignedUserId ??= userId;
    }

    /// <summary>
    /// 18b · Karara bağlanmadan çağrı kapandı. Gerekçe otomatik ve firmaya gösterilir; kararı veren
    /// bir danışman olmadığı için inceleyen alanı değişmez.
    /// </summary>
    public void MarkMissed(string reason, DateTime now)
    {
        EnsurePending();
        Status = GrantInterestStatus.Kacirildi;
        HostFeedback = Check.Length(reason.Trim(), nameof(reason), maxLength: 1000);
        ReviewedAt = now;
    }

    /// <summary>18a · İç not; her durumda yazılabilir (kapanmış talebe sonradan not düşmek geçmişi bozmaz).</summary>
    public void SetConsultantNote(string? note)
    {
        var trimmed = note?.Trim();
        ConsultantNote = string.IsNullOrEmpty(trimmed) ? null : Check.Length(trimmed, nameof(note), maxLength: 2000);
    }

    /// <summary>18a · Başka danışmana devret. Karara bağlanmış talep devredilmez — yapılacak iş kalmadı.</summary>
    public void AssignTo(Guid? userId)
    {
        EnsurePending();
        AssignedUserId = userId;
    }

    /// <summary>Host başvuru sürecini başlattı; talep açılan başvuruya bağlanır.</summary>
    public void MarkApplicationStarted(Guid applicationId, Guid? userId, DateTime now)
    {
        EnsurePending();
        EnsureLinked();
        Status = GrantInterestStatus.BasvuruAcildi;
        GrantApplicationId = applicationId;
        ReviewedByUserId = userId;
        ReviewedAt = now;
    }

    /// <summary>Uygun bulunmadı. Gerekçesiz kapatılamaz — metin firmaya gidiyor.</summary>
    public void Reject(string reason, Guid? userId, DateTime now)
    {
        EnsurePending();

        var trimmed = reason?.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestReasonRequired);
        }

        Status = GrantInterestStatus.UygunDegil;
        HostFeedback = Check.Length(trimmed, nameof(reason), maxLength: 1000);
        ReviewedByUserId = userId;
        ReviewedAt = now;
    }

    /// <summary>
    /// 19a · Danışman fikri firma adına girdi. 🔴 ABP, kayıt oturumdaki kullanıcının kiracısına ait değilse
    /// <c>CreatorId</c>'yi YAZMAZ — host kullanıcısı firmanın kaydını açtığı için "Kim girdi" boş kalıyordu
    /// (ölçüldü). Giren elle yazılır; ABP dolu alanı ezmez.
    /// </summary>
    public void RecordEnteredBy(Guid? userId)
    {
        CreatorId = userId;
    }

    /// <summary>Başvuru ve görüşme bir çağrı için yürür; havuzdaki fikir önce çağrıyla ilişkilendirilmeli.</summary>
    public void EnsureLinked()
    {
        if (IsPoolIdea)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestIdeaNotLinked);
        }
    }

    private void EnsurePending()
    {
        if (!IsPending)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
        }
    }
}
