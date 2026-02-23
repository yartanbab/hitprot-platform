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
        }
    }
}