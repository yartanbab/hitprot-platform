# Görev durumu: kolon tabanlı modele geçiş — plan

> Durum: **ONAY BEKLİYOR.** Kod yazılmadı. Tetikleyen istek: "Yeni kolon" kutusu
> "Bu kolondaki görevler hangi durumda sayılsın?" diye sormasın; eklenen kolon
> dropdownlarda **yeni bir durum** olarak çıksın.
>
> Not (2026-10-12): Plan 2026-10-03 tarihinde `main @ 7feba545` üzerinde yazıldı ve
> hâlâ uygulanmadı (`apya-kanban.js` aynı soruyu soruyor). Dosya:satır referansları o
> tabana aittir, bugün kaymış olabilir. §6'daki `ReportAppService` #591 ile kaldırıldı.

## 1. Bugünkü model

- `TaskStatus` sabit enum: `Cancelled=0, Todo=1, InProgress=2, InReview=3, Done=4`.
- `BoardColumn` proje bazlı. Sistem kolonu: `StatusValue` 1-4 + `IsSystem=true`.
  Özel kolon: `IsSystem=false`, #490'dan beri `StatusValue` onun da dolu —
  "sayıldığı temel durum".
- `TaskItem.Status` (enum) + `TaskItem.BoardColumnId` (nullable) birlikte tutulur;
  kart özel kolona taşınınca `Status`, kolonun temel durumuna çekilir.

## 2. Ölçüm — neden "durumu tamamen kolona devretmek" mümkün değil

Envanter (src, migration hariç): **48 dosya** `TaskStatus`'a dokunuyor.
`Done` için ~40 saf `==`/`!=` karşılaştırması var. Beslediği hesaplar:

| Alan | Yer |
|---|---|
| İlerleme % / tamamlanma | `ProjectAppService:698`, `ProjectMetricsCalculator:32,97`, `ProjectDetails.cshtml:15`, `TaskAppService:521,645`, `DashboardAppService:234` |
| Gecikme / açık görev | `TaskDeadlineWorker:59,73`, `ShellAppService:366,431`, `ProjectMemberAppService:66`, `DashboardAppService` (5 yer), `DashboardStatisticsProvider:476` |
| İstatistik | `DashboardStatisticsProvider:372,393,415` (zamanında teslim, ort. gecikme, cycle time) |
| Takvim / iCal | `CalendarFeedProvider:248,519`, `IcalFeedAppService:125`, `IcalWriter:50`, `CalendarAppService:114` |
| AI eklentisi | `TasksPlugin:33,59` |
| Bildirim / event | `NotificationDomainEventHandler:98`, `IssueTaskSourceCloseHandler:67`, `TaskStatusChangedEto` |
| Domain | `TaskItem:206,210` (`CompletedDate` doldurma/temizleme) |

Üstüne iki sert kısıt:

1. **`TaskItem.ProjectId` nullable** (`TaskItem.cs:95`). Projesiz görevin kolonu
   olamaz → 4 temel durum geri düşüş yolu olarak kalmak **zorunda**.
2. **`Status` dört sıcak indekste** (`PlatformDbContext.cs:1222-1255`), örn.
   `IX (TenantId, Status, AssigneeId) INCLUDE (...)`. Kolonu Guid'e çevirmek bu
   indeksleri ve her iki sağlayıcının migration zincirini yeniden yazmak demek.

**Sonuç:** "kolon = durum" hedefi, `Status`'u *rapor kategorisi* mertebesine
indirerek karşılanır; enum silinmez.

## 3. Bulgu: bunun için ŞEMA DEĞİŞİKLİĞİ GEREKMİYOR

Kategori taşıyıcısı **zaten var**: `BoardColumn.StatusValue`. Tek fark anlamı —
"kullanıcının seçtiği durum" değil, "bu kolon raporlarda hangi kategoriye girer".
Kategori üç değerdir: **Açık** (1/2/3), **Tamamlandı** (4), **İptal** (0).

Yani migration'sız yapılabilir. Şema değişikliği yalnız şunu istersen gerekir:
ayrı ve adı doğru bir `BoardColumn.Category` kolonu (netlik için; `StatusValue`
sistem kolonunun kimliği olarak kalır). Bu **çift migration + DbMigrator** demek,
kazancı yalnız okunabilirlik. Önerim: **migration'sız yol** (`StatusValue` kategori
olarak yeniden anlamlandırılır; `SetStatusValue` 0'ı da kabul edecek şekilde açılır).

## 4. AÇIK KARAR — kategori nasıl belirlenecek

Soru sormayacaksak kategori bir yerden gelmeli. İki seçenek:

### A) Pano konumundan türetilir  *(önerilen)*
"Tamamlandı" sistem kolonu bitiş çizgisidir: **sağındaki** kolon tamamlanmış,
solundaki açık sayılır. Hiç soru sorulmaz, kural görünür ve sürükleyerek
değiştirilir. "Kolonları düzenle" paneli her satırda türetilen kategoriyi
yazar ("tamamlanmış sayılır"), sınır geçen sürüklemede uyarı verir.
*Risk:* sıra değiştirmek raporu da değiştirir — panel bunu açıkça yazmalı.

