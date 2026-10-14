using System;
using Apya.Platform.Macros;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Macros;

/// <summary>
/// Host makro ayarı: kapsam yalnız DARALTIR. Paket kapsamı kiracıyı daraltır, host'u (paketi yok)
/// elemez; rol kapsamı herkese uygulanır, harf duyarsız.
/// </summary>
public class MacroSetting_Tests
{
    private static MacroSetting With(PackageCode[] packages, string[] roles)
    {
        var setting = new MacroSetting(Guid.NewGuid(), "TaskCreate");
        setting.Set(null, null, false, null, false, packages, roles);
        return setting;
    }

    [Fact]
    public void Bos_kapsam_herkese_acik()
    {
        var setting = With(Array.Empty<PackageCode>(), Array.Empty<string>());

        setting.IsInScope(PackageCode.Basic, Array.Empty<string>()).ShouldBeTrue();
        setting.IsInScope(null, Array.Empty<string>()).ShouldBeTrue();
    }

    [Fact]
    public void Paket_kapsami_kiraciyi_daraltir_hostu_elemez()
    {
        var setting = With(new[] { PackageCode.Premium, PackageCode.Enterprise }, Array.Empty<string>());

        setting.IsInScope(PackageCode.Basic, Array.Empty<string>()).ShouldBeFalse();
        setting.IsInScope(PackageCode.Enterprise, Array.Empty<string>()).ShouldBeTrue();
        setting.IsInScope(null, Array.Empty<string>()).ShouldBeTrue(); // host
    }

    [Fact]
    public void Rol_kapsami_harf_duyarsiz_ve_herhangi_biri_yeter()
    {
        var setting = With(Array.Empty<PackageCode>(), new[] { "Muhasebe", "Proje Sorumlusu" });

        setting.IsInScope(PackageCode.Basic, new[] { "muhasebe" }).ShouldBeTrue();
        setting.IsInScope(PackageCode.Basic, new[] { "Gözlemci" }).ShouldBeFalse();
        setting.IsInScope(null, Array.Empty<string>()).ShouldBeFalse(); // rol kapsamı host'a da uygulanır
    }

    [Fact]
    public void Paket_ve_rol_birlikte_saglanmali()
    {
        var setting = With(new[] { PackageCode.Enterprise }, new[] { "Muhasebe" });

        setting.IsInScope(PackageCode.Enterprise, new[] { "Muhasebe" }).ShouldBeTrue();
        setting.IsInScope(PackageCode.Basic, new[] { "Muhasebe" }).ShouldBeFalse();
        setting.IsInScope(PackageCode.Enterprise, new[] { "Gözlemci" }).ShouldBeFalse();
    }

    [Fact]
    public void Set_bos_metni_null_yapar_rolleri_ve_paketleri_duzenler()
    {
        var setting = new MacroSetting(Guid.NewGuid(), "ExpenseCreate");
        setting.Set("  ", " fa fa-bolt ", true, 5, true,
            new[] { PackageCode.Enterprise, PackageCode.Basic, PackageCode.Basic },
            new[] { " Muhasebe ", "muhasebe", "", "Gözlemci" });

        setting.DisplayName.ShouldBeNull();
        setting.Icon.ShouldBe("fa fa-bolt");
        setting.IsHidden.ShouldBeTrue();
        setting.SortOrder.ShouldBe(5);
        setting.DefaultPinned.ShouldBeTrue();
        setting.Packages.ShouldBe("Basic,Enterprise");
        setting.RoleNames().ShouldBe(new[] { "Muhasebe", "Gözlemci" });
    }
}
