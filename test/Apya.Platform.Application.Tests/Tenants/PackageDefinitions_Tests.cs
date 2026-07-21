using System;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Tenants;

namespace Apya.Platform.Tests.Application.Tenants;

/// <summary>
/// Paket registry'si (<see cref="PackageDefinitions"/>) ile yönetilen feature kataloğu
/// (<see cref="PackageFeatureCatalog"/>) tutarlı kalmalı: ileride biri katalog'a feature
/// ekleyip paketlere değer eklemeyi unutursa bu test yakalar.
/// </summary>
public class PackageDefinitions_Tests
{
    [Fact]
    public void Every_Package_Defines_Every_Managed_Feature()
    {
        var managed = PackageFeatureCatalog.Managed.Select(m => m.Name).ToList();

        foreach (PackageCode code in Enum.GetValues<PackageCode>())
        {
            var values = PackageDefinitions.For(code);
            foreach (var name in managed)
            {
                values.ContainsKey(name).ShouldBeTrue(
                    $"Paket {code}, '{name}' feature'ını tanımlamıyor (PackageDefinitions eksik).");
            }
        }
    }

    [Fact]
    public void Toggle_Values_Are_Boolean_And_Numeric_Values_Are_Integers()
    {
        foreach (PackageCode code in Enum.GetValues<PackageCode>())
        {
            var values = PackageDefinitions.For(code);
            foreach (var meta in PackageFeatureCatalog.Managed)
            {
                if (!values.TryGetValue(meta.Name, out var v)) { continue; }

                if (meta.IsNumeric)
                {
                    int.TryParse(v, out _).ShouldBeTrue($"{code}/{meta.Name} sayısal olmalı: '{v}'");
                }
                else
                {
                    (v == "true" || v == "false").ShouldBeTrue($"{code}/{meta.Name} toggle (true/false) olmalı: '{v}'");
                }
            }
        }
    }
}
