using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

/// <summary>
/// Etkinlik (denetim izi) satırı. Kayıtlar değiştirilemez ve silinmez;
/// yalnızca eklenir (CreationAuditedEntity, delete uç noktası yok).
/// </summary>
public class DocumentActivityDto : EntityDto<Guid>
{
    public DateTime CreationTime { get; set; }
    public Guid? CreatorId { get; set; }
    public string ActorName { get; set; } = string.Empty;
    public string? ActorRole { get; set; }

    public DocumentAccessAction Action { get; set; }
    public string? Detail { get; set; }

    public Guid DocumentId { get; set; }
    public string? FolderName { get; set; }

    public Guid? DocumentFileId { get; set; }
    public string? DocumentFileName { get; set; }
}

public class GetDocumentActivityInput : PagedAndSortedResultRequestDto
{
    /// <summary>Tek bir belgenin izi. Null = tüm kiracı (yetkiye tabi).</summary>
    public Guid? DocumentFileId { get; set; }

    public Guid? ProjectId { get; set; }

    public DocumentAccessAction? Action { get; set; }

    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}
