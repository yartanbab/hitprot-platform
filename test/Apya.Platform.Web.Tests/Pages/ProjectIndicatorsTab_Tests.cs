using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>Ortak kurulum: bir proje, bir gösterge (hedef 200 kişi), bir ölçüm (90).</summary>
public abstract class ProjectIndicatorsTabTestBase : PlatformWebTestBase
{
    /// <summary>Razor ASCII dışı harfleri HTML varlığı olarak basar; karşılaştırma çözülmüş metinle yapılır.</summary>
    protected async Task<string> PageAsync(string url)
        => System.Net.WebUtility.HtmlDecode(await GetResponseAsStringAsync(url));

    protected async Task<(Guid ProjectId, Guid IndicatorId)> SeedAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Gösterge sekmesi projesi", "GSS-" + Guid.NewGuid().ToString("N")[..8], "");
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);

        var indicator = new ProjectIndicator(
            Guid.NewGuid(), null, project.Id, "Eğitilen kişi sayısı", "kişi", 0m, 200m, new DateTime(2020, 1, 1));
        await GetRequiredService<IRepository<ProjectIndicator, Guid>>().InsertAsync(indicator, autoSave: true);

        await GetRequiredService<IRepository<ProjectIndicatorEntry, Guid>>().InsertAsync(
            new ProjectIndicatorEntry(Guid.NewGuid(), null, indicator.Id, new DateTime(2019, 12, 1), 90m, "Aralık sayımı"),
            autoSave: true);

        return (project.Id, indicator.Id);
    }
}

/// <summary>
/// PRJ-08 · Proje sayfasındaki Göstergeler sekmesi ve pencereleri. Yüzde ve durum servisten gelir;
/// sayfa ikinci bir hesap yapmaz.
/// </summary>
public class ProjectIndicatorsTab_Tests : ProjectIndicatorsTabTestBase
{
    [Fact]
    public async Task Proje_sayfasi_gostergeler_sekmesini_ve_satiri_basar()
    {
        var (projectId, indicatorId) = await SeedAsync();

        var html = await PageAsync("/Projects/ProjectDetails/" + projectId);

        html.ShouldContain("id=\"btn-view-indicators\"", Case.Sensitive);
        html.ShouldContain("id=\"view-indicators\"", Case.Sensitive);
        html.ShouldContain("data-indicator-id=\"" + indicatorId + "\"", Case.Sensitive);
        html.ShouldContain("200 kişi", Case.Sensitive);
        html.ShouldContain("90 kişi", Case.Sensitive);
        html.ShouldContain("%45", Case.Sensitive);
        // Hedef tarihi geçmiş, hedefe ulaşılmamış → geride.
        html.ShouldContain("apya-chip-negative\">Geride<", Case.Sensitive);
        html.ShouldContain("Ölçümler (1)", Case.Sensitive);

        // Yönetme izni olan yazma düğmelerini görür.
        html.ShouldContain("id=\"btn-add-indicator\"", Case.Sensitive);
        html.ShouldContain("data-indicator-edit=\"" + indicatorId + "\"", Case.Sensitive);
        html.ShouldContain("data-indicator-delete=\"" + indicatorId + "\"", Case.Sensitive);
    }

    [Fact]
    public async Task Gosterge_penceresi_duzenlemede_kayitli_degerlerle_acilir()
    {
        var (projectId, indicatorId) = await SeedAsync();

        var html = await PageAsync(
            $"/Projects/IndicatorModal?projectId={projectId}&id={indicatorId}");

        html.ShouldContain("Göstergeyi Düzenle", Case.Sensitive);
        html.ShouldContain("value=\"Eğitilen kişi sayısı\"", Case.Sensitive);
        html.ShouldContain("value=\"kişi\"", Case.Sensitive);
        html.ShouldContain("value=\"2020-01-01\"", Case.Sensitive);

        (await PageAsync($"/Projects/IndicatorModal?projectId={projectId}"))
            .ShouldContain("Yeni Gösterge", Case.Sensitive);
    }

    [Fact]
    public async Task Olcum_penceresi_olcumleri_listeler_ve_yeni_olcum_alanlarini_basar()
    {
        var (projectId, indicatorId) = await SeedAsync();

        var html = await PageAsync(
            $"/Projects/IndicatorEntriesModal?projectId={projectId}&indicatorId={indicatorId}");

        html.ShouldContain("01.12.2019", Case.Sensitive);
        html.ShouldContain("Aralık sayımı", Case.Sensitive);
        html.ShouldContain("name=\"Entry.EntryDate\"", Case.Sensitive);
        html.ShouldContain("data-indicator-entry-delete=", Case.Sensitive);
    }
}

/// <summary>
/// Göstergeleri görebilen ama YÖNETEMEYEN kullanıcı: sekme ve satırlar basılır, yazma düğmeleri ve
/// ölçüm giriş alanları basılmaz. (Sunucu uçları yönetme iznini ayrıca ister.)
/// </summary>
public class ProjectIndicatorsTabReadOnly_Tests : ProjectIndicatorsTabTestBase
{
    protected override void ConfigureServices(IServiceCollection services)
    {
        base.ConfigureServices(services);

        var deny = new DenyPermissionsAuthorizationService(PlatformPermissions.Projects.ManageIndicators);
        services.Replace(ServiceDescriptor.Singleton<IAuthorizationService>(deny));
        services.Replace(ServiceDescriptor.Singleton<IAbpAuthorizationService>(deny));
    }

    [Fact]
    public async Task Yonetme_izni_olmayana_yazma_dugmeleri_basilmaz()
    {
        var (projectId, indicatorId) = await SeedAsync();

        var html = await PageAsync("/Projects/ProjectDetails/" + projectId);

        html.ShouldContain("data-indicator-id=\"" + indicatorId + "\"", Case.Sensitive);
        html.ShouldContain("data-indicator-entries=\"" + indicatorId + "\"", Case.Sensitive);
        html.ShouldNotContain("id=\"btn-add-indicator\"", Case.Sensitive);
        html.ShouldNotContain("data-indicator-edit=", Case.Sensitive);
        html.ShouldNotContain("data-indicator-delete=", Case.Sensitive);

        var entries = await PageAsync(
            $"/Projects/IndicatorEntriesModal?projectId={projectId}&indicatorId={indicatorId}");

        entries.ShouldContain("Aralık sayımı", Case.Sensitive);
        entries.ShouldNotContain("name=\"Entry.EntryDate\"", Case.Sensitive);
        entries.ShouldNotContain("data-indicator-entry-delete=", Case.Sensitive);
    }
}
