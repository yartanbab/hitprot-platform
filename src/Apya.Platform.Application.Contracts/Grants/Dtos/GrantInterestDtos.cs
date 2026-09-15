using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>
/// Kiracı: "İlgileniyorum" talebi — hibe detayındaki onay adımından sonra doldurulan
/// proje fikri. Talep host kutusuna bu bilgilerle düşer.
/// </summary>
public class ExpressGrantInterestInput : GrantIdeaInput
{
    [Required(ErrorMessage = "Çağrı seçilmedi.")]
    public Guid GrantCallId { get; set; }

    /// <summary>
    /// Yalnız konsorsiyum şartı taşıyan çağrıda sorulur ve orada ZORUNLUDUR (servis denetler).
    /// true = ortak arıyor · false = ortağı belli.
    /// </summary>
    public bool? NeedsPartner { get; set; }

    [StringLength(200, ErrorMessage = "Ortak kuruluşun adı en fazla 200 karakter olabilir.")]
    public string? PartnerName { get; set; }
}

/// <summary>19a · Kiracı: çağrı seçmeden Fikir Havuzu'na proje fikri.</summary>
public class ShareGrantIdeaInput : GrantIdeaInput
{
}

/// <summary>19a · Host: danışman firma adına havuza fikir girer.</summary>
public class CreateGrantIdeaInput : GrantIdeaInput
{
    [Required(ErrorMessage = "Firma seçilmedi.")]
    public Guid TenantId { get; set; }
}

/// <summary>
/// Proje fikri formu — tur 19'un dokuz sorusu, bütçe ve hedef başlangıç. Çağrıya ilgi, havuza fikir
/// ve danışmanın firma adına girişi AYNI formu doldurur; çağrıya özgü sorular türeyen sınıftadır.
/// </summary>
public abstract class GrantIdeaInput
{
    /// <summary>Proje fikri, birkaç cümle. Danışmanın ön değerlendirmesi buradan başlar.</summary>
    [Required(ErrorMessage = "Proje fikrinizi birkaç cümleyle yazın.")]
    [StringLength(1000, ErrorMessage = "Proje fikri en fazla 1000 karakter olabilir.")]
    public string Note { get; set; } = string.Empty;

    [Range(typeof(decimal), "0", "999999999999", ErrorMessage = "Bütçe negatif olamaz.")]
    public decimal? EstimatedBudget { get; set; }

    /// <summary>Hedeflenen başlangıç çeyreğinin ilk günü. Boş = henüz belli değil.</summary>
    public DateTime? TargetStartDate { get; set; }

    // --- Proje fikri formu · 2-9. sorular. Yalnız 2. soru zorunlu; gerisi bildiği kadarıyla. ---

    /// <summary>2 · Projenin çözüm ürettiği problem ya da ihtiyaç.</summary>
    [Required(ErrorMessage = "Çözmek istediğiniz problemi veya ihtiyacı yazın.")]
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string ProblemStatement { get; set; } = string.Empty;

    /// <summary>3 · Hedef kitle.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? TargetAudience { get; set; }

    /// <summary>4 · Planlanan faaliyetler.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? PlannedActivities { get; set; }

    /// <summary>5 · Tahmini süre ve iş birliği yapılmak istenen kurumlar.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? DurationAndPartners { get; set; }

    /// <summary>6 · En çok destek ya da yönlendirme beklenen konu.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? SupportNeeds { get; set; }

    /// <summary>7 · Daha önce yürütülen benzer projeler.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? PriorExperience { get; set; }

    /// <summary>8 · Ekip yapısı ve anahtar kişilerin yetkinlikleri.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? TeamStructure { get; set; }

    /// <summary>9 · Mevcut paydaşlar, dernekler, çözüm ortakları ve rolleri.</summary>
    [StringLength(GrantInterestConsts.MaxAnswerLength, ErrorMessage = "Cevap en fazla 1000 karakter olabilir.")]
    public string? Stakeholders { get; set; }
}

/// <summary>Kiracının kendi ilgi talebi — "İlgi Taleplerim" satırı ve detay rozeti.</summary>
public class MyGrantInterestDto
{
    public Guid Id { get; set; }

    /// <summary>null = Fikir Havuzu'na çağrısız bırakılan fikir (19a).</summary>
    public Guid? GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string? Period { get; set; }
    public DateTime CreationTime { get; set; }
    public GrantInterestStatus Status { get; set; }
    public string? Note { get; set; }
    public decimal? EstimatedBudget { get; set; }
    public DateTime? TargetStartDate { get; set; }
    public bool? NeedsPartner { get; set; }
    public string? PartnerName { get; set; }

