# Claude Code için prompt — aşağıdakini kopyalayıp yapıştır

---

`yartanbab/hitprot-platform` reposunda (ABP / ASP.NET Core Razor Pages + LeptonX Lite) yeni bir **Makro Ekran** (`/Makro`) sayfası kuracağız. Tasarım referansı bu klasörde:

- `design_handoff_makro_ekran/README.md` — tam şartname (ekranlar, ölçüler, token'lar, davranışlar, state, uygulama sırası). **Önce bunu baştan sona oku.**
- `design_handoff_makro_ekran/Makro Ekran.dc.html` — HTML prototip. Tarayıcıda aç; `#1a`, `#1c`, `#1g`, `#2a`, `#3b` gibi çapalar ekranları gösterir. Bu bir **referans**; satır içi stilleri kopyalama, mevcut sınıflarla yeniden kur.

## Kurallar
1. Yeni kabuk yazma. Mevcut layout, `wwwroot/css/apya-shell.css`, `wwwroot/css/apya-theme-bridge.css` ve `--apya-*` token'larını (`wwwroot/dynamic-assets/src/styles/tokens.css`) kullan. Yeni renk/ölçü icat etme; README'deki değerler repodaki token'larla birebir.
2. Sabitleme için **mevcut `ShellPins`** ayarını ve `/api/app/shell/set-pins` ucunu kullan — ikinci bir depo kurma.
3. Makro tanımını menü anahtarına bağla (`Menus/PlatformNavigationResolver.cs`). Ayrı URL/izin alanı tutma; izin ABP `PlatformPermissions`'tan gelir, makro kapsamı yalnız görünürlüğü daraltır.
4. Bekleyen işler sayaçlarını `/api/app/shell/state`'e **ekleme** (her sayfada çalışıyor). Makro ekranına özel ayrı bir uç aç.
5. Kullanım sayacı günlük toplanmış olsun (`userId, macroKey, day, count`), 30 günden eskisi silinsin.
6. Bileşik makrolar önce ön izleme üretir; onay tek kullanımlık `previewToken` harcar (idempotent). Geçersiz token → 3b hata hali, hiçbir kayıt yazılmaz.
7. Türkçe metinleri `Domain.Shared/Localization/Platform/tr.json` (ve `en.json`) üzerinden ekle.
8. Mobil dokunma hedefleri ≥44px; koyu tema `.apya-dark` ile çalışmalı.

## Sırayla yap (her adımda dur, derle, bana özet ver)
1. **Sayfa + menü:** `Pages/Makro/Index.cshtml(.cs)`, menüye "Makro Ekran" (`fa-bolt`), izin.
2. **Domain:** `Macro` varlığı (anahtar, görünen ad, ikon, tür: Link/Modal/Composite, menü anahtarı, gerekli izin, kapsam, adımlar, `defaultPinned`, durum: Draft/Published/Archived), `MacroUsageDaily`, `MacroRun` (çalıştırma günlüğü + üretilen kayıt id'leri — Geri al için). Migration.
3. **Host yönetimi (README §2a):** `/Admin/Makrolar` master-detail — listele, oluştur, düzenle, kopyala, sil, yayınla; adım listesi sürükle-sırala.
4. **1a ana ekran:** banner (max 5 haber, oklar + noktalar), Senin için 4'lü + Tüm makrolar 4×3 ızgara (sıklık sırası, sabitlenenler önce, güncelleme rozeti), Bildirimler ve Bana ait kayıtlar panelleri (kendi içinde kayar, `position:absolute; inset:0` kalıbı — README'de neden yazıyor), Bekleyen işler (`flex:none`).
5. **Ön izleme (1c) + hata hali (3b)** + sonuç şeridi ve Geri al.
6. **Boş durum (3a):** kullanım yokken `defaultPinned` makrolar role göre.
7. **Mobil (1g):** kaydırmalı banner, sayfalı 3'lü kare ızgara, uzun basınca sabitle, sekmeli alt bölüm, Fatura yakala çevrimdışı kuyruk.
8. **⌘K:** `wwwroot/js/command-palette.js` içine "OLUŞTUR" grubu — aynı makro listesi.

Başlamadan önce: repoda ilgili dosyaları oku, README'deki her ekran için hangi dosyaları değiştireceğini/ekleyeceğini listeleyen kısa bir plan çıkar ve onayımı bekle.

---
