namespace Apya.Platform.Agreements;

/// <summary>
/// Hizmet protokolünün metni. Kaynak: "APYA Platformu Hizmet, Lisans ve Danışmanlık
/// Protokolü" (PARGETTO), 9 madde.
///
/// <para><b>Neden kodda?</b> Onaylanan metnin SHA-256 özeti hukuki delil (Madde 9). Özetin
/// yeniden hesaplanabilir olması için metnin baytı baytına sürümlenmiş olması gerekir;
/// veritabanında düzenlenebilir bir metin bunu veremezdi. Metin değişince
/// <see cref="ServiceAgreementConsts.TemplateVersion"/> ARTIRILIR — eski sözleşmeler
/// kendi kopyalarını zaten taşır ve etkilenmez.</para>
///
/// <para><b>Şablon motoru YOK.</b> Yer tutucular düz metin değişimiyle doldurulur
/// (<see cref="ProtocolRenderer"/>). Bu projede Scriban, ABP 10 ile ikili uyuşmazlığı
/// yüzünden runtime'da kırılıyor; sabit bir metin için motor zaten gereksiz.</para>
///
/// <para>🔐 Doldurulan değerler <b>HTML olarak kaçırılır</b>: kurum unvanı ve adres adayın
/// serbest metnidir, ham basılsaydı protokol sayfası XSS taşıyıcısı olurdu.</para>
/// </summary>
public static class ProtocolTemplate
{
    /// <summary>Yer tutucu adları — renderer ile şablon arasındaki tek sözleşme.</summary>
    public static class Keys
    {
        public const string ProtocolNumber = "{{PROTOKOL_NO}}";
        public const string Date = "{{TARIH}}";
        public const string CompanyName = "{{KURUM_UNVANI}}";
        public const string TaxNumber = "{{KURUM_VERGI_KUTUK_NO}}";
        public const string Address = "{{KURUM_ADRES}}";
        public const string AuthorizedEmail = "{{KURUM_YETKILI_EPOSTA}}";
        public const string Phone = "{{KURUM_TELEFON}}";
        public const string PlanName = "{{SECILEN_PAKET_ADI}}";
        public const string Amount = "{{PAKET_BEDELI}}";
        public const string SuccessFeePercent = "{{BASARI_PRIMI_ORANI}}";
        public const string AuthorizedName = "{{KURUM_YETKILI_ADI_SOYADI}}";
        public const string AuthorizedTitle = "{{KURUM_YETKILI_GOREV}}";
        public const string UserEmail = "{{KURUM_KULLANICI_EPOSTA}}";
        public const string ApprovalIp = "{{ONAY_IP_ADRESI}}";
        public const string ApprovalTimestamp = "{{ONAY_ZAMAN_DAMGASI}}";
        public const string VerificationHash = "{{HASH_VERIFICATION_TOKEN}}";
    }

