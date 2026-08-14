namespace Apya.Platform.Dashboard;

public static class DashboardConsts
{
    public const int MaxViewKeyLength = 64;

    /// <summary>
    /// Kart düzeni JSON'ı için üst sınır. ~12 kart × 3 breakpoint ≈ 1,5 KB;
    /// kart kataloğundan eklemelere yer bırakmak için geniş tutuldu.
    /// </summary>
    public const int MaxCardsJsonLength = 8000;
}
