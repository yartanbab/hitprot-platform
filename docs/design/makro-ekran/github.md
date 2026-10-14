repo: yartanbab/hitprot-platform
branch: main
path: src/Apya.Platform.Web

## Last sync
date: 2026-09-17T07:40:00Z

### Updated in this project
- Makro Ekran (/Makro) için 4 yerleşim önerisi oluşturuldu
- Kabuk (320px sidebar + 64px topbar) ve `--apya-*` token sistemi birebir çıkarıldı
- Menü ağacı PlatformNavigationResolver'dan alındı (Hibe / İş / Finans / İçerik)
- apya-shell.css ve apya-theme-bridge.css referans olarak projeye kopyalandı

## Screen map
| Ekran | Kaynak dosyalar |
|---|---|
| Makro Ekran.dc.html — kabuk | wwwroot/css/apya-theme-bridge.css, wwwroot/css/apya-shell.css, wwwroot/js/apya-sidebar-shell.js, wwwroot/js/apya-topbar-shell.js |
| Makro Ekran.dc.html — tokenlar | wwwroot/dynamic-assets/src/styles/tokens.css |
| Makro Ekran.dc.html — menü/ikonlar | Menus/PlatformNavigationResolver.cs, Domain.Shared/Localization/Platform/tr.json |
| Makro Ekran.dc.html — komut paleti deseni | wwwroot/js/command-palette.js |
