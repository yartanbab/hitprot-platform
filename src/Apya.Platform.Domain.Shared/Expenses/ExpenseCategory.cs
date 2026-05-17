namespace Apya.Platform.Expenses;

/// <summary>
/// APYA-135: Gider kategorisi — çeşitliliği sınıflandırmak için
/// (raporlama ve mizan APYA-139'da kategori bazlı kırılım kullanır).
/// </summary>
public enum ExpenseCategory
{
    /// <summary>Genel / sınıflandırılmamış — varsayılan.</summary>
    Other = 0,

    /// <summary>Ofis / kira / aidat.</summary>
    Office = 1,

    /// <summary>Seyahat / ulaşım / konaklama.</summary>
    Travel = 2,

    /// <summary>Personel / maaş / SGK.</summary>
    Personnel = 3,

    /// <summary>Malzeme / sarf / donanım.</summary>
    Material = 4,

    /// <summary>Hizmet alımı / danışmanlık / taşeron.</summary>
    Service = 5,

    /// <summary>Vergi / harç / resmi ödeme.</summary>
    Tax = 6,
}
