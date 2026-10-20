# Deploy delta — 2026-10-20 (`f7919944` → `e32f7e0c`)

Canlıda koşan kod 2026‑10‑20'de yeniden ölçüldü: hâlâ **`f7919944`**. `22930260` (10‑15) dahil
sonraki paketlerin hiçbiri yüklenmemiş.

| Canlıdaki dosya | Canlı blob | `f7919944` | `22930260` | bu paket (`e32f7e0c`) |
|---|---|---|---|---|
| `Pages/TenantManagement/Tenants/Index.js` | `9b4d6eba` | **`9b4d6eba`** | `ba93c6d4` | `ba93c6d4` |
| `Pages/Grants/Detail.js` | `6035efaa` | **`6035efaa`** | `f8a065c7` | `5906bc0b` |
| `css/apya-shell.css` | `ce7baefa` | **`ce7baefa`** | `15ae7aa8` | `df8c0a00` |
| `Pages/Invoices/index.js` | — | `1b877d09` | `59941ed3` | `1ea39bb6` |
| `Pages/Notifications/Index.js` | — | `a43ab8b3` | `94a52dea` | `f87614d8` |
| `js/apya-activity.js` | — | yok | yok | `e5941cab` |

Bu paket `22930260` paketinin **yerine geçer** ve onun taşıdığı her şeyi taşır. Dört belge birlikte
geçerlidir:

1. **[`deploy-delta-2026-09-21.md`](deploy-delta-2026-09-21.md)** — `f7919944` → `c967be48`; oradaki
   "Deploy ÖNCESİ yapılacaklar" listesinin tamamı hâlâ geçerli.
2. **[`deploy-delta-2026-10-02.md`](deploy-delta-2026-10-02.md)** — `c967be48` → `01bd9902`.
3. **[`deploy-delta-2026-10-14.md`](deploy-delta-2026-10-14.md)** — `01bd9902` → `22930260`: 17
   migration'ın listesi, **A2 prova tarifi**, yinelenen proje kodu sayımı, host rolleri.
