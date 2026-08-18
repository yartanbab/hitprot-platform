namespace Apya.Platform.DbMigrator.DemoWorld;

/// <summary>
/// Demo dünyasının isim havuzları. Veri üretimi bu havuzlardan sabit tohumlu rastgelelikle
/// birleştirilir; böylece 150 proje elle yazılmadan çeşitlenir ama tekrar üretilebilir kalır.
/// Kurum ve kişi adları kurgusaldır.
/// </summary>
public static class DemoWorldData
{
    /// <summary>30 demo kiracısı: (görünen ad, slug).</summary>
    public static readonly (string Name, string Slug)[] TenantNames =
    {
        ("Anadolu Yazılım A.Ş.", "anadolu"),
        ("Marmara Enerji Holding", "marmara"),
        ("Ege Tekstil Sanayi", "ege"),
        ("Toros Kimya A.Ş.", "toros"),
        ("Karadeniz Lojistik", "karadeniz"),
        ("Kapadokya Turizm Grubu", "kapadokya"),
        ("Trakya Gıda Sanayi", "trakya"),
        ("Akdeniz İnşaat A.Ş.", "akdeniz"),
        ("Boğaziçi Finans Teknoloji", "bogazici"),
        ("Selçuk Otomotiv Yan Sanayi", "selcuk"),
        ("Fırat Enerji Çözümleri", "firat"),
        ("Uludağ Makine A.Ş.", "uludag"),
        ("Erciyes Savunma Teknolojileri", "erciyes"),
        ("Meriç Ambalaj Sanayi", "meric"),
        ("Sakarya Elektronik", "sakarya"),
        ("Çukurova Tarım Teknolojileri", "cukurova"),
        ("Ilgaz Sağlık Hizmetleri", "ilgaz"),
        ("Beydağ Perakende Grubu", "beydag"),
        ("Nemrut Medya ve Yayıncılık", "nemrut"),
        ("Aladağ Maden A.Ş.", "aladag"),
        ("Menderes Su Teknolojileri", "menderes"),
        ("Küre Metal Sanayi", "kure"),
        ("Yeşilırmak Kâğıt A.Ş.", "yesilirmak"),
        ("Bolkar Havacılık", "bolkar"),
        ("Munzur Yazılım Evi", "munzur"),
        ("Gediz Cam Sanayi", "gediz"),
        ("Kızılırmak Sigorta Aracılık", "kizilirmak"),
        ("Spil Bilişim Danışmanlık", "spil"),
        ("Honaz Plastik A.Ş.", "honaz"),
        ("Bozdağ Eğitim Kurumları", "bozdag"),
    };

    /// <summary>Rol adları — her bağlamda aynı dört kademe kurulur.</summary>
    public const string RoleCeo = "CEO";
    public const string RoleProjectManager = "Proje Yöneticisi";
    public const string RoleEmployee = "Çalışan";
    public const string RoleIntern = "Stajyer";

    /// <summary>Demo kişileri: (ad, soyad). Kullanıcı adları slug'dan türetilir.</summary>
    public static readonly (string Name, string Surname)[] People =
    {
        ("Ayşe", "Yılmaz"), ("Mehmet", "Demir"), ("Zeynep", "Kaya"), ("Can", "Öztürk"),
        ("Elif", "Şahin"), ("Burak", "Çelik"), ("Selin", "Aydın"), ("Emre", "Koç"),
        ("Deniz", "Arslan"), ("Merve", "Doğan"), ("Kerem", "Kurt"), ("Buse", "Özdemir"),
        ("Onur", "Polat"), ("Ceren", "Erdoğan"), ("Serkan", "Aksoy"), ("Pınar", "Güneş"),
    };

    /// <summary>Cari (müşteri/tedarikçi) adları.</summary>
    public static readonly string[] CustomerNames =
    {
        "Vestel Elektronik A.Ş.", "Arçelik A.Ş.", "Migros Ticaret A.Ş.",
        "Turkcell İletişim Hizmetleri A.Ş.", "Yapı Kredi Bankası A.Ş.",
        "Borusan Lojistik A.Ş.", "Netsis Yazılım Ltd. Şti.",
        "Piri Bilişim Danışmanlık Ltd. Şti.", "Doğuş Otomotiv A.Ş.",
        "Eczacıbaşı Yapı Gereçleri", "Sabancı Dijital A.Ş.", "Koç Sistem Bilgi Teknolojileri",
        "Zorlu Enerji A.Ş.", "Tekfen Mühendislik", "Alarko Carrier Sanayi",
    };

