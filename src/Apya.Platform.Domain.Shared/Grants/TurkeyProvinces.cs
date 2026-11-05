using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Apya.Platform.Grants;

/// <summary>Bir kalkınma ajansı ve sorumlu olduğu İBBS Düzey 2 bölgesi.</summary>
public sealed record DevelopmentAgency(string Code, string RegionCode, string Name);

/// <summary>İl ve bağlı olduğu kalkınma ajansı (<see cref="DevelopmentAgency.Code"/>).</summary>
public sealed record TurkeyProvince(int PlateCode, string Name, string AgencyCode);

/// <summary>
/// Bölge etiketinin (<see cref="GrantCriteriaKind.Bolge"/>) sabit sözlüğü: 81 il ve 26 kalkınma
/// ajansı. Hem firma hem program bölgeyi buradaki il ADIYLA yazar — serbest metinde
/// "İstanbul"/"istanbul" ayrımı eşleşmeyi sessizce düşürüyordu (ToLowerInvariant "İ"yi
/// noktalı "i̇"ye çevirir). Tablo kodda durur: liste resmi ve yılda bir bile değişmez.
/// </summary>
public static class TurkeyProvinces
{
    public static IReadOnlyList<DevelopmentAgency> Agencies { get; } = new[]
    {
        new DevelopmentAgency("ISTKA", "TR10", "İstanbul Kalkınma Ajansı"),
        new DevelopmentAgency("TRAKYAKA", "TR21", "Trakya Kalkınma Ajansı"),
        new DevelopmentAgency("GMKA", "TR22", "Güney Marmara Kalkınma Ajansı"),
        new DevelopmentAgency("IZKA", "TR31", "İzmir Kalkınma Ajansı"),
        new DevelopmentAgency("GEKA", "TR32", "Güney Ege Kalkınma Ajansı"),
        new DevelopmentAgency("ZAFER", "TR33", "Zafer Kalkınma Ajansı"),
        new DevelopmentAgency("BEBKA", "TR41", "Bursa Eskişehir Bilecik Kalkınma Ajansı"),
        new DevelopmentAgency("MARKA", "TR42", "Doğu Marmara Kalkınma Ajansı"),
        new DevelopmentAgency("ANKARAKA", "TR51", "Ankara Kalkınma Ajansı"),
        new DevelopmentAgency("MEVKA", "TR52", "Mevlana Kalkınma Ajansı"),
        new DevelopmentAgency("BAKA", "TR61", "Batı Akdeniz Kalkınma Ajansı"),
        new DevelopmentAgency("CKA", "TR62", "Çukurova Kalkınma Ajansı"),
        new DevelopmentAgency("DOGAKA", "TR63", "Doğu Akdeniz Kalkınma Ajansı"),
        new DevelopmentAgency("AHIKA", "TR71", "Ahiler Kalkınma Ajansı"),
        new DevelopmentAgency("ORAN", "TR72", "Orta Anadolu Kalkınma Ajansı"),
        new DevelopmentAgency("BAKKA", "TR81", "Batı Karadeniz Kalkınma Ajansı"),
        new DevelopmentAgency("KUZKA", "TR82", "Kuzey Anadolu Kalkınma Ajansı"),
        new DevelopmentAgency("OKA", "TR83", "Orta Karadeniz Kalkınma Ajansı"),
        new DevelopmentAgency("DOKA", "TR90", "Doğu Karadeniz Kalkınma Ajansı"),
        new DevelopmentAgency("KUDAKA", "TRA1", "Kuzeydoğu Anadolu Kalkınma Ajansı"),
        new DevelopmentAgency("SERKA", "TRA2", "Serhat Kalkınma Ajansı"),
        new DevelopmentAgency("FKA", "TRB1", "Fırat Kalkınma Ajansı"),
        new DevelopmentAgency("DAKA", "TRB2", "Doğu Anadolu Kalkınma Ajansı"),
        new DevelopmentAgency("IKA", "TRC1", "İpekyolu Kalkınma Ajansı"),
        new DevelopmentAgency("KARACADAG", "TRC2", "Karacadağ Kalkınma Ajansı"),
        new DevelopmentAgency("DIKA", "TRC3", "Dicle Kalkınma Ajansı")
    };

