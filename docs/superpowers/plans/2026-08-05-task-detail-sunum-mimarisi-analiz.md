# Görev Detay Sunum Mimarisi — Analiz ve Karar (FAZ 0)

**Durum:** Analiz tamamlandı. Kod yazılmadı. Onay bekliyor.
**İlişki:** Bu belge, `2026-08-05-task-detail-faz2-genel-sekmesi.md` planıyla **çakışmıyor** —
Faz 2 (Genel sekmesi + Kaydet) mevcut modal kabuğunun İÇİNE içerik dolduruyor, burada
tartışılan "modal mı / gömülü sayfa mı / hibrit mi" kararı ise o kabuğun DIŞ mimarisiyle
ilgili ve zaten büyük ölçüde önceden verilmiş. İki plan paralel yürüyebilir.

---

## Sonuç, önce (rapor detayları aşağıda)

**Seçenek E (hibrit/adaptif) zaten seçilmiş ve kısmen inşa edilmiş durumda** — Faz 1'i yazan
kim ise, aşağıdaki kanıtlarla, bu kararı zaten vermiş ve kod içinde gerekçelendirmiş:

1. `TaskDetailRoot({ taskId, presentation = 'modal', onClose })` — component baştan
   **sunum-bağımsız** tasarlanmış (`src/task-detail/TaskDetailRoot.jsx`). `presentation`
   prop'u zaten var, `'page'` değeri "Faz 5'te" olarak kod yorumunda işaretli.
2. `ModalShell.jsx` yorumu **kelimesi kelimesine** bu spec'in 5. bölümünü öngörmüş:
   > "Faz 5'te eklenecek PageShell aynı `children`'ı portal'sız/backdrop'suz render eder;
   > bu yüzden buraya görev-özel hiçbir şey koyma."
   Yani Genel/Alt Görevler/Dosyalar gibi içerik componentleri **zaten** hem modal hem
   gelecekteki gömülü sayfa için ortak tasarlanıyor — spec'in "aynı formu iki kez yazma"
   kuralı zaten mimariye gömülü.
3. `useTaskUrlSync.js` — **URL senkronu zaten çalışıyor**, spec'in 9. bölümünde istediği
   TAM DAVRANIŞI (`pushState` ile `?task=<guid>`, popstate'te modal kapanır, reload'da
   `readTaskIdFromUrl()` ile aynı görev yeniden açılır) birebir mevcut. Dosyanın kendi
   yorumu: *"Kanonik paylaşılabilir URL (`/Tasks/Detail/{id}`) Faz 5'te gelir; bu parametre
   'aynı sayfada bir görev açık' durumunu temsil eder, paylaşım linki değildir."*
4. **Tam ekran geçişi zaten var** — `DialogContent`'te `fullscreen` prop + `mobile:`
   breakpoint override; mobilde otomatik fullscreen (CSS ile, JS mode-seçimi gerekmeden).
5. **Tek scroll konteyneri zaten doğru** — `ModalShell.jsx`: `grid-rows-[auto_1fr_auto]`
   (header/footer sabit, yalnız içerik `overflow-y-auto`) — spec'in 6. bölümdeki isteği
   birebir karşılanmış.
6. **Genişlik/yükseklik zaten viewport-tabanlı** — `Dialog.jsx`: `w-[min(92vw,1400px)]
   h-[min(88dvh,940px)]` — spec'in kendi önerdiği `min(92vw,1440px)/min(90dvh,960px)`
   formülüyle neredeyse birebir aynı.
