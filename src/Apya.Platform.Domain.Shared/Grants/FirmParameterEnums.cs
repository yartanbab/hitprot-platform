using System;

namespace Apya.Platform.Grants;

/// <summary>Kurum parametresinin değer tipi. Tanım oluşturulduktan sonra DEĞİŞMEZ: değerler tipe göre saklanır.</summary>
public enum FirmParameterDataType
{
    Text = 1,
    LongText = 2,
    Number = 3,
    Money = 4,
    Percent = 5,
    Date = 6,
    Boolean = 7,
    Select = 8,
    MultiSelect = 9
}

/// <summary>Kurumsal veri ekranında parametrenin göründüğü bölüm.</summary>
public enum FirmParameterGroup
{
    Kimlik = 1,
    Strateji = 2,
    Kapasite = 3,
    Finans = 4,
    Deneyim = 5,
    Ortaklik = 6,
    Tercih = 7
}

/// <summary>
/// Bir değerin NEREDEN geldiği. Değerler bit olarak seçildi: tanımdaki
/// <c>AllowedSources</c> maskesi aynı enum'la kurulur (<see cref="CompanySize"/> ile aynı desen).
/// </summary>
[Flags]
public enum FirmParameterSource
{
    /// <summary>Platformun kendi kaydından otomatik okunan.</summary>
    Sistem = 1,

    /// <summary>Kullanıcının elle girdiği beyan.</summary>
    Kullanici = 2,

    /// <summary>Yüklenen belgeden yapay zekânın çıkardığı.</summary>
    BelgeAi = 4,

    /// <summary>Dış kaynaktan alınan. Bugün besleyen bir entegrasyon YOK; tür ileride kullanılmak üzere tanımlı.</summary>
    DisKaynak = 8,

    /// <summary>Başka kayıtlardan hesapla ya da istatistikle üretilen.</summary>
    Hesaplama = 16
}

public enum FirmParameterVerification
{
    Dogrulanmadi = 0,
    Dogrulandi = 1
}

public enum FirmParameterRequirement
{
    Opsiyonel = 0,
    Onerilen = 1,
    Zorunlu = 2
}

/// <summary>Parametrenin hangi kurum türünde anlamlı olduğu; anlamsız olduğu türde "eksik" sayılmaz.</summary>
public enum FirmParameterAudience
{
    Tumu = 0,
    YalnizSirket = 1,
    YalnizStk = 2
}

/// <summary>Parametrenin hibe eşleştirmesindeki rolü.</summary>
public enum FirmParameterMatchUsage
{
    /// <summary>Eşleştirmeye girmez; yalnız bilgi (başvuru yazımı, danışman görüşü).</summary>
    Kullanilmaz = 0,
    Skor = 1,
    Eleme = 2
}

/// <summary>Değere ne kadar güvenilebileceği. Saklanmaz: kaynak, doğrulama ve güncellikten türetilir.</summary>
public enum FirmParameterReliability
{
    Dusuk = 1,
    Orta = 2,
    Yuksek = 3
}

/// <summary>
/// Değeri bu tabloda DEĞİL, platformun mevcut bir alanında yaşayan parametreler
/// (<c>FirmProfile</c> kolonları, profil etiketleri, projelerden hesaplanan sinyaller).
/// Katalogda yer almaları envanter, doluluk ve önceliklendirme içindir; değerleri
/// yerinde kalır, ikinci bir kopya tutulmaz.
/// </summary>
public enum FirmParameterSystemKey
{
    KurumTuru = 1,
    Olcek = 2,
    KurulusTarihi = 3,
    PersonelSayisi = 4,
    ArgePersoneli = 5,
    YillikCiro = 6,
    Trl = 7,
    KonsorsiyumOrtagi = 8,
    NaceKodu = 9,
    Sektor = 10,
    TematikAlan = 11,
    Bolge = 12,
    AnahtarKelime = 13,
    StkEkipBandi = 14,
    StkProjeDeneyimi = 15,
    TipikProjeButcesi = 16,
    BaskinProjeKategorisi = 17,
    AktifProjeSayisi = 18
}
