# Deploy delta — 2026-09-21 (`f7919944` → `c967be48`)

**Paket 2026‑09‑25'te `c967be48`'den kesildi** = main `1333048b` + tek anahtarlık yerelleştirme
düzeltmesi (`DisplayName:NewPassword`; eksikliği `ValidationLocalization_Tests`'i main'de kırmızı
bırakıyordu, kullanıcıya görünen etkisi yok).

| Dosya | Boyut | Girdi |
|---|---|---|
| `Apya-Yayin-c967be48.zip` | 121.606.882 bayt | 4.209 |
| `Apya-DbMigrator-c967be48.zip` | 56.259.193 bayt | 454 |

Testler paket commit'inde: Domain 372 · Application 269 · EF 469 · Web 637 (14 öbek, listeyle
birebir) · vitest 801 = **2548 / 0**. ZIP'ten ölçüldü: ters slash 0, iki pakette de runtime,
sır/pfx yok, `web.config` kökte ve `hostingModel="OutOfProcess"` (betiğin InProcess uyarısı
yorum satırına takılıyor), `+c967be48` Web.dll'de, üç migration iki sağlayıcıda iki pakette,
2026.09.21 notunun son maddesi DLL'de, `NotificationTemplates.js` yeni tetikleyiciyi taşıyor.
Vite demeti `npm ci` sonrası yeniden üretildi, commit'lenmiş demetle bit-bit aynı.

Canlıda koşan kod **`f7919944`** = `d8a01af6` + şifre belirleme hotfix'i (2026‑09‑17 hotfix paketi).
2026‑09‑25'te beş dosyanın blob'uyla ölçüldü:

| Canlıdaki dosya | Canlı blob | `d8a01af6` | `f7919944` | `1333048b` |
|---|---|---|---|---|
| `Pages/TenantManagement/Tenants/Index.js` | `9b4d6eba` | `b9601ec3` | **`9b4d6eba`** | `9b4d6eba` |
| `Pages/Grants/Detail.js` | `6035efaa` | `6035efaa` | **`6035efaa`** | `e3312aab` |
| `Pages/Grants/NotificationTemplates.js` | `751e192f` | `751e192f` | **`751e192f`** | `da29af1a` |
| `css/apya-shell.css` | `ce7baefa` | `ce7baefa` | **`ce7baefa`** | `8d304515` |
| `Pages/Grants/Ideas.js` | 302 (yok) | yok | **yok** | `4c15c6c0` |

Bu belge `d8a01af6` üzerine gelen **67 commit**'i anlatır. Hotfix'in içeriği main'e #425 olarak
girdi, yani yeni paket şifre belirlemeyi **geri almaz**.

