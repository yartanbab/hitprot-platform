# AI Değerlendirme Merkezi (AI Evaluation Center) — Mimari Tasarım Raporu

> Senior Solution Architect İncelemesi · 2026-06-01
> Durum: **ONAYLANDI** — kod üretimi Bölüm 15 sırasıyla başladı.

## Onaylanan Kararlar

| # | Karar | Seçim |
|---|---|---|
| **D1** | Provider stratejisi | **En güvenli/sağlam yol:** Tek standart `IAiProvider`. Semantic Kernel (`Agentic`) izole/sarmalanır. `IAiProviderResolver` ile OCP. |
| **D2** | Form ↔ Prompt bağlama | Özel **`AiFormBinding`** entity (sıra, aktiflik, tetikleme modu, versiyon politikası). |
| **D3** | Prompt versiyonlama | **Kademeli:** Yeni DB-tabanlı prompt modeli kurulur; mevcut kod-içi `PromptTemplate` korunur, sonra migrate edilir. |

---

## 1. Mevcut Mimari (özet)

- **ABP Framework 10.0.2 / .NET 10 / PostgreSQL 17**, DDD + Clean Architecture + Modüler Monolit.
- İki modül kümesi tek host `PlatformDbContext` üzerinde: `Apya.Platform.*` (ana) + `Apya.Platform.Ai.*` (AI bounded context, şema `ai`, prefix `Ai`).
- UI: ABP **Razor Pages + LeptonXLite + Bootstrap**, modal + DataTables. Realtime: **SignalR** (`/ai-hub`).
- Mapping: AutoMapper (modül) + Mapperly (Web). PDF: QuestPDF. Auth: OpenIddict + ABP Permission/Feature/Tenant.

### Yeniden kullanılan mevcut yapılar
`IAiProvider`, `AiGateway` (Polly), `AiRequest` + `AiDecisionTrace`, `ICostPolicyEngine` + `TenantAiSettings`,
`IAiResponseValidator` + repair-loop, `EntityCreatedEventData<AppResponse>` event seam'i (form gönderimi),
ABP `AsyncBackgroundJob`, `AiHub`, `NotificationManager`, `EntityLink`, webhook altyapısı, QuestPDF export,
`AiPermissions` + `PlatformFeatures.AiAssist`, `PlatformMenuContributor`, localization.

## 2. Eksikler (Gap)
Prompt yönetimi/versiyonlama/kategori (DB), Form↔Prompt binding, submission→evaluation tetik+job,
schema-driven JSON validation, sonuç saklama (score/risk/decision), workflow motoru, çoklu provider
(Claude/Gemini/DeepSeek) + resolver + per-tenant config, AI Center dashboard/rapor/export, genişletilmiş yetki + menü.

## 3. Konum
Mevcut `Apya.Platform.Ai.*` modülüne **genişletme** (yeni .csproj yok). Şema `ai`, prefix `Ai`.

## 4. Veritabanı (şema `ai`)
`AiPromptCategories`, `AiPrompts`, `AiPromptVersions`, `AiFormBindings`, `AiEvaluations`,
`AiEvaluationResults`, `AiProviderConfigs`, `AiWorkflows`, `AiWorkflowRules`.
Kullanım logu = mevcut `AiRequests` + `AiDecisionTraces` (yeni tablo yok). Hepsi `IMultiTenant`, ApiKey şifreli.

## 5. Domain
Aggregate'ler: `Prompt`, `PromptVersion`, `PromptCategory`, `AiEvaluation`, `AiEvaluationResult`,
`AiWorkflow`(+`AiWorkflowRule`), `AiProviderConfig`, `AiFormBinding`.
Domain Service: `AiEvaluationManager` (orchestrator), `AiWorkflowEvaluator`, `IAiProviderResolver`,
`JsonSchemaResponseValidator : IAiResponseValidator`.
ETO: `AiEvaluationStatusChangedEto`, `AiWorkflowActionTriggeredEto`. Args: `AiEvaluationJobArgs`.

