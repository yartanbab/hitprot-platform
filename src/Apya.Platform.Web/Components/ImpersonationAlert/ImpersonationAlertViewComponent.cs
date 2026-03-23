using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Components.ImpersonationAlert;

public class ImpersonationAlertViewComponent : AbpViewComponent
{
    private readonly ICurrentUser _currentUser;

    public ImpersonationAlertViewComponent(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    public IViewComponentResult Invoke()
    {
        if (_currentUser.FindImpersonatorUserId().HasValue)
        {
            var impersonatorTenantId = _currentUser.FindImpersonatorTenantId();
            var model = new ImpersonationAlertViewModel
            {
                IsImpersonated = true,
                CurrentTenantName = _currentUser.TenantId.HasValue ? "Bu Müşteri" : "Host",
                ImpersonatorTenantId = impersonatorTenantId
            };
            return View(model);
        }

        return View(new ImpersonationAlertViewModel { IsImpersonated = false });
    }
}

public class ImpersonationAlertViewModel
{
    public bool IsImpersonated { get; set; }
    public string CurrentTenantName { get; set; } = string.Empty;
    public System.Guid? ImpersonatorTenantId { get; set; }
}
