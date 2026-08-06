# Görev Detay Ekranı — Birleşik Yol Haritası

**Bu belge tek referanstır.** Önceki üç kaynağı birleştirir:
1. `2026-08-01-task-detail-adaptive-faz1.md` — orijinal 9 fazlı plan (Faz 1 uygulandı)
2. `2026-08-05-task-detail-faz2-genel-sekmesi.md` — Faz 2 detay planı
3. Kullanıcının paylaştığı 13 fazlı spec (Faz 0–12, başka bir AI tarafından üretildi)

**Son güncelleme:** 2026-08-05 · **main HEAD:** `07967e1`

---

## 1. Bugünkü durum

Görev detayının **iki sistemi bir arada** çalışıyor:

| | Eski sistem | Yeni sistem (V2) |
|---|---|---|
| Dosya | `Pages/Tasks/EditModal.cshtml` | `wwwroot/dynamic-assets/src/task-detail/` |
| Teknoloji | jQuery + Bootstrap `abp-modal` | React 18 + Radix Dialog + TanStack Query |
| Durum | **Varsayılan AKTİF** | Bayrak arkasında, varsayılan KAPALI |
| İçerik | Genel/Alt Görevler/Dosyalar/Finans/Bağımlılıklar/Geçmiş + yorumlar — **tam işlevli** | Yalnız iskelet: başlık, durum/öncelik rozeti, erişim rozeti, ⋯ menü, Vazgeç/Kaydet — **içerik yok** |

Bayrak: `localStorage['apya.taskDetail.v2'] = '1'` veya `?taskui=v2`.

**Kritik nokta:** V2 gövdesinde şu an yalnızca `"Genel sekmesi Faz 2'de eklenecek."` yazıyor.
Bayrak varsayılan kapalı olduğu için kullanıcı bir kayıp yaşamıyor, ama **Genel sekmesi
gelene kadar bu işten kullanıcıya sıfır fayda gidiyor.** Yol haritasının sıralaması bu
gerçeğe göre kuruldu.

---

## 2. Faz eşleme tablosu

Kullanıcının 13 fazlı spec'i ile orijinal 9 fazlı planın karşılıklı haritası ve birleşik sonuç:

