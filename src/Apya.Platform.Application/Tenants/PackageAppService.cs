using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Localization;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Faz 2: Paket (edition) yönetimi — host. Paketlerin feature içeriklerini düzenler ve
/// istenirse o pakete sahip tenant'lara yeniden uygular. Host yetkisiyle (TenantManagement) korunur.
/// </summary>
[Authorize(TenantManagementPermissions.Tenants.Update)]
public class PackageAppService : PlatformAppService, IPackageAppService
{
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantPackageManager _packageManager;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly IStringLocalizerFactory _stringLocalizerFactory;
    private readonly PackageCeilingStore _ceilingStore;

    public PackageAppService(
        IRepository<PlatformPackage, Guid> packageRepository,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantPackageManager packageManager,
        IPermissionDefinitionManager permissionDefinitionManager,
        IStringLocalizerFactory stringLocalizerFactory,
        PackageCeilingStore ceilingStore)
    {
        _packageRepository = packageRepository;
        _tenantProfileRepository = tenantProfileRepository;
        _packageManager = packageManager;
        _permissionDefinitionManager = permissionDefinitionManager;
        _stringLocalizerFactory = stringLocalizerFactory;
        _ceilingStore = ceilingStore;
    }

    public async Task<List<PackageDto>> GetListAsync()
    {
        await _packageManager.EnsureDefaultPackagesAsync();
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features, p => p.Permissions);
        var list = await AsyncExecuter.ToListAsync(queryable.OrderBy(p => p.DisplayOrder));
        var total = (await _packageManager.GetTenantPermissionNamesAsync()).Count;
        return list.Select(p => ToDto(p, total)).ToList();
    }

    public async Task UpdateFeaturesAsync(UpdatePackageFeaturesDto input)
    {
        var pkg = await GetEntityAsync(input.Code);

        // Yalnız katalogdaki feature'ları işle; toggle'ı true/false, sayısalı pozitif int'e normalize et.
        foreach (var meta in PackageFeatureCatalog.Managed)
        {
            // Modül feature'ları izin ağacından türetilir; buradan yazılırsa ilk izin
            // kaydında geri alınır ve host'a yalan söylemiş oluruz.
            if (PackageFeatureGates.Map.ContainsKey(meta.Name)) { continue; }

            if (!input.Features.TryGetValue(meta.Name, out var raw)) { continue; }

            string value;
            if (meta.IsNumeric)
            {
                value = int.TryParse(raw, out var n) ? Math.Max(0, n).ToString() : "0";
            }
            else
            {
                var on = string.Equals(raw, "true", StringComparison.OrdinalIgnoreCase)
                         || raw == "on" || raw == "1";
                value = on ? "true" : "false";
            }

            pkg.SetFeature(GuidGenerator.Create(), meta.Name, value);
        }

        await _packageRepository.UpdateAsync(pkg, autoSave: true);
    }

    public async Task<PackagePermissionTreeDto> GetPermissionsAsync(PackageCode code)
    {
        await _packageManager.EnsureDefaultPackagesAsync();

        var pkg = await GetEntityWithPermissionsAsync(code);
        var included = pkg.ToPermissionNames().ToHashSet(StringComparer.Ordinal);

        var dto = new PackagePermissionTreeDto { Code = pkg.Code, Name = pkg.Name };

        // Ağaç, state checker'lardan GEÇMEDEN okunur: host paketi düzenlerken tüm izinleri
        // görmelidir — hangilerinin kapalı olacağına burada karar veriyor.
        foreach (var group in await _permissionDefinitionManager.GetGroupsAsync())
        {
            var groupDto = new PackagePermissionGroupDto
            {
                Name = group.Name,
                DisplayName = group.DisplayName.Localize(_stringLocalizerFactory)
            };

            foreach (var permission in group.Permissions)
            {
                AddNode(groupDto.Permissions, permission, parentName: null, depth: 0, included);
            }

            if (groupDto.Permissions.Count > 0)
            {
                dto.Groups.Add(groupDto);
            }
        }

        return dto;
    }

    private void AddNode(
        List<PackagePermissionNodeDto> target,
        PermissionDefinition permission,
        string? parentName,
        int depth,
        HashSet<string> included)
    {
        // Host'a özel izinler (kiracı yönetimi, host feature yönetimi) pakete EKLENEMEZ:
        // tenant'ın yetki ekranında zaten listelenmezler, işaretlemek ölü kutu olurdu.
        // Yine de ağaçta KİLİTLİ gösterilirler — büsbütün gizlemek "eksik mi kaldı?"
        // sorusunu doğuruyordu. Kaydetme tarafı bunları ayrıca eler (UpdatePermissionsAsync).
        var isHostOnly = !permission.MultiTenancySide.HasFlag(MultiTenancySides.Tenant);

        target.Add(new PackagePermissionNodeDto
        {
            Name = permission.Name,
            DisplayName = permission.DisplayName.Localize(_stringLocalizerFactory),
            ParentName = parentName,
            Depth = depth,
            IsIncluded = !isHostOnly && included.Contains(permission.Name),
            IsHostOnly = isHostOnly
        });

        foreach (var child in permission.Children)
        {
            AddNode(target, child, permission.Name, depth + 1, included);
        }
    }

    public async Task UpdatePermissionsAsync(UpdatePackagePermissionsDto input)
    {
        var pkg = await GetEntityWithPermissionsAsync(input.Code);

        // Yalnız gerçekten tanımlı tenant izinleri yazılır: silinmiş/yanlış yazılmış ad
        // tavanda ölü satır olarak kalmasın.
        var known = (await _packageManager.GetTenantPermissionNamesAsync()).ToHashSet(StringComparer.Ordinal);
        var selected = input.PermissionNames
            .Where(known.Contains)
            .Distinct(StringComparer.Ordinal)
            .ToList();

        pkg.ReplacePermissions(selected.Select(name => (GuidGenerator.Create(), name)));

        // Modül feature'ları seçimden TÜRETİLİR: host "Ai.Prompts"u işaretleyip AiAssist'i
        // açmayı unutursa izin verilmiş ama modül kapalı kalırdı (menü gizli, RequireFeatures
        // izni düşürür). Feature ile izin listesi böylece çelişemez.
        foreach (var kv in PackageFeatureGates.DeriveFeatureValues(selected))
        {
            pkg.SetFeature(GuidGenerator.Create(), kv.Key, kv.Value);
        }

        await _packageRepository.UpdateAsync(pkg, autoSave: true);
        await _ceilingStore.InvalidatePackageAsync(input.Code);
    }

    public async Task<int> ReapplyToTenantsAsync(PackageCode code)
    {
        var profiles = await _tenantProfileRepository.GetListAsync(p => p.PackageCode == code);
        foreach (var profile in profiles)
        {
            await _packageManager.ApplyPackageAsync(profile.TenantId, code);
        }
        return profiles.Count;
    }

    /// <summary>Feature'lar da yüklenir: izin kaydı feature değerlerini türetip ÜZERİNE yazar
    /// (koleksiyon yüklü değilse SetFeature mevcut satırı göremez ve tekil indeksi ihlal eder).</summary>
    private async Task<PlatformPackage> GetEntityWithPermissionsAsync(PackageCode code)
    {
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features, p => p.Permissions);
        var pkg = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(p => p.Code == code));
        if (pkg == null)
        {
            throw new UserFriendlyException($"Paket bulunamadı: {code}");
        }
        return pkg;
    }

    private async Task<PlatformPackage> GetEntityAsync(PackageCode code)
    {
        var queryable = await _packageRepository.WithDetailsAsync(p => p.Features);
        var pkg = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(p => p.Code == code));
        if (pkg == null)
        {
            throw new UserFriendlyException($"Paket bulunamadı: {code}");
        }
        return pkg;
    }

    private static PackageDto ToDto(PlatformPackage p, int totalPermissionCount)
    {
        var stored = p.ToFeatureValues();
        return new PackageDto
        {
            Code = p.Code,
            Name = p.Name,
            Description = p.Description,
            DisplayOrder = p.DisplayOrder,
            PermissionCount = p.Permissions.Count,
            TotalPermissionCount = totalPermissionCount,
            Features = PackageFeatureCatalog.Managed.Select(m => new PackageFeatureDto
            {
                FeatureName = m.Name,
                DisplayName = m.DisplayName,
                IsNumeric = m.IsNumeric,
                IsDerived = PackageFeatureGates.Map.ContainsKey(m.Name),
                Value = stored.TryGetValue(m.Name, out var v) ? v : (m.IsNumeric ? "0" : "false")
            }).ToList()
        };
    }
}
