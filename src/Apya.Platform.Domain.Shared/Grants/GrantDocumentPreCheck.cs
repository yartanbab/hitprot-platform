namespace Apya.Platform.Grants;

/// <summary>
/// Yüklenen dosyadan okunan ham bilgiler. Yükleme anında bir kez çıkarılır ve sürümle
/// saklanır; uyarı bu bilgilerle evrakın imza/kaşe şartı karşılaştırılarak üretilir.
/// </summary>
/// <param name="HasDigitalSignature">Dosyada elektronik imza var mı (PDF imza sözlüğü, Word imza parçası).</param>
/// <param name="LooksScanned">Taranmış/fotoğraf bir sayfa içeriyor mu — ıslak imza ve kaşe ancak böyle bir kopyada görünür.</param>
/// <param name="EmptyFieldCount">Boş form alanı + doldurulmamış yer tutucu sayısı; biçim okunamıyorsa null.</param>
public sealed record GrantDocumentFileInspection(bool HasDigitalSignature, bool LooksScanned, int? EmptyFieldCount);

/// <summary>
/// Yükleme ön kontrolünün uyarıları. Danışman kararının YERİNE geçmez; yalnız
/// gözden kaçabilecek eksiği işaret eder.
/// </summary>
public enum GrantDocumentPreCheckWarning
{
    /// <summary>E-imza isteniyor, dosyada elektronik imza yok.</summary>
    ESignatureMissing = 0,

    /// <summary>Islak imza/kaşe isteniyor; dosya taranmış bir kopya değil ve e-imza da yok.</summary>
    NotScanned = 1,

    /// <summary>Doldurulmamış form alanı ya da yer tutucu bulundu.</summary>
    EmptyFields = 2
}
