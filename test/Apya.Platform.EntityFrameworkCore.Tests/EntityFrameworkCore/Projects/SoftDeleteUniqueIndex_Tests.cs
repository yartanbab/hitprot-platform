using System;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// Tekil indeksler yalnız CANLI satırlar arasında geçerli olmalı. ABP soft-delete satırı
/// tabloda bırakır; IsDeleted filtresi olmayan UNIQUE indeks onun anahtarını kalıcı
/// rezerve ediyordu — silinen kategori aynı adla yeniden açılamıyordu (SQL 2601 → 500,
/// canlı doğrulandı 2026-09-04). Bu test filtrenin varlığını gerçek DB kısıtı üzerinden
/// bağlar; PlatformDbContext'teki HasFilter kaldırılırsa ilk test düşer.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SoftDeleteUniqueIndex_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IRepository<ProjectCategoryDefinition, Guid> _categories;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter _dataFilter;
    private readonly IGuidGenerator _guids;

    public SoftDeleteUniqueIndex_Tests()
    {
        _categories    = GetRequiredService<IRepository<ProjectCategoryDefinition, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _dataFilter    = GetRequiredService<IDataFilter>();
        _guids         = GetRequiredService<IGuidGenerator>();
    }

    [Fact]
    public async Task Silinen_kategorinin_adi_ayni_kiracida_yeniden_kullanilabilir()
    {
        var tenantId = Guid.NewGuid();
        const string name = "İndeks-Testi-Kategori";

        using (_currentTenant.Change(tenantId))
        {
            var first = await WithUnitOfWorkAsync(() =>
                _categories.InsertAsync(NewCategory(tenantId, name), autoSave: true));

            await WithUnitOfWorkAsync(() => _categories.DeleteAsync(first.Id));

            // Düzeltmeden önce burası "duplicate key" ile düşüyordu.
            await WithUnitOfWorkAsync(() =>
                _categories.InsertAsync(NewCategory(tenantId, name), autoSave: true));

            var live = await WithUnitOfWorkAsync(() =>
                _categories.CountAsync(x => x.TenantId == tenantId && x.Name == name));
            live.ShouldBe(1);

            using (_dataFilter.Disable<ISoftDelete>())
            {
                var all = await WithUnitOfWorkAsync(() =>
                    _categories.CountAsync(x => x.TenantId == tenantId && x.Name == name));
                all.ShouldBe(2); // silinen satır tabloda duruyor, anahtarı artık rezerve etmiyor
            }
        }
    }

    [Fact]
    public async Task Canli_satirlar_arasinda_tekillik_korunur()
    {
        var tenantId = Guid.NewGuid();
        const string name = "İndeks-Testi-Tekil";

        using (_currentTenant.Change(tenantId))
        {
            await WithUnitOfWorkAsync(() =>
                _categories.InsertAsync(NewCategory(tenantId, name), autoSave: true));

            var threw = false;
            try
            {
                await WithUnitOfWorkAsync(() =>
                    _categories.InsertAsync(NewCategory(tenantId, name), autoSave: true));
            }
            catch (Exception)
            {
                threw = true;
            }

            threw.ShouldBeTrue("filtre indeksi daraltır ama canlı satırlar arasındaki tekilliği kaldırmamalı");
        }
    }

    private ProjectCategoryDefinition NewCategory(Guid tenantId, string name)
        => new ProjectCategoryDefinition(_guids.Create(), tenantId, name, "fa-flask", "blue", 1);
}
