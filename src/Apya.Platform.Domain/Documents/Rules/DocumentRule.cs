using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Kural motorunun bir kuralı: "Eğer ... Ve ... O zaman ...".
///
/// Kurallar KİRACIYA aittir (sistem kuralı yok) — otomatik belge taşıma/etiketleme
/// kurumun kendi iş akışıdır, platformun varsayımı değil.
/// </summary>
public class DocumentRule : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public DocumentRuleTrigger Trigger { get; private set; }

    /// <summary>Koşulların birbirine bağlanma biçimi (tümü/herhangi biri).</summary>
    public DocumentRuleLogicalOperator LogicalOperator { get; private set; } = DocumentRuleLogicalOperator.And;

    public bool IsEnabled { get; private set; }

    public int Order { get; private set; }

    /// <summary>Son gerçek (kuru olmayan) çalıştırma zamanı.</summary>
    public DateTime? LastRunAt { get; private set; }

    /// <summary>Son çalıştırmada kaç belgeye dokunuldu — yönetim listesindeki "etki" kolonu.</summary>
    public int LastAffectedCount { get; private set; }

    /// <summary>Kuralın bugüne kadar toplam kaç belgeye dokunduğu.</summary>
    public int TotalAffectedCount { get; private set; }

    protected DocumentRule() { }

    public DocumentRule(
        Guid id,
        Guid? tenantId,
        string name,
        DocumentRuleTrigger trigger,
        DocumentRuleLogicalOperator logicalOperator = DocumentRuleLogicalOperator.And,
        string? description = null,
        bool isEnabled = false,
        int order = 0) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        Trigger = trigger;
        LogicalOperator = logicalOperator;
        Description = description;
        // Yeni kural KAPALI doğar: kullanıcı önce kuru çalıştırıp etkisini görsün.
        IsEnabled = isEnabled;
        Order = order;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentRuleNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: RuleConsts.MaxRuleNameLength).Trim();
    }

    public void Update(
        string name,
        string? description,
        DocumentRuleTrigger trigger,
        DocumentRuleLogicalOperator logicalOperator,
        int order)
    {
        SetName(name);
        Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim();
        Trigger = trigger;
        LogicalOperator = logicalOperator;
        Order = order;
    }

    public void SetEnabled(bool isEnabled) => IsEnabled = isEnabled;

    /// <summary>Gerçek çalıştırma sonrası sayaçları günceller. Kuru çalıştırma bunu ÇAĞIRMAZ.</summary>
    public void RegisterRun(int affectedCount, DateTime now)
    {
        LastRunAt = now;
        LastAffectedCount = affectedCount;
        TotalAffectedCount += affectedCount;
    }
}
