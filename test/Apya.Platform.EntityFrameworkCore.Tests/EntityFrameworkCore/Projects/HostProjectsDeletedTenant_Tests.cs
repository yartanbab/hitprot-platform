using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// D-2 · Host'un "tüm projeler" listesi silinmiş kiracıların projelerini göstermez ve saymaz (eskiden
/// "Bilinmeyen Müşteri" etiketiyle listede ve sayaçlardaydı); yaşayan kiracının projesi görünür.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class HostProjectsDeletedTenant_Tests : PlatformEntityFrameworkCoreTestBase
{
    private async Task<(Guid TenantId, Guid ProjectId)> TenantWithProjectAsync(string prefix)
    {
        var tenant = await WithUnitOfWorkAsync(async () =>
        {
            var t = await GetRequiredService<ITenantManager>().CreateAsync(prefix + Guid.NewGuid().ToString("N")[..6]);
            return await GetRequiredService<ITenantRepository>().InsertAsync(t, autoSave: true);
        });
        var projectId = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            using (GetRequiredService<ICurrentTenant>().Change(tenant.Id))
            {
                var suffix = projectId.ToString("N")[..6];
                await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                    new Project(projectId, tenant.Id, null, prefix + " Projesi " + suffix, "SK-" + suffix[..4], "açıklama"), autoSave: true);
            }
        });
        return (tenant.Id, projectId);
    }

    [Fact]
    public async Task Silinmis_kiracinin_projesi_host_listesinde_yok()
    {
        var (deletedTenant, deletedProject) = await TenantWithProjectAsync("Silinen");
        var (_, liveProject) = await TenantWithProjectAsync("Yasayan");
        await WithUnitOfWorkAsync(async () =>
        {
            var repo = GetRequiredService<ITenantRepository>();
            await repo.DeleteAsync(await repo.GetAsync(deletedTenant), autoSave: true);
        });

        var list = await GetRequiredService<IProjectAppService>().GetListAsync(
            new PagedAndSortedResultRequestDto { MaxResultCount = 1000 });

        list.Items.ShouldContain(p => p.Id == liveProject);
        list.Items.ShouldNotContain(p => p.Id == deletedProject);
        list.Items.ShouldNotContain(p => p.TenantName == "Bilinmeyen Müşteri");
        list.TotalCount.ShouldBe(list.Items.Count);
    }
}
