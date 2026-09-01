using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 1c · Çağrı → Firma Eşleştirme ve Gönderim. Host'un bir çağrıyı hedefli firmalara
/// toplu göndermesi; yalnız host bağlamında çalışır.
/// </summary>
public interface IGrantHostDispatchAppService : IApplicationService
{
    /// <summary>Süzgeçten geçen adaylar + danışman listesi + fırsat sayacı. Hiçbir şey yazmaz.</summary>
    Task<GrantDispatchConsoleDto> PreviewAsync(PreviewHostRecommendationInput input);

    /// <summary>Seçili firmalara öneriyi gönderir. Aynı firmaya ikinci kez göndermez.</summary>
    Task<GrantDispatchResultDto> SendAsync(SendHostRecommendationInput input);
}