    /// <summary>Kamu/hibe kurumları — hibe projelerinin carisi olur.</summary>
    public static readonly string[] GrantBodies =
    {
        "TÜBİTAK", "KOSGEB", "Ticaret Bakanlığı", "Sanayi ve Teknoloji Bakanlığı",
    };

    /// <summary>Proje adı bileşenleri: (konu, kod öneki).</summary>
    public static readonly string[] ProjectTopics =
    {
        "E-Ticaret Altyapı Yenileme", "Mobil Uygulama Geliştirme", "Veri Merkezi Taşıma",
        "ERP Entegrasyonu", "Stok Optimizasyonu", "Kurumsal Web Sitesi Yenileme",
        "IoT Saha Sensör Ağı", "Müşteri Portalı", "Ödeme Altyapısı Modernizasyonu",
        "İş Zekâsı ve Raporlama", "Depo Otomasyonu", "CRM Kurulumu",
        "Siber Güvenlik Sertlestirme", "Bulut Göçü", "Yapay Zekâ Destekli Kalite Kontrol",
        "Enerji Verimliliği İyileştirme", "Üretim Hattı Dijitalleştirme",
        "Tedarik Zinciri Görünürlüğü", "Belge Yönetim Sistemi", "Çağrı Merkezi Yenileme",
        "Bayi Portalı", "Saha Servis Uygulaması", "Fatura Otomasyonu",
        "Veri Ambarı Kurulumu", "Mikroservis Dönüşümü", "Test Otomasyonu Altyapısı",
        "KVKK Uyum Programı", "Ar-Ge Laboratuvar Kurulumu", "Dijital Pazarlama Platformu",
        "Lojistik Rota Optimizasyonu",
    };

    /// <summary>Etkinlik türü projeler.</summary>
    public static readonly string[] EventTopics =
    {
        "Yıllık Bayi Toplantısı", "Ürün Lansmanı", "Sektör Fuarı Katılımı",
        "Kurumsal Sürdürülebilirlik Zirvesi", "Çalışan Gelişim Kampı",
    };

    /// <summary>Hibe projesi konuları.</summary>
    public static readonly string[] GrantTopics =
    {
        "Akıllı Üretim Ar-Ge Projesi", "Dijital Dönüşüm Programı",
        "Yeşil Enerji Dönüşümü", "İhracat Kapasitesi Geliştirme",
        "Yenilikçi Malzeme Geliştirme",
    };

    /// <summary>Görev başlığı havuzu (kök görevler).</summary>
    public static readonly string[] TaskTitles =
    {
        "Gereksinim analizi tamamlanacak", "Teknik tasarım dokümanı hazırlanacak",
        "Veri modeli çıkarılacak", "API sözleşmesi netleştirilecek",
        "Arayüz tasarımı onaya sunulacak", "Geliştirme ortamı kurulacak",
        "Birim testleri yazılacak", "Entegrasyon testleri koşulacak",
        "Performans testi yapılacak", "Güvenlik taraması yapılacak",
        "Kullanıcı kabul testi planlanacak", "Eğitim materyali hazırlanacak",
        "Devreye alma planı yazılacak", "Geri alma senaryosu hazırlanacak",
        "Canlıya geçiş yapılacak", "Kapanış raporu hazırlanacak",
        "Tedarikçi sözleşmesi imzalanacak", "Bütçe revizyonu onaylanacak",
        "Paydaş bilgilendirme toplantısı", "Risk analizi güncellenecek",
        "Veri göçü provası yapılacak", "İzleme ve alarm kurulumu",
        "Dokümantasyon güncellenecek", "Kod gözden geçirmesi tamamlanacak",
        "Erişilebilirlik denetimi", "Yedekleme stratejisi gözden geçirilecek",
    };

    /// <summary>Alt görev başlığı havuzu.</summary>
    public static readonly string[] SubTaskTitles =
    {
        "Mevcut durum incelenecek", "Alternatifler karşılaştırılacak",
        "Taslak hazırlanacak", "Ekip görüşü alınacak", "Onay süreci başlatılacak",
        "Örnek veri hazırlanacak", "Hata kayıtları kapatılacak",
        "Ölçüm sonuçları raporlanacak", "İlgili ekiple mutabakat sağlanacak",
        "Son kontroller yapılacak",
    };

