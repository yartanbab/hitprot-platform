# Adaptif Görev Detay Ekranı — Faz 1: Modal İskeleti Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mevcut sağdan açılan dar görev detay drawer'ının yerine merkezi + responsive + dirty-state korumalı bir React modal iskeleti kur; dört giriş noktasını **varsayılan kapalı bir bayrak arkasında** yeni modala bağla, böylece Faz 1 mevcut davranışı hiç bozmadan tek başına merge edilebilsin.

**Architecture:** `Apya.Platform.Web/wwwroot/dynamic-assets` altında `task-detail` adında yeni bir React island. Radix Dialog tabanlı `Dialog` primitive'i `components/ui` kit'ine eklenir. `TaskDetailRoot` veri + form + dirty state'i tutar; `ModalShell` yalnız dış kabuğu (portal, backdrop, boyut, kapatma) sağlar — Faz 5'te eklenecek `PageShell` aynı içeriği portal'sız render edecek. Mevcut çağrı noktaları `abp.ModalManager` yerine aynı `.open()`/`.onResult()` sözleşmesini taklit eden `window.apya.taskDetail` adaptörünü kullanır; böylece `apya-kanban.js` hiç değişmez.

**Tech Stack:** React 18 · @radix-ui/react-dialog 1.1 · TanStack Query 5 · Tailwind 3.4 (CSS custom property token'ları) · Vite 5 (lib mode, çok girişli) · Vitest + @testing-library/react (bu fazda ekleniyor) · ABP 10 Razor Pages + dinamik JS proxy'leri · xUnit + Shouldly (backend)

---

## Global Constraints

- Ham renk/px yazma yasak. Renk `var(--apya-*)` veya `tailwind.config.js`'te token'a bağlanmış utility; boşluk `var(--apya-space-*)`; yarıçap `var(--apya-radius-*)`; süre `var(--apya-motion-*)`.
- Kullanıcıya dönen tüm metinler Türkçe. Yeni Razor metinleri `src/Apya.Platform.Domain.Shared/Localization/Platform/tr.json`'a; React island metinleri bileşen içinde Türkçe sabit (mevcut island'ların deseni).
- Migration YOK. Bu fazda hiçbir entity/DbContext değişikliği yapılmaz.
- Yeni NuGet paketi YOK. Yeni npm paketi yalnız şu 4 devDependency: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- `src/Apya.Platform.Web/Pages/Tasks/EditModal.cshtml` ve `wwwroot/js/task-drawer.js` bu fazda **silinmez** (Faz 9'da kaldırılacak).
- `src/Apya.Platform.Web/wwwroot/js/apya-kanban.js` bu fazda **değiştirilmez**. Adaptör sözleşmesi buna göre tasarlanmıştır.
- Yeni modal **varsayılan kapalıdır** (`apya.taskDetail.v2` bayrağı). Bayrak kapalıyken uygulama bugünküyle birebir aynı davranır. Faz 2 bayrağı varsayılan açar, Faz 9 bayrağı tamamen kaldırır.
- Faz 1'de kullanıcıya görünen hiçbir yetenek **kaybolmaz**: silme yeni modalda da tam çalışır. Düzenleme Faz 2'ye kalır — bu yüzden bayrak kapalı.
- Her task tek başına geri alınabilir bir commit ile biter. Commit mesajı Türkçe gövde, İngilizce conventional prefix.
- Build doğrulaması iki ayaklı: `dotnet build Apya.Platform.slnx` ve `npm run build` (dizin: `src/Apya.Platform.Web/wwwroot/dynamic-assets`).
- Dev sunucusu `BundlingMode.BundleAndMinify` ile çalışır: CSS/JS değişikliği sonrası tarayıcı yenilemesi yetmeyebilir, sunucuyu yeniden başlat.

---

## File Structure

**Yeni dosyalar**

| Dosya | Sorumluluk |
|---|---|
| `src/Apya.Platform.Web/wwwroot/dynamic-assets/vitest.config.js` | Test runner konfigürasyonu (jsdom + react plugin) |
| `.../dynamic-assets/src/test/setup.js` | `@testing-library/jest-dom` matcher'ları + global temizlik |
| `.../dynamic-assets/src/components/ui/Dialog.jsx` | Merkezi modal primitive'i (Radix Dialog). `Sheet.jsx`'in kardeşi |
| `.../dynamic-assets/src/task-detail.jsx` | Vite entry + island mount + imperatif açma store'u |
| `.../dynamic-assets/src/task-detail/TaskDetailRoot.jsx` | Veri çekme, izin, dirty state — sunum-bağımsız |
| `.../dynamic-assets/src/task-detail/shells/ModalShell.jsx` | Modal kabuğu: Dialog + tek scroll grid'i |
| `.../dynamic-assets/src/task-detail/components/TaskDetailHeader.jsx` | Başlık, durum/öncelik, erişim rozeti, ⋯ menü, kapat |
| `.../dynamic-assets/src/task-detail/components/TaskDetailFooter.jsx` | Son kayıt bilgisi + Vazgeç + Kaydet |
| `.../dynamic-assets/src/task-detail/components/AccessBadge.jsx` | "Sınırlı erişim" göstergesi (kırmızı "Gizli" yerine) |
| `.../dynamic-assets/src/task-detail/hooks/useDirtyGuard.js` | Kaydedilmemiş değişiklik takibi + çıkış onayı |
| `.../dynamic-assets/src/task-detail/hooks/useTaskUrlSync.js` | `?task={id}` pushState/popstate senkronu |
| `.../dynamic-assets/src/task-detail/hooks/useTaskDetail.js` | ABP proxy'sinden görev çekme (TanStack Query) |
| `.../dynamic-assets/src/task-detail/taskDetailStore.js` | Island dışından imperatif açma (`useSyncExternalStore`) |
| `src/Apya.Platform.Web/Pages/Shared/_TaskDetailIsland.cshtml` | Üç sayfanın ortak mount partial'ı |
| `test/Apya.Platform.Application.Tests/Tasks/TaskAppService_Tenant_Tests.cs` | Tenant izolasyonu regresyon testleri |

**Değişecek dosyalar**

| Dosya | Değişiklik |
|---|---|
| `.../dynamic-assets/package.json` | 4 devDependency + `test` script'leri |
| `.../dynamic-assets/tailwind.config.js` | `zIndex` gerçek değerlere, `tablet` screen'i, eksik animasyonlar |
| `.../dynamic-assets/vite.config.js` | `task-detail` entry'si |
| `.../dynamic-assets/src/components/ui/index.js` | `Dialog` re-export |
| `src/Apya.Platform.Web/Pages/Tasks/Index.cshtml` | Partial dahil |
| `src/Apya.Platform.Web/Pages/Tasks/index.js:4,129,190` | `abp.ModalManager` → `apya.taskDetail` |
| `src/Apya.Platform.Web/Pages/Board/Index.cshtml` + `index.js:4` | Aynı |
| `src/Apya.Platform.Web/Pages/Projects/ProjectDetails.cshtml` + `.js:4` | Aynı |
| `src/Apya.Platform.Web/Pages/Tasks/EditModal.cshtml.cs:185-191` | Finans çağrılarını izne bağla |
| `src/Apya.Platform.Application/Tasks/TaskAppService.cs` | Yorum/dosya metotlarına tenant doğrulaması |
| `src/Apya.Platform.HttpApi/Tasks/TaskAttachmentController.cs` | `[Authorize]` |
| `src/Apya.Platform.HttpApi/Controllers/FileController.cs` | `[Authorize]` |

---

### Task 1: Vitest test altyapısı

Bu repoda hiç frontend testi yok. Sonraki her task TDD ile ilerleyeceği için runner önce kurulur.

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/package.json`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/vitest.config.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/test/setup.js`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/lib/utils.test.js`

**Interfaces:**
- Consumes: yok (ilk task)
- Produces: `npm test` komutu; tüm sonraki task'lar `*.test.jsx` dosyalarını `src/` altında bileşenin yanına koyar.

- [ ] **Step 1: Bağımlılıkları ekle**

`package.json` içindeki `devDependencies` bloğuna ekle (alfabetik sırayı koru):

```json
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.2.0",
    "vitest": "^2.1.8"
  }
```

Aynı dosyada `scripts` bloğunu güncelle:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 2: Vitest konfigürasyonu**

`vitest.config.js` oluştur. Ayrı dosya: `vite.config.js` lib-mode build'i için, bu test için — ikisini karıştırmak build çıktısını bozar.

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
})
```

- [ ] **Step 3: Test setup dosyası**

`src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});
```

- [ ] **Step 4: Runner'ın çalıştığını kanıtlayan test**

`src/lib/utils.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { cn, formatMoney } from './utils';

describe('cn', () => {
    it('çakışan Tailwind sınıflarında sonuncuyu tutar', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('falsy değerleri atar', () => {
        expect(cn('a', false && 'b', null, 'c')).toBe('a c');
    });
});

describe('formatMoney', () => {
    it('sayı olmayan girdide em-dash döner', () => {
        expect(formatMoney(undefined, 'TRY')).toBe('—');
    });
});
```

- [ ] **Step 5: Kur ve çalıştır**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm install && npm test
```

Beklenen: `Test Files 1 passed (1)` · `Tests 3 passed (3)`

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/package.json src/Apya.Platform.Web/wwwroot/dynamic-assets/package-lock.json src/Apya.Platform.Web/wwwroot/dynamic-assets/vitest.config.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/test/setup.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/lib/utils.test.js
git commit -m "chore: React island'lari icin Vitest test altyapisi"
```

---

### Task 2: Tailwind config düzeltmeleri (z-index, tablet, animasyonlar)

Üç mevcut hata: (1) `zIndex.modal = 60` gerçek z-index düzlemiyle alakasız — Bootstrap modalı 1055, LeptonX sidebar ~1030. (2) `Sheet.jsx` ve `Toast.jsx` `tablet:` prefix'i kullanıyor ama `tablet` screen'i tanımlı değil → responsive davranış ölü. (3) `animate-sheet-*` / `animate-overlay-fade` tanımsız → animasyon yok.

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/tailwind.config.js:18-20` (screens), `:111-135` (zIndex, animation, keyframes)
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/tailwind.config.test.js`

