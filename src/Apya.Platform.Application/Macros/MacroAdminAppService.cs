using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Macros;

/// <summary>
/// Host: Makro Ekran yönetimi (bkz. <see cref="IMacroAdminAppService"/>). İzin host-only
/// (<see cref="PlatformPermissions.Macros.Manage"/>); kiracı bağlamında çağrı reddedilir.
/// </summary>
[Authorize(PlatformPermissions.Macros.Manage)]
public class MacroAdminAppService : PlatformAppService, IMacroAdminAppService
{
    private readonly IRepository<MacroSetting, Guid> _settingRepository;
    private readonly IRepository<MacroUsageDaily, Guid> _usageRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly MacroSettingsProvider _provider;

    public MacroAdminAppService(
        IRepository<MacroSetting, Guid> settingRepository,
        IRepository<MacroUsageDaily, Guid> usageRepository,
        IDataFilter<IMultiTenant> mtFilter,
        MacroSettingsProvider provider)
    {
        _settingRepository = settingRepository;
        _usageRepository = usageRepository;
        _mtFilter = mtFilter;
        _provider = provider;
    }

    public async Task<List<MacroAdminDto>> GetListAsync()
    {
        EnsureHostContext();

        var settings = (await _settingRepository.GetListAsync()).ToDictionary(s => s.MacroKey, StringComparer.Ordinal);
        var usage = await GetUsageAcrossTenantsAsync();

        return MacroCatalog.All
            .Select((definition, index) => (Dto: ToDto(definition, settings.GetValueOrDefault(definition.Key), usage), Index: index))
            .OrderBy(x => x.Dto.SortOrder ?? int.MaxValue)
            .ThenBy(x => x.Index)
            .Select(x => x.Dto)
            .ToList();
    }

    public async Task<MacroAdminDto> UpdateAsync(string key, UpdateMacroSettingDto input)
    {
        EnsureHostContext();
        var definition = FindDefinition(key);
        var roles = NormalizeRoles(input.Roles);

        var setting = await _settingRepository.FirstOrDefaultAsync(s => s.MacroKey == definition.Key);
        if (setting == null)
        {
            setting = new MacroSetting(GuidGenerator.Create(), definition.Key);
            setting.Set(input.DisplayName, input.Icon, input.IsHidden, input.SortOrder, input.DefaultPinned, input.Packages, roles);
            await _settingRepository.InsertAsync(setting, autoSave: true);
        }
        else
        {
            setting.Set(input.DisplayName, input.Icon, input.IsHidden, input.SortOrder, input.DefaultPinned, input.Packages, roles);
            await _settingRepository.UpdateAsync(setting, autoSave: true);
        }

        await _provider.InvalidateAsync();
        return ToDto(definition, setting, await GetUsageAcrossTenantsAsync());
    }

    public async Task<MacroAdminDto> ResetAsync(string key)
    {
        EnsureHostContext();
        var definition = FindDefinition(key);

        var setting = await _settingRepository.FirstOrDefaultAsync(s => s.MacroKey == definition.Key);
        if (setting != null)
        {
            await _settingRepository.DeleteAsync(setting, autoSave: true);
            await _provider.InvalidateAsync();
        }

        return ToDto(definition, null, await GetUsageAcrossTenantsAsync());
    }

    private MacroAdminDto ToDto(MacroDefinition definition, MacroSetting? setting, IReadOnlyDictionary<string, int> usage) => new()
    {
        Key = definition.Key,
        Kind = definition.Kind,
        MenuName = definition.MenuName,
        Url = definition.Url,
        Permission = definition.Permission,
        DefaultTitle = definition.TitleKey != null ? L[definition.TitleKey] : definition.Key,
        DefaultIcon = definition.Icon,
        Area = L[definition.AreaKey],
        IsCustomized = setting != null,
        DisplayName = setting?.DisplayName,
        Icon = setting?.Icon,
        IsHidden = setting?.IsHidden ?? false,
        SortOrder = setting?.SortOrder,
        DefaultPinned = setting?.DefaultPinned ?? false,
        Packages = setting?.PackageCodes().ToList() ?? new(),
        Roles = setting?.RoleNames().ToList() ?? new(),
        Usage30Days = usage.GetValueOrDefault(definition.Key)
    };

    /// <summary>
    /// Bütün kiracılarda son 30 günlük kullanım (yalnız sayı — kiracı verisi dönmez). Sayaç kiracı
    /// kaydı olduğu için süzgeç bilerek kapatılır: soru zaten "kaç kez başlatıldı".
    /// </summary>
    private async Task<Dictionary<string, int>> GetUsageAcrossTenantsAsync()
    {
        var since = MacroUsageManager.WindowStart(Clock.Now);
        using (_mtFilter.Disable())
        {
            var rows = await AsyncExecuter.ToListAsync((await _usageRepository.GetQueryableAsync())
                .Where(x => x.Day >= since)
                .GroupBy(x => x.MacroKey)
                .Select(g => new { Key = g.Key, Count = g.Sum(x => x.Count) }));
            return rows.ToDictionary(x => x.Key, x => x.Count, StringComparer.Ordinal);
        }
    }

    private static MacroDefinition FindDefinition(string key)
        => MacroCatalog.All.FirstOrDefault(d => d.Key == key)
           ?? throw new EntityNotFoundException(typeof(MacroSetting), key);

    private List<string> NormalizeRoles(IEnumerable<string>? roles)
    {
        var list = (roles ?? Enumerable.Empty<string>())
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Select(r => r.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        // Virgül ayraçtır: rol adında geçerse listeyi böler.
        if (list.Count > MacroSettingConsts.MaxRoleCount
            || list.Any(r => r.Length > MacroSettingConsts.MaxRoleNameLength || r.Contains(',')))
        {
            throw new UserFriendlyException(L["Macros:Admin:InvalidRoles", MacroSettingConsts.MaxRoleCount]);
        }

        return list;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException(L["Macros:Admin:HostOnly"]);
        }
    }
}