| Yeni spec | Orijinal plan | Birleşik | Durum |
|---|---|---|---|
| FAZ 0 — Analiz/karar | — | — | ✅ **Bitti** (2026-08-05, `sunum-mimarisi-analiz.md`) |
| FAZ 1 — Ortak shell, presentation mode, dirty state, permission | Faz 1 | **F1** | ✅ **~%85 bitti** (PR #116) |
| FAZ 2 — Responsive modal, focus trap, fullscreen, URL senkronu | Faz 1 | **F1** | ✅ **~%90 bitti** (PR #116) |
| FAZ 4 — Genel sekmesi, form UX, Kaydet | Faz 2 | **F2** | ✅ **Bitti** (2026-08-06, yerel, henüz push/PR yok) |
| FAZ 5 — Navbar, feature registry, "+" menüsü | Faz 3 | **F3** | ✅ **Bitti** (2026-08-06, yerel, henüz push/PR yok) |
| FAZ 6 — Alt görevler, dosyalar, kontrol listesi | Faz 4 | **F4** | Planlı |
| FAZ 3 — Embedded sayfa + routing | Faz 5 | **F5** | Planlı (**sırası değişti**, bkz §3) |
| FAZ 7 — Güncellemeler/yorumlar/realtime | Faz 6 | **F6** | Planlı |
| FAZ 8 — Aktiviteler + Geçmiş + audit | Faz 7 | **F7** | Planlı |
| FAZ 9 — Finans | Faz 8 | **F8** | Planlı |
| FAZ 10–11 — Bağımlılıklar, riskler, onaylar, zaman takibi, gelişmiş görünümler, otomasyon, AI | Faz 10 | **F9** | Planlı (kapsam çok geniş, bkz §6) |
| FAZ 12 — Kalite, eski sistemin kaldırılması, E2E | Faz 9 | **F10** | Planlı |

### Yeni spec'in FAZ 1–2'sinden eksik kalanlar

Bunlar F1'de yapılmadı, ilgili fazlara dağıtıldı:

| Eksik | Neden F1'de yapılmadı | Nereye gitti |
|---|---|---|
| `presentation="page"` (embedded) | Faz 5'e planlıydı | **F5** |
| `presentation="preview"` (drawer önizleme) | Roadmap'te hiç yoktu, yeni fikir | **Kapsam dışı** (bkz §6) |
| **Görev kodu** (`#OTL-2507`) | **Backend'de `Code` alanı YOK** — `TaskItem`'da böyle bir property yok, migration + numaralandırma stratejisi gerekir | **F2'de karar, ayrı iş** (bkz §5) |
| **Favori ikonu** (⭐) | **Backend'de YOK** — favori kullanıcı-bazlıdır, `TaskFavorite` join entity'si (TenantId+UserId+TaskId) + migration gerekir | **F2'de karar, ayrı iş** (bkz §5) |

---

## 3. Neden embedded sayfa (F5) Genel sekmesinden (F2) SONRA?

Yeni spec bunu FAZ 3'e, yani Genel sekmesinden (FAZ 4) **önce** koymuştu. Bu projede ters:

1. **Doğrulanacak içerik yok.** Embedded sayfayı şimdi yaparsak, elimizde aynı
   `"Genel sekmesi Faz 2'de eklenecek."` placeholder'ını gösteren *iki* kabuk olur.
2. **Kullanıcı faydası gecikir.** Bayrak varsayılan kapalı; V2'nin varsayılan açılabilmesi
   için düzenlenebilir en az bir alan gerekiyor. Araya faz sokmak bunu geciktirir.
3. **"Formu iki kez yazma" riski zaten yok.** `shells/ModalShell.jsx` yorumu:
   > *"Faz 5'te eklenecek PageShell aynı `children`'ı portal'sız/backdrop'suz render eder;
   > bu yüzden buraya görev-özel hiçbir şey koyma."*

   İçerik componentleri baştan kabuk-bağımsız tasarlandı. Genel formunu önce modal'da
   yazmak, sonra embedded'da yeniden kullanmak mimariyi bozmuyor.

---

## 4. Birleşik faz planı

Her faz: bağımsız geri alınabilir, sonunda testler + canlı QA, kullanıcı onayı ile ilerler.
Uygulama yöntemi Faz 1'de kanıtlanan desen: **task başına taze subagent + task-review +
faz sonunda whole-branch review**, her implementer'a baştan **"sabotage check yap"** talimatı
(davranışı kasten boz → test düşsün → geri al → yeşile dönsün).

### ✅ F1 — Ortak shell + responsive modal (BİTTİ, PR #116)

`TaskDetailRoot` (presentation-bağımsız çekirdek) · `ModalShell` · `TaskDetailHeader`
(durum/öncelik/erişim rozeti, ⋯ menü, fullscreen, kapat) · `TaskDetailFooter` (Vazgeç/Kaydet
iskeleti) · `useTaskDetail` (TanStack Query) · `useDirtyGuard` · `useTaskUrlSync`
(`?task=<guid>` + pushState + popstate + deep-link) · `taskDetailStore` · Silme akışı
(izin kontrolü + "SİL" yazarak onay) · 8 test dosyası.

### ✅ F2 — Genel sekmesi ve gerçek Kaydet akışı (BİTTİ, 2026-08-06)

Detay plan: [`2026-08-05-task-detail-faz2-genel-sekmesi.md`](2026-08-05-task-detail-faz2-genel-sekmesi.md)
(analiz) + [`2026-08-05-task-detail-faz2-implementation.md`](2026-08-05-task-detail-faz2-implementation.md)
(kod-tam uygulama planı, subagent-driven-development ile çalıştırıldı).

Sol ana alan (başlık, durum, öncelik, atanan, tarihler, etiketler, açıklama) + sağ salt-okunur
detay paneli (oluşturan/oluşturulma, güncelleyen/güncelleme, proje) · form state + dirty diff ·
elle validation (başlık + **StartDate zorunlu** — whole-branch review'da eklendi) · **gerçek
Kaydet** (`task.update()` + cache invalidation + `emitResult()`) · "Kaydet ve çık" üçüncü
seçeneği. Backend değişikliği: sıfır (`UpdateAsync` mevcut tüm alanları kapsadı).

**Bayrak kararı değişti: varsayılan yine KAPALI kaldı** (whole-branch review sonrası) — eski
drawer'da olup V2'de henüz olmayan 6 sekme (Alt Görevler/Dosyalar/Finans/Bağımlılıklar/Zaman
Takibi/Yorumlar) yüzünden varsayılanı açmak fonksiyonel kayıp olurdu. Faz 4 bitince yeniden
değerlendirilecek. Detaylı ders ve whole-branch review'ın yakaladığı 4 kritik/önemli bulgu
(derlenmiş bundle'ın commit'lenmemiş olması dahil) için [[project-task-detail-modal]] hafıza
kaydına bak.

Commit aralığı: `1f63555..c74b82a` (main'e göre henüz push/PR/merge yok).

### F3 — Modüler navbar + feature registry + "+" menüsü

Borderless navbar (ince aktif alt çizgi, ARIA tabs, klavye navigasyonu, yatay scroll) ·
`TaskFeatureRegistry` (code/title/icon/component/category/permission/isCore/order/lazyLoad/
availabilityRule/badgeResolver) · core sekmeler (Genel, Alt Görevler, Dosyalar) kaldırılamaz ·
`React.lazy` ile feature componentleri · "+" picker (arama, kategori, izin, **"Yakında" rozeti**) ·
görev-bazlı feature persistence.

**✅ Backend bitti (2026-08-06)** — detay plan:
[`2026-08-06-task-detail-faz3-backend-feature-assignment.md`](2026-08-06-task-detail-faz3-backend-feature-assignment.md).
Persistence kararı verildi: `TaskFeatureAssignment` tablosu (yeni migration), `ExtraProperties`
DEĞİL — bu codebase'de `IHasExtraProperties`'i kullanan tek bir entity bile yoktu, `TaskFeatureAssignment`
ise `TaskTagAssignment`'ın zaten onlarca kez kanıtlanmış desenini birebir izliyor (bare
`Entity<Guid>`, tenant/gizlilik `EnsureTaskAccessAllowedAsync` guard'ından geliyor, ayrı
permission yok). 3 yeni `ITaskAppService` metodu: `GetFeatureAssignmentsAsync`/`AddFeatureAsync`
(idempotent)/`RemoveFeatureAsync`. Proxy adları (frontend planı bunları kullanacak):
`getFeatureAssignments(taskId)` / `addFeature(taskId, featureCode)` / `removeFeature(taskId, featureCode)`.
**Not: `GetFeatureAssignmentsAsync`'in döndürdüğü liste SIRASIZ** — frontend registry'nin kendi
sırasına göre göstermeli, response sırasına güvenmemeli. `dotnet test` 226/226, migration yerel
dev Postgres'e uygulandı.

**✅ Frontend de bitti (2026-08-06)** — detay plan:
[`2026-08-06-task-detail-faz3-frontend-navbar-registry.md`](2026-08-06-task-detail-faz3-frontend-navbar-registry.md).
Kapsam kararı (kullanıcı onaylı): saf altyapı — navbar bugün yalnız `Genel` sekmesini gösterir
(Alt Görevler/Dosyalar core ama `implemented:false`, F4'e kadar navbar'da hiç görünmez), "+"
picker tüm gelecek non-core özellikleri "Yakında" rozetiyle listeler ama hiçbiri eklenemez;
add/remove backend çağrısı + `React.lazy` render yolu yalnız test-only bir fixture entry ile
kanıtlandı. `Genel` registry'nin generic `component` sözleşmesinin DIŞINDA kaldı (kendi form
state'ini `useTaskForm`'dan alır). 4 task + final whole-branch review + 1 fix turu,
subagent-driven-development ile. `npm test` 143/143, `dotnet build` 0 Hata. Final review
verdict: "Ready to merge: Yes".

### F4 — Alt Görevler + Dosyalar + Kontrol Listesi

Mevcut `ParentTaskId` self-referencing modeli kullanılacak (paralel entity YOK) · alt göreve
tıklayınca **aynı modalda bağlam değişimi + breadcrumb** (iç içe modal YOK) · dosya listesi/
galeri (mevcut `TaskAttachment` + `App_Data/uploads` altyapısı) · yükleme progress, boyut/tip
hataları · Kontrol Listesi feature registry üzerinden eklenebilir (yeni entity gerekir).

**Bilinen eksik:** `ITaskAppService`'te **dosya silme metodu yok** (`AddAttachmentAsync`/
`GetAttachmentsAsync` var, delete yok) → F4'te eklenmesi gerekecek.

### F5 — Embedded (Jira-benzeri) görev sayfası + kanonik URL

Yeni Razor Page (`Pages/Tasks/Detail.cshtml`, route `/Tasks/Detail/{id:guid}`) ·
`PageShell` (portal'sız, backdrop'suz — `ModalShell` ile aynı `children`) ·
`presentation="page"` · breadcrumb · sağ meta panel (sticky/daraltılabilir, küçük ekranda
altına iner) · "yeni sekmede aç" · **bildirim deep-link'lerinin bu route'a yönlendirilmesi**
(şu an hâlâ eski `/Tasks/EditModal?id=` sayfasına gidiyor).

⚠️ **Bu proje client-side router içermiyor** (React Router yok, Razor Pages) — "route" demek
yeni bir Razor Page demek, SPA route'u değil.

### F6 — Güncellemeler (yorumlar) + gerçek zamanlı

Mevcut `TaskComment` entity'si genişletilecek (paralel sistem YOK) · yorum composer ·
thread (şu an **tek seviye** — `ReplyToCommentAsync` yanıtın yanıtını köke katlıyor) ·
mention · reaction · dosya eki · sayfalama · navbar badge · **yorumlar artık yalnız bu
feature'da, her sekmenin altında değil.**

**Bilinen eksik:** Yorum içeriğinde **sunucu tarafı XSS sanitization YOK** — `TaskComment.SetText`
yalnız trim/boş kontrolü yapıyor, çıktı tarafı encoding'e (Razor `@` / JSX) güveniliyor.
F6'da zengin içerik/mention eklenirse bu **kritik hale gelir**, mutlaka ele alınmalı.

**SignalR:** `TaskHub` + `Task_{taskId}` grupları zaten var ama **yalnız durum değişikliği**
yayınlanıyor (`TaskStatusChangedEto`). Yorum eventi F6'da eklenecek.

### F7 — Aktiviteler + Geçmiş (üçlü kavram ayrımı)

Yeni spec'in en değerli katkısı — üç ayrı kavram, üç ayrı yüzey:

| | İçerik | Kaynak |
|---|---|---|
| **Güncellemeler** (F6) | Kullanıcı yorumları, thread, reaction | `TaskComment` |
| **Aktiviteler** (F7) | Okunabilir olay akışı: "Durum Tamamlandı yapıldı", "Dosya eklendi" | Domain event / audit projeksiyonu |
| **Geçmiş** (F7) | Değiştirilemez teknik audit: önceki değer / yeni değer / kaynak / kim / ne zaman | ABP `EntityChanges` |

ABP `Volo.Abp.AuditLogging` **zaten etkin** (`EntityChanges`/`EntityPropertyChanges` tabloları
mevcut) → **ikinci bir audit sistemi kurulmayacak.** Kaynak etiketleri: User/System/Automation/
API/AI. Filtreler, sayfalama, hassas alan maskeleme, enum→Türkçe metin dönüşümü.

### F8 — Finans

`Tasks.Finance.{View|Create|Update|Delete|Approve}` izinleri · ayrı entity/value object
(genel `TaskItem`'a kontrolsüz alan eklenmeyecek) · decimal precision · para birimi
doğrulaması · concurrency · fatura/belge dosya bağlantısı · audit · bütçe sapması ·
mobilde tablo yerine kart.

### F9 — İleri özellikler (kapsam çok geniş, ayrı planlanacak)

Bağımlılıklar (döngü engeli) · Riskler · Onaylar · Zaman takibi (backend `StartTimeTracking`/
`StopTimeTracking`/`GetTimeLogs` **zaten var**) · Tablo/Gantt/Zaman çizelgesi/Dashboard/Dosya
galerisi görünümleri · Otomasyonlar (döngü engeli + execution log) · AI analizleri (mevcut
`Apya.Platform.Ai.*` modülü kullanılacak; AI kullanıcı onayı olmadan görev alanı değiştiremez).

⚠️ **Bu faz tek başına bir üründür.** F9'a gelindiğinde tek faz olarak değil, her özellik
kendi mini-planıyla ele alınmalı.

### F10 — Kalite, geçiş, temizlik

Eski `EditModal.cshtml` + `task-drawer.js` kaldırma · `/Tasks/EditModal` → 301 · bayrağın
tamamen kaldırılması · dead code · bundle analizi · a11y denetimi · responsive matris ·
E2E · dokümantasyon · release notu.

---

## 5. F2'ye eklenmesi teklif edilen ama **migration gerektiren** iki iş

Mockup'ta var, backend'de yok. F2'nin "backend değişikliği sıfır" avantajını bozarlar,
bu yüzden **ayrı karar** olarak işaretlendi:

**A. Görev kodu (`#OTL-2507`)** — `TaskItem`'da `Code` alanı yok. Gerekli: migration +
tenant/proje bazlı numaralandırma stratejisi (proje kısaltması + sıra no?) + eşzamanlılık
(iki kullanıcı aynı anda görev oluşturursa çakışma) + mevcut kayıtlara geriye dönük kod atama.
**Küçük bir iş değil.** Projelerde zaten `Code` var (`QA-APPDATA-001`), oradaki desen örnek
alınabilir.

**B. Favori (⭐)** — Favori kullanıcı-bazlıdır, `TaskItem`'a bool eklenemez. Gerekli:
`TaskFavorite` entity (TenantId + UserId + TaskId, unique constraint) + migration +
AppService metotları + muhtemelen "Favorilerim" filtresi (aksi halde favori işaretlemenin
bir faydası olmaz).

**Öneri:** İkisi de F2'ye **dahil edilmesin**; F2 saf frontend kalsın, bunlar ayrı bir
mini-faz olarak (F2 sonrası, F3 öncesi ya da paralel) ele alınsın. Onayınız gerekiyor.

---

## 6. Kapsam dışı bırakılanlar

| Fikir | Karar | Gerekçe |
|---|---|---|
| **Preview drawer** (hover/bildirimden salt-okunur önizleme) | Ertelendi | Roadmap'te hiç yoktu; ayrı component + kendi bayrağı gerektirir. F5 (embedded) sonrası ihtiyaç görülürse. |
| **Split view** (solda liste, sağda detay) | Yapılmayacak | LeptonX sidebar'ı zaten yer kaplıyor; Gantt/Kanban ile çakışır; state karmaşıklığı yüksek, getirisi düşük. |
| **Takvim/Dashboard'dan görev açma** | Ayrı karar | Şu an hiçbiri task-detail açmıyor (`Pages/Calendars`'ta referans yok). `_TaskDetailIsland` partial'ını eklemek küçük iş ama ayrı karar. |
| Mockup'ın koyu tema paleti/tipografisi | Alınmayacak | Proje kendi `--apya-*` token sistemini ve açık/koyu tema desteğini korur. |

---

## 7. Yeni spec'ten alınan katkılar

Bu spec baştan başlatılmadı ama şunlar birleşik plana **eklendi**:

1. **Güncellemeler / Aktiviteler / Geçmiş üçlü ayrımı** (F7) — en değerli katkı, kavramsal
   olarak orijinal plandan daha net.
2. Her fazın **test listeleri ve acceptance criteria'ları** — orijinal roadmap'ten detaylı.
3. **Aktivite kaynak etiketleri** (User/System/Automation/API/AI) ve filtre setleri.
4. **Feature registry alan seti** (`availabilityRule`, `badgeResolver`,
   `requiredBackendCapability`) — F3'ün tasarımını netleştirdi.
5. **"İşlevsiz placeholder sekme oluşturma"** kuralı — "Yakında" rozeti deseni.
6. Ağır feature'ların (Gantt/Dashboard) fullscreen/focus-mode davranışı — F9 notu.

---

## 8. Kararlar — ONAYLANDI (2026-08-05)

1. **Görev kodu + favori** (§5) — ✅ F2 dışında ayrı mini-faz. F2 saf frontend kalır.
2. **Preview drawer ve split view** (§6) — ✅ Kapsam dışı.
3. **Takvim/Dashboard'dan görev açma** — ✅ Bu yol haritasına DAHİL DEĞİL, ayrı iş.
4. **Alt görev açılışı** — ✅ Aynı modalda bağlam değişimi + breadcrumb (iç içe modal yok).
5. **F9 kapsamı** — ✅ F8 (Finans) bitince dur, F9'u (bağımlılıklar/riskler/onaylar/
   otomasyon/AI) o noktada yeniden değerlendir — şimdiden taahhüt yok.

---

## 9. Geri alma

Her fazda üç kademe (Faz 1'de kanıtlandı):
1. **En hafif:** bayrağı kapat (`localStorage.removeItem('apya.taskDetail.v2')`) — kod
   değişmeden eski sistem geri gelir. *(F2 bayrağı varsayılan açtıktan sonra bu kademe
   varsayılanı değiştirmeyi gerektirir.)*
2. **Faz bazlı:** o fazın commit'lerini geri al; önceki fazlar bağımsız çalışmaya devam eder.
3. **Tümü:** `git revert --no-commit <son>..<ilk>^` — ⚠️ güvenlik yamaları (tenant izolasyonu,
   gizlilik guard'ı, `App_Data/uploads`) bu kapsamdan **hariç tutulmalı**.
