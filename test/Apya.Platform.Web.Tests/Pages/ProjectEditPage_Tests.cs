using System;
using System.Threading.Tasks;
using Apya.Platform.Application.Projects;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages.Projects;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Proje düzenleme ekranı (/Projects/Edit/{id}).
///
/// Test host'u AddAlwaysAllowAuthorization kullanır — yani sayfa burada TAM olarak
/// render olur ve Razor/DI/tag-helper hataları yakalanır. Gerçek host'taki izin
/// kapısı ayrıca reflection ile doğrulanır (aşağıdaki iki test).
/// </summary>
public class ProjectEditPage_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectAsync(string code)
    {
        var projectId = Guid.NewGuid();

        // Web test tabanında WithUnitOfWorkAsync yok — UoW elle açılır.
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<Project, Guid>>();
            var currentTenant = GetRequiredService<ICurrentTenant>();

            await repository.InsertAsync(
                new Project(projectId, currentTenant.Id, null, "Düzenleme Testi", code, "Düzenleme ekranı testi"),
                autoSave: true);

            await uow.CompleteAsync();
        }

        return projectId;
    }

    [Fact]
    public async Task Sayfa_uc_sekmeyle_render_olur()
    {
        var projectId = await CreateProjectAsync("EDIT-1");

        var html = await GetResponseAsStringAsync($"/Projects/Edit/{projectId}");

        html.ShouldContain("data-tab=\"info\"");
        html.ShouldContain("data-tab=\"files\"");
        html.ShouldContain("data-tab=\"danger\"");
        html.ShouldContain("Kapak görseli");
        html.ShouldContain("Proje dosyaları");
    }

    [Fact]
    public async Task Silme_yalniz_proje_kodu_yazilarak_yapilir()
    {
        var projectId = await CreateProjectAsync("EDIT-2");

        var html = await GetResponseAsStringAsync($"/Projects/Edit/{projectId}?tab=danger");

        // Onay kutusu var ve düğme kod eşleşene kadar kapalı doğuyor.
        html.ShouldContain("DeleteConfirmCode");
        html.ShouldContain("EDIT-2");
        html.ShouldContain("id=\"DeleteProjectButton\" disabled");
    }

    [Fact]
    public async Task Guid_olmayan_id_sayfayi_acmaz()
    {
        // Rota kısıtı {id:Guid} — serbest metin bu sayfaya hiç ulaşmamalı.
        // Kesin durum koduna bağlanmıyoruz: gerçek host'ta 404 (ölçüldü), test
        // host'unda eşleşmeyen rota yönlendirmeye düşüyor (302). Değişmez olan,
        // sayfanın RENDER OLMAMASI.
        var response = await Client.GetAsync("/Projects/Edit/not-a-guid");

        ((int)response.StatusCode).ShouldNotBe(200);
    }

    [Fact]
    public void Sayfa_Edit_iznine_bagli()
    {
        typeof(EditModel).IsDefined(typeof(AuthorizeAttribute), inherit: true)
            .ShouldBeTrue("EditModel [Authorize] taşımıyor — düzenleme ekranı izinsiz açılır");
    }

    /// <summary>
    /// SEC: CrudAppService'in Update/Create politika adları set edilmediği ve override'lar
    /// CheckPolicy çağırmadığı için güncelleme/oluşturma yalnız Projects.Default'a bakıyordu.
    /// Bu test o boşluğun geri gelmesini engeller.
    /// </summary>
    [Theory]
    [InlineData(nameof(ProjectAppService.UpdateAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.CreateAsync), PlatformPermissions.Projects.Create)]
    [InlineData(nameof(ProjectAppService.DeleteAsync), PlatformPermissions.Projects.Delete)]
    [InlineData(nameof(ProjectAppService.AddAttachmentAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.DeleteAttachmentAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.SetCoverImageAsync), PlatformPermissions.Projects.Edit)]
    [InlineData(nameof(ProjectAppService.RemoveCoverImageAsync), PlatformPermissions.Projects.Edit)]
    public void Yazma_metotlari_dogru_izne_bagli(string methodName, string expectedPolicy)
    {
        var method = typeof(ProjectAppService).GetMethod(methodName);
        method.ShouldNotBeNull($"{methodName} bulunamadı");

        var attribute = (AuthorizeAttribute?)Attribute.GetCustomAttribute(method!, typeof(AuthorizeAttribute));

        attribute.ShouldNotBeNull($"{methodName} [Authorize] taşımıyor");
        attribute!.Policy.ShouldBe(expectedPolicy);
    }
}