    /// <summary>Proje fikri formunun 2-9. cevapları; boş bırakılan soru null.</summary>
    public string? ProblemStatement { get; set; }
    public string? TargetAudience { get; set; }
    public string? PlannedActivities { get; set; }
    public string? DurationAndPartners { get; set; }
    public string? SupportNeeds { get; set; }
    public string? PriorExperience { get; set; }
    public string? TeamStructure { get; set; }
    public string? Stakeholders { get; set; }

    public DateTime? WithdrawnAt { get; set; }

    /// <summary>Host'un gerekçesi — yalnız uygun bulunmayan taleplerde dolu.</summary>
    public string? HostFeedback { get; set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru; sihirbaz bağlantısı buna bakar.</summary>
    public Guid? GrantApplicationId { get; set; }
}

/// <summary>Host: İlgi Talepleri konsolu.</summary>
public class GrantInterestConsoleDto
{
    public List<GrantInterestRowDto> Items { get; set; } = new();

    public int NewCount { get; set; }
    public int InReviewCount { get; set; }
    public int StartedCount { get; set; }
    public int RejectedCount { get; set; }
}

public class GrantInterestRowDto
{
    public Guid Id { get; set; }
    public Guid? TenantId { get; set; }
    public string FirmName { get; set; } = string.Empty;
    public Guid GrantCallId { get; set; }
    public string GrantName { get; set; } = string.Empty;
    public string? Period { get; set; }

    /// <summary>Çağrının son başvuru tarihi — host aciliyeti buna göre görür.</summary>
    public DateTime? Deadline { get; set; }

    public int? DaysRemaining { get; set; }

    public DateTime CreationTime { get; set; }

    /// <summary>Proje fikri.</summary>
    public string? Note { get; set; }

    public decimal? EstimatedBudget { get; set; }
    public DateTime? TargetStartDate { get; set; }

    /// <summary>null = soru sorulmadı (çağrı ortaklık istemiyor) · true = ortak arıyor · false = ortağı belli.</summary>
    public bool? NeedsPartner { get; set; }

    public string? PartnerName { get; set; }

    /// <summary>Proje fikri formunun 2-9. cevapları; danışman inceleme ekranında soru soru okur.</summary>
    public string? ProblemStatement { get; set; }
    public string? TargetAudience { get; set; }
    public string? PlannedActivities { get; set; }
    public string? DurationAndPartners { get; set; }
    public string? SupportNeeds { get; set; }
    public string? PriorExperience { get; set; }
    public string? TeamStructure { get; set; }
    public string? Stakeholders { get; set; }

    public DateTime? WithdrawnAt { get; set; }

    public GrantInterestStatus Status { get; set; }
    public string? HostFeedback { get; set; }

    /// <summary>Talebi bırakan kişi — host'un irtibat kuracağı isim.</summary>
    public string? RequestedByName { get; set; }

    public Guid? ReviewedByUserId { get; set; }
    public string? ReviewedByName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? GrantApplicationId { get; set; }

    /// <summary>18a · Sorumlu danışman.</summary>
    public Guid? AssignedUserId { get; set; }

    public string? AssignedUserName { get; set; }
}

/// <summary>
/// 18a · Danışmanın tek talep üzerindeki inceleme ekranı: proje fikri, firma, uygunluk ve
/// aynı çağrıya ilgi bildirmiş olası ortaklar tek yükte. Hepsi mevcut kayıtlardan hesaplanır.
/// </summary>
public class GrantInterestReviewDto
{
    public GrantInterestRowDto Interest { get; set; } = new();

    /// <summary>18e · Talebin son görüşme önerisi; firma henüz önermediyse boş.</summary>
    public GrantMeetingDto? Meeting { get; set; }

    /// <summary>İç not — firmaya gitmez.</summary>
    public string? ConsultantNote { get; set; }

    public bool RequiresConsortium { get; set; }

    // --- Firma kartı ---
    /// <summary>Firmanın bu çağrıya uyum puanı (0-100) — katalog ve gönderim ekranıyla aynı hesap.</summary>
    public int MatchScore { get; set; }

    public GrantEligibilityBucket Bucket { get; set; }

    /// <summary>Sağlanan şart sayısı — şart hiç yoksa "hepsini karşılıyor" denmesin diye.</summary>
    public int PassedRuleCount { get; set; }

    public List<GrantEligibilityRule> FailedRules { get; set; } = new();
    public List<GrantEligibilityRule> UnknownRules { get; set; } = new();

