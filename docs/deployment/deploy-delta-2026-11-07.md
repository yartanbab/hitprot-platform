# Deploy delta — 2026-11-07 (`549cd630` → `834e4f85`)

Canlı 2026‑11‑06'da ölçüldü: **`549cd630`** (26 Ekim paketi). Ayırt edici dosyalar canlıda o sürümle
birebir: `Pages/Grants/Detail.js` `6b506771` ve `Pages/Grants/Catalog.js` `568557a9` (24 Ekim'deki
`e5e32d99` / `4d0eb2bd` değil); `css/apya-shell.css` `df8c0a00` ve `Pages/Projects/Index.js` `940f9453`
main'in bugünkü hâliyle tutmuyor. `/health/ready` 200 (0,05 sn).

Paket: `Apya-Yayin-834e4f85.zip` (117.163.415 bayt, 4.620 girdi) ve `Apya-DbMigrator-834e4f85.zip` (57.843.908 bayt, 456 girdi), Masaüstü
`Apya-Yayin-2026-11-07\`. Sıra klasördeki `OKU-BENI.txt`'te. Korunacak dosyalar ve Plesk tarifleri için
önceki belgeler (`deploy-delta-2026-10-26.md` ve öncesi) geçerli.

| Dosya | `549cd630` (canlı) | bu paket (`834e4f85`) |
|---|---|---|
| `css/apya-shell.css` | `df8c0a00` | `3f82ad69` |
| `Pages/Projects/Index.js` | `940f9453` | `47af8860` |
| `Pages/Projects/ProjectDetails.js` | `6fcefc83` | `7750c214` |
| `Pages/Grants/Documents.js` | `b596bf06` | `7cb4c6ab` |
| `js/apya-activity.js` | `e5941cab` | `7a25fb11` |
| `js/apya-pwa.js` | yok (302) | `b7c9881d` |
| `Pages/Grants/Detail.js` | `6b506771` | `6b506771` (değişmedi, kontrol) |

🔑 Canlı dosyayı ölçerken `tr -d '\r' < dosya | git hash-object --stdin` — paket CRLF taşır.

---

## 🔴 Şema değişikliği — DbMigrator ŞART

Beş migration çifti (SQL Server / PostgreSQL):

| SQL Server | Ne |
|---|---|
| `20261029090633_AddGrantNotificationTemplateAudience` | Hibe bildirim şablonuna hedef kitle (`Audience`); tekil indeks kitleyi de kapsar |
| `20261029101451_AddGrantNotificationEscalation` | Şablona hatırlatma kademesi (`IsEscalation`, `AfterDays`); evraka `StatusChangedAt` (+ geri doldurma SQL'i) |
| `20261029121539_AddNotificationTemplates` | Yeni tablo `AppNotificationTemplates` (görev/proje/finans bildirim metinleri) |
| `20261031121829_AddGrantDocumentSignatureChecks` | Evrak şartına ıslak imza / kaşe; evrak sürümüne ön kontrol sonuçları (+ addan geri doldurma) |
| `20261031143407_AddBudgetLineHierarchyAndCofinancing` | Bütçe kalemine `ParentId` + `GrantAmount`; projeye `SupportRatePercent` |

Canlı DB 26 Ekim'de `20261025214126_AddGrantCurrency`'deydi. DbMigrator atlanırsa hibe bildirim, hibe
evrakı ve bütçe ekranları `Invalid column name` ile 500 verir.

🔴 `AddGrantNotificationEscalation` aynı yığında `ALTER` + `UPDATE` içerir; SQL betiğiyle uygulanacaksa
araya `GO` gerekir. **DbMigrator ile uygulayın** (betik yolu denenmedi).

Ölçü `kurulum-dogrulama.txt`:
- 5. bölüm: **"Bu paketin migrationlari uygulanmis : 5 / 5"**, son migration
  `20261031143407_AddBudgetLineHierarchyAndCofinancing`.
- 6. bölüm: toplamlar kurulum öncesiyle aynı.
- 7. bölüm (yeni): sekiz sütun/tablo satırının hepsi **VAR**; hatırlatma şablonu sayısı 0 değil.

### DbMigrator'ın bu pakette yaptığı veri işleri
1. **Hibe bildirim şablonları Türkçe** (#822): host'un dokunmadığı, hâlâ İngilizce varsayılanında duran
   şablonlar Türkçeye çevrilir; host'un düzenlediği metne dokunulmaz. Sunucu dili artık önemsiz.
2. **Hatırlatma kademeleri** (#834): tetikleyici başına varsayılan kademeler (firma 3/7/14 gün, danışman
   2/5 gün) tohumlanır; host'un sildiği kademe yeniden kurulmaz.
3. **Erasmus+ KA220** (#850, #851): okul, mesleki, yetişkin ve yükseköğretim alanları ve kapanmış 2026/1
   dönemi kataloğa girer; 2027/1 tarihsiz "Planlandı".
4. **Kapanış ve ara rapor şablonları** (#836–#838): 23 kapanış + 14 ara rapor şablonu.
5. **Islak imza / kaşe geri doldurma** (#839): katalog evrak şartlarında addan çıkarım (migration SQL'i).

---

## Bu pakette yeni (#810–#873, 59 PR)

| PR | Ne |
|---|---|
| #810 | docs(yayın): deploy delta 2026-10-26 — paket 549cd630 (#804–#809, şema: AddGrantCurrency) |
| #811 | feat(marka): sekme, ana ekran ve bildirim ikonları APYA işaretine geçti |
| #812 | feat(marka): arayüz yazı tipi Figtree oldu |
| #813 | feat(marka): ortak APYA işareti bileşeni — Razor, jQuery ve React |
| #814 | feat(marka): logo APYA işaretine geçti — menü, mobil, giriş ve yasal sayfalar |
| #815 | feat(marka): tüm bekleme göstergeleri APYA işareti + gezinme yükleniyor katmanı |
| #816 | feat(fatura): fatura düzenleme ve bütçe kalemi bağlama |
| #817 | fix(gorev): görevden açılan fatura/gider penceresine yazılamıyordu + bütçe kalemi görevden gelir |
| #818 | fix(gider): görevden "Gider ekle" kasa/cari izni olmayana 403 veriyordu |
| #819 | feat(marka): AI ikonları APYA işareti; AI olmayan yerlerde nötr ikon |
| #820 | fix(pano): mobilde Kart Panosu boşlukları daraltıldı, kartlar genişledi |
| #821 | fix(kiracı): "Hesabına Gir" rol adı değişse ya da admin rolü silinse de çalışır |
| #822 | fix(hibe): bildirim şablonları sunucu dilinden bağımsız Türkçe kurulur |
| #826 | feat(oturum): giriş çerezi 90 gün yaşar, kullanıldıkça yenilenir |
| #829 | fix(güvenlik): açıklı Scriban/Pkcs/Xml paketleri yamalandı (17 bildirim) |
| #830 | fix(mobil): sayfa geçişinde üst çubuk karışık görünmüyor |
| #823 | feat(hibe): bildirim şablonları role göre çoğaltılır (hiyerarşik bildirim Faz 1) |
| #831 | fix(güvenlik): AutoMapper eşlemelerine MaxDepth 64 konur (CVE-2026-32933 hafifletmesi) |
| #832 | fix(güvenlik): alt görev derinliği 10 düzeyle sınırlandı (CVE-2026-32933 kök nedeni) |
| #833 | test(abp-çıkış): ABP yüzey bekçisi — izinli Volo.* ad alanı/paket listesi |
| #834 | feat(bildirim): hiyerarşik bildirim Faz 2–4 main'e alındı (#824, #825, #827, #828) |
| #835 | chore(güvenlik): App_Data'daki kullanıcı yüklemeleri depodan çıkarıldı |
| #836 | feat(rapor): hibe veren kurumların kapanış raporu şablonları |
| #837 | feat(rapor): hibe ara rapor şablonları ve iki kurum şablonunun resmi forma düzeltilmesi |
| #838 | feat(rapor): şablon seçicide kuruma göre gruplama ve arama |
| #839 | feat(hibe): belge ıslak imza/kaşe şartı ve yükleme ön kontrolü |
| #841 | feat(bütçe): kalem ağacı, hibe/kurum payı, destek oranı ve kod sırası |
| #840 | docs(rapor): TÜBİTAK 1501, 1507 ve 1707 kapanış raporu örnekleri |
| #842 | fix(görevler): konsol görünümleri kendi içinde kaydırılır |
| #843 | style(arayüz): konsol şeridi üst bara yapışır, üst köşeler düz |
| #844 | style(arayüz): konsol şeridi iki yana da yapışır |
| #845 | fix(finans): hesap listesinde tutar kartın dışına taşmıyor |
| #846 | fix(arayüz): Tailwind'siz sayfalarda ölü min-w-0 satır içi stile çevrildi |
| #847 | fix(bütçe): aktarım payı sınırı ekranlardan kaldırıldı |
| #848 | fix(genel bakış): sunucuda olmayan anlık bağlantı kapatıldı |
| #849 | feat(hibe): Fırsatlar ekranına gelişmiş filtre |
| #850 | feat(hibe): KA220'nin okul, mesleki, yetişkin ve yükseköğretim alanları |
| #851 | feat(hibe): KA220 okul/mesleki/yetişkin/yükseköğretim kapanmış 2026 dönemi |
| #852 | fix(giriş): mobilde APYA logosu büyütüldü |
| #853 | fix(makro): haber şeridi başlığı iki tam satır, mobilde üst bara yapışık |
| #854 | feat(tema): web ve mobilde varsayılan açık tema |
| #855 | feat(projeler): kompakt proje kartı |
| #857 | fix(proje): mobilde gösterge şeridi iki sütunlu ızgara, menüler kırpılmıyor |
| #858 | fix(arayüz): telefonda üst boşluk 12px, filtre çipleri tek ölçüde |
| #856 | fix(proje): mobilde proje başlığı, filtreler ve Gantt araçları sıkıştı |
| #859 | feat(görev): mobil görev kartı sadeleşti — halka, özet satırı, göreli tarih |
| #861 | feat(projeler): kart görseli başlık ve etiketler boyunca büyüdü |
| #862 | feat(bildirim): telefonda ana ekrana ekle, bildirim izni şeridi ve ikon rozeti |
| #863 | feat(dışa aktarma): görev ve proje listesi Excel'e, bütçe raporu proje menüsünde |
| #865 | feat(fatura): ödeme alınmış faturada tutar, kalem ve KDV düzeltilebilir |
| #866 | feat(dışa aktarma): gider, gelir, kasa hareketleri ve fatura listesi Excel'e |
| #868 | fix(güvenlik): CSP worker-src'ye 'self' eklendi, sw.js reddedilmez |
| #867 | feat(fatura): "Fiyatlar KDV dahil" anahtarı ve canlı toplam satırı |
| #870 | feat(geri-bildirim): detayda geliştirme prompt'u sekmesi |
| #871 | feat(proje): hibe başvuru evrakı proje Belgeler sekmesinde salt okunur |
| #872 | feat(geri-bildirim): seçilenlerden toplu geliştirme prompt'u |
| #864 | fix(hibe): imza/kaşe etiketleri görünür, ASCII yazım tanınır |
| #869 | docs(sürüm notu): 2026.11.06 — Excel'e aktarma, ana ekrana ekle, fatura düzenleme, yeni APYA görünümü |
| #873 | fix(test): main'de kırmızı iki sözleşme testi — eksik metin anahtarı ve yorumdaki handler |

Sürüm notu **2026.11.06** — 17 müşteri maddesi, host onayı bekler.

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir.
3. `kurulum-dogrulama.txt`: 5/5, 7. bölüm, toplamlar.
4. `dbmigrator` klasörünü ve zamanlanmış görevleri silin.
5. `/Admin/ReleaseNotes`: **2026.11.06** onayı (kataloğa yazmak yayınlamak değildir).
6. Tarayıcı önbelleği: marka yenilemesi (#811–#815) sekme ikonu, manifest ve service worker'ı değiştirdi.
   İlk açılışta eski ikon görünürse sayfayı bir kez yenileyin; kurulu PWA ikonu telefonda kendiliğinden
   güncellenmeyebilir (kaldırıp yeniden eklemek gerekir).
7. Önceki turlardan kalanlar (hâlâ açıksa): `apya.pargetto.com\wwwroot\uploads\` silinmesi (**`App_Data\uploads`
   DEĞİL**), 10.26 sürüm notu onayı, üç kırık hibe kaynak adresi (10‑26 belgesi madde 6).

## Doğrulama (paket üretimi)
- **Test ağacı = paket ağacı:** testler main `b59d18c6` + #864 + #869 + #873 birleşik dalında koşuldu; üçü
  squash ile main'e alındıktan sonra main `834e4f85` ağacı (`e1ab2c36`) test ağacıyla **birebir aynı**.
- Testler (2026‑11‑06/07): Domain 552/552 · Application 370/370 · EF 1.003 (keşif listesindeki 936 yöntemin
  tamamı; Grants 185/185 son ağaçta, diğer ad alanları 818/818 bir önceki ağaçta — aradaki fark yalnız Grants'a
  dokunuyor) · Web ~1.400 (keşif listesindeki 1.090 yöntemin tamamı; dosya adıyla öbeklemenin kaçırdığı 6 sınıf /
  15 test ayrıca koşuldu; MenuLayoutPage 28 test bellek yüzünden tek tek) · ön yüz (vitest) 178/178 dosya,
  2.052 test.
- 🔑 Bu turda main'de kırmızı üç sözleşme testi bulundu ve #873 ile düzeltildi: eksik
  `Grants:Notify:Escalation:Audience:FirmaKullanicisi` metni (#834'ten beri), `apya-activity.js` yorumundaki
  `?handler=Export` (#815'ten beri), #859'un `canComplete`'ine uyarlanmayan sahiplik testi. Üçünde de ekranda
  görünür bozukluk yoktu.
- 🔑 EF Core Debug çıktısı yerel bellek sınırı yüzünden `faz24-test` worktree'sinden (`04599fce`, EF kaynağı
  birebir; DLL'de #841 eşlemeleri ölçüldü) alındı ve testlerde migration'sız derleme kullanıldı. **Paketin
  Release derlemesi** migration'larla birlikte bu worktree'de sıfırdan yapıldı (RAM zirvesi %87).
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; Web 117.163.415 bayt /
  4.620 girdi, DbMigrator 57.843.908 bayt / 456 girdi. İki pakette runtime (`System.Private.CoreLib.dll`,
  `hostfxr.dll`, `coreclr.dll`, `includedFrameworks`); `pfx` ve secrets yok; `web.config` XML ile
  `OutOfProcess`, `arguments` boş (betiğin InProcess uyarısı bilinen yanlış alarm).
- Migration'lar iki pakette kaynakla birebir: SQL Server 96 (91 + 5), PostgreSQL 132 (127 + 5);
  `Apya.Platform.EntityFrameworkCore.SqlServer.dll` 13.219.328 bayt. Sürüm damgası `1.0.0+834e4f85`.
  `2026.11.06` sürüm notu (#871 maddesi dahil) `Application.Contracts.dll`'de.
- Depoda izlenen wwwroot dosyaları (142) ve `Pages/**/*.js|css` (104) pakettekiyle bayt bayt aynı; pakette
  fazladan görünen 180 dosya Vite parçalarının `.br` / `.gz` kopyaları.
- DbMigrator ZIP'ten açıldı (443 dosya, 412 DLL), sahte bağlantıyla "Migrating database schema..." satırına
  ulaştı (gerçek veritabanına dokunulmadı).
- **#829 elle kontrolü:** Web ZIP'i açılıp Release uygulaması Production kipinde (geçici yerel pfx, SMTP ayarları
  komut satırından — veritabanına ayar yazılmadan) ayağa kalktı: `/health/ready` 200, `/Account/Login` 200.
  `POST /Account/ForgotPassword` → 302 `PasswordResetLinkSent`; sahte SMTP'ye "Şifre Sıfırlama" postası düştü,
  bağlantı `/Account/ResetPassword?userId=…&__tenant=&resetToken=…`. Scriban 7 + kendi motor zinciri Release'te
  sağlam.
