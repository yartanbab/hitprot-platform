# Apya Design Tokens

React island'da ve (gelecekte) Razor sayfalarında kullanılan tek doğruluk
kaynağı. Renk/spacing/typography/motion değerleri **buradan** gelir, bileşen
kodunda sabit (`#FF0000`, `12px`) görmek hatadır.

## Yapı

```
styles/
├── tokens.css         ← CSS variables (light + dark)
└── README.md          ← bu dosya
```

`tokens.css` üç katmanlıdır:

1. `:root { --apya-* }` — light tema değerleri (default)
2. `[data-theme="dark"] { --apya-* }` — dark tema override'ları
3. `@media (prefers-reduced-motion: reduce)` — animasyon süre override'ı

## Kullanım

### Tailwind ile (önerilen)

`tailwind.config.js` token'ları semantic color/spacing olarak expose eder:

```jsx
<div className="bg-surface-raised text-text-primary border border-default rounded-md p-4">
    <span className="text-positive font-semibold font-tabular">▲ ₺12.450</span>
</div>
```

### CSS-in-JS / inline ile (gerekirse)

```jsx
<div style={{ backgroundColor: 'var(--apya-surface-raised)' }} />
```

### Sayısal değerler için

Finansal sayılarda **tabular figures** zorunlu — kolonlar dikey hizalansın:

```jsx
<span className="font-tabular">₺12,450.00</span>
```

## Tema değiştirme

`<ThemeProvider>` ile sarmalayın, `useTheme()` ya da `<ThemeToggle />` kullanın:

```jsx
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { ThemeToggle } from './components/ui/ThemeToggle';

<ThemeProvider>
    <YourApp />
    <ThemeToggle />
</ThemeProvider>
```

Tercih `localStorage["apya-theme"]`'da kalır (`light` | `dark` | `system`).

### FOUC engelleme (Razor sayfasından entry'i mount ederken)

`_Layout.cshtml`'in `<head>` bloğuna **inline script**:

```html
<script>
  (function () {
    try {
      var s = localStorage.getItem('apya-theme');
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var r = s === 'dark' || (s !== 'light' && d) ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', r);
    } catch (_) {}
  })();
</script>
```

Bu script ThemeProvider'dan **önce** çalışır → kullanıcı flash görmez.

## Token kategorileri (özet)

| Token ailesi | Örnek                          | Kullanım                          |
|--------------|--------------------------------|-----------------------------------|
| `brand`      | `--apya-brand-500`             | Primary action, link              |
| `positive`   | `--apya-positive-500`          | Gelir, kar, başarı                |
| `negative`   | `--apya-negative-500`          | Gider, kayıp, hata                |
| `warning`    | `--apya-warning-500`           | Uyarı, gecikme yakın              |
| `critical`   | `--apya-critical-500`          | Kritik (negative'den daha üst)    |
| `neutral`    | `--apya-neutral-{50..900}`     | Gri scale                         |
| `ai`         | `--apya-ai-500`                | AI suggestion card aksenti        |
| `surface`    | `--apya-surface-{base,raised,..}` | Page/card/input zeminleri      |
| `text`       | `--apya-text-{primary,..}`     | Metin hiyerarşisi                 |
| `border`     | `--apya-border-{subtle,..}`    | Çerçeve hiyerarşisi               |
| `shadow`     | `--apya-shadow-{sm,md,lg,xl}`  | Elevation                         |
| `radius`     | `--apya-radius-{xs..2xl}`      | Köşe yuvarlama                    |
| `space`      | `--apya-space-{0..24}`         | 4px tabanlı modular spacing       |
| `text-*`     | `--apya-text-{xs..6xl}`        | Type scale                        |
| `motion`     | `--apya-motion-{fast,base,slow}` | Animasyon süreleri              |

## Kurallar

- Component'ler **renk değil semantic** kullanır: `bg-positive` ✅, `bg-green-500` ❌.
- Dark mode'da component **hiçbir şey değiştirmez** — token'lar yeniden tanımlanır.
- `@apply` kullanımı minimal — utility-first kalır, encapsulation gerekirse `@layer components`.
- Yeni bir token eklemeden önce: bu **gerçekten yeni semantik** mi, yoksa
  mevcudun tonu mu? Token enflasyonu tasarım sistemini öldürür.

## Roadmap

- [ ] `lucide-react` entegrasyonu (icon library)
- [ ] `clsx` + `tailwind-merge` → `cn()` util
- [ ] shadcn/ui kurulumu (Button, Card, Dialog, Sheet, Toast)
- [ ] Razor `_Layout.cshtml`'e tokens.css inline (LeptonX override'ları)
- [ ] Density toggle (compact/comfortable/spacious) → `--apya-space-unit` runtime
- [ ] Storybook (component dokümantasyonu, görsel regression)
