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

        // --- DOSYA YÖNETİMİ ---
        Task AddAttachmentAsync(Guid projectId, string fileName, string storedFileName, long fileSize);

        // --- ANALİZ VE HİBE METODLARI (Hata verenler bunlardı) ---
        Task<ProjectAnalysisDto?> GetAnalysisAsync(Guid projectId);
        Task<ProjectAnalysisDto> AddAnalysisAsync(CreateAnalysisDto input);
        Task<List<GrantDto>> GetSuitableGrantsAsync(Guid projectId);
    }
}