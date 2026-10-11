using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Tasks.Drafts;
using Apya.Platform.Tasks.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Xunit;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev oluşturma izni (Tasks.Create) OLMAYAN kullanıcı görev oluşturamaz.
///
/// <para>Görev servisinin oluşturma ucu kendi kodunu yazar ve temel sınıfın oluşturma kapısını
/// çağırmıyordu: tanımlı izin hiç işlemiyor, görev yalnız görüntüleme izniyle API'den
/// oluşturulabiliyordu. Taslak onayı da görev yaratır ve aynı izni aramıyordu.</para>
///
/// <para>Test barındırıcısı normalde her izne "evet" der; bu sınıf onu TEK izni reddedecek
/// şekilde kurar.</para>
/// </summary>
public class TaskCreatePermission_Tests : PlatformWebTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var denyCreate = new DenyPermissionsAuthorizationService(PlatformPermissions.Tasks.Create);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(denyCreate));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(denyCreate));
    }

    [Fact]
    public async Task Olusturma_izni_olmayan_gorev_olusturamaz()
    {
        var tasks = GetRequiredService<ITaskAppService>();

        await Should.ThrowAsync<AbpAuthorizationException>(() => tasks.CreateAsync(new CreateUpdateTaskDto
        {
            Title = "İzinsiz görev",
            StartDate = new DateTime(2026, 10, 12)
        }));
    }

    [Fact]
    public async Task Olusturma_izni_olmayan_taslak_onaylayip_gorev_yaratamaz()
    {
        var drafts = GetRequiredService<IDraftTaskAppService>();

        await Should.ThrowAsync<AbpAuthorizationException>(() => drafts.ApproveDraftsAsync(new ApproveDraftsInput
        {
            BatchId = Guid.NewGuid(),
            SelectedDraftIds = new List<Guid>()
        }));
    }
}
