using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Apya.Platform.Agreements;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Timing;

namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kayıt talepleri. <see cref="RemoteServiceAttribute"/> ile HTTP API'si KAPALI:
/// oluşturma oturumsuzdur ve IP/UA yalnız Web sınırında güvenilir yakalanır
/// (bkz. <c>Pages/Account/RegistrationRequest.cshtml.cs</c>); açık bir uç formu
/// atlayıp doğrudan kayıt üretmeye izin verirdi. Aynı gerekçe: <c>ConsentAppService</c>.
/// </summary>
[RemoteService(false)]
[Authorize(PlatformPermissions.RegistrationRequests.Default)]
public class RegistrationRequestAppService : PlatformAppService, IRegistrationRequestAppService
{
    private readonly IRepository<RegistrationRequest, Guid> _repository;
    private readonly RegistrationRequestManager _registrationRequestManager;
    private readonly TenantProfileManager _tenantProfileManager;
    private readonly RegisteredEmailChecker _registeredEmailChecker;
    private readonly SalesPlanPricing _pricing;
    private readonly RegistrationInviteMailer _inviteMailer;
    private readonly RegistrationRequestMailer _requestMailer;
    private readonly PermittedUserFinder _permittedUsers;
    private readonly NotificationManager _notificationManager;
    private readonly IClock _clock;

    public RegistrationRequestAppService(
        IRepository<RegistrationRequest, Guid> repository,
        RegistrationRequestManager registrationRequestManager,
        TenantProfileManager tenantProfileManager,
        RegisteredEmailChecker registeredEmailChecker,
        SalesPlanPricing pricing,
        RegistrationInviteMailer inviteMailer,
        IClock clock,
        RegistrationRequestMailer requestMailer,
        PermittedUserFinder permittedUsers,
        NotificationManager notificationManager)
    {
        _permittedUsers = permittedUsers;
        _notificationManager = notificationManager;
        _repository = repository;
        _registrationRequestManager = registrationRequestManager;
        _tenantProfileManager = tenantProfileManager;
        _registeredEmailChecker = registeredEmailChecker;
        _pricing = pricing;
        _inviteMailer = inviteMailer;
        _requestMailer = requestMailer;
        _clock = clock;
    }

    [AllowAnonymous]
    public async Task<Guid> CreateAsync(CreateRegistrationRequestDto input)
    {
        // Zorunlu değer tipleri DTO'da nullable: doğrulama mesajını kendimiz veriyoruz.
        // Buraya null geldiyse ModelState'i atlayan bir çağrı var demektir.
        Check.NotNull(input.RequestedPlan, nameof(input.RequestedPlan));
        Check.NotNull(input.CompanyType, nameof(input.CompanyType));

        var request = await _registrationRequestManager.CreateAsync(
            input.FullName.Trim(),
            input.AuthorizedTitle.Trim(),
            input.Email.Trim(),
            input.Phone.Trim(),
            input.CompanyName.Trim(),
            input.CompanyType!.Value,
            input.TaxNumber.Trim(),
            input.Address.Trim(),
            input.RequestedPlan!.Value,
            TrimToNull(input.IpAddress),
            TrimToNull(input.UserAgent),
            new RegistrationRequestOptionalDetails
            {
                TaxOffice = TrimToNull(input.TaxOffice),
                CorporateEmail = TrimToNull(input.CorporateEmail),
                CompanySize = input.CompanySize,
                OperationalContactName = TrimToNull(input.OperationalContactName),
                OperationalContactPhone = TrimToNull(input.OperationalContactPhone),
                Message = TrimToNull(input.Message)
            });

        // K-02 · Adaya referans numaralı "talebiniz alındı" postası; gönderilemezse talep yine kayıtlıdır.
        await _requestMailer.TrySendReceivedAsync(request);
        await NotifyHostAsync(request);

        return request.Id;
    }

