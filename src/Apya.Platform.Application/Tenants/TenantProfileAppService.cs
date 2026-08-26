using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;
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
    private readonly TenantProfileManager _tenantProfileManager;
    private readonly TenantPackageManager _tenantPackageManager;
    private readonly TenantSubscriptionManager _tenantSubscriptionManager;
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IDataSeeder _dataSeeder;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public TenantProfileAppService(
        ITenantRepository tenantRepository,
        ITenantManager tenantManager,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantProfileManager tenantProfileManager,
        TenantPackageManager tenantPackageManager,
        TenantSubscriptionManager tenantSubscriptionManager,
        IRepository<TenantSubscription, Guid> subscriptionRepository,
        IDataSeeder dataSeeder,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _tenantRepository = tenantRepository;
        _tenantManager = tenantManager;
        _tenantProfileRepository = tenantProfileRepository;
        _tenantProfileManager = tenantProfileManager;
        _tenantPackageManager = tenantPackageManager;
        _tenantSubscriptionManager = tenantSubscriptionManager;
        _subscriptionRepository = subscriptionRepository;
        _dataSeeder = dataSeeder;
        _unitOfWorkManager = unitOfWorkManager;
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

    [Authorize(TenantManagementPermissions.Tenants.Create)]
    public async Task<TenantProfileDto> CreateTenantWithProfileAsync(CreateTenantExtendedDto input)
    {
        // Tenant oluşturma + seed'i KENDİ requiresNew + transactional UnitOfWork'ünde yürütüyoruz.
        // Aksi halde işlem dıştaki sayfa UoW'una (AbpUowPageFilter) katılır; seed edilen admin
        // permission grant'ları hem seed sırasında hem sayfa UoW'unun SaveChanges'inde izlenip
        // İKİ KEZ INSERT edilir → IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey
        // (23505 duplicate) → "Yeni Müşteri" 500. Tek sahip UoW + tek geçiş seed ile grant'lar
        // tam olarak bir kez yazılır. (Bu yüzden contributor'daki iç içe requiresNew de kaldırıldı.)
        using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);

        var tenant = await _tenantManager.CreateAsync(input.Name);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);

        using (CurrentTenant.Change(tenant.Id, tenant.Name))
        {
            await _dataSeeder.SeedAsync(new DataSeedContext(tenant.Id).WithProperty("AdminEmail", input.AdminEmailAddress).WithProperty("AdminPassword", input.AdminPassword));
        }

        var profile = await _tenantProfileManager.CreateProfileAsync(
            tenant.Id,
            input.CompanyType,
            input.TaxNumber,
            input.CorporateEmail
        );

        profile.SetPackage(input.PackageCode);
        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

        await _tenantProfileRepository.InsertAsync(profile);

        // Paketin feature setini tenant'a uygula → feature'lar permission tavanını belirler.
        await _tenantPackageManager.ApplyPackageAsync(tenant.Id, input.PackageCode);

        // Abonelik dönemi: süresiz seçilirse satır yine açılır ama EndDate boş kalır, yani
        // süre işleyicisi bu müşteriye hiç dokunmaz.
        var subscription = await _tenantSubscriptionManager.StartAsync(
            tenant.Id, input.PackageCode, input.SubscriptionPeriod, SubscriptionSource.Manual);

        var result = ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
        FillSubscription(result, subscription);

        await uow.CompleteAsync();

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
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(x => x.TenantId == tenantId);

        if (profile == null)
        {
            var newProfile = await _tenantProfileManager.CreateProfileAsync(
                tenantId,
                input.CompanyType,
                input.TaxNumber ?? string.Empty,
                input.CorporateEmail ?? string.Empty
            );

            newProfile.TaxOffice = input.TaxOffice ?? string.Empty;
            newProfile.Address = input.Address ?? string.Empty;
            newProfile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
            newProfile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
            newProfile.OperationalContactName = input.OperationalContactName ?? string.Empty;
            newProfile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

            await _tenantProfileRepository.InsertAsync(newProfile);

            return ObjectMapper.Map<TenantProfile, TenantProfileDto>(newProfile);
        }

        await _tenantProfileManager.CheckTaxNumberUniqueAsync(input.TaxNumber, profile.Id);

        profile.CompanyType = input.CompanyType;
        profile.TaxNumber = input.TaxNumber ?? string.Empty;
        profile.TaxOffice = input.TaxOffice ?? string.Empty;
        profile.Address = input.Address ?? string.Empty;
        profile.CorporateEmail = input.CorporateEmail ?? string.Empty;
        profile.LegalRepresentativeName = input.LegalRepresentativeName ?? string.Empty;
        profile.LegalRepresentativePhone = input.LegalRepresentativePhone ?? string.Empty;
        profile.OperationalContactName = input.OperationalContactName ?? string.Empty;
        profile.OperationalContactPhone = input.OperationalContactPhone ?? string.Empty;

        await _tenantProfileRepository.UpdateAsync(profile);

        return ObjectMapper.Map<TenantProfile, TenantProfileDto>(profile);
    }
}
