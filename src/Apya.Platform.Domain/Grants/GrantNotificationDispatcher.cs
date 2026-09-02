using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Hibe tetikleyicilerinin tek çıkış kapısı.
///
/// <para>Çağıran taraf "şu olay oldu, şu kullanıcılara duyur" der; şablonun açık olup
/// olmadığı, hangi kanaldan gideceği ve metnin nasıl doldurulacağı burada karara
/// bağlanır. AppService'ler metni kendileri kursaydı host'un ekrandan yaptığı
/// düzenleme hiçbir yere yansımazdı.</para>
/// </summary>
public class GrantNotificationDispatcher : DomainService
{
    private readonly IRepository<GrantNotificationTemplate, Guid> _templateRepo;
    private readonly NotificationManager _notificationManager;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IEmailSender _emailSender;
    private readonly IDataFilter _dataFilter;

    public GrantNotificationDispatcher(
        IRepository<GrantNotificationTemplate, Guid> templateRepo,
        NotificationManager notificationManager,
        IIdentityUserRepository userRepo,
        IEmailSender emailSender,
        IDataFilter dataFilter)
    {
        _templateRepo = templateRepo;
        _notificationManager = notificationManager;
        _userRepo = userRepo;
        _emailSender = emailSender;
        _dataFilter = dataFilter;
    }

    /// <summary>
    /// Tetikleyicinin şablonunu uygular. Şablon kapalıysa hiçbir şey yapmaz ve
    /// <c>false</c> döner.
    /// </summary>
    /// <param name="userIds">Alıcılar. Çağıran taraf hangi kiracıda olduklarını
    /// <see cref="ICurrentTenant.Change"/> ile ayarlamış olmalıdır.</param>
    public async Task<bool> DispatchAsync(
        GrantNotificationTrigger trigger,
        IReadOnlyCollection<Guid> userIds,
        IReadOnlyDictionary<string, string?> values,
        string? entityType = null,
        Guid? entityId = null)
    {
        if (userIds.Count == 0)
        {
            return false;
        }

        var template = await FindTemplateAsync(trigger);
        if (template is not { IsEnabled: true })
        {
            return false;
        }

        var type = GrantNotificationTriggerRegistry.NotificationTypeOf(trigger);
        var subject = GrantNotificationRenderer.Render(template.Subject, values);
        var body = GrantNotificationRenderer.Render(template.Body, values);

        foreach (var userId in userIds)
        {
            if (template.InApp)
            {
                await _notificationManager.PublishAsync(userId, subject, body, type, entityType, entityId);
            }

            if (template.Email)
            {
                await TrySendEmailAsync(userId, subject, body);
            }
        }

        return true;
    }

    /// <summary>
    /// Bir kiracının (ya da <c>null</c> ile host'un) tüm etkin kullanıcılarına duyurur.
    ///
    /// <para>Tetikleyicilerin çoğu host bağlamındaki bir eylemden doğuyor ama firmaya
    /// gidiyor; "kiracıya geç → kullanıcıları topla → gönder" üçlüsü dört ayrı
    /// AppService'te tekrarlanmasın diye buraya alındı.</para>
    /// </summary>
    public async Task<bool> DispatchToTenantAsync(
        GrantNotificationTrigger trigger,
        Guid? tenantId,
        IReadOnlyDictionary<string, string?> values,
        string? entityType = null,
        Guid? entityId = null)
    {
        using (CurrentTenant.Change(tenantId))
        {
            var userIds = (await _userRepo.GetListAsync())
                .Where(u => u.IsActive).Select(u => u.Id).ToList();

            return await DispatchAsync(trigger, userIds, values, entityType, entityId);
        }
    }

    /// <summary>
    /// Yalnız metni üretir; göndermez. Kendi gönderim döngüsü olan ekranlar
    /// (1c'de host kanalı gönderim başına seçiyor) metni buradan alır —
    /// böylece şablon düzenlemesi o ekranda da karşılık bulur.
    /// </summary>
    /// <returns>Şablon yoksa ya da kapalıysa <c>null</c>.</returns>
    public async Task<(string Subject, string Body)?> RenderAsync(
        GrantNotificationTrigger trigger,
        IReadOnlyDictionary<string, string?> values)
    {
        var template = await FindTemplateAsync(trigger);
        if (template is not { IsEnabled: true })
        {
            return null;
        }

        return (GrantNotificationRenderer.Render(template.Subject, values),
                GrantNotificationRenderer.Render(template.Body, values));
    }

    /// <summary>
    /// Şablon HOST kataloğunda yaşar (<c>TenantId == null</c>). Kiracı bağlamından
    /// okunduğu için filtre kapatılır; 🔴 <c>Disable()</c> kapsamı TÜM kiracılara
    /// açtığı için <c>TenantId == null</c> koşulu ELLE konur.
    /// </summary>
    private async Task<GrantNotificationTemplate?> FindTemplateAsync(GrantNotificationTrigger trigger)
    {
        using (_dataFilter.Disable<IMultiTenant>())
        {
            return (await _templateRepo.GetListAsync(
                    t => t.TenantId == null && t.Trigger == trigger))
                .FirstOrDefault();
        }
    }

    /// <summary>
    /// Şablon e-posta diyorsa bile kullanıcının kendi kategori tercihi geçerlidir —
    /// şablon "gönderilebilir mi", tercih "istiyor mu" sorusunu cevaplar.
    /// </summary>
    private async Task TrySendEmailAsync(Guid userId, string subject, string body)
    {
        try
        {
            if (!await _notificationManager.IsEmailEnabledAsync(userId, NotificationCategory.Grants))
            {
                return;
            }

            var user = await _userRepo.FindAsync(userId);
            if (user == null || user.Email.IsNullOrWhiteSpace())
            {
                return;
            }

            await _emailSender.SendAsync(user.Email, subject, body);
        }
        catch (Exception ex)
        {
            // E-posta altyapısı akışı kırmamalı; uygulama içi bildirim zaten atıldı.
            Logger.LogWarning(ex, "Hibe bildirim e-postası gönderilemedi. UserId: {UserId}", userId);
        }
    }
}
