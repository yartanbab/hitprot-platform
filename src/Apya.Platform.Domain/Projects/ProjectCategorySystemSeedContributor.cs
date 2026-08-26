using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Sistem kategorilerini (Hibe / Etkinlik / Diğer) garanti eder.
///
/// Bu satırları migration da INSERT eder — orada olmak ZORUNDALAR, çünkü mevcut
/// projelerin CategoryId'si onlara işaret edecek şekilde taşınıyor ve FK ancak o
/// satırlar varken kurulabiliyor. Ama migration YOLUNDAN GEÇMEYEN veritabanları da
/// var: testler şemayı doğrudan MODELDEN kuruyor (EnsureCreated), dolayısıyla o
/// satırlar hiç oluşmuyordu ve proje eklemek "FOREIGN KEY constraint failed" ile
/// düşüyordu. Bu tohumlayıcı o boşluğu kapatır.
///
/// İki yol da idempotent: satır varsa hiçbir şey yapılmaz, mükerrer kayıt oluşmaz.
/// Yalnız HOST bağlamında çalışır — kayıtlar global (TenantId null), kiracı başına
/// kopyalanmazlar.
/// </summary>
public class ProjectCategorySystemSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<ProjectCategoryDefinition, Guid> _repository;
    private readonly IDataFilter _dataFilter;

    public ProjectCategorySystemSeedContributor(
        IRepository<ProjectCategoryDefinition, Guid> repository,
        IDataFilter dataFilter)
    {
        _repository = repository;
        _dataFilter = dataFilter;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (context.TenantId != null)
        {
            return;
        }

        // Filtre kapalı okunur: global satırlar kiracı filtresi açıkken görünmez ve
        // "yok" sanılıp yeniden eklenmeye çalışılırdı (PK çakışması).
        using (_dataFilter.Disable<IMultiTenant>())
        {
            await EnsureAsync(ProjectCategoryConsts.SystemIds.GrantProject,
                "Hibe Projesi", "fa-award", "brand", 1, ProjectCategory.GrantProject);

            await EnsureAsync(ProjectCategoryConsts.SystemIds.Event,
                "Etkinlik", "fa-calendar-days", "warning", 2, ProjectCategory.Event);

            await EnsureAsync(ProjectCategoryConsts.SystemIds.Other,
                "Diğer / Genel", "fa-diagram-project", "neutral", 3, ProjectCategory.Other);
        }
    }

    private async Task EnsureAsync(
        Guid id, string name, string icon, string tone, int order, ProjectCategory systemKey)
    {
        if (await _repository.FindAsync(c => c.Id == id) != null)
        {
            return;
        }

        await _repository.InsertAsync(
            new ProjectCategoryDefinition(id, tenantId: null, name, icon, tone, order, systemKey));
    }
}
