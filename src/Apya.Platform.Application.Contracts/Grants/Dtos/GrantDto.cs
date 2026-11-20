using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantDto : EntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? MaxAmount { get; set; }
    /// <summary>Tutarların para birimi (TRY/EUR/USD/GBP).</summary>
    public string Currency { get; set; } = "TRY";
    public double MinMatchScore { get; set; }

    // Faz A: eşleştirme kriterleri + çağrı sayısı özeti.
    public int EligibleCompanySizes { get; set; }
    /// <summary>Başvurabilecek kurum türleri — OrganizationType bit maskesi (0 = kısıt yok).</summary>
    public int EligibleApplicantTypes { get; set; }
    /// <summary>Platform kurumlarına kapalı (yalnız birey/okul/kamu başvurur).</summary>
    public bool ClosedToPlatformApplicants { get; set; }
    public int CallCount { get; set; }
    public List<GrantCriteriaTagDto> CriteriaTags { get; set; } = new();
}