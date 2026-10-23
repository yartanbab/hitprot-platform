# Deploy delta — 2026-10-23 (`e32f7e0c` → `32d46d31`)

Canlı 2026‑10‑23'te ölçüldü: site **bakımda** — her istek (kök, `/Account/Login`, `/health/ready`)
503 ve "Apya — Bakım" sayfası (`app_offline.htm`). 10‑21'de başlayan `e32f7e0c` kurulumu tamamlanmadı;
o günkü DbMigrator koşusunun sonucu doğrulanmadı.

Bu paket `e32f7e0c`'nin **yerine geçer** ve onun taşıdığı her şeyi taşır. Birlikte geçerli belgeler:

1. [`deploy-delta-2026-09-21.md`](deploy-delta-2026-09-21.md) — "Deploy ÖNCESİ yapılacaklar".
2. [`deploy-delta-2026-10-02.md`](deploy-delta-2026-10-02.md).
3. [`deploy-delta-2026-10-14.md`](deploy-delta-2026-10-14.md) — 17 migration'ın listesi, A2 prova tarifi,
   yinelenen proje kodu sayımı, host rolleri.
4. [`deploy-delta-2026-10-20.md`](deploy-delta-2026-10-20.md) — `22930260` → `e32f7e0c` (#686–#791):
   DbMigrator tohumları ve telafileri, TCMB kur işçisi, bilerek kapalı gelenler.
5. **Bu belge** — `e32f7e0c` → `32d46d31` (11 commit, #793–#802).

> 🔴 **`e32f7e0c` paketi (Masaüstü `Apya-Yayin-2026-10-20\`) ARTIK ESKİ** — onu değil, bu paketi
> yükleyin. Oradaki `dogrulama\` araçları (`kurulum.bat`, `ayar-dogrula.ps1`) bu pakette de aynen
> geçerli ve yeni paket klasörüne kopyalandı.

Paket: `Apya-Yayin-32d46d31.zip` (116.380.119 bayt, 4.559 girdi) ve `Apya-DbMigrator-32d46d31.zip`
(57.338.227 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-10-23\`. Sıra klasördeki `OKU-BENI.txt`'te.

| Dosya | `f7919944` | `e32f7e0c` | bu paket (`32d46d31`) |
|---|---|---|---|
| `Pages/Grants/Detail.js` | `6035efaa` | `5906bc0b` | `e5e32d99` |
| `Pages/Grants/Today.js` | `6579fcb7` | `9df2cc37` | `853c3a57` |
| `js/task-detail.js` | `89dada9a` | `a4dfb3c9` | `5517efeb` |
| `js/apya-kanban.js` | `42634812` | `297465de` | `ceabd8c0` |
| `Pages/Notifications/notification-bell.js` | `9163da98` | `fd3d62ec` | `c6b1b91c` |
| `css/apya-shell.css` | `ce7baefa` | `df8c0a00` | `df8c0a00` (değişmedi; canlıda `ce7baefa` görünüyorsa `f7919944` dosyaları duruyor) |

---

## 🔴 DbMigrator ŞART

**Bu aralıkta şema değişikliği, migration ve tohum değişikliği YOK** (`e32f7e0c` → `32d46d31`). Canlı DB
en son 10‑21'de `20260914195529_GrantInterestIdeaDetails`'teydi (73 migration uygulanmış, bu paketin
17'sinden 0'ı). 10‑21 koşusu başarılı olduysa bu paketle DbMigrator yeniden koşmak zararsızdır
(uygulanmış migration atlanır, tohumlar yalnız eksikleri ekler).

Ölçü `kurulum-dogrulama.txt`: **"Bu paketin migrationlari uygulanmis : 17 / 17"**. Başarıyı çıkış
kodundan değil `dbmigrator\Logs\logs.txt`'teki "Successfully completed all database migrations."
satırından ve bu sayımdan doğrulayın.

10‑21 "önce" sayımı (canlı, 11:44): görev 46 (silinmemiş 38) · proje 5 · yorum 2 · ek 2 · fatura/gider/
gelir/kasa/cari/belge/dilim 0 · hibe başvurusu 2 · kullanıcı 32 · kiracı 19. Sonrasında **toplamlar aynı**
kalmalı; silinmemiş görev sayısı sahipsiz alt görev temizliği kadar azalabilir, hibe çağrısı / rol /
izin / rapor bölümü sayısı artabilir.

---

## Bu pakette yeni (#793–#802)

Hepsi şemasız; ayrıntı 10‑22 QA turu.

| PR | Ne |
|---|---|
| #793 | Görev kopyası göremediğiniz gizli alt görevi taşımaz; gizli üst görevin başlığı göremeyene gitmez |
| #794 | Başkasının görevinde ek silme / belge / form / sekme yalnız oluşturan, sorumlu ya da ekip yöneticisi (yükleyen kendi ekini siler) |
| #795 | Başkasını sorumlu yapmak `Tasks.Assign` ister (oluşturma, düzenleme, şablon) |
| #796 | Hibe yazma uçları doğru izni ister: elle giriş = Create, kaynak/şablon silme = Delete, öneri kapat/takip = yazma, talep→müşteri = `AbpTenantManagement.Tenants.Create`, host'ta ilgi yok, dönüşüm ekibi yalnız kiracının etkin kullanıcıları; 403'e götüren bağlantılar gizli |
| #797 | Başvuru panosu danışman listesi yalnız host kullanıcıları; uygulama ekranı bütçesi `Projects.ViewBudget` ister |
| #798 | Zil oturumsuz başlamaz (giriş sayfası 401'leri) |
| #799 | Kanban "Sil" silme izni, proje listesi "Tamamla" sahiplik ister |
| #800 | Takip düğmeleri yalnız yazma izni olana (#796'nın arayüz eşi) |
| #801 | Sürüm notu **2026.10.22** (6 müşteri maddesi) |
| #802 | İki bayat ön yüz testi koda eşitlendi (kod değişmedi) |

🔑 İzin etkisi: talebi müşteriye dönüştürmek artık `AbpTenantManagement.Tenants.Create` ister. Host'ta bu
işi yapan danışmanın rolünde yoksa "Dönüştür" düğmesi kaybolur — gerekiyorsa role bu izin verilmeli.

---

## Deploy sonrası

1. `app_offline.htm` kaldırıldıktan sonra `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu canlıyla birebir (`git hash-object`).
3. `kurulum-dogrulama.txt`: 17/17 ve toplam sayımlar.
4. 🔴 Sunucuda `apya.pargetto.com\wwwroot\uploads\` klasörünü silin (oturumsuz servis edilen 10 PDF; #515
   artık servis etmez ama dosyalar diskte kalır). **`App_Data\uploads` DEĞİL** — o korunur.
5. `dbmigrator` klasörünü ve zamanlanmış görevleri silin.
6. `/Admin/ReleaseNotes`: 09.15 … 10.19 + **10.22** onayı.

## Pakette OLMAYANLAR
- Açık PR #689 (Wildlife Acoustics hibesinin son tarihi) — başka oturumun işi.
- Uzak dal `claude/laughing-knuth-2vmskp`.

## Bilinen ve kabul edilmiş uyarı
Scriban 6.6.0 kritik uyarısı (GHSA-5wr9-m6jw-xx44) — 10‑20 belgesindeki gerekçe aynen geçerli.

## Doğrulama (paket üretimi)
- Testler `32d46d31` üzerinde (2026‑10‑23): Domain 509/509 · Application 359/359 · EF 921/921 ·
  Web 1329/1329 (73 öbek; bellek sınırına takılan 3 öbek yeniden koşuldu, toplam test listesiyle birebir) ·
  ön yüz (vitest) 174/174 dosya. 🔑 Önceki "tam paket" ölçümleri vitest'i içermiyordu; bu turda ilk kez dahil
  edildi ve 10‑19'dan beri kırmızı olan iki bayat test #802 ile düzeltildi.
- Vite demetleri kaynakla güncel (yeniden derlendi, içerik farkı 0).
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; iki pakette de runtime
  (`System.Private.CoreLib.dll`, `hostfxr.dll`, `coreclr.dll`); `pfx` ve secrets yok; `web.config`
  `OutOfProcess` (XML ile; betiğin "InProcess" uyarısı yine yanlış alarm); migration'ların tamamı iki
  pakette (SQL Server 90, PostgreSQL 126); `2026.10.22` sürüm notu `Application.Contracts.dll`'de; sürüm
  damgası `+32d46d31`; paketteki statik dosyalar depoyla bayt bayt birebir (1.233 dosya, fark 0; geri kalan
  2.208 dosya `libs` ve sıkıştırılmış kopyalar); DbMigrator ZIP'ten açılıp sahte bağlantıyla "Migrating
  database schema..." satırına ulaştı (gerçek veritabanına dokunulmadı).
- `dogrulama\ayar-dogrula.ps1` kopyasına beklenen sürüm (`1.0.0+32d46d31`) eklendi; SqlServer DLL boyutu
  değişmedi (12.302.848 bayt), DbMigrator DLL sayısı 412.
