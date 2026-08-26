using System;
using System.Collections.Generic;

namespace Apya.Platform.Tenants;

/// <summary>
/// Kiracının KENDİ paketini gördüğü ekranın tek yükü. Host'un paket yönetim ekranından
/// (<see cref="PackageDto"/>) ayrıdır ve bilerek DARDIR: izin tavanı, başka kiracıların
/// verisi ve düzenlenebilir hiçbir alan taşımaz — bu uç kiracıya açıktır.
/// </summary>
public class MySubscriptionDto
{
    public PackageCode PackageCode { get; set; }

    /// <summary>Paketin ekranda görünen adı ("Basic", "Standard"…).</summary>
    public string PackageName { get; set; } = string.Empty;

    /// <summary>
    /// Yürürlükteki abonelik dönemi. <c>null</c> = kiracının abonelik satırı HİÇ YOK →
    /// süresiz sayılır (özellik devreye girmeden önce kurulmuş kiracılar). "Süresi dolmuş"
    /// ile karıştırılmamalı.
    /// </summary>
    public SubscriptionPeriod? Period { get; set; }

    public DateTime? StartDate { get; set; }

    /// <summary>Paketin fiilen kapanacağı an (ek süre verildiyse o). Süresizde <c>null</c>.</summary>
    public DateTime? EndDate { get; set; }

    public SubscriptionStatus? Status { get; set; }

    /// <summary>Bitiş tarihi yok — süre uyarısı ve geri sayım gösterilmez.</summary>
    public bool IsUnlimited { get; set; }

    /// <summary>Ek süre (grace) içinde: süre doldu ama paket hâlâ açık.</summary>
    public bool IsInGrace { get; set; }

    /// <summary>Bitişe kalan tam gün. Süresizde <c>null</c>; geçmişse 0.</summary>
    public int? DaysRemaining { get; set; }

    /// <summary>Sayısal kotalar (kullanıcı, proje) — kullanım/limit.</summary>
    public List<QuotaUsageDto> Quotas { get; set; } = new();

    /// <summary>Paketin yetenekleri; kapalı olanlar da listelenir (yükseltme gerekçesi).</summary>
    public List<PackageCapabilityDto> Capabilities { get; set; } = new();

    /// <summary>Bu paketin üstündeki paketler ve getirdikleri. Enterprise'da boş kalır.</summary>
    public List<UpgradeOptionDto> UpgradeOptions { get; set; } = new();

    /// <summary>Yükseltme için satış e-postası (host ayarı). Boş = düğme basılmaz.</summary>
    public string? UpgradeContactEmail { get; set; }

    /// <summary>Yükseltme için telefon (host ayarı). Boş = düğme basılmaz.</summary>
    public string? UpgradeContactPhone { get; set; }

    /// <summary>Dış satış/fiyat sayfası (host ayarı). Boş = bağlantı basılmaz.</summary>
    public string? UpgradeUrl { get; set; }

    /// <summary>
    /// Yükseltme çağrısı gösterilebilir mi? Üst paket VARSA ve host en az bir iletişim
    /// kanalı tanımladıysa. Kanal yokken çağrı basmak kullanıcıyı boşa çıkarır.
    /// </summary>
    public bool HasUpgradeChannel =>
        !string.IsNullOrWhiteSpace(UpgradeContactEmail)
        || !string.IsNullOrWhiteSpace(UpgradeContactPhone)
        || !string.IsNullOrWhiteSpace(UpgradeUrl);
}

/// <summary>Bir sayısal kotanın kullanımı.</summary>
public class QuotaUsageDto
{
    /// <summary>Feature adı — ekranın ikon/etiket seçimi için kararlı kimlik.</summary>
    public string Name { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public int Used { get; set; }

    public int Max { get; set; }

    /// <summary>Limit pratikte sınırsız (bkz. <see cref="MySubscriptionConsts.UnlimitedQuotaThreshold"/>).</summary>
    public bool IsUnlimited { get; set; }

    /// <summary>Doluluk yüzdesi (0–100). Sınırsızda 0.</summary>
    public int UsagePercent { get; set; }
}

/// <summary>Paketin bir yeteneği (modül/özellik) açık mı?</summary>
public class PackageCapabilityDto
{
    public string Name { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public bool Enabled { get; set; }
}

/// <summary>Üst paketin bu kiracıya ne kazandıracağı — yükseltme kartının içeriği.</summary>
public class UpgradeOptionDto
{
    public PackageCode PackageCode { get; set; }

    public string PackageName { get; set; } = string.Empty;

    /// <summary>Bu pakete geçince AÇILACAK yeteneklerin etiketleri (bugün kapalı olanlar).</summary>
    public List<string> UnlockedCapabilities { get; set; } = new();

    /// <summary>Bu pakete geçince YÜKSELECEK kotalar.</summary>
    public List<QuotaGainDto> QuotaGains { get; set; } = new();
}

/// <summary>Üst pakette bir kotanın ne kadar yükseleceği. Metne çevirmek EKRANIN işi.</summary>
public class QuotaGainDto
{
    public string Name { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public int CurrentMax { get; set; }

    public int TargetMax { get; set; }

    /// <summary>Hedef limit pratikte sınırsız — ekran sayı yerine "sınırsız" yazar.</summary>
    public bool TargetIsUnlimited { get; set; }
}

public static class MySubscriptionConsts
{
    /// <summary>
    /// Bu değerin üstündeki kota "sınırsız" gösterilir. Enterprise paketi limitleri
    /// 100.000 olarak tanımlar (<c>PackageDefinitions</c>); ekranda "100000 kullanıcı"
    /// yazmak yerine sınırsız denir.
    /// </summary>
    public const int UnlimitedQuotaThreshold = 100000;
}
