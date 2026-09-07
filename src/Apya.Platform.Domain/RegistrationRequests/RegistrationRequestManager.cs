using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Accounts;
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
    private readonly RegisteredEmailChecker _registeredEmailChecker;
    private readonly IClock _clock;

    public RegistrationRequestManager(
        IRepository<RegistrationRequest, Guid> repository,
        RegisteredEmailChecker registeredEmailChecker,
        IClock clock)
    {
        _repository = repository;
        _registeredEmailChecker = registeredEmailChecker;
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
        await EnsureEmailAvailableAsync(email);

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

    /// <summary>
    /// Aynı e-postanın ikinci kez sürece girmesini engeller. İki durum vardır ve ikisi de
    /// AYNI hata koduyla bildirilir: e-posta zaten bir hesabın kullanıcısı, ya da hâlâ
    /// işlenmekte olan bir talebi var.
    /// <para>
    /// 🔴 İki durumu ayrı mesajlarla söylemek, oturumsuz formu "bu e-posta sistemde var mı"
    /// sorusuna yanıt farkıyla cevap veren bir kullanıcı sayım ucuna çevirirdi. Giriş akışı
    /// (<see cref="Apya.Platform.Accounts.LoginTenantFinder"/>) bu sızıntıyı bilerek kapatıyor;
    /// burada tersine gitmek tutarsız olurdu.
    /// </para>
    /// </summary>
    private async Task EnsureEmailAvailableAsync(string email)
    {
        var query = await _repository.GetQueryableAsync();

        // İki karşılaştırma bilerek: düz eşitlik SQL Server'ın harf duyarsız (ve Türkçe
        // i/İ eşlemesini doğru yapan) collation'ına yaslanır, ToUpper() ise Postgres gibi
        // harf DUYARLI sağlayıcıda ASCII varyantlarını yakalar. Tablo küçük, maliyeti yok.
        var upper = email.ToUpperInvariant();

        var hasOpenRequest = await AsyncExecuter.AnyAsync(
            query.Where(r => OpenStatuses.Contains(r.Status)
                          && (r.Email == email || r.Email.ToUpper() == upper)));

        // 🔑 Tek hata kodu, tek mesaj. Checker'ın kendi kodunu (TenantAdminEmailAlreadyInUse)
        // buradan sızdırmıyoruz: iki durumun farklı yanıt üretmesi tam da kaçındığımız
        // kullanıcı sayım sinyali olurdu.
        if (hasOpenRequest || await _registeredEmailChecker.IsRegisteredAsync(email))
        {
            throw new BusinessException(PlatformDomainErrorCodes.RegistrationRequestEmailAlreadyRegistered)
                .WithData("Email", email);
        }
    }

    /// <summary>
    /// Yeni talebi engelleyen durumlar. <c>Closed</c> ve <c>Rejected</c> DIŞARIDA: süreç
    /// sonuçsuz kapandıysa adayın yeniden başvurmasının önü kesilmemeli.
    /// </summary>
    private static readonly RegistrationRequestStatus[] OpenStatuses =
    {
        RegistrationRequestStatus.New,
        RegistrationRequestStatus.InReview,
        RegistrationRequestStatus.Approved,
        RegistrationRequestStatus.AwaitingProtocol,
        RegistrationRequestStatus.AccountCreated
    };
}
