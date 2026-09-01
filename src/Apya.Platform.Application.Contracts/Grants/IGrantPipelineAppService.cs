using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>
/// 2c · Host başvuru pipeline konsolu. Yalnız host bağlamında çalışır: pano
/// kiracılar arası bakar, kiracının kendi başvurusu 6a'da (Başvurularım).
/// </summary>
public interface IGrantPipelineAppService : IApplicationService
{
    /// <param name="grantCallId">null = tüm açık çağrılar; sütunlar ancak tek çağrı
    /// seçildiğinde o çağrının şablonundan gelir.</param>
    /// <param name="assignedUserId">Danışman süzgeci; null = tümü.</param>
    Task<GrantPipelineBoardDto> GetBoardAsync(Guid? grantCallId, Guid? assignedUserId);

    Task<GrantPipelineBoardDto> MoveAsync(MoveGrantApplicationInput input);
    Task<GrantPipelineBoardDto> AssignAsync(AssignGrantApplicationInput input);
}
