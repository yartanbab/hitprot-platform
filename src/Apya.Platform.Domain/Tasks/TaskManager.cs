using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Tasks;

/// <summary>Görev sırası (kod) ataması ve projeler arası taşıma/kopyalama iş kuralı.
/// AppService yalnız yetki + DTO çevirisi yapar; kural burada.</summary>
public class TaskManager : DomainService
{
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskChecklistItem, Guid> _checklistRepository;
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly IRepository<TaskDependency, Guid> _dependencyRepository;
    private readonly IRepository<TaskTagAssignment, Guid> _tagAssignmentRepository;

    public TaskManager(
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskChecklistItem, Guid> checklistRepository,
        IRepository<TaskComment, Guid> commentRepository,
        IRepository<TaskAttachment, Guid> attachmentRepository,
        IRepository<TaskDependency, Guid> dependencyRepository,
        IRepository<TaskTagAssignment, Guid> tagAssignmentRepository)
    {
        _taskRepository = taskRepository;
        _checklistRepository = checklistRepository;
        _commentRepository = commentRepository;
        _attachmentRepository = attachmentRepository;
        _dependencyRepository = dependencyRepository;
        _tagAssignmentRepository = tagAssignmentRepository;
    }

    /// <summary>Tenant içindeki bir sonraki görev sırası. DB sequence kullanılmaz —
    /// çift provider'da (Postgres/MSSQL) sequence taşınması güvenilir değil.</summary>
    public async Task<int> GetNextNumberAsync()
    {
        var q = await _taskRepository.GetQueryableAsync(); // IMultiTenant → tenant'a göre filtreli
        var max = await AsyncExecuter.MaxAsync(q.Select(t => (int?)t.Number), x => x) ?? 0;
        return max + 1;
    }

    /// <summary>Görevi hedef projelere taşır/kopyalar.
    /// <para>Move: <paramref name="targetProjectIds"/> listesinin İLKİ hedeftir (görev oraya
    /// taşınır); kalan hedeflere kopya çıkarılır. Copy: kaynak yerinde kalır, her hedefte
    /// bir kopya oluşur.</para>
    /// Dönen liste oluşturulan KOPYALARIN id'leridir (taşınan görev dahil değildir).</summary>
    public async Task<List<Guid>> TransferAsync(
        TaskItem source,
        IReadOnlyList<Guid> targetProjectIds,
        TaskTransferMode mode,
        TaskTransferOptions options,
        DateTime now)
    {
        Check.NotNull(source, nameof(source));
        Check.NotNull(options, nameof(options));

        var targets = (targetProjectIds ?? Array.Empty<Guid>()).Distinct().ToList();
        if (targets.Count == 0)
            throw new BusinessException(PlatformDomainErrorCodes.TaskTransferNoTarget);

        if (mode == TaskTransferMode.Move && targets.Count == 1 && source.ProjectId == targets[0])
            throw new BusinessException(PlatformDomainErrorCodes.TaskTransferSameProject);

        var createdIds = new List<Guid>();
        var copyTargets = targets;

        if (mode == TaskTransferMode.Move)
        {
            source.MoveToProject(targets[0]);
            await _taskRepository.UpdateAsync(source);
            copyTargets = targets.Skip(1).ToList(); // kalanlar kopya
        }

        foreach (var projectId in copyTargets)
        {
            var clone = await CloneAsync(source, projectId, options, now);
            createdIds.Add(clone.Id);
        }

        return createdIds;
    }

    /// <summary>Kaynağın seçilen içerikleriyle birlikte tek bir hedef projede kopyasını üretir.</summary>
    private async Task<TaskItem> CloneAsync(
        TaskItem source,
        Guid targetProjectId,
        TaskTransferOptions options,
        DateTime now)
    {
        // Tarihleri bugüne kaydır: aradaki gün farkı korunarak başlangıç bugüne çekilir.
        var shift = options.ShiftDates ? (now.Date - source.StartDate.Date) : TimeSpan.Zero;

        var clone = new TaskItem(
            GuidGenerator.Create(),
            source.Title,
            projectId: targetProjectId,
            parentTaskId: null, // kopya her zaman kök görevdir
            description: source.Description,
            startDate: source.StartDate.Add(shift),
            dueDate: source.DueDate?.Add(shift),
            priority: source.Priority,
            assigneeId: options.KeepAssignee ? source.AssigneeId : null,
            isPrivate: source.IsPrivate,
            tenantId: source.TenantId,
            now: now);

        clone.AssignNumber(await GetNextNumberAsync());
        clone.SetPlanningInfo(source.EstimatedHours, source.TaskType, source.Sprint);
        await _taskRepository.InsertAsync(clone, autoSave: true); // sonraki GetNextNumberAsync doğru MAX'ı görsün

        if (options.Checklist)
        {
            var items = await _checklistRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var item in items)
            {
                // Id verilmez: ABP repository'si Guid'i kendisi üretir (AddChecklistItemAsync ile aynı desen).
                await _checklistRepository.InsertAsync(new TaskChecklistItem
                {
                    TaskId = clone.Id,
                    Text = item.Text,
                    IsDone = item.IsDone
                });
            }
        }

