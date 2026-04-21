using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje Aggregate Root'u.
/// REV-GAP001: Rich Domain Model — İş kuralları entity içinde kapsüllenir.
/// </summary>
public class Project : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid? GrantId { get; set; } // Boş olabilir

    public string Name { get; set; }

    public string Code { get; set; }

    public string Description { get; set; }

    public string Purpose { get; set; } = null!; // Amacı
    public string Duration { get; set; } = null!; // Süresi
    public string TargetAudience { get; set; } = null!; // Hedef Kitlesi
    public string Activities { get; set; } = null!; // Faaliyetleri

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; }

    /* --- BÜTÇE & KAYNAK YÖNETİMİ --- */
    public decimal TotalBudget { get; set; } = 0;
    public decimal HourlyRate { get; set; } = 0; // Saatlik maliyet (opsiyonel)
    public string Currency { get; set; } = "TRY";

    /// <summary>
    /// EF Core için zorunlu parametre-siz constructor.
    /// </summary>
    protected Project()
    {
    }

    /// <summary>
    /// Tam kapsamlı proje oluşturma constructor'ı.
    /// Tüm alanlar INSERT öncesinde set edilir — post-INSERT atama anti-pattern'i yok.
    /// </summary>
    public Project(
        Guid id,
        Guid? grantId,
        string name,
        string code,
        string description,
        decimal totalBudget = 0,
        decimal hourlyRate = 0,
        string currency = "TRY",
        string? purpose = null,
        string? duration = null,
        string? targetAudience = null,
        string? activities = null,
        DateTime? startDate = null,
        DateTime? endDate = null)
        : base(id)
    {
        SetName(name);
        GrantId = grantId;
        Code = code;
        Description = description;
        SetBudgetInfo(totalBudget, hourlyRate, currency);
        SetProjectDetails(purpose, duration, targetAudience, activities);
        SetSchedule(startDate, endDate);
    }

    // ==================== DOMAIN METHODS ====================

    /// <summary>
    /// Proje adını değiştirir. Boş olamaz.
    /// </summary>
    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.ProjectNameRequired)
                .WithData("Name", name);
        Name = name.Trim();
    }

    /// <summary>
    /// Bütçe bilgilerini domain kurallarıyla günceller.
    /// Negatif bütçe kabul edilmez.
    /// </summary>
    public void SetBudgetInfo(decimal totalBudget, decimal hourlyRate, string currency)
    {
        if (totalBudget < 0 || hourlyRate < 0)
            throw new BusinessException(PlatformDomainErrorCodes.ProjectBudgetInvalid)
                .WithData("TotalBudget", totalBudget)
                .WithData("HourlyRate", hourlyRate);

        TotalBudget = totalBudget;
        HourlyRate = hourlyRate;
        Currency = currency ?? "TRY";
    }

    /// <summary>
    /// Proje detay alanlarını günceller.
    /// </summary>
    public void SetProjectDetails(string purpose, string duration, string targetAudience, string activities)
    {
        Purpose = purpose;
        Duration = duration;
        TargetAudience = targetAudience;
        Activities = activities;
    }

    /// <summary>
    /// Tarih aralığını günceller. Bitiş tarihi başlangıçtan önce olamaz.
    /// </summary>
    public void SetSchedule(DateTime? startDate, DateTime? endDate)
    {
        if (startDate.HasValue && endDate.HasValue && endDate.Value < startDate.Value)
            throw new BusinessException(PlatformDomainErrorCodes.ProjectScheduleInvalid)
                .WithData("StartDate", startDate)
                .WithData("EndDate", endDate);

        StartDate = startDate;
        EndDate = endDate;
    }
}