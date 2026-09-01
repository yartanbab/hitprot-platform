namespace Apya.Platform.DemoRequests;

/// <summary>
/// Talebi gönderen kurumun türü. Talebi önceliklendirmeye ve doğru tanıtım
/// sunumunu (şirket / dernek) seçmeye yarar; zorunlu değildir.
/// </summary>
public enum DemoRequestOrganizationKind
{
    Company = 0,
    Association = 1,
    PublicInstitution = 2,
    Other = 3
}
