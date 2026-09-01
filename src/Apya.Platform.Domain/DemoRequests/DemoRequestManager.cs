using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.DemoRequests;

/// <summary>
/// Demo talebi iş kuralları: kötüye kullanım koruması ve kaydın oluşturulması.
/// AppService yalnızca yetki + DTO işi yapar.
/// </summary>
public class DemoRequestManager : DomainService
{
    private readonly IRepository<DemoRequest, Guid> _demoRequestRepository;
    private readonly IClock _clock;

    public DemoRequestManager(
        IRepository<DemoRequest, Guid> demoRequestRepository,
        IClock clock)
    {
        _demoRequestRepository = demoRequestRepository;
        _clock = clock;
    }

    public async Task<DemoRequest> CreateAsync(
        string fullName,
        string companyName,
        string email,
        string phone,
        DemoRequestOrganizationKind? organizationKind,
        DemoRequestCompanySize? companySize,
        string? interestedModules,
        string? message,
        string? ipAddress,
        string? userAgent)
    {
        await EnsureNotFloodingAsync(ipAddress);

        var request = new DemoRequest(
            GuidGenerator.Create(),
            fullName,
            companyName,
            email,
            phone,
            organizationKind,
            companySize,
            interestedModules,
            message,
            ipAddress,
            userAgent);

        return await _demoRequestRepository.InsertAsync(request, autoSave: true);
    }

    /// <summary>
    /// Aynı IP'nin kısa aralıkta form yağdırmasını engeller. Uç oturumsuz olduğu için
    /// kullanıcı kimliği yok; elde tek ayırt edici IP kalıyor. IP okunamadıysa sınır
    /// UYGULANMAZ — proxy arkasında herkesi tek sayaca toplayıp formu kilitlemek,
    /// spam'e izin vermekten daha kötü olurdu.
    /// </summary>
    private async Task EnsureNotFloodingAsync(string? ipAddress)
    {
        if (ipAddress.IsNullOrWhiteSpace())
        {
            return;
        }

        var since = _clock.Now.AddHours(-DemoRequestConsts.RateLimitWindowHours);
        var query = await _demoRequestRepository.GetQueryableAsync();

        var recentCount = await AsyncExecuter.CountAsync(
            query.Where(r => r.IpAddress == ipAddress && r.CreationTime >= since));

        if (recentCount >= DemoRequestConsts.RateLimitMaxRequests)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DemoRequestRateLimitExceeded);
        }
    }
}
