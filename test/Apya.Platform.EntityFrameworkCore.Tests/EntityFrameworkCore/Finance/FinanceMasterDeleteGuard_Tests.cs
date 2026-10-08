using System;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Kaydı olan cari ve hareketi olan kasa silinmez; pasife alınır.
///
/// <para>İkisi de varsayılan silmeyle açıktı. Silinen kaydı gösteren satırlar (fatura, cari
/// hareket, gider, gelir, proje, kasa hareketi) yerinde kalıyordu: mizan silinen carinin
/// bakiyesini ve silinen kasanın hareketlerini toplamaya devam ediyor, ama o tutarın kime ya da
/// hangi kasaya ait olduğu hiçbir ekrandan okunamıyordu.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceMasterDeleteGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-000000000093");

    private readonly ICustomerAppService _customerAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IRepository<Customer, Guid> _customerRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public FinanceMasterDeleteGuard_Tests()
    {
        _customerAppService = GetRequiredService<ICustomerAppService>();
        _cashAccountAppService = GetRequiredService<ICashAccountAppService>();
        _customerRepository = GetRequiredService<IRepository<Customer, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _cashMovementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _ledgerRepository = GetRequiredService<IRepository<CustomerLedgerEntry, Guid>>();
        _invoiceRepository = GetRequiredService<IRepository<Invoice, Guid>>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _incomeRepository = GetRequiredService<IRepository<IncomeEntry, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>Cariyi kimliğiyle gösteren kayıt türleri.</summary>
    public enum CustomerReference { LedgerEntry, Invoice, Expense, Income, Project }

    private Task InTenantAsync(Func<Task> action) => WithUnitOfWorkAsync(async () =>
    {
        using (_currentTenant.Change(Tenant))
        {
            await action();
        }
    });

    private async Task<Guid> CreateCustomerAsync(CustomerReference? reference)
    {
        var customerId = Guid.NewGuid();
        await InTenantAsync(async () =>
        {
            // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
            await _customerRepository.InsertAsync(new Customer(customerId, "Silme Koruması A.Ş.", Tenant), autoSave: true);

            switch (reference)
            {
                case CustomerReference.LedgerEntry:
                    await _ledgerRepository.InsertAsync(new CustomerLedgerEntry(
                        Guid.NewGuid(), customerId, CustomerLedgerDirection.Debit, 250m, DateTime.Today,
                        tenantId: Tenant), autoSave: true);
                    break;
                case CustomerReference.Invoice:
                    var invoiceProject = await InsertProjectAsync(customerId: null);
                    await _invoiceRepository.InsertAsync(new Invoice(
                        Guid.NewGuid(), Tenant, invoiceProject, "FTR-SK-" + customerId.ToString("N")[..8],
                        DateTime.Today, DateTime.Today.AddDays(30), 20m, "TRY", InvoiceDirection.Sales,
                        customerId, null), autoSave: true);
                    break;
                case CustomerReference.Expense:
                    var account = new CashAccount(Guid.NewGuid(), "Kasa", currency: "TRY", tenantId: Tenant);
                    await _cashAccountRepository.InsertAsync(account, autoSave: true);
                    await _expenseRepository.InsertAsync(new Expense(
                        Guid.NewGuid(), "Tedarikçi ödemesi", 100m, account.Id, DateTime.Today,
                        customerId: customerId, tenantId: Tenant), autoSave: true);
                    break;
                case CustomerReference.Income:
                    await _incomeRepository.InsertAsync(new IncomeEntry(
                        Guid.NewGuid(), "Tahsilat", 100m, DateTime.Today,
                        customerId: customerId, tenantId: Tenant), autoSave: true);
                    break;
                case CustomerReference.Project:
                    await InsertProjectAsync(customerId);
                    break;
            }
        });
        return customerId;
    }

    private async Task<Guid> InsertProjectAsync(Guid? customerId)
    {
        var project = new Project(
            Guid.NewGuid(), Tenant, null, "Silme Koruması Projesi", "SK-" + Guid.NewGuid().ToString("N")[..6],
            "Cari silme koruması", customerId: customerId);
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    [Theory]
    [InlineData(CustomerReference.LedgerEntry)]
    [InlineData(CustomerReference.Invoice)]
    [InlineData(CustomerReference.Expense)]
    [InlineData(CustomerReference.Income)]
    [InlineData(CustomerReference.Project)]
    public async Task Kaydi_Olan_Cari_Silinmez(CustomerReference reference)
    {
        var customerId = await CreateCustomerAsync(reference);

        await InTenantAsync(async () =>
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _customerAppService.DeleteAsync(customerId));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerInUse);
        });

        await InTenantAsync(async () =>
            (await _customerRepository.FindAsync(customerId)).ShouldNotBeNull());
    }

    [Fact]
    public async Task Kaydi_Olmayan_Cari_Silinir()
    {
        var customerId = await CreateCustomerAsync(reference: null);

        await InTenantAsync(async () => await _customerAppService.DeleteAsync(customerId));

        await InTenantAsync(async () =>
            (await _customerRepository.FindAsync(customerId)).ShouldBeNull());
    }

    private async Task<Guid> CreateCashAccountAsync(int movementCount)
    {
        var accountId = Guid.NewGuid();
        await InTenantAsync(async () =>
        {
            await _cashAccountRepository.InsertAsync(
                new CashAccount(accountId, "Silme Koruması Kasası", currency: "TRY", tenantId: Tenant), autoSave: true);
            for (var i = 0; i < movementCount; i++)
            {
                await _cashMovementRepository.InsertAsync(
                    new CashMovement(Guid.NewGuid(), accountId, CashMovementDirection.In, 100m, DateTime.Today,
                        tenantId: Tenant),
                    autoSave: true);
            }
        });
        return accountId;
    }

    [Fact]
    public async Task Hareketi_Olan_Kasa_Silinmez()
    {
        var accountId = await CreateCashAccountAsync(movementCount: 2);

        await InTenantAsync(async () =>
        {
            var ex = await Should.ThrowAsync<BusinessException>(
                async () => await _cashAccountAppService.DeleteAsync(accountId));
            ex.Code.ShouldBe(PlatformDomainErrorCodes.CashAccountInUse);
            ex.Data["MovementCount"].ShouldBe(2);
        });

        await InTenantAsync(async () =>
            (await _cashAccountRepository.FindAsync(accountId)).ShouldNotBeNull());
    }

    [Fact]
    public async Task Hareketi_Olmayan_Kasa_Silinir()
    {
        var accountId = await CreateCashAccountAsync(movementCount: 0);

        await InTenantAsync(async () => await _cashAccountAppService.DeleteAsync(accountId));

        await InTenantAsync(async () =>
            (await _cashAccountRepository.FindAsync(accountId)).ShouldBeNull());
    }
}
