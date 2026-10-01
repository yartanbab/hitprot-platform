using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// PRJ-01 — reddedilen proje güncellemesi veritabanında HİÇBİR alanı değiştirmez.
///
/// <para>Project.Update eskiden adı/kodu/açıklamayı atayıp SONRA bütçe ve tarih kuralını
/// denetliyordu. ABP denetim önleyicisi istisnada da iş biriminde SaveChanges çağırır; işlemsiz
/// koşan yolda (bu testler) yarım hâl kalıcı oluyordu. Üretimde Projects/Edit istisnayı yakalayıp
/// formu yeniden çizdiği için iş birimi tamamlanır — aynı yarım kayıt orada da yazılırdı.</para>
///
/// <para>Kayıt servis okumasıyla DEĞİL, yeni iş biriminde depodan okunur (servis okuması aynı
/// tuzağı gizleyebilir — bkz. hafıza: ABP denetimi istisnada da SaveChanges).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectUpdateRejected_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectAppService _projectAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IUnitOfWorkManager _uowManager;
    private readonly ICurrentTenant _currentTenant;

    public ProjectUpdateRejected_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> CreateProjectAsync()
    {
        var code = "PU-" + Guid.NewGuid().ToString("N").Substring(0, 6);
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, grantId: null,
            name: "Eski ad " + code, code: code, description: "Eski açıklama",
            totalBudget: 100m,
            startDate: new DateTime(2026, 1, 1),
            endDate: new DateTime(2026, 12, 31));
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project;
    }

    private async Task<Project> ReadStoredAsync(Guid id)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        var stored = await _projectRepository.GetAsync(id);
        await uow.CompleteAsync();
        return stored;
    }

    [Fact]
    public async Task Negatif_butceli_guncelleme_reddedilir_ve_hicbir_alan_yazilmaz()
    {
        var project = await CreateProjectAsync();

        var ex = await Should.ThrowAsync<BusinessException>(() => _projectAppService.UpdateAsync(project.Id, new CreateProjectDto
        {
            Name = "QA-UX yeni ad",
            Code = project.Code,
            Description = "Yeni açıklama",
            TotalBudget = -5m,
            StartDate = project.StartDate,
            EndDate = project.EndDate
        }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectBudgetInvalid);
        var stored = await ReadStoredAsync(project.Id);
        stored.Name.ShouldBe(project.Name);
        stored.Description.ShouldBe("Eski açıklama");
        stored.TotalBudget.ShouldBe(100m);
    }

    [Fact]
    public async Task Ters_tarihli_guncelleme_reddedilir_ve_hicbir_alan_yazilmaz()
    {
        var project = await CreateProjectAsync();

        var ex = await Should.ThrowAsync<BusinessException>(() => _projectAppService.UpdateAsync(project.Id, new CreateProjectDto
        {
            Name = "QA-UX yeni ad",
            Code = project.Code,
            Description = "Yeni açıklama",
            TotalBudget = 200m,
            StartDate = new DateTime(2026, 9, 27),
            EndDate = new DateTime(2026, 9, 1)
        }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.ProjectScheduleInvalid);
        var stored = await ReadStoredAsync(project.Id);
        stored.Name.ShouldBe(project.Name);
        stored.TotalBudget.ShouldBe(100m);
        stored.EndDate.ShouldBe(new DateTime(2026, 12, 31));
    }
}
