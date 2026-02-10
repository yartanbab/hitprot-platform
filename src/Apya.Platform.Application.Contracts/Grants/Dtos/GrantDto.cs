using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantDto : EntityDto<Guid>
{
    public string Name { get; set; }
    public string Issuer { get; set; } // Kurum (TÜBİTAK vb.)
    public int MinMatchScore { get; set; } // Min. Puan
    public decimal MaxAmount { get; set; } // Hata veren alan buydu
}