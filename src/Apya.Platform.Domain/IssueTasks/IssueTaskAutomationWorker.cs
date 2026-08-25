using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Settings;
using Apya.Platform.Telemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.TenantManagement;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Eşiği geçen sinyalleri kendiliğinden göreve dönüştürür: kritik geri bildirimler,
/// çok tekrar eden istemci hataları ve sürekli patlayan sunucu uçları.
/// <para>
/// Mükerrer görev açılmasını (SourceType, SourceKey) unique index'i engeller; worker
/// yine de bağı önceden okur ki her turda gereksiz insert denemesi yapmasın.
/// Tur başına açılabilecek görev sayısı sınırlıdır — yanlış ayarlanmış bir eşik görev
/// listesini bir gecede doldurmasın.
/// </para>
/// </summary>
public class IssueTaskAutomationWorker : AsyncPeriodicBackgroundWorkerBase
{
    /// <summary>Sunucu hatası taramasının penceresi (gün).</summary>
    private const int ServerErrorWindowDays = 7;

    public IssueTaskAutomationWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 60 * 60 * 1000; // Saatte bir
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var settingProvider = workerContext.ServiceProvider.GetRequiredService<ISettingProvider>();

        // KRİTİK: bu ayarlar .WithProviders(Global) ile kısıtlı → varsayılan sağlayıcı
        // zincirde yok; açık varsayılan verilmezse hiç yazılmamış ayar false/0 gelir.
        var enabled = await settingProvider.GetAsync(
            PlatformSettings.IssueTasks.AutoCreateEnabled, PlatformSettingDefaults.IssueTaskAutoCreateEnabled);

        if (!enabled)
        {
            return;
        }

        var targetProjectId = ParseGuid(await settingProvider.GetOrNullAsync(PlatformSettings.IssueTasks.TargetProjectId));
        if (targetProjectId is null)
        {
            Logger.LogWarning(
                "IssueTaskAutomationWorker: otomatik görev açma AÇIK ama hedef proje seçilmemiş — tur atlandı.");
            return;
        }

        var options = new IssueTaskOptions
        {
            ProjectId   = targetProjectId.Value,
            AssigneeId  = ParseGuid(await settingProvider.GetOrNullAsync(PlatformSettings.IssueTasks.DefaultAssigneeId)),
            IsAutomatic = true
        };

        var budget = IssueTaskConsts.MaxAutoTasksPerRun;

        budget -= await CreateFromFeedbacksAsync(workerContext, settingProvider, options, budget);
        budget -= await CreateFromClientErrorsAsync(workerContext, settingProvider, options, budget);
        budget -= await CreateFromServerErrorsAsync(workerContext, settingProvider, options, budget);

