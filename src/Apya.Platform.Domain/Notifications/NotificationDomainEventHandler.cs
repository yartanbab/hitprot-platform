using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Apya.Platform.Localization;
using Apya.Platform.Tasks;
using Apya.Platform.Documents;

namespace Apya.Platform.Notifications;

public class NotificationDomainEventHandler :
    ILocalEventHandler<TaskAssignedEto>,
    ILocalEventHandler<TaskCommentAddedEto>,
    ILocalEventHandler<TaskStatusChangedEto>,
    ILocalEventHandler<TaskChangedEto>,
    ILocalEventHandler<TaskDueSoonEto>,
    ILocalEventHandler<TaskOverdueEto>,
    ILocalEventHandler<DocumentExpiringEto>,
    ILocalEventHandler<Apya.Platform.Projects.ProjectEndingSoonEto>,
    ILocalEventHandler<Apya.Platform.Projects.ProjectIndicatorBehindEto>,
    ILocalEventHandler<Apya.Platform.Documents.DocumentFileExpiryEto>,
    ITransientDependency
{
    private readonly NotificationManager _notificationManager;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IRepository<TaskWatcher, Guid> _watcherRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IDataFilter _dataFilter;
    private readonly IRepository<Apya.Platform.Projects.ProjectMember, Guid> _memberRepository;
    private readonly IRepository<Apya.Platform.Projects.Project, Guid> _projectRepository;
    private readonly NotificationTextComposer _texts;

    /// <summary>B-13 · Görev bu kadar gün gecikince proje sorumlularına yükseltilir.</summary>
    public const int OverdueEscalationDays = 3;

    public NotificationDomainEventHandler(
        NotificationManager notificationManager,
        IStringLocalizer<PlatformResource> l,
        IRepository<TaskWatcher, Guid> watcherRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IDataFilter dataFilter,
        IRepository<Apya.Platform.Projects.ProjectMember, Guid> memberRepository,
        IRepository<Apya.Platform.Projects.Project, Guid> projectRepository,
        NotificationTextComposer texts)
    {
        _texts = texts;
        _memberRepository = memberRepository;
        _projectRepository = projectRepository;
        _notificationManager = notificationManager;
        _l = l;
        _watcherRepository = watcherRepository;
        _taskRepository = taskRepository;
        _dataFilter = dataFilter;
    }

    /// <summary>
    /// P-09 · Görevin izleyicileri ("İzle" düğmesi ve atama değişince eski sorumlu): yorum, durum
    /// ve vade bildirimleri onlara da gider. Atanan, açan ve olayı yapan zaten ayrıca ele alındığı
    /// için dışarıda bırakılır. Gizli görevde izleyici listesi kullanılmaz: görme hakkı sahiplikten
    /// gelir (TaskPrivacyQueryFilter) ve sahiplere bildirim zaten gidiyor.
    /// Görev kimlikle okunur; vade işçisi kiracı süzgeci kapalı yayınladığı için süzgeç burada da kapalı.
    /// </summary>
    private async Task<List<Guid>> WatchersAsync(Guid taskId, params Guid?[] exclude)
    {
        TaskItem? task;
        using (_dataFilter.Disable<Volo.Abp.MultiTenancy.IMultiTenant>())
        {
            task = await _taskRepository.FindAsync(taskId, includeDetails: false);
        }

        if (task == null || task.IsPrivate)
        {
            return new List<Guid>();
        }

        return (await _watcherRepository.GetListAsync(w => w.TaskId == taskId))
            .Select(w => w.UserId)
            .Where(id => id != Guid.Empty && !exclude.Contains(id))
            .Distinct()
            .ToList();
    }

    /// <summary>
    /// Faz 4 · Metin host şablonundan gelir (yoksa bugünkü metin). Kapalı türde <c>null</c>: bildirim yayınlanmaz.
    /// </summary>
    private Task<(string Title, string Body)?> TextAsync(
        NotificationType type, string variant, params (string Token, object? Value)[] values)
        => _texts.ComposeAsync(type, variant, values.ToDictionary(v => v.Token, v => v.Value?.ToString()));

    private Task<(string Title, string Body)?> TextAsync(NotificationType type, params (string Token, object? Value)[] values)
        => TextAsync(type, NotificationTemplateDefinitions.Default, values);

    public async Task HandleEventAsync(TaskAssignedEto eventData)
    {
        // Eğer atanan kişi kendisi atadıysa bildirim gönderme
        if (eventData.AssigneeId == eventData.ModifierUserId) return;

        if (await TextAsync(NotificationType.TaskAssigned, ("{görev_adı}", eventData.TaskTitle)) is not { } text) return;

        await _notificationManager.PublishAsync(
            eventData.AssigneeId,
            text.Title,
            text.Body,
            NotificationType.TaskAssigned,
            entityType: "Task",
            entityId: eventData.TaskId
        );
    }

    // --- Yorum Yapıldığında ---
    public async Task HandleEventAsync(TaskCommentAddedEto eventData)
    {
        // Alıcıları (Yorumu yapan hariç) bul ve veritabanına kaydet. Kapalı türün alıcıları atlanır; diğer
        // türlerin elemesi (bahsedilen genel bildirimi almaz) yine geçerlidir.
        var commenter = ("{yorumlayan}", (object?)eventData.CommenterName);
        var taskTitle = ("{görev_adı}", (object?)eventData.TaskTitle);
        var comment = ("{yorum}", (object?)eventData.CommentText);
        var general = await TextAsync(NotificationType.TaskCommentAdded, commenter, comment);
        var mention = await TextAsync(NotificationType.Mention, commenter, taskTitle, comment);
        var reply = await TextAsync(NotificationType.CommentReplied, commenter, taskTitle, comment);

        // Dış paylaşım linkinden gelen yorumun kullanıcı kimliği YOKTUR (Guid.Empty).
        // Olduğu gibi geçirilirse bildirim var olmayan bir kullanıcıya işaret eder ve
        // avatar çözümlemesi boşa düşer; aktör alanı o durumda null bırakılır — ad zaten
        // CommenterName'den gelir.
        Guid? actorUserId = eventData.CommentUserId == Guid.Empty ? null : eventData.CommentUserId;

        // P-09 · Bahsedilenler "Sizden bahsedildi" alır; aynı yorum için ayrıca genel yorum
        // bildirimi almazlar (atanan, açan ya da izleyici olsalar bile tek bildirim).
        var mentioned = eventData.MentionedUserIds
            .Where(id => id != Guid.Empty && id != eventData.CommentUserId)
            .Distinct()
            .ToList();
        foreach (var userId in mention == null ? [] : mentioned)
        {
            await _notificationManager.PublishAsync(
                userId,
                mention!.Value.Title,
                mention.Value.Body,
                NotificationType.Mention,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: actorUserId,
                actorName: eventData.CommenterName
            );
        }

        // N-03 · Yanıt verilen yorumun yazarı "Yorumunuza yanıt" alır; bahsedildiyse yalnız bahsetmeyi.
        if (eventData.ReplyToUserId is { } repliedTo && repliedTo != Guid.Empty
            && repliedTo != eventData.CommentUserId && !mentioned.Contains(repliedTo))
        {
            if (reply is { } replyText)
            {
                await _notificationManager.PublishAsync(
                    repliedTo,
                    replyText.Title,
                    replyText.Body,
                    NotificationType.CommentReplied,
                    entityType: "Task",
                    entityId: eventData.TaskId,
                    actorUserId: actorUserId,
                    actorName: eventData.CommenterName
                );
            }
            mentioned.Add(repliedTo); // aynı yorum için ikinci (genel) bildirim gitmesin
        }

        if (general is not { } generalText)
        {
            return;
        }

        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.CommentUserId
            && !mentioned.Contains(eventData.AssigneeId.Value))
        {
            await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                generalText.Title,
                generalText.Body,
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: actorUserId,
                actorName: eventData.CommenterName
            );
        }

        if (eventData.CreatorId.HasValue && eventData.CreatorId != eventData.CommentUserId && eventData.CreatorId != eventData.AssigneeId
            && !mentioned.Contains(eventData.CreatorId.Value))
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                generalText.Title,
                generalText.Body,
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: actorUserId,
                actorName: eventData.CommenterName
            );
        }

        foreach (var watcherId in (await WatchersAsync(eventData.TaskId, eventData.CommentUserId, eventData.AssigneeId, eventData.CreatorId))
                     .Where(id => !mentioned.Contains(id)))
        {
            await _notificationManager.PublishAsync(
                watcherId,
                generalText.Title,
                generalText.Body,
                NotificationType.TaskCommentAdded,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: actorUserId,
                actorName: eventData.CommenterName
            );
        }
    }

    // --- N-03 · Görevin tek muhatabına giden değişiklik (atama alındı, son tarih, öncelik) ---
    public async Task HandleEventAsync(TaskChangedEto eventData)
    {
        if (eventData.RecipientId == Guid.Empty || eventData.RecipientId == eventData.ModifierUserId)
        {
            return;
        }

        var changedBy = ("{değiştiren}", (object?)eventData.ChangedByName);
        var taskTitle = ("{görev_adı}", (object?)eventData.TaskTitle);
        (NotificationType Type, string Variant, string? NewDate) change = eventData.Kind switch
        {
            TaskChangeKind.Unassigned => (NotificationType.TaskUnassigned, NotificationTemplateDefinitions.Default, null),
            TaskChangeKind.DueDateChanged when eventData.NewDueDate.HasValue =>
                (NotificationType.TaskDueDateChanged, NotificationTemplateDefinitions.Default,
                    eventData.NewDueDate.Value.ToString("dd.MM.yyyy")),
            TaskChangeKind.DueDateChanged =>
                (NotificationType.TaskDueDateChanged, NotificationTemplateDefinitions.Removed, null),
            _ => (NotificationType.TaskPriorityRaised, NotificationTemplateDefinitions.Default, null)
        };
        var type = change.Type;

        if (await TextAsync(type, change.Variant, changedBy, taskTitle, ("{yeni_tarih}", change.NewDate)) is not { } text)
        {
            return;
        }

        await _notificationManager.PublishAsync(
            eventData.RecipientId, text.Title, text.Body, type,
            entityType: "Task",
            entityId: eventData.TaskId,
            actorUserId: eventData.ModifierUserId,
            actorName: eventData.ChangedByName);
    }

    // --- Durum Değiştiğinde ---
    public async Task HandleEventAsync(TaskStatusChangedEto eventData)
    {
        string statusText = eventData.NewStatus switch {
            Tasks.TaskStatus.Todo       => _l["Tasks:Status:Todo"],
            Tasks.TaskStatus.InProgress => _l["Tasks:Status:InProgress"],
            Tasks.TaskStatus.InReview   => _l["Tasks:Status:InReview"],
            Tasks.TaskStatus.Done       => _l["Tasks:Status:Done"],
            _                           => _l["Notification:TaskStatus:Generic"]
        };

        if (await TextAsync(NotificationType.TaskStatusChanged,
                ("{görev_adı}", eventData.TaskTitle), ("{değiştiren}", eventData.ChangedByName), ("{durum}", statusText))
            is not { } text)
        {
            return;
        }
        var (title, body) = text;

        // Atanan kişiye bildir (Değiştiren o değilse)
        if (eventData.AssigneeId.HasValue && eventData.AssigneeId != eventData.ModifierUserId)
        {
             await _notificationManager.PublishAsync(
                eventData.AssigneeId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.ModifierUserId,
                actorName: eventData.ChangedByName
            );
        }

        // Oluşturana bildir (Değiştiren o değilse ve atanan kişiyle aynı değilse [zaten atanan kişiye yukarıda gitti])
        if (eventData.CreatorId.HasValue && 
            eventData.CreatorId != eventData.ModifierUserId && 
            eventData.CreatorId != eventData.AssigneeId)
        {
            await _notificationManager.PublishAsync(
                eventData.CreatorId.Value,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.ModifierUserId,
                actorName: eventData.ChangedByName
            );
        }

        foreach (var watcherId in await WatchersAsync(eventData.TaskId, eventData.ModifierUserId, eventData.AssigneeId, eventData.CreatorId))
        {
            await _notificationManager.PublishAsync(
                watcherId,
                title,
                body,
                NotificationType.TaskStatusChanged,
                entityType: "Task",
                entityId: eventData.TaskId,
                actorUserId: eventData.ModifierUserId,
                actorName: eventData.ChangedByName
            );
        }
    }

    // --- Deadline Uyarıları (FEA-002) ---
    public async Task HandleEventAsync(TaskDueSoonEto eventData)
    {
        // 🔴 NTF-11: Eskiden YALNIZ atanana gidiyordu — atanmamış görev tamamen
        // sessizdi ve ETO'da zaten taşınan CreatorId hiç kullanılmıyordu.
        if (await TextAsync(NotificationType.TaskDueSoon, ("{görev_adı}", eventData.TaskTitle)) is not { } text)
        {
            return;
        }

        var dueSoonRecipients = Recipients(eventData.AssigneeId, eventData.CreatorId).ToList();
        dueSoonRecipients.AddRange(await WatchersAsync(eventData.TaskId, eventData.AssigneeId, eventData.CreatorId));
        foreach (var userId in dueSoonRecipients)
        {
            await _notificationManager.PublishAsync(
                userId,
                text.Title,
                text.Body,
                NotificationType.TaskDueSoon,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }
    }

    /// <summary>
    /// 🔴 NTF-03: Vadesi geçmiş görev. Tekillik anahtarı GÖREV + VADE'dir:
    /// worker her saat çalıştığı için <c>PublishAsync</c> kullanılsaydı aynı
    /// gecikme saatte bir yeniden bildirilirdi. Vade ertelenip yeniden geçilirse
    /// anahtar değişir ve ikinci uyarı üretilir — istenen davranış budur.
    /// </summary>
    public async Task HandleEventAsync(TaskOverdueEto eventData)
    {
        var onceKey = $"{(int)NotificationType.TaskOverdue}:Task:{eventData.TaskId}:{eventData.DueDate:yyyyMMdd}";
        var text = await TextAsync(NotificationType.TaskOverdue,
            ("{görev_adı}", eventData.TaskTitle), ("{gecikme_gün}", eventData.DaysOverdue));

        // 🔴 NTF-11: Atanan VE görevi açan. Yalnız atanana gönderilseydi atanmamış
        // görev tamamen sessiz kalırdı; diğer görev bildirimleri (yorum, atama, durum)
        // zaten sahibe de gidiyor.
        var overdueRecipients = Recipients(eventData.AssigneeId, eventData.CreatorId).ToList();
        overdueRecipients.AddRange(await WatchersAsync(eventData.TaskId, eventData.AssigneeId, eventData.CreatorId));
        // Kapalıysa gecikme bildirimi gitmez ama yükseltme kendi şablonuyla yine değerlendirilir.
        foreach (var userId in text == null ? [] : overdueRecipients)
        {
            await _notificationManager.PublishOnceAsync(
                userId, onceKey, text!.Value.Title, text.Value.Body,
                NotificationType.TaskOverdue,
                entityType: "Task",
                entityId: eventData.TaskId
            );
        }

        await EscalateOverdueAsync(eventData, overdueRecipients);
    }

    /// <summary>
    /// B-13 · Bildirim hiyerarşisi: <see cref="OverdueEscalationDays"/> gün geciken görev proje sorumlularına
    /// (Lead) görev + vade başına BİR KEZ yükseltilir. Sorumlu, açan ve izleyiciler gecikmeyi zaten alıyor;
    /// proje sorumlusu ancak panoya bakınca görüyordu. Gizli görev yükseltilmez (sorumlunun görme hakkı yok),
    /// zaten bildirim alan kişiye ikinci kez gitmez.
    /// </summary>
    private async Task EscalateOverdueAsync(TaskOverdueEto eventData, List<Guid> alreadyNotified)
    {
        if (eventData.DaysOverdue < OverdueEscalationDays)
        {
            return;
        }

        var task = await _taskRepository.FindAsync(eventData.TaskId);
        if (task?.ProjectId is not { } projectId || task.IsPrivate)
        {
            return;
        }

        var leads = (await _memberRepository.GetListAsync(m =>
                m.ProjectId == projectId && m.Role == Apya.Platform.Projects.ProjectMemberRole.Lead))
            .Select(m => m.UserId)
            .Where(id => !alreadyNotified.Contains(id))
            .Distinct()
            .ToList();
        if (leads.Count == 0)
        {
            return;
        }

        var project = await _projectRepository.FindAsync(projectId);
        var onceKey = $"{(int)NotificationType.TaskOverdueEscalated}:Task:{eventData.TaskId}:{eventData.DueDate:yyyyMMdd}";
        if (await TextAsync(NotificationType.TaskOverdueEscalated,
                ("{proje_adı}", project?.Name ?? "-"), ("{görev_adı}", eventData.TaskTitle), ("{gecikme_gün}", eventData.DaysOverdue))
            is not { } text)
        {
            return;
        }

        foreach (var userId in leads)
        {
            await _notificationManager.PublishOnceAsync(
                userId, onceKey, text.Title, text.Body,
                NotificationType.TaskOverdueEscalated,
                entityType: "Task",
                entityId: eventData.TaskId);
        }
    }

    /// <summary>
    /// Görev bildirimlerinin ortak alıcı kümesi: atanan + görevi açan. Boş kimlikler
    /// (Guid.Empty) ve aynı kişinin iki rolde olması elenir — aksi halde tek kullanıcı
    /// aynı olayı iki kez alırdı.
    /// </summary>
    private static IEnumerable<Guid> Recipients(params Guid[] candidates)
        => candidates.Where(id => id != Guid.Empty).Distinct();

    /// <summary>
    /// 🔴 NTF-05: Proje bitişi yaklaşıyor. Tekillik anahtarı PROJE + BİTİŞ TARİHİ + EŞİK:
    /// worker saatte bir koştuğu hâlde her eşik (30 / 14 / 3 gün) bir kez bildirilir;
    /// bitiş tarihi ertelenirse eşikler yeni tarih için yeniden çalışır.
    /// </summary>
    public async Task HandleEventAsync(Apya.Platform.Projects.ProjectEndingSoonEto eventData)
    {
        var onceKey =
            $"{(int)NotificationType.ProjectEndingSoon}:Project:{eventData.ProjectId}:{eventData.EndDate:yyyyMMdd}:{eventData.Threshold}";

        // Açık görev yoksa "0 açık görev" demek yerine ayrı cümle: hazır olan proje için
        // sayı bir uyarı gibi okunmamalı. Hâl (bugün / N gün, açık görev var / yok) kodda; metin host'ta.
        var variant = (eventData.DaysRemaining == 0, eventData.OpenTaskCount > 0) switch
        {
            (true, true) => NotificationTemplateDefinitions.Today,
            (true, false) => NotificationTemplateDefinitions.TodayNoOpenTasks,
            (false, true) => NotificationTemplateDefinitions.Default,
            _ => NotificationTemplateDefinitions.NoOpenTasks
        };

        if (await TextAsync(NotificationType.ProjectEndingSoon, variant,
                ("{kalan_gün}", eventData.DaysRemaining), ("{proje_adı}", eventData.ProjectName),
                ("{bitiş_tarihi}", eventData.EndDate.ToString("dd.MM.yyyy")), ("{açık_görev_sayısı}", eventData.OpenTaskCount))
            is not { } text)
        {
            return;
        }
        var (title, body) = text;

        // Son eşikte önem yükselir: kapanışa üç gün kala bu artık bir hatırlatma değil, uyarı.
        var severity = eventData.Threshold <= 3 ? NotificationSeverity.High : (NotificationSeverity?)null;

        foreach (var userId in Recipients(eventData.RecipientIds.ToArray()))
        {
            await _notificationManager.PublishOnceAsync(
                userId, onceKey, title, body,
                NotificationType.ProjectEndingSoon,
                entityType: "Project",
                entityId: eventData.ProjectId,
                severity: severity
            );
        }
    }

    /// <summary>
    /// PRJ-08: Gösterge geride. Tekillik anahtarı GÖSTERGE + HEDEF TARİHİ: worker saatte bir
    /// koştuğu hâlde bir kez bildirilir; hedef tarihi ertelenip yeniden kaçırılırsa yeniden
    /// bildirilir. Bağlantı projeye iner (bildirim kaydının varlığı PROJE'dir).
    /// </summary>
    public async Task HandleEventAsync(Apya.Platform.Projects.ProjectIndicatorBehindEto eventData)
    {
        var onceKey =
            $"{(int)NotificationType.ProjectIndicatorBehind}:ProjectIndicator:{eventData.IndicatorId}:{eventData.TargetDate:yyyyMMdd}";

        string Value(decimal v) => v.ToString("0.##") + (string.IsNullOrEmpty(eventData.Unit) ? "" : " " + eventData.Unit);

        if (await TextAsync(NotificationType.ProjectIndicatorBehind,
                ("{proje_adı}", eventData.ProjectName), ("{gösterge}", eventData.IndicatorName),
                ("{hedef_tarih}", eventData.TargetDate.ToString("dd.MM.yyyy")),
                ("{gerçekleşen}", Value(eventData.CurrentValue)), ("{hedef}", Value(eventData.TargetValue)),
                ("{ilerleme}", eventData.ProgressPercent))
            is not { } text)
        {
            return;
        }
        var (title, body) = text;

        foreach (var userId in Recipients(eventData.RecipientIds.ToArray()))
        {
            await _notificationManager.PublishOnceAsync(
                userId, onceKey, title, body,
                NotificationType.ProjectIndicatorBehind,
                entityType: "Project",
                entityId: eventData.ProjectId
            );
        }
    }

    /// <summary>
    /// 🔴 DOC-05 / NTF-07: Belgenin geçerliliği yaklaşıyor ya da doldu. Tekillik anahtarı
    /// BELGE + TARİH + EŞİK: worker saatte bir koştuğu hâlde her eşik (30 gün / 7 gün / doldu)
    /// bir kez bildirilir; tarih uzatılırsa eşikler yeni tarih için yeniden çalışır.
    /// </summary>
    public async Task HandleEventAsync(Apya.Platform.Documents.DocumentFileExpiryEto eventData)
    {
        var onceKey =
            $"{(int)NotificationType.DocumentFileExpiry}:DocumentFile:{eventData.DocumentFileId}:{eventData.ExpiryDate:yyyyMMdd}:{eventData.Threshold}";

        var title = eventData.DaysRemaining < 0
            ? _l["Notification:DocumentFileExpiry:TitleExpired"]
            : eventData.DaysRemaining == 0
                ? _l["Notification:DocumentFileExpiry:TitleToday"]
                : _l["Notification:DocumentFileExpiry:Title", eventData.DaysRemaining];

        var body = _l["Notification:DocumentFileExpiry:Body",
            eventData.DisplayName, eventData.ExpiryDate.ToString("dd.MM.yyyy")];

        // 30 gün bir hatırlatma; 7 gün ve "doldu" artık bir uyarı.
        var severity = eventData.Threshold <= 7 ? NotificationSeverity.High : (NotificationSeverity?)null;

        foreach (var userId in Recipients(eventData.RecipientIds.ToArray()))
        {
            await _notificationManager.PublishOnceAsync(
                userId, onceKey, title, body,
                NotificationType.DocumentFileExpiry,
                entityType: "Document",
                entityId: eventData.DocumentId,
                severity: severity
            );
        }
    }

    // --- Belge Son Tarih Uyarısı ---
    public async Task HandleEventAsync(DocumentExpiringEto eventData)
    {
        await _notificationManager.PublishAsync(
            eventData.CreatorId,
            _l["Notification:DocumentExpiring:Title"],
            _l["Notification:DocumentExpiring:Body", eventData.DocumentTitle],
            NotificationType.DocumentExpiring,
            entityType: "Document",
            entityId: eventData.DocumentId
        );
    }
}