    /// <summary>
    /// N-05 · Yeni talep, Kayıt Talepleri yetkisi olan host kullanıcılarına ANINDA bildirilir (zil, balon,
    /// push). Talep host kaydıdır; aday oturumsuzdur ve tarayıcısında kiracı seçimi kalmış olabilir —
    /// bağlam açıkça host'a çevrilir.
    /// </summary>
    private async Task NotifyHostAsync(RegistrationRequest request)
    {
        using (CurrentTenant.Change(null))
        {
            var recipients = await _permittedUsers.WithPermissionAsync(
                await _permittedUsers.ActiveUserIdsAsync(), PlatformPermissions.RegistrationRequests.Default);

            var title = L["Notification:RegistrationRequestReceived:Title"];
            var body = L["Notification:RegistrationRequestReceived:Body",
                request.CompanyName, RegistrationRequestReference.Of(request.Id)];
            foreach (var userId in recipients)
            {
                await _notificationManager.PublishAsync(
                    userId, title, body, NotificationType.RegistrationRequestReceived,
                    entityType: "RegistrationRequest", entityId: request.Id);
            }
        }
    }

    /// <summary>
    /// 🔴 <see cref="AllowAnonymousAttribute"/> ŞART: sihirbaz oturumsuz açılır. Sınıf
    /// düzeyindeki izin kapısı burada kalsaydı aday sayfayı hiç göremezdi — Web testleri
    /// yetkilendirmeyi her zaman geçirdiği için bunu YAKALAMAZ.
    /// </summary>
    [AllowAnonymous]
    public async Task<Dictionary<SalesPlan, decimal>> GetPlanPricesAsync()
    {
        var prices = new Dictionary<SalesPlan, decimal>();

        foreach (var plan in Enum.GetValues<SalesPlan>())
        {
            var price = await _pricing.GetPriceOrNullAsync(plan);
            if (price.HasValue)
            {
                prices[plan] = price.Value;
            }
        }

        return prices;
    }

    public async Task<PagedResultDto<RegistrationRequestDto>> GetListAsync(RegistrationRequestListFilterDto input)
    {
        EnsureHostContext();

        var query = await _repository.GetQueryableAsync();

        if (input.Status.HasValue)
        {
            query = query.Where(r => r.Status == input.Status.Value);
        }

        if (!input.Filter.IsNullOrWhiteSpace())
        {
            var filter = input.Filter!.Trim();
            query = query.Where(r =>
                r.FullName.Contains(filter) ||
                r.CompanyName.Contains(filter) ||
                r.TaxNumber.Contains(filter) ||
                r.Email.Contains(filter) ||
                r.Phone.Contains(filter));
        }

        var totalCount = await AsyncExecuter.CountAsync(query);

        // En yeni talep en üstte: panelin işi "kimi henüz değerlendirmedik" sorusuna cevap vermek.
        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(r => r.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount));

