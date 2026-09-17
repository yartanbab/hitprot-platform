using System;
using System.Globalization;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Users;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Finans olaylarının bildirim çıkışı.
///
/// <para>Arayüz, bütçe servisini saf birim testinde kurabilmek için var
/// (<c>ProjectPortfolio_Tests</c> servisi elle inşa ediyor): tek uygulaması
/// olan bir sınıfa soyutlama açmak yerine seçenek, teste <c>null</c> geçmekti —
/// o da ileride bu yola düşen bir metotta sessiz bir NullReference bırakırdı.</para>
/// </summary>
public interface IFinanceNotificationPublisher
{
    Task RevisionAppliedAsync(Guid projectId, int revisionNo, string reason, decimal totalApproved);
    Task TrancheCollectedAsync(Guid projectId, int sequenceNo, decimal receivedAmount, decimal expectedAmount);
    Task DeductionAddedAsync(Guid projectId, int sequenceNo, decimal amount, string reason);
    Task TrancheDisputedAsync(Guid projectId, int sequenceNo, decimal expectedAmount);
}

/// <summary>
/// Bütçe servisleri metin kurmaz, alıcı aramaz, kiracı bağlamıyla uğraşmaz —
/// tek satırla buraya devreder.
///
/// <para>Ayrı sınıf olmasının sebebi üç işin her çağrı noktasında tekrar etmesi:
/// alıcıyı izinle süzmek, doğru kiracı bağlamına geçmek ve eylemi yapan kişiyi
/// listeden çıkarmak. Dördüncüsü de var: bildirim hatası bütçe kaydını
/// düşürmemeli.</para>
/// </summary>
public class FinanceNotificationPublisher : IFinanceNotificationPublisher, ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly FinanceNotificationRecipientResolver _recipientResolver;
    private readonly NotificationManager _notificationManager;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly ICurrentTenant _currentTenant;
    private readonly ICurrentUser _currentUser;
    private readonly ILogger<FinanceNotificationPublisher> _logger;

    public FinanceNotificationPublisher(
        FinanceNotificationRecipientResolver recipientResolver,
        NotificationManager notificationManager,
        IRepository<Project, Guid> projectRepository,
        IStringLocalizer<PlatformResource> l,
        ICurrentTenant currentTenant,
        ICurrentUser currentUser,
        ILogger<FinanceNotificationPublisher> logger)
    {
        _recipientResolver = recipientResolver;
        _notificationManager = notificationManager;
        _projectRepository = projectRepository;
        _l = l;
        _currentTenant = currentTenant;
        _currentUser = currentUser;
        _logger = logger;
    }

    /// <summary>Bütçe revizyonu yürürlüğe girdi.</summary>
    public Task RevisionAppliedAsync(Guid projectId, int revisionNo, string reason, decimal totalApproved)
        => SendAsync(projectId, NotificationType.BudgetRevisionApplied, project => (
            _l["Notification:BudgetRevision:Title"],
            _l["Notification:BudgetRevision:Body",
                project.Name, revisionNo, reason, Money(totalApproved, project.Currency)]));

    /// <summary>Fonlama dilimi tahsil edildi.</summary>
    public Task TrancheCollectedAsync(Guid projectId, int sequenceNo, decimal receivedAmount, decimal expectedAmount)
        => SendAsync(projectId, NotificationType.FundingTrancheCollected, project => (
            _l["Notification:TrancheCollected:Title"],
            _l["Notification:TrancheCollected:Body",
                project.Name, sequenceNo,
                Money(receivedAmount, project.Currency), Money(expectedAmount, project.Currency)]));

    /// <summary>Dilime kesinti işlendi.</summary>
    public Task DeductionAddedAsync(Guid projectId, int sequenceNo, decimal amount, string reason)
        => SendAsync(projectId, NotificationType.TrancheDeductionAdded, project => (
            _l["Notification:TrancheDeduction:Title"],
            _l["Notification:TrancheDeduction:Body",
                project.Name, sequenceNo, Money(amount, project.Currency), reason]));

    /// <summary>
    /// Dilim itirazlı işaretlendi. İşaret KALDIRILDIĞINDA bildirim gitmez —
    /// süreç başlangıcı haber değeri taşır, geri alınması taşımaz.
    /// </summary>
    public Task TrancheDisputedAsync(Guid projectId, int sequenceNo, decimal expectedAmount)
        => SendAsync(projectId, NotificationType.TrancheDisputed, project => (
            _l["Notification:TrancheDisputed:Title"],
            _l["Notification:TrancheDisputed:Body",
                project.Name, sequenceNo, Money(expectedAmount, project.Currency)]));

    /// <summary>
    /// Ortak gönderim yolu: projeyi bul, kiracısına geç, alıcıları çöz, eylemi
    /// yapanı çıkar, yaz.
    /// </summary>
    private async Task SendAsync(
        Guid projectId,
        NotificationType type,
        Func<Project, (string Title, string Body)> compose)
    {
        try
        {
            var project = await _projectRepository.FindAsync(projectId);
            if (project == null)
            {
                return;
            }

            var (title, body) = compose(project);

            // 🔴 Kiracı bağlamı ZORUNLU: host bir kiracının projesinde işlem
            // yaptığında CurrentTenant.Id null olur ve bildirim satırı TenantId=null
            // yazılırdı. Kiracı kullanıcısı kendi bağlamında okuduğu için o satır
            // global filtreye takılır ve bildirim HİÇ GÖRÜNMEZDİ.
            using (_currentTenant.Change(project.TenantId))
            {
                var recipients = await _recipientResolver.ResolveAsync(projectId);
                var actorName = BuildActorName();

                foreach (var userId in recipients)
                {
                    // Eylemi yapan kendi işleminin bildirimini almaz — mevcut
                    // üreticilerin hepsi bu kuralı uyguluyor.
                    if (_currentUser.Id.HasValue && userId == _currentUser.Id.Value)
                    {
                        continue;
                    }

                    await _notificationManager.PublishAsync(
                        userId, title, body, type,
                        entityType: "Project", entityId: projectId,
                        actorUserId: _currentUser.Id, actorName: actorName);
                }
            }
        }
        catch (Exception ex)
        {
            // Bildirim, kaydın kendisini düşürmemeli: revizyon/tahsilat zaten
            // yazıldı, kullanıcı ekranda görüyor.
            _logger.LogWarning(ex,
                "Finans bildirimi üretilemedi. ProjectId: {ProjectId}, Tür: {Type}", projectId, type);
        }
    }

    /// <summary>Ad ve soyad ABP'de AYRI alanlardır; yalnız Name yazılsaydı soyadı düşerdi.</summary>
    private string? BuildActorName()
    {
        var full = $"{_currentUser.Name} {_currentUser.SurName}".Trim();
        return full.IsNullOrWhiteSpace() ? null : full;
    }

    private static string Money(decimal amount, string currency)
        => $"{amount.ToString("N2", Turkish)} {currency}";
}
