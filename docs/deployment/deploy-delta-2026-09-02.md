# Deploy delta — 2026-09-02 (`63cb35c6` → `main`)

> **Hedef SHA bilerek başlıkta değil.** Bu belgenin kendi commit'i `main`'i ilerlettiği için
> buraya yazılan her SHA yazıldığı anda bayatlar. Paketin üretildiği tam commit, ZIP adında
> (`Apya-Yayin-<sha>.zip`) yazılıdır — tek doğru kaynak orasıdır.

Taban `63cb35c6` — 2026-08-27 #2 yayınıyla canlıya inen commit. 2026-08-31 ve 2026-09-01
için hazırlanan iki paket de **canlıya uygulanmadı**; delta hâlâ `63cb35c6`'dan ölçülüyor.
Bu belge `deploy-delta-2026-09-01.md`'nin yerini alır: aynı taban, aynı yordam, genişleyen
kapsam (09-01 paketinden sonra #302–#307 indi: finansın kalan altı ekranı, hibenin kalan
13 ekranı, üç para/veri düzeltmesi).

**33 commit · 29 PR (#279 → #307) · 21 migration (çift sağlayıcı).**

---

## 🔴 ÖNCE OKU — canlı hâlâ kapalı, belirti değişti

2026-09-02'de dışarıdan ölçüldü:

| Uç | Ölçülen | Süre |
|---|---|---|
| `/health/ready` | **503** | 0,28 sn |
| `/` | **503** | 0,05 sn |
| `/libs/signalr/signalr.min.js` (statik) | **503** | 0,05 sn |

2026-09-01'de üçü de **500.31** veriyordu (`Failed to load ASP.NET Core runtime`,
0,05 sn). Şimdi **503 Service Unavailable**. IIS'te 503, istek uygulamaya hiç ulaşmadan
döner: **uygulama havuzu durmuş** demektir — ya biri Plesk'ten durdurdu ya da art arda
düşen başlangıçlardan sonra IIS "rapid-fail protection" ile havuzu kendisi kapattı. İkinci
ihtimalde 500.31'in kök nedeni (aşağıda) hâlâ yerinde duruyor; havuzu başlatınca 500.31'e
geri dönersin.

500.31 teşhisi (2026-09-01) değişmedi: yanıt anında geldiği için süreç hiç başlatılmıyor →
`web.config`'te `hostingModel="InProcess"` imzası. `deploy-delta-2026-08-27.md` bölüm 5.2
bu senaryoyu öngörmüştü: *"500.30 / 500.31 → satırı geri al, yeniden publish gerekmez."*

### Adım 0 — deploy'dan ÖNCE (bir dakika)

1. Plesk → Dosya Yöneticisi → site kökü → `web.config`:
   `hostingModel="InProcess"` → `hostingModel="OutOfProcess"`
