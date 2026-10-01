using System;
using System.Linq;
using System.Reflection;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görevi değiştiren granüler uçların metot düzeyi izin sözleşmesi (2026-09-28 UX denetimi,
/// ROL-02 / TSK-05 / CAL-01). Sınıf düzeyindeki Tasks.Default yalnız OKUMA iznidir; bu uçlar
/// ona düştüğünde salt-okur stajyer takvimden görev tamamlayıp erteleyebiliyordu.
///
/// <para>Entegrasyon testleri AddAlwaysAllowAuthorization kullandığı için izin reddi orada
/// ölçülemez; sözleşme öznitelik üzerinden kilitlenir. Sahiplik kuralının kendisi
/// <c>TaskItem.IsOwnedBy</c> testlerinde, uçlara bağlanışı canlı doğrulamada.</para>
/// </summary>
public class TaskMutationAuthorization_Tests
{
    [Theory]
    [InlineData(nameof(TaskAppService.UpdateStatusAsync), PlatformPermissions.Tasks.ChangeStatus)]
    [InlineData(nameof(TaskAppService.CancelAsync), PlatformPermissions.Tasks.ChangeStatus)]
    [InlineData(nameof(TaskAppService.RestoreFromCancelAsync), PlatformPermissions.Tasks.ChangeStatus)]
    [InlineData(nameof(TaskAppService.SetPriorityAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.DeferAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.UpdateScheduleAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.SetAssigneeAsync), PlatformPermissions.Tasks.Assign)]
    [InlineData(nameof(TaskAppService.AddChecklistItemAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.AddProjectChecklistItemAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.ToggleChecklistItemAsync), PlatformPermissions.Tasks.Edit)]
    [InlineData(nameof(TaskAppService.DeleteChecklistItemAsync), PlatformPermissions.Tasks.Edit)]
    public void Gorevi_degistiren_uc_metot_duzeyi_izin_ister(string method, string policy)
    {
        var info = typeof(TaskAppService).GetMethod(method, BindingFlags.Public | BindingFlags.Instance);
        info.ShouldNotBeNull($"{method} bulunamadı");

        var policies = info.GetCustomAttributes<AuthorizeAttribute>(inherit: true)
            .Select(a => a.Policy)
            .ToList();

        policies.ShouldContain(policy,
            $"{method} [Authorize({policy})] taşımıyor — sınıf düzeyi Tasks.Default (okuma) yeterli kalır");
    }
}