### B) Panelde iki durumlu anahtar
Oluştururken sorulmaz (varsayılan Açık); "Kolonları düzenle" satırında
"Bitti sayılsın" anahtarı durur. Öngörülebilir, sihir yok; ama "sorma" isteğinin
kıyısından döner.

Her ikisinde de "Yeni kolon" kutusu **yalnız ad** sorar.

## 5. Fazlar

### Faz 1 — Kolon = durum (migration yok)
1. `BoardColumn`: `GetEffectiveStatusValue()` kategoriden türetilir; `SetStatusValue`
   0'ı (İptal) kabul eder. → **doğrulama:** `BoardColumnStatus_Tests` (7 Fact) güncellenip geçer.
2. `CreateBoardColumnDto.StatusValue` düşer; `SetStatusMappingDto` kategori ucuna döner
   (A seçilirse tamamen kalkar, kategori `ReorderAsync` ile türetilir).
   → **doğrulama:** `dotnet build Apya.Platform.slnx` temiz.
3. `apya-kanban.js`: `askNewColumn` yalnız ad sorar (:1378-1399); panel satırındaki
   "Sayıldığı durum" seçici kategori göstergesine döner (:1641-1690); "+ Yeni kolon"
   alt yazısı düzeltilir (:1797). → **doğrulama:** `apyaKanban.test.js` güncellenir, `npm test` geçer.
4. Elle QA: proje panosunda kolon ekle → adı görev detayı Durum menüsünde,
   Oluştur/Düzenle modalında çıkıyor; ilerleme % beklendiği gibi.

### Faz 2 — Dropdownlar (KAPSAM AYRI KARARLAŞTIRILACAK)
Bugün hâlâ sabit 4 durum gösteren yerler:
- `Tasks/Index.cshtml:304-307` + `:512`, `Projects/ProjectDetails.cshtml:562` + `:727`
  — Durum filtresi ve toplu Durum menüsü.
- `GetTasksInput.Statuses` yanına kolon süzgeci gerekir (`TaskAppService:1065`).
- `SubtaskBoardTabV3.jsx:57,129` — alt görev panosu `SELECTABLE_STATUSES`.
- `apya-quick-task.js:204`, `apya-gantt.js:149` (`STATUS_NAMES`, `status===4 ? 100`),
  `apya-task-dashboard.js:22,27`, `Pages/Tasks/index.js:35,40`, `Pages/Projects/ProjectDetails.js:40,49`.
- **Çözülmemiş soru:** proje seçili DEĞİLKEN (genel /Görevler panosu) filtre hangi
  kolonları göstersin? Tenant'taki tüm projelerin kolonları mı, kategoriler mi?

### Faz 3 — Rapor / dışa aktarım kolon adını göstersin
`ReportExporter.cs:438-445` (PDF), `TaskShareAppService.cs:586-590` (misafir sayfası),
`NotificationDomainEventHandler.cs:95-98` (bildirim etiketi), `IcalWriter.cs:50`.

### Faz 4 — Tek kaynak temizliği
`apya-task-render.js:99` `STATUS_MAP`, `statusMaps.js:3`, `taskMetaV3.js:11` —
üç ayrı sabit durum sözlüğü tek yere iner.

## 6. Bu işin DIŞINDA kalan, yol boyunca görülen kusurlar (dokunulmadı)

- `ReportAppService.cs:65` — `CompletedTaskCount` için `(int)t.Status == 3`, yani
  **InReview'ü tamamlandı sayıyor**. Servisin tek referansı kendi arayüzü; ölü kod.
- `NotificationDomainEventHandler.cs:95-98` — `Cancelled` dalı yok, iptal bildirimi
  genel metne düşüyor.
- `ReportExporter.cs:438-445` — durum etiketleri `Tasks:Status:*` yerine koda gömülü Türkçe.
- `BoardColumnAppService.SeedDefaultsAsync` tembel çalışıyor: proje oluşturma kolon
  üretmiyor, kolonlar ilk pano açılışında doğuyor.

## 7. Riskler

- A seçilirse: kolon sırasını değiştirmek rapor sonucunu değiştirir.
- Mevcut özel kolonların `StatusValue`'su 1-4; kategori yeniden anlamlandırılınca
  `StatusValue=4` olan kolonlar "tamamlandı" sayılmaya **devam eder** (davranış değişmez),
  1/2/3 olanlar "açık" olur — bugünkü davranışla aynı. Veri taşıması gerekmez.
- `defaultColumns()` (apya-kanban.js:633) proje seçili değilken istemcide sahte
  sistem kolonları üretiyor; Faz 2'de bu yolun kategori diline çevrilmesi gerekir.
