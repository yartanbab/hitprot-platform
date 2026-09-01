using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Bir programın (ya da <see cref="GrantId"/> null ise TÜM programların) skorlama
/// ayarı. Host katalog verisidir.
///
/// <para>Boyutlar sabit bir küme olduğu ve <see cref="GrantMatchManager"/>'ın kodunda
/// karşılıkları bulunduğu için satır-başına-boyut yerine TEK SATIR + kolon tutulur:
/// yeni boyut zaten kod değişikliği gerektirir, migration ek maliyet değildir.</para>
///
/// <para>Kapsam iki katmanlıdır: programın kendi satırı varsa o, yoksa küresel satır
/// (GrantId null), o da yoksa <see cref="GrantMatchWeightSet.Default"/>. Çağrı bazlı
/// üçüncü bir katman BİLEREK yok — parametrelerde de dönem override'ı alınmadı.</para>
/// </summary>
public class GrantMatchWeight : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>null = tüm programlar için varsayılan.</summary>
    public Guid? GrantId { get; private set; }

    public double SectorMultiplier { get; set; } = 1.0;
    public double TechnicalMaturityMultiplier { get; set; } = 1.0;
    public double RdStaffMultiplier { get; set; } = 1.0;
    public double RegionMultiplier { get; set; } = 1.0;
    public double ProjectHistoryMultiplier { get; set; } = 1.0;
    public double KeywordMultiplier { get; set; } = 1.0;

    public bool SizePenaltyEnabled { get; set; } = true;
    public bool SkipMissingDimensions { get; set; } = true;

    protected GrantMatchWeight() { }

    public GrantMatchWeight(Guid id, Guid? grantId) : base(id)
    {
        GrantId = grantId;
    }

    public GrantMatchWeightSet ToWeightSet()
    {
        var set = new GrantMatchWeightSet
        {
            SizePenaltyEnabled = SizePenaltyEnabled,
            SkipMissingDimensions = SkipMissingDimensions
        };
        set[GrantMatchDimension.Sector] = SectorMultiplier;
        set[GrantMatchDimension.TechnicalMaturity] = TechnicalMaturityMultiplier;
        set[GrantMatchDimension.RdStaff] = RdStaffMultiplier;
        set[GrantMatchDimension.Region] = RegionMultiplier;
        set[GrantMatchDimension.ProjectHistory] = ProjectHistoryMultiplier;
        set[GrantMatchDimension.Keyword] = KeywordMultiplier;
        return set;
    }

    public void Apply(GrantMatchWeightSet set)
    {
        SectorMultiplier = set[GrantMatchDimension.Sector];
        TechnicalMaturityMultiplier = set[GrantMatchDimension.TechnicalMaturity];
        RdStaffMultiplier = set[GrantMatchDimension.RdStaff];
        RegionMultiplier = set[GrantMatchDimension.Region];
        ProjectHistoryMultiplier = set[GrantMatchDimension.ProjectHistory];
        KeywordMultiplier = set[GrantMatchDimension.Keyword];
        SizePenaltyEnabled = set.SizePenaltyEnabled;
        SkipMissingDimensions = set.SkipMissingDimensions;
    }
}
