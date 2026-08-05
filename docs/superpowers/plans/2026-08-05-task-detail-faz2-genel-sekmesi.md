# Faz 2 — Genel Sekmesi ve Gerçek Kaydet Akışı

**Durum:** Analiz tamamlandı, onay bekliyor. Kod yazılmadı.
**Kapsam:** Yalnız Faz 2 (`docs/superpowers/plans/2026-08-01-task-detail-adaptive-faz1.md`'nin
"Sonraki Fazlar" tablosundaki Faz 2 satırı). Faz 3+ için ayrı plan yazılacak.

---

## 0. Bu planın nereden geldiği

Kullanıcı çok kapsamlı bir spec paylaştı (FAZ 0–8, 31 bölüm — başka bir yapay zeka tarafından
üretilmiş, muhtemelen farklı/jenerik bir stack varsayımıyla). Spec'in kendisi de "doğrudan
varsayma, önce repository'yi incele" diyor. Bu belge o talimatı yerine getiriyor: iki paralel
araştırma ajanıyla (backend + frontend) gerçek mimari çıkarıldı, spec'in varsayımlarıyla
karşılaştırıldı, ve yalnız **Faz 2** için somut bir plan üretildi — çünkü hem orijinal
9-fazlı plan hem de kullanıcının spec'i, "Genel sekmesi + form + gerçek Kaydet" işini
aynı şekilde Faz 2'ye, "sekme navbarı + feature registry"yi ise ayrı bir sonraki faza
(orijinal planda Faz 3, spec'te de FAZ 3) koyuyor. İki kaynak burada örtüşüyor.

---

## 1. Repository analiz bulguları

### 1.1 Backend (`src/Apya.Platform.Domain`, `Application`, `Application.Contracts`, `EntityFrameworkCore`)

- **`TaskItem`** (`src/Apya.Platform.Domain/Tasks/TaskItem.cs`) — `FullAuditedAggregateRoot<Guid>, IMultiTenant`.
  Faz 2'nin ihtiyaç duyduğu TÜM alanlar zaten var: `Title`, `Description`, `StartDate`, `DueDate`,
  `Status` (enum), `Priority` (enum), `AssigneeId`, `ProjectId`, `IsPrivate`. Zengin domain modeli
  — state değişiklikleri private setter + domain metotlarıyla (`SetTitle`, `ChangeStatus`,
  `ChangePriority`, `AssignTo`, `SetPrivacy`, `Update`). Etiketler ayrı bir ilişki üzerinden
  (`GetAllTagsAsync`/`SyncTagsAsync`) yönetiliyor.
- **`ITaskAppService`** zaten `ICrudAppService<TaskDto, Guid, GetTasksInput, CreateUpdateTaskDto>`
  — yani **`GetAsync`/`UpdateAsync` hazır, yeni endpoint gerekmiyor.** `UpdateAsync` yalnız
  oluşturan/atanan/`Projects.ManageTeam` sahibi kullanıcıya izin veriyor (permission + ownership
  karışık bir kural, `TaskAppService.cs`).
- **Gizlilik/"Sınırlı erişim" göstergesi zaten Faz 1'de yapıldı** — `TaskDetailHeader.jsx`
  içinde `<AccessBadge isPrivate={task?.isPrivate}>` mevcut (commit `d16f8f6`). Spec'in 7.
  bölümdeki isteği **zaten karşılanmış**, Faz 2'de tekrar yapılmayacak.
- **`ExtraProperties`** DB'de fiziksel kolon olarak var (`ConfigureByConvention()` otomatik
  ekliyor) ama `TaskItem` `IHasExtraProperties` implement etmiyor, DTO'da yok — Faz 2'de
  kullanılmayacak (Faz 2'nin tüm alanları zaten native kolon). İleride Faz 3 (feature
  registry) veya Faz 7 (finans) için değerlendirilebilir.
- **`UpdateStatusAsync`** ayrı bir metot olarak var ama **permission kontrolü yok** (mevcut
  bir açık, Faz 2 kapsamı dışı — bkz. §8).
