using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Feedbacks.Dtos;

public class GetFeedbackListInput : PagedAndSortedResultRequestDto
{
    public FeedbackType? Type { get; set; }
    public FeedbackStatus? Status { get; set; }
    public FeedbackPriority? Priority { get; set; }

    /// <summary>Host panelinde belirli bir firmayı süzmek için.</summary>
    public Guid? TenantId { get; set; }

    /// <summary>Konu ve gövdede geçen metin.</summary>
    public string? Filter { get; set; }

    public int? MinRating { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }

    /// <summary>Yalnızca henüz kullanıcıya cevap yazılmamış kayıtlar.</summary>
    public bool? OnlyUnanswered { get; set; }

    /// <summary>Belirli bir ekranın geri bildirimleri — ısı haritasından tıklanınca.</summary>
    public string? PageUrl { get; set; }
}
