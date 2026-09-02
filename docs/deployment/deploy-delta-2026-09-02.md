# Deploy delta — 2026-09-01 (`63cb35c6` → `main`)

> **Hedef SHA bilerek başlıkta değil.** Bu belgenin kendi commit'i `main`'i ilerlettiği için
> buraya yazılan her SHA yazıldığı anda bayatlar. Paketin üretildiği tam commit, ZIP adında
> (`Apya-Yayin-<sha>.zip`) yazılıdır — tek doğru kaynak orasıdır.

Taban `63cb35c6` — 2026-08-27 #2 yayınıyla canlıya inen commit. 2026-08-31 için hazırlanan
paket **canlıya uygulanmadı** (aşağıya bak), bu yüzden delta hâlâ `63cb35c6`'dan ölçülüyor.

**27 commit · 21 PR · 12 migration (çift sağlayıcı).**

---

## 🔴 ÖNCE OKU — canlı şu anda ÇÖKÜK, ama sebebi 31 Ağustos'takinden BAŞKA

2026-09-01 14:06 UTC'de dışarıdan ölçüldü:

| Uç | Ölçülen | Süre |
|---|---|---|
| `/health/ready` | **500** | 1,17 sn |
| `/` | **500** | 0,07 sn |
| `/js/style.css` (statik) | **500** | 0,05 sn |

Gövde: **`HTTP Error 500.31 — Failed to load ASP.NET Core runtime`**
*"The specified version of Microsoft.NetCore.App or Microsoft.AspNetCore.App was not found."*

31 Ağustos'ta belirti **502.5** ve yanıt **8-9 saniye**ydi. Şimdi **500.31** ve yanıt
**0,05 saniye**. Bu fark tesadüf değil, teşhisin kendisi:

| | 502.5 (31 Ağu) | 500.31 (bugün) |
|---|---|---|
| ANCM ne yapıyor | ayrı süreç başlatmayı deniyor, düşüyor | runtime'ı IIS işçisinin **içine** yüklemeyi deniyor, anında düşüyor |
| Yanıt süresi | 8-9 sn (süreç başlatma zaman aşımı) | 0,05 sn (süreç hiç başlatılmıyor) |
| İşaret ettiği | `openiddict.pfx` / `secrets` kaybı | **`hostingModel="InProcess"`** |

Aradaki değişim, `web.config`'te `hostingModel`'in `InProcess`e alınmış olmasıyla birebir
uyuşuyor. `deploy-delta-2026-08-27.md` bölüm 5.2 bu senaryoyu zaten öngörmüş:

> Site açılmazsa (**500.30 / 500.31** = ANCM sürümü .NET 10 self-contained barındırmayı
> desteklemiyor) satırı geri al. **Yeniden publish gerekmez.**

### Adım 0 — deploy'dan ÖNCE dene (30 saniye)

Plesk → Dosya Yöneticisi → site kökü → `web.config`:

```
hostingModel="InProcess"   ->   hostingModel="OutOfProcess"
```

App pool'u geri dönüştür, siteyi aç. Açılırsa kök neden buydu ve deploy'a sakin
kafayla geçilir.

**Açılmazsa** ikinci aday devrede: paket **framework-dependent** yayımlanmış olabilir
(sunucuda .NET 10 runtime yok). O ihtimali bu yayın zaten kapatıyor — bu paket
`--self-contained` üretiliyor ve `publish-release.ps1` runtime'ın pakette olduğunu
`System.Private.CoreLib.dll` ile **doğrulamadan** ZIP üretmiyor.

### 🔑 Bu paket artık güvenli varsayılanla çıkıyor

Deploy hazırlığında ölçüldü: `web.config`, #264'ten beri `hostingModel="InProcess"`
**ve** `<applicationInitialization>` bloğu **açık** halde commit'liydi — canlıya inen
`63cb35c6` de dâhil. Oysa `deploy-delta-2026-08-27.md` bölüm 5 "bu pakette ikisi de
KAPALI gelir" diyordu; belge ile dosya çelişiyordu.

