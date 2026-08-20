repo: yartanbab/hitprot-platform
branch: main
path: src/Apya.Platform.Web

## Last sync
date: 2026-08-18T11:07:17Z

### Updated in this project
- /Calendars ekranı birebir kopyalandı (ay grid'i, "Bu Hafta" ajandası, Google/Outlook entegrasyon kartları)
- Apya tasarım token'ları (tokens.css) ve theme-bridge değerleri mockup'lara uygulandı
- Takvim yönetimi + entegrasyon için yeni yönler: kontrol merkezi, hafta çizelgesi, ajanda akışı, senkron drawer'ı, iCal bağlama, birleşik ekran, dark/mobil, boş durumlar
- İkonografi gerçek kaynağa oturtuldu: Font Awesome (fa/fab) sınıfları + Google Calendar resmî SVG (SimulateAuth.cshtml'deki asset)

## Screen map
| Ekran | Kaynak dosyalar |
|---|---|
| Takvim Yeniden Tasarım.dc.html · 1a (mevcut) | src/Apya.Platform.Web/Pages/Calendars/Index.cshtml · wwwroot/Pages/Calendars/calendar.js · wwwroot/Pages/Calendars/index.js |
| Takvim Yeniden Tasarım.dc.html · 2a–6c (yeni) | wwwroot/dynamic-assets/src/styles/tokens.css · wwwroot/css/apya-theme-bridge.css · Application.Contracts/Calendars/CalendarDtos.cs · Domain/Calendars/ExternalCalendarAccount.cs · docs/design/redesign/DESIGN-SYSTEM.md · Pages/Calendars/SimulateAuth.cshtml (marka görselleri) |
