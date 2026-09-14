using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 18e · Firmanın ön görüşme için önerdiği üç saat ve danışmanın cevabı. İlgi talebine bağlıdır ve talep gibi
/// firmanın kiracısında durur.
///
/// <para>Müsaitlik takvimi tutulmaz: firma saat önerir, danışman kendi takvimine bakıp birini onaylar ya da
/// notla başka saat ister. Başka saat istenen öneri tarihçe olarak kalır; firma yeni öneri açar.</para>
/// </summary>
public class GrantMeetingProposal : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid GrantInterestId { get; private set; }

    public Guid GrantCallId { get; private set; }

    public Guid? ProposedByUserId { get; private set; }

    public DateTime Slot1 { get; private set; }
    public DateTime Slot2 { get; private set; }
    public DateTime Slot3 { get; private set; }

    public GrantMeetingStatus Status { get; private set; }

    /// <summary>Onaylanan saat; yalnız <see cref="GrantMeetingStatus.Onaylandi"/> durumunda dolu.</summary>
    public DateTime? ConfirmedSlot { get; private set; }

    /// <summary>Başka saat isteğinin gerekçesi. Firmaya birebir gösterilir.</summary>
    public string? HostNote { get; private set; }

    public Guid? AnsweredByUserId { get; private set; }

    public DateTime? AnsweredAt { get; private set; }

    public IReadOnlyList<DateTime> Slots => new[] { Slot1, Slot2, Slot3 };

    public bool IsOpen => Status is GrantMeetingStatus.Bekliyor or GrantMeetingStatus.Onaylandi;

    protected GrantMeetingProposal() { }

    public GrantMeetingProposal(
        Guid id,
        Guid? tenantId,
        Guid grantInterestId,
        Guid grantCallId,
        Guid? proposedByUserId,
        IReadOnlyList<DateTime> slots,
        DateTime now)
        : base(id)
    {
        EnsureValidSlots(slots, now);

        TenantId = tenantId;
        GrantInterestId = grantInterestId;
        GrantCallId = grantCallId;
        ProposedByUserId = proposedByUserId;
        var ordered = slots.OrderBy(s => s).ToList();
        Slot1 = ordered[0];
        Slot2 = ordered[1];
        Slot3 = ordered[2];
        Status = GrantMeetingStatus.Bekliyor;
    }

    /// <param name="slotIndex">0, 1 ya da 2 — <see cref="Slots"/> sırasıyla (erkenden geçe).</param>
    public void Confirm(int slotIndex, Guid? userId, DateTime now)
    {
        EnsurePending();
        if (slotIndex < 0 || slotIndex >= GrantMeetingConsts.SlotCount || Slots[slotIndex] <= now)
        {
            // Geçmişte kalan saat onaylanamaz: danışman geç baktıysa başka saat ister.
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingSlotsInvalid);
        }

        Status = GrantMeetingStatus.Onaylandi;
        ConfirmedSlot = Slots[slotIndex];
        AnsweredByUserId = userId;
        AnsweredAt = now;
    }

    public void RequestOtherTime(string note, Guid? userId, DateTime now)
    {
        EnsurePending();
        if (string.IsNullOrWhiteSpace(note))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingNoteRequired);
        }

        Status = GrantMeetingStatus.BaskaSaatIstendi;
        HostNote = Check.Length(note.Trim(), nameof(note), GrantMeetingConsts.MaxHostNoteLength);
        AnsweredByUserId = userId;
        AnsweredAt = now;
    }

    private void EnsurePending()
    {
        if (Status != GrantMeetingStatus.Bekliyor)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingNotPending);
        }
    }

    /// <summary>Tam üç, birbirinden farklı, gelecekte ve en çok <see cref="GrantMeetingConsts.MaxDaysAhead"/> gün sonraki saat.</summary>
    private static void EnsureValidSlots(IReadOnlyList<DateTime> slots, DateTime now)
    {
        var valid = slots is { Count: GrantMeetingConsts.SlotCount }
                    && slots.Distinct().Count() == GrantMeetingConsts.SlotCount
                    && slots.All(s => s > now && s <= now.AddDays(GrantMeetingConsts.MaxDaysAhead));
        if (!valid)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingSlotsInvalid);
        }
    }
}
