using System.Collections.Generic;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Sürüm notları — kod içinde tutulur (her yayın kod ile birlikte gelir).
/// YENİ SÜRÜM EKLERKEN: listenin BAŞINA yeni bir <see cref="ReleaseNote"/> ekle
/// (en yeni ilk). <see cref="Latest"/> otomatik ilk öğedir; kullanıcı bunu
/// görmediyse ilk açılışta "Yenilikler" penceresi açılır.
///
/// MADDELER MÜŞTERİ ODAKLIDIR. Yalnız host yöneticisini ilgilendiren maddeler
/// (Sistem Sağlığı, kiracı yönetimi, paket süresi tanımlama, hibe çağrısı yönetimi)
/// BURAYA YAZILMAZ: kiracı müşterisi ya erişemediği bir özelliği arar ya da kendisini
/// ilgilendirmeyen işletim ayrıntısını okur. Ölçü tek soru: "bunu kiracıdaki bir
/// kullanıcı kendi ekranında görebilir/yapabilir mi?" Hayırsa madde girmez.
/// Kiracı yöneticisinin yaptığı işler (Ayarlar, menü düzeni, "Paketim") girer.
///
/// <para>🔴 KATALOGA MADDE EKLEMEK YAYINLAMAK DEĞİLDİR. Buradaki hiçbir madde host
/// /Admin/ReleaseNotes ekranından onaylamadan kullanıcıya gitmez; onaysız madde yalnız
/// host'a, "Onay bekliyor" rozetiyle görünür. Onay kararı maddenin BAŞLIĞINDAN türeyen
/// anahtara bağlıdır (<see cref="ReleaseNoteItem.Key"/>) — yayınlanmış bir maddenin
/// başlığını değiştirirsen onayı düşer.</para>
/// </summary>
public static class ReleaseNoteCatalog
{
    public static IReadOnlyList<ReleaseNote> All { get; } = new List<ReleaseNote>
    {
        new ReleaseNote(
            version: "2026.09.02",
            date: "2 Eylül 2026",
            title: "Proje finansı tek ekranda, hibe süreci baştan sona, görevler ekip dışına açık",

            // ── Finans ───────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Finansa dair her şey menüde tek başlık altında",
                "Kasa, kur ve finans ekranları \"Finans\" başlığındaydı; proje bütçesi, cari ekstre, " +
                "mizan ve yıl sonu değerleme ise ayrı bir \"Raporlar & Analiz\" başlığında duruyordu — " +
                "bir rakamı ararken iki ayrı yere bakmanız gerekiyordu. Hepsi artık \"Finans & Bütçe\" " +
                "başlığı altında: günlük ekranlar üstte, dört rapor da içindeki \"Raporlar\" grubunda. " +
                "Efor, personel ve müşteri kârlılığını gösteren \"Özet Raporlar\" ise içeriğine uygun " +
                "olarak \"İş Yönetimi\" başlığına taşındı. Menüyü kendinize göre düzenlediyseniz " +
                "düzeniniz korunuyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Projenin bütün finansı tek ekranda toplandı",
                "Bütçe, gelir-gider ve faturalar ayrı ayrı ekranlarda duruyordu; hangi rakamın hangi " +
                "projeye ait olduğunu her seferinde yeniden süzmeniz gerekiyordu. Finans ekranında " +
                "artık önce projeyi seçiyorsunuz, sekmeler o projenin bütçesini, kayıtlarını ve " +
                "faturalarını gösteriyor. Sekmeler projenin türüne göre değişiyor: hibe projesinde " +
                "fonlama dilimleri, kurumsal projede kâr-zarar öne çıkıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Bütçenizi kalemlere ayırıp gerçekleşmeyi kalem kalem izliyorsunuz",
                "Projeye \"Personel\", \"Hizmet alımı\", \"Ekipman\" gibi bütçe kalemleri tanımlıyor, " +
                "her gider ve geliri bir kaleme yazıyorsunuz. Kalemin ne kadarının harcandığını, ne " +
                "kadarının kaldığını ve yüzde kaçının kullanıldığını tek tabloda görüyorsunuz. Kalem " +
                "tanımlı bir projede kayıt açarken kalem seçimi zorunlu oluyor, böylece hiçbir harcama " +
                "sınıflandırılmadan kalmıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Fonlama dilimleri, kesintiler ve bütçe revizyonları kayıt altında",
                "Destek ödemesini dilim dilim planlıyor, geldiğinde tahsilatı işliyorsunuz; hangi " +
                "dilimin ne kadarının geldiğini ve ne kadarının beklendiğini ekranda görüyorsunuz. " +
                "Fon veren bir kesinti uyguladığında kesintiyi gerekçesiyle kaydediyor, kesintiyi ister " +
                "bütçeye işliyor ister \"finanse edilmeyen\" olarak kapatıyorsunuz. Bütçe kalemlerinin " +
                "tutarını değiştirdiğinizde önceki ve yeni tutar gerekçesiyle birlikte revizyon " +
                "geçmişine yazılıyor — \"bu kalem neden değişti\" sorusunun cevabı kaybolmuyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Görevlere bütçe ayırıp harcamayı görev bazında karşılaştırıyorsunuz",
                "Bir görevi bütçe kalemine bağlayıp o göreve ayırdığınız tutarı yazabiliyorsunuz. " +
                "Aynı kalemdeki görev bütçelerinin toplamı kalemi aşarsa kayıt kabul edilmiyor, " +
                "böylece aynı para iki işe birden ayrılmıyor. Proje ekranına eklenen \"Finans\" " +
                "sekmesinde hangi göreve ne kadar ayrıldığını ve o görevde ne kadar harcandığını " +
                "yan yana görüyorsunuz; görev detayının Finans sekmesinde de görevin kendi bütçesi, " +
                "gerçekleşeni ve kalanı çıkıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Döviz bütçeli projede üç rakamı birden görüyorsunuz",
                "Hibe bütçeniz euro, harcamanız TL olduğunda hangi kurun geçerli olacağı hep tartışma " +
                "konusuydu. Artık projede kur politikasını siz belirliyorsunuz: harcama günündeki kur, " +
                "dilimin geldiği gündeki kur, ay başındaki kur ya da sözleşmedeki sabit kur. Her kayıt " +
                "işlem para biriminde, TL karşılığıyla ve donör para birimiyle birlikte saklanıyor; " +
                "hangi kurun kullanıldığı kayıtta yazıyor. Kur bulunamazsa uydurma bir rakam " +
                "gösterilmiyor, \"kur yok\" uyarısı çıkıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Bütçe rakamı artık her ekranda aynı",
                "Projenin bütçesi baktığınız ekrana göre değişebiliyordu: proje ekranındaki \"Bütçe " +
                "Durumu\" penceresi ve Proje Bütçesi raporu projeye girdiğiniz toplam tutarı " +
                "gösterirken, Finans ekranı bütçe kalemlerinin güncel toplamını gösteriyordu. Kalem " +
                "tanımladığınız ya da bütçe revizyonu yaptığınız anda aynı proje için iki farklı " +
                "rakam görüyordunuz. Artık hepsi tek hesaptan besleniyor: yürürlükteki onaylanan " +
                "bütçe, harcanan, gelen para ve kalan tutar nereye bakarsanız bakın aynı. \"Bütçe " +
                "Durumu\" penceresi de Finans ekranıyla aynı altı rakamı gösteriyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Projeden bütçe, finans ve belge ekranlarına tek tıkla geçiyorsunuz",
                "Bir projenin parasal ekranlarına ulaşmak için farklı yerleri hatırlamanız " +
                "gerekiyordu. Artık hem proje listesindeki her projenin yanındaki menüden hem de " +
                "proje ekranındaki Bütçe kutucuğundan o projenin bütçe kalemlerine, Finans " +
                "ekranına ve belgelerine doğrudan gidiyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Gider veya geliri düzenlediğinizde görev bağı artık silinmiyor",
                "Bir göreve bağlı gider ya da gelir kaydını açıp herhangi bir alanını değiştirip " +
                "kaydettiğinizde görev bağı sessizce siliniyordu; kayıt görevin Finans sekmesinden " +
                "kayboluyor, görev bazlı raporlar eksik çıkıyordu. Düzenleme ekranı artık görev " +
                "bilgisini koruyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Belge açığını finans ekranından görüyorsunuz",
                "Finans ekranına \"Belgeler\" sekmesi eklendi. Kaç harcamanın belgesi eksik, bu " +
                "harcamaların hangi bütçe kalemlerine yazıldığı ve kaç belgenin henüz bir harcamaya " +
                "bağlanmadığı tek bakışta görünüyor. Aynı sekmede kurumun istediği belge listesinin " +
                "yüzde kaçının tamamlandığı ve teslim paketinizin dışa aktarılmaya hazır olup " +
                "olmadığı da yazıyor — teslimi bloke eden bir eksik varsa orada uyarı çıkıyor. " +
                "Belgeleriniz yine Dokümanlar modülünde duruyor; bu sekme onları finans gözüyle " +
                "özetliyor ve tek tıkla ilgili ekrana götürüyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Belge eşleştirirken hangi kalemin belgeleneceğini görüyorsunuz",
                "Harcama-belge eşleştirme ekranında bir aday belgeyi bağlamadan önce \"bağlanınca " +
                "hangi bütçe kalemi belgeli olur\" bilgisi kartın üzerinde yazıyor. Harcamalar " +
                "listesinde de her satırın kalemi görünüyor, böylece hangi kalemin açığını " +
                "kapattığınızı kaybetmiyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Tüm projelerinizin finansını tek tabloda karşılaştırıyorsunuz",
                "Finans ekranında proje seçicideki \"Tüm projeler\" seçeneği artık boş bir sayfa değil: " +
                "bütün projelerinizin onaylanan bütçesi, harcaması ve gelen parası üstte tek şeritte " +
                "toplanıyor, altında proje başına bir satır açılıyor. Satırlar riske göre sıralı — nakit " +
                "riski taşıyan proje en üstte, sonra bütçesini aşan, sonra kesinti itirazı olan. Farklı " +
                "para birimindeki projeler tek rakama zorlanmıyor; şerit \"karışık para birimi\" diyor. " +
                "Bütçesi ve kaydı olmayan projeler tabloyu şişirmiyor, sayısı ekranda yazıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Bütçe kalemlerini görev kırılımıyla okuyorsunuz",
                "\"Bütçe kalemleri\" sekmesine üç görünümlü bir anahtar eklendi: kalem listesi, kalem → " +
                "görev ve görev → kalem. Hangi kalemin ne kadarının hangi göreve planlandığını, ne " +
                "kadarının henüz dağıtılmadığını ve o görevde ne kadar harcandığını aynı tabloda " +
                "görüyorsunuz. Göreve bağlanmamış harcamalar hata sayılmıyor — bordro, kira gibi giderler " +
                "kendi satırında duruyor. Görünüm adresle taşınıyor; bağlantıyı paylaştığınızda karşı " +
                "taraf aynı kırılımı açıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Projenin finans kurulumunu sihirbazla yapıyorsunuz",
                "\"Bütçe kalemleri\" sekmesindeki \"Bağlamı kur\" düğmesi projenin finans şablonunu, " +
                "açılacak sekmeleri ve şablonun önerdiği kalem listesini tek ekranda gösteriyor. Önerilen " +
                "kalemler adıyla gelir, tutarları sıfırdır — rakamı siz yazarsınız, sistem uydurmaz. Kalem " +
                "kodlarından biri projede zaten varsa ya da listede iki kez geçiyorsa hiçbir kalem " +
                "eklenmez ve hepsi tek mesajda söylenir; yarım kurulum kalmaz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Kesintiyi kalemlere dağıtıp yeni bütçe revizyonu üretiyorsunuz",
                "Fon verenin uyguladığı kesintiyi kaydettikten sonra iki seçenek çıkıyor: \"Bütçeyi " +
                "revize et\" ya da \"Açık bırak\". Revize ederken her kalemden ne kadar düşüleceğini " +
                "yazıyorsunuz, yeni tutar ve \"dağıtılmayan kalan\" sayacı anında hesaplanıyor; tamamını " +
                "dağıtmak zorunlu değil, kalan kısım bütçede açık olarak durur. Bir kalemin aktarım payı " +
                "sınırı aşılırsa uyarı çıkar, kayıt engellenmez. Sonuç yeni bir revizyon olarak geçmişe " +
                "yazılır."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Hibe projelerinde Donör ve raporlama sekmesi açıldı",
                "Hibe şablonlu projelerde Finans ekranına \"Donör\" sekmesi geldi. Donör para biriminde " +
                "gelir, gider ve net tutar üstte; kur bilgisi eksik olduğu için donör karşılığı " +
                "hesaplanamayan kayıt sayısı yanında. Kalem tablosunda her kalemin aktarım payı yüzdesi ve " +
                "tutar karşılığı yazıyor. Uygunluk denetimi üç sayılabilir bulgu veriyor: belgesiz " +
                "harcama, donör kuru hesaplanamayan kayıt ve proje tarih aralığı dışındaki kayıt. Rapor " +
                "dönemleri de paket, dönem, ek sayısı ve durumuyla listeleniyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "\"Masraf Yakala\" ekranı artık gerçekten kaydediyor",
                "Giderler ekranındaki \"Masraf Yakala\" düğmesiyle açılan saha girişi \"Masraf " +
                "kaydedildi\" diyor ama hiçbir kayıt oluşturmuyordu. Artık gerçek gider kaydı açıyor; " +
                "forma proje, bütçe kalemi ve kasa seçimi eklendi. Bağlantı yokken girdiğiniz kayıt " +
                "cihazda bekler, bağlantı gelince kendiliğinden gönderilir; başlıkta \"Çevrimdışı\" " +
                "rozeti ve kaç kaydın beklediği görünür. Bekleyen kayıt \"kaydedildi\" sayılmaz, " +
                "gönderilene kadar listede kalır. Fişin fotoğrafı çevrimdışı kuyruğa alınmaz; belgeyi " +
                "sonra eşleştirme ekranından bağlarsınız."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Fatura kalemlerinde ondalıklı miktar ve birim fiyat artık doğru hesaplanıyor",
                "Fatura kalemine ondalıklı bir miktar ya da birim fiyat girildiğinde (örneğin 2,5 adet × " +
                "1.234,56 ₺) tutar bin kat büyüyor, 3.703,68 yerine 3.703.680 yazıyordu; hata sessizdi, " +
                "uyarı çıkmıyordu. Düzeltildi. Daha önce ondalıklı kalemle kaydettiğiniz bir fatura varsa " +
                "tutarını bir kez kontrol etmenizi öneririz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Kur değerleme detayında satırlar görünüyor",
                "Kur değerlemesini çalıştıran kişi satırları görüyordu; kaydı daha sonra açan ise boş bir " +
                "tablo ve altında dolu bir toplam buluyordu. Detay artık her açılışta hesap hesap " +
                "satırları gösteriyor, toplam satırlarla tutuyor. Değerleme sonucunda hangi hesabın ne " +
                "kadar fark ürettiğini yeniden görebiliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Kur, girdiğiniz hane sayısıyla görünüyor",
                "Kurlar altı ondalık haneye kadar saklanıyor ama kur listesinde, kur köprüsünde ve " +
                "değerleme detayında dört haneye yuvarlanarak gösteriliyordu: 34,215678 olarak " +
                "girdiğiniz kur ekranda 34,2157 çıkıyor, kaydınızı olduğu gibi bulamıyordunuz. " +
                "Kayıt her zaman doğruydu, kırpan yalnızca gösterimdi. Artık kur girdiğiniz hâliyle " +
                "görünüyor; gereksiz sıfır da eklenmiyor, 34,5 kuru 34,5000 diye yazılmıyor."),

            // ── Hibe: çağrılar ve uygunluk ────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Açık hibe çağrılarının tamamını görüyorsunuz",
                "Hibeler ekranında şimdiye kadar yalnız firma profilinize yeterince uyan çağrılar " +
                "listeleniyordu; uyum puanı tutmayan bir çağrı hiç görünmediği için varlığından " +
                "haberiniz olmuyordu. Artık yayına alınan bütün açık çağrılar \"Diğer Açık Çağrılar\" " +
                "başlığı altında listeleniyor ve hepsine doğrudan başvurabiliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Size uygun çağrılar aynı sayfada ayrı duruyor",
                "Firma profiliniz ve proje geçmişinizle yüksek uyum gösteren çağrılar sayfanın üstünde " +
                "\"Size Önerilen Çağrılar\" başlığında ayrı kalmaya devam ediyor; size özel gönderilen " +
                "çağrılar da burada çıkıyor. Her kartta o çağrı için uyum puanınızı görüyorsunuz, " +
                "böylece listenin tamamına bakarken önceliğinizi kaybetmiyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Erasmus+ gençlik programları hibe listenizde",
                "Erasmus+ gençlik alanının beş programı katalogda tanımlandı: Gençlik Değişimleri " +
                "(KA152), Gençlik Çalışanlarının Hareketliliği (KA153), Gençlik Katılımı (KA154), " +
                "Küçük Ölçekli Ortaklıklar (KA210) ve İşbirliği Ortaklıkları (KA220). Her programın " +
                "açıklamasında hedef kitlesi, kimlerin başvurabileceği ve götürü hibe kademeleri yazıyor. " +
                "KA152, KA153 ve KA154 için 1 Ekim 2026 başvuru dönemi açık ve şimdiden listenizde " +
                "görünüyor; KA210 ile KA220 ise 2027 başvuru takvimi açıklandığında listenize düşecek."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Dernek, vakıf ve kulüpler kendi profil formunu dolduruyor",
                "Hibe ekranındaki kurum profili yalnız şirketlere göre kurulmuştu: dernek ya da " +
                "vakıfsanız firma ölçeği, ciro ve teknoloji hazırlık seviyesi gibi sizde karşılığı " +
                "olmayan alanlarla karşılaşıyordunuz. Profilin başında artık kurum türünüzü " +
                "seçiyorsunuz — şirket, dernek, kulüp, vakıf ya da federasyon — ve form ona göre " +
                "değişiyor. Sivil toplum kuruluşlarına kayıt (DERBİS) veya vakıf sicil numarası, " +
                "vergi kimlik numarası ve vergi dairesi soruluyor; profesyonel ekibinizin ve bugüne " +
                "dek yürüttüğünüz projelerin sayısını tek tek yazmak yerine aralık seçerek " +
                "belirtiyorsunuz. Çalışma alanınızı ise eğitimden çevreye, insan haklarından afet " +
                "yönetimine 14 tematik başlıktan işaretliyorsunuz ve çağrı eşleştirmesi bu " +
                "başlıklar üzerinden yapılıyor. Kurum türünü değiştirdiğinizde diğer türe ait " +
                "alanlar profilinizden kalkıyor; profil doluluk oranınız da kurum türünüze uygun " +
                "alanlar üzerinden hesaplanıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Bir hibeye uygun olup olmadığınızı şart şart görüyorsunuz",
                "Hibe detayında programın uygunluk şartları tek tek listeleniyor ve her şartın " +
                "yanında sizin durumunuz yazıyor: sağlıyorsunuz, sağlamıyorsunuz ya da bilgi eksik. " +
                "Eksik bilgi artık \"uygun değilsiniz\" demek değil — firma profilinizi " +
                "tamamladığınızda o şart ölçülebilir hâle geliyor. Uyum puanınızın hangi başlıktan " +
                "kaç puan aldığı da aynı ekranda kırılımıyla duruyor, böylece puanı yükseltmek için " +
                "neye bakmanız gerektiğini görüyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Alacağınız desteği başvuru dosyası hazırlamadan hesaplıyorsunuz",
                "Hibe detayındaki bütçe hesaplayıcıya kalem kalem bütçenizi giriyorsunuz; program " +
                "her kalem için tanımladığı destek oranını uygulayıp tahmini destek tutarını ve " +
                "sizin payınıza düşeni gösteriyor. Program üst limiti devreye girdiğinde bunu " +
                "ayrıca belirtiyor. Aynı sayfada başvurunun süreç adımlarını ve istenen evrak " +
                "listesini de görüyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Açık hibeler listesinde giderebileceğiniz eksikleri ayırıyorsunuz",
                "Tüm açık hibeler listesinde her satırda uygunluk durumunuz, uyum puanınız, destek " +
                "üst limiti ve son başvuruya kalan gün yan yana duruyor. \"Sadece giderilebilir " +
                "eksikleri göster\" süzgeciyle şu an şartını karşılamadığınız ama tamamlayabileceğiniz " +
                "çağrıları ayırıyor, ilgilendiğiniz çağrıları takibe alıp listenizde tutuyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Uygun çağrı çıkmadığında ekranın altı boşuna \"yükleniyor\" görünmüyor",
                "Hibeler ekranında size uygun açık çağrı bulunmadığında sayfanın alt kısmı gri " +
                "yükleniyor kutularını göstermeye devam ediyor, \"Şu an size uygun açık çağrı yok\" " +
                "açıklaması bu kutuların arasında kayboluyordu. Liste boş döndüğünde artık yükleme " +
                "görüntüsü kapanıyor ve doğrudan açıklamayı görüyorsunuz. Aynı durum hibe " +
                "modülündeki bütün listelerde giderildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "\"Yaklaşan son tarihler\" şeridinde çağrı adları üst üste binmiyor",
                "Son başvuru tarihi birbirine yakın olan ya da aynı güne düşen çağrıların adları " +
                "zaman şeridinde iç içe geçip okunamaz hâle geliyordu. Başlıklar artık birbirine " +
                "değmeyecek şekilde aralanıyor, tarayıcı penceresini daralttığınızda da yeniden " +
                "yerleşiyor."),

