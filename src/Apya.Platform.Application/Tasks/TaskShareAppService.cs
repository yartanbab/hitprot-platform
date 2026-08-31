using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görevi ekip dışına açan süreli linkler.
///
/// 🔐 Token üretimi kriptografik rastgeledir ve sunucuda SAKLANMAZ; yalnız SHA-256 özeti
/// tutulur. Çözümleme gelen token'ı hash'leyip aramayla yapılır — veritabanı sızsa bile
/// linkler yeniden üretilemez. Emsal: <c>ExternalShareAppService</c> (Documents).
///
/// <para><b>Görünürlük sözleşmesi — tek kural:</b> <c>ShareLinkId</c> dolu olan içerik o dış
/// paylaşıma aittir. Misafir yalnız kendi linkinin yorumlarını görür; ekip içi yazışma
/// (<c>ShareLinkId == null</c>) dışarı ÇIKMAZ. Eklerde ikinci bir kapı daha var:
/// <c>IsVisibleToGuests</c> — ekibin bilinçli olarak dışa açtığı dosyalar. Kapsamdaki her ek
/// açılsaydı göreve iliştirilmiş iç dosyalar da sızardı.</para>
///
/// <para><b>Kapsam:</b> link kök göreve verilir, erişim kök + tüm alt görev ağacını kapsar.
/// Her anonim çağrıda hedef görevin bu ağaçta olduğu <see cref="EnsureTaskInScopeAsync"/> ile
/// yeniden doğrulanır — geçerli bir token, kimliğini bilen birine sistemdeki BAŞKA görevleri
/// açmamalıdır.</para>
/// </summary>
[Authorize(PlatformPermissions.Tasks.Default)]
public class TaskShareAppService : PlatformAppService, ITaskShareAppService
{
    private readonly IRepository<TaskShareLink, Guid> _linkRepository;
    private readonly IRepository<TaskShareAccessLog, Guid> _accessLogRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskComment, Guid> _commentRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly IRepository<IdentityUser, Guid> _identityRepository;
    private readonly ITaskAppService _taskAppService;
    private readonly ILocalEventBus _localEventBus;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public TaskShareAppService(
        IRepository<TaskShareLink, Guid> linkRepository,
        IRepository<TaskShareAccessLog, Guid> accessLogRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskComment, Guid> commentRepository,
        IRepository<TaskAttachment, Guid> attachmentRepository,
        IRepository<IdentityUser, Guid> identityRepository,
        ITaskAppService taskAppService,
        ILocalEventBus localEventBus,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _linkRepository = linkRepository;
        _accessLogRepository = accessLogRepository;
        _taskRepository = taskRepository;
        _commentRepository = commentRepository;
        _attachmentRepository = attachmentRepository;
        _identityRepository = identityRepository;
        _taskAppService = taskAppService;
        _localEventBus = localEventBus;
        _mtFilter = mtFilter;
    }

    /* ═════════════════════════ EKİP TARAFI ═════════════════════════ */

    public virtual async Task<List<TaskShareLinkDto>> GetListAsync(Guid taskId)
    {
        // Görevi görme hakkı (kiracı + APYA-22 gizlilik) TaskAppService.GetAsync'te doğrulanır;
        // kuralı burada kopyalamak iki yerde ayrışmaya davetiye olurdu.
        await _taskAppService.GetAsync(taskId);

        var links = (await _linkRepository.GetListAsync(l => l.TaskId == taskId))
            .OrderByDescending(l => l.CreationTime)
            .ToList();

        return links.Select(Map).ToList();
    }

