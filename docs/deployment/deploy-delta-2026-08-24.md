# Deploy delta — 2026-08-24 (`1d4a039` → bu belgenin bulunduğu `main` `b66ecc8`)

Bu, **canlıdaki `1d4a039`** (2026-08-20 beşinci yayın — 12 migration uygulandı, ayakta) ile bu
yayının `main`'i arasındaki farktır. Kesin sha paket adında yazar.

> ✅ **Bu yayın KOD-ONLY'dir.** `1d4a039`'a göre **yeni migration YOK**, dolayısıyla:
> - **DbMigrator paketi ÜRETİLMEZ, çalıştırılmaz.**
> - **Veritabanı yedeği bu yayın için zorunlu değildir** (yine de rutin yedek her zaman iyidir).
> - Şema, seed tabloları ve OpenIddict kayıtları olduğu gibi kalır.

**Tek paket üretilir** (Masaüstünde):

| Paket | Ne için | Sonrası |
|---|---|---|
| `Apya-Yayin-<sha>.zip` | Web uygulaması — sunucudaki site köküne açılır (üzerine yazılır) | Kalıcı |

Tam Plesk süreci için `docs/deployment/plesk-windows.md` geçerli; bu belge yalnız **bu sürüme özel**
zorunlu adımları ve davranış değişikliklerini toplar. Bir önceki tam-deploy (12 migration) runbook'u
`docs/deployment/deploy-delta-2026-08-20.md`.

---

## Ne değişti (özet)

Kaynak: `1d4a039..b66ecc8`, 15 commit — PR #209–#213 + deploy düzeltmeleri. Migration **yok**.

| Alan | İçerik | Deploy etkisi |
|---|---|---|
| 🌐 **Domain** | `apya.pargetto.com.tr` → `apya.pargetto.com` (`appsettings.Production.json`: `App:SelfUrl` + `OpenIddict:...:RootUrl`) | Yeni domain **sunucuda zaten hazır** (DNS+SSL+Plesk). Pakette değer yeni; ek sunucu adımı yok. Yalnız secrets kontrolü (§3). |
| 🔐 **Sertifika yükleme** | `PlatformWebModule.cs` — `openiddict.pfx` artık **mutlak yolla** (`AppContext.BaseDirectory`) ve **sırayla farklı anahtar depoları** (MachineKeySet → Ephemeral → UserKeySet → Default) denenerek yüklenir | Paylaşımlı Windows/IIS'te "cert bulunamadı" (`CryptographicException` → ANCM 502.5) tuzağını çözer. `openiddict.pfx` uygulamanın yanında kalmalı (§2). |
| 🐞 **Yeni Müşteri 500** | `Ai`/`Documents`/`OpenIddict` seed contributor'larına **host-only guard** (`TenantId != null → return`) | Kod ile düzelir; **seeder/DbMigrator gerektirmez.** Yeni kiracı oluştururken host-global seed'lerin tekrar çalışıp çakışması engellenir. |
| ✨ **Proje görev paneli ayarı** (PR #212) | Yeni kullanıcı ayarı `Platform.Projects.DetailPanel`, **varsayılan KAPALI**. Kapalıyken projeye tıklama sağdan açılan panel yerine **proje detay sayfasına** gider. Ayardan açılır. | Kullanıcı görünür davranış değişikliği (§ Davranış). |
| 💫 **Sayfa yükleme animasyonu** (PR #211) | `wwwroot/css/apya-entrance.css` — üst-seviye bloklara kademeli giriş; global bundle'a eklendi. `prefers-reduced-motion` korumalı | Kozmetik. ABP bundling runtime'da minify eder. |
| 🗓️ **Takvim kurulum sihirbazı** (PR #210) | `SetupWizard.jsx` — kısa masaüstü ekranda footer kırpılması düzeltildi | 🔴 **React bundle yeniden derlenmeli** (§1). |

**Sürüm notları kullanıcıya gösterilir:** katalogda yeni **`2026.08.24`** girdisi var
(`src/Apya.Platform.Web/ReleaseNotes/ReleaseNoteCatalog.cs`). `/ReleaseNotes` artık **üç sürüm**
(2026.08.24 · 2026.08.20 · 2026.08.16) listeler; ilk açılışta "Yenilikler" penceresi 2026.08.24'ü gösterir.

---

## 🔴 Zorunlu deploy adımları

### 1. Paketleme

```
# Web projesinde:
abp install-libs
# ardından (dynamic-assets içinde):
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npm ci
```

> ✅ **Takvim bundle'ı bu dalda zaten yeniden derlendi.** `SetupWizard.jsx` bu yayında değişti;
> commit `22d2f41` yalnız kaynağa dokunmuştu, bu yüzden bu deploy hazırlığında `vite build` çalıştırılıp
> **`wwwroot/js/calendar.js` yeniden derlenip commit'lendi** (footer düzeltmesi bundle'a girdi —
> `max-h-[88dvh]` / `tablet:min-h-0` doğrulandı). Paketleme committed `wwwroot/js/*.js`'i olduğu gibi
> taşıdığından **ek `npm run build` adımı zorunlu değil.** Yine de kaynağı elle değiştirdiyseniz
> `npm run build` (vite build) çalıştırmayı unutmayın; **çıktı LF satır sonlu üretir, commit'li bundle'lar
> ise `autocrlf` ile CRLF'e döner** → build sonrası tüm `wwwroot/js/*.js` "değişmiş" görünür ama
> `git diff` yalnız gerçek farkı taşır. Gürültüyü `git checkout -- <dosya>` yerine **dosyayı silip
> yeniden checkout** ederek (`rm f && git checkout -- f`) temizleyin; yalnız gerçekten değişen bundle'ı bırakın.

- `dynamic-assets/yarn.lock`'ta oluşan değişikliği **commit etme** (install-libs artığı,
  `git checkout -- .../yarn.lock`).
- `dotnet publish -c Release -r win-x64 --self-contained true` (kısa yola, ör. `C:\ApyaPublish`).
- **Pakete GİRMEMELİ:**
  - `openiddict.pfx` — sunucudaki sertifikayı ezerse `CertificatePassword` eşleşmez → uygulama açılmadan çöker.
  - `appsettings.secrets.json` — sunucudaki sırları ezmesin.
- ZIP üretirken ters-slash tuzağı: entry adını `-replace '\\','/'`. Denetim: ZIP'i açıp
  `wwwroot/libs` girdi sayısını say (0 = ayraç bozuk).

### 2. 🔐 `openiddict.pfx` uygulamanın yanında durmaya devam etmeli

Bu yayının sertifika düzeltmesi pfx'i **`AppContext.BaseDirectory`** (uygulama kök klasörü, yani
`web.config`/exe ile aynı yer) altında arar. Sunucudaki mevcut `openiddict.pfx` yerinde kalsın;
paket onu ezmediği için (§1) taşımaya gerek yok. Parola sunucudaki
`appsettings.secrets.json`'daki `CertificatePassword`'dür — değişmedi.

