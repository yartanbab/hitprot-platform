using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tenants;

/// <summary>Bir paketin tek feature değeri (toggle "true"/"false" ya da sayısal limit).</summary>
public class PlatformPackageFeature : Entity<Guid>
{
    public Guid PackageId { get; private set; }
    public string FeatureName { get; private set; } = null!;
    public string Value { get; private set; } = null!;

    protected PlatformPackageFeature() { }

    public PlatformPackageFeature(Guid id, Guid packageId, string featureName, string value)
        : base(id)
    {
        PackageId = packageId;
        FeatureName = featureName;
        Value = value;
    }

    public void SetValue(string value) => Value = value;
}
