using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// 19b · Fikir davetinin tek hatırlatması. Günde bir koşar; kural ve işaretleme
/// <see cref="GrantIdeaInvitationManager.SendDueRemindersAsync"/>'te (davet host kaydı → host bağlamı).
/// </summary>
public class GrantIdeaInvitationReminderWorker : AsyncPeriodicBackgroundWorkerBase
{
    public GrantIdeaInvitationReminderWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var sp = workerContext.ServiceProvider;
        var reminded = await sp.GetRequiredService<GrantIdeaInvitationManager>()
            .SendDueRemindersAsync(sp.GetRequiredService<IClock>().Now);

        if (reminded > 0)
        {
            Logger.LogInformation("Fikir daveti hatırlatması gönderildi: {Count} firma", reminded);
        }
    }
}
