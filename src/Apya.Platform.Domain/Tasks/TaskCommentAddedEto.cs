using System;

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
}
