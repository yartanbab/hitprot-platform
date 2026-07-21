---
name: apya-redesign
description: Apya.Platform arayüzünde görsel/stil işi yapılırken kullanılır. "Redesign", "tasarımı güncelle", "bu sayfanın görünümü", "CSS", "stil", "renk", "tema", "dark mode", "responsive", "sayfayı güzelleştir", "UI düzenle", "buton/kart/tablo görünümü", "restyle", "design system" gibi isteklerde tetiklenir. Mevcut --apya-* token sistemini zorunlu kılar, hardcode renk ve ad-hoc CSS'i engeller. Yeni backend özelliği eklemek için DEĞİL.
---

# Apya Redesign — Mevcut Tasarım Sistemi

Bu projede **zaten kurulmuş bir tasarım sistemi var.** Yeni bir sistem önerme,
paralel bir token seti kurma, Tailwind'i Razor tarafına sokma. Görevin mevcut
sistemi doğru kullanmak ve tutarlılığı korumak.

## Sistem nerede

| Dosya | Rolü |
|---|---|
| `wwwroot/dynamic-assets/src/styles/tokens.css` | **Tek doğru kaynak.** Tüm `--apya-*` token'ları |
| `wwwroot/css/apya-theme-bridge.css` | `--apya-*` → Bootstrap `--bs-*` → LeptonX `--lpx-*` köprüsü |
| `wwwroot/css/apya-shell.css` | Uygulama kabuğu (sidebar, topbar, layout) |
| `wwwroot/css/kanban.css` | Kanban board'a özel |
| `wwwroot/global.css` | Global düzeltmeler |

**Değiştirmeden önce oku.** Hangi token'ın zaten var olduğunu bilmeden yeni değer ekleme.

## Token kategorileri

`--apya-*` prefix'i altında 11 kategori var:

```
brand-{50..900}        primary aksiyon, link, rapor
accent-{50..900}       buton, aktif nav, odak halkası (indigo)
positive / negative / warning / critical / neutral    finansal semantik
surface-{base|raised|elevated|sunken}                 zemin katmanları
text-{primary|secondary|tertiary|inverse}
border-{subtle|default|strong|focus}
shadow-*   radius-*   spacing-*   (4px tabanlı)
typography-*   z-*   motion-*
```

Light tema `:root`'ta, dark tema `[data-theme="dark"]` altında override edilir.

## Kurallar

**1. Hex renk yazma.** Hiçbir Razor sayfasında, hiçbir CSS dosyasında.
```css
/* YANLIŞ */  color: #2563EB;
/* DOĞRU  */  color: var(--apya-brand-500);
```
İhtiyacın olan token yoksa **uydurma** — kullanıcıya sor, token'ı `tokens.css`'e ekleyelim mi diye.

**2. Semantik token seç, ham renk değil.**
Pozitif bir tutar için `--apya-positive-500`, `--apya-brand-500` değil.
Renk paletini değiştirdiğimizde anlam korunsun.

**3. LeptonX'in layout'una dokunma.**
Bridge dosyası bilinçli olarak **sadece renk değişkenlerini** override ediyor.
Layout ve typography LeptonX'in yönetiminde. Bu sayede LeptonX güncellemesi bridge'i kırmıyor.
Layout override etmen gerekiyorsa önce kullanıcıya danış — bu bilinçli bir mimari karar.

**4. Yeni CSS dosyası açma.**
Sayfaya özel stil gerekiyorsa önce sor: bu gerçekten sayfaya mı özel, yoksa
bir bileşen deseni mi? Bileşen deseniyse `apya-shell.css`'e girer.

**5. `dynamic-assets` ayrı bir dünya.**
Orası React + Tailwind alt uygulaması ve token'ları semantic color olarak tüketiyor.
Razor tarafına Tailwind class'ı yazma, `dynamic-assets`'e Bootstrap class'ı yazma.

**6. Dark mode'u her değişiklikte kontrol et.**
`<html data-theme="dark">` ile test et. Bir yerde hardcode renk kaldıysa
dark mode'da hemen görünür.

## İş akışı

### Adım 1 — Kapsamı sabitle
Hangi sayfa(lar)? Tek sayfa mı, bir bileşen deseni mi, tüm uygulama mı?
"Sayfayı güzelleştir" yeterli değil — neyin rahatsız ettiğini sor.

### Adım 2 — Mevcut halini gör
Dosyayı oku. Mümkünse Chrome ile sayfayı aç ve ekran görüntüsü al.
**Görmeden değiştirme.** Tahminle CSS yazmak en pahalı yoldur.

### Adım 3 — Bileşen envanteri (birden fazla sayfa etkileniyorsa)
Değiştireceğin partial/bileşen başka nerelerde kullanılıyor? Önce bunu çıkar.
Bir `.cshtml` partial'ını değiştirmek 12 sayfayı etkileyebilir.

### Adım 4 — Cerrahi değişiklik
- Sadece ilgili kural bloklarına dokun
- Var olan class isimlerini koru
- `!important` yazma; gerekiyorsa specificity sorununu çöz
- Ölü CSS fark edersen **söyle**, silme

### Adım 5 — Doğrula
```
1. Sayfa açılıyor           → https://localhost:44386
2. Light tema doğru         → ekran görüntüsü
3. Dark tema doğru          → data-theme="dark", ekran görüntüsü
4. Dar ekran bozulmuyor     → responsive kontrol
5. Etkilenen diğer sayfalar → envanterdeki her sayfa
```

Ekran görüntüsü almadan "tasarım tamam" deme.

## Sık yapılan hatalar

| Hata | Sonuç |
|---|---|
| Hardcode hex renk | Dark mode'da okunmaz metin |
| Yeni token seti kurmak | İki paralel sistem, tutarsız arayüz |
| `!important` ile bastırmak | Sonraki değişiklik daha da zorlaşıyor |
| LeptonX layout override | Tema güncellemesinde her şey kırılıyor |
| Razor'a Tailwind class'ı | Class hiçbir şey yapmıyor, Tailwind orayı derlemiyor |
| Dark mode'u test etmemek | Hatalar üretimde ortaya çıkıyor |
