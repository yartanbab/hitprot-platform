# Hibe Faz B — Firma Profili + Eşleştirme + Öneri + Başvuru (Tasarım)

**Tarih:** 2026-07-23
**Dal:** `claude/hibeler-section-redesign-6ebeab`
**Ön koşul:** Faz A bitti (GrantCall + Grant kriterleri + host katalog). Bkz `2026-07-23-hibe-eslestirme-mimarisi-design.md`.
**Durum:** Onaya hazır.

## 1. Kullanıcı kararları (2026-07-23)
- Tenant öneri/profil ekranı: **/Grants bağlama-duyarlı** (HOST → Faz A katalog yönetimi; TENANT → öneri feed + profil).
- "Başvur": **minimal GrantApplication kaydı** oluşturur (tenant + FK GrantCall + aşama + tarih); Faz C dilim/son-tarih/pipeline ile zenginleştirir.

## 2. Domain (yeni)

**Enum — `GrantApplicationStage`** (`Domain.Shared/Grants/`): `Basvuru=0`, `Degerlendirme=1`, `Onay=2`, `Odeme=3`. (Faz B yalnız `Basvuru`'yu kullanır; tam pipeline Faz C.)

**Entity — `FirmProfile`** (`Domain/Grants/`), `FullAuditedAggregateRoot<Guid>, IMultiTenant`. Firma başına **tekil** (tenant başına en fazla 1 satır):
- `TenantId` (firma)
- `CompanySize? Size` (firmanın ölçeği — tekil değer; Grant'ın mask'iyle eşleşir)
- `ICollection<FirmProfileTag> Tags`

**Entity — `FirmProfileTag`** (child): `FirmProfileId`, `Kind` (mevcut `GrantCriteriaKind`: Sektor/Bolge/AnahtarKelime), `Value` (maxLength 64, trim). Grant'ın `GrantCriteriaTag`'iyle aynı desen.

**Entity — `GrantApplication`** (minimal, `Domain/Grants/`), `FullAuditedAggregateRoot<Guid>, IMultiTenant`:
- `TenantId`, `GrantCallId` (FK), `Stage` (GrantApplicationStage, default Basvuru), `AppliedDate` (DateTime)
- (Faz C ekleyecek: ApprovedAmount, tranches, milestones.)
- Aynı tenant+call için tek başvuru (AppService'te idempotent kontrol; unique index TenantId+GrantCallId).

**Domain service — `GrantMatchManager`** (`Domain/Grants/`): saf hesap, kalıcılık yok.
```
int Score(FirmProfile firm, Grant grant, IReadOnlyList<GrantCriteriaTag> grantTags)
```
Formül (kural-bazlı, deterministik, 0-100):
- kinds = {Sektor, Bolge, AnahtarKelime}
- Grant'ın etiketi olan her kind için: `dim = eşleşenSayı / grantEtiketSayısı(kind)` (case-insensitive, trim).
- `base = ortalama(dim değerleri) * 100`. Grant'ın hiç etiketi yoksa `base = 0` (hedeflenmemiş program eşleşmez — host etiketlemeli).
- `sizeOk = grant.EligibleCompanySizes == 0 || firm.Size == null || (firm.Size & grant.EligibleCompanySizes) != 0`
- `score = sizeOk ? base : base * 0.3` (ölçek uyumsuzsa ağır ceza), 0-100'e clamp + yuvarla.
- Bir çağrı "önerilir" ⇔ programının skoru ≥ `program.MinMatchScore`.

## 3. EF Core
Yeni tablolar: `AppFirmProfiles`, `AppFirmProfileTags` (Cascade FK), `AppGrantApplications` (Cascade FK → GrantCalls, unique index `(TenantId, GrantCallId)`). Migration adı: `Add_FirmProfile_And_Application`.

## 4. Application

**`FirmProfileAppService`** (tenant): `GetMyProfileAsync()` (mevcut tenant'ın profili; yoksa boş DTO), `UpdateMyProfileAsync(dto)` (upsert — yoksa oluştur). İzin: yeni `PlatformPermissions.Grants.ManageProfile` (tenant kullanıcısı; permission provider + DbMigrator seed gerekir) **VEYA** basitlik için mevcut `Grants.Default` (salt profil düzenleme host-dışı sadeliği). → **Karar bekliyor: spec §7.**

**`GrantRecommendationAppService`** (tenant): `GetRecommendationsAsync()` → mevcut tenant profilini + tüm açık (`Status==Acik`) çağrıları çek, `GrantMatchManager` ile skorla, programının `MinMatchScore` eşiğini geçenleri döndür (skor + kalan gün + program bilgisiyle), skora göre azalan. İzin: `Grants.Default`.

**`GrantApplicationAppService`** (tenant): `ApplyAsync(grantCallId)` → mevcut tenant için (yoksa) `Stage=Basvuru` başvuru oluştur (idempotent — varsa mevcut olanı döndür); `GetMyApplicationsAsync()` → tenant'ın başvuruları (call+program adıyla). İzin: `Grants.Default`.

AutoMapper: yeni DTO↔entity map'leri.

## 5. UI — /Grants bağlama-duyarlı
`IndexModel` (`ICurrentTenant` inject): `IsHost = CurrentTenant.Id == null`.
- **Host** → mevcut Faz A katalog UI (değişmez).
- **Tenant** → yeni görünüm:
  - **Firma Profili** kartı/düzenleme (ölçek seçimi + sektör/bölge/anahtar kelime chip-input; Faz A modal tag-input widget'ı yeniden kullanılır).
  - **Önerilen Çağrılar** feed'i: skor rozeti (`%88` — `apya-chip-ai`), program adı/kurum, kalan gün, "Başvur" butonu. Boş profil → "Profilinizi doldurun" yönlendirmesi.
  - **Başvurularım** (minimal liste): çağrı + aşama rozeti (Faz B'de hepsi "Başvuru").
`Index.cshtml` iki dalı `@if (Model.IsHost)` ile ayırır; JS iki ayrı init yolu (`Index.js` host, yeni `Tenant.js` veya aynı dosyada dallanma).

## 6. Doğrulama
1. Migration üret+uygula (`has-pending-model-changes` temiz), build 0 hata.
2. `GrantMatchManager` birim testleri (skor formülü: tam/kısmi/sıfır overlap, ölçek uyumsuz cezası, eşik).
3. Canlı QA: **tenant bağlamına geçilir** (ABP tenant switch; seed'de 3 tenant var). Profil doldur → öneri feed skorlu görünür → Başvur → Başvurularım'da görünür (idempotent tekrar-başvuru). Host bağlamı hâlâ katalog gösterir (regresyon yok). Dark/light + mobil.

## 7. Onay bekleyen tek nokta
**Profil düzenleme izni:** yeni `Grants.ManageProfile` permission (DbMigrator seed gerekir) mi, yoksa mevcut `Grants.Default` yeterli mi? Öneri: **`Grants.Default` yeniden kullan** (Faz A deseni — yeni permission = seed derdi). Farklı istenirse belirt.

## 8. Faz B DIŞI (Faz C)
ApprovedAmount, tahsilat dilimleri, milestone/son-tarih paneli, pipeline aşama ilerletme, tenant dashboard KPI'ları, "Yaklaşan Son Tarihler". AI-bazlı eşleştirme (kural-bazlının üstüne).

---

## GÜNCELLEME (2026-07-23) — kapsam genişletildi + kararlar kilitlendi

Kullanıcı iki büyük yetenek ekledi; ikisi de **aynı eşleştirici çekirdeğin iki yönü**:
- **Tenant yönü:** bir firma için açık çağrıları skorla → öneri feed (pull).
- **Host yönü:** bir çağrı için firmaları skorla + filtrele → toplu öneri gönder (push).

### Mimari
- **`FirmSignals` soyutlaması** (eşleştirici girdisi): elle profil (sektör/bölge/anahtar + ölçek) **+ türetilmiş proje sinyalleri**. `GrantMatchManager.Score(FirmSignals, Grant)` her iki yönde kullanılır. Profil boş olsa bile proje geçmişinden taban sinyal çıkar. **Genişletilebilir tut** — kullanıcı ileride iki tarafa (firma & hibe) yeni karar-parametreleri ekleyeceğini belirtti; skor boyutları eklemeli olmalı.
- **Proje sinyalleri (kullanıcı: üçü de):** (1) bütçe ölçeği (geçmiş proje bütçeleri ↔ hibe MaxAmount), (2) proje kategorisi (GrantProject/Event/Other), (3) aktif proje sayısı/kapasite. Skora bütçe-uyumu + kategori-uyumu (+ kapasite) boyutları eklenir.
- **`GrantRecommendation` (kalıcı, yalnız host-push):** tenant + FK GrantCall + Source(Auto/Host) + Note/Reason + Status(New/Seen/Applied/Dismissed) + CreatedBy. Otomatik feed CANLI hesaplanır (kalıcılık yok); host-push kayıt oluşturur. Tenant feed'i ikisini birleştirir ("Platform önerdi" rozeti).
- **Host hedefleme/gönder:** çağrı seç → firma filtresi (ölçek/sektör/bölge + bütçe aralığı + proje kategorisi + min otomatik-skor; aynı FirmSignals'ı kullanır) → önizle → gönder (GrantRecommendation kayıtları + bildirim).
- **Bildirim (kullanıcı: in-app + e-posta):** mevcut Notifications alanı (in-app) + ABP `IEmailSender` (e-posta). Gerçek SMTP dağıtım ayarıdır; kod soyutlama üzerinden yazılır, dev'de null/log sender.
- **İzin (§7 kararı):** profil/öneri/başvuru için **mevcut `Grants.Default` yeniden kullanılır** (yeni permission = DbMigrator seed derdi; Faz A deseni). Host dispatch host-bağlamıyla kapılır.

### Yeniden bölümleme (kullanıcı: B1→B2→B3 sıralı)
| Alt-faz | İçerik | Migration |
|---|---|---|
| **B1** | FirmProfile + `GrantMatchManager` (FirmSignals soyutlaması, **profil-only skor**) + tenant otomatik feed + minimal GrantApplication ("Başvur") + /Grants bağlama-duyarlı | `Add_FirmProfile_And_Application` |
| **B2** | Eşleştiriciyi proje sinyalleriyle zenginleştir (bütçe/kategori/kapasite) — B1 skoruna additif | (muhtemelen migration yok; salt okuma-agregasyon) |
| **B3** | `GrantRecommendation` kalıcı + host hedefleme/filtre/önizle/gönder + in-app+e-posta bildirim | `Add_GrantRecommendation` |

Sonra Faz C (pipeline/dilim/dashboard) planlı.

**Bu spec'in §2–§6'sı B1'i tanımlar** (GrantRecommendation/host-dispatch/proje-sinyalleri B2–B3'e taşındı). B1 için ayrı plan: `docs/superpowers/plans/2026-07-23-hibe-faz-b1.md`. B2/B3 kendi spec/planlarını alacak.
