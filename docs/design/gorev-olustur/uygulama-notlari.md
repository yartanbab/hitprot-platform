# Yeni Görev ekranı — uygulama notları

Tasarım kaydı: [`README.md`](README.md) · Maket: [`yeni-gorev-ekrani.dc.html`](yeni-gorev-ekrani.dc.html)

## Mimari karar: iki katman, tek POST

Modal iki katman taşır — üstte hızlı giriş satırı (`1d`), altında sıkı form (`1b`) — ama
**tek bir gönderme yolu** vardır. Hızlı satır ve meta çipleri görsel katmandır; ikisi de
modaldaki **gerçek** `<select>`/`<input>` alanlarını yazar. Böylece:

- `CreateModalModel.OnPostAsync` sözleşmesi (Durum/Kolon uzlaştırması dahil) aynen kaldı,
- ABP'nin form-post hattı, model binding ve jQuery validate hiç değişmedi,
- ayrı bir AJAX yolu ve onun ikinci kez yazılması gereken doğrulaması oluşmadı.

Form katlıyken alanlar `display:none` ile gizlenir, **`disabled` EDİLMEZ** — disabled alan
hiç POST edilmez ve varsayılan tarih/durum sessizce kaybolurdu.

## Tek dosya, yedi giriş noktası

`Tasks/CreateModal` şu yedi yerden aynı `viewUrl` ile açılıyor; hiçbirine dokunulmadı:

`Pages/Tasks/index.js` · `Pages/Board/index.js` · `Pages/Projects/ProjectDetails.js` ·
`wwwroot/js/apya-shell-actions.js` · `wwwroot/js/calendar.js` ·
`dynamic-assets/src/calendar/Toolbar.jsx` · `wwwroot/js/command-palette.js`

## Ekstra konfigürasyonların üç kapısı

Her ekstra **AND**'lenmiş üç kapıdan geçer. Sıra önemli: feature kapalıysa izne hiç bakılmaz
(izin zaten `RequireFeatures` ile devre dışıdır).

```
paket feature'ı  →  izin           →  ayar            →  çizilir
Platform.TaskQuickEntry  Tasks.QuickCreate      TaskCreate.DefaultMode="quick"   hızlı satır
Platform.TaskQuickEntry  Tasks.ManagePlanning   —                                planlama alanları
—                        —                      TaskCreate.ShowKeyboardHints     işaretçi ipuçları
—                        —                      TaskCreate.ShowInfoBanner        bilgi kutusu
```

| Katman | Nerede | Seviye | Varsayılan |
|---|---|---|---|
| `Platform.TaskQuickEntry` | `PlatformFeatures` | kiracı (paket) | `true` |
| `Tasks.QuickCreate` | `PlatformPermissions.Tasks` | rol | — |
| `Tasks.ManagePlanning` | `PlatformPermissions.Tasks` | rol | — |
| `Platform.TaskCreate.DefaultMode` | `PlatformSettings.TaskCreate` | kullanıcı | `"quick"` |
| `Platform.TaskCreate.ShowKeyboardHints` | `PlatformSettings.TaskCreate` | kullanıcı | `true` |
| `Platform.TaskCreate.ShowInfoBanner` | `PlatformSettings.TaskCreate` | **kiracı** | `false` |

Paket dağılımı (`PackageDefinitions`): Basic `false`, Standard / Premium / Enterprise `true`.
Yani **Basic → Standard geçişi** hızlı girişi ve planlama alanlarını açar.

### Görev oluşturmanın kendisi kapıSIZ

`PackageFeatureGates.Map[TaskQuickEntry]` içine `Tasks.Default` ve `Tasks.Create`
**bilerek konmadı**. Paket düşürüldüğünde kullanıcı görev açamaz hâle gelmemeli; yalnız
kısayolları ve planlama alanları kaybolmalı. Modal o durumda sıkı form katmanıyla açılır.

### İstemci gizleme yetkilendirme değildir

