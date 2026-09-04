using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Settings;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Caching;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;
using Volo.Abp.Settings;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Sürüm notu yayın kapısı. Katalog kodda (<see cref="ReleaseNoteCatalog"/>), yayın kararı
/// DB'de (<see cref="ReleaseNotePublication"/>); bu servis ikisini birleştirir.
///
/// <para><b>Varsayılan kapalıdır:</b> bir madde için karar satırı yoksa hiçbir kiracı
/// kullanıcısı onu görmez. Host ise onaylı-onaysız HER maddeyi görür; onaysızlar
/// <c>IsPendingApproval</c> ile işaretlenir.</para>
/// </summary>
[Authorize]
public class ReleaseNotePublicationAppService : PlatformAppService, IReleaseNotePublicationAppService
{
    private static readonly PackageCode[] AllPackages = Enum.GetValues<PackageCode>();

    private readonly IRepository<ReleaseNotePublication, Guid> _repository;
    private readonly IDistributedCache<ReleaseNotePublicationCacheItem, string> _cache;
    private readonly PackageCeilingStore _packageStore;
    private readonly IPermissionChecker _permissionChecker;
    private readonly ISettingManager _settingManager;
    private readonly ISettingProvider _settingProvider;

    public ReleaseNotePublicationAppService(
        IRepository<ReleaseNotePublication, Guid> repository,
        IDistributedCache<ReleaseNotePublicationCacheItem, string> cache,
        PackageCeilingStore packageStore,
        IPermissionChecker permissionChecker,
        ISettingManager settingManager,
        ISettingProvider settingProvider)
    {
        _repository = repository;
        _cache = cache;
        _packageStore = packageStore;
        _permissionChecker = permissionChecker;
        _settingManager = settingManager;
        _settingProvider = settingProvider;
    }

    // ── Host yönetimi ──────────────────────────────────────────────────────────

    [Authorize(PlatformPermissions.ReleaseNotes.Manage)]
    public async Task<List<ReleaseNoteAdminDto>> GetForManagementAsync()
    {
        var decisions = await GetDecisionsAsync();

        return ReleaseNoteCatalog.All.Select(release => new ReleaseNoteAdminDto
        {
            Version = release.Version,
            Date = release.Date,
            Title = release.Title,
            Items = release.Items.Select(item =>
            {
                decisions.TryGetValue(DecisionKey(release.Version, item.Key), out var decision);

                return new ReleaseNoteAdminItemDto
                {
                    Key = item.Key,
                    Category = item.Category,
                    Title = item.Title,
                    Description = item.Description,
                    IsPending = decision == null,
                    IsApproved = decision?.IsApproved ?? false,
                    // Kararsız maddede kutular AÇIK gelir: host "Yayınla"yı işaretleyince
                    // makul bir varsayılanla (her yerde, her pakette, herkese) yayınlansın.
                    ShowInModal = decision?.ShowInModal ?? true,
                    ShowInHistory = decision?.ShowInHistory ?? true,
                    Packages = decision == null
                        ? AllPackages.ToList()
                        : ReleaseNoteVisibility.ParsePackages(decision.Packages),
                    Audience = decision?.Audience ?? ReleaseNoteAudience.Everyone
                };
            }).ToList()
        }).ToList();
    }

