using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using System.Linq.Dynamic.Core;
using Volo.Abp.Data;

namespace Apya.Platform.Tenants;

[Authorize(TenantManagementPermissions.Tenants.Default)]
public class TenantProfileAppService : PlatformAppService, ITenantProfileAppService
{
    private readonly ITenantRepository _tenantRepository;
    private readonly ITenantManager _tenantManager;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantPackageManager _tenantPackageManager;
    private readonly TenantSubscriptionManager _tenantSubscriptionManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IUnitOfWorkManager _unitOfWorkManager;
    private readonly TenantProvisioner _tenantProvisioner;
    private readonly TenantProfileUpdater _tenantProfileUpdater;
    private readonly IIdentityUserRepository _identityUserRepository;
    private readonly IdentityUserManager _userManager;

    /// <summary>Şifre belirleme listesinde gösterilen kullanıcı tavanı.</summary>
    private const int MaxTenantUsers = 500;

    public TenantProfileAppService(
        ITenantRepository tenantRepository,
        ITenantManager tenantManager,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantPackageManager tenantPackageManager,
        TenantSubscriptionManager tenantSubscriptionManager,
        IRepository<TenantSubscription, Guid> subscriptionRepository,
        IUnitOfWorkManager unitOfWorkManager,
        TenantProvisioner tenantProvisioner,
        TenantProfileUpdater tenantProfileUpdater,
        IIdentityUserRepository identityUserRepository,
        IdentityUserManager userManager)
    {
        _tenantRepository = tenantRepository;
        _tenantManager = tenantManager;
        _tenantProfileRepository = tenantProfileRepository;
        _tenantPackageManager = tenantPackageManager;
        _tenantSubscriptionManager = tenantSubscriptionManager;
        _subscriptionRepository = subscriptionRepository;
        _unitOfWorkManager = unitOfWorkManager;
        _tenantProvisioner = tenantProvisioner;
        _tenantProfileUpdater = tenantProfileUpdater;
        _identityUserRepository = identityUserRepository;
        _userManager = userManager;
    }

    public async Task<PagedResultDto<TenantProfileDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        string? sorting = input.Sorting;
        if (string.IsNullOrEmpty(sorting) || !sorting.StartsWith("name", StringComparison.OrdinalIgnoreCase))
        {
            sorting = "Name asc";
        }

        var tenants = await _tenantRepository.GetListAsync(sorting: sorting, maxResultCount: input.MaxResultCount, skipCount: input.SkipCount);
        var totalCount = await _tenantRepository.GetCountAsync();

        var tenantIds = tenants.Select(t => t.Id).ToList();
        var profiles = await _tenantProfileRepository.GetListAsync(p => tenantIds.Contains(p.TenantId));

        // Yürürlükteki abonelikler tek sorguda: satırı olmayan müşteri süresiz sayılır.
        var subscriptions = await _subscriptionRepository.GetListAsync(
            s => tenantIds.Contains(s.TenantId)
                 && (s.Status == SubscriptionStatus.Active || s.Status == SubscriptionStatus.InGrace));

        var dtos = new List<TenantProfileDto>();
        foreach (var tenant in tenants)
        {
            var profile = profiles.FirstOrDefault(p => p.TenantId == tenant.Id);
            var subscription = subscriptions
                .Where(s => s.TenantId == tenant.Id)
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefault();
            dtos.Add(new TenantProfileDto
            {
                Id = profile?.Id ?? Guid.Empty,
                TenantId = tenant.Id,
                TenantName = tenant.Name,
                PackageCode = profile?.PackageCode ?? PackageCode.Basic,
                CompanyType = profile?.CompanyType ?? CompanyType.Company,
                TaxNumber = profile?.TaxNumber ?? string.Empty,
                Address = profile?.Address ?? string.Empty,
                LegalRepresentativeName = profile?.LegalRepresentativeName ?? string.Empty,
                LegalRepresentativePhone = profile?.LegalRepresentativePhone ?? string.Empty,
                OperationalContactName = profile?.OperationalContactName ?? string.Empty,
                OperationalContactPhone = profile?.OperationalContactPhone ?? string.Empty,
                IsActive = true,
                SubscriptionPeriod = subscription?.Period ?? SubscriptionPeriod.Unlimited,
                // Ek süredeyse müşterinin gerçekten kapanacağı tarih gösterilir.
                SubscriptionEndDate = subscription?.EffectiveEndDate,
                IsInGracePeriod = subscription?.Status == SubscriptionStatus.InGrace
            });
        }