    [Authorize(PlatformPermissions.Tasks.ShareExternally)]
    public virtual async Task<CreatedTaskShareLinkDto> CreateAsync(CreateTaskShareLinkDto input)
    {
        await _taskAppService.GetAsync(input.TaskId);

        if (input.LifetimeDays < 1 || input.LifetimeDays > TaskShareConsts.MaxLifetimeDays)
        {
            throw new BusinessException(PlatformDomainErrorCodes.TaskShareLifetimeInvalid)
                .WithData("Max", TaskShareConsts.MaxLifetimeDays);
        }

        var token = GenerateToken();

        var link = new TaskShareLink(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.TaskId,
            Hash(token),
            input.RecipientName,
            input.RecipientEmail,
            Clock.Now.AddDays(input.LifetimeDays),
            input.AllowComment,
            input.AllowUpload,
            input.AllowDownload);

        await _linkRepository.InsertAsync(link, autoSave: true);

        var dto = Map(link);
        return new CreatedTaskShareLinkDto
        {
            Id = dto.Id,
            TaskId = dto.TaskId,
            RecipientName = dto.RecipientName,
            RecipientEmail = dto.RecipientEmail,
            ExpiresAt = dto.ExpiresAt,
            AllowComment = dto.AllowComment,
            AllowUpload = dto.AllowUpload,
            AllowDownload = dto.AllowDownload,
            RevokedAt = dto.RevokedAt,
            AccessCount = dto.AccessCount,
            UploadCount = dto.UploadCount,
            CreationTime = dto.CreationTime,
            IsActive = dto.IsActive,
            // Token YALNIZ burada döner; sunucu onu bir daha üretemez.
            Url = "/Paylasim/" + token,
        };
    }

    [Authorize(PlatformPermissions.Tasks.ShareExternally)]
    public virtual async Task RevokeAsync(Guid id)
    {
        var link = await _linkRepository.GetAsync(id);
        link.Revoke(Clock.Now);
        await _linkRepository.UpdateAsync(link);
    }

    [Authorize(PlatformPermissions.Tasks.ShareExternally)]
    public virtual async Task SetAttachmentGuestVisibilityAsync(Guid attachmentId, bool isVisible)
    {
        var attachment = await _attachmentRepository.GetAsync(attachmentId);

        // TaskAttachment IMultiTenant DEĞİL → üzerinde tenant filtresi yok. Görev üzerinden
        // doğrulamak çapraz-tenant yazmayı kapatır (TaskAppService'teki aynı gerekçe).
        await _taskAppService.GetAsync(attachment.TaskId);

        // Misafirin kendi yüklediği dosyanın görünürlüğü ekip tarafından yönetilmez: o dosya
        // zaten sahibinindir ve ShareLinkId üzerinden görünür.
        if (attachment.ShareLinkId.HasValue)
        {
            return;
        }

        attachment.IsVisibleToGuests = isVisible;
        await _attachmentRepository.UpdateAsync(attachment, autoSave: true);
    }

    /* ═════════════════════════ MİSAFİR TARAFI ═════════════════════════ */

    /// <summary>
    /// Anonim misafir görünümü. Kiracı bağlamı olmadığı için çok-kiracılı filtre kapatılarak
    /// aranır — token'ın kendisi yetki taşır.
    /// </summary>
    [AllowAnonymous]
    public virtual async Task<GuestTaskViewDto> ResolveAsync(string token, GuestRequestContextDto context)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolveLinkAsync(token);

