using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Finans bildiriminin kime gideceğini belirler.
///
/// <para>Ayrı bir bileşen olmasının sebebi, finansın diğer alanlardan FARKLI bir
/// alıcı kuralına ihtiyaç duyması. Mevcut üreticilerin çoğu "kiracının tüm aktif
/// kullanıcıları" diyor; finansta bu kullanılamaz, çünkü bildirim gövdesi tutar
/// taşır ("onaylanan 400.000, harcanan 448.000"). Hedef sayfanın izin denetimi
/// bunu kurtarmaz: kullanıcı sayfayı açamasa bile rakamı zilde okumuş olur.</para>
///
/// <para>Kural: projenin <see cref="ProjectMemberRole.Lead"/> üyeleri. Ekipte Lead
/// yoksa projeyi oluşturan kişi. Her aday ayrıca
/// <see cref="PlatformPermissions.Projects.ViewBudget"/> iznine göre süzülür —
/// üyelik rolü bu depoda YETKİ TAŞIMAZ (bkz. <see cref="ProjectMemberRole"/>),
/// dolayısıyla "Lead olmak" tek başına bütçeyi görme hakkı vermez.</para>
///
/// <para>Member ve Observer dışarıda: ekibin tamamına gönderilseydi bütçe rakamı
/// projeye eklenmiş her stajyere ve dış paydaşa düşerdi.</para>
/// </summary>
public class FinanceNotificationRecipientResolver : ITransientDependency
{
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IPermissionStore _permissionStore;

    public FinanceNotificationRecipientResolver(
        IRepository<ProjectMember, Guid> memberRepository,
        IRepository<Project, Guid> projectRepository,
        IIdentityUserRepository userRepository,
        IPermissionStore permissionStore)
    {
        _memberRepository = memberRepository;
        _projectRepository = projectRepository;
        _userRepository = userRepository;
        _permissionStore = permissionStore;
    }

    /// <summary>
    /// Projenin finans bildirimlerini alacak kullanıcılar. Kimse uygun değilse boş
    /// liste döner — çağıran taraf bunu "gönderecek kimse yok" diye okur, hata değil.
    /// </summary>
    public async Task<IReadOnlyCollection<Guid>> ResolveAsync(Guid projectId)
    {
        var candidates = (await _memberRepository.GetListAsync(
                m => m.ProjectId == projectId && m.Role == ProjectMemberRole.Lead))
            .Select(m => m.UserId)
            .Distinct()
            .ToList();

        if (candidates.Count == 0)
        {
            // Ekip tanımlanmamış projeler var (üyelik kaydı 10. adımda geldi, eski
            // projelerde yok). Bütçeyi kuran kişi en makul tek alıcı.
            var project = await _projectRepository.FindAsync(projectId);
            if (project?.CreatorId != null)
            {
                candidates.Add(project.CreatorId.Value);
            }
        }

        var allowed = new List<Guid>();
        foreach (var userId in candidates)
        {
            if (await CanSeeBudgetAsync(userId))
            {
                allowed.Add(userId);
            }
        }

        return allowed;
    }

    /// <summary>
    /// Kullanıcının bütçe görme izni var mı? İzin doğrudan kullanıcıya ya da
    /// rollerinden birine verilmiş olabilir; ikisi de sorulur.
    ///
    /// <para>ABP'nin <c>IPermissionChecker</c>'ı oturum açmış kullanıcının
    /// principal'ı üzerinden çalışır; burada başka bir kullanıcı adına sorduğumuz
    /// için grant kayıtlarına doğrudan bakılıyor. Sonuç KAPALI tarafa yanılır:
    /// yalnız claim'e dayalı dinamik izinler (bkz. <c>AiAttributePermissionValueProvider</c>)
    /// bu yolla görünmez ve o kullanıcı bildirim almaz — veri sızdırmaktansa
    /// bildirimi kaçırmak tercih edilir.</para>
    /// </summary>
    private async Task<bool> CanSeeBudgetAsync(Guid userId)
    {
        const string permission = PlatformPermissions.Projects.ViewBudget;

        if (await _permissionStore.IsGrantedAsync(
                permission, UserPermissionValueProvider.ProviderName, userId.ToString()))
        {
            return true;
        }

        foreach (var roleName in await _userRepository.GetRoleNamesAsync(userId))
        {
            if (await _permissionStore.IsGrantedAsync(
                    permission, RolePermissionValueProvider.ProviderName, roleName))
            {
                return true;
            }
        }

        return false;
    }
}
