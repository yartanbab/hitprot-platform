# Deploy delta — 2026-11-11 (`549cd630` → `875eaad6`)

Canlı 2026‑11‑11, 11‑12 ve 11‑13'te ölçüldü: hâlâ **`549cd630`** (26 Ekim paketi). 7 Kasım paketi (`834e4f85`,
`deploy-delta-2026-11-07.md`) **hiç kurulmadı**; bu paket onun da yerine geçer, onu ayrıca kurmayın.

Paket: `Apya-Yayin-875eaad6.zip` (117.501.814 bayt, 4.632 girdi) ve `Apya-DbMigrator-875eaad6.zip` (57.978.718 bayt,
456 girdi), Masaüstü `Apya-Yayin-2026-11-11\`. Sıra klasördeki `OKU-BENI.txt`'te. Korunacak dosyalar ve
Plesk tarifleri için önceki belgeler (`deploy-delta-2026-10-26.md` ve öncesi) geçerli.

| Dosya | `549cd630` (canlı) | bu paket (`875eaad6`) |
|---|---|---|
| `css/apya-shell.css` | `df8c0a00` | `991f1934` |
| `Pages/Projects/Index.js` | `940f9453` | `47af8860` |
| `Pages/Projects/ProjectDetails.js` | `6fcefc83` | `e6f4321d` |
| `Pages/Grants/Detail.js` | `6b506771` | `bb23a0bd` |
| `js/apya-activity.js` | `e5941cab` | `81930452` |
| `js/apya-pwa.js` | yok (302) | `b7c9881d` |

🔑 Canlı dosyayı ölçerken `tr -d '\r' < dosya | git hash-object --stdin` — paket CRLF taşır.

---

## 🔴 Şema değişikliği — DbMigrator ŞART

Yedi migration çifti (SQL Server / PostgreSQL). İlk beşi 7 Kasım paketindekilerin aynısıdır:

| SQL Server | Ne |
|---|---|
| `20261029090633_AddGrantNotificationTemplateAudience` | Hibe bildirim şablonuna hedef kitle (`Audience`); tekil indeks kitleyi de kapsar |
| `20261029101451_AddGrantNotificationEscalation` | Şablona hatırlatma kademesi (`IsEscalation`, `AfterDays`); evraka `StatusChangedAt` (+ geri doldurma SQL'i) |
| `20261029121539_AddNotificationTemplates` | Yeni tablo `AppNotificationTemplates` (görev/proje/finans bildirim metinleri) |
| `20261031121829_AddGrantDocumentSignatureChecks` | Evrak şartına ıslak imza / kaşe; evrak sürümüne ön kontrol sonuçları (+ addan geri doldurma) |
| `20261031143407_AddBudgetLineHierarchyAndCofinancing` | Bütçe kalemine `ParentId` + `GrantAmount`; projeye `SupportRatePercent` |
| `20261110093100_AddVatExemption` | Projeye `VatExemptionCertificateNo` + `VatExemptionValidUntil`; faturaya `VatExemptionReference` (üçü de boş bırakılabilir) |
| `20261111120100_Add_DocumentInvoiceLinks` | Yeni tablo `AppDocumentInvoiceLinks` (belge ↔ fatura bağı) |

Canlı DB 26 Ekim'de `20261025214126_AddGrantCurrency`'deydi. DbMigrator atlanırsa hibe bildirim, hibe evrakı,
bütçe, proje ve fatura ekranları `Invalid column name` ile 500 verir.

🔴 `AddGrantNotificationEscalation` aynı yığında `ALTER` + `UPDATE` içerir; SQL betiğiyle uygulanacaksa araya
`GO` gerekir. **DbMigrator ile uygulayın** (betik yolu denenmedi).

Ölçü `kurulum-dogrulama.txt`:
- 5. bölüm: **"Bu paketin migrationlari uygulanmis : 7 / 7"**, son migration `20261111120100_Add_DocumentInvoiceLinks`.
- 6. bölüm: toplamlar kurulum öncesiyle aynı.
- 7. bölüm: tüm sütun/tablo satırları **VAR**; hatırlatma şablonu sayısı 0 değil; "KDV istisna belgesi" belge türü **1**.

### DbMigrator'ın bu pakette yaptığı veri işleri
1. **Hibe bildirim şablonları Türkçe** (#822): host'un dokunmadığı, hâlâ İngilizce varsayılanında duran
   şablonlar Türkçeye çevrilir; host'un düzenlediği metne dokunulmaz.
2. **Hatırlatma kademeleri** (#834): tetikleyici başına varsayılan kademeler (firma 3/7/14 gün, danışman 2/5 gün)
   tohumlanır; host'un sildiği kademe yeniden kurulmaz.
3. **Erasmus+ KA220** (#850, #851): okul, mesleki, yetişkin ve yükseköğretim alanları ve kapanmış 2026/1 dönemi.
4. **Kapanış ve ara rapor şablonları** (#836–#838): 23 kapanış + 14 ara rapor şablonu.
5. **Islak imza / kaşe geri doldurma** (#839): katalog evrak şartlarında addan çıkarım (migration SQL'i).
6. **"KDV istisna belgesi" belge türü** (#882): host düzeyinde yeni belge türü (belge no, düzenlenme tarihi,
   son geçerlilik). DbMigrator koşmadan Belgeler'de görünmez.
7. **Bölge etiketleri il sözlüğüne** (#885): kurum profili ve hibe programı bölge etiketlerinde tanınan yazımlar
   ("istanbul", "ANKARA") resmî il adına çevrilir; tanınmayanlara dokunulmaz (log'da sayısı yazar). Tohumdaki
   "81 il" bölgesi boş listeye ("ülke geneli") çevrildi.

---

## Bu pakette yeni

**#810–#873:** `deploy-delta-2026-11-07.md`'deki tablo (değişmedi; o paket kurulmadığı için hepsi bu paketle
canlıya iner).

**#874–#910:**

| PR | Ne |
|---|---|
| #874 | docs(yayın): deploy delta 2026-11-07 — paket 834e4f85 (#810–#873, şema: 5 migration) |
| #880 | fix(gezinme): yükleniyor katmanı kodla yapılan sayfa geçişlerinde de açılır |
| #875 | fix(dil): yerelleştirmede yabancı terimler Türkçeleşti, hitap "siz"de birleşti |
| #876 | fix(dil): sayfalara gömülü yabancı terimler Türkçeleşti |
| #877 | feat(hızlı işlemler): Makro Ekran adı Hızlı İşlemler oldu, menüde en üstte ve açılış ekranı |
| #878 | fix(sistem-sağlığı): yavaş GET'ler kayda düşer, hub bağlantısı yavaş uç sayılmaz |
| #879 | feat(dışa aktarma): hibe çağrıları, fırsatlar ve başvurular Excel'e |
| #881 | feat(geri-bildirim): prompt'a AI ön analizi ekle (tekli) |
| #882 | feat(fatura): KDV istisna belgesi — projeye belge, faturaya KDV'siz kesim |
| #883 | feat(dışa aktarma): hibe çağrıları, fırsatlar ve başvurular Excel'e |
| #887 | feat(dışa aktarma): Belgeler listesi Excel'e |
| #886 | fix(test): main'de kırmızı iki test — bütçe kapı sayısı (#882) ve AI düğmesi ikonu (#881) |
| #884 | feat(dışa aktarma): host ekranları ve AI kullanım kayıtları Excel'e |
| #885 | feat(hibe): bölge il sözlüğünden gelir ve eler (profil–hibe eşleştirme 1. adım) |
| #888 | feat(içe aktarma): giderler Excel'den içe aktarılır (şablon → önizleme → onay) |
| #889 | feat(içe aktarma): gelirler Excel'den içe aktarılır; gider/gelir ortak gövde |
| #890 | feat(içe aktarma): görevler Excel'den içe aktarılır; ortak içe aktarma gövdesi |
| #891 | feat(içe aktarma): proje bütçe kalemleri Excel'den içe aktarılır (ağaç tek dosyada) |
| #892 | feat(içe aktarma): kurlar Excel'den içe aktarılır |
| #893 | feat(takvim): hibe son başvuru tarihi .ics olarak takvime eklenir |
| #894 | feat(takvim): görünen aralık .ics olarak indirilir |
| #895 | feat(fatura): fatura PDF olarak indirilir (e-fatura yerine geçmez uyarısıyla) |
| #896 | feat(hibe): başvuru özeti PDF olarak indirilir |
| #897 | fix(fatura): yazdırma sayfası sahte IBAN/VDK basmaz; genel toplam ve durum düzeltildi |
| #898 | fix(projeler): kapak görseli proje kartını uzatmıyor |
| #899 | feat(formlar): form tanımı JSON olarak dışa/içe aktarılır |
| #900 | feat(raporlar): rapor şablonu JSON olarak dışa/içe aktarılır |
| #901 | feat(hibe): aşama şablonu JSON olarak dışa/içe aktarılır (host) |
| #902 | feat(finans): gider ve gelir penceresine belge (fatura, fiş, dekont) eklenir |
| #903 | feat(hibe): bildirim şablonları JSON aktarımı — önizle, sonra değiştir (host) |
| #904 | feat(ai): istem JSON olarak dışa/içe aktarılır (host) |
| #905 | feat(ai): iş akışı JSON olarak dışa/içe aktarılır (host) |
| #906 | feat(fatura): fatura ve tahsilat penceresine belge (fatura, dekont) eklenir |
| #907 | feat(masraf): Masraf Yakala'da çekilen fiş kayda eklenir |
| #908 | fix(aktarim): elle bosaltilmis JSON alani 500 yerine okunamadi der |
| #910 | fix(kiracı): müşteri menüsünde kurum unvanı görünür; ad üreticisi 'İ'yi tanır |
| #909 | docs(sürüm notu): 2026.11.11 — Excel'den içe aktarma, kayıtlara belge, fatura PDF'i, takvim dosyaları |

Sürüm notları: **2026.11.06** (17 madde) + **2026.11.11** (12 madde), ikisi de host onayı bekler.

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir.
3. `kurulum-dogrulama.txt`: 7/7, 7. bölüm, toplamlar.
4. `dbmigrator` klasörünü ve zamanlanmış görevleri silin.
5. `/Admin/ReleaseNotes`: **2026.11.06** ve **2026.11.11** onayı (kataloğa yazmak yayınlamak değildir).
6. Tarayıcı önbelleği: marka yenilemesi (#811–#815) sekme ikonu, manifest ve service worker'ı değiştirdi. İlk
   açılışta eski ikon görünürse sayfayı bir kez yenileyin; kurulu PWA ikonu telefonda kendiliğinden
   güncellenmeyebilir.
7. Önceki turlardan kalanlar (hâlâ açıksa): `apya.pargetto.com\wwwroot\uploads\` silinmesi (**`App_Data\uploads`
   DEĞİL**), 10.26 sürüm notu onayı, üç kırık hibe kaynak adresi (10‑26 belgesi madde 6).

## Doğrulama (paket üretimi)
- **Test ağacı = paket ağacı:** paket main `875eaad6`'dan üretildi (#909 squash); ağacı (`01768f8c`) testlerin
  koşulduğu dal ucuyla (`f5c3805a`) **birebir aynı**.
- Testler (2026‑11‑11…11‑12), RAM bekçisiyle (%90'da başla, %95'te kes) sınıf ve gerekirse test öbekleri hâlinde
  `dotnet vstest` + TRX; her projede `--ListFullyQualifiedTests` listesindeki yöntemlerin **tamamı en az bir kez
  geçti**, düşen 0:
  - Web **1.148** yöntem (1.475 sonuç) — son ağaçta. `GrantWizardPage`, `GrantWritePermission`, `InternalLinks`,
    `MenuLayoutPage`, `InvoiceEditModal` sınıfları bellek yüzünden test test; iki fatura testi 1,25 GB yığın
    tavanıyla ayrıca koşuldu.
  - EF **947** (1.082) — 121–182. sınıflar ve #910'un dokunduğu kiracı/protokol/kayıt sınıfları (13) son ağaçta;
    1–120 bir önceki ağaçta (`a7763d5a`; aradaki fark yalnız #910 + sürüm notu).
  - Application **312** (383) — son ağaçta.
  - Domain **427** (573) ve ön yüz (vitest) **182 dosya / 2.074 test** — bir önceki ağaçta (#910 Domain'e ve
    JS'e dokunmuyor).
- 🔑 Testlerde EF migration'sız derlendi (test host'u şemayı modelden kurar). **Paketin Release derlemesi**
  migration'larla birlikte bu worktree'de yapıldı: tek iş parçacıklı ısıtma (`-m:1`, paylaşımlı derleyici ve
  çözümleyiciler kapalı; Web tepe %93), sonra `scripts/publish-release.ps1 -SkipTests`.
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; Web 117.501.814 bayt /
  4.632 girdi, DbMigrator 57.978.718 bayt / 456 girdi (443 dosya, 412 DLL). İki pakette runtime
  (`System.Private.CoreLib.dll`, `hostfxr.dll`, `coreclr.dll`, `includedFrameworks`); `pfx` ve secrets yok;
  `web.config` XML ile `OutOfProcess`, `arguments` boş, `applicationInitialization` kapalı (betiğin InProcess
  uyarısı bilinen yanlış alarm).
- Migration'lar iki pakette kaynakla birebir: SQL Server **98** (91 + 7), PostgreSQL **134** (127 + 7);
  `Apya.Platform.EntityFrameworkCore.SqlServer.dll` 13.527.552 bayt (iki pakette aynı). Sürüm damgası
  `1.0.0+875eaad6`. `2026.11.06` ve `2026.11.11` sürüm notları `Application.Contracts.dll`'de.
- Depoda izlenen wwwroot dosyaları (142) ve `Pages/**/*.js|css` (104) pakettekiyle bayt bayt aynı; yukarıdaki
  ayırt edici dosya tablosu paketten ölçüldü.
- **DbMigrator uçtan uca:** ZIP'ten açılıp önce sahte bağlantıyla "Migrating database schema..." satırına
  ulaştı, sonra **boş bir geçici yerel SQL Server veritabanına** baştan sona çalıştırıldı: 98 migration +
  tohumlar, `Successfully completed all database migrations.` (~76 sn; ilk saniyedeki bağlantı hataları
  veritabanı oluşturulurken). O veritabanında `ayar-dogrula.ps1`'in 5. ve 7. bölüm sorguları: 7/7, tüm
  sütun/tablolar VAR, "KDV istisna belgesi" 1, ıslak imza şartı 155, kademe şablonu 20.
- **Uygulama:** Web ZIP'i açılıp Release uygulaması Production kipinde (geçici yerel pfx) aynı geçici
  veritabanıyla ayağa kalktı: `/health/ready` 200, `/Account/Login` 200. Tohum yöneticisiyle giriş yapılıp
  Hızlı İşlemler, Projeler, Faturalar, Giderler, Gelirler, Belgeler, Görevler, Hibeler, Takvim, Kurlar, sürüm
  notları (host onay ekranı dahil) ve `api/app/project|invoice|expense` açıldı: hepsi 200, `Invalid column`
  yok, uygulama log'unda ERR/FTL yok. Geçici veritabanı sonra silindi. (Paylaşılan yerel veritabanı bilerek
  kullanılmadı: oradaki SMTP/bildirim/yapay zekâ ayarlarıyla gerçek gönderim riski vardı.)
