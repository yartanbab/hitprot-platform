using System.Collections.Generic;

namespace Apya.Platform.Tenants;

public class PackageDto
{
    public PackageCode Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public List<PackageFeatureDto> Features { get; set; } = new();
}

public class PackageFeatureDto
{
    public string FeatureName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public bool IsNumeric { get; set; }
}

public class UpdatePackageFeaturesDto
{
    public PackageCode Code { get; set; }

    /// <summary>featureName → value ("true"/"false" ya da sayı). Yalnız katalogdaki feature'lar işlenir.</summary>
    public Dictionary<string, string> Features { get; set; } = new();
}