    [Authorize(PlatformPermissions.ReleaseNotes.Manage)]
    public async Task SaveAsync(SaveReleaseNotePublicationsInput input)
    {
        // Katalogda karşılığı olmayan (sürüm, madde) ikilisi sessizce atılır — ekrandan
        // gelen gövde manipüle edilmiş olabilir, tabloya hayalet satır girmesin.
        var catalogKeys = ReleaseNoteCatalog.All
            .SelectMany(r => r.Items.Select(i => DecisionKey(r.Version, i.Key)))
            .ToHashSet(StringComparer.Ordinal);

        var existing = (await _repository.GetListAsync())
            .ToDictionary(r => DecisionKey(r.Version, r.ItemKey), StringComparer.Ordinal);

        var toInsert = new List<ReleaseNotePublication>();
        var toUpdate = new List<ReleaseNotePublication>();

        foreach (var line in input.Items)
        {
            var key = DecisionKey(line.Version, line.ItemKey);
            if (!catalogKeys.Contains(key))
            {
                continue;
            }

            // Paket listesi BOŞ gelirse boş yazılır — "hiçbir pakete açık değil" geçerli bir
            // karardır. Burada sessizce "hepsi"ne çekmek, host'un dört kutuyu da kaldırdığı
            // maddeyi yayında bırakırdı.
            if (existing.TryGetValue(key, out var row))
            {
                row.Set(line.IsApproved, line.ShowInModal, line.ShowInHistory, line.Packages, line.Audience);
                toUpdate.Add(row);
            }
            else
            {
                var created = new ReleaseNotePublication(GuidGenerator.Create(), line.Version, line.ItemKey);
                created.Set(line.IsApproved, line.ShowInModal, line.ShowInHistory, line.Packages, line.Audience);
                toInsert.Add(created);
            }
        }

        // autoSave: önbelleği ancak COMMIT edilmiş veriden sonra tazeleyelim.
        if (toInsert.Count > 0)
        {
            await _repository.InsertManyAsync(toInsert, autoSave: true);
        }

        if (toUpdate.Count > 0)
        {
            await _repository.UpdateManyAsync(toUpdate, autoSave: true);
        }

        await _cache.RemoveAsync(ReleaseNotePublicationCacheItem.CacheKey);
    }

    // ── Kullanıcıya gösterim ───────────────────────────────────────────────────

    public async Task<List<ReleaseNoteViewDto>> GetHistoryAsync()
    {
        var context = await BuildContextAsync();
        var result = new List<ReleaseNoteViewDto>();

        foreach (var release in ReleaseNoteCatalog.All)
        {
            var items = VisibleItems(release, context, forModal: false);
            if (items.Count == 0)
            {
                continue;
            }

            result.Add(new ReleaseNoteViewDto
            {
                Version = release.Version,
                Date = release.Date,
                Title = release.Title,
                Items = items.Select(x => x.Dto).ToList()
            });
        }

        return result;
    }

    public async Task<ReleaseNoteModalDto?> GetModalOrNullAsync()
    {
        var modal = await BuildModalAsync();
        if (modal == null)
        {
            return null;
        }

        var lastSeen = await _settingProvider.GetOrNullAsync(PlatformSettings.ReleaseNotes.LastSeenVersion);
        return lastSeen == modal.SeenToken ? null : modal;
    }

