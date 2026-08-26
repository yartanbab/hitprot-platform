using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

/// <summary>
/// Görev konsolu ve board'un "Proje" seçicisi bu hafif uçtan besleniyor.
/// Önce ikisi de <c>project.getList({ maxResultCount: 1000 })</c> çağırıyordu —
/// 1000 TAM proje DTO'su yalnız bir açılır listeyi doldurmak için indiriliyor ve
/// asıl liste isteğiyle yarışıyordu.
///
/// Etiket "Ad (KOD)" biçiminde olduğu için <see cref="ProjectLookupDto.Code"/>
/// DOLU dönmek zorunda: boş kalsaydı kod sessizce kaybolur, filtre etiketleri
/// aynı adlı iki projeyi ayırt edilemez hale getirirdi.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_ProjectsLookup_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_ProjectsLookup_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync(string name, string code)
    {
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: name, code: code, description: "test");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    [Fact]
    public async Task Lookup_kod_alanini_DOLU_dondurur()
    {
        var marker = Guid.NewGuid().ToString("N")[..8];
        var code = "KOD-" + marker;
        await CreateProjectAsync($"lookup-{marker}", code);

        var lookup = await _taskAppService.GetProjectsLookupAsync();

        var row = lookup.SingleOrDefault(p => p.Name == $"lookup-{marker}");
        row.ShouldNotBeNull();
        row!.Code.ShouldBe(code);
    }

    [Fact]
    public async Task Lookup_ada_gore_SIRALI_doner()
    {
        // Board açılışta ilk satırı otomatik seçiyor; sıra belirsiz olursa
        // hangi projenin açılacağı da belirsiz olur.
        var marker = Guid.NewGuid().ToString("N")[..8];
        await CreateProjectAsync($"{marker}-zeta", "K1-" + marker);
        await CreateProjectAsync($"{marker}-alfa", "K2-" + marker);

        var lookup = await _taskAppService.GetProjectsLookupAsync();

        var isimler = lookup.Select(p => p.Name).Where(n => n.StartsWith(marker)).ToList();
        isimler.ShouldBe(isimler.OrderBy(n => n, StringComparer.Ordinal).ToList());
    }
}
