using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class GetDocumentsInput : PagedAndSortedResultRequestDto
{
    public string? FilterText { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? ParentDocumentId { get; set; }
    public bool RootLevelOnly { get; set; }
}
