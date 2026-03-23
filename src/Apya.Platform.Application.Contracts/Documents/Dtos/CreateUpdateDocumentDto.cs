using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Documents;

public class CreateUpdateDocumentDto
{
    public Guid? ProjectId { get; set; }
    
    public Guid? ParentDocumentId { get; set; }

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    [StringLength(10)]
    public string? Icon { get; set; }
}
