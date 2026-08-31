---
name: ayaga-kaldir
description: Launch/run the Apya.Platform app locally — "ayağa kaldır", "uygulamayı çalıştır", "run the app", "start the web app". Prepares the active database (SQL Server locally), installs missing client-side libs, runs the Web project at https://localhost:44386.
---

# Apya.Platform'u ayağa kaldır

Bu repoyu yerelde çalıştırmanın **doğrulanmış** yolu. Sırayı atlama —
özellikle git worktree'lerde 2 ve 3. adımlar şarttır.

## Tek komut

Çalıştırma ortamından (PowerShell):

```powershell
./scripts/dev-up.ps1
```

Script idempotenttir: veritabanı zaten hazırsa / libs zaten kuruluysa o adımı
atlar, doğrudan Web'i başlatır. Sadece hazırlık için: `./scripts/dev-up.ps1 -NoRun`.

Uygulama: **https://localhost:44386** · Giriş: `admin` / `1q2w3E*` (kullanıcı adı — e-posta değil; `admin@admin.com` ile giriş reddedilir)

## Script ne yapıyor (ve neden) — elle yapman gerekirse

1. **Veritabanını hazırla — hangi sağlayıcı aktifse onu.** Script `Database:Provider`i
   `appsettings*.json`'dan okur; kural uygulamanın `DatabaseProviderResolver`'ıyla
   birebir aynıdır (eksik/geçersizse `PostgreSql`, bağlantı dizisi
   `ConnectionStrings:{Provider}` ?? `Default`). **Yerelde aktif olan `SqlServer`.**

   **SqlServer — bugünkü durum.** `MSSQLSERVER` Windows servisi, StartType
   `Automatic` → normalde boot'ta kendi kalkar. Elle:
   ```powershell
   Start-Service MSSQLSERVER                                     # yönetici hakkı ister
   sqlcmd -S localhost -d ApyaPlatform -E -C -Q "SELECT 1"       # asıl doğrulama
   ```
   🔴 **Postgres'teki gibi port yoklaması YAPMA.** TCP/IP kapalı; uygulama shared
   memory ile bağlanır ve `netstat`'ta **1433 hiç görünmez** →
   `Test-NetConnection -Port 1433` sağlam kurulumu "kapalı" sanır. Tek geçerli
   kanıt `sqlcmd` ile fiilen bağlanmaktır.

   **PostgreSql — sağlayıcı geri çevrilirse.** Servis olarak **kayıtlı değil**
   (`Get-Service *postgres*` boş döner) ve PATH'te yok; port 5432 kapalıysa:
   ```powershell
   & "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "C:\Program Files\PostgreSQL\17\data" -l "$env:TEMP\apya_pg.log" -w start
   ```

   DB (`ApyaPlatform`) zaten mevcut ve migrate; normalde DbMigrator'a gerek yok.

2. **`abp install-libs`** (Web proje dizininde). `wwwroot/libs` git-ignore'lu →
   worktree'de yoktur. Eksikse Web **her isteğe HTTP 500 "The Libs Folder is
   Missing!"** döner. Kurulumdan sonra Web'i **yeniden başlat** (kontrol startup'ta).

3. **Web'i proje dizininden çalıştır.** Kökten `dotnet run --project src/...`
   yaparsan config CWD'den okunmaz → connection string boş gelir. Mutlaka:
   ```powershell
   Push-Location src/Apya.Platform.Web
   $env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --no-launch-profile
   Pop-Location
   ```

## Doğrulama / smoke test

`curl.exe -k` kullan — PowerShell 5.1'in `Invoke-WebRequest`'i bu dev TLS sertifikasında patlar.

```powershell
curl.exe -k -s -o NUL -w "HTTP %{http_code}\n" https://localhost:44386/Account/Login
```

Beklenen: **HTTP 200** ve `<title>Giriş yap · Apya</title>`. (500 + "Libs Folder is
Missing" görürsen 2. adım eksik.) DB'ye kadar inen daha güçlü kontrol:

```powershell
curl.exe -k -s -o NUL -w "HTTP %{http_code}\n" https://localhost:44386/api/abp/application-configuration
```

Bu uç ayar/izin/yerelleştirmeyi veritabanından çözer; **HTTP 200** dönüyorsa DB
bağlantısı da sağlamdır.

## Gotcha: tarayıcıda giriş 400 "antiforgery cookie not present"

App sağlamken tarayıcıda giriş 400 dönebilir — PWA service worker (`/sw.js`) login
sayfasını cache'liyor + bayat cookie. Çözüm: **Incognito** aç ya da F12 → Application →
"Clear site data" + service worker Unregister + Ctrl+Shift+R.

## Notlar

- Dev modda `openiddict.pfx` gerekmez (ABP otomatik geliştirme sertifikası).
- Build sırasında **AutoMapper 14.0.0 NU1903 CVE** uyarısı bilinen/kabul edilmiş durumdur.
