namespace Apya.Platform.Tenants;

/// <summary>Abonelik satırının nereden doğduğu.</summary>
public enum SubscriptionSource
{
    /// <summary>Host yöneticisi kiracı yönetimi ekranından atadı.</summary>
    Manual = 1,

    /// <summary>Ödeme altyapısı tahsilat sonrası açtı/yeniledi. Bugün kullanılmıyor.</summary>
    Payment = 2,

    /// <summary>Süresi dolduğu için otomatik açılan süresiz Basic aboneliği.</summary>
    AutoDowngrade = 3,

    /// <summary>Deneme süresi. Bugün kullanılmıyor.</summary>
    Trial = 4
}
