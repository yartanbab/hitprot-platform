using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tenants;

/// <summary>
/// Paketin izin tavanındaki tek izin. Listede olmayan izin, o paketteki tenant'a
/// verilemez (yetki ekranında hiç görünmez). Bkz. PackagePermissionStateChecker.
/// </summary>
public class PlatformPackagePermission : Entity<Guid>
{
    public Guid PackageId { get; private set; }
    public string PermissionName { get; private set; } = null!;

    protected PlatformPackagePermission() { }

    public PlatformPackagePermission(Guid id, Guid packageId, string permissionName)
        : base(id)
    {
        PackageId = packageId;
        PermissionName = permissionName;
    }
}
