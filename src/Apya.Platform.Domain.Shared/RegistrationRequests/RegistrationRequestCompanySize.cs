namespace Apya.Platform.RegistrationRequests;

/// <summary>
/// Kurumdaki yaklaşık çalışan sayısı aralığı. Paket önerisini teyit etmeye yarar
/// (10 kişilik kurumun Standart paketi seçmesi soru işareti doğurur); zorunlu değildir.
/// </summary>
public enum RegistrationRequestCompanySize
{
    UpTo10 = 0,
    From11To50 = 1,
    From51To200 = 2,
    Over200 = 3
}