Deploy sonrası ilk açılışta uygulama düzgün kalkıyorsa sertifika yüklendi demektir. Kalkmıyorsa
(ANCM 502.5) log'da artık **hangi anahtar deposu seçeneğinin neden düştüğü tek mesajda** yazar —
deneme-yanılma turu gerekmez.

### 3. 🌐 Domain — yalnız secrets doğrulaması

Domain sunucuda hazır olduğundan (kullanıcı teyidi) ek adım yok. **Tek kontrol:** sunucudaki
`appsettings.secrets.json` içinde `App:SelfUrl` veya `OpenIddict:...:RootUrl` satırı **varsa**,
değeri yeni domaini (`https://apya.pargetto.com`) göstersin — **secrets, `appsettings.Production.json`'ı
ezer**; orada eski `.com.tr` kalırsa paketteki yeni değer hiç devreye girmez.

> ℹ️ OpenIddict'in DB'ye kayıtlı redirect URI'ları yalnız **DbMigrator seed'i** çalışınca güncellenir;
> bu yayında DbMigrator çalışmıyor. Ana giriş **çerez tabanlıdır** (redirect URI'ya bağlı değil), bu
> yüzden login etkilenmez. Redirect URI'lar yalnız Swagger/API OAuth akışında kullanılır; oraya da
> gerekiyorsa bir sonraki DbMigrator çalışmasında (veya migration içeren yayında) kendiliğinden
> yeni domaine geçer (`HasSameRedirectUris` → `UpdateAsync`).

---

## ⚠️ Deploy sonrası davranış değişiklikleri

| Değişiklik | Etki / aksiyon |
|---|---|
| **Projeye tıklama artık detay sayfasına gider** | `Platform.Projects.DetailPanel` varsayılan kapalı. Önceden sağdan açılan görev panelini kullananlar artık proje detay sayfasına yönlenir. Paneli geri isteyen kullanıcı **Genel Ayarlar → "Proje görev paneli"**nden açar. |
| **Sayfalar kademeli beliriyor** | Saf CSS giriş animasyonu. "Hareketi azalt" tercihi açık cihazlarda otomatik kapanır. Regresyon riski düşük; yine de modal/`position:fixed` katmanların doğru açıldığını gözle doğrula. |
| **Yeni müşteri ekleme** | Host yöneticisi yeni kiracı eklerken 500 almaz (seed contributor host-only guard). Deploy sonrası **bir kez yeni müşteri ekleyip 200 döndüğünü doğrula.** |
| **Sürüm notları** | Menüdeki **Yenilikler** → `/ReleaseNotes` artık **üç sürüm** listeler; ilk açılışta 2026.08.24 penceresi çıkar. |

---

## Doğrulama (deploy sonrası)

- [ ] `https://apya.pargetto.com` → 200; `/` → `/Account/Login`
- [ ] **Giriş çalışıyor** (cert yüklendi + domain tutarlı)
- [ ] **Projeye tıklayınca proje detay sayfası açılıyor** (panel varsayılan kapalı); Ayarlar'dan açınca sağdan panel geliyor
- [ ] **Yeni müşteri (kiracı) ekleme 200 dönüyor** (Yeni Müşteri 500 regresyonu)
- [ ] **Takvim ilk kurulum sihirbazı** kısa ekranda footer'ı kırpmıyor (bundle yeniden derlendi mi kanıtı)
- [ ] Sayfa açılışında giriş animasyonu görünüyor; modal/açılır paneller normal açılıyor
- [ ] `/ReleaseNotes` **üç sürümü** listeliyor
- [ ] (Regresyon) Takvim Ay/Hafta/Gün geçişi, Dokümanlar ağacı, fatura oluşturma hâlâ çalışıyor

## Geri alma

Önceki paket (`1d4a039`) yeniden yüklenir. **Veritabanına dokunulmaz** — bu yayın şema/veri
değiştirmedi, geri alma yalnız Web dosyalarını eski sürüme döndürmektir.

---

## Deploy dışı açık (bu yayına engel DEĞİL)

- **SEC-001/002 sır rotasyonu** — `ClientSecret` + `DefaultPassPhrase` git geçmişinde duruyor.
- **KVKK yasal metinleri** hâlâ taslak.
- Dokümanlar modülünde etkileşimli test edilmemiş yollar: `/Share/{token}` ve mobil görünüm.
- Denetim sicili: `docs/denetim/bulgular.md`.
