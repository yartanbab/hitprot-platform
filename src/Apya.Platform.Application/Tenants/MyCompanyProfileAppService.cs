using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kurumun kendi profili — avatar menüsündeki kurum adına tıklayınca açılan ekranın servisi.
///
/// <para><b>Okuma her kurum kullanıcısına açık</b>, düzenleme kurum yöneticisine
/// (<c>TenantSettings</c>). Unvan, vergi numarası, adres kurumun kendi çalışanlarından
/// saklanacak bilgi değil; menüdeki satır herkese basıldığı için okumayı izne bağlamak
/// çoğu kullanıcıya tıklanınca "yetkiniz yok" diyen bir bağlantı göstermek olurdu.</para>
///
/// <para>🔴 Profil, abonelik ve sözleşme host kayıtlarıdır (<c>IMultiTenant</c> DEĞİL) —
/// kiracı filtresi bu sorguları KORUMAZ. Eşleştirme <c>CurrentTenant.Id</c> ile ELLE yapılır.</para>
/// </summary>
[Authorize]
public class MyCompanyProfileAppService : PlatformAppService, IMyCompanyProfileAppService
{
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly IRepository<PlatformPackage, Guid> _packageRepository;
    private readonly IRepository<ServiceAgreement, Guid> _agreementRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly TenantProfileUpdater _tenantProfileUpdater;

    public MyCompanyProfileAppService(
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        IRepository<PlatformPackage, Guid> packageRepository,
        IRepository<ServiceAgreement, Guid> agreementRepository,
        ITenantRepository tenantRepository,
        IIdentityUserRepository userRepository,
        TenantSubscriptionManager subscriptionManager,
        TenantProfileUpdater tenantProfileUpdater)
    {
        _tenantProfileRepository = tenantProfileRepository;
        _packageRepository = packageRepository;
        _agreementRepository = agreementRepository;
        _tenantRepository = tenantRepository;
        _userRepository = userRepository;
        _subscriptionManager = subscriptionManager;
        _tenantProfileUpdater = tenantProfileUpdater;
    }

    public async Task<MyCompanyProfileDto> GetAsync()
    {
        var tenantId = RequireTenantId();

        // Kullanıcılar kiracı bağlamında sayılır; geri kalanı host kaydı.
        var userCount = (int)await _userRepository.GetCountAsync();

        using (CurrentTenant.Change(null))
        {
            var tenant = await _tenantRepository.GetAsync(tenantId);
            var profile = await _tenantProfileRepository.FindAsync(p => p.TenantId == tenantId);

            var dto = profile == null
                ? new MyCompanyProfileDto { LegalName = tenant.Name }
                : ObjectMapper.Map<TenantProfile, MyCompanyProfileDto>(profile);

            dto.TenantName = tenant.Name;
            dto.MemberSince = tenant.CreationTime;
            dto.UserCount = userCount;

            var packageCode = profile?.PackageCode ?? PackageCode.Basic;
            var package = await _packageRepository.FindAsync(p => p.Code == packageCode);
            dto.PackageName = package?.Name ?? packageCode.ToString();

            var subscription = await _subscriptionManager.GetCurrentOrNullAsync(tenantId);
            dto.SubscriptionEndDate = subscription?.EffectiveEndDate;

            // En yeni sözleşme: yenileme geldiğinde kiracının birden fazla kaydı olabilir.
            var agreement = await AsyncExecuter.FirstOrDefaultAsync(
                (await _agreementRepository.GetQueryableAsync())
                    .Where(a => a.TenantId == tenantId)
                    .OrderByDescending(a => a.ApprovedAt));
            dto.AgreementNumber = agreement?.Number;
            dto.AgreementApprovedAt = agreement?.ApprovedAt;

            return dto;
        }
    }

    [Authorize(PlatformPermissions.TenantSettings.Default)]
    public async Task UpdateAsync(UpdateTenantProfileDto input)
    {
        var tenantId = RequireTenantId();

        using (CurrentTenant.Change(null))
        {
            await _tenantProfileUpdater.UpdateAsync(tenantId, input);
        }
    }

    /// <summary>Host'un kurum profili yoktur; ekran host'ta basılmaz, bu doğrudan çağrıya karşı kapı.</summary>
    private Guid RequireTenantId()
        => CurrentTenant.Id ?? throw new BusinessException("Platform:Error:CompanyProfileHostContext");
}
