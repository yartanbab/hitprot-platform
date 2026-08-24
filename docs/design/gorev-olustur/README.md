# Yeni Görev ekranı — tasarım kaydı

Kaynak: Claude tasarım kanvası çıktısı, 2026-08-24.
Kanvas dosyası: [`yeni-gorev-ekrani.dc.html`](yeni-gorev-ekrani.dc.html) — tarayıcıda doğrudan açılır.

> Orijinal "standalone" paket 1,4 MB'tı: Inter ve FontAwesome `woff2` dosyaları base64
> olarak gömülüydü. Depoya alınan kopyada bu fontlar CDN bağlantısına çevrildi. Bu dosya
> **yalnız dokümantasyondur**, uygulamaya bundle edilmez.

## Turdaki dört varyant

| # | Yön | Özet |
|---|---|---|
| `1a` | Mevcut durum | `Pages/Tasks/CreateModal.cshtml`'in birebir maketi — 800px, üç panel, ~970px yükseklik |
| `1b` | **Hız** | Bilgi kutusu ve panel çerçeveleri yok; sekiz alan tek satır meta çubuğunda. 640px genişlik, ~320px yükseklik |
| `1c` | Zenginlik | Sol içerik / sağ özellik rayı, 900px. Şablon + AI taslak girişleri |
| `1d` | **Sıfır-form** | Tek satır, işaretçiyle yazma (`@kişi #etiket !öncelik >tarih`), canlı çip önizlemesi |

## Seçilen yön

**`1b` + `1d` birleşik** (kanvasın kendi "sırada" notundaki öneri): tek modal, iki katman.
Varsayılan açılış hızlı satır; `TAB` / chevron ile sıkı form açılır ve ayrıştırılan
değerlerle dolu gelir. İkisi de **aynı gizli gerçek form alanlarını** yazar → tek POST,
mevcut `CreateModalModel.OnPostAsync` sözleşmesi korunur.

`1c` uygulanmadı. Ondan yalnız **planlama alanları** (tahmini süre, görev tipi, sprint,
üst görev) alındı; onlar da `1b`'nin "Daha fazla" açılırında, izin + paket kapısı arkasında.

## Kanvastaki editör anahtarlarının koddaki karşılığı

Kanvasın `<sc-if>` anahtarları doğrudan ayar/izin/feature'a çevrildi:

| Kanvas anahtarı | Koddaki karşılığı | Seviye |
|---|---|---|
| `showInfoBanner` | `Platform.TaskCreate.ShowInfoBanner` ayarı | kiracı |
| `showKeyboardHints` | `Platform.TaskCreate.ShowKeyboardHints` ayarı | kullanıcı |
| `showPlanningFields` | `Tasks.ManagePlanning` izni + `Platform.TaskQuickEntry` feature'ı | rol / paket |
| (hızlı satırın kendisi) | `Tasks.QuickCreate` izni + `Platform.TaskQuickEntry` feature'ı | rol / paket |

Ayrıntı: [`uygulama-notlari.md`](uygulama-notlari.md).