`ShowPlanningFields` kapalıyken alanlar render edilmiyor, ama form elle POST edilebilir.
`OnPostAsync` bu yüzden kapıları **yeniden çözüp** `EstimatedHours` / `TaskType` /
`Sprint` / `ParentTaskId` alanlarını sunucuda temizliyor. Aynı ilke kiracı ayarında da
geçerli: `Settings/Index` POST'unda `TenantSettings` izni yeniden kontrol ediliyor.

## Kurulu sistemlerde "yeni izin sessizce kaybolur" tuzağı

ABP yeni izinleri var olan rollere **otomatik vermez**; paket satırları da bir kez
tohumlanır. Bu iki gerçek birleşince yeni bir izin kurulu sistemde hiçbir yerde açılamaz.
Üç ayrı yol kapatıldı:

1. **Host admin rolü** → `TasksPermissionDataSeedContributor` (host-only; kiracı bağlamında
   çalışırsa mükerrer grant → `IX_AbpPermissionGrants` ihlali → "Yeni Müşteri" 500).
2. **Paket izin tavanı** → `TenantPackageManager.BackfillLateAdditionsAsync`. Eski paketlerin
   tavan listesinde yeni ad yoktur; `PackagePermissionStateChecker` "listede yok" deyip her
   kiracıda kapatırdı. Telafi bilerek **dar**: yalnız `LateAddedPermissions` listesindeki
   adlar ve yalnız `PackagePermissionDefaults.IsIncluded` onaylıyorsa. Kör bir "eksikleri
   tamamla" taraması host'un ekrandan bilinçli kaldırdığı izinleri geri getirirdi.
3. **Paket feature satırı** → aynı metot. `GetFeatureValuesAsync` DB'yi okuduğu için, satırı
   olmayan feature paket uygulanırken **hiç yazılmaz** ve kiracı `defaultValue`'ya (`"true"`)
   düşer; Basic paketinde yetenek sessizce açık kalırdı.

> **Yeni izin eklerken:** adı `TenantPackageManager.LateAddedPermissions` listesine yazmayı
> unutma. Yazılmazsa kurulu sistemlerde hiçbir kiracıda açılamaz.

## Ayrıştırıcı

`wwwroot/js/apya-quick-task.js` — global demette (modal AJAX ile yüklendiği için modülün
sayfada zaten hazır olması şart).

| İşaretçi | Örnek | Karşılığı |
|---|---|---|
| `@` | `@ahmet`, `@yılmaz` | atanan (ön ek → yoksa "içinde geçen"; **tek** aday varsa seçilir) |
| `#` | `#backend` | etiket (bilinen etiketin yazımı korunur) |
| `!` | `!yüksek` `!kritik` `!low` | öncelik 1–4 |
| `>` | `>yarın` `>+3g` `>29.08` `>29 Ağu` `>perşembe` | bitiş tarihi |
| `~` | `~` `~gizli` | gizli görev |

- `parseQuickLine` **saf**: DOM'a, jQuery'ye ve `Date.now`'a dokunmaz — "bugün" parametredir.
- Türkçe katlama elle yapılır: `toLowerCase()` `İ`'yi `i̇` (i + birleşen nokta) yapıp
  eşleşmeyi bozuyor.
- `>` diğerlerinden **önce** yenir: değeri boşluk içerebiliyor (`>29 Ağu`).
- `@` yalnız sözcük başında işaretçidir → `info@apya.com` atanan sanılmaz.
- Yıl verilmeyip tarih geçmişte kalıyorsa gelecek yıla taşınır (`>3 Ocak` ocakta bu yıl,
  eylülde gelecek yıl).

Test: `dynamic-assets/src/quick-task/parser.test.js` (43 test). Test dosyayı `fs` ile okuyup
jsdom penceresinde çalıştırır — kaynak tek, kopya yok.

## QA — oturumsuz statik sonda

Modal oturum arkasında olduğu için tarayıcı doğrulaması, gerçek CSS ve gerçek
`apya-quick-task.js` ile beslenen geçici bir statik sayfa üzerinden yapıldı
(`wwwroot/_qa-tc.html`, QA sonrası **silindi** — depoda yok). Ölçülenler:

