# Yayın: Plesk Windows paylaşımlı hosting

Hedef ortam: **GüzelHosting Win-Limitsiz** — Windows Server 2019, IIS 10, Plesk Obsidian,
ASP.NET Core desteği, limitsiz MSSQL (2012–2019).

> ⚠️ **Linux paketi işe yaramaz.** Aynı isimli "Limitsiz" paketin Linux sürümü
> (cPanel/DirectAdmin, LiteSpeed, PHP/MySQL) .NET uygulaması çalıştıramaz.
> Hosting sayfasında **Windows** sekmesinden `Win-Limitsiz` alınmalıdır.

---

## Neden self-contained?

Sunucuda .NET 10 runtime yok (Server 2019, muhtemelen .NET 8). Uygulama
**self-contained** yayımlanır: runtime paketin içinde gelir, IIS tarafında yalnızca
**ANCM (AspNetCoreModuleV2)** gerekir — o da hostingin "ASP & .NET Core Desteği"yle mevcut.

Paket: ~271 MB açık / ~106 MB ZIP.

---

## 1. Veritabanı (Plesk)

1. Plesk → **Veritabanları** → *Veritabanı Ekle*
   - Tür: **Microsoft SQL Server**
   - Veritabanı adı: `apya_platform` (örnek)
   - Kullanıcı + güçlü parola oluştur
2. Bağlantı bilgilerini not al: sunucu adı, DB adı, kullanıcı, parola.

## 2. Şema + başlangıç verisi

Şema **ve** seed (admin kullanıcı, roller, izinler, OpenIddict) birlikte gerekir;
yalnız SQL script yeterli değildir — seed olmadan giriş yapılamaz.

**Yöntem A — yerelden uzak DB'ye (önerilen).**
Plesk → Veritabanları → uzaktan erişime izin ver, sonra kendi makinende:

```bash
dotnet run --project src/Apya.Platform.DbMigrator
```

Öncesinde bağlantıyı ortam değişkeniyle ver (parola repoya girmesin):

```powershell
$env:Database__Provider='SqlServer'; $env:ConnectionStrings__SqlServer='Server=SUNUCU;Database=DB;User Id=KULLANICI;Password=PAROLA;TrustServerCertificate=True'
```

"Successfully completed all database migrations." görülmelidir.

**Yöntem B — uzaktan erişim yoksa.** DbMigrator'ı self-contained yayımla, sunucuya
yükle ve Plesk → *Zamanlanmış Görevler* ile bir kez çalıştır:

```bash
dotnet publish src/Apya.Platform.DbMigrator -c Release -r win-x64 --self-contained true -o ./dbmigrator-publish
```

**Doğrulama:** `sys.tables` → 107 tablo, `AbpUsers` → 1 kayıt, `AppGrants` → 0
(demo veri bilinçli olarak seed edilmez).

## 3. Dosyaları yükle

1. Yayın paketini üret:
   ```bash
   dotnet publish src/Apya.Platform.Web -c Release -r win-x64 --self-contained true -o ./publish
   ```
2. `publish/` içeriğini ZIP'le, Plesk → **Dosyalar** → `httpdocs` altına yükle ve çıkart.
   `web.config` **site kökünde** olmalı (alt klasörde değil).
3. `httpdocs/appsettings.secrets.json` dosyasını **sunucuda oluştur** ve doldur.
   Bu dosya bilinçli olarak yayın paketine dahil edilmez (`CopyToPublishDirectory=Never`);
   aksi halde publish alan kişinin yerel dev sırları sunucuya taşınırdı. Git'e de girmez.

   ```json
   {
     "ConnectionStrings": {
       "SqlServer": "Server=<SUNUCU>;Database=<DB>;User Id=<KULLANICI>;Password=<PAROLA>;TrustServerCertificate=True;Encrypt=False"
     },
     "OpenIddict": {
       "CertificatePassword": "<pfx parolası>",
       "Applications": { "Platform_Web": { "ClientSecret": "<client secret>" } }
     },
     "StringEncryption": { "DefaultPassPhrase": "<şifreleme anahtarı>" },
     "OpenAI": { "ApiKey": "" }
   }
   ```

   > `StringEncryption:DefaultPassPhrase` **bir kez** belirlenir; sonradan değiştirilirse
   > onunla şifrelenmiş mevcut veriler okunamaz hale gelir.

**Yazılabilir olması gereken klasörler** (Plesk site kullanıcısına yazma izni):
`App_Data/uploads`, `App_Data/feedback-uploads`, `App_Data/DataProtection-Keys`, `Logs`.

## 4. SSL ve yönlendirme

1. Plesk → **SSL/TLS Sertifikaları** → Let's Encrypt ile ücretsiz sertifika al
   (panelde "Alan adı korunmadı" uyarısı bununla kalkar).
