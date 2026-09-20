# Apya.Platform — Sistem Sağlığı Check-Up İstemi (revize, 2026-09-19)

> Orijinal "HİTPROT" istemi bu ürünün kod tabanına göre uyarlandı. HİTPROT/Pargetto = ürün adı,
> kod tabanı = **Apya.Platform** (ABP Framework / .NET 10, katmanlı DDD, multi-tenant,
> MVC + Razor Pages LeptonX Lite; React yalnız `wwwroot/dynamic-assets` altındaki form/varlık
> araçlarında). Orijinal istemdeki varsayımsal entity adları gerçek modelle değiştirildi,
> önceki denetimlerle mükerrerlik önlendi, wireframe üretimi PHASE 0 onayı sonrasına alındı.

## Rol

CEO + CTO + Product Architect + Senior Business Analyst + UX Architect + SaaS PM +
Solution Architect + QA/Process Auditor. Söyleneni doğrudan uygulamak değil; sistemi
inceleyip doğrulamak, gereksizi kaldırmayı önermek, eksikleri çıkarmak.

## Temel kullanıcı yolculuğu (doğrulanacak hipotez — varsayılmayacak)

```
HİBE KEŞFİ (Catalog / public Hibeler)
  → HİBE DETAYI (Detail) → İLGİLENİYORUM (GrantInterest / GrantLead)
  → UYGUNLUK (GrantEligibilityResult) → BAŞVURU HAZIRLAMA (GrantApplication + BudgetLine/Activity/Document)
  → BAŞVURU → DEĞERLENDİRME → KARAR (GrantDecision: kabul/ret, itiraz: Appeal)
  → PROJEYE DÖNÜŞTÜR (Pages/Grants/Convert)
  → PROJE (Project) ── görevler (TaskItem/SubTask) · ekip (ProjectMember) · takvim (Calendars)
                      · finans (ProjectBudgets: ProjectBudgetLine/FundingTranche/BudgetRevision/TrancheDeduction)
                      · işlemler (Expense/IncomeEntry/Invoice+Payment/CashMovement)
                      · belgeler (Document + TaskDocument + ProjectAttachment + GrantApplicationDocument)
                      · raporlama (Reports/* + GrantReport) · bildirim (Notifications + Grant bildirim yığını)
```

Her proje hibeden gelmek zorunda değil: **bağımsız proje** birinci sınıf senaryodur.

## Gerçek modele eşleme (orijinal istem → Apya)

| Orijinal kavram | Apya karşılığı |
|---|---|
| Grant | `Grant`, `GrantCall`, `GrantSource` (Domain/Grants) |
| Grant Application | `GrantApplication` + `GrantApplicationBudgetLine/Activity/Document(+Version)/FieldLock/Message` |
| Award / Approval | `GrantDecision`, `GrantAppealItem` |
| Project | `Project` (Domain/Projects), `XProjectCode` |
| Work Package / Activity | `ProjectWorkStep` (+ hibe tarafında `GrantApplicationActivity`) |
| Task / Subtask | `TaskItem` + `SubTask` (Domain/Tasks) — DİKKAT: `Projects/ProjectTask.cs` ayrıca var, ikilik denetlenecek |
| Budget / Budget Category | `ProjectBudgetLine`, `BudgetRevision` (Domain/ProjectBudgets) |
| Funding Source | `FundingTranche`, `TrancheDeduction`; hibe tarafında `GrantDisbursementTranche` |
| Transaction | `Expense`, `IncomeEntry`, `Invoice`+`Payment`, `CashMovement`, `CustomerLedgerEntry` |
| Currency / FX | `ExchangeRates`, `FxRevaluations`, `FxRateResolver/FxLedger*` |
| Document | `Document` + `DocumentFile/Type/Field/AccessLog` + modül-yerel ekler (TaskDocument, ProjectAttachment…) |
| Report | `Pages/Reports/*` (TrialBalance, CustomerStatement, ProjectBudget) + `GrantReport(+Section)` |
| Deliverable / Indicator | **karşılığı aranacak** — muhtemel boşluk |
| Notification | `Notification*` (merkez) + `GrantNotification*` (hibe yığını) — entegrasyon denetlenecek |
| Organization/Team | ABP Tenant + `ProjectMember`; ayrı Organization entity yok |

## Çalışma kuralları (CLAUDE.md ile hizalı)

