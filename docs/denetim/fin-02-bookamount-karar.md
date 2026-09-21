# FIN-02 · Bütçe toplamlarında para birimi karışması — karar dosyası

**Durum:** 🔴 KARAR BEKLİYOR — kod değiştirilmedi.
**Tarih:** 2026-09-21 · **Denetim bulgusu:** FIN-02 (eski adıyla H-10 “BookAmount”)

Bu dosya, kararı verilebilir hâle getirmek için yazıldı. Bir tasarım önerildi, çok ajanlı
adversaryal analizle **çürütüldü**, ve yerine iki gerçek alternatif kaldı. Hangisinin doğru
olduğu **üretim verisi ölçülmeden belirlenemez**.

---

## 1. Sorun

`ProjectBudgetAppService` bütçe toplamlarını `Expense.Amount` / `IncomeEntry.Amount` **ham**
değerleriyle hesaplıyor. Kayıtlar farklı para birimlerinde olabildiği için 100 USD + 1.000 TRY
toplamı **1.100 “TRY”** görünüyor. Bu rakam kullanıcıya `project.Currency` etiketiyle sunuluyor.

Kayıtlarda TRY karşılığı zaten saklı: `Expense.BookAmount` (+ `BookRate`), `FxLedgerStamper` ile
damgalanır. “Öyleyse `Amount` yerine `BookAmount` topla” ilk akla gelen çözüm — ve yanlış.

## 2. Önerilen tasarım ve neden ÇÖKTÜĞÜ

Öneri şuydu:

```
bookValue(kayıt) = BookAmount > 0 ? BookAmount : (Currency TRY ise Amount : NULL)
NULL = sayılamaz → toplama girmez, ayrı sayılır
```

### 🔴 Çökme 1 — düzeltme hedefini ıskalıyor

`20260901111056_AddFxLedgerFields` (ve SqlServer eşleniği) son iki satırında **WHERE olmadan**
şunu çalıştırdı:

```sql
UPDATE AppExpenses SET BookAmount = Amount, BookRate = 1;
UPDATE AppIncomeEntries SET BookAmount = Amount, BookRate = 1;
```

`Currency` kolonu 2026‑05‑17'den beri var, yani o tarihte dövizli kayıt bulunması mümkün.
Böyle bir kayıt bugün `BookAmount = 10.000` (ham **EUR**), `BookRate = 1` taşıyor.

Sonuç: `BookAmount > 0` testini **geçer**, toplama ham döviz tutarıyla girer, NULL olmadığı için
“sayılamayan” listesine de **düşmez**. Yani düzeltme tam da hedeflediği kaydı yakalamaz — üstelik
yanlış rakamı artık “BookAmount kullanıyoruz” gerekçesiyle **sorgulanamaz** hâle getirir.

Bu bugünkü durumdan **daha kötü**.

### 🔴 Çökme 2 — pay çevrilir, payda çevrilmez