    public CompanySize? Size { get; set; }
    public List<string> NaceCodes { get; set; } = new();
    public List<string> Sectors { get; set; } = new();
    public List<string> Regions { get; set; } = new();
    public decimal? AnnualRevenue { get; set; }
    public int? StaffCount { get; set; }
    public int? RdStaffCount { get; set; }
    public bool? HasConsortiumPartner { get; set; }

    /// <summary>Firmanın platformdaki aktif proje sayısı.</summary>
    public int ActiveProjectCount { get; set; }

    /// <summary>Onaylı tutarı girilmiş önceki hibe başvurusu sayısı.</summary>
    public int ApprovedGrantCount { get; set; }

    /// <summary>Aynı çağrıya ilgi bildirmiş başka firmalar; yalnız ortaklık gereken talepte dolar.</summary>
    public List<GrantInterestPartnerSuggestionDto> PartnerSuggestions { get; set; } = new();

    /// <summary>Devret listesi: etkin host kullanıcıları + üzerlerindeki bekleyen talep sayısı.</summary>
    public List<GrantConsultantDto> Consultants { get; set; } = new();
}

public class GrantInterestPartnerSuggestionDto
{
    public Guid InterestId { get; set; }
    public Guid TenantId { get; set; }
    public string FirmName { get; set; } = string.Empty;
    public CompanySize? Size { get; set; }
    public int MatchScore { get; set; }

    /// <summary>O firma da ortak arıyor mu (null = soru sorulmadı).</summary>
    public bool? NeedsPartner { get; set; }

    public GrantInterestStatus Status { get; set; }
}

public class SaveGrantInterestNoteInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid InterestId { get; set; }

    [StringLength(2000, ErrorMessage = "Danışman notu en fazla 2000 karakter olabilir.")]
    public string? Note { get; set; }
}

public class AssignGrantInterestInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid InterestId { get; set; }

    /// <summary>null = sorumluyu kaldır.</summary>
    public Guid? UserId { get; set; }
}

public class RejectGrantInterestInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid InterestId { get; set; }

    /// <summary>Firmaya aynen iletilir; boş geçilemez.</summary>
    [Required(ErrorMessage = "Gerekçe zorunludur.")]
    [StringLength(1000, ErrorMessage = "Gerekçe en fazla 1000 karakter olabilir.")]
    public string Reason { get; set; } = string.Empty;
}

/// <summary>18e · Ön görüşme önerisi: firmanın üç saati ve danışmanın cevabı. Firmaya ve host'a aynı biçimde gider.</summary>
public class GrantMeetingDto
{
    public Guid Id { get; set; }
    public GrantMeetingStatus Status { get; set; }

    /// <summary>Önerilen saatler, erkenden geçe. Onayda seçilen sıra numarası bu listeye göredir.</summary>
    public List<DateTime> Slots { get; set; } = new();

    public DateTime? ConfirmedSlot { get; set; }

    /// <summary>Başka saat isteğinin gerekçesi.</summary>
    public string? HostNote { get; set; }

    public DateTime CreationTime { get; set; }
    public DateTime? AnsweredAt { get; set; }
    public int DurationMinutes { get; set; } = GrantMeetingConsts.DurationMinutes;
}

public class ProposeGrantMeetingInput
{
    [Required(ErrorMessage = "Talep seçilmedi.")]
    public Guid InterestId { get; set; }

    /// <summary>Tam üç, farklı ve gelecekteki saat (sunucu ayrıca denetler).</summary>
    public List<DateTime> Slots { get; set; } = new();
}

public class ConfirmGrantMeetingInput
{
    [Required(ErrorMessage = "Öneri seçilmedi.")]
    public Guid ProposalId { get; set; }

    /// <summary>0, 1 ya da 2 — <see cref="GrantMeetingDto.Slots"/> sırası.</summary>
    [Range(0, GrantMeetingConsts.SlotCount - 1)]
    public int SlotIndex { get; set; }
}

public class RequestGrantMeetingTimeInput
{
    [Required(ErrorMessage = "Öneri seçilmedi.")]
    public Guid ProposalId { get; set; }

    /// <summary>Firmaya aynen iletilir; boş geçilemez.</summary>
    [Required(ErrorMessage = "Not zorunludur.")]
    [StringLength(GrantMeetingConsts.MaxHostNoteLength, ErrorMessage = "Not en fazla 500 karakter olabilir.")]
    public string Note { get; set; } = string.Empty;
}
