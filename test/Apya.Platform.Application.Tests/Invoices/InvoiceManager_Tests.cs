using System;
using System.Threading;
using System.Threading.Tasks;
using System.Linq.Expressions;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using Shouldly;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Timing;
using Xunit;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Invoices;

namespace Apya.Platform.Tests.Application.Invoices;

/// <summary>
/// ARCH-009: <see cref="InvoiceManager.RecordPaymentAsync"/> idempotency kontratının testi.
/// <para>
/// Boş olmayan reference ile retry geldiğinde manager pre-check ile duplicate Payment'i
/// yakalayıp sessizce return etmeli — InsertAsync ASLA çağırılmamalı. DB unique index
/// ayrı bir savunma katmanı (test edilmez; integration sorumluluğunda).
/// </para>
/// </summary>
public class InvoiceManager_Tests
{
    private readonly IRepository<Invoice, Guid> _invoiceRepo;
    private readonly IRepository<Payment, Guid> _paymentRepo;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepo;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepo;
    private readonly IRepository<ExchangeRate, Guid> _exchangeRateRepo;
    private readonly IRepository<CustomerLedgerEntry, Guid> _customerLedgerRepo;
    private readonly InvoiceManager _sut;

    public InvoiceManager_Tests()
    {
        _invoiceRepo = Substitute.For<IRepository<Invoice, Guid>>();
        _paymentRepo = Substitute.For<IRepository<Payment, Guid>>();
        _cashAccountRepo = Substitute.For<IRepository<CashAccount, Guid>>();
        _cashMovementRepo = Substitute.For<IRepository<CashMovement, Guid>>();
        _exchangeRateRepo = Substitute.For<IRepository<ExchangeRate, Guid>>();
        _customerLedgerRepo = Substitute.For<IRepository<CustomerLedgerEntry, Guid>>();

        _sut = new InvoiceManager(
            _invoiceRepo, _paymentRepo, _cashAccountRepo,
            _cashMovementRepo, _exchangeRateRepo, _customerLedgerRepo);

        var services = new ServiceCollection();
        services.AddSingleton<IGuidGenerator>(SimpleGuidGenerator.Instance);
        services.AddSingleton<ICurrentTenant>(Substitute.For<ICurrentTenant>());
        var clock = Substitute.For<IClock>();
        clock.Now.Returns(new DateTime(2026, 1, 15, 10, 0, 0, DateTimeKind.Utc));
        services.AddSingleton<IClock>(clock);
        services.AddLogging();
        _sut.LazyServiceProvider = new AbpLazyServiceProvider(services.BuildServiceProvider());
    }

    [Fact]
    public async Task RecordPaymentAsync_With_Duplicate_Reference_Should_Be_Idempotent_NoOp()
    {
        // Arrange
        var invoiceId = Guid.NewGuid();
        var invoice = new Invoice(
            id: invoiceId,
            tenantId: null,
            projectId: Guid.NewGuid(),
            invoiceNumber: "INV-001",
            invoiceDate: new DateTime(2026, 1, 1),
            dueDate: new DateTime(2026, 2, 1),
            taxRate: 20,
            currency: "TRY",
            direction: InvoiceDirection.Sales,
            customerId: null,
            taskId: null);
        invoice.AddItem(Guid.NewGuid(), "kalem", 1, 1000);

        var existingPayment = new Payment(
            Guid.NewGuid(), invoiceId, 1200m, new DateTime(2026, 1, 15), "Havale")
        {
            ReferenceNumber = "REF-DUP"
        };

        _invoiceRepo.GetAsync(invoiceId, Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(invoice);
        _paymentRepo.GetListAsync(
                Arg.Any<Expression<Func<Payment, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(new System.Collections.Generic.List<Payment> { existingPayment });

        // Act
        await _sut.RecordPaymentAsync(
            invoiceId: invoiceId,
            amount: 1200m,
            paymentMethod: "Havale",
            reference: "REF-DUP",
            cashAccountId: null);

        // Assert — duplicate yakalandı, hiçbir side-effect çalışmamalı
        await _paymentRepo.DidNotReceive().InsertAsync(
            Arg.Any<Payment>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _cashMovementRepo.DidNotReceive().InsertAsync(
            Arg.Any<CashMovement>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _customerLedgerRepo.DidNotReceive().InsertAsync(
            Arg.Any<CustomerLedgerEntry>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
        await _invoiceRepo.DidNotReceive().UpdateAsync(
            Arg.Any<Invoice>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task RecordPaymentAsync_With_Empty_Reference_Should_Skip_Idempotency_Check()
    {
        // Arrange — boş reference = manuel giriş, idempotency dışı.
        // Bu testte sadece pre-check'in atlandığını doğruluyoruz; insert tabii ki çağırılır.
        var invoiceId = Guid.NewGuid();
        var invoice = new Invoice(
            id: invoiceId,
            tenantId: null,
            projectId: Guid.NewGuid(),
            invoiceNumber: "INV-002",
            invoiceDate: new DateTime(2026, 1, 1),
            dueDate: new DateTime(2026, 2, 1),
            taxRate: 0,
            currency: "TRY",
            direction: InvoiceDirection.Sales,
            customerId: null,
            taskId: null);
        invoice.AddItem(Guid.NewGuid(), "kalem", 1, 500);

        _invoiceRepo.GetAsync(invoiceId, Arg.Any<bool>(), Arg.Any<CancellationToken>())
            .Returns(invoice);
        _paymentRepo.GetListAsync(
                Arg.Any<Expression<Func<Payment, bool>>>(),
                Arg.Any<bool>(),
                Arg.Any<CancellationToken>())
            .Returns(new System.Collections.Generic.List<Payment>());

        // Act
        await _sut.RecordPaymentAsync(
            invoiceId: invoiceId,
            amount: 500m,
            paymentMethod: "Nakit",
            reference: "",
            cashAccountId: null);

        // Assert — pre-check tamamen atlandığı için GetListAsync yalnızca 1 kez çağırılmalı
        // (status güncelleme için). Pre-check'ten kaynaklanan ikinci çağrı OLMAMALI.
        await _paymentRepo.Received(1).GetListAsync(
            Arg.Any<Expression<Func<Payment, bool>>>(),
            Arg.Any<bool>(),
            Arg.Any<CancellationToken>());
        // Insert çağırılmalı (idempotency atlandığı için normal akış)
        await _paymentRepo.Received(1).InsertAsync(
            Arg.Any<Payment>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-100)]
    public async Task RecordPaymentAsync_With_NonPositive_Amount_Should_Throw_And_Not_Insert(decimal amount)
    {
        // CORR-001: Sıfır/negatif tutar geçersiz — guard metodun en başında, invoice sorgusundan
        // önce reddeder; hiçbir Payment satırı üretilmemeli (payments.Sum'ı kirletmez).
        var invoiceId = Guid.NewGuid();

        await Should.ThrowAsync<BusinessException>(() => _sut.RecordPaymentAsync(
            invoiceId: invoiceId,
            amount: amount,
            paymentMethod: "Nakit",
            reference: "",
            cashAccountId: null));

        await _paymentRepo.DidNotReceive().InsertAsync(
            Arg.Any<Payment>(), Arg.Any<bool>(), Arg.Any<CancellationToken>());
    }
}
