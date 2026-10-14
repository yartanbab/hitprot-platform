# Deploy delta — 2026-10-14 (`f7919944` → `208a35a0`)

Canlıda koşan kod 2026‑10‑14'te yeniden ölçüldü: hâlâ **`f7919944`**. Ne `c967be48` (09‑25) ne de
`01bd9902` (10‑02) paketi yüklenmiş.

| Canlıdaki dosya | Canlı blob | `f7919944` | bu paket (`208a35a0`) |
|---|---|---|---|
| `Pages/TenantManagement/Tenants/Index.js` | `9b4d6eba` | **`9b4d6eba`** | `ba93c6d4` |
| `Pages/Grants/Detail.js` | `6035efaa` | **`6035efaa`** | `f8a065c7` |
| `css/apya-shell.css` | `ce7baefa` | **`ce7baefa`** | `15ae7aa8` |
| `Pages/Invoices/index.js` | `1b877d09` | **`1b877d09`** | `59941ed3` |
| `Pages/Grants/Ideas.js` | 302 (yok) | yok | `01ec6d50` |
| `js/apya-load-state.js` | 302 (yok) | yok | `e4402d0e` |

Bu paket `01bd9902` paketinin **yerine geçer** ve onun taşıdığı her şeyi taşır (254 commit). Üç belge
birlikte geçerlidir:

1. **[`deploy-delta-2026-09-21.md`](deploy-delta-2026-09-21.md)** — `f7919944` → `c967be48`. Oradaki
   **"Deploy ÖNCESİ yapılacaklar" listesinin tamamı hâlâ geçerli** (kasa kur ölçümü, fatura yetkisi,
   tarihi geçmiş açık çağrı sayımı, korunacak dosyalar).
2. **[`deploy-delta-2026-10-02.md`](deploy-delta-2026-10-02.md)** — `c967be48` → `01bd9902`
   ("Ekip Yönetimi" izni rol kontrolü, AI sağlayıcı adı sayımı).
