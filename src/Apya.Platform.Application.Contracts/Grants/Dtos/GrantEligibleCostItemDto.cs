namespace Apya.Platform.Grants.Dtos;

/// <summary>Programda AÇIK bir harcama kalemi. Listede olmayan kalem kapalıdır.</summary>
public class GrantEligibleCostItemDto
{
    public GrantCostItemKind Kind { get; set; }

    /// <summary>Kalemin üst limiti (%). null = limit yok.</summary>
    public int? LimitPercent { get; set; }
}
