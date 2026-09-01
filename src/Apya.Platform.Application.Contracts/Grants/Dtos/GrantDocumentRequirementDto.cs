using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

/// <summary>1b · Evrak &amp; Belgeler satırı.</summary>
public class GrantDocumentRequirementDto
{
    public int Order { get; set; }

    [Required(ErrorMessage = "Belge adı zorunludur.")]
    [StringLength(128, ErrorMessage = "Belge adı en fazla {1} karakter olabilir.")]
    public string Name { get; set; } = string.Empty;

    public GrantDocumentObligation Obligation { get; set; }

    public GrantPartyRole UploaderParty { get; set; }

    public bool RequiresESignature { get; set; }
}
