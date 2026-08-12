using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>Kullanıcının görevi takip etmesi ("Takip ediliyor" rozeti) — kullanıcı-bazlı
/// (userId + taskId). TaskFavorite ile aynı desen: bare Entity&lt;Guid&gt;, IMultiTenant yok,
/// erişim EnsureTaskAccessAllowedAsync guard'ından. TaskItem'a bool kolon KONMAZ: takip
/// kişiye özeldir, göreve değil.</summary>
public class TaskWatcher : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }

    public TaskWatcher() { }

    public TaskWatcher(Guid id, Guid taskId, Guid userId) : base(id)
    {
        TaskId = taskId;
        UserId = userId;
    }
}
