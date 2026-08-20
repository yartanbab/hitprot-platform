using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Threading;
using Volo.Abp.Uow;
using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

public class DocumentExpiryWorker : AsyncPeriodicBackgroundWorkerBase
{
    public DocumentExpiryWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        // Günde bir kez kontrol et (Test için daha kısa tutulabilir)
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat (milisaniye cinsinden)
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        Logger.LogInformation("DocumentExpiryWorker çalışıyor: Son tarihi yaklaşan belgeler aranıyor...");

        var documentRepository = workerContext.ServiceProvider.GetRequiredService<IDocumentRepository>();
        var localEventBus = workerContext.ServiceProvider.GetRequiredService<ILocalEventBus>();
        var clock = workerContext.ServiceProvider.GetRequiredService<Volo.Abp.Timing.IClock>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var currentTenant = workerContext.ServiceProvider.GetRequiredService<ICurrentTenant>();

        var now = clock.Now;
        var limitDate = now.AddDays(7);

        List<Document> expiringDocuments;

        // Tüm tenant'lardaki belgeleri okuyabilmek için filtreyi geçici olarak devre dışı bırak
        using (dataFilter.Disable())
        {
            expiringDocuments = await documentRepository.GetListAsync(d =>
                d.ExpiryDate != null &&
                d.ExpiryDate > now &&
                d.ExpiryDate <= limitDate &&
                !d.IsExpiryWarningSent);
        }

        if (!expiringDocuments.Any())
        {
            Logger.LogInformation("Gönderilecek yeni bir son tarih uyarısı bulunamadı.");
            return;
        }

        var documentGroups = expiringDocuments.GroupBy(d => d.TenantId);

        foreach (var tenantGroup in documentGroups)
        {
            try
            {
                using (currentTenant.Change(tenantGroup.Key))
                {
                    var notifiedIds = new List<Guid>();
                    var ownerlessCount = 0;

                    foreach (var document in tenantGroup)
                    {
                        // Sahibi olmayan belgeye gönderilecek adres yok. Bunu "uyarıldı"
                        // diye işaretlersek belge bir daha ASLA hatırlatılmaz; işaretlemiyoruz.
                        // Belge son tarih penceresinde kaldığı sürece her turda yeniden denenir.
                        if (!document.CreatorId.HasValue)
                        {
                            ownerlessCount++;
                            continue;
                        }

                        await localEventBus.PublishAsync(new DocumentExpiringEto
                        {
                            DocumentId = document.Id,
                            DocumentTitle = document.Title,
                            ProjectId = document.ProjectId,
                            CreatorId = document.CreatorId.Value,
                            ExpiryDate = document.ExpiryDate!.Value
                        });

                        notifiedIds.Add(document.Id);
                    }

                    if (notifiedIds.Count > 0)
                    {
                        // Tek bir SQL UPDATE — N×UpdateAsync yerine
                        await documentRepository.BulkMarkExpiryWarningSentAsync(notifiedIds);
                    }

                    Logger.LogInformation(
                        "TenantId={TenantId}: {Count} belge için son tarih uyarısı gönderildi.",
                        tenantGroup.Key, notifiedIds.Count);

                    if (ownerlessCount > 0)
                    {
                        Logger.LogWarning(
                            "TenantId={TenantId}: {Count} belgenin sahibi (CreatorId) yok, uyarı gönderilemedi. "
                            + "Belgeler işaretlenmedi, sonraki turda yeniden denenecek.",
                            tenantGroup.Key, ownerlessCount);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "TenantId={TenantId}: Son tarih uyarıları işlenirken hata oluştu. Sonraki tenant'a geçiliyor.",
                    tenantGroup.Key);
            }
        }
    }
}