3. **Bu belge** — `01bd9902` → `208a35a0` (171 commit, #490–#680).

> 🔴 **`01bd9902` ve `c967be48` paketleri ARTIK ESKİ — onları değil, bu paketi yükleyin.**

Paket: `Apya-Yayin-208a35a0.zip` (116.012.353 bayt, 4.502 girdi) ve `Apya-DbMigrator-208a35a0.zip`
(57.122.465 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-10-14\`. Ayrıntı klasördeki `OKU-BENI.txt`.

---

## 🔴 DbMigrator ŞART — 12 yeni şema değişikliği + tek seferlik telafiler

Canlı `f7919944`'ten beri **15 migration** aldı (ikisi de çift sağlayıcı: PostgreSQL + SQL Server);
ilk üçü 09‑21 belgesinde. `01bd9902`'den sonra gelen 12'si:

| Migration | Ne yapar |
|---|---|
| `Add_GrantStageTemplateStep_Stage` | Hibe aşama şablonu adımına aşama |
| `Add_ProjectBudget_SourceGrantIds` | Proje bütçesinde hibe kaynak kimlikleri (dilim ↔ gelir bağı) |
| `Precision_ProjectCode_DigestFlag` | 🔴 Proje kodu **tekil indeks**, ayrı günlük özet tercihi, tutar hassasiyeti |
| `Add_TenantId_To_ChildEntities` | Görev yorumu/eki, fatura kalemi, revizyon satırı, takvim hesabına kiracı sütunu — **mevcut satırlar üst kayıttan doldurulur** |
| `Add_FeedbackUploads` | Geri bildirim eki sahiplik kaydı |
| `Add_WorkStepId_To_Tasks` | Görev ↔ iş adımı |
| `Add_DocumentIncomeLinks` | Gelire belge bağı |
| `Add_BudgetLineId_To_Invoices` | Faturaya bütçe kalemi |
| `Add_ProjectIndicators` | Proje göstergeleri ve ölçümleri |
| `Add_GrantApplicationTargets` | Hibe başvurusu hedefleri |
| `Add_NotificationDevices` | Tarayıcı bildirimi cihaz kaydı, Push tercihi |
| `Add_MacroUsageDaily` | Makro Ekran kullanım sayacı |

DbMigrator ayrıca **bir kez** şu telafileri koşar (kalıcı işaretleri `Backfills.*` ayarlarındadır):

- **Hibe başvurusu yönetme izni** — hibeleri görebilen **her kiracı rolüne** `Grants.ManageApplications`
  verilir. 🔴 **DbMigrator koşmazsa hiçbir firma kullanıcısı ilgi bildiremez, başvuru gönderemez**
  (yazma uçları artık bu izni istiyor, #632).
- **Hazır roller** — her kiracıya Proje Sorumlusu, Muhasebe, Gözlemci rolleri (aynı adda rol varsa
  dokunulmaz).
- **Gösterge izinleri** — projeyi görebilen role "Göstergeleri Görme", düzenleyebilen role
  "Göstergeleri Yönetme"; host rolleri dahil.
- Veri onarımları: hibe başvuru adımı hizalama, dilim ↔ gelir sarkık bağ temizliği, hibe kaynak
  bağı geri doldurma; ab‑ilan hibe duyuruları host kataloğuna tohumlanır.

Başarıyı çıkış kodundan değil log'daki **`"Successfully completed all database migrations."`**
satırından doğrulayın (`dbmigrator\Logs\logs.txt`).

> Paket yerelde sahte bağlantıyla sınandı: ZIP'ten açılan DbMigrator "Migrating database
> schema..." satırına ulaştı (eksik DLL yok). Gerçek veritabanına uygulanmadı.
> 🔴 **PostgreSQL migration'ları hiçbir veritabanında çalıştırılmadı**; canlı SQL Server.

---

## 🔴 Deploy ÖNCESİ yapılacaklar (bu belgenin ekleri)

### A. Veritabanı yedeği
12 migration, biri mevcut satırları güncelliyor (`Add_TenantId_To_ChildEntities`). Yedek alın.

### B. Yinelenen proje kodu sayımı — atlanamaz
`Precision_ProjectCode_DigestFlag` proje kodu için tekil indeks kurar; yinelenen kod varsa
**migration düşer** ve sonraki migration'lar da uygulanmaz:

```sql
SELECT TenantId, Code, COUNT(*) FROM AppProjects WHERE IsDeleted = 0
GROUP BY TenantId, Code HAVING COUNT(*) > 1;
```

Sonuç boş değilse önce kodları ayırın (proje düzenleme ekranından), sonra DbMigrator.

### C. Host rolleri
Hibe yazma işlemleri host'ta `Grants.Edit` istiyor. Host "admin" rolünde var; host'ta hibe işi yapan
**özel bir rol** kullanılıyorsa izni elle verin. Rol yerine doğrudan kullanıcıya verilmiş hibe görme
izni telafinin kapsamı dışındadır.

### D. Sürüm notu yayın onayı
`/Admin/ReleaseNotes` — onaysız madde kimseye gitmez. Bu pakette duyurulmamış sürümler:
09.15, 09.17, 09.21, 09.27 (önceki belgeler) + **10.04, 10.05, 10.06, 10.14**. 10.14'teki "Makro Ekran"
maddesi süren bir işi anlatır; isterseniz onu sonraya bırakın.

### E. Korunacak dosyalar (değişmedi)
`openiddict.pfx` · `appsettings.secrets.json` · `App_Data\uploads\` · `App_Data\DataProtection-Keys\`
— deploy'dan önce ayrı klasöre **kopyalayın**, sonra geri koyun. Paket bunları içermez (doğrulandı).
`wwwroot\uploads` ayrı bir konudur: oturumsuz erişilebilen eski yükleme klasörü, düzeltmesi bu pakette
(#515); klasör sunucuda elle silinecek. 🔴 `App_Data\uploads` ile karıştırmayın — o korunur.

---

## Bilerek KAPALI gelenler

- **Tarayıcı (web push) bildirimi** — kod pakette ama kanal **kapalı**: `WebPush:PublicKey` boş olduğu
  sürece betik service worker kaydetmez, abonelik açmaz. Açmak için VAPID anahtar çifti üretilir;
  `WebPush:PublicKey` ve `WebPush:Subject` appsettings'e, **`WebPush:PrivateKey` YALNIZ
  `appsettings.secrets.json`'a ya da ortam değişkenine** (`WebPush__PrivateKey`). Açmadan önce elle QA
  şart (çıkış yapınca abonelikten çıkma, kapalı tarayıcıda bildirim, iOS ana ekran). Sürüm notunda
  duyurulmadı.
- `web.config`: `hostingModel="OutOfProcess"`, `applicationInitialization` kapalı (XML ile doğrulandı;
  betiğin "InProcess" uyarısı yorum satırına takılan yanlış alarm).

## Menü değişikliği
Kasa & Banka, Kurlar ve Raporlar > Proje Bütçesi sol menüden kalktı; Finans Merkezi tek giriş. Sayfalar
adresle açılır. Kayıtlı menü düzeninde bu öğeler varsa sessizce elenir.

## Pakette OLMAYANLAR
- Açık PR'lar: #678 host makro yönetimi (çift migration), #624 şema paketi, #623 LIF‑08, #622 FUX‑03.
- Uzak dal `claude/laughing-knuth-2vmskp`: dashboard SignalR 405 düzeltmesi — main'e hiç girmedi.

---

## Deploy sonrası doğrulama

1. `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu: canlı blob'lar `208a35a0` ile birebir olmalı (`git hash-object`).
3. `dbmigrator\Logs\logs.txt` sonunda "Successfully completed all database migrations."
4. Bir firma kullanıcısıyla: hibe çağrısına ilgi bildirebiliyor mu (telafi koştu mu).
5. Bir projede Göstergeler sekmesi görünüyor mu; Makro Ekran açılıyor mu.

## Doğrulama (paket üretimi)

- Testler: Domain 474 · Application 334 · EF 842 (`f6a795c4`) · Web 1198 / 160 sınıf (`f304a98a`),
  düşen yok. Sonrasında gelenler: #674 (makro kullanım sayacı, kendi oturumunda test edildi), #675
  (belge), #679 (82 ilgili test), #680 (sürüm notu testleri 14/14). Bu ucun tamamında tam paket
  koşulmadı.
- ZIP: ters eğik çizgi 0, `web.config` / `migrate.bat` kökte, `unzip -t` hatasız; iki pakette de
  runtime (`System.Private.CoreLib.dll`, `hostfxr.dll`, `coreclr.dll`); `pfx` ve secrets yok; 15
  migration × 2 sağlayıcı × 2 pakette; `2026.10.14` sürüm notu `Application.Contracts.dll`'de;
  `+208a35a0` damgası Web, Domain ve DbMigrator DLL'lerinde; Vite demetleri kaynakla güncel.
