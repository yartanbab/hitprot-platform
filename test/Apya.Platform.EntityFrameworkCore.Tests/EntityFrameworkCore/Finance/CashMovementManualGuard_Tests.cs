using System;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Yalnız elle girilen kasa hareketi kendi ucundan silinir/düzenlenir. Gider, gelir, fatura
/// ve transfer hareketleri kaynak kayıtla birlikte yaşar; kısıt yalnız arayüzdeydi ve API'den
/// kaynak hareketin tek bacağı silinip bakiye kaynağından koparılabiliyordu (2026-09-28 UX
/// denetimi).
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CashMovementManualGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-000000000071");

    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly ICurrentTenant _currentTenant;

    public CashMovementManualGuard_Tests()
    {
        _cashMovementAppService = GetRequiredService<ICashMovementAppService>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _cashMovementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateMovementAsync(CashMovementSource source)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
                var account = new CashAccount(Guid.NewGuid(), "Kasa", currency: "TRY", tenantId: Tenant);
                await _cashAccountRepository.InsertAsync(account, autoSave: true);
                await _cashMovementRepository.InsertAsync(
                    new CashMovement(id, account.Id, CashMovementDirection.Out, 100m, DateTime.Today,
                        source: source, referenceId: source == CashMovementSource.Manual ? null : Guid.NewGuid(),
                        tenantId: Tenant),
                    autoSave: true);
            }
        });
        return id;
    }

    [Theory]
    [InlineData(CashMovementSource.Expense)]
    [InlineData(CashMovementSource.Income)]
    [InlineData(CashMovementSource.Invoice)]
    [InlineData(CashMovementSource.Transfer)]
    public async Task Source_Movement_Cannot_Be_Deleted_From_Its_Own_Endpoint(CashMovementSource source)
    {
        var id = await CreateMovementAsync(source);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                var ex = await Should.ThrowAsync<BusinessException>(
                    async () => await _cashMovementAppService.DeleteAsync(id));
                ex.Code.ShouldBe(PlatformDomainErrorCodes.CashMovementNotManual);
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                (await _cashMovementRepository.FindAsync(id)).ShouldNotBeNull();
            }
        });
    }

    [Fact]
    public async Task Manual_Movement_Can_Still_Be_Deleted()
    {
        var id = await CreateMovementAsync(CashMovementSource.Manual);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await _cashMovementAppService.DeleteAsync(id);
            }
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                (await _cashMovementRepository.FindAsync(id)).ShouldBeNull();
            }
        });
    }
}