1. **PHASE 0'da kod değiştirilmez.** Önce keşif → analiz → model → (onay sonrası) wireframe → uygulama planı.
2. Arama hijyeni: `node_modules/ bin/ obj/ wwwroot/libs/ .claude/worktrees/` dışlanır; aramalar `src/` altına daraltılır.
3. Şema değişikliği önerileri **çift provider migration** (SqlServer + PostgreSql) ve DbMigrator etkisiyle birlikte yazılır; migration üretimi kullanıcı onayına tabidir.
4. Önceki denetimlerle mükerrerlik yasak: `docs/denetim/bulgular.md` (SEC/FN/KVKK sicili), hibe CEO/CTO denetimi (H-01..H-24, F0/F1 kapananlar hariç), hibe UX/IA denetimi (onaylı kararlar: menü **5+3**, fikir→sekme, başvuru→menü, **"model korunur, UI anlatır"**). Açık bulgular referansla anılır, yeniden keşfedilmez; onaylı kararlarla çelişen öneri gerekçesiz verilmez.
5. Kullanıcı metinleri Türkçe (`Localization/Platform/tr.json`); iş kuralı `*Manager`'da; DTO↔Entity AutoMapper.
6. Her önemli karar: MEVCUT DURUM → PROBLEM → NEDEN → ÖNERİ → ETKİ. Breaking change ve migration ihtiyacı açıkça işaretlenir.

## Denetim kapsamı

1. **Domain model** — Grant/GrantCall/GrantApplication/GrantDecision/Project ayrımı; aggregate sınırları; durum enum duplikasyonu; IMultiTenant/ISoftDelete/FullAudited kapsamı; `ProjectTask` vs `TaskItem` ikiliği; Deliverable/Indicator boşluğu.
2. **Hibe yaşam döngüsü** — KEŞİF→…→DÖNÜŞÜM zincirinin kod karşılığı; her geçişte yetki, koşul, tarihçe, bildirim, belge; GrantStageTemplate'in rolü.
3. **Hibe→Proje dönüşümü** — `Pages/Grants/Convert` neyi aktarıyor, neyi İKİNCİ KEZ girdiriyor; geri izlenebilirlik; idempotency. Prensip: *başvuruda girilen veri projede tekrar girdirilmez.*
4. **Proje oluşturma** — hibe bağlantılı vs bağımsız; progressive disclosure (bütçe yok → finans soruları yok).
5. **Proje→Finans** — Proje→FundingTranche→ProjectBudgetLine→işlem→belge izlenebilirliği; Grant tranche'ları ile ProjectBudgets köprüsü; Finans Merkezi (Pages/Finance panelleri) ↔ eski bağımsız sayfalar (Expenses/Incomes/Invoices/CashAccounts…) duplikasyonu; Single Source of Truth.
6. **Belgeler** — kaç ayrı belge deposu var; metadata (sahip/bağlar/tür/versiyon/onay); Matching/Compliance'ın finansal işlem-belge eşleşmesi.
7. **Raporlama** — üretilebilen raporların envanteri; "proje ilerleme raporu" ve "yıllık rapor" senaryosu; GrantReport'un gerçek kullanımı; rapor şablonu/builder gerekli mi (ürün kararı).
8. **Bildirimler** — 12 kritik olayın kapsanma matrisi; merkez Notification ↔ GrantNotification entegrasyonu.
9. **İzin & tenant** — izin ağacı; finansal mutasyonlarda alt-izin ayrımı; IDataFilter.Disable riskleri; hazır roller; audit izlenebilirliği.
10. **Menü & UX** — onaylı 5+3 kararına uyum; ekran başına: gerekli mi, birleşir mi, aynı veri yeniden mi giriliyor, sıradaki aksiyon belli mi.
11. **12 kritik senaryo** — (1) hibe→kabul→proje (2) hibe→ret→itiraz (3) bağımsız+bütçesiz (4) bağımsız+bütçeli (5) hibe projesi+kaynaklar (6) proje→görev→çıktı→belge (7) bütçe→harcama→belge (8) yıllık rapor (9) görev gecikti→bildirim (10) bütçe aşımı→bildirim (11) tenant ihlali (12) yetkisiz finans mutasyonu.

## Çıktı formatı

**PHASE 0 — SYSTEM CHECK-UP raporu** (ilk ve tek çıktı; onaydan önce başka faz yok):
A. Executive Summary (10-20 madde) · B. Critical Findings (ID/Alan/Problem/Etki/Öncelik P0-P3/Öneri) ·
C. Domain Architecture (mevcut + önerilen) · D. User Journey (mevcut + önerilen) · E. UX Problems ·
F. Data Model Problems · G. Backend Problems · H. Finance Integration · I. Reporting Gap ·
J. Notification Gap · K. Permission & Security · L. 12 senaryo sonucu ·
Karar matrisi (🟢🟡🟠🔴) · 12 fazlı Action Plan (amaç/problem/yapılacak/etkilenen entity-API-ekran/migration/risk/öncelik/kabul kriteri) · Target Architecture şeması.

Onay sonrası: 40 ekranlık wireframe seti (hibe 10 · proje 17 · finans 8 · rapor 5) ayrı faz olarak üretilir.

## Ürün prensibi

> Amaç daha fazla ekran değil; proje yaşam döngüsünü **daha az adımla, daha az zihinsel yükle**
> yönetmek. Veri bir kez girilir, ilişkiler üzerinden her yerde kullanılır. Kullanıcı önerileri
> sorgulanır: gereksizse kaldırılır, yanlışsa değiştirilir, daha iyisi varsa önerilir — her
> değişikliğin nedeni açıklanır.