2. Plesk → uygulama havuzunu **başlat** (503'ün sebebi bu) ve geri dönüştür.
3. `https://apya.pargetto.com/health/ready` **200** dönene kadar deploy'a geçme.

Açılırsa kök neden buydu ve deploy'a sakin kafayla geçilir. **Açılmazsa** ikinci aday:
sunucudaki paket **framework-dependent** yayımlanmış olabilir (sunucuda .NET 10 runtime
yok). Bu paket o ihtimali kapatıyor — `--self-contained` üretiliyor ve
`publish-release.ps1` runtime'ın pakette olduğunu `System.Private.CoreLib.dll` ile
**doğrulamadan** ZIP üretmiyor.

### 🔑 Bu paket güvenli varsayılanla çıkıyor

`web.config` #264'ten beri `hostingModel="InProcess"` **ve** `<applicationInitialization>`
bloğu açık halde commit'liydi — canlıya inen `63cb35c6` dâhil. #301 ikisini de belgenin
vaat ettiği duruma çekti ve `AspNetCoreHostingModel` csproj'da açıkça `OutOfProcess` yapıldı
(publish `<aspNetCore>` elemanını yeniden yazıp değeri bu MSBuild özelliğinden alır;
özellik tanımsızken SDK varsayılanı `InProcess`'tir, yani yalnız `web.config`'i düzeltmek
publish'te sessizce geri alınırdı).

Sonuç: bu paket çöküşü yeniden üretemez. Soğuk başlangıç kazanımları site ayağa kalktıktan
sonra, en sondaki "bekleyen işler" sırasıyla **tek tek** açılır.

🔴 **Sıra önemli.** Site çökükken deploy edersen, sonrasında hâlâ hata alırsan sebebin
eski mi yeni mi olduğunu ayırt edemezsin.

---

## 🔴 21 MIGRATION VAR — DbMigrator ve veritabanı yedeği ZORUNLU

| | 09-01 paketi (uygulanmadı) | **Bu yayın** |
|---|---|---|
| Yeni migration | 12 | **21 (çift sağlayıcı)** |
| Şema değişikliği | 12 migration'lık kısım | **31 tablo, 65 kolon, 47 indeks** |
| DbMigrator | zorunlu | **🔴 ZORUNLU — şema + izin tohumu + üç veri tohumu** |
| Veritabanı yedeği | zorunlu | **🔴 ZORUNLU** |

Canlı **SqlServer** kullanıyor; aşağıdakiler o sağlayıcının migration'ları
(PostgreSql karşılıkları aynı adla, saniye farkıyla mevcut). İlk 12'si 09-01 paketiyle
aynı, 13–21 #305 ile geldi:

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
| 13 | `20260901201412_GrantApplicationWizard` | #305 |
| 14 | `20260901210232_GrantApplicationDocuments` | #305 |
| 15 | `20260901212456_GrantApplicationPipelineStep` | #305 |
| 16 | `20260901214047_GrantApplicationDetail` | #305 |
| 17 | `20260901220050_GrantApplicationProjectLink` | #305 |
| 18 | `20260901223910_GrantDecisionAndAppeal` | #305 |
| 19 | `20260901225640_GrantReports` | #305 |
| 20 | `20260902085859_GrantNotificationTemplates` | #305 |
| 21 | `20260902100049_GrantLeads` | #305 |

#302 · #303 · #304 · #306 · #307 **migration getirmedi** (yalnız kod / repository
yapılandırması / test).

### Mevcut veri korunuyor — ölçüldü

21 migration'ın `Up()` gövdelerindeki `migrationBuilder.*` çağrıları sayıldı:

| Aranan | Bulunan |
|---|---|
| `DropColumn` · `DropTable` · `AlterColumn` · `RenameColumn` · `RenameTable` · `DropIndex` | **0 adet** |
| `CreateTable` · `AddColumn` · `CreateIndex` · `AddForeignKey` | 31 · 65 · 47 · 2 |
| `AddColumn` içinde `nullable: false` olup `defaultValue` verilmeyen kolon | **0 adet** |
| Ham `migrationBuilder.Sql` | **2 adet**, ikisi de aşağıdaki geri doldurma |

Tek istisna `AddFxLedgerFields` içindeki iki ham SQL, ikisi de yalnız **yeni** kolonlara
geri doldurma yapıyor — eski kolonlara dokunmuyor:

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

## 🔴 YENİ: `wwwroot\libs\signalr\` pakette OLMALI

#305'in başvuru sihirbazı (`/Grants/Wizard`) Razor sayfasından doğrudan
`/libs/signalr/signalr.min.js` yüklüyor; klasör yoksa sayfa **500** döner (ölçüldü:
kütüphane kurulmadan `GrantWizardPage_Tests` düştü, kurulunca 15/15). Dosya
`@microsoft/signalr` paketinden `abp install-libs` ile kopyalanır; **bayat bir
install-libs çıktısı bu klasörü taşımaz** — bu paket hazırlanırken worktree'de 19 paket
vardı, signalr yoktu, install-libs yeniden koşturuldu (→ 20).

`publish-release.ps1` artık iki yerde bunu doğruluyor: kaynak `wwwroot\libs`'te ve
publish çıktısında `signalr\signalr.min.js` yoksa paket üretmiyor.

Deploy sonrası kontrol: `curl -o /dev/null -w "%{http_code}" https://apya.pargetto.com/libs/signalr/signalr.min.js`
→ **200** (statik dosya, oturum istemez; 302 dönerse dosya yok demektir).

---

## Ne değişti — 29 PR

### İki büyük modül, dörder PR

| PR | Başlık |
|---|---|
| #298 | **Finans modülü proje bağlamlı tek çatıya taşındı** (7 adımın tamamı) |
| #302 | Finans: kalan altı tasarım ekranı + **iki para hatası** düzeltmesi |
| #299 | **Hibe modülü yeniden kuruldu** — ilk 9 ekran, çift sağlayıcı şema |
| #305 | Hibe: başvuru süreci, bildirimler, kamu yüzeyi ve durum galerisi — **13 ekran, dokuz çift migration** |

**#298 + #302 — `/Finance` tek çatı, tasarımın on ekranı tamamlandı.** Bütçe, gelir-gider
ve faturalar tek ekranda proje bağlamında toplandı. Bütçe kalemi · fonlama dilimi · kesinti ·
bütçe revizyonu modeli geldi; görev↔bütçe kalemi bağı kuruldu; üç defterli kayıt (işlem PB ·
₺ · donör) ve proje bazlı kur politikası eklendi. #302 ile portföy tablosu ("Tüm projeler"),
kalem↔görev matrisi, bağlam sihirbazı, kesinti sonrası yeniden dağıtım, Donör & raporlama
sekmesi ve gerçek kayıt yapan saha girişi (offline kuyruklu) tamamlandı.

**#299 + #305 — hibe modülü, 20 ekranlık tasarımın 22 ekranı.** #299 yedi host + üç kiracı
ekranı getirdi (parametreler, aşama şablonları, eşleşme ağırlıkları, kaynaklar, metinden içe
aktarma, gönderim konsolu; kiracıda hibe akışı, katalog, program detayı). #305 başvuru
sürecinin tamamı: canlı birlikte düzenlenen başvuru sihirbazı (SignalR), iki taraflı evrak
takibi, pipeline konsolu, başvuru detayı, onay→projeye dönüştürme, "Başvurularım",
red & itiraz, uygulama & tahsilat, bildirim/e-posta şablonları (yedi tetikleyici gerçekten
bağlı), **anonim kamu yüzeyi** (`/Hibeler`, `/Hibeler/Detay`, `/Hibeler/Randevu`), lead
kutusu ve tüm ekranlar için iskelet/boş/hata durumları. Tasarımdan yalnız bülten (7e)
kaldı — abone modeli yok.

### Mevcut kodda bulunan para / veri hataları

Üçü de yeni özellik değil, canlıdaki kodda vardı ve canlı ölçümle bulundu:

| PR | Hata | Etki |
|---|---|---|
| #302 | Fatura kalemi miktar/birim fiyatı **1000× sapıyordu** — elle `name=` yazılan ondalık alanlarda `__Invariant` işaretçisi yoktu, `tr-TR` noktayı binlik saydı | **Müşteriye giden fatura**, sessiz. `2,5 × 1.234,56` → 3.703.680 yerine 3.703,68 |
| #302 | **"Masraf Yakala" hiçbir şey kaydetmiyordu** — gönderim mock'a gidiyordu, "kaydedildi" toast'ı çıkıyordu | Sahada girilen her masraf kayboluyordu |
| #303 | `FundingTranche.Deductions` / `BudgetRevision.Lines` hiç yüklenmiyordu (`DefaultWithDetailsFunc` kaydı yoktu) → **kesinti sınırı kuralı devre dışıydı**: 700.000'lik dilime 1.200.000 kesinti girilebiliyordu | Veri bütünlüğü (dilimler bu yayınla geliyor, canlıda henüz yok) |
| #304 | Aynı eksiklik `FxRevaluationSnapshot.Lines`'ta → kur değerleme detayı **sıfır satır + dolu toplam** basıyordu | Değerlemeyi sonradan açan kullanıcı |

🔑 #303/#304 dersi: ABP'de `includeDetails: true` **tek başına hiçbir şey yapmaz**;
`DefaultWithDetailsFunc` kaydı yoksa alt koleksiyon boş gelir ve ondan hesaplanan domain
kuralı sessizce devre dışı kalır. Yedi aggregate tarandı, ikisi düzeltildi, beşi zaten
açık `Include`/`WithDetails` kullanıyordu.

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
| #290 | Görev açıklaması kayıtlı olduğu hâlde boş görünüyordu (kalıcı önbellek geri yükleme penceresi); v1 kökü aynı pencerede çöküyordu | **Görev detayı** |
| #306 | Hibe doğrulama mesajlarında ham property adı yerine Türkçe alan adı (27 anahtar) | Hibe formları |
| #279 | Giriş sayfası service worker'da önbelleklenmiyor | **Mobil giriş** |
| #285 | Projeler mobil başlık bloğu 313px → 126px | **Mobil** |
| #286 | Sekmeler ve sürüklenebilir öğeler tek tıklamayla çalışıyor | Görev detayı · takvim · belgeler |
| #287 | Vite manifest'i publish paketine dâhil edildi | Island preload |
| #288 | Yükseltme bağlantısında yalnız http/https kabul ediliyor | Paketler |
| #281 | Kenar çubuğu "+" düğmesi proje oluşturma yetkisine bağlandı | Yetkisiz kullanıcılar |
| #282 · #283 | 4xx uçlar hata görevi açmıyor, kendi kanalına alındı | Sistem Sağlığı (host) |

### İç işler

| PR | Başlık |
|---|---|
| #280 · #297 · #300 · #301 | Sürüm notu / deploy belgesi / paketleme betiği / güvenli barındırma varsayılanı |
| #291 | `dev-up.ps1` veritabanı adımı aktif sağlayıcıya göre |
| #307 | Web test tabanında `HttpClient` zaman aşımı 10 dk (rastgele `TaskCanceledException`) |

---

## Doğrulama — bu paket için ölçülenler

| Kontrol | Sonuç |
|---|---|
| `dotnet build Apya.Platform.slnx` | **0 hata** |
| Domain.Tests | **314/314** |
| Application.Tests | **247/247** |
| EntityFrameworkCore.Tests | **249/249** |
| Web.Tests | **449/449** (48 sınıf; 12 öbek hâlinde ayrı süreçlerde, aşağıya bak) |
| Vitest (dynamic-assets) | **511/511** (61 dosya) |

> 🔴 **Web.Tests tek süreçte koşturulamıyor.** Her test kendi ABP host'unu kurduğu için
> testhost belleği 5 dakikada **9,7 GB**'a çıkıyor, makine takasa düşüyor ve takım saatlerce
> sürünüyor (bu hazırlıkta ölçüldü; `xUnit.ParallelizeTestCollections=false` ÇÖZMÜYOR).
> Çözüm: sınıfları ~35 testlik öbeklere bölüp her öbeği `dotnet test --filter` ile **ayrı
> süreçte** koşturmak — öbek başına tepe bellek 1–4,5 GB, toplam 9 dakika. Aynı sebeple
> `publish-release.ps1` **`-SkipTests`** ile koşturuldu; testler paketle aynı ağaçta ayrıca
> koşturuldu. `dotnet test` özet satırı bu makinede **Türkçe** ("Başarılı! - Başarısız: 0 …");
> dili `DOTNET_CLI_UI_LANGUAGE=en` ile İngilizceye zorlamak testhost'a da geçip Türkçe metin
> bekleyen 5 testi sahte düşürüyor — sayarken dili değil süzgeci değiştir.

> 🔑 **Worktree'de test koşturacaksan önce `abp install-libs`, ardından `dynamic-assets`
> içinde `npm ci`.** install-libs `yarn` koşup `yarn.lock`'u değiştirir ve
> `@testing-library/dom` peer bağımlılığını düşürür; `npm ci` de var olan `yarn.lock`'u
> `package-lock.json`'a göre yeniden yazar — sıra: install-libs → `npm ci` → `git checkout --
> yarn.lock`. signalr için de install-libs şart (yukarıda).

---

## Sürüm notları — `2026.09.02` (39 madde, 7 bölüm)

Başlık: *"Proje finansı tek ekranda, hibe süreci baştan sona, görevler ekip dışına açık"*

Canlı `63cb35c6`'nın en yeni notu `2026.08.27`; 08.31 · 09.01 · 09.02 için yazılan üç not
hiç yayınlanmadığı için **tek nota birleştirildi** (modal yalnız `All[0]`'ı gösterir,
ayrı kalsalardı alttakiler hiç duyurulmazdı). Bu turda #302 · #304 · #290'ın müşteriye
bakan maddeleri eklendi (5 yenilik + 4 düzeltme).

| Bölüm | Madde |
|---|---|
| Finans | 16 |
| Hibe: çağrılar ve uygunluk | 6 |
| Hibe: başvuru süreci | 7 |
| Görev paylaşımı | 3 |
| Mobil | 3 |
| Paket | 1 |
| Genel | 3 |

Rozet dağılımı: 23 Yenilik · 8 İyileştirme · 7 Düzeltme · 1 Güvenlik.

🔴 **Deploy başka güne kayarsa `version` + `date` birlikte güncellenmeli** — not henüz
yayınlanmadığı için sürüm kimliğine dokunmak serbest; yayınlandıktan sonra dokunma.

**Bilerek dışarıda bırakılanlar** — katalogun kendi kuralı: "Yenilikler" penceresinin ve
`/ReleaseNotes` sayfasının **izin kapısı yoktur**, host maddesi yazılırsa kiracı
erişemediği bir özelliği arar.

| Konu | Sebep |
|---|---|
| #299 / #305 host ekranları (parametreler, şablonlar, pipeline, detay, dönüştürme, bildirim şablonları, lead kutusu) | Yalnız host yöneticisi görür |
| #305 kamu yüzeyi (`/Hibeler`) | Oturum açmış müşterinin yapabildiklerini değiştirmiyor |
| #303 dilim kesintisi | Dilimler bu yayınla geliyor; müşteri "eski hâli" hiç görmedi |
| #306 doğrulama metinleri | Yeni ekranların içindeki düzeltme |
| #294 demo talebi | Giriş ekranı; oturumlu kullanıcıyı ilgilendirmez |
| #296 kiracı sızıntısı | Canlıda gerçekleşip gerçekleşmediği ölçülemedi |
| #281 · #282 · #283 · #287 · #288 · #291 · #307 | Host / iç mesele |
| E-posta bildirimi | Şablonlar hazır ama **SMTP yapılandırılmadı** — vaat edilmedi |

---

## 🔴 İzin ve veri tohumu — DbMigrator koşmazsa kiracıya ULAŞMAZ

Bu yayında iki yeni izin var, ikisi de **feature kapısının arkasında değil**:

| İzin | Yüzey | Telafi |
|---|---|---|
| `Tasks.ShareExternally` | kiracı | `TenantPackageManager.LateAddedPermissions` (tavan) + `TaskSharePermissionDataSeedContributor` (grant) |
| `DemoRequests.*` | **host** | `DemoRequestsPermissionDataSeedContributor` |

Hibe modülü (#299 ve #305) **yeni izin eklemedi** — mevcut `Grants.*` izinlerini kullanıyor.

Üç **veri** tohumlayıcısı (hepsi host seviyesi, sabit kimlikli, idempotent):

| Tohumlayıcı | Ne yazar | Koşmazsa |
|---|---|---|
| `ErasmusYouthCatalogDataSeedContributor` | 5 Erasmus+ programı | Katalogda Erasmus+ görünmez |
| `GrantStageTemplateDataSeedContributor` | 3 hazır aşama şablonu | Aşama şablonu ekranı boş açılır, programlar şablonsuz kalır |
| `GrantNotificationTemplateDataSeedContributor` | Yedi tetikleyicinin bildirim şablonları | Hibe bildirimleri hiç üretilmez (şablon yok → metin yok) |

✅ DbMigrator `Apya.Platform.Application`'a referans veriyor (#246) — o katmandaki
tohumlayıcılar da koşuyor. `dotnet ef database update` **yeter DEĞİL**: yalnız şema uygular.

---

## Deploy adımları — SIRAYLA

### 0. 🔴 Önce siteyi ayağa kaldır

Yukarıdaki "Adım 0": `web.config` → `OutOfProcess`, havuzu başlat, `/health/ready` 200.
Site ayağa kalkmadan deploy etme.

### 1. Veritabanı yedeği al

**Bu yayında zorunlu** — 21 migration şema değiştiriyor. Plesk → Veritabanları → Yedekle.

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

Bu turda **şema + izin tohumu + üç veri tohumu** için — hepsi bundan geçiyor.

1. `Apya-DbMigrator-<sha>.zip`'i site kökünün **DIŞINDA** bir klasöre aç (ör. `dbmigrator\`).
2. `migrate.bat` içindeki üç değeri doldur (bağlantı dizesi, client secret).
3. Plesk → **Zamanlanmış Görevler** → tek seferlik görev → `migrate.bat` (tırnaksız tam yol).
4. 🔑 Başarıyı **çıkış kodundan değil log'dan** doğrula: `Logs\logs.txt` içinde
   **`Successfully completed all database migrations.`** satırını ara. Öncesinde
   **`Executing data seeders...`** de görünmeli — izin ve veri tohumu orada koşar.
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
| `/Hibeler` | 404 | **200** (anonim kamu yüzeyi) |
| `/Account/DemoRequest` | 404 | **200** (anonim) |
| `/libs/signalr/signalr.min.js` | 302 / 404 | **200** (statik) |

### 3. Şema uygulandı mı

**/Tasks**, **/Board** ve **/Finance** açılmalı. 500 dönüyorsa DbMigrator adımı atlanmış
demektir (EF entity'nin TÜM kolonlarını SELECT eder; eksik kolon sorguyu toptan düşürür).

### 4. 🔴 İzin ve tohum gerçekten koştu mu — KİRACI hesabıyla bak

Host hesabıyla bakmak **yanıltır**. Bir kiracı kullanıcısıyla gir:

| Kontrol | Beklenen |
|---|---|
| Görev detayı → **"Dış Paylaşım"** sekmesi | görünmeli (`Tasks.ShareExternally` grant'ı geçmiş) |
| **/Grants/Catalog** → Erasmus+ programları | listede 5 program |
| Hibe programı detayı → **aşama şablonu** | şablon listesi boş OLMAMALI |
| Hibeler → bir çağrıya **başvur** → sihirbaz | sayfa açılmalı; üstte "canlı" işareti (SignalR bağlı) |

Host hesabıyla ayrıca: `/Grants/NotificationTemplates` → şablon listesi **dolu** olmalı
(bildirim tohumu koştu).

Biri eksikse DbMigrator ya hiç koşmadı ya da seed adımı düştü.

### 5. Elle bakılacaklar (dışarıdan ölçülemez)

- Giriş yapılabiliyor mu (`DataProtection-Keys` yerinde mi)
- Bir görevin dosya eki açılıyor mu (`App_Data\uploads` yerinde mi)
- **"Yenilikler" penceresi** açılıyor mu — turu tamamlamış kullanıcıda 39 maddelik
  `2026.09.02` notu çıkmalı
- **Finans → Bütçe kalemleri → "Bağlamı kur"** sihirbazı açılıyor mu
- **Giderler → "Masraf Yakala"** ile girilen masraf Giderler listesinde **görünüyor mu**
  (#302 düzeltmesi — eskiden "kaydedildi" deyip kaydetmiyordu)
- Bir gider kaydını düzenleyip kaydet → **görev bağı korunuyor mu** (#298 düzeltmesi)
- Fatura kalemine ondalıklı miktar gir → tutar **bin kat büyümüyor mu** (#302 düzeltmesi)
- Firma profilinde boş bırakılan sayısal alanda hata mesajı **Türkçe alan adı** basıyor mu

🔴 **Dürüst sınırlar:** #298/#302 ve #299/#305 test host'u, izole harness ve yerel
tarayıcı QA'sinden geçti; **canlı, kiracı oturumlu uçtan uca QA yapılmadı.** #299'un izin
kapıları test host'unda `AddAlwaysAllowAuthorization` ile açık koştu — kiracı kontrolü şart.
Web test takımı bu makinede yük altında rastgele zaman aşımı veriyor (#307 ile sınır 10 dk).

---

## Geri alma

Şema **eklemeli** olduğu için kod geri alınsa bile yeni tablo/kolonlar zararsız durur —
eski kod onları hiç sormaz. Geri alma pratikte **yalnız dosya işidir**: bir önceki
`Apya-Yayin-63cb35c6.zip` paketini aynı yordamla geri açmak yeterli.

⚠️ Gerçekten şemayı da geri almak istersen 21 migration'ın `Down` adımları 31 tabloyu ve
65 kolonu düşürür — **paylaşım linkleri, misafir yorumları, bütçe kalemleri, fonlama
dilimleri, kesintiler, revizyonlar, hibe parametreleri, aşama şablonları, başvuru
sihirbazı verileri, evraklar ve sürümleri, kurum kararları, itirazlar, raporlar, bildirim
şablonları ve ön değerlendirme talepleri kalıcı olarak silinir.** Bunu yapma; dosya geri
alması yeterli.

⚠️ İkinci kalıcı iz: tohumun kiracı admin rollerine yazdığı `Tasks.ShareExternally`
grant'ları geri dönmez. Zararsızdır — eski kod o izni hiç sormaz.

---

## Bu yayının DIŞINDA kalan, hâlâ bekleyen işler

| İş | Nerede | Neden bekliyor |
|---|---|---|
| **SMTP** | `/SettingManagement` → E-posta | Girilmeden ne şifre sıfırlama ne hibe bildirimi e-postası **gider**. Varsayılan gönderen `noreply@abp.io` değiştirilmeli |
| **Plesk app pool** (Idle=0, AlwaysRunning) | Plesk | Yalnız hız değil **işlevsel**: `SubscriptionExpiryWorker` saatlik, hibe hatırlatmaları (7/3/1 ve 30/14/3 gün) günlük koşar; havuz uyursa hiçbiri işlenmez |
| **`hostingModel="InProcess"`** | `web.config` + csproj | 🔴 Bu yayında çöküşün muhtemel sebebi; paket `OutOfProcess` çıkıyor. Açmak istersen app pool ayarından SONRA, **tek başına** dene; açılmazsa satırı geri al (yeniden publish gerekmez). Kalıcı yapacaksan csproj'daki `AspNetCoreHostingModel` da değişmeli — yoksa sonraki publish geri alır |
| **`<applicationInitialization>`** | `web.config` | En son, ve yalnız IIS "Application Initialization" bileşeni kuruluysa (yoksa 500.19). **Üçü birden açılmaz** |
| Hibe bülteni (7e) | — | Abone modeli yok; düşük ısılı lead "Takipte" olarak kapanıyor |
| Yükseltme kanalı | `/PackageManagement` | Satış e-postası/telefon/fiyat sayfası üçü de boşsa "Paketim" ekranında yükseltme düğmesi basılmaz |
| Host admin kiracı projesinde finans | `/Finance` | Bilinen boşluk: özet KPI görünür ama gider/gelir listesi boş gelir (`ExpenseAppService` MT filtresini kapatmıyor). Kiracı kullanıcısını etkilemez |
