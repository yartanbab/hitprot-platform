# Makro Ekran — uygulama notları

Tasarım kaydı: [`README.md`](README.md) (şartname) · Maket: [`makro-ekran.dc.html`](makro-ekran.dc.html)
(paketteki adı `Makro Ekran.dc.html`; boşluksuz ada çevrildi) · İstem: [`CLAUDE_CODE_PROMPT.md`](CLAUDE_CODE_PROMPT.md)

Şartname 2026-09-17 tarihli depo kopyasından çıkarıldı. Aşağıdaki farklar 2026-10-14'te
bugünkü kodla ölçüldü; kararlar aynı gün kullanıcıyla verildi. **Şartname ile bu dosya
çeliştiğinde bu dosya geçerlidir.**

## Kararlar (2026-10-14)

1. **Bileşik makro motoru ertelendi** (1c ön izleme, 3b hata hali, "Geri al", `previewToken`,
   çalıştırma günlüğü). İlk sürüm yalnız **Bağlantı** ve **Pencere** türlerini taşır. Motor,
   taşıyacağı gerçek akış belli olunca yapılır (aday: host'un "ilgi talebinden başvuru başlat"ı).
2. **Makro tanımı koddaki eylem kataloğundan seçilir.** Host hedef adresi, izni ve adımları
   elle yazmaz; ad, ikon, kapsam, varsayılan sabit ve yayın durumunu yönetir. Yanlış yazılmış
   bir izin adı makroyu herkese açardı; adım sırası da kodla belirli.
3. **Haberler mevcut kaynaklardan türetilir:** açık çağrılar ("Yeni çağrı", afiş görseli var),
   sürüm notları ("Platform"), kendi başvuru sonuçları ("Sonuç"). "Mevzuat" türü yok; yeni
   haber varlığı ve host yazma ekranı yok.
4. **Güncelleme rozeti ve "gelişme var" işareti okunmamış bildirimlerden türetilir**; makro
   rozeti accent renktedir (kırmızı yalnız bildirim sayısında).
5. **Giriş sayfası Genel Bakış kalır.** `/Makro` menüde ayrı öğe. (Varsayılan yapılırsa service
   worker kaydı taşınmalı: bugün onu Genel Bakış adası yapıyor — `dynamic-assets/src/dashboard.jsx`.)
6. **Şema:** `AppMacros` (host kaydı, `IMultiTenant` değil), `AppMacroUsageDaily` (kiracı kaydı,
   günlük toplanmış sayaç, 30 günden eskisi silinir); çift migration. Host'a özel izin
   `Macros.Manage`.

## Şartnameden bilinçli sapmalar

- Adres `/Makro`, klasör `Pages/Macros/` (alan klasörü kuralı). Host sayfası `/Admin/Macros`
  (oturumlu kabukta tüm host sayfaları `/Admin/<İngilizce>`).
- Sabitleme tek ayarda (`Platform.Shell.Pins`): menüde karşılığı olan makro menü adıyla,
  olmayan `Apya.Macro.<anahtar>` adıyla yazılır. Kenar çubuğu menüde bulamadığı adı zaten
  atlar; 12'lik üst sınır ortaktır.
- Koyu tema `[data-theme="dark"]` token'larıyla kendiliğinden gelir (`.apya-dark` sınıfı yok).
- ⌘K: "OLUŞTUR" grubu zaten var; yeni grup açılmaz, mevcut grup (ve "+ Yeni" menüsü) makro
  listesine bağlanır.
- 2b (tablo + çekmece) yapılmaz; 1b ayrı ekran değil, palete girer; "Makro ekle" düğmesi yok.
- 1a 1180 px yükseklik ister; daha kısa ekranda sayfa kayar.
- Kapsam çipleri gerçek adlarla: paketler Basic / Standard / Premium / Enterprise, rol
  şablonları Proje Sorumlusu / Muhasebe / Gözlemci.
- "Takvime etkinlik" `/Calendars` bağlantısıdır (etkinlik oluşturma penceresi yok). Bekleyen
  işlerin "onay bekleyen gider / fatura" sayacı taslak fatura sayısıdır (gider onay akışı yok).
- "Fatura yakala" mevcut `/Expenses/Capture` ("Masraf Yakala") sayfasıdır. Otomatik okuma hâlâ
  deneme verisi üretir (`dynamic-assets/src/expense/hooks/fixtures.js`), fotoğraf sunucuya gitmez.
- Mobil (1g, ≤575px): **çevrimdışı kuyruk ("☁ N bekliyor") yapılmadı** — yakalama sayfası fotoğrafı
  bugün sunucuya hiç göndermiyor, kuyruklanacak bir yükleme yok. Uzun basış menü açmaz, sabitlemeyi doğrudan açar/kapatır ve
  bildirimle söyler; "Düzenle" erişilebilir yol olarak kalır. Sekme yüksekliği 40 değil 44px
  (dokunma hedefi ≥44px kuralı).
- **Kart güncelleme rozeti** (karar 4): okunmamış bildirimin bağlantısı katalogdaki
  `NotificationPaths` ile makroya eşlenir (en uzun yol parçası kazanır; geri bildirim, abonelik,
  yapay zekâ bildirimleri hiçbir rozete girmez). **Makroyu açmak rozeti sıfırlamaz** — bildirim
  okununca düşer (kullanıcı kararı 2026-10-14; şartnamedeki "açınca sıfırlanır" yerine). Pencere
  (oluşturma) makrolarında rozet yok.

## Şartnamenin tutmayan varsayımları (ölçüm)

| Şartname | Kodda durum |
|---|---|
| Kiracı "Çağrıdan başvuru başlat" ile başvuru + aşama + görev + belge üretir | Kiracı başvuru açamaz (bilinçli kural, `GrantInterestAppService` sınıf yorumu). Başvuruyu host ilgi talebinden açar (`GrantInterestHostAppService.StartApplicationAsync`). `GrantStageTemplate.Apply`, `Tasks.CreateFromStages` yok. |
| Ön izleme belirteci, çalıştırma günlüğü, toplu geri alma | Yok. En yakın emsal hibe→proje dönüşüm önizlemesi (durum kapılı). |
| Haber kayıtları | Haber varlığı yok. |
| `ShellPins` makroları da tutar | Ayar menü adı listesi; kenar çubuğu menüde olmayan adı sessizce atlar. |
| ⌘K'ya yeni "OLUŞTUR" grubu | Grup var (`command-palette.js` `createEntries`), ikinci kopyası `apya-shell-actions.js` `createActions`. |

## Uygulama sırası

Her madde ayrı PR. Şemalı olan yalnız 5; onu kullanıcı birleştirir.

1. Bu paket (yalnız belge).
2. Sayfa + menü + eylem kataloğu + makro ızgarası.
3. Paneller: bildirimler, bana ait kayıtlar, bekleyen işler (ayrı uç; `/api/app/shell/state`'e eklenmez).
4. Haber şeridi + "Tüm haberler".
5. Makro tanımı + kullanım sayacı (şema).
6. Host yönetimi `/Admin/Macros` (2a).
7. Boş durum (3a).
8. Mobil (1g).
9. ⌘K ve "+ Yeni" tek kaynağa bağlanır.
