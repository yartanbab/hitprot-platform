using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talebi iş kuralları: kötüye kullanım koruması ve kaydın oluşturulması.
/// AppService yalnızca yetki + DTO işi yapar.
/// </summary>
public class RegistrationRequestManager : DomainService
{
    private readonly IRepository<RegistrationRequest, Guid> _repository;
    private readonly IClock _clock;

    public RegistrationRequestManager(
        IRepository<RegistrationRequest, Guid> repository,
        IClock clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public async Task<RegistrationRequest> CreateAsync(
        string fullName,
        string authorizedTitle,
        string email,
        string phone,
        string companyName,
        CompanyType companyType,
        string taxNumber,
        string address,
        SalesPlan requestedPlan,
        string? ipAddress,
        string? userAgent,
        RegistrationRequestOptionalDetails? optionalDetails = null)
    {
        await EnsureNotFloodingAsync(ipAddress);

        var request = new RegistrationRequest(
            GuidGenerator.Create(),
            fullName,
            authorizedTitle,
            email,
            phone,
            companyName,
            companyType,
            taxNumber,
            address,
            requestedPlan,
            ipAddress,
            userAgent);

        if (optionalDetails != null)
        {
            request.SetOptionalDetails(
                optionalDetails.TaxOffice,
                optionalDetails.CorporateEmail,
                optionalDetails.CompanySize,
                optionalDetails.OperationalContactName,
                optionalDetails.OperationalContactPhone,
                optionalDetails.Message);
        }

        return await _repository.InsertAsync(request, autoSave: true);
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

        var since = _clock.Now.AddHours(-RegistrationRequestConsts.RateLimitWindowHours);
        var query = await _repository.GetQueryableAsync();

        var recentCount = await AsyncExecuter.CountAsync(
            query.Where(r => r.IpAddress == ipAddress && r.CreationTime >= since));

        if (recentCount >= RegistrationRequestConsts.RateLimitMaxRequests)
        {
            throw new BusinessException(PlatformDomainErrorCodes.RegistrationRequestRateLimitExceeded);
        }
    }
}
