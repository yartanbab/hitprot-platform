using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Dış bağlantı KAYDI (e-posta kutusu, muhasebe, soğuk arşiv, sürücü eşitleme).
///
/// ⚠ Bu entity yalnız YAPILANDIRMA tutar; bağlantıyı gerçekten kuran bir
/// altyapı henüz yok. Durum alanı bilinçli olarak "kurulum bekliyor" varsayılanıyla
/// doğar ve hiçbir yerde kendiliğinden "bağlı"ya dönmez — çalışmayan bir
/// entegrasyonu bağlı göstermek, kullanıcının veri aktığını sanmasına yol açardı.
///
/// Webhook tarafı için ayrı kayıt YOK: mevcut DynamicAssets.WebhookSubscription
/// altyapısı kullanılır, belge olayları oraya yayınlanır.
/// </summary>
public class DocumentIntegration : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public DocumentIntegrationKind Kind { get; private set; }

    public string Name { get; private set; } = null!;

    /// <summary>Hedef adres/kimlik (arge-114@belge.apya.io, s3://... gibi). Sır TAŞIMAZ.</summary>
    public string? Target { get; private set; }

    /// <summary>Sağlayıcıya özel ayarlar (JSON). Parola/anahtar buraya YAZILMAZ.</summary>
    public string? SettingsJson { get; private set; }

    public bool IsEnabled { get; private set; }

    public DateTime? LastSyncAt { get; private set; }

    protected DocumentIntegration() { }

    public DocumentIntegration(
        Guid id,
        Guid? tenantId,
        DocumentIntegrationKind kind,
        string name,
        string? target = null,
        string? settingsJson = null) : base(id)
    {
        TenantId = tenantId;
        Kind = kind;
        SetName(name);
        Target = target;
        SettingsJson = settingsJson;
        IsEnabled = false;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.DocumentIntegrationNameRequired);

        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: RuleConsts.MaxRuleNameLength).Trim();
    }

    public void Update(string name, string? target, string? settingsJson, bool isEnabled)
    {
        SetName(name);
        Target = string.IsNullOrWhiteSpace(target) ? null : target.Trim();
        SettingsJson = settingsJson;
        IsEnabled = isEnabled;
    }

    /// <summary>Gerçek bir eşitleme gerçekleştiğinde çağrılır. Faz D'de çağıran yok.</summary>
    public void MarkSynced(DateTime now) => LastSyncAt = now;
}
