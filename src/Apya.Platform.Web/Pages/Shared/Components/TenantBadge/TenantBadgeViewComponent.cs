using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.TenantBadge;

/// <summary>
/// Header'daki müşteri (tenant) rozeti / değiştiricisi.
/// LayoutHooks.Body.Last ile her sayfaya eklenir; View'daki senkron script
/// header toolbar'ına taşır — LeptonX'in derlenmiş topbar partial'ını override
/// etmek yerine, sidebar rozetinde de kullanılmış olan doğrulanmış desen.
///
/// GÜVENLİK: tenant LİSTESİ yalnızca <c>AbpTenantManagement.Tenants.Default</c>
/// yetkisi olan kullanıcıya doldurulur. Yetkisiz kullanıcı yalnız kendi tenant
/// adını gören, tıklanamaz bir rozet görür — sistemdeki diğer tenant'ların
/// varlığı/adı sızmaz. Geçişin KENDİSİ burada yapılmaz: ABP'nin kendi
/// denetlenmiş <c>/Account/ImpersonateTenant</c> uç noktasına antiforgery
/// token'lı form POST'u ile devredilir, yani yeni bir yetkilendirme yüzeyi
/// açılmaz (Tenant Yönetimi sayfasındaki "Hesabına Gir" ile aynı yol).
/// </summary>
public class TenantBadgeViewComponent : AbpViewComponent
{
    /// <summary>Açılır listede gösterilecek azami tenant sayısı; üstü "Tümünü gör" linkine düşer.</summary>
    public const int MaxListedTenants = 50;

    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;
    private readonly ITenantRepository _tenantRepository;
    private readonly IPermissionChecker _permissionChecker;

    public TenantBadgeViewComponent(
        ICurrentTenant currentTenant,
        ICurrentUser currentUser,
        ITenantRepository tenantRepository,
        IPermissionChecker permissionChecker)
    {
        _currentTenant = currentTenant;
        _currentUser = currentUser;
        _tenantRepository = tenantRepository;
        _permissionChecker = permissionChecker;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var model = new TenantBadgeViewModel
        {
            TenantName = _currentTenant.Name ?? "Host",
            CurrentTenantId = _currentTenant.Id,
            IsImpersonated = _currentUser.FindImpersonatorUserId().HasValue
        };

        // Tek yetki kapısı: toplam sayı da, LİSTE de bunun arkasında.
        // (Sayı zaten bu kontrolün arkasındaydı; liste aynı kapıya alındı.)
        if (await _permissionChecker.IsGrantedAsync(TenantManagementPermissions.Tenants.Default))
        {
            model.CanSwitch = true;
            model.TenantCount = await _tenantRepository.GetCountAsync();

            var tenants = await _tenantRepository.GetListAsync();
            model.Tenants = tenants
                .OrderBy(t => t.Name)
                .Take(MaxListedTenants)
                .Select(t => new TenantBadgeItem { Id = t.Id, Name = t.Name })
                .ToList();
            model.HasMore = model.TenantCount > MaxListedTenants;
        }

        return View(model);
    }
}

public class TenantBadgeViewModel
{
    /// <summary>Geçerli tenant adı; host bağlamında "Host".</summary>
    public string TenantName { get; set; } = string.Empty;

    public Guid? CurrentTenantId { get; set; }

    /// <summary>Toplam tenant sayısı — yalnız yetkili kullanıcıda dolar.</summary>
    public long? TenantCount { get; set; }

    /// <summary>Açılır liste render edilsin mi (yetki kapısı).</summary>
    public bool CanSwitch { get; set; }

    /// <summary>Şu an başka bir hesap adına işlem yapılıyor mu.</summary>
    public bool IsImpersonated { get; set; }

    /// <summary>Listelenen tenant'lar (en fazla <see cref="TenantBadgeViewComponent.MaxListedTenants"/>).</summary>
    public List<TenantBadgeItem> Tenants { get; set; } = new();

    /// <summary>Listelenenden fazla tenant var mı (yönetim sayfasına link gösterilir).</summary>
    public bool HasMore { get; set; }
}

public class TenantBadgeItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
