# Deploy delta — 2026-08-16 (`fde53e8` → `ace8126`)

Bu, **canlıdaki `fde53e8`** (2026-08-14 üçüncü yayın) ile **güncel `main` `ace8126`** arasındaki
yayın farkıdır. Tam Plesk süreci için `docs/deployment/plesk-windows.md` + hafıza kaydı geçerli;
bu belge yalnız **bu sürüme özel** zorunlu adımları ve davranış değişikliklerini toplar.

**Ön kontrol (hazır):** `dotnet build -c Release` → 0 hata · tam suite **353/353 yeşil** ·
prod provider = **SqlServer** (MSSQL).

---

## Ne değişti (özet)
- **Perf (PR #171/#175/#176):** kiracı-bazlı indeksler + rate limiting.
- **Denetim (PR #178/#179/#180):** güvenlik (SEC-003/006/007/010/011/012/013/014/016),
  doğruluk (CORR-001/004), KVKK Dalga 1 (aydınlatma/gizlilik + çerez/rıza + form onayı),
  FN-001/004, TEST-001/002, ölü kod temizliği.

---

## 🔴 Zorunlu deploy adımları (bu sürüme özel)

### 1. Paketleme (standart — kılavuza göre)
- Publish öncesi **`abp install-libs`** (Web projesinde). Sonra `git diff --stat` ile
  `ui-vendor.js` kirlenmediğini doğrula; kirlendiyse `git checkout --` ile geri al.
- `dotnet publish -c Release -r win-x64 --self-contained true` (kısa yola, ör. `C:\ApyaPublish`).
- **Pakete GİRMEMELİ:** `openiddict.pfx` (sunucudaki sertifikayı ezerse `CertificatePassword`
  eşleşmez → açılmadan çöker), `appsettings.secrets.json` (zaten `CopyToPublishDirectory=Never`).
- ZIP'te ters-slash tuzağına dikkat (`ZipFile::Open` + entry adını `-replace '\\','/'`);
  `wwwroot/libs` girdi sayısını doğrula (0 = ayraç bozuk).

### 2. Şema + seed — **DbMigrator ile (SQL konsolu yok)** 🔴
Bekleyen **3 migration** (SqlServer, prod), DbMigrator otomatik uygular:
1. `20260815095035_Perf_TenantScoped_Indexes` — TaskItem+Invoice TenantId indeksleri
2. `20260815113809_Add_ConsentRecords` — KVKK çerez/rıza tablosu (`AppConsentRecords`)
3. `20260815180807_Drop_ProjectAnalyses` — kullanılmayan `AppProjectAnalyses` tablosunu **düşürür** (veri yok, güvenli)

**DbMigrator ayrıca SEEDER'ları çalıştırır** — bu sürümde YENİ izin seed'leri:
- `Consents.Default` → host admin (FN-004; `/Admin/Consent` paneli için)
- **Tüm `Ai.*` + `Projects.UseAiFeatures`** → host + **her kiracının** admin rolü (SEC-006).
  Efektif erişimi paket tavanı kontrol eder (Premium/Enterprise AI görür, Basic/Standard görmez).

> ⚠️ **KRİTİK:** `SUNUCU-1-dbmigrator-secrets.json` içindeki **`ClientSecret` + `DefaultPassPhrase`
> ilk seed'deki değerlerle AYNI olmak zorunda.** Değişirse OpenIddict seed'i/giriş + AI anahtarı
> çözümü kırılır. (SEC-001 gereği repo'daki `appsettings.json` bunları BOŞ tutuyor — değerler yalnız
> sunucudaki secrets dosyasında.)

DbMigrator'ı Plesk Zamanlanmış Görev ile bir kez çalıştır → **bitince klasörü sil** (sır içerir).
Beklenen: çıkış 0 + "Successfully completed all database migrations."

### 3. Değişen dosyalar
Full self-contained publish tüm dosyaları taşır. Incremental (FileZilla, **tarihe göre** karşılaştır)
yapıyorsan bu sürümde değişen bundle'lar: `public-form.js`, `form-builder.js` (KVKK form onayı),
`apya-shell.css`, `dashboard.js`, `task-detail.js`, `apya-task-console.js` vb. (perf+UI dalgaları).

---

## ⚡ Hızlı incremental (FTP) yol — full paket yerine

Tam self-contained paketi (~271 MB) yeniden yüklemek GEREKMEZ; büyük kısmı sabit .NET runtime.
Yalnız değişenleri FileZilla ile atmak yeterli (2026-08-12 kararı). **AMA bu sürüm migration+seed
ağırlıklı → aşağıdaki sıra ŞART; FTP tek başına yetmez.**

**Sıra:** `App_offline.htm` (site köküne, ANCM'i düşürür + DLL kilidini çözer) → **DbMigrator çalıştır
(§2 — 3 migration + izin seed'leri)** → değişen dosyaları at → `App_offline.htm` sil.
⚠️ Migration'sız yeni kodu atarsan app çöker (`AppConsentRecords` tablosu yok).

**Bu sürümde değişen dosyalar** (`fde53e8` → `fa933f2`):
- **DLL'ler** (kaynağı değişen 9 proje, + `.pdb` opsiyonel): `Apya.Platform.Web.dll`, `Application.dll`,
  `Application.Contracts.dll`, `Domain.dll`, `Domain.Shared.dll`, `Ai.Application.dll`,
  `EntityFrameworkCore.dll`, `EntityFrameworkCore.SqlServer.dll`, `HttpApi.dll`.
- **wwwroot bundle'ları:** `js/`: `public-form.js`, `form-builder.js`, `dashboard.js`, `task-detail.js`,
  `apya-task-console.js`, `apya-topbar-shell.js`, `sidebar-toggle.js` · `css/`: `apya-shell.css`,
  `apya-theme-bridge.css`.
- Yeni sayfalar (Legal, Admin/Consent, CookieNotice) runtime compilation kapalı → `Web.dll` içinde
  gelir, ayrı `.cshtml` atmaya gerek yok.

**Listeyi güvenilir çıkar:** git-diff DEĞİL (kaynak≠publish). Yerelde tam `dotnet publish` → FileZilla
**"tarihe göre"** dizin karşılaştırması (boyuta göre DEĞİL — embedded-resource'lu DLL aynı boyutta
değişebilir). **SDK yaması geldiyse** runtime DLL'leri de (`Microsoft.AspNetCore.*`, `coreclr`…) değişir
→ o zaman büyük paket; date-compare bunu da yakalar.

**Filtrede tut (yoksa "yerelde yok" görünüp silinir/ezilir):** `appsettings.secrets.json`,
`openiddict.pfx`, `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.

---

## ⚠️ Deploy sonrası davranış değişiklikleri

| Değişiklik | Etki / aksiyon |
|---|---|
| **SEC-010 — takvim token şifreleme** | Prod'daki **mevcut takvim OAuth token'ları düz metindi** → yeni kod şifreli bekliyor, çözemez → o bağlantılar sync'te başarısız (loglanır, çökmez). **Kullanıcılar takvimlerini yeniden bağlamalı.** Yeni bağlantılar şifreli. Yerelde 0 hesap; prod'da varsa bilgilendir. |
| **SEC-006/014 — AI izinleri** | Deploy+DbMigrator sonrası AI Center + AI üretimi host admin'e ve AiAssist paketli kiracı admin'lerine görünür olur (önceden hiç kimse — `Projects.UseAiFeatures` gate). |
| **SEC-013/016 — Projects/Tasks/Template API izni** | API artık `Projects.Default`/`Tasks.Default`/`DynamicAssets.Default` istiyor. Sayfalar zaten uyguladığı için mevcut kullanıcılar kilitlenmez; yine de giriş sonrası proje/görev listesini kontrol et. |
| **KVKK yasal metinler** | `/aydinlatma-metni` + `/gizlilik-politikasi` **TASLAK/placeholder** — hukuki inceleme + `[...]` doldurma yapılmadan nihai sayma. |

---

## Doğrulama (deploy sonrası)
- [ ] `https://apya.pargetto.com.tr` → 200; `/` → `/Account/Login` (kök yönlendirme + authz).
- [ ] **Giriş çalışıyor** (ClientSecret + passphrase eşleşiyor demektir).
- [ ] DB: 3 yeni migration kayıtlı; `AppConsentRecords` var; `AppProjectAnalyses` düşmüş.
- [ ] Admin'de **AI Center** menüsü + `/Admin/Consent` görünür/erişilebilir (izin seed'i çalıştı).
- [ ] Projeler / Görevler / Faturalar sayfaları açılıyor (izin gating regresyonu yok).
- [ ] (varsa) çerez şeridi görünüyor, form KVKK onay kutusu render oluyor.

## Geri alma
Önceki paket (`fde53e8`) + `docs/deployment/plesk-windows.md`'deki geri-alma planı. Migration'lar
eklemeli/indeks + tek tablo düşürme; kritik veri kaybı yok (`AppProjectAnalyses` boştu).

---

## Deploy dışı açık (bu yayına engel DEĞİL)
- **SEC-001/002 sır rotasyonu** — `ClientSecret` + `DefaultPassPhrase` git geçmişinde duruyor →
  rotasyon ayrı iş (deploy'u bloke etmez; sunucudaki secrets değerleri değişmemeli).
- Canlı E2E / QA, hukuki metin, KVKK-006/007 — denetim sicilinde (`docs/denetim/bulgular.md`).
