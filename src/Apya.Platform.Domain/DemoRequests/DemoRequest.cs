using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.DemoRequests;

/// <summary>
/// Giriş ekranından gelen demo talebi. Talebi gönderen henüz bir kiracıya ait
/// olmadığı için kayıt <b>host seviyesindedir</b>: <c>IMultiTenant</c> UYGULANMAZ,
/// böylece kiracı filtresi paneli sessizce boşaltmaz.
/// <para>
/// Oturumsuz bir uçtan doldurulur; IP ve tarayıcı bilgisi kötüye kullanımı
/// ayıklamak için SUNUCUDA yakalanır, istemciden alınmaz.
/// </para>
/// </summary>
public class DemoRequest : AuditedAggregateRoot<Guid>
{
    public string FullName { get; private set; }

    public string CompanyName { get; private set; }

    public string Email { get; private set; }

    public string Phone { get; private set; }

    public DemoRequestOrganizationKind? OrganizationKind { get; private set; }

    public DemoRequestCompanySize? CompanySize { get; private set; }

    /// <summary>İlgilenilen modül anahtarları, CSV. Bkz. <see cref="DemoRequestConsts.ModuleKeys"/>.</summary>
    public string? InterestedModules { get; private set; }

    public string? Message { get; private set; }

    // --- Proje fikri (ön görüşme) ---
    // Tamamı isteğe bağlı: aday formu yarıda bırakırsa bile elimizde iletişim
    // bilgisi kalsın diye zorunlu tutulmadı.

    /// <summary>Projenin hedef kitlesi (ör. 14-25 yaş gençler, gençlik çalışanları).</summary>
    public string? TargetAudience { get; private set; }

    /// <summary>Projenin çözmeyi hedeflediği temel sorun / ihtiyaç.</summary>
    public string? ProblemStatement { get; private set; }

    /// <summary>Planlanan faaliyetler (atölye, uluslararası buluşma, eğitim, kampanya…).</summary>
    public string? PlannedActivities { get; private set; }

    /// <summary>Beklenen hibe bütçesi aralığı.</summary>
    public DemoRequestBudgetRange? BudgetRange { get; private set; }

    /// <summary>Proje sonunda beklenen somut çıktılar ve kalıcı etkiler.</summary>
    public string? ExpectedOutcomes { get; private set; }

    public DemoRequestStatus Status { get; private set; }

    /// <summary>Ekibin iç notu — talebi gönderene GÖSTERİLMEZ.</summary>
    public string? AdminNote { get; private set; }

    public string? IpAddress { get; private set; }

    public string? UserAgent { get; private set; }

    protected DemoRequest()
    {
        FullName = string.Empty;
        CompanyName = string.Empty;
        Email = string.Empty;
        Phone = string.Empty;
    }

    public DemoRequest(
        Guid id,
        string fullName,
        string companyName,
        string email,
        string phone,
        DemoRequestOrganizationKind? organizationKind = null,
        DemoRequestCompanySize? companySize = null,
        string? interestedModules = null,
        string? message = null,
        string? ipAddress = null,
        string? userAgent = null)
        : base(id)
    {
        FullName = Check.NotNullOrWhiteSpace(fullName, nameof(fullName), DemoRequestConsts.MaxFullNameLength);
        CompanyName = Check.NotNullOrWhiteSpace(companyName, nameof(companyName), DemoRequestConsts.MaxCompanyNameLength);
        Email = Check.NotNullOrWhiteSpace(email, nameof(email), DemoRequestConsts.MaxEmailLength);
        Phone = Check.NotNullOrWhiteSpace(phone, nameof(phone), DemoRequestConsts.MaxPhoneLength);
        OrganizationKind = organizationKind;
        CompanySize = companySize;
        InterestedModules = Truncate(interestedModules, DemoRequestConsts.MaxInterestedModulesLength);
        Message = Truncate(message, DemoRequestConsts.MaxMessageLength);
        IpAddress = Truncate(ipAddress, DemoRequestConsts.MaxIpAddressLength);
        UserAgent = Truncate(userAgent, DemoRequestConsts.MaxUserAgentLength);
        Status = DemoRequestStatus.New;
    }

    /// <summary>
    /// Proje fikri bloğunu doldurur. Kurucuya EKLENMEDİ: çekirdek kayıt (kim, hangi
    /// kurum, nasıl ulaşılır) bu bilgiler olmadan da geçerlidir ve kurucu on altı
    /// parametreye çıkardı.
    /// </summary>
    public void SetProjectBrief(
        string? targetAudience,
        string? problemStatement,
        string? plannedActivities,
        DemoRequestBudgetRange? budgetRange,
        string? expectedOutcomes)
    {
        TargetAudience = Truncate(targetAudience, DemoRequestConsts.MaxTargetAudienceLength);
        ProblemStatement = Truncate(problemStatement, DemoRequestConsts.MaxProblemStatementLength);
        PlannedActivities = Truncate(plannedActivities, DemoRequestConsts.MaxPlannedActivitiesLength);
        BudgetRange = budgetRange;
        ExpectedOutcomes = Truncate(expectedOutcomes, DemoRequestConsts.MaxExpectedOutcomesLength);
    }

    /// <summary>Takip durumunu değiştirir. Geçiş serbesttir: yanlış işaretleme geri alınabilmeli.</summary>
    public void SetStatus(DemoRequestStatus status)
    {
        Status = status;
    }

    public void SetAdminNote(string? note)
    {
        AdminNote = Truncate(note, DemoRequestConsts.MaxAdminNoteLength);
    }

    private static string? Truncate(string? value, int max)
        => string.IsNullOrEmpty(value) || value.Length <= max ? value : value.Substring(0, max);
}
