using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos
{
    // D�KKAT: Buradaki s�n�f ismi ProjectAnalysisDto olmal�
    public class ProjectAnalysisDto : EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Risks { get; set; } = string.Empty;
        public string SuggestedTasksJson { get; set; } = string.Empty;
        public int SuccessScore { get; set; }
        public DateTime CreationTime { get; set; }
    }
}