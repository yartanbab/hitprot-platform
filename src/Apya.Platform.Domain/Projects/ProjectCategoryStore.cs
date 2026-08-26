using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;

namespace Apya.Platform.Projects;

/// <summary>
/// Kategori tanımlarını okumanın TEK doğru yolu.
///
/// Sistem kategorileri global tutulur (TenantId = null). ABP'nin çok kiracılı veri
/// filtresi `TenantId == CurrentTenant.Id` uyguladığı için kiracı bağlamında bu satırlar
/// SESSİZCE elenir — düz bir repository çağrısı sistem kategorilerini hiç göremez.
/// Bu yüzden okuma filtre kapatılarak yapılır ve görünürlük burada elle kurulur:
/// global kayıtlar + içinde bulunulan kiracının kendi kayıtları.
///
/// Kiracı global bir satırı silemeyeceği için sistem kategorisini "gizleme" işi
/// <see cref="PlatformSettings.Projects.HiddenCategories"/> ayarında tutulur.
/// </summary>
public class ProjectCategoryStore : DomainService
{
    private readonly IRepository<ProjectCategoryDefinition, Guid> _repo;
    private readonly IDataFilter _dataFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingProvider _settingProvider;

    public ProjectCategoryStore(
        IRepository<ProjectCategoryDefinition, Guid> repo,
        IDataFilter dataFilter,
        ICurrentTenant currentTenant,
        ISettingProvider settingProvider)
    {
        _repo = repo;
        _dataFilter = dataFilter;
        _currentTenant = currentTenant;
        _settingProvider = settingProvider;
    }

    /// <summary>
    /// Geçerli kiracının görebildiği tüm kategoriler (pasifler ve gizlenmiş sistem
    /// kategorileri DAHİL), sıraya dizili. Ayarlar ekranı bunu kullanır.
    /// </summary>
    public async Task<List<ProjectCategoryDefinition>> GetAllAsync()
    {
        var tenantId = _currentTenant.Id;
        using (_dataFilter.Disable<IMultiTenant>())
        {
            var all = await _repo.GetListAsync(
                c => c.TenantId == null || c.TenantId == tenantId);

            return all
                .OrderBy(c => c.Order)
                .ThenBy(c => c.Name)
                .ToList();
        }
    }

    /// <summary>
    /// Gizlenmemiş kategoriler — kategori "var mı" sorusunun günlük cevabı.
    /// </summary>
    public async Task<List<ProjectCategoryDefinition>> GetVisibleAsync()
    {
        var hidden = await GetHiddenIdsAsync();
        return (await GetAllAsync()).Where(c => !hidden.Contains(c.Id)).ToList();
    }

    /// <summary>Yeni proje ekranında seçilebilecek kategoriler.</summary>
    public async Task<List<ProjectCategoryDefinition>> GetSelectableAsync()
        => (await GetVisibleAsync()).Where(c => c.IsActive).ToList();

    /// <summary>
    /// Id → tanım sözlüğü. Projeleri listelerken kategori adını/ikonunu basmak için;
    /// proje başına ayrı sorgu atmayı önler. Gizlenmiş kategoriler de İÇİNDEDİR —
    /// gizleme yeni seçimi engeller, geçmiş projenin etiketini silmez.
    /// </summary>
    public async Task<Dictionary<Guid, ProjectCategoryDefinition>> GetMapAsync()
        => (await GetAllAsync()).ToDictionary(c => c.Id);

    /// <summary>
    /// Seçim için geçerli tek kategori; kiracıya görünmüyor ya da pasifse null.
    /// </summary>
    public async Task<ProjectCategoryDefinition?> FindAsync(Guid id)
        => (await GetSelectableAsync()).FirstOrDefault(c => c.Id == id);

    /// <summary>
    /// Kategorinin davranış anahtarı — görev şablonu ve hibe skoru bununla çözülür.
    /// Kullanıcının eklediği kategoride null.
    /// </summary>
    public async Task<ProjectCategory?> GetSystemKeyAsync(Guid id)
        => (await GetMapAsync()).TryGetValue(id, out var c) ? c.SystemKey : null;

    /// <summary>
    /// Bu kiracıda gizlenmiş sistem kategorilerinin Id'leri. Ayar bozuk/eski Id
    /// içerse bile çözülemeyen parçalar sessizce atlanır.
    /// </summary>
    public async Task<HashSet<Guid>> GetHiddenIdsAsync()
    {
        var raw = await _settingProvider.GetOrNullAsync(PlatformSettings.Projects.HiddenCategories);
        if (string.IsNullOrWhiteSpace(raw))
        {
            return new HashSet<Guid>();
        }

        var ids = new HashSet<Guid>();
        foreach (var part in raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            if (Guid.TryParse(part, out var id) && id != ProjectCategoryConsts.SystemIds.Other)
            {
                ids.Add(id);
            }
        }

        return ids;
    }
}
