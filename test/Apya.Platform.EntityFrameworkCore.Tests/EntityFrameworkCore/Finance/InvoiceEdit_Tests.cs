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
/// Fatura düzenleme: Taslak fatura baştan düzenlenir ve cari tahakkuku onunla hizalanır. Ödeme
/// alınmış faturada da tutar, kalemler ve KDV düzeltilir (2026-11-05 kararı; 10-27'de yalnız vade,
/// not ve bütçe kalemiydi) — cari ve yön kilitli kalır, durum ödemelerden yeniden hesaplanır.
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

    /// <summary>
    /// Yanlış girilmiş tutarın düzeltilmesi (KDV dahil fiyatın KDV hariç girilmesi gibi): tahakkuk
    /// yeni tutara iner, fazla ödenmiş fatura "Ödendi" kalır; tutar ödenenin üstüne çıkınca fatura
    /// yeniden "Gönderildi" olur.
    /// </summary>
    [Fact]
    public async Task Odeme_alinmis_faturanin_tutari_duzeltilir_tahakkuk_ve_durum_hizalanir()
    {
        var projectId = await ProjectAsync();
        var supplier = await CustomerAsync("Ödenmiş tedarikçi");
        var created = await InvoiceAsync(projectId, supplier);
        await _invoices.AddPaymentAsync(created.Id, 1200m, "Havale", "tam-odeme");
        (await _invoices.GetAsync(created.Id)).Status.ShouldBe(InvoiceStatus.Paid);

        UpdateInvoiceDto Fix(decimal unitPrice) => new()
        {
            CustomerId = supplier,
            Direction = InvoiceDirection.Purchase,
            InvoiceNumber = created.InvoiceNumber,
            InvoiceDate = created.InvoiceDate,
            DueDate = created.DueDate,
            TaxRate = 20,
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Tablet", Quantity = 1, UnitPrice = unitPrice } }
        };

        var fixedDown = await _invoices.UpdateAsync(created.Id, Fix(500m));
        fixedDown.TotalAmount.ShouldBe(600m);
        fixedDown.Status.ShouldBe(InvoiceStatus.Paid);
        (await LedgerAsync(created.Id)).ShouldHaveSingleItem().Amount.ShouldBe(600m);

        var raised = await _invoices.UpdateAsync(created.Id, Fix(2000m));
        raised.TotalAmount.ShouldBe(2400m);
        raised.Status.ShouldBe(InvoiceStatus.Sent, "ödenen 1.200, yeni tutarın altında");
        raised.PaidAmount.ShouldBe(1200m);
        (await LedgerAsync(created.Id)).ShouldHaveSingleItem().Amount.ShouldBe(2400m);
    }

    /// <summary>Ödemenin kasa ve cari kaydı o cariye ve o yöne yazılmıştır: ikisi değişemez.</summary>
    [Fact]
    public async Task Odeme_alinmis_faturada_cari_ve_yon_degismez()
    {
        var projectId = await ProjectAsync();
        var supplier = await CustomerAsync("Kilitli tedarikçi");
        var other = await CustomerAsync("Başka cari");
        var created = await InvoiceAsync(projectId, supplier);
        await _invoices.AddPaymentAsync(created.Id, 100m, "Nakit", "kilit-odeme");

        var input = UpdateInput(created, other, null);
        (await Should.ThrowAsync<BusinessException>(() => _invoices.UpdateAsync(created.Id, input)))
            .Code.ShouldBe(PlatformDomainErrorCodes.InvoicePartyLockedByPayment);

        input.CustomerId = supplier; // yön hâlâ Satış, fatura Alış
        (await Should.ThrowAsync<BusinessException>(() => _invoices.UpdateAsync(created.Id, input)))
            .Code.ShouldBe(PlatformDomainErrorCodes.InvoicePartyLockedByPayment);

        (await _invoices.GetAsync(created.Id)).TotalAmount.ShouldBe(created.TotalAmount);
    }

    [Fact]
    public async Task Odeme_alinmis_faturada_vade_not_ve_kalem_ayrica_degisir()
    {
        var projectId = await ProjectAsync();
        var lineId = await LineAsync(projectId, "2");
        var created = await InvoiceAsync(projectId, customerId: null);
        await _invoices.AddPaymentAsync(created.Id, 100m, "Nakit", "kismi-odeme");

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

    [Fact]
    public async Task KDV_dahil_girilen_fiyat_KDV_haric_saklanir()
    {
        var projectId = await ProjectAsync();
        var created = await _invoices.CreateAsync(new CreateInvoiceDto
        {
            ProjectId = projectId,
            InvoiceNumber = "FDZ-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = new DateTime(2026, 10, 17),
            DueDate = new DateTime(2026, 11, 20),
            TaxRate = 20,
            PricesIncludeTax = true,
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Tablet", Quantity = 2, UnitPrice = 600m } }
        });

        created.Items.ShouldHaveSingleItem().UnitPrice.ShouldBe(500m);
        created.TotalAmount.ShouldBe(1200m);

        var input = UpdateInput(created, null, null);
        input.PricesIncludeTax = true;
        input.Items = new List<CreateInvoiceItemDto>
        {
            new() { Description = "Tablet", Quantity = 1, UnitPrice = 1100m },
            // 1000 / 1,10 = 909,0909… → kuruşa yuvarlanır.
            new() { Description = "Kılıf", Quantity = 1, UnitPrice = 1000m }
        };
        var updated = await _invoices.UpdateAsync(created.Id, input);

        updated.Items.Select(i => i.UnitPrice).OrderBy(x => x).ShouldBe(new[] { 909.09m, 1000m });
    }

    [Fact]
    public async Task KDV_istisnali_fatura_KDVsiz_kesilir_istisna_kalkinca_oran_doner()
    {
        var projectId = await ProjectAsync();
        await GetRequiredService<IProjectBudgetAppService>().UpdateVatExemptionAsync(projectId,
            new UpdateVatExemptionDto { VatExemptionCertificateNo = "TB-2026-77", VatExemptionValidUntil = new DateTime(2026, 12, 31) });

        var lookup = (await _invoices.GetProjectLookupAsync()).Items.Single(p => p.Id == projectId);
        lookup.VatExemptionCertificateNo.ShouldBe("TB-2026-77");
        lookup.VatExemptionValidUntil.ShouldBe(new DateTime(2026, 12, 31));

        // KDV dahil işaretli olsa da istisnalı faturada fiyat arındırılmaz: KDV yok.
        var created = await _invoices.CreateAsync(new CreateInvoiceDto
        {
            ProjectId = projectId,
            InvoiceNumber = "FDZ-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = new DateTime(2026, 10, 17),
            DueDate = new DateTime(2026, 11, 20),
            TaxRate = 20,
            PricesIncludeTax = true,
            VatExemptionReference = "TB-2026-77",
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Makine", Quantity = 1, UnitPrice = 1000m } }
        });

        created.VatExemptionReference.ShouldBe("TB-2026-77");
        created.TaxRate.ShouldBe(0m);
        created.Items.ShouldHaveSingleItem().UnitPrice.ShouldBe(1000m);
        created.TotalAmount.ShouldBe(1000m);

        var input = UpdateInput(created, null, null);
        input.TaxRate = 20;
        input.VatExemptionReference = null;
        input.Items = new List<CreateInvoiceItemDto> { new() { Description = "Makine", Quantity = 1, UnitPrice = 1000m } };
        var updated = await _invoices.UpdateAsync(created.Id, input);

        updated.VatExemptionReference.ShouldBeNull();
        updated.TaxRate.ShouldBe(20m);
        updated.TotalAmount.ShouldBe(1200m);
    }
}
