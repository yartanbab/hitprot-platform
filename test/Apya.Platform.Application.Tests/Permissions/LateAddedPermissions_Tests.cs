using Apya.Platform.Permissions;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.Permissions;

/// <summary>
/// Paket izin tavanı (2026-08-14) kurulduktan SONRA tanımlanan kiracı izinleri
/// <c>TenantPackageManager.LateAddedPermissions</c> listesinde olmalı; yoksa kurulu sistemlerin
/// paket satırlarına hiç girmez ve hiçbir kiracıda açılamaz (2026-11-19 izin denetimi).
/// </summary>
public class LateAddedPermissions_Tests
{
    [Theory]
    [InlineData(PlatformPermissions.Documents.ManageMeta)]
    [InlineData(PlatformPermissions.Documents.BulkOperations)]
    [InlineData(PlatformPermissions.Documents.ManageCompliance)]
    [InlineData(PlatformPermissions.Documents.GenerateReports)]
    [InlineData(PlatformPermissions.Documents.ShareExternally)]
    [InlineData(PlatformPermissions.Documents.Administer)]
    public void Dokuman_alt_izni_tavana_sonradan_tamamlanir_ama_kapisi_kapali_pakete_girmez(string name)
    {
        TenantPackageManager.LateAddedPermissions.ShouldContain(name);

        // Basic'te Dokümanlar kapalı: telafi onu Basic'in tavanına taşımamalı.
        PackagePermissionDefaults.IsIncluded(PackageCode.Basic, name).ShouldBeFalse();
        PackagePermissionDefaults.IsIncluded(PackageCode.Standard, name).ShouldBeTrue();
    }
}
