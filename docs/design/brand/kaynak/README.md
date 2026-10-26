# Handoff: APYA marka işareti ve asistan durum sistemi

## Genel bakış
APYA (Akıllı Proje Yönetim Asistanı) için tek renkli marka işareti, yazı kilidi ve işaretin ürün içinde "asistan burada" sinyali olarak kullanıldığı durum sistemi. Bu paket, işareti uygulamanın her alanına (başlık çubuğu, düğme, rozet, boş durum, bildirim, favicon, açılış) tutarlı biçimde yerleştirmek için gereken her şeyi içerir.

## Tasarım dosyaları hakkında
Bu paketteki `.dc.html` dosyaları **HTML ile hazırlanmış tasarım referanslarıdır** — amaçlanan görünümü ve davranışı gösteren prototiplerdir, doğrudan kopyalanacak üretim kodu değildir. Görev: bu tasarımları hedef kod tabanının mevcut ortamında (React, Vue, SwiftUI, vb.) yerleşik desen ve kütüphanelerle **yeniden üretmek**. Ortam yoksa projeye en uygun çerçeveyi seçip orada uygulayın.

Hazır başlangıç noktası olarak `src/ApyaMark.tsx` (React) ve `src/apya.css` (token + keyframe) verilmiştir; başka çerçevelerde `src/apya-mark.svg` içindeki geometriyi aynen taşıyın.

## Fidelity
**Yüksek doyumlu (hifi).** Renkler, yazı tipi, ölçüler ve zamanlamalar nihaidir; birebir uygulanmalıdır.

## İşaret geometrisi (viewBox 0 0 100 100)
- 13 ışın: `line x1=50 y1=20 x2=50 y2=4`, her biri `rotate(i × 27.69°, 50 50)`, i = 0…12. Çizgi kalınlığı **4.5**; 32 px altında **6**; "öneri" rozetinde **6**.
- Pusula ibresi (ekran): kuzey `50,36 55.5,50 50,52 44.5,50` dolu; güney `50,64 44.5,50 50,48 55.5,50` dolu, opaklık **.38**.
- Pusula ibresi (baskı): kuzey `50,34 56,50 50,52.5 44,50` dolu; güney `50,60 45.5,50 50,48 54.5,50` kontur 2.4 — opaklık yok. Kaşe, gravür, PDF.
- Mikro sürüm (<16 px): 3 ışın (0°, 120°, 240°) `y1=18 y2=4`, kalınlık 9; ibre kuzey `50,26 60,50 50,55 40,50` dolu, güney `50,74 40,50 50,46 60,50` kontur 5. Favicon, sekme, bildirim noktası.
- Renk daima `currentColor`; işaret kendi rengini taşımaz.

## Kilitler
| Kilit | Kullanım | Ölçü |
|---|---|---|
| Yatay (işaret + APYA) | Ürün arayüzü, başlık çubuğu, tabela | işaret = 1.25 × yazı boyu; aralık = .5 × yazı boyu |
| Yatay + açılım | Kapak, teklif, fuar — **arayüzde asla** | açılım = .27 × yazı boyu, işaretten 600 ms sonra belirir |
| Dikey | Kare alanlar: sosyal, rozet, kaşe | işaret üstte, 18 px boşluk |
| Sadece işaret | 32 px altındaki her yer | — |
| Sadece yazı | Metin içi, hukuki evrak | — |

- Yazı: **Figtree 600, letter-spacing .12em, line-height 1**. Açılım: **Figtree 500, .2em, opaklık .72**, "AKILLI PROJE YÖNETİM ASİSTANI".
- Temiz alan: her yönde ışın boyu (x). Alt sınırlar: işaret 16 px / 5 mm; yatay kilit 90 px / 24 mm; açılımlı kilit 150 px / 40 mm.
- Kilit tek parça ölçeklenir; açılım ayrı küçültülmez.

## Asistan durum sözlüğü
İşaret **yalnızca asistanın dokunduğu yerde** görünür: ürettiği metin, önerdiği tarih, hesapladığı risk. Kullanıcının kendi girdiği veride görünmez. Hareket yalnızca asistan çalışırken; iş bitince durur.

| Durum | Tetikleyici | Hareket | Zamanlama |
|---|---|---|---|
| `ready` | Oturum açık, asistan boşta | statik | — |
| `thinking` | İstek alındı, yanıt üretiliyor | ışınlar merkezden nefes (`apya-think`, opaklık .18→1, scale .9→1, ışın başına 55 ms gecikme) | 1800 ms ease-in-out, sonsuz |
| `streaming` | Yanıt metni akıyor | sırayla sönme (`apya-chase`, ışın başına 65 ms gecikme) | 850 ms linear, sonsuz |
| `listening` | Mikrofon açık | ışın boyu değişir (`apya-listen`, scaleY .35→1, transform-origin 50 20) | 620–1120 ms alternate |
| `suggest` | Asistan satır içi değer önerdi | statik, kalınlık 6, 14 px rozette | — |
| `off` | Asistan devre dışı | statik, opaklık .4 | — |

