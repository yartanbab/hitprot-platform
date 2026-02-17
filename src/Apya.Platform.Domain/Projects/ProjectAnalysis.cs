using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects
{
    public class ProjectAnalysis : FullAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }

        // AI'ın çıkaracağı özet metin
        public string Summary { get; set; }

        // Tespit edilen riskler (Virgülle ayrılmış veya JSON)
        public string Risks { get; set; } = string.Empty;

        // Önerilen Görevler (JSON formatında tutacağız)
        public string SuggestedTasksJson { get; set; } = string.Empty;

        // Analiz skoru (0-100 arası başarı ihtimali vb.)
        public int SuccessScore { get; set; }

        public ProjectAnalysis() { }

        public ProjectAnalysis(Guid id, Guid projectId, string summary, string risks, string suggestedTasksJson, int successScore)
            : base(id)
        {
            ProjectId = projectId;
            Summary = summary;
            Risks = risks;
            SuggestedTasksJson = suggestedTasksJson;
            SuccessScore = successScore;
        }
    }
}