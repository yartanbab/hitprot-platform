using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Projects
{
    public interface IProjectAppService :
        ICrudAppService<
            ProjectDto,
            Guid,
            PagedAndSortedResultRequestDto,
            CreateProjectDto>
    {
        Task<List<GrantDto>> GetAllGrantsAsync();

        /// <summary>
        /// ProjectDetails ekranı için tüm view-ready veriyi tek çağrıda döner:
        /// proje, görevler, AI risk, zaman/bütçe metrikleri.
        /// </summary>
        Task<ProjectDetailDto> GetDetailAsync(Guid id);

        /// <summary>
        /// Projeler listesi KPI şeridi için tüm (sayfalanmamış) proje setinin özetini döner.
        /// </summary>
        Task<ProjectsSummaryDto> GetProjectsSummaryAsync();

        // --- DOSYA YÖNETİMİ ---
        Task AddAttachmentAsync(Guid projectId, string fileName, string storedFileName, long fileSize);
    }
}