`ProjectBudgetLine.ApprovedAmount` ve `FundingTranche.PlannedAmount` **`Currency` kolonu taşımıyor**;
örtük olarak `project.Currency`'dedir ve TRY karşılıkları **hiçbir yerde saklanmıyor**
(`FundingTranche`'de `BookAmount` alanı hiç yok).

`project.Currency = "EUR"` olan bir projede bugün 1.000 EUR bütçe / 500 EUR harcama **%50**
gösteriyor — **doğru**. Harcama TRY'ye çevrilirse 19.000 / 1.000 = **%1.900** olur, `IsOverBudget`
true'ya döner ve aşım bildirimi gider. Düzeltme, bugün **doğru çalışan** tek‑para‑birimli projeyi bozar.

Arayüz proje para birimini TRY'ye sabitliyor (`CreateModal`), ama **API sabitlemiyor**
(`CreateProjectDto.Currency` serbest string, whitelist yok). Canlıda TRY olmayan proje var mı —
**doğrulanamadı**.

### 🟡 Çökme 3 — gerekçe de yanlıştı

Öneri “BookRate damgasız ayırt edicisi değildir” varsayımına dayanıyordu. Kod bunu doğrulamıyor:
`FxLedgerStamper` kur bulamazsa `BookRate`'i de **0** yazar. Yani:

| Kombinasyon | Anlamı |
|---|---|
| `BookAmount = 0, BookRate = 0` | damgalandı, **kur bulunamadı** |
| `BookAmount = 0, BookRate = 1` | **hiç damgalanmadı** (demo tohumu, testler) |
| `BookAmount = Amount, BookRate = 1, Currency ≠ TRY` | 🔴 **migration artığı — ayırt edilemeyen tek kombinasyon** |

Savunma yanlış tehdide karşı kurulmuştu.

## 3. Kapsam sanıldığından çok geniş

Ham `Amount` toplayan **24 nokta** var: 16'sı `ProjectBudgetAppService`'te, 8'i aynı hatayı bağımsız
taşıyan başka servislerde (`BudgetRiskEvaluator`, `GrantImplementation`, `ProjectTimeline`,
`DocumentMatching`, Dashboard ×2, `TrialBalance`).

Yalnız `SpentAmount`'ı düzeltmek **iç tutarsızlık** üretir: kalem toplamları (`LoadLinesAsync`),
görev kırılımı, matris ve portföy ayrı yerlerde hesaplanıyor.

İki ek tuzak:

- **Bildirim ile ekran çelişir.** `BudgetRiskEvaluator.LoadSpentAsync` **kendi** sorgusunu açıp
  `e.Amount` topluyor. Yalnız AppService düzeltilirse panel “%40, sorun yok” derken zil
  “%90 aşıldı” der.
- **Yanmış eşik anahtarları geleceği bastırır.** `OnceKey = {type}:BudgetLine:{id}:{ApprovedAmount}` —
  harcama tabanı anahtarın parçası değil. Yanlış tabanla yanmış bir `:90` anahtarı, taban
  düzeldikten sonra **gerçekten** %90'a çıkıldığında uyarıyı hiç göndermez (bildirim temizliği
  90 gün). Anahtara sürüm eki eklemek bunu çözer ama **halen aşımda olan her kaleme yeniden
  bildirim gider** — bu bir ürün kararıdır, sessizce seçilemez.

## 4. Dışlamanın bedeli

“Sayılamayan kaydı toplamdan çıkar” nadir bir uç durum değil: kurlar kiracı başına ve **elle**
giriliyor, kur çeken hiçbir arka plan işi yok. Kur girmemiş bir kiracıda düzeltmeden sonra
`SpentAmount = 0` olabilir; `BudgetRiskEvaluator` `spent <= 0` ise kalemi hiç değerlendirmediği için
**aşım bildirimi de tamamen susar**. “Yanlış ama dolu” rakamın yerini “doğru ama boş ve sessiz” alır.

Ayrıca `ReportExporter`'ın Excel ve PDF çıktıları “sayılamayan” bilgisini taşımıyor — donöre giden
rapor, dışlanan harcamaları hiç anmadan daha düşük bir “Harcanan” basar.

---

## 5. İki gerçek alternatif

### Alternatif A — tek rakam, ₺ deftere çevir
`bookValue`'yu **`BookAmount`'tan değil `Currency`'den** türet:

```
Currency == "TRY"                              → Amount
Currency != "TRY" && BookRate > 0 && != 1      → BookAmount
aksi hâlde                                     → NULL (kursuz damga VE migration artığı)
```

- ✅ Tek rakam korunur, mevcut ekran düzeni değişmez
- 🔴 Yalnız `project.Currency == "TRY"` iken uygulanabilir; TRY olmayan projede payda hâlâ çevrilmemiş
- 🔴 Kur girmemiş kiracıda rakam boşalır ve uyarılar susar
- 🔴 Kur tam 1,0000 olan gerçek bir döviz kaydı yanlışlıkla NULL sayılır (TRY paritelerinde pratikte imkânsız)

### Alternatif B — para birimi başına topla, çapraz kur yapma ⭐ önerilen
Sistem bu deseni **zaten iki yerde uyguluyor** ve kod yorumlarında açıkça savunuyor:
`ExpenseAppService.GetProjectGroupedAsync` (PB bazında GROUP BY) ve
`ProjectBudgetAppService.GetPortfolioAsync` (“çapraz kur toplamı bilinçli YOK”).

