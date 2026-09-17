namespace Apya.Platform.DynamicAssets;

/// <summary>
/// 16a · Kaynağın kapsamı KAYNAĞIN KENDİSİNDE tanımlıdır; form düzenleyicide kapsam seçtirilmez. Yanlış
/// kurulmuş tek bir alanın başka firmanın kayıtlarını listelemesi böylece mümkün olmaz.
/// </summary>
public enum FormChoiceSourceScope
{
    /// <summary>Host kataloğu: herkese aynı liste (ör. yayındaki hibe çağrıları).</summary>
    HostCatalog = 0,

    /// <summary>Formu dolduran firmanın kendi kayıtları; her firma yalnız kendininkini görür.</summary>
    FillerTenant = 1,

    /// <summary>Yalnız host bağlamında listelenir (ör. firmalar); kiracı formu doldurduğunda liste boş gelir.</summary>
    HostOnly = 2
}
