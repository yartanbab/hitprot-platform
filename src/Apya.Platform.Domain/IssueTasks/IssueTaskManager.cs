using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using Apya.Platform.Telemetry;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Timing;
using Volo.Abp.Users;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Geri bildirim ve hata sinyallerini göreve dönüştüren köprü. İş kuralları burada:
/// bir kaynak yalnızca BİR görev açar, görev HOST bağlamında ve ayarlarda seçilen
/// projede doğar, kaynağın teşhis metni göreve kopyalanır.
/// </summary>
public class IssueTaskManager : DomainService
{
    private readonly IRepository<IssueTaskLink, Guid> _linkRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly TaskManager _taskManager;
    private readonly ILocalEventBus _localEventBus;
    private readonly ICurrentUser _currentUser;
    private readonly IClock _clock;

    public IssueTaskManager(
        IRepository<IssueTaskLink, Guid> linkRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<Project, Guid> projectRepository,
        TaskManager taskManager,
        ILocalEventBus localEventBus,
        ICurrentUser currentUser,
        IClock clock)
    {
        _linkRepository = linkRepository;
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
        _taskManager = taskManager;
        _localEventBus = localEventBus;
        _currentUser = currentUser;
        _clock = clock;
    }

    /* ==================== SORGULAR ==================== */

    public async Task<IssueTaskLink?> FindLinkAsync(IssueSourceType sourceType, string sourceKey)
    {
        return await _linkRepository.FindAsync(x => x.SourceType == sourceType && x.SourceKey == sourceKey);
    }

    /// <summary>Panelde rozet göstermek için toplu okuma — satır başına sorgu açılmaz.</summary>
    public async Task<List<IssueTaskLink>> GetLinksAsync(IssueSourceType sourceType, IReadOnlyCollection<string> sourceKeys)
    {
        if (sourceKeys.Count == 0)
        {
            return new List<IssueTaskLink>();
        }

        var query = await _linkRepository.GetQueryableAsync();
        return await AsyncExecuter.ToListAsync(
            query.Where(x => x.SourceType == sourceType && sourceKeys.Contains(x.SourceKey)));
    }

    /// <summary>
    /// Bağlı görevlerin kullanıcıya gösterilen sıra numaraları. Liste ekranında rozet
    /// çizmek için — satır başına ayrı sorgu açılmaz.
    /// </summary>
    public async Task<Dictionary<Guid, int>> GetTaskNumbersAsync(IReadOnlyCollection<Guid> taskIds)
    {
        if (taskIds.Count == 0)
        {
            return new Dictionary<Guid, int>();
        }

        // Görevler host bağlamında yaşar; çağıran host panelidir.
        var query = await _taskRepository.GetQueryableAsync();
        var rows = await AsyncExecuter.ToListAsync(
            query.Where(t => taskIds.Contains(t.Id))
                 .Select(t => new { t.Id, t.Number }));

        return rows.ToDictionary(r => r.Id, r => r.Number);
    }

    public async Task<IssueTaskLink?> FindLinkByTaskAsync(Guid taskId)
    {
        return await _linkRepository.FindAsync(x => x.TaskId == taskId);
    }

    /// <summary>
    /// Görev silindiğinde bağı da siler. Bağ soft-delete DEĞİL: (SourceType, SourceKey)
    /// unique olduğundan silinmiş satır kalırsa kaynak bir daha göreve dönüştürülemezdi.
    /// </summary>
    public async Task RemoveLinksOfTaskAsync(Guid taskId)
    {
        await _linkRepository.DeleteAsync(x => x.TaskId == taskId, autoSave: true);
    }

    /// <summary>
    /// Sunucu hatasının tekilleştirme anahtarı. Audit log satırının kendi Id'si her
    /// oluşumda değişir; aynı arıza için tek görev açılsın diye (URL + exception türü)
    /// özeti kullanılır.
    /// </summary>
    public static string BuildServerErrorKey(string url, string? exceptionType)
    {
        var raw = (url ?? string.Empty).Trim().ToLowerInvariant() + "|" + (exceptionType ?? string.Empty).Trim();
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(hash)[..32].ToLowerInvariant();
    }

    /* ==================== GÖREVE DÖNÜŞTÜRME ==================== */

    public async Task<IssueTaskLink> CreateFromFeedbackAsync(Feedback feedback, string? tenantName, IssueTaskOptions options)
    {
        Check.NotNull(feedback, nameof(feedback));

        return await CreateCoreAsync(
            IssueSourceType.Feedback,
            feedback.Id,
            feedback.Id.ToString("N"),
            feedback.TenantId,
            feedback.FeedbackNumber,
            options.Title.IsNullOrWhiteSpace()
                ? Shorten($"{feedback.FeedbackNumber} · {feedback.Subject}")
                : options.Title!.Trim(),
            IssueTaskDescriptionBuilder.ForFeedback(feedback, tenantName, options.Note),
            options.Priority ?? MapPriority(feedback.Priority),
            options);
    }