            var scope = await LoadScopeAsync(link.TaskId, link.TenantId);
            var view = await BuildGuestViewAsync(link, scope);

            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);
            await LogAsync(link, TaskShareAction.View, link.TaskId, context);

            return view;
        }
    }

    [AllowAnonymous]
    public virtual async Task<Guid> AddGuestCommentAsync(
        string token, Guid taskId, string text, GuestRequestContextDto context)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            throw new BusinessException("Platform:Task:CommentRequired");
        }

        using (_mtFilter.Disable())
        {
            var link = await ResolveLinkAsync(token);
            link.EnsureCommentAllowed();
            var task = await EnsureTaskInScopeAsync(link, taskId);

            var comment = await _commentRepository.InsertAsync(
                new TaskComment(taskId, text.Trim()) { ShareLinkId = link.Id }, autoSave: true);

            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);
            await LogAsync(link, TaskShareAction.Comment, taskId, context);

            // Ekip haberdar olsun. CommentUserId boş kalır — misafirin kullanıcı kaydı YOK;
            // bildirim aktörü NotificationDomainEventHandler'da bu değere bakıp null'a düşer.
            await _localEventBus.PublishAsync(new TaskCommentAddedEto
            {
                TaskId = taskId,
                TaskTitle = task.Title,
                AssigneeId = task.AssigneeId,
                CreatorId = task.CreatorId,
                CommentUserId = Guid.Empty,
                CommenterName = link.RecipientName,
                CommentText = text
            });

            return comment.Id;
        }
    }

    [AllowAnonymous]
    public virtual async Task EnsureGuestUploadAllowedAsync(string token, Guid taskId)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolveLinkAsync(token);
            link.EnsureUploadAllowed();
            await EnsureTaskInScopeAsync(link, taskId);
        }
    }

    [AllowAnonymous]
    public virtual async Task RegisterGuestUploadAsync(
        string token, Guid taskId, string fileName, string storedFileName, long fileSize,
        GuestRequestContextDto context)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolveLinkAsync(token);
            link.EnsureUploadAllowed();
            await EnsureTaskInScopeAsync(link, taskId);

            await _attachmentRepository.InsertAsync(new TaskAttachment
            {
                TaskId = taskId,
                FileName = fileName,
                StoredFileName = storedFileName,
                FileSize = fileSize,
                ContentType = "application/octet-stream",
                ShareLinkId = link.Id
            }, autoSave: true);

            link.RegisterUpload();
            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);
            await LogAsync(link, TaskShareAction.Upload, taskId, context);
        }
    }

    /// <summary>
    /// Anonim indirme.
    ///
    /// 🔐 Token bir GÖREV AĞACINI açar, sistemdeki her eki değil. İki şart birlikte aranır:
    /// ek kapsamdaki bir göreve ait olmalı VE misafire görünür olmalı (kendi yüklediği ya da
    /// ekibin dışa açtığı). Bu doğrulama olmadan geçerli bir token, kimliğini bilen herkese
    /// tüm ekleri indirtirdi.
    /// </summary>
    [AllowAnonymous]
    public virtual async Task<GuestDownloadDto> PrepareGuestDownloadAsync(
        string token, Guid attachmentId, GuestRequestContextDto context)
    {
        using (_mtFilter.Disable())
        {
            var link = await ResolveLinkAsync(token);
            link.EnsureDownloadAllowed();

            var attachment = await _attachmentRepository.FindAsync(attachmentId);

            if (attachment == null || !IsVisibleToGuest(attachment, link))
            {
                throw new EntityNotFoundException(typeof(TaskAttachment), attachmentId);
            }

            await EnsureTaskInScopeAsync(link, attachment.TaskId);

            link.RegisterAccess();
            await _linkRepository.UpdateAsync(link);
            await LogAsync(link, TaskShareAction.Download, attachment.TaskId, context);

            return new GuestDownloadDto
            {
                StoredFileName = attachment.StoredFileName,
                FileName = attachment.FileName,
                ContentType = attachment.ContentType,
            };
        }
    }

    /* ═════════════════════════ YARDIMCILAR ═════════════════════════ */

    /// <summary>
    /// Token'ı çözüp kullanılabilirliğini doğrular. ÇAĞIRAN, çok-kiracılı filtreyi kapatmış
    /// olmalıdır — anonim istekte kiracı bağlamı yoktur.
    /// </summary>
    private async Task<TaskShareLink> ResolveLinkAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new EntityNotFoundException(typeof(TaskShareLink), token ?? string.Empty);
        }

        var tokenHash = Hash(token);

        var queryable = await _linkRepository.GetQueryableAsync();
        var link = await AsyncExecuter.FirstOrDefaultAsync(queryable.Where(l => l.TokenHash == tokenHash));

        if (link == null)
        {
            throw new EntityNotFoundException(typeof(TaskShareLink), tokenHash);
        }

        link.EnsureUsable(Clock.Now);

        return link;
    }

    /// <summary>
    /// Hedef görevin linkin kapsamında (kök görev ya da onun altında) olduğunu doğrular.
    ///
    /// <para>Üst-görev zinciri yukarı yürünür; <see cref="TaskShareConsts.MaxScopeDepth"/>
    /// adımdan sonra durulur. Tavan hem derin ağaçları hem de veri bozulmasıyla oluşmuş bir
    /// döngüyü (A→B→A) sonsuz döngüye çevirmeden keser.</para>
    /// </summary>
    private async Task<TaskItem> EnsureTaskInScopeAsync(TaskShareLink link, Guid taskId)
    {
        var task = await _taskRepository.FindAsync(taskId);

        if (task == null || task.TenantId != link.TenantId)
        {
            throw new EntityNotFoundException(typeof(TaskItem), taskId);
        }

        var current = task;
        for (var depth = 0; depth < TaskShareConsts.MaxScopeDepth; depth++)
        {
            if (current.Id == link.TaskId)
            {
                return task;
            }

            if (!current.ParentTaskId.HasValue)
            {
                break;
            }

            var parent = await _taskRepository.FindAsync(current.ParentTaskId.Value);
            if (parent == null)
            {
                break;
            }

            current = parent;
        }

        throw new EntityNotFoundException(typeof(TaskItem), taskId);
    }

    /// <summary>
    /// Kök görev + alt görev ağacı, seviye seviye çekilip bellekte kurulur.
    ///
    /// <para>🔐 Kiracı eşleşmesi HER seviyede aranır. Anonim yolda çok-kiracılı filtre
    /// kapalı olduğu için sorgular kendiliğinden kiracıya daralmaz; bozuk bir
    /// <c>ParentTaskId</c> bağı başka kiracının görevini ağaca sokabilirdi.</para>
    /// </summary>
    private async Task<List<TaskItem>> LoadScopeAsync(Guid rootTaskId, Guid? tenantId)
    {
        var root = await _taskRepository.FindAsync(rootTaskId);
        if (root == null || root.TenantId != tenantId)
        {
            throw new EntityNotFoundException(typeof(TaskItem), rootTaskId);
        }

        var scope = new List<TaskItem> { root };
        var frontier = new List<Guid> { root.Id };

        // Seviye seviye in: her seviye TEK sorgu. Derinlik tavanı, döngüsel veride
        // sorgunun sonsuza gitmesini engeller.
        for (var depth = 0; depth < TaskShareConsts.MaxScopeDepth && frontier.Count > 0; depth++)
        {
            var queryable = await _taskRepository.GetQueryableAsync();
            var children = await AsyncExecuter.ToListAsync(
                queryable.Where(t => t.ParentTaskId != null
                                     && frontier.Contains(t.ParentTaskId.Value)
                                     && t.TenantId == tenantId));

            var known = scope.Select(t => t.Id).ToHashSet();
            children = children.Where(c => !known.Contains(c.Id)).ToList();

            scope.AddRange(children);
            frontier = children.Select(c => c.Id).ToList();
        }

        return scope;
    }

    private async Task<GuestTaskViewDto> BuildGuestViewAsync(TaskShareLink link, List<TaskItem> scope)
    {
        var taskIds = scope.Select(t => t.Id).ToList();

        // Yalnız BU linkin thread'i. Ekip içi yorumlar (ShareLinkId == null) hiç çekilmez —
        // filtrenin sorguda olması, sonradan eklenen bir map adımının onları sızdırmasını
        // baştan imkânsız kılar.
        var comments = await _commentRepository.GetListAsync(
            c => taskIds.Contains(c.TaskId) && c.ShareLinkId == link.Id);

        var attachments = await _attachmentRepository.GetListAsync(
            a => taskIds.Contains(a.TaskId) && (a.ShareLinkId == link.Id || a.IsVisibleToGuests));

        var teamUserIds = comments
            .Where(c => c.CreatorId.HasValue)
            .Select(c => c.CreatorId!.Value)
            .Distinct()
            .ToList();

        var userNames = new Dictionary<Guid, string>();
        if (teamUserIds.Count > 0)
        {
            var userQueryable = await _identityRepository.GetQueryableAsync();
            var users = await AsyncExecuter.ToListAsync(
                userQueryable.Where(u => teamUserIds.Contains(u.Id))
                    .Select(u => new { u.Id, u.Name, u.Surname, u.UserName }));

            foreach (var u in users)
            {
                var full = string.Join(" ", new[] { u.Name, u.Surname }.Where(s => !string.IsNullOrWhiteSpace(s)));
                userNames[u.Id] = string.IsNullOrWhiteSpace(full) ? u.UserName : full;
            }
        }

        var commentsByTask = comments.GroupBy(c => c.TaskId)
            .ToDictionary(g => g.Key, g => g.ToList());
        var attachmentsByTask = attachments.GroupBy(a => a.TaskId)
            .ToDictionary(g => g.Key, g => g.ToList());
        var childrenByParent = scope.Where(t => t.ParentTaskId.HasValue)
            .GroupBy(t => t.ParentTaskId!.Value)
            .ToDictionary(g => g.Key, g => g.ToList());

        var root = scope.First(t => t.Id == link.TaskId);

        return new GuestTaskViewDto
        {
            RecipientName = link.RecipientName,
            ExpiresAt = link.ExpiresAt,
            AllowComment = link.AllowComment,
            AllowUpload = link.AllowUpload,
            AllowDownload = link.AllowDownload,
            Root = BuildNode(root, link, childrenByParent, commentsByTask, attachmentsByTask, userNames, 0),
        };
    }

    private GuestTaskNodeDto BuildNode(
        TaskItem task,
        TaskShareLink link,
        IReadOnlyDictionary<Guid, List<TaskItem>> childrenByParent,
        IReadOnlyDictionary<Guid, List<TaskComment>> commentsByTask,
        IReadOnlyDictionary<Guid, List<TaskAttachment>> attachmentsByTask,
        IReadOnlyDictionary<Guid, string> userNames,
        int depth)
    {
        var node = new GuestTaskNodeDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            StatusText = StatusText(task.Status),
            DueDate = task.DueDate,
        };

        if (commentsByTask.TryGetValue(task.Id, out var taskComments))
        {
            var dtos = taskComments.Select(c => new GuestCommentDto
            {
                Id = c.Id,
                Text = c.Text,
                CreationTime = c.CreationTime,
                // Misafirin yazdığı yorumun kullanıcı kaydı yoktur; CreatorId doluysa ekipten
                // biri bu thread'e yanıt vermiştir.
                IsGuest = !c.CreatorId.HasValue,
                AuthorName = c.CreatorId.HasValue
                    ? userNames.GetValueOrDefault(c.CreatorId.Value, "Ekip")
                    : link.RecipientName,
                ParentCommentId = c.ParentCommentId,
            }).ToList();

            node.Comments = dtos.Where(c => c.ParentCommentId == null)
                .OrderByDescending(c => c.CreationTime)
                .ToList();

            foreach (var rootComment in node.Comments)
            {
                rootComment.Replies = dtos.Where(r => r.ParentCommentId == rootComment.Id)
                    .OrderBy(r => r.CreationTime)
                    .ToList();
            }
        }

        if (attachmentsByTask.TryGetValue(task.Id, out var taskAttachments))
        {
            node.Attachments = taskAttachments
                .OrderByDescending(a => a.CreationTime)
                .Select(a => new GuestAttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    FileSize = a.FileSize,
                    CreationTime = a.CreationTime,
                    IsGuestUpload = a.ShareLinkId == link.Id,
                }).ToList();
        }

        if (depth < TaskShareConsts.MaxScopeDepth
            && childrenByParent.TryGetValue(task.Id, out var children))
        {
            node.SubTasks = children
                .OrderBy(c => c.Number)
                .Select(c => BuildNode(
                    c, link, childrenByParent, commentsByTask, attachmentsByTask, userNames, depth + 1))
                .ToList();
        }

        return node;
    }

    /// <summary>Misafir bu eki görebilir mi: kendi yüklediği ya da ekibin dışa açtığı.</summary>
    private static bool IsVisibleToGuest(TaskAttachment attachment, TaskShareLink link)
        => attachment.ShareLinkId == link.Id || attachment.IsVisibleToGuests;

    private string StatusText(TaskStatus status) => status switch
    {
        TaskStatus.Todo => L["Tasks:Status:Todo"],
        TaskStatus.InProgress => L["Tasks:Status:InProgress"],
        TaskStatus.InReview => L["Tasks:Status:InReview"],
        TaskStatus.Done => L["Tasks:Status:Done"],
        TaskStatus.Cancelled => L["Tasks:Status:Cancelled"],
        _ => string.Empty
    };

    private async Task LogAsync(
        TaskShareLink link, TaskShareAction action, Guid? taskId, GuestRequestContextDto context)
    {
        await _accessLogRepository.InsertAsync(new TaskShareAccessLog(
            GuidGenerator.Create(), link.TenantId, link.Id, action, taskId,
            context?.IpHash, context?.UserAgent));
    }

    /// <summary>256 bit kriptografik rastgele, URL güvenli base64.</summary>
    private static string GenerateToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes)
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }

    private static string Hash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private TaskShareLinkDto Map(TaskShareLink link) => new()
    {
        Id = link.Id,
        TaskId = link.TaskId,
        RecipientName = link.RecipientName,
        RecipientEmail = link.RecipientEmail,
        ExpiresAt = link.ExpiresAt,
        AllowComment = link.AllowComment,
        AllowUpload = link.AllowUpload,
        AllowDownload = link.AllowDownload,
        RevokedAt = link.RevokedAt,
        AccessCount = link.AccessCount,
        UploadCount = link.UploadCount,
        CreationTime = link.CreationTime,
        IsActive = !link.IsRevoked && link.ExpiresAt > Clock.Now,
    };
}