İkisi de belgenin vaat ettiği duruma çekildi. Ek olarak `AspNetCoreHostingModel`
csproj'da **açıkça** `OutOfProcess` yapıldı: publish, `<aspNetCore>` elemanını yeniden
yazıp `hostingModel`'i bu MSBuild özelliğinden alıyor ve özellik tanımsızken SDK
varsayılanı `InProcess`'tir — yani yalnız `web.config`'i düzeltmek publish sırasında
**sessizce geri alınırdı.** Publish çıktısı ölçülerek doğrulandı:
`hostingModel="OutOfProcess"`, `applicationInitialization` yorumda.

Sonuç: bu paket çöküşü yeniden üretemez. Soğuk başlangıç kazanımları site ayağa
kalktıktan sonra, aşağıdaki "bekleyen işler" sırasıyla tek tek açılır.

🔴 **Sıra önemli.** Site çökükken deploy edersen, sonrasında hâlâ hata alırsan sebebin
eski mi yeni mi olduğunu ayırt edemezsin.

---

## 🔴 12 MIGRATION VAR — DbMigrator ve veritabanı yedeği ZORUNLU

| | 08-31 (uygulanmadı) | **Bu yayın** |
|---|---|---|
| Yeni migration | 2 | **12 (çift sağlayıcı)** |
| Şema değişikliği | 2 tablo, 3 kolon | **13 tablo, 45 kolon, 23 indeks** |
| DbMigrator | zorunlu | **🔴 ZORUNLU — şema + izin tohumu + şablon tohumu** |
| Veritabanı yedeği | zorunlu | **🔴 ZORUNLU** |

Canlı **SqlServer** kullanıyor; aşağıdakiler o sağlayıcının migration'ları
(PostgreSql karşılıkları aynı adla, dakika farkıyla mevcut):

| # | Migration | Kaynak |
|---|---|---|
| 1 | `20260827131921_TaskShareLinks` | #284 |
| 2 | `20260831174129_Add_DemoRequests` | #294 |
| 3 | `20260901045515_Add_DemoRequestProjectBrief` | #294 |
| 4 | `20260901072007_AddProjectBudgetLinesAndFunding` | #298 |
| 5 | `20260901101802_GrantParameterExpansion` | #299 |
| 6 | `20260901110132_GrantStageTemplateAndDocuments` | #299 |
| 7 | `20260901111114_AddFxLedgerFields` | #298 |
| 8 | `20260901112713_GrantMatchWeights` | #299 |
| 9 | `20260901114405_AddTaskBudgetLink` | #298 |
| 10 | `20260901121838_GrantSourcesAndDrafts` | #299 |
| 11 | `20260901124156_GrantBookmarks` | #299 |
| 12 | `20260901130814_GrantRecommendationAssignee` | #299 |

### Mevcut veri korunuyor — ölçüldü

12 migration'ın `Up()` gövdeleri tarandı:

| Aranan | Bulunan |
|---|---|
| `DropColumn` · `DropTable` · `AlterColumn` · `RenameColumn` · `DropIndex` | **0 adet** |
| `CreateTable` · `AddColumn` · `CreateIndex` | 13 · 45 · 23 |
| `nullable: false` olup `defaultValue` verilmeyen kolon | **0 adet** |

Tek istisna `AddFxLedgerFields` içindeki **iki ham SQL**, ikisi de yalnız yeni kolonlara
**geri doldurma** yapıyor — eski kolonlara dokunmuyor:

```sql
UPDATE [AppExpenses]      SET [BookAmount] = [Amount], [BookRate] = 1;
UPDATE [AppIncomeEntries] SET [BookAmount] = [Amount], [BookRate] = 1;
```

Bu satırlar **şart**: olmasaydı geçmiş tüm gider/gelir kayıtları defter tutarında ₺0
görünürdü.

Sonuç: şema tamamen **eklemeli**. Hiçbir satır silinmiyor, hiçbir tip daralmıyor,
mevcut veri olduğu gibi kalıyor.

---

