using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Finans yazma yollarında çağırandan gelen proje, kasa ve cari kimliği hiç okunmuyordu.
/// Kayıt başka kiracının (ya da var olmayan) bir kaydını gösterebiliyordu. Kiracı kendi
/// ekranında yabancı kaydı görmüyordu (okuma süzgeçli), ama host'un kiracılar üstü bütçe
/// özeti o satırları yabancı projenin toplamına sayıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceForeignKeyGuard_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000052");

    private readonly IExpenseAppService _expenseAppService;
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly ICashMovementAppService _cashMovementAppService;
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public FinanceForeignKeyGuard_Tests()
    {
        _expenseAppService = GetRequiredService<IExpenseAppService>();
        _incomeAppService = GetRequiredService<IIncomeEntryAppService>();
        _cashMovementAppService = GetRequiredService<ICashMovementAppService>();
        _invoiceAppService = GetRequiredService<IInvoiceAppService>();
        _expenseRepository = GetRequiredService<IRepository<Expense, Guid>>();
        _incomeRepository = GetRequiredService<IRepository<IncomeEntry, Guid>>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _cashMovementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _invoiceRepository = GetRequiredService<IRepository<Invoice, Guid>>();
        _customerRepository = GetRequiredService<IRepository<Customer, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> ProjectAsync(Guid? tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(
                Guid.NewGuid(), tenantId, null, "Yabancı anahtar projesi",
                "FYA-" + Guid.NewGuid().ToString("N")[..8], "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    }

    private async Task<Guid> CashAccountAsync(Guid? tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
            var account = new CashAccount(Guid.NewGuid(), "Kasa", currency: "TRY", tenantId: tenantId);
            await _cashAccountRepository.InsertAsync(account, autoSave: true);
            return account.Id;
        }
    }

    private CreateUpdateExpenseDto ExpenseInput(Guid cashAccountId, Guid? projectId) => new()
    {
        Title = "Yabancı anahtar gideri",
        Amount = 100m,
        Currency = "TRY",
        ExpenseDate = new DateTime(2026, 10, 12),
        CashAccountId = cashAccountId,
        ProjectId = projectId
    };

    private static CreateInvoiceDto InvoiceInput(Guid projectId, Guid? customerId) => new()
    {
        ProjectId = projectId,
        CustomerId = customerId,
        InvoiceNumber = "FYA-" + Guid.NewGuid().ToString("N")[..8],
        InvoiceDate = new DateTime(2026, 10, 12),
        DueDate = new DateTime(2026, 11, 12),
        Items = new List<CreateInvoiceItemDto>
        {
            new() { Description = "Hizmet", Quantity = 1, UnitPrice = 100m }
        }
    };

    /* ═══════════════ Gider / gelir ═══════════════ */

    [Fact]
    public async Task Baska_kiracinin_projesine_gider_yazilamaz()
    {
        var account = await CashAccountAsync(null);
        var foreignProject = await ProjectAsync(OtherTenant);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _expenseAppService.CreateAsync(ExpenseInput(account, foreignProject)));

        (await _expenseRepository.GetListAsync(e => e.ProjectId == foreignProject)).ShouldBeEmpty();
        // Reddedilen gider kasaya da işlenmedi.
        (await _cashMovementRepository.GetListAsync(m => m.CashAccountId == account)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Guncellemede_gider_baska_kiracinin_projesine_alinamaz()
    {
        var account = await CashAccountAsync(null);
        var ownProject = await ProjectAsync(null);
        var foreignProject = await ProjectAsync(OtherTenant);
        var expense = await _expenseAppService.CreateAsync(ExpenseInput(account, ownProject));

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _expenseAppService.UpdateAsync(expense.Id, ExpenseInput(account, foreignProject)));

        (await _expenseRepository.GetAsync(expense.Id)).ProjectId.ShouldBe(ownProject);
    }

    /// <summary>Karşı yön: kayıtlı projesi artık okunamayan gider düzenlenebilir kalır.</summary>
    [Fact]
    public async Task Projesi_degismeyen_gider_guncellenir()
    {
        var account = await CashAccountAsync(null);
        var project = await ProjectAsync(null);
        var expense = await _expenseAppService.CreateAsync(ExpenseInput(account, project));
        await _projectRepository.DeleteAsync(project, autoSave: true);

        var input = ExpenseInput(account, project);
        input.Title = "Yeni başlık";
        var dto = await _expenseAppService.UpdateAsync(expense.Id, input);

        dto.Title.ShouldBe("Yeni başlık");
    }

    [Fact]
    public async Task Baska_kiracinin_projesine_gelir_yazilamaz()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        await Should.ThrowAsync<EntityNotFoundException>(() => _incomeAppService.CreateAsync(new CreateUpdateIncomeEntryDto
        {
            Title = "Yabancı anahtar geliri",
            Amount = 100m,
            Currency = "TRY",
            IncomeDate = new DateTime(2026, 10, 12),
            ProjectId = foreignProject
        }));

        (await _incomeRepository.GetListAsync(e => e.ProjectId == foreignProject)).ShouldBeEmpty();
    }

    /* ═══════════════ Kasa hareketi ═══════════════ */

    [Fact]
    public async Task Baska_kiracinin_kasasina_hareket_yazilamaz()
    {
        var foreignAccount = await CashAccountAsync(OtherTenant);

        await Should.ThrowAsync<EntityNotFoundException>(() => _cashMovementAppService.CreateAsync(
            new CreateUpdateCashMovementDto
            {
                CashAccountId = foreignAccount,
                Direction = CashMovementDirection.In,
                Amount = 100m,
                MovementDate = new DateTime(2026, 10, 12)
            }));

        (await _cashMovementRepository.GetListAsync(m => m.CashAccountId == foreignAccount)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Guncellemede_hareket_baska_kiracinin_kasasina_alinamaz()
    {
        var ownAccount = await CashAccountAsync(null);
        var foreignAccount = await CashAccountAsync(OtherTenant);
        var movement = await _cashMovementAppService.CreateAsync(new CreateUpdateCashMovementDto
        {
            CashAccountId = ownAccount,
            Direction = CashMovementDirection.In,
            Amount = 100m,
            MovementDate = new DateTime(2026, 10, 12)
        });

        await Should.ThrowAsync<EntityNotFoundException>(() => _cashMovementAppService.UpdateAsync(
            movement.Id, new CreateUpdateCashMovementDto
            {
                CashAccountId = foreignAccount,
                Direction = CashMovementDirection.In,
                Amount = 100m,
                MovementDate = new DateTime(2026, 10, 12)
            }));

        (await _cashMovementRepository.GetAsync(movement.Id)).CashAccountId.ShouldBe(ownAccount);
    }

    /* ═══════════════ Fatura ═══════════════ */

    [Fact]
    public async Task Baska_kiracinin_projesine_fatura_kesilemez()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _invoiceAppService.CreateAsync(InvoiceInput(foreignProject, customerId: null)));

        (await _invoiceRepository.GetListAsync(i => i.ProjectId == foreignProject)).ShouldBeEmpty();
    }

    /// <summary>Cari doğrulanmadığında tahakkuk satırı başka kiracının carisine yazılıyordu.</summary>
    [Fact]
    public async Task Baska_kiracinin_carisine_fatura_kesilemez()
    {
        var ownProject = await ProjectAsync(null);
        Guid foreignCustomer;
        using (_currentTenant.Change(OtherTenant))
        {
            var customer = new Customer(Guid.NewGuid(), "Başka kiracının carisi", OtherTenant);
            await _customerRepository.InsertAsync(customer, autoSave: true);
            foreignCustomer = customer.Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            () => _invoiceAppService.CreateAsync(InvoiceInput(ownProject, foreignCustomer)));

        (await _invoiceRepository.GetListAsync(i => i.ProjectId == ownProject)).ShouldBeEmpty();
    }

    /// <summary>Karşı yön: kendi projesi ve carisiyle fatura kesilir.</summary>
    [Fact]
    public async Task Kendi_projesine_ve_carisine_fatura_kesilir()
    {
        var ownProject = await ProjectAsync(null);
        var customer = new Customer(Guid.NewGuid(), "Kendi carisi");
        await _customerRepository.InsertAsync(customer, autoSave: true);

        var dto = await _invoiceAppService.CreateAsync(InvoiceInput(ownProject, customer.Id));

        dto.ProjectId.ShouldBe(ownProject);
        dto.CustomerId.ShouldBe(customer.Id);
    }
}