    public const string Html = """
<article class="apya-doc">
<h1>APYA PLATFORMU HİZMET, LİSANS VE DANIŞMANLIK PROTOKOLÜ</h1>
<p class="apya-doc__meta">Sistem Referans Kodu: {{PROTOKOL_NO}} &nbsp;|&nbsp; Oluşturulma Tarihi: {{TARIH}}</p>

<h2>Madde 1 – Sözleşmenin Tarafları ve İletişim Bilgileri</h2>
<p>İşbu Protokol, bir tarafta SaaS platform sağlayıcısı ve Ar-Ge yüklenicisi olarak
PUSULA İLERİ TEKNOLOJİ AR-GE VE TEKNOLOJİ TRANSFERİ LTD. ŞTİ. (bundan sonra
<strong>PARGETTO</strong> olarak anılacaktır) ile diğer tarafta APYA Platformu üzerinden
elektronik kayıt ve paket seçimini gerçekleştiren tüzel kişilik (bundan sonra
<strong>KURUM</strong> olarak anılacaktır) arasında aşağıda belirtilen şartlar dâhilinde
akdedilmiştir.</p>

<table class="apya-doc__table">
<thead><tr><th>PARGETTO (Hizmet Sağlayıcı)</th><th>KURUM (Kullanıcı / Müşteri)</th></tr></thead>
<tbody>
<tr>
<td>
<strong>Unvan:</strong> PUSULA İLERİ TEKNOLOJİ AR-GE VE TEKNOLOJİ TRANSFERİ LTD. ŞTİ.<br />
<strong>Vergi Dairesi / No:</strong> Halkalı V.D. – 7330956504<br />
<strong>Adres:</strong> Zaim Teknopark, Halkalı Merkez Mah. Halkalı Cad. No:281/23 Ofis No:34, Küçükçekmece / İstanbul<br />
<strong>E-posta:</strong> apya@pargetto.com<br />
<strong>Telefon:</strong> 0546 404 06 00
</td>
<td>
<strong>Unvan:</strong> {{KURUM_UNVANI}}<br />
<strong>Vergi Dairesi / Kütük No:</strong> {{KURUM_VERGI_KUTUK_NO}}<br />
<strong>Tebligat Adresi:</strong> {{KURUM_ADRES}}<br />
<strong>Yetkili E-posta:</strong> {{KURUM_YETKILI_EPOSTA}}<br />
<strong>Yetkili Telefon:</strong> {{KURUM_TELEFON}}
</td>
</tr>
</tbody>
</table>

<h2>Madde 2 – Sözleşmenin Konusu</h2>
<p>İşbu Protokolün konusu; PARGETTO tarafından Teknopark bünyesinde geliştirilen ve Sanayi ve
Teknoloji Bakanlığı nezdinde kayıtlı (085102 STB Kodlu) "Yapay Zekâ Tabanlı Akıllı Proje
Yönetim Asistanı" (APYA Platformu) yazılım uygulamasının KURUM'un kullanımına sunulması,
hibe/fon havuzu takibi, proje yürütme altyapısı, saha veri girişi ile seçilen çalışma modeli
kapsamındaki danışmanlık ve teknik destek esaslarının düzenlenmesidir.</p>

<h2>Madde 3 – Paket Seçimi ve Hizmet Kapsamı</h2>
<p>KURUM, APYA Platformu üzerinden kendi kurumsal ölçeğine uygun olan paketi elektronik
ortamda seçerek onaylamıştır. Paketlere ilişkin operasyonel haklar ve kapsam aşağıdaki gibidir:</p>

<table class="apya-doc__table">
<thead><tr><th>Paket Adı</th><th>Kullanıcı &amp; Kurum Kotası</th><th>Proje Yönetim Kapasitesi</th><th>Dahil Olan Modüller ve Hizmetler</th></tr></thead>
<tbody>
<tr><td>Standart Paket</td><td>1 Kurum / 2 Tanımlı Kullanıcı</td><td>2 Proje Geliştirme ve Yönetimi</td><td>Kurum Proje Geliştirme Kartı, temel hibe içerik ve duyuru bülteni, görev ve takvim yönetimi.</td></tr>
<tr><td>Kurumsal Paket (Popüler)</td><td>1 Kurum / 10 Tanımlı Kullanıcı</td><td>5 Proje Geliştirme ve Yönetimi</td><td>Tüm Standart hakları, Yapay Zekâ Destekli Hibe Eşleştirme ve Ön Değerlendirme, Gelişmiş Raporlama Desteği, Bütçe-Kasa Entegrasyonu.</td></tr>
<tr><td>Ortak Paket Sistemi</td><td>2 Kurum / 4 Kullanıcı (isteğe bağlı ek kurum ilavesi)</td><td>2 + 2 Proje Geliştirme ve Yönetimi</td><td>Tüm Standart hakları, çoklu tüzel kişilik koordinasyonu, Ortak Proje ve Fon Havuz Erişimi, konsorsiyum proje yönetimi.</td></tr>
</tbody>
</table>

<p class="apya-doc__highlight"><strong>Seçilen Paket:</strong> {{SECILEN_PAKET_ADI}} &nbsp;|&nbsp;
<strong>Yıllık Lisans/Kullanım Bedeli:</strong> {{PAKET_BEDELI}}</p>

<h2>Madde 4 – Lisanslama, Fikri Haklar ve Çalışma Usulleri</h2>
<ol>
<li><strong>Mülkiyet:</strong> APYA Platformu'nun tüm fikri mülkiyeti, algoritmaları, kaynak
kodları ve arayüz tasarımları münhasıran PARGETTO'ya aittir. KURUM, işbu Protokol ile yalnızca
sözleşme süresince geçerli, devredilemez ve münhasır olmayan bir kullanım hakkı (SaaS Lisansı)
elde eder.</li>
<li><strong>Kurum Verileri:</strong> KURUM tarafından sisteme girilen proje metinleri, bütçeler,
üye/gönüllü kayıtları, stratejik planlar ve özgün proje fikirleri tamamen KURUM'un mülkiyetindedir.
PARGETTO bu veriler üzerinde herhangi bir fikri veya ticari hak iddia edemez.</li>
<li><strong>Saha ve Mobil Kullanım:</strong> Platform kurulum gerektirmez; KURUM personeli ve saha
gönüllüleri görev güncellemelerini, harcama fişlerini ve tutanak fotoğraflarını mobil cihazlar
üzerinden anlık olarak sisteme işleyebilir.</li>
<li><strong>Sorumluluk Sınırı:</strong> APYA hibe modülü çağrı metinlerini tarayıp uygunluk
önerileri sunar; ancak proje başvurularının nihai değerlendirmesi ve kabulü münhasıran fon
sağlayan kuruluşların (Ulusal Ajans, TÜBİTAK, Kalkınma Ajansları vb.) yetkisindedir. PARGETTO
teknik eksiklik haricinde hibe retlerinden sorumlu tutulamaz.</li>
</ol>

<h2>Madde 5 – Mali Hükümler ve Proje Başarı Primi</h2>
<ol>
<li><strong>Lisans Ödemesi:</strong> Platform kullanım bedeli, sistem üzerinden seçim yapıldıktan
sonra kesilecek faturayı müteakip 15 (on beş) takvim günü içinde PARGETTO'nun Kuveyt Türk Katılım
Bankası nezdindeki TR19 0020 5000 0995 6446 0000 01 IBAN numaralı hesabına defaten ödenir.</li>
<li><strong>KDV İstisnası:</strong> Teknopark Ar-Ge ve yazılım mevzuatı kapsamında KDV istisnası
uygulanan hallerde faturalandırma yasal mevzuata uygun şekilde KDV'siz olarak gerçekleştirilir.
Damga vergisi doğması durumunda yükümlülük KURUM'a aittir.</li>
<li><strong>Başarı ve Yürütme Primi:</strong> KURUM adına APYA / PARGETTO proje danışmanlığı
desteğiyle geliştirilip fon kuruluşlarına sunulan projelerin onaylanması durumunda, kazanılan hibe
tutarı üzerinden %{{BASARI_PRIMI_ORANI}} başarı primi tahakkuk ettirilir. ERASMUS Gençlik ve
hareketlilik projelerinde PARGETTO'ya 2 kişilik kontenjan verilmemesi halinde bu oran %15 olarak
uygulanır.</li>
</ol>

<h2>Madde 6 – KVKK ve Veri İşleme Taahhütnamesi</h2>
<ol>
<li><strong>Roller:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca
KURUM, APYA veri tabanına yüklediği personel, gönüllü ve yararlanıcı verileri açısından
"Veri Sorumlusu"; PARGETTO ise altyapı hizmeti sağlayıcısı olarak "Veri İşleyen" sıfatını haizdir.</li>
<li><strong>Veri Güvenliği:</strong> PARGETTO, verilerin saklandığı bulut sunucularda endüstri
standardı şifreleme, güvenlik duvarı, rol bazlı erişim denetimi ve loglama mekanizmalarını tesis
etmekle yükümlüdür.</li>
<li><strong>Açık Rıza ve Yükümlülük:</strong> KURUM, sisteme dahil ettiği tüm üçüncü şahıslara
ilişkin aydınlatma ve açık rıza yükümlülüklerini yerine getirdiğini kabul ve taahhüt eder.
PARGETTO bu verileri sözleşme amacı dışında hiçbir üçüncü kişi veya kurumla paylaşamaz, ticari
amaçla işleyemez.</li>
</ol>

<h2>Madde 7 – Gizlilik</h2>
<p>Taraflar, işbu Protokol süresince ve Protokolün herhangi bir nedenle sona ermesinden sonra da
süresiz olarak; birbirlerinin ticari, mali, operasyonel ve teknik sırlarını, yazılım kaynaklarını
ve müşteri/üye verilerini gizli tutmayı ve yasal zorunluluklar hariç üçüncü kişilere açıklamamayı
kabul ve taahhüt ederler.</p>

<h2>Madde 8 – Süre, Fesih ve Uyuşmazlıkların Çözümü</h2>
<ol>
<li>İşbu Protokol sistem üzerinden onaylandığı tarihte yürürlüğe girer ve 1 (bir) yıl süreyle
geçerlidir. Süre bitiminde tarafların mutabakatıyla yenilenebilir.</li>
<li>Taraflardan her biri, 15 (on beş) gün önceden yazılı veya kayıtlı elektronik posta ile
bildirmek kaydıyla işbu Protokolü tek taraflı olarak feshetme hakkına sahiptir.</li>
<li>İşbu Protokolün uygulanmasından doğabilecek her türlü uyuşmazlığın çözümünde İstanbul Ticaret
Odası Tahkim ve Arabuluculuk Merkezi (İTOTAM) yetkilidir.</li>
</ol>

<h2>Madde 9 – Elektronik İrade Beyanı, Onay ve Yürürlük</h2>
<p>İşbu Protokol 9 ana maddeden ibaret olup, KURUM yetkilisinin APYA Platformu üzerinde paket
seçimi sonrasında ilgili onay kutularını işaretlemesi, sistemin zaman damgası (timestamp) ve IP
adresi ile bu onayı doğrulamasıyla hukuken bağlayıcı olarak yürürlüğe girmiştir.</p>

<div class="apya-doc__seal">
<p class="apya-doc__seal-title">SİSTEM ÜZERİNDEN ALINAN ELEKTRONİK ONAY VE DOĞRULAMA KAYDI</p>
<p>[X] APYA Platformu Hizmet, Lisans ve Danışmanlık Protokolü hükümlerini okudum, anladım ve
kurumum adına aynen kabul ediyorum.</p>
<p>[X] 6698 Sayılı KVKK Uyarınca Veri Sorumlusu ve Veri İşleyen Karşılıklı Taahhütlerini
Onaylıyorum.</p>
<dl>
<dt>İşlemi Yapan Yetkili</dt><dd>{{KURUM_YETKILI_ADI_SOYADI}}</dd>
<dt>Unvan / Görev</dt><dd>{{KURUM_YETKILI_GOREV}}</dd>
<dt>Kullanıcı E-posta</dt><dd>{{KURUM_KULLANICI_EPOSTA}}</dd>
<dt>İşlem IP Adresi</dt><dd>{{ONAY_IP_ADRESI}}</dd>
<dt>Onay Zaman Damgası</dt><dd>{{ONAY_ZAMAN_DAMGASI}}</dd>
<dt>Elektronik Doğrulama Hash Kodu</dt><dd class="apya-doc__hash">{{HASH_VERIFICATION_TOKEN}}</dd>
</dl>
</div>
</article>
""";
}
