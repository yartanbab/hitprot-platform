using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Security.Claims;

namespace Apya.Platform.Permissions;

/// <summary>
/// GAP-011 / RF-004: Gelişmiş Yetkilendirme (Attribute-Based Access Control - ABAC)
/// Allows granting or prohibiting permissions dynamically based on the identity attributes
/// like 'client_id' = 'ai_agent', enforcing fine-grained boundaries that shouldn't just be saved in DB.
/// </summary>
public class AiAttributePermissionValueProvider : PermissionValueProvider
{
    public const string ProviderName = "DynamicABAC";

    public override string Name => ProviderName;

    private readonly ICurrentPrincipalAccessor _principalAccessor;

    public AiAttributePermissionValueProvider(
        IPermissionStore permissionStore, 
        ICurrentPrincipalAccessor principalAccessor) 
        : base(permissionStore)
    {
        _principalAccessor = principalAccessor;
    }

    public override Task<PermissionGrantResult> CheckAsync(PermissionValueCheckContext context)
    {
        var principal = context.Principal ?? _principalAccessor.Principal;
        
        // 1. Öznitelik (Attribute) Çıkarsaması
        var isAiAgent = principal != null && principal.Claims.Any(c => c.Type == "client_id" && c.Value == "ai_agent");

        if (isAiAgent)
        {
            // AI kullanıcısı asla silme yetkisine sahip olamaz (Dinamik Policy Engellemesi)
            if (context.Permission.Name.Contains(".Delete"))
            {
                return Task.FromResult(PermissionGrantResult.Prohibited);
            }

            // AI kullanıcısı her zaman analiz/ai yetkilerine sahiptir (Dinamik İzin Verilmesi)
            if (context.Permission.Name == PlatformPermissions.Projects.UseAiFeatures)
            {
                return Task.FromResult(PermissionGrantResult.Granted);
            }
        }

        // 2. Özel Durumlar: Proje Bütçe Yönetimi 
        var isFinancialOfficer = principal != null && principal.Claims.Any(c => c.Type == "department" && c.Value == "Finance");
        if (isFinancialOfficer && context.Permission.Name == PlatformPermissions.Projects.ViewBudget)
        {
            return Task.FromResult(PermissionGrantResult.Granted);
        }

        return Task.FromResult(PermissionGrantResult.Undefined); // ABP standart Rol ve User izinlerine pass geçer
    }

    public override async Task<MultiplePermissionGrantResult> CheckAsync(PermissionValuesCheckContext context)
    {
        var result = new MultiplePermissionGrantResult();
        
        foreach (var permission in context.Permissions)
        {
            var singleResult = await CheckAsync(new PermissionValueCheckContext(permission, context.Principal));
            result.Result.Add(permission.Name, singleResult);
        }

        return result;
    }
}
