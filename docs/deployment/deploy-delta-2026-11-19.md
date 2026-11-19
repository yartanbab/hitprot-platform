# Deploy delta — 2026-11-19 (`a7d76ad2` → `ebe03e4b`)

Canlı 2026‑11‑19'da ölçüldü: **`a7d76ad2`** (18 Kasım paketi, `deploy-delta-2026-11-18.md`). Beş ayırt edici
dosya canlıdan indirilip blob'u alındı; hepsi `a7d76ad2` ile birebir. Bu paket onun üzerine gelir.

Paket: `Apya-Yayin-ebe03e4b.zip` (118.120.379 bayt, 4.640 girdi) ve `Apya-DbMigrator-ebe03e4b.zip`
(58.378.533 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-11-19\`. Sıra klasördeki `OKU-BENI.txt`'te. Korunacak
dosyalar ve Plesk tarifleri için önceki belgeler geçerli.

| Dosya | `a7d76ad2` (canlı) | bu paket (`ebe03e4b`) |
|---|---|---|
| `Pages/Projects/ProjectDetails.js` | `e6f4321d` | `5eb249b6` |
| `Pages/CompanyProfile/DataImport.js` | `f6aca3e1` | `3fd19de4` |
| `Pages/Grants/ParameterCriteria.js` | yok | `28a5c7b5` |

🔑 Canlı dosyayı ölçerken `tr -d '\r' < dosya | git hash-object --stdin` — paket CRLF taşır.

---

## Şema değişikliği YOK

`a7d76ad2..ebe03e4b` aralığında migration, tohum, izin tanımı, `appsettings` ya da `web.config` değişikliği yok
(değişen EF dosyaları yalnız testler). Sürüm notu maddeleri çalışma anında `ReleaseNoteCatalog`'dan okunur;
`ReleaseNotePublicationDataSeedContributor` yalnız tablo boşken çalışır. Yani yeni maddeler için de DbMigrator
gerekmez.

🔴 **Tek istisna:** 18 Kasım kurulumunda DbMigrator çalıştırılmadıysa o paketin 5 migration'ı hâlâ bekliyordur
(dışarıdan ölçülemez). Ölçü: kurumda **Kurumsal Veriler** açılıyorsa uygulanmış; 500 veriyorsa bu paketteki
DbMigrator ZIP'i 18 Kasım tarifiyle koşulur (`kurulum-dogrulama.txt`: 5/5, SqlServer.dll 14.389.760 bayt,
`1.0.0+ebe03e4b`).

🔑 **`ayar-dogrula.ps1` düzeltmesi:** 7. bölümdeki "Gider kasası boş bırakılabilir" sorgusu `is_nullable`
(bit) değerini `'1'` ile karşılaştırıyordu; `ExecuteScalar` bunu `True` döndürdüğü için sütun boş bırakılabilir
olsa da **HAYIR** yazıyordu. Yeni klasördeki betikte `CAST(is_nullable AS int)`. 18 Kasım kurulumunda bu satır
HAYIR çıktıysa yanlış alarmdı.

---

## Bu pakette yeni (#945–#951)

| PR | Ne |
|---|---|
| #945 | feat(hibe): program ölçütünde evet/hayır değeri seçim kutusundan seçilir (host) |
| #946 | docs(sürüm notu): 2026.11.15'e profil doluluğu ve yapay zekâ değerlendirmesi maddeleri |
| #948 | docs(yayın): deploy delta 2026-11-18 |
| #947 | feat(aktarım): proje detayı ⋯ menüsünde görevleri dışa/içe aktarma |
| #942 | refactor(finans): 12 finans eşlemesi AutoMapper'dan Mapperly'ye taşındı (davranış aynı) |
| #949 | feat(hibe): belgeden doldurmada başarısız okuma "Yeniden dene" ile tekrarlanır |
| #950 | docs(sürüm notu): 2026.11.15'e proje sayfasından görev aktarma maddesi |
| #951 | docs(sürüm notu): 2026.11.15'e başarısız belge okumasını yeniden deneme maddesi |

Sürüm notu: **2026.11.15** artık **17 madde** (18 Kasım paketinde 13), host onayı bekler. Onay 18 Kasım'dan
sonra verildiyse yeni 4 madde ayrıca onaylanır.

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir.
3. Kurumsal Veriler açılıyor mu (yukarıdaki 🔴 istisna).
4. `/Admin/ReleaseNotes`: **2026.11.15** onayı (ve hâlâ bekliyorsa 2026.11.06, 2026.11.11).
5. 18 Kasım'dan kalan: yapay zekâyla görev oluşturma ve geri bildirim AI ön analizini bir kez deneyin.

## Doğrulama (paket üretimi)
- **Test ağacı = paket ağacı = main `ebe03e4b`** (çalışma ağacı temiz). RAM bekçisiyle sınıf sınıf, TRX ile
  sayıldı, düşen 0: Domain **659**, Application **400** tam; EF ve Web sınıfları aynı ağaçta (son tur 83 sınıf /
  550 test, finans/hibe EF sınıfları ve Web'in kalan sınıfları dahil).
- Release: önce bekçide `dotnet publish -c Release -r win-x64 --self-contained -m:1 -nodeReuse:false
  -p:UseSharedCompilation=false -p:RunAnalyzers=false` (Web tepe %94; DbMigrator ayrıca), sonra
  `RunAnalyzers=false` ve `MSBUILDDISABLENODEREUSE=1` ortam değişkenleriyle `publish-release.ps1 -SkipTests`
  (tepe %82). 🔑 Ortam değişkenleri verilmeden betik Web'i baştan derledi ve 12 denemede de %95'e çarptı.
- ZIP: ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; DbMigrator 443 dosya (kökte 412 DLL), dosya listesi
  18 Kasım paketiyle birebir. İki pakette runtime; `pfx` ve secrets yok (eşleşen tek ad
  `Microsoft.Extensions.Configuration.UserSecrets.dll`); `web.config` XML ile `OutOfProcess` (betiğin InProcess
  uyarısı açıklama yorumundan gelen bilinen yanlış alarm).
- Migration'lar iki pakette kaynakla birebir: SQL Server **103**, PostgreSQL **139**;
  `Apya.Platform.EntityFrameworkCore.SqlServer.dll` 14.389.760 bayt. Sürüm damgası `1.0.0+ebe03e4b`. 2026.11.15
  notu ve "Başarısız belge okumasını yeniden deneyin" maddesi `Application.Contracts.dll`'de.
- Depoda izlenen `Pages/**/*.js|css` (107) ve wwwroot statik dosyaları (115) pakettekiyle aynı (yalnız
  `js/jquery-fix.js` depoda da BOM'lu; içerik aynı, 18 Kasım paketindekiyle bayt bayt aynı).
- **DbMigrator uçtan uca:** ZIP'ten açılıp boş geçici yerel SQL Server veritabanına çalıştırıldı: 103 migration +
  tohumlar, `Successfully completed all database migrations.` (82 sn; ilk saniyedeki `AbpBackgroundJobs`
  hataları arka plan işçisinin tabloları erken sorgulaması). Düzeltilmiş `ayar-dogrula.ps1` bu veritabanında:
  bağlantı, 5/5, sekiz tablo VAR, kasa boş bırakılabilir EVET, 34 parametre tanımı, 5 aktarım izni.
- **Uygulama:** Web ZIP'i açılıp Production kipinde (geçici pfx) aynı veritabanıyla ayağa kalktı:
  `/health/ready` 200, `/Account/Login` 200. Tohum yöneticisiyle giriş yapılıp Makro, Projeler, Faturalar,
  Giderler, Gelirler, Belgeler, Görevler, Hibeler, Takvim, Kurlar, İçe/Dışa Aktarma, Kurum Profili, Kurumsal
  Veriler, Belgeden doldur, hibe parametreleri ve parametre ölçütleri (`?grantId=`), sürüm notları (host onay
  ekranında yeni madde görünüyor) ve `api/app/project|invoice|expense` açıldı: hepsi 200. Log'daki tek hata
  kümesi `grantId`'siz açılan ölçüt sayfasının 404'ü (boş kimlik, beklenen). Geçici veritabanı ve sertifika
  silindi; paylaşılan yerel veritabanı kullanılmadı.
