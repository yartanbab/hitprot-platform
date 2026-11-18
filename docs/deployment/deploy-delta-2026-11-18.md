# Deploy delta — 2026-11-18 (`875eaad6` → `a7d76ad2`)

Canlı 2026‑11‑16'da ölçüldü: **`875eaad6`** (11 Kasım paketi, `deploy-delta-2026-11-11.md`). Bu paket onun
üzerine gelir.

Paket: `Apya-Yayin-a7d76ad2.zip` (118.095.202 bayt, 4.639 girdi) ve `Apya-DbMigrator-a7d76ad2.zip`
(58.362.682 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-11-18\`. Sıra klasördeki `OKU-BENI.txt`'te. Korunacak
dosyalar ve Plesk tarifleri için önceki belgeler (`deploy-delta-2026-10-26.md` ve öncesi) geçerli.

| Dosya | `875eaad6` (canlı) | bu paket (`a7d76ad2`) |
|---|---|---|
| `css/apya-account.css` | `55f466f1` | `db419748` |
| `Pages/Projects/Index.js` | `47af8860` | `a89b73f8` |
| `Pages/Grants/Detail.js` | `bb23a0bd` | `078064c9` |
| `Pages/Expenses/Index.js` | `c6d591ae` | `977ac5ea` |
| `js/apya-transfer-menu.js` | yok | `a86985e8` |
| `Pages/CompanyProfile/DataImport.js` | yok | `f6aca3e1` |

🔑 Canlı dosyayı ölçerken `tr -d '\r' < dosya | git hash-object --stdin` — paket CRLF taşır.

🔑 Paket `a7d76ad2`'da donduruldu. Ondan sonra main'e giren #945 (host: program ölçütünde evet/hayır seçim
kutusu) ve #946 (2026.11.15 notuna iki madde: profil doluluğu, yapay zekâ değerlendirmesi) bu pakette **yok**;
sonraki pakete kalır. #946'nın anlattığı iki davranış (#944, #940) bu pakette var, yalnız notları yok.

---

## 🔴 Şema değişikliği — DbMigrator ŞART

Beş migration çifti (SQL Server / PostgreSQL):

| SQL Server | Ne |
|---|---|
| `20261113181508_Add_FirmParameters` | Yeni tablolar `AppFirmParameterDefinitions`, `AppFirmParameterValues` (kurum parametre kataloğu ve değerleri) |
| `20261114082302_Add_DataTransfers` | Yeni tablolar `AppDataTransferRuns`, `AppDataTransferTemplates`, `AppDataTransferTemplateVersions` (aktarım geçmişi ve şablonları) |
| `20261114120440_Add_GrantParameterCriteria` | Yeni tablo `AppGrantParameterCriteria` (programın kurum bilgilerine koyduğu şartlar) |
| `20261115173655_Make_Expense_CashAccount_Optional` | `AppExpenses.CashAccountId` boş bırakılabilir |
| `20261116140511_Add_FirmDataExtractions` | Yeni tablolar `AppFirmDataExtractions`, `AppFirmDataSuggestions` (belgeden okuma ve öneriler) |

Canlı DB 11 Kasım paketinde `20261111120100_Add_DocumentInvoiceLinks`'teydi. DbMigrator atlanırsa Kurumsal
Veriler, İçe/Dışa Aktarma, hibe uygunluğu ve Giderler ekranları `Invalid object name` / `Invalid column name`
ile 500 verir.

Ölçü `kurulum-dogrulama.txt`:
- 1. bölüm: `Apya.Platform.EntityFrameworkCore.SqlServer.dll` **14.389.760** bayt, sürüm `1.0.0+a7d76ad2`.
- 5. bölüm: **"Bu paketin migrationlari uygulanmis : 5 / 5"**, son migration `20261116140511_Add_FirmDataExtractions`.
- 6. bölüm: toplamlar kurulum öncesiyle aynı; izin kaydı artabilir.
- 7. bölüm: sekiz tablo **VAR**, gider kasası boş bırakılabilir **EVET**, kurum parametre kataloğu **en az 34**,
  aktarım izinleri 0'dan büyük.

### DbMigrator'ın bu pakette yaptığı veri işleri
1. **Kurum parametre kataloğu** (#916): 34 parametre tanımı (hedef, kapasite, eş finansman, ortaklık…) tohumlanır.
2. **Aktarım izinleri** (#917): İçe/Dışa Aktarma izinleri tohumlanır (`DataTransferPermissionDataSeedContributor`, izin telafisi).

### Yayında görülecek davranış
- Eş finansman isteyen çağrılar (boş veritabanında 41), kurum eş finansman kapasitesini Kurumsal Veriler'e
  girene kadar **"Koşullu"** görünür; neden çağrı sayfasında yazar (#927).
- Gider penceresi ilk kasayı kendiliğinden seçmez; kasasız gider kasa bakiyesini düşürmez (#936).
- "Belgeden doldur" yalnız Premium/Enterprise pakette ve kurum yöneticisine görünür (#940).
- 🔴 `IAiProvider` (#940) ve `IAiResponseValidator` (#941) DI'da kayıtlı değildi. Koda göre canlıda yapay zekâyla
  görev oluşturma, PDF'ten görev çıkarma, geri bildirim AI ön analizi ve AI değerlendirme çözümleme hatası
  veriyordu. Canlıda ölçülmedi; yayından sonra bir kez denenmeli.

---

## Bu pakette yeni (#911–#944)

| PR | Ne |
|---|---|
| #911 | docs(yayın): deploy delta 2026-11-11 — paket 875eaad6 (#810–#910, şema: 7 migration) |
| #912 | feat(giriş): mobil giriş ekranı kartsız tam ekran düzene geçti |
| #915 | feat(aktarım): CSV iki yönde, ortak dışa aktarma çıkışı ve gidiş-dönüş uyumu |
| #916 | feat(hibe): kurum parametre kataloğu ve değer/köken modeli (veri zenginleştirme 1. adım) |
| #917 | feat(aktarım): İçe / Dışa Aktarma çalışma alanı, aktarım kataloğu, izinler ve tek anahtar |
| #919 | fix(aktarım): gider/gelir dosyasında aynı adlı proje koduyla taşınır |
| #920 | feat(kurum profili): Kurumsal Veriler ekranı (veri zenginleştirme 2. adım) |
| #921 | feat(aktarım): Excel'e aktar düğmelerinde ortak menü — CSV ve Tüm aktarımlar |
| #922 | feat(hibe): eksik veri asistanı ve önceliklendirme (veri zenginleştirme 3. adım) |
| #923 | feat(aktarım): şablon ve işlem geçmişi şeması, Geçmiş sekmesi |
| #924 | feat(hibe): kurum parametre kataloğunun host yönetimi (veri zenginleştirme 4. adım) |
| #913 | style(giriş): çerçevesiz, büyük ve lacivert giriş formu; mobilde ortalı düzen |
| #914 | fix(görevler): "＋ Filtre" menüsü satırlarına devam oku eklendi |
| #918 | fix(hibe): firmalara gönderim e-postası kuyruğa alınır, tercih sorulur |
| #925 | feat(aktarım): aktarım şablonları — servis, sürümleme ve alan eşleştirme |
| #926 | feat(aktarım): Şablonlar sekmesi ve şablon düzenleyici |
| #928 | feat(aktarım): projeleri Excel/CSV'den içe aktarma |
| #927 | feat(hibe): kurum parametreleri eşleştirmeye bağlanır, eş finansman kuralı (veri zenginleştirme 5. adım) |
| #929 | feat(aktarım): faturaları Excel/CSV'den içe aktarma |
| #930 | fix(hibe): hibe profili kaydedilmemiş kuruma türüne uymayan bilgi önerilmez |
| #931 | feat(kurum profili): güncelliğini yitiren bilgi hatırlatması ve "hâlâ güncel" teyidi (veri zenginleştirme 7. adım) |
| #933 | feat(aktarım): hibe çağrılarını Excel/CSV'den host kataloğuna içe aktarma |
| #932 | feat(projeler): görünüm, yoğunluk ve Excel düğmeleri ⋯ menüsüne taşındı |
| #934 | docs(sürüm notu): 2026.11.15 — içe/dışa aktarma tek ekranda, CSV, şablonlar, proje ve fatura içe aktarma |
| #935 | fix(fatura): müşteri (cari) seçicisi fatura pencerelerinden gizlenir |
| #936 | feat(gider): kasa isteğe bağlı — kasasız gider kasaya işlenmez |
| #939 | fix(ai): talimat süzgeci Türkçe kültürde büyük I'lı kalıpları da süzer |
| #938 | feat(kurum verisi): belgeden okuma arka ucu — öneri, onay, KVKK izi (veri zenginleştirme 6a) |
| #940 | feat(kurum verisi): "Belgeden doldur" ekranları — yükleme, aydınlatma onayı, öneri kararı (veri zenginleştirme 6b) |
| #941 | fix(ai): görev çıkarma doğrulayıcısı DI'a kaydedilir — TaskAiAgentManager çözülür |
| #943 | chore(ai): APYA-109.3 taşımasından kalan boş iz dosyaları silinir |
| #944 | feat(hibe): profil tamamlanma yüzdesi tek formül — açık çağrıların ölçtüğü bilgilere göre (veri zenginleştirme 3b) |
| #937 | docs(sürüm notu): 2026.11.15'e kurum verileri, belgeden doldurma, kasasız gider ve giriş ekranı maddeleri |

Sürüm notu: **2026.11.15** (bu pakette 13 madde), host onayı bekler.

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir.
3. `kurulum-dogrulama.txt`: 5/5, 7. bölüm, toplamlar.
4. `dbmigrator` klasörünü ve zamanlanmış görevleri silin.
5. `/Admin/ReleaseNotes`: **2026.11.15** onayı (ve hâlâ bekliyorsa 2026.11.06, 2026.11.11). Kataloğa yazmak
   yayınlamak değildir.
6. Yapay zekâyla görev oluşturma ve geri bildirim AI ön analizini bir kez deneyin (yukarıdaki 🔴 madde).
7. Önceki turlardan kalanlar (hâlâ açıksa): `apya.pargetto.com\wwwroot\uploads\` silinmesi (**`App_Data\uploads`
   DEĞİL**), üç kırık hibe kaynak adresi (10‑26 belgesi madde 6).

## Doğrulama (paket üretimi)
- **Test ağacı = paket ağacı:** paket main `a7d76ad2`'dan üretildi (#937 squash). Testler üç ağaçta, RAM
  bekçisiyle (%90'da başla, %95'te kes) sınıf ve gerekirse test öbekleri hâlinde `dotnet vstest` + TRX; her
  kümede `--ListFullyQualifiedTests` listesindeki yöntemlerin **tamamı en az bir kez geçti**, düşen 0:
  - `a7d76ad2` (paket): Domain **482**, Application **325** tam; EF hibe/kurum verisi alanı (48 sınıf) **251**;
    Web hibe/kurum profili/Smoke alanı (58 sınıf) **432**.
  - `014ed235` (#940/#941/#943 + not): Domain 478, Application 325 tam; EF yapay zekâ/kurum verisi alanı (10
    sınıf) 68; Web yapay zekâ, sürüm notu, marka, yerelleştirme alanı (33 sınıf) 142 (`AiProviderRegistration`,
    `FirmDataImportPage`, `ReleaseNoteCatalog`, `ReleaseNotesPublishing` dahil).
  - `0b003111` (#938/#939 + not): EF **1.009** ve Web **1.208** tam (EF'nin 117 sınıfı `b0dd5998`'de; aradaki fark
    o sınıflara dokunmuyor). `GrantWizardPage`, `MenuLayoutPage`, `Smoke_Tests` bellek yüzünden test test
    koşuldu. Ön yüz (vitest) **182 dosya / 2.076 test**.
- 🔑 Testlerde EF migration'sız derlendi (test host'u şemayı modelden kurar). **Paketin Release derlemesi**
  migration'larla birlikte bu worktree'de yapıldı: tek iş parçacıklı ısıtma (`-m:1`, paylaşımlı derleyici ve
  çözümleyiciler kapalı; Web tepe %88), sonra `scripts/publish-release.ps1 -SkipTests`.
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; DbMigrator 443 dosya, 412 DLL.
  İki pakette runtime (`System.Private.CoreLib.dll`, `hostfxr.dll`, `coreclr.dll`); `pfx` ve secrets yok;
  `web.config` XML ile `OutOfProcess`, `arguments` boş, `applicationInitialization` kapalı (betiğin InProcess
  uyarısı bilinen yanlış alarm).
- Migration'lar iki pakette kaynakla birebir: SQL Server **103** (98 + 5), PostgreSQL **139** (134 + 5);
  `Apya.Platform.EntityFrameworkCore.SqlServer.dll` 14.389.760 bayt (iki pakette aynı). Sürüm damgası
  `1.0.0+a7d76ad2`. 2026.11.15 sürüm notu (yeni maddeleriyle) `Application.Contracts.dll`'de.
- Depoda izlenen `Pages/**/*.js|css` (106) ve wwwroot statik dosyaları (116) pakettekiyle bayt bayt aynı;
  yukarıdaki ayırt edici dosya tablosu paketten ölçüldü.
- Derleme uyarısı: `AutoMapper 14.0.0` için NU1903 (bilinen güvenlik açığı, GHSA-6vhm-j9h7-f9gh ve
  GHSA-gpwp-5797-mjff). Bu paketle gelen bir değişiklik değil; AutoMapper'dan çıkış ayrı yürüyor (#942).
- **DbMigrator uçtan uca:** ZIP'ten açılıp **boş bir geçici yerel SQL Server veritabanına** baştan sona
  çalıştırıldı: 103 migration + tohumlar, `Successfully completed all database migrations.` (~80 sn; ilk
  saniyelerdeki 16 hata satırı veritabanı kurulurken arka plan işçisinin tabloları erken sorgulaması, sonrasında
  hata yok). O veritabanında `ayar-dogrula.ps1`'in 5. ve 7. bölüm sorguları: 5/5, sekiz tablo VAR, kasa boş
  bırakılabilir, 34 parametre tanımı, 5 aktarım izni, 184 host hibe çağrısı.
- **Uygulama:** Web ZIP'i açılıp Release uygulaması Production kipinde (geçici yerel pfx) aynı geçici
  veritabanıyla ayağa kalktı: `/health/ready` 200, `/Account/Login` 200. Tohum yöneticisiyle giriş yapılıp
  Hızlı İşlemler, Projeler, Faturalar, Giderler, Gelirler, Belgeler, Görevler, Hibeler, Takvim, Kurlar, İçe/Dışa
  Aktarma, Kurum Profili, Kurumsal Veriler, Belgeden doldur, sürüm notları (host onay ekranı dahil; 2026.11.15
  görünüyor) ve `api/app/project|invoice|expense` açıldı: hepsi 200, uygulama log'unda ERR/FTL yok. Geçici
  veritabanı ve sertifika sonra silindi. (Paylaşılan yerel veritabanı bilerek kullanılmadı.)