- **`Tasks.Assign` / `Tasks.ChangeStatus`** permission sabitleri tanımlı ama hiçbir yerde
  kullanılmıyor (`PlatformPermissions.cs`). Gerçek yetkilendirme ownership-tabanlı.
- **Audit log** (`Volo.Abp.AuditLogging`) etkin ama görev bazlı bir "geçmiş" özelliği yok —
  Faz 6'nın işi, Faz 2'yi ilgilendirmiyor.
- **SignalR**: `TaskHub` + `TaskRealTimeEventHandler` yalnız durum değişikliğini
  (`TaskStatusChangedEto`) yayınlıyor. Faz 2'nin Kaydet akışı bu event'i zaten tetikleyecek
  (mevcut `UpdateAsync` içinden) — ekstra iş gerekmiyor.
- **Redis / Hangfire / CQRS / MediatR yok** — hiçbir `.csproj`'da referans bulunamadı. Kullanıcının
  paylaştığı spec'in bu varsayımları bu projeye uymuyor, yok sayılacak.

### 1.2 Frontend (`src/Apya.Platform.Web/wwwroot/dynamic-assets`)

- **Stack doğrulandı:** React 18.2, **TanStack Query v5** (zaten `useTaskDetail.js`'te
  `useQuery` ile kullanılıyor), Radix UI (yalnız `Dialog`), Tailwind CSS v3 + `cva` +
  `clsx`/`tailwind-merge` (shadcn-tarzı), Vitest + React Testing Library. **Form kütüphanesi
  (react-hook-form/Formik) yok, validation kütüphanesi (zod/yup) yok** — state elle
  (`useState`) yönetiliyor, spec'in "mevcut validation kütüphanesini kullan" talimatı
  boş çıkıyor: yeni bir şey eklemeden elle validation yazılacak.
- **Klasörleme feature-bazlı**, Atomic Design DEĞİL (`task-detail/`, `dashboard/`, `expense/`
  gibi feature köklerinde `components/hooks/shells`) — spec'in "Atomic Design" varsayımı bu
  projeye uymuyor, mevcut feature-klasör deseni korunacak.
- **Paylaşılan UI kit** (`components/ui/index.js`): `Button, Card, Badge, Input, MoneyInput,
  DateRangePicker, Combobox, Sheet, Dialog, Hint, ...` var. **`Tabs`, `Dropdown`, `Tooltip`,
  `Avatar` YOK** — ama Faz 2 bunlara ihtiyaç duymuyor (navbar/tab Faz 3'ün işi). `Combobox`
  atanan-kişi ve etiket seçimi için doğrudan kullanılabilir.
- **Faz 1 çıktısı (`task-detail/` klasörü) tam okundu:**
  - `TaskDetailRoot.jsx` şu an `<p>Genel sekmesi Faz 2'de eklenecek.</p>` placeholder'ı
    gösteriyor — Faz 2'nin değiştireceği TEK yer burası.
  - `TaskDetailFooter.jsx` zaten `isDirty`/`isSaving`/`onSave` prop'larını destekliyor,
    şu an `onSave` bilerek verilmiyor ("BİLEREK geçilmiyor" yorumu) — Faz 2 sadece bu prop'u
    bağlayacak, footer'ın kendisi değişmeyecek.
  - `useTaskDetail.js` zaten `window.apya.platform.tasks.task.get()` (ABP dinamik proxy) ile
    veri çekiyor — Faz 2, aynı desenle `.update()` çağrısı ekleyecek.
  - `taskDetailStore.js` elle yazılmış `useSyncExternalStore` deposu (Zustand/Redux YOK,
    bilinçli tercih) — Faz 2 bunu değiştirmeyecek.
  - Navbar/Tabs hiçbir yerde yok — Faz 1'de hiç inşa edilmemiş, sıfırdan Faz 3'ün işi.
- **Mount noktası:** `_TaskDetailIsland.cshtml` partial'ı 3 sayfaya (`Tasks/Index`,
  `Projects/ProjectDetails`, `Board/Index`) dahil; bayrak kontrolü tamamen `task-detail.jsx`
  içinde (`?taskui=v2` veya `localStorage['apya.taskDetail.v2']`). Faz 2 bu mekanizmaya
  dokunmayacak.
