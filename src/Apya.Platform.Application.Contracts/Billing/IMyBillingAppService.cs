using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Billing.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Billing;

/// <summary>
/// Kiracının KENDİ faturaları. Bilerek dardır: listeleme, belgeyi indirme ve dekont
/// bildirme. Fatura açma, tutar değiştirme ve tahsilat onaylama BURADA YOK — onlar
/// host kararıdır.
///
/// <para>🔴 Fatura host kaydıdır (<c>IMultiTenant</c> değil), ABP'nin kiracı filtresi bu
/// sorguları KORUMAZ — eşleştirme <c>CurrentTenant.Id</c> ile ELLE yapılır. Her metot
/// kaydın gerçekten çağıran kiracıya ait olduğunu ayrıca doğrular.</para>
/// </summary>
public interface IMyBillingAppService : IApplicationService
{
    /// <summary>Kiracının faturaları, en yeniden eskiye.</summary>
    Task<List<SubscriptionInvoiceDto>> GetListAsync();

    Task<SubscriptionInvoiceDto> GetAsync(Guid id);

    /// <summary>
    /// "Ödedim" beyanı: dekontuyla birlikte tahsilat bildirir. Kayıt ONAYSIZ doğar ve
    /// host ekstreyle karşılaştırıp onaylayana kadar faturayı kapatmaz.
    /// </summary>
    Task<SubscriptionInvoiceDto> DeclarePaymentAsync(Guid id, DeclarePaymentDto input);

    /// <summary>
    /// İndirilecek dosyanın diskteki adını verir; yoksa <c>null</c>. Kiracı doğrulaması
    /// burada yapılır, indirme ucu bu değere göre dosyayı akıtır.
    /// </summary>
    Task<string?> ResolveInvoiceDocumentAsync(Guid id);
}
