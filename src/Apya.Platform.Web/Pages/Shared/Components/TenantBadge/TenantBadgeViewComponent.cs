using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Components.TenantBadge;

/// <summary>
/// Site-wide sidebar tenant rozeti (LayoutHooks.Body.First ile her sayfaya).
/// Bilgilendirici — tıklanamaz, gerçek tenant geçişi yapmaz (P4 kapsam kararı).
/// Body.First hook'unda gizli render edilir; dark-mode.js sidebar logo altına
/// taşıyıp gösterir (LeptonX'in derlenmiş sidebar partial'ını override etmek
/// yerine, mevcut breadcrumb-injection deseniyle aynı yaklaşım).
/// </summary>
public class TenantBadgeViewComponent : AbpViewComponent
{
    private readonly ICurrentTenant _currentTenant;
    private readonly ITenantRepository _tenantRepository;
    private readonly IPermissionChecker _permissionChecker;

    public TenantBadgeViewComponent(
        ICurrentTenant currentTenant,
        ITenantRepository tenantRepository,
        IPermissionChecker permissionChecker)
    {
        _currentTenant = currentTenant;
        _tenantRepository = tenantRepository;
        _permissionChecker = permissionChecker;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var model = new TenantBadgeViewModel
        {
            TenantName = _currentTenant.Name ?? "Apya Platform",
        };

        // Toplam tenant sayısı yalnızca Tenant Yönetimi yetkisi olanlara gösterilir
        // (host admin dahil) — yetkisiz kullanıcıya sistem çapında tenant sayısı sızmasın.
        if (await _permissionChecker.IsGrantedAsync(TenantManagementPermissions.Tenants.Default))
        {
            model.TenantCount = await _tenantRepository.GetCountAsync();
        }

        return View(model);
    }
}

public class TenantBadgeViewModel
{
    public string TenantName { get; set; } = string.Empty;
    public long? TenantCount { get; set; }
}
