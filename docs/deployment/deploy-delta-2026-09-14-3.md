# Deploy delta — 2026-09-14 (3) (`d5e84c04` → `337eaf55`)

Canlıda koşan kod **`d5e84c04`** (= main `a9012b56`'nın `src/` ağacı; 2026-09-14 akşam paketi,
23:18'de beş dosyada blob'la ölçüldü — bkz. `deploy-delta-2026-09-14.md` başındaki not).
Bu paket onun üzerine gelir; delta **iki commit**tir.

Paket: `Apya-Yayin-337eaf55.zip` + `Apya-DbMigrator-337eaf55.zip`
(`Masaüstü\Apya-Yayin-2026-09-14-3\`).

> Paket `claude/gorsel-sorular-fikir-formu-8cc65e` dalındaki **`337eaf55`** commit'inden üretildi:
> main `a9012b56` + `ca4bfaed` (ilgi formunda dokuz soru + migration + jQuery 4 `$.trim` düzeltmesi)
> + `337eaf55` (sürüm notu maddesi). Dal squash ile girdiğinde commit kimliği değişir; main o ana kadar
> ilerlemediyse `src/` + `test/` ağacı birebir aynıdır, paket yeniden üretilmez.

## Neden acil

Canlıdaki `wwwroot/libs/jquery/jquery.js` **4.0.0** (`abp install-libs` böyle kopyalıyor; canlıdan
ölçüldü) ve jQuery 4 `$.trim`'i kaldırdı. `d5e84c04` ile canlıya inen `Pages/Grants/Detail.js`
("Evet, ilgileniyorum") ve `Pages/Grants/Tenant.js` (takip edilen çağrıya not) gönderimde `$.trim`
çağırıyor → tarayıcıda `TypeError`, düğme **sessizce hiçbir şey yapmıyor**. Canlı `Detail.js`'te iki
`$.trim(` var (23:18'de indirilip sayıldı). Bu paket iki dosyayı da `String.prototype.trim`'e çeker.

## Ne iniyor

| Alan | Değişiklik |
|---|---|
| Hibe (kiracı) | "Evet, ilgileniyorum" formu **APYA Proje Fikri Bilgi Formu'nun dokuz sorusunu** soruyor: proje fikri ve problem/ihtiyaç zorunlu; hedef kitle, faaliyetler, süre ve iş birlikleri, destek ihtiyacı, önceki deneyim, ekip yapısı, paydaşlar isteğe bağlı. Her sorunun altında formdaki örnek ipucu; diyalog 600 px'e genişledi ve bütünüyle kaydırılıyor. Bütçe, hedeflenen başlangıç ve konsorsiyum ortağı soruları yerinde. Boş kalan zorunlu soru kırmızıya döner, odak oraya gider. 2. soru sunucuda da zorunlu (`[Required]`), REST'ten atlanamaz. |
| Hibe (host) | İlgi inceleme ekranının Proje fikri kartı, 2-9. soruların cevaplarını soru başlığıyla listeler; boş bırakılan soru "Yanıtlanmamış." Eski talepler (bu paketten önce bırakılanlar) sekiz soruda boş görünür. |
| Düzeltme | `$.trim` → `(...val() \|\| '').trim()` — `Detail.js` (4 yer) ve `Tenant.js` (1 yer). `wwwroot/js` demetlerinde jQuery 4'ün kaldırdığı başka API (`isArray/isFunction/type/now/proxy/parseJSON`) kullanımı yok (tarandı). |
| Sürüm notu | `2026.09.14` girişine bir İyileştirme maddesi eklendi ("İlgi bildirirken proje fikrinizi dokuz soruyla anlatıyorsunuz") → giriş **12** madde. Mevcut madde başlıklarına dokunulmadı; onay anahtarları korunur. |

## Migration — 1 adet, veri düşürmüyor

```
20260914195529_GrantInterestIdeaDetails   ← YENİ (bu dal)
```

`Up()` iki sağlayıcıda da ölçüldü: yalnız sekiz `AddColumn`, hepsi nullable —
`AppGrantInterests` + `ProblemStatement`, `TargetAudience`, `PlannedActivities`,
`DurationAndPartners`, `SupportNeeds`, `PriorExperience`, `TeamStructure`, `Stakeholders`
(nvarchar(1000) NULL). `DropColumn`, `AlterColumn`, `DropTable` yok. Mevcut talepler boş kolonla kalır.

🔴 `d5e84c04`'ün 12 migration'ı sunucuda gerçekten koştu mu bilinmiyor (dışarıdan ölçülemez). Koşmadıysa
DbMigrator bu paketle **13** migration'ı birden uygular; `Logs\logs.txt`'teki
"Successfully completed all database migrations." satırı ve sürenin birkaç saniyeden uzun olması tek kanıt.

## Tohumlama — DbMigrator ŞART

- Yeni izin yok, yeni bildirim şablonu yok, yeni tohum yok. (Önceki paketin dört hibe şablonu
  `InterestReceived`/`CallClosed`/`MeetingProposed`/`MeetingAnswered` DbMigrator koşmadıysa hâlâ eksiktir —
  aynı koşuda gelir.)
- 🔴 Sürüm notu maddesi **varsayılan olarak KAPALI**: `/Admin/ReleaseNotes` → `2026.09.14` altında
  "İlgi bildirirken proje fikrinizi dokuz soruyla anlatıyorsunuz" onaylanmalı. Önceki paketin 43 maddesi
  onaylanmadıysa toplam **44**.

## Deploy adımları

1. Yedek al (DB + site kökü).
2. Korunacak dosyaları FileZilla filtresine ekle — `appsettings.secrets.json`, `openiddict.pfx`,
   `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
3. Web paketini site köküne aç (`App_offline.htm` ile havuzu düşürmek DLL kilidini önler).
4. `dbmigrator` klasörünü yükle, **sunucudaki `appsettings.secrets.json`'ı içine kopyala**; anahtar
   **`ConnectionStrings:SqlServer`** olmalı (başka adla araç sessizce localhost'a gider).
5. Plesk › Zamanlanmış Görevler › `migrate.bat` → "Şimdi Çalıştır".
6. `dbmigrator\Logs\logs.txt` → `Successfully completed all database migrations.`
7. Zamanlanmış görevi ve `dbmigrator` klasörünü **SİL**.
8. App pool geri dönüşümü.
9. `/Admin/ReleaseNotes` → yeni maddeyi (ve bekleyenleri) onayla.

## Deploy sonrası QA

- `/health/ready` **200**.
- **İlgi bildir (kiracı):** çağrı detayı → İlgileniyorum → Devam et → dokuz soru görünüyor mu; hepsini boş
  gönder → ilk iki soru kırmızı, odak ilk soruda; yalnız fikri doldur → 2. soru kırmızı; ikisini doldurup
  **Evet, ilgileniyorum** → "İlginiz iletildi" şeridi (`GrantInterestIdeaDetails` kolonlarına ilk yazım;
  bu düğme `d5e84c04`'te çalışmıyordu). Telefonda form kaydırılabiliyor mu.
- **Takip notu (kiracı):** bir çağrıyı takibe al → not yaz → kaydet → sayfayı yenile, not duruyor mu
  (`d5e84c04`'te kaydet düğmesi çalışmıyordu).
- **İlgi inceleme (host):** yeni talebi aç → Proje fikri kartında sekiz cevap soru soru, boş bırakılanlar
  "Yanıtlanmamış."; eski bir talepte sekizi de "Yanıtlanmamış."
- Sürüm notu penceresi: onaydan **önce** kullanıcıda çıkmamalı, onaydan **sonra** çıkmalı.
- (Önceki paketin QA listesi hâlâ geçerli: `deploy-delta-2026-09-14.md` → "Deploy sonrası QA".)

## Paket doğrulaması

2026-09-14 23:2x, **ZIP'lerin kendisinden** ölçüldü (publish klasöründen değil; `tar.exe -t` / `-xO`):

| Denetim | Sonuç |
|---|---|
| ZIP'ler | `Apya-Yayin-337eaf55.zip` 115,6 MB · **4189 girdi** · `Apya-DbMigrator-337eaf55.zip` 53,4 MB · **454 girdi** · ikisinde de ters slash **0** (önceki paketle aynı yapı) |
| Self-contained | İki ZIP'in kökünde `System.Private.CoreLib.dll`, `coreclr.dll`, `hostfxr.dll` var |
| Kök dosyalar | Web: `web.config`, `Apya.Platform.Web.exe` · DbMigrator: `Apya.Platform.DbMigrator.exe`, `migrate.bat`, `appsettings.json` |
| `web.config` | Yorumlar ayıklanınca tek `<aspNetCore>`: `processPath=".\Apya.Platform.Web.exe"` · `hostingModel="OutOfProcess"`. Betiğin "InProcess" uyarısı yorum satırına takılan bilinen yanlış alarm. |
| Sırlar | `appsettings.secrets.json`, `*.pfx`, `App_Data/`, `Logs/` iki pakette de **yok** |
| İstemci | `wwwroot/libs/signalr/signalr.min.js` ve `wwwroot/js/.vite/manifest.json` pakette; `wwwroot/libs/jquery/jquery.js` **4.0.0** (canlıyla aynı — kod buna göre düzeltildi) |
| `Pages/Grants/Detail.js` | Pakette `$.trim(` **yok**; dokuz sorunun toplayıcısı (`answer('InterestStakeholders')`) **var** |
| Commit | `Apya.Platform.Web.dll` içinde `+337eaf55…` gömülü |
| Migration | `20260914195529_GrantInterestIdeaDetails` hem web hem DbMigrator paketindeki `Apya.Platform.EntityFrameworkCore.SqlServer.dll`'de |
| Sürüm notu | `Apya.Platform.Application.Contracts.dll` (UTF-16): "İlgi bildirirken proje fikrinizi dokuz soruyla anlatıyorsunuz" var |
| Yerelleştirme | `Apya.Platform.Domain.Shared.dll` gömülü JSON'da `Grants:Interest:Form:Stakeholders:Hint`, `DisplayName:DurationAndPartners`, `Grants:InterestReview:Answer:Empty` var |

## Test

2026-09-14 gece, `337eaf55` üzerinde. .NET takımları sırayla; Web.Tests yalnız değişen sınıflar:

| Takım | Sonuç |
|---|---|
| `Apya.Platform.Domain.Tests` (tam) | 340 / 340 ✅ (+1 yeni: kırpma, boş → null, 1000 üst sınır) |
| `Apya.Platform.Application.Tests` (tam) | 269 / 269 ✅ |
| `Apya.Platform.EntityFrameworkCore.Tests` (tam) | 377 / 377 ✅ (+1 yeni: 2. soru zorunlu, cevaplar inceleme ekranına gelir, boş soru null) |
| `Apya.Platform.Web.Tests` (`GrantInterestsPage_Tests` + `ValidationLocalization_Tests` + `ReleaseNote*`) | 28 / 28 ✅ (+1 yeni: dokuz textarea, ikisi `required`, `IdeaAnswers`) |
| Vitest | koşulmadı — React demeti değişmedi (`wwwroot/js` farkı yok) |

Web.Tests'in tamamı bu turda yeniden koşulmadı; `d5e84c04` için 550/550 koşusu geçerli sayıldı ve
değiştirilen metinler (`Grants:Interest:Form:Idea`, `:Lead`) hiçbir testte geçmiyor (grep 0). Yeni DTO alanları
`DisplayName:*` anahtarlarıyla `ValidationLocalization_Tests` kapısından geçti.

**Tarayıcı doğrulaması:** oturum gerektirdiği için test host dökümü + sahte API düzeneğiyle
(libs'teki **gerçek jQuery 4.0.0** yüklü) tıklanarak: boş gönderim iki zorunlu soruyu işaretledi,
yalnız fikir doluyken 2. soru işaretli kaldı, tam gönderimde giden gövde dokuz cevabı taşıdı
(boşluktan ibaret cevap `null`, kırpılmış problem), "İlginiz iletildi" şeridi açıldı; inceleme ekranında
sekiz cevap doğru başlıkla, ikisi "Yanıtlanmamış." `$.trim` hatası da bu düzenekte yakalandı — düzeneğe
CDN jQuery 3 konsaydı görünmezdi.

## Bilinen sınır

- Gerçek oturumlu uygulamada denenmedi (düzenek); deploy sonrası QA'da ilk kez görülecek.
- `d5e84c04`'ün sunucu işleri (DbMigrator log'u, 43 madde onayı, `dbmigrator` klasörünün silinmesi)
  dışarıdan doğrulanamadı — bu paketin adımlarıyla birlikte yapılmalı.
- Asgari yama alternatifi: yalnız `$.trim` düzeltmesi için `Pages/Grants/Detail.js` + `Pages/Grants/Tenant.js`
  (fiziksel dosyalar, DLL değişmez) canlıya kopyalanabilir; ama dokuz soru DLL + migration istediği için
  tam paket önerilir.
