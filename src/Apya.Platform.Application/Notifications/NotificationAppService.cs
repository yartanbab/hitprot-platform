using System;
using Microsoft.EntityFrameworkCore;
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
    private readonly IRepository<NotificationPreference, Guid> _preferenceRepository;
    private readonly ILocalEventBus _localEventBus;

    public NotificationAppService(
        IRepository<Notification, Guid> notificationRepository,
        IRepository<NotificationPreference, Guid> preferenceRepository,
        ILocalEventBus localEventBus)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _localEventBus = localEventBus;
    }

    // ─── Benim bildirimlerimi getir ────────────────────────────────────────────
    // Bildirim kişiseldir: host hesabı dahil herkes yalnızca kendi kayıtlarını görür.
    // (Host için tenant filtresi kapatılıyordu → başka tenant kullanıcılarının
    //  bildirimleri listeleniyor, ama rozet/MarkAsRead kendi UserId'sine bakıyordu.)
    public async Task<PagedResultDto<NotificationDto>> GetMyNotificationsAsync(GetNotificationsInput input)
    {
        var userId = CurrentUser.GetId();

        // Salt-okuma listesi: entity'ler yalnız DTO'ya kopyalanır, değiştirilmez —
        // change tracker maliyetine gerek yok.
        var query = (await _notificationRepository.GetQueryableAsync())
            .AsNoTracking()
            .Where(n => n.UserId == userId);

        if (input.IsRead.HasValue)
            query = query.Where(n => n.IsRead == input.IsRead.Value);

        if (input.Category.HasValue)
            query = query.Where(n => n.Category == input.Category.Value);

        if (input.MinSeverity.HasValue)
            query = query.Where(n => n.Severity >= input.MinSeverity.Value);

        if (!input.Filter.IsNullOrWhiteSpace())
            query = query.Where(n => n.Title.Contains(input.Filter!) || n.Body.Contains(input.Filter!));

        var total = await AsyncExecuter.CountAsync(query);

        // Sıralama LastOccurredAt üzerinden: gruplanan bir bildirim yeni olay
        // aldığında listede yukarı taşınır, yoksa gruplama görünmez kalırdı.
        var ordered = input.Sort == NotificationSortMode.Importance
            ? query.OrderByDescending(n => n.Severity).ThenByDescending(n => n.LastOccurredAt)
            : query.OrderByDescending(n => n.LastOccurredAt);

        var items = await AsyncExecuter.ToListAsync(
            ordered.Skip(input.SkipCount).Take(input.MaxResultCount));

        var dtos = items.Select(MapToDto).ToList();
        return new PagedResultDto<NotificationDto>(total, dtos);
    }

    // ─── Özet: rozet + "Önemli" sayacı + kategori ağacı ───────────────────────
    public async Task<NotificationSummaryDto> GetSummaryAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = (await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId && !n.IsRead);

        var perCategory = await AsyncExecuter.ToListAsync(
            query.GroupBy(n => n.Category)
                 .Select(g => new { Category = g.Key, Count = g.Count() }));

        var important = await AsyncExecuter.CountAsync(
            query.Where(n => n.Severity >= NotificationSeverity.High));

        return new NotificationSummaryDto
        {
            TotalUnread     = perCategory.Sum(c => c.Count),
            ImportantUnread = important,
            Categories      = perCategory
                .Select(c => new NotificationCategoryCountDto
                {
                    Category    = c.Category,
                    UnreadCount = c.Count
                })
                .OrderBy(c => c.Category)
                .ToList()
        };
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

    // ─── Bir kategoriyi okundu yap ────────────────────────────────────────────
    public async Task MarkCategoryAsReadAsync(NotificationCategory category)
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();

        var unread = await AsyncExecuter.ToListAsync(
            query.Where(n => n.UserId == userId && !n.IsRead && n.Category == category));

        if (unread.Count == 0)
            return;

        foreach (var n in unread)
            n.MarkAsRead();

        await _notificationRepository.UpdateManyAsync(unread);
        await PublishCountChangedAsync(userId);
    }

    // ─── Okunmuşları temizle ──────────────────────────────────────────────────
    public async Task<int> DeleteReadAsync()
    {
        var userId = CurrentUser.GetId();
        var query  = await _notificationRepository.GetQueryableAsync();

        var read = await AsyncExecuter.ToListAsync(
            query.Where(n => n.UserId == userId && n.IsRead));

        if (read.Count == 0)
            return 0;

        await _notificationRepository.DeleteManyAsync(read);
        return read.Count;
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

    // ─── Kanal tercihleri ─────────────────────────────────────────────────────
    public async Task<List<NotificationPreferenceDto>> GetPreferencesAsync()
    {
        var userId = CurrentUser.GetId();
        var stored = await _preferenceRepository.GetListAsync(p => p.UserId == userId);

        // Her kategori için satır döner: kaydı olmayan kategoriler varsayılanla
        // gelir, böylece istemci eksik satırla uğraşmaz.
        return Enum.GetValues<NotificationCategory>()
            .Select(category =>
            {
                var pref = stored.FirstOrDefault(p => p.Category == category);
                return new NotificationPreferenceDto
                {
                    Category = category,
                    InApp    = pref?.InApp ?? NotificationPreferenceDefaults.InApp,
                    Email    = pref?.Email ?? NotificationPreferenceDefaults.Email
                };
            })
            .ToList();
    }

    public async Task UpdatePreferenceAsync(UpdateNotificationPreferenceInput input)
    {
        var userId = CurrentUser.GetId();
        var existing = await _preferenceRepository.FirstOrDefaultAsync(
            p => p.UserId == userId && p.Category == input.Category);

        if (existing == null)
        {
            await _preferenceRepository.InsertAsync(new NotificationPreference(
                GuidGenerator.Create(), CurrentTenant.Id, userId,
                input.Category, input.InApp, input.Email));
            return;
        }

        existing.Set(input.InApp, input.Email);
        await _preferenceRepository.UpdateAsync(existing);
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
    // İkon ve derin link türün kaydından gelir — bkz. NotificationTypeRegistry.
    private static NotificationDto MapToDto(Notification n) => new()
    {
        Id              = n.Id,
        Type            = n.Type,
        Category        = n.Category,
        Severity        = n.Severity,
        Title           = n.Title,
        Body            = n.Body,
        EntityType      = n.EntityType,
        EntityId        = n.EntityId,
        IsRead          = n.IsRead,
        ReadAt          = n.ReadAt,
        CreationTime    = n.CreationTime,
        LastOccurredAt  = n.LastOccurredAt,
        OccurrenceCount = n.OccurrenceCount,
        ActorName       = n.ActorName,
        Icon            = NotificationTypeRegistry.Get(n.Type).Icon,
        DeepLinkUrl     = NotificationTypeRegistry.BuildDeepLink(n.Type, n.EntityId)
    };
}
