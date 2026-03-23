using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Tasks;
using Volo.Abp.Data; // EKLENDİ: IDataFilter arayüzü için gerekli
using Volo.Abp.MultiTenancy; // EKLENDİ: IMultiTenant arayüzü için gerekli

// Derleyiciye çakışmayı önleme talimatı
using TaskDto = Apya.Platform.Tasks.TaskDto;

namespace Apya.Platform.Web.Pages.Projects;

public class ProjectDetailsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ProjectDto? Project { get; set; }
    public List<TaskDto> Tasks { get; set; } = new();

    // AI Karar Motoru Değişkenleri (APYA - Karar Motoru MVP)
    public int AiRiskScore { get; set; } = 0;
    public string AiRiskMessage { get; set; } = string.Empty;
    public string AiRiskColor { get; set; } = "success";

    private readonly IProjectAppService _projectAppService;
    private readonly ITaskAppService _taskAppService;

    // EKLENDİ: ABP'nin Veri Filtresi yöneticisi
    private readonly IDataFilter _dataFilter;

    // Constructor (Oluşturucu) güncellendi
    public ProjectDetailsModel(
        IProjectAppService projectAppService,
        ITaskAppService taskAppService,
        IDataFilter dataFilter)
    {
        _projectAppService = projectAppService;
        _taskAppService = taskAppService;
        _dataFilter = dataFilter;
    }

    public async System.Threading.Tasks.Task OnGetAsync()
    {
        // KİLİT NOKTA: Host (Ana Yönetici) kullanıcısının, müşterilere (Tenant) ait projeleri 
        // ve görevleri de görebilmesi için Multi-Tenancy filtresini bu bloğun içinde devredışı bırakıyoruz.
        using (_dataFilter.Disable<IMultiTenant>())
        {
            // 1. Proje bilgilerini çekiyoruz (Filtre kapalı olduğu için artık bulabilecek)
            Project = await _projectAppService.GetAsync(Id);

            // 2. Bu projeye ait görevleri çekiyoruz (Müşteriye ait görevleri de getirecek)
            var taskResult = await _taskAppService.GetListAsync(new GetTasksInput { ProjectId = Id });
            Tasks = taskResult.Items.ToList();

            // 3. YAPAY ZEKA RİSK SKORU HESAPLAMASI (KARAR MOTORU)
            CalculateAiRiskScore();
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
}