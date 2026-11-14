using System;
using System.Collections.Generic;
using System.Linq;
using static Apya.Platform.Grants.FirmParameterAudience;
using static Apya.Platform.Grants.FirmParameterDataType;
using static Apya.Platform.Grants.FirmParameterGroup;
using static Apya.Platform.Grants.FirmParameterMatchUsage;
using static Apya.Platform.Grants.FirmParameterRequirement;

namespace Apya.Platform.Grants;

/// <summary>
/// Kurum parametrelerinin başlangıç kataloğu. İki küme taşır:
/// (1) değeri platformun mevcut alanında yaşayan sistem parametreleri — eşleştirme motorunun
/// bugün okuduğu her şey; (2) bugün hiçbir kaynağı olmayan, kurumun gireceği yeni parametreler.
///
/// <para>Saf veri: kalıcılık yok. Tohumlayıcı (<see cref="FirmParameterDefinitionDataSeedContributor"/>)
/// yalnız eksik olanı ekler; host'un sonradan değiştirdiği tanıma dokunmaz.</para>
///
/// <para>🔴 Satır numarası KİMLİKTİR (Id ondan türer). Satır silme ya da numarayı yeniden
/// kullanma: yeni parametre sona, yeni numarayla eklenir.</para>
/// </summary>
public static class FirmParameterCatalog
{
    private const FirmParameterSource Elle = FirmParameterSource.Kullanici;
    private const FirmParameterSource ElleVeyaBelge = FirmParameterSource.Kullanici | FirmParameterSource.BelgeAi;
    private const FirmParameterSource Hesap = FirmParameterSource.Hesaplama;

    public static Guid IdOf(int number) => Guid.Parse($"f17a0000-0000-4000-8000-{number:D12}");

    public static IReadOnlyList<FirmParameterDefinition> Build() => Rows.Select(r => r.ToDefinition()).ToList();

