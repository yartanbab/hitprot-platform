using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kural calistirma kaydi — kuru (dry-run) veya gercek.
///
/// Kuru calistirma da KAYDEDILIR: "bu kural ne yapardi" sorusunun yanitini
/// sonradan gorebilmek, kurali acmadan once guven olusturmanin tek yolu.
/// Append-only.
/// </summary>
public class DocumentRuleRun : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid RuleId { get; set; }

    public bool IsDryRun { get; set; }

    public int MatchedCount { get; set; }

    public int AffectedCount { get; set; }

    /// <summary>Etkilenen ilk N belgenin adi (JSON dizi) — kullaniciya ornek gostermek icin.</summary>
    public string? SampleJson { get; set; }

    public DocumentRuleRun() { }

    public DocumentRuleRun(
        Guid id, Guid? tenantId, Guid ruleId, bool isDryRun,
        int matchedCount, int affectedCount, string? sampleJson) : base(id)
    {
        TenantId = tenantId;
        RuleId = ruleId;
        IsDryRun = isDryRun;
        MatchedCount = matchedCount;
        AffectedCount = affectedCount;
        SampleJson = sampleJson;
    }
}