    public async Task MarkSeenAsync()
    {
        // Kullanıcı ayarı yazılacak; kimliksiz asılla SetForCurrentUserAsync patlar.
        // [Authorize] normalde buraya kimliksiz gelinmesini engeller, ama test host'u
        // gibi yetkilendirmenin atlandığı bağlamlarda bu koruma şart.
        if (!CurrentUser.IsAuthenticated)
        {
            return;
        }

        var modal = await BuildModalAsync();

        // Gösterilecek madde kalmadıysa da bir damga yazılır; geçmiş sayfasını açan
        // kullanıcı için de aynı yol kullanılıyor.
        var token = modal?.SeenToken
                    ?? BuildToken(ReleaseNoteCatalog.Latest.Version, Array.Empty<string>());

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.ReleaseNotes.LastSeenVersion, token);
    }

    // ── İç yardımcılar ─────────────────────────────────────────────────────────

    private async Task<ReleaseNoteModalDto?> BuildModalAsync()
    {
        var context = await BuildContextAsync();
        var latest = ReleaseNoteCatalog.Latest;

        var items = VisibleItems(latest, context, forModal: true);
        if (items.Count == 0)
        {
            return null;
        }

        return new ReleaseNoteModalDto
        {
            Version = latest.Version,
            Date = latest.Date,
            Title = latest.Title,
            Items = items.Select(x => x.Dto).ToList(),
            SeenToken = BuildToken(latest.Version, items.Select(x => x.Key)),
            HasPendingItems = items.Any(x => x.Dto.IsPendingApproval)
        };
    }

    private static List<(string Key, ReleaseNoteViewItemDto Dto)> VisibleItems(
        ReleaseNote release, VisibilityContext context, bool forModal)
    {
        var result = new List<(string, ReleaseNoteViewItemDto)>();

        foreach (var item in release.Items)
        {
            context.Decisions.TryGetValue(DecisionKey(release.Version, item.Key), out var decision);

            if (context.IsHost)
            {
                // Host onay makamıdır: onaylamadığı maddeyi de görür, rozetle.
                result.Add((item.Key, ToViewDto(item, isPending: !(decision?.IsApproved ?? false))));
                continue;
            }

            if (!ReleaseNoteVisibility.IsVisibleToTenant(
                    decision, context.Package, context.IsTenantAdmin, forModal))
            {
                continue;
            }

            result.Add((item.Key, ToViewDto(item, isPending: false)));
        }

        return result;
    }

    private static ReleaseNoteViewItemDto ToViewDto(ReleaseNoteItem item, bool isPending) => new()
    {
        Category = item.Category,
        Title = item.Title,
        Description = item.Description,
        IsPendingApproval = isPending
    };

    private async Task<VisibilityContext> BuildContextAsync()
    {
        var decisions = await GetDecisionsAsync();
        var tenantId = CurrentTenant.Id;

        if (tenantId == null)
        {
            return new VisibilityContext(true, PackageCode.Enterprise, true, decisions);
        }

        return new VisibilityContext(
            IsHost: false,
            Package: await _packageStore.GetPackageCodeAsync(tenantId.Value),
            IsTenantAdmin: await _permissionChecker.IsGrantedAsync(PlatformPermissions.TenantSettings.Default),
            Decisions: decisions);
    }

    private async Task<Dictionary<string, ReleaseNotePublicationCacheEntry>> GetDecisionsAsync()
    {
        var cached = await _cache.GetOrAddAsync(
            ReleaseNotePublicationCacheItem.CacheKey,
            async () =>
            {
                var rows = await _repository.GetListAsync();
                return new ReleaseNotePublicationCacheItem
                {
                    Entries = rows.Select(r => new ReleaseNotePublicationCacheEntry
                    {
                        Version = r.Version,
                        ItemKey = r.ItemKey,
                        IsApproved = r.IsApproved,
                        ShowInModal = r.ShowInModal,
                        ShowInHistory = r.ShowInHistory,
                        Packages = r.Packages,
                        Audience = r.Audience
                    }).ToList()
                };
            });

        return (cached?.Entries ?? new List<ReleaseNotePublicationCacheEntry>())
            .ToDictionary(e => DecisionKey(e.Version, e.ItemKey), StringComparer.Ordinal);
    }

    private static string DecisionKey(string version, string itemKey) => version + "/" + itemKey;

    /// <summary>
    /// "Gördüm" damgası: <c>{sürüm}|{maddelerin karması}</c>. Host sonradan yeni madde
    /// onaylarsa karma değişir → pencere bir kez daha açılır. Hiçbir şey değişmediyse
    /// kullanıcı pencereyi bir daha görmez.
    /// </summary>
    private static string BuildToken(string version, IEnumerable<string> itemKeys)
    {
        var joined = string.Join("|", itemKeys.OrderBy(k => k, StringComparer.Ordinal));
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(joined));
        return version + "|" + Convert.ToHexString(hash, 0, 4).ToLowerInvariant();
    }

    private sealed record VisibilityContext(
        bool IsHost,
        PackageCode Package,
        bool IsTenantAdmin,
        Dictionary<string, ReleaseNotePublicationCacheEntry> Decisions);
}