        return new PagedResultDto<RegistrationRequestDto>(
            totalCount,
            ObjectMapper.Map<List<RegistrationRequest>, List<RegistrationRequestDto>>(items));
    }

    public async Task<RegistrationRequestDto> GetAsync(Guid id)
    {
        EnsureHostContext();

        var request = await _repository.GetAsync(id);
        return ObjectMapper.Map<RegistrationRequest, RegistrationRequestDto>(request);
    }

    [Authorize(PlatformPermissions.RegistrationRequests.Manage)]
    public async Task<RegistrationRequestDto> UpdateAsync(Guid id, UpdateRegistrationRequestDto input)
    {
        EnsureHostContext();

        var request = await _repository.GetAsync(id);
        var wasRejected = request.Status == RegistrationRequestStatus.Rejected;

        request.SetStatus(input.Status);

        // Bedel boş bırakıldıysa paketin liste bedeli kullanılır (/PackageManagement'ta
        // tanımlanır). Host her onayda rakamı elle yazmak zorunda kalmasın; tanımlı bedel
        // yoksa alan boş kalır ve sözleşmeye rakam UYDURULMAZ.
        var amount = input.OfferedAmount
                     ?? await _pricing.GetPriceOrNullAsync(input.ApprovedPlan ?? request.RequestedPlan);

        request.SetOffer(input.ApprovedPlan, amount);
        request.SetAdminNote(TrimToNull(input.AdminNote));

        await _repository.UpdateAsync(request, autoSave: true);

        // K-02 · Reddedildiği AN adaya bir kez haber verilir (gerekçesiz, kullanıcı kararı); durum başka
        // bir şeyle yeniden kaydedilirse ikinci posta gitmez.
        if (!wasRejected && request.Status == RegistrationRequestStatus.Rejected)
        {
            await _requestMailer.TrySendRejectedAsync(request);
        }

        return ObjectMapper.Map<RegistrationRequest, RegistrationRequestDto>(request);
    }

    [Authorize(PlatformPermissions.RegistrationRequests.Manage)]
    public async Task<RegistrationInviteDto> IssueInviteAsync(Guid id)
    {
        EnsureHostContext();

        var request = await _repository.GetAsync(id);

        // Onaylanmamış bir talebe davet üretmek, protokolü henüz kabul etmediğimiz bir
        // adaya sözleşme imzalatmak olurdu.
        if (!request.CanIssueInvite)
        {
            throw new BusinessException(PlatformDomainErrorCodes.RegistrationRequestNotApproved);
        }

        // Vergi numarası kiracılar arasında TEKİL (TenantProfileManager kuralı). Burada
        // bakılmazsa çakışma en son adımda patlar: aday protokolü okur, şifresini belirler,
        // onaylar — ve hesap açılışı düşer. Host'a ŞİMDİ söylemek, kaydı düzeltme şansı verir.
        await _tenantProfileManager.CheckTaxNumberUniqueAsync(request.TaxNumber);

        // Aynı gerekçe e-posta için de geçerli: adres başka bir hesabın kullanıcısıysa
        // kurulum en son adımda düşerdi. Host'a ŞİMDİ söylüyoruz ki adaydan farklı bir
        // adres istesin — davet üretilmeden.
        await _registeredEmailChecker.CheckNotRegisteredAsync(request.Email);

        var token = InviteToken.Generate();
        var now = _clock.Now;
        var expiresAt = now.AddDays(ServiceAgreementConsts.InviteValidDays);

        request.IssueInvite(InviteToken.Hash(token), now, expiresAt);
        await _repository.UpdateAsync(request, autoSave: true);

        return new RegistrationInviteDto { Token = token, ExpiresAt = expiresAt };
    }

    [Authorize(PlatformPermissions.RegistrationRequests.Manage)]
    public async Task<bool> SendInviteMailAsync(Guid id, string protocolUrl)
    {
        EnsureHostContext();

        var request = await _repository.GetAsync(id);

        return await _inviteMailer.TrySendAsync(request, protocolUrl);
    }

    public async Task<RegistrationRequestSummaryDto> GetSummaryAsync()
    {
        EnsureHostContext();

        var query = await _repository.GetQueryableAsync();

        var counts = await AsyncExecuter.ToListAsync(
            query.GroupBy(r => r.Status)
                 .Select(g => new { Status = g.Key, Count = g.Count() }));

        int CountOf(RegistrationRequestStatus status)
            => counts.FirstOrDefault(c => c.Status == status)?.Count ?? 0;

        return new RegistrationRequestSummaryDto
        {
            NewCount = CountOf(RegistrationRequestStatus.New),
            InReviewCount = CountOf(RegistrationRequestStatus.InReview),
            ApprovedCount = CountOf(RegistrationRequestStatus.Approved),
            RejectedCount = CountOf(RegistrationRequestStatus.Rejected),
            ClosedCount = CountOf(RegistrationRequestStatus.Closed),
            AwaitingProtocolCount = CountOf(RegistrationRequestStatus.AwaitingProtocol),
            AccountCreatedCount = CountOf(RegistrationRequestStatus.AccountCreated)
        };
    }

    /// <summary>
    /// Talepler HOST kaydıdır ve kiracı sütunu taşımaz: kiracı bağlamından gelen okuma/yazma bütün
    /// başvuranların kişisel verisine ulaşırdı. İzin host taraflıdır; bu ikinci kilittir.
    /// </summary>
    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }

    /// <summary>Boş/boşluk metni null'a indirger — DB'de "" ile null karışmasın.</summary>
    private static string? TrimToNull(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
