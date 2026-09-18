using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 6c · Tahsilat diliminin ödeme kapısı: dilime bağlı rapor onaylanmadan dilim ödemeye çıkmaz.
///
/// <para>Kural tek yerde durur. Dilimi Ödendi'ye taşıyan her yol (Uygulama ekranındaki "tahsil edildi",
/// başvuru listesindeki dilim penceresi) buradan geçer; önceden kural yalnız ilk yoldaydı ve pencere onu
/// atlıyordu.</para>
/// </summary>
public class GrantTrancheManager : DomainService
{
    private readonly IRepository<GrantReport, Guid> _reportRepository;

    public GrantTrancheManager(IRepository<GrantReport, Guid> reportRepository)
    {
        _reportRepository = reportRepository;
    }

    /// <summary>
    /// Dilime bağlı onaylanmamış rapor varsa reddeder. Rapor dilimle aynı kiracıdadır; okuma o kiracıya
    /// geçerek yapılır, böylece danışman (host bağlamı) çağırsa da kiracı filtresi doğru satırları getirir.
    /// </summary>
    public async Task EnsureCanMarkPaidAsync(GrantDisbursementTranche tranche)
    {
        using (CurrentTenant.Change(tranche.TenantId))
        {
            var blocking = (await _reportRepository.GetListAsync(r => r.TrancheId == tranche.Id
                    && r.Status != GrantReportStatus.Onaylandi))
                .OrderBy(r => r.Order)
                .FirstOrDefault();

            if (blocking != null)
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantTranchePaymentBlockedByReport)
                    .WithData("Report", blocking.Title);
            }
        }
    }
}
