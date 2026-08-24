using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

/// <summary>
/// Proje düzenleme ekranındaki dosya listesinin satırı.
/// İndirme adresi StoredFileName'den kurulur: /api/file/get/{StoredFileName}
/// </summary>
public class ProjectAttachmentDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public long FileSize { get; set; }
    public DateTime CreationTime { get; set; }

    /// <summary>Görsel mi? Listede küçük önizleme gösterilip gösterilmeyeceğini belirler.</summary>
    public bool IsImage { get; set; }
}
