using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Shell;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Menus;

/// <summary>
/// Kenar çubuğu rozetinin sözleşmesi: bekleyen ilgi talepleri KİRACILAR ARASI sayılır.
///
/// <para>🔴 Regresyon kaynağı: talepler kiracıya ait. Sayım host bağlamında kiracı
/// filtresi kapatılmadan yapılırsa sorgu <c>TenantId = null</c> satırlarını arar,
/// hiç bulamaz ve rozet DAİMA 0 kalır — kutuda bekleyen iş varken sessizce.</para>
///
/// <para>ShellAppService yalnız web host'unda çözülebiliyor (<c>IHostEnvironment</c>
/// bağımlılığı), bu yüzden test EF Core değil Web tarafında.</para>
/// </summary>
public class ShellGrantInterestBadge_Tests : PlatformWebTestBase
{
    private static readonly Guid TenantId = Guid.Parse("7c1f0000-cccc-4000-8000-00000000cc01");

    private readonly IShellAppService _shell;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public ShellGrantInterestBadge_Tests()
    {
        _shell = GetRequiredService<IShellAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private async Task<int> PendingBadgeAsync()
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        var state = await _shell.GetStateAsync();
        await uow.CompleteAsync();
        return state.Badges.PendingGrantInterests;
    }

    /// <summary>Tohumlanmış açık bir çağrıya, kiracı bağlamında talep bırakır.</summary>
    private async Task<GrantInterest> CreateTenantInterestAsync()
    {
        using var uow = _uowManager.Begin(requiresNew: true);

        var callRepo = GetRequiredService<IRepository<GrantCall, Guid>>();
        var interestRepo = GetRequiredService<IRepository<GrantInterest, Guid>>();
        var call = (await callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).First();

        GrantInterest interest;
        using (_currentTenant.Change(TenantId))
        {
            interest = new GrantInterest(Guid.NewGuid(), TenantId, call.Id, null, "rozet testi");
            await interestRepo.InsertAsync(interest, autoSave: true);
        }

        await uow.CompleteAsync();
        return interest;
    }

    [Fact]
    public async Task Bekleyen_talep_rozete_yansir_ve_karar_verilince_duser()
    {
        var before = await PendingBadgeAsync();

        var interest = await CreateTenantInterestAsync();
        (await PendingBadgeAsync()).ShouldBe(before + 1,
            "kiracının bekleyen talebi host rozetinde görünmeli");

        // Karara bağlanan talep rozetten düşer: rozet "bekleyen iş" demeli, toplam değil.
        using (var uow = _uowManager.Begin(requiresNew: true))
        {
            var interestRepo = GetRequiredService<IRepository<GrantInterest, Guid>>();
            using (_currentTenant.Change(TenantId))
            {
                var stored = await interestRepo.GetAsync(interest.Id);
                stored.Reject("Uygun değil.", null, DateTime.Now);
                await interestRepo.UpdateAsync(stored, autoSave: true);
            }
            await uow.CompleteAsync();
        }

        (await PendingBadgeAsync()).ShouldBe(before);
    }
}
