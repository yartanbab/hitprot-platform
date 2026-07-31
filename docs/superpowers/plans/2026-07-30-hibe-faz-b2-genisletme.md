# Hibe Faz B2 (Eşleştiriciyi Proje Sinyalleriyle Zenginleştir) Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`).

**Goal:** `GrantMatchManager` skorunu firmanın geçmiş proje verisiyle (bütçe ölçeği, kategori, aktiflik) zenginleştir; firma profil doldurmasa bile proje geçmişinden taban sinyal çıksın.

**Architecture:** Salt okuma-agregasyon (migration YOK). `FirmSignals`'a proje alanları eklenir; `GrantRecommendationAppService` tenant'ın `Project`'lerini okuyup sinyalleri türetir; `GrantMatchManager.Score` yeni boyutları harmanlar. B1 davranışı proje verisi yokken korunur (geriye uyumlu).

**Tech Stack:** .NET 10, ABP 10, EF Core, xUnit + Shouldly.

## Global Constraints
- Yeni permission/migration YOK. Kural-bazlı, deterministik, açıklanabilir; formül sabitleri kodda okunur/ayarlanabilir.
- Proje okuması tenant-scoped (Project IMultiTenant, filtre AÇIK — firmanın kendi projeleri).
- Her task sonu commit; push beklemede.
- Build worktree'de `abp install-libs`.

## Skor formülü (tasarım kararı — ayarlanabilir sabitler)
```
tagScore  = B1 (grantın etiketi olan her boyutta eşleşen/grant-etiket oranı ort ×100; grant etiketsizse 0)

// proje sinyalleri (yoksa null)
budgetFit  = fit(grant.MaxAmount, firm.TypicalProjectBudget)   // 0.5..3x→100, 0.2..0.5|3..8x→70, dışı→40; ikisi de bilinmiyorsa null
categoryFit= firm.DominantCategory==GrantProject ? 100 : (firm.HasGrantProjectExperience ? 65 : 40)  // proje yoksa null
projectScore = ort(mevcut {budgetFit, categoryFit})           // hiçbiri yoksa null

// harman
hasProfileTags = firm.Tags.Any()
base = hasProfileTags
       ? (projectScore==null ? tagScore : tagScore*0.75 + projectScore*0.25)
       : (projectScore==null ? 0        : projectScore*0.55)   // profil yok → proje-only taban

// ölçek + kapasite
sizeOk = grant.EligibleCompanySizes==0 || firm.Size==null || (firm.Size & grant.EligibleCompanySizes)!=0
score  = clamp(round((sizeOk ? base : base*0.3) + (firm.ActiveProjectCount>0 ? 3 : 0)), 0, 100)
```

---

### Task 1: Domain — FirmSignals proje alanları + GrantMatchManager formülü + testler
**Files:** `src/Apya.Platform.Domain/Grants/FirmSignals.cs`, `GrantMatchManager.cs`, `test/.../Grants/GrantMatchManager_Tests.cs` (B1 testleri korunur, yeni testler eklenir).

- [ ] **FirmSignals genişlet** (`using Apya.Platform.Projects;`):
```csharp
public decimal? TypicalProjectBudget { get; set; }   // >0 bütçeli projelerin ortalaması
public ProjectCategory? DominantCategory { get; set; } // en sık kategori
public bool HasGrantProjectExperience { get; set; }    // ≥1 GrantProject
public int ActiveProjectCount { get; set; }            // EndDate null veya gelecekte
```
- [ ] **GrantMatchManager.Score** — B1 tagScore hesabını bir `TagScore(...)` private metoduna çıkar; yukarıdaki formülü uygula. `fit` + `CategoryFit` + harman private metotlar. B1 davranışı: proje alanları default (null/false/0) → projectScore null, hasProfileTags'e göre base=tagScore → **B1 ile aynı**.
- [ ] **Testler:** B1'in 5 testi (proje alanları default) AYNEN geçmeli (geriye uyumluluk). Yeni:
  - Profil yok + GrantProject deneyimi + bütçe uygun → base = projectScore*0.55 (skor > 0).
  - Profil var + proje-only refine (tagScore 100, projectScore düşük → hafif düşer).
  - budgetFit uç oranlar (çok küçük/çok büyük hibe → 40).
  - ActiveProjectCount>0 → +3.
- [ ] `dotnet test ...Grants` PASS. Commit: `feat(grants): GrantMatchManager proje sinyalleri (butce/kategori/kapasite) (B2)`

---

### Task 2: Application — proje sinyali agregasyonu
**Files:** `src/Apya.Platform.Application/Grants/GrantRecommendationAppService.cs` (+ B3 için yeniden kullanılabilir küçük yardımcı düşünülebilir ama B2'de inline yeter).

- [ ] `IRepository<Project, Guid>` inject et.
- [ ] FirmSignals kurulurken (profil yüklendikten sonra) tenant'ın projelerini oku (`GetListAsync()`, tenant-scoped) ve türet:
  - `TypicalProjectBudget` = `TotalBudget>0` projelerin ortalaması (yoksa null).
  - `DominantCategory` = en sık `Category` (proje yoksa null).
  - `HasGrantProjectExperience` = herhangi `Category==GrantProject`.
  - `ActiveProjectCount` = `EndDate==null || EndDate>=today`.
- [ ] Bu alanları `signals`'a ata (profil boş olsa bile — proje-only taban için).
- [ ] Build Application 0 hata. Commit: `feat(grants): oneri servisinde proje sinyali agregasyonu (B2)`

---

### Task 3: Canlı QA + doğrulama
- [ ] Build Web 0 hata; GrantMatchManager testleri yeşil.
- [ ] Canlı QA (host-as-firma, 44398): 
  - **Profil YOK + host'a GrantProject-kategori proje(ler) + uygun bütçe** → `getMyRecommendations` kriterli test hibesini proje-only taban skorla döndürmeli (B1'de profil boşken 0 dönerdi).
  - Profil VAR → skor proje sinyaliyle hafifçe değişir (B1 saf-tag skoruna kıyasla).
  - Test verisi (host proje + test grant/call + host profil) temizlenir.
- [ ] Commit (varsa QA fix'i). Not: tenant-context görsel QA B1'deki gibi bu ortamda imkânsız; formül birim testleri + host-as-firma entegrasyonu ile doğrulanır.

## Self-Review
- Geriye uyumluluk: proje alanları default → B1 skoru birebir. B1'in 5 testi değişmeden geçmeli.
- Genişletilebilirlik: yeni boyut = FirmSignals'a alan + Score'da bir terim; imza sabit.
- Tenant izolasyonu: Project okuması filtre AÇIK (firmanın kendi projeleri); katalog okuması hâlâ filtre-KAPALI (B1 gotcha).
