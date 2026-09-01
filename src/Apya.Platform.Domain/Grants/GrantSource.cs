using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1a · Taranan resmî çağrı kaynağı (TÜBİTAK, KOSGEB, kalkınma ajansı…). Host
/// kataloğudur (TenantId null).
///
/// <para><b>Kazıma yalnız TASLAK üretir</b> — kaynaktan gelen çağrı
/// <see cref="GrantCallStatus.Taslak"/> ile doğar ve host yayınlayana kadar kiracıda
/// ya da kamu sayfasında görünmez.</para>
/// </summary>
public class GrantSource : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; private set; } = null!;

    /// <summary>Çağrı listesinin adresi. Boşken kaynak taranamaz (koşu "atlandı" döner).</summary>
    public string? Url { get; set; }

    public bool IsActive { get; set; } = true;

    /// <summary>Son BAŞARILI koşunun zamanı — liste satırındaki "son tarama" değeri.</summary>
    public DateTime? LastScrapedAt { get; set; }

    protected GrantSource() { }

    public GrantSource(Guid id, string name) : base(id)
    {
        SetName(name);
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 96).Trim();
    }

    /// <summary>Liste satırındaki mono baş harf kutusu için.</summary>
    public string Initial => string.IsNullOrWhiteSpace(Name) ? "?" : Name.Trim()[..1].ToUpperInvariant();
}
