using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.Timing;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Bütçe risklerini ölçüp uyarıya çeviren yer: kalem kullanım eşikleri, limit
/// aşımı ve vadesi geçmiş fonlama dilimleri.
///
/// <para>Bu üç durum ekranda ZATEN hesaplanıyordu (<c>UsagePercent</c>,
/// <c>IsOverBudget</c>) ama yalnız okuma anında: kimse ekranı açmazsa kimse
/// öğrenmiyordu. Burada aynı hesap, kullanıcı beklemeden yapılır.</para>
///
/// <para>Koşul bir kez doğru olduktan sonra kalıcı olarak doğru kalır; bu yüzden
/// gönderim <see cref="NotificationManager.PublishOnceAsync"/> ile yapılır.
/// Tekillik anahtarına ONAYLANAN TUTAR da girer: bütçe revize edilince eşikler
/// yeniden kurulur — yeni bütçeye göre yeniden aşım yaşanırsa kullanıcı bunu
/// duyar.</para>
/// </summary>
public class BudgetRiskEvaluator : ITransientDependency
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly FinanceNotificationRecipientResolver _recipientResolver;
    private readonly NotificationManager _notificationManager;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly ISettingProvider _settingProvider;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _multiTenantFilter;
    private readonly IClock _clock;
    private readonly ILogger<BudgetRiskEvaluator> _logger;

    public BudgetRiskEvaluator(
        IRepository<ProjectBudgetLine, Guid> lineRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<FundingTranche, Guid> trancheRepository,
        IRepository<Project, Guid> projectRepository,
        FinanceNotificationRecipientResolver recipientResolver,
        NotificationManager notificationManager,
        IStringLocalizer<PlatformResource> l,
        ISettingProvider settingProvider,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> multiTenantFilter,
        IClock clock,
        ILogger<BudgetRiskEvaluator> logger)
    {
        _lineRepository = lineRepository;
        _expenseRepository = expenseRepository;
        _trancheRepository = trancheRepository;
        _projectRepository = projectRepository;
        _recipientResolver = recipientResolver;
        _notificationManager = notificationManager;
        _l = l;
        _settingProvider = settingProvider;
        _currentTenant = currentTenant;
        _multiTenantFilter = multiTenantFilter;
        _clock = clock;
        _logger = logger;
    }

    /// <summary>
    /// Tek projenin kalemlerini ölçer. Gider yazıldıktan hemen sonra çağrılır:
    /// eşiği aşan harcamayı ertesi günün worker turuna bırakmak, uyarının değerini
    /// düşürürdü.
    /// </summary>
    public async Task EvaluateProjectAsync(Guid projectId)
    {
        try
        {
            var project = await _projectRepository.FindAsync(projectId);
            if (project == null)
            {
                return;
            }

            var lines = await _lineRepository.GetListAsync(l => l.ProjectId == projectId);
            if (lines.Count == 0)
            {
                return;
            }

            var spentByLine = await LoadSpentAsync(new[] { projectId });
            var thresholds = await GetThresholdsAsync();

            using (_currentTenant.Change(project.TenantId))
            {
                var recipients = await _recipientResolver.ResolveAsync(projectId);
                if (recipients.Count == 0)
                {
                    // 🔴 NTF-12: Alıcı kümesi (proje lideri + bütçe görme izni) sessizce
                    // boşalabiliyor; lider ayrılır ya da izni kaldırılırsa bütçe aşımı
                    // KİMSEYE bildirilmiyor ve geriye hiçbir iz kalmıyordu.
                    _logger.LogWarning(
                        "Bütçe uyarısı gönderilemedi: {ProjectId} projesinde bütçe görme izni olan " +
                        "alıcı yok (proje lideri ayrılmış ya da izni kaldırılmış olabilir).", projectId);
                    return;
                }

                foreach (var line in lines)
                {
                    await EvaluateLineAsync(project, line, spentByLine, thresholds, recipients);
                }
            }
        }
        catch (Exception ex)
        {
            // Gider kaydı yazıldı; uyarı üretilemediği için işlemi geri almak yanlış olur.
            _logger.LogWarning(ex, "Bütçe riski değerlendirilemedi. ProjectId: {ProjectId}", projectId);
        }
    }

    /// <summary>
    /// Günlük tarama: tüm kiracılardaki kalemleri ve vadesi geçmiş dilimleri gezer.
    ///
    /// <para>Gider yazımındaki anlık değerlendirme bunu gereksiz kılmaz: gider
    /// silinip yeniden girilebilir, dilim vadesi hiçbir yazma olmadan geçer ve
    /// uygulama kapalıyken yazılan kayıtlar hiç ölçülmemiş olur.</para>
    /// </summary>
    /// <returns>Üretilen bildirim sayısı — worker bunu loglar.</returns>
    public async Task<int> RunDailyScanAsync()
    {
        var thresholds = await GetThresholdsAsync();
        var today = _clock.Now.Date;

        List<ProjectBudgetLine> lines;
        List<Project> projects;
        List<FundingTranche> overdueTranches;
        Dictionary<Guid, decimal> spentByLine;

        // Tek turda tüm kiracılar taranır; gönderim doğru kiracı bağlamında yapılır.
        using (_multiTenantFilter.Disable())
        {
            lines = await _lineRepository.GetListAsync();
            overdueTranches = await _trancheRepository.GetListAsync(t =>
                t.PlannedDate != null
                && t.PlannedDate < today
                && t.Status == FundingTrancheStatus.Pending);

            var projectIds = lines.Select(l => l.ProjectId)
                .Concat(overdueTranches.Select(t => t.ProjectId))
                .Distinct()
                .ToList();

            if (projectIds.Count == 0)
            {
                return 0;
            }

            projects = await _projectRepository.GetListAsync(p => projectIds.Contains(p.Id));
            spentByLine = await LoadSpentAsync(projectIds);
        }

        var sent = 0;

        foreach (var tenantGroup in projects.GroupBy(p => p.TenantId))
        {
            using (_currentTenant.Change(tenantGroup.Key))
            {
                foreach (var project in tenantGroup)
                {
                    var recipients = await _recipientResolver.ResolveAsync(project.Id);
                    if (recipients.Count == 0)
                    {
                        // 🔴 NTF-12: Günlük turda da sessiz atlama yok — bkz. yukarıdaki not.
                        _logger.LogWarning(
                            "Bütçe uyarısı gönderilemedi: {ProjectId} projesinde bütçe görme izni olan " +
                            "alıcı yok (proje lideri ayrılmış ya da izni kaldırılmış olabilir).", project.Id);
                        continue;
                    }

                    foreach (var line in lines.Where(l => l.ProjectId == project.Id))
                    {
                        sent += await EvaluateLineAsync(project, line, spentByLine, thresholds, recipients);
                    }

                    foreach (var tranche in overdueTranches.Where(t => t.ProjectId == project.Id))
                    {
                        sent += await NotifyOverdueTrancheAsync(project, tranche, today, recipients);
                    }
                }
            }
        }

        return sent;
    }

    // ── Ölçüm ────────────────────────────────────────────────────────────────

    private async Task<int> EvaluateLineAsync(
        Project project,
        ProjectBudgetLine line,
        IReadOnlyDictionary<Guid, decimal> spentByLine,
        IReadOnlyList<int> thresholds,
        IReadOnlyCollection<Guid> recipients)
    {
        // Onaylanan tutar sıfırsa yüzde hesaplanamaz; harcama yoksa ölçecek bir şey yok.
        if (line.ApprovedAmount <= 0 || !spentByLine.TryGetValue(line.Id, out var spent) || spent <= 0)
        {
            return 0;
        }

        var percent = (int)Math.Floor(spent / line.ApprovedAmount * 100m);
        var isOverBudget = spent > line.ApprovedAmount;
        var sent = 0;

        if (isOverBudget)
        {
            sent += await PublishOnceAsync(
                project, recipients,
                NotificationType.BudgetOverrun,
                OnceKey(NotificationType.BudgetOverrun, line),
                _l["Notification:BudgetOverrun:Title", line.Name],
                _l["Notification:BudgetOverrun:Body",
                    project.Name, line.Name,
                    Money(line.ApprovedAmount, project.Currency),
                    Money(spent, project.Currency),
                    percent,
                    Money(spent - line.ApprovedAmount, project.Currency)]);
        }

        // Yalnız EN YÜKSEK uygun eşik: sıfırdan %95'e sıçrayan kalem 50/75/90 için
        // üç ayrı satır üretmemeli.
        //
        // Tutar AŞILDIYSA hiçbir eşik uyarısı gitmez: "kullanım %90 eşiğini geçti"
        // satırı, hemen yanındaki "bütçe aşıldı" satırının söylediğinin eksik
        // hâlidir — ikisi birlikte aynı olayı iki kez okutur.
        var mark = isOverBudget
            ? 0
            : thresholds.Where(t => percent >= t).DefaultIfEmpty(0).Max();

        if (mark > 0)
        {
            sent += await PublishOnceAsync(
                project, recipients,
                NotificationType.BudgetUsageThresholdReached,
                $"{OnceKey(NotificationType.BudgetUsageThresholdReached, line)}:{mark}",
                _l["Notification:BudgetThreshold:Title", mark],
                _l["Notification:BudgetThreshold:Body",
                    project.Name, line.Name,
                    Money(line.ApprovedAmount, project.Currency),
                    Money(spent, project.Currency),
                    percent,
                    Money(Math.Max(0m, line.ApprovedAmount - spent), project.Currency)]);
        }

        return sent;
    }

    private async Task<int> NotifyOverdueTrancheAsync(
        Project project,
        FundingTranche tranche,
        DateTime today,
        IReadOnlyCollection<Guid> recipients)
    {
        var plannedDate = tranche.PlannedDate!.Value.Date;
        var daysLate = (today - plannedDate).Days;

        return await PublishOnceAsync(
            project, recipients,
            NotificationType.FundingTrancheOverdue,
            // Vade değişirse anahtar değişir ve uyarı yeniden kurulur: donörle
            // yeni tarihte anlaşıldıysa o tarih de geçerse tekrar haber verilmeli.
            $"{(int)NotificationType.FundingTrancheOverdue}:Tranche:{tranche.Id}:{plannedDate:yyyyMMdd}",
            _l["Notification:TrancheOverdue:Title"],
            _l["Notification:TrancheOverdue:Body",
                project.Name, tranche.SequenceNo,
                plannedDate.ToString("dd.MM.yyyy", Turkish), daysLate,
                Money(tranche.ExpectedAmount, project.Currency)]);
    }

    // ── Yardımcılar ──────────────────────────────────────────────────────────

    private async Task<int> PublishOnceAsync(
        Project project,
        IReadOnlyCollection<Guid> recipients,
        NotificationType type,
        string onceKey,
        string title,
        string body)
    {
        var sent = 0;

        foreach (var userId in recipients)
        {
            if (await _notificationManager.PublishOnceAsync(
                    userId, onceKey, title, body, type,
                    entityType: "Project", entityId: project.Id))
            {
                sent++;
            }
        }

        return sent;
    }

    /// <summary>
    /// Anahtara ONAYLANAN TUTAR girer: revizyon bütçeyi değiştirdiğinde eşik
    /// hafızası sıfırlanır. Girmeseydi, tutarı düşürülen bir kalem yeniden aşılsa
    /// bile kullanıcı bir daha uyarı almazdı.
    /// </summary>
    private static string OnceKey(NotificationType type, ProjectBudgetLine line)
        => $"{(int)type}:BudgetLine:{line.Id}:{line.ApprovedAmount.ToString("0.##", CultureInfo.InvariantCulture)}";

    private async Task<Dictionary<Guid, decimal>> LoadSpentAsync(IReadOnlyCollection<Guid> projectIds)
    {
        var expenses = await _expenseRepository.GetListAsync(
            e => e.ProjectId != null && projectIds.Contains(e.ProjectId.Value) && e.BudgetLineId != null);

        return expenses
            .GroupBy(e => e.BudgetLineId!.Value)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount));
    }

    /// <summary>
    /// Eşikler host ayarından okunur; boş bırakılırsa kullanım uyarısı hiç üretilmez
    /// (aşım bildirimi ayrı, o kapanmaz).
    /// </summary>
    private async Task<IReadOnlyList<int>> GetThresholdsAsync()
    {
        var raw = await _settingProvider.GetOrNullAsync(PlatformSettings.Notifications.BudgetUsageThresholds)
                  ?? PlatformSettingDefaults.BudgetUsageThresholds;

        return raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(part => int.TryParse(part, out var n) ? n : -1)
            .Where(n => n > 0)
            .Distinct()
            .OrderBy(n => n)
            .ToList();
    }

    private static string Money(decimal amount, string currency)
        => $"{amount.ToString("N2", Turkish)} {currency}";
}