- **Test stili:** Vitest + RTL, davranışsal/"sabotage" testler (snapshot yok) — Faz 1'in
  10 task'ı bu desenle yazıldı, Faz 2 aynı deseni sürdürecek.

---

## 2. Kullanıcının spec'i ile gerçek mimari arasındaki farklar

| Spec varsayımı | Gerçek durum | Sonuç |
|---|---|---|
| React tabanlı SPA | Razor Pages MVC + izole React "adaları" (Vite) | Atomic Design/global SPA kurulumu yok, feature-klasör deseni korunacak |
| Redis | Yok | Yok sayıldı |
| Hangfire | ABP native `AsyncBackgroundJob`/`IBackgroundJobManager` + `AsyncPeriodicBackgroundWorkerBase` | Faz 2'yi ilgilendirmiyor, not düşüldü |
| CQRS/MediatR | Standart ABP `CrudAppService` | Yok sayıldı |
| Atomic Design klasörleri | Feature-bazlı (`task-detail/`, `dashboard/`...) | Mevcut desen korunacak |
| "Mevcut validation kütüphanesi" | Yok, elle state | Yeni kütüphane eklenmeyecek, elle validation |
| "Mevcut Dialog varsa kullan" | Var (Radix tabanlı, Faz 1'de zaten kullanılıyor) | Değişiklik yok |
| Kırmızı "Gizli" → "Sınırlı erişim" | Zaten Faz 1'de yapıldı (`AccessBadge`) | Faz 2'de tekrar yapılmayacak |

---

## 3. Faz 2 kapsamı

### Yapılacak
1. `TaskDetailRoot.jsx`'teki placeholder yerine gerçek **Genel sekmesi** formu:
   sol ana alan (başlık, durum, öncelik, atanan, başlangıç/bitiş tarihi, etiketler,
   açıklama) + sağ detay paneli (oluşturan, oluşturulma zamanı, güncelleyen, son
   güncelleme zamanı, proje) — spec §8/§14 ile uyumlu, collapsible/"daha fazla" YOK
   (alan sayısı azdı, gerek yok — bkz §8 açık karar).
2. Form state + dirty tracking (elle, `useState` + shallow-diff — mevcut projede zaten
   kullanılan desen, yeni kütüphane yok).
3. Validation: `Title` zorunlu (backend `[Required]` ile eşleşmeli — DTO'da doğrulanacak),
   tarih tutarlılığı (`DueDate >= StartDate`) gibi basit kurallar, elle.
4. **Gerçek Kaydet**: `TaskDetailFooter`'a `onSave` bağlanacak, `window.apya.platform.tasks
   .task.update(id, dto)` (mevcut ABP proxy, `useTaskDetail.js`'teki desenle aynı) çağrılacak,
   başarıda React Query cache invalidation (`queryClient.invalidateQueries(['task-detail', id])`)
   + `taskDetailStore.emitResult()` (Kanban/tablo listelerinin yenilenmesi için, mevcut
   `abp.ModalManager.onResult` sözleşmesiyle uyumlu).
5. Kaydedilmemiş değişiklik uyarısı: `useDirtyGuard` zaten var (Faz 1), dirty state artık
   gerçek olacağı için üçüncü seçenek **"Kaydet ve çık"** eklenecek (şu an yalnız 2 seçenek
   var — Faz 1 planı zaten bunu Faz 2'ye bırakmıştı).
6. Durum/Öncelik: backend enum'larından türetilen pill-seçiciler (spec §9) — **backend'e
   anlık yazmaz**, yalnız dirty işaretler, gerçek yazma Kaydet'te tek `UpdateAsync`
   çağrısıyla olur (spec §9'un kendi kuralı).

### Yapılmayacak (sonraki fazlara devrediliyor)
- Sekme navbarı / "+" feature menüsü / feature registry → **Faz 3** (hem orijinal plan hem
  spec aynı fikirde).
- Alt Görevler, Dosyalar sekme içerikleri → **Faz 4**.
- Yorumlar/Güncellemeler → **Faz 5**.
- Geçmiş (audit) → **Faz 6**.
- Finans → **Faz 7**.
- `UpdateStatusAsync` permission açığının kapatılması → Faz 2 kapsamı dışı, ayrı küçük
  bir düzeltme olarak önerilir (bkz §8).

---

## 4. Önerilen component mimarisi

Yeni dosyalar, hepsi `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/` altında:

```
components/
  TaskGeneralForm.jsx        # sol ana alan — mevcut Combobox/Input/DateRangePicker'ı kullanır
  TaskDetailsPanel.jsx       # sağ salt-okunur detay paneli
hooks/
  useTaskForm.js             # form state + dirty diff + validation (elle, yeni kütüphane yok)
  useSaveTask.js             # mutation: update çağrısı + cache invalidate + emitResult
```

`TaskDetailRoot.jsx` değişikliği: placeholder yerine `<TaskGeneralForm task={task}
onDirtyChange={...} formRef={...} />` + `<TaskDetailsPanel task={task} />`, ve
`TaskDetailFooter`'a `onSave={handleSave}` eklenmesi. Mevcut `ModalShell`, `TaskDetailHeader`
**değişmez**.

Yeni paylaşılan UI primitive **eklenmeyecek** — `Combobox` (atanan/etiket), `Input`,
`DateRangePicker` (veya iki ayrı `Input type="date"`, bkz §8) zaten `components/ui`'de var.

---

## 5. Backend değişiklikleri

**Minimal — muhtemelen sıfır.** `ITaskAppService.UpdateAsync` zaten Faz 2'nin ihtiyacı olan
her alanı (`CreateUpdateTaskDto`) kapsıyor. Yeni endpoint, yeni migration, yeni permission
**gerekmiyor**. Tek olası küçük değişiklik: `CreateUpdateTaskDto`'daki Tags alanının tam
şeklini implementasyon sırasında doğrulamak (analiz ajanları bunu netleştirmedi — kod
yazarken tek bakışta netleşecek, plan onayını beklemiyor).

---

## 6. Task kırılımı (Faz 1'in subagent-driven-development deseniyle)

Faz 1'de öğrenilen ders uygulanacak: **her task'a baştan "sabotage check yap" talimatı**
(davranışı kasten boz → testin düştüğünü kanıtla → geri al → yeşile döndüğünü kanıtla).

1. `useTaskForm.js` — form state + dirty diff, testler (dirty yalnız gerçek değişiklikte
   true olmalı, kaydetmeden kapatma orijinal veriyi korumalı).
2. `TaskGeneralForm.jsx` — sol form alanları, mevcut `TaskDto` alanlarıyla dolduruluyor,
   testler (her alan doğru render/değişiyor, validation hataları gösteriliyor).
3. `TaskDetailsPanel.jsx` — sağ salt-okunur panel, testler (doğru alanlar, boş/null durumlar).
4. `useSaveTask.js` + `TaskDetailRoot.jsx` entegrasyonu — gerçek Kaydet çağrısı, cache
   invalidation, `emitResult`, testler (başarı/hata yolları, çift-tıklama koruması,
   API hatasında girilen veri kaybolmuyor).
5. Kaydedilmemiş değişiklik dialogu — üçüncü seçenek "Kaydet ve çık", testler.
6. Whole-branch review — Faz 1'de olduğu gibi, task-scoped review'ların kaçırdığı global
   etkiler (tailwind/service-worker/shared-barrel değişikliği var mı) kontrol edilecek.

Her task ayrı commit, her task sonunda review. Faz 1'deki gibi 10 task olması gerekmez —
kapsam küçük, muhtemelen 4-6 task yeterli.

---

## 7. Riskler

- **Dirty-state yanlış pozitif/negatif**: Faz 1'de zaten bir kez bu sınıfta sorun çıkmıştı
  (backdrop tıklaması `requestClose`'u atlıyordu) — form alanlarına dirty-check eklerken
  aynı dikkatle sabotage-check yapılacak.
- **`CreateUpdateTaskDto` alan uyuşmazlığı**: Frontend'in gönderdiği payload backend DTO'suyla
  bire bir eşleşmezse `AbpValidationException` (bu oturumda zaten iki kez karşılaşıldı,
  bkz proje geçmişi) — her alan implementasyon sırasında DTO'ya karşı doğrulanacak.
- **React Query cache invalidation kapsamı**: yalnız `['task-detail', id]` değil, Kanban/tablo
  listelerini de (varsa onların query key'leri) tetiklemek gerekebilir — mevcut
  `emitResult()`/`abp.ModalManager.onResult` mekanizması bunu zaten sağlıyor olabilir,
  implementasyonda doğrulanacak.

---

## 8. Açık kararlar — onay gerekiyor

1. **Tarih alanları**: Mevcut `DateRangePicker` bir ARALIK seçici; Faz 2'nin ihtiyacı iki
   BAĞIMSIZ tarih (`StartDate`, `DueDate`). `DateRangePicker`'ı iki bağımsız alan için
   zorlamak yerine iki ayrı `Input type="date"` kullanmayı öneriyorum (mevcut `Input`
   bileşeni zaten var, yeni bileşen gerekmez). Onaylıyor musunuz, yoksa `DateRangePicker`'ı
   mı tercih edersiniz?
2. **Açıklama alanı**: `TaskItem.Description` düz string (rich-text değil), projede hiçbir
   yerde rich-text editör bulunamadı. Düz `<textarea>` öneriyorum (spec'in "mevcut editör
   varsa kullan, yenisini ekleme" kuralına en uygun yorum). Onaylıyor musunuz?
3. **"Daha fazla alan göster" collapsible**: Sağ panel yalnız 5 alan (oluşturan/oluşturulma/
   güncelleyen/son güncelleme/proje) — spec'in önerdiği collapsible/accordion gereksiz
   karmaşıklık olur diye düşünüyorum, hepsini doğrudan gösterme öneriyorum. Katılıyor
   musunuz?
4. **`UpdateStatusAsync` permission açığı**: Faz 2 kapsamı dışı ama gerçek bir güvenlik
   açığı (herhangi bir authenticated kullanıcı durumu değiştirebiliyor, permission kontrolü
   yok). Faz 2'yle birlikte küçük ayrı bir commit olarak mı düzeltelim, yoksa ayrı bir
   göreve mi (spawn_task) dönüştürelim?
5. **Faz 2'de tab navbar'ı hiç göstermeme kararı** (§3, "Yapılmayacak") — hem orijinal plan
   hem spec bunu Faz 3'e koyuyor, ben de öyle öneriyorum. Ama görünürde tek başına bir
   "Genel" içeriği, sekmesiz garip durabilir. Onaylıyor musunuz, yoksa Faz 2'de basit/tek
   sekmeli bir iskelet navbar mı istersiniz (Faz 3'te gerçek registry'ye bağlanacak)?

---

## 9. Kabul kriterleri (Faz 2)

- Genel sekmesinde tüm alanlar (başlık, durum, öncelik, atanan, tarihler, etiketler,
  açıklama) gerçek veriyle doluyor ve düzenlenebiliyor.
- Kaydet butonu yalnız gerçek değişiklikte aktif, başarılı kayıt sonrası dirty temizleniyor.
- API hatasında girilen veriler kaybolmuyor, hata mesajı gösteriliyor.
- Kaydedilmemiş değişiklikte çıkış uyarısı 3 seçenekle çalışıyor (Düzenlemeye devam et /
  İptal et / Kaydet ve çık).
- Kaydet sonrası Kanban/görev listesi güncelleniyor (mevcut `onResult` mekanizmasıyla).
- Mevcut eski drawer (bayrak kapalıyken) davranışı birebir aynı kalıyor.
- `dotnet build` 0 hata (backend değişikliği varsa), `npm test` yeşil, canlı QA (bayrak
  açık/kapalı, masaüstü + mobil).

---

## 10. Geri alma

Faz 1'deki üç kademeli model aynen geçerli: (1) bayrağı kapat — kod değişmeden eski drawer
geri gelir, (2) yalnız Faz 2 task'larının commit'lerini geri al, (3) tam geri alma
(`git revert --no-commit <son-task>..<ilk-task>^`).
