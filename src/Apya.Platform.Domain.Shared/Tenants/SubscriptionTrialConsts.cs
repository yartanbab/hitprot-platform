namespace Apya.Platform.Tenants;

/// <summary>
/// Süreli deneme sınırları. Host ekranındaki gün kutusu ve sunucu aynı değerlerle denetler.
/// </summary>
public static class SubscriptionTrialConsts
{
    public const int MinDays = 1;

    public const int MaxDays = 90;

    public const int DefaultDays = 14;
}
