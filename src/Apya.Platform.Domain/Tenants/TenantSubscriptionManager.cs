using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kiracı aboneliklerinin tek doğruluk noktası: dönem başlatma, uzatma ve yürürlükteki
/// satırı bulma. Paketin kiracıya UYGULANMASI (feature/izin yazımı) burada DEĞİL
/// <c>TenantPackageManager</c>'dadır — o Application katmanındadır ve Domain oraya bakamaz.
/// Çağıran ikisini birlikte sürer.
/// </summary>
public class TenantSubscriptionManager : DomainService
{
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;

    public TenantSubscriptionManager(IRepository<TenantSubscription, Guid> subscriptionRepository)
    {
        _subscriptionRepository = subscriptionRepository;
    }

    /// <summary>
    /// Kiracının yürürlükteki abonelik satırı. <c>null</c> = satır YOK; bu, kiracının
    /// SÜRESİZ sayılması demektir (özellik devreye girmeden önce kurulmuş kiracılar).
    /// "Süresi dolmuş" ile karıştırılmamalı: süresi dolan satır Expired olarak DURUR ve
    /// yerine süresiz bir Basic satırı açılır.
    /// </summary>
    public async Task<TenantSubscription?> GetCurrentOrNullAsync(Guid tenantId)
    {
        var queryable = await _subscriptionRepository.GetQueryableAsync();
        return await AsyncExecuter.FirstOrDefaultAsync(
            queryable
                .Where(s => s.TenantId == tenantId
                            && (s.Status == SubscriptionStatus.Active
                                || s.Status == SubscriptionStatus.InGrace))
                .OrderByDescending(s => s.StartDate));
    }

    /// <summary>
    /// Yeni bir dönem başlatır. Yürürlükteki satır varsa <see cref="SubscriptionStatus.Superseded"/>
    /// ile kapatılır — geçmiş silinmez, kiracının paket tarihçesi okunabilir kalır.
    /// </summary>
    /// <param name="startDate">Verilmezse şimdi. Uzatmada dönem, önceki bitişten başlatılır.</param>
    public async Task<TenantSubscription> StartAsync(
        Guid tenantId,
        PackageCode packageCode,
        SubscriptionPeriod period,
        SubscriptionSource source,
        DateTime? startDate = null)
    {
        var now = Clock.Now;

        var current = await GetCurrentOrNullAsync(tenantId);
        if (current != null)
        {
            current.Supersede(now);
            await _subscriptionRepository.UpdateAsync(current);
        }

        var subscription = new TenantSubscription(
            GuidGenerator.Create(),
            tenantId,
            packageCode,
            period,
            startDate ?? now,
            source);

        return await _subscriptionRepository.InsertAsync(subscription, autoSave: true);
    }

    /// <summary>
    /// Yürürlükteki paketi bir dönem daha uzatır. <b>Ödeme altyapısının gireceği kapı budur:</b>
    /// tahsilat tamamlanınca bu metot çağrılır, başka hiçbir yere dokunulmaz (paket değişmediği
    /// için feature/izin yeniden uygulanmasına da gerek yoktur).
    ///
    /// <para>Kalan süre YANMAZ: bitiş henüz gelmediyse yeni dönem onun üstüne biner. Süresi
    /// çoktan dolmuş (ya da süresiz) abonelikte dönem şimdiden başlar.</para>
    /// </summary>
    public async Task<TenantSubscription> RenewAsync(
        Guid tenantId,
        SubscriptionPeriod period,
        SubscriptionSource source = SubscriptionSource.Payment)
    {
        var current = await GetCurrentOrNullAsync(tenantId);
        if (current == null)
        {
            throw new BusinessException("Platform:Error:NoCurrentSubscription");
        }

        var anchor = current.EndDate.HasValue && current.EndDate.Value > Clock.Now
            ? current.EndDate.Value
            : Clock.Now;

        return await StartAsync(tenantId, current.PackageCode, period, source, anchor);
    }
}
