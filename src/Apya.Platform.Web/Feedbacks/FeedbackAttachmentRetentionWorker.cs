using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Settings;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// Geri bildirim EKLERİNİN saklama süresini uygular (KVKK-004). Süre dolan ekin hem
/// disk dosyası (FeedbackFileStorage) hem DB kaydı (FeedbackAttachment) imha edilir;
/// geri bildirim METNİ korunur (ürün hafızası — TelemetryRetentionWorker ile aynı ilke).
/// <para>
/// Web katmanında: dosya silme FeedbackFileStorage'a bağlı ve o yalnız burada. Süre
/// <see cref="PlatformSettings.Feedback.AttachmentRetentionDays"/>'ten okunur (kod
/// değişikliği gerekmeden değiştirilebilir).
/// </para>
/// </summary>
public class FeedbackAttachmentRetentionWorker : AsyncPeriodicBackgroundWorkerBase
{
    private const int BatchSize = 200;

    public FeedbackAttachmentRetentionWorker(
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
        var attachmentRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<FeedbackAttachment, Guid>>();
        var fileStorage = workerContext.ServiceProvider.GetRequiredService<FeedbackFileStorage>();

        // .WithProviders(Global) DefaultValueSettingValueProvider'ı zincirden çıkarır →
        // AÇIK varsayılan şart (bkz. TelemetryRetentionWorker aynı gotcha).
        var retentionDays = await settingProvider.GetAsync(
            PlatformSettings.Feedback.AttachmentRetentionDays,
            PlatformSettingDefaults.FeedbackAttachmentRetentionDays);
        retentionDays = Math.Clamp(
            retentionDays,
            PlatformSettingDefaults.FeedbackAttachmentRetentionMinDays,
            PlatformSettingDefaults.FeedbackAttachmentRetentionMaxDays);
        var cutoff = clock.Now.AddDays(-retentionDays);

        Logger.LogInformation(
            "FeedbackAttachmentRetentionWorker çalışıyor: {RetentionDays} günden eski (< {Cutoff}) geri bildirim ekleri imha ediliyor.",
            retentionDays, cutoff);

        var filesDeleted = 0;
        var rowsDeleted = 0;

        // Worker host bağlamında (TenantId=null) çalışır → tüm kiracıların ekleri için filtre kapatılır.
        using (dataFilter.Disable())
        {
            while (true)
            {
                var query = (await attachmentRepository.GetQueryableAsync())
                    .Where(a => a.CreationTime < cutoff)
                    .OrderBy(a => a.Id)
                    .Select(a => new { a.Id, a.StoredFileName })
                    .Take(BatchSize);

                var batch = await asyncExecuter.ToListAsync(query);
                if (batch.Count == 0)
                {
                    break;
                }

                foreach (var item in batch)
                {
                    try
                    {
                        if (fileStorage.Delete(item.StoredFileName))
                        {
                            filesDeleted++;
                        }
                    }
                    catch (Exception ex)
                    {
                        // Tek dosyanın silinememesi tüm turu durdurmasın; DB satırı yine silinir.
                        Logger.LogWarning(ex,
                            "Geri bildirim eki dosyası silinemedi: {StoredFileName}", item.StoredFileName);
                    }
                }

                var ids = batch.Select(b => b.Id).ToList();
                await attachmentRepository.DeleteDirectAsync(a => ids.Contains(a.Id));
                rowsDeleted += ids.Count;

                if (batch.Count < BatchSize)
                {
                    break;
                }
            }
        }

        Logger.LogInformation(
            "FeedbackAttachmentRetentionWorker tamamlandı: {Rows} ek kaydı, {Files} dosya imha edildi.",
            rowsDeleted, filesDeleted);
    }
}