    private static readonly Row[] Rows =
    {
        // --- Sistem parametreleri: değer FirmProfile'da, profil etiketlerinde ya da projelerde yaşar ---
        new(1, "organization_type", "Kurum türü", Select, Kimlik, Zorunlu, Tumu, Kullanilmaz, Elle,
            "Şirket ile dernek, vakıf gibi kuruluşların başvurabildiği programlar ve sorulan bilgiler farklıdır.",
            Key: FirmParameterSystemKey.KurumTuru),
        new(2, "company_size", "Ölçek", Select, Kimlik, Onerilen, YalnizSirket, Eleme, Elle,
            "Birçok program yalnız belirli ölçekteki işletmelere (mikro, küçük, orta, büyük) açıktır.",
            Key: FirmParameterSystemKey.Olcek),
        new(3, "founded_on", "Kuruluş tarihi", Date, Kimlik, Onerilen, Tumu, Eleme, Elle,
            "Bazı programlar kurumun en az ya da en fazla kaç yıllık olması gerektiğini şart koşar.",
            Key: FirmParameterSystemKey.KurulusTarihi),
        new(4, "staff_count", "Personel sayısı", Number, Kapasite, Opsiyonel, YalnizSirket, Eleme, Elle,
            "Asgari personel şartı olan programlarda uygunluk bu sayıyla ölçülür.",
            Key: FirmParameterSystemKey.PersonelSayisi, ValidityMonths: 12),
        new(5, "rd_staff_count", "Ar-Ge personeli sayısı", Number, Kapasite, Opsiyonel, YalnizSirket, Eleme, Elle,
            "Ar-Ge destekleri çoğunlukla asgari Ar-Ge personeli ister.",
            Key: FirmParameterSystemKey.ArgePersoneli, ValidityMonths: 12),
        new(6, "annual_revenue", "Yıllık ciro", Money, Finans, Opsiyonel, YalnizSirket, Eleme, Elle,
            "Ciro alt ya da üst sınırı koyan programlarda uygunluk bu tutarla ölçülür.",
            Key: FirmParameterSystemKey.YillikCiro, ValidityMonths: 12),
        new(7, "trl", "Teknoloji hazırlık seviyesi (TRL)", Number, Kapasite, Opsiyonel, YalnizSirket, Eleme, Elle,
            "Teknoloji destekleri ürünün hangi olgunluk aralığında olması gerektiğini belirtir.",
            Key: FirmParameterSystemKey.Trl, ValidityMonths: 12),
        new(8, "has_consortium_partner", "Konsorsiyum ortağı", FirmParameterDataType.Boolean, Ortaklik, Onerilen, YalnizSirket, Eleme, Elle,
            "Ortaklı başvuru isteyen programlara ancak bir ortağınız varsa başvurabilirsiniz.",
            Key: FirmParameterSystemKey.KonsorsiyumOrtagi, ValidityMonths: 12),
        new(9, "nace_codes", "NACE faaliyet kodları", MultiSelect, Kimlik, Zorunlu, YalnizSirket, Skor, Elle,
            "Programlar hedefledikleri faaliyet kodlarını belirtir; kodunuz uyum puanını belirler.",
            Key: FirmParameterSystemKey.NaceKodu),
        new(10, "sectors", "Sektörler", MultiSelect, Kimlik, Zorunlu, YalnizSirket, Skor, Elle,
            "Her program belirli sektörleri hedefler; sektörünüz girilmeden uyum puanı hesaplanamaz.",
            Key: FirmParameterSystemKey.Sektor),
        new(11, "thematic_areas", "Tematik alanlar", MultiSelect, Kimlik, Zorunlu, YalnizStk, Skor, Elle,
            "Sivil toplum programları çalışma alanına göre hedeflenir; alanınız uyum puanını belirler.",
            Key: FirmParameterSystemKey.TematikAlan),
        new(12, "regions", "Faaliyet illeri", MultiSelect, Kimlik, Zorunlu, Tumu, Eleme, Elle,
            "Kalkınma ajansı gibi bölgesel programlara yalnız o illerde faaliyet gösteren kurumlar başvurabilir.",
            Key: FirmParameterSystemKey.Bolge),
        new(13, "keywords", "Anahtar kelimeler", MultiSelect, Strateji, Onerilen, Tumu, Skor, Elle,
            "Çalışma konularınızı anlatan kelimeler program konularıyla karşılaştırılır.",
            Key: FirmParameterSystemKey.AnahtarKelime),
        new(14, "ngo_staff_band", "Ücretli ekip büyüklüğü", Select, Kapasite, Onerilen, YalnizStk, Eleme, Elle,
            "Asgari personel şartı olan programlarda uygunluk ücretli ekibinizin büyüklüğüyle ölçülür.",
            Key: FirmParameterSystemKey.StkEkipBandi, ValidityMonths: 12),
        new(15, "ngo_project_experience", "Proje deneyimi", Select, Deneyim, Onerilen, YalnizStk, Kullanilmaz, Elle,
            "Bugüne kadar yürüttüğünüz proje sayısı, deneyim arayan programlarda değerlendirmeye girer.",
            Key: FirmParameterSystemKey.StkProjeDeneyimi),
        new(16, "typical_project_budget", "Tipik proje bütçesi", Money, Deneyim, Opsiyonel, Tumu, Skor, Hesap,
            "APYA'daki projelerinizin ortalama bütçesi, programın destek tavanıyla karşılaştırılır.",
            Key: FirmParameterSystemKey.TipikProjeButcesi),
        new(17, "dominant_project_category", "Baskın proje kategorisi", Select, Deneyim, Opsiyonel, Tumu, Skor, Hesap,
            "APYA'daki projelerinizde en sık görülen kategori, hibe projesi deneyiminizi gösterir.",
            Key: FirmParameterSystemKey.BaskinProjeKategorisi),
        new(18, "active_project_count", "Süren proje sayısı", Number, Kapasite, Opsiyonel, Tumu, Kullanilmaz, Hesap,
            "Aynı anda yürüttüğünüz proje sayısı, yeni bir proje için kalan kapasitenizi gösterir.",
            Key: FirmParameterSystemKey.AktifProjeSayisi),

        // --- Kurumun gireceği yeni parametreler: bugün hiçbir kaynağı yok ---
        new(19, "strategic_goals", "Stratejik hedefler", LongText, Strateji, Onerilen, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Kurumunuzun önümüzdeki yıllar için hedefleri, size uygun programların seçiminde ve başvuru metinlerinde kullanılır.",
            ValidityMonths: 24),
        new(20, "priority_project_areas", "Öncelikli proje alanları", LongText, Strateji, Onerilen, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Öncelik verdiğiniz konular bilinirse yalnız bu konulardaki fırsatlar öne çıkarılabilir.",
            ValidityMonths: 12),
        new(21, "upcoming_project_goals", "Gelecek dönem proje hedefleri", LongText, Strateji, Opsiyonel, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Önümüzdeki dönemde yapmak istediğiniz projeler, açılacak çağrılarla önceden eşleştirilebilir.",
            ValidityMonths: 12),
        new(22, "target_beneficiaries", "Hedeflenen faydalanıcı profili", LongText, Strateji, Opsiyonel, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Programlar çoğunlukla belirli bir hedef kitleye ulaşan projeleri destekler."),
        new(23, "annual_project_capacity", "Yıllık proje kapasitesi", Number, Kapasite, Onerilen, Tumu, Kullanilmaz, Elle,
            "Bir yılda yürütebileceğiniz proje sayısı bilinirse kapasitenizi aşan sayıda fırsat önerilmez.",
            ValidityMonths: 12, Min: 0, Max: 500),
        new(24, "expertise_areas", "İnsan kaynağı ve uzmanlık alanları", LongText, Kapasite, Onerilen, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Ekibinizin uzmanlıkları, programın aradığı yetkinliklerle karşılaştırılır.",
            ValidityMonths: 12),
        new(25, "technical_infrastructure", "Teknik altyapı ve ekipman", LongText, Kapasite, Opsiyonel, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Mevcut altyapınız, projeyi uygulayabileceğinizi göstermek için başvurularda sorulur.",
            ValidityMonths: 24),
        new(26, "cofinancing_capacity", "Eş finansman kapasitesi (TL)", Money, Finans, Onerilen, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Programların çoğu bütçenin bir bölümünü kurumun karşılamasını ister. Ayırabileceğiniz öz kaynak bilinmeden mali uygunluk değerlendirilemez.",
            ValidityMonths: 6, Min: 0),
        new(27, "partnerships", "Ulusal ve uluslararası ortaklıklar", LongText, Ortaklik, Opsiyonel, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Mevcut ortaklıklarınız, ortaklı başvuru isteyen programlarda hazır olduğunuzu gösterir.",
            ValidityMonths: 24),
        new(28, "external_past_projects", "APYA dışında yürütülen projeler", LongText, Deneyim, Onerilen, Tumu, Kullanilmaz, ElleVeyaBelge,
            "APYA'ya kaydedilmemiş projeleriniz girilmezse deneyiminiz olduğundan az görünür."),
        new(29, "desired_grant_programs", "Başvurmak istenen hibe programları", LongText, Tercih, Opsiyonel, Tumu, Kullanilmaz, Elle,
            "İlgilendiğiniz programlar bilinirse çağrıları açıldığında size haber verilebilir.",
            ValidityMonths: 12),
        new(30, "excluded_areas", "Başvurmak istenmeyen alanlar", LongText, Tercih, Opsiyonel, Tumu, Kullanilmaz, Elle,
            "Başvurmayı düşünmediğiniz alanlar bilinirse bu alanlardaki fırsatlar önerilmez.",
            ValidityMonths: 12),
        new(31, "implementation_sustainability", "Uygulama ve sürdürülebilirlik kapasitesi", LongText, Kapasite, Opsiyonel, Tumu, Kullanilmaz, ElleVeyaBelge,
            "Projeyi nasıl yürütüp destek bittikten sonra nasıl sürdüreceğiniz hemen her başvuruda sorulur.",
            ValidityMonths: 24),
        new(32, "female_entrepreneur", "Kadın girişimci", FirmParameterDataType.Boolean, Kimlik, Opsiyonel, Tumu, Kullanilmaz, Elle,
            "Bazı programlar kadın girişimcilere öncelik ya da ek puan verir."),
        new(33, "young_entrepreneur", "Genç girişimci", FirmParameterDataType.Boolean, Kimlik, Opsiyonel, Tumu, Kullanilmaz, Elle,
            "Bazı programlar genç girişimcilere öncelik ya da ek puan verir.",
            ValidityMonths: 12),
        new(34, "has_public_debt", "Vadesi geçmiş kamu borcu", FirmParameterDataType.Boolean, Finans, Onerilen, Tumu, Kullanilmaz, Elle,
            "Vadesi geçmiş vergi ya da SGK borcu olan kurumlar birçok kamu desteğine başvuramaz.",
            ValidityMonths: 3)
    };

    private sealed record Row(
        int Number,
        string Code,
        string Name,
        FirmParameterDataType DataType,
        FirmParameterGroup Group,
        FirmParameterRequirement Requirement,
        FirmParameterAudience Audience,
        FirmParameterMatchUsage MatchUsage,
        FirmParameterSource Sources,
        string Description,
        FirmParameterSystemKey? Key = null,
        int? ValidityMonths = null,
        int? Min = null,
        int? Max = null)
    {
        public FirmParameterDefinition ToDefinition()
        {
            var definition = new FirmParameterDefinition(IdOf(Number), Code, Name, DataType, Group, Key)
            {
                Requirement = Requirement,
                Audience = Audience,
                AllowedSources = Sources,
                Order = Number * 10
            };
            definition.SetText(Name, Description);
            definition.SetValidity(ValidityMonths);
            definition.SetNumberRange(Min, Max);
            definition.SetMatchUsage(MatchUsage);
            return definition;
        }
    }
}
