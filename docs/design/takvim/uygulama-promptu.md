# Takvim yönetimi & entegrasyonu — uygulama promptu

Bu dosya, `Takvim Yeniden Tasarım.dc.html` (tasarım turları 1–7) ve `Takvim Çıktısı.dc.html`
(A4 baskı) mockup'larının koda dönüştürülmesi için hazırlanmış hazır brief'tir.
Bir geliştiriciye ya da Claude Code'a olduğu gibi verilebilir.

---

## Bağlam

- Repo: `yartanbab/hitprot-platform` (ABP + Razor Pages + LeptonX, branch `main`)
- Değişecek alan: `src/Apya.Platform.Web/Pages/Calendars/`
  - `Index.cshtml`, `Index.cshtml.cs`
  - `wwwroot/Pages/Calendars/calendar.js`, `index.js`
  - `SimulateAuth.cshtml` (hesap bağlama simülasyonu — akış korunacak)
- Servis/DTO: `Apya.Platform.Application.Contracts/Calendars/CalendarDtos.cs`,
  `Apya.Platform.Domain/Calendars/ExternalCalendarAccount.cs`
- Stil kaynağı: `wwwroot/dynamic-assets/src/styles/tokens.css` +
  `wwwroot/css/apya-theme-bridge.css`. **Yeni renk uydurma yok** — hex yerine mevcut
  token'lar (`--apya-*`) kullanılacak; dark tema `[data-theme="dark"]` bloğundan gelir.
- İkonlar: LeptonX ile gelen Font Awesome 6 (`fa`, `fab`). Marka logoları için
  `SimulateAuth.cshtml`'deki resmî Google Calendar SVG'si; Outlook için `fab fa-windows`.

## Bugünkü durum (neden değişiyor)

Tek ay grid'i + sağda "Bu Hafta" listesi; entegrasyon kartları sayfanın **altında**.
Hafta/gün görünümü yok, öğeye tıklayınca ilgili listeye gidiliyor, senkron durumu
ve son senkron zamanı hiç görünmüyor, yoğun günde hücre "+17 daha" ile taşıyor.

---

## Yapılacaklar

### 1. Görünüm anahtarı — Ay / Hafta / Gün / Ajanda
- Varsayılan: **Ay**. Seçim kullanıcı başına saklanır (query string + localStorage).
- **Ay**: yoğun günde tek tek pill yerine *tür başına özet satırı*
  ("12 görev", "2 fatura · ₺163.400", "3 dış etkinlik"). Yalnız **riskli** öğeler
  kendi satırını ve rengini alır. Satıra tıklamak drawer'da o türü listeler.
- **Hafta**: son tarihler üstte ayrı **şeritte** (saat ızgarasına inmez), altta
  saat ızgarası yalnız dış takvim etkinlikleri için; "şimdi" çizgisi.
- **Ajanda**: öncelik sırası — Gecikmiş bloğu en üstte, "hepsini bugüne al" toplu
  aksiyonu, satır içi onay kutusuyla tamamlama (sayfa değişmez).
- Gün hücresinde ince **kapasite çubuğu**: gün yükü / günlük kapasite; aşan kısım kırmızı.

### 2. Kaynaklar (6 kaynak)
Görev · Fatura vadesi · Hibe son tarihi · Gider/gelir vadesi · Nakit hareketi ·
Dış takvim etkinliği. Sol **kaynak rayında** açılıp kapanır, sayaçları görünür.
Renk mantığı: **nötr pill + küçük tür ikonu**; renk yalnız risk için —
gecikmiş = kırmızı, bugün son gün = amber, senkron hatası = kritik kırmızı.

### 3. Etkinlik drawer'ı (sağdan)
Başlık, durum, son tarih (satır içi değiştirme), atanan, proje/müşteri, tutar,
senkron durumu (hangi dış takvimde), hızlı aksiyonlar (tamamla / +1 gün ertele / sil),
hareket geçmişi. Öğeye tıklamak artık listeye **gitmez**, drawer açar.

### 4. Entegrasyon = sağdan açılan ayar drawer'ı
Sayfanın altındaki kartlar kaldırılır. Drawer içeriği:
- Hesap kartları (Google, Outlook): bağlı/bağlı değil, son senkron zamanı, kes.
- **Hesap başına senkron kuralları**: hangi kaynak türleri gitsin (görev, fatura,
  nakit…), hangi projeler gitsin (chip listesi).
- **iCal**: iki yön —
  - *dışa*: salt-okunur APYA abonelik linki (`/ical/u/{token}.ics`), kopyala.
  - *içeri*: herhangi bir `.ics` bağlantısını ekle → doğrulama (kaç etkinlik bulundu),
    görünen ad, renk, yenileme sıklığı (15 dk / 1 sa / 6 sa / günlük).
    Tek yönlü ve salt-okunur olduğu açıkça yazılır.
- **Çakışma kuralı**: varsayılan **son değişen kazanır**; alternatif "APYA her zaman kazanır".
- **Senkron günlüğü**: yazılan öğe sayısı, çözülen çakışma, hata + "yeniden bağla".
- Çakışma sonrası ekranda kalıcı **geri alma şeridi** (toast değil).

