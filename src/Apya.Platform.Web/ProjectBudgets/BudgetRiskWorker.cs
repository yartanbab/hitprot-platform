using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.ProjectBudgets;

/// <summary>
/// Bütçe risklerini günde bir yoklar: kalem kullanım eşikleri, limit aşımı ve
/// vadesi geçmiş fonlama dilimleri.
///
/// <para>Kasten İNCE: tüm mantık <see cref="BudgetRiskEvaluator"/>'dadır
/// (Application katmanı) ki testler bir turu worker'ı ayağa kaldırmadan
/// çalıştırabilsin — SubscriptionExpiryWorker ile aynı desen.</para>
///
/// <para>Günlük yeter: gider yazımı zaten anında değerlendiriliyor
/// (<c>ExpenseAppService</c>), bu tur emniyet ağı ve tek zaman-temelli uyarının
/// (gecikmiş dilim) kaynağı. Vade gün değişiminde geçtiği için saatlik koşmanın
/// kazancı yok.</para>
/// </summary>
public class BudgetRiskWorker : AsyncPeriodicBackgroundWorkerBase
{
    public BudgetRiskWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var evaluator = workerContext.ServiceProvider.GetRequiredService<BudgetRiskEvaluator>();

        var sent = await evaluator.RunDailyScanAsync();
        if (sent > 0)
        {
            Logger.LogInformation("BudgetRiskWorker: {Count} bütçe uyarısı üretildi.", sent);
        }
    }
}
