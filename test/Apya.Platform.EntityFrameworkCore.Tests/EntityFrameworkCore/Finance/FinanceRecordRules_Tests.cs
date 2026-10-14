using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// Ürün kararları (2026-10-13): hareketi olan kasanın para birimi değişmez; fatura kalemi sıfır ya da
/// eksi olamaz; elle güncellenen kur kaydı "elle" kaynaklı olur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceRecordRules_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ICashAccountAppService _cashAccounts;
    private readonly IInvoiceAppService _invoices;
    private readonly IExchangeRateAppService _rates;
    private readonly IRepository<CashAccount, Guid> _accountRepository;
    private readonly IRepository<CashMovement, Guid> _movementRepository;
    private readonly IRepository<ExchangeRate, Guid> _rateRepository;
    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Project, Guid> _projectRepository;

    public FinanceRecordRules_Tests()
    {
        _cashAccounts = GetRequiredService<ICashAccountAppService>();
        _invoices = GetRequiredService<IInvoiceAppService>();
        _rates = GetRequiredService<IExchangeRateAppService>();
        _accountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _movementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _rateRepository = GetRequiredService<IRepository<ExchangeRate, Guid>>();
        _invoiceRepository = GetRequiredService<IRepository<Invoice, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
    }

    private async Task<Guid> AccountAsync(bool withMovement)
    {
        var account = new CashAccount(Guid.NewGuid(), "Kural kasası", currency: "TRY");
        await _accountRepository.InsertAsync(account, autoSave: true);
        if (withMovement)
        {
            await _movementRepository.InsertAsync(
                new CashMovement(Guid.NewGuid(), account.Id, CashMovementDirection.In, 100m, new DateTime(2026, 10, 13)),
                autoSave: true);
        }
        return account.Id;
    }

    private static CreateUpdateCashAccountDto AccountInput(string currency) => new()
    {
        Name = "Kural kasası",
        Type = CashAccountType.Cash,
        Currency = currency
    };

    /* ═══════════════ Kasa para birimi ═══════════════ */

    [Fact]
    public async Task Hareketi_olan_kasanin_para_birimi_degistirilemez()
    {
        var id = await AccountAsync(withMovement: true);

        var ex = await Should.ThrowAsync<BusinessException>(() => _cashAccounts.UpdateAsync(id, AccountInput("USD")));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashAccountCurrencyLocked);
        (await _accountRepository.GetAsync(id)).Currency.ShouldBe("TRY");
    }

    /// <summary>Karşı yön: para birimine dokunmadan düzenlenir; hareketi olmayan kasada değişir.</summary>
    [Fact]
    public async Task Kasa_para_birimi_disinda_duzenlenir_hareketsiz_kasada_degisir()
    {
        var withMovement = await AccountAsync(withMovement: true);
        var renamed = AccountInput("try");
        renamed.Name = "Yeni ad";
        (await _cashAccounts.UpdateAsync(withMovement, renamed)).Name.ShouldBe("Yeni ad");

        var empty = await AccountAsync(withMovement: false);
        (await _cashAccounts.UpdateAsync(empty, AccountInput("USD"))).Currency.ShouldBe("USD");
    }

    /* ═══════════════ Fatura kalemi ═══════════════ */

    private async Task<CreateInvoiceDto> InvoiceInputAsync(decimal quantity, decimal unitPrice)
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Kalem kuralı projesi", "FKK-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);

        return new CreateInvoiceDto
        {
            ProjectId = project.Id,
            InvoiceNumber = "FKK-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = new DateTime(2026, 10, 13),
            DueDate = new DateTime(2026, 11, 13),
            Items = new List<CreateInvoiceItemDto>
            {
                new() { Description = "Hizmet", Quantity = quantity, UnitPrice = unitPrice }
            }
        };
    }

    [Theory]
    [InlineData(0, 100)]
    [InlineData(-3, 100)]
    [InlineData(1, -500)]
    public async Task Sifir_ya_da_eksi_kalemle_fatura_kesilemez(int quantity, int unitPrice)
    {
        var input = await InvoiceInputAsync(quantity, unitPrice);

        var ex = await Should.ThrowAsync<BusinessException>(() => _invoices.CreateAsync(input));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.InvoiceItemAmountInvalid);
        (await _invoiceRepository.GetListAsync(i => i.ProjectId == input.ProjectId)).ShouldBeEmpty();
    }

    /// <summary>Karşı yön: bedelsiz (fiyatı sıfır) kalem geçerlidir.</summary>
    [Fact]
    public async Task Bedelsiz_kalemle_fatura_kesilir()
    {
        var dto = await _invoices.CreateAsync(await InvoiceInputAsync(2, 0));

        dto.Items.Count.ShouldBe(1);
    }

    /* ═══════════════ Faturanın bütçe kalemi (FIN-05) ═══════════════ */

    private async Task<Guid> LineAsync(Guid projectId)
        => (await GetRequiredService<Apya.Platform.ProjectBudgets.IProjectBudgetAppService>().CreateLineAsync(
            projectId,
            new Apya.Platform.ProjectBudgets.Dtos.CreateUpdateBudgetLineDto { Code = "1", Name = "Makine", PlannedAmount = 500_000m })).Id;

    [Fact]
    public async Task Fatura_kendi_projesinin_kalemiyle_kesilir_kalemsiz_de_kesilir()
    {
        var input = await InvoiceInputAsync(1, 100);
        input.BudgetLineId = await LineAsync(input.ProjectId);

        (await _invoices.CreateAsync(input)).BudgetLineId.ShouldBe(input.BudgetLineId);

        // Kalem isteğe bağlıdır: projede kalem olsa da fatura kalemsiz kesilebilir.
        var withoutLine = await InvoiceInputAsync(1, 100);
        await LineAsync(withoutLine.ProjectId);
        (await _invoices.CreateAsync(withoutLine)).BudgetLineId.ShouldBeNull();
    }

    [Fact]
    public async Task Fatura_baska_projenin_kalemiyle_kesilemez()
    {
        var input = await InvoiceInputAsync(1, 100);
        var other = await InvoiceInputAsync(1, 100);
        input.BudgetLineId = await LineAsync(other.ProjectId);

        (await Should.ThrowAsync<BusinessException>(() => _invoices.CreateAsync(input)))
            .Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineProjectMismatch);
        (await _invoiceRepository.GetListAsync(i => i.ProjectId == input.ProjectId)).ShouldBeEmpty();
    }

    /* ═══════════════ Gecikmiş fatura (FIN-10) ═══════════════ */

    /// <summary>
    /// "Gecikmiş" hiçbir yerde atanmıyordu; Faturalar ekranının süzgeci boş kalıyordu. Bayrak okunurken
    /// hesaplanır: vadesi geçmiş, tamamı ödenmemiş ve iptal edilmemiş fatura (hiç ödeme almamış, hâlâ
    /// Taslak görünen de sayılır — cari ekstresindeki gecikmiş tutarla aynı kural).
    /// </summary>
    [Fact]
    public async Task Vadesi_gecmis_odenmemis_fatura_gecikmis_sayilir_odenince_sayilmaz()
    {
        var late = await InvoiceInputAsync(1, 100);
        late.InvoiceDate = new DateTime(2026, 8, 1);
        late.DueDate = new DateTime(2026, 9, 1);
        var lateId = (await _invoices.CreateAsync(late)).Id;

        var future = await InvoiceInputAsync(1, 100);
        future.DueDate = DateTime.Today.AddDays(30);
        var futureId = (await _invoices.CreateAsync(future)).Id;

        (await _invoices.GetAsync(lateId)).IsOverdue.ShouldBeTrue("hiç ödeme almamış (Taslak) fatura da gecikmiş sayılır");
        (await _invoices.GetAsync(futureId)).IsOverdue.ShouldBeFalse();

        // Kısmi ödeme: hâlâ gecikmiş. Tamamı ödenince değil.
        await _invoices.AddPaymentAsync(lateId, 20m, "Nakit", "kismi");
        (await _invoices.GetAsync(lateId)).IsOverdue.ShouldBeTrue();
        await _invoices.AddPaymentAsync(lateId, 100m, "Nakit", "kalan");
        (await _invoices.GetAsync(lateId)).IsOverdue.ShouldBeFalse();

        var list = await _invoices.GetListAsync(new Volo.Abp.Application.Dtos.PagedAndSortedResultRequestDto { MaxResultCount = 1000 });
        list.Items.Single(i => i.Id == futureId).IsOverdue.ShouldBeFalse("liste de aynı bayrağı taşır");
    }

    /* ═══════════════ Kur kaynağı ═══════════════ */

    [Fact]
    public async Task Elle_guncellenen_TCMB_kuru_elle_kaynakli_olur_ve_kod_normallesir()
    {
        var rate = new ExchangeRate(Guid.NewGuid(), "USD", "TRY", 40m, new DateTime(2026, 10, 13), ExchangeRateSource.Tcmb);
        await _rateRepository.InsertAsync(rate, autoSave: true);

        var dto = await _rates.UpdateAsync(rate.Id, new CreateUpdateExchangeRateDto
        {
            FromCurrency = "usd",
            ToCurrency = "try",
            Rate = 41.5m,
            RateDate = new DateTime(2026, 10, 13)
        });

        dto.Source.ShouldBe(ExchangeRateSource.Manual);
        dto.FromCurrency.ShouldBe("USD");
        dto.Rate.ShouldBe(41.5m);
    }

    [Fact]
    public async Task Kur_guncellemesi_ayni_para_birimini_reddeder()
    {
        var rate = new ExchangeRate(Guid.NewGuid(), "EUR", "TRY", 45m, new DateTime(2026, 10, 13));
        await _rateRepository.InsertAsync(rate, autoSave: true);

        await Should.ThrowAsync<BusinessException>(() => _rates.UpdateAsync(rate.Id, new CreateUpdateExchangeRateDto
        {
            FromCurrency = "TRY", ToCurrency = "TRY", Rate = 1m, RateDate = new DateTime(2026, 10, 13)
        }));
    }
}
