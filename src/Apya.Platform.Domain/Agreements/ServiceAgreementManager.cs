using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Timing;

namespace Apya.Platform.Agreements;

/// <summary>
/// Sözleşme iş kuralları: numara üretimi ve onaylanmış sözleşmenin oluşturulması.
/// Metnin doldurulması ve hash'lenmesi Application katmanındadır (şablon orada yaşar);
/// buraya hazır metin ve özeti gelir.
/// </summary>
public class ServiceAgreementManager : DomainService
{
    private readonly IRepository<ServiceAgreement, Guid> _repository;
    private readonly IClock _clock;

    public ServiceAgreementManager(
        IRepository<ServiceAgreement, Guid> repository,
        IClock clock)
    {
        _repository = repository;
        _clock = clock;
    }

    public async Task<ServiceAgreement> ApproveAsync(
        Guid registrationRequestId,
        string renderedHtml,
        string contentHash,
        SalesPlan plan,
        decimal? amount,
        decimal successFeePercent,
        string approverName,
        string approverTitle,
        string approverEmail,
        string? approvedIp,
        string? approvedUserAgent)
    {
        var now = _clock.Now;

        var agreement = new ServiceAgreement(
            GuidGenerator.Create(),
            registrationRequestId,
            await GenerateNumberAsync(now),
            ServiceAgreementConsts.TemplateVersion,
            renderedHtml,
            contentHash,
            plan,
            amount,
            successFeePercent,
            now,
            ServiceAgreementConsts.TermMonths,
            approverName,
            approverTitle,
            approverEmail,
            approvedIp,
            approvedUserAgent);

        return await _repository.InsertAsync(agreement, autoSave: true);
    }

    /// <summary>
    /// "APYA-PRT-2026-0001" — yıl içinde sıralı.
    /// <para>
    /// Sayaç, o yılın kayıt SAYISINDAN türetilir; ayrı bir sıra tablosu kurulmadı çünkü
    /// onaylar host hızında (günde birkaç) gerçekleşir. Yine de numara sütununda TEKİL
    /// indeks vardır: aynı anda iki onay gelirse ikincisi veritabanı tarafından reddedilir,
    /// sessizce mükerrer numara ÜRETİLMEZ. Çağıran katman böyle bir çakışmada işlemi
    /// yeniden dener.
    /// </para>
    /// </summary>
    private async Task<string> GenerateNumberAsync(DateTime now)
    {
        var year = now.Year;
        var query = await _repository.GetQueryableAsync();

        var countThisYear = await AsyncExecuter.CountAsync(
            query.Where(a => a.ApprovedAt.Year == year));

        var sequence = (countThisYear + 1).ToString("D4", CultureInfo.InvariantCulture);

        return $"{ServiceAgreementConsts.NumberPrefix}{year}-{sequence}";
    }
}
