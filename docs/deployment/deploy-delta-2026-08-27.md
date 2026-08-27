# Deploy delta — 2026-08-27 (`b52c360` → `main` `e695ef2d`)

Canlıdaki sürüm **`b52c360`** (2026-08-26 deploy'u; kod ve şema aynı sürümde, doğrulanmış).
Bu belge o noktadan bugünkü `main`'e (`e695ef2d`) kadar olan **18 commit / 3 migration**'ı toplar.

> ⚠️ Bu belge `deploy-delta-2026-08-25.md`'nin **devamıdır, yerine geçmez.** O belge
> `1d4a039 → 602fd92` aralığını kapsıyordu ve **canlıya uygulandı**. Buradaki aralık
> onunla çakışmaz.

> 🔴 **Deploy'a başlamadan önce oku:** aşağıdaki "Korunacak dosyalar" bölümü.
> 2026-08-26 deploy'unda canlı **tamamen düştü**; iki sebebi de o bölümde.

---

## 🔴 Bu yayın KOD-ONLY DEĞİLDİR — paket geri yüklemesi ŞART

| | Durum |
|---|---|
| Yeni migration | **3 adet** (ikisi sütun DÜŞÜRÜYOR) |
| DbMigrator | **ÇALIŞTIRILIR (zorunlu)** |
| Veritabanı yedeği | **🔴 ZORUNLU** — geri alınamaz sütun düşürme var |
| NuGet bağımlılığı değişti | **EVET** — Scriban `7.2.2` → `6.6.0` |
| Üretilecek paket | **2** (Web + DbMigrator) |

🔴 **Sadece `.dll`/`wwwroot` kopyalamak YETMEZ.** Scriban sürümü düştüğü için publish
klasöründeki assembly kümesi değişti (`Scriban.dll` başka sürüm + `.deps.json` yeniden
yazıldı). Eski `Scriban.dll` yerinde kalırsa uygulama açılır ama **her e-posta şablonu**
`TypeLoadException` ile patlar (şifre sıfırlama, e-posta doğrulama). Publish klasörünün
**tamamı** değiştirilmeli.

---

## 🔴 Korunacak dosyalar (deploy'un EZMEMESİ gerekenler)

Bunlar publish paketinde **yoktur** — sunucuda kalıcı yaşarlar. Klasörü "temiz değiştirme"
ile yenilersen hepsi gider. **Önce ayrı klasöre kopyala, sonra geri koy.**

| Dosya / klasör | Kaybolursa |
|---|---|
| `openiddict.pfx` | Uygulama **hiç açılmaz** → ANCM **502.5** |
| `appsettings.secrets.json` | Bağlantı dizesi localhost'a düşer → başlangıçta çöker |
| `App_Data\uploads\` | **Kullanıcı dosyaları gider** (proje kapakları, ekler, dokümanlar) |
| `App_Data\DataProtection-Keys\` | Tüm çerezler geçersiz → herkes yeniden giriş yapar |

> Plesk Dosya Yöneticisi'nde **Kopyala** ile **Taşı** yan yanadır. Yanlışlıkla **Taşı**'ya
> basmak `appsettings.secrets.json`'ı web klasöründen alır ve aynı 502.5'i verir.

Ayrıntılı reçete: `docs/deployment/plesk-windows.md` + 2026-08-26 olay kaydı.

---

## Migration'lar

Üçü de her iki sağlayıcı için üretilmiş. Canlıda **SqlServer** kullanılıyor:

| # | Migration | SqlServer dosyası |
|---|---|---|
| 1 | `ProjectCategoryDefinitions` | `20260826103956_ProjectCategoryDefinitions.cs` |
| 2 | `Add_TenantSubscriptions` | `20260826123123_Add_TenantSubscriptions.cs` |
| 3 | `DropProjectDuration` | `20260826130238_DropProjectDuration.cs` |

### 1. `ProjectCategoryDefinitions` — 🔴 sütun düşürür

Proje kategorisi sabit enum'dan tanım tablosuna taşındı.

| İşlem | Tablo | Risk |
|---|---|---|
| `AppProjectCategories` tablosunu oluştur | — | Güvenli |
| 3 sistem kategorisi ekle (`TenantId = NULL`) | `AppProjectCategories` | Güvenli |
| `CategoryId` sütunu ekle (NOT NULL, default = "Diğer / Genel") | `AppProjects` | Güvenli |
| `UPDATE`: eski `Category` enum'unu `CategoryId`'ye taşı (1→Hibe, 2→Etkinlik, kalan→Diğer) | `AppProjects` | Veri taşıma |
| `IX_AppProjects_TenantId_Category` indeksini düşür | `AppProjects` | Güvenli |
| 🔴 **`Category` sütununu DÜŞÜR** | `AppProjects` | **GERİ ALINAMAZ** |
| 3 yeni indeks + `FK_AppProjects_AppProjectCategories_CategoryId` | — | Güvenli |

> 🟡 Sütun düşürme **veri taşımadan SONRA** yapılıyor, yani doğru sırada. Yine de
> `Category` sütununun ham değeri kaybolur — geri dönüş yalnız **yedekten** mümkündür.

### 2. `Add_TenantSubscriptions` — güvenli

`AppTenantSubscriptions` tablosu + 2 indeks. Var olan hiçbir tabloya dokunmaz.

> ℹ️ Aboneliği olmayan kiracı **süresiz** sayılır. Deploy anında hiçbir kiracının
> aboneliği olmadığı için kimse düşmez; abonelik host tarafından girilene kadar
> davranış değişmez.

### 3. `DropProjectDuration` — 🔴 sütun düşürür

`AppProjects.Duration` sütununu düşürür. Serbest metin bir alandı, formdan #252 ile
kaldırılmış, hiçbir yerde okunmuyordu (#257 ölü alanı kolonuyla birlikte temizledi).

> 🔴 **İçindeki metin kalıcı olarak gider.** Bu değerleri saklamak isteniyorsa deploy
> ÖNCESİ dışa aktarılmalı:
> ```sql
> SELECT Id, [Name], Duration FROM AppProjects WHERE Duration IS NOT NULL AND Duration <> '';
> ```

---

## 🔴 Paketleme tuzağı — Vite manifest'i publish'e GİRMİYOR

`dotnet publish` **nokta ile başlayan dizinleri publish çıktısına almaz.** Bu yüzden
`wwwroot/js/.vite/manifest.json` — repoda commit'li olmasına rağmen — pakette **yoktur**.

**Etki:** `IslandAssetManifest` manifest'i bulamayınca boş liste döner ve island
chunk'ları için hiç `<link rel="modulepreload">` basılmaz. Yani **#264'ün en büyük istemci
kazanımı (699→361 ms @80 ms RTT) canlıda sessizce ölür.** Sayfa bozulmaz, sadece yavaş
kalır; log'a tek satır uyarı düşer:

```
Vite manifest bulunamadı (js/.vite/manifest.json) — island chunk'ları modulepreload edilmeyecek.
```

🔑 **Yerelde ve testte GÖRÜNMEZ**: geliştirmede dosya `wwwroot` altında zaten durur.
Yeşil test bu konuda yalan söyler.

**2026-08-27 paketinde ELLE düzeltildi** — manifest publish klasörüne kopyalandı ve
işaret ettiği 32 chunk'ın hepsinin pakette olduğu doğrulandı. Sonraki deploy'larda da
kopyalanmalı:

```
src/Apya.Platform.Web/wwwroot/js/.vite/manifest.json
  -> publish/wwwroot/js/.vite/manifest.json
```

> 🔧 **Kalıcı çözüm ayrı bir iştir:** `Apya.Platform.Web.csproj`'a açık bir
> `<Content Include="wwwroot\js\.vite\manifest.json" CopyToPublishDirectory="Always" />`
> girdisi eklenmeli. Bu yayına dahil DEĞİL.

---

## 🔴 Bilinen boşluk — yeni izin kiracılarda AÇILAMAZ

Bu yayın **`Projects.ManageCategories`** iznini tanımlıyor (#256, Ayarlar → Projeler
altındaki kategori yönetimi).

**Kiracılarda bu bölüm görünmeyecek.** İki ayrı sebep üst üste biniyor:

1. **Paket tavanı:** `PackagePermissionStateChecker` kiracının paketinin izin listesinde
   olmayan her izni kapatır. Paket satırları bir kez tohumlandığı için canlıdaki
   paketlerde bu ad yoktur. Telafi mekanizması (`TenantPackageManager.BackfillLateAdditionsAsync`)
   yalnız `LateAddedPermissions` listesindeki adları işler; `Projects.ManageCategories`
   **o listede değil**.
2. **Rol grant'ı:** `ProjectCategoryPermissionDataSeedContributor` izni yalnız **host**
   `admin` rolüne verir (`context.TenantId != null` → `return`). Kiracı admin'i almaz.

**Etki:** kategori yönetimi canlıda yalnız **host** tarafından kullanılabilir. Kiracılar
üç sistem kategorisini (Hibe Projesi · Etkinlik · Diğer / Genel) görür ve seçebilir, ama
kendi kategorilerini ekleyemez. Projeler, kategoriler ve tüm listeler **normal çalışır** —
bu bir çökme değil, eksik yüzeydir.

> Bu yayına **engel değildir.** Kiracıların da kategori tanımlayabilmesi isteniyorsa ayrı
> bir düzeltme gerekir (izni `LateAddedPermissions`'a ekle + seeder'ı kiracı bağlamına aç)
> ve o düzeltme yeniden DbMigrator koşumu ister.

---

## Ne değişti (özet)

### Özellikler

| PR | Ne geldi |
|---|---|
| #256 | Proje kategorisi: sabit enum yerine **tanım tablosu** (host tanımlayabilir) |
| #258 | **Paket süresi / abonelik**: süre dolunca Basic'e iniş, uyarı bildirimleri |
| #263 | Kiracı **"Paketim"** ekranı (`/Subscription`) + kota duvarından yükseltmeye yönlendirme |

### Düzeltmeler

| PR | Ne düzeldi |
|---|---|
| #266 | **Şifremi unuttum e-postası** çalışır hâle geldi (3 ayrı kırık) + giriş/kayıtta boşluk toleransı |
| #265 | Projeler konsolu varsayılan olarak **tüm projelerle** açılıyor |
| #262 · #259 · #260 | Yatay telefonda mobil kabuk (hamburger); arama şeridi ayara bağlı; dokümanlar eylem satırı sarılıyor |
| #261 | Doğrulama hata metinleri **sistem genelinde Türkçe** |
| #257 · #252 | Ölü "Süresi" alanı formdan ve şemadan kaldırıldı |
| #255 · #254 · #253 | Kanban kolon daralması + dikey kaydırma; dokümanlar detay paneli tam boy |
| #251 · #250 | Avatar baş harfleri ad+soyad; kenar çubuğunda ad kırpılmıyor |
| #249 | Dashboard KPI şeridi alttaki kartlara binmiyor |

### Performans (#264)

- IIS **in-process** barındırma + app pool ısıtması → aşağıdaki "web.config" bölümüne bak
- Island chunk'ları `modulepreload` → 699→361 ms @80 ms RTT (3 dalga → 1)
- Görev listesi DB turları 12 → 9
- Query önbelleği sayfa geçişlerinde `sessionStorage`'ta yaşıyor
- Proje seçicisi 1000 tam DTO yerine hafif uçtan besleniyor
- Dashboard kart düzeni sayfaya gömülü → layout turu hiç atılmıyor

### Sürüm notları

| Paket | Eski | Yeni | Neden |
|---|---|---|---|
| `Scriban` | 7.2.2 | **6.6.0** | ABP 10.0.2 ikili uyumsuzluğu; 7.x'te **tüm e-posta şablonları** `TypeLoadException` veriyordu. Gerekçe + kabul edilen takas `Directory.Build.props` içinde. |

---

## 🔴 Zorunlu deploy adımları

### 0. 🔴 Veritabanı yedeği

**Bu yayında atlanamaz** — iki migration sütun düşürüyor. Plesk → Veritabanları → Yedekle.
Yedek alınmadan hiçbir adıma başlama.

İsteğe bağlı: yukarıdaki `Duration` dışa aktarma sorgusunu çalıştır.

### 1. Korunacak dosyaları yedekle

Sunucuda `apya.pargetto.com\` altındaki şu dördünü **ayrı bir klasöre kopyala** (Taşı DEĞİL):

```
openiddict.pfx
appsettings.secrets.json
App_Data\uploads\
App_Data\DataProtection-Keys\
```

### 2. 🔴 DbMigrator'ı çalıştır

Sunucuda konsol yok → **Plesk › Zamanlanmış Görevler › Bir komut çalıştır › Şimdi Çalıştır**.

`dbmigrator-publish\` içeriğini `C:\Inetpub\vhosts\pargetto.com\dbmigrator\` klasörüne
yükle, yanına `migrate.bat` koy:

```bat
@echo off
cd /d "%~dp0"
Apya.Platform.DbMigrator.exe --OpenIddict:Applications:Platform_Web:ClientSecret=<secret> > migrate-output.txt 2>&1
```

Zamanlanmış görevin komut alanına **tırnaksız tam yolu** yaz
(`C:\Inetpub\vhosts\pargetto.com\dbmigrator\migrate.bat`) — Plesk tırnakları bozar.

**Başarı ölçütü çıkış kodu DEĞİL**, `migrate-output.txt` içindeki şu satırdır:

```
Successfully completed all database migrations.
```

`[WRN]` satırları (decimal precision, sentinel value) her koşuda çıkan EF model
uyarılarıdır — hata değil.

🔴 Secret düz metin kaldığı için `migrate.bat`'i işlem sonrası **sil**.

### 3. Web paketini değiştir

`publish\` içeriğini `apya.pargetto.com\` klasörüne **tamamen değiştirerek** kopyala
(ek üzerine yazma değil — Scriban sürümü değişti, eski DLL kalmamalı).

### 4. Korunan dosyaları geri koy

Adım 1'de yedeklediğin dördünü yerine kopyala. Site açılmadan önce bunlar yerinde olmalı.

### 5. Siteyi başlat ve doğrula

Plesk → uygulama havuzunu geri dönüştür, sonra aşağıdaki "Doğrulama" bölümünü uygula.

---

## web.config — iki değişiklik AŞAMALI açılır

PR #264 `web.config`'e sunucu yeteneğine duyarlı iki değişiklik getirdi. **Bu pakette ikisi
de KAPALI gelir** (`hostingModel="OutOfProcess"`, `<applicationInitialization>` yorumda) —
site kesin açılsın diye. Kazanımı almak için deploy'dan **sonra**, site çalıştığı
doğrulandıktan sonra, **tek tek** aç:

### 5.1 Önce Plesk app pool ayarları (web.config'ten YAPILAMAZ)

Plesk → Web Siteleri ve Alan Adları → IIS ayarları:

- **Idle Time-out** = `0`
- **Start Mode** = `AlwaysRunning`

> 🔑 Bu ayar yalnız performans değil, **işlevsel**: `SubscriptionExpiryWorker` (#258)
> saatlik koşan bir ABP arka plan işçisi. App pool uykuya dalarsa abonelik süresi
> işlenmez. (`RunOnStart = true` olduğu için her havuz açılışında bir tur atar; düzenli
> koşum yine de havuzun ayakta kalmasına bağlıdır.)

### 5.2 Sonra `hostingModel="InProcess"`

`web.config`'te tek satır:

```
hostingModel="OutOfProcess"   ->   hostingModel="InProcess"
```

Site açılmazsa (**500.30 / 500.31** = ANCM sürümü .NET 10 self-contained barındırmayı
desteklemiyor) satırı geri al. **Yeniden publish gerekmez.**

### 5.3 En son `<applicationInitialization>`

`web.config` içindeki yorumlanmış bloğu aç:

```xml
<applicationInitialization doAppInitAfterRestart="true">
  <add initializationPage="/health/live" />
</applicationInitialization>
```

**500.19** (config section not recognized) alırsan IIS "Application Initialization"
bileşeni sunucuda kurulu değildir → bloğu tümüyle sil. `hostingModel` değişikliği bundan
bağımsızdır, kalabilir.

🔴 **Üçünü birden açma.** Her adımdan sonra siteyi aç, çalıştığını gör, sonra devam et.
Ayrıntı: `docs/deployment/plesk-windows.md` bölüm 7.

---

## Deploy sonrası ayarlar (kod işi DEĞİL)

### 🔴 SMTP — şifre sıfırlama bunsuz çalışmaz

#266 şifre sıfırlama zincirini onardı, ama **SMTP bilgileri girilmediği sürece posta
gitmez**. Host olarak gir: **`/SettingManagement` → E-posta**

- Sunucu, port, SSL, kullanıcı adı / şifre
- **Gönderen adresi + görünen ad** — 🔴 varsayılan `noreply@abp.io`, **mutlaka değiştir**

Sıfırlama linkinin alan adı `App:SelfUrl` ayarından gelir (Production: `apya.pargetto.com`).

### Abonelik ayarları (#258)

Host → **`/PackageManagement`**:

| Ayar | Varsayılan | Not |
|---|---|---|
| Otomatik düşürme | kapalı | Önce izleyip sonra açmak için kaçış kapısı |
| Ek süre (gün) | `0` | Bitişte düşer |
| Uyarı günleri | `7,1` | Boş = uyarı gönderilmez |

### Yükseltme kanalı (#263)

Aynı ekranda üç alan: satış e-postası · telefon · fiyat sayfası adresi.
**Üçü de boşken** "Paketim" ekranında hiçbir yükseltme düğmesi basılmaz — bunun yerine
"yöneticinizle görüşün" notu çıkar. En az birini doldur.

---

## ⚠️ Davranış değişiklikleri

| Nerede | Ne değişti |
|---|---|
| **Board** | Açılışta otomatik seçilen proje artık **alfabetik olarak ilk** olan (önceki sıra ABP varsayılanıydı, belirsizdi) |
| **Projeler konsolu** | Varsayılan filtre artık **tüm projeler** (#265) |
| **Yatay telefon** | Artık masaüstü kabuk değil **mobil kabuk** (hamburger) kullanılıyor (#259) |
| **Proje formu** | "Süresi" alanı yok (#252) — verisi de şemadan silindi |
| **Kategori** | Proje kategorisi artık serbest tanım; eski `Hibe`/`Etkinlik` değerleri taşındı |

---

## Doğrulama (deploy sonrası)

### 1. Şema

`migrate-output.txt` içinde `Successfully completed all database migrations.` **var mı?**

### 2. Site ayakta mı

```bash
curl -o /dev/null -w "%{http_code}\n" https://apya.pargetto.com/health/ready
```

`200` beklenir. 🔴 **Sağlıktan sürüm ÇIKARMA** — migration'lar eklemeli olduğu için eski
kod da `200 Healthy` döner.

### 3. Kod gerçekten değişti mi (parolasız sürüm parmak izi)

Bu yayının chunk'ları canlıda **200**, eski hash'ler **302** dönmeli. Deploy'dan sonra
`publish\wwwroot\js\` içinden bir hash'li dosya adı al ve sor:

```bash
curl -o /dev/null -w "%{http_code}\n" https://apya.pargetto.com/js/<yeni-hash'li-dosya>.js
```

- **200** = yeni kod yerinde
- **302** = dosya yok (statik middleware bulamayıp girişe yönlendiriyor) → kopyalama eksik

Eski hash'lerin **302** dönmesi iyi haberdir: kopyalama "temiz değiştirme" olmuş, eski
artıklar birikmemiş. Eski hash hâlâ **200** dönüyorsa üzerine yazma yapılmış demektir.

> 🔑 ABP `__bundles/...?_v=<ticks>` **deploy tarihi DEĞİL** — yalnız app pool'un yeniden
> başladığını gösterir. Sürüm kanıtı için chunk parmak izini kullan.

### 4. Elle bakılacaklar (dışarıdan ölçülemez)

- [ ] Giriş yapılabiliyor mu (DataProtection-Keys korunduysa açık oturumlar da sürer)
- [ ] `/Projects`, `/Tasks`, `/Board` açılıyor mu (şema-kod uyumsuzluğunun ilk işareti bu üçü)
- [ ] Proje kategorileri listede görünüyor mu, eski Hibe/Etkinlik projeleri doğru kategoride mi
- [ ] `/Subscription` "Paketim" ekranı açılıyor mu
- [ ] Şifremi unuttum → posta geliyor mu (SMTP girildikten sonra)
- [ ] Doküman ekleri ve proje kapakları duruyor mu (`App_Data\uploads` korundu mu)

---

## Geri alma

| Sorun | Çözüm |
|---|---|
| **500.30 / 500.31** | `hostingModel`'i `OutOfProcess`'e döndür. Publish gerekmez. |
| **500.19** | `<applicationInitialization>` bloğunu sil. |
| **502.5** | `openiddict.pfx` yerinde mi? Yoksa yedekten geri koy. Log: `apya.pargetto.com\Logs\logs.txt` |
| **Başlangıçta çöküyor** | `appsettings.secrets.json` yerinde mi? |
| **`/Projects` + `/Tasks` 500** | DbMigrator koşmamış → adım 2'yi tekrarla |
| **Şema geri alınacak** | 🔴 `Down()` migration'ları sütunları geri ekler ama **verileri geri getirmez**. Tek güvenli yol **adım 0'daki yedek**. |

502.5'i tek turda teşhis: `.bat` içinden uygulamayı IIS'siz doğrudan çalıştır —

```
powershell -Command "$p=Start-Process .\Apya.Platform.Web.exe -NoNewWindow -PassThru -RedirectStandardOutput sd_out.txt -RedirectStandardError sd_err.txt; if(-not $p.WaitForExit(60000)){$p.Kill()}"
```

---

## Bu yayına engel OLMAYAN açıklar

- **`Projects.ManageCategories` kiracılarda kapalı** — yukarıdaki "Bilinen boşluk"
- **`.text-muted` kontrastı** uygulama genelinde WCAG AA altında (ayrı iş)
- **Dokunmatik cihaz QA'i** (PR #247) hiç yapılmadı
- **`/consent/ack`** canlıda 500 veriyor mu — 2026-08-26'dan devreden kontrol
