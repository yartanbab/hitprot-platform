# Apya.Platform — Son 1 Ay Geliştirme Raporu

**Dönem:** 2026-05-08 → 2026-06-08
**main HEAD:** `c23c6ce`
**Ölçek:** 209 commit · ~50+ birleştirilmiş PR (#2 → #86) · 618 dosya değişti (+118.454 / −126.869 satır; büyük negatif fark eski frontend bundle'larının yeniden üretiminden kaynaklı)

**Haftalık yoğunluk:**
| Hafta | Tarih aralığı | Commit |
|-------|---------------|--------|
| W20 | 11–17 May | 23 |
| W21 | 18–24 May | 93 (zirve — finans + mimari) |
| W22 | 25–31 May | 48 |
| W23 | 1–7 Haz | 38 |
| W24 | 8 Haz | 7 |

---

## 1. Genel Bakış

Bu ay platform üç ana eksende büyüdü:
1. **Finans & Muhasebe çekirdeği** tamamlandı (cari, kasa, fatura, masraf, gelir, döviz, mizan, raporlar).
2. **Yapay Zeka Değerlendirme Merkezi** sıfırdan kuruldu (prompt yönetimi, sağlayıcılar, değerlendirme pipeline'ı, iş akışları, dashboard).
3. **Form Yönetim Sistemi** (Google Forms benzeri) ürünleştirildi.

Bunların yanında kapsamlı bir **mimari sağlamlaştırma** (5 tur ARCH denetimi), **güvenlik açığı temizliği** (CVE'ler) ve **tasarım sistemi v2** çalışması yapıldı. Ay sonunda runtime'ı kıran kritik bir AutoMapper uyumsuzluğu tespit edilip düzeltildi ve **Takvim entegrasyonu** menüye bağlandı.

---

## 2. Finans & Muhasebe Çekirdeği (Faz 4–10)

Çok para birimli, çift-taraflı defter mantığına dayanan bir mali altyapı granüler PR'larla inşa edildi.

- **Cari (Müşteri) yönetimi** (PR #7) — Customer entity + CRUD + UI; Proje↔Müşteri ilişkisi.
- **Kasa & Hareketler** (PR #8, #10) — CashAccount + CashMovement + bakiye hesabı.
- **Döviz kurları** (PR #9) — ExchangeRate + TCMB senkronizasyonu.
- **Masraf & Gelir** (PR #11, #17) — Expense (otomatik kasa çıkışı), IncomeEntry.
- **Fatura** (PR #12) — Invoice ödemesi → kasa girişi, FX dönüşümlü.
- **Yıl sonu yeniden değerleme** (PR #13) — FxRevaluationSnapshot + UI.
- **Cari defter / tahakkuk** (PR #14–#18) — CustomerLedgerEntry (domain + şema), fatura yön + tahakkuk, cari ekstre UI.
- **Maliyet boyutu & görev finansı** (PR #19, #20) — Expense/Income için TaskId; proje bütçe/gerçekleşen özeti.
- **Raporlama** (PR #24, #25) — Mizan (TrialBalance) servisi + tarih filtreli sayfa; cari ekstre + proje bütçe raporu; ClosedXML + QuestPDF export motoru.

**Bu dönemdeki finans hata düzeltmeleri:**
- PR #21 — Alış faturası ödemesinde yanlış Alacak yönü.
- PR #22 — FxRevaluation bakiye tarih filtresi eksikliği.
- PR #23 — Alış faturası AP tahakkuku (tedarikçi borç takibi).
- PR #26 — `/ExchangeRates` 500 hatası (`AddHttpClient()` eksikliği).
- PR #27, #28 — `<select asp-for>` + StringLength jQuery doğrulama hatası.

---

## 3. Mimari Sağlamlaştırma (ARCH Denetim Turları 1–5)

Beş tur halinde, üretim kalitesini yükselten sistematik bir denetim ve düzeltme çalışması.

- **Tur 1–2** (PR #39–#48) — TenantId private setter, OpenAI singleton düzeltmesi, deadline worker batch, AiGateway Polly DI, DB tablo adlandırma, InvoiceManager yeniden uygulama; menü izinleri + lokalizasyon.
- **Tur W-TD** (PR #49–#57) — UI blok disiplini, sayfa/satır izin desenleri, feature checker, SignalR fallback, EditModel dosya servisi, Görevler lokalizasyonu.
- **Tur 3–4** (PR #58–#66) — OpenIddict sertifika parolası config'e taşındı, fatura idempotency + partial unique index, 7 finansal aggregate için denetim (audit) geçmişi, N+1 sorgu düzeltmeleri (Project, Report, Expense), FX kuru DB ORDER BY, `/health/live` + `/health/ready` endpoint'leri, güvenlik header'ları, OAuth redirect doğrulama, path traversal koruması, race condition düzeltmeleri, `Clock.Now` standardizasyonu, hata mesajı sızıntısı önleme.
- **Tur 5** (PR #79) — 74 nullable uyarısı sıfırlandı (CS8618/8601/8604/8629/0114, 28 dosya).

---

## 4. Güvenlik — CVE Temizliği

- **PR #75** — SemanticKernel 1.30.0 → 1.71.0 (kritik GHSA-2ww3-72rp-wpp4).
- **PR #76** — Scriban 6.3.0 → 7.2.1 (10+ CVE) `Directory.Build.props` üzerinden.
- **PR #77** — Tüm `DateTime.Now` → `Clock.Now`; OpenAI sürüm çakışması düzeltmesi.
- **PR #78** — System.Security.Cryptography.Xml CVE yamaları (GHSA-37gx-xxp4-5rgx, GHSA-w3x6-4m5h-cxqf).

---

## 5. Tasarım Sistemi v2 & UI/UX

- **PR #67** — Navigasyon yeniden düzenleme + takvim implementasyonu.
- **PR #69** — Tasarım sistemi v2: yeni token paleti, indigo aksan, shell mikro-etkileşimleri, Customers React island.
- **PR #70** — Tema/dark mode düzeltmeleri (modal backdrop, Masraf Yakala renkleri, Tailwind token eşlemesi).
- **PR #71** — İçerik Güvenlik Politikası (CSP) Report-Only + ihlal log endpoint'i.
- **PR #72** — Smoke test paketi (Domain/App/Web testleri + Faz 4–10 HTTP smoke kapsamı).

---

## 6. Yapay Zeka Değerlendirme Merkezi (AI Evaluation Center)

Mevcut `Apya.Platform.Ai.*` bağlamına genişletme olarak sıfırdan kuruldu. Tasarım: tek standart `IAiProvider` (Semantic Kernel izole), forma özel `AiFormBinding`, kademeli prompt modeli.

**S1–S5 (PR #81 + #82, 61 dosya, main'e indirildi):**
- **S1 Prompt Yönetimi** — DB-tabanlı Prompt + versiyon (taslak→yayınla→arşiv) + kategoriler; `/AiCenter/Prompts`.
- **S2 Sağlayıcılar** — Per-tenant `AiProviderConfig` (şifreli API anahtarı), strateji deseni (Claude/Gemini/DeepSeek/OpenAI), tenant tercihine göre resolver; `/AiCenter/Providers`.
- **S3 Değerlendirme pipeline'ı** — `AiEvaluationManager` motoru, form yanıtı oluşunca otomatik tetik (`EntityCreatedEventData<AppResponse>`), arka plan job, tenant-izole SignalR canlı durum; `/AiCenter/Bindings` + `/AiCenter/Evaluations`.
- **S4 İş akışı + Dashboard** — Kural motoru (`AiWorkflow`/`AiWorkflowRule`), bildirim/webhook/onay/etiket dispatch, dashboard (skor/risk/durum dağılımları); `/AiCenter/Workflows` + `/AiCenter/Dashboard`.
- **S5 Sertleştirme** — Prompt-injection sanitizasyonu, denetim (audit) seçicileri, OpenAIClient lazy yükleme.

**G0–G2 boşluk-kapatma (PR #84):**
- Dashboard `[Authorize]` güvenlik düzeltmesi (yetkisiz 500 önlendi).
- Prompt versiyon içeriği görüntüleme + prompt kütüphanesi filtreleri.
- Chart.js dashboard grafikleri (durum doughnut + risk bar).
- Kullanım Kayıtları (Usage Logs) ekranı (mevcut `AiRequest` üzerine).
- Raporlar ekranı (Excel/PDF export).

**Menü:** Dashboard · Prompts · Kategoriler · Bindings · Evaluations · Workflows · Providers · Usage Logs · Reports.

---

## 7. Form Yönetim Sistemi (PR #80)

Mevcut DynamicAssets modülünün Google Forms benzeri kurumsal form sistemine ürünleştirilmesi (F1–F4).

- **F1** — Blok tipleri 8→19, FormStatus/ResponseStatus, FormCategory, app servisleri + izinler + migration.
- **F2** — Tek-kolon, Google Forms tarzı sürükle-bırak form builder (`/DynamicAssets/Builder`).
- **F3** — Yayınlama akışı + anonim public form sayfası (`/f/{slug}`) + KVKK/captcha toggle.
- **F4** — Yanıt yönetimi ekranı, form listesi ana sayfası, spreadsheet görünümü + CSV export.

E2E doğrulandı: oluştur → yayınla → doldur → gönder akışı çalışıyor. Antiforgery + ABP route gotcha'ları çözüldü.

---

## 8. Takvim Entegrasyonu (PR #86)

Google + Outlook OAuth takvim entegrasyonu (servis, sağlayıcılar, `CalendarSyncMapping` ile görev↔etkinlik çift-yön senkron, OAuth callback) zaten inşa edilmişti ancak menüde kaydı yoktu → erişilemiyordu. **İşler** menüsüne "Takvim" öğesi eklenerek yüzeylendi; canlı doğrulandı.

---

## 9. Kritik Hata Düzeltmeleri (runtime)

- **PR #83 — AutoMapper 14.0.0'a sabitleme.** AutoMapper 15.x, ABP 10.0.2'nin çağırdığı `MapperConfiguration(MapperConfigurationExpression)` constructor'ını kaldırmıştı → kimlik doğrulamalı **tüm `/api/app/*` uçları 500** (MissingMethodException). Build + unit testler yakalamıyordu; yalnızca canlı kimlik-doğrulamalı API çağrısında ortaya çıkıyordu. Canlı smoke ile teyit edilip 14.0.0'a indirildi. (Takas: CVE-2026-32933 dev'de açık kalıyor; kalıcı çözüm ABP'yi AutoMapper-15-uyumlu sürüme yükseltmek.)
- **PR #85 — AI Usage Logs 500 düzeltmesi.** `AiUsageLogAppService` `IAiRequestRepository`'ye bağımlıydı ama EF implementasyonu eksikti → servis aktive edilemiyor, `/api/app/ai-usage-log` 500. `EfCoreAiRequestRepository` eklendi.

---

## 10. Hazırda Bekleyen / Sıradaki

**Onay/merge bekleyen:**
- **PR #87 — Webhook Yönetim UI.** Webhook teslimat backend'i (subscription + publisher + sender job) hazırdı ama panelde UI yoktu. İçerik menüsü altında CRUD + teslimat kayıtları görüntüleyici eklendi; yapısal doğrulama tamam, görsel onay bekliyor.

**Altyapısı hazır, panelde henüz yüzeylenmemiş (tespit edildi):**
- **Agentic AI Asistanı** (Semantic Kernel) — doğal dilden form üretimi, form yanıt analizi, hedef-bazlı planlama. Hiç UI yok. *(Sıradaki en değerli iş.)*
- **Çift-taraflı Muhasebe / GL defter çekirdeği** — 20 dosyalık motor yalnızca raporlardan dolaylı görünür; yevmiye/hesap planı yönetim ekranı yok.

**Açık teknik konu:**
- CVE-2026-32933 (AutoMapper) dev ortamında açık; çözümü ABP yükseltmesi.
- BUG-3: Çok para birimli `Sum()` toplamı (Money VO bağımlı).

---

*Bu rapor `git log` (2026-05-08 → 2026-06-08, main) ve proje notlarından otomatik derlenmiştir.*
