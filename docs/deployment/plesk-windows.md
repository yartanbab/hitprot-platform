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

## Sorun giderme

**Site açılmıyor / 500.30, 500.19:**
`web.config` içinde `stdoutLogEnabled="true"` yap, siteyi tekrar çağır,
`Logs/stdout_*.log` dosyasına bak. Sorun bitince `false`'a çevir.

**Hata: ANCM bulunamadı (500.19 / handler tanınmıyor):**
Hosting'de ASP.NET Core desteği açık değil — destek talebi aç.

**Performans (paylaşımlı hosting'in doğası):**
App pool boştayken geri dönüştürülür → ilk ziyaretçi 20–40 sn bekleyebilir.
Arka plan işleri (bildirim, doküman son tarih hatırlatma, kur değerleme) yalnızca
app pool ayaktayken çalışır. Bu iki kısıt kalıcıysa VPS'e geçmek gerekir.

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
