using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// CNV-07 · Proje kodu kiracı bazında tekildir ve bunu VERİTABANI garanti eder. Kod "oku + artır"
/// ile üretildiği için eşzamanlı iki oluşturma aynı kodu alabiliyordu; servis katmanındaki ön
/// denetim yarışı kapatmaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectCodeUniqueness_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantA = Guid.Parse("55550000-aaaa-4000-8000-000000000031");
    private static readonly Guid TenantB = Guid.Parse("66660000-bbbb-4000-8000-000000000032");

    private readonly IRepository<Project, Guid> _projects;
    private readonly ICurrentTenant _currentTenant;

    public ProjectCodeUniqueness_Tests()
    {
        _projects = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static string NewCode() => "TKL-" + Guid.NewGuid().ToString("N")[..8];

    private Task<Guid> InsertAsync(Guid? tenantId, string code) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(Guid.NewGuid(), tenantId, null, "Tekillik " + code, code, "açıklama");
            await _projects.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    });

    [Fact]
    public async Task Ayni_Kiracida_Ayni_Kod_Ikinci_Kez_Yazilamaz()
    {
        var code = NewCode();
        await InsertAsync(TenantA, code);

        await Should.ThrowAsync<DbUpdateException>(() => InsertAsync(TenantA, code));
    }

    [Fact]
    public async Task Baska_Kiraci_Ayni_Kodu_Kullanabilir()
    {
        var code = NewCode();
        await InsertAsync(TenantA, code);

        await Should.NotThrowAsync(() => InsertAsync(TenantB, code));
    }

    /// <summary>Host (kiracısız) projeler ayrı indeksle korunur; PostgreSQL'de NULL'lar eşit sayılmaz.</summary>
    [Fact]
    public async Task Host_Baglaminda_Ayni_Kod_Ikinci_Kez_Yazilamaz()
    {
        var code = NewCode();
        await InsertAsync(null, code);

        await Should.ThrowAsync<DbUpdateException>(() => InsertAsync(null, code));
    }

    /// <summary>İndeks yalnız canlı satırlarda: silinen projenin kodu yeniden kullanılabilir.</summary>
    [Fact]
    public async Task Silinen_Projenin_Kodu_Yeniden_Kullanilabilir()
    {
        var code = NewCode();
        var id = await InsertAsync(TenantA, code);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(TenantA))
            {
                await _projects.DeleteAsync(id, autoSave: true);
            }
        });

        await Should.NotThrowAsync(() => InsertAsync(TenantA, code));
    }
}
