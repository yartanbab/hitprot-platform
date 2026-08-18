using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Documents;

/// <summary>
/// Harcama-belge eslestirme tezgahi.
///
/// Skor bir ONERIDIR: 100 puanlik aday bile kullanici onayi olmadan baglanmaz.
/// </summary>
public interface IDocumentMatchingAppService : IApplicationService
{
    /// <summary>Solda belgesiz harcamalar, sagda baglanmamis belgeler.</summary>
    Task<MatchingBoardDto> GetBoardAsync(Guid projectId);

    /// <summary>Bir harcama icin skorlanmis aday belgeler (esik alti gosterilmez).</summary>
    Task<List<MatchCandidateDto>> GetCandidatesAsync(Guid expenseId);

    Task<DocumentMatchDto> CreateMatchAsync(CreateMatchDto input);

    Task RemoveMatchAsync(Guid matchId);

    Task<List<DocumentMatchDto>> GetMatchesAsync(Guid projectId);
}
