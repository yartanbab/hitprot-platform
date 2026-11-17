namespace Apya.Platform.Grants;

/// <summary>Belgeden kurum verisi okuma işinin durumu.</summary>
public enum FirmDataExtractionStatus
{
    /// <summary>Belge kaydedildi, okuma sürüyor.</summary>
    Isleniyor = 1,

    /// <summary>Okuma bitti; öneriler (varsa) kurumun kararını bekliyor.</summary>
    Hazir = 2,

    /// <summary>Belgede okunabilir metin yok (taranmış görüntü, boş ya da bozuk dosya).</summary>
    Okunamadi = 3,

    /// <summary>Yapay zekâ çağrısı başarısız oldu (kota, sağlayıcı, geçersiz yanıt).</summary>
    Hata = 4
}

/// <summary>Belgeden okunan tek bir değer önerisi için kurumun kararı.</summary>
public enum FirmDataSuggestionStatus
{
    Beklemede = 0,
    Kabul = 1,
    DuzenlenerekKabul = 2,
    Red = 3
}
