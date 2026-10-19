using System;
using System.Collections.Generic;

namespace Apya.Platform.Tasks;

/// <summary>Bir göreve yorum eklendiğinde yayınlanan yerel etkinlik.</summary>
public class TaskCommentAddedEto
{
    public Guid   TaskId        { get; set; }
    public string TaskTitle     { get; set; } = string.Empty;

    /// <summary>Görevi atanan kişi (bildirim alır)</summary>
    public Guid?  AssigneeId    { get; set; }

    /// <summary>Görevi oluşturan kişi (bildirim alır)</summary>
    public Guid?  CreatorId     { get; set; }

    /// <summary>Yorumu yazan kişi (o kişiye bildirim gitmez)</summary>
    public Guid   CommentUserId { get; set; }

    public string CommenterName { get; set; } = string.Empty;
    public string CommentText   { get; set; } = string.Empty;

    /// <summary>N-03 · Yanıt verilen yorumun yazarı — "Yorumunuza yanıt" alır (kök yorumda null).</summary>
    public Guid? ReplyToUserId { get; set; }

    /// <summary>P-09 · Bahsedilen kişiler — "Sizden bahsedildi" alır, ayrıca genel yorum bildirimi almaz.</summary>
    public List<Guid> MentionedUserIds { get; set; } = new();
}
