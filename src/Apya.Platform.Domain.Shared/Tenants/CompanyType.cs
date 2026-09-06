namespace Apya.Platform.Tenants;

public enum CompanyType
{
    Company = 1,        // Şirket
    Association = 2,    // Dernek
    Foundation = 3,     // Vakıf
    SoleProprietorship = 4, // Şahıs Şirketi

    // Aşağıdaki ikisi kayıt talebi formu için eklendi: aday kurum türünü kendisi
    // seçiyor ve seçim hesap açılışında doğrudan TenantProfile'a taşınıyor. Ayrı bir
    // "talep türü" enum'u tutulsaydı eşleme yapılamayan değerler sessizce kaybolurdu.
    PublicInstitution = 5,  // Kamu kurumu
    Other = 6               // Diğer
}
