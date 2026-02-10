using System;

namespace Apya.Platform.Projects.Dtos
{
    // DÝKKAT: Buradaki sýnýf ismi CreateAnalysisDto olmalý
    public class CreateAnalysisDto
    {
        public Guid ProjectId { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Risks { get; set; } = string.Empty;
        public string SuggestedTasksJson { get; set; } = string.Empty;
        public int SuccessScore { get; set; }
    }
}