7. **Routing sistemi netliği:** Bu proje **client-side router içermiyor** (React Router
   yok, `package.json`'da da yok) — Razor Pages, sunucu tarafında render edilen sayfalar.
   `useTaskUrlSync.js` bunu açıkça söylüyor: *"Razor Pages'te client router yok, bu yüzden
   History API'yi elle sürüyoruz."* Yani "embedded/Jira-benzeri" sayfa demek, React-router'da
   bir route değil, **yeni bir Razor Page** (`Pages/Tasks/Detail.cshtml` gibi) demek —
   tam olarak orijinal planın Faz 5 satırının dediği şey.

**Kısacası: bu analiz "hangi seçenek?" sorusunu yeniden açmak yerine, zaten verilmiş kararı
doğruluyor ve gerekçelendiriyor.** Gerçekten YENİ olan ve karar gerektiren 2 fikir var
(§9), onlar dışında mevcut yol haritası (Faz 1 ✅ → Faz 2 → ... → Faz 5 gömülü sayfa)
aynen sürüyor.

---

## 1. Mevcut görev detay mimarisi (repository bulguları)

*(Önceki iki araştırma ajanının bulgularının bu soruya ilişkin kısmı — tekrar taranmadı.)*

- **Frontend:** React 18 "adaları" (Vite), Razor Pages MVC'ye gömülü, SPA değil.
  Client-router yok. State: TanStack Query v5 (server state) + elle `useSyncExternalStore`
  (UI state, `taskDetailStore.js`) — Zustand/Redux yok, bilinçli tercih.
- **Modal/dialog altyapısı:** Radix UI `Dialog` (`components/ui/Dialog.jsx`), portal +
  focus-trap + ARIA otomatik (Radix'in kendi işi). Z-index: `--apya-z-modal: 1050`,
  bilinçli olarak Bootstrap'in `.modal`'ından (1055) düşük tutulmuş — böylece bu React
  modal içinden açılan eski ABP modalları (ör. dosya onay diyalogları) üstte kalabiliyor.
- **Drawer/sheet altyapısı:** `Sheet.jsx`, aynı Radix Dialog temelinde, `side='bottom'`
  (mobil) / `side='right'` (masaüstü) — şu an task-detail'de KULLANILMIYOR (Documents/
  Expense gibi başka feature'larda kullanılıyor).
- **İki paralel "eski/yeni" sistem bir arada:** `Pages/Tasks/EditModal.cshtml` (jQuery +
  Bootstrap `abp-modal`, zaten merkeze hizalı — commit `73b68df`) hâlâ **varsayılan**
  aktif sistem; zaten Genel/Alt Görevler/Dosyalar/Finans/Bağımlılıklar/Geçmiş sekmeleri VE
  çalışan yorum kutusu var (kullanıcının ilk paylaştığı ekran görüntüsü bu sistemdi — "Otel
  Konaklama Anlaşması" görev paneli). Yeni V2 (`task-detail/` klasörü) şu an yalnız iskelet
  (kullanıcının ikinci ekran görüntüsü — "Piknik için yer ayarla", yalnız başlık/durum/
  öncelik/Vazgeç-Kaydet). **Kullanıcı görsel özellik kaybı yaşamıyor** — eski sistem
  bayrak kapalıyken tam işlevli kalmaya devam ediyor, V2 kademeli olarak yerini alıyor.
- **Görev detayının açıldığı ekranlar:** `_TaskDetailIsland.cshtml` partial'ı 3 sayfaya
  dahil: `Pages/Tasks/Index.cshtml` (Liste + Kanban + **Gantt** — üçü de aynı sayfada view-
  toggle, `frappe-gantt` kütüphanesiyle, ayrı route değil), `Pages/Projects/ProjectDetails
  .cshtml`, `Pages/Board/Index.cshtml` (bağımsız Kanban sayfası). **`Pages/Calendars`
  (Takvim) şu an görev detayını hiç açmıyor** — grep'te `TaskDetailIsland`/`EditModal`/
  `ModalManager` referansı yok. Dashboard'dan açılma da doğrulanmadı (muhtemelen yok).
- **Backend update API'si:** `ITaskAppService.UpdateAsync` (standart ABP `CrudAppService`)
  zaten var, sunum moduna bakmaksızın aynı çağrı kullanılabilir — sunum mimarisi kararının
  backend'e hiçbir etkisi yok.

## 2. Referans görsellerden alınacak / alınmayacak prensipler

**Alınacak** (mevcut tasarım sistemiyle çelişmiyor, zaten kısmen uygulanmış):
borderless/ince aktif-sekme çizgisi navbar (Faz 3'ün işi, henüz yok), ferah grid + bol
boşluk, sağda ikincil meta panel, sade "Sınırlı erişim" göstergesi (**zaten yapıldı**),
üç nokta menüsü (**zaten yapıldı** — Çoğalt/Arşivle "Yakında" rozetli, Sil ayrı), "+" ile
özellik ekleme (Faz 3).

**Alınmayacak:** Mockup'taki spesifik renk paleti/tipografi (koyu tema mockup'ı; bu proje
kendi `--apya-*` token sistemini ve açık/koyu tema desteğini koruyacak), mockup'taki
tam sekme seti (Gantt/Finans/Bağımlılıklar sekme-içi görünümleri birebir kopyalanmayacak,
her biri kendi fazında — Faz 4/6/7 — mevcut backend verisiyle tasarlanacak).

## 3–8. Sunum modeli değerlendirmesi

Spec'in istediği ayrı ayrı Drawer/Modal/Embedded/Fullscreen/Split-view analizi, mevcut
kod zaten E (hibrit) yönünde ilerlediği için tek tabloda birleştirildi:

| Seçenek | Puan (1-5) | Gerekçe |
|---|---|---|
| **Modal** (mevcut, Faz 1) | 5 | Liste/Kanban/Gantt bağlamı korunuyor, zaten inşa edilmiş, test edilmiş, viewport-tabanlı boyutlandırma doğru. Faz 2-4'ün doğal devamı. |
| **Embedded/Jira-benzeri** (Faz 5, planlı) | 4 | Derin çalışma + paylaşılabilir kanonik URL için gerekli, ama şimdi değil — `ModalShell`/`PageShell` ayrımı zaten bunun için hazırlanmış, yalnız yeni bir Razor Page + routing gerektirir (orta maliyet). |
| **Fullscreen** (mevcut, Faz 1) | 5 | Zaten var, ayrı çalışma gerektirmiyor — modal'ın bir `fullscreen` prop'u, mobilde otomatik. |
| **Drawer** (eski sistem, geçici) | 3 | Şu an fiili "drawer" rolünü eski `EditModal.cshtml` görüyor (bayrak kapalıyken). Spec'in önerdiği "hover/bildirim hızlı önizleme" amaçlı YENİ bir preview-drawer **mevcut roadmap'te yok** — bkz §9, açık karar. |
| **Split view** | 2 | Roadmap'te hiç yok, yeni fikir. Sidebar zaten dar olmayan bir uygulamada (LeptonX) ek karmaşıklık + state yönetimi maliyeti yüksek; Gantt/Kanban ile çakışma riski var. Şimdilik önerilmiyor — bkz §9. |

## 9. Gerçekten açık olan kararlar (mevcut roadmap'te YOK, yeni fikirler)

1. **Preview drawer** (spec Seçenek D — hover/bildirim üzerinden salt-okunur hızlı
   görev özeti): Roadmap'te hiç planlanmamış yeni bir fikir. Değerli olabilir
   (özellikle bildirimlerden gelen kullanıcılar için) ama ayrı bir component + kendi
   feature-flag'i gerektirir. **Öneri: Faz 2-5 tamamlandıktan sonra, ayrı bir mini-faz
   olarak değerlendirilsin — şimdi kapsam eklemeyelim.** Onaylıyor musunuz?
2. **Split view**: Roadmap'te yok, yukarıda gerekçeyle düşük öncelik önerdim.
   **Öneri: şimdilik yapılmasın, Faz 5 (embedded sayfa) kullanıcı geri bildirimi
   sonrası ihtiyaç görülürse değerlendirilsin.** Onaylıyor musunuz?
3. **Takvim (Calendars) ve Dashboard'dan görev açma**: Şu an hiçbiri task-detail'i
   açmıyor. Bu spec kapsamında mı eklensin (küçük iş — `_TaskDetailIsland` partial'ını
   o sayfalara da eklemek), yoksa ayrı bir işe mi bırakılsın?
4. **Nested/alt görev açılışı**: Spec §15 soru 10-11 — alt göreve tıklanınca yeni bir
   modal mı açılsın, yoksa mevcut modal İÇİNDE bağlam mı değişsin (breadcrumb: Ana
   Görev / Alt Görev)? Orijinal Faz 1 planı ikinci seçeneği öngörmüştü ("Modal state
   yönetiminde iç içe kontrolsüz modal üretme... Breadcrumb kullan") — bunu onaylıyor
   musunuz, yoksa yeniden mi tartışalım?

## 10. Faz 5'in (embedded sayfa) ön-tasarımı — ileride detaylandırılacak

Bu spec'in istediği "route stratejisi" sorusuna kesin cevap: yeni bir **Razor Page**
(`Pages/Tasks/Detail.cshtml`, route `/Tasks/Detail/{id:guid}`), içinde `TaskDetailRoot
presentation="page"` mount edilecek — `ModalShell` yerine henüz yazılmamış bir
`PageShell` aynı `children`'ı portal'sız render edecek. Bildirimlerdeki/e-postalardaki
görev linkleri bu route'a gidecek (orijinal planın Faz 5 notu: "bildirim deep-link'i hâlâ
eski sayfaya gidiyor — Faz 5'te düzelecek"). Bu, **Faz 5 geldiğinde** ayrı, detaylı bir
plan belgesi olarak yazılacak — şu an yalnız yönü teyit ediyoruz.

## 11. Risk

- Yok denecek kadar az — çünkü bu belge yeni bir mimari KURMUYOR, var olanı doğruluyor.
  Tek gerçek risk: yukarıdaki §9'daki 4 açık karardan biri "evet ekleyelim" olursa,
  o zaman gerçek bir kapsam artışı ve ayrı planlama gerekir.

---

## Sonuç ve talep

Mevcut Faz 1 mimarisi, bu spec'in istediği hibrit/adaptif yaklaşımı zaten doğru şekilde
kurmuş durumda. **Yeniden mimari tartışmasına gerek yok** — mevcut yol haritası (Faz 2
Genel sekmesi → Faz 3 navbar/registry → Faz 4 Alt Görevler/Dosyalar → Faz 5 gömülü sayfa
→ ...) aynen sürsün. Yukarıdaki §9'daki 4 açık karar dışında onay bekleyen yeni bir şey
yok. Onaylarsanız Faz 2 planı (`2026-08-05-task-detail-faz2-genel-sekmesi.md`) üzerinden
devam ederiz.