        if (options.Comments)
        {
            // Yalnız kök yorumlar kopyalanır: yanıt zinciri ParentCommentId ile kaynağın
            // id'lerine bağlı; kopyada karşılığı olmayan id'ye işaret etmesin diye düzleştirilir.
            var comments = await _commentRepository.GetListAsync(x => x.TaskId == source.Id && x.ParentCommentId == null);
            foreach (var c in comments)
            {
                await _commentRepository.InsertAsync(new TaskComment(clone.Id, c.Text));
            }
        }

        if (options.Files)
        {
            // Fiziksel dosya YENİDEN YAZILMAZ; kopya aynı StoredFileName'i işaret eder.
            var files = await _attachmentRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var f in files)
            {
                await _attachmentRepository.InsertAsync(new TaskAttachment
                {
                    TaskId = clone.Id,
                    FileName = f.FileName,
                    StoredFileName = f.StoredFileName,
                    ContentType = f.ContentType,
                    FileSize = f.FileSize
                });
            }
        }

        if (options.KeepLinks)
        {
            var deps = await _dependencyRepository.GetListAsync(x => x.TaskId == source.Id);
            foreach (var d in deps)
            {
                await _dependencyRepository.InsertAsync(
                    new TaskDependency(GuidGenerator.Create(), clone.Id, d.PredecessorTaskId));
            }
        }

        // Etiketler her zaman taşınır (tasarımda ayrı anahtarı yok).
        var tags = await _tagAssignmentRepository.GetListAsync(x => x.TaskId == source.Id);
        foreach (var t in tags)
        {
            await _tagAssignmentRepository.InsertAsync(
                new TaskTagAssignment(GuidGenerator.Create(), clone.Id, t.TagId));
        }

        if (options.Subtasks)
        {
            var subtasks = await _taskRepository.GetListAsync(x => x.ParentTaskId == source.Id);
            foreach (var sub in subtasks)
            {
                await CloneSubtaskAsync(sub, clone, targetProjectId, options, now, shift);
            }
        }

        return clone;
    }

    /// <summary>Alt görev kopyası — kendi kontrol listesini taşır, ama alt-alt görev
    /// zincirine inmez (görev modelinde tek seviye alt görev kullanılıyor).</summary>
    private async Task CloneSubtaskAsync(
        TaskItem sub,
        TaskItem parentClone,
        Guid targetProjectId,
        TaskTransferOptions options,
        DateTime now,
        TimeSpan shift)
    {
        var subClone = new TaskItem(
            GuidGenerator.Create(),
            sub.Title,
            projectId: targetProjectId,
            parentTaskId: parentClone.Id,
            description: sub.Description,
            startDate: sub.StartDate.Add(shift),
            dueDate: sub.DueDate?.Add(shift),
            priority: sub.Priority,
            assigneeId: options.KeepAssignee ? sub.AssigneeId : null,
            isPrivate: sub.IsPrivate,
            tenantId: sub.TenantId,
            now: now);

        subClone.AssignNumber(await GetNextNumberAsync());
        subClone.SetPlanningInfo(sub.EstimatedHours, sub.TaskType, sub.Sprint);
        await _taskRepository.InsertAsync(subClone, autoSave: true);

        if (!options.Checklist) return;

        var items = await _checklistRepository.GetListAsync(x => x.TaskId == sub.Id);
        foreach (var item in items)
        {
            await _checklistRepository.InsertAsync(new TaskChecklistItem
            {
                TaskId = subClone.Id,
                Text = item.Text,
                IsDone = item.IsDone
            });
        }
    }
}
