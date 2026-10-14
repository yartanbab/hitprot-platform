using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Settings;
using Apya.Platform.Tenants;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;
using Volo.Abp.Users;

namespace Apya.Platform.Macros;

/// <summary>
/// Host makro ayarlarının (<see cref="MacroSetting"/>) okunduğu TEK yer: Makro Ekran, "+ Yeni"
/// menüsü / komut paleti (kabuk durumu) ve sabitleme varsayılanları buradan beslenir.
///
/// <para>Ayar tablosu küçük ve kabuk durumu her sayfada okunuyor → bütün satırlar dağıtık önbellekte
/// tek kayıt; host her kaydettiğinde <see cref="InvalidateAsync"/>. Kapsam (paket/rol) her istekte
/// kullanıcıya göre çözülür.</para>
/// </summary>
public class MacroSettingsProvider : ITransientDependency
{
    private readonly IRepository<MacroSetting, Guid> _repository;
    private readonly IDistributedCache<MacroSettingsCacheItem, string> _cache;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;
    private readonly PackageCeilingStore _packages;
    private readonly ISettingManager _settingManager;

    public MacroSettingsProvider(
        IRepository<MacroSetting, Guid> repository,
        IDistributedCache<MacroSettingsCacheItem, string> cache,
        ICurrentTenant currentTenant,
        ICurrentUser currentUser,
        PackageCeilingStore packages,
        ISettingManager settingManager)
    {
        _repository = repository;
        _cache = cache;
        _currentTenant = currentTenant;
        _currentUser = currentUser;
        _packages = packages;
        _settingManager = settingManager;
    }

    /// <summary>Ayar kaydı olan makrolar, oturumdaki kullanıcının kapsamına göre çözülmüş.</summary>
    public async Task<List<MacroSettingViewDto>> GetForCurrentUserAsync()
    {
        var entries = (await _cache.GetOrAddAsync(MacroSettingsCacheItem.CacheKey, LoadAsync))?.Entries
                      ?? new List<MacroSettingsCacheEntry>();
        if (entries.Count == 0)
        {
            return new List<MacroSettingViewDto>();
        }

        PackageCode? package = _currentTenant.Id.HasValue
            ? await _packages.GetPackageCodeAsync(_currentTenant.Id.Value)
            : null;
        var roles = _currentUser.Roles;

        return entries.Select(e => new MacroSettingViewDto
        {
            Key = e.MacroKey,
            DisplayName = e.DisplayName,
            Icon = e.Icon,
            SortOrder = e.SortOrder,
            DefaultPinned = e.DefaultPinned,
            IsVisible = !e.IsHidden && MacroSetting.IsInScope(e.Packages, e.Roles, package, roles)
        }).ToList();
    }

    /// <summary>
    /// Sabitleme listesi (kenar çubuğuyla ortak ayar). Kullanıcı hiç kaydetmemişse varsayılan menü
    /// iğneleri + host'un "yeni kullanıcıya sabitli gelsin" dediği, kullanıcıya görünen makrolar.
    /// Kullanıcı ilk iğne değişikliğinde kendi listesini yazar; varsayılan o andan sonra devreden çıkar.
    /// </summary>
    public async Task<List<string>> GetPinsForCurrentUserAsync(IReadOnlyCollection<MacroSettingViewDto> settings)
    {
        // fallback: false ŞART — varsayılanda ABP tanımdaki varsayılan değere düşer ve "kullanıcı hiç
        // kaydetmemiş" durumu hiç null dönmez; host'un varsayılan sabitleri o zaman hiç eklenmezdi.
        // Tanımın varsayılanı PlatformSettingDefaults.ShellPins — DefaultPins da ondan başlar.
        var raw = _currentUser.Id.HasValue
            ? await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Shell.Pins, fallback: false)
            : null;

        return raw != null ? Split(raw) : DefaultPins(settings);
    }

    public static List<string> DefaultPins(IEnumerable<MacroSettingViewDto> settings)
    {
        var defaultPinned = settings.Where(s => s.DefaultPinned && s.IsVisible).Select(s => s.Key).ToHashSet(StringComparer.Ordinal);
        return Split(PlatformSettingDefaults.ShellPins)
            .Concat(MacroCatalog.All.Where(d => defaultPinned.Contains(d.Key)).Select(d => d.PinName))
            .Distinct(StringComparer.Ordinal)
            .Take(PlatformSettingDefaults.ShellPinsMax)
            .ToList();
    }

    public Task InvalidateAsync() => _cache.RemoveAsync(MacroSettingsCacheItem.CacheKey);

    private static List<string> Split(string raw)
        => raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Distinct().ToList();

    private async Task<MacroSettingsCacheItem> LoadAsync()
    {
        var rows = await _repository.GetListAsync();
        return new MacroSettingsCacheItem
        {
            Entries = rows.Select(r => new MacroSettingsCacheEntry
            {
                MacroKey = r.MacroKey,
                DisplayName = r.DisplayName,
                Icon = r.Icon,
                IsHidden = r.IsHidden,
                SortOrder = r.SortOrder,
                DefaultPinned = r.DefaultPinned,
                Packages = r.Packages,
                Roles = r.Roles
            }).ToList()
        };
    }
}

/// <summary>Host makro ayarlarının önbellek kaydı (tablo küçük; tek kayıt).</summary>
public class MacroSettingsCacheItem
{
    public const string CacheKey = "all";

    public List<MacroSettingsCacheEntry> Entries { get; set; } = new();
}

public class MacroSettingsCacheEntry
{
    public string MacroKey { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? Icon { get; set; }
    public bool IsHidden { get; set; }
    public int? SortOrder { get; set; }
    public bool DefaultPinned { get; set; }
    public string Packages { get; set; } = string.Empty;
    public string Roles { get; set; } = string.Empty;
}