4. **Bu belge** — `22930260` → `e32f7e0c` (105 commit, #686–#791).

> 🔴 **`22930260` paketi (Masaüstü `Masaüstü 19.10.2026\Apya-Yayin-2026-10-15\`) ARTIK ESKİ** —
> onu değil, bu paketi yükleyin. Daha eski paketler (`208a35a0`, `01bd9902`, `c967be48`) de eski.

Paket: `Apya-Yayin-e32f7e0c.zip` (116.367.074 bayt, 4.559 girdi) ve `Apya-DbMigrator-e32f7e0c.zip`
(57.333.561 bayt, 456 girdi), Masaüstü `Apya-Yayin-2026-10-20\`. Sıra klasördeki `OKU-BENI.txt`'te.

---

## 🔴 DbMigrator ŞART

**Bu aralıkta yeni şema değişikliği YOK** (`22930260` → `e32f7e0c` arasında migration eklenmedi). Ama
canlı `f7919944`'te olduğu için 10‑14 belgesindeki **17 migration'ın tamamı** bu paketle uygulanır;
liste ve riskleri orada.

Bu aralıkta DbMigrator'a eklenen tohum ve telafiler:

| İş | Ne yapar | Veriye etkisi |
|---|---|---|
| Sahipsiz alt görev temizliği (#713) | Üst görevi silinmiş ama kendisi silinmemiş alt görevleri **silinmiş olarak işaretler** (yumuşak silme). Bunlar listede görünmüyor ama proje ilerlemesini ve gecikmiş sayısını bozuyordu. | Satır silinmez; `IsDeleted` 1 olur |
| Hibe kataloğu (#688) | 33 STGM/TÜBİTAK hibe programı host kataloğuna tohumlanır | Yalnız ekler; var olan çağrıya dokunulmaz |
| Hibe bildirim şablonları (#741, #749) | Yeni tetikleyiciler: başvuruda mesaj, sıra devri (e-postası **açık** gelir), evrak yüklendi/onaylandı, danışman ataması | Yalnız eksik şablon eklenir; var olanlar değişmez |

Önce ölçmek isterseniz (salt okunur) — temizlenecek alt görev sayısı:

```sql
SELECT COUNT(*) FROM AppTasks c JOIN AppTasks p ON p.Id = c.ParentTaskId
 WHERE c.IsDeleted = 0 AND p.IsDeleted = 1;
```

Başarıyı çıkış kodundan değil log'daki **`"Successfully completed all database migrations."`**
satırından doğrulayın (`dbmigrator\Logs\logs.txt`).

---

## 🔴 Deploy ÖNCESİ yapılacaklar

10‑14 belgesindeki **A (yedek), A2 (prova), B (yinelenen proje kodu), C (host rolleri), E (korunacak
dosyalar)** aynen geçerli; yalnız ZIP adı `Apya-DbMigrator-e32f7e0c.zip`. A2'deki "önce/sonra sayın"
tablosuna bu pakette şu beklentiler eklenir:

| Satır | Beklenen |
|---|---|
| Görevler (`COUNT(*)`) | **Birebir aynı** (temizlik yumuşak siler, satır silmez) |
| Silinmemiş görevler (`WHERE IsDeleted = 0`) | Yukarıdaki salt okunur sorgunun verdiği sayı kadar azalır |
| Hibe çağrıları | Artar (STGM/TÜBİTAK programları dahil) |

### D. Sürüm notu yayın onayı
`/Admin/ReleaseNotes` — onaysız madde kimseye gitmez. Duyurulmamış sürümler: 09.15, 09.17, 09.21,
09.27, 10.04, 10.05, 10.06, 10.14 + **10.19** (bildirimlerin anında ve her sayfada gelmesi, görev
yorumunda kişiden bahsetme, Ctrl K ile kayıt arama, işlem göstergesi, sessiz saatler, kilit ekranı
tercihi, görev geçmişi ve diğerleri).

### F. Sunucunun dışarıya bağlantısı (yeni)
Döviz cinsinden projesi ya da donörü olan kiracılar için **TCMB kurları her iş günü kendiliğinden**
çekilir (`https://www.tcmb.gov.tr/kurlar/today.xml`, iş günleri 09:00–19:59 arası saatte bir; dövizli
proje yoksa hiç istek atılmaz). Sunucu bu adrese çıkamıyorsa uygulama çalışmaya devam eder: uygulama
log'una saatte bir hata düşer, kurlar elle girilmeye devam eder. Elle girilmiş kura dokunulmaz.

---

## Bilerek KAPALI gelenler

- **Telefon / masaüstü (web push) bildirimi** — kod pakette, kanal **kapalı**: VAPID anahtarları
  tanımlı olmadıkça abonelik açılmaz; kilit ekranına bildirim gitmez. Açmak için anahtar çifti üretilir;
  `WebPush:PublicKey` ve `WebPush:Subject` appsettings'e (ya da ortam değişkenine), **`WebPush:PrivateKey`
  YALNIZ `appsettings.secrets.json`'a ya da ortam değişkenine** (`WebPush__PrivateKey`). Açıldıktan
  sonra durumu Sistem Sağlığı → "Bildirim Kanalları" kartı gösterir. Kişisel tercihler (sessiz saatler
  varsayılan kapalı, kilit ekranında yalnız başlık varsayılan açık) yönetici işlemi istemez.
- **E-posta** — SMTP'ye bağlıdır; sunucudaki SMTP sertifika sorunu çözülmediyse hibe mesaj/devir
  e-postaları da gitmez (uygulama içi bildirim gider).
- `web.config`: `hostingModel="OutOfProcess"`, `applicationInitialization` kapalı (XML ile doğrulandı;
  betiğin "InProcess" uyarısı yorum satırına takılan yanlış alarm).

## Pakette OLMAYANLAR
- Açık PR #689 (Wildlife Acoustics hibesinin son tarihi) — başka bir oturumun işi, main'e girmedi.
- Uzak dal `claude/laughing-knuth-2vmskp` — main'e hiç girmedi.

## Bilinen ve kabul edilmiş uyarı
Derleme Scriban 6.6.0 için kritik bir güvenlik uyarısı (GHSA-5wr9-m6jw-xx44) basar. Bilinen takas:
saldırı kötücül şablon içeriği ister, bu çözümde kimse şablon yazamaz/düzenleyemez (yalnız ABP'nin
statik şablonları render edilir). Scriban 7.x ABP 10.0.2 ile ikili uyumsuz (e-posta şablonları
çöker); ABP ≥ 10.4'e geçince yükseltilecek.

---

## Deploy sonrası doğrulama

1. `/health/ready` 200, `/Account/Login` 200.
2. Yukarıdaki tablonun son sütunu: canlı blob'lar `e32f7e0c` ile birebir olmalı (`git hash-object`).
3. `dbmigrator\Logs\logs.txt` sonunda "Successfully completed all database migrations."
4. Bir firma kullanıcısıyla hibe çağrısına ilgi bildirebiliyor mu (10‑14 telafisi koştu mu).
5. Zil sayacı sayfa yenilemeden güncelleniyor mu (başka bir kullanıcıyla bir görevde ondan bahsedin).
6. Bir görevde Geçmiş sekmesi ("Özellik ekle" menüsünden) değişiklikleri listeliyor mu.

## Doğrulama (paket üretimi)

- Testler `e32f7e0c` üzerinde (2026‑10‑19): Domain 509/509 · Application 359/359 · EF 918/918 ·
  Web 1296/1296 (49 öbek, hiçbiri bellek sınırına takılmadı).
- Vite demetleri kaynakla güncel (yeniden derlendi, içerik farkı 0).
- ZIP: `unzip -t` hatasız, ters eğik çizgi 0, `web.config` / `migrate.bat` kökte; iki pakette de
  runtime (`System.Private.CoreLib.dll`, `hostfxr.dll`, `coreclr.dll`); `pfx` ve secrets yok;
  `web.config` `OutOfProcess` (XML ile); migration'ların tamamı iki pakette (SQL Server 90, PostgreSQL
  126); `2026.10.19` sürüm notu `Application.Contracts.dll`'de; sürüm damgası `+e32f7e0c`; paketteki
  dosya blob'ları depoyla birebir; DbMigrator ZIP'ten açılıp sahte bağlantıyla
  "Migrating database schema..." satırına ulaştı (gerçek veritabanına dokunulmadı).
