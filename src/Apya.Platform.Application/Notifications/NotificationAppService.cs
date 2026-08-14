using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.Notifications;

[Authorize]
public class NotificationAppService : ApplicationService, INotificationAppService
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly ILocalEventBus _localEventBus;

    public NotificationAppService(
        IRepository<Notification, Guid> notificationRepository,
        ILocalEventBus localEventBus)
    {
        _notificationRepository = notificationRepository;
        _localEventBus = localEventBus;
    }

    // ─── Benim bildirimlerimi getir ────────────────────────────────────────────
    // Bildirim kişiseldir: host hesabı dahil herkes yalnızca kendi kayıtlarını görür.
    // (Host için tenant filtresi kapatılıyordu → başka tenant kullanıcılarının
    //  bildirimleri listeleniyor, ama rozet/MarkAsRead kendi UserId'sine bakıyordu.)
    public async Task<PagedResultDto<NotificationDto>> GetMyNotificationsAsync(GetNotificationsInput input)
    {
        var userId = CurrentUser.GetId();

        var query = (await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId);

        if (input.IsRead.HasValue)
            query = query.Where(n => n.IsRead == input.IsRead.Value);

        var total = await AsyncExecuter.CountAsync(query);

        var items = await AsyncExecuter.ToListAsync(
            query.OrderByDescending(n => n.CreationTime)
                 .Skip(input.SkipCount)
                 .Take(input.MaxResultCount));

        var dtos = items.Select(MapToDto).ToList();
        return new PagedResultDto<NotificationDto>(total, dtos);
    }

    // ─── Okunmamış sayısı ──────────────────────────────────────────────────────
    // ARCH-044: Senkron .Count() EF queryable üzerinde çağrılıyordu → AsyncExecuter.CountAsync
    public async Task<int> GetUnreadCountAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();
        return await AsyncExecuter.CountAsync(query.Where(n => n.UserId == userId && !n.IsRead));
    }

    // ─── Okundu işaretle ──────────────────────────────────────────────────────
    public async Task MarkAsReadAsync(Guid id)
    {
        var userId       = CurrentUser.GetId();
        var notification = await _notificationRepository.GetAsync(id);

        if (notification.UserId != userId)
            throw new UserFriendlyException("Bu bildirimi okuma yetkiniz yok.");

        notification.MarkAsRead();
        await _notificationRepository.UpdateAsync(notification);
        await PublishCountChangedAsync(userId);
    }

    // ─── Tümünü okundu yap ────────────────────────────────────────────────────
    // ARCH-045: Senkron .ToList() EF queryable üzerinde çağrılıyordu → AsyncExecuter.ToListAsync
    public async Task MarkAllAsReadAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();

        var unread = await AsyncExecuter.ToListAsync(
            query.Where(n => n.UserId == userId && !n.IsRead));

        foreach (var n in unread)
            n.MarkAsRead();

        await _notificationRepository.UpdateManyAsync(unread);
        await PublishCountChangedAsync(userId);
    }

    // ─── Sil ──────────────────────────────────────────────────────────────────
    public async Task DeleteAsync(Guid id)
    {
        var userId       = CurrentUser.GetId();
        var notification = await _notificationRepository.GetAsync(id);

        if (notification.UserId != userId)
            throw new UserFriendlyException("Bu bildirimi silme yetkiniz yok.");

        await _notificationRepository.DeleteAsync(notification);
        await PublishCountChangedAsync(userId);
    }

    // ─── Yardımcı ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Okunmamış sayısı değişti — kullanıcının açık tüm sekmeleri rozeti tazelesin.
    /// (Rozet daha önce yalnızca JS tarafında +1/-1 ile takip ediliyordu; ikinci
    ///  sekme, başka cihaz veya bildirim geçmişi sayfası ile sapıyordu.)
    /// </summary>
    private Task PublishCountChangedAsync(Guid userId)
        => _localEventBus.PublishAsync(new NotificationCountChangedEto
        {
            TenantId = CurrentTenant.Id,
            UserId   = userId
        });
    private static NotificationDto MapToDto(Notification n) => new()
    {
        Id           = n.Id,
        Type         = n.Type,
        Title        = n.Title,
        Body         = n.Body,
        EntityType   = n.EntityType,
        EntityId     = n.EntityId,
        IsRead       = n.IsRead,
        ReadAt       = n.ReadAt,
        CreationTime = n.CreationTime,
        DeepLinkUrl  = BuildDeepLink(n.EntityType, n.EntityId)
    };

    // Bildirime tıklandığında gidilecek adres. "Task" daha önce /Tasks/EditModal'a
    // işaret ediyordu; o sayfa Layout = null olduğu için tam sayfa gidildiğinde
    // menüsüz, çıplak bir form açılıyordu.
    private static string? BuildDeepLink(string? entityType, Guid? entityId)
    {
        if (entityId == null) return null;
        return entityType switch
        {
            "Task"         => $"/Tasks/Detail/{entityId}",
            "Project"      => $"/Projects/ProjectDetails/{entityId}",
            // Aşağıdakilerin hedef sayfası henüz tekil kayda odaklanmayı
            // desteklemiyor — şimdilik ilgili listeye götürüyoruz.
            "Document"     => "/Documents",
            "Feedback"     => "/Feedback",
            "GrantCall"    => "/Grants",
            "AiEvaluation" => "/AiCenter/Evaluations",
            _              => null
        };
    }
}
