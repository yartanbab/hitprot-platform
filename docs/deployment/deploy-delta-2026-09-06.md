# Deploy delta — 2026-09-06 (`ece0755a` → `main`)

> **Hedef SHA bilerek başlıkta değil.** Bu belgenin kendi commit'i `main`'i ilerlettiği için
> buraya yazılan her SHA yazıldığı anda bayatlar. Paketin üretildiği tam commit, ZIP adında
> (`Apya-Yayin-<sha>.zip`) yazılıdır — tek doğru kaynak orasıdır.

**34 commit · PR #309 → #343 · 5 migration (çift sağlayıcı).**

---

## 🔴 TABAN DEĞİŞTİ — 2026-09-02 paketi canlıya İNDİ

Önceki altı delta belgesi tabanı `63cb35c6` (2026-08-27) alıyordu, çünkü 08-31, 09-01 ve
09-02 paketlerinin hiçbiri uygulanmamıştı. **Bu artık geçerli değil.** 2026-09-06'da
dışarıdan ölçüldü:

| Ölçüm | Sonuç |
|---|---|
| `/health/ready` | **200** (15,4 sn — soğuk başlangıç) |
| `/` | **302** (girişe yönlendirme — normal) |
| `/libs/signalr/signalr.min.js` | **200** |
| `/Pages/Grants/Tenant.js` | **200** — hibe modülü canlıda, `63cb35c6`'da bu dosya YOKTU |

Sürüm kanıtı **blob eşleştirmeyle** kapatıldı (bkz. `project-production-deployment`
reçetesi, 3. madde): canlıdan indirilen `Pages/Grants/Tenant.js`'in `git hash-object`
değeri `a43d311361`, bu **`ece0755a` ağacındaki blob ile birebir aynı** —
`63cb35c6`'daki (`f06c90f96f`) ve bugünkü `main`'deki (`998bd81b26`) blob'larla
tutmuyor. `Pages/Tasks/index.js` de aynı sonucu veriyor.

Yani canlı kod **`ece0755a`**, şema da 2026-09-03'te koşan DbMigrator ile aynı seviyede
(21 migration + üç veri tohumu uygulanmıştı). Bu paketin taşıdığı yük buradan itibaren
ölçülüyor: **34 commit, 5 migration** — 09-02 belgesindeki 33 commit / 21 migration
**tekrar uygulanmayacak**.

Ayrıca 09-02 belgesinin "Adım 0"ı (503 → `hostingModel` düzeltmesi + havuzu başlatma)
**kapandı**: site ayakta ve `OutOfProcess` paketiyle çalışıyor. Bu deploy'da Adım 0 yok.

---

## Ne iniyor

