namespace Apya.Platform.DemoRequests;

/// <summary>
/// Kurumdaki yaklaşık çalışan sayısı aralığı. Paket önerisi için kaba bir
/// göstergedir; zorunlu değildir.
/// </summary>
public enum DemoRequestCompanySize
{
    UpTo10 = 0,
    From11To50 = 1,
    From51To200 = 2,
    Over200 = 3
}
