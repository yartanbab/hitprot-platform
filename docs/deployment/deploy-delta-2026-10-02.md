# Deploy delta — 2026-10-02 (`f7919944` → güncel `main`)

Canlıda koşan kod 2026‑10‑01'de yeniden ölçüldü: hâlâ **`f7919944`** (`d8a01af6` + şifre belirleme
hotfix'i). 2026‑09‑25'te kesilen `c967be48` paketi **yüklenmemiş**:

| Canlıdaki dosya | Canlı blob | `f7919944` | `7edfbff4` (c967be48 paketi) | güncel |
|---|---|---|---|---|
| `Pages/TenantManagement/Tenants/Index.js` | `9b4d6eba` | **`9b4d6eba`** | `9b4d6eba` | `e79e9890` |
| `Pages/Grants/Detail.js` | `6035efaa` | **`6035efaa`** | `e3312aab` | `0ff54dab` |
| `Pages/Grants/NotificationTemplates.js` | `751e192f` | **`751e192f`** | `da29af1a` | `8b266eef` |
| `css/apya-shell.css` | `ce7baefa` | **`ce7baefa`** | `8d304515` | `2ba99bd5` |
| `Pages/Grants/Ideas.js` | 302 (yok) | yok | `4c15c6c0` | `01ec6d50` |
| `js/apya-load-state.js` | 302 (yok) | yok | yok | `e4402d0e` |

Bu paket `c967be48` paketinin **yerine geçer** ve onun içerdiği her şeyi taşır. Yani iki belge
birlikte geçerlidir:

1. **[`deploy-delta-2026-09-21.md`](deploy-delta-2026-09-21.md)** — `f7919944` → `c967be48` (67 commit):
   üç migration, iki P0 güvenlik düzeltmesi, finans doğruluğu, hibe modülü. **Oradaki "Deploy ÖNCESİ
   yapılacaklar" listesinin tamamı hâlâ geçerli** (kasa kur ölçümü, fatura yetkisi, tarihi geçmiş
   açık çağrı sayımı, korunacak dosyalar).
2. **Bu belge** — onun üstüne gelenler: #477–#487 ve UX denetimi Faz 5'in ilk dalgası.

> 🔴 **`c967be48` paketi ARTIK ESKİ — onu değil, bu paketi yükleyin.** `1db6556d` paketi zaten
> eskiydi (yüklenirse şifre hotfix'ini ezer).

Paket adı, boyutu ve girdi sayısı paket klasöründeki `OKU-BENI.txt` dosyasındadır (paket bu belge
commit'lendikten sonra kesilir; belge commit'i `src/` ve `test/` ağacını değiştirmez).

---

## 🔴 DbMigrator ŞART

Yeni **migration yok**; şema, önceki belgedeki üç migration'la (GrantProgramIdentityFields,
GrantInterestIdeaPool, GrantIdeaInvitations — çift sağlayıcı) aynı. DbMigrator yine de zorunlu:

- canlı bu üç migration'ı hiç almadı;
- **#478** yeni bir hibe bildirim şablonu tohumluyor ("Yeni proje fikri" — firma proje fikrini
  paylaşınca danışman ekibine bildirim). Tohumlayıcı yalnız EKSİK tetikleyicileri ekler, mevcut
  şablonları ezmez.

Başarıyı çıkış kodundan değil log'daki `"Successfully completed all database migrations."`
satırından doğrulayın.

---

## Ne iniyor (önceki belgenin üstüne)

### UX/QA denetimi — Faz 1–4 (#483–#486) ve bildirim düzeltmesi (#487)