**Interfaces:**
- Consumes: Task 1'in `npm test` komutu
- Produces: `z-modal-backdrop` (1042) ve `z-modal` (1045) utility'leri — Task 3 `Dialog.jsx` bunları kullanır. `tablet` screen'i (`min-width: 768px`) — Task 3 ve 6 bunu kullanır. `animate-dialog-in` / `animate-overlay-fade` — Task 3 kullanır.

- [ ] **Step 1: Failing test yaz**

`tailwind.config.test.js`:

```js
import { describe, it, expect } from 'vitest';
import config from './tailwind.config.js';

const { screens, zIndex, animation, keyframes } = config.theme.extend;

describe('tailwind screens', () => {
    it('Sheet.jsx ve Toast.jsx tablet: prefixini kullaniyor, tanimli olmali', () => {
        expect(screens.tablet).toBe('768px');
    });

    it('useDeviceMode sinirlariyla hizali kalir', () => {
        expect(screens.mobile).toEqual({ max: '767.98px' });
    });
});

describe('tailwind zIndex', () => {
    it('task-detail modali LeptonX sidebarin ustunde kalir', () => {
        expect(zIndex['modal-backdrop']).toBeGreaterThan(1040);
    });

    it('ABP/Bootstrap modali (1055) task-detail modalinin USTUNDE acilir', () => {
        expect(zIndex.modal).toBeLessThan(1055);
    });

    it('toast her seyin ustunde', () => {
        expect(zIndex.toast).toBe(1080);
    });
});

describe('tailwind animation', () => {
    it('Sheet.jsx ve Toast.jsx tarafindan kullanilan animasyonlar tanimli', () => {
        expect(animation['sheet-bottom']).toBeDefined();
        expect(animation['sheet-right']).toBeDefined();
        expect(animation['overlay-fade']).toBeDefined();
    });

    it('Dialog icin giris animasyonu tanimli', () => {
        expect(animation['dialog-in']).toBeDefined();
        expect(keyframes.dialogIn).toBeDefined();
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run tailwind.config.test.js
```

Beklenen: FAIL — `expected undefined to be '768px'`

- [ ] **Step 3: Config'i düzelt**

`tailwind.config.js` içinde `screens` bloğunu değiştir:

```js
      screens: {
        /* mobile: max-width — "mobilde küçült/gizle" anlamında.
           tablet: min-width — Sheet.jsx/Toast.jsx zaten bu prefix'i kullanıyordu
           ama tanımsızdı; tüm tablet: varyantları sessizce ölüydü (Sheet her
           ekranda bottom-sheet render ediyordu). Eşikler useDeviceMode.jsx'in
           decision→triage sınırıyla (768px) aynı — ikisi senkron kalmalı. */
        mobile: { max: '767.98px' },
        tablet: '768px',
      },
```

Aynı dosyada `zIndex` bloğunu değiştir:

```js
      /* Gerçek z-index düzlemi (tokens.css --apya-z-* ile aynı ölçek).
         Önceki 40/50/60 değerleri Bootstrap'ın 1050/1055'iyle aynı sayfada
         anlamsızdı: React modalı LeptonX sidebar'ının (~1030) altında kalırdı.
         modal=1045 bilinçli olarak Bootstrap .modal'ın (1055) ALTINDA:
         görev detayından açılan ABP modalleri (Expenses/CreateModal) üstte
         görünmeli. backdrop=1042 sidebar/header'ın üstünde. */
      zIndex: {
        'sticky':         1020,
        'modal-backdrop': 1042,
        'modal':          1045,
        'popover':        1060,
        'tooltip':        1070,
        'toast':          1080,
      },
```

`animation` bloğuna ekle (mevcut `blob` / `fade-in` korunur):

```js
      animation: {
        'blob':         'blob 7s infinite',
        'fade-in':      'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'overlay-fade': 'overlayFade 160ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-bottom': 'sheetBottom 220ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'sheet-right':  'sheetRight 220ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'dialog-in':    'dialogIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
```

`keyframes` bloğuna ekle (mevcut `blob` / `fadeIn` korunur):

```js
        overlayFade: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sheetBottom: {
          '0%':   { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sheetRight: {
          '0%':   { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        /* Tetikleyiciden büyüyerek gelir — mekânsal süreklilik (HIG modal-motion). */
        dialogIn: {
          '0%':   { opacity: '0', transform: 'translate(-50%, -50%) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run tailwind.config.test.js
```

Beklenen: `Tests 7 passed (7)`

- [ ] **Step 5: Mevcut island'ların bozulmadığını doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm run build
```

Beklenen: hatasız build; `../js/` altında 9 island + 5 vendor chunk güncellenir. `Sheet` kullanan `documents.js` ve `expense-capture.js` çıktı boyutları değişmiş olmalı (yeni animasyon sınıfları artık üretiliyor).

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/tailwind.config.js src/Apya.Platform.Web/wwwroot/dynamic-assets/tailwind.config.test.js src/Apya.Platform.Web/wwwroot/js
git commit -m "fix: olu tailwind tablet screen'i, animasyonlar ve gercek z-index olcegi"
```

---

### Task 3: Dialog primitive'i

`Sheet.jsx` sağdan/alttan açılan panel için. Merkezi modal varyantı yok; ekleniyor.

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/Dialog.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/index.js:27`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/Dialog.test.jsx`

**Interfaces:**
- Consumes: Task 2'nin `z-modal-backdrop`, `z-modal`, `animate-dialog-in`, `animate-overlay-fade`, `mobile:` / `tablet:` utility'leri
- Produces:
  - `<Dialog open onOpenChange>` — Radix `Dialog.Root` sarmalayıcısı
  - `<DialogContent title description fullscreen onInteractOutside>` — `title` zorunlu (a11y), `fullscreen: boolean` boyutu değiştirir
  - `Dialog.Content` / `Dialog.Close` alias'ları (Sheet.jsx ile aynı desen)

- [ ] **Step 1: Failing test yaz**

`Dialog.test.jsx`:

```jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent } from './Dialog';

function renderDialog(props = {}) {
    return render(
        <Dialog open onOpenChange={props.onOpenChange ?? (() => {})}>
            <DialogContent title="Görev Detayı" {...props}>
                <button type="button">İçerik butonu</button>
            </DialogContent>
        </Dialog>,
    );
}

describe('Dialog', () => {
    it('acikken role=dialog ve erisilebilir isimle render eder', () => {
        renderDialog();
        expect(screen.getByRole('dialog', { name: 'Görev Detayı' })).toBeInTheDocument();
    });

    it('varsayilan boyutta viewport-orantili genislik kullanir, sabit px degil', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('w-[min(92vw,1400px)]');
        expect(content.className).toContain('h-[min(88dvh,940px)]');
    });

    it('fullscreen modunda kenar bosluklu tam viewport kaplar', () => {
        renderDialog({ fullscreen: true });
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('h-[calc(100dvh-2*var(--apya-space-4))]');
        expect(content.className).not.toContain('w-[min(92vw,1400px)]');
    });

    it('mobilde tam ekrana duser', () => {
        renderDialog();
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('mobile:w-screen');
        expect(content.className).toContain('mobile:h-[100dvh]');
    });

    it('Escape onOpenChange(false) tetikler', async () => {
        const onOpenChange = vi.fn();
        renderDialog({ onOpenChange });
        await userEvent.keyboard('{Escape}');
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('onInteractOutside verilirse backdrop tiklamasi engellenebilir', async () => {
        const onInteractOutside = vi.fn((e) => e.preventDefault());
        const onOpenChange = vi.fn();
        renderDialog({ onInteractOutside, onOpenChange });
        await userEvent.click(document.body);
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
    });
});
```

- [ ] **Step 2: userEvent bağımlılığını kur**

`package.json` → `devDependencies` içine `"@testing-library/user-event": "^14.5.2"` ekle (alfabetik: `@testing-library/react`'ten sonra), sonra:

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm install
```

- [ ] **Step 3: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/components/ui/Dialog.test.jsx
```

Beklenen: FAIL — `Failed to resolve import "./Dialog"`

- [ ] **Step 4: Dialog.jsx'i yaz**

```jsx
import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

/**
 * Dialog — merkezi modal. Sheet.jsx'in kardeşi (o kenardan açılan panel için).
 * Radix Dialog primitive'i üzerinde: focus trap, ESC, aria-modal, portal bedava.
 *
 * Boyutlandırma sabit px DEĞİL:
 *   desktop   → w: min(92vw, 1400px)   ← .apya-page max-width'iyle aynı tavan
 *               h: min(88dvh, 940px)
 *   fullscreen→ viewport - 2*space-4   ← "büyüt" aksiyonu
 *   mobile    → 100vw × 100dvh, köşesiz, safe-area padding'li
 *
 * dvh kullanımı bilinçli: mobil adres çubuğu açılıp kapanırken vh zıplar.
 */

function Dialog({ open, onOpenChange, children }) {
    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </RadixDialog.Root>
    );
}

const DialogContent = React.forwardRef(function DialogContent(
    { title, description, fullscreen = false, className, children, ...props },
    ref,
) {
    const sizeClass = fullscreen
        ? cn(
            'w-[calc(100vw-2*var(--apya-space-4))]',
            'h-[calc(100dvh-2*var(--apya-space-4))]',
        )
        : cn(
            'w-[min(92vw,1400px)]',
            'h-[min(88dvh,940px)]',
            'tablet:min-h-[520px]',
        );

    return (
        <RadixDialog.Portal>
            <RadixDialog.Overlay
                className={cn(
                    'fixed inset-0 z-modal-backdrop',
                    'bg-surface-overlay backdrop-blur-sm',
                    'animate-overlay-fade',
                )}
            />
            <RadixDialog.Content
                ref={ref}
                className={cn(
                    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-modal',
                    'bg-surface-base text-text-primary',
                    'border border-default rounded-xl shadow-xl',
                    'flex flex-col overflow-hidden',
                    'focus-visible:outline-none',
                    'animate-dialog-in',
                    sizeClass,
                    /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
                       iOS home indicator'ın altında kalmaması için padding. */
                    'mobile:w-screen mobile:h-[100dvh] mobile:max-w-none',
                    'mobile:left-0 mobile:top-0 mobile:translate-x-0 mobile:translate-y-0',
                    'mobile:rounded-none mobile:border-0',
                    'mobile:pb-[env(safe-area-inset-bottom)]',
                    className,
                )}
                {...props}
            >
                <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
                {description
                    ? <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>
                    : null}
                {children}
            </RadixDialog.Content>
        </RadixDialog.Portal>
    );
});

const DialogClose = RadixDialog.Close;

Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

export { Dialog, DialogContent, DialogClose };
```

- [ ] **Step 5: Barrel'dan export et**

`src/components/ui/index.js` sonuna ekle:

```js
export { Dialog, DialogContent, DialogClose } from './Dialog';
```

- [ ] **Step 6: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/components/ui/Dialog.test.jsx
```

Beklenen: `Tests 6 passed (6)`

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/Dialog.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/Dialog.test.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/components/ui/index.js src/Apya.Platform.Web/wwwroot/dynamic-assets/package.json src/Apya.Platform.Web/wwwroot/dynamic-assets/package-lock.json
git commit -m "feat: components/ui kitine merkezi Dialog primitive'i"
```

---

### Task 4: useDirtyGuard hook'u

Kaydedilmemiş değişiklikte çıkışı engelleyen tek kaynak. HIG `sheet-dismiss-confirm` kuralı.

**Files:**
- Create: `.../dynamic-assets/src/task-detail/hooks/useDirtyGuard.js`
- Test: `.../dynamic-assets/src/task-detail/hooks/useDirtyGuard.test.js`

**Interfaces:**
- Consumes: yok
- Produces: `useDirtyGuard()` → `{ isDirty, markDirty(), markClean(), requestClose(onClose), pendingClose, resolvePendingClose(action) }`
  - `action` üçünden biri: `'stay'` | `'discard'` | `'save'`
  - `pendingClose` doluyken UI onay diyaloğunu gösterir

- [ ] **Step 1: Failing test yaz**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyGuard } from './useDirtyGuard';