| Ne | Sonuç |
|---|---|
| Dialog genişliği | 640px (maket hedefi) |
| `modal-body` yüksekliği | **321px** — maketin "970 → 320" iddiası tutuyor |
| Hızlı satır → gerçek alanlar | başlık, atanan, öncelik, bitiş tarihi, etiket, gizli — hepsi doğru |
| Önizleme çipleri | `Yüksek · Ahmet Yılmaz · 29 Ağu · backend · Gizli` |
| Çip etiketleri | `24 – 29 Ağu` (aralık biçimi), `Kritik` (değişimde anında tazeleniyor) |
| Açılır içine tıklama | kapanmıyor (`data-bs-auto-close="outside"`) |
| Koyu tema çip durumları | boş/dolu/gizli/önizleme — hepsi doğru token'a düşüyor |

### İki tuzak

**1. Kare üretmeyen panelde renk ölçümü güvenilmez.** Browser paneli ekranda görünmediğinde
sayfa compositing yapmıyor ve `data-theme` değiştirip aynı senkron blokta `getComputedStyle`
okumak **bayat** değer veriyor: çip zemini koyu temada beyaz görünüyordu, oysa aynı elemanda
`--apya-surface-base` doğru şekilde `#0F0F11` okunuyordu. Inline `background-color: var(...)`
bile beyaz hesaplandığı için bunun ölçüm artefaktı olduğu anlaşıldı. **Doğru yöntem:** temayı
ayarla, sonra o temada **taze eleman üret** ve onu ölç — geçişten etkilenmemiş temiz sonuç verir.

**2. CSSOM taramasında `CSSStyleRule` de `cssRules` taşır.** CSS nesting geldiğinden beri
`CSSStyleRule` `CSSGroupingRule`'dan türüyor ve boş bir `cssRules` listesi tutuyor. Klasik
`if (r.cssRules) { recurse; continue; }` deseni bu yüzden **her stil kuralını atlıyor** ve
tarama sessizce boş dönüyor. `selectorText` yokluğuna göre ayır.

### Kontrast

Ölçülen değerler (WCAG AA eşiği 4,5:1):

| Öğe | Açık | Koyu |
|---|---|---|
| Etiket çipi | 6,92 | ~~2,71~~ → **8,56** (düzeltildi) |
| Öncelik çipi | 6,84 | ✓ |
| Gizli çipi | 7,60 | ✓ |
| Meta çipi | 7,56 | ✓ |

Koyu temada etiket çipi **AA'nın altındaydı**: accent skalası `positive/negative/warning`'in
"-700 = parlak metin" konvansiyonunu izlemiyor, koyu blokta `--apya-accent-600` daha da
koyulaşıyor. `[data-theme="dark"]` altında `--apya-accent-300`'e alındı.

> 🟡 **Açık bulgu (bu ekrana özel değil):** işaretçi ipucu şeridi `--apya-text-tertiary`
> (#9CA3AF) kullanıyor ve beyaz üstünde **2,54:1** ediyor. Bu maketin birebir değeri ve
> kod tabanında her yerde kullanılan tertiary-metin konvansiyonu — tek bir ekranda
> değiştirmek tasarım sistemini tutarsızlaştırırdı. Token seviyesinde ayrıca ele alınmalı.

## Açık kalanlar

- **"Açık kal"** (kaydettikten sonra modalı kapatmayıp sıfırlamak) — ayrı PR. `abp.event`
  üzerinden `app.task.updated` tetikleyip global bir `ModalManager` ile yeniden açma
  tasarlandı; `Pages/Tasks/index.js` ve `ProjectDetails.js` bu olayı zaten dinliyor,
  `Board/index.js` ile `calendar.js`'e dinleyici eklenmesi gerekiyor.
- **`/şablon` işaretçisi** — `ITaskTemplateAppService.ApplyAsync` ayrı bir submit yolu;
  tek-POST tasarımını kırdığı için kapsam dışı bırakıldı.
- **`1c` iki kolon düzeni** ve "AI taslak" / "Şablondan" girişleri.
- `Tasks:Create:InfoText` artık yalnız kiracı ayarı açıkken kullanılıyor;
  `Tasks:Section:BasicInfo` / `:Schedule` / `:StatusPriority` anahtarları **kullanımdan
  düştü** (silinmedi).
