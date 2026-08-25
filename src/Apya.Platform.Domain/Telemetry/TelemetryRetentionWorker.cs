using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks;
using Apya.Platform.Settings;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Denetim günlüğü (AbpAuditLogs) ve istemci hata kayıtlarının (AppClientErrors)
/// saklama süresini uygular. Süre <see cref="PlatformSettings.Telemetry.RetentionDays"/>
/// ayarından okunur — kod değişikliği/yeniden derleme gerekmeden değiştirilebilir.
/// <para>
/// Geri bildirimler (Feedback) BURADA SİLİNMEZ — ürün hafızası, saklama süresinden
/// bağımsızdır.
/// </para>
/// </summary>
public class TelemetryRetentionWorker : AsyncPeriodicBackgroundWorkerBase
{
    public TelemetryRetentionWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // Günde bir kez
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var settingProvider = workerContext.ServiceProvider.GetRequiredService<ISettingProvider>();
        var clock = workerContext.ServiceProvider.GetRequiredService<IClock>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var asyncExecuter = workerContext.ServiceProvider.GetRequiredService<IAsyncQueryableExecuter>();
        var auditLogRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<AuditLog, Guid>>();
        var clientErrorRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<ClientError, Guid>>();
        var linkRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<IssueTaskLink, Guid>>();

        // KRİTİK: setting .WithProviders(Global) ile kısıtlı → DefaultValueSettingValueProvider
        // zincirden çıkarılıyor, GetAsync<T>'nin kendi varsayılanı (0) kullanılır. Açık varsayılan
        // (90) vermek şart — bkz. TelemetryAppService'teki aynı gotcha.
        var retentionDays = await settingProvider.GetAsync(PlatformSettings.Telemetry.RetentionDays, 90);
        retentionDays = Math.Clamp(retentionDays, TelemetryConsts.MinRetentionDays, TelemetryConsts.MaxRetentionDays);
        var cutoff = clock.Now.AddDays(-retentionDays);

        Logger.LogInformation(
            "TelemetryRetentionWorker çalışıyor: {RetentionDays} günden eski (< {Cutoff}) audit log ve istemci hatası kayıtları siliniyor.",
            retentionDays, cutoff);

        // Tüm tenant'ların kayıtlarını temizle — worker host bağlamında (TenantId=null)
        // çalışır, filtre açık kalırsa yalnızca TenantId=null satırlar silinir.
        using (dataFilter.Disable())
        {
            var auditLogsDeleted = await DeleteAuditLogsInBatchesAsync(auditLogRepository, asyncExecuter, cutoff);
            var clientErrorsDeleted = await DeleteClientErrorsInBatchesAsync(
                clientErrorRepository, linkRepository, asyncExecuter, cutoff);

            Logger.LogInformation(
                "TelemetryRetentionWorker tamamlandı: {AuditLogsDeleted} audit log, {ClientErrorsDeleted} istemci hatası silindi.",
                auditLogsDeleted, clientErrorsDeleted);
        }
    }

    /// <summary>
    /// Tek büyük DELETE yerine ID bazlı küçük partiler halinde siler — büyük tabloda
    /// uzun süreli kilide/şişkin transaction'a yol açmaz.
    /// </summary>
    private static async Task<int> DeleteAuditLogsInBatchesAsync(
        IRepository<AuditLog, Guid> repository,
        IAsyncQueryableExecuter asyncExecuter,
        DateTime cutoff)
    {
        var totalDeleted = 0;

        while (true)
        {
            var query = (await repository.GetQueryableAsync())
                .Where(a => a.ExecutionTime < cutoff)
                .OrderBy(a => a.Id)
                .Select(a => a.Id)
                .Take(TelemetryConsts.RetentionBatchSize);

            var batchIds = await asyncExecuter.ToListAsync(query);
            if (batchIds.Count == 0)
            {
                break;
            }

            await repository.DeleteDirectAsync(a => batchIds.Contains(a.Id));
            totalDeleted += batchIds.Count;

            if (batchIds.Count < TelemetryConsts.RetentionBatchSize)
            {
                break;
            }
        }

        return totalDeleted;
    }

    /// <summary>
    /// Göreve dönüştürülmüş hatalar SİLİNMEZ: bağ kaydı görevden kaynağa gitmeyi sağlar,
    /// kaynak silinirse "kaynağa git" kırılır. Bağ kaldırılınca kayıt yine temizlenir.
    /// </summary>
    private static async Task<int> DeleteClientErrorsInBatchesAsync(
        IRepository<ClientError, Guid> repository,
        IRepository<IssueTaskLink, Guid> linkRepository,
        IAsyncQueryableExecuter asyncExecuter,
        DateTime cutoff)
    {
        var totalDeleted = 0;
        var linkQuery = (await linkRepository.GetQueryableAsync())
            .Where(l => l.SourceType == IssueSourceType.ClientError && l.SourceId != null);

        while (true)
        {
            var query = (await repository.GetQueryableAsync())
                .Where(e => e.LastSeenAt < cutoff)
                .Where(e => !linkQuery.Any(l => l.SourceId == e.Id))
                .OrderBy(e => e.Id)
                .Select(e => e.Id)
                .Take(TelemetryConsts.RetentionBatchSize);

            var batchIds = await asyncExecuter.ToListAsync(query);
            if (batchIds.Count == 0)
            {
                break;
            }

            await repository.DeleteDirectAsync(e => batchIds.Contains(e.Id));
            totalDeleted += batchIds.Count;

            if (batchIds.Count < TelemetryConsts.RetentionBatchSize)
            {
                break;
            }
        }

        return totalDeleted;
    }
}