describe('useDirtyGuard', () => {
    beforeEach(() => {
        window.onbeforeunload = null;
    });

    it('baslangicta temiz', () => {
        const { result } = renderHook(() => useDirtyGuard());
        expect(result.current.isDirty).toBe(false);
    });

    it('markDirty sonrasi kirli', () => {
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        expect(result.current.isDirty).toBe(true);
    });

    it('temizken requestClose dogrudan kapatir', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.requestClose(onClose));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(result.current.pendingClose).toBe(false);
    });

    it('kirliyken requestClose kapatmaz, onay bekler', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.pendingClose).toBe(true);
    });

    it('discard secilince kapatir ve temizler', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        act(() => result.current.resolvePendingClose('discard'));
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(result.current.isDirty).toBe(false);
    });

    it('stay secilince kapatmaz ve kirli kalir', () => {
        const onClose = vi.fn();
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        act(() => result.current.requestClose(onClose));
        act(() => result.current.resolvePendingClose('stay'));
        expect(onClose).not.toHaveBeenCalled();
        expect(result.current.isDirty).toBe(true);
        expect(result.current.pendingClose).toBe(false);
    });

    it('kirliyken beforeunload dinleyicisi kurulur', () => {
        const addSpy = vi.spyOn(window, 'addEventListener');
        const { result } = renderHook(() => useDirtyGuard());
        act(() => result.current.markDirty());
        expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/hooks/useDirtyGuard.test.js
```

Beklenen: FAIL — `Failed to resolve import "./useDirtyGuard"`

- [ ] **Step 3: Hook'u yaz**

```js
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useDirtyGuard — kaydedilmemiş değişiklik koruması.
 *
 * Üç çıkış yolu da (✕ butonu, ESC, backdrop) requestClose'dan geçer; hiçbiri
 * doğrudan onClose çağırmaz. Bu, "kaydetmeden çıkış yapılamaz" şartının tek
 * uygulama noktası olmasını sağlar.
 *
 * `save` aksiyonu burada kaydetmez — çağıran tarafın kaydedip sonra
 * markClean() + onClose() çağırması beklenir (kaydetme async ve hata verebilir).
 */
export function useDirtyGuard() {
    const [isDirty, setIsDirty] = useState(false);
    const [pendingClose, setPendingClose] = useState(false);
    const pendingCloseFn = useRef(null);

    const markDirty = useCallback(() => setIsDirty(true), []);
    const markClean = useCallback(() => setIsDirty(false), []);

    /* Sekme kapatma / yenileme — tarayıcının kendi uyarısı. Yalnız kirliyken
       bağlanır; sürekli bağlı kalırsa bazı tarayıcılar bfcache'i devre dışı bırakır. */
    useEffect(() => {
        if (!isDirty) return undefined;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    const requestClose = useCallback((onClose) => {
        if (!isDirty) {
            onClose?.();
            return;
        }
        pendingCloseFn.current = onClose ?? null;
        setPendingClose(true);
    }, [isDirty]);

    const resolvePendingClose = useCallback((action) => {
        const onClose = pendingCloseFn.current;
        setPendingClose(false);
        pendingCloseFn.current = null;

        if (action === 'discard') {
            setIsDirty(false);
            onClose?.();
        }
        /* 'stay' → hiçbir şey yapma, kirli kal.
           'save' → çağıran kaydeder; başarılı olursa markClean()+onClose() çağırır. */
        return action === 'save' ? onClose : null;
    }, []);

    return { isDirty, markDirty, markClean, requestClose, pendingClose, resolvePendingClose };
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/hooks/useDirtyGuard.test.js
```

Beklenen: `Tests 7 passed (7)`

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useDirtyGuard.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useDirtyGuard.test.js
git commit -m "feat: gorev detayi icin kaydedilmemis degisiklik korumasi"
```

---

### Task 5: useTaskUrlSync hook'u

Bugün modal açılınca URL değişmiyor; yenileme modalı kaybediyor, geri tuşu sayfadan çıkarıyor. HIG `back-behavior` + `deep-linking` kuralları.

**Files:**
- Create: `.../dynamic-assets/src/task-detail/hooks/useTaskUrlSync.js`
- Test: `.../dynamic-assets/src/task-detail/hooks/useTaskUrlSync.test.js`

**Interfaces:**
- Consumes: yok
- Produces:
  - `readTaskIdFromUrl()` → `string | null` — `?task=` parametresini okur
  - `useTaskUrlSync(taskId, onPopClose)` — `taskId` değiştiğinde `pushState`, `popstate`'te `onPopClose()` çağırır
  - `clearTaskUrl()` — modal programatik kapanırken URL'i geri alır

- [ ] **Step 1: Failing test yaz**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { readTaskIdFromUrl, useTaskUrlSync, clearTaskUrl } from './useTaskUrlSync';

const TASK_ID = '11111111-2222-3333-4444-555555555555';

beforeEach(() => {
    window.history.replaceState(null, '', '/Tasks');
});

describe('readTaskIdFromUrl', () => {
    it('task parametresi yoksa null', () => {
        expect(readTaskIdFromUrl()).toBeNull();
    });

    it('task parametresini okur', () => {
        window.history.replaceState(null, '', `/Tasks?task=${TASK_ID}`);
        expect(readTaskIdFromUrl()).toBe(TASK_ID);
    });

    it('gecersiz guid formatini reddeder', () => {
        window.history.replaceState(null, '', '/Tasks?task=not-a-guid');
        expect(readTaskIdFromUrl()).toBeNull();
    });
});

describe('useTaskUrlSync', () => {
    it('taskId verilince URLe ?task ekler', () => {
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));
        expect(window.location.search).toBe(`?task=${TASK_ID}`);
    });

    it('mevcut query parametrelerini korur', () => {
        window.history.replaceState(null, '', '/Tasks?view=kanban');
        renderHook(() => useTaskUrlSync(TASK_ID, () => {}));
        expect(window.location.search).toContain('view=kanban');
        expect(window.location.search).toContain(`task=${TASK_ID}`);
    });

    it('taskId null iken URLe dokunmaz', () => {
        renderHook(() => useTaskUrlSync(null, () => {}));
        expect(window.location.search).toBe('');
    });

    it('popstate onPopClose tetikler', () => {
        const onPopClose = vi.fn();
        renderHook(() => useTaskUrlSync(TASK_ID, onPopClose));
        act(() => { window.dispatchEvent(new PopStateEvent('popstate', { state: null })); });
        expect(onPopClose).toHaveBeenCalledTimes(1);
    });
});

describe('clearTaskUrl', () => {
    it('task parametresini kaldirir, digerlerini birakir', () => {
        window.history.replaceState(null, '', `/Tasks?view=kanban&task=${TASK_ID}`);
        clearTaskUrl();
        expect(window.location.search).toBe('?view=kanban');
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/hooks/useTaskUrlSync.test.js
```

Beklenen: FAIL — `Failed to resolve import "./useTaskUrlSync"`

- [ ] **Step 3: Hook'u yaz**

```js
import { useEffect, useRef } from 'react';

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PARAM = 'task';

/**
 * Görev detayı URL senkronu — Razor Pages'te client router yok, bu yüzden
 * History API'yi elle sürüyoruz.
 *
 * Neden pushState (replaceState değil): geri tuşu modalı kapatmalı, sayfadan
 * çıkarmamalı (HIG back-behavior). Liste filtresi/scroll'u DOM'da durduğu için
 * bu yöntem bağlamı da korur — ayrı bir detay sayfasına gitmenin aksine.
 *
 * Kanonik paylaşılabilir URL (/Tasks/Detail/{id}) Faz 5'te gelir; bu parametre
 * "aynı sayfada bir görev açık" durumunu temsil eder, paylaşım linki değildir.
 */
export function readTaskIdFromUrl() {
    if (typeof window === 'undefined') return null;
    const value = new URLSearchParams(window.location.search).get(PARAM);
    return value && GUID_RE.test(value) ? value : null;
}

export function clearTaskUrl() {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

export function useTaskUrlSync(taskId, onPopClose) {
    /* onPopClose her render'da değişebilir (inline closure); ref ile sabit tutup
       popstate dinleyicisini bir kez bağlıyoruz. */
    const onPopCloseRef = useRef(onPopClose);
    onPopCloseRef.current = onPopClose;

    useEffect(() => {
        if (!taskId) return;
        if (readTaskIdFromUrl() === taskId) return; /* derin bağlantıyla açıldı, tekrar push etme */

        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, taskId);
        window.history.pushState({ apyaTask: taskId }, '', url.pathname + url.search + url.hash);
    }, [taskId]);

    useEffect(() => {
        const handler = () => { onPopCloseRef.current?.(); };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/hooks/useTaskUrlSync.test.js
```

Beklenen: `Tests 8 passed (8)`

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskUrlSync.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskUrlSync.test.js
git commit -m "feat: gorev detayi icin ?task URL senkronu ve geri tusu davranisi"
```

---

### Task 6: Görev verisi çekme + imperatif açma store'u

**Files:**
- Create: `.../dynamic-assets/src/task-detail/hooks/useTaskDetail.js`
- Create: `.../dynamic-assets/src/task-detail/taskDetailStore.js`
- Test: `.../dynamic-assets/src/task-detail/taskDetailStore.test.js`

**Interfaces:**
- Consumes: `window.apya.platform.tasks.task.get(id)` (mevcut ABP dinamik proxy'si), `window.abp.auth.isGranted(name)`
- Produces:
  - `useTaskDetail(taskId)` → TanStack Query sonucu `{ data, isLoading, isError, error }`; `queryKey: ['task-detail', taskId]`
  - `taskDetailStore.open(taskId)` / `.close()` / `.subscribe(cb)` / `.getSnapshot()` → `string | null`
  - `taskDetailStore.onResult(fn)` / `.emitResult()` — `abp.ModalManager.onResult` sözleşmesinin karşılığı

- [ ] **Step 1: Failing test yaz**

`taskDetailStore.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskDetailStore } from './taskDetailStore';

const TASK_ID = '11111111-2222-3333-4444-555555555555';

beforeEach(() => {
    taskDetailStore.reset();
});

describe('taskDetailStore', () => {
    it('baslangicta kapali', () => {
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });

    it('open string id kabul eder', () => {
        taskDetailStore.open(TASK_ID);
        expect(taskDetailStore.getSnapshot()).toBe(TASK_ID);
    });

    it('open({id}) nesne formunu da kabul eder (abp.ModalManager uyumu)', () => {
        taskDetailStore.open({ id: TASK_ID });
        expect(taskDetailStore.getSnapshot()).toBe(TASK_ID);
    });

    it('close snapshoti nulla dondurur', () => {
        taskDetailStore.open(TASK_ID);
        taskDetailStore.close();
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });

    it('subscribe degisimde tetiklenir', () => {
        const cb = vi.fn();
        const unsub = taskDetailStore.subscribe(cb);
        taskDetailStore.open(TASK_ID);
        expect(cb).toHaveBeenCalledTimes(1);
        unsub();
        taskDetailStore.close();
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('onResult dinleyicileri emitResult ile cagrilir', () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();
        taskDetailStore.onResult(fn1);
        taskDetailStore.onResult(fn2);
        taskDetailStore.emitResult();
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('gecersiz id yok sayilir', () => {
        taskDetailStore.open(undefined);
        expect(taskDetailStore.getSnapshot()).toBeNull();
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/taskDetailStore.test.js
```

Beklenen: FAIL — `Failed to resolve import "./taskDetailStore"`

- [ ] **Step 3: Store'u yaz**

`taskDetailStore.js`:

```js
/**
 * taskDetailStore — island DIŞINDAN (jQuery sayfa script'leri) imperatif açma.
 *
 * useSyncExternalStore deseni lib/device/useDeviceMode.jsx ile aynı — bu repoda
 * kurulu idiom. Redux/zustand eklemeye gerek yok, tek bir Guid tutuyoruz.
 *
 * open() hem 'guid' hem {id:'guid'} kabul eder çünkü apya-kanban.js
 * `editModal.open({ id: ... })` çağırıyor ve o dosya DEĞİŞTİRİLMEYECEK.
 */
let currentTaskId = null;
const listeners = new Set();
const resultHandlers = new Set();

function emit() {
    listeners.forEach((l) => l());
}

function normalizeId(arg) {
    if (typeof arg === 'string' && arg) return arg;
    if (arg && typeof arg === 'object' && typeof arg.id === 'string' && arg.id) return arg.id;
    return null;
}

export const taskDetailStore = {
    open(arg) {
        const id = normalizeId(arg);
        if (!id || id === currentTaskId) return;
        currentTaskId = id;
        emit();
    },
    close() {
        if (currentTaskId === null) return;
        currentTaskId = null;
        emit();
    },
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot() {
        return currentTaskId;
    },
    /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
    onResult(fn) {
        if (typeof fn === 'function') resultHandlers.add(fn);
    },
    emitResult() {
        resultHandlers.forEach((fn) => fn());
    },
    /** Yalnız testler için. */
    reset() {
        currentTaskId = null;
        listeners.clear();
        resultHandlers.clear();
    },
};
```

- [ ] **Step 4: useTaskDetail.js'i yaz**

```js
import { useQuery } from '@tanstack/react-query';

/**
 * Görev detayı — mevcut ABP dinamik JS proxy'si üzerinden.
 * Yeni endpoint AÇMIYORUZ: apya.platform.tasks.task.get zaten
 * TaskAppService.GetAsync'i çağırıyor (gizlilik + tenant kuralları orada).
 *
 * jQuery Deferred döner; native Promise'e sarmak zorundayız (documents.jsx
 * ile aynı köprü deseni).
 */
function fetchTask(taskId) {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(svc.get(taskId));
}

export function useTaskDetail(taskId) {
    return useQuery({
        queryKey: ['task-detail', taskId],
        queryFn: () => fetchTask(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: 1,
    });
}

/** İzin köprüsü — frontend gizleme, backend kontrolünün YERİNE GEÇMEZ. */
export function isGranted(permission) {
    return Boolean(window?.abp?.auth?.isGranted?.(permission));
}
```

- [ ] **Step 5: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/taskDetailStore.test.js
```

Beklenen: `Tests 7 passed (7)`

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/taskDetailStore.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/taskDetailStore.test.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskDetail.js
git commit -m "feat: gorev detayi veri cekme ve imperatif acma store'u"
```

---

### Task 7: AccessBadge + TaskDetailHeader + TaskDetailFooter

Görseldeki header/footer. Kırmızı "Gizli" uyarısı sade "Sınırlı erişim" göstergesine dönüşür.

**Files:**
- Create: `.../task-detail/components/AccessBadge.jsx`
- Create: `.../task-detail/components/TaskDetailHeader.jsx`
- Create: `.../task-detail/components/TaskDetailFooter.jsx`
- Test: `.../task-detail/components/TaskDetailHeader.test.jsx`

**Interfaces:**
- Consumes: `Badge` (`components/ui`), `cn` (`lib/utils`)
- Produces:
  - `<AccessBadge isPrivate />`
  - `<TaskDetailHeader task canDelete onClose onDelete onToggleFullscreen fullscreen />`
  - `<TaskDetailFooter lastSavedAt isDirty isSaving onCancel onSave />`

- [ ] **Step 1: Failing test yaz**

```jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskDetailHeader } from './TaskDetailHeader';
import { TaskDetailFooter } from './TaskDetailFooter';

const task = { id: 'x', title: 'Otel Konaklama Anlaşması', status: 4, priority: 4, isPrivate: true };

describe('TaskDetailHeader', () => {
    it('gorev basligini gosterir', () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        expect(screen.getByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });

    it('gizli gorevde kirmizi "Gizli" degil, notr "Sinirli erisim" gosterir', () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        expect(screen.getByText('Sınırlı erişim')).toBeInTheDocument();
        expect(screen.queryByText('Gizli')).not.toBeInTheDocument();
    });

    it('Sil butonu sekmelerde degil, ucnokta menusunde', async () => {
        render(<TaskDetailHeader task={task} canDelete onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        expect(screen.queryByRole('menuitem', { name: /Sil/ })).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        expect(screen.getByRole('menuitem', { name: /Sil/ })).toBeInTheDocument();
    });

    it('silme yetkisi yoksa Sil menude gorunmez', async () => {
        render(<TaskDetailHeader task={task} canDelete={false} onClose={() => {}} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        expect(screen.queryByRole('menuitem', { name: /Sil/ })).not.toBeInTheDocument();
    });

    it('kapat butonu onClose cagirir', async () => {
        const onClose = vi.fn();
        render(<TaskDetailHeader task={task} canDelete onClose={onClose} onDelete={() => {}} onToggleFullscreen={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

describe('TaskDetailFooter', () => {
    it('degisiklik yokken Kaydet devre disi', () => {
        render(<TaskDetailFooter isDirty={false} isSaving={false} onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    });

    it('degisiklik varken Kaydet aktif', () => {
        render(<TaskDetailFooter isDirty isSaving={false} onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled();
    });

    it('kaydederken buton devre disi ve durum metni gosterir (cift tiklama korumasi)', () => {
        render(<TaskDetailFooter isDirty isSaving onCancel={() => {}} onSave={() => {}} />);
        expect(screen.getByRole('button', { name: 'Kaydediliyor…' })).toBeDisabled();
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/components/TaskDetailHeader.test.jsx
```

Beklenen: FAIL — `Failed to resolve import "./TaskDetailHeader"`

- [ ] **Step 3: AccessBadge.jsx'i yaz**

```jsx
import React from 'react';

/**
 * Erişim göstergesi. Eski EditModal'daki `text-danger` + fa-user-secret + "Gizli"
 * kombinasyonu bir uyarı/hata gibi okunuyordu; bu bir DURUM bilgisi, tehlike değil.
 * Nötr renk + kilit ikonu + açıklayıcı title.
 */
export function AccessBadge({ isPrivate }) {
    if (!isPrivate) return null;
    return (
        <span
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary"
            title="Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir."
        >
            <i className="fa fa-lock text-text-tertiary" aria-hidden="true" />
            Sınırlı erişim
        </span>
    );
}
```

- [ ] **Step 4: TaskDetailHeader.jsx'i yaz**

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '../../components/ui';
import { AccessBadge } from './AccessBadge';

const STATUS = {
    0: { text: 'İptal',      variant: 'neutral'  },
    1: { text: 'Yapılacak',  variant: 'neutral'  },
    2: { text: 'Sürüyor',    variant: 'warning'  },
    3: { text: 'Testte',     variant: 'brand'    },
    4: { text: 'Tamamlandı', variant: 'positive' },
};

const PRIORITY = {
    1: { text: 'Düşük',  variant: 'positive' },
    2: { text: 'Orta',   variant: 'neutral'  },
    3: { text: 'Yüksek', variant: 'warning'  },
    4: { text: 'Kritik', variant: 'negative' },
};

export function TaskDetailHeader({
    task, canDelete, onClose, onDelete, onToggleFullscreen, fullscreen = false,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onDocClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [menuOpen]);

    const status = STATUS[task?.status] ?? STATUS[1];
    const priority = PRIORITY[task?.priority] ?? PRIORITY[2];

    const copyLink = () => {
        const url = `${window.location.origin}/Tasks/Detail/${task.id}`;
        navigator.clipboard?.writeText(url);
        window?.abp?.notify?.info?.('Bağlantı kopyalandı.');
        setMenuOpen(false);
    };

    return (
        <header className="flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]">
            <div className="flex items-start justify-between gap-[var(--apya-space-4)]">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[13px] text-text-tertiary">
                        <i className="fa fa-list-check" aria-hidden="true" />
                        <span>Görev</span>
                    </div>
                    <h2 className="mt-1 truncate text-xl font-semibold text-text-primary">
                        {task?.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant={status.variant}>{status.text}</Badge>
                        <Badge variant={priority.variant}>{priority.text}</Badge>
                        <AccessBadge isPrivate={task?.isPrivate} />
                    </div>
                </div>

                <div className="flex flex-none items-center gap-1">
                    <button
                        type="button"
                        aria-label={fullscreen ? 'Küçült' : 'Tam ekrana büyüt'}
                        onClick={onToggleFullscreen}
                        className="mobile:hidden grid h-9 w-9 place-items-center rounded-md text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                    >
                        <i className={fullscreen ? 'fa fa-compress' : 'fa fa-expand'} aria-hidden="true" />
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            aria-label="Görev işlemleri"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                            className="grid h-9 w-9 place-items-center rounded-md text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                        >
                            <i className="fa fa-ellipsis" aria-hidden="true" />
                        </button>
                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 z-popover mt-1 w-56 rounded-lg border border-default bg-surface-elevated py-1 shadow-xl"
                            >
                                <button type="button" role="menuitem" onClick={copyLink}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised">
                                    <i className="fa fa-link w-4 text-text-tertiary" aria-hidden="true" />Bağlantıyı kopyala
                                </button>
                                <button type="button" role="menuitem" disabled
                                    title="Yakında"
                                    className="flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary">
                                    <i className="fa fa-copy w-4" aria-hidden="true" />Çoğalt
                                    <span className="ml-auto text-[11px]">Yakında</span>
                                </button>
                                <button type="button" role="menuitem" disabled
                                    title="Yakında"
                                    className="flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary">
                                    <i className="fa fa-box-archive w-4" aria-hidden="true" />Arşivle
                                    <span className="ml-auto text-[11px]">Yakında</span>
                                </button>
                                {canDelete && (
                                    <>
                                        <div className="my-1 h-px bg-border-subtle" />
                                        <button type="button" role="menuitem"
                                            onClick={() => { setMenuOpen(false); onDelete(); }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-negative hover:bg-surface-raised">
                                            <i className="fa fa-trash w-4" aria-hidden="true" />Sil
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Kapat"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-md text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                    >
                        <i className="fa fa-xmark" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}
```

- [ ] **Step 5: TaskDetailFooter.jsx'i yaz**

```jsx
import React from 'react';
import { Button } from '../../components/ui';

const fmtTime = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
    : null);

/* onSave opsiyonel: Faz 1'de kaydedilecek bir şey olmadığı için hiç geçilmiyor. */
export function TaskDetailFooter({ lastSavedAt, isDirty, isSaving, onCancel, onSave }) {
    const saved = fmtTime(lastSavedAt);
    return (
        <footer className="flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]">
            <div className="flex items-center justify-between gap-[var(--apya-space-4)]">
                <span className="truncate text-[13px] text-text-tertiary">
                    {saved ? `Son kayıt: ${saved}` : ' '}
                </span>
                <div className="flex flex-none items-center gap-2">
                    <Button variant="secondary" onClick={onCancel} disabled={isSaving}>Vazgeç</Button>
                    {/* isLoading Button içinde zaten disabled + aria-busy yapıyor ve
                        loadingText'i children yerine gösteriyor → çift tıklama koruması
                        elle kurulmuyor. disabled={!isDirty} yalnız "değişiklik yok" hali. */}
                    <Button
                        variant="primary"
                        onClick={() => onSave?.()}
                        disabled={!isDirty || !onSave}
                        isLoading={isSaving}
                        loadingText="Kaydediliyor…"
                    >
                        Kaydet
                    </Button>
                </div>
            </div>
        </footer>
    );
}
```

- [ ] **Step 6: Bileşen API'lerini teyit et**

Yukarıdaki kod şu gerçek imzalara göre yazıldı (kontrol amaçlı, değişmediyse dokunma):

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && grep -n "variants:" -A 16 src/components/ui/Badge.jsx src/components/ui/Button.jsx
```

- `Button` variant: `primary | secondary | ghost | destructive | outline | link`; size: `sm | md | lg | icon`; prop: `isLoading` (otomatik `disabled` + `aria-busy` yapar ve `loadingText`'i children yerine gösterir), `leadingIcon`, `trailingIcon`, `asChild`
- `Badge` variant: `neutral | brand | positive | negative | warning | critical | ai`; size: `sm | md | lg`
- Odak halkası deseni: `focus-visible:outline-none focus-visible:shadow-focus` (`ring-*` DEĞİL — projede ring rengi tanımlı değil)

Farklıysa **uydurma** — gerçek imzaya göre düzelt.

- [ ] **Step 7: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/components/TaskDetailHeader.test.jsx
```

Beklenen: `Tests 8 passed (8)`

- [ ] **Step 8: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components
git commit -m "feat: gorev detayi header/footer ve Sinirli erisim gostergesi"
```

---

### Task 8: TaskDetailRoot + ModalShell + island mount + çağrı noktaları

Faz 1'in birleştirme adımı. Bu task bitince modal gerçekten açılır.

**Files:**
- Create: `.../task-detail/shells/ModalShell.jsx`, `.../task-detail/TaskDetailRoot.jsx`, `.../src/task-detail.jsx`
- Create: `src/Apya.Platform.Web/Pages/Shared/_TaskDetailIsland.cshtml`
- Modify: `.../dynamic-assets/vite.config.js:15-25`
- Modify: `src/Apya.Platform.Web/Pages/Tasks/Index.cshtml:136`, `Pages/Tasks/index.js:4`
- Modify: `src/Apya.Platform.Web/Pages/Board/Index.cshtml`, `Pages/Board/index.js:4`
- Modify: `src/Apya.Platform.Web/Pages/Projects/ProjectDetails.cshtml`, `Pages/Projects/ProjectDetails.js:4`
- Test: `.../task-detail/TaskDetailRoot.test.jsx`

**Interfaces:**
- Consumes: Task 3 `Dialog`, Task 4 `useDirtyGuard`, Task 5 `useTaskUrlSync`, Task 6 `taskDetailStore` + `useTaskDetail`, Task 7 header/footer
- Produces: `window.apya.taskDetail` — `.open(idOrObj)` ve `.onResult(fn)` metotlarıyla `abp.ModalManager` uyumlu adaptör

- [ ] **Step 1: Failing test yaz**

`TaskDetailRoot.test.jsx`:

```jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Otel Konaklama Anlaşması',
    status: 4, priority: 4, isPrivate: true,
    lastModificationTime: '2026-07-10T09:45:00Z',
};

function wrap(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = { platform: { tasks: { task: { get: vi.fn(() => Promise.resolve(TASK)) } } } };
    window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn() } };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot', () => {
    it('yuklenirken iskelet gosterir', () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText('Görev yükleniyor')).toBeInTheDocument();
    });

    it('veri gelince baslik gorunur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText('Otel Konaklama Anlaşması')).toBeInTheDocument();
    });

    it('temizken kapat dogrudan kapatir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('API hatasinda hata mesaji ve tekrar dene gosterir', async () => {
        window.apya.platform.tasks.task.get = vi.fn(() => Promise.reject(new Error('403')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        expect(await screen.findByText(/Görev yüklenemedi/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument();
    });

    it('acilinca URLe ?task ekler', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await waitFor(() => expect(window.location.search).toBe(`?task=${TASK.id}`));
    });

    it('Kaydet Faz 1de hep devre disi (duzenlenebilir alan yok)', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();
    });

    it('silme onayinda SIL yazilmadan buton aktif olmaz', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));

        const confirmBtn = screen.getByRole('button', { name: 'Evet, sil' });
        expect(confirmBtn).toBeDisabled();

        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        expect(confirmBtn).toBeEnabled();
    });

    it('silme onaylaninca servis cagrilir ve modal kapanir', async () => {
        const onClose = vi.fn();
        window.apya.platform.tasks.task.delete = vi.fn(() => Promise.resolve());
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.click(screen.getByRole('button', { name: 'Görev işlemleri' }));
        await userEvent.click(screen.getByRole('menuitem', { name: /Sil/ }));
        await userEvent.type(screen.getByLabelText('Onay metni'), 'SİL');
        await userEvent.click(screen.getByRole('button', { name: 'Evet, sil' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.delete).toHaveBeenCalledWith(TASK.id));
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
});
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/TaskDetailRoot.test.jsx
```

Beklenen: FAIL — `Failed to resolve import "./TaskDetailRoot"`

- [ ] **Step 3: ModalShell.jsx'i yaz**

```jsx
import React from 'react';
import { Dialog, DialogContent } from '../../components/ui';

/**
 * ModalShell — YALNIZ dış kabuk. İçeriği hiç bilmez.
 * Faz 5'te eklenecek PageShell aynı `children`'ı portal'sız/backdrop'suz render eder;
 * bu yüzden buraya görev-özel hiçbir şey koyma.
 *
 * Tek scroll konteyneri: grid-rows [header | içerik(1fr, scroll) | footer].
 * min-h-0 zorunlu — CSS grid çocukları varsayılan min-height:auto ile küçülmez,
 * o olmadan içerik footer'ı ekrandan taşırır.
 */
export function ModalShell({
    open, onRequestClose, fullscreen, title, header, footer, children,
}) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => { if (!next) onRequestClose(); }}
        >
            <DialogContent
                title={title}
                fullscreen={fullscreen}
                /* Backdrop tıklaması da dirty kontrolünden geçmeli: Radix'in
                   otomatik kapanmasını engelleyip kendi akışımıza yönlendiriyoruz. */
                onInteractOutside={(e) => { e.preventDefault(); onRequestClose(); }}
                onEscapeKeyDown={(e) => { e.preventDefault(); onRequestClose(); }}
            >
                <div className="grid h-full min-h-0 grid-rows-[auto_1fr_auto]">
                    {header}
                    <div className="min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]">
                        {children}
                    </div>
                    {footer}
                </div>
            </DialogContent>
        </Dialog>
    );
}
```

- [ ] **Step 4: TaskDetailRoot.jsx'i yaz**

```jsx
import React, { useState, useCallback } from 'react';
import { ModalShell } from './shells/ModalShell';
import { TaskDetailHeader } from './components/TaskDetailHeader';
import { TaskDetailFooter } from './components/TaskDetailFooter';
import { useTaskDetail, isGranted } from './hooks/useTaskDetail';
import { useDirtyGuard } from './hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from './hooks/useTaskUrlSync';
import { Skeleton, Button } from '../components/ui';

const FULLSCREEN_KEY = 'apya.taskDetail.fullscreen';

/**
 * TaskDetailRoot — sunum-BAĞIMSIZ çekirdek: veri, izin, dirty state.
 * `presentation` yalnız hangi kabuğun saracağını seçer. Faz 5'te 'page' eklenecek;
 * içerik componentleri (Faz 2+) her iki modda da AYNI kalır.
 */
export function TaskDetailRoot({ taskId, presentation = 'modal', onClose }) {
    const { data: task, isLoading, isError, refetch } = useTaskDetail(taskId);
    const guard = useDirtyGuard();
    const [fullscreen, setFullscreen] = useState(
        () => window.localStorage?.getItem(FULLSCREEN_KEY) === '1',
    );

    const closeNow = useCallback(() => {
        clearTaskUrl();
        onClose?.();
    }, [onClose]);

    useTaskUrlSync(taskId, closeNow);

    const requestClose = useCallback(() => guard.requestClose(closeNow), [guard, closeNow]);

    const toggleFullscreen = useCallback(() => {
        setFullscreen((v) => {
            const next = !v;
            window.localStorage?.setItem(FULLSCREEN_KEY, next ? '1' : '0');
            return next;
        });
    }, []);

    const canDelete = isGranted('Platform.Tasks.Delete');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /* SİLME Faz 1'de ÇALIŞIR olmak zorunda: bugün drawer'da çalışıyor, bayrak
       açıldığında kaybolursa fonksiyonel regresyon olur. Kaydetme aksine Faz 2'ye
       kalabilir çünkü Faz 1'de düzenlenebilir alan hiç yok (Kaydet hep disabled). */
    const handleDelete = useCallback(async () => {
        setDeleting(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(taskId));
            window?.abp?.notify?.info?.('Başarıyla silindi.');
            setDeleteOpen(false);
            guard.markClean();
            closeNow();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev silinemedi.');
        } finally {
            setDeleting(false);
        }
    }, [taskId, guard, closeNow]);

    const body = isLoading
        ? (
            <div aria-label="Görev yükleniyor" aria-busy="true" className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
        : isError
            ? (
                <div className="grid place-items-center gap-3 py-[var(--apya-space-12)] text-center">
                    <i className="fa fa-triangle-exclamation text-2xl text-text-tertiary" aria-hidden="true" />
                    <p className="text-text-secondary">Görev yüklenemedi. Erişim yetkiniz olmayabilir.</p>
                    <Button variant="ghost" onClick={() => refetch()}>Tekrar dene</Button>
                </div>
            )
            : (
                <p className="text-text-tertiary">
                    Genel sekmesi Faz 2&apos;de eklenecek.
                </p>
            );

    /* presentation: Faz 1'de tek geçerli değer 'modal'; Faz 5'te 'page' eklenecek
       ve ModalShell yerine PageShell seçilecek. Prop şimdi duruyor çünkü çağıran
       taraflar (island + Faz 5'in Razor sayfası) bu sözleşmeye göre yazılıyor.
       Bilinmeyen değer için savunma kodu YOK — çağıran iç kod, dış girdi değil. */
    return (
        <ModalShell
            open
            fullscreen={fullscreen}
            onRequestClose={requestClose}
            title={task?.title ?? 'Görev Detayı'}
            header={(
                <TaskDetailHeader
                    task={task ?? { title: 'Yükleniyor…' }}
                    canDelete={canDelete}
                    fullscreen={fullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    onClose={requestClose}
                    onDelete={() => setDeleteOpen(true)}
                />
            )}
            footer={(
                <TaskDetailFooter
                    lastSavedAt={task?.lastModificationTime}
                    isDirty={guard.isDirty}
                    isSaving={false}
                    onCancel={requestClose}
                    /* onSave BİLEREK geçilmiyor: Faz 1'de düzenlenebilir alan yok,
                       isDirty hiç true olmuyor, Kaydet hep disabled → handler asla
                       çalışmaz. No-op fonksiyon yerine hiç geçmemek daha dürüst.
                       Gerçek kaydetme Faz 2'de bağlanacak. */
                />
            )}
        >
            {body}
            {guard.pendingClose && (
                <UnsavedChangesDialog
                    onStay={() => guard.resolvePendingClose('stay')}
                    onDiscard={() => guard.resolvePendingClose('discard')}
                />
            )}
            {deleteOpen && (
                <DeleteTaskDialog
                    taskTitle={task?.title ?? ''}
                    busy={deleting}
                    onCancel={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </ModalShell>
    );
}

/**
 * Silme onayı — eski drawer'daki SweetAlert akışıyla aynı sertlikte:
 * kullanıcı tam olarak "SİL" yazmadan buton aktifleşmez.
 */
function DeleteTaskDialog({ taskTitle, busy, onCancel, onConfirm }) {
    const [text, setText] = useState('');
    const ok = text.trim() === 'SİL';
    return (
        <AlertShell
            label="Görev silinecek"
            title="Görev silinecek"
            description={<><strong className="text-text-primary">{taskTitle}</strong> kalıcı olarak silinecek. Onaylamak için aşağıya <strong>SİL</strong> yazın.</>}
            actions={(
                <>
                    <Button variant="secondary" onClick={onCancel} disabled={busy}>İptal</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={!ok}
                        isLoading={busy} loadingText="Siliniyor…">
                        Evet, sil
                    </Button>
                </>
            )}
        >
            <label htmlFor="delete-confirm" className="sr-only">Onay metni</label>
            <input
                id="delete-confirm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="SİL"
                autoComplete="off"
                className="mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
            />
        </AlertShell>
    );
}

/**
 * AlertShell — iki onay diyaloğunun ORTAK kabuğu (backdrop + kart + aksiyon satırı).
 * Ayrı bir component çünkü aksi halde aynı overlay markup'ı üç yere kopyalanırdı
 * (documents.jsx'te zaten bir kopyası var — o island'ın yerel ConfirmDialog'u).
 *
 * Radix Dialog KULLANILMIYOR: bu diyaloglar zaten açık bir Radix Dialog'un
 * İÇİNDE render ediliyor; ikinci bir portal + focus trap iç içe girip ESC
 * sırasını bozuyor. Burada dış modal focus trap'i zaten aktif.
 */
function AlertShell({ label, title, description, children, actions }) {
    return (
        <div role="alertdialog" aria-modal="true" aria-label={label}
            className="absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4">
            <div className="w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl">
                <h3 className="text-base font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{description}</p>
                {children}
                <div className="mt-[var(--apya-space-5)] flex justify-end gap-2">{actions}</div>
            </div>
        </div>
    );
}

function UnsavedChangesDialog({ onStay, onDiscard }) {
    return (
        <AlertShell
            label="Kaydedilmemiş değişiklikler"
            title="Kaydedilmemiş değişiklikleriniz var."
            description="Çıkarsanız yaptığınız değişiklikler kaybolur."
            actions={(
                <>
                    <Button variant="secondary" onClick={onStay}>Düzenlemeye devam et</Button>
                    <Button variant="destructive" onClick={onDiscard}>Değişiklikleri iptal et</Button>
                </>
            )}
        />
    );
}
```

- [ ] **Step 5: Island entry'sini yaz**

`src/task-detail.jsx`:

```jsx
/**
 * Task Detail Island — Apya Design System v3
 * ---------------------------------------------------------------------------
 * Mount : <div id="task-detail-island"></div>  (Pages/Shared/_TaskDetailIsland.cshtml)
 * Açılış: window.apya.taskDetail.open(id | { id })
 *
 * `abp.ModalManager` ile AYNI sözleşmeyi sunar (.open / .onResult) — böylece
 * wwwroot/js/apya-kanban.js hiç değiştirilmeden çalışmaya devam eder.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useSyncExternalStore } from 'react';
import './index.css';
import { QueryProvider } from './lib/api/QueryProvider';
import { TaskDetailRoot } from './task-detail/TaskDetailRoot';
import { taskDetailStore } from './task-detail/taskDetailStore';
import { readTaskIdFromUrl } from './task-detail/hooks/useTaskUrlSync';

function TaskDetailIsland() {
    const taskId = useSyncExternalStore(
        taskDetailStore.subscribe,
        taskDetailStore.getSnapshot,
        () => null,
    );

    if (!taskId) return null;

    return (
        <QueryProvider>
            <TaskDetailRoot
                taskId={taskId}
                presentation="modal"
                onClose={() => {
                    taskDetailStore.close();
                    taskDetailStore.emitResult();
                }}
            />
        </QueryProvider>
    );
}

/**
 * FAZ 1 BAYRAK: yeni modal varsayılan DEĞİL.
 * Gerekçe — Faz 1'de henüz düzenlenebilir alan yok (Genel sekmesi Faz 2'de).
 * Varsayılan yapılırsa kullanıcılar görev düzenleme yeteneğini kaybeder.
 * Bayrak Faz 2'de varsayılan açık olur, Faz 9'da tamamen kaldırılır.
 *
 * Açma yolları:
 *   - Kalıcı : localStorage.setItem('apya.taskDetail.v2', '1')
 *   - Tek seferlik: sayfaya ?taskui=v2 ekle
 */
function isV2Enabled() {
    try {
        if (new URLSearchParams(window.location.search).get('taskui') === 'v2') return true;
        return window.localStorage.getItem('apya.taskDetail.v2') === '1';
    } catch (_) {
        return false; /* localStorage kapalı (gizli mod / policy) → eski drawer */
    }
}

/* ─── Mount ─────────────────────────────────────────────────────────── */
const container = document.getElementById('task-detail-island');
if (container) {
    window.apya = window.apya || {};
    window.apya.taskDetailV2Enabled = isV2Enabled();
    window.apya.taskDetail = {
        open: (arg) => taskDetailStore.open(arg),
        close: () => taskDetailStore.close(),
        onResult: (fn) => taskDetailStore.onResult(fn),
    };

    createRoot(container).render(<TaskDetailIsland />);

    /* Derin bağlantı: /Tasks?task=<guid> ile gelindiyse doğrudan aç.
       Bayrak kapalıyken açma — eski drawer bu parametreyi bilmiyor. */
    if (window.apya.taskDetailV2Enabled) {
        const deepLinkId = readTaskIdFromUrl();
        if (deepLinkId) taskDetailStore.open(deepLinkId);
    }
}
```

- [ ] **Step 6: Bağımlı bileşenlerin gerçek API'lerini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && grep -n "export" src/lib/api/QueryProvider.jsx && grep -n "className" src/components/ui/Skeleton.jsx
```

Beklenen: `QueryProvider` export ediliyor; `Skeleton` bir `className` prop'u kabul ediyor.
Farklıysa **uydurma** — import satırını ve prop kullanımını gerçek imzaya göre düzelt.

- [ ] **Step 7: Vite entry'sini ekle**

`vite.config.js` içindeki `entry` nesnesine ekle:

```js
        'documents':        'src/documents.jsx',
        'task-detail':      'src/task-detail.jsx',
```

- [ ] **Step 8: Razor mount partial'ını oluştur**

`src/Apya.Platform.Web/Pages/Shared/_TaskDetailIsland.cshtml`:

```cshtml
@* Görev detay modalı — Tasks/Board/ProjectDetails sayfalarının ortak mount noktası.
   Island açılana kadar hiçbir şey render etmez (taskDetailStore boşken null döner). *@
<div id="task-detail-island"></div>
<script type="module" src="~/js/task-detail.js" asp-append-version="true"></script>
```

- [ ] **Step 9: Üç sayfaya partial'ı ekle**

`Pages/Tasks/Index.cshtml` — `@section scripts` bloğunun **hemen üstüne** (satır ~129):

```cshtml
<partial name="_TaskDetailIsland" />
```

Aynı satırı `Pages/Board/Index.cshtml` ve `Pages/Projects/ProjectDetails.cshtml` dosyalarına da ekle (her ikisinde de `@section scripts` bloğunun hemen üstüne).

- [ ] **Step 10: Çağrı noktalarını bayrakla bağla**

Üç dosyada da aynı desen. Bayrak kapalıyken **davranış bugünküyle birebir aynı** kalır — bu, Faz 1'i tek başına merge edilebilir yapan şey.

`Pages/Tasks/index.js:4` — değiştir:

```js
    // Görev detayı: bayrak açıksa React island'ı (window.apya.taskDetail), değilse
    // eski Razor drawer'ı. İkisi de .open()/.onResult() sözleşmesini karşılar →
    // apya-kanban.js her iki durumda da değişmeden çalışır.
    var editModal   = (window.apya && apya.taskDetailV2Enabled)
        ? apya.taskDetail
        : new abp.ModalManager(abp.appPath + 'Tasks/EditModal');
```

`Pages/Board/index.js:4` — değiştir:

```js
    var editModal = (window.apya && apya.taskDetailV2Enabled)
        ? apya.taskDetail
        : new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
```

`Pages/Projects/ProjectDetails.js:4` — değiştir:

```js
    var editModal   = (window.apya && apya.taskDetailV2Enabled)
        ? apya.taskDetail
        : new abp.ModalManager({ viewUrl: abp.appPath + 'Tasks/EditModal' });
```

⚠️ `_TaskDetailIsland.cshtml` script'i `type="module"` olduğu için **defer** semantiğiyle çalışır: `apya.taskDetailV2Enabled` sayfa script'lerinden sonra atanabilir. Bu yüzden partial'ı `@section scripts` bloğunun **üstüne** koymak yetmez — island script'i sayfa script'inden **önce** çalışmalı. Doğrulama Step 12'de: bayrak açıkken modal gerçekten React modalı mı, yoksa eski drawer mı açılıyor kontrol et. Yarış durumu görülürse bayrağı island'dan bağımsız, senkron bir inline script'e taşı:

```cshtml
<script>
    window.apya = window.apya || {};
    window.apya.taskDetailV2Enabled = (function () {
        try {
            if (new URLSearchParams(location.search).get('taskui') === 'v2') return true;
            return localStorage.getItem('apya.taskDetail.v2') === '1';
        } catch (e) { return false; }
    })();
</script>
<div id="task-detail-island"></div>
<script type="module" src="~/js/task-detail.js" asp-append-version="true"></script>
```

Bu senkron varyant tercih edilirse `task-detail.jsx` içindeki `isV2Enabled()` çağrısını `window.apya.taskDetailV2Enabled`'i okuyacak şekilde sadeleştir (iki kaynak bırakma).

- [ ] **Step 11: Testin geçtiğini doğrula**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run
```

Beklenen: tüm test dosyaları geçer (`Test Files 7 passed`).

- [ ] **Step 12: Build ve canlı doğrulama**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npm run build
```

```bash
dotnet build Apya.Platform.slnx
```

Sunucuyu başlat (`https://localhost:44386`).

**Önce bayrak KAPALIYKEN — regresyon kontrolü:**
1. `/Tasks` → tablo satırına tıkla → **eski sağ drawer** açılıyor, otomatik kayıt çalışıyor.
2. Kanban kartı, Gantt barı, `/Board`, proje detayı → hepsi eskisi gibi.
3. Bu adım geçmezse devam etme: Faz 1 mevcut davranışı bozmamalı.

**Sonra bayrak AÇIKKEN** (`/Tasks?taskui=v2` veya konsolda `localStorage.setItem('apya.taskDetail.v2','1')`):
4. Tablo satırına tıkla → **merkezi modal** açılıyor, sağdan drawer değil.
5. URL `?task=<guid>` oluyor; **F5** → aynı görev tekrar açılıyor.
6. **Geri tuşu** → modal kapanıyor, sayfa aynı kalıyor (listeden çıkmıyor).
7. Kanban görünümünde karta tıkla → aynı modal (`apya-kanban.js` değişmeden).
8. `/Board` ve bir proje detay sayfasından da açılıyor.
9. Pencereyi 700px'e daralt → modal tam ekran, tek kolon, footer erişilebilir.
10. ⋯ menüsü → Sil yalnız yetkiliyse görünüyor; Çoğalt/Arşivle "Yakında" ile devre dışı.
11. Sil → "SİL" yazmadan buton pasif; yazınca siliniyor, liste tazeleniyor.
12. Tam ekrana büyüt → modala dön: içerik yeniden yüklenmiyor (Network'te yeni istek yok).
13. Klavye: Tab focus modal içinde kapalı döngüde; ESC kapatıyor; kapanınca focus tetikleyen satıra dönüyor.
14. Koyu tema → kontrast ve yüzey renkleri doğru (ham renk sızıntısı yok).

- [ ] **Step 13: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail src/Apya.Platform.Web/wwwroot/dynamic-assets/vite.config.js src/Apya.Platform.Web/Pages/Shared/_TaskDetailIsland.cshtml src/Apya.Platform.Web/Pages/Tasks src/Apya.Platform.Web/Pages/Board src/Apya.Platform.Web/Pages/Projects src/Apya.Platform.Web/wwwroot/js
git commit -m "feat: merkezi gorev detay modali ve abp.ModalManager uyumlu adaptor"
```

---

### Task 9: Finans izin hatası (backend)

`EditModalModel.OnGetAsync` koşulsuz `ExpenseAppService`/`IncomeEntryAppService` çağırıyor; ikisi de `[Authorize(...)]`. Expenses izni olmayan kullanıcı görev detayını **hiç açamıyor**. Eski modal Faz 9'a kadar yaşayacağı için düzeltilmeli.

**Files:**
- Modify: `src/Apya.Platform.Web/Pages/Tasks/EditModal.cshtml.cs:185-191`
- Test: `test/Apya.Platform.Application.Tests/Tasks/TaskAppService_Tenant_Tests.cs` (Task 10 ile aynı dosya, orada oluşturulacak)

- [ ] **Step 1: Sorunu yeniden üret**

Expenses izni olmayan bir role/kullanıcıyla giriş yap, `/Tasks` sayfasında bir satıra tıkla.
Beklenen (hatalı) davranış: modal açılmıyor, `Logs/` altında `AbpAuthorizationException` görünüyor.

- [ ] **Step 2: Düzeltmeyi uygula**

`EditModal.cshtml.cs` içindeki finans blokunu değiştir:

```csharp
            // Finans sekmesi izne bağlı: ExpenseAppService/IncomeEntryAppService
            // [Authorize] taşıyor. Koşulsuz çağırınca Expenses/Incomes izni OLMAYAN
            // kullanıcıda tüm görev detayı 403 ile ölüyordu.
            if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Expenses.Default))
            {
                var expensePage = await _expenseAppService.GetListAsync(
                    new GetExpensesInput { TaskId = Id, MaxResultCount = 500 });
                TaskExpenses = expensePage.Items.OrderByDescending(x => x.ExpenseDate).ToList();
            }

            if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Incomes.Default))
            {
                var incomePage = await _incomeEntryAppService.GetListAsync(
                    new GetIncomeEntriesInput { TaskId = Id, MaxResultCount = 500 });
                TaskIncomes = incomePage.Items.OrderByDescending(x => x.IncomeDate).ToList();
            }
```

- [ ] **Step 3: Derle**

```bash
dotnet build Apya.Platform.slnx
```

Beklenen: `Build succeeded`, 0 error.

- [ ] **Step 4: Canlı doğrula**

Aynı izinsiz kullanıcıyla tekrar dene: modal açılıyor, Finans sekmesi boş listeler gösteriyor.

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Web/Pages/Tasks/EditModal.cshtml.cs
git commit -m "fix: Expenses izni olmayan kullanicida gorev detayinin acilmamasi"
```

---

### Task 10: Tenant izolasyonu ve yetkilendirme açıkları (backend)

**Kapsam dışı ama sevk edilmeden önce kapatılmalı.** Üç açık: (1) `TaskAttachmentController` `[Authorize]` taşımıyor ve projede global fallback policy yok → kimlik doğrulamasız yükleme. (2) `FileController` aynı şekilde → GUID'i bilen herkes indirebiliyor. (3) `TaskComment`/`TaskAttachment` `IMultiTenant` uygulamıyor → `GetAttachmentsAsync(taskId)` / `GetCommentsAsync(taskId)` çapraz-tenant okuma yapabiliyor.

Migration gerektirmeyen düzeltme: entity'ye `IMultiTenant` eklemek yerine, **görev üzerinden** tenant doğrula (`TaskItem` zaten `IMultiTenant`, `Repository.GetAsync` filtreli).

**Files:**
- Modify: `src/Apya.Platform.HttpApi/Tasks/TaskAttachmentController.cs:14`
- Modify: `src/Apya.Platform.HttpApi/Controllers/FileController.cs:10`
- Modify: `src/Apya.Platform.Application/Tasks/TaskAppService.cs:610-640`
- Test: `test/Apya.Platform.Application.Tests/Tasks/TaskAppService_Tenant_Tests.cs`

**Interfaces:**
- Consumes: mevcut `Repository` (TaskItem, tenant-filtreli)
- Produces: `GetAttachmentsAsync` / `GetCommentsAsync` / `AddAttachmentAsync` artık başka tenant'ın TaskId'siyle çağrılınca `EntityNotFoundException` fırlatır.

- [ ] **Step 1: Failing test yaz**

`test/Apya.Platform.Application.Tests/Tasks/TaskAppService_Tenant_Tests.cs`:

```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.Tasks;

public class TaskAppService_Tenant_Tests : PlatformApplicationTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Tenant_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInTenantAsync(Guid tenantId)
    {
        using (_currentTenant.Change(tenantId))
        {
            var task = new TaskItem(
                Guid.NewGuid(), "Diğer tenant görevi",
                tenantId: tenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            return task.Id;
        }
    }

    [Fact]
    public async Task GetAttachmentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetAttachmentsAsync(taskId));
    }

    [Fact]
    public async Task GetCommentsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetCommentsAsync(taskId));
    }

    [Fact]
    public async Task AddAttachmentAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        var taskId = await CreateTaskInTenantAsync(otherTenantId);

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.AddAttachmentAsync(taskId, "a.pdf", "stored.pdf", 10));
    }
}
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

```bash
dotnet test test/Apya.Platform.Application.Tests --filter FullyQualifiedName~TaskAppService_Tenant_Tests
```

Beklenen: 3 test FAIL — beklenen `EntityNotFoundException` fırlatılmıyor.

- [ ] **Step 3: TaskAppService'e tenant doğrulaması ekle**

`TaskAppService.cs` içine private yardımcı ekle (`PopulateTagsAsync`'in hemen üstüne):

```csharp
        // Yorum/dosya entity'leri IMultiTenant DEĞİL (TaskComment: FullAuditedEntity,
        // TaskAttachment: CreationAuditedEntity) → üzerlerinde global tenant filtresi
        // YOK. TaskId ile doğrudan sorgulamak çapraz-tenant okuma açığı yaratıyordu.
        // TaskItem IMultiTenant olduğu için Repository.GetAsync filtreli çalışır:
        // başka tenant'ın görevi EntityNotFoundException verir.
        private async Task EnsureTaskInCurrentTenantAsync(Guid taskId)
        {
            await Repository.GetAsync(taskId);
        }
```

`AddAttachmentAsync` başına ekle:

```csharp
        public async Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize)
        {
            await EnsureTaskInCurrentTenantAsync(taskId);

            await _attachmentRepository.InsertAsync(new TaskAttachment
```

`GetAttachmentsAsync` başına ekle:

```csharp
        public async Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId)
        {
            await EnsureTaskInCurrentTenantAsync(taskId);

            var attachments = await _attachmentRepository.GetListAsync(x => x.TaskId == taskId);
```

`GetCommentsAsync` başına ekle:

```csharp
        public async Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId)
        {
            await EnsureTaskInCurrentTenantAsync(taskId);

            var comments = await _commentRepository.GetListAsync(x => x.TaskId == taskId);
```

- [ ] **Step 4: Controller'lara [Authorize] ekle**

`TaskAttachmentController.cs` — `using Microsoft.AspNetCore.Authorization;` ekle ve sınıfı işaretle:

```csharp
    [Authorize] // Projede global fallback authorization policy YOK → açıkça gerekli.
    [Route("api/tasks/attachments")]
    public class TaskAttachmentController : AbpController
```

`FileController.cs` — aynı şekilde:

```csharp
    [Authorize] // Yüklenen dosyalar kimlik doğrulamasız indirilebiliyordu.
    [Route("file")]
    public class FileController : AbpController
```

- [ ] **Step 5: Testlerin geçtiğini doğrula**

```bash
dotnet test test/Apya.Platform.Application.Tests --filter FullyQualifiedName~TaskAppService_Tenant_Tests
```

Beklenen: `Passed! - Failed: 0, Passed: 3`

- [ ] **Step 6: Tüm suite'in yeşil kaldığını doğrula**

```bash
dotnet test
```

Beklenen: tüm testler geçer (regresyon yok).

- [ ] **Step 7: Canlı doğrula**

Görev detayında dosya yükle → yükleniyor. Yüklenen dosyanın `/file/get/<guid>.pdf` bağlantısını **oturumsuz** (gizli pencere) aç → 401/302 login'e yönlendirme.

- [ ] **Step 8: Commit**

```bash
git add src/Apya.Platform.Application/Tasks/TaskAppService.cs src/Apya.Platform.HttpApi/Tasks/TaskAttachmentController.cs src/Apya.Platform.HttpApi/Controllers/FileController.cs test/Apya.Platform.Application.Tests/Tasks/TaskAppService_Tenant_Tests.cs
git commit -m "fix: gorev yorum/dosya uclarinda tenant izolasyonu ve eksik [Authorize]"
```

---

## Faz 1 Bitiş Kriterleri

- [ ] `npm test` — tüm frontend testleri yeşil
- [ ] `dotnet test` — tüm backend testleri yeşil
- [ ] `npm run build` ve `dotnet build Apya.Platform.slnx` hatasız
- [ ] **Bayrak kapalıyken davranış bugünküyle birebir aynı** (regresyon yok)
- [ ] Bayrak açıkken dört giriş noktasından da merkezi modal açılıyor
- [ ] `apya-kanban.js` diff'i **boş**
- [ ] `?task=<guid>` yenilemede modalı geri getiriyor; geri tuşu modalı kapatıyor
- [ ] <768px'te tam ekran, tek kolon
- [ ] Sil ⋯ menüsünde, yalnız yetkiliyse ve **gerçekten çalışıyor** ("SİL" onayıyla)
- [ ] Kırmızı "Gizli" yerine nötr "Sınırlı erişim"
- [ ] `EditModal.cshtml` ve `task-drawer.js` hâlâ depoda (Faz 9'da silinecek)

## Bilinen Eksikler (bilinçli, Faz 2'ye devrediliyor)

- Genel sekmesi ve düzenlenebilir alanlar yok → **Kaydet hep devre dışı**. Bu yüzden yeni modal bayrak arkasında, varsayılan kapalı.
- Kaydedilmemiş değişiklik diyaloğunda yalnız 2 seçenek var (Düzenlemeye devam et / Değişiklikleri iptal et). Üçüncü seçenek **"Kaydet ve çık"** Faz 2'de eklenecek — Faz 1'de kaydedilecek bir şey yok.
- Sekme navbarı, feature registry ve "+" menüsü Faz 3'te.
- Bildirim deep-link'i (`/Tasks/EditModal?id=`) hâlâ eski sayfaya gidiyor — Faz 5'te düzelecek.

## Geri Alma

Her task tek commit. Üç kademeli geri alma:

1. **En hafif — kod değişikliği yok:** bayrağı kapat. Kullanıcıda `localStorage.removeItem('apya.taskDetail.v2')`. Yeni modal devre dışı, eski drawer geri gelir.
2. **Yalnız yeni modalı kaldır:** Task 8'in commit'ini geri al. Task 1-7, 9, 10 bağımsız olarak faydalı kalır (test altyapısı, tailwind düzeltmeleri, güvenlik yamaları).
3. **Tümü:**

```bash
git revert --no-commit <task10-sha>..<task1-sha>^ && git commit -m "revert: gorev detay modali Faz 1"
```

⚠️ Task 10 (güvenlik) ve Task 9 (izin hatası) geri alınırsa açıklar geri gelir — 3. seçenekte bu ikisini hariç tut.

---

## Sonraki Fazlar (özet — ayrı planlar yazılacak)

| Faz | Kapsam |
|---|---|
| 2 | Genel sekmesi: 2 kolon grid, sağ Detaylar paneli, durum/öncelik/atanan/tarih/etiket, açıklama, validation, gerçek Kaydet + optimistic invalidation |
| 3 | Borderless ARIA navbar · `featureRegistry` · `React.lazy` · `+` picker (arama/kategori/izin/**"Yakında" rozeti**) · `ExtraProperties` persistence |
| 4 | Alt Görevler (checkbox UI) + Dosyalar + breadcrumb'lı iç içe açılış |
| 5 | `PageShell` + `/Tasks/Detail/{id:Guid}` Razor Page + bildirim deep-link düzeltmesi + "yeni sekmede aç" |
| 6 | Güncellemeler (yorum/thread/sayfalama/SignalR) + Aktiviteler |
| 7 | Geçmiş — ABP `IAuditLogRepository.GetEntityChangesAsync` projeksiyonu |
| 8 | Finans (`Tasks.Finance.*` izinleri, entity/VO, form, audit) |
| 9 | Eski drawer temizliği · `/Tasks/EditModal` → 301 · bundle analizi · a11y denetimi |
| **10** | **"Yakında" olarak işaretlenen 12 feature'ın backend'i** (kullanıcı kararı: bu iş biter bitmez ilk öncelik) |
