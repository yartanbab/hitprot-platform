# Kanban Yeniden Tasarımı — Uygulama Planı

**Kaynak:** [`kanban-yeniden-tasarim.dc.html`](kanban-yeniden-tasarim.dc.html) — 13 ekranın
tamamı, tek dosya, çevrimdışı açılır (pan/zoom ile gezilir). Tasarımla birlikte gelen
`PROMPT.md` (uygulama promptu) repoya alınmadı; bu plan onun doğrulanmış hâlidir.
**Durum:** plan — kod yazılmadı. Her faz bir PR.
**Ön inceleme:** 2026-08-24 · dal `claude/kanban-mockup-review-5d43b9`

Bu plan, mockup paketinin koda göre **doğrulanmış** hâlidir. PROMPT.md'nin üç yerde
kodla çeliştiği, dört yerde eksik kaldığı tespit edildi; düzeltmeler ilgili fazın
içinde işaretli (⚠ PROMPT'tan sapma).

---

## 0. Alınan kararlar

**Kulvar eşlemesi (kullanıcı kararı, 2026-08-24):**

| Yüzey | Rol | Kartta proje adı | Özel kolon |
| --- | --- | --- | --- |
| `Projects/ProjectDetails?view=board` | Proje panosu — KPI şeridi + Liste/Kanban/Zaman sekmeleri | Yok | Var |
| `/Board` | Proje panosu (KPI'sız) — **tek projeye kilitli kalır** | Yok | Var |
| `/Tasks` → Kanban sekmesi | **Genel pano** — mockup 5b buraya uygulanır | Zorunlu | Proje seçiliyse |

⚠ PROMPT'tan sapma: PROMPT 5b'yi `/Board`'a bağlıyordu. `/Board` 2026-06-22'de
bilinçli olarak tek projeye kilitlendi (`Pages/Board/Index.cshtml:24` yorumu +
sayfadaki `apya-hint` metni). Çapraz-proje panosu zaten `/Tasks` kanban
sekmesidir (`showProjectName: true`, `projectId` filtreden gelir ve null olabilir).
"Tümü" `/Board`'a geri **konmayacak**.

**Ortak standart (üç yüzeyde birebir aynı):** kart anatomisi ve 5px öncelik
şeridi · kolon başlığı (nokta + ad + sayı + WIP + ＋ + ⋯) · sürükleme hedefi ·
gecikme/risk dili · boş kolon metinleri · kart detay çekmecesi · toplu seçim
çubuğu · renk token'ları. Tek kaynak: `wwwroot/js/apya-kanban.js` +
`wwwroot/css/kanban.css` + `Pages/Shared/_KanbanBoard.cshtml`.

**Kulvara özel (bilinçli fark):** çevre araç çubuğu, KPI şeridi (yalnız proje
konsolu), kart üstü proje adı (yalnız `/Tasks`), kulvar seçimi (yalnız `/Tasks`).

---

## 1. Faz 0 — Üç düzeltme (migration yok · 1 PR · küçük)

Mockup'ta da PROMPT'ta da geçmeyen, incelemede bulunan kusurlar. Bağımsız ve hemen
değer üretir; sonraki fazların hepsi bunların üstüne biner.

### 0.1 İzin boşluğu (gerçek hata)

`apya-kanban.js` içinde `Projects.Edit` istemci kontrolü **yok**. "Kolon ekle"
karosu ve ⋯ menüsü yetkisiz kullanıcıya da çiziliyor; tıklayınca API 403 dönüyor.

- `apya-kanban.js` · `create()`: `canEditColumns` türetilir —
  `(typeof opts.canEditColumns === 'boolean') ? opts.canEditColumns : abp.auth.isGranted('Platform.Projects.Edit')`
- `renderColumns()`: ⋯ dropdown bloğu ve `js-add-col` karosu **yalnız** `canEditColumns` true iken üretilir.
- Olay bağlamalarındaki `if (customColumnsAllowed)` guard'ına `&& canEditColumns` eklenir.
- **Ayrım korunur:** yetkisiz kullanıcı özel kolonları *görür* (kartlar orada durur), yalnız düzenleyemez.

> Doğrulama: `Projects.Edit` izni olmayan bir kullanıcıyla `/Board` → "Kolon ekle"
> karosu ve ⋯ düğmesi DOM'da yok; `Tasks.ChangeStatus` varsa kart sürükleme çalışıyor.

### 0.2 Kart id rozeti gerçek kodu göstersin

Bugün rozet GUID'in ilk 4 hanesi (`apya-kanban.js:128`), oysa `TaskDto.Code`
("GRV-17") mevcut ve liste/alt görev satırlarında zaten kullanılıyor.

- `buildCard()`: `task.code` varsa onu bas, yoksa mevcut GUID kısaltmasına düş.

> Doğrulama: aynı görevin kanban kartındaki rozet ile liste satırındaki kod birebir aynı ("GRV-17").

### 0.3 Sistem kolonunda WIP rozeti görünmüyor

`_KanbanBoard.cshtml` sistem kolonlarına `.kanban-wip` basmıyor; `renderColumns`
sistem kolonuna `data-wip-limit` yazmıyor. API'den WIP verilse bile görünmez.

- `_KanbanBoard.cshtml`: dört sistem kolonunun başlığına `<span class="kanban-wip d-none" title="WIP limiti"></span>`.
- `renderColumns()`: sistem kolonu eşlemesinde `c.wipLimit` varsa `data-wip-limit` yaz, yoksa attribute'u **kaldır** (bayat değer kalmasın).

> Doğrulama: konsoldan `apya.platform.projects.boardColumn.update(<sysColId>, {name:'Sürüyor', colorClass:'warning', wipLimit:4})`
> → başlıkta "5 / 4" rozeti negatif tonda çıkıyor; kart taşımak engellenmiyor.
> (WIP'i UI'dan yazma Faz 2'de gelir; bu adım yalnız görüntüleme yolunu açar.)

---

## 2. Faz 1 — Adlandırmayı birleştir: "Yapılacak" (migration yok · 1 PR · küçük)

Seed kolonu "Yapılacak", durum etiketi "Bekliyor" diyor. Karar: **her yerde
"Yapılacak"**; seed adı zaten doğru.

⚠ PROMPT'tan sapma: PROMPT 3 dosya sayıyor, gerçek yüzey **9 dosya**:

| Dosya | Satır | Değişiklik |
| --- | --- | --- |
| `Domain.Shared/Localization/Platform/tr.json` | 320 | `Tasks:Status:Todo` → "Yapılacak" |
| `Web/Pages/Shared/_KanbanBoard.cshtml` | 14 | sabit "Bekliyor" başlığı |
| `Web/wwwroot/js/apya-task-render.js` | 91 | `STATUS_MAP[1].text` |
| `Web/Pages/Tasks/index.js` | 40 | `STATUS_LABELS['1']` |
| `Web/Pages/Projects/ProjectDetails.js` | 49 | `STATUS_LABELS['1']` |
| `Web/Pages/Tasks/CreateModal.cshtml.cs` | 94 | durum listesi tuple'ı |
| `Web/Pages/Tasks/EditModal.cshtml` + `.cshtml.cs` | 63 / 76 | durum listesi tuple'ı |
| `Web/wwwroot/dynamic-assets/src/task-detail/statusMaps.js` | 5 | React adası |
| `Web/wwwroot/dynamic-assets/src/task-detail/v3/taskMetaV3.js` | 13 | React adası |

**Son iki dosya React adasında** → `npm run build` şart, yoksa görev detay modalı
"Bekliyor" demeye devam eder (üretilen `wwwroot/js/task-detail.js`).

Ayrıca `dynamic-assets/src/test/apyaTaskRender.test.js:64` bugün
`expect(html).not.toContain('Bekliyor')` diyor; rename'den sonra bu assert sessizce
anlamsızlaşır → `'Yapılacak'` ile güncellenir.

**Dokunulmayacak:** `responses.js`, AiCenter, Grants, ReportExporter'daki "Bekliyor"
kelimeleri farklı alanlara ait (geri bildirim yanıtı, AI kuyruğu, hibe kilometre taşı).

> Doğrulama:
> 1. Görev bağlamında "Bekliyor" araması sıfır sonuç (yalnız alan-dışı dosyalar kalır).
> 2. `npm test` (dynamic-assets) tüm testler yeşil.
> 3. `npm run build` sonrası üretilen `wwwroot/js/task-detail.js` içinde "Yapılacak" geçiyor.
> 4. `dotnet build Apya.Platform.slnx` geçer (Web durdurulmuş olmalı — MSB3021 tuzağı).
> 5. Tarayıcı: liste durum çipi, kanban ilk kolon başlığı, filtre menüsü, toplu işlem
>    menüsü, görev detay modalı — hepsi "Yapılacak".

> Tuzak: `npm run build` sonrası `git diff` bundle'da yalnız beklenen değişikliği
> göstermeli; satır sonu farkı yüzünden "hayalet-M" dosyalar çıkarsa
> dosyayı silip `git checkout --` ile geri al. `yarn.lock` değişmişse **commit etme**.

---

## 3. Faz 2 — Kolon yönetimi: 3a + 3b + 3c (migration yok · 2 PR · büyük)

⚠ PROMPT'tan sapma: PROMPT "mevcut uçlarla yapılır" diyor. Uçlar yeterli, ama
**sistem kolonları bugün statik markup'tan geliyor** — DB'deki ad/renk/WIP hiç
okunmuyor, ⋯ menüsü basılmıyor (`apya-kanban.js:196` sistem kolonuna yalnız
`data-column-id` yazıyor). "Sistem kolonunu yeniden adlandır" bugün UI'da
imkânsız. Bu fazın ilk yarısı bu boşluğu kapatmak.

### PR 2a — Kolonları DB'den render et

- `_KanbanBoard.cshtml` boşalır: yalnız `<div class="kanban-board mt-2"></div>` kalır; dört kolon JS'ten basılır.
- `apya-kanban.js`: tek `renderColumns(cols)` hem sistem hem özel kolonu üretir.
  - `SYS` haritası korunur (`render()` görevleri `document.getElementById(SYS[task.status])` ile yerleştiriyor) — sistem kolonunun kart kabı **aynı id'lerle** doğar.
  - **Proje seçili değilken** (`/Tasks` → "Tümü") DB kolonu yoktur: yerleşik varsayılan tanımdan (ad = `Tasks:Status:*` etiketleri, renk = bugünkü token eşlemesi) çizilir.
- Kolon başlığı ortak bileşen: nokta + ad + sayı çipi + WIP rozeti + ＋ (kolona görev ekle) + ⋯ (yalnız `canEditColumns`).
- Boş kolon metinleri (mockup 5a): kolon başına özel metin — "Henüz iş başlamadı / Kart sürükleyerek buraya taşı…", "Test bekleyen iş yok", "Bu projede henüz kapatılan görev yok".

> Doğrulama: üç sayfada da (Board, Tasks, ProjectDetails) board aynı görünüyor;
> sistem kolonunun adını API'den değiştirince başlık değişiyor; "Tümü"de dört kolon
> varsayılan adlarla geliyor; boş kolonda metin çıkıyor, dolu kolonda çıkmıyor.

### PR 2b — Düzenleme yüzeyi (3a/3b/3c)

- **Yerinde düzenleme (3a):** başlığa tıkla → `<input>`, 64 karakter sayacı, Enter kaydeder / Esc iptal. Mevcut SweetAlert `askName` akışının yerini alır.
- **⋯ menüsü:** ad + 6 renk + WIP tek formda, **tek `UpdateAsync` çağrısı** (kısmi güncelleme yok — mevcut `saveColumn` deseni korunur).
- **Sistem kolonu (3c-2):** "Kolonu sil" kilitli görünür, tıklanınca gerekçe + "Yeniden adlandır" alternatifi. API'deki `UserFriendlyException` mesajı korunur.
- **Silme onayı (3c-1):** kolonun kart sayısı + kartların döneceği durum **isim isim** listelenir (veri DOM'daki kartlardan okunur, ek istek yok).
- **"Kolonları düzenle" paneli (3b):** sırala + ad + renk + WIP tek panelde, "n değişiklik bekliyor" + tek kaydet → değişen satır başına `UpdateAsync`, sıra için `ReorderAsync`.
- **Sıralama (3c-5):** ⚠ **`ReorderAsync` bugün ölü uç** — hiçbir yerden çağrılmıyor, sıra yalnız `localStorage`'da (`apya-kanban.js:386`, `kbKey('order')`). Mockup "sıra kullanıcıya değil **projeye** ait" diyor → sürükle-bırak sonunda `colSvc.reorder(projectId, ids)` çağrılır, hata olursa kolon eski yerine döner + bildirim. `localStorage` **sıra** anahtarı kalkar; **genişlik** anahtarı (kullanıcı tercihi) kalır.
- **Yetkisiz görünüm (3c-3):** Faz 0.1'de kapatıldı, burada panel de gate'lenir.
- **Proje seçilmemiş (3c-4):** `/Tasks` → "Tümü"de kolon düzenleme arayüzü hiç render edilmez; tek satırlık gerekçe + "Proje seç" eylemi gösterilir.

> Doğrulama: (a) sistem kolonu adı UI'dan değişiyor, silme kilitli ve gerekçeli;
> (b) yalnız WIP değiştirildiğinde ad ve renk bozulmuyor (tek kayıt, üç alan birlikte);
> (c) kolon sırası değiştirilip **başka bir tarayıcıda** aynı proje açılınca aynı sırada;
> (d) özel kolon silindiğinde onay ekranındaki durum listesi ile silme sonrası
> kartların gittiği kolon birebir uyuşuyor, hiçbir görev kaybolmuyor;
> (e) "Tümü"de ⋯ ve "Kolon ekle" DOM'da yok.

---

## 4. Faz 3 — Üç yüzeyi standartlaştır: 5a + 5b (migration yok · 1 PR · orta)

Faz 2 bittiğinde kolon/kart tek yerden besleniyor olacak; bu faz **çevreyi** hizalar.

- **`/Tasks` (genel pano):** `showProjectName` zaten `true`. Eklenecek: kart üstünde renkli ince şerit + proje adı (bugün düz metin), "Tümü"de özel kolonların gizli olma gerekçesi, özel kolonda duran kart için "Projede özel kolon: X" satırı (kolon kaybolmasın).
- **`/Board`:** ortak standarda çekilir (kolon başlığı, boş durumlar, kart anatomisi). Proje seçici ve "her zaman tek proje" davranışı **korunur**; `showProjectName: false` kalır.
- **`ProjectDetails`:** KPI kutusu ↔ filtre çipi aynı state — **zaten uygulanmış** (`ProjectDetails.js:456-468`, ortak `filterState`). Burada yalnız kolon başlığı özetleri ve boş durumlar hizalanır.
- **Kulvar (`Grupla: Proje / Atanan`)** yalnız `/Tasks`'a eklenir; seçilince kart üstündeki proje adı kulvar başlığına taşınır ve kart sadeleşir.
- Çevre bileşenleri elle çizilmez: `.apya-proj-kpi*`, `.apya-console-tab`, `.apya-console-bar[aria-pressed]`, `.apya-chip-*` mevcut sınıflarıyla kullanılır (mockup'taki hexler yeniden yazılmaz).

> Doğrulama: proje panosunda kartta proje adı yok, `/Tasks`'ta her kartta var;
> `/Tasks` "Tümü"de kolon yönetimi yok, proje seçilince açılıyor; üç sayfada
> kolon başlığı ve boş durum metinleri birebir aynı DOM'u üretiyor.

---

## 5. Faz 4 — Özel kolon → durum eşlemesi: 4a (migration YOK · 1 PR · orta)

⚠ PROMPT "yeni backend gerekir" diyor — doğru, ama **şema değişikliği yok**:
`BoardColumn.StatusValue` sütunu zaten var (`Domain/Projects/BoardColumn.cs:23`).

- **Domain:** `BoardColumn.SetStatusValue(int?)` — sistem kolonunda değişimi reddeder (`IsSystem` guard).
- **Contracts:** `CreateBoardColumnDto.StatusValue`, `UpdateBoardColumnDto.StatusValue` (null = durum değişmesin, bugünkü davranış).
- **AppService:** `MoveTaskToColumnAsync` — özel kolonun `StatusValue`'su varsa `ChangeStatus(...)` **de** uygulanır ve kolon bağı **korunur** (bugün sistem kolonunda bağ temizleniyor, özel kolonda bağ set ediliyor).
- **Yeni uç:** `ApplyStatusToTasksAsync(Guid columnId)` — "mevcut kartları da güncelle" seçeneği; kolondaki kartlara toplu `ChangeStatus`.
- **Liste tarafı:** `statusChip(status, boardColumnName)` bugün kolon adını durumun **yerine** basıyor; artık **iki çip** döndürür (durum çipi + kolon adı çipi) → `apyaTaskRender.test.js`'teki "durum yerine onu gösterir" testi bu davranışla birlikte güncellenir.

> Doğrulama: özel kolona "Testte" eşlenip kart sürüklenince (a) kart kolonda kalıyor,
> (b) liste "Testte" filtresi kartı buluyor, (c) Gantt/rapor aynı durumu gösteriyor;
> eşleme "Durum değişmesin"e çekilince bugünkü davranışa dönüyor;
> sistem kolonuna `StatusValue` yazma denemesi reddediliyor.

---

## 6. Faz 5 — Panoda toplu seçim: 4c (backend YOK · 1 PR · orta)

⚠ PROMPT'tan sapma: PROMPT "yeni backend gerekir" diyor — **gerekmiyor**.
`createBulkSelection` ve `runSequential` hazır (`wwwroot/js/apya-task-console.js:110`),
Tasks listesi tam olarak prompt'un tarif ettiği sıralı akışı çalıştırıyor
(`Pages/Tasks/index.js:508`). Tek iş: seçimi tablodan karta genelleştirmek.

- `createBulkSelection`'a `itemSelector` / `idAttr` seçenekleri (varsayılanlar bugünkü tablo davranışını korur → çağıran taraf değişmez).
- Kartta onay kutusu (hover'da beliren), Shift+tık aralık, Ctrl/⌘+tık tek tek, Esc seçimi bırakır.
- Alt çubuk mevcut `.apya-console-bulkbar` bileşeniyle: Taşı / Ata / Öncelik / Son tarih / İptal et.
- Hata veren kart geri döner ve **adı bildirimde geçer** (`runSequential` sonucundan).
- "Geri al": son toplu işlemin `{id → eski değer}` haritası tutulur, tersine çalıştırılır (istemci tarafı, sunucuda iz bırakmaz).

> Doğrulama: 3 kart seçilip "Sürüyor"a taşındığında üçü de kolonu değiştiriyor ve
> sayaçlar güncelleniyor; biri hata verirse o kart eski kolonunda kalıyor ve adı
> bildirimde geçiyor; "Geri al" üçünü de eski durumuna döndürüyor; Esc seçimi bırakıyor.

---

## 7. Faz 6 — İptal kolonu: 4b (⚠ MİGRATION İSTER · onay şart · 1 PR · orta)

⚠ PROMPT'tan sapma: PROMPT "mevcut Status'la çalışır" diyor. Kolonu **göstermek**
için doğru, ama mockup'taki "Sebep: kapsam dışı bırakıldı" ve "geri sürüklenince
eski durumuna döner" için `TaskItem`'da alan **yok**.

**Şema (kullanıcı onayı gerekir):**

- `TaskItem.CancelReason` (string?, 256)
- `TaskItem.CancelledDate` (DateTime?)
- `TaskItem.StatusBeforeCancel` (int?)

**Domain:** `Cancel(reason, now)` ve `RestoreFromCancel()` — `ChangeStatus`
çağrılmadan önce eski durum saklanır, geri dönüşte oradan okunur.

**Migration:** çift sağlayıcı → **iki** migration (Postgres + SqlServer),
`CLAUDE.md §3`'teki komutlarla. Deploy'da DbMigrator şart.

**UI:** sağda daraltılmış, varsayılan **kapalı** İptal kolonu; board üstünde
"İptalleri göster" anahtarı (`localStorage`, mevcut `apya-kanban-*` deseni);
kartta iptal tarihi + sebep.

> Not: board bugün `statuses` filtresi göndermiyor, yani iptal kartları zaten
> payload'da geliyor — `SYS[0]` olmadığı için sessizce düşüyorlar. Kolon eklenince
> ek istek olmadan görünür olurlar.

> Doğrulama: kart İptal'e sürüklenince sebep soruluyor ve kart orada görünüyor;
> geri sürüklenince **eski** durumuna dönüyor (Yapılacak'a değil); kolon kapalıyken
> board yerleşimi bozulmuyor; iki migration da üretildi ve DbMigrator log'unda
> "Successfully completed all database migrations." satırı var.

---

## 8. Faz 7 — Kart ve risk dili: 1a + 2a + 2b (⚠ DTO işi · 1 PR · orta)

⚠ PROMPT'tan sapma: PROMPT §7 bunu istemci hesabı sayıyor. "2 yorum · 3 ek" ve
"ENGELLİ · APY-402 bekleniyor" verisi **liste payload'unda yok**: `GetListAsync`
yalnız kolon adı, etiket, favori, alt görev sayısı ve proje adını dolduruyor
(`Application/Tasks/TaskAppService.cs:212`); `Comments`/`Attachments`/`PredecessorIds`
sadece `GetAsync`'te geliyor.

- **Contracts:** `TaskDto.CommentCount`, `TaskDto.AttachmentCount`, `TaskDto.BlockedByCodes`.
- **Application:** mevcut `PopulateTagsAsync` / `PopulateSubTaskCountsAsync` deseniyle **batch** doldurucular (N+1 yok).
- **Kart anatomisi (1a):** id rozeti (Faz 0.2), öncelik çipi, başlık, etiketler, alt görev ilerlemesi, atanan, son tarih, yorum/ek sayısı. 5px öncelik şeridi `data-priority` ile — **mevcut CSS korunur**.
- **Risk dili (2b):** gecikmiş kart kırmızı kenar + gün sayısı + neden satırı; engelli kart engelleyen görev kodu; kolon başlığında "n gecikmiş / n riskli" özeti; board üstünde tek satır uyarı şeridi.
- **Kart detay çekmecesi (2a):** mevcut `task-detail.js` adası üstüne; durum ve öncelik satır içi düzenlenir.

> ⚠ **Kapsam dışı:** mockup'taki "Ort. akış süresi 4,2 gün" ve "Zamanında %82"
> için veri yok — sayfalanmış liste üzerinden istemcide hesaplamak yanıltıcı olur.
> Ayrı bir metrik ucu ister; ürün kararı bekliyor.

> Doğrulama: kartta yorum/ek sayısı gerçek kayıtlarla uyuşuyor; 50 kartlık board
> yüklenirken istek sayısı artmıyor (batch doldurucu, N+1 yok); gecikmiş kart
> sayısı kolon başlığındaki özetle birebir aynı.

---

## 9. Ürün kararı bekleyenler (uygulamadan önce netleşmeli)

| Konu | Neden karar gerekiyor |
| --- | --- |
| **"Bu panoda gizle"** (3c-2) | Kolon görünürlüğü için alan yok. `BoardColumn.IsHidden` (projeye ait, herkes aynı) mı, kullanıcı bazlı tercih mi? Her iki durumda **migration**. |
| **"Kolonu temizle"** (3a) | Toplu durum değişikliği ucu gerekir. Kartlar nereye gider — durum kolonuna mı, İptal'e mi? |
| **4a felsefe değişimi** | "Özel kolon Status'u değiştirmez" bugünün **kuralı**. Eşleme açılınca kural koşullu hâle gelir, listede iki çip görünür. |
| **Kolon sırası kimin?** | Bugün kullanıcı bazlı (`localStorage`), mockup projeye ait diyor. Faz 2b bu kararı uyguluyor — sıra tüm ekip için ortak olur. |
| **Akış metrikleri** | "Ort. akış süresi", "Zamanında %82", "Bu hafta +7" için sunucu tarafı metrik ucu gerekir. |

---

## 10. Bu plana dâhil OLMAYANLAR

- **1b — yoğun kulvar düzeni** (yüzlerce görev, tek satır kart): ayrı görünüm modu; Faz 3'teki "Grupla" yalnız kulvar başlığı üretir, yoğun satır kartı üretmez.
- **1c — akış odaklı koyu tema keşfi:** keşif; `[data-theme="dark"]` geri açılırsa referans.
- **1d — boş durum şablonları:** "Hibe başvuru akışı / Ay sonu finans kapanışı" kolon şablonu backend'i yok (yeni entity + seed). Ayrı iş.
- **2c — mobil (390px):** durum sekmeleri + tek kolon + alt eylem çubuğu; mevcut mobil kabuk varyantlarıyla (`--apya-mobile-*`) birlikte planlanmalı.
- **⌘K pano komutları**, **kolon otomasyonu**, **kolonu arşivle:** mockup'ın "Sırada" notlarındaki fikirler; backlog.

---

## 11. Çalışma öncesi kontrol listesi (worktree)

```bash
abp install-libs
```

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm ci
```

> `abp install-libs` sonrası `npm ci`'yi atlama (yarn peer bağımlılığı düşürüyor,
> frontend testleri toptan patlıyor). `dynamic-assets/yarn.lock`'taki değişikliği
> **commit etme**. Build öncesi çalışan Web uygulamasını durdur (MSB3021).

**Faz sırası:** 0 → 1 → 2a → 2b → 3 → 4 → 5 → 6 → 7. Faz 0 ve 1 birbirinden
bağımsız; 2'den sonrası sıralı. Migration yalnız Faz 6'da.
