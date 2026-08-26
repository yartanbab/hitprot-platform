using System;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje kategorisi tanımı. Sabit <see cref="ProjectCategory"/> enum'unun yerini alır.
///
/// İki tür kayıt vardır:
/// - SİSTEM kaydı: <see cref="TenantId"/> null, <see cref="SystemKey"/> dolu. Migration ile
///   gelir, tüm kiracılar görür, silinemez/yeniden adlandırılamaz. Görev şablonu ve hibe
///   eşleştirme skoru gibi DAVRANIŞLAR yalnız bu kayıtlara bağlıdır.
/// - KİRACI kaydı: <see cref="TenantId"/> dolu, <see cref="SystemKey"/> null. Kullanıcı ekler,
///   düz etikettir — bağlı bir davranışı yoktur.
/// </summary>
public class ProjectCategoryDefinition : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public string Name { get; private set; } = null!;

    /// <summary>
    /// FontAwesome ikon sınıfı, AİLE ÖNEKİ OLMADAN (örn. "fa-award"). Markup onu
    /// <c>class="fa &lt;Icon&gt;"</c> biçiminde basar; önek eklenirse ikon kaybolur.
    /// </summary>
    public string Icon { get; private set; } = null!;

    /// <summary>Kart/rozet rengi anahtarı — <see cref="ProjectCategoryConsts.Tones"/> listesinden.</summary>
    public string Tone { get; private set; } = null!;

    public int Order { get; private set; }

    /// <summary>Pasif kategori yeni projede seçilemez; mevcut projeler etkilenmez.</summary>
    public bool IsActive { get; private set; } = true;

    /// <summary>
    /// Doluysa bu bir sistem kaydıdır ve davranış tetikler. Kiracı kayıtlarında null.
    /// </summary>
    public ProjectCategory? SystemKey { get; private set; }

    public bool IsSystem => SystemKey.HasValue;

    protected ProjectCategoryDefinition()
    {
    }

    public ProjectCategoryDefinition(
        Guid id,
        Guid? tenantId,
        string name,
        string icon,
        string tone,
        int order,
        ProjectCategory? systemKey = null)
        : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        SetAppearance(icon, tone);
        Order = order;
        SystemKey = systemKey;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategoryNameRequired);

        Name = name.Trim().Length > ProjectCategoryConsts.MaxNameLength
            ? name.Trim()[..ProjectCategoryConsts.MaxNameLength]
            : name.Trim();
    }

    /// <summary>
    /// İkon ve renk. İkisi de CSS sınıfına yazıldığı için serbest bırakılmaz:
    /// ikon yalnız harf/rakam/tire kabul eder, renk sabit paletten seçilir. Geçersiz
    /// değer hata değil, varsayılana düşer — görünüm alanı kaydı bloklamaz.
    /// </summary>
    public void SetAppearance(string? icon, string? tone)
    {
        var cleanIcon = (icon ?? string.Empty).Trim().ToLowerInvariant();
        Icon = cleanIcon.Length > 0
               && cleanIcon.Length <= ProjectCategoryConsts.MaxIconLength
               && cleanIcon.All(ch => char.IsAsciiLetterOrDigit(ch) || ch == '-')
            ? cleanIcon
            : ProjectCategoryConsts.DefaultIcon;

        var cleanTone = (tone ?? string.Empty).Trim().ToLowerInvariant();
        Tone = ProjectCategoryConsts.Tones.Contains(cleanTone)
            ? cleanTone
            : ProjectCategoryConsts.DefaultTone;
    }

    public void SetOrder(int order) => Order = order;

    public void SetActive(bool isActive) => IsActive = isActive;

    /// <summary>
    /// Kiracı kaydını günceller. Sistem kayıtları buradan geçemez — çağıran
    /// AppService <see cref="IsSystem"/> kontrolünü yapar, burada ikinci savunma hattı.
    /// </summary>
    public void Update(string name, string? icon, string? tone, int order, bool isActive)
    {
        if (IsSystem)
            throw new BusinessException(PlatformDomainErrorCodes.ProjectCategorySystemReadOnly);

        SetName(name);
        SetAppearance(icon, tone);
        Order = order;
        IsActive = isActive;
    }
}
