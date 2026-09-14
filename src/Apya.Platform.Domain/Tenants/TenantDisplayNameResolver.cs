using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kurumun insana gösterilen adı: Kurum Profili'ndeki resmî unvan; boşsa kiracı adı.
///
/// <para>Kiracı adı giriş/URL için türetilmiş kısa bir anahtardır ("hudayim-dernegi");
/// bildirim metninde, yazdırılan başlıkta ya da host'un gördüğü firma adında o değil kurumun
/// kendi unvanı görünmeli.</para>
///
/// <para>Profil ve kiracı kataloğu host kayıtlarıdır; okuma her çağrıda host bağlamında
/// yapılır, çağıranın bağlamı ne olursa olsun.</para>
/// </summary>
public class TenantDisplayNameResolver : DomainService
{
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly ITenantRepository _tenantRepository;

    public TenantDisplayNameResolver(
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        ITenantRepository tenantRepository)
    {
        _tenantProfileRepository = tenantProfileRepository;
        _tenantRepository = tenantRepository;
    }

    /// <summary>Tek kurumun adı; kiracı bulunamazsa <c>null</c>.</summary>
    public async Task<string?> GetAsync(Guid tenantId)
    {
        using (CurrentTenant.Change(null))
        {
            var profile = await _tenantProfileRepository.FirstOrDefaultAsync(p => p.TenantId == tenantId);
            if (profile != null && !profile.LegalName.IsNullOrWhiteSpace())
            {
                return profile.LegalName;
            }

            return (await _tenantRepository.FindAsync(tenantId))?.Name;
        }
    }

    /// <summary>Birden çok kurumun adı. Bulunamayan kiracı sözlükte yer almaz.</summary>
    public async Task<Dictionary<Guid, string>> GetManyAsync(IEnumerable<Guid> tenantIds)
    {
        var ids = tenantIds.Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        using (CurrentTenant.Change(null))
        {
            var names = (await _tenantRepository.GetListAsync())
                .Where(t => ids.Contains(t.Id))
                .ToDictionary(t => t.Id, t => t.Name);

            var legalNames = await _tenantProfileRepository.GetListAsync(
                p => ids.Contains(p.TenantId) && p.LegalName != string.Empty);

            foreach (var profile in legalNames.Where(p => names.ContainsKey(p.TenantId) && !p.LegalName.IsNullOrWhiteSpace()))
            {
                names[profile.TenantId] = profile.LegalName;
            }

            return names;
        }
    }
}
