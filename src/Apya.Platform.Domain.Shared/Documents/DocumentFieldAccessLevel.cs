namespace Apya.Platform.Documents;

/// <summary>
/// Bir rolun bir alanda ne yapabildigi. Siralama ONEMLI: buyuk deger daha
/// kisitlayicidir (bkz. DocumentFieldMasker).
/// </summary>
public enum DocumentFieldAccessLevel
{
    /// <summary>Gorur ve degistirir.</summary>
    Edit = 1,

    /// <summary>Gorur, degistiremez.</summary>
    View = 2,

    /// <summary>Alanin VARLIGINI gorur, degerini goremez (32.450,00 -> ...).</summary>
    Masked = 3,

    /// <summary>Alani hic gormez; listede de donmez.</summary>
    Hidden = 4
}