> Belge ilk yazıldığında taban `ebe3ecd0`'daydı (50 commit). Aynı gün denetimin S1 ve S2 turları
> eklendi: bildirim paketi (#461–#464), regresyon hotfix'i (#465), yaşam döngüsü kapıları
> (#466–#469), dönüşüm doğruluğu (#471–#472) ve bildirim alıcıları (#473–#475).
> **Hiçbiri migration getirmiyor**, şema tablosu değişmedi.

> 🔴 **Hazır `1db6556d` paketi ARTIK ESKİ — YÜKLEMEYİN.** O paket bu 67 commit'in yalnız ilk
> 12'sini içeriyordu ve şifre belirleme hotfix'inden ÖNCE kesildi: yüklenirse hotfix'i ezer,
> iki P0 güvenlik düzeltmesi de gelmez.

---

## 🔴 DbMigrator ŞART — üç şema değişikliği

| Migration | Ne getiriyor |
|---|---|
| `GrantProgramIdentityFields` | Programa amaç, öncelikler, uygun başvuru sahipleri, asgari destek |
| `GrantInterestIdeaPool` | Fikir Havuzu — çağrısız proje fikri |
| `GrantIdeaInvitations` | Fikir daveti + tek hatırlatma |

Üçü de **çift sağlayıcı** (PostgreSql + SqlServer). `dotnet ef database update` yeterli **değildir** —
tohumlama çalışmaz. `DbMigrator`'ı **proje dizininden** çalıştırın ve başarıyı çıkış kodundan değil
log'daki `"Successfully completed all database migrations."` satırından doğrulayın.

---

## Ne iniyor

### 🔴 Güvenlik — iki P0 (bu turda bulundu ve kapatıldı)

- **Kiracı hesabına geçiş artık izin istiyor ve denetim kaydı bırakıyor.** Uç, izni ne olursa olsun
  host bağlamındaki her oturuma açıktı; herhangi bir host kullanıcısı istediği kiracının admin
  oturumunu açabiliyordu. Geçişler artık `AbpSecurityLogs`'a yazılıyor.
- **Dosya indirme ucu sahiplik soruyor.** Dosya adını bilen herhangi bir kimlikli kullanıcı —
  **başka kiracıdan olsa bile** — indirebiliyordu. Kiracı sınırı artık dosya katmanında da uygulanıyor.
- **Fatura kesme ve tahsilat kaydetme alt izin istiyor.** Görüntüleme yetkisi finansal mutasyona
  dönüşüyordu.
- **Hibe dilimini "Ödendi" işaretlemek `Grants.Edit` istiyor.**

### 🔴 Finans doğruluğu

- **Dövizli gider/gelir kasa bakiyesini bozmuyor.** Kasa hareketine ham tutar yazılıyordu; artık
  kur çevriliyor ve uygulanan kur açıklamaya işleniyor. **Aşağıdaki ölçümü yapmadan çıkmayın.**
- Kaleme bağlanmamış giderler hibe gerçekleşmesinde görünüyor · dilim ödeme kapısı tek yerde ·
  negatif tutar reddediliyor · para olayları başvuru akışına ve entity geçmişine yazılıyor.

### Hibe modülü (tur 19–22 + denetim düzeltmeleri)

Fikir Havuzu ve fikir daveti · Çağrılar ekranı (afişli kartlar) · menü sadeleştirme ve Talepler
ekranı · havuz eşleşmesi ve çağrıyla tek tık ilişkilendirme · programa kimlik alanları ·
kurum kararı girişi + itiraz sonucu · Bugün ekranından projeye geçiş 404'ü · danışmanın evrak
sürümü indirirken aldığı 404 · destek hesabının sihirbazla aynı hesaplayıcıdan gelmesi ·
ters aralıklı program şartının reddi.

**Dönüşüm dikişi (bu tur):** reddedilmiş başvuru artık projeye dönüştürülemiyor · dönüşen proje
"Hibe Projesi" kategorisiyle doğuyor (kur köprüsü sekmesi artık görünür) · başvuru özeti projeye
taşınıyor · eşleşmeyen bütçe kalemi sessizce "Diğer"e düşmüyor.

**Dönüşüm doğruluğu (#471–#472, host eylemi):** proje bütçesi istemcinin gönderdiği tutardan değil
başvurunun kayıtlı kalemlerinden kuruluyor · başvuruda karşılığı olmayan kalem dönüşümü durduruyor ·
tamamlanmış kilometre taşı **kapalı** görev olarak açılıyor · bütçe kalemi kodu sıra numarası
(`01`, `02`, …) — aynı kategoriye düşen iki kalem artık çakışmıyor · ikinci dönüşüm hiçbir şey
yazmadan reddediliyor · bütçe uyarısının alıcısı kalmadıysa log'a yazılıyor.

**Yaşam döngüsü kapıları (#466–#468):** son başvuru tarihi geçen çağrı **kendiliğinden kapanıyor**
ve var olan kapanış zinciri koşuyor (tur başına en çok 20 çağrı — birikmiş devir kutuları
doldurmasın) · açık olmayan çağrıya API'den ilgi bildirilemiyor · kapanmış çağrıya başvuru
gönderilemiyor · devretme süreç izine yazılıyor · dönüşüm önizlemesindeki yanlış vaat
("projeden erişilir") düzeltildi.

### Bildirimler

Finans ekseni (bütçe uyarıları, limit aşımı, geciken dilimler) · masaüstü bildirimi ve izin akışı
(Faz 1, şemasız).

**Hibe hunisinin üç sessiz anı (#461–#463):** başvuru gönderildiğinde danışmana bildirim +
süreç izi (eksik evrak sayısıyla) · başvuru projeye dönüştüğünde firmaya bildirim + süreç izi ·
onaylanmış ama dönüştürülmemiş başvuru için host'a 3/7/14 gün hatırlatması.

**Görev bildirimleri (#462):** bitiş tarihi geçen görev artık bildiriliyor (görev+vade başına bir
kez; ilk turda en fazla 30 gün geriye bakılır) · bitiş tarihi ertelenen görev yeni vadesi için
yeniden hatırlatılıyor. **#473:** vade uyarıları atananla birlikte görevi açana da gidiyor —
atanmamış görev artık sessiz kalmıyor; ikisi aynı kişiyse tek bildirim.

**Gönderim hatırlatması (#474):** evrakı tamam ama henüz gönderilmemiş başvuru da son tarihe
7/3/1 gün kala hatırlatılıyor; bildirim sırası kimdeyse ona (firma ya da danışman) gidiyor.

> 🔴 **Yeni hibe tetikleyicileri DbMigrator ister.** `ApplicationSubmitted`, `ConvertedToProject`,
> `ConversionPending` ve `SubmissionDeadlineNear` şablonları tohumlayıcı tarafından eklenir (yalnız EKSİK tetikleyiciler
> eklenir, mevcut şablonlar EZİLMEZ). DbMigrator zaten üç migration için gerekli, ek adım doğmuyor.
> Görev bildirimleri tohumlama gerektirmez.

### Formlar

Açılır liste veri kaynakları ve zincirli alan (tur 16) · koşullu alanlar (tur 17).

### Diğer

Host, müşteri kullanıcısının şifresini eski şifreyi bilmeden belirleyebiliyor (canlıda zaten var —
`f7919944`) · şifrenin baş/son
boşluğu kırpılıyor · proje silinince görevleri de siliniyor (yetim görev kalmıyor) · Genel Bakış
başlık şeridi 102px → 53px · dar panelde Belge sütunu ezilmesi · aşama şablonu düzenleyicisi ·
tema düzeltmeleri · tek seferlik indeks bakım betiği.

---

## 🔴 Deploy ÖNCESİ yapılacaklar

### 1. Kasa bakiyesi ölçümü — atlanamaz

Kur düzeltmesi, bugüne kadar **ham** yazılmış kasa hareketlerini kayıt her güncellendiğinde
yeniden hesaplar. Dövizli kaydı olan bir kiracıda bakiye **gözle görülür şekilde sıçrar**.

```sql
SELECT COUNT(*) FROM AppExpenses e
JOIN AppCashAccounts c ON c.Id = e.CashAccountId
WHERE e.IsDeleted = 0 AND e.Currency <> c.Currency;

SELECT COUNT(*) FROM AppIncomeEntries i
JOIN AppCashAccounts c ON c.Id = i.CashAccountId
WHERE i.IsDeleted = 0 AND i.CashAccountId IS NOT NULL AND i.Currency <> c.Currency;
```

- **0 → risksiz.** Düzeltme yalnız ileriye dönük çalışır, ek iş yok.
- **>0 → çıkmadan önce karar gerekir:** sürüm notuna madde + geçmiş kayıtlar için tek seferlik
  düzeltme betiği. Betik bu pakette **yok**.

### 2. Fatura yetkisi kontrolü

Yalnız "Faturalar" görüntüleme yetkisi verilmiş bir rol varsa, o roldeki kullanıcılar deploy'dan
sonra fatura kesemez ve tahsilat kaydedemez. Üretimdeki rol dağılımı depodan görülemiyor —
deploy öncesi kontrol edin, gerekiyorsa role `Invoices.Create` / `Invoices.Edit` ekleyin.

### 3. Eski dosya bağlantıları

Daha önce kopyalanıp paylaşılmış doğrudan `/file/get/...` bağlantıları artık 404 dönebilir.
Sürüm notunda bu söyleniyor; destek ekibine de hatırlatın.

### 4. Sürüm notu yayın onayı

Kataloğa yazmak **yayınlamak değildir**. `/Admin/ReleaseNotes` ekranından onaylanmayı bekleyen
üç sürüm var: **2026.09.15**, **2026.09.17**, **2026.09.21**. Onaylanmazsa hiçbir madde kiracı
kullanıcısına gitmez.

### 5. 🔴 Tarihi geçmiş ama "Açık" duran çağrı sayısı — ölçün

Çağrılar artık son başvuru tarihi geçtiğinde **kendiliğinden kapanıyor** (#467) ve kapanış zinciri
ilgili firmalara bildirim gönderiyor. Birikmiş devir tur başına 20 çağrıyla sınırlı, ama kaç gün
süreceğini ve kaç firmanın bildirim alacağını önceden bilmek gerekir:

```sql
SELECT COUNT(*) AS GecmisAcikCagri
FROM AppGrantCalls
WHERE IsDeleted = 0 AND TenantId IS NULL AND Status = 1
  AND Deadline IS NOT NULL AND Deadline < CAST(GETDATE() AS date);

-- Bu çağrılarda kaç firma bildirim alacak (yanıtlanmamış talep + gönderilmemiş başvuru):
SELECT COUNT(DISTINCT i.TenantId)
FROM AppGrantInterests i
JOIN AppGrantCalls c ON c.Id = i.GrantCallId
WHERE i.IsDeleted = 0 AND i.TenantId IS NOT NULL AND i.Status IN (0, 1)
  AND c.TenantId IS NULL AND c.Status = 1
  AND c.Deadline IS NOT NULL AND c.Deadline < CAST(GETDATE() AS date);
```

- **0 → risksiz**, davranış yalnız ileriye dönük.
- **Yüksek → deploy'u bilerek seçin:** ilk günlerde firmalara "çağrı kapandı" bildirimi gider.
  Bu **doğru** davranıştır (talepleri bugüne kadar cevapsız kalmıştı), ama destek ekibi haberdar
  olsun. Gerekirse host, kapanmasını istemediği çağrıların `Deadline`'ını önce ileri alabilir.

### 6. Korunacak dosyalar

`reference_plesk_deploy_preserve_files` kaydındaki listeyi deploy öncesi okuyun:
pfx · secrets · `App_Data/uploads` · DataProtection‑Keys.

---

## Deploy sonrası doğrulama

1. `/health/ready` **200** (soğuk başlangıç uzun sürebilir)
2. DbMigrator log'unda `"Successfully completed all database migrations."`
3. `/Admin/ReleaseNotes` — üç sürümün maddeleri görünüyor, onay kararları veriliyor
4. Host admin ile `/TenantManagement/Tenants` → "Hesabına Gir" **çalışmalı**; şerit üzerinden
   "Asıl Hesabıma Geri Dön" **çalışmalı**; `AbpSecurityLogs`'ta iki yeni satır görünmeli
5. Bir projenin kapak görseli ve görev ekleri **açılmalı**; hibe afişi kiracı akışında görünmeli
6. Kasa bakiyesi, deploy öncesi not edilen değerle karşılaştırılmalı (madde 1'de sayım >0 ise)
7. Hibe ekranları açılmalı: `/Grants/DetailHost` · `/Grants/Ideas` · `/Grants/Interests` ·
   kiracı akışındaki katalog. (Bu sayfalar `_StatusMap` sözlüğünü basıyor; sözlükte eksik bir
   enum değeri **500** verir — bu turda bir kez yaşandı ve #465 ile kapatıldı.)
8. `/Grants/NotificationTemplates` — dört yeni tetikleyici listede görünmeli ve adları **okunur**
   olmalı ("Başvuru gönderildi" · "Projeye dönüştü" · "Projeye dönüşüm bekliyor" ·
   "Gönderim son tarihi yaklaşıyor").
   Ham anahtar (`Grants:Notify:Trigger:...`) görünüyorsa tohumlama koşmamıştır.
9. Ertesi gün: tarihi geçmiş "Açık" çağrı kalmamalı (madde 5'teki ilk sorgu azalarak sıfıra
   inmeli); worker log'unda `"otomatik kapatıldı"` satırları görünmeli.

---

*Bu belge 2026‑09‑21 sistem sağlığı denetimi turunda yazıldı. Denetim raporu:
`docs/denetim/sistem-checkup-2026-09-21.html`. Açık karar: `docs/denetim/fin-02-bookamount-karar.md`.*
