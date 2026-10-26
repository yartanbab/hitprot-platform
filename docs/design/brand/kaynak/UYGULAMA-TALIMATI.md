# APYA marka uygulaması — Claude Code talimatları

Bu paket APYA (Akıllı Proje Yönetim Asistanı) işaretini ürünün her alanına yerleştirmek içindir. Önce README.md'yi oku.

## Nasıl uygula
1. `src/apya.css` içeriğini global stile ekle (tokenlar + keyframe'ler). Figtree 400/500/600/700 ve JetBrains Mono 400/500 yükle.
2. `src/ApyaMark.tsx` bileşenini kod tabanının bileşen klasörüne taşı; projenin stil yaklaşımına (CSS Modules, Tailwind, styled) uyarla ama **geometriyi, zamanlamaları ve eğriyi değiştirme**.
3. Mevcut tüm yükleniyor/spinner/AI ikonlarını bul ve `ApyaMark` ile değiştir: bekleme → `state="thinking"`, metin akışı → `"streaming"`, mikrofon → `"listening"`, AI önerisi rozetleri → `"suggest"`, devre dışı → `"off"`.
4. Başlık/logo alanlarında `ApyaLockup`; 90 px'ten dar alanlarda yalnızca `ApyaMark`. Açılım satırı (`tagline`) yalnızca kapak/teklif gibi ilk temas yüzeylerinde — arayüzde asla.
5. `assets/` içindeki favicon ve uygulama ikonlarını projeye yerleştir; manifest/HTML head'i güncelle.
6. Boş durum, bildirim ve avatar yerleşimlerini README "Ürün içi yerleşim" ölçüleriyle uygula.

## Değişmezler
- İşaret her zaman `currentColor`; tek renk. Degrade, gölge, ikinci renk yok.
- Yazı: Figtree 600 / .12em. Harfler deforme edilmez.
- İşaret yalnızca asistanın ürettiği/önerdiği içeriğin yanında görünür; kullanıcı verisinde görünmez.
- Hareket yalnızca asistan çalışırken; `prefers-reduced-motion` saygı görür.
- Tek eğri: `cubic-bezier(.4,0,.2,1)`.

## Yapma
Başka yazı tipi, başka spinner, işareti döndürme/ölçek bozma, arayüzde açılım satırı, 16 px altında standart sürüm (mikro kullan).
