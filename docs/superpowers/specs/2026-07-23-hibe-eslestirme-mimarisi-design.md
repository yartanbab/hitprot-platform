# Hibe Eşleştirme & Başvuru Mimarisi — Tasarım Dokümanı

**Tarih:** 2026-07-23
**Dal:** `claude/hibeler-section-redesign-6ebeab`
**Durum:** Faz A tasarımı onaya hazır; B ve C üst-seviye taslak.

---

## 1. Amaç

Yeni çağrıya çıkan hibe/destek programlarını, profillerine uygun müşterilere (tenant/firma)
yayınlamak, başvurmalarını teşvik etmek ve başvuru sürecini uçtan uca izlemek. Kaynak vizyon:
kullanıcının paylaştığı tenant dashboard'u (KPI'lar + pipeline kartları + "Önerilen Çağrılar"
AI eşleştirme paneli + "Yaklaşan Son Tarihler").

## 2. Karar özeti (kullanıcı onaylı, 2026-07-23)

| Karar | Seçim |
|---|---|
| Kapsam | Tam kapsam hedef; fazlara bölünerek inşa |
| Program vs Çağrı | **İki katman**: `Grant` (program) + `GrantCall` (çağrı) |
| Eşleştirme | **Kural-bazlı önce** (deterministik skor); AI sonradan zenginleştirme katmanı |
| Pipeline ↔ Finans | **Önce bağımsız**; muhasebe entegrasyonu sonraki faz |

## 3. Hedef mimari (iki taraflı)

**Host tarafı (merkezî katalog):**
- `Grant` — kalıcı program (TÜBİTAK 1501). Mevcut; eşleştirme kriterleriyle genişletilir.
- `GrantCall` — programın zamana bağlı bir açılışı (dönem, son başvuru tarihi, bütçe, durum).

**Tenant tarafı:**
- `FirmProfile` — firma başına tekil profil (sektör/ölçek/bölge/anahtar kelime).
- `GrantMatchManager` — kural-bazlı skor: `score(FirmProfile, Grant kriterleri)`. Anlık hesap,
  kalıcılık yok.
- "Önerilen Çağrılar" — açık çağrılardan, programının skoru `MinMatchScore` eşiğini geçenler.
- `GrantApplication` — firma bir çağrıya başvurur; aşama pipeline'ı + tahsilat dilimleri +
  son tarihler ile izlenir.

## 4. İnşa sırası (her faz: ayrı spec → plan → uygula → canlı QA)

| Faz | İçerik | Migration | Teslim değeri |
|---|---|---|---|
| **A — Katalog (host)** | `GrantCall` + `Grant` kriterleri; host program/çağrı yönetim UI'ı | 1 | Host çağrı tanımlayabilir |
| **B — Profil + Eşleştirme + Öneri** | `FirmProfile` + profil UI + `GrantMatchManager` + tenant "Önerilen Çağrılar" feed'i + "Başvur" | 2 | Uygun çağrıları yayınla + teşvik |
| **C — Başvuru pipeline** | `GrantApplication` + `Tranche` + `Milestone` + pipeline UI + tenant KPI'ları + "Yaklaşan Son Tarihler" | 3 | 1. görselin tamamı |

Bağımlılık: A → (B, C). Tam tenant dashboard'u C bitince oluşur; sayfa fazlar boyunca büyütülür.

---

## 5. FAZ A — Ayrıntılı Tasarım (bu spec'in inşa dilimi)

### 5.1 Domain

**Yeni enum — `GrantCallStatus`** (`Domain.Shared/Grants/`):
`Planlandi = 0`, `Acik = 1`, `Kapandi = 2`.

