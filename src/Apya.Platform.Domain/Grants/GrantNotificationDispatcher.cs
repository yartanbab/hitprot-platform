using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Logging;
using Volo.Abp.Authorization.Permissions;
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
    private readonly PermittedUserFinder _permittedUsers;

    /// <summary>
    /// N-04 · Hibe duyurusunu alacak kişinin taşıması gereken izin (PlatformPermissions.Grants.Default).
    /// Domain, Application.Contracts'taki sabite başvuramaz; değer eşitliği testle kilitli
    /// (GrantNotificationRecipients_Tests).
    /// </summary>
    public const string RecipientPermission = "Platform.Grants";

    /// <summary>ABP'nin hem host'ta hem kiracıda açtığı yönetici rolünün adı.</summary>
    public const string AdminRoleName = ImpersonationTargetFinder.AdminRoleName;

    private readonly IPermissionStore _permissionStore;

    public GrantNotificationDispatcher(
        IRepository<GrantNotificationTemplate, Guid> templateRepo,
        NotificationManager notificationManager,
        IIdentityUserRepository userRepo,
        IEmailSender emailSender,
        IDataFilter dataFilter,
        PermittedUserFinder permittedUsers,
        IPermissionStore permissionStore)
    {
        _permissionStore = permissionStore;
        _permittedUsers = permittedUsers;
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
    /// <param name="sendEmail">null = şablonun e-posta ayarı. 19b fikir davetinde kanal gönderim başına seçilir;
    /// kullanıcının kategori tercihi her durumda geçerlidir.</param>
    public async Task<bool> DispatchAsync(
        GrantNotificationTrigger trigger,
        IReadOnlyCollection<Guid> userIds,
        IReadOnlyDictionary<string, string?> values,
        string? entityType = null,
        Guid? entityId = null,
        bool? sendEmail = null)
    {
        if (userIds.Count == 0)
        {
            return false;
        }

        var templates = await FindTemplatesAsync(trigger);
        var sent = false;

        foreach (var (template, recipients) in await AssignTemplatesAsync(templates, userIds))
        {
            if (!template.IsEnabled)
            {
                continue;
            }

            await SendAsync(template, recipients, values, entityType, entityId, sendEmail);
            sent = true;
        }

        return sent;
    }

    private async Task SendAsync(
        GrantNotificationTemplate template,
        IReadOnlyCollection<Guid> userIds,
        IReadOnlyDictionary<string, string?> values,
        string? entityType,
        Guid? entityId,
        bool? sendEmail)
    {
        var type = GrantNotificationTriggerRegistry.NotificationTypeOf(template.Trigger);
        var subject = GrantNotificationRenderer.Render(template.Subject, values);
        var body = GrantNotificationRenderer.Render(template.Body, values);

        // 🔴 Kritik türün e-postasını NotificationManager zaten kuyruğa alır (kullanıcı tercihi
        // açıksa). Burada da gönderilirse firma aynı kurum kararını iki e-postayla alıyordu.
        var emailByManager = template.InApp
            && NotificationTypeRegistry.Get(type).DefaultSeverity >= NotificationSeverity.Critical;

        foreach (var userId in userIds)
        {
            if (template.InApp)
            {
                await _notificationManager.PublishAsync(userId, subject, body, type, entityType, entityId);
            }

            if ((sendEmail ?? template.Email) && !emailByManager)
            {
                await TrySendEmailAsync(userId, subject, body);
            }
        }
    }

    /// <summary>
    /// Her alıcıya rolüne uyan şablonu, yoksa Genel şablonu eşler. Tetikleyicinin rol şablonu
    /// yoksa rol sorgusu hiç yapılmaz. Çağıran kiracı bağlamını ayarlamış olmalıdır: rol, alıcının
    /// tarafından (kiracı = firma, host = danışman) türer.
    /// </summary>
    private async Task<List<(GrantNotificationTemplate Template, List<Guid> UserIds)>> AssignTemplatesAsync(
        List<GrantNotificationTemplate> templates,
        IReadOnlyCollection<Guid> userIds)
    {
        var general = templates.FirstOrDefault(t => t.Audience == GrantNotificationAudience.Genel);
        var byAudience = templates
            .Where(t => t.Audience != GrantNotificationAudience.Genel)
            // Host satırları (TenantId null) tekil indeksin süzgecine girmiyor; çift kayıt gönderimi düşürmesin.
            .GroupBy(t => t.Audience)
            .ToDictionary(g => g.Key, g => g.First());

        if (byAudience.Count == 0)
        {
            return general == null ? [] : [(general, userIds.ToList())];
        }

        var assigned = new Dictionary<GrantNotificationTemplate, List<Guid>>();
        foreach (var userId in userIds)
        {
            var template = byAudience.GetValueOrDefault(await AudienceOfAsync(userId)) ?? general;
            if (template == null)
            {
                continue;
            }

            if (!assigned.TryGetValue(template, out var list))
            {
                assigned[template] = list = [];
            }
            list.Add(userId);
        }

        return assigned.Select(p => (p.Key, p.Value)).ToList();
    }

    private async Task<GrantNotificationAudience> AudienceOfAsync(Guid userId)
    {
        var isAdmin = await IsAdminAsync(userId);

        return CurrentTenant.Id != null
            ? (isAdmin ? GrantNotificationAudience.FirmaYoneticisi : GrantNotificationAudience.FirmaKullanicisi)
            : (isAdmin ? GrantNotificationAudience.HostYoneticisi : GrantNotificationAudience.Danisman);
    }

    /// <summary>
    /// Yönetici, "Hesabına Gir"deki (<see cref="ImpersonationTargetFinder"/>) tanımla aynıdır: statik ya da
    /// "admin" adlı rol, ya da rol izinlerini yönetebilen rol. Kiracı yönetici rolünün adını değiştirse de
    /// yöneticisi yönetici metnini almaya devam eder.
    /// </summary>
    private async Task<bool> IsAdminAsync(Guid userId)
    {
        foreach (var role in await _userRepo.GetRolesAsync(userId))
        {
            if (role.IsStatic
                || string.Equals(role.Name, AdminRoleName, StringComparison.OrdinalIgnoreCase)
                || await _permissionStore.IsGrantedAsync(
                    ImpersonationTargetFinder.AdminPermissionName, RolePermissionValueProvider.ProviderName, role.Name))
            {
                return true;
            }
        }

        return false;
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
        Guid? entityId = null,
        bool? sendEmail = null)
    {
        using (CurrentTenant.Change(tenantId))
        {
            var userIds = await _permittedUsers.ActiveUserIdsAsync();

            return await DispatchAsync(trigger, await WithGrantPermissionAsync(userIds), values, entityType, entityId, sendEmail);
        }
    }

    /// <summary>
    /// N-04 · Yalnız hibeleri görme yetkisi olanlar (kullanıcıya ya da rolüne verilmiş). Eskiden kiracının
    /// bütün etkin kullanıcıları alıyordu: hibe modülüne yetkisi olmayan çalışan da zilde görüp tıklayınca
    /// erişim hatası alıyordu. Kiracıda yetkili kimse yoksa (yanlış yapılandırma) duyuru sessizce
    /// kaybolmasın diye eski davranışa düşülür. Çağıran kiracı bağlamını ayarlamış olmalıdır.
    /// </summary>
    private async Task<List<Guid>> WithGrantPermissionAsync(List<Guid> userIds)
    {
        var allowed = await _permittedUsers.WithPermissionAsync(userIds, RecipientPermission);
        return allowed.Count > 0 ? allowed : userIds;
    }

    /// <summary>
    /// H-03 / N-06 · Başvurunun bir TARAFINA duyuru: firma → başvurunun kiracısı (hibe yetkisi olanlar);
    /// danışman → atanan danışman, atanmamışsa host ekibi. Sihirbaz (mesaj, sıra devri) ve evrak konsolu
    /// (yükleme) aynı kuralı kullanır.
    /// </summary>
    public async Task DispatchToPartyAsync(
        GrantApplication application,
        GrantPartyRole side,
        GrantNotificationTrigger trigger,
        IReadOnlyDictionary<string, string?> values)
    {
        if (!application.TenantId.HasValue)
        {
            return;
        }

        if (side == GrantPartyRole.Firma)
        {
            await DispatchToTenantAsync(trigger, application.TenantId, values, nameof(GrantApplication), application.Id);
            return;
        }

        if (application.AssignedUserId is { } consultantId)
        {
            using (CurrentTenant.Change(null))
            {
                await DispatchAsync(trigger, new[] { consultantId }, values, nameof(GrantApplication), application.Id);
            }
            return;
        }

        await DispatchToTenantAsync(trigger, null, values, nameof(GrantApplication), application.Id);
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
        // Alıcısı belli olmayan metin: Genel şablon.
        var template = (await FindTemplatesAsync(trigger))
            .FirstOrDefault(t => t.Audience == GrantNotificationAudience.Genel);
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
    private async Task<List<GrantNotificationTemplate>> FindTemplatesAsync(GrantNotificationTrigger trigger)
    {
        using (_dataFilter.Disable<IMultiTenant>())
        {
            return await _templateRepo.GetListAsync(t => t.TenantId == null && t.Trigger == trigger);
        }
    }

    /// <summary>
    /// Şablon e-posta diyorsa bile kullanıcının kendi kategori tercihi geçerlidir —
    /// şablon "gönderilebilir mi", tercih "istiyor mu" sorusunu cevaplar.
    ///
    /// <para>Gönderim <c>QueueAsync</c> ile (NotificationManager'daki gerekçeyle): kiracının her
    /// kullanıcısı için döngüde senkron SMTP, danışmanın isteğini sunucu yavaşsa bekletiyordu.</para>
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

            await _emailSender.QueueAsync(user.Email, subject, body);
        }
        catch (Exception ex)
        {
            // E-posta altyapısı akışı kırmamalı; uygulama içi bildirim zaten atıldı.
            Logger.LogWarning(ex, "Hibe bildirim e-postası gönderilemedi. UserId: {UserId}", userId);
        }
    }
}
