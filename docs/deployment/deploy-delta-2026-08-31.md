# Deploy delta — 2026-08-31 (`63cb35c6` → `main`)

> **Hedef SHA bilerek başlıkta değil.** Belgenin kendi commit'i `main`'i ilerlettiği için
> buraya yazılan her SHA yazıldığı anda bayatlar. Paketin üretildiği tam commit, paket
> klasöründeki `OKUBENI-deploy.md` başlığında ve ZIP adında yazılıdır — tek doğru kaynak
> orasıdır. `docs/` publish çıktısına hiç girmediği için bu belgeye gelen sonraki
> değişiklikler paketi etkilemez.

Taban `63cb35c6` — 2026-08-27 #2 yayınıyla canlıya inen commit
(bkz. `deploy-delta-2026-08-27-2.md`). O yayın tamamlandı ve doğrulandı.

---

## 🔴 ÖNCE OKU — canlı şu anda ÇÖKÜK (bu deploy'dan bağımsız)

2026-08-31 14:48 UTC'de dışarıdan ölçüldü:

| Uç | Ölçülen |
|---|---|
| `/health/ready` | **502** (8,5 sn) |
| `/` | **502** (8,0 sn) |
| `/js/style.css` (statik) | **502** (9,3 sn) |

Gövde: `HTTP Error 502.5 — ANCM Out-Of-Process Startup Failure`.
**Statik dosyanın bile 502 vermesi** IIS'in isteği uygulamaya proxy'lediğini ve uygulama
sürecinin hiç ayağa kalkmadığını gösterir. Bu, 2026-08-26 olayının birebir imzasıdır.

Bilinen iki sebep — ikisi de sunucuda yaşayan, **pakette bulunmayan** dosyalar:

| Kayıp | Belirti |
|---|---|
| `openiddict.pfx` | Tam olarak bu 502.5. Log: `openiddict.pfx bulunamadı` |
| `appsettings.secrets.json` | Bağlantı dizesi localhost'a düşer → başlangıçta çöker |

🔴 **Sıra önemli.** Site zaten çökükken deploy edersen, sonrasında hâlâ 502 alırsan bunun
sebebinin eski mi yeni mi olduğunu ayırt edemezsin. Doğru sıra: **önce 502.5'i çöz, siteyi
ayağa kaldır, sonra bu paketi indir.**

