using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// Pano sütunu ve ekip üyesi yazılırken proje kimliği hiç okunmuyordu. Sütun listesinin OKUMA
/// ucu ilk çağrıda varsayılan sütunları yazdığı için herhangi bir kimlikle satır doğuyordu;
/// ekip üyesi ise başka kiracının projesine eklenince host'un o projedeki ekip görünümünde
/// adıyla beliriyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectChildForeignKeyGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("99990000-cccc-4000-8000-000000000061");
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000062");

    private readonly IBoardColumnAppService _columnAppService;
    private readonly IProjectMemberAppService _memberAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<BoardColumn, Guid> _columnRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter _dataFilter;

    public ProjectChildForeignKeyGuard_Tests()
    {
        _columnAppService = GetRequiredService<IBoardColumnAppService>();
        _memberAppService = GetRequiredService<IProjectMemberAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _columnRepository = GetRequiredService<IRepository<BoardColumn, Guid>>();
        _memberRepository = GetRequiredService<IRepository<ProjectMember, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _dataFilter = GetRequiredService<IDataFilter>();
    }

    private async Task<Guid> ProjectAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(
                Guid.NewGuid(), tenantId, null, "Alt kayıt projesi",
                "AKP-" + Guid.NewGuid().ToString("N")[..8], "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    }

    private async Task<int> ColumnCountAsync(Guid projectId)
    {
        using (_dataFilter.Disable<IMultiTenant>())
        {
            return (await _columnRepository.GetListAsync(c => c.ProjectId == projectId)).Count;
        }
    }

    private async Task<int> MemberCountAsync(Guid projectId)
    {
        using (_dataFilter.Disable<IMultiTenant>())
        {
            return (await _memberRepository.GetListAsync(m => m.ProjectId == projectId)).Count;
        }
    }

    /* ═══════════════ Pano sütunu ═══════════════ */

    [Fact]
    public async Task Baska_kiracinin_projesi_icin_sutun_listesi_satir_uretmez()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        using (_currentTenant.Change(Tenant))
        {
            await Should.ThrowAsync<EntityNotFoundException>(
                () => _columnAppService.GetListByProjectAsync(foreignProject));
        }

        (await ColumnCountAsync(foreignProject)).ShouldBe(0);
    }

    [Fact]
    public async Task Var_olmayan_proje_icin_sutun_listesi_satir_uretmez()
    {
        var missing = Guid.NewGuid();

        using (_currentTenant.Change(Tenant))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => _columnAppService.GetListByProjectAsync(missing));
        }

        (await ColumnCountAsync(missing)).ShouldBe(0);
    }

    [Fact]
    public async Task Baska_kiracinin_projesine_sutun_eklenemez()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        using (_currentTenant.Change(Tenant))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => _columnAppService.CreateAsync(
                new CreateBoardColumnDto { ProjectId = foreignProject, Name = "Yabancı sütun" }));
        }

        (await ColumnCountAsync(foreignProject)).ShouldBe(0);
    }

    /// <summary>Karşı yön: kiracı kendi projesinde varsayılan sütunlarını alır.</summary>
    [Fact]
    public async Task Kendi_projesinde_varsayilan_sutunlar_olusur()
    {
        var ownProject = await ProjectAsync(Tenant);

        using (_currentTenant.Change(Tenant))
        {
            (await _columnAppService.GetListByProjectAsync(ownProject)).Count.ShouldBe(4);
        }
    }

    /// <summary>Karşı yön: host kiracı projesinin panosunu açabilmeye devam eder.</summary>
    [Fact]
    public async Task Host_kiraci_projesinin_panosunu_acabilir()
    {
        var tenantProject = await ProjectAsync(OtherTenant);

        _currentTenant.Id.ShouldBeNull("test host bağlamında koşmalı");
        (await _columnAppService.GetListByProjectAsync(tenantProject)).Count.ShouldBe(4);
    }

    /* ═══════════════ Ekip üyesi ═══════════════ */

    [Fact]
    public async Task Baska_kiracinin_projesine_uye_eklenemez()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        using (_currentTenant.Change(Tenant))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => _memberAppService.AddAsync(
                new AddProjectMemberDto { ProjectId = foreignProject, UserId = Guid.NewGuid() }));
            await Should.ThrowAsync<EntityNotFoundException>(
                () => _memberAppService.BackfillFromAssigneesAsync(foreignProject));
        }

        (await MemberCountAsync(foreignProject)).ShouldBe(0);
    }
}