2. Plesk → Hosting Ayarları → **"HTTP'den HTTPS'e kalıcı 301 yönlendirme"** işaretle.
   Yönlendirme bilinçli olarak uygulama içinde değil, sunucu seviyesinde yapılır
   (ters vekil arkasında yönlendirme döngüsü riskini önler). HSTS uygulamada açıktır.

## 5. İlk açılış ve kontrol listesi

| Kontrol | Beklenen |
|---|---|
| `https://alanadi/` | Giriş sayfası açılır |
| `admin` ile giriş | Panoya düşer |
| `/swagger` | **404** (production'da kapalı) |
| Yanıt başlıkları | `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options` |
| `App_Data/DataProtection-Keys` | `key-*.xml` oluşmuş (yoksa oturumlar recycle'da düşer) |

**İlk girişten hemen sonra `admin` parolasını değiştir.**

---

## 6. Kod güncelleme (incremental yayın)

İlk kurulumdan sonraki her kod değişikliğinde tüm paketi yeniden yüklemek gerekmez;
self-contained paketin büyük kısmı (.NET runtime dosyaları) kod değişmedikçe aynıdır.

1. **Yerelde tam publish al** (`dotnet publish` her zaman tüm çıktı klasörünü üretir,
   ama içeride sadece değişen dosyaları yeniden derler):

   ```bash
   dotnet publish src/Apya.Platform.Web -c Release -r win-x64 --self-contained true -o ./publish
   ```

2. **FileZilla ile sadece değişen dosyaları yükle**
   - `Görünüm → Dizin Karşılaştırması` (`Ctrl+Shift+C`) → "Değişiklik tarihine göre" seç,
     yerel `publish/` ile sunucudaki `httpdocs/`'u karşılaştır; işaretli (değişen/yeni)
     dosyaları seçip yükle.
   - `Sunucu → Dosya Adı Filtreleri` ile şu yolları karşılaştırmadan **hariç tut** —
     aksi halde sunucuya özel bu dosyalar "yerelde yok" görünüp yanlışlıkla
     silinir/üzerine yazılır:
     ```
     appsettings.secrets.json
     openiddict.pfx
     App_Data/uploads/*
     App_Data/DataProtection-Keys/*
     Logs/*
     ```
   - Karşılaştırma çift yönlüdür (sunucuda olup yerelde olmayanları da gösterir) —
     yalnızca yükleme yap, silme işlemi yapma.

3. **Razor view (`.cshtml`) değişikliği de DLL swap gerektirir.**
   Runtime compilation kapalı olduğu için görünümler `Apya.Platform.Web.dll` içine
   derlenir; sadece `.cshtml` dosyasını değiştirip yüklemek yeterli değildir.

4. **Dosya kilidi hatası alırsan (DLL kullanımda):**
   Site köküne boş bir `App_offline.htm` yükle (ANCM uygulamayı düşürür), dosyaları
   at, sonra `App_offline.htm`'i sil.

> **Doğrulanmış (2026-08-12):** Aynı çıktı klasörüne iki kez `dotnet publish` çalıştırılıp
> (aralarında tek satırlık bir localization değişikliğiyle) 1680 dosyalık çıktı karşılaştırıldı.
> Sadece **3 dosya** değişti: değişen projenin `.dll`+`.pdb`'si ve `web.config`.
> Önemli: **"boyuta göre" karşılaştırma yeterli değil** — embedded resource içeren bir DLL,
> içerik değişse bile aynı boyutta kalabilir (bu testte öyle oldu). **Her zaman "değişiklik
> tarihine göre" kullan.** `web.config` içerik değişmese de her publish'te dokunulur
> (tarihi güncellenir) — bu zararsız bir "gereksiz yükleme"dir, atlanabilir ama atlamak
> gerekmez.

---


---

## 7. Uygulama havuzu: soğuk başlangıç önlemleri

Paylaşımlı hosting'de "sayfa bazen çok geç açılıyor" şikâyetinin ana kaynağı kod
değil, **app pool'un boşta öldürülmesi**dir. Havuz kapandıktan sonraki ilk istek
ABP modül init + EF model kurulumu + localization yüklemesinin tamamını öder.

Aşağıdaki üç ayar birlikte çalışır; **ikisi Plesk arayüzünden, biri `web.config`'ten**.

### 7.1 Plesk arayüzü (app pool ayarları — web.config'ten YAPILAMAZ)

Plesk → *Websites & Domains* → alan adı → **IIS Application Pool Settings**:

| Ayar | Değer | Neden |
|---|---|---|
| **Idle Time-out** | `0` | Boşta kalınca havuzu öldürme |
| **Start Mode** | `AlwaysRunning` | Sunucu/havuz açılışında uygulamayı hemen başlat |
| Regular Time Interval (recycle) | `0` ya da gece saati | Gün ortasında geri dönüşüm yapma |

> Plesk bu alanları göstermiyorsa hosting sağlayıcısı kısıtlamış demektir; destek
> talebi aç. Bu ayarlar olmadan 7.2'deki ısıtma **yalnız** geri dönüşüm sonrası
> devreye girer, boşta ölme sorununu çözmez.

### 7.2 `web.config` — ısıtma isteği

`<applicationInitialization>` bloğu zaten repoda ([src/Apya.Platform.Web/web.config]).
IIS, havuz başladıktan sonra `/health/live`'ı **kendisi** çağırır; pipeline'ı gerçek
kullanıcı değil bu istek ayağa kaldırır.

**Önkoşul:** sunucuda IIS **Application Initialization** bileşeni kurulu olmalı.
Kurulu değilse site `500.19` verir → bkz. Sorun giderme.

### 7.3 Barındırma modeli: InProcess

`web.config`'te `hostingModel="InProcess"`. Uygulama IIS worker sürecinin (w3wp)
içinde barınır; `OutOfProcess`'teki IIS → Kestrel ters vekil atlaması ortadan kalkar
(istek başına sabit gecikme payı).

**Bu değişiklik ANCM sürümüne duyarlıdır.** Sunucudaki ANCM .NET 10 self-contained
barındırmayı desteklemiyorsa site `500.30`/`500.31` ile açılmaz → bkz. Sorun giderme.

### 7.4 Yayın sonrası doğrulama sırası

Bu üç değişiklik ilk kez yayına alınırken **tek tek** doğrula; hepsini birden açıp
hata alırsan hangisinin kırdığını ayıramazsın.

1. Yayınla → `https://alanadi/health/live` → **200** bekle.
   - `500.30`/`500.31` → 7.3'ü geri al (`hostingModel="OutOfProcess"`), tekrar dene.
   - `500.19` → 7.2'deki `<applicationInitialization>` bloğunu sil, tekrar dene.
2. Havuzu Plesk'ten **Recycle** et, ~30 sn bekle, `/health/live`'ı çağır.
   Isıtma çalışıyorsa yanıt anında gelir (saniyeler değil).
3. `https://alanadi/Dashboard` → sayfa açılır, tarayıcı ağ sekmesinde
   `react-vendor` / `ui-vendor` istekleri **HTML ile paralel** başlamış olmalı
   (`dashboard.js` inip ayrıştırıldıktan sonra değil).

## Sorun giderme

**Site açılmıyor / 500.30, 500.19:**
`web.config` içinde `stdoutLogEnabled="true"` yap, siteyi tekrar çağır,
`Logs/stdout_*.log` dosyasına bak. Sorun bitince `false`'a çevir.

**Hata: ANCM bulunamadı (500.19 / handler tanınmıyor):**
Hosting'de ASP.NET Core desteği açık değil — destek talebi aç.

**500.30 / 500.31 (uygulama başlatılamadı) — InProcess'ten sonra çıktıysa:**
Sunucudaki ANCM sürümü .NET 10 self-contained in-process barındırmayı desteklemiyor.
`web.config`'te tek satır geri al: `hostingModel="InProcess"` → `"OutOfProcess"`.
Yeniden publish GEREKMEZ. Bkz. 7.3.

**500.19 (config bölümü tanınmıyor) — ısıtmadan sonra çıktıysa:**
IIS **Application Initialization** bileşeni kurulu değil. `web.config`'teki
`<applicationInitialization>` bloğunu tümüyle sil (7.2). `hostingModel` bundan
bağımsızdır, kalabilir. Bileşenin kurulmasını istemek için destek talebi aç.

**Performans — soğuk başlangıç:**
App pool boştayken geri dönüştürülürse ilk ziyaretçi 20–40 sn bekler.
Önlemler **bölüm 7'de**: Idle Time-out=0, Start Mode=AlwaysRunning ve
`/health/live` ısıtması. Bu ayarlar uygulanmadıysa şikâyet devam eder.

**Performans — arka plan işleri:**
Bildirim, doküman son tarih hatırlatma, kur değerleme ve abonelik süre kontrolü
yalnızca app pool ayaktayken çalışır. Bölüm 7 uygulanmazsa bu işler de kaçar;
kısıt kalıcıysa VPS'e geçmek gerekir.

---

## Yapılandırma katmanları

| Dosya | İçerik | Git'te |
|---|---|---|
| `appsettings.json` | Ortak varsayılanlar | ✅ |
| `appsettings.Production.json` | Alan adı, `Database:Provider=SqlServer`, log seviyeleri | ✅ |
| `appsettings.secrets.json` | Bağlantı dizisi, ClientSecret, sertifika parolası, şifreleme anahtarı | ❌ |
| `openiddict.pfx` | Token imzalama/şifreleme sertifikası | ❌ |

`ASPNETCORE_ENVIRONMENT=Production` değeri `web.config` içinde ayarlıdır.

### PostgreSQL'e geri dönüş

`appsettings.Production.json` → `"Database": { "Provider": "PostgreSql" }` ve
`ConnectionStrings:PostgreSql` doldurulur. Migration'lar her iki sağlayıcı için de hazırdır.
