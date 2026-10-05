using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 DOC-02 · Proje konsolundaki hibe rozeti. Dönüşüm özeti kullanıcıya "evrak
/// başvuruda kalır, PROJEDEN erişilir" diye söz veriyor; bu rozet o sözün tuttuğu yer.
/// Rozet yoksa söz de yoktur, bu yüzden metinle birlikte kilitleniyor.
/// </summary>
public class ProjectGrantOriginChip_Tests : PlatformWebTestBase
{
    private static readonly Guid OriginTenantId = Guid.Parse("66666666-7777-8888-9999-bbbbbbbbbbbb");

    /// <summary>Katalog host'ta, proje ve başvuru kiracıda doğar — canlıdaki sahiplikle aynı.</summary>
    private async Task<(Guid ProjectId, Guid ApplicationId)> CreateConvertedProjectAsync(
        string code, string grantName, int documentCount)
    {
        var projectId = Guid.NewGuid();
        var applicationId = Guid.NewGuid();

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            var currentTenant = GetRequiredService<ICurrentTenant>();
            currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");

            var grant = new Grant(Guid.NewGuid(), grantName, "Kurum", 400_000m, minMatchScore: 0);
            await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
            var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/4", GrantCallStatus.Acik);
            await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);

            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, OriginTenantId, null, "Hibeden Doğan Proje " + code, code,
                    "Hibe köprüsü testi"),
                autoSave: true);

            var application = new GrantApplication(applicationId, OriginTenantId, call.Id);
            application.LinkToProject(projectId);
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(application, autoSave: true);

            var docRepo = GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
            for (var i = 0; i < documentCount; i++)
            {
                await docRepo.InsertAsync(new GrantApplicationDocument(
                    Guid.NewGuid(), OriginTenantId, applicationId, null, "Evrak " + (i + 1),
                    GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, false, i), autoSave: true);
            }

            await uow.CompleteAsync();
        }

        return (projectId, applicationId);
    }

    [Fact]
    public async Task Hibeden_dogan_projenin_konsolu_basvuru_ve_evrak_rozetini_basar()
    {
        var (projectId, applicationId) = await CreateConvertedProjectAsync("PGO-1", "Dijital Üretim Desteği", documentCount: 3);

        var html = await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}");

        html.ShouldContain("data-grant-origin=\"application\"");
        html.ShouldContain($"/Grants/Implementation?id={applicationId}");
        // 🔴 Program adı DÜZ string olarak basılır ve Razor onu HtmlEncoder'dan geçirir:
        // "Üretim" HTML kaynağında "&#xDC;retim" olur (tarayıcıda doğru görünür). Bu yüzden
        // ölçüt ASCII parçada aranıyor. Diğer sayfa testleri Türkçe metin arayabiliyor çünkü
        // onlar L[...] ile gelen LocalizedHtmlString'i ölçüyor — o kodlanmaz.
        html.ShouldContain("Dijital");
        html.ShouldContain("data-grant-origin=\"documents\"");
        html.ShouldContain($"/Grants/Documents?id={applicationId}");
    }

    /// <summary>Evrak yoksa ikinci rozet basılmaz: boş listeye götüren bağlantı iş çıkarır, bilgi vermez.</summary>
    [Fact]
    public async Task Evraksiz_basvuruda_yalniz_basvuru_rozeti_basilir()
    {
        var (projectId, _) = await CreateConvertedProjectAsync("PGO-2", "Tasarım Desteği", documentCount: 0);

        var html = await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}");

        html.ShouldContain("data-grant-origin=\"application\"");
        html.ShouldNotContain("data-grant-origin=\"documents\"");
    }

    [Fact]
    public async Task Hibesiz_projenin_konsolunda_rozet_yok()
    {
        var projectId = Guid.NewGuid();
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using (var uow = uowManager.Begin(requiresNew: true))
        {
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, OriginTenantId, null, "Sıradan Proje", "PGO-3", "hibesiz"),
                autoSave: true);
            await uow.CompleteAsync();
        }

        var html = await GetResponseAsStringAsync($"/Projects/ProjectDetails/{projectId}");

        html.ShouldContain("PGO-3");
        html.ShouldNotContain("data-grant-origin");
    }
}