## 6. Application
`PromptAppService`, `PromptCategoryAppService`, `AiFormBindingAppService`, `AiEvaluationAppService`,
`AiResultAppService`, `AiWorkflowAppService`, `AiProviderAppService`, `AiDashboardAppService`.
Tetikleyici: `AiEvaluationTriggerHandler : ILocalEventHandler<EntityCreatedEventData<AppResponse>>` (form kodu değişmez).
Job: `AiEvaluationJob : AsyncBackgroundJob<AiEvaluationJobArgs>`.

## 7. API
Conventional controllers (zaten açık) → `/api/app/prompt`, `/ai-evaluation`, `/ai-result`, `/ai-workflow`,
`/ai-provider`, `/ai-dashboard`. WS `/ai-hub`. Maliyetli uçlar rate-limit + kota'ya tabi.

## 8. UI (Razor Pages)
`/AiCenter/{Dashboard,Prompts,PromptCategories,Evaluations,Results,Workflows,Providers,Settings}` —
modal + DataTables + ai-hub canlı durum.

## 9. Yetkilendirme (`AiPermissions` genişletilir, feature `AiAssist`)
`Ai.Dashboard.View`, `Ai.Prompts.*`, `Ai.Evaluations.*`, `Ai.Results.View/Export`,
`Ai.Workflows.Manage`, `Ai.Providers.Manage`, `Ai.Reports.View`. Audit: Prompt/Workflow/ProviderConfig.

## 10. Workflow
`AiWorkflowRule` = Koşul (JsonPath Operator Value) → Aksiyon (Approve/Notify/Tag/Webhook).
`AiWorkflowEvaluator` sonuç sonrası çalışır, aksiyonları event ile decouple eder
(Notify → `NotificationManager`, Webhook → mevcut `WebhookSenderJob`).

## 11. Riskler
R-1 migration parity (önce boş diff doğrula), R-2 iki AI yolu (D1 ile çözüldü), R-3 OCP/AiGateway (resolver),
R-4 prompt injection (B-03 sanitizasyon), R-5 AutoMapper runtime, R-6 maliyet (kota+rate-limit+TriggerMode),
R-7 şema-dışı JSON (schema validator + repair), R-8 API key (encrypted), R-9 PII/KVKK (audit+retention).

## 12. Roadmap / 13. Sprint
S0 Faz0 (parity + resolver iskeleti) · S1 Prompt Mgmt · S2 Providers · S3 Evaluation pipeline ·
S4 Workflow+Dashboard · S5 Sertleştirme. Her faz bağımsız PR, yeşil build + test.

## 14. Klasör yapısı
`Apya.Platform.Ai.Domain.Shared/{Prompts,Evaluations,Workflows,Providers,Bindings}`,
`Apya.Platform.Ai.Domain/{Prompts,Evaluations,Bindings,Workflows,Providers}`,
`Apya.Platform.Ai.Application/{Providers,Prompts,Evaluations,Results,Workflows,Providers,Dashboard}`,
`Apya.Platform.Ai.Application.Contracts/{...DTO + I*AppService + Permissions}`,
`Apya.Platform.Ai.EntityFrameworkCore/AiDbContextModelCreatingExtensions.cs (+config)`,
`Apya.Platform.Web/Pages/AiCenter/*`, `Migrations/*`, `Localization/Platform/{en,tr}.json`.

## 15. Kod üretim sırası
1. Domain.Shared: enum + ETO + Args
2. Domain: Prompt/PromptVersion/PromptCategory + repo arayüzleri
3. EF: config + DbSet + migration (önce parity doğrula) → DbMigrator
4. Contracts + Application: Prompt/Category app service + DTO + AutoMapper
5. Web: sayfalar + permission + menü + localization  → S1 biter
6. Providers: AiProviderConfig + resolver + Claude/Gemini/DeepSeek + AppService + UI → S2
7. Bindings + Evaluation: AiEvaluation/Result + Manager + SchemaValidator
8. TriggerHandler + Job + AppService + Evaluations/Results UI + SignalR → S3
9. Workflow: Rule + Evaluator + aksiyon handler'ları + UI → S4
10. Dashboard + Reports + export → S5
11. Güvenlik: prompt-injection, rate-limit, audit, testler → S6
