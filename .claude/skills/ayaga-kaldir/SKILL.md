---
name: ayaga-kaldir
description: Launch/run the Apya.Platform app locally — "ayağa kaldır", "uygulamayı çalıştır", "run the app", "start the web app". Starts PostgreSQL, installs missing client-side libs, runs the Web project at https://localhost:44386.
---

# Apya.Platform'u ayağa kaldır

Bu repoyu yerelde çalıştırmanın **doğrulanmış** yolu. Sırayı atlama —
özellikle git worktree'lerde 2 ve 3. adımlar şarttır.

## Tek komut

Çalıştırma ortamından (PowerShell):

```powershell
./scripts/dev-up.ps1
```

Script idempotenttir: Postgres zaten çalışıyorsa / libs zaten kuruluysa o adımı
atlar, doğrudan Web'i başlatır. Sadece hazırlık için: `./scripts/dev-up.ps1 -NoRun`.

Uygulama: **https://localhost:44386** · Giriş: `admin` / `1q2w3E*` (kullanıcı adı — e-posta değil; `admin@admin.com` ile giriş reddedilir)

## Script ne yapıyor (ve neden) — elle yapman gerekirse

1. **PostgreSQL 17 başlat.** Servis olarak **kayıtlı değil** (`Get-Service *postgres*`
   boş döner) ve PATH'te yok. Port 5432 kapalıysa elle başlat:
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

Beklenen: **HTTP 200** ve `<title>Platform</title>`. (500 + "Libs Folder is Missing"
görürsen 2. adım eksik.)

## Gotcha: tarayıcıda giriş 400 "antiforgery cookie not present"

App sağlamken tarayıcıda giriş 400 dönebilir — PWA service worker (`/sw.js`) login
sayfasını cache'liyor + bayat cookie. Çözüm: **Incognito** aç ya da F12 → Application →
"Clear site data" + service worker Unregister + Ctrl+Shift+R.

## Notlar

- Dev modda `openiddict.pfx` gerekmez (ABP otomatik geliştirme sertifikası).
- Build sırasında **AutoMapper 14.0.0 NU1903 CVE** uyarısı bilinen/kabul edilmiş durumdur.
