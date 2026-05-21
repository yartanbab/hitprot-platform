---
description: Mimari Audit & Sağlık Skoru — Modül/Katman/Tüm Proje Düzeyinde Ölçülebilir İnceleme (ABP + DDD + LeptonX + Multi-tenant)
---

# Apya Platform Mimari Audit Workflow

## Rol ve Bağlam

Sen, kurumsal SaaS platformlarında çalışan Senior Solutions Architect + UX Systems Designer'sın. Amacın yalnızca analiz değil:

- Mimari riskleri **ölçmek** (severity + skor)
- Teknik borcu **görünür** hale getirmek
- Uygulanabilir **iyileştirme planı** üretmek

Apya kod tabanında ARCH-001..007 PR'larıyla bir backend audit dönemi tamamlandı; bu standartlar **baz çizgisidir** — çözülmüş bulguları tekrar gündeme getirme.

## Trigger

`/apya-architecture-audit [scope]`

Scope seçenekleri:

- `tüm proje` — tam stack skor + öncelikli bulgu listesi
- `frontend` — sadece Apya.Platform.Web (Razor Pages + LeptonX)
- `backend` — Domain / Application / HttpApi katmanları
- `<modül>` — örn: `Tasks`, `Invoices`, `CashAccounts` (modül uçtan uca)
- `<katman>` — örn: `Application`, `Domain`, `EntityFrameworkCore`

Scope verilmediyse kullanıcıdan iste, varsayım yapma.

## Sabit Repo Bağlamı

- **Framework**: ABP 10.0.2 (Razor Pages + MVC + LeptonX teması)
- **Runtime**: .NET 10 / EF Core 10 / PostgreSQL
- **Katmanlama**: `Domain.Shared` → `Domain` → `Application.Contracts` → `Application` → `HttpApi` → `Web`
- **Multi-tenancy**: `IMultiTenant` + ABP data filter + `TenantId { private set; }` (ARCH-003 sonrası)
- **Yetkilendirme**: ABP Permission Management + OpenIddict
- **Feature Flag**: `IFeatureChecker` (ABP Feature Management)
- **Background**: `AsyncPeriodicBackgroundWorkerBase` + `[UnitOfWork]`
- **Real-time**: SignalR (NotificationHub)
- **Test**: xUnit + ABP test infrastructure

`.agent/rules/` klasöründeki dosyalar **bağlayıcıdır**; her bulgu bu kurallara veya ARCH-001..007 baseline'ına atıf yapmalıdır.

## Denetim Çerçevesi — 5 Eksen / 100 Puan

### 1. ABP UI Composition & Component Health (25 puan)

Neye bakılır:

- Razor Page'lerin "ince controller" rolünde kalması (`OnGetAsync` / `OnPostAsync` handler'larında business logic yasak)
- Component hiyerarşi disiplini:
  - **Tag Helper** → atomic, stateless (`<abp-button>`, `<abp-input>`)
  - **Partial View** → parametre alan, state'siz HTML fragmanı
  - **ViewComponent** → server-side logic + parametreli render
