using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kurum belge paketi ("KOSGEB Ar-Ge", "TÜBİTAK 1501") — bir projenin hangi
/// belgeleri taşımak zorunda olduğunu tanımlayan kontrol listesi şablonu.
///
/// Grants modülünden BAĞIMSIZDIR: hibesiz projeler (banka dosyası, müşteri teslimi,
/// YMM tasdiki, iç yönetim) de uygunluk takibi yapabilsin diye. Grant.Issuer ile
/// eşleşme kurmak istenirse bu ileride öneri katmanında yapılır, şemada değil.
///
/// Sistem paketleri host seviyesinde (TenantId = null) seed edilir; okuma
/// DocumentType ile aynı desende kiracı filtresi kapatılarak yapılır.
/// </summary>
public class CompliancePackage : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; private set; } = null!;

    /// <summary>Belgeyi isteyen kurum ("KOSGEB", "TÜBİTAK", "Banka").</summary>
    public string Issuer { get; private set; } = null!;

    /// <summary>Makine tarafı sabit anahtar (KOSGEB_ARGE). Seed ve raporlar buna bakar.</summary>
    public string Code { get; private set; } = null!;

    public string? Description { get; private set; }

    public bool IsSystem { get; private set; }

    public int Order { get; private set; }

    protected CompliancePackage() { }

    public CompliancePackage(
        Guid id,
        Guid? tenantId,
        string name,
        string issuer,
        string code,
        string? description = null,
        bool isSystem = false,
        int order = 0) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        SetIssuer(issuer);
        SetCode(code);
        Description = description;
        IsSystem = isSystem;
        Order = order;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.CompliancePackageNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: ComplianceConsts.MaxPackageNameLength).Trim();
    }

    public void SetIssuer(string issuer)
        => Issuer = Check.NotNullOrWhiteSpace(issuer, nameof(issuer), maxLength: ComplianceConsts.MaxIssuerLength).Trim();

    public void SetCode(string code)
        => Code = Check.NotNullOrWhiteSpace(code, nameof(code), maxLength: ComplianceConsts.MaxPackageCodeLength)
            .Trim().ToUpperInvariant();

    public void Update(string name, string issuer, string? description, int order)
    {
        EnsureEditable();

        SetName(name);
        SetIssuer(issuer);
        Description = description;
        Order = order;
    }

    /// <summary>
    /// Sistem paketleri host seviyesinde tohumlanır ve tüm kiracılarca paylaşılır;
    /// bir kiracının onu değiştirmesi diğerlerinin kontrol listesini bozardı.
    /// Kiracı kendi kopyasını oluşturur.
    /// </summary>
    public void EnsureEditable()
    {
        if (IsSystem)
        {
            throw new BusinessException(PlatformDomainErrorCodes.CompliancePackageReadOnly)
                .WithData("Name", Name);
        }
    }
}
