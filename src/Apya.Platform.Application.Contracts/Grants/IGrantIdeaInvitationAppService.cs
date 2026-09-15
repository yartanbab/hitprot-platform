using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 19b · Host "Fikir daveti gönder": firmaları proje fikrini paylaşmaya çağırır. Bildirim şablonu altyapısıyla
/// (tetikleyici <c>IdeaInvited</c>) gider; yanıtlamayana bir kez hatırlatılır.
///
/// <para>🔴 HOST-ONLY.</para>
/// </summary>
public interface IGrantIdeaInvitationAppService : IApplicationService
{
    Task<GrantIdeaInvitationOptionsDto> GetOptionsAsync();

    /// <summary>Seçime uyan firma sayısı — "N firmaya gönder" düğmesi.</summary>
    Task<int> CountRecipientsAsync(GrantIdeaInvitationAudienceInput input);

    Task<GrantIdeaInvitationPreviewDto> PreviewAsync(PreviewGrantIdeaInvitationInput input);

    Task<GrantIdeaInvitationSendResultDto> SendAsync(SendGrantIdeaInvitationInput input);

    /// <summary>En son gönderilen davetin sonucu; hiç davet yoksa null.</summary>
    Task<GrantIdeaInvitationSummaryDto?> GetLatestAsync();
}
