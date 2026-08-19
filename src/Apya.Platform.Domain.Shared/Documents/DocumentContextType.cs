namespace Apya.Platform.Documents;

/// <summary>
/// Klasörün bağlam tipi — sol bağlam ağacındaki gruplamayı belirler.
/// Custom, kullanıcının kendi tanımladığı bağlamlar içindir ("yeni bağlam tipi").
/// </summary>
public enum DocumentContextType
{
    Custom = 0,
    Project = 1,
    Finance = 2,
    HumanResources = 3,
    Contracts = 4
}
