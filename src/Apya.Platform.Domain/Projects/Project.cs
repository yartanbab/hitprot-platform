using System;
using Apya.Platform.ProjectBudgets;
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
    public Guid? TenantId { get; private set; }

    public Guid? GrantId { get; private set; } // Boş olabilir

    /// <summary>APYA-132: Project'in bağlı olduğu Cari (Müşteri). Eski projelerde boş olabilir.</summary>
    public Guid? CustomerId { get; private set; }

    /// <summary>
    /// Cari kategorisi — <see cref="ProjectCategoryDefinition"/>'a FK. Sistem tanımları
    /// global (TenantId null), kiracının kendi eklediği kategoriler kiracıya bağlıdır.
    /// Varsayılan sistem kaydı "Diğer / Genel".
    /// </summary>
    public Guid CategoryId { get; private set; } = ProjectCategoryConsts.SystemIds.Other;

    public string Name { get; private set; } = null!;

    public string Code { get; private set; } = null!;

    public string Description { get; private set; } = null!;

    public string? Purpose { get; private set; } // Amacı — opsiyonel
    public string? TargetAudience { get; private set; } // Hedef Kitlesi — opsiyonel
    public string? Activities { get; private set; } // Faaliyetleri — opsiyonel

    public DateTime? StartDate { get; private set; }
    public DateTime? EndDate { get; private set; }

    public bool IsApproved { get; private set; }

    /// <summary>
    /// Kapak görselinin App_Data/uploads altındaki saklanan dosya adı (GUID.uzantı).
    /// Boşsa kartlarda kategori ikonu gösterilir.
    /// </summary>
    public string? CoverImageFileName { get; private set; }

    /* --- BÜTÇE & KAYNAK YÖNETİMİ --- */
    public decimal TotalBudget { get; private set; } = 0;
    public decimal HourlyRate { get; private set; } = 0; // Saatlik maliyet (opsiyonel)
    public string Currency { get; private set; } = "TRY";

    /// <summary>
    /// Donör para birimi (ör. "EUR"). BOŞSA proje tek defterlidir ve donör
    /// karşılığı hiç hesaplanmaz — dövizsiz projelerin hiçbir şeyi değişmez.
    /// </summary>
    public string? DonorCurrency { get; private set; }

    /// <summary>Donör karşılığının hangi günün kuruyla hesaplanacağı.</summary>
    public FxPolicy FxPolicy { get; private set; } = FxPolicy.SpendDate;

    /// <summary>
    /// <see cref="ProjectBudgets.FxPolicy.FixedContract"/> seçiliyse kullanılan
    /// sabit kur: 1 <see cref="Currency"/> = FixedDonorRate <see cref="DonorCurrency"/>.
    /// </summary>
    public decimal? FixedDonorRate { get; private set; }

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
        Guid? tenantId,
        Guid? grantId,
        string name,
        string code,
        string description,
        decimal totalBudget = 0,
        decimal hourlyRate = 0,
        string currency = "TRY",
        string? purpose = null,
        string? targetAudience = null,
        string? activities = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        Guid? customerId = null,
        Guid? categoryId = null)
        : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        GrantId = grantId;
        CustomerId = customerId;
        CategoryId = categoryId ?? ProjectCategoryConsts.SystemIds.Other;
        Code = code;
        Description = description;
        SetBudgetInfo(totalBudget, hourlyRate, currency);
        SetProjectDetails(purpose, targetAudience, activities);
        SetSchedule(startDate, endDate);
    }

    // ==================== DOMAIN METHODS ====================

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.ProjectNameRequired)
                .WithData("Name", name);
        Name = name.Trim();
    }

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

    public void SetProjectDetails(string? purpose, string? targetAudience, string? activities)
    {
        Purpose = purpose;
        TargetAudience = targetAudience;
        Activities = activities;
    }

    public void SetSchedule(DateTime? startDate, DateTime? endDate)
    {
        if (startDate.HasValue && endDate.HasValue && endDate.Value < startDate.Value)
            throw new BusinessException(PlatformDomainErrorCodes.ProjectScheduleInvalid)
                .WithData("StartDate", startDate)
                .WithData("EndDate", endDate);

        StartDate = startDate;
        EndDate = endDate;
    }

    /// <summary>
    /// Projenin tüm değiştirilebilir alanlarını tek metotta günceller.
    /// TenantId değiştirilemez — yaşam döngüsü boyunca sabittir.
    /// </summary>
    public void Update(
        string name,
        string code,
        string description,
        Guid? grantId,
        Guid? customerId,
        Guid categoryId,
        decimal totalBudget,
        decimal hourlyRate,
        string currency,
        string? purpose,
        string? targetAudience,
        string? activities,
        DateTime? startDate,
        DateTime? endDate)
    {
        SetName(name);
        Code = code;
        Description = description;
        GrantId = grantId;
        CustomerId = customerId;
        CategoryId = categoryId;
        SetBudgetInfo(totalBudget, hourlyRate, currency);
        SetProjectDetails(purpose, targetAudience, activities);
        SetSchedule(startDate, endDate);
    }

    /// <summary>
    /// Kapak görselini ayarlar; null/boş geçilirse kaldırır.
    /// Dosyanın kendisi Web katmanında saklanır, burada yalnız ad tutulur.
    /// </summary>
    public void SetCoverImage(string? storedFileName)
    {
        CoverImageFileName = string.IsNullOrWhiteSpace(storedFileName) ? null : storedFileName.Trim();
    }

    /// <summary>
    /// Kur köprüsünü ayarlar. Donör para birimi boşaltılırsa politika ve sabit
    /// kur da temizlenir — donörü olmayan projede "hangi kurla" sorusunun cevabı
    /// yoktur, yarım bir yapılandırma bırakmak sonradan yanlış hesap üretir.
    /// </summary>
    public void SetFxBridge(string? donorCurrency, FxPolicy policy, decimal? fixedDonorRate)
    {
        var donor = string.IsNullOrWhiteSpace(donorCurrency)
            ? null
            : donorCurrency.Trim().ToUpperInvariant();

        if (donor == null)
        {
            DonorCurrency = null;
            FxPolicy = FxPolicy.SpendDate;
            FixedDonorRate = null;
            return;
        }

        if (donor == Currency)
            throw new BusinessException(PlatformDomainErrorCodes.FxDonorCurrencySameAsProject)
                .WithData("Currency", Currency);

        if (policy == FxPolicy.FixedContract && (fixedDonorRate is null || fixedDonorRate <= 0))
            throw new BusinessException(PlatformDomainErrorCodes.FxFixedRateRequired);

        DonorCurrency = donor;
        FxPolicy = policy;
        // Sabit kur yalnız o politikada anlamlı; başka politikada saklamak
        // "hangi değer geçerli" belirsizliği üretir.
        FixedDonorRate = policy == FxPolicy.FixedContract ? fixedDonorRate : null;
    }

    public void Approve() => IsApproved = true;
    public void Unapprove() => IsApproved = false;
}
