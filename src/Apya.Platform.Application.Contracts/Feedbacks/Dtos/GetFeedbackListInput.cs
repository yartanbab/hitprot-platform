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

    public FeedbackImpact? Impact { get; set; }

    /// <summary>Belirli bir kişiye atanmışlar.</summary>
    public Guid? AssignedUserId { get; set; }

    /// <summary>true → hiç kimseye atanmamışlar (Assigned filtresiyle birlikte kullanılmaz).</summary>
    public bool? OnlyUnassigned { get; set; }

    /// <summary>Bağlamsal link'ten gelen modül kodu.</summary>
    public string? ModuleCode { get; set; }

    /// <summary>true → yalnızca eki olanlar.</summary>
    public bool? OnlyWithAttachment { get; set; }
}
