using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>Kullanıcı ★ görev favorisi — kullanıcı-bazlı (userId + taskId). TaskTagAssignment ile
/// aynı desen: bare Entity&lt;Guid&gt;, IMultiTenant yok, erişim EnsureTaskAccessAllowedAsync guard'ından.</summary>
public class TaskFavorite : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }

    public TaskFavorite() { }

    public TaskFavorite(Guid id, Guid taskId, Guid userId) : base(id)
    {
        TaskId = taskId;
        UserId = userId;
    }
}