| Alan | İş |
|---|---|
| Görevler | Görev finansı (#334 gider/gelir + bütçe bağı, #335 fatura, #336 evrak), göreve form bağlama (#329, misafir doldurması dâhil), özellik kataloğu gerçek modüllerle sınırlandı + yedi yeni görünüm (#326), özellik modalı tek listeye indi (#333), mobil üst şerit + FAB (#330), dosya/görsel listeleri sürükle-bırak kutusunun üstüne alındı |
| Hibe | "Başvuru Aç" yerine "İlgileniyorum" akışı (#327), dernek/vakıf/kulüp profil formu (#339), boş sonuçta kalkmayan iskelet + üst üste binen son tarih etiketleri (#309), okunabilirlik ölçeği (#310), rozet dili (#320) |
| Finans | Bütçe rakamı tek kaynağa indi (#311), projeden bütçe/finans/belge geçişi (#319), menüde "Finans & Bütçe" tek çatı (#315), tutar/kur/oran maskesi (#318, #321, #324) |
| Genel | Genel Bakış baskı çıktısı (#337), Takvim menüde kök başlık + Panolar görev konsolu görünüşleri (#341), takvim Google/Outlook entegrasyonu düzeltmesi (#317), form textarea (#314), proje tarih alanları (#312), proje modalı finans izni (#316), mobil Genel Bakış (#323) |
| Host | Sürüm notu yayın onayı (#322), Sistem Sağlığı markdown özeti (#313) — **ikisi de sürüm notuna girmez** |

---

## Migration — 5 adet, **hepsi salt eklemeli**

```
20260903100503_AddTaskDocuments
20260903121602_Add_ReleaseNotePublications
20260904082319_GrantInterests
20260904085559_AddTaskFormLinks
20260905210029_Add_FirmProfile_NgoFields
```

| Migration | Tablo | Kolon | İndeks | FK |
|---|---|---|---|---|
| `AddTaskDocuments` | 1 | — | 1 | — |
| `Add_ReleaseNotePublications` | 1 | — | 1 | — |
| `GrantInterests` | 1 | — | 3 | — |
| `AddTaskFormLinks` | 1 | 2 | 3 | — |
| `Add_FirmProfile_NgoFields` | — | 6 | — | — |
| **Toplam** | **4** | **8** | **8** | **0** |

Denetlendi: `Up()` gövdelerinde **`DropTable` / `DropColumn` / `RenameTable` /
`RenameColumn` / `AlterColumn` yok** ve **varsayılansız `nullable: false` AddColumn yok** —
yani mevcut satırları kıracak işlem içermiyor. Yine de **deploy öncesi yedek şart**.

Postgres tarafında karşılıkları mevcut (çift sağlayıcı); canlı SQL Server kullanıyor.

---

## Tohumlama — DbMigrator ŞART

`dotnet ef database update` bu deploy için **yeterli değil**: yeni bir izin ve yeni bir
veri tohumu var.

**1. Yeni izin:** `PlatformPermissions.ReleaseNotes.Manage` (host tarafı, `MultiTenancySides.Host`).
Tohumlanmazsa host `/Admin/ReleaseNotes` ekranına giremez.

**2. Yeni tohumlayıcı:** `ReleaseNotePublicationDataSeedContributor`.

> 🔴 **Bu tohum, sürüm notlarının kullanıcıya görünürlüğünü belirler.** Yayın onayı kapısı
> (#322) "karar yoksa gösterme" mantığıyla çalışır. Tohum, **tablo tamamen boşsa** —
> canlıda öyle, tablo bu paketle geliyor — katalogdaki **bütün maddeleri** "onaylı · tüm
> paketler · herkes" olarak geri doldurur. Sonuç: `2026.09.06` sürümünün **67 maddesi
> de onaylı** başlar ve kullanıcılar ilk girişte "Yenilikler" penceresini görür.
> İstenmeyen madde varsa host `/Admin/ReleaseNotes` ekranından kaldırır.
> Bundan **sonraki** her sürüm host onayı bekler; tohum bir daha çalışmaz (tablo dolu).

---

## Deploy adımları

1. **Yedek al** — DB yedeği + site kökünün kopyası.
2. **Korunacak dosyaları filtrele** — `appsettings.secrets.json`, `openiddict.pfx`,
   `App_Data/uploads/*`, `App_Data/DataProtection-Keys/*`, `Logs/*`.
   Ayrıntı: `reference-plesk-deploy-preserve-files`. Bunlar pakette **yoktur**; "temiz
   değiştirme" ile klasörü yenilersen hepsi gider ve site açılmaz.
3. **Web paketini yükle** — `Apya-Yayin-<sha>.zip` site köküne. DLL kilidi verirse site
   köküne boş `App_offline.htm` at, yükle, sonra sil.
4. **DbMigrator'ı çalıştır** — `dbmigrator` klasörüne paketi aç, sunucudaki
   `appsettings.secrets.json`'ı o klasöre **elle kopyala** (yoksa araç localhost'a gider),
   Plesk → Zamanlanmış Görevler → `migrate.bat` → "Şimdi Çalıştır".
   `migrate.bat`'a komut satırı override'ı **yazma** — secrets dosyası zaten her şeyi taşıyor.
   Sonucu çıkış kodundan değil `Logs\logs.txt` içindeki
   `Successfully completed all database migrations.` satırından doğrula.
   🔴 İş bitince zamanlanmış görevi **SİL** (varsayılanı "Günlük 00:00").
5. **App pool'u geri dönüştür.**

---

## Deploy sonrası QA

**Kiracı hesabıyla:**
- Görev detayında Finans sekmesi: gider/gelir ekleme, fatura, bütçe bağı kaydediliyor mu
- Göreve form bağlama; misafir bağlantısıyla form dolduruluyor mu
- Görev Dosyalar/Görseller sekmesi: liste üstte, sürükle-bırak kutusu altta
- Hibe: kurum türü dernek/vakıf seçilince form değişiyor mu; "İlgileniyorum" akışı
- Hibe: uygun çağrı yokken ekranın altı "yükleniyor" kalmıyor; "Yaklaşan son tarihler"
  şeridinde aynı tarihli çağrıların adları üst üste binmiyor
- Menü: Takvim kök başlıkta; Panolar → Görevler / Kart Panosu / Zaman Çizelgesi;
  eski `/Board` adresi kart panosuna yönleniyor (301)
- Genel Bakış → yazdır: künye var, istatistikler kırpılmamış
- İlk girişte "Yenilikler" penceresi 2026.09.06 sürümüyle açılıyor

**Host hesabıyla:**
- `/Admin/ReleaseNotes` açılıyor (yeni izin tohumlandı mı) ve maddeler onaylı görünüyor

---

## Bilinen sınır

Canlı, kiracı oturumlu uçtan uca QA yerelde yapıldı; canlıda deploy sonrası yukarıdaki
listeyle doğrulanmalı. SMTP hâlâ ayarlı değil — şifre sıfırlama postası gitmez.
