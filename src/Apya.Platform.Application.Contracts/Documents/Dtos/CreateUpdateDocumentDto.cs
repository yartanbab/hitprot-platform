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

    /// <summary>
    /// Boş dize, null DEĞİL (DOC-06): MVC form bağlaması boş textarea'yı varsayılan olarak null'a
    /// çeviriyordu; AppDocuments.Content NOT NULL olduğu için belge/klasör kaydı 500'e düşüyordu.
    /// </summary>
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string Content { get; set; } = string.Empty;

    [StringLength(10)]
    public string? Icon { get; set; }

    public DateTime? ExpiryDate { get; set; }
}
