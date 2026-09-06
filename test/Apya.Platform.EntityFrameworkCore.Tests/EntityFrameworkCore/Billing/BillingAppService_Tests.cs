using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Billing;
using Apya.Platform.Billing.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Billing;

/// <summary>
/// SÖZLEŞME: fatura tutarı ve durumu tahsilatlardan TÜRETİLİR, müşterinin beyanı tek
/// başına tahsilat sayılmaz ve bir kiracı başkasının faturasını göremez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class BillingAppService_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IBillingAppService _billing;
    private readonly IMyBillingAppService _myBilling;
    private readonly ICurrentTenant _currentTenant;

    public BillingAppService_Tests()
    {
        _billing = GetRequiredService<IBillingAppService>();
        _myBilling = GetRequiredService<IMyBillingAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task<SubscriptionInvoiceDto> CreateInvoiceAsync(
        Guid tenantId,
        decimal net = 24_000m,
        VatMode vatMode = VatMode.TeknoparkExempt,
        decimal vatRate = 0m,
        DateTime? issueDate = null,
        DateTime? dueDate = null)
        => _billing.CreateAsync(new CreateSubscriptionInvoiceDto
        {
            TenantId = tenantId,
            Type = SubscriptionInvoiceType.License,
            IssueDate = issueDate ?? DateTime.Today,
            DueDate = dueDate,
            NetAmount = net,
            VatMode = vatMode,
            VatRate = vatRate
        });

    [Fact]
    public async Task Fatura_acik_dogar_ve_vade_15_gun_sonradir()
    {
        var issueDate = new DateTime(2026, 3, 10);

        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), issueDate: issueDate);

        invoice.Number.ShouldStartWith(BillingConsts.NumberPrefix);
        invoice.Status.ShouldBe(SubscriptionInvoiceStatus.Issued);
        // Protokol Madde 5.1: faturayı müteakip 15 takvim günü.
        invoice.DueDate.ShouldBe(issueDate.AddDays(15));
        invoice.PaidAmount.ShouldBe(0m);
        invoice.RemainingAmount.ShouldBe(invoice.TotalAmount);
    }

    /// <summary>
    /// Protokol Madde 5.2 — Teknopark istisnasında KDV oranı ZORLA sıfırlanır.
    /// "İstisna ama %20" diye bir fatura olamaz; ekranda bir kutuyu unutmak yanlış
    /// tutar üretmemeli.
    /// </summary>
    [Fact]
    public async Task Teknopark_istisnasinda_KDV_orani_sifirlanir()
    {
        var invoice = await CreateInvoiceAsync(
            Guid.NewGuid(), net: 10_000m, vatMode: VatMode.TeknoparkExempt, vatRate: 20m);

        invoice.VatRate.ShouldBe(0m);
        invoice.VatAmount.ShouldBe(0m);
        invoice.TotalAmount.ShouldBe(10_000m);
    }

    [Fact]
    public async Task KDV_uygulanan_faturada_toplam_dogru_hesaplanir()
    {
        var invoice = await CreateInvoiceAsync(
            Guid.NewGuid(), net: 10_000m, vatMode: VatMode.Standard, vatRate: 20m);

        invoice.VatAmount.ShouldBe(2_000m);
        invoice.TotalAmount.ShouldBe(12_000m);
    }

    /// <summary>Host ekstreye bakarak giriyor: kendi kaydı doğrudan onaylı doğar.</summary>
    [Fact]
    public async Task Hostun_kaydettigi_tahsilat_dogrudan_sayilir()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), net: 1_000m);

        var updated = await _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = 400m,
            Method = PaymentMethod.BankTransfer,
            Reference = "EFT-1"
        });

        updated.Payments.Single().IsConfirmed.ShouldBeTrue();
        updated.Payments.Single().DeclaredByTenant.ShouldBeFalse();
        updated.PaidAmount.ShouldBe(400m);
        updated.RemainingAmount.ShouldBe(600m);
        updated.Status.ShouldBe(SubscriptionInvoiceStatus.PartiallyPaid);
    }

    [Fact]
    public async Task Tamami_tahsil_edilince_fatura_kapanir()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), net: 1_000m);

        var updated = await _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = 1_000m,
            Method = PaymentMethod.BankTransfer
        });

        updated.Status.ShouldBe(SubscriptionInvoiceStatus.Paid);
        updated.RemainingAmount.ShouldBe(0m);
    }

    /// <summary>
    /// 🔑 Müşterinin "ödedim" beyanı TEK BAŞINA tahsilat değildir. Onaysız kayıt tutara
    /// sayılsaydı fatura, parası gelmeden kapanmış görünürdü.
    /// </summary>
    [Fact]
    public async Task Kiracinin_beyani_onaylanana_kadar_sayilmaz()
    {
        var tenantId = Guid.NewGuid();
        var invoice = await CreateInvoiceAsync(tenantId, net: 5_000m);

        SubscriptionInvoiceDto declared;
        using (_currentTenant.Change(tenantId))
        {
            declared = await _myBilling.DeclarePaymentAsync(invoice.Id, new DeclarePaymentDto
            {
                PaidAt = DateTime.Today,
                Amount = 5_000m,
                Method = PaymentMethod.BankTransfer,
                Reference = "Müşteri beyanı"
            });
        }

        var payment = declared.Payments.Single();
        payment.DeclaredByTenant.ShouldBeTrue();
        payment.IsConfirmed.ShouldBeFalse();

        // Beyan tutara SAYILMAZ: fatura hâlâ açık.
        declared.PaidAmount.ShouldBe(0m);
        declared.Status.ShouldBe(SubscriptionInvoiceStatus.Issued);
        declared.HasPendingDeclaration.ShouldBeTrue();

        var confirmed = await _billing.ConfirmPaymentAsync(invoice.Id, payment.Id);

        confirmed.PaidAmount.ShouldBe(5_000m);
        confirmed.Status.ShouldBe(SubscriptionInvoiceStatus.Paid);
        confirmed.HasPendingDeclaration.ShouldBeFalse();
    }

    [Fact]
    public async Task Vadesi_gecmis_fatura_isaretlenir()
    {
        var past = DateTime.Today.AddDays(-40);

        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), issueDate: past, dueDate: past.AddDays(15));

        invoice.IsOverdue.ShouldBeTrue();

        // Tahsil edilince artık vadesi geçmiş sayılmaz.
        var paid = await _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = invoice.TotalAmount,
            Method = PaymentMethod.BankTransfer
        });

        paid.IsOverdue.ShouldBeFalse();
    }

    [Fact]
    public async Task Tahsilati_olan_fatura_iptal_edilemez()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), net: 1_000m);

        await _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = 100m,
            Method = PaymentMethod.BankTransfer
        });

        var exception = await Should.ThrowAsync<BusinessException>(() => _billing.CancelAsync(invoice.Id));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.BillingInvoiceHasPayment);
    }

    [Fact]
    public async Task Tahsilatsiz_fatura_iptal_edilir_ve_yeni_tahsilat_kabul_etmez()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), net: 1_000m);

        var cancelled = await _billing.CancelAsync(invoice.Id);
        cancelled.Status.ShouldBe(SubscriptionInvoiceStatus.Cancelled);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
            {
                PaidAt = DateTime.Today,
                Amount = 100m,
                Method = PaymentMethod.BankTransfer
            }));

        exception.Code.ShouldBe(PlatformDomainErrorCodes.BillingInvoiceCancelled);
    }

    /// <summary>Yanlış girilen tahsilat silinince fatura yeniden açılır.</summary>
    [Fact]
    public async Task Silinen_tahsilat_faturayi_yeniden_acar()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid(), net: 1_000m);

        var paid = await _billing.RecordPaymentAsync(invoice.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = 1_000m,
            Method = PaymentMethod.BankTransfer
        });
        paid.Status.ShouldBe(SubscriptionInvoiceStatus.Paid);

        var reopened = await _billing.RemovePaymentAsync(invoice.Id, paid.Payments.Single().Id);

        reopened.Status.ShouldBe(SubscriptionInvoiceStatus.Issued);
        reopened.PaidAmount.ShouldBe(0m);
    }

    /// <summary>
    /// 🔴 Fatura host kaydıdır — ABP'nin kiracı filtresi bu sorguyu KORUMAZ. Eşleştirme
    /// elle yapılıyor; bu test, o kontrolün kaldırılmasını yakalar.
    /// </summary>
    [Fact]
    public async Task Kiraci_baskasinin_faturasini_goremez()
    {
        var ownerTenant = Guid.NewGuid();
        var otherTenant = Guid.NewGuid();

        var invoice = await CreateInvoiceAsync(ownerTenant);

        using (_currentTenant.Change(otherTenant))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => _myBilling.GetAsync(invoice.Id));

            var list = await _myBilling.GetListAsync();
            list.ShouldNotContain(i => i.Id == invoice.Id);
        }

        using (_currentTenant.Change(ownerTenant))
        {
            (await _myBilling.GetAsync(invoice.Id)).Id.ShouldBe(invoice.Id);
        }
    }

    /// <summary>Başkasının faturasına dekont bildirilemez.</summary>
    [Fact]
    public async Task Kiraci_baskasinin_faturasina_odeme_bildiremez()
    {
        var invoice = await CreateInvoiceAsync(Guid.NewGuid());

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await Should.ThrowAsync<EntityNotFoundException>(
                () => _myBilling.DeclarePaymentAsync(invoice.Id, new DeclarePaymentDto
                {
                    PaidAt = DateTime.Today,
                    Amount = 100m,
                    Method = PaymentMethod.BankTransfer
                }));
        }
    }

    [Fact]
    public async Task Negatif_tutarli_fatura_reddedilir()
    {
        var exception = await Should.ThrowAsync<Exception>(
            () => CreateInvoiceAsync(Guid.NewGuid(), net: -5m));

        // DTO'daki [Range] domain kuralından önce devreye girer; hangi katman yakalarsa
        // yakalasın fatura AÇILMAMALI.
        exception.ShouldNotBeNull();
    }

    [Fact]
    public async Task Ozet_acik_tutari_toplar()
    {
        var tenantId = Guid.NewGuid();

        await CreateInvoiceAsync(tenantId, net: 1_000m);
        var second = await CreateInvoiceAsync(tenantId, net: 2_000m);
        await _billing.RecordPaymentAsync(second.Id, new RecordPaymentDto
        {
            PaidAt = DateTime.Today,
            Amount = 500m,
            Method = PaymentMethod.BankTransfer
        });

        var list = await _billing.GetListAsync(new SubscriptionInvoiceFilterDto { TenantId = tenantId });

        list.TotalCount.ShouldBe(2);
        // 1000 (hiç ödenmemiş) + 1500 (kalan) = 2500
        list.Items.Sum(i => i.RemainingAmount).ShouldBe(2_500m);
    }
}