Teşhis (Plesk'te konsol yok, Zamanlanmış Görev ile):

```
@echo off
cd /d "%~dp0"
powershell -Command "$p=Start-Process .\Apya.Platform.Web.exe -NoNewWindow -PassThru -RedirectStandardOutput sd_out.txt -RedirectStandardError sd_err.txt; if(-not $p.WaitForExit(60000)){$p.Kill()}"
```

Uygulamanın kendi log'u: `apya.pargetto.com\Logs\logs.txt` (son 60 satır yeter).

> Bu çöküş, canlı kodun gerçekten `63cb35c6` olduğunu **ölçerek** doğrulamayı da engelledi.
> Aşağıdaki "deploy öncesi" parmak izi sütunu bu yüzden ölçülemedi; taban kayıttan alındı.

---

## 🔴 MIGRATION VAR — DbMigrator ve veritabanı yedeği ZORUNLU

| | 08-27 #2 (önceki) | **Bu yayın** |
|---|---|---|
| Yeni migration | YOK | **2 adet (çift sağlayıcı)** |
| Şema değişikliği | YOK | **VAR — 2 tablo, 3 kolon, 5 indeks** |
| DbMigrator | zorunlu (izin tohumu) | **🔴 ZORUNLU — hem şema hem izin tohumu** |
| Veritabanı yedeği | önerilir | **🔴 ZORUNLU** |
| Üretilecek paket | 2 (Web + DbMigrator) | **2 (Web + DbMigrator)** |

Migration'lar:

| Sağlayıcı | Migration |
|---|---|
| PostgreSql | `20260827131901_TaskShareLinks` |
| SqlServer (**canlı bu**) | `20260827131921_TaskShareLinks` |

Şema değişikliği **tamamen eklemeli** — hiçbir kolon düşmüyor, hiçbir tip daralmıyor:

| İşlem | Nesne |
|---|---|
| Yeni tablo | `AppTaskShareLinks` |
| Yeni tablo | `AppTaskShareAccessLogs` (FK → `AppTaskShareLinks`) |
| Yeni kolon | `AppTaskComments.ShareLinkId` (null olabilir) |
| Yeni kolon | `AppTaskAttachments.ShareLinkId` (null olabilir) |
| Yeni kolon | `AppTaskAttachments.IsVisibleToGuests` (bool) |
| Yeni indeks | 5 adet (`TokenHash` benzersiz dâhil) |

🔴 **DbMigrator atlanırsa:** kod yeni / şema eski olur. EF entity'nin TÜM kolonlarını SELECT
ettiği için görev listesi ve yorum sorguları toptan patlar — `api/app/task` **500**,
/Tasks ve /Board "beklenmedik hata". Tarayıcıda gövde `{code: null, details: null}` gelir;
gerçek `Invalid column name` yalnız sunucu log'undadır.

---

## 🔴 Korunacak dosyalar (deploy'un EZMEMESİ gerekenler)

Publish paketinde **YOKTURLAR**; klasör yenilenince giderler.

| Öğe | Kaybedilirse |
|---|---|
| `openiddict.pfx` | ANCM **502.5**, site açılmaz |
| `appsettings.secrets.json` | Bağlantı dizesi gider, uygulama ayağa kalkmaz |
| `App_Data\uploads\` | Kullanıcıların yüklediği tüm dosya ekleri gider |
| `App_Data\DataProtection-Keys\` | Herkesin oturumu düşer, çerezler çözülemez |

Plesk Dosya Yöneticisi'nde **Kopyala** ile **Taşı** yan yanadır — yanlışlıkla Taşı'ya basmak
secrets'ı web klasöründen alır ve aynı 502.5'i verir.

---

## Ne değişti — 9 commit

### Yenilik

| PR | Başlık |
|---|---|
| #284 | **Görevi ekip dışındaki kişilerle süreli link ile paylaşma** |

Taşeron/tasarımcı/danışman/müşteriye hesap açtırmadan görevi ve **alt görev ağacını** açan
süreli link: yorum yazma, dosya yükleme ve indirme yetkileri tek tek açılabiliyor.

Görünürlük sözleşmesi tek kural: **`ShareLinkId` dolu olan içerik o dış paylaşıma aittir.**
Misafir yalnız kendi linkinin yorumlarını görür; ekip içi yazışma dışarı çıkmaz. Eklerde
ikinci kapı var (`IsVisibleToGuests`) — misafir yalnız kendi yüklediklerini ve ekibin
bilinçle dışa açtığı dosyaları görür.

Güvenlik: token **saklanmaz**, yalnız SHA-256 özeti tutulur. Anonim yolda çok-kiracılı filtre
kapalı olduğu için kapsam kontrolü kiracıyı **kendisi** doğrular. Geçersiz token, süresi
dolmuş link, kapsam dışı ek ve dışa açılmamış dosya **aynı 404'ü** alır. Sayfa `noindex` +
`no-referrer`; erişimler IP'nin ham hâli değil tek yönlü özetiyle kaydedilir (KVKK).

**Yeni yüzey:** `/Paylasim/{token}` (anonim) · görev detayında "Dış Paylaşım" sekmesi.

### Düzeltme

| PR | Başlık | Etkilenen |
|---|---|---|
| #281 | Kenar çubuğundaki "+" düğmesi proje oluşturma yetkisine bağlandı | Yetkisiz kullanıcılar |
| #282 | 4xx uçlardan kendiliğinden hata görevi açılmıyor | Görev otomasyonu (host) |
| #283 | 4xx sunucu hatası sayılmıyor, kendi kanalına alındı | Sistem Sağlığı (host) |
| #279 | Giriş sayfası service worker'da önbelleklenmiyor | **Mobil giriş** |
| #285 | Projeler mobil başlık bloğu 313px → 126px | **Mobil** |
| #286 | Sekmeler ve sürüklenebilir öğeler tek tıklamayla çalışıyor | Görev detayı · takvim · belgeler · form oluşturucu |

### Belge

| PR | Başlık |
|---|---|
| #280 | Sürüm notlarını müşteri odaklı kapsama daralt (host-only 5 madde çıkarıldı) |
| — | Bu belge + `2026.08.31` sürüm notu |

---

## 🔴 İzin boşluğu — `Tasks.ShareExternally` (#277 ile aynı tuzak)

Yeni izin **hiçbir feature kapısının arkasında değil** (`PackageFeatureGates.Map`), tıpkı
`Projects.ManageCategories` gibi. Bu yüzden kiracıların yeni izinleri normalde aldığı yol
(`GrantNewlyEnabledPermissionsAsync` — yalnız bir modül feature'ı `false→true` olduğunda
çalışır) bu izne **hiç uğramaz**.

Çifte telafi baştan yapıldı:

| # | Boşluk | Düzeltme |
|---|---|---|
| 1 | **Tavan** — izin paket satırlarında yoksa `PackagePermissionStateChecker` her kiracıda kapatır | `TenantPackageManager.LateAddedPermissions` listesine eklendi |
| 2 | **Grant** — contributor yalnız host admin rolüne verirse kiracıda görünmez | `TaskSharePermissionDataSeedContributor` host bağlamında kurulu kiracıları dolaşıyor |

**Biri kapanmadan diğeri işe yaramaz.** İkisi de yalnız **DbMigrator koştuğunda** çalışır.

🔑 Contributor'ın **kiracı-bağlamı guard'ı** korundu: yeni kiracı oluşturulurken ABP zaten
taze admin rolüne tüm Both-tarafı izinleri verir; aynı UoW'da ikinci kez vermek mükerrer
grant üretip "Yeni Müşteri" ekranını 500'e düşürürdü (2026-08-22'de canlıda yaşandı).

---

## Sürüm notları — `2026.08.31`

Katalogun başına 6 maddelik yeni kayıt eklendi (3 Yenilik/Güvenlik + 1 İyileştirme + 2 Düzeltme).

#284 notu `2026.08.28` girilmişti ve yalnız dış paylaşımı anlatıyordu; katalogdaki uyarı
tarihin yayın gününe çekilmesini söylüyordu. `version`/`date` **2026.08.31**'e alındı, uyarı
yorumu kaldırıldı ve yayının tamamı işlendi:

| Madde | Kaynak |
|---|---|
| Bir görevi ekibinizde olmayan kişiye açabiliyorsunuz | #284 |
| Paylaşımda neyi açacağınıza siz karar veriyorsunuz | #284 |
| Ekip içi yazışmanız dışarı çıkmaz | #284 |
| Projeler telefonda çok daha az kaydırma istiyor | #285 |
| Mobilde giriş sırasında çıkan hata giderildi | #279 |
| Sekmeler ve sürüklenebilir öğeler tek tıklamayla açılıyor | #286 |

**Bilerek dışarıda bırakılanlar** — #280 ile konan kurala göre (katalogun XML özet bloğu):
host yöneticisine özel maddeler girmez, çünkü "Yenilikler" penceresinin ve `/ReleaseNotes`
sayfasının **izin kapısı yoktur**.

| Konu | Sebep |
|---|---|
| #282 · #283 (Sistem Sağlığı / görev otomasyonu) | Yalnız host yöneticisi görür |
| #281 (kenar çubuğu "+") | Yetkisiz kullanıcının gördüğü düğmenin kaldırılması — duyurulacak bir kazanım değil |
| #280 | İç mesele (notların kendi kapsamı) |

> 🔑 **Modalın ikinci kapısı:** `ReleaseNotesViewComponent`, tanıtım turu
> (`PlatformSettings.Tour.Completed`) tamamlanmadan bilinçli olarak susar. Turu bitirmemiş
> kullanıcıda önce tur çıkar — bu bir hata değildir.

---

## Deploy adımları

### 0. 🔴 502.5'i çöz

Yukarıdaki bölüm. Site ayağa kalkmadan deploy etme.

### 1. Veritabanı yedeği al

**Bu yayında zorunlu** — şema değişiyor.

### 2. Korunacak dosyaları yedekle

`openiddict.pfx` · `appsettings.secrets.json` · `App_Data\uploads\` ·
`App_Data\DataProtection-Keys\` → site kökünün **dışına kopyala** (Taşı değil, Kopyala).

### 3. Siteyi durdur

Plesk → uygulama havuzunu durdur (dosya kilidi yüzünden kopyalama yarım kalmasın).

### 4. Web paketini **tamamen** değiştir

ZIP'te sarmalayıcı klasör **yok** — `web.config` doğrudan site köküne düşmeli.
Üzerine ekleme değil, **temiz değiştirme**: eski içerik silinip yenisi açılır.
(Artık birikirse eski chunk'lar 302 yerine 200 dönmeye başlar ve doğrulama adımı yalan söyler.)

### 5. Korunan dosyaları geri koy

Adım 2'deki dört öğe yerine.

### 6. 🔴 DbMigrator'ı çalıştır

Bu turda **hem şema hem izin tohumu** için.

1. `Apya-DbMigrator-<sha>.zip`'i site kökünün **dışında** bir klasöre aç (ör. `dbmigrator\`).
2. Plesk → **Zamanlanmış Görevler** → tek seferlik görev → `migrate.bat` (tırnaksız tam yol).
3. 🔑 Başarıyı çıkış kodundan değil **log'dan** doğrula: `Logs\logs.txt` içinde
   **`Successfully completed all database migrations.`** satırını ara. Öncesinde
   **`Executing data seeders...`** de görünmeli — izin tohumu orada koşar.
4. İşi biten `dbmigrator\` klasörünü sunucudan **SİL** — `migrate.bat` içinde secret düz metin.

### 7. Siteyi başlat

Plesk → havuzu başlat.

---

## Doğrulama (deploy sonrası)

### 1. Site ayakta mı

```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 90 https://apya.pargetto.com/health/ready
```

→ **200**. İlk istek uzun sürebilir (havuz uyuyor); zaman aşımını dar tutma.

### 2. Kod gerçekten değişti mi — YENİ DOSYA testi

Bu yayında **yeni adlı bir chunk var**, bu yüzden pahalı parmak izi turuna gerek yok:

```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 60 https://apya.pargetto.com/js/draggableActivation-Ybw9Upbh.js
```

| Uç | Deploy ÖNCESİ | Deploy SONRASI beklenen |
|---|---|---|
| `/js/draggableActivation-Ybw9Upbh.js` | 404 (dosya yok) | **200** |
| `/Paylasim/gecersiz-token` | 404 (sayfa yok) | **404** — ama ABP hata sayfası, IIS'in değil |

### 3. Şema gerçekten uygulandı mı

Görev listesi açılıyorsa uygulanmıştır (yeni kolonlar SELECT'e giriyor). Somut kontrol:
**/Tasks** ve **/Board** açılmalı. 500 dönüyorsa DbMigrator adımı atlanmış demektir.

### 4. İzin tohumu gerçekten koştu mu

🔴 Bir **KİRACI** hesabıyla (host değil) bir görev detayı aç → **"Dış Paylaşım"** sekmesi
görünmeli. Görünmüyorsa izin geçmemiş → DbMigrator ya hiç koşmadı ya da seed adımı düştü.

### 5. Elle bakılacaklar (dışarıdan ölçülemez)

- Giriş yapılabiliyor mu (`DataProtection-Keys` yerinde mi)
- Bir görevin dosya eki açılıyor mu (`App_Data\uploads` yerinde mi)
- **"Yenilikler" penceresi** açılıyor mu — turu tamamlamış bir kullanıcıda çıkmalı
- **Mobilde giriş** (#279) — telefondan giriş yaparken 400 hatası çıkmamalı
- **Mobilde /Projects** (#285) — ilk kart ekranın üst kısmında başlamalı, araç çubuğu tek satır
- **Görev detayı sekmeleri** (#286) — tek tıklamayla değişmeli

---

## Geri alma

Şema **eklemeli** olduğu için kod geri alınsa bile yeni tablo/kolonlar zararsız durur —
eski kod onları hiç sormaz. Geri alma pratikte **yalnız dosya işidir**: bir önceki
`Apya-Yayin-63cb35c6.zip` paketini aynı yordamla geri açmak yeterli.

Gerçekten şemayı da geri almak istersen migration'ın `Down` adımı 2 tabloyu ve 3 kolonu
düşürür — **paylaşım linkleri ve misafir yorumları/ekleri kalıcı olarak silinir.**

⚠️ İkinci kalıcı iz: tohumun kiracı admin rollerine yazdığı `Tasks.ShareExternally`
grant'ları geri dönmez. Zararsızdır — eski kod o izni hiç sormaz.

---

## Bu yayının DIŞINDA kalan, hâlâ bekleyen işler

| İş | Nerede | Neden bekliyor |
|---|---|---|
| 🔴 **502.5 kök nedeni** | Sunucu | Site şu anda çökük — bu deploy'dan önce çözülmeli |
| **SMTP** | `/SettingManagement` → E-posta | Girilmeden şifre sıfırlama postası **gitmez**. Varsayılan gönderen `noreply@abp.io` değiştirilmeli |
| **Plesk app pool** (Idle=0, AlwaysRunning) | Plesk | Yalnız hız değil **işlevsel**: `SubscriptionExpiryWorker` saatlik koşar, havuz uyursa abonelik süresi işlenmez |
| **`hostingModel="InProcess"`** | `web.config` | App pool ayarından **SONRA** açılır. Şu an Out-Of-Process |
| **`<applicationInitialization>`** | `web.config` | En son. **Üçü birden açılmaz** |
| Yükseltme kanalı | `/PackageManagement` | Satış e-postası/telefon/fiyat sayfası üçü de boşsa "Paketim" ekranında yükseltme düğmesi basılmaz |