**Yeni enum (flags) — `CompanySize`** (`Domain.Shared/Grants/`):
`Mikro = 1`, `Kucuk = 2`, `Orta = 4`, `Buyuk = 8`. (KOBİ = Mikro|Kucuk|Orta, UI'da yardımcı.)
`Grant.EligibleCompanySizes` bir bit-maskesi olarak saklanır (0 = ölçek kısıtı yok).

**Yeni entity — `GrantCall`** (`Domain/Grants/GrantCall.cs`), `FullAuditedAggregateRoot<Guid>, IMultiTenant`:
- `GrantId : Guid` (FK → Grant)
- `Period : string` (örn. "2025/1", zorunlu, maxLength 32)
- `Status : GrantCallStatus`
- `OpenDate : DateTime?`
- `Deadline : DateTime?` (son başvuru tarihi)
- `Budget : decimal?` (çağrı toplam bütçesi, ops.)
- `Reference : string?` (kurum referans no, maxLength 64)

**Yeni entity — `GrantCriteriaTag`** (`Domain/Grants/GrantCriteriaTag.cs`), Grant'ın child koleksiyonu:
- `GrantId : Guid`
- `Kind : GrantCriteriaKind` enum (`Sektor = 0`, `Bolge = 1`, `AnahtarKelime = 2`)
- `Value : string` (maxLength 64, trim)

Tek tablo `AppGrantCriteriaTags` üç kriter türünü de taşır — ayrı üç tablo yerine kompakt.
(Not: mevcut `Tasks/Tag` entity'si göreve özel olduğu için yeniden kullanılmadı; hibe
kriterleri ayrı bir taksonomi ve `Kind` ayrımı gerektiriyor.)

**Mevcut entity — `Grant` genişletme:**
- `+ EligibleCompanySizes : int` (CompanySize bit-maskesi, default 0)
- `+ Calls : ICollection<GrantCall>` (navigation)
- `+ CriteriaTags : ICollection<GrantCriteriaTag>` (navigation)
- Mevcut `MinMatchScore` eşik olarak korunur (program seviyesi; çağrılar devralır).

### 5.2 EF Core

`PlatformDbContext` içine mevcut `Grant` config bloğunun yanına:
- `DbSet<GrantCall> GrantCalls`, `DbSet<GrantCriteriaTag> GrantCriteriaTags`.
- `AppGrantCalls`: `ConfigureByConvention`, `Period` required(32), `Reference`(64),
  `HasOne<Grant>().WithMany(g => g.Calls).HasForeignKey(x => x.GrantId).OnDelete(Cascade)`,
  `HasIndex(x => x.GrantId)`, `HasIndex(x => x.Deadline)`.
- `AppGrantCriteriaTags`: `Value` required(64), `HasOne<Grant>().WithMany(g => g.CriteriaTags)
  .HasForeignKey(x => x.GrantId).OnDelete(Cascade)`.
- `Grant` bloğuna `EligibleCompanySizes` property (default 0).

Migration adı: `Add_GrantCall_And_Criteria`. Tablo prefix'i `App`, şema `PlatformConsts.DbSchema`.
Uygulama: `dotnet ef database update` (DbMigrator "ConnectionString not initialized" ile çökerse
`--startup-project ...Web` ile bypass — bkz. proje notları).

### 5.3 Application katmanı

**DTO'lar** (`Application.Contracts/Grants/Dtos/`):
- `GrantCallDto : EntityDto<Guid>` — GrantId, Period, Status, OpenDate, Deadline, Budget,
  Reference; + gösterim için `GrantName`.
- `CreateUpdateGrantCallDto` — GrantId, Period, Status, OpenDate, Deadline, Budget, Reference.
- `GrantDto` genişletme: `EligibleCompanySizes`, `CriteriaTags` (Kind+Value listesi),
  `CallCount` (özet). Tam çağrı listesi ayrı endpoint'ten.
- `CreateUpdateGrantDto` genişletme: `EligibleCompanySizes`, `CriteriaTags`.

**AppService'ler** (`Application/Grants/`):
- `GrantCallAppService : CrudAppService<GrantCall, GrantCallDto, Guid, GetGrantCallListDto,
  CreateUpdateGrantCallDto>`; `GetGrantCallListDto : PagedAndSortedResultRequestDto` +
  `GrantId?` filtresi (belirli programın çağrılarını çekmek için). İzinler: **mevcut
  `PlatformPermissions.Grants.*` yeniden kullanılır** (yeni permission YOK → DbMigrator seed
  gerekmez).
- `GrantAppService` genişletme: Create/Update sırasında `CriteriaTags` koleksiyonunu senkronla
  (elle değil AutoMapper + koleksiyon güncelleme deseni). `GetListAsync` `CallCount` doldurur
  (batch query, N+1 yok — Projects'teki desenle aynı).

**AutoMapper:** yeni DTO↔entity eşlemeleri `PlatformApplicationAutoMapperProfile`'a; elle
mapping yazılmaz.

### 5.4 UI (host katalog yönetimi)

Az önce reskin edilen `/Grants` kart grid'i host program kataloğu olarak kalır. Eklemeler:
- **Program kartı**: kriter chip'leri (sektör/bölge/anahtar kelime `apya-chip`, ölçekler
  ayrı ton) + "Çağrılar (N)" genişletilebilir bölüm (Webhooks teslimat-log deseni: aç/kapa,
  ilk açılışta lazy `GrantCallAppService.getList({grantId})`).
- Genişleyen çağrı listesi: dönem, durum rozeti (Planlandı/Açık/Kapandı), son tarih, bütçe +
  düzenle/sil ikon-butonları + "Çağrı Ekle".
- **Program Create/Edit modalı** genişletme: ölçek çoklu-seçim (checkbox grubu →
  EligibleCompanySizes maskesi) + sektör/bölge/anahtar kelime etiket girişleri (Select2 `tags`
  — Tasks modalındaki mevcut desen).
- **Yeni GrantCall Create/Edit modalı**: dönem, durum, açılış/son tarih (`.apya-date-range`
  yerine tekil tarih inputları), bütçe, referans.

Tenant tarafına Faz A'da **dokunulmaz**. Host/tenant UX ayrımı (tenant dashboard) B/C'de gelir.

### 5.5 Localization

`tr.json` + `en.json`'a yeni anahtarlar: `Menu`/`Permission` mevcut (Grants) — değişmez.
Yeni: `GrantCall:Period/Status/Deadline/Budget/Reference`, `Grant:Criteria:Sector/Region/Keyword`,
`Grant:CompanySize:*`, `GrantCallStatus:*`, ilgili Notify anahtarları. Kullanıcıya dönen metin
koda gömülmez.

### 5.6 Doğrulama (Faz A bitiş kriteri)

1. Migration üretilir + uygulanır → doğrulama: `dotnet ef` hatasız, tablo `AppGrantCalls` +
   `AppGrantCriteriaTags` DB'de.
2. `dotnet build src/Apya.Platform.Web` → doğrulama: **0 hata**.
3. Canlı QA (Claude Browser, host oturumu, ayrı port):
   - Program oluştur → kriter etiketleri + ölçekler kaydediliyor (round-trip: sayfa yenile,
     chip'ler doğru).
   - Programa çağrı ekle (dönem+son tarih+durum) → çağrı listesinde doğru; düzenle; sil.
   - CallCount kartta doğru; boş-durum doğru.
   - Dark/light tema + mobil taşma yok.
   - Konsol temiz (yalnız bilinen SignalR 405).

### 5.7 Faz A kapsam DIŞI (bilinçli)

- FirmProfile, eşleştirme skoru, "Önerilen Çağrılar", "Başvur" (→ Faz B).
- GrantApplication, pipeline, dilim, son tarih paneli, tenant KPI'ları (→ Faz C).
- Muhasebe/Kasa entegrasyonu (→ Faz C sonrası).
- AI-bazlı eşleştirme (→ B sonrası zenginleştirme).
- Çağrı seviyesinde kriter override (şimdilik kriterler program seviyesinde).

---

## 6. B ve C — üst-seviye taslak (ayrı spec'lerde detaylanacak)

**Faz B:** `FirmProfile` (tenant tekil, `AppFirmProfileTags` Kind/Value + CompanySize) +
profil düzenleme UI (tenant) + `GrantMatchManager` (tag-overlap + ölçek/bölge uygunluk →
0-100 skor, `MinMatchScore` eşiği) + tenant "Hibeler" sayfasında "Önerilen Çağrılar" feed'i +
"Başvur/İlgileniyorum" aksiyonu. Migration 2.

**Faz C:** `GrantApplication` (tenant, FK GrantCall) + child `GrantDisbursementTranche`
(sıra, tutar, durum, vade) + child `GrantMilestone` (başlık, vade, tamamlandı) + aşama
pipeline enum (Başvuru→Değerlendirme→Onay→Ödeme) + pipeline UI + tenant dashboard KPI'ları
(Onaylanan/Tahsil Edilen/Değerlendirmede/Bu Ay Son Tarih) + "Yaklaşan Son Tarihler" paneli.
Migration 3.