        var created = IssueTaskConsts.MaxAutoTasksPerRun - budget;
        if (created > 0)
        {
            Logger.LogInformation("IssueTaskAutomationWorker: {Count} görev otomatik açıldı.", created);
        }
    }

    /* ---------- geri bildirim ---------- */

    private async Task<int> CreateFromFeedbacksAsync(
        PeriodicBackgroundWorkerContext workerContext,
        ISettingProvider settingProvider,
        IssueTaskOptions options,
        int budget)
    {
        if (budget <= 0)
        {
            return 0;
        }

        var minPriority = (FeedbackPriority)ParseInt(
            await settingProvider.GetOrNullAsync(PlatformSettings.IssueTasks.FeedbackMinPriority),
            PlatformSettingDefaults.IssueTaskFeedbackMinPriority);

        var manager = workerContext.ServiceProvider.GetRequiredService<IssueTaskManager>();
        var feedbackRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<Feedback, Guid>>();
        var tenantRepository = workerContext.ServiceProvider.GetRequiredService<ITenantRepository>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var asyncExecuter = workerContext.ServiceProvider.GetRequiredService<IAsyncQueryableExecuter>();

        // Worker host bağlamında koşar; filtre açık kalırsa yalnız host'un kendi
        // geri bildirimleri görünür ve kiracı kayıtları hiç değerlendirilmez.
        using (dataFilter.Disable())
        {
            var query = (await feedbackRepository.GetQueryableAsync())
                .Where(f => f.Priority >= minPriority)
                .Where(f => f.Status == FeedbackStatus.New
                            || f.Status == FeedbackStatus.InReview
                            || f.Status == FeedbackStatus.Planned)
                .OrderBy(f => f.CreationTime)
                .Take(budget * 2); // bağlı olanlar elenecek, biraz fazla çek

            var candidates = await asyncExecuter.ToListAsync(query);
            if (candidates.Count == 0)
            {
                return 0;
            }

            var keys = candidates.Select(f => f.Id.ToString("N")).ToList();
            var linked = (await manager.GetLinksAsync(IssueSourceType.Feedback, keys))
                .Select(l => l.SourceKey)
                .ToHashSet();

            var tenantNames = (await tenantRepository.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);

            var created = 0;
            foreach (var feedback in candidates)
            {
                if (created >= budget)
                {
                    break;
                }

                if (linked.Contains(feedback.Id.ToString("N")))
                {
                    continue;
                }

                var tenantName = feedback.TenantId is null
                    ? "Host"
                    : tenantNames.GetValueOrDefault(feedback.TenantId.Value);

                if (await TryCreateAsync(() => manager.CreateFromFeedbackAsync(feedback, tenantName, options)))
                {
                    created++;
                }
            }

            return created;
        }
    }

    /* ---------- istemci hatası ---------- */

    private async Task<int> CreateFromClientErrorsAsync(
        PeriodicBackgroundWorkerContext workerContext,
        ISettingProvider settingProvider,
        IssueTaskOptions options,
        int budget)
    {
        if (budget <= 0)
        {
            return 0;
        }

        var threshold = await settingProvider.GetAsync(
            PlatformSettings.IssueTasks.ClientErrorThreshold, IssueTaskConsts.DefaultClientErrorThreshold);

        var manager = workerContext.ServiceProvider.GetRequiredService<IssueTaskManager>();
        var errorRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<ClientError, Guid>>();
        var tenantRepository = workerContext.ServiceProvider.GetRequiredService<ITenantRepository>();
        var dataFilter = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var asyncExecuter = workerContext.ServiceProvider.GetRequiredService<IAsyncQueryableExecuter>();

        using (dataFilter.Disable())
        {
            var candidates = await asyncExecuter.ToListAsync(
                (await errorRepository.GetQueryableAsync())
                    .Where(e => !e.IsResolved && e.OccurrenceCount >= threshold)
                    .OrderByDescending(e => e.OccurrenceCount)
                    .Take(budget * 2));

            if (candidates.Count == 0)
            {
                return 0;
            }

            var linked = (await manager.GetLinksAsync(
                    IssueSourceType.ClientError,
                    candidates.Select(e => e.Fingerprint).ToList()))
                .Select(l => l.SourceKey)
                .ToHashSet();

            var tenantNames = (await tenantRepository.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);

            var created = 0;
            foreach (var error in candidates)
            {
                if (created >= budget)
                {
                    break;
                }

                if (linked.Contains(error.Fingerprint))
                {
                    continue;
                }

                var tenantName = error.TenantId is null
                    ? "Host"
                    : tenantNames.GetValueOrDefault(error.TenantId.Value);

                if (await TryCreateAsync(() => manager.CreateFromClientErrorAsync(error, tenantName, options)))
                {
                    created++;
                }
            }

            return created;
        }
    }

    /* ---------- sunucu hatası ---------- */

    private async Task<int> CreateFromServerErrorsAsync(
        PeriodicBackgroundWorkerContext workerContext,
        ISettingProvider settingProvider,
        IssueTaskOptions options,
        int budget)
    {
        if (budget <= 0)
        {
            return 0;
        }

        var threshold = await settingProvider.GetAsync(
            PlatformSettings.IssueTasks.ServerErrorThreshold, IssueTaskConsts.DefaultServerErrorThreshold);

        var manager = workerContext.ServiceProvider.GetRequiredService<IssueTaskManager>();
        var signalBuilder = workerContext.ServiceProvider.GetRequiredService<ServerErrorSignalBuilder>();

        var urls = await signalBuilder.FindFailingUrlsAsync(ServerErrorWindowDays, threshold, budget * 2);

        var created = 0;
        foreach (var url in urls)
        {
            if (created >= budget)
            {
                break;
            }

            var signal = await signalBuilder.BuildAsync(url, ServerErrorWindowDays);
            if (signal is null)
            {
                continue;
            }

            // Anahtar exception TÜRÜNÜ de içerir; aynı uçtaki farklı arıza ayrı görev açar.
            var key = IssueTaskManager.BuildServerErrorKey(signal.Url, signal.ExceptionType);
            if (await manager.FindLinkAsync(IssueSourceType.ServerError, key) is not null)
            {
                continue;
            }

            if (await TryCreateAsync(() => manager.CreateFromServerErrorAsync(signal, options)))
            {
                created++;
            }
        }

        return created;
    }

    /// <summary>
    /// Tek bir adayın patlaması turu bitirmesin: bağ yarışı (aynı anda elle dönüştürme)
    /// ya da silinmiş hedef proje yalnızca o adayı düşürür, kalanlar denenmeye devam eder.
    /// </summary>
    private async Task<bool> TryCreateAsync(Func<Task<IssueTaskLink>> create)
    {
        try
        {
            await create();
            return true;
        }
        catch (BusinessException ex)
        {
            Logger.LogWarning(ex, "IssueTaskAutomationWorker: aday göreve dönüştürülemedi ({Code}).", ex.Code);
            return false;
        }
    }

    private static Guid? ParseGuid(string? raw)
        => Guid.TryParse(raw, out var value) && value != Guid.Empty ? value : null;

    private static int ParseInt(string? raw, int fallback)
        => int.TryParse(raw, out var value) ? value : fallback;
}