Proje özeti de aynı kurala uyar: tek para birimi varsa tek rakam, birden fazlaysa “karışık” + kırılım.

- ✅ Payda sorununu da çözer — kalem hangi PB'deyse harcamanın o PB'deki kısmıyla karşılaştırılır
- ✅ Yeni kavram getirmez, sistemin kendi desenidir
- ✅ Kur kaydı olmayan kiracıyı hiç etkilemez, rakam boşalmaz
- ✅ Migrationsuz
- 🔴 Ekran tek rakam yerine kırılım göstermeli — UI değişikliği gerekir

---

## 6. 🔴 Karardan önce ÜRETİMDE ölçülmesi gerekenler

Bu üç çıktı gelmeden hangi alternatifin doğru olduğu **belirlenemez**:

```sql
-- (a) Dövizli kayıt gerçekten var mı?
SELECT Currency, COUNT(*), SUM(Amount) FROM AppExpenses
WHERE IsDeleted = 0 GROUP BY Currency;

-- (b) Migration'ın koşulsuz doldurmasıyla 1:1 bozulmuş kayıt sayısı
SELECT COUNT(*) FROM AppExpenses
WHERE IsDeleted = 0 AND Currency <> 'TRY' AND BookRate = 1;

-- (c) TRY olmayan proje var mı? (Alternatif A'nın uygulanabilirliğini bu belirler)
SELECT Currency, COUNT(*) FROM AppProjects WHERE IsDeleted = 0 GROUP BY Currency;
```

(a) ve (b) sıfırsa: sorun bugün canlıda **yok**, düzeltme yalnız ileriye dönük koruma olur ve
her iki alternatif de risksiz uygulanabilir.

(b) sıfırdan büyükse: bozuk kayıtların temizlenmesi ayrı bir karar — çift sağlayıcı veri
migration'ı mı, yoksa proje bazlı `ProjectFxAppService.RecalculateAsync` turu mu?

---

## 7. Karar verilince yapılacaklar (üç ayrı PR)

1. **Karar + tek kaynak.** Saf `bookValue` yardımcısı Domain'de **tek yerde**; `ProjectBudgetAppService`'in
   16 satırı, `BudgetRiskEvaluator.LoadSpentAsync` ve `GetExpensePanelAsync` oradan okusun. İki kopya
   yazılırsa biri güncellenmeden kalır.
2. **Karşılaştırma yapan diğer ekranlar:** GrantImplementation, ProjectTimeline, DocumentMatching,
   Dashboard ×2. Doğrulama ölçütü: aynı proje için /Finance, /Grants ve Genel Bakış **aynı** “harcanan”
   rakamını göstermeli.
3. **Ayrı bulgu olarak kalsın:** `TrialBalanceAppService` aynı hatayı bağımsız taşıyor.

Her hâlde aynı PR'da: eşik anahtarına sürüm eki (+ “eski uyarılar yeniden gönderilsin mi?” kararı),
`ReportExporter` Excel+PDF çıktıları, ve **müşteri odaklı sürüm notu** (SpentAmount kullanıcıya
görünen bir rakam).

## 8. Dokunulmayacaklar

Bilinçli olarak işlem para biriminde kalan ve bu turda **değişmemesi gereken** yerler:
`ExpenseAppService` PB bazlı GROUP BY · `ProjectFxAppService.NetByCurrency` (“kasa gerçeği: her para
birimi kendi içinde toplanır”) · tüm satır bazlı `Amount` gösterim alanları (yanlarında kendi
`Currency`'si basılıyor) · `ProjectAppService.SpentBudget` (Expense'ten değil **zaman kaydından**
türüyor — ayrı bulgu FIN‑12).

---

**Yöntem notu:** Bu dosyadaki çürütme, dört paralel analiz ajanının biri adversaryal olmak üzere
ürettiği bulgulardan damıtıldı; her iddia kod okunarak doğrulandı. Öneri uygulanmadan önce
çürütüldüğü için hatalı bir değişiklik gönderilmedi.