    public async Task<IssueTaskLink> CreateFromClientErrorAsync(ClientError error, string? tenantName, IssueTaskOptions options)
    {
        Check.NotNull(error, nameof(error));

        return await CreateCoreAsync(
            IssueSourceType.ClientError,
            error.Id,
            error.Fingerprint,
            error.TenantId,
            Shorten(error.Message, 120),
            options.Title.IsNullOrWhiteSpace()
                ? Shorten($"[İstemci hatası] {error.Message}")
                : options.Title!.Trim(),
            IssueTaskDescriptionBuilder.ForClientError(error, tenantName, options.Note),
            options.Priority ?? PriorityFromOccurrence(error.OccurrenceCount),
            options);
    }

    public async Task<IssueTaskLink> CreateFromServerErrorAsync(ServerErrorSignal signal, IssueTaskOptions options)
    {
        Check.NotNull(signal, nameof(signal));

        return await CreateCoreAsync(
            IssueSourceType.ServerError,
            sourceId: null,
            BuildServerErrorKey(signal.Url, signal.ExceptionType),
            signal.TenantId,
            Shorten(signal.Url, 120),
            options.Title.IsNullOrWhiteSpace()
                ? Shorten($"[Sunucu hatası] {signal.HttpMethod} {signal.Url}")
                : options.Title!.Trim(),
            IssueTaskDescriptionBuilder.ForServerError(signal, options.Note),
            options.Priority ?? PriorityFromOccurrence(signal.OccurrenceCount),
            options);
    }

    private async Task<IssueTaskLink> CreateCoreAsync(
        IssueSourceType sourceType,
        Guid? sourceId,
        string sourceKey,
        Guid? sourceTenantId,
        string sourceLabel,
        string title,
        string description,
        TaskPriority priority,
        IssueTaskOptions options)
    {
        if (options.ProjectId == Guid.Empty)
        {
            throw new BusinessException(PlatformDomainErrorCodes.IssueTaskTargetProjectNotSet);
        }

        var existing = await FindLinkAsync(sourceType, sourceKey);
        if (existing is not null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.IssueTaskAlreadyLinked)
                .WithData("taskId", existing.TaskId);
        }

        // Görev HOST bağlamında açılır: panel host-only çalışır ve kaynağı çözen ekip
        // host tarafındadır. Sarmalanmazsa (ör. worker tenant bağlamında koşarsa) görev
        // yanlış tenant'a düşer ve host panelinde hiç görünmez.
        using (CurrentTenant.Change(null))
        {
            var project = await _projectRepository.FindAsync(options.ProjectId);
            if (project is null || project.TenantId is not null)
            {
                throw new BusinessException(PlatformDomainErrorCodes.IssueTaskTargetProjectNotFound)
                    .WithData("projectId", options.ProjectId);
            }

            var task = new TaskItem(
                GuidGenerator.Create(),
                title,
                projectId: options.ProjectId,
                description: description,
                startDate: _clock.Now,
                dueDate: options.DueDate,
                priority: priority,
                assigneeId: options.AssigneeId,
                isPrivate: false,
                tenantId: null,
                now: _clock.Now);

            // Kullanıcıya gösterilen kodun (GRV-N) kaynağı — host içinde artan sıra.
            task.AssignNumber(await _taskManager.GetNextNumberAsync());
            task.SetPlanningInfo(null, TaskTypeOf(sourceType), null);

            // autoSave: bağ satırı görevin Id'sine yazılacak.
            await _taskRepository.InsertAsync(task, autoSave: true);

            var link = new IssueTaskLink(
                GuidGenerator.Create(),
                sourceType,
                sourceId,
                sourceKey,
                sourceTenantId,
                sourceLabel,
                task.Id,
                options.IsAutomatic);

            await _linkRepository.InsertAsync(link, autoSave: true);

            if (options.AssigneeId.HasValue)
            {
                await _localEventBus.PublishAsync(new TaskAssignedEto
                {
                    TaskId         = task.Id,
                    TaskTitle      = task.Title,
                    AssigneeId     = options.AssigneeId.Value,
                    ModifierUserId = _currentUser.Id,
                    AssignerName   = options.IsAutomatic ? "Sistem" : (_currentUser.UserName ?? "Sistem")
                });
            }

            return link;
        }
    }

    /* ==================== yardımcılar ==================== */

    /// <summary>Görev tipi alanı panelde filtrelenebiliyor; kaynak türü oraya yazılır.</summary>
    private static string TaskTypeOf(IssueSourceType sourceType) => sourceType switch
    {
        IssueSourceType.Feedback    => "Geri bildirim",
        IssueSourceType.ClientError => "İstemci hatası",
        _                           => "Sunucu hatası"
    };

    private static TaskPriority MapPriority(FeedbackPriority priority) => priority switch
    {
        FeedbackPriority.Low      => TaskPriority.Low,
        FeedbackPriority.High     => TaskPriority.High,
        FeedbackPriority.Critical => TaskPriority.Critical,
        _                         => TaskPriority.Medium
    };

    /// <summary>Hatanın önceliği kaç kişiyi/kaç kez vurduğuyla ölçülür.</summary>
    private static TaskPriority PriorityFromOccurrence(int occurrenceCount) => occurrenceCount switch
    {
        >= 100 => TaskPriority.Critical,
        >= 25  => TaskPriority.High,
        _      => TaskPriority.Medium
    };

    private static string Shorten(string text, int limit = 200)
    {
        text = (text ?? string.Empty).Trim();
        return text.Length <= limit ? text : text[..(limit - 1)] + "…";
    }
}
