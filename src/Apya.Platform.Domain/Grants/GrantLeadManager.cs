using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.Grants;

/// <summary>
/// 1g / 5b · Oturumsuz talep formunun iş kuralları: kötüye kullanım koruması ve
/// kaydın oluşturulması. AppService yalnız DTO ve orkestrasyon işi yapar.
///
/// <para>Emsal <c>DemoRequestManager</c>: aynı IP'den kısa sürede gelen talepler
/// sınırlanır. Form oturumsuz olduğu için başka bir tutamak yok.</para>
/// </summary>
public class GrantLeadManager : DomainService
{
    /// <summary>Oran sınırı penceresi (saat).</summary>
    public const int RateLimitWindowHours = 24;

    /// <summary>Bu pencerede aynı IP'den kabul edilecek en fazla talep.</summary>
    public const int RateLimitMaxRequests = 5;

    private readonly IRepository<GrantLead, Guid> _leadRepo;
    private readonly IClock _clock;

    public GrantLeadManager(IRepository<GrantLead, Guid> leadRepo, IClock clock)
    {
        _leadRepo = leadRepo;
        _clock = clock;
    }

    /// <summary>
    /// Aynı IP ve e-posta ile aynı çağrıya gelen ikinci talep YENİ KAYIT AÇMAZ,
    /// mevcut kaydı günceller. Ziyaretçi testi tekrar doldurup gönderirse host
    /// kutusunda mükerrer satır görmemeli.
    /// </summary>
    public async Task<GrantLead> CreateOrUpdateAsync(
        Guid grantCallId,
        string firmName,
        string contactName,
        string email,
        string? ipAddress,
        string? userAgent)
    {
        await EnsureNotRateLimitedAsync(ipAddress);

        var normalizedEmail = email.Trim().ToLowerInvariant();

        var existing = (await _leadRepo.GetListAsync(
                l => l.GrantCallId == grantCallId && l.Email == normalizedEmail))
            .FirstOrDefault();

        if (existing != null)
        {
            existing.SetOrigin(ipAddress, userAgent);
            return existing;
        }

        var lead = new GrantLead(GuidGenerator.Create(), grantCallId, firmName, contactName, normalizedEmail);
        lead.SetOrigin(ipAddress, userAgent);
        return lead;
    }

    /// <summary>
    /// Yeni kaydı ekler, mevcudu günceller. Aynı UoW içinde geri okuma boş
    /// döneceği için <c>autoSave</c> ile yazılır.
    /// </summary>
    public async Task SaveAsync(GrantLead lead)
    {
        if (await _leadRepo.FindAsync(lead.Id) == null)
        {
            await _leadRepo.InsertAsync(lead, autoSave: true);
        }
        else
        {
            await _leadRepo.UpdateAsync(lead, autoSave: true);
        }
    }

    private async Task EnsureNotRateLimitedAsync(string? ipAddress)
    {
        if (ipAddress.IsNullOrWhiteSpace())
        {
            return;
        }

        var since = _clock.Now.AddHours(-RateLimitWindowHours);
        var recent = await _leadRepo.CountAsync(
            l => l.IpAddress == ipAddress && l.CreationTime >= since);

        if (recent >= RateLimitMaxRequests)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantLeadRateLimitExceeded);
        }
    }
}
