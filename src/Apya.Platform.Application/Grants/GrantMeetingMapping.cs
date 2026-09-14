using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Grants;

/// <summary>18e · Görüşme önerisinin DTO'su ve bildirimdeki saat metni; firma ve host tarafı aynı biçimi kullanır.</summary>
internal static class GrantMeetingMapping
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    public static GrantMeetingDto ToDto(GrantMeetingProposal proposal) => new()
    {
        Id = proposal.Id,
        Status = proposal.Status,
        Slots = proposal.Slots.ToList(),
        ConfirmedSlot = proposal.ConfirmedSlot,
        HostNote = proposal.HostNote,
        CreationTime = proposal.CreationTime,
        AnsweredAt = proposal.AnsweredAt
    };

    /// <summary>"16 Eylül 2026 Çarşamba 10:00" — bildirim gövdesi için.</summary>
    public static string SlotText(System.DateTime slot) => slot.ToString("d MMMM yyyy dddd HH:mm", Turkish);

    public static string SlotsText(IEnumerable<System.DateTime> slots) => string.Join(" · ", slots.Select(SlotText));
}
