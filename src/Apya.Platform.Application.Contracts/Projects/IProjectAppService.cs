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

        /// <summary>
        /// "Yeni Proje" formunun açılışta doldurduğu boş proje kodu: PRJ-{yıl}-{sıra}.
        /// Sıra, hedef kiracıdaki aynı yıla ait en büyük koddan bir fazlasıdır.
        /// </summary>
        /// <param name="tenantId">Host kullanıcısının adına proje açtığı kiracı; kiracı kullanıcısı için yok sayılır.</param>
        Task<string> GetNextCodeAsync(Guid? tenantId = null);

        /// <summary>
        /// Kodun hedef kiracıda boşta olup olmadığını söyler, doluysa boş bir kod önerir.
        /// Formdaki canlı uyarı bunu kullanır; asıl engelleme CreateAsync içindeki
        /// kontroldedir — istemci kontrolü tek başına yeterli değildir.
        /// </summary>
        Task<ProjectCodeCheckDto> CheckCodeAsync(string code, Guid? tenantId = null);

        // --- DOSYA YÖNETİMİ ---
        Task<ProjectAttachmentDto> AddAttachmentAsync(
            Guid projectId, string fileName, string storedFileName, string contentType, long fileSize, string? title = null);

        /// <summary>Projenin eklerini yeniden eskiye döner.</summary>
        Task<List<ProjectAttachmentDto>> GetAttachmentsAsync(Guid projectId);

        /// <summary>Eki siler; saklanan dosya adını döner ki çağıran diskten de silebilsin.</summary>
        Task<string> DeleteAttachmentAsync(Guid attachmentId);

        // --- KAPAK GÖRSELİ ---
        /// <summary>Kapak görselini ayarlar; varsa eski dosyanın adını döner (silinsin diye).</summary>
        Task<string?> SetCoverImageAsync(Guid projectId, string storedFileName);

        /// <summary>Kapak görselini kaldırır; kaldırılan dosyanın adını döner.</summary>
        Task<string?> RemoveCoverImageAsync(Guid projectId);
    }
}