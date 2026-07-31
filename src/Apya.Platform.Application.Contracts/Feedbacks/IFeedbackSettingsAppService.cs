using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirim modülü yapılandırması. Okuma her oturumlu kullanıcıya açıktır
/// (widget'ın kendini doğru render etmesi için); yazma ManageSettings ister.
/// </summary>
public interface IFeedbackSettingsAppService : IApplicationService
{
    Task<FeedbackSettingsDto> GetAsync();

    Task UpdateAsync(FeedbackSettingsDto input);
}