    public static IReadOnlyList<TurkeyProvince> All { get; } = new[]
    {
        new TurkeyProvince(1, "Adana", "CKA"),
        new TurkeyProvince(2, "Adıyaman", "IKA"),
        new TurkeyProvince(3, "Afyonkarahisar", "ZAFER"),
        new TurkeyProvince(4, "Ağrı", "SERKA"),
        new TurkeyProvince(5, "Amasya", "OKA"),
        new TurkeyProvince(6, "Ankara", "ANKARAKA"),
        new TurkeyProvince(7, "Antalya", "BAKA"),
        new TurkeyProvince(8, "Artvin", "DOKA"),
        new TurkeyProvince(9, "Aydın", "GEKA"),
        new TurkeyProvince(10, "Balıkesir", "GMKA"),
        new TurkeyProvince(11, "Bilecik", "BEBKA"),
        new TurkeyProvince(12, "Bingöl", "FKA"),
        new TurkeyProvince(13, "Bitlis", "DAKA"),
        new TurkeyProvince(14, "Bolu", "MARKA"),
        new TurkeyProvince(15, "Burdur", "BAKA"),
        new TurkeyProvince(16, "Bursa", "BEBKA"),
        new TurkeyProvince(17, "Çanakkale", "GMKA"),
        new TurkeyProvince(18, "Çankırı", "KUZKA"),
        new TurkeyProvince(19, "Çorum", "OKA"),
        new TurkeyProvince(20, "Denizli", "GEKA"),
        new TurkeyProvince(21, "Diyarbakır", "KARACADAG"),
        new TurkeyProvince(22, "Edirne", "TRAKYAKA"),
        new TurkeyProvince(23, "Elazığ", "FKA"),
        new TurkeyProvince(24, "Erzincan", "KUDAKA"),
        new TurkeyProvince(25, "Erzurum", "KUDAKA"),
        new TurkeyProvince(26, "Eskişehir", "BEBKA"),
        new TurkeyProvince(27, "Gaziantep", "IKA"),
        new TurkeyProvince(28, "Giresun", "DOKA"),
        new TurkeyProvince(29, "Gümüşhane", "DOKA"),
        new TurkeyProvince(30, "Hakkari", "DAKA"),
        new TurkeyProvince(31, "Hatay", "DOGAKA"),
        new TurkeyProvince(32, "Isparta", "BAKA"),
        new TurkeyProvince(33, "Mersin", "CKA"),
        new TurkeyProvince(34, "İstanbul", "ISTKA"),
        new TurkeyProvince(35, "İzmir", "IZKA"),
        new TurkeyProvince(36, "Kars", "SERKA"),
        new TurkeyProvince(37, "Kastamonu", "KUZKA"),
        new TurkeyProvince(38, "Kayseri", "ORAN"),
        new TurkeyProvince(39, "Kırklareli", "TRAKYAKA"),
        new TurkeyProvince(40, "Kırşehir", "AHIKA"),
        new TurkeyProvince(41, "Kocaeli", "MARKA"),
        new TurkeyProvince(42, "Konya", "MEVKA"),
        new TurkeyProvince(43, "Kütahya", "ZAFER"),
        new TurkeyProvince(44, "Malatya", "FKA"),
        new TurkeyProvince(45, "Manisa", "ZAFER"),
        new TurkeyProvince(46, "Kahramanmaraş", "DOGAKA"),
        new TurkeyProvince(47, "Mardin", "DIKA"),
        new TurkeyProvince(48, "Muğla", "GEKA"),
        new TurkeyProvince(49, "Muş", "DAKA"),
        new TurkeyProvince(50, "Nevşehir", "AHIKA"),
        new TurkeyProvince(51, "Niğde", "AHIKA"),
        new TurkeyProvince(52, "Ordu", "DOKA"),
        new TurkeyProvince(53, "Rize", "DOKA"),
        new TurkeyProvince(54, "Sakarya", "MARKA"),
        new TurkeyProvince(55, "Samsun", "OKA"),
        new TurkeyProvince(56, "Siirt", "DIKA"),
        new TurkeyProvince(57, "Sinop", "KUZKA"),
        new TurkeyProvince(58, "Sivas", "ORAN"),
        new TurkeyProvince(59, "Tekirdağ", "TRAKYAKA"),
        new TurkeyProvince(60, "Tokat", "OKA"),
        new TurkeyProvince(61, "Trabzon", "DOKA"),
        new TurkeyProvince(62, "Tunceli", "FKA"),
        new TurkeyProvince(63, "Şanlıurfa", "KARACADAG"),
        new TurkeyProvince(64, "Uşak", "ZAFER"),
        new TurkeyProvince(65, "Van", "DAKA"),
        new TurkeyProvince(66, "Yozgat", "ORAN"),
        new TurkeyProvince(67, "Zonguldak", "BAKKA"),
        new TurkeyProvince(68, "Aksaray", "AHIKA"),
        new TurkeyProvince(69, "Bayburt", "KUDAKA"),
        new TurkeyProvince(70, "Karaman", "MEVKA"),
        new TurkeyProvince(71, "Kırıkkale", "AHIKA"),
        new TurkeyProvince(72, "Batman", "DIKA"),
        new TurkeyProvince(73, "Şırnak", "DIKA"),
        new TurkeyProvince(74, "Bartın", "BAKKA"),
        new TurkeyProvince(75, "Ardahan", "SERKA"),
        new TurkeyProvince(76, "Iğdır", "SERKA"),
        new TurkeyProvince(77, "Yalova", "MARKA"),
        new TurkeyProvince(78, "Karabük", "BAKKA"),
        new TurkeyProvince(79, "Kilis", "IKA"),
        new TurkeyProvince(80, "Osmaniye", "DOGAKA"),
        new TurkeyProvince(81, "Düzce", "MARKA")
    };