        return new PagedResultDto<TenantProfileDto>(totalCount, dtos);
    }

    /// <summary>
    /// Host'un "Yeni Müşteri" modalı. Kurulumun kendisi <see cref="TenantProvisioner"/>'da:
    /// aynı gövde, adayın protokol onayından (oturumsuz, davet jetonuyla yetkilendirilmiş)
    /// da çağrılıyor. Yetki kapısı burada kalır.
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Create)]
    public async Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input)
    {
        var provisioned = await _tenantProvisioner.ProvisionAsync(input);

        var result = ObjectMapper.Map<TenantProfile, TenantProfileDto>(provisioned.Profile);
        FillSubscription(result, provisioned.Subscription);

        return result;
    }

    /// <summary>
    /// Var olan bir tenant'ın paketini değiştirir, feature setini yeniden uygular ve yeni
    /// bir abonelik dönemi başlatır (yürürlükteki dönem kapanır — kalan süre yanar).
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> AssignPackageAsync(
        Guid tenantId,
        PackageCode packageCode,
        SubscriptionPeriod period)
    {
        using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);

        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (profile == null)
        {
            throw new UserFriendlyException("Bu tenant için profil bulunamadı; önce profil oluşturun.");
        }

        profile.SetPackage(packageCode);
        await _tenantProfileRepository.UpdateAsync(profile);

        await _tenantPackageManager.ApplyPackageAsync(tenantId, packageCode);

        var subscription = await _tenantSubscriptionManager.StartAsync(
            tenantId, packageCode, period, SubscriptionSource.Manual);

        var result = ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
        FillSubscription(result, subscription);

        await uow.CompleteAsync();
        return result;
    }

    /// <summary>
    /// Yürürlükteki paketi bir dönem daha uzatır. Paket değişmediği için feature/izin
    /// yeniden uygulanmaz; yalnız bitiş tarihi ileri alınır ve kalan süre korunur.
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> RenewPackageAsync(Guid tenantId, SubscriptionPeriod period)
    {
        using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);

        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);
        if (profile == null)
        {
            throw new UserFriendlyException("Bu tenant için profil bulunamadı; önce profil oluşturun.");
        }

        // Süresiz uzatma anlamsızdır: süresiz zaten hiç bitmez.
        if (period == SubscriptionPeriod.Unlimited)
        {
            throw new UserFriendlyException("Uzatma için bir süre seçin; süresize çevirmek için paket atayın.");
        }

        var subscription = await _tenantSubscriptionManager.RenewAsync(
            tenantId, period, SubscriptionSource.Manual);

        var result = ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
        FillSubscription(result, subscription);

        await uow.CompleteAsync();
        return result;
    }

    private static void FillSubscription(TenantProfileDto dto, TenantSubscription subscription)
    {
        dto.SubscriptionPeriod = subscription.Period;
        dto.SubscriptionEndDate = subscription.EffectiveEndDate;
        dto.IsInGracePeriod = subscription.Status == SubscriptionStatus.InGrace;
    }

    public async Task<TenantProfileDto> GetProfileAsync(Guid tenantId)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            var defaultTenant = await _tenantRepository.FindAsync(tenantId);
            return new TenantProfileDto
            {
                TenantId = tenantId,
                TenantName = defaultTenant?.Name ?? "",
                CompanyType = CompanyType.Company
            };
        }

        var dto = ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);

        // Abonelik ayrı aggregate: AutoMapper doldurmaz, satır yoksa süresiz kalır.
        var subscription = await _tenantSubscriptionManager.GetCurrentOrNullAsync(tenantId);
        if (subscription != null)
        {
            FillSubscription(dto, subscription);
        }

        return dto;
    }

    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<TenantProfileDto> UpdateProfileAsync(Guid tenantId, UpdateTenantProfileDto input)
    {
        var profile = await _tenantProfileUpdater.UpdateAsync(tenantId, input);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }

    /// <summary>
    /// Kiracının kullanıcıları. Okuma KİRACI BAĞLAMINA geçilerek yapılır: host bağlamında
    /// (TenantId = null) kiracı süzgeci hiçbir kullanıcıyı döndürmez.
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task<List<TenantUserDto>> GetTenantUsersAsync(Guid tenantId)
    {
        EnsureHostContext();

        using (CurrentTenant.Change(tenantId))
        {
            var users = await _identityUserRepository.GetListAsync(
                sorting: nameof(IdentityUser.UserName),
                maxResultCount: MaxTenantUsers);

            return users.Select(user => new TenantUserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email ?? string.Empty,
                DisplayName = BuildDisplayName(user)
            }).ToList();
        }
    }

    /// <summary>
    /// Kiracı kullanıcısına eski şifre sorulmadan yeni şifre yazar.
    ///
    /// <para>🔑 <c>RemovePassword + AddPassword</c> — ABP'nin kendi
    /// <c>IdentityUserAppService.UpdateAsync</c>'iyle aynı ikili. İkisi de güvenlik damgasını
    /// tazeler (kullanıcının açık oturumları düşer) ve <c>AddPassword</c> şifre politikasını
    /// uygular.</para>
    ///
    /// <para>🔴 <b>Sıfırlama JETONU kullanılmıyor.</b> <c>GeneratePasswordResetTokenAsync</c>
    /// iki faktör jeton sağlayıcısına bağlıdır; sağlayıcı yalnız Web konağında kayıtlı olduğu
    /// için entegrasyon testlerinde "No IUserTwoFactorTokenProvider named 'Default'" ile
    /// düşüyordu (ölçüldü). Jetonsuz ikili her bağlamda aynı çalışır.</para>
    ///
    /// <para>Şifre politikaya takılırsa <c>AddPassword</c> hata fırlatır ve UoW geri sarar;
    /// kullanıcı şifresiz kalmaz.</para>
    /// </summary>
    [Authorize(TenantManagementPermissions.Tenants.Update)]
    public async Task SetTenantUserPasswordAsync(Guid tenantId, Guid userId, string newPassword)
    {
        EnsureHostContext();

        using (CurrentTenant.Change(tenantId))
        {
            // 🔴 Kullanıcı kiracı süzgecinin ALTINDA aranır: başka bir müşterinin kullanıcı
            // kimliği gönderilse bile "bulunamadı" döner, yanlış hesaba şifre yazılamaz.
            var user = await _userManager.GetByIdAsync(userId);

            (await _userManager.RemovePasswordAsync(user)).CheckErrors();
            (await _userManager.AddPasswordAsync(user, newPassword)).CheckErrors();
        }
    }

    /// <summary>
    /// 🔴 Şifre uçları YALNIZ host bağlamında çalışır. İzin host tarafına tanımlı olsa da
    /// host kullanıcısı "Hesabına Gir" ile bir kiracının içindeyken de bu servise ulaşır;
    /// orada <c>tenantId</c> parametresi bambaşka bir müşteriyi gösteriyor olabilir.
    /// </summary>
    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new UserFriendlyException(
                "Bu işlem yalnız host hesabında yapılabilir; önce müşteri hesabından çıkın.");
        }
    }

    private static string BuildDisplayName(IdentityUser user)
    {
        var fullName = $"{user.Name} {user.Surname}".Trim();

        return fullName.IsNullOrWhiteSpace() ? user.UserName : fullName;
    }
}
