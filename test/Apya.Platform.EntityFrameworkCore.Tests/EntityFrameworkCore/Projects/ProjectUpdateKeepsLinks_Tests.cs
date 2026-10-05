using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// 🔴 PRJ-02 · Proje güncelleme ucu hibe bağını SESSİZCE koparıyordu.
///
/// <para>Uç gelen <c>GrantId</c>'yi koşulsuz yazıyordu; alanı göndermeyen her istemci
/// (otomatik API, ileride yazılacak bir React formu) bağı null'a çekerdi. Koruma yalnız
/// Projects/Edit sayfasındaydı. Bu test sayfayı ATLAR ve servisi doğrudan çağırır —
/// korumanın sunucuya indiğini ölçmenin tek yolu bu.</para>
///
/// <para>Kayıt yeni iş biriminde depodan okunur (servis okuması aynı iş birimindeki
/// izlenen nesneyi geri verebilir).</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectUpdateKeepsLinks_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectAppService _projectAppService;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IUnitOfWorkManager _uowManager;
    private readonly ICurrentTenant _currentTenant;

    public ProjectUpdateKeepsLinks_Tests()
    {
        _projectAppService = GetRequiredService<IProjectAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Project> ReadStoredAsync(Guid id)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        var stored = await _projectRepository.GetAsync(id);
        await uow.CompleteAsync();
        return stored;
    }

    [Fact]
    public async Task Hibe_alanini_gondermeyen_guncelleme_bagi_koparmaz()
    {
        var grant = new Grant(Guid.NewGuid(), "Bağ Koruma Desteği", "Kurum", 300_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var code = "PL-" + Guid.NewGuid().ToString("N")[..6];
        var project = new Project(Guid.NewGuid(), _currentTenant.Id, grantId: grant.Id,
            name: "Hibeli proje " + code, code: code, description: "açıklama",
            totalBudget: 250_000m, hourlyRate: 300m, currency: "EUR");
        await _projectRepository.InsertAsync(project, autoSave: true);

        // Sayfayı atlayan bir istemci: yalnız değiştirmek istediği alanları gönderiyor.
        await _projectAppService.UpdateAsync(project.Id, new CreateProjectDto
        {
            Name = "Adı değişti " + code,
            Code = code,
            Description = "Yeni açıklama",
            TotalBudget = 250_000m,
            HourlyRate = 300m,
            Currency = "EUR",
        });

        var stored = await ReadStoredAsync(project.Id);
        stored.Name.ShouldBe("Adı değişti " + code, "güncelleme gerçekten uygulanmış olmalı");
        stored.GrantId.ShouldBe(grant.Id, "alan gönderilmedi diye hibe bağı kopmamalı");
    }
}
