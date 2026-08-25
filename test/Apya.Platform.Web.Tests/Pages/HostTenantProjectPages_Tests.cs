using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Host bağlamından KİRACIYA ait bir projenin sayfaları.
///
/// Canlıda görülen hata: /Projects listesi host'a tüm kiracıların projelerini
/// gösteriyordu ama karta basınca 404 geliyordu (denetim kaydındaki 8 adet 404'ün
/// tamamı bu desende). Bu testler kartın gittiği iki adresi host bağlamında
/// çağırır; düzeltme öncesi ikisi de 404'tü.
/// </summary>
public class HostTenantProjectPages_Tests : PlatformWebTestBase
{
    private static readonly Guid OtherTenantId = Guid.Parse("66666666-7777-8888-9999-aaaaaaaaaaaa");

    private async Task<Guid> CreateTenantProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var currentTenant = GetRequiredService<ICurrentTenant>();
            currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");

            var repository = GetRequiredService<IRepository<Project, Guid>>();
            await repository.InsertAsync(
                new Project(projectId, OtherTenantId, null, "Kiracı Projesi " + code, code,
                    "Host'tan erişim testi"),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Proje_detayi_host_baglamindan_acilir()
    {
        var projectId = await CreateTenantProjectAsync("HTP-1");

        var html = await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}");

        html.ShouldContain("HTP-1");
    }

    [Fact]
    public async Task Duzenleme_ekrani_host_baglamindan_acilir()
    {
        var projectId = await CreateTenantProjectAsync("HTP-2");

        var html = await GetResponseAsStringAsync($"/Projects/Edit/{projectId}");

        html.ShouldContain("HTP-2");
        html.ShouldContain("data-tab=\"files\"");
    }
}
