using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Grants;

/// <summary>18e · Görüşme önerisinin açılış kuralları. Çağıran, talebin kiracısında olmalıdır.</summary>
public class GrantMeetingManager : DomainService
{
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepository;

    public GrantMeetingManager(IRepository<GrantMeetingProposal, Guid> proposalRepository)
    {
        _proposalRepository = proposalRepository;
    }

    /// <summary>
    /// Yalnız karara bağlanmamış talep için; bekleyen ya da onaylanmış öneri varken yenisi açılmaz (danışman
    /// başka saat istediyse firma yeniden önerebilir).
    /// </summary>
    public async Task<GrantMeetingProposal> ProposeAsync(GrantInterest interest, IReadOnlyList<DateTime> slots, Guid? userId)
    {
        if (!interest.IsPending)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingInterestClosed);
        }
        interest.EnsureLinked();

        var open = await _proposalRepository.FindAsync(p => p.GrantInterestId == interest.Id
            && (p.Status == GrantMeetingStatus.Bekliyor || p.Status == GrantMeetingStatus.Onaylandi));
        if (open != null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingAlreadyOpen);
        }

        return new GrantMeetingProposal(
            GuidGenerator.Create(), interest.TenantId, interest.Id, interest.GrantCallId!.Value, userId, slots, Clock.Now);
    }
}