            // ── Hibe: başvuru süreci ──────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Hibeye \"İlgileniyorum\" diyorsunuz, süreci birlikte başlatıyoruz",
                "Hibe detayındaki \"Başvuru Aç\" düğmesi yerini \"İlgileniyorum\"a bıraktı. Talebinizi " +
                "kısa bir notla bırakıyorsunuz; danışmanlarımız değerlendirip sizinle irtibata geçiyor ve " +
                "uygun görülürse başvuru sürecini birlikte başlatıyoruz — başvurunuz o an açılıyor ve " +
                "\"Başvurularım\" ekranınızda beliriyor. Uygun bulunmayan talepte gerekçesini yazılı " +
                "olarak alıyorsunuz; gerekçe hem bildirim olarak geliyor hem de çağrı sayfasında " +
                "duruyor. Durumunuzu değişirse aynı çağrıya yeniden ilgi bildirebiliyorsunuz. " +
                "Bıraktığınız talepleri \"Başvurularım\" ekranındaki \"İlgi Taleplerim\" listesinden " +
                "izliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Başvuru formunu danışmanınızla aynı anda dolduruyorsunuz",
                "Hibe başvurusu artık adım adım ilerleyen bir formda hazırlanıyor: firma bilgileri, proje " +
                "özeti, bütçe ve gönderim. Danışmanınız aynı anda aynı formda çalışabiliyor; kimin hangi " +
                "alanda olduğunu görüyorsunuz. Aynı alanı ikiniz birden yazamıyorsunuz — girdiğiniz alan " +
                "size ayrılıyor, iki dakika dokunmazsanız serbest kalıyor. Yazdıklarınız kendiliğinden " +
                "kaydediliyor. Bütçe adımında girdiğiniz tutarlara destek oranı ve üst limitler " +
                "anında uygulanıyor; alacağınız desteği ve kendi payınızı yazarken görüyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Evrak listesi çağrıdan otomatik oluşuyor, kim ne yükleyecek belli",
                "Başvurduğunuz çağrının istediği belgeler kontrol listesine kendiliğinden geliyor. Her " +
                "satırda belgenin zorunlu mu koşullu mu olduğu, kimin yükleyeceği ve son durumu yazıyor. " +
                "Yüklediğiniz her dosya yeni bir sürüm olarak saklanıyor — eski sürümler silinmiyor, " +
                "kimin ne zaman yüklediği listede duruyor. Danışmanınız belgeyi onaylıyor ya da gerekçesini " +
                "yazarak revizyon istiyor; düzeltilmiş dosyayı yüklediğinizde eski gerekçe ekrandan " +
                "kalkıyor. Onaylanan belgeler tek tuşla, kurumun beklediği sırayla adlandırılmış tek bir " +
                "zip dosyasında toplanıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "\"Başvurularım\" ekranı sıradaki işin kimde olduğunu söylüyor",
                "Tüm hibe başvurularınız tek listede: hangi aşamada, ne kadar tutarında, son başvuruya kaç " +
                "gün kaldı. En önemlisi her satırda sıradaki işin kimde olduğu yazıyor — sizde bekleyen " +
                "işler ayrıca vurgulanıyor ve doğrudan yapılacak yere götürüyor. Üstteki özet açık " +
                "başvurularınızı, onaylananları, sizden bekleneni, bugüne kadar tahsil edilen tutarı ve " +
                "en yakın son başvuru tarihini gösteriyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Red kararında gerekçeleri madde madde ve danışman görüşüyle görüyorsunuz",
                "Başvurunuz reddedildiğinde kurumun karar yazısındaki her gerekçe ayrı bir madde olarak " +
                "listeleniyor; kurumun kendi ifadesi alıntı olarak duruyor. Danışmanınız her maddeye " +
                "görüşünü yazıyor: bu maddeye itiraz edilebilir mi, yoksa kurum haklı mı. İtiraz " +
                "süresinin ne kadar kaldığını ekranın üstünde gün gün görüyorsunuz. İtiraza konu edilen " +
                "maddeler itiraz dosyasını oluşturuyor; hiçbir madde itiraza konu değilse dosya boş " +
                "gönderilmiyor. Reddedilen başvuru, itiraz süresi dolana kadar açık başvurularınız " +
                "arasında kalıyor. Aynı programın açık bir sonraki çağrısı varsa \"bir daha denemek " +
                "için\" bölümünden doğrudan ulaşabiliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Onaylanan hibede raporları ve tahsilatı tek zincirde izliyorsunuz",
                "Desteğiniz onaylandıktan sonra rapor takvimi ve ödeme dilimleri aynı ekranda, birbirine " +
                "bağlı halkalar hâlinde duruyor: hangi raporun hangi ödemeyi açtığı görünüyor ve raporu " +
                "onaylanmamış bir dilim tahsil edilmiş gösterilemiyor. Raporun alt bölümleri (teknik, " +
                "mali, çizelge, mali müşavir onayı) ayrı ayrı işaretleniyor. Proje bütçeniz kalem kalem " +
                "onaylı / harcanan / kalan olarak izleniyor; bir kalem sınıra yaklaştığında uyarı " +
                "çıkıyor. Yaklaşan rapor teslimleri ve beklenen tahsilatlar tarih sırasıyla listeleniyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Onaylanan hibeniz projeye bağlanıyor",
                "Sözleşme imzalandıktan sonra hibe, projelerinizin arasında yerini alıyor: bütçe " +
                "kalemleriniz proje bütçesine, planladığınız aşamalar göreve, ödeme dilimleri projenin " +
                "gelir planına işleniyor. Başvurunuz kapanmıyor — projeyle bağlı kalıyor, evraklarınız " +
                "ve yazışmalarınız yerinde duruyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Hibe sürecindeki her adım size bildiriliyor",
                "Danışmanınız bir evrakta revizyon istediğinde, başvurunuz yeni bir aşamaya " +
                "geçtiğinde ve kurum kararını girdiğinde bildirim alıyorsunuz. Tarihe bağlı iki " +
                "hatırlatma da otomatik: zorunlu evrak eksikken son başvuruya 7, 3 ve 1 gün kala, " +
                "rapor teslimine ise 30, 14 ve 3 gün kala. Programınıza uygun yeni bir çağrı " +
                "yayına alındığında da haberiniz oluyor. Bildirim tercihlerinizi kapatabilirsiniz — " +
                "tek istisna kurum kararı ve onunla gelen itiraz süresi: kaçırılması doğrudan " +
                "itiraz hakkınızı kaybettirdiği için o bildirim kapatılamıyor."),

            // ── Görev paylaşımı ───────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Bir görevi ekibinizde olmayan kişiye açabiliyorsunuz",
                "Taşeron, tasarımcı, danışman ya da müşteriniz — göreve dahil etmek istediğiniz kişinin " +
                "artık hesap açmasına ya da ekibinize katılmasına gerek yok. Görev detayındaki " +
                "\"Dış Paylaşım\" bölümünden kişiye özel bir bağlantı üretiyorsunuz; o kişi bağlantıyla " +
                "görevi ve alt görevlerini görüyor, yorum yazıyor, dosya yükleyip indirebiliyor. " +
                "Yorumları ve dosyaları görevin içine düşüyor, ekibiniz bildirim alıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Paylaşımda neyi açacağınıza siz karar veriyorsunuz",
                "Bağlantıyı üretirken yorum yazma, dosya yükleme ve dosya indirme yetkilerini tek tek " +
                "açıp kapatabiliyor, kaç gün geçerli olacağını belirliyorsunuz. Süresi dolan bağlantı " +
                "kendiliğinden kapanır; dilediğiniz an elle de iptal edebilirsiniz. Her erişim " +
                "kaydedilir, kaç kez bakıldığını ve kaç dosya yüklendiğini listede görürsünüz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Security,
                "Ekip içi yazışmanız dışarı çıkmaz",
                "Paylaşım bağlantısını açan kişi yalnız kendisiyle kurulan yazışmayı görür — ekibinizin " +
                "görev üzerinde kendi arasında yazdıkları ona gösterilmez. Dosyalarda da aynı kural " +
                "geçerli: bir dosya, siz \"dış paylaşımda görünsün\" demedikçe dışarıdan erişilemez."),

            // ── Mobil ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Projeler telefonda çok daha az kaydırma istiyor",
                "Proje listesi ekranında üstteki başlık bloğu ekranın yarısını kaplıyordu; aynı bilgiyi " +
                "iki kez gösteren satırlar kaldırıldı ve sıralama kutusu filtre şeridinin yanına alındı. " +
                "İlk proje kartı artık ekranın çok daha yukarısında başlıyor, araç çubuğu tek satıra indi. " +
                "Bilgisayarda görünüm aynı kaldı."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Görevler ekranı telefonda tek satıra indi, ekleme düğmesi parmağın altına geldi",
                "Görevler ekranında üstteki blok telefonda üç satır kaplıyor, arama kutusunu ve " +
                "sayaçları aşağı itiyordu. Başlık, arama ve \"⋯\" menüsü artık tek satırda duruyor; " +
                "\"Yeni Görev\" düğmesi sağ alt köşedeki yuvarlak + düğmesine taşındı, yani tek elle " +
                "kullanırken parmağınızın zaten olduğu yere. Kanban'daki \"Grupla\" seçimi de " +
                "\"Filtreler\" düğmesinin içine girdi. Görev listesi bu sayede ekranın belirgin " +
                "biçimde yukarısından başlıyor. Bilgisayarda görünüm aynı kaldı."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Mobilde giriş sırasında çıkan hata giderildi",
                "Telefondan giriş yaparken zaman zaman \"Hata! Sayfa işlenirken sunucu tarafında " +
                "beklenmedik bir hata oluştu\" ekranı çıkıyordu. Giriş sayfası artık çevrimdışı " +
                "önbelleğe alınmıyor; giriş her seferinde doğrudan sunucudan geliyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Sekmeler ve sürüklenebilir öğeler tek tıklamayla açılıyor",
                "Görev detayındaki sekmeler (Genel · Alt Görevler · Dosyalar), takvimdeki etkinlik " +
                "çubukları, belge satırları ve form oluşturucudaki soru kartları bazen ilk tıklamada " +
                "tepki vermiyordu — fare azıcık kaydığında tıklama sürüklemeye dönüşüyordu. Hepsi " +
                "artık ilk tıklamada çalışıyor. Form oluşturucuda kartlar yalnız soldaki tutamaçtan " +
                "sürükleniyor, böylece kart içindeki metni fareyle seçebiliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Genel Bakış telefonda ekranın tepesinden başlıyor",
                "Genel Bakış'ta üst barda zaten yazan sayfa adı bir kez daha başlık olarak " +
                "tekrarlanıyor, altındaki boş şeritle birlikte ekranın üst üçte birini kaplıyordu — " +
                "kartları görmek için kaydırmanız gerekiyordu. Telefonda bu başlık kaldırıldı; özet " +
                "kartları üst barın hemen altından başlıyor. Görünüm ve dönem seçicileri kartların " +
                "hemen altında, yan yana duruyor. Bilgisayarda görünüm aynı kaldı."),

            // ── Paket ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Paketinizde kapalı olan özellikleri menüden görebiliyorsunuz",
                "Menünün altında \"Kilitli özellikler\" kısayolu çıkıyor; oradan paketinizde kapalı olan " +
                "yeteneklerin listesine ulaşıyorsunuz. Daha önce kapalı bir modül menüde hiç görünmediği " +
                "için neyi kaçırdığınızı fark etmiyordunuz. Kısayol yalnız gerçekten kapalı bir özelliğiniz " +
                "varsa çıkar — her şeyi kapsayan pakette hiç görünmez."),

            // ── Takvim ────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Google ve Outlook takvim bağlantısı gerçekten çalışıyor",
                "\"Google bağla\" / \"Outlook bağla\" düğmeleri sizi sağlayıcının kendi izin ekranına " +
                "değil bir deneme sayfasına götürüyordu: hesap bağlı görünüyor, ama bağlı takvimden " +
                "hiçbir etkinlik gelmiyordu. Düğmeler artık gerçek izin ekranını açıyor. Ayrıca " +
                "gönderilen etkinlikler dış takvime saat farkı kadar kaymış işleniyordu (Türkiye'de " +
                "üç saat); saatler artık her iki yönde de doğru taşınıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Takvim sol menüde kendi başına duruyor",
                "Takvim, görev görünüşlerini toplayan \"Panolar\" grubunun içindeydi: kendi ekranı, " +
                "kendi hatırlatmaları ve Google/Outlook bağlantısı olmasına rağmen açmak için önce " +
                "o grubu açmanız gerekiyordu. Artık sol menüde doğrudan kendi satırında — tek tıkla " +
                "geliyor. Takvimi eskiden Panolar'ın altında arıyorsanız artık menüde kendi " +
                "başlığıyla duruyor. Ekranın içinde hiçbir şey değişmedi."),

            // ── Genel ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Genel Bakış'ı olduğu gibi kağıda dökebiliyorsunuz",
                "Ekranı yazdırmayı denediğinizde kart düzeni kağıda sığmıyor, kartların ekrana " +
                "sığsın diye kısalttığı listeler de kısalmış hâliyle çıkıyordu; toplantıya " +
                "götürdüğünüz çıktıda satırların bir kısmı eksik oluyordu. Artık üstteki " +
                "\"Yazdır\" düğmesi A4 yatay, üç bölümlük bir rapor üretiyor: sayısal özet ve " +
                "istatistikler, teslimler-proje sağlığı-tıkanan işler, onaylar-gelir/gider-teslim " +
                "yoğunluğu. Listeler kırpılmıyor ve ekranda tek sekmede gördüğünüz " +
                "istatistiklerin beş grubu da basılıyor. Her sayfanın üstünde kurum adı, seçili " +
                "görünüm, dönemin tarih aralığı, yazdıran kişi ve saat yazıyor — tek yaprak " +
                "elden ele dolaşsa da neye ait olduğu belli oluyor. Yetkiniz olmayan kutucuklar " +
                "kağıda da rakam yazmıyor. Telefondan da yazdırabiliyorsunuz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Hibe ekranları açılırken içerik zıplamıyor",
                "Liste ve sayaç içeren hibe ekranlarında veri gelene kadar boş bir alan duruyor, " +
                "veri gelince de sayfa yerinden oynuyordu. Artık yükleme sırasında satırların ve " +
                "sayıların yerini tutan gri bloklar görünüyor; içerik geldiğinde aynı yere " +
                "yerleşiyor, tıklamak üzere olduğunuz düğme kaymıyor. Sayaçlar da veri gelmeden " +
                "önce \"0\" yazmıyor — boş bir rakam gerçek bir değer sanılabiliyordu."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Başvuru formunda bağlantı koptuğunda ne olduğunu görüyorsunuz",
                "Danışmanınızla birlikte doldurduğunuz formda canlı bağlantı koptuğunda ekranda " +
                "yalnız \"canlı\" işareti kayboluyordu ve neyin çalışmaya devam ettiği belirsizdi. " +
                "Artık açıkça yazıyor: yazdıklarınız kaydedilmeye devam ediyor, üzerinde " +
                "çalıştığınız alanlar size ayrılmış kalıyor; yansımayan tek şey karşı tarafın o " +
                "anki değişiklikleri. Bağlantı gelince ekran kendiliğinden tazeleniyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görev açıklaması kayıtlı olduğu hâlde boş görünmüyor",
                "Bir görevin detayını ikinci kez açtığınızda açıklama alanı boş geliyor, kayıt yerinde " +
                "olduğu hâlde \"kaydedilmemiş\" izlenimi veriyordu. Ayrıca alt görev panelinden \"tam " +
                "ekran aç\" ya da \"görevi çoğalt\" ile başka göreve geçildiğinde önceki görevin metni " +
                "ekranda kalıyor, üzerine yazılıp kaydedilirse yeni görevin açıklamasını eziyordu. İkisi " +
                "de düzeltildi; açıklama her açılışta kayıtlı hâliyle geliyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Proje ve hibe ekranlarında tarih alanları kaydedilebiliyor",
                "Proje düzenleme ekranında tarihe hiç dokunmasanız bile kayıt \"«24.07.2025», " +
                "Başlangıç tarihi için geçerli bir değer değil\" hatasıyla düşüyordu — hiçbir " +
                "değişikliği kaydedemiyordunuz. Aynı kusur hibe tarafında da vardı: çağrının açılış " +
                "ve son başvuru tarihi, dilim ve kilometre taşı vadesi, projeye dönüştürmede " +
                "başlangıç-bitiş, kurum profilinde kuruluş tarihi. Hepsi düzeltildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Açıklama alanları tek satırlık kutu olmaktan çıktı",
                "Proje düzenleme, hibe ekleme-düzenleme ve görev düzenleme formlarındaki Açıklama " +
                "alanı çok satırlı olması gerekirken sıradan tek satırlık metin kutusu olarak " +
                "çiziliyordu; uzun bir metni yazarken göremiyordunuz. Bu alanlar artık birkaç satır " +
                "yüksekliğinde açılıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Cari yetkisi olmayan kullanıcı da proje açıp düzenleyebiliyor",
                "\"Yeni Proje Ekle\" düğmesi görünüyor ama tıklayınca pencere hiç açılmıyordu; proje " +
                "düzenleme ekranı da aynı şekilde açılmıyordu. Sebebi, formdaki cari listesinin cari " +
                "yetkisi olmayan kullanıcıda pencerenin tamamını düşürmesiydi. Artık yetkiniz yoksa " +
                "cari alanı hiç çizilmiyor ve form normal açılıyor. Ayrıca proje düzenlemede kayıt " +
                "sırasında mevcut cari bağlantısının sessizce silinmesi de giderildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Hibe ekranlarında yazılar ve düğmeler okunaklı boyuta geldi",
                "Hibe ekranları yoğun kullanım için sıkışık çizilmişti: yardımcı metinler ve tablo " +
                "hücreleri küçük ve açık gri, düğmeler dardı. Yirmi hibe ekranında gövde yazısı, " +
                "etiketler ve rozet metinleri büyütüldü, ikincil metnin rengi koyulaştırıldı, giriş " +
                "kutuları ve düğmeler dokunmaya elverişli yüksekliğe çıkarıldı, kart içi boşluklar " +
                "açıldı. İçerik ve akış değişmedi; yalnız okunması kolaylaştı."),

            // ── Görev görünümleri ─────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Görevin içine belge yazıyorsunuz",
                "Göreve şimdiye kadar yalnız dosya ekleyebiliyordunuz; toplantı notunu, teknik " +
                "şartnameyi ya da teslim tutanağını ya ayrı bir dosyada tutuyor ya da açıklama " +
                "alanına sıkıştırıyordunuz. Artık görevin Belge sekmesinde istediğiniz kadar belge " +
                "açıp içine doğrudan yazıyorsunuz — başlık veriyor, biçimlendiriyor, kaydediyorsunuz. " +
                "Listede her belgenin son düzenleyeni ve tarihi görünüyor; sildiğiniz belge geri " +
                "getirilebilir şekilde saklanıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Alt görevlerinizi tablo, kanban ve takvim olarak görüyorsunuz",
                "Bir görevin alt görevleri yalnız kart listesi hâlinde duruyordu; hangisinin terminin " +
                "yaklaştığını ya da kaçının hangi durumda olduğunu görmek için tek tek bakmak " +
                "gerekiyordu. Görev detayına üç yeni sekme geldi: Tablo, alt görevleri kolonlara " +
                "dizip başlığa tıklayarak sıralamanızı sağlıyor (tarihi girilmemiş satırlar hep " +
                "sonda kalıyor); Kanban, alt görevleri duruma göre sütunlara ayırıyor ve kartı başka " +
                "sütuna sürüklediğinizde durum anında kaydediliyor; Takvim, görevin ve alt " +
                "görevlerinin başlangıç ve termin tarihlerini aylık ızgarada gösteriyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Görevler ekranına takvim, gösterge paneli ve dosya galerisi eklendi",
                "Görevler konsolunda Liste, Kanban ve Zaman Çizelgesi vardı; üçü de tek tek görevlere " +
                "bakmak içindi. Üç görünüm daha geldi ve hepsi o an seçili filtreyi izliyor: Takvim, " +
                "görevleri başlangıç ve termin tarihlerine göre aylık olarak yerleştiriyor; Gösterge " +
                "Paneli, seçtiğiniz kapsamın durum, öncelik ve kişi dağılımını grafiklerle ve " +
                "toplam / tamamlanan / gecikmiş sayaçlarıyla özetliyor; Dosya Galerisi ise " +
                "görevlere eklenmiş görselleri tek ızgarada topluyor. Filtreyi değiştirdiğinizde " +
                "üçü de yeni kapsama göre yenileniyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Özellik kataloğunda artık yalnız çalışan modüller var",
                "Göreve özellik eklerken çıkan listede, eklediğinizde \"yapım aşamasında\" boş " +
                "ekranıyla karşılaştığınız modüller de duruyordu — Riskler, Onaylar, Otomasyonlar, " +
                "Özel Alanlar, E-postalar, Yapay Zeka ve Gösterge Paneli gibi. Katalog artık yalnız " +
                "gerçekten iş gören modülleri listeliyor. Aynı turda Kontrol Listesi, Geçmiş ve " +
                "Dosya Galerisi sekmeleri kullanıma açıldı. Görev yorumları ayrı bir sekme olmaktan " +
                "çıktı; zaten Genel sekmesinde durdukları yerde duruyorlar. Daha önce bir göreve " +
                "eklediğiniz özellikler silinmedi, yalnız görünmüyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Panolar tek ekrana bağlandı, Kanban'ın adı Kart Panosu oldu",
                "Kanban'ın menüde ayrı bir sayfası vardı ve Görevler ekranındaki sekmeyle aynı " +
                "panoyu gösteriyordu; ama ikisi filtre çubuğunu paylaşmadığı için birinde " +
                "daralttığınız kapsam diğerine geçmiyor, aynı işi iki yerde yapıyordunuz. " +
                "Menüdeki \"Panolar\" başlığı artık üç görünüşü de aynı ekrana bağlıyor: Görevler, " +
                "Kart Panosu ve Zaman Çizelgesi. Her biri Görevler ekranını doğrudan kendi " +
                "sekmesiyle açıyor, üçü de o an seçili filtreyi paylaşıyor. Başlığın kendisi de " +
                "tıklanabilir hâle geldi — üstüne basınca görev listesi geliyor, yanındaki oka " +
                "basınca grup katlanıyor. \"Kanban\" adı hem menüde hem sekmede \"Kart Panosu\" " +
                "oldu; kanbanı eski ayrı adresinden açmaya çalışırsanız sizi doğru sekmeye " +
                "yönlendiriyor, kaydettiğiniz bağlantılar boşa düşmüyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Tutar yazarken binlik ve ondalık ayracı kendiliğinden çıkıyor",
                "Gider, gelir, kasa hareketi, fatura, bütçe kalemi, tahsilat, fonlama dilimi ve görev " +
                "bütçesi gibi tutar alanlarında ayraçları elle koymanız gerekmiyor: 1234567 " +
                "yazdığınızda alan yazarken 1.234.567 hâline geliyor, ondalık için virgül " +
                "kullanıyorsunuz. Uzun tutarlarda basamak saymak ya da fazladan yazılmış bir sıfırı " +
                "gözden kaçırmak yok. Kur alanları altı, oran ve miktar alanları iki ondalık hane " +
                "kabul ediyor."),

            // ── Görev finansı ─────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Gideri, geliri ve faturayı görevin içinden kesiyorsunuz",
                "Görev detayındaki Finans sekmesi yalnız okunuyordu: göreve ait bir gider ya da " +
                "gelir kaydetmek için Finans modülüne gidip kaydı görevle elle eşleştirmeniz " +
                "gerekiyordu. Sekmenin başlığında artık \"Gider ekle\", \"Gelir ekle\" ve " +
                "\"Fatura ekle\" düğmeleri var; alışık olduğunuz formlar açılıyor ve görevin " +
                "projesi önden seçili geliyor. Kayıt kapanınca sekme kendiliğinden tazeleniyor. " +
                "Her düğme kendi yetkisine bağlı — gider yetkiniz yoksa yalnız o düğme çıkmıyor. " +
                "Faturalar ayrı bir kartta duruyor: tutarları KDV dâhil olduğu için gider ve " +
                "gelir toplamlarına karıştırılmadı, yoksa fatura ödendiğinde aynı para iki kez " +
                "sayılırdı."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Görevi bütçe kalemine görevin kendi ekranından bağlıyorsunuz",
                "\"Bütçe bağı\" kartı artık düzenlenebilir: görevin hangi bütçe kalemine ait " +
                "olduğunu ve o görev için ayırdığınız tutarı buradan seçiyorsunuz. Bu iki alan " +
                "daha önce yalnız eski görev penceresinden ayarlanabiliyordu, o pencere de artık " +
                "açılmıyordu; yani kart pratikte hiç dolmuyordu. Kalem listesi finans " +
                "formlarındakiyle aynı. Bütçe görme yetkiniz varsa görünür."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Gidere evrakını bağlayabiliyorsunuz",
                "Finans sekmesindeki gider satırlarında \"Evrak\" düğmesi çıktı; bir gideri, " +
                "Belgeler modülünde duran fatura ya da fişiyle eşleştiriyorsunuz. Kaç evrak bağlı " +
                "olduğu satırda yazıyor. Yükleme buradan yapılmıyor — belge Belgeler modülünde " +
                "yaşamaya devam ediyor, bu ekran yalnız bağı kuruyor; proje ekranındaki " +
                "eşleştirme tezgâhıyla aynı bağ."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görevi kaydetmek bütçe bağını artık silmiyor",
                "Görev detayından yaptığınız her kayıt, görevin bütçe kalemi bağını ve planlanan " +
                "tutarını sessizce siliyordu — ilgisiz bir alanı düzeltip Kaydet'e bassanız bile. " +
                "Hiçbir uyarı çıkmadığı için kaybın fark edilmesi ancak bütçe raporuna " +
                "bakıldığında mümkündü. Düzeltildi. Bütçe kalemine bağladığınız görevler varsa " +
                "bağlarının yerinde olduğunu bir kez kontrol etmenizde fayda var; artık " +
                "görevin kendi Finans sekmesinden yeniden kurabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Göreve özellik eklerken bütün seçenekler tek ekranda görünüyor",
                "Özellik ekleme penceresinde kartlar \"GÖREV & PLANLAMA\", \"GEÇMİŞ & FİNANS\" " +
                "gibi gruplara ayrılmıştı ve aradığınızı bulmak için pencereyi kaydırmanız " +
                "gerekiyordu. Grup başlıkları kalktı, katalog tek liste oldu ve üst şerit " +
                "inceltildi: on iki seçeneğin hepsi hem bilgisayarda hem telefonda kaydırmadan " +
                "sığıyor. Telefonda kart açıklamaları gizleniyor, ekli olan özellikler kartın " +
                "kenarlığından anlaşılıyor. Arama kutusu yerinde duruyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Görevin dosyaları ve görselleri sekmeyi açar açmaz görünüyor",
                "Görev detayındaki Dosyalar ve Görseller sekmelerinde \"buraya sürükleyin\" kutusu " +
                "en üstte duruyordu; yüklü dosyalar ve görseller onun altında kaldığı için sekmeyi " +
                "açtığınızda ekranda hiçbiri görünmüyor, listeye ulaşmak için her seferinde aşağı " +
                "kaydırmanız gerekiyordu. Kutu listenin altına alındı: sekme açılır açılmaz dosyalar " +
                "ve görseller karşınıza çıkıyor, yükleme yine aynı yerde, sadece listeden sonra.")
        ),

        new ReleaseNote(
            version: "2026.08.27",
            date: "27 Ağustos 2026",
            title: "Kanban, kişiselleştirilebilir menü ve mobil deneyim",

            // ── Kanban & görev akışı ──────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Kanban panosu yenilendi",
                "Kolonları tek tek açıp kapatabiliyorsunuz; kapattığınız kolon ince bir şeride dönüşüp " +
                "yer açıyor. Kolon araçları kartların üzerinden alınıp üstteki eylem çubuğuna taşındı, " +
                "böylece pano kalabalıkken de kartlar okunaklı kalıyor."),

            // ── Projeler ──────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Kendi proje kategorilerinizi tanımlayın",
                "Proje kategorileri artık sabit bir listeden gelmiyor. Ayarlar > Projeler altından " +
                "kendi kategorilerinizi ekleyebilir; adını, simgesini, rengini ve sırasını " +
                "belirleyebilirsiniz. Kullanmadığınız hazır kategorileri de gizleyebilirsiniz. " +
                "Bir kategori projelerde kullanılıyorsa silinmez — önce projeleri taşımanız gerekir."),

            // ── Menü & Ayarlar ────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Sol menüyü kendinize göre düzenleyin",
                "Menü öğelerinin sırasını sürükleyerek değiştirebilir, kullanmadıklarınızı gizleyebilir, " +
                "kendi kategorinizi ve kısayolunuzu ekleyebilirsiniz. Bir öğeyi kenar çubuğu ile Ayarlar " +
                "arasında taşıyabilir, kenar çubuğunun genişliğini tutamağından ayarlayabilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Ayarlar sayfası sekmeli düzene geçti",
                "Tek uzun sayfa yerine sekmeler var; Yönetim ve Menü sekmeleri en başta duruyor. " +
                "Aradığınız ayarı bulmak için artık sayfayı baştan sona kaydırmanız gerekmiyor."),

            // ── Paket & abonelik ──────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "\"Paketim\" ekranı",
                "Hangi pakette olduğunuzu, paketinizin neleri kapsadığını ve kullanım kotanızın ne kadarını " +
                "doldurduğunuzu tek ekranda görüyorsunuz. Bir kotaya takıldığınızda çıkan uyarı sizi doğrudan " +
                "bu ekrana ve üst pakete yönlendiriyor."),

            // ── Mobil ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Telefonu yan çevirdiğinizde de mobil düzen kullanılıyor",
                "Yatay tutulan telefonda uygulama masaüstü düzenine geçiyor ve menü sığmıyordu; artık bu " +
                "durumda da hamburger menü ve mobil yerleşim devrede. Yatay ekranda görev listesinin " +
                "sıkışıp görünmez olduğu sorun da giderildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Görevlerde mobil filtre düğmesi",
                "Telefonda ekranın yarısını kaplayan filtre satırı tek bir düğmenin altına katlandı; " +
                "görev kimliği ve başlığı tek satırda duruyor. Liste için daha çok yer kalıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Takvim mobilde toparlandı",
                "Araç çubuğu dar ekranda taşmıyor; \"Yeni görev\" düğmesi sağ alttaki yüzen düğmeye taşındı."),

            // ── Hız ───────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Sayfalar daha az istekle açılıyor",
                "Açılışta yapılan tekrar eden sunucu istekleri ayıklandı, dosyalar tarayıcıya daha erken " +
                "bildiriliyor ve sık kullandığınız listeler oturum boyunca önbellekte tutuluyor. " +
                "Sayfalar arasında geçiş belirgin biçimde hızlandı."),

            // ── Genel ─────────────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Hata mesajları Türkçeleşti",
                "Form doğrulama uyarıları ve sistem hata metinleri sistem genelinde Türkçeye çevrildi; " +
                "\"The field X is required\" gibi İngilizce kalıntılar kalmadı."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Kişi baş harfleri ve renkleri her yerde aynı",
                "Aynı kişi; görev listesinde, takvimde, profil rozetinde ve görev detayında artık aynı baş " +
                "harfleri ve aynı rengi taşıyor. Baş harfler ad ve soyadın ilk harfinden üretiliyor, koyu " +
                "temada okunabilirlik de düzeltildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Proje düzenlemede kullanılmayan \"Süresi\" alanı kaldırıldı",
                "Hiçbir yerde işlenmeyen serbest metin alanı formdan çıkarıldı; proje süresi başlangıç ve " +
                "bitiş tarihlerinden okunuyor."),

            // ── Düzeltmeler ───────────────────────────────────────────────────
            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Çerez bildirimi bir daha sorulmuyor",
                "\"Anladım\" dedikten sonra şerit her yeni sayfada tekrar çıkıyordu; onayınız artık kalıcı."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görev detayında açılır pencereler iPhone'da kapanmıyor",
                "iPhone ve iPad'de atama, etiket ve tarih seçicileri dokunur dokunmaz kapanıyordu. " +
                "Aynı pencerelerdeki arama kutuları da artık odak alıp yazı kabul ediyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görev detayındaki \"⋯\" menüsü tam görünüyor",
                "Yorum ve açıklama satırlarındaki üç nokta menüsü pencere kenarında kırpılıyor, seçenekler " +
                "okunamıyordu. Menü artık pencere içinde kendine yer buluyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Açıklama ve yorumlara bağlantı eklenebiliyor",
                "Zengin metin araç çubuğundaki bağlantı düğmesi çalışmıyordu; düzeltildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Görev detayı penceresi dar ve yatay ekranlarda kırpılmıyor",
                "Küçük telefonlarda ve yatay tutuşta pencerenin başlığı ve alt kısmı kesiliyordu."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Mobil menüde grup satırına basınca boş ekran açılıyordu",
                "Alt öğeleri olan bir menü başlığına dokunduğunuzda boş bir sayfaya düşülüyordu; başlık " +
                "artık yalnızca grubu açıp kapatıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Menü düzenini kaydettiğinizde sonucu görüyorsunuz",
                "Kaydet düğmesi sessiz kalıyor, işlem olmuş mu olmamış mı anlaşılmıyordu. Artık başarı " +
                "bildirimi veriliyor, bir sorun varsa hata mesajı ekrana basılıyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Uzun proje ve menü adları kesilmiyor",
                "Kenar çubuğunda sabit genişlik yüzünden kırpılan adlar yer olduğu kadar uzuyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Dokümanlarda detay paneli tam boy açılıyor",
                "Panel yarım görünüyor, alt kısmına ulaşılamıyordu. Dar ekranda eylem düğmelerinin taşması " +
                "da giderildi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Panodaki kartlar üst üste binmiyor",
                "Ana sayfada özet şeridi alttaki kartların üzerine taşıyordu; kart aralıkları ve sayfa " +
                "kenar boşlukları da düzenlendi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Projeler ekranı tüm projelerle açılıyor",
                "Konsol, siz bir filtre seçmeden yalnız bir bölümü gösteriyordu; artık varsayılan olarak " +
                "bütün projeler listeleniyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Yeni Görev'de tarih kutusu kendiliğinden açılmıyor",
                "Form açıldığında takvim kutusu açık geliyor ve kapanmıyordu."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Dokunmatik ekranda sürükleme",
                "Telefon ve tablette kart sürüklerken sayfanın da kayması engellendi."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Kullanıcı adındaki fazladan boşluk girişi engellemiyor",
                "Kopyala-yapıştır sırasında araya karışan boşluk yüzünden doğru şifreyle bile giriş " +
                "yapılamıyordu; baştaki ve sondaki boşluklar artık temizleniyor.")
        ),

        new ReleaseNote(
            version: "2026.08.25",
            date: "25 Ağustos 2026",
            title: "Proje ve görev ekranlarında yenilenme",

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Proje düzenleme ekranı",
                "Projeleri artık kendi düzenleme sayfasında güncelleyebilirsiniz; proje kartındaki " +
                "düzenle düğmesi sizi bu ekrana götürür. Silme işlemi güvenlik için menüden kaldırıldı — " +
                "bir projeyi silmek için düzenleme ekranında proje kodunu yazarak onaylamanız gerekiyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Projelere kapak görseli ve dosya ekleme",
                "Projelere kapak görseli yükleyebilir; sözleşme, teklif gibi dosyaları doğrudan projenin " +
                "kendisine ekleyebilirsiniz."),

            new ReleaseNoteItem(ReleaseNoteCategory.Feature,
                "Yeni Görev ekranı ve hızlı giriş satırı",
                "Görev oluşturma ekranı yenilendi. Hızlı giriş satırına yazarken @kişi ile atama, " +
                "#etiket, !öncelik ve >tarih kısayollarını kullanabilirsiniz. Bu ekstralar paketinize " +
                "ve yetkinize bağlıdır; kapalı olsa da görev oluşturma çalışmaya devam eder."),

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Yeni Proje formu yenilendi",
                "Yeni proje oluşturma penceresi tek ekranda toplandı. Kategori seçtiğinizde o kategoriye " +
                "uygun hazır bir görev takvimi öneriliyor ve isterseniz projeyle birlikte oluşturuluyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Aynı proje kodu artık iki kez kullanılamıyor",
                "Daha önce aynı proje kodu farkında olmadan ikinci bir projeye verilebiliyordu. " +
                "Kod artık kaydedilirken sunucu tarafında kontrol ediliyor."),

            new ReleaseNoteItem(ReleaseNoteCategory.Fix,
                "Panodaki proje bağlantısı düzeltildi",
                "Ana sayfadaki \"Proje Sağlığı\" kartında bir projeye tıklandığında açılmayan bağlantı düzeltildi."),

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

            new ReleaseNoteItem(ReleaseNoteCategory.Improvement,
                "Girişte artık kiracı adı sormuyoruz",
                "Kullanıcı adınız (veya e-postanız) ve şifrenizle giriş yapmanız yeterli; hesabınızın bağlı " +
                "olduğu firma otomatik bulunuyor.")
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
}
