using System;
using Apya.Platform.Projects;

namespace Apya.Platform.Grants.Dtos;

/// <summary>1c · Gönderim süzgeci (sol kolon).</summary>
public class PreviewHostRecommendationInput
{
    public Guid GrantCallId { get; set; }

    /// <summary>CompanySize bit-maskesi. null/0 = ölçek kısıtı yok.</summary>
    public int? Sizes { get; set; }

    public decimal? BudgetMin { get; set; }
    public decimal? BudgetMax { get; set; }
    public ProjectCategory? Category { get; set; }

    /// <summary>Asgari uyum skoru. Programın kendi eşiğinden bağımsızdır — host burada gevşetebilir.</summary>
    public int MinScore { get; set; }

    /// <summary>Bu çağrı daha önce gönderilmiş firmaları listeden çıkar.</summary>
    public bool ExcludeAlreadySent { get; set; }

    /// <summary>Bu çağrıya başvurmuş firmaları listeden çıkar.</summary>
    public bool ExcludeApplied { get; set; }

    /// <summary>Yalnız tüm şartları KANITLI biçimde sağlayan firmalar.</summary>
    public bool OnlyEligible { get; set; }
}
