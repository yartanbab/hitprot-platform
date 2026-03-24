using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Volo.Abp.Data;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Domain.Repositories;

// Derleyiciye çakışmayı önleme talimatı
using TaskDto = Apya.Platform.Tasks.TaskDto;

namespace Apya.Platform.Web.Pages.Projects;

public class ProjectDetailsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ProjectDto? Project { get; set; }
    public List<TaskDto> Tasks { get; set; } = new();

    // AI Karar Motoru
    public int AiRiskScore { get; set; } = 0;
    public string AiRiskMessage { get; set; } = string.Empty;
    public string AiRiskColor { get; set; } = "success";

    // --- OPERASYON MERKEZi METRiKLERi ---
    public string TenantName { get; set; } = string.Empty;
    public bool IsInternalProject { get; set; } = true;

    // Kalan Sure & Zaman Sapma
    public int RemainingDays { get; set; } = 0;
    public int TotalProjectDays { get; set; } = 0;
    public int TimeUsagePercent { get; set; } = 0;
    public string TimeHealthColor { get; set; } = "success";
    public string TimeHealthLabel { get; set; } = "Saglam";

    // Butce Tuketimi
    public decimal BudgetSpent { get; set; } = 0;
    public int BudgetPercent { get; set; } = 0;
    public string CurrencySymbol { get; set; } = "TL";

    private readonly IProjectAppService _projectAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IDataFilter _dataFilter;
    private readonly ITenantStore _tenantStore;
    private readonly IRepository<TaskTimeLog, Guid> _timeLogRepository;

    public ProjectDetailsModel(
        IProjectAppService projectAppService,
        ITaskAppService taskAppService,
        IDataFilter dataFilter,
        ITenantStore tenantStore,
        IRepository<TaskTimeLog, Guid> timeLogRepository)
    {
        _projectAppService = projectAppService;
        _taskAppService = taskAppService;
        _dataFilter = dataFilter;
        _tenantStore = tenantStore;
        _timeLogRepository = timeLogRepository;
    }

    public async System.Threading.Tasks.Task OnGetAsync()
    {
        // KİLİT NOKTA: Host (Ana Yönetici) kullanıcısının, müşterilere (Tenant) ait projeleri 
        // ve görevleri de görebilmesi için Multi-Tenancy filtresini bu bloğun içinde devredışı bırakıyoruz.
        using (_dataFilter.Disable<IMultiTenant>())
        {
            // 1. Proje bilgileri
            Project = await _projectAppService.GetAsync(Id);

            // 2. Gorevler
            var taskResult = await _taskAppService.GetListAsync(new GetTasksInput { ProjectId = Id });
            Tasks = taskResult.Items.ToList();

            // 3. AI Risk Skoru
            CalculateAiRiskScore();

            // 4. Operasyon Merkezi Metrikleri
            await CalculateOperationMetricsAsync();
        }
    }

    private void CalculateAiRiskScore()
    {
        if (Tasks.Count == 0)
        {
            AiRiskScore = 0;
            AiRiskMessage = "Projede henüz görev yok. Öngörü için görev eklemeye başlayın.";
            AiRiskColor = "secondary";
            return;
        }

        int riskFactor = 0;
        var now = DateTime.Now;

        // 1. Gecikmiş Görevler Analizi (Durum 4=Tamamlandı değilse)
        int delayedTasks = Tasks.Count(t => t.DueDate.HasValue && t.DueDate.Value < now && (int)t.Status != 4);
        
        // 2. Kritik Öncelikli Bekleyen Görevler Analizi (Öncelik 4=Critical)
        int criticalPending = Tasks.Count(t => (int)t.Priority == 4 && (int)t.Status != 4);

        // 3. Genel Tamamlanma Oranına Göre Gecikme Algoritması
        int totalTasks = Tasks.Count;
        int completedTasks = Tasks.Count(t => (int)t.Status == 4);
        double completionRate = totalTasks > 0 ? (double)completedTasks / totalTasks : 0;

        // Ağırlıklar: Geciken her görev +15 Risk, Bekleyen her kritik görev +20 Risk
        riskFactor += (delayedTasks * 15);
        riskFactor += (criticalPending * 20);

        // Eğer proje bitiş tarihine yaklaşmış ama completionRate düşükse ek risk
        if (Project != null && Project.EndDate.HasValue)
        {
            var totalDays = (Project.EndDate.Value - (Project.StartDate ?? now)).TotalDays;
            var daysPassed = (now - (Project.StartDate ?? now)).TotalDays;
            
            if (totalDays > 0)
            {
                double timeElapsedRate = daysPassed / totalDays;
                // Örn: Sürenin %80'i geçmiş ama işlerin %40'ı bitmişse
                if (timeElapsedRate > 0.5 && completionRate < (timeElapsedRate - 0.2))
                {
                    riskFactor += 30; // Zaman daralması cezası
                }
            }
        }

        AiRiskScore = Math.Min(riskFactor, 100);

        if (AiRiskScore < 20)
        {
            AiRiskMessage = "Proje planlara uygun seyrediyor. Beklenen risk minimum seviyede.";
            AiRiskColor = "success";
        }
        else if (AiRiskScore < 60)
        {
            AiRiskMessage = $"Dikkat: {delayedTasks} gecikmiş ve {criticalPending} kritik görev efor kaybına yol açıyor.";
            AiRiskColor = "warning";
        }
        else
        {
            AiRiskMessage = $"Kritik Seviye! Gecikmeler ve daralan süre nedeniyle teslimat riski %{AiRiskScore} olarak öngörüldü.";
            AiRiskColor = "danger";
        }
    }

    private async System.Threading.Tasks.Task CalculateOperationMetricsAsync()
    {
        if (Project == null) return;

        // --- TENANT ROZETI ---
        if (Project.TenantId.HasValue)
        {
            var tenant = await _tenantStore.FindAsync(Project.TenantId.Value);
            TenantName = tenant?.Name ?? "Bilinmeyen";
            IsInternalProject = false;
        }
        else
        {
            TenantName = "Platform (Host)";
            IsInternalProject = true;
        }

        // --- PARA BIRIMI SEMBOLU ---
        CurrencySymbol = (Project.Currency ?? "TRY") switch
        {
            "USD" => "$",
            "EUR" => "\u20AC",
            _ => "\u20BA"
        };

        // --- KALAN SURE & ZAMAN SAPMASI ---
        var now = DateTime.Now;
        if (Project.StartDate.HasValue && Project.EndDate.HasValue)
        {
            TotalProjectDays = (int)(Project.EndDate.Value - Project.StartDate.Value).TotalDays;
            var daysPassed = (int)(now - Project.StartDate.Value).TotalDays;
            RemainingDays = Math.Max(0, (int)(Project.EndDate.Value - now).TotalDays);

            TimeUsagePercent = TotalProjectDays > 0
                ? Math.Min(100, (int)Math.Round((double)daysPassed / TotalProjectDays * 100))
                : 0;

            // Trafik Isigi: Zaman tuketimi vs Gorev tamamlanma kiyaslamasi
            var totalTasks = Tasks.Count;
            var completedTasks = Tasks.Count(t => (int)t.Status == 4);
            var completionRate = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0;

            if (TimeUsagePercent > 80 && completionRate < 50)
            {
                TimeHealthColor = "danger";
                TimeHealthLabel = "Kritik";
            }
            else if (TimeUsagePercent > 50 && completionRate < (TimeUsagePercent - 20))
            {
                TimeHealthColor = "warning";
                TimeHealthLabel = "Dikkat";
            }
            else
            {
                TimeHealthColor = "success";
                TimeHealthLabel = "Saglam";
            }
        }

        // --- BUTCE TUKETIMI ---
        var taskIds = Tasks.Select(t => t.Id).ToList();
        if (taskIds.Any())
        {
            var timeLogs = await _timeLogRepository.GetListAsync(x => taskIds.Contains(x.TaskId));
            var totalSeconds = timeLogs.Sum(x => x.SecondsSpent ?? 0);
            BudgetSpent = (decimal)(totalSeconds / 3600.0) * Project.HourlyRate;
        }

        BudgetPercent = Project.TotalBudget > 0
            ? Math.Min(100, (int)Math.Round((double)(BudgetSpent / Project.TotalBudget) * 100))
            : 0;
    }
}