`prefers-reduced-motion: reduce`: hareketli durumlar sabit %40 opaklığa düşer.

## Ekran geçişleri (tek sefer)
Tek eğri: `cubic-bezier(.4,0,.2,1)`. Yazı asla deforme olmaz; harflerde yalnızca opaklık ve 6 px kayma.
- **Açılış kilidi**: ışınlar merkezden çizilir (`stroke-dasharray 17`, `apya-draw` 500 ms, ışın başına 45 ms gecikme) → ibre `apya-pop` → harfler sırayla `apya-letter` (110 ms arayla, 1050 ms'de başlar) → açılım `apya-tagline` (1600 ms).
- **Hazır ⇄ asistan**: kesik halka (`r=36, dasharray 20 8.27, kalınlık 5.5`) `apya-ring-morph` ile içe kapanır, ışınlar `apya-ray-morph` ile açılır; 3200 ms döngüde.
- **Kapanış**: halka `apya-collapse` ile noktaya çöker, yazı 6 px sola kayarak söner; 2800 ms.

## Ürün içi yerleşim
- Başlık çubuğu: 20 px işaret (kalınlık 6) + 13 px APYA, aralık 10 px.
- Düğme: 16 px işaret solda, metin 14 px Figtree 500; birincil düğme zemini `--apya-brand`, köşe 8 px.
- Öneri rozeti: 14 px işaret + 11 px metin, 1 px kenarlık, tam yuvarlak, iç boşluk 5 12 5 9.
- Boş durum: 56 px işaret, opaklık .32, altında 14 px Figtree 300 metin.
- Bildirim ikonu: 30 px beyaz kare (köşe 8), içinde 18 px işaret marka renginde.
- Avatar: daire, marka zemini, beyaz işaret (işaret = çapın .54'ü). Uygulama ikonu: köşe .22 × kenar, iç boşluk .2 × kenar.

## Tasarım tokenları
Renk: `#123B63` marka · `#0B2542` hover · `#101827` koyu zemin · `#1B1A17` başlık · `#55524A` gövde · `#8C887C` ikincil · `#E4E1D8` kenarlık · `#EDEBE4` yumuşak kenarlık · `#F5F4F0` açık zemin · `#FFFFFF`.
Yazı: Figtree 700 başlık · 600 logo (.12em) · 500 açılım (.2em) · 400 metin; JetBrains Mono yalnızca veri/kod.
Köşe: 8 / 10 / 14 px. Eğri: `cubic-bezier(.4,0,.2,1)`. Hiçbir yerde degrade, gölge veya ikinci renk yok.

## Yapılmaz
Döndürme · renk değişimi · oran bozma · gölge/efekt · başka yazı tipi · temiz alanı daraltma · degrade zemin · arayüzde açılım satırı.

## Varlıklar (`assets/`)
`apya-isaret.svg` (ekran) · `apya-isaret-baski.svg` · `apya-mikro.svg` · `apya-yatay.svg` · `apya-yatay-acilim.svg` · `apya-dikey.svg` · `apya-yazi.svg` · `apya-isaret-{256,512,1024}.png` · `favicon-{16,32}.png` · `ios-icon-{180,1024}.png` · `android-icon-{48,192,512}.png`.
SVG'lerdeki yazı Figtree'yi sistemden bekler; Figtree'yi Google Fonts'tan yükleyin (400/500/600/700) ya da yazıyı dış çizgiye çevirin.

## Dosyalar
- `src/ApyaMark.tsx` — React bileşeni (`ApyaMark`, `ApyaLockup`), tüm durumlar ve mikro/baskı sürümleri.
- `src/apya.css` — tokenlar ve keyframe'ler; global olarak bir kez yükleyin.
- `src/apya-mark.svg` — React dışı ortamlar için saf işaret.
- `design/APYA Figtree.dc.html` — tasarım referansı: son hâl (13a–15c), işaret geliştirmeleri (16a–c), durum sözlüğü (17a), hareketli kilitler (9a–f), dönüşen hâller (7a–e), asistan hissiyatı (6a–f).
- `design/APYA Marka Kilavuzu.dc.html` — tek sayfa A4 kılavuz.
