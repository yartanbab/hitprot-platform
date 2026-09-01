using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a · Tek bir kaynak tarama koşusunun kaydı. Kaynak listesindeki durum chip'i
/// (<c>N yeni</c> / <c>güncel</c> / <c>düzelt</c>) o kaynağın EN SON koşusundan türetilir.
/// </summary>
public class GrantScrapeRun : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid SourceId { get; private set; }

    public DateTime StartedAt { get; private set; }
    public DateTime? FinishedAt { get; set; }
    public GrantScrapeRunStatus Status { get; set; }

    /// <summary>Kaynakta bulunan çağrı sayısı.</summary>
    public int FoundCount { get; set; }

    /// <summary>Bunlardan taslak olarak İLK KEZ eklenen sayısı.</summary>
    public int NewCount { get; set; }

    /// <summary>Hata metni. Atlanan koşularda boştur — sebebi <see cref="Status"/> anlatır.</summary>
    public string? Message { get; set; }

    protected GrantScrapeRun() { }

    public GrantScrapeRun(Guid id, Guid sourceId, DateTime startedAt) : base(id)
    {
        SourceId = sourceId;
        StartedAt = startedAt;
    }
}