    private static readonly IReadOnlyDictionary<string, TurkeyProvince> ByKey =
        All.ToDictionary(p => Key(p.Name));

    /// <summary>
    /// Yazımdan bağımsız karşılaştırma anahtarı: Türkçe küçük harf, aksansız
    /// ("İSTANBUL", "Istanbul", "istanbul" → "istanbul"). 81 ilin anahtarları çakışmaz.
    /// </summary>
    public static string Key(string? value)
    {
        var lower = (value ?? string.Empty).Trim().ToLower(new CultureInfo("tr-TR"));
        var sb = new StringBuilder(lower.Length);
        foreach (var ch in lower)
        {
            if (ch == '̇')
            {
                continue; // ToLowerInvariant artığı birleşik nokta ("i̇")
            }
            sb.Append(ch switch
            {
                'ı' => 'i',
                'ğ' => 'g',
                'ü' => 'u',
                'ş' => 's',
                'ö' => 'o',
                'ç' => 'c',
                'â' => 'a',
                'î' => 'i',
                'û' => 'u',
                _ => ch
            });
        }
        return sb.ToString();
    }

    public static TurkeyProvince? Find(string? value)
        => ByKey.TryGetValue(Key(value), out var province) ? province : null;

    /// <summary>Tanınan il adını resmi yazımına çevirir; tanınmayanı kırpıp olduğu gibi bırakır.</summary>
    public static string Normalize(string value)
        => Find(value)?.Name ?? value.Trim();

    /// <summary>Tanınan illerin resmi adları, plaka sırasıyla, virgülle; hiçbiri tanınmazsa null.</summary>
    public static string? JoinKnown(IEnumerable<string> values)
    {
        var names = values
            .Select(Find)
            .Where(p => p != null)
            .Select(p => p!)
            .Distinct()
            .OrderBy(p => p.PlateCode)
            .Select(p => p.Name)
            .ToList();
        return names.Count == 0 ? null : string.Join(", ", names);
    }

    public static IReadOnlyList<TurkeyProvince> OfAgency(string agencyCode)
        => All.Where(p => string.Equals(p.AgencyCode, agencyCode, StringComparison.Ordinal)).ToList();
}
