using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos
{
    // DÝKKAT: Buradaki sýnýf ismi ProjectAnalysisDto olmalý
    public class ProjectAnalysisDto : EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public string Summary { get; set; }
        public string Risks { get; set; }
        public string SuggestedTasksJson { get; set; }
        public int SuccessScore { get; set; }
        public DateTime CreationTime { get; set; }
    }
}