- **Faz 1 — yetki ve güvenlik (#484):** görev durumunu, önceliğini, tarihlerini, sorumlusunu ve
  kontrol listesini yalnız görevi oluşturan, atanan kişi ya da **"Ekip Yönetimi"** izni olan
  değiştirebiliyor (pano, takvim, görev detayı, alt görev, bağımlılık ve finans sekmeleri aynı
  kuralı uyguluyor) · görev açıklaması güvenli gösteriliyor (XSS) · ortak cihazda taslaklar ve
  çevrimdışı kuyruk kişiye özel · Paketim ekranı gerçek modülleri gösteriyor · yönetici menüsünden
  host'a ait bağlantılar kalktı.
- **Faz 2 — kırık akışlar (#483):** fatura, cari, gider/gelir/kur pencereleri yeniden kaydediyor ·
  tutar maskesi yazdığınız değeri kaydediyor · Masraf Yakala · hibe sihirbazı · tablet menüsü.
- **Faz 3 — sessiz veri kaybı ve bayat ekran (#485):** kısmi güncelleme başka alanları silmiyor
  (zaman çizelgesi, toplu künye, alt görev) · görev detayı güncel bilgiyle açılıyor · arama ve
  filtrede yalnız son sonuç · form oluşturucu başka yerde yapılan değişikliği ezmiyor · Kasa &
  Banka sayfa yenilemeden güncelleniyor · kurum profili yüklenmeden kaydedilemiyor.
- **Faz 4 — hata yolu (#486):** hata metinleri ve oturum düşmesi tek kanaldan · yükleme hatasında
  "Tekrar dene" · ada hata sınırı · doğru durum kodları (404 / erişim reddi sayfaları) · yetkisiz
  eylemler gizli değil kilitli.
- **#487:** bildirim açık pencereyi kapatmıyor, düğmeleri örtmüyor (pencere açıkken üst‑orta).

### UX/QA denetimi — Faz 5, ilk dalga (bu PR)

- Görev detayında ve Dokümanlar'da **kaydetmeden çıkarken soruluyor**; kayıt düşerse pencerede
  kilitli kalınmıyor; doğrulama hatası alanın altında.
- Tutar alanı olan pencereler (Yeni Gider/Gelir/Kur…) **boşken** "kaydedilmemiş değişiklik" diye
  sormuyor; gerçek değişiklikte ortak onay; pencere kapanınca odak açan düğmeye dönüyor.
- Takvim iCal adres hatası Türkçe · proje kategorisi düzenleme durumu/sırayı bozmuyor · hibe
  "aşama değişikliği" bildirimi yalnız aşama değişince · dönüştürülmüş talep ikinci kiracıyı açamıyor.
- Host: AI Ayarları'nda sağlayıcı listeden seçiliyor · sürüm notu "Hepsini onayla" geri alınınca
  önceki onaylar korunuyor · kayıt talebi formu adım hafızası.

### Diğer (#477–#482)

Bildirim zamanı doğru görünüyor ("3 saat önce" hatası) · günlük e‑posta özeti penceresi · fikir
paylaşımı danışman ekibine bildiriliyor · canlı eşleşme önizlemesi yazarken hata penceresi açmıyor ·
yayın kapısı kapalıyken sonraki adım düğmeyle gösteriliyor.

---

## 🔴 Deploy ÖNCESİ yapılacaklar (önceki belgedeki 6 maddeye EK)

### 7. "Ekip Yönetimi" izni — rol kontrolü

Faz 1'den sonra bir kullanıcı **başkasına ait** görevi (oluşturmadığı ve kendisine atanmamış)
yalnız rolünde Projeler altındaki **"Ekip Yönetimi"** izni varsa değiştirebilir. Ekip
arkadaşlarının görevlerini düzenlemesi gereken kişilerin (proje yöneticisi, koordinatör) rollerine
bu izni deploy'dan **önce** verin; aksi hâlde bu kişiler ilk gün "Salt okunur" etiketiyle karşılaşır.

### 8. AI Ayarları — serbest metin döneminden kalan sağlayıcı adları (yalnız host)

Sağlayıcı artık listeden seçiliyor ve sunucu bilinmeyen adı reddediyor. Geçersiz kayıt varsa ekran
boş seçim + uyarıyla açılır ve bir sağlayıcı seçilmeden kaydedilemez. Kaç kayıt etkileniyor:

```sql
SELECT COUNT(*) FROM ai.AiTenantSettings
WHERE LOWER(PreferredProvider) NOT IN ('openai', 'claude', 'gemini', 'deepseek');
```

**0 → ek iş yok.** (PostgreSQL'de: `ai."AiTenantSettings"`, sütun `"PreferredProvider"`.)

### 9. Sürüm notu yayın onayı

`/Admin/ReleaseNotes` ekranında onay bekleyen sürümler: **2026.09.15**, **2026.09.17**,
**2026.09.21** ve **2026.09.27** (39 madde). Kataloğa yazmak yayınlamak değildir; onaylanmayan
madde kiracı kullanıcısına gitmez. "Hepsini onayla" kutusu artık kısmi durumu gösterir ve geri
alınınca önceki onayları korur.

### 10. Açık sekmeler

Global betik demeti ve React ada demetleri sunucuyla **aynı yayında** değişti (`pending-approvals`
yanıt biçimi dahil). Deploy sonrası açık kalmış sekmeler yenilenmelidir; kullanıcılara duyurun.

---

## Deploy sonrası doğrulama (önceki belgedeki 9 maddeye EK)

10. Bir "Yeni Gider" penceresini açıp **hiçbir şey yazmadan** Esc: onay sormadan kapanmalı. Başlığa
    yazıp Esc: "Kaydedilmemiş değişiklikleriniz var" (Düzenlemeye devam et / Değişiklikleri at).
11. Görev detayında bir alanı değiştirip "Vazgeç": aynı başlıklı üç düğmeli pencere çıkmalı.
12. Tarayıcı konsolunda `typeof apya.confirm`, `typeof apya.busy`, `typeof apya.dirtyGuard.watch`
    → üçü de `"function"` (değilse global demet eski: uygulama havuzunu yeniden başlatın).
13. Başkasına ait bir görevi açın: başlıkta "Salt okunur" etiketi; kendi görevinizde yok.
14. `/Grants/NotificationTemplates` — "Yeni proje fikri" tetikleyicisi listede ve adı okunur
    (ham `Grants:Notify:Trigger:...` görünüyorsa tohumlama koşmamıştır).

---

*Bu belge 2026‑10‑02'de, UX/QA denetimi (2026‑09‑28) düzeltme fazlarının yayına hazırlanması
sırasında yazıldı. Faz 5'in kalan dalgaları (sayfa formlarında kirli‑form işareti, onay
tekleştirme, çift gönderim tüketicileri, form pencereleri) bu pakette **yoktur**.*