## 🔴 Korunacak dosyalar (deploy'un EZMEMESİ gerekenler)

Publish paketinde **YOKTURLAR**; klasör yenilenince giderler.

| Öğe | Kaybedilirse |
|---|---|
| `openiddict.pfx` | ANCM **502.5**, site açılmaz |
| `appsettings.secrets.json` | Bağlantı dizesi gider, uygulama ayağa kalkmaz |
| `App_Data\uploads\` | Kullanıcıların yüklediği tüm dosya ekleri gider |
| `App_Data\DataProtection-Keys\` | Herkesin oturumu düşer, çerezler çözülemez |

Plesk Dosya Yöneticisi'nde **Kopyala** ile **Taşı** yan yanadır — yanlışlıkla Taşı'ya
basmak secrets'ı web klasöründen alır ve 502.5 verir.

---

## Ne değişti — 21 PR

### İki büyük modül

| PR | Başlık |
|---|---|
| #298 | **Finans modülü proje bağlamlı tek çatıya taşındı** (7 adımın tamamı) |
| #299 | **Hibe modülü yeniden kuruldu** — 9 ekran, çift sağlayıcı şema |

**#298 — `/Finance` tek çatı.** Bütçe, gelir-gider ve faturalar tek ekranda proje
bağlamında toplandı. Bütçe kalemi · fonlama dilimi · kesinti · bütçe revizyonu modeli
geldi; görev↔bütçe kalemi bağı kuruldu; üç defterli kayıt (işlem PB · ₺ · donör) ve
proje bazlı kur politikası eklendi. Yol boyunca mevcut bir hata da düzeltildi: gider/gelir
düzenleme ekranı DTO kopyalamasında `TaskId` taşımadığı için **her düzenleme görev bağını
sessizce siliyordu.**

**#299 — hibe modülü.** 20 ekranlık yeniden tasarımın ilk 9'u. Yedisi host yüzeyi
(program parametreleri, aşama şablonları, eşleşme ağırlıkları, kaynaklar, metinden içe
aktarma, gönderim konsolu), üçü kiracı yüzeyi (hibe akışı, çağrı kataloğu, program
detayı). Kalan 11 ekran **henüz başlanmadı** — canlıda yarım/bozuk ekran yok.

🔑 Kalan 11 ekranın en görünür etkisi: `GrantApplicationStage` hâlâ sabit 4 değerli enum.
Aşama şablonları tanımlanabiliyor ama **başvurular henüz şablona bağlanmıyor**; o geçiş
pano adımında (2c) yapılacak.

### Hibe eşleştirme

| PR | Başlık |
|---|---|
| #292 | Kiracıya yayındaki tüm açık çağrılar gösteriliyor, önerilenler ayrılıyor |
| #295 | Erasmus+ gençlik programları (KA152/153/154/210/220) host kataloğuna tohumlandı |
| #296 | **Kiracı sızıntısı kapatıldı** — katalog okuması host satırlarına daraltıldı |
| #293 | Öneri servisindeki kullanılmayan iki repository alanı kaldırıldı |

🔴 **#296 gerçek bir veri sızıntısıydı:** `IDataFilter.Disable()` kapsamı tüm kiracılara
açıyordu; kiracı kendi 2 çağrısı yerine 62 çağrı görüyordu. Uyum eşiği süzgeci kusuru
yıllarca maskelemişti.

### Yenilik

| PR | Başlık |
|---|---|
| #284 | Görevi ekip dışındaki kişilerle **süreli link** ile paylaşma |
| #294 | Giriş ekranında kayıt yerine **demo talebi** akışı |
| #289 | Kilitli özellikler için menüde tek keşif öğesi |

### Düzeltme

| PR | Başlık | Etkilenen |
|---|---|---|
| #279 | Giriş sayfası service worker'da önbelleklenmiyor | **Mobil giriş** |
| #285 | Projeler mobil başlık bloğu 313px → 126px | **Mobil** |
| #286 | Sekmeler ve sürüklenebilir öğeler tek tıklamayla çalışıyor | Görev detayı · takvim · belgeler |
| #287 | Vite manifest'i publish paketine dâhil edildi | Island preload |
| #288 | Yükseltme bağlantısında yalnız http/https kabul ediliyor | Paketler |
| #281 | Kenar çubuğu "+" düğmesi proje oluşturma yetkisine bağlandı | Yetkisiz kullanıcılar |
| #282 · #283 | 4xx uçlar hata görevi açmıyor, kendi kanalına alındı | Sistem Sağlığı (host) |

### Bu deploy hazırlığında çıkan ve düzeltilen kusur

`ValidationLocalization_Tests` düştü (Web.Tests 320/321): #299 üç DTO'da doğrulama
attribute'u taşıyan **19 alanı Türkçe adı olmadan** bırakmıştı. 16'sı host ekranlarına
ait, **4'ü kiracı yüzeyindeki firma profilinde** (`StaffCount`, `RdStaffCount`,
`AnnualRevenue`, `Trl`) — müşteri "StaffCount boş bırakılamaz" görecekti. `tr.json`'a 19
anahtar eklendi.

---

## Doğrulama — bu paket için ölçülenler

| Kontrol | Sonuç |
|---|---|
| `dotnet build Apya.Platform.slnx` | **0 hata** (586 uyarı, hepsi mevcut) |
| Domain.Tests | **292/292** |
| Application.Tests | **235/235** |
| EntityFrameworkCore.Tests | **245/245** |
| Web.Tests | **321/321** (düzeltme sonrası) |

> 🔑 **Worktree'de test koşturacaksan önce `abp install-libs`.** Eksikken Web.Tests
> **98 hata** veriyordu ve hepsi ortam kaynaklıydı; kurulumdan sonra tek gerçek hata kaldı.
> `install-libs` `dynamic-assets` altında yarn koşup `yarn.lock`'u değiştirir — ardından
> `npm ci` çalıştır ve `yarn.lock` artığını `git checkout --` ile at.

---

## Sürüm notları — `2026.09.01` (14 madde)

Başlık: *"Proje finansı tek ekranda, hibe çağrılarının tamamı listede"*

Not **yayınlanmamıştı**, bu yüzden yeni sürüm açılmadı; `version`/`date` değişmedi ve tek
deploy'un hikâyesi ikiye bölünmedi.

| Kaynak | Madde |
|---|---|
| #298 | 7 madde (finans tek çatı, bütçe kalemleri, fonlama dilimleri, görev bütçesi, döviz, belge açığı) + 1 düzeltme (görev bağı silinmesi) |
| #292 · #295 | 3 madde (tüm açık çağrılar, önerilenlerin ayrılması, Erasmus+) |
| #299 | 3 madde (uygunluk şartlarının tek tek durumu, bütçe hesaplayıcı, giderilebilir eksik süzgeci) |

**Bilerek dışarıda bırakılanlar** — katalogun kendi kuralı: "Yenilikler" penceresinin ve
`/ReleaseNotes` sayfasının **izin kapısı yoktur**, host maddesi yazılırsa kiracı
erişemediği bir özelliği arar.

| Konu | Sebep |
|---|---|
| #299'un 7 host ekranı | Yalnız host yöneticisi görür |
| #294 demo talebi yönetimi | Host kaydı |
| #296 kiracı sızıntısı | Canlıda gerçekleşip gerçekleşmediği ölçülemedi |
| #281 · #282 · #283 · #287 · #288 | Host / iç mesele |

---

## 🔴 İzin tohumu — DbMigrator koşmazsa kiracıya ULAŞMAZ

Bu yayında iki yeni izin var, ikisi de **feature kapısının arkasında değil**:

| İzin | Yüzey | Telafi |
|---|---|---|
| `Tasks.ShareExternally` | kiracı | `TenantPackageManager.LateAddedPermissions` (tavan) + `TaskSharePermissionDataSeedContributor` (grant) |
| `DemoRequests.*` | **host** | `DemoRequestsPermissionDataSeedContributor` |

Hibe modülü **yeni izin eklemedi** — mevcut `Grants.*` izinlerini kullanıyor.

Ayrıca iki veri tohumlayıcısı: `ErasmusYouthCatalogDataSeedContributor` (5 program) ve
`GrantStageTemplateDataSeedContributor` (3 hazır aşama şablonu).

✅ **DbMigrator artık `Apya.Platform.Application`'a referans veriyor** (hem `ProjectReference`
hem `PlatformApplicationModule` bağımlılığı) — o katmandaki tohumlayıcılar koşuyor.
Bu geçmişte kırıktı ve 7 tohumlayıcı hiç çalışmıyordu (#246 ile kapandı).

---

## Deploy adımları — SIRAYLA

### 0. 🔴 Önce 500.31'i çöz

Yukarıdaki "Adım 0". Site ayağa kalkmadan deploy etme.

### 1. Veritabanı yedeği al

**Bu yayında zorunlu** — 12 migration şema değiştiriyor. Plesk → Veritabanları → Yedekle.

### 2. Korunacak dosyaları yedekle

`openiddict.pfx` · `appsettings.secrets.json` · `App_Data\uploads\` ·
`App_Data\DataProtection-Keys\` → site kökünün **dışına KOPYALA** (Taşı değil).

### 3. Siteyi durdur

Plesk → uygulama havuzunu durdur (dosya kilidi kopyalamayı yarıda kesmesin).

### 4. Web paketini **tamamen** değiştir

`Apya-Yayin-<sha>.zip` → site kökü. ZIP'te sarmalayıcı klasör **yok**; `web.config`
doğrudan köke düşer.

🔴 Üzerine ekleme değil, **temiz değiştirme**: eski içerik silinip yenisi açılır. Artık
birikirse eski chunk'lar 200 dönmeye başlar ve doğrulama adımı yalan söyler.

### 5. Korunan dosyaları geri koy

Adım 2'deki dört öğe yerine.

### 6. 🔴 DbMigrator'ı çalıştır

Bu turda **şema + izin tohumu + şablon tohumu** için — üçü de bundan geçiyor.

1. `Apya-DbMigrator-<sha>.zip`'i site kökünün **DIŞINDA** bir klasöre aç (ör. `dbmigrator\`).
2. `migrate.bat` içindeki üç değeri doldur (bağlantı dizesi, client secret).
3. Plesk → **Zamanlanmış Görevler** → tek seferlik görev → `migrate.bat` (tırnaksız tam yol).
4. 🔑 Başarıyı **çıkış kodundan değil log'dan** doğrula: `Logs\logs.txt` içinde
   **`Successfully completed all database migrations.`** satırını ara. Öncesinde
   **`Executing data seeders...`** de görünmeli — izin ve şablon tohumu orada koşar.
5. İşi biten `dbmigrator\` klasörünü sunucudan **SİL** — `migrate.bat` içinde parola düz metin.

### 7. Siteyi başlat

Plesk → havuzu başlat.

---

## Doğrulama (deploy sonrası)

### 1. Site ayakta mı

```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 90 https://apya.pargetto.com/health/ready
```

→ **200**. İlk istek uzun sürebilir (havuz uyuyor); zaman aşımını dar tutma.

### 2. Kod gerçekten değişti mi

Bu yayın **yeni sayfalar** getiriyor; parmak izi turuna gerek yok:

| Uç | Deploy ÖNCESİ | SONRASI beklenen |
|---|---|---|
| `/Finance` | 404 | **200 / 302** (giriş) |
| `/Grants/Catalog` | 404 | **200 / 302** |
|  `/Account/DemoRequest` | 404 | **200** (anonim) |

### 3. Şema uygulandı mı

**/Tasks**, **/Board** ve **/Finance** açılmalı. 500 dönüyorsa DbMigrator adımı atlanmış
demektir (EF entity'nin TÜM kolonlarını SELECT eder; eksik kolon sorguyu toptan düşürür).

### 4. 🔴 İzin ve tohum gerçekten koştu mu — KİRACI hesabıyla bak

Host hesabıyla bakmak **yanıltır**. Bir kiracı kullanıcısıyla gir ve üçüne de bak:

| Kontrol | Beklenen |
|---|---|
| Görev detayı → **"Dış Paylaşım"** sekmesi | görünmeli (`Tasks.ShareExternally` grant'ı geçmiş) |
| **/Grants/Catalog** → Erasmus+ programları | listede 5 program görünmeli |
| Hibe programı detayı → **aşama şablonu** | şablon listesi boş OLMAMALI |

Biri eksikse DbMigrator ya hiç koşmadı ya da seed adımı düştü.

### 5. Elle bakılacaklar (dışarıdan ölçülemez)

- Giriş yapılabiliyor mu (`DataProtection-Keys` yerinde mi)
- Bir görevin dosya eki açılıyor mu (`App_Data\uploads` yerinde mi)
- **"Yenilikler" penceresi** açılıyor mu — turu tamamlamış kullanıcıda 14 maddelik
  `2026.09.01` notu çıkmalı
- **Finans → Belgeler** sekmesi açılıyor mu
- Bir gider kaydını düzenleyip kaydet → **görev bağı korunuyor mu** (#298 düzeltmesi)
- Firma profilinde boş bırakılan sayısal alanda hata mesajı **Türkçe alan adı** basıyor mu

🔴 **Ne #298 ne #299 canlı, oturumlu QA'den geçti.** Ölçümler test host'u ve izole harness
üzerinden. Bu iki modülün uçtan uca denenmesi deploy sonrasına kaldı.

---

## Geri alma

Şema **eklemeli** olduğu için kod geri alınsa bile yeni tablo/kolonlar zararsız durur —
eski kod onları hiç sormaz. Geri alma pratikte **yalnız dosya işidir**: bir önceki
`Apya-Yayin-63cb35c6.zip` paketini aynı yordamla geri açmak yeterli.

⚠️ Gerçekten şemayı da geri almak istersen 12 migration'ın `Down` adımları 13 tabloyu ve
45 kolonu düşürür — **paylaşım linkleri, misafir yorumları, bütçe kalemleri, fonlama
dilimleri, hibe parametreleri ve aşama şablonları kalıcı olarak silinir.** Bunu yapma;
dosya geri alması yeterli.

⚠️ İkinci kalıcı iz: tohumun kiracı admin rollerine yazdığı `Tasks.ShareExternally`
grant'ları geri dönmez. Zararsızdır — eski kod o izni hiç sormaz.

---

## Bu yayının DIŞINDA kalan, hâlâ bekleyen işler

| İş | Nerede | Neden bekliyor |
|---|---|---|
| **SMTP** | `/SettingManagement` → E-posta | Girilmeden şifre sıfırlama postası **gitmez**. Varsayılan gönderen `noreply@abp.io` değiştirilmeli |
| **Plesk app pool** (Idle=0, AlwaysRunning) | Plesk | Yalnız hız değil **işlevsel**: `SubscriptionExpiryWorker` saatlik koşar, havuz uyursa abonelik süresi işlenmez |
| **`hostingModel="InProcess"`** | `web.config` + csproj | 🔴 Bu yayında çöküşün muhtemel sebebi; paket artık `OutOfProcess` çıkıyor. Açmak istersen app pool ayarından SONRA, **tek başına** dene; açılmazsa satırı geri al (yeniden publish gerekmez). Kalıcı yapacaksan csproj'daki `AspNetCoreHostingModel` da değişmeli — yoksa sonraki publish geri alır |
| **`<applicationInitialization>`** | `web.config` | En son, ve yalnız IIS "Application Initialization" bileşeni kuruluysa (yoksa 500.19). **Üçü birden açılmaz** |
| Hibe modülü 2a–2d | — | Kalan 11 ekran; başvuruların aşama şablonuna bağlanması burada |
| Yükseltme kanalı | `/PackageManagement` | Satış e-postası/telefon/fiyat sayfası üçü de boşsa "Paketim" ekranında yükseltme düğmesi basılmaz |
