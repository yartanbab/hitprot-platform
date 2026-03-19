using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace Apya.Platform.Notifications;

[Authorize]
public class NotificationAppService : ApplicationService, INotificationAppService
{
    private readonly IRepository<Notification, Guid> _notificationRepository;

    public NotificationAppService(IRepository<Notification, Guid> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    // ─── Benim bildirimlerimi getir ────────────────────────────────────────────
    public async Task<PagedResultDto<NotificationDto>> GetMyNotificationsAsync(GetNotificationsInput input)
    {
        var userId = CurrentUser.GetId();

        var query = (await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId);

        if (input.IsRead.HasValue)
            query = query.Where(n => n.IsRead == input.IsRead.Value);

        var total = query.Count();

        var items = query
            .OrderByDescending(n => n.CreationTime)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount)
            .ToList();

        var dtos = items.Select(MapToDto).ToList();
        return new PagedResultDto<NotificationDto>(total, dtos);
    }

    // ─── Okunmamış sayısı ──────────────────────────────────────────────────────
    public async Task<int> GetUnreadCountAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();
        return query.Count(n => n.UserId == userId && !n.IsRead);
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
    }

    // ─── Tümünü okundu yap ────────────────────────────────────────────────────
    public async Task MarkAllAsReadAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();

        var unread = query
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToList();

        foreach (var n in unread)
            n.MarkAsRead();

        await _notificationRepository.UpdateManyAsync(unread);
    }

    // ─── Sil ──────────────────────────────────────────────────────────────────
    public async Task DeleteAsync(Guid id)
    {
        var userId       = CurrentUser.GetId();
        var notification = await _notificationRepository.GetAsync(id);

        if (notification.UserId != userId)
            throw new UserFriendlyException("Bu bildirimi silme yetkiniz yok.");

        await _notificationRepository.DeleteAsync(notification);
    }

    // ─── Yardımcı ─────────────────────────────────────────────────────────────
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

    private static string? BuildDeepLink(string? entityType, Guid? entityId)
    {
        if (entityId == null) return null;
        return entityType switch
        {
            "Task"    => $"/Tasks/EditModal?id={entityId}",
            "Project" => $"/Projects/ProjectDetails/{entityId}",
            _         => null
        };
    }
}
