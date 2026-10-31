using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Invoices;

/// <summary>
/// B-16 · Vadesi geçen fatura muhatabına fatura + vade başına BİR KEZ bildirilir. Fatura listesi "gecikmiş" diyordu
/// ama tahsilat/ödeme günü sessizce geçiyordu. "Gecikmiş" tanımı listeyle aynı: ödenmemiş, iptal edilmemiş, vadesi
/// geçmiş. Muhatap: faturayı kesen + proje sorumluları; yalnız faturaları görme yetkisi olanlar (bağlantı 403 vermesin).
///
/// <para>Yalnız son <see cref="LookbackDays"/> günde vadesi geçenler: özellik yayına girdiğinde eski faturalar toplu
/// bildirilmesin. İşçiden ayrı (doğrudan ölçülür); işçi yalnız çağırır.</para>
/// </summary>
public class InvoiceOverdueNotifier : ITransientDependency
{
    public const int LookbackDays = 30;

    /// <summary>PlatformPermissions.Invoices.Default — Domain sabite başvuramaz; değer eşitliği testle kilitli.</summary>
    public const string ViewPermission = "Platform.Invoices";

    private readonly IRepository<Invoice, Guid> _invoiceRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectMember, Guid> _memberRepository;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly NotificationManager _notificationManager;
    private readonly PermittedUserFinder _permittedUsers;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly NotificationTextComposer _texts;

    public InvoiceOverdueNotifier(
        IRepository<Invoice, Guid> invoiceRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectMember, Guid> memberRepository,
        IDataFilter<IMultiTenant> mtFilter,
        ICurrentTenant currentTenant,
        NotificationManager notificationManager,
        PermittedUserFinder permittedUsers,
        IStringLocalizer<PlatformResource> l,
        NotificationTextComposer texts)
    {
        _texts = texts;
        _invoiceRepository = invoiceRepository;
        _projectRepository = projectRepository;
        _memberRepository = memberRepository;
        _mtFilter = mtFilter;
        _currentTenant = currentTenant;
        _notificationManager = notificationManager;
        _permittedUsers = permittedUsers;
        _l = l;
    }

    /// <summary>Üretilen bildirim sayısı.</summary>
    public async Task<int> RunAsync(DateTime now)
    {
        var today = now.Date;
        var from = today.AddDays(-LookbackDays);

        List<Invoice> invoices;
        Dictionary<Guid, Project> projects;
        Dictionary<Guid, List<Guid>> leads;
        // Faturalar kiracılara dağınık: OKUMA için filtre bilinçli kapatılır; yayın kiracı bağlamında.
        using (_mtFilter.Disable())
        {
            invoices = await _invoiceRepository.GetListAsync(i =>
                i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled
                && i.DueDate < today && i.DueDate >= from);
            if (invoices.Count == 0)
            {
                return 0;
            }

            var projectIds = invoices.Select(i => i.ProjectId).Distinct().ToList();
            projects = (await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id))).ToDictionary(p => p.Id);
            leads = (await _memberRepository.GetListAsync(m => projectIds.Contains(m.ProjectId) && m.Role == ProjectMemberRole.Lead))
                .GroupBy(m => m.ProjectId)
                .ToDictionary(g => g.Key, g => g.Select(m => m.UserId).ToList());
        }

        var published = 0;
        foreach (var tenantGroup in invoices.GroupBy(i => i.TenantId))
        {
            using (_currentTenant.Change(tenantGroup.Key))
            {
                foreach (var invoice in tenantGroup)
                {
                    // Projesi silinmiş fatura duyurulmaz.
                    if (!projects.TryGetValue(invoice.ProjectId, out var project))
                    {
                        continue;
                    }

                    var candidates = leads.GetValueOrDefault(invoice.ProjectId, new List<Guid>()).ToList();
                    if (invoice.CreatorId.HasValue)
                    {
                        candidates.Add(invoice.CreatorId.Value);
                    }

                    var recipients = await _permittedUsers.WithPermissionAsync(candidates.Distinct(), ViewPermission);
                    if (recipients.Count == 0)
                    {
                        continue;
                    }

                    var days = Math.Max(1, (int)(today - invoice.DueDate.Date).TotalDays);
                    // Faz 4b · Metin host şablonundan; yön başlığı değiştirir. Kapalı türde fatura atlanır.
                    var variant = invoice.Direction == InvoiceDirection.Purchase
                        ? NotificationTemplateDefinitions.Purchase
                        : NotificationTemplateDefinitions.Sales;
                    if (await _texts.ComposeAsync(NotificationType.InvoiceOverdue, variant, new Dictionary<string, string?>
                        {
                            ["{fatura_no}"] = invoice.InvoiceNumber,
                            ["{proje_adı}"] = project.Name,
                            ["{gecikme_gün}"] = days.ToString()
                        }) is not { } text)
                    {
                        continue;
                    }
                    var (title, body) = text;
                    var onceKey = $"{(int)NotificationType.InvoiceOverdue}:Invoice:{invoice.Id}:{invoice.DueDate:yyyyMMdd}";

                    foreach (var userId in recipients)
                    {
                        if (await _notificationManager.PublishOnceAsync(
                                userId, onceKey, title, body, NotificationType.InvoiceOverdue,
                                entityType: "Invoice", entityId: invoice.Id))
                        {
                            published++;
                        }
                    }
                }
            }
        }

        return published;
    }
}
