using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;

namespace Apya.Platform.Identity;

/// <summary>
/// Tekil ad kuralından (<see cref="GlobalUniqueUserNameValidator"/>) ÖNCE açılmış çakışan adları
/// ayırır. Aynı adı taşıyan yaşayan hesaplardan biri adını korur — host hesabı varsa o, yoksa en
/// eski hesap; ötekiler "<c>ad.kiracı</c>" olur (alınmışsa sonuna sayı). Silinmiş kiracıların
/// kullanıcılarına dokunulmaz, sayılmaz da. Çakışma yoksa hiçbir şey yapmaz; DbMigrator her
/// çalıştığında güvenle koşar.
///
/// <para>Adı değişen kişi e-postasıyla girmeye devam eder; güvenlik damgası yenilendiği için açık
/// oturumu kapanır.</para>
/// </summary>
public class DuplicateUserNameRenamer : DomainService
{
    private readonly IRepository<IdentityUser, Guid> _userRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly IdentityUserManager _userManager;
    private readonly UniqueUserNameChecker _userNameChecker;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public DuplicateUserNameRenamer(
        IRepository<IdentityUser, Guid> userRepository,
        ITenantRepository tenantRepository,
        IDataFilter<IMultiTenant> multiTenantFilter,
        IdentityUserManager userManager,
        UniqueUserNameChecker userNameChecker,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _multiTenantFilter = multiTenantFilter;
        _userManager = userManager;
        _userNameChecker = userNameChecker;
        _unitOfWorkManager = unitOfWorkManager;
    }

    /// <returns>Adı değiştirilen hesap sayısı.</returns>
    public virtual async Task<int> RenameAsync()
    {
        var renamed = 0;
        foreach (var (userId, tenantId, tenantName) in await FindUsersToRenameAsync())
        {
            // Her hesap kendi işleminde: biri düşerse ötekiler kalır, sonraki öneri öncekini görür.
            try
            {
                using var uow = _unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
                using (CurrentTenant.Change(tenantId))
                {
                    var user = await _userManager.GetByIdAsync(userId);
                    var oldName = user.UserName;
                    var newName = await _userNameChecker.SuggestAvailableAsync(
                        oldName + "." + UniqueUserNameChecker.ToSlug(tenantName));

                    // Doğrulama hatasında ABP fırlatır; dönen sonuç yine de denetlenir.
                    var result = await _userManager.SetUserNameAsync(user, newName);
                    if (!result.Succeeded)
                    {
                        throw new AbpIdentityResultException(result);
                    }
                    await uow.CompleteAsync();

                    Logger.LogInformation(
                        "Kullanıcı adı çakışması: {TenantName} kiracısındaki '{OldName}' → '{NewName}'.",
                        tenantName, oldName, newName);
                    renamed++;
                }
            }
            catch (Exception exception)
            {
                Logger.LogWarning(exception, "Kullanıcı adı çakışması çözülemedi: kullanıcı {UserId}.", userId);
            }
        }

        return renamed;
    }

    [UnitOfWork]
    protected virtual async Task<List<(Guid UserId, Guid TenantId, string TenantName)>> FindUsersToRenameAsync()
    {
        var tenantNames = (await _tenantRepository.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);

        List<(Guid Id, Guid? TenantId, string NormalizedUserName, DateTime CreationTime)> users;
        using (_multiTenantFilter.Disable())
        {
            var queryable = await _userRepository.GetQueryableAsync();
            var duplicateNames = queryable
                .GroupBy(u => u.NormalizedUserName)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            users = (await AsyncExecuter.ToListAsync(
                    queryable
                        .Where(u => duplicateNames.Contains(u.NormalizedUserName))
                        .Select(u => new { u.Id, u.TenantId, u.NormalizedUserName, u.CreationTime })))
                .Select(u => (u.Id, u.TenantId, u.NormalizedUserName, u.CreationTime))
                .ToList();
        }

        return users
            .Where(u => u.TenantId == null || tenantNames.ContainsKey(u.TenantId.Value))
            .GroupBy(u => u.NormalizedUserName)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g
                .OrderBy(u => u.TenantId == null ? 0 : 1)
                .ThenBy(u => u.CreationTime)
                .ThenBy(u => u.Id)
                .Skip(1))
            .Select(u => (u.Id, u.TenantId!.Value, tenantNames[u.TenantId!.Value]))
            .ToList();
    }
}
