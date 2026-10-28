using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Customers;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Fatura düzenleme (2026-10-27 kararı): Taslak fatura baştan düzenlenir ve cari tahakkuku onunla
/// hizalanır; ödeme alınmış faturada yalnız vade, not ve bütçe kalemi değişir.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class InvoiceEdit_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IInvoiceAppService _invoices;
    private readonly IRepository<InvoiceItem, Guid> _itemRepository;
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;

    public InvoiceEdit_Tests()
    {
        _invoices = GetRequiredService<IInvoiceAppService>();
        _itemRepository = GetRequiredService<IRepository<InvoiceItem, Guid>>();
        _ledgerRepository = GetRequiredService<IRepository<CustomerLedgerEntry, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _customerRepository = GetRequiredService<IRepository<Customer, Guid>>();
    }

    private async Task<Guid> ProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Düzenleme projesi", "FDZ-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> CustomerAsync(string name)
        => (await _customerRepository.InsertAsync(new Customer(Guid.NewGuid(), name), autoSave: true)).Id;

    private async Task<Guid> LineAsync(Guid projectId, string code)
        => (await GetRequiredService<IProjectBudgetAppService>().CreateLineAsync(
            projectId,
            new CreateUpdateBudgetLineDto { Code = code, Name = "Makine", PlannedAmount = 500_000m })).Id;

    private async Task<InvoiceDto> InvoiceAsync(Guid projectId, Guid? customerId)
        => await _invoices.CreateAsync(new CreateInvoiceDto
        {
            ProjectId = projectId,
            CustomerId = customerId,
            Direction = InvoiceDirection.Purchase,
            InvoiceNumber = "FDZ-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = new DateTime(2026, 10, 17),
            DueDate = new DateTime(2026, 11, 20),
            TaxRate = 20,
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Tablet", Quantity = 1, UnitPrice = 1000m } }
        });

    private static UpdateInvoiceDto UpdateInput(InvoiceDto d, Guid? customerId, Guid? lineId) => new()
    {
        CustomerId = customerId,
        Direction = InvoiceDirection.Sales,
        BudgetLineId = lineId,
        InvoiceNumber = d.InvoiceNumber + "-D",
        InvoiceDate = new DateTime(2026, 10, 20),
        DueDate = new DateTime(2026, 12, 1),
        TaxRate = 10,
        Notes = "düzeltildi",
        Items = new List<CreateInvoiceItemDto>
        {
            new() { Description = "Tablet", Quantity = 2, UnitPrice = 1000m },
            new() { Description = "Kılıf", Quantity = 1, UnitPrice = 500m }
        }
    };

    private async Task<List<CustomerLedgerEntry>> LedgerAsync(Guid invoiceId)
        => await _ledgerRepository.GetListAsync(e => e.ReferenceId == invoiceId && e.Source == CustomerLedgerSource.Invoice);

    [Fact]
    public async Task Taslak_fatura_bastan_duzenlenir_kalemler_yenilenir_cari_tahakkuku_hizalanir()
    {
        var projectId = await ProjectAsync();
        var oldCustomer = await CustomerAsync("Eski tedarikçi");
        var newCustomer = await CustomerAsync("Yeni müşteri");
        var lineId = await LineAsync(projectId, "1");
        var created = await InvoiceAsync(projectId, oldCustomer);

        var updated = await _invoices.UpdateAsync(created.Id, UpdateInput(created, newCustomer, lineId));

        updated.InvoiceNumber.ShouldBe(created.InvoiceNumber + "-D");
        updated.Direction.ShouldBe(InvoiceDirection.Sales);
        updated.CustomerId.ShouldBe(newCustomer);
        updated.BudgetLineId.ShouldBe(lineId);
        updated.BudgetLineName.ShouldBe("1 · Makine");
        updated.DueDate.ShouldBe(new DateTime(2026, 12, 1));
        updated.Notes.ShouldBe("düzeltildi");
        updated.TotalAmount.ShouldBe(2750m); // (2×1000 + 500) × 1,10
        updated.Items.Count.ShouldBe(2);
        // Eski kalem satırı veritabanında kalmaz.
        (await _itemRepository.GetListAsync(i => i.InvoiceId == created.Id)).Count.ShouldBe(2);

        var entry = (await LedgerAsync(created.Id)).ShouldHaveSingleItem();
        entry.CustomerId.ShouldBe(newCustomer);
        entry.Amount.ShouldBe(2750m);
        entry.Direction.ShouldBe(CustomerLedgerDirection.Debit, "satış faturası cariyi borçlandırır");
        entry.EntryDate.ShouldBe(new DateTime(2026, 10, 20));
    }

    /// <summary>Cari sonradan eklenince tahakkuk açılır, kaldırılınca silinir.</summary>
    [Fact]
    public async Task Cari_eklenince_tahakkuk_acilir_kaldirilinca_silinir()
    {
        var projectId = await ProjectAsync();
        var customer = await CustomerAsync("Sonradan cari");
        var created = await InvoiceAsync(projectId, customerId: null);
        (await LedgerAsync(created.Id)).ShouldBeEmpty();

        await _invoices.UpdateAsync(created.Id, UpdateInput(created, customer, null));
        (await LedgerAsync(created.Id)).ShouldHaveSingleItem().CustomerId.ShouldBe(customer);

        await _invoices.UpdateAsync(created.Id, UpdateInput(created, null, null));
        (await LedgerAsync(created.Id)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Odeme_alinmis_fatura_tam_duzenlenemez_vade_not_ve_kalem_degisir()
    {
        var projectId = await ProjectAsync();
        var lineId = await LineAsync(projectId, "2");
        var created = await InvoiceAsync(projectId, customerId: null);
        await _invoices.AddPaymentAsync(created.Id, 100m, "Nakit", "kismi-odeme");

        (await Should.ThrowAsync<BusinessException>(() => _invoices.UpdateAsync(created.Id, UpdateInput(created, null, null))))
            .Code.ShouldBe(PlatformDomainErrorCodes.InvoiceNotEditable);

        var updated = await _invoices.UpdateDetailsAsync(created.Id, new UpdateInvoiceDetailsDto
        {
            BudgetLineId = lineId,
            DueDate = new DateTime(2026, 12, 15),
            Notes = "vade uzadı"
        });

        updated.BudgetLineId.ShouldBe(lineId);
        updated.DueDate.ShouldBe(new DateTime(2026, 12, 15));
        updated.Notes.ShouldBe("vade uzadı");
        updated.TotalAmount.ShouldBe(created.TotalAmount);
        updated.InvoiceNumber.ShouldBe(created.InvoiceNumber);
        updated.Items.ShouldHaveSingleItem().UnitPrice.ShouldBe(1000m);
    }

    [Fact]
    public async Task Fatura_baska_projenin_kalemine_baglanamaz()
    {
        var projectId = await ProjectAsync();
        var otherLine = await LineAsync(await ProjectAsync(), "3");
        var created = await InvoiceAsync(projectId, customerId: null);

        (await Should.ThrowAsync<BusinessException>(() => _invoices.UpdateAsync(created.Id, UpdateInput(created, null, otherLine))))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
        (await Should.ThrowAsync<BusinessException>(() => _invoices.UpdateDetailsAsync(created.Id,
                new UpdateInvoiceDetailsDto { BudgetLineId = otherLine, DueDate = created.DueDate })))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
        (await _invoices.GetAsync(created.Id)).BudgetLineId.ShouldBeNull();
    }
}
