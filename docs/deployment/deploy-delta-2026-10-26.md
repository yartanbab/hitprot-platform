# Deploy delta — 2026-10-26 (`32d46d31` → `549cd630`)

Canlı 2026‑10‑26'da ölçüldü: **`32d46d31`** (24 Ekim paketi). Ayırt edici dört dosya canlıda o sürümle
birebir: `Pages/Grants/Detail.js` `e5e32d99`, `Today.js` `853c3a57`, `Catalog.js` `4d0eb2bd`,
`Tenant.js` `bdea441e`. Ölçüm sırasında (01:48–01:51) site ~3 dk IIS 503 "Service Unavailable" verdi ve
kendiliğinden döndü (ilk istek 19 sn = soğuk başlangıç): uygulama havuzu geri dönüşümü / barındırıcı
bakımı; paketle ilgisi yok.

Paket: `Apya-Yayin-549cd630.zip` (116.547.073 bayt, 4.559 girdi) ve `Apya-DbMigrator-549cd630.zip`
(57.500.244 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-10-26\`. Sıra klasördeki `OKU-BENI.txt`'te.
Önceki belgeler (`deploy-delta-2026-10-23.md` ve öncesi) korunacak dosyalar ve Plesk tarifleri için
geçerli.

| Dosya | `32d46d31` (canlı) | bu paket (`549cd630`) |
|---|---|---|
| `Pages/Grants/Detail.js` | `e5e32d99` | `6b506771` |
| `Pages/Grants/Today.js` | `853c3a57` | `85ea602c` |
| `Pages/Grants/Catalog.js` | `4d0eb2bd` | `568557a9` |
| `Pages/Grants/Tenant.js` | `bdea441e` | `a6717aab` |
| `js/task-detail.js` | `5517efeb` | `5517efeb` (değişmedi) |

🔑 Canlı dosyayı ölçerken `tr -d '\r' < dosya | git hash-object --stdin` — paket CRLF taşır.

---

## 🔴 Şema değişikliği — DbMigrator ŞART

Tek migration çifti: **`20261025214126_AddGrantCurrency`** (SQL Server) / `20261025214007_AddGrantCurrency`
(PostgreSQL). `AppGrants.Currency nvarchar(3) NOT NULL DEFAULT 'TRY'` — var olan kayıtlar TRY olur.
Canlı DB 24 Ekim'de `20261014100908_Add_MacroSettings`'teydi (90 migration).

DbMigrator atlanırsa hibe ekranları `Invalid column name 'Currency'` ile 500 verir (EF entity'nin tüm
kolonlarını seçer).

Ölçü `kurulum-dogrulama.txt`:
- 5. bölüm: **"Bu paketin migrationlari uygulanmis : 1 / 1"**, son migration `20261025214126_AddGrantCurrency`.
- 6. bölüm: toplamlar 24 Ekim sayımıyla aynı (görev 46, proje 5, kullanıcı 32, kiracı 19 …).
- 7. bölüm (yeni): para birimi sütunu VAR · döviz tutarlı program ~48 · çağrı duyurusu tabanı EVET ·
  duyurulmamış açık katalog çağrısı **0**.

### DbMigrator'ın bu pakette yaptığı veri işleri
1. **Katalog tohumu** (`GrantAnnouncementCatalogDataSeedContributor`): 64 yeni çağrı; var olan programlarda
   **yalnız boş alanlar** dolar (amaç, öncelikler, başvuru sahipleri, tutar/oran/süre, ön ödeme/teminat,
   harcama kalemleri, belge listesi, para birimi). Host'un elle girdiği değer ezilmez. Boş tavana döviz
   tutarı birimiyle birlikte gelir.
2. **Çağrı duyurusu tabanı** (`GrantCallAnnouncer.MarkBaselineOnceAsync`, #808): o an açık bütün host
   çağrıları duyurulmadan işaretlenir ve sabit taban işareti yazılır. **Bir kez** çalışır. Kullanıcı kararı
   (2026‑10‑26): ilk yayında ~150 çağrının firmalara saatte 20'şer duyurulması istenmedi.

---

## Bu pakette yeni (#804–#809)

| PR | Ne |
|---|---|
| #804 | Host "Hesabına Gir": kiracıda `admin` adlı kullanıcı yoksa yönetici rolündeki kullanıcıyla girer (host-only) |
| #805 | Açık ama duyurulmamış çağrılar saatlik taramayla uygun firmalara duyurulur (7 gün penceresi, turda ≤20) |
| #806 | Hibe kataloğu zenginleştirmesi: 165 programın amaç/öncelik/başvuru sahibi bilgisi, çoğunda oran/süre/kalem/belge; 64 yeni açık çağrı; tohum toplu yazım |
| #807 | Programın para birimi (TRY/EUR/USD/GBP) — **şema**; döviz tavanı TL ile kıyaslanmaz; 48 yabancı fon (36 EUR, 12 USD); zorluk seviyesi 5'i aşmaz |
| #808 | Çağrı duyurusu ilk yayın tabanı (yukarıda) |
| #809 | Sürüm notu **2026.10.26** (4 müşteri maddesi) |

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir.
3. `kurulum-dogrulama.txt`: 1/1, 7. bölüm değerleri, toplamlar.
4. `dbmigrator` klasörünü ve zamanlanmış görevleri silin.
5. `/Admin/ReleaseNotes`: **2026.10.26** onayı (kataloğa yazmak yayınlamak değildir).
6. 🔴 Elle düzeltme — tohum dolu alanı ezmediği için canlıdaki şu üç programın resmî çağrı adresi eski
   ve kırık kalır; hibe parametre ekranından değiştirin:
   - DAKA 2026 Fizibilite Desteği → `https://www.daka.org.tr/destekler/program/2026-fizibilite-destegi-fzd-programi`
   - DAKA 2026 Teknik Destek → `https://www.daka.org.tr/destekler/program/2026-teknik-destek-td-programi`
   - Trakya KA Tarım ve Kırsal Kalkınma TD‑02 → `https://www.trakyaka.org.tr/tr/120151/2026-Yili-Tarim-ve-Kirsal-Kalkinma-Teknik-Destek-Programi-02-Ilani`
7. Önceki turdan kalanlar (hâlâ açıksa): sunucuda `apya.pargetto.com\wwwroot\uploads\` silinmesi
   (**`App_Data\uploads` DEĞİL**), 09.15 … 10.22 sürüm notu onayları.

## Pakette OLMAYANLAR
- Açık PR #689 (Wildlife Acoustics son tarihi) — #806 ile aynı tohum dosyasına dokunuyor, artık çakışmalı.

## Bilinen ve kabul edilmiş uyarı
Scriban 6.6.0 ve `System.Security.Cryptography.*` 9.0.18 NuGet uyarıları — 10‑20 belgesindeki gerekçe aynen
geçerli. `publish-release.ps1`'in "hostingModel=InProcess" uyarısı yanlış alarm (yorum satırını eşliyor);
XML ile ölçülen değer `OutOfProcess`.

## Doğrulama (paket üretimi)
- Testler `549cd630` üzerinde (2026‑10‑26): Domain 517/517 · Application 359/359 · EF 935/935 ·
  Web 1329/1329 · ön yüz (vitest) 174/174 dosya, 2.008 test.
  🔴 Öbekleyici iç içe sınıfları (`Dış_Tests+Render`) ve bir dosyadaki ikinci sınıfı kaçırıyordu: ilk
  özet 1.304 gösterdi; `--list-tests` ile karşılaştırılıp eksik 9 sınıf / 25 test ayrıca koşuldu (25/25).
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte (girdi biçimi canlıya
  inen `32d46d31` paketiyle aynı); iki pakette runtime (`System.Private.CoreLib.dll`, `hostfxr.dll`,
  `coreclr.dll`); `pfx` ve secrets yok; `web.config` `OutOfProcess` (XML); migration'lar iki pakette
  (SQL Server 91, PostgreSQL 127, `AddGrantCurrency` dahil); `2026.10.26` sürüm notu
  `Application.Contracts.dll`'de; sürüm damgası `+549cd630`; statik dosyalar ve `Pages/**/*.js|css`
  depoyla bayt bayt birebir (583 + 103 dosya, fark 0); Vite demeti bu aralıkta değişmedi; DbMigrator
  ZIP'ten açılıp (443 dosya, 412 DLL) sahte bağlantıyla "Migrating database schema..." satırına ulaştı.
- `dogrulama\ayar-dogrula.ps1`: beklenen sürüm `1.0.0+549cd630`, SqlServer DLL 12.453.376 bayt, migration
  eşiği `20261025214126` (1/1), yeni 7. bölüm. Yeni sorgular yerel SQL Server'da salt okuma ile denendi.
