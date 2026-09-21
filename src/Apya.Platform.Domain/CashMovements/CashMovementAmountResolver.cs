using System;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.ProjectBudgets;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.CashMovements;

/// <summary>
/// Bir gider/gelir kaydının KASA defterine hangi tutarla yazılacağını çözer.
///
/// <para>Kasa hareketinde para birimi alanı YOKTUR: tutar örtük olarak kasanın para
/// biriminde sayılır ve bakiye doğrudan bu tutarlardan türer. Bu yüzden kaydın para
/// birimi kasanınkinden farklıysa çevrilmiş tutar yazılmak zorundadır — ham tutar
/// yazmak bakiyeyi kalıcı olarak bozar (denetim bulgusu FIN-01).</para>
///
/// <para>Fatura tahsilatı yolu (<c>InvoiceManager</c>) bu işi zaten doğru yapıyordu;
/// gider ve gelir yolları atlıyordu. Mantık burada toplandı ki dört ayrı kopyaya
/// dağılmasın.</para>
/// </summary>
public class CashMovementAmountResolver : DomainService
{
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly FxRateResolver _fxRateResolver;

    public CashMovementAmountResolver(
        IRepository<CashAccount, Guid> cashAccountRepository,
        FxRateResolver fxRateResolver)
    {
        _cashAccountRepository = cashAccountRepository;
        _fxRateResolver = fxRateResolver;
    }

    /// <summary>
    /// Kasaya yazılacak tutarı döner. Para birimleri aynıysa tutar aynen geçer ve kur
    /// hiç aranmaz; farklıysa kur zorunludur ve bulunamazsa
    /// <see cref="PlatformDomainErrorCodes.CashMovementSourceRateMissing"/> fırlatılır.
    /// </summary>
    public async Task<CashMovementAmount> ResolveAsync(
        Guid cashAccountId,
        string? sourceCurrency,
        decimal amount,
        DateTime date)
    {
        var cashAccount = await _cashAccountRepository.GetAsync(cashAccountId);
        var cashCurrency = (cashAccount.Currency ?? string.Empty).Trim();
        var source = (sourceCurrency ?? string.Empty).Trim();

        // Kaydın para birimi boşsa kasanınki varsayılır: eski kayıtlarda ve para birimi
        // sormayan akışlarda tek defter vardır, çevrim aramak yanlış olur.
        if (source.Length == 0 || string.Equals(source, cashCurrency, StringComparison.OrdinalIgnoreCase))
        {
            return new CashMovementAmount(amount, cashCurrency, AppliedRate: null);
        }

        // Projeden bağımsız düz arama — ters yönde girilmiş kuru da bulur.
        // FxLedgerStamper de proje yokken bu girişi kullanıyor; kur mantığı tek yerde.
        var rate = await _fxRateResolver.ResolveByDateAsync(source, cashCurrency, date.Date);
        if (rate is null || rate <= 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementSourceRateMissing)
                .WithData("From", source)
                .WithData("To", cashCurrency);
        }

        var converted = FxLedgerCalculator.Convert(amount, source, cashCurrency, rate);
        return new CashMovementAmount(converted, cashCurrency, rate);
    }
}

/// <summary>Çözülmüş kasa tutarı ve uygulanan kur (aynı para biriminde kur yoktur).</summary>
public sealed record CashMovementAmount(decimal Amount, string CashCurrency, decimal? AppliedRate)
{
    public bool IsConverted => AppliedRate.HasValue;

    /// <summary>
    /// Kasa hareketi açıklamasına eklenecek kur izi. Kasa hareketinde kur/özgün tutar
    /// alanı olmadığı için uygulanan kurun tek kalıcı izi budur (şema değişikliği
    /// gerektirmeyen çözüm).
    /// </summary>
    public string DescribeRate(string sourceCurrency)
        => IsConverted
            ? $" (1 {sourceCurrency.Trim().ToUpperInvariant()} = {AppliedRate!.Value:N4} {CashCurrency.ToUpperInvariant()})"
            : string.Empty;
}
