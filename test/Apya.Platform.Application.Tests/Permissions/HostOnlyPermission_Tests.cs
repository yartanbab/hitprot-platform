using System;
using Apya.Platform.Permissions;
using Shouldly;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.Tests.Application.Permissions;

/// <summary>
/// Geri bildirim yönetimi ve Sistem Sağlığı izinleri yalnız host'a aittir (2026-09-28 UX
/// denetimi, ADM-01 / ROL-01 / ROL-03 / SHL-03). Kiracıya verilebildiklerinde kiracı CEO'su
/// GLOBAL ayarları (telemetri saklama süresi dahil) değiştirebiliyor, host ekranları kiracı
/// menüsünde görünüp 500 veriyordu. ABP kiracı bağlamında host-only izni reddeder; kiracı
/// rollerindeki eski grant satırları bu yüzden etkisiz kalır.
/// </summary>
public class HostOnlyPermission_Tests
{
    private static PermissionDefinition Definition(string name)
    {
        var context = new PermissionDefinitionContext(null!);
        new PlatformPermissionDefinitionProvider().Define(context);
        var permission = context.GetPermissionOrNull(name);
        permission.ShouldNotBeNull($"{name} tanımlı değil");
        return permission;
    }

    [Theory]
    [InlineData(PlatformPermissions.Feedbacks.Default)]
    [InlineData(PlatformPermissions.Feedbacks.Respond)]
    [InlineData(PlatformPermissions.Feedbacks.Assign)]
    [InlineData(PlatformPermissions.Feedbacks.Delete)]
    [InlineData(PlatformPermissions.Feedbacks.Export)]
    [InlineData(PlatformPermissions.Feedbacks.ManageSettings)]
    [InlineData(PlatformPermissions.SystemHealth.Default)]
    [InlineData(PlatformPermissions.SystemHealth.Resolve)]
    public void Host_yonetim_izni_kiraciya_verilemez(string name)
    {
        Definition(name).MultiTenancySide.ShouldBe(MultiTenancySides.Host);
    }
}
