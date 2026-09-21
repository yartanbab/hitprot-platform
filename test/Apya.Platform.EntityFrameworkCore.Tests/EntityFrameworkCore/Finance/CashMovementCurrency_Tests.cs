using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.ExchangeRates;
using Apya.Platform.Expenses;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// KİLİT SÖZLEŞME: kasa hareketi KASANIN para biriminde yazılır.
///
/// <para>Regresyon kaynağı: <c>CashMovement</c>'ta para birimi alanı YOKTUR ve bakiye
/// doğrudan hareket tutarlarının toplamıdır. Gider/gelir kaydı kasadan farklı bir para
/// biriminde girildiğinde ham tutar yazılıyordu — TRY kasadan ödenen 250 EUR'luk gider
/// bakiyeyi 250 TL düşürüyordu ve kur değerleme bu bozuk bakiyeyi değerliyordu
/// (denetim bulgusu FIN-01). Fatura tahsilatı yolu aynı işi baştan beri doğru yapıyordu.</para>
///
/// <para>Kasasız gelir bilerek kapsam dışıdır: çözümleme o dalda hiç çalışmaz, yoksa
/// "kasaya işlenmesin" seçeneği kur kaydı olmayan kiracıda kilide dönüşürdü.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class CashMovementCurrency_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Tenant = Guid.Parse("55550000-cccc-4000-8000-000000000033");

    private readonly IExpenseAppService _expenseAppService;
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<ExchangeRate, Guid> _rateRepository;
    private readonly ICurrentTenant _currentTenant;

    public CashMovementCurrency_Tests()
    {
        _expenseAppService = GetRequiredService<IExpenseAppService>();
        _cashAccountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
        _cashMovementRepository = GetRequiredService<IRepository<CashMovement, Guid>>();
        _rateRepository = GetRequiredService<IRepository<ExchangeRate, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateCashAccountAsync(string currency)
    {
        var id = Guid.NewGuid();
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                // TenantId kurucuda ATANIR; CurrentTenant.Change kapsamı tek başına yetmez.
                var account = new CashAccount(id, "Kasa " + currency, currency: currency, tenantId: Tenant);
                await _cashAccountRepository.InsertAsync(account, autoSave: true);
            }
        });
        return id;
    }

    private async Task AddRateAsync(string from, string to, decimal rate, DateTime date)
    {
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await _rateRepository.InsertAsync(
                    new ExchangeRate(Guid.NewGuid(), from, to, rate, date, tenantId: Tenant),
                    autoSave: true);
            }
        });
    }

    private async Task<ExpenseDto> CreateExpenseAsync(Guid cashAccountId, string currency, decimal amount, DateTime date)
    {
        ExpenseDto dto = null!;
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                dto = await _expenseAppService.CreateAsync(new CreateUpdateExpenseDto
                {
                    Title = "Kur testi",
                    Amount = amount,
                    Currency = currency,
                    ExpenseDate = date,
                    CashAccountId = cashAccountId
                });
            }
        });
        return dto;
    }

    private async Task<CashMovement?> GetMovementAsync(Guid expenseId)
    {
        CashMovement? movement = null;
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                var all = await _cashMovementRepository.GetListAsync(
                    x => x.ReferenceId == expenseId && x.Source == CashMovementSource.Expense);
                movement = all.SingleOrDefault();
            }
        });
        return movement;
    }

    [Fact]
    public async Task Ayni_Para_Biriminde_Ham_Tutar_Yazilir()
    {
        var date = new DateTime(2026, 9, 21);
        var cashId = await CreateCashAccountAsync("TRY");

        var expense = await CreateExpenseAsync(cashId, "TRY", 250m, date);

        var movement = await GetMovementAsync(expense.Id);
        movement.ShouldNotBeNull();
        movement!.Amount.ShouldBe(250m);
        // Aynı para biriminde kur aranmaz; açıklamaya kur izi de düşmez.
        movement.Description.ShouldBe("Gider: Kur testi");
    }

    [Fact]
    public async Task Farkli_Para_Biriminde_Cevrilmis_Tutar_Yazilir()
    {
        var date = new DateTime(2026, 9, 21);
        var cashId = await CreateCashAccountAsync("TRY");
        await AddRateAsync("EUR", "TRY", 41.60m, date);

        var expense = await CreateExpenseAsync(cashId, "EUR", 250m, date);

        var movement = await GetMovementAsync(expense.Id);
        movement.ShouldNotBeNull();
        movement!.Amount.ShouldBe(10_400m,
            "250 EUR, 41,60 kuruyla TRY kasaya 10.400 TL olarak yazılmalı — ham 250 yazılırsa bakiye bozulur");
        movement.Description.ShouldContain("1 EUR = 41,6000 TRY",
            Case.Insensitive,
            "Kasa hareketinde kur alanı yok; uygulanan kurun tek izi açıklamadır");
    }

    [Fact]
    public async Task Ters_Yonde_Girilmis_Kur_Da_Bulunur()
    {
        var date = new DateTime(2026, 9, 21);
        var cashId = await CreateCashAccountAsync("TRY");
        // Yalnız TRY→EUR girilmiş; EUR→TRY yok. Çözümleyici tersini almalı.
        await AddRateAsync("TRY", "EUR", 0.025m, date);

        var expense = await CreateExpenseAsync(cashId, "EUR", 100m, date);

        var movement = await GetMovementAsync(expense.Id);
        movement.ShouldNotBeNull();
        movement!.Amount.ShouldBe(4_000m, "1/0,025 = 40 → 100 EUR = 4.000 TRY");
    }

    [Fact]
    public async Task Kur_Yoksa_Anlasilir_Hata_Verir()
    {
        var date = new DateTime(2026, 9, 21);
        var cashId = await CreateCashAccountAsync("TRY");

        var ex = await Should.ThrowAsync<BusinessException>(
            async () => await CreateExpenseAsync(cashId, "USD", 100m, date));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashMovementSourceRateMissing,
            "Kullanıcı ham hata kodu değil, Kurlar ekranına yönlendiren mesaj görmeli");
    }

    [Fact]
    public async Task Guncelleme_Kasa_Hareketini_Yeniden_Cevirir()
    {
        var date = new DateTime(2026, 9, 21);
        var cashId = await CreateCashAccountAsync("TRY");
        await AddRateAsync("EUR", "TRY", 41.60m, date);

        var expense = await CreateExpenseAsync(cashId, "EUR", 250m, date);

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(Tenant))
            {
                await _expenseAppService.UpdateAsync(expense.Id, new CreateUpdateExpenseDto
                {
                    Title = "Kur testi",
                    Amount = 300m,
                    Currency = "EUR",
                    ExpenseDate = date,
                    CashAccountId = cashId
                });
            }
        });

        var movement = await GetMovementAsync(expense.Id);
        movement.ShouldNotBeNull();
        movement!.Amount.ShouldBe(12_480m,
            "Güncelleme bağlı hareketi ham tutarla yeniden yazıyordu; çevrim burada da uygulanmalı");
    }
}
