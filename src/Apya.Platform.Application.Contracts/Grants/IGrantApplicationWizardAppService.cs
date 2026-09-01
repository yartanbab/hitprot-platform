using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 2a · Başvuru sihirbazı. Kiracı (firma) ve host (danışman) AYNI servisi kullanır;
/// rol, çağıranın bağlamından türetilir — ayrı iki servis, aynı kuralları iki kez
/// yazmak demekti.
/// </summary>
public interface IGrantApplicationWizardAppService : IApplicationService
{
    Task<GrantApplicationWizardDto> GetAsync(Guid applicationId);

    /// <summary>Bütçe satırını yazar (otomatik kayıt). Alanın kilidi başkasındaysa reddeder.</summary>
    Task<GrantApplicationWizardDto> SaveBudgetLineAsync(SaveWizardBudgetLineInput input);

    Task<GrantApplicationWizardDto> SaveSummaryAsync(SaveWizardSummaryInput input);

    Task<GrantApplicationWizardDto> SetStepAsync(Guid applicationId, int step);

    /// <summary>Sırayı karşı tarafa devreder ("Danışmana devret" / "Firmaya geri ver").</summary>
    Task<GrantApplicationWizardDto> HandOverAsync(Guid applicationId);

    Task<GrantApplicationWizardDto> SubmitAsync(Guid applicationId);

    // --- Canlı düzenleme ---

    Task<GrantFieldLockResultDto> AcquireLockAsync(GrantFieldLockInput input);
    Task ReleaseLockAsync(GrantFieldLockInput input);

    /// <summary>Kilidi canlı tutar; 2 dakika dokunulmayan kilit başkasına açılır.</summary>
    Task HeartbeatAsync(GrantFieldLockInput input);

    /// <summary>Kilit sahibine devralma isteği bırakır.</summary>
    Task RequestTakeoverAsync(GrantFieldLockInput input);

    /// <summary>Kilit sahibi isteği onaylar; kilit isteyene geçer.</summary>
    Task<GrantFieldLockResultDto> ApproveTakeoverAsync(GrantFieldLockInput input);

    Task<GrantApplicationMessageDto> SendMessageAsync(SendWizardMessageInput input);
}
