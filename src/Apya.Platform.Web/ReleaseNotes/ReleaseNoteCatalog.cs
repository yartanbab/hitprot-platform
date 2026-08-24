using System.Collections.Generic;
using System.Linq;

namespace Apya.Platform.Web.ReleaseNotes;

/// <summary>
/// Sürüm notları — kod içinde tutulur (her yayın kod ile birlikte gelir).
/// YENİ SÜRÜM EKLERKEN: listenin BAŞINA yeni bir <see cref="ReleaseNote"/> ekle
/// (en yeni ilk). <see cref="Latest"/> otomatik ilk öğedir; kullanıcı bunu
/// görmediyse ilk açılışta "Yenilikler" penceresi açılır.
/// </summary>
public static class ReleaseNoteCatalog
{
    public static IReadOnlyList<ReleaseNote> All { get; } = new List<ReleaseNote>
    {
        new ReleaseNote(
            version: "2026.08.24",
            date: "24 Ağustos 2026",
            title: "Arayüz iyileştirmeleri ve düzeltmeler",

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Projeye tıklayınca doğrudan proje sayfası açılıyor",
                "Projeler ekranında bir projeye tıkladığınızda artık sağdan açılan görev paneli yerine " +
                "doğrudan proje detay sayfası açılıyor. Hızlı paneli tercih ediyorsanız Genel Ayarlar'dan " +
                "\"Proje görev paneli\"ni açabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Sayfalar daha akıcı açılıyor",
                "Sayfa açılırken içerik blokları yumuşak bir geçişle beliriyor. Cihazınızda \"hareketi azalt\" " +
                "tercihi açıksa bu efekt otomatik devre dışı kalır."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Takvim ilk kurulum penceresi kısa ekranlarda düzgün görünüyor",
                "Takvim ilk kurulum sihirbazının alt bilgi çubuğu kısa masaüstü ekranlarında kırpılıyordu; düzeltildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Yeni müşteri ekleme hatası giderildi",
                "Yönetici yeni bir müşteri (kiracı) eklerken karşılaşılabilen sunucu hatası giderildi.")
        ),

        new ReleaseNote(
            version: "2026.08.20",
            date: "20 Ağustos 2026",
            title: "Takvim ve Dokümanlar baştan tasarlandı",

            // ── Takvim ────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Takvim baştan tasarlandı",
                "Ay, Hafta, Gün ve Ajanda görünümleri geldi. Projeler, görevler, faturalar, hibe son tarihleri, " +
                "toplantılar ve dış takvimler artık tek takvimde toplanıyor; soldaki kaynak rayından hangilerini " +
                "göreceğinizi seçiyorsunuz. Öğeleri sürükleyip başka güne taşıyabilir, yanlışlıkla yaptığınız " +
                "değişikliği geri alabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Takvimi dışarıyla paylaşın, dışarıdaki takvimi içeri alın",
                "Kendi takviminiz için salt-okunur bir bağlantı üretip Google, Outlook veya Apple takviminize " +
                "ekleyebilirsiniz. Tersi de mümkün: elinizdeki .ics adresini abonelik olarak tanımlarsanız o " +
                "takvimin etkinlikleri Apya takviminde görünür."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Senkron kuralları ve senkron günlüğü",
                "Hangi kaynakların dış takviminize aktarılacağını, hangi projelerin dahil olacağını ve çakışma " +
                "durumunda hangi tarafın kazanacağını tek panelden ayarlıyorsunuz. Her senkronun sonucu günlüğe " +
                "yazılıyor; bir şey aktarılmadıysa sebebini görebilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Kapasite görünümü ve akıllı toplu erteleme",
                "Takvim, kişilerin günlük doluluğunu çubukla gösteriyor. Aşırı yüklenmiş bir günü toplu " +
                "ertelediğinizde sistem işleri boş günlere dengeli dağıtıyor; dağılımı uygulamadan önce görüyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Toplantıdan görev üretme ve ekip katmanı",
                "Takvimdeki bir toplantıdan doğrudan görev açabilirsiniz. Ekip katmanı ile ekip arkadaşlarınızın " +
                "takvimini kendi takviminizin üzerine bindirip ortak boş saat bulabilirsiniz."),