    /// <summary>Kontrol listesi maddeleri.</summary>
    public static readonly string[] ChecklistItems =
    {
        "Kapsam netleştirildi", "Sorumlu atandı", "Tahmini süre girildi",
        "Bağımlılıklar kontrol edildi", "Test senaryosu yazıldı",
        "Gözden geçirme tamamlandı", "Paydaş onayı alındı",
    };

    /// <summary>Görev yorumları.</summary>
    public static readonly string[] TaskComments =
    {
        "Tedarikçi tarafındaki gecikme nedeniyle plan bir hafta kaydı.",
        "Ölçüm sonuçları beklenenin üzerinde, kapsamı genişletmeyi değerlendiriyoruz.",
        "Bu maddeyi bir sonraki sprinte taşımayı öneriyorum.",
        "İlgili ekiple mutabakat sağlandı, uygulamaya geçebiliriz.",
        "Test ortamında sorun görünmüyor, canlı öncesi son kontrol kaldı.",
        "Bütçe kalemi mali işlerle teyit edilmeli.",
    };

    /// <summary>Görev etiketleri.</summary>
    public static readonly string[] TagNames =
    {
        "backend", "frontend", "acil", "müşteri-talebi", "teknik-borç",
        "güvenlik", "raporlama", "saha", "altyapı", "tasarım",
    };

    /// <summary>Görev tipleri ve sprint adları.</summary>
    public static readonly string[] TaskTypes =
    {
        "Geliştirme", "Tasarım", "Test", "Analiz", "Kurulum",
        "Dokümantasyon", "Hata", "Saha", "Raporlama", "Eğitim",
    };

    /// <summary>Gider kalemleri: (başlık, kategori indeksi 0..6).</summary>
    public static readonly (string Title, int Category)[] ExpenseTitles =
    {
        ("Personel maaş ödemesi", 3), ("Ofis kirası", 1), ("Bulut altyapı bedeli", 5),
        ("Danışmanlık hizmeti", 5), ("Donanım alımı", 4), ("Saha ekibi konaklama", 2),
        ("Yazılım lisans yenileme", 5), ("Eğitim ve sertifikasyon", 5),
        ("Kargo ve lojistik", 2), ("Damga vergisi ve harçlar", 6),
        ("Sarf malzeme alımı", 4), ("Fuar ve tanıtım gideri", 5),
        ("Araç yakıt ve bakım", 2), ("Muhasebe ve mali müşavirlik", 5),
        ("İnternet ve iletişim", 1),
    };

    /// <summary>Gelir kalemleri: (başlık, kategori indeksi 0..4).</summary>
    public static readonly (string Title, int Category)[] IncomeTitles =
    {
        ("Hibe dönem ödemesi", 1), ("Sponsorluk katkısı", 2),
        ("Faturasız eğitim geliri", 3), ("Vadeli mevduat faizi", 4),
        ("Lisans iadesi", 0), ("Fuar gelir paylaşımı", 3),
    };

    /// <summary>Doküman başlıkları.</summary>
    public static readonly string[] DocumentTitles =
    {
        "Proje Başlangıç Dokümanı", "Teknik Mimari Notu", "Toplantı Tutanağı",
        "Risk Kayıt Defteri", "Test Planı", "Devreye Alma Kontrol Listesi",
        "Sözleşme Özeti", "Kapanış Raporu",
    };

    /// <summary>Geri bildirim kayıtları: (tip 1..9, konu, gövde).</summary>
    public static readonly (int Type, string Subject, string Body)[] Feedbacks =
    {
        (1, "Görev listesinde filtre sıfırlanmıyor", "Atanan filtresini temizleyince liste eski sonucu göstermeye devam ediyor."),
        (2, "Kanban'da toplu taşıma olsun", "Birden fazla görevi seçip tek seferde kolon değiştirebilmek istiyoruz."),
        (4, "Yeni gösterge paneli çok başarılı", "Gecikmiş işleri tek bakışta görebiliyoruz, teşekkürler."),
        (5, "Mobilde tablo yatay kayıyor", "Fatura listesinde küçük ekranda sütunlar taşıyor."),
        (7, "Rapor ekranı yavaş açılıyor", "Cari ekstre 2000 satırda belirgin şekilde yavaşlıyor."),
        (3, "Kur değerleme ne zaman çalışıyor?", "Yıl sonu değerleme otomatik mi yoksa elle mi tetikleniyor?"),
    };
}
