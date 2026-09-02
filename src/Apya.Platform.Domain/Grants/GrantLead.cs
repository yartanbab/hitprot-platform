using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Grants;

/// <summary>
/// 5a · Kamu uygunluk testinden gelen ön değerlendirme talebi.
///
/// <para>Kiracıya AİT DEĞİLDİR: talebi bırakan ziyaretçinin henüz bir kiracısı
/// yoktur. Host kataloğunda yaşar; <see cref="IMultiTenant"/> uygulamaz ki
/// kiracı filtresi hiç devreye girmesin (uygulasaydı <c>TenantId=null</c>
/// satırları kiracı bağlamında sessizce elenirdi).</para>
///
/// <para>Test cevapları AYRI KOLONLARDA tutulur, JSON'da değil: aynı alanlar
/// <see cref="FirmSignals"/>'a birebir çevriliyor ve müşteriye dönüştürmede
/// firma profiline aktarılıyor.</para>
/// </summary>
public class GrantLead : FullAuditedAggregateRoot<Guid>
{
    /// <summary>Testin alındığı çağrı.</summary>
    public Guid GrantCallId { get; private set; }

    // --- İletişim ---
    public string FirmName { get; private set; } = null!;
    public string ContactName { get; private set; } = null!;
    public string? ContactTitle { get; private set; }
    public string Email { get; private set; } = null!;
    public string? Phone { get; private set; }

    // --- Test cevapları (FirmSignals karşılıkları) ---
    public CompanySize? Size { get; private set; }
    public int? CompanyAgeYears { get; private set; }
    public string? Sector { get; private set; }
    public int? RdStaffCount { get; private set; }
    public int? Trl { get; private set; }
    public decimal? AnnualRevenue { get; private set; }
    public bool? HasConsortiumPartner { get; private set; }

    // --- Hesaplananlar ---

    /// <summary>Karşılanan şart sayısı.</summary>
    public int PassedRuleCount { get; private set; }

    /// <summary>Ölçülebilen şart sayısı ("4/5"in paydası).</summary>
    public int TotalRuleCount { get; private set; }

    /// <summary>Uyum skoru (0-100).</summary>
    public int MatchScore { get; private set; }

    /// <summary>Isı skoru (0-100) — triage sırası buna göre.</summary>
    public int HeatScore { get; private set; }

    /// <summary>Tahmini destek tutarı.</summary>
    public decimal? EstimatedSupport { get; private set; }

    /// <summary>Başvuru zorluğu (1-5).</summary>
    public int Difficulty { get; private set; }

    /// <summary>Hesaplanan sinyaller — virgülle ayrılmış enum değerleri.</summary>
    public string SignalCodes { get; private set; } = string.Empty;

    // --- Triage ---
    public GrantLeadStatus Status { get; private set; }
    public string? Note { get; private set; }

    /// <summary>5b'den gelen randevu TERCİHİ. Onaylanmış slot değildir.</summary>
    public DateTime? PreferredMeetingAt { get; private set; }

    /// <summary>Müşteriye dönüştürüldüyse açılan kiracı.</summary>
    public Guid? ConvertedTenantId { get; private set; }

    /// <summary>
    /// Talebi bırakanın IP'si. Oturumsuz form olduğu için kötüye kullanım
    /// koruması buna dayanır (emsal: <c>DemoRequestManager</c>).
    /// </summary>
    public string? IpAddress { get; private set; }

    public string? UserAgent { get; private set; }

    protected GrantLead() { }

    public GrantLead(
        Guid id,
        Guid grantCallId,
        string firmName,
        string contactName,
        string email)
        : base(id)
    {
        GrantCallId = grantCallId;
        FirmName = Check.NotNullOrWhiteSpace(firmName, nameof(firmName), maxLength: 160);
        ContactName = Check.NotNullOrWhiteSpace(contactName, nameof(contactName), maxLength: 120);
        Email = Check.NotNullOrWhiteSpace(email, nameof(email), maxLength: 160);
        Status = GrantLeadStatus.Yeni;
    }

    public void SetOrigin(string? ipAddress, string? userAgent)
    {
        IpAddress = Check.Length(ipAddress, nameof(ipAddress), maxLength: 64);
        UserAgent = Check.Length(userAgent, nameof(userAgent), maxLength: 512);
    }

    public void SetContact(string? title, string? phone)
    {
        ContactTitle = Check.Length(title, nameof(title), maxLength: 96);
        Phone = Check.Length(phone, nameof(phone), maxLength: 32);
    }

    public void SetAnswers(
        CompanySize? size,
        int? companyAgeYears,
        string? sector,
        int? rdStaffCount,
        int? trl,
        decimal? annualRevenue,
        bool? hasConsortiumPartner)
    {
        Size = size;
        CompanyAgeYears = companyAgeYears;
        Sector = Check.Length(sector, nameof(sector), maxLength: 96);
        RdStaffCount = rdStaffCount;
        Trl = trl;
        AnnualRevenue = annualRevenue;
        HasConsortiumPartner = hasConsortiumPartner;
    }

    public void SetScores(
        int passedRuleCount,
        int totalRuleCount,
        int matchScore,
        int heatScore,
        decimal? estimatedSupport,
        int difficulty,
        string signalCodes)
    {
        PassedRuleCount = passedRuleCount;
        TotalRuleCount = totalRuleCount;
        MatchScore = matchScore;
        HeatScore = heatScore;
        EstimatedSupport = estimatedSupport;
        Difficulty = difficulty;
        SignalCodes = signalCodes;
    }

    public void RequestMeeting(DateTime preferredAt, string? note)
    {
        PreferredMeetingAt = preferredAt;
        Note = Check.Length(note, nameof(note), maxLength: 1000);

        // Randevu talebi geldiyse durum en az "randevu verildi" seviyesine çıkar;
        // müşteri olmuş bir talep geri alınmaz.
        if (Status is GrantLeadStatus.Yeni or GrantLeadStatus.Arandi or GrantLeadStatus.Takipte)
        {
            Status = GrantLeadStatus.RandevuVerildi;
        }
    }

    public void SetStatus(GrantLeadStatus status, string? note = null)
    {
        if (ConvertedTenantId.HasValue && status != GrantLeadStatus.MusteriOldu)
        {
            // Müşteriye dönüşmüş talep geri alınamaz: kiracı açıldı, kayıt onu anlatır.
            throw new BusinessException(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
        }

        Status = status;
        if (note != null)
        {
            Note = Check.Length(note, nameof(note), maxLength: 1000);
        }
    }

    public void MarkConverted(Guid tenantId)
    {
        if (ConvertedTenantId.HasValue)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
        }

        ConvertedTenantId = tenantId;
        Status = GrantLeadStatus.MusteriOldu;
    }
}