### 5. Kapasite & akıllı erteleme
- Günlük kapasite ayarı (4/6/8 sa veya kapalı) — kurulumda sorulur.
- Aşımda toolbar'da uyarı pili + drawer'da kapasite kartı.
- **Akıllı toplu erteleme**: gecikmiş öğeler için önerilen yeni tarihler (boş günlere
  dağıtılır), onay kutularıyla topluca uygulanır. **Fatura/gider vadeleri değişmez** —
  satırda "fatura — değişmez" olarak gösterilir.
- Önerilen tarihler ay grid'inde kesikli çerçeveyle önizlenir.

### 6. Ekip katmanı
Rayda anahtar; açıkken gün/hafta başlığında kişi başına yük şeritleri.
Yetki: yalnız kullanıcının görebildiği projelerin görevleri; dış takvim etkinlikleri
başlıksız "meşgul" olarak görünür.

### 7. Toplantıdan görev
Dış takvim etkinliği drawer'ında notlardan çıkarılan aksiyon maddeleri
(önerilen tarihlerle), onaylayınca görev olarak eklenir.

### 8. Durumlar
- İskelet yükleme (kaynaklar sırayla dolar; grid zıplamaz).
- İyimser güncelleme: sürükle-bırak anında uygulanır, satırda "kaydediliyor",
  başarıda "kaydedildi + geri al", hatada **satırda** kalan hata + "yeniden dene".
- Çevrimdışı: değişiklikler kuyrukta, bağlantı gelince gönderilir.
- Senkron sürerken ray satırında ilerleme; takvim kullanılabilir kalır.
- Boş durumlar: (a) hiç veri yok, (b) filtre sonucu boş → en yakın eşleşen aya atlama,
  (c) bağlantı bozuk (yetki süresi doldu / ICS 404) → bekleyen öğe sayısı + düzeltme.

### 9. İlk kurulum (3 adım)
1. Kaynak seçimi + günlük kapasite → 2. Dış takvim bağla (atlanabilir) →
3. Çakışma kuralı. Her adım atlanabilir, sonradan drawer'dan değiştirilebilir.

### 10. Duyarlılık
- ≥1280px: ray (256) + grid + drawer (396).
- 768–1024px (tablet): ray **ikonlara daralır** (60px), drawer takvimin **üstüne biner**;
  dışına dokunma veya `Esc` kapatır.
- <768px (mobil web): varsayılan **Ajanda**; gün detayları alttan sheet;
  ay görünümü kompakt; tüm dokunma hedefleri **≥44px**.

### 11. Erişilebilirlik
- `?` ile açılan kısayol haritası: `←→` gün, `↑↓` hafta, `T` bugün,
  `M/W/D/A` görünüm, `N` yeni görev, `E` drawer, `⇧+→` 1 gün ertele, `⌘Z` geri al.
- Grid **tek sekme durağı** + roving tabindex (42 hücre sekme sırasını doldurmaz);
  görünür odak halkası (3px, aksan rengi %30 alfa).
- Renk tek başına anlam taşımaz: risk = renk + **desen** (gecikmiş çapraz tarama,
  son gün dikey çizgi) + ikon. Metin kontrastı ≥ 4.5:1.
- `aria-live=polite` erteleme/taşıma duyurusu; `aria-live=assertive` senkron hatası.
- Sürükle-bırakla yapılabilen her şey klavyeyle de yapılabilir.

### 12. Baskı / PDF
Ayrı çıktı: A4 **yatay**, 2 sayfa — (1) aylık takvim + kaynak renk anahtarı,
(2) haftalık ajanda, gecikmiş bloğu üstte, elle işaretlenebilir onay kutuları.
Baskıda dolgular kalkar; risk sol kenar çizgisi + koyu metinle anlatılır.
Referans: `Takvim Çıktısı.dc.html`.

---

## Kabul kriterleri

1. Dört görünüm çalışır, seçim sayfa yenilemede korunur.
2. Bir günde 20+ öğe varken hücre taşmaz, "+N daha" yerine tür özeti görünür.
3. Öğeye tıklamak drawer açar; drawer'dan son tarih değiştirmek takvimi anında günceller ve dış takvime yazar.
4. Google/Outlook bağlama akışı bozulmadan çalışır; hesap başına kural ve proje filtresi kaydedilir.
5. Geçerli bir `.ics` linki eklenince etkinlikler salt-okunur katman olarak görünür;
   geçersiz linkte satır hata durumuna düşer.
6. Çift yönlü çakışmada son değişen kazanır ve geri alma şeridi çıkar.
7. 834px genişlikte üç kolon çakışmaz; 390px'de ajanda + sheet ile tüm işlemler yapılabilir.
8. Klavyeyle: takvimde gezinme, öğe seçme, erteleme, geri alma — fare olmadan tamamlanır.
9. Yeni hiçbir renk `tokens.css` dışından gelmez; dark tema kendiliğinden doğru görünür.
10. Baskı çıktısı A4 yatay iki sayfada, kırpılma olmadan basılır.

## Kapsam dışı (şimdilik)

Sürükle-bırak dışında takvim üzerinden saat atama, tekrarlayan etkinlik oluşturma,
harici davetli yönetimi, takvim paylaşma izinleri.