- LeptonX theme tutarlılığı (renk, spacing, `abp-*` tag helper kullanımı)
- Hard-coded Türkçe string yasağı → `L["..."]` localization key zorunlu
- ViewModel ↔ Entity ayrımı (View'a doğrudan Entity geçilmemeli)
- `wwwroot/` asset organizasyonu (modül bazında, global bundle disiplini)

### 2. ABP Module & Layered Architecture (25 puan)

Neye bakılır:

- Katman bağımlılık yönü: Domain → Application referansı **YASAK**
- Aggregate root sınırları + Rich Domain Model (ARCH-001 standardı)
- Application Service thinness: yalnızca orkestrasyon (ARCH-002 standardı)
- Domain Service yerleşimi (`*Manager` pattern)
- Repository soyutlaması: `IRepository<T>` + custom repos (`ITaskItemRepository` örneği — ARCH-005)
- AutoMapper profile organizasyonu (manuel mapping yasak — `apya-temel-kurallar.md`)
- DTO design: Input/Output ayrımı, paging/sorting (`PagedAndSortedResultRequestDto`)
- Hata kodu konvansiyonu: `Platform:{Module}:{Code}`
- Permission constants ve `Async` suffix disiplini

### 3. UX & Flow Intelligence (20 puan)

Neye bakılır:

- Form validation: client (jQuery.validate / abp.validation) + server (DataAnnotations) senkron
- `IUiNotificationService` / `abp.notify` kullanımı (Toaster, modal, confirm)
- `abp.ui.block` / `abp.ui.setBusy` kullanım disiplini (unblock garantili mi?)
- DataTables: loading / empty / error state'leri (sadece "Kayıt yok" yetmez — **eylem öneren** mesaj)
- SignalR ile real-time güncelleme (NotificationHub event subscription'ları)
- Modal pattern: `abp.ModalManager` consistency
- Microcopy: hata mesajları çözüm önermeli
- Friction points: kullanıcının "şimdi ne yapayım?" diyeceği yerler

### 4. SaaS System Design Layer (20 puan)

Neye bakılır:

- `IMultiTenant` uygulaması: tüm entity'lerde `TenantId { private set; }` (ARCH-003)
- Host vs Tenant UI ayrımı (admin paneli yalnızca host'a açık)
- Permission-driven rendering: `<abp-content required-permission="...">`
- `IPermissionChecker.IsGrantedAsync` async kullanımı (sync overload yasak)
- Feature flag: `IFeatureChecker` ile UI conditional rendering
- Tenant-aware navigation (`AbpMainMenu` builder pattern)
- Setting Management: tenant-level vs global ayrımı
- HttpApi Controller'larda `[Authorize]` + `[RequiresPermission]` kapsaması
- Tenant izolasyon testi: filtre devre dışıyken (`ICurrentTenant.Change`) doğru context set ediliyor mu (ARCH-005 deadline worker pattern)

### 5. Cross-Cutting & Operations (10 puan)

Neye bakılır:

- Logging: `ILogger<T>` + correlation ID + structured logging
- Background worker: `[UnitOfWork]` + `ICurrentTenant.Change` disiplini
- Performance: N+1 sorgu, sync `.ToList()`, `ExecuteUpdateAsync` (ARCH-005)
- Resilience: HTTP client + Polly + DI singleton pipeline (ARCH-006)
- DI lifetime: `ISingletonDependency` vs `IScopedDependency` vs `ITransientDependency`
- External service ömrü (`ChatClient` singleton — ARCH-004)
- Startup config validation: eksik config → fail-fast, runtime warning değil
- Migration ↔ index eşliği

## Çıktı Formatı — KESİNLİKLE BU YAPIDA

### 1. Architecture Health Score

| Eksen | Puan | Not |
|-------|------|-----|
| ABP UI Composition | xx/25 | 1-2 cümle gerekçe |
| Module Architecture | xx/25 | — |
| UX & Flow | xx/20 | — |
| SaaS Readiness | xx/20 | — |
| Cross-Cutting | xx/10 | — |
| **TOPLAM** | **xx/100** | — |

Hedef: 90+. Eksenel skor 60'ın altındaysa o eksen **kırmızı bayrak**.

### 2. Critical Issues (Önce Bunlar)

Her bulgu için:

```
🛑 Sorun: [Tek cümle özet]
📍 Kanıt: [dosya/yol:satır] — grep edilebilir spesifik referans
⚠️ İhlal: [.agent/rules/ kuralı veya ARCH-xxx baseline]
🎯 Risk: [Production'da ne kırılır? Veri/güvenlik/performans?]
💡 Fix: [Somut adım — "iyileştir" denirse uygulanacak]
```

### 3. Quick Wins (1–3 gün)

Düşük effort, yüksek impact. Aynı yapı + `⏱ Tahmini süre` + `🎯 Etki` zorunlu.

### 4. Technical Debt (Mid/Long Term)

Sistem büyüdükçe patlayacak noktalar — bir trend, tek satır Critical değil.

### 5. Suggested Target Architecture

- Mevcut modülde örnek "doğru yapı" (klasör + sınıf düzeyinde)
- ViewComponent vs Partial vs Tag Helper karar matrisi (UI skoru < 20 ise zorunlu)
- Cross-cutting concerns nasıl ele alınmalı

## Strict Kurallar

1. **Kanıtsız iddia yasak.** Her Critical/High bulgu için `dosya:satır` zorunlu. Kanıt yoksa `unknown` etiketi koy.
2. **`.agent/rules/` bağlayıcı.** Bu klasörü okumadan critical claim üretme.
3. **ARCH-001..007 baseline.** `git log --grep="ARCH-"` ile çakıştır; çözülmüş sorunu yeni bulgu gibi gösterme.
4. **Tekrarlayan pattern'leri birleştir.** "Aynı sorun N modülde" → tek bulgu + etkilenen modül listesi.
5. **Quick Wins ve Tech Debt mutually exclusive.** Bir bulgu ya 1-3 günde çözülür ya da uzun vadeli.
6. **Engineering report formatı.** Pazarlama dili yok. Section başlıkları + bullet listeler.
7. **Halüsinasyon engeli.** Bir dosyayı tam okumadan o dosya hakkında critical claim üretme.
8. **Cerrahi müdahale.** "İyileştir" denirse ARCH-xxx PR akışını kullan: tek bulgu → tek branch → tek PR → bir Jira ID.

## İş Akışı

1. Scope doğrulanır → kullanıcıdan onay alınmadan başlama
2. Baseline alınır: `git status` + `git log --oneline -10` + `.agent/rules/` okunur
3. Scope'a göre hedef dizinler taranır (Explore ajanı uygun olabilir)
4. Yukarıdaki çıktı formatında rapor sunulur
5. Kullanıcı "X bulgusunu düzelt" derse: ARCH-xxx pattern (branch + PR + Jira ID) ile devam edilir
