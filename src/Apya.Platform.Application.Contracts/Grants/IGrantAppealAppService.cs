using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 6b · Red &amp; İtiraz. Firma okur ve itirazı gönderir; kararı ve madde
/// görüşlerini danışman yazar.
/// </summary>
public interface IGrantAppealAppService : IApplicationService
{
    Task<GrantAppealConsoleDto> GetAsync(Guid applicationId);

    Task<GrantAppealConsoleDto> SaveDecisionAsync(SaveGrantDecisionInput input);
    Task<GrantAppealConsoleDto> AddItemAsync(AddGrantAppealItemInput input);
    Task<GrantAppealConsoleDto> SaveOpinionAsync(SaveGrantAppealOpinionInput input);

    /// <summary>İtiraz dosyasını gönderir; itiraza konu en az bir madde şart.</summary>
    Task<GrantAppealConsoleDto> SubmitAppealAsync(Guid applicationId);

    /// <summary>Kurumun itiraza verdiği yanıt — istatistikleri bu besler.</summary>
    Task<GrantAppealConsoleDto> ResolveAppealAsync(Guid applicationId, bool accepted);
}
