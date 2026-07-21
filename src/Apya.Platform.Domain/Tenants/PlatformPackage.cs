using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tenants;

/// <summary>
/// Faz 2: Host'un düzenleyebildiği satış paketi (edition). Sabit 4 tier (<see cref="PackageCode"/>),
/// içeriği (feature değerleri) DB'de tutulur ve host yönetim UI'ından değiştirilir.
/// Host-side (IMultiTenant DEĞİL). Tenant'a uygulanınca feature seti yazılır
/// (<see cref="TenantPackageManager"/>). İlk içerik <see cref="Apya.Platform.Tenants.PackageDefinitions"/>
/// registry'sinden tohumlanır.
/// </summary>
public class PlatformPackage : FullAuditedAggregateRoot<Guid>
{
    public PackageCode Code { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public int DisplayOrder { get; private set; }

    public ICollection<PlatformPackageFeature> Features { get; private set; }

    protected PlatformPackage()
    {
        Features = new List<PlatformPackageFeature>();
    }

    public PlatformPackage(Guid id, PackageCode code, string name, string? description, int displayOrder)
        : base(id)
    {
        Code = code;
        Name = name;
        Description = description;
        DisplayOrder = displayOrder;
        Features = new List<PlatformPackageFeature>();
    }

    public void Update(string name, string? description, int displayOrder)
    {
        Name = name;
        Description = description;
        DisplayOrder = displayOrder;
    }

    /// <summary>Feature değerini set eder (yoksa ekler). newId yalnız ekleme durumunda kullanılır.</summary>
    public void SetFeature(Guid newId, string featureName, string value)
    {
        var existing = Features.FirstOrDefault(f => f.FeatureName == featureName);
        if (existing != null)
        {
            existing.SetValue(value);
        }
        else
        {
            Features.Add(new PlatformPackageFeature(newId, Id, featureName, value));
        }
    }

    public IReadOnlyDictionary<string, string> ToFeatureValues()
        => Features.ToDictionary(f => f.FeatureName, f => f.Value);
}
