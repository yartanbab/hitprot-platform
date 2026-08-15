using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Host yöneticisinin geri bildirim havuzu. Tenant filtresi bilinçli olarak kapatılır —
/// amaç tüm firmalardan gelen bildirimi tek yerde toplamak.
/// </summary>
[Authorize(PlatformPermissions.Feedbacks.Default)]
public class FeedbackAdminAppService : ApplicationService, IFeedbackAdminAppService
{
    /// <summary>Excel çıktısında üst sınır — tek istekte tüm tabloyu belleğe almayı önler.</summary>
    private const int MaxExportRows = 10_000;

    /// <summary>Analiz panelinin baktığı pencere.</summary>
    private const int StatsWindowDays = 90;
    private const int TrendWindowDays = 30;
    private const int TopPagesCount = 15;

    private readonly IRepository<Feedback, Guid> _feedbackRepository;
    private readonly IRepository<FeedbackAttachment, Guid> _attachmentRepository;
    private readonly IRepository<FeedbackActivity, Guid> _activityRepository;
    private readonly FeedbackManager _feedbackManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly IClock _clock;

    public FeedbackAdminAppService(
        IRepository<Feedback, Guid> feedbackRepository,
        IRepository<FeedbackAttachment, Guid> attachmentRepository,
        IRepository<FeedbackActivity, Guid> activityRepository,
        FeedbackManager feedbackManager,
        ITenantRepository tenantRepository,
        IIdentityUserRepository userRepository,
        IDataFilter<IMultiTenant> multiTenantFilter,
        IClock clock)
    {
        _feedbackRepository = feedbackRepository;
        _attachmentRepository = attachmentRepository;
        _activityRepository = activityRepository;
        _feedbackManager = feedbackManager;
        _tenantRepository = tenantRepository;
        _userRepository = userRepository;
        _multiTenantFilter = multiTenantFilter;
        _clock = clock;
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task UpdateImpactAsync(Guid id, UpdateFeedbackImpactDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.GetAsync(id);
            await _feedbackManager.SetImpactAsync(feedback, input.Impact, CurrentUser.UserName);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Assign)]
    public async Task AssignAsync(Guid id, AssignFeedbackDto input)
    {
        EnsureHostContext();

        string? userName = null;
        if (input.UserId.HasValue)
        {
            // Atanan host tarafındaki bir yönetici olmalı; tenant kullanıcısı atanamaz.
            var user = await _userRepository.FindAsync(input.UserId.Value);
            if (user is null || user.TenantId != null)
            {
                throw new EntityNotFoundException(typeof(Volo.Abp.Identity.IdentityUser), input.UserId.Value);
            }

            userName = user.UserName;
        }

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.GetAsync(id);
            await _feedbackManager.AssignAsync(feedback, input.UserId, userName, CurrentUser.UserName);
        }
    }

    public async Task<List<FeedbackAssigneeDto>> GetAssigneesAsync()
    {
        EnsureHostContext();

        // Host bağlamındaki kullanıcılar (tenant kullanıcıları atanamaz).
        var users = await _userRepository.GetListAsync(sorting: nameof(Volo.Abp.Identity.IdentityUser.UserName), maxResultCount: 200);

        return users
            .Where(u => u.TenantId == null)
            .Select(u => new FeedbackAssigneeDto { Id = u.Id, UserName = u.UserName, Name = u.Name })
            .ToList();
    }

    public async Task<List<string>> GetModuleCodesAsync()
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var query = (await _feedbackRepository.GetQueryableAsync())
                .Where(f => f.ModuleCode != null && f.ModuleCode != "")
                .Select(f => f.ModuleCode!)
                .Distinct()
                .OrderBy(m => m);

            return await AsyncExecuter.ToListAsync(query);
        }
    }

    public async Task<List<FeedbackActivityDto>> GetActivitiesAsync(Guid id)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var query = (await _activityRepository.GetQueryableAsync())
                .Where(a => a.FeedbackId == id)
                .OrderBy(a => a.CreationTime);

            var items = await AsyncExecuter.ToListAsync(query);

            return items
                .Select(a => ObjectMapper.Map<FeedbackActivity, FeedbackActivityDto>(a))
                .ToList();
        }
    }

    public async Task<PagedResultDto<FeedbackDto>> GetListAsync(GetFeedbackListInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var query = ApplyFilters(await _feedbackRepository.GetQueryableAsync(), input);

            var totalCount = await AsyncExecuter.CountAsync(query);

            var items = await AsyncExecuter.ToListAsync(
                ApplySorting(query, input.Sorting)
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
                    .Include(f => f.Comments));

            var tenantNames = await GetTenantNamesAsync();

            var dtos = items.Select(f => MapToListDto(f, tenantNames)).ToList();

            return new PagedResultDto<FeedbackDto>(totalCount, dtos);
        }
    }

    public async Task<FeedbackDetailDto> GetAsync(Guid id)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await FindWithCommentsAsync(id);

            var dto = ObjectMapper.Map<Feedback, FeedbackDetailDto>(feedback);
            dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();

            // Yönetici İÇ NOTLARI da görür.
            dto.Comments = feedback.Comments
                .OrderBy(c => c.CreationTime)
                .Select(c => ObjectMapper.Map<FeedbackComment, FeedbackCommentDto>(c))
                .ToList();

            dto.CommentCount = dto.Comments.Count;

            var attachmentsQuery = (await _attachmentRepository.GetQueryableAsync())
                .Where(a => a.FeedbackId == feedback.Id)
                .OrderBy(a => a.CreationTime);
            var attachments = await AsyncExecuter.ToListAsync(attachmentsQuery);
            dto.Attachments = attachments
                .Select(a => ObjectMapper.Map<FeedbackAttachment, FeedbackAttachmentDto>(a))
                .ToList();

            var tenantNames = await GetTenantNamesAsync();
            dto.TenantName = ResolveTenantName(feedback.TenantId, tenantNames);
            HideIdentityIfAnonymous(dto);

            return dto;
        }
    }

    public async Task<FeedbackAttachmentFileDto> GetAttachmentFileAsync(Guid attachmentId)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var attachment = await _attachmentRepository.FindAsync(attachmentId);
            if (attachment is null)
            {
                throw new EntityNotFoundException(typeof(FeedbackAttachment), attachmentId);
            }

            return new FeedbackAttachmentFileDto
            {
                FileName = attachment.FileName,
                StoredFileName = attachment.StoredFileName,
                ContentType = attachment.ContentType
            };
        }
    }

    public async Task<FeedbackAttachmentFileDto> GetScreenshotFileAsync(Guid feedbackId)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.FindAsync(feedbackId);
            if (feedback is null || feedback.ScreenshotFileName.IsNullOrWhiteSpace())
            {
                throw new EntityNotFoundException(typeof(Feedback), feedbackId);
            }

            return new FeedbackAttachmentFileDto
            {
                FileName = "ekran-goruntusu" + System.IO.Path.GetExtension(feedback.ScreenshotFileName),
                StoredFileName = feedback.ScreenshotFileName!,
                ContentType = null
            };
        }
    }

    public async Task<FeedbackStatsDto> GetStatsAsync()
    {
        EnsureHostContext();

        var since = _clock.Now.AddDays(-StatsWindowDays);

        using (_multiTenantFilter.Disable())
        {
            var query = await _feedbackRepository.GetQueryableAsync();

            // Yalnızca özet için gereken 6 alan çekilir (gövde/breadcrumb DEĞİL), sonra
            // bellekte gruplanır. Gruplamayı SQL'e taşımak bu hacimde kazanç sağlamaz;
            // kayıt sayısı ciddi büyürse GroupBy sorgularına geçilmeli.
            var rows = await AsyncExecuter.ToListAsync(
                query.Where(f => f.CreationTime >= since)
                     .Select(f => new StatsRow
                     {
                         Type = f.Type,
                         Status = f.Status,
                         Rating = f.Rating,
                         PageUrl = f.PageUrl,
                         PageTitle = f.PageTitle,
                         CreationTime = f.CreationTime,
                         LastRespondedAt = f.LastRespondedAt,
                         ResolvedAt = f.ResolvedAt
                     }));

            var ratings = rows.Where(r => r.Rating.HasValue).Select(r => r.Rating!.Value).ToList();
            var trendSince = _clock.Now.Date.AddDays(-TrendWindowDays + 1);

            // Süre metrikleri yalnızca ilgili aşamayı geçmiş kayıtlar üzerinden hesaplanır;
            // henüz cevaplanmamış/kapanmamış kayıtlar ortalamayı aşağı çekmemeli.
            var responded = rows.Where(r => r.LastRespondedAt.HasValue).ToList();
            var resolved  = rows.Where(r => r.ResolvedAt.HasValue).ToList();

            return new FeedbackStatsDto
            {
                TotalCount = rows.Count,

                OpenCount = rows.Count(r => r.Status.IsOpen()),

                UnansweredCount = rows.Count(r => r.LastRespondedAt == null),

                AverageRating = ratings.Count > 0 ? Math.Round(ratings.Average(), 2) : null,
                RatingCount = ratings.Count,

                AverageFirstResponseHours = responded.Count > 0
                    ? Math.Round(responded.Average(r => (r.LastRespondedAt!.Value - r.CreationTime).TotalHours), 1)
                    : null,

                AverageResolutionHours = resolved.Count > 0
                    ? Math.Round(resolved.Average(r => (r.ResolvedAt!.Value - r.CreationTime).TotalHours), 1)
                    : null,

                ByType = rows
                    .GroupBy(r => (int)r.Type)
                    .Select(g => new FeedbackCountByKeyDto { Key = g.Key, Count = g.Count() })
                    .OrderBy(x => x.Key)
                    .ToList(),

                ByStatus = rows
                    .GroupBy(r => (int)r.Status)
                    .Select(g => new FeedbackCountByKeyDto { Key = g.Key, Count = g.Count() })
                    .OrderBy(x => x.Key)
                    .ToList(),

                Trend = BuildTrend(rows, trendSince, Clock.Now.Date),

                TopPages = rows
                    .Where(r => !string.IsNullOrWhiteSpace(r.PageUrl))
                    .GroupBy(r => r.PageUrl!)
                    .Select(g => new FeedbackPageStatDto
                    {
                        PageUrl = g.Key,
                        PageTitle = g.Select(x => x.PageTitle).FirstOrDefault(t => !string.IsNullOrWhiteSpace(t)),
                        Count = g.Count(),
                        BugCount = g.Count(x => x.Type == FeedbackType.Bug),
                        AverageRating = g.Any(x => x.Rating.HasValue)
                            ? Math.Round(g.Where(x => x.Rating.HasValue).Average(x => x.Rating!.Value), 2)
                            : null
                    })
                    .OrderByDescending(p => p.Count)
                    .Take(TopPagesCount)
                    .ToList()
            };
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task UpdateStatusAsync(Guid id, UpdateFeedbackStatusDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.GetAsync(id);
            await _feedbackManager.ChangeStatusAsync(feedback, input.Status, CurrentUser.UserName);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task UpdatePriorityAsync(Guid id, UpdateFeedbackPriorityDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.GetAsync(id);
            await _feedbackManager.SetPriorityAsync(feedback, input.Priority, CurrentUser.UserName);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task UpdateTagsAsync(Guid id, UpdateFeedbackTagsDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await _feedbackRepository.GetAsync(id);
            await _feedbackManager.SetTagsAsync(feedback, input.AdminTags, CurrentUser.UserName);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task BulkUpdateStatusAsync(BulkUpdateFeedbackStatusDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            foreach (var id in input.Ids.Distinct())
            {
                var feedback = await _feedbackRepository.FindAsync(id);
                if (feedback is null)
                {
                    continue;
                }

                // Geçersiz geçişte (ör. kapalı kayıt → Completed) tüm toplu işlem
                // düşmesin; o kayıt atlanır.
                try
                {
                    await _feedbackManager.ChangeStatusAsync(feedback, input.Status, CurrentUser.UserName);
                }
                catch (BusinessException)
                {
                    continue;
                }
            }
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Respond)]
    public async Task<FeedbackCommentDto> AddCommentAsync(Guid id, AddFeedbackCommentDto input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var feedback = await FindWithCommentsAsync(id);

            var comment = await _feedbackManager.AddCommentAsync(
                feedback,
                input.Text,
                input.IsInternal,
                CurrentUser.UserName);

            return ObjectMapper.Map<FeedbackComment, FeedbackCommentDto>(comment);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            await _feedbackRepository.DeleteAsync(id);
        }
    }

    [Authorize(PlatformPermissions.Feedbacks.Export)]
    public async Task<List<FeedbackDto>> GetAllForExportAsync(GetFeedbackListInput input)
    {
        EnsureHostContext();

        using (_multiTenantFilter.Disable())
        {
            var query = ApplyFilters(await _feedbackRepository.GetQueryableAsync(), input);

            var items = await AsyncExecuter.ToListAsync(
                ApplySorting(query, input.Sorting).Take(MaxExportRows));

            var tenantNames = await GetTenantNamesAsync();

            // Yorum sayısı Excel'de gerekmiyor → Include yok, ek sorgu yok.
            return items.Select(f => MapToListDto(f, tenantNames, commentCount: 0)).ToList();
        }
    }

    /* ─── Yardımcılar ─────────────────────────────────────────────────────── */

    private static IQueryable<Feedback> ApplyFilters(IQueryable<Feedback> query, GetFeedbackListInput input)
    {
        if (input.Type.HasValue)
        {
            query = query.Where(f => f.Type == input.Type.Value);
        }

        if (input.Status.HasValue)
        {
            query = query.Where(f => f.Status == input.Status.Value);
        }

        if (input.Priority.HasValue)
        {
            query = query.Where(f => f.Priority == input.Priority.Value);
        }

        if (input.TenantId.HasValue)
        {
            query = query.Where(f => f.TenantId == input.TenantId.Value);
        }

        if (input.Impact.HasValue)
        {
            query = query.Where(f => f.Impact == input.Impact.Value);
        }

        if (input.AssignedUserId.HasValue)
        {
            query = query.Where(f => f.AssignedUserId == input.AssignedUserId.Value);
        }
        else if (input.OnlyUnassigned == true)
        {
            query = query.Where(f => f.AssignedUserId == null);
        }

        if (!input.ModuleCode.IsNullOrWhiteSpace())
        {
            query = query.Where(f => f.ModuleCode == input.ModuleCode);
        }

        if (input.OnlyWithAttachment == true)
        {
            query = query.Where(f => f.ScreenshotFileName != null);
        }

        if (!input.Filter.IsNullOrWhiteSpace())
        {
            var term = input.Filter!.Trim();
            // FB-no ile birebir arama da desteklenir (kullanıcı numarayı yapıştırır).
            query = query.Where(f =>
                f.Subject.Contains(term) || f.Body.Contains(term) || f.FeedbackNumber == term);
        }

        if (input.MinRating.HasValue)
        {
            query = query.Where(f => f.Rating != null && f.Rating >= input.MinRating.Value);
        }

        if (input.DateFrom.HasValue)
        {
            query = query.Where(f => f.CreationTime >= input.DateFrom.Value);
        }

        if (input.DateTo.HasValue)
        {
            // Gün sonuna kadar dahil et.
            var upperBound = input.DateTo.Value.Date.AddDays(1);
            query = query.Where(f => f.CreationTime < upperBound);
        }

        if (input.OnlyUnanswered == true)
        {
            query = query.Where(f => f.LastRespondedAt == null);
        }

        if (!input.PageUrl.IsNullOrWhiteSpace())
        {
            query = query.Where(f => f.PageUrl == input.PageUrl);
        }

        return query;
    }

    /// <summary>
    /// Sabit sıralama seçenekleri. Dinamik LINQ yerine switch: panelden gelen
    /// serbest metin doğrudan sorguya girmez.
    /// </summary>
    private static IQueryable<Feedback> ApplySorting(IQueryable<Feedback> query, string? sorting)
    {
        return sorting?.Trim().ToLowerInvariant() switch
        {
            "priority" => query.OrderByDescending(f => f.Priority).ThenByDescending(f => f.CreationTime),
            "rating" => query.OrderBy(f => f.Rating).ThenByDescending(f => f.CreationTime),
            "oldest" => query.OrderBy(f => f.CreationTime),
            _ => query.OrderByDescending(f => f.CreationTime)
        };
    }

    private async Task<Feedback> FindWithCommentsAsync(Guid id)
    {
        var query = (await _feedbackRepository.GetQueryableAsync())
            .Where(f => f.Id == id)
            .Include(f => f.Comments);

        var feedback = await AsyncExecuter.FirstOrDefaultAsync(query);

        if (feedback is null)
        {
            throw new EntityNotFoundException(typeof(Feedback), id);
        }

        return feedback;
    }

    private async Task<Dictionary<Guid, string>> GetTenantNamesAsync()
    {
        var tenants = await _tenantRepository.GetListAsync();
        return tenants.ToDictionary(t => t.Id, t => t.Name);
    }

    private static string? ResolveTenantName(Guid? tenantId, Dictionary<Guid, string> tenantNames)
    {
        if (tenantId is null)
        {
            return "Host";
        }

        return tenantNames.TryGetValue(tenantId.Value, out var name) ? name : null;
    }

    private FeedbackDto MapToListDto(
        Feedback feedback,
        Dictionary<Guid, string> tenantNames,
        int? commentCount = null)
    {
        var dto = ObjectMapper.Map<Feedback, FeedbackDto>(feedback);
        dto.HasScreenshot = !feedback.ScreenshotFileName.IsNullOrWhiteSpace();
        dto.CommentCount = commentCount ?? feedback.Comments.Count;
        dto.TenantName = ResolveTenantName(feedback.TenantId, tenantNames);
        HideIdentityIfAnonymous(dto);
        return dto;
    }

    /// <summary>
    /// UI-anonim: kimlik DB'de durur (kötüye kullanım/rate-limit için) ama yönetici
    /// panelinde gösterilmez. Kullanıcı formda bu vaadi gördü — burada tutulur.
    /// </summary>
    private static void HideIdentityIfAnonymous(FeedbackDto dto)
    {
        if (dto.IsAnonymous)
        {
            dto.SubmittedByUserName = null;
            dto.CreatorId = null;
        }
    }

    private static List<FeedbackTrendPointDto> BuildTrend(List<StatsRow> rows, DateTime trendSince, DateTime today)
    {
        var counts = rows
            .Where(r => r.CreationTime >= trendSince)
            .GroupBy(r => r.CreationTime.Date)
            .ToDictionary(g => g.Key, g => g.Count());

        // Boş günler de dizide yer alsın; grafik kesintisiz çizilsin.
        var result = new List<FeedbackTrendPointDto>();
        for (var day = trendSince; day <= today; day = day.AddDays(1)) // CORR-004: today = Clock.Now.Date (çağırandan)
        {
            result.Add(new FeedbackTrendPointDto
            {
                Date = day,
                Count = counts.TryGetValue(day, out var count) ? count : 0
            });
        }

        return result;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }

    /// <summary>Özet sorgusunun projeksiyon hedefi — ağır alanlar taşınmaz.</summary>
    private sealed class StatsRow
    {
        public FeedbackType Type { get; set; }
        public FeedbackStatus Status { get; set; }
        public int? Rating { get; set; }
        public string? PageUrl { get; set; }
        public string? PageTitle { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastRespondedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
}
