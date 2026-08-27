# Deploy delta — 2026-08-27 #2 (`e695ef2d` → `main` `64411988`)

Bu belge **`deploy-delta-2026-08-27.md`'nin yerine GEÇMEZ**, onun üstüne biner.
O belge `b52c360 → e695ef2d` aralığını anlatıyordu ve o yayın **tamamlandı**.

## ✅ Önceki yayın doğrulandı — yarım durum kapandı

`deploy-delta-2026-08-27.md` "publish kopyalaması DOĞRULANMADI" notuyla kapanmıştı.
2026-08-27 13:2x'te dışarıdan, parolasız ölçüldü:

| Uç | Beklenen | Ölçülen |
|---|---|---|
| `/js/apya-quota-upsell.js` | 200 (yeni, #263) | **200** ✅ |
| `/js/QueryProvider-AIUp_Zk5.js` | 200 (yeni chunk) | **200** ✅ |
| `/js/QueryProvider-B2D_02u4.js` | 302 (eski chunk, silinmiş olmalı) | **302** ✅ |
| `/health/ready` | 200 | **200** ✅ |

Eski chunk'ın **302** dönmesi kopyalamanın *temiz değiştirme* olduğunu, artıkların
birikmediğini kanıtlar. Canlı kod **ve** şema `e695ef2d`. Bu belgenin tabanı odur.

---

## 🟢 Bu yayın KOD-ONLY — migration YOK

| | 08-27 #1 (önceki) | **Bu yayın** |
|---|---|---|
| Yeni migration | 3 adet | **YOK** |
| DbMigrator | **zorunluydu** | **gerekmez** |
| Veritabanı yedeği | zorunluydu | zorunlu değil (yine de önerilir) |
| Üretilecek paket | 2 (Web + DbMigrator) | **1 (yalnız Web)** |

Doğrulama:

```bash
git diff --name-only e695ef2d..main | grep -i migration
```

→ **boş.** `AppDbContextModelSnapshot` de değişmemiştir.

> ⚠️ **"Migration yok" paketi hafifletmez.** Publish klasörü yine **tamamen**
> değiştirilir; aşağıdaki 4 öğe önce yedeklenir, sonra geri konur.

---

## 🔴 Korunacak dosyalar (deploy'un EZMEMESİ gerekenler)

Publish paketinde **YOKTURLAR**; klasör yenilenince giderler. 2026-08-26'da
`openiddict.pfx` silindiği için site 502.5 ile tamamen kapanmıştı.

| Öğe | Kaybedilirse |
|---|---|
| `openiddict.pfx` | ANCM **502.5**, site açılmaz |
| `appsettings.secrets.json` | Bağlantı dizesi gider, uygulama ayağa kalkmaz |
| `App_Data\uploads\` | Kullanıcıların yüklediği tüm dosya ekleri gider |
| `App_Data\DataProtection-Keys\` | Herkesin oturumu düşer, çerezler çözülemez |

Reçetenin tamamı: `plesk-windows.md`.

---

## Ne değişti (7 PR)

### Yenilik

| PR | Başlık |
|---|---|
| #267 | Sistem Sağlığı'na **1 günlük** zaman penceresi |
| #271 | Uç kimliği normalizasyonu + toplamanın SQL'e indirilmesi |
| #274 | **Teşhis konsolu** — Teşhis / Ölçümler sekmeleri, kanıt paneli |

> #274, kapatılan #273'ün `main` üzerine yeniden oturtulmuş hâlidir (içerik birebir aynı).
> #273 taban dalı #271 olduğu için, #271 merge edilince taban uyuşmazlığından
> CONFLICTING'e düşmüştü.

**Sistem Sağlığı yalnız host yöneticisine görünür** — kiracı tarafında bir yüzey değişikliği yok.

### Düzeltme

| PR | Başlık | Etkilenen |
|---|---|---|
| #268 | Yatay telefonda görev listesi sıkışıp görünmüyordu | Mobil (yatay) |
| #269 | Görev detayında `⋯` menüsü modal sınırında kırpılıyordu | Görev detayı |
| #270 | Kişi baş harfi ve rengi tek kurala indi + koyu tema kontrastı | Uygulama geneli |

### Belge

| PR | Başlık |
|---|---|
| #272 | Önceki yayının delta belgesi (`deploy-delta-2026-08-27.md`) |

### Merge sırasında yapılan tek elle müdahale

#270 ile `main` arasında `wwwroot/js/style.css` ve `wwwroot/js/task-detail.js`
çakıştı. **Bu ikisi Vite build çıktısıdır** (`vite.config.js` → `outDir: '../js'`);
elle birleştirilmedi — kaynaklar (`.jsx`) temiz birleştikten sonra `npm run build`
ile yeniden üretildi. Demet, bu paketin kaynağıyla birebir tutarlıdır.

---

## Sürüm notları — `2026.08.27`

`ReleaseNoteCatalog.All` listesinin başına **28 maddelik** yeni kayıt eklendi
(7 Yenilik · 7 İyileştirme · 14 Düzeltme). Kapsam **PR #225 → #274**: son
duyurulan not `2026.08.25` (#223) idi, arada 50 commit duyurusuz kalmıştı.

**Bilerek dışarıda bırakılanlar:**

| Konu | Sebep |
|---|---|
| "Şifremi unuttum" (#266) | **SMTP girilmedi** — duyurulursa kullanıcı tıklar, posta gelmez |
| Soğuk başlangıç hızı (#264'ün bir kısmı) | web.config + app pool **açılmadı**; ölçüldü: ilk istek **17,8 sn** |
| Proje kategorisi tanımları (#256) | Kiracı kendi kategorisini **ekleyemiyor** (aşağıdaki bilinen boşluk) |
| #225 · #226 · #230 · #236 · #238 · #272 | Dar yönetici yolu / mockup / test / daha önce duyuruldu / iç mesele |

> 🔑 **Modalın ikinci kapısı:** `ReleaseNotesViewComponent`, tanıtım turu
> (`PlatformSettings.Tour.Completed`) tamamlanmadan bilinçli olarak susar. Turu
> bitirmemiş kullanıcıda önce tur çıkar, "Yenilikler" penceresi çıkmaz — bu bir hata değildir.

---

## 🔴 Bilinen boşluk (bu yayında ÇÖZÜLMEDİ)

**`Projects.ManageCategories` kiracılarda açılamıyor** (#256'dan devreden).
İki sebep üst üste:

1. İzin `TenantPackageManager.LateAddedPermissions` listesinde **değil** → paket
   tavanına taşınmıyor.
2. `ProjectCategoryPermissionDataSeedContributor` yalnız **host** admin rolüne
   veriyor (`if (context.TenantId != null) return;`).

Sonuç: kategori yönetimi canlıda yalnız host'ta. Kiracı üç sistem kategorisini
görür, kendi kategorisini ekleyemez. **Çökme değil, eksik yüzey.**
Düzeltmesi ayrı PR **+ yeniden DbMigrator** ister — bu yüzden bu kod-only yayına alınmadı.

---

## Deploy adımları

### 1. Korunacak dosyaları yedekle

`openiddict.pfx` · `appsettings.secrets.json` · `App_Data\uploads\` ·
`App_Data\DataProtection-Keys\` → site kökünün dışına kopyala.

### 2. Siteyi durdur

Plesk → uygulama havuzunu durdur (dosya kilidi yüzünden kopyalama yarım kalmasın).

### 3. Web paketini **tamamen** değiştir

ZIP'te sarmalayıcı klasör **yok** — `web.config` doğrudan site köküne düşmeli.
Üzerine ekleme değil, **temiz değiştirme**: eski `publish` içeriği silinip yenisi açılır.
(Artık birikirse eski chunk'lar 302 yerine 200 dönmeye başlar ve doğrulama adımı yalan söyler.)

### 4. Korunan dosyaları geri koy

Adım 1'deki dört öğe yerine.

### 5. Siteyi başlat

Plesk → havuzu başlat. **DbMigrator çalıştırılmaz** — bu yayında migration yok.

---

## Doğrulama (deploy sonrası)

### 1. Site ayakta mı

```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 60 https://apya.pargetto.com/health/ready
```

→ **200**. İlk istek uzun sürebilir (havuz uyuyor); zaman aşımını dar tutma.

### 2. Kod gerçekten değişti mi — blob parmak izi

Bu yayında **yeni dosya adı yok**, hepsi değişiklik → 200/302 testi işe yaramaz.
Onun yerine servis edilen içeriğin git blob hash'i karşılaştırılır. Önce bir
ısınma isteği at, sonra:

```bash
for f in css/apya-shell.css js/task-detail.js js/apya-task-render.js js/style.css js/calendar.js js/apya-issue-task.js; do printf "%-26s %s\n" "$f" "$(curl -s --max-time 60 https://apya.pargetto.com/$f | git hash-object --stdin | cut -c1-12)"; done
```

| Dosya | Deploy ÖNCESİ (`e695ef2d`) | Deploy SONRASI beklenen |
|---|---|---|
| `css/apya-shell.css` | `17553ce68175` | **`dea2b0a514fe`** |
| `js/task-detail.js` | `6804e7e9e8b8` | **`da8d19a1a990`** |
| `js/apya-task-render.js` | `0c9abeb61558` | **`c80519069a74`** |
| `js/style.css` | `ebc47e8f77da` | **`eca809cad759`** |
| `js/calendar.js` | `4df217c87fac` | **`5ed6fae2d612`** |
| `js/apya-issue-task.js` | `cb5b3c171616` | **`e724ab774bc7`** |

Altı satırın **hepsi** sağdaki değere dönmeliyse dönmüş demektir; biri bile
soldaki değerde kalıyorsa kopyalama eksiktir.

### 3. Elle bakılacaklar (dışarıdan ölçülemez)

- Giriş yapılabiliyor mu (`DataProtection-Keys` yerinde mi)
- Bir görevin dosya eki açılıyor mu (`App_Data\uploads` yerinde mi)
- **"Yenilikler" penceresi açılıyor mu** — turu tamamlamış bir kullanıcıda çıkmalı
- `/Admin/SystemHealth` → Teşhis / Ölçümler sekmeleri (host yöneticisi)

---

## Bu yayının DIŞINDA kalan, hâlâ bekleyen işler

| İş | Nerede | Neden bekliyor |
|---|---|---|
| **SMTP** | `/SettingManagement` → E-posta | Girilmeden şifre sıfırlama postası **gitmez**. Varsayılan gönderen `noreply@abp.io` mutlaka değiştirilmeli. |
| **Plesk app pool** (Idle=0, AlwaysRunning) | Plesk | Yalnız hız değil **işlevsel**: `SubscriptionExpiryWorker` saatlik koşar, havuz uyursa abonelik süresi işlenmez. |
| **`hostingModel="InProcess"`** | `web.config` | App pool ayarından **SONRA** açılır. |
| **`<applicationInitialization>`** | `web.config` | En son. **Üçü birden açılmaz.** |
| Yükseltme kanalı | `/PackageManagement` | Satış e-postası/telefon/fiyat sayfası üçü de boşsa "Paketim" ekranında yükseltme düğmesi basılmaz. |
| `Projects.ManageCategories` kiracı boşluğu | ayrı PR | Düzeltmesi DbMigrator ister. |

---

## Geri alma

Migration olmadığı için geri alma **yalnız dosya işidir**: bir önceki
`Apya-Yayin-e695ef2d.zip` paketini aynı yordamla geri açmak yeterli. Şema
değişmediği için veritabanına dokunulmaz.

---

## Doğrulama (paket üretilirken yapıldı)

- `dotnet build Apya.Platform.slnx -c Release` → **0 hata** (590 uyarı, hepsi mevcut)
- `dotnet test Apya.Platform.slnx -c Release` → **839 test, 0 başarısız**
  (Domain 226 · Application 186 · EFCore 190 · Web 237)
- `npm test` (dynamic-assets) → **450 test / 48 dosya, 0 başarısız**
- .NET ve JS testleri **ardışık** koşturuldu — eşzamanlı koşunca Web.Tests flaky düşüyor.
