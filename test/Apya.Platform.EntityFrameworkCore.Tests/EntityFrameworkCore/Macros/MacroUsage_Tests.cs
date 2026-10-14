using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Apya.Platform.Macros;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Security.Claims;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Macros;

/// <summary>
/// Makro Ekran kullanım sayacı: günlük toplanır (her tıklama satır yazmaz), yalnız katalogdaki
/// anahtar sayılır, sıralama son 30 güne bakar, pencere dışı satırlar tüm kiracılarda silinir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class MacroUsage_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IMacroScreenAppService _service;
    private readonly MacroUsageManager _manager;
    private readonly IRepository<MacroUsageDaily, Guid> _usage;
    private readonly ICurrentPrincipalAccessor _principal;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _tenantFilter;
    private readonly DateTime _now;

    public MacroUsage_Tests()
    {
        _service = GetRequiredService<IMacroScreenAppService>();
        _manager = GetRequiredService<MacroUsageManager>();
        _usage = GetRequiredService<IRepository<MacroUsageDaily, Guid>>();
        _principal = GetRequiredService<ICurrentPrincipalAccessor>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _tenantFilter = GetRequiredService<IDataFilter<IMultiTenant>>();
        _now = GetRequiredService<IClock>().Now;
    }

    private IDisposable As(Guid userId) => _principal.Change(
        new ClaimsPrincipal(new ClaimsIdentity(new List<Claim>
        {
            new(AbpClaimTypes.UserId, userId.ToString()),
            new(AbpClaimTypes.UserName, "kullanim-" + userId.ToString("N")[..6])
        }, "Test")));

    private async Task RecordAsync(Guid userId, string key)
    {
        using (As(userId))
        {
            await WithUnitOfWorkAsync(() => _service.RecordUseAsync(key));
        }
    }

    private async Task<Dictionary<string, int>> UsageAsync(Guid userId)
    {
        using (As(userId))
        {
            return await WithUnitOfWorkAsync(() => _service.GetMyUsageAsync());
        }
    }

    private Task SeedAsync(Guid? tenantId, Guid userId, string key, int daysAgo, int count = 1)
        => WithUnitOfWorkAsync(async () =>
        {
            var row = new MacroUsageDaily(Guid.NewGuid(), tenantId, userId, key, _now.Date.AddDays(-daysAgo));
            for (var i = 1; i < count; i++)
            {
                row.Increment();
            }

            await _usage.InsertAsync(row, autoSave: true);
        });

    [Fact]
    public async Task Ayni_gun_ayni_makro_tek_satiri_artirir()
    {
        var me = Guid.NewGuid();

        await RecordAsync(me, "TaskCreate");
        await RecordAsync(me, "TaskCreate");
        await RecordAsync(me, "ExpenseCreate");

        var rows = await WithUnitOfWorkAsync(() => _usage.GetListAsync(x => x.UserId == me));
        rows.Count.ShouldBe(2);
        rows.Single(x => x.MacroKey == "TaskCreate").Count.ShouldBe(2);
        (await UsageAsync(me)).ShouldBe(new Dictionary<string, int> { ["TaskCreate"] = 2, ["ExpenseCreate"] = 1 }, ignoreOrder: true);
    }

    /// <summary>İstemci ateşle-unut çağırır; keyfi anahtar tabloya satır olarak girmemeli.</summary>
    [Fact]
    public async Task Katalogda_olmayan_anahtar_sayilmaz()
    {
        var me = Guid.NewGuid();

        await RecordAsync(me, "Uydurma");
        await RecordAsync(me, "taskcreate"); // anahtar harf duyarlı
        await RecordAsync(me, "");

        (await WithUnitOfWorkAsync(() => _usage.CountAsync(x => x.UserId == me))).ShouldBe(0);
    }

    [Fact]
    public async Task Siralama_son_30_gune_ve_yalniz_kullanicinin_kendisine_bakar()
    {
        var me = Guid.NewGuid();
        await SeedAsync(_currentTenant.Id, me, "IncomeCreate", daysAgo: 0, count: 3);
        await SeedAsync(_currentTenant.Id, me, "IncomeCreate", daysAgo: MacroUsageConsts.WindowDays - 1, count: 2); // pencerenin ilk günü
        await SeedAsync(_currentTenant.Id, me, "IncomeCreate", daysAgo: MacroUsageConsts.WindowDays, count: 50);     // pencere dışı
        await SeedAsync(_currentTenant.Id, Guid.NewGuid(), "IncomeCreate", daysAgo: 0, count: 9);                    // başkası

        (await UsageAsync(me))["IncomeCreate"].ShouldBe(5);
    }

    [Fact]
    public async Task Pencere_disi_satirlar_tum_kiracilarda_silinir()
    {
        var user = Guid.NewGuid();
        var otherTenant = Guid.NewGuid();
        await SeedAsync(_currentTenant.Id, user, "TaskCreate", daysAgo: MacroUsageConsts.WindowDays + 5);
        await SeedAsync(otherTenant, user, "TaskCreate", daysAgo: MacroUsageConsts.WindowDays);
        await SeedAsync(otherTenant, user, "TaskCreate", daysAgo: 1);

        var deleted = await WithUnitOfWorkAsync(() => _manager.DeleteOutsideWindowAsync(_now));

        deleted.ShouldBeGreaterThanOrEqualTo(2);
        var remaining = await WithUnitOfWorkAsync(async () =>
        {
            using (_tenantFilter.Disable())
            {
                return await _usage.GetListAsync(x => x.UserId == user);
            }
        });
        remaining.Count.ShouldBe(1);
        remaining[0].TenantId.ShouldBe(otherTenant);
        remaining[0].Day.ShouldBe(_now.Date.AddDays(-1));
    }
}
