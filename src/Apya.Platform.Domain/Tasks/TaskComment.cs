using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks
{
    public class TaskComment : FullAuditedEntity<Guid>, IMultiTenant
    {
        /// <summary>Görevin kiracısı; görevden kopyalanır (bkz. kurucu).</summary>
        public Guid? TenantId { get; set; }

        public Guid TaskId { get; set; } // Hangi göreve ait?
        public string Text { get; set; } = null!; // Yorum içeriği

        // Instagram tarzı yanıt: bir yoruma verilen cevap. null ise kök yorum.
        public Guid? ParentCommentId { get; set; }

        // Dış paylaşım thread'i. null = ekip içi yorum, misafire ASLA gösterilmez.
        // Dolu = o linkin konuşması; misafir yalnız kendi ShareLinkId'sini görür, ekip
        // aynı thread'e yanıt yazarak misafirle konuşur. Görünürlük kuralının tamamı
        // bu tek kolonda: "ShareLinkId dolu olan içerik o dış paylaşıma aittir."
        public Guid? ShareLinkId { get; set; }

        // Constructor
        public TaskComment() { }

        /// <param name="tenantId">
        /// GÖREVİN kiracısı. Geçerli bağlamdan alınmaz: misafir paylaşım bağlantısı ve host
        /// işlemleri kiracı bağlamı olmadan çalışır, yorum yine görevin kiracısına aittir.
        /// </param>
        public TaskComment(Guid taskId, Guid? tenantId, string text, Guid? parentCommentId = null)
        {
            TaskId = taskId;
            TenantId = tenantId;
            ParentCommentId = parentCommentId;
            SetText(text);
        }

        public void SetText(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.BusinessException("Platform:Task:CommentRequired", "Yorum içeriği boş olamaz.");
            }
            Text = text.Trim();
        }
    }
}