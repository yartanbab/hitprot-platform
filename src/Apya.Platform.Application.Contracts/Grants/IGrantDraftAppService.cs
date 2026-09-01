using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>
/// 3a · Elle Hibe Girme. Metni desen eşleştirerek alanlara böler ve host'un kabul
/// ettiklerinden TASLAK çağrı üretir.
/// </summary>
public interface IGrantDraftAppService : IApplicationService
{
    /// <summary>Metinden alan çıkarır. Hiçbir şey yazmaz.</summary>
    Task<GrantExtractionResultDto> ExtractAsync(ExtractGrantTextInput input);

    /// <summary>
    /// Kabul edilen alanlardan program + <see cref="GrantCallStatus.Taslak"/> çağrı üretir.
    /// Program adı ya da kurum boşsa <c>Platform:Grant:DraftIdentityRequired</c> ile reddeder.
    /// </summary>
    Task<GrantDraftCreatedDto> CreateDraftAsync(CreateGrantDraftInput input);
}