            // ── Dokümanlar ────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Dokümanlar modülü baştan kuruldu",
                "Belgeler artık proje ve iş adımı ağacında duruyor. Belge türü başına özel künye alanları " +
                "tanımlanabiliyor, silinen belge çöp kutusuna gidiyor ve geri alınabiliyor. Kurum uygunluk " +
                "kontrol listeleriyle hangi belgenin eksik olduğunu takip edebilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Rapor derleyici, teslim paketi ve zamanlanmış raporlar",
                "Seçtiğiniz bölümlerden rapor derleyip önizleyebilir, tek paket hâlinde dış paydaşla " +
                "paylaşabilirsiniz. Raporu haftalık ya da aylık zamanlayıp abonelere otomatik gönderilmesini " +
                "sağlayabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Toplu belge yükleme kuyruğu",
                "Birden çok dosyayı aynı anda sürükleyip bırakabilirsiniz; her dosyanın sırası ve durumu " +
                "görünür, künye bilgilerini hepsine tek seferde uygulayabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Belgeler için sınıflandırma önerileri",
                "Sistem, yüklediğiniz belgenin hangi türe ve hangi iş adımına ait olabileceğini öneriyor. " +
                "Öneriyi tek tıkla uygulayabilir, işinize yaramıyorsa kaldırabilirsiniz."),

            // ── Genel ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "İlk girişte tanıtım turu",
                "Yeni kullanıcı ilk girişinde platformu adım adım tanıtan bir tur açılıyor. Kullanıcı " +
                "menüsündeki \"Tanıtım turu\" bağlantısıyla istediğiniz zaman yeniden açabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Takvimde klavye, erişilebilirlik ve A4 baskı",
                "Takvimde ok tuşlarıyla gezinme ve kısayollar çalışıyor, ekran okuyucu desteği eklendi. " +
                "Takvimi A4 sayfaya sığacak biçimde yazdırabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Bağlantı koptuğunda yaptıklarınız kaybolmuyor",
                "Takvimde internet kesildiğinde yaptığınız taşıma ve tamamlama işlemleri kuyruğa alınıyor, " +
                "bağlantı geri geldiğinde otomatik gönderiliyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Ana sayfa masaüstü ve mobilde elden geçirildi",
                "Kart yerleşimi ve ekran kırılım noktaları tasarıma göre düzeltildi; dar ekranda taşan " +
                "bölümler giderildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "İsimler artık ad ve soyadıyla görünüyor",
                "Görev sorumlusu, \"Atanan\" filtresi ve proje kartlarındaki baş harfler yalnız adı değil " +
                "ad ve soyadı birlikte gösteriyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Aynı klasöre eşzamanlı yüklemedeki çakışma giderildi",
                "İki kişi aynı anda aynı klasöre dosya yüklediğinde oluşan hata giderildi. Yükleme " +
                "başarısız olursa geride yarım kalmış dosya bırakılmıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Yükleme hataları artık anlaşılır dille yazıyor",
                "Dosya yüklenemediğinde teknik hata kodu yerine sebebi açıkça anlatan bir mesaj gösteriliyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görev detayında fare tekerleğiyle kaydırma",
                "Üst üste açılan pencerelerde fare tekerleği çalışmıyordu; düzeltildi."),

            // ── Güvenlik ──────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Fatura numarası ve form adresi kiracı bazına çekildi",
                "Fatura numarası ve genel form adresi tekilliği artık her firma için ayrı değerlendiriliyor. " +
                "Böylece bir firmanın kullandığı numara diğerini engellemiyor ve veriler birbirinden daha " +
                "kesin ayrılıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Teslim paketi ve dış paylaşımda yetki kontrolü",
                "Teslim paketi üretimi ve dışarıya açılan paylaşım bağlantıları artık gerçek yetki " +
                "kontrolünden geçiyor.")
        ),

        new ReleaseNote(
            version: "2026.08.16",
            date: "16 Ağustos 2026",
            title: "Güvenlik, gizlilik ve kararlılık güncellemesi",

            // ── Güvenlik ──────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Fatura, proje ve görev verilerine erişim yetkileri sıkılaştırıldı",
                "Bu ekranların verilerine artık yalnızca ilgili yetkiye sahip kullanıcılar erişebilir. " +
                "Önceden bazı isteklerin yetki kontrolünü atlaması mümkündü; bu kapatıldı. Yetkili kullanıcılar " +
                "için hiçbir değişiklik yok."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Takvim entegrasyonu artık şifreli",
                "Google/Outlook takvim bağlantı bilgileriniz veritabanında artık şifreli saklanıyor. " +
                "Bu güncelleme nedeniyle mevcut takvim bağlantılarını bir kez yeniden bağlamanız gerekir " +
                "(Takvim ekranından). Sonraki bağlantılar otomatik şifrelenir."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Yapay zekâ özellikleri yetkilendirmeye bağlandı",
                "Yapay zekâ (belge → görev üretimi, AI asistan) artık yalnızca yapay zekâ iznine sahip kullanıcılar " +
                "ve paketinde yapay zekâ bulunan kiracılar için çalışır. Bu, kota/maliyet israfını ve izinsiz kullanımı önler."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Webhook ve genel form korumaları",
                "Webhook adreslerinin iç/özel sunuculara erişimi engellendi. Genel (herkese açık) form gönderimleri " +
                "artık forma göre doğrulanıyor ve basit bot koruması var — böylece çöp/spam kayıt oluşmaz."),

            // ── KVKK / Gizlilik ───────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Aydınlatma metni, gizlilik politikası ve çerez bilgilendirmesi",
                "KVKK kapsamında aydınlatma metni ve gizlilik politikası sayfaları eklendi, alt bilgiden erişilebilir. " +
                "İlk ziyarette çerez bilgilendirme şeridi çıkar. (Yasal metinler taslaktır; hukuki inceleme sürüyor.)"),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Genel formlarda KVKK onayı ve yayın penceresi",
                "Formlarınıza zorunlu KVKK onay kutusu ekleyebilir, formu yalnız belirli tarih aralığında açık " +
                "tutabilirsiniz. Onaylar kayıt altına alınır; yönetim tarafında rıza analiz paneli bunları gösterir."),

            // ── İyileştirme / Düzeltme ────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Proje Detay'daki \"Atanan\" filtresi düzeltildi",
                "Proje detayında görevleri atanan kişiye göre süzen filtre artık isimleri doğru gösteriyor " +
                "(önceden boş kalıyordu)."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Tarih/saat tutarlılığı düzeltildi",
                "Bazı ekranlar sunucu yerel saatini kullanıyordu; artık hepsi tek bir zaman kaynağını kullanıyor. " +
                "Özellikle hibe son tarihleri ve \"bugün\" sınırındaki hesaplamalar daha isabetli."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Ödeme kaydında hatalı tutar engellendi",
                "Faturaya sıfır veya negatif tutarlı ödeme kaydedilmesi engellendi; bu tür kayıtlar fatura durumunu " +
                "yanlış gösterebiliyordu."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Liste ekranlarında hız iyileştirmeleri",
                "Görev ve fatura listeleri gibi sık kullanılan ekranlar için veritabanı indeksleri eklendi; " +
                "büyük verilerde açılış daha akıcı.")
        )
    };

    /// <summary>En yeni sürüm (listenin ilk öğesi). Görülme takibi bununla yapılır.</summary>
    public static ReleaseNote Latest => All[0];

    public static ReleaseNote? Find(string? version) =>
        version is null ? null : All.FirstOrDefault(r => r.Version == version);
}
