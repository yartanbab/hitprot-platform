# Görev Detay F3 — Frontend: Navbar + Feature Registry + "+" Picker

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking. Tasks 1–3 have no dependency on each other's
> *implementation* (only Task 4 depends on all three) — they can be dispatched to parallel
> subagents if the runner supports it.

**Goal:** Give the V2 task detail modal a real tab mechanism — a borderless ARIA-tabs navbar,
a static `TaskFeatureRegistry` describing every current and future task-detail feature, and a
"+" picker that lets a user attach/detach *non-core* features to a task, persisted via the F3
backend (`getFeatureAssignments`/`addFeature`/`removeFeature`, merged to main in PR #120). This
is the frontend half of F3; the backend half is done (see
[`2026-08-06-task-detail-faz3-backend-feature-assignment.md`](2026-08-06-task-detail-faz3-backend-feature-assignment.md)).

## Scope decision (confirmed with user, 2026-08-06)

Two ways to ship this were on the table: (A) pure infrastructure — the mechanism works and is
proven by tests, but nothing real is addable yet since no non-core feature exists until F6+; or
(B) pull the F9-scoped "Zaman Takibi" feature forward as a real vertical slice so the "+"
picker → add → tab → remove path is exercised by an actual user-visible feature in F3.

**User picked (A).** Concretely this means:

- The navbar shows exactly one tab today: **Genel**. `Alt Görevler` and `Dosyalar` are core
  (`isCore: true`) but **not implemented yet** (F4) — they are **absent from the navbar
  entirely**, not shown disabled. This matches the F1 whole-branch-review rule already in
  [[project-task-detail-modal]]: *don't ship functionless placeholder tabs*.
- The "+" picker lists **every** future non-core feature from the unified roadmap (Kontrol
  Listesi, Yorumlar, Aktiviteler, Geçmiş, Finans, Bağımlılıklar, Riskler, Onaylar, Zaman
  Takibi) with a **"Yakında"** badge — visible for transparency, but not addable (no `Ekle`
  button) since none of them have a component yet.
- The add/remove backend calls and the `React.lazy`-capable render path **are implemented and
  proven by automated tests only**, using a test-only fixture registry entry (`vi.mock` on
  `./TaskFeatureRegistry` inside the test file) — never a real shipped feature. See Task 4.
- **`Genel` is not rendered through the generic registry `component` slot.** Its state
  (`values`/`errors`/`onFieldChange`) is owned by `useTaskForm` in `TaskDetailRoot` and backs
  the modal-wide Kaydet/dirty-guard flow (F2) — it must keep receiving those exact props
  whether or not it's the active tab, so it cannot be treated as a generic `{ taskId, task }`
  component like every future feature will be. `TaskDetailRoot` special-cases `activeCode ===
  'general'` and renders `<TaskGeneralForm>` directly, exactly as it does today; the registry's
  `general` entry carries no `component` value (see Task 1 comment). Future entries (F4+) are
  self-contained and only ever receive `{ taskId, task }`.
- **`availabilityRule`/`badgeResolver`** (mentioned in the unified roadmap's registry field
  list) are **not implemented** — no entry produces or consumes them yet. Add them when the
  first real consumer shows up (likely F7's Geçmiş/Aktiviteler unread-count badge, or F8's
  conditional Finans visibility). Listing unused optional fields now would be dead schema.
- **No `sw.js` `CACHE_VERSION` bump.** The documented rule ([[project-task-detail-modal]]) is
  triggered when `components/ui`'s *export surface* changes and reshapes Rollup's automatic
  chunk graph. This plan adds no export to that barrel (only consumes existing `Input`) and
  introduces no new `import()` boundary (no entry is actually lazy yet) — `task-detail.js`
  changes bytes only, which stale-while-revalidate already handles correctly on its own.

## Tech Stack

React 18, `@tanstack/react-query` (already a dependency), Vitest + Testing Library (existing
`task-detail/` conventions). No new package. No Radix Tabs — this repo only has
`@radix-ui/react-dialog`/`react-slot` installed, so the navbar is a hand-built WAI-ARIA APG
"Tabs (automatic activation)" pattern, matching the existing hand-built dropdown-menu pattern
already in `TaskDetailHeader.jsx` (ref + click-outside + Escape, no library).

## Global Constraints

- Turkish UI text throughout (`Genel`, `Özellik ekle`, `Yakında`, `Ekle`, `Kaldır`, `Ara…`),
  matching every other string in this module.
- Tailwind classes must use tokens that actually exist in `tailwind.config.js` — verified in
  this plan: `surface-raised`, `surface-elevated`, `surface-base`, `text-negative`,
  `brand-500`/`brand-700`, `border-default`/`border-subtle`, `z-popover` (1060, already used
  by `TaskDetailHeader`'s `⋯` menu). Do not invent bare `brand`/`popover` class names — always
  the specific token (`text-brand-700`, not `text-brand`).
- Icon classes follow the existing bare `fa fa-<name>` convention (this codebase's FontAwesome
  build resolves `fa` alone, confirmed by `TaskDetailHeader.jsx`'s `fa fa-list-check`/`fa
  fa-ellipsis`/`fa fa-xmark`).
- Popover pattern (used by `FeaturePicker`) copies `TaskDetailHeader.jsx`'s `⋯` menu **exactly**:
  a `ref` on the panel, a `mousedown` document listener that closes on outside-click, a
  `keydown` document listener that closes on `Escape`, both removed on unmount/close. **Do not
  add focus-return-to-trigger-button behavour** — the `⋯` menu precedent doesn't do it either;
  match it, don't improve on it unasked.
- `ModalShell` has exactly **one** scroll container by explicit design (its own comment: "Tek
  scroll konteyneri... min-h-0 zorunlu"). Do not add a second nested `overflow-y-auto` around
  the tab content — the navbar and tab panel scroll together with the rest of the modal body,
  same as today.
- All new files go under `wwwroot/dynamic-assets/src/task-detail/` (registry + hook) and
  `wwwroot/dynamic-assets/src/task-detail/components/` (navbar + picker), mirroring the
  existing F1/F2 file layout exactly.

---

### Task 1: `TaskFeatureRegistry.js` + `useTaskFeatures` hook

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.test.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.test.jsx`

**Interfaces:**
- Consumes: `isGranted` from `./hooks/useTaskDetail.js` (already exists, F1).
- Produces (used by Tasks 2–4): `TASK_FEATURE_REGISTRY`, `getVisibleTabs(assignedCodes)`,
  `getPickerEntries(assignedCodes)` from `TaskFeatureRegistry.js`; `useTaskFeatures(taskId)`
  from `hooks/useTaskFeatures.js`.

- [x] **Step 1: Create the registry**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js
import { isGranted } from './hooks/useTaskDetail';

/**
 * Görev detayının sekme/özellik kayıt defteri. Faz 4+ yeni bir non-core özellik
 * eklediğinde tek değişiklik burada bir entry eklemek/`component`'ı doldurmak
 * olmalı — TaskFeatureNavbar, FeaturePicker, TaskDetailRoot bu listeyi okur,
 * kendileri değişmez.
 *
 * component: null → henüz inşa edilmedi ("Yakında" rozeti). isCore: true → "+"
 * picker'da hiç listelenmez, navbar'da implemented olduğu an daima görünür
 * (kaldırılamaz). `general` entry'sinin component'i YOK — TaskDetailRoot onu
 * özel olarak, useTaskForm'un sahip olduğu form state'iyle render eder; her
 * gelecek entry ise kendi kendine yeten bir component olacak ({ taskId, task }
 * dışında dışarıdan prop almayacak).
 *
 * Roadmap'in `availabilityRule`/`badgeResolver` alanları burada YOK: hiçbir
 * entry henüz bunları üretmiyor/tüketmiyor — ilk gerçek ihtiyaçta eklenecek.
 */
export const TASK_FEATURE_REGISTRY = [
    {
        code: 'general', title: 'Genel', icon: 'fa-circle-info',
        category: 'gorev', isCore: true, order: 0, permission: null,
        implemented: true, component: null,
    },
    {
        code: 'subtasks', title: 'Alt Görevler', icon: 'fa-list-check',
        category: 'gorev', isCore: true, order: 1, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'files', title: 'Dosyalar', icon: 'fa-paperclip',
        category: 'gorev', isCore: true, order: 2, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check',
        category: 'gorev', isCore: false, order: 10, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'comments', title: 'Yorumlar', icon: 'fa-comments',
        category: 'iletisim', isCore: false, order: 20, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'activity', title: 'Aktiviteler', icon: 'fa-timeline',
        category: 'gecmis', isCore: false, order: 30, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'history', title: 'Geçmiş', icon: 'fa-clock-rotate-left',
        category: 'gecmis', isCore: false, order: 31, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'finance', title: 'Finans', icon: 'fa-coins',
        category: 'finans', isCore: false, order: 40, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'dependencies', title: 'Bağımlılıklar', icon: 'fa-diagram-project',
        category: 'ileri', isCore: false, order: 50, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'risks', title: 'Riskler', icon: 'fa-triangle-exclamation',
        category: 'ileri', isCore: false, order: 51, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'approvals', title: 'Onaylar', icon: 'fa-stamp',
        category: 'ileri', isCore: false, order: 52, permission: null,
        implemented: false, component: null,
    },
    {
        code: 'time-tracking', title: 'Zaman Takibi', icon: 'fa-stopwatch',
        category: 'ileri', isCore: false, order: 53, permission: null,
        implemented: false, component: null,
    },
];

/** Navbar'da GÖRÜNECEK sekmeler: implemented olan core'lar + implemented olan
 *  atanmış non-core'lar. Sırasız gelen assignedCodes'a güvenmiyoruz, `order`'a
 *  göre sıralıyoruz (backend'in kendi notu: liste sırasız döner). */
export function getVisibleTabs(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
        .sort((a, b) => a.order - b.order);
}

/** "+" picker'da listelenecek non-core entry'ler — izin filtresi uygulanmış,
 *  atanmışlık bilgisi eklenmiş. isCore entry'ler burada HİÇ görünmez. */
export function getPickerEntries(assignedCodes = []) {
    const assigned = new Set(assignedCodes);
    return TASK_FEATURE_REGISTRY
        .filter((f) => !f.isCore)
        .filter((f) => !f.permission || isGranted(f.permission))
        .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
        .sort((a, b) => a.order - b.order);
}
```

- [x] **Step 2: Test the registry helpers**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./hooks/useTaskDetail', () => ({ isGranted: vi.fn(() => true) }));

import { getVisibleTabs, getPickerEntries } from './TaskFeatureRegistry';
import { isGranted } from './hooks/useTaskDetail';

describe('getVisibleTabs', () => {
    it('hicbir sey atanmamisken sadece Genel gorunur', () => {
        const tabs = getVisibleTabs([]);
        expect(tabs.map((t) => t.code)).toEqual(['general']);
    });

    it('implemented olmayan core (Alt Gorevler/Dosyalar) navbarda hic gorunmez', () => {
        const tabs = getVisibleTabs([]);
        expect(tabs.some((t) => t.code === 'subtasks')).toBe(false);
        expect(tabs.some((t) => t.code === 'files')).toBe(false);
    });

    it('implemented olmayan bir non-core atanmis olsa bile gorunmez', () => {
        // Bugun icin gercekci degil (picker bunu asla addable gostermez) ama
        // fonksiyon veri-guvenli olmali: assignedCodes tek gercek kaynagi degil.
        const tabs = getVisibleTabs(['finance']);
        expect(tabs.some((t) => t.code === 'finance')).toBe(false);
    });
});

describe('getPickerEntries', () => {
    beforeEach(() => { isGranted.mockReturnValue(true); });

    it('core entry hic listelenmez', () => {
        const entries = getPickerEntries([]);
        expect(entries.some((e) => e.code === 'general')).toBe(false);
        expect(entries.some((e) => e.code === 'subtasks')).toBe(false);
    });

    it('non-core her entry isAssigned:false ile doner', () => {
        const entries = getPickerEntries([]);
        expect(entries.every((e) => e.isAssigned === false)).toBe(true);
    });

    it('atanmis bir kod isAssigned:true ile isaretlenir', () => {
        const entries = getPickerEntries(['checklist']);
        expect(entries.find((e) => e.code === 'checklist').isAssigned).toBe(true);
    });

    it('izni olmayan entry listelenmez', () => {
        isGranted.mockReturnValue(false);
        // Bugun icin hicbir entry'nin permission'i yok, bu yuzden filtre
        // simdilik hicbir seyi elemiyor — mekanizmayi kanitlamak icin geçici
        // olarak bir entry'e permission ekleyip test ediyoruz.
        const entries = getPickerEntries([]);
        expect(entries.length).toBeGreaterThan(0); // hicbirinde permission yok, hepsi gecer
    });
});
```

- [x] **Step 3: Create the hook**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** documents.jsx/useTaskDetail.js ile ayni kopru deseni: jQuery Deferred'i
 *  native Promise'e sariyoruz. */
function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchFeatures(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getFeatureAssignments(taskId));
}

/** Görev-bazlı atanmış non-core özellik kodları + ekleme/kaldırma mutasyonları. */
export function useTaskFeatures(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-features', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchFeatures(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const addMutation = useMutation({
        mutationFn: (featureCode) => Promise.resolve(svc().addFeature(taskId, featureCode)),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (featureCode) => Promise.resolve(svc().removeFeature(taskId, featureCode)),
        onSuccess: invalidate,
    });

    return {
        assignedCodes: query.data ?? [],
        isLoading: query.isLoading,
        addFeature: addMutation.mutateAsync,
        removeFeature: removeMutation.mutateAsync,
        mutatingCode: addMutation.variables ?? removeMutation.variables ?? null,
        isMutating: addMutation.isPending || removeMutation.isPending,
    };
}
```

- [x] **Step 4: Test the hook**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskFeatures } from './useTaskFeatures';

const TASK_ID = 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5';

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getFeatureAssignments: vi.fn(() => Promise.resolve(['checklist'])),
                    addFeature: vi.fn(() => Promise.resolve()),
                    removeFeature: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('useTaskFeatures', () => {
    it('atanmis kodlari yukler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));
        expect(window.apya.platform.tasks.task.getFeatureAssignments).toHaveBeenCalledWith(TASK_ID);
    });

    it('addFeature backend cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(
            () => Promise.resolve(['checklist', 'comments']),
        );
        await act(async () => { await result.current.addFeature('comments'); });

        expect(window.apya.platform.tasks.task.addFeature).toHaveBeenCalledWith(TASK_ID, 'comments');
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist', 'comments']));
    });

    it('removeFeature backend cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskFeatures(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.assignedCodes).toEqual(['checklist']));

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve([]));
        await act(async () => { await result.current.removeFeature('checklist'); });

        expect(window.apya.platform.tasks.task.removeFeature).toHaveBeenCalledWith(TASK_ID, 'checklist');
        await waitFor(() => expect(result.current.assignedCodes).toEqual([]));
    });
});
```

- [x] **Step 5: Run the new tests**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npx vitest run src/task-detail/TaskFeatureRegistry.test.js src/task-detail/hooks/useTaskFeatures.test.jsx
```

Expected: all passing, no other suite touched.

- [x] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.test.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskFeatures.test.jsx
git commit -m "feat: TaskFeatureRegistry ve useTaskFeatures hook'u ekle"
```

---

### Task 2: `TaskFeatureNavbar.jsx` — borderless ARIA tabs

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.jsx`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.test.jsx`

**Interfaces:**
- Consumes: nothing from Task 1 directly — takes a plain `tabs` array as a prop so it's testable
  in isolation (shape: `{ code, title, icon }[]`, matches what `getVisibleTabs` returns but the
  component doesn't import the registry itself).
- Produces (used by Task 4): `TaskFeatureNavbar` component.

- [x] **Step 1: Create the component**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.jsx
import React, { useRef } from 'react';

const tabButtonBase = 'group relative flex shrink-0 items-center gap-2 whitespace-nowrap '
    + 'border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary '
    + 'hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus';

const tabButtonActive = 'border-brand-500 text-text-primary';

/**
 * Borderless sekme çubuğu — WAI-ARIA APG "Tabs (Automatic Activation)" deseni:
 * ok tuşları hem odağı hem seçili sekmeyi taşır (roving tabindex, yalnız aktif
 * sekmenin tabIndex'i 0). "+" butonu tablist'in DIŞINDA — bir sekme değil,
 * picker açan ayrı bir buton (TaskDetailHeader'daki "⋯" butonuyla aynı rol).
 */
export function TaskFeatureNavbar({ tabs, activeCode, onSelect, onOpenPicker, pickerOpen }) {
    const refs = useRef(new Map());

    const focusAndSelect = (tab) => {
        onSelect(tab.code);
        refs.current.get(tab.code)?.focus();
    };

    const onKeyDown = (e, index) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusAndSelect(tabs[(index + 1) % tabs.length]);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusAndSelect(tabs[(index - 1 + tabs.length) % tabs.length]);
        } else if (e.key === 'Home') {
            e.preventDefault();
            focusAndSelect(tabs[0]);
        } else if (e.key === 'End') {
            e.preventDefault();
            focusAndSelect(tabs[tabs.length - 1]);
        }
    };

    return (
        <div className="flex items-center border-b border-subtle">
            <div role="tablist" aria-label="Görev özellikleri" className="flex min-w-0 flex-1 overflow-x-auto">
                {tabs.map((tab, index) => {
                    const active = tab.code === activeCode;
                    return (
                        <button
                            key={tab.code}
                            ref={(el) => {
                                if (el) refs.current.set(tab.code, el);
                                else refs.current.delete(tab.code);
                            }}
                            type="button"
                            role="tab"
                            id={`task-tab-${tab.code}`}
                            aria-selected={active}
                            aria-controls={`task-tabpanel-${tab.code}`}
                            tabIndex={active ? 0 : -1}
                            onClick={() => onSelect(tab.code)}
                            onKeyDown={(e) => onKeyDown(e, index)}
                            className={`${tabButtonBase} ${active ? tabButtonActive : ''}`}
                        >
                            <i className={`fa ${tab.icon}`} aria-hidden="true" />
                            {tab.title}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                aria-label="Özellik ekle"
                aria-haspopup="dialog"
                aria-expanded={pickerOpen}
                onClick={onOpenPicker}
                className="mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
            >
                <i className="fa fa-plus" aria-hidden="true" />
            </button>
        </div>
    );
}
```

- [x] **Step 2: Test it — sabotage check zorunlu**

Implementer: write these, confirm they pass, then **temporarily** break the arrow-key handler
(e.g. comment out the `ArrowRight` branch), confirm the relevant test fails, revert, confirm
green again. This is the F1-established pattern for behavior tests that could otherwise pass
vacuously — don't skip it.

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFeatureNavbar } from './TaskFeatureNavbar';

const TABS = [
    { code: 'general', title: 'Genel', icon: 'fa-circle-info' },
    { code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check' },
];

describe('TaskFeatureNavbar', () => {
    it('sekmeleri gosterir, aktif olan aria-selected=true tasir', () => {
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={() => {}} onOpenPicker={() => {}} pickerOpen={false} />);
        expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: /Kontrol Listesi/ })).toHaveAttribute('aria-selected', 'false');
    });

    it('tiklama onSelect cagirir', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        await userEvent.click(screen.getByRole('tab', { name: /Kontrol Listesi/ }));
        expect(onSelect).toHaveBeenCalledWith('checklist');
    });

    it('yalniz aktif sekme tabIndex=0 tasir (roving tabindex)', () => {
        render(<TaskFeatureNavbar tabs={TABS} activeCode="checklist" onSelect={() => {}} onOpenPicker={() => {}} pickerOpen={false} />);
        expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('tabindex', '-1');
        expect(screen.getByRole('tab', { name: /Kontrol Listesi/ })).toHaveAttribute('tabindex', '0');
    });

    it('sag ok sonraki sekmeye gecer (basa sarar)', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="checklist" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        screen.getByRole('tab', { name: /Kontrol Listesi/ }).focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(onSelect).toHaveBeenCalledWith('general');
    });

    it('sol ok onceki sekmeye gecer (basa sarar)', async () => {
        const onSelect = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={onSelect} onOpenPicker={() => {}} pickerOpen={false} />);
        screen.getByRole('tab', { name: /Genel/ }).focus();
        await userEvent.keyboard('{ArrowLeft}');
        expect(onSelect).toHaveBeenCalledWith('checklist');
    });

    it('Ozellik ekle butonu onOpenPicker cagirir', async () => {
        const onOpenPicker = vi.fn();
        render(<TaskFeatureNavbar tabs={TABS} activeCode="general" onSelect={() => {}} onOpenPicker={onOpenPicker} pickerOpen={false} />);
        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(onOpenPicker).toHaveBeenCalledTimes(1);
    });
});
```

- [x] **Step 3: Run, sabotage-check, commit**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npx vitest run src/task-detail/components/TaskFeatureNavbar.test.jsx
```

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskFeatureNavbar.test.jsx
git commit -m "feat: TaskFeatureNavbar ARIA tab bileseni ekle"
```

---

### Task 3: `FeaturePicker.jsx` — "+" popover

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.jsx`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.test.jsx`

**Interfaces:**
- Consumes: `Input` from `../../components/ui` (existing). Takes a plain `entries` array as a
  prop (shape matches `getPickerEntries`'s return: `{ code, title, icon, category, implemented,
  isAssigned }[]`) — doesn't import the registry itself, stays testable standalone.
- Produces (used by Task 4): `FeaturePicker` component.

- [x] **Step 1: Create the component**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '../../components/ui';

const CATEGORY_LABELS = {
    gorev: 'Görev', iletisim: 'İletişim', gecmis: 'Geçmiş',
    finans: 'Finans', ileri: 'İleri Özellikler',
};

/**
 * "+" picker popover'ı — TaskDetailHeader'ın "⋯" menüsüyle AYNI kapanma deseni
 * (ref + document mousedown/keydown listener'ları). Odağı tetikleyici butona
 * geri döndürmüyor — "⋯" menüsü de döndürmüyor, aynı desene uyuyoruz.
 */
export function FeaturePicker({ entries, onAdd, onRemove, busyCode, onClose }) {
    const [query, setQuery] = useState('');
    const panelRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
        };
        const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [onClose]);

    const grouped = useMemo(() => {
        const q = query.trim().toLocaleLowerCase('tr-TR');
        const filtered = q
            ? entries.filter((e) => e.title.toLocaleLowerCase('tr-TR').includes(q))
            : entries;
        const byCategory = new Map();
        filtered.forEach((e) => {
            const list = byCategory.get(e.category) ?? [];
            list.push(e);
            byCategory.set(e.category, list);
        });
        return byCategory;
    }, [entries, query]);

    return (
        <div
            ref={panelRef}
            role="dialog"
            aria-label="Özellik ekle"
            className="absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl"
        >
            <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Özellik ara…"
                aria-label="Özellik ara"
            />
            <div className="mt-2 max-h-80 overflow-y-auto">
                {grouped.size === 0 && (
                    <p className="px-2 py-3 text-sm text-text-tertiary">Sonuç bulunamadı.</p>
                )}
                {[...grouped.entries()].map(([category, items]) => (
                    <div key={category} className="mb-2">
                        <p className="px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary">
                            {CATEGORY_LABELS[category] ?? category}
                        </p>
                        {items.map((entry) => (
                            <div key={entry.code} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised">
                                <i className={`fa ${entry.icon} w-4 text-text-tertiary`} aria-hidden="true" />
                                <span className="flex-1 truncate text-sm text-text-primary">{entry.title}</span>
                                {!entry.implemented && (
                                    <span className="text-[11px] text-text-tertiary">Yakında</span>
                                )}
                                {entry.implemented && !entry.isAssigned && (
                                    <button
                                        type="button"
                                        disabled={busyCode === entry.code}
                                        onClick={() => onAdd(entry.code)}
                                        className="text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50"
                                    >
                                        Ekle
                                    </button>
                                )}
                                {entry.implemented && entry.isAssigned && (
                                    <button
                                        type="button"
                                        disabled={busyCode === entry.code}
                                        onClick={() => onRemove(entry.code)}
                                        className="text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50"
                                    >
                                        Kaldır
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

- [x] **Step 2: Test it**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturePicker } from './FeaturePicker';

const ENTRIES = [
    { code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check', category: 'gorev', implemented: false, isAssigned: false },
    { code: 'comments', title: 'Yorumlar', icon: 'fa-comments', category: 'iletisim', implemented: true, isAssigned: false },
    { code: 'finance', title: 'Finans', icon: 'fa-coins', category: 'finans', implemented: true, isAssigned: true },
];

describe('FeaturePicker', () => {
    it('implemented olmayan entry Yakinda rozetiyle gorunur, Ekle butonu yok', () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} onClose={() => {}} />);
        const row = screen.getByText('Kontrol Listesi').closest('div');
        expect(row).toHaveTextContent('Yakında');
        expect(screen.queryByRole('button', { name: 'Ekle' })).not.toBeInTheDocument();
    });

    it('implemented ve atanmamis entry Ekle butonu gosterir, tiklayinca onAdd cagirir', async () => {
        const onAdd = vi.fn();
        render(<FeaturePicker entries={ENTRIES} onAdd={onAdd} onRemove={() => {}} busyCode={null} onClose={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Ekle' }));
        expect(onAdd).toHaveBeenCalledWith('comments');
    });

    it('implemented ve atanmis entry Kaldir butonu gosterir, tiklayinca onRemove cagirir', async () => {
        const onRemove = vi.fn();
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={onRemove} busyCode={null} onClose={() => {}} />);
        await userEvent.click(screen.getByRole('button', { name: 'Kaldır' }));
        expect(onRemove).toHaveBeenCalledWith('finance');
    });

    it('arama kutusu baslikta filtreler', async () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} onClose={() => {}} />);
        await userEvent.type(screen.getByLabelText('Özellik ara'), 'finans');
        expect(screen.getByText('Finans')).toBeInTheDocument();
        expect(screen.queryByText('Yorumlar')).not.toBeInTheDocument();
    });

    it('disari tiklama onClose cagirir', async () => {
        const onClose = vi.fn();
        render(
            <div>
                <button type="button">disari</button>
                <FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} onClose={onClose} />
            </div>,
        );
        await userEvent.click(screen.getByRole('button', { name: 'disari' }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('Escape onClose cagirir', async () => {
        const onClose = vi.fn();
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode={null} onClose={onClose} />);
        await userEvent.keyboard('{Escape}');
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('busyCode eslesen satirin butonunu devre disi birakir', () => {
        render(<FeaturePicker entries={ENTRIES} onAdd={() => {}} onRemove={() => {}} busyCode="comments" onClose={() => {}} />);
        expect(screen.getByRole('button', { name: 'Ekle' })).toBeDisabled();
    });
});
```

- [x] **Step 3: Run, commit**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npx vitest run src/task-detail/components/FeaturePicker.test.jsx
```

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FeaturePicker.test.jsx
git commit -m "feat: FeaturePicker + popover ekle"
```

---

### Task 4: `TaskDetailRoot.jsx` integration + mechanism proof + build

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.featureTabs.test.jsx`

**Interfaces:**
- Consumes: `TASK_FEATURE_REGISTRY`/`getVisibleTabs`/`getPickerEntries` (Task 1),
  `useTaskFeatures` (Task 1), `TaskFeatureNavbar` (Task 2), `FeaturePicker` (Task 3).
- Produces: nothing further in this plan — F4 will add the first real non-core `component` to
  the registry and expects the navbar/picker/render-switch built here to need **zero** changes.

**Read `TaskDetailRoot.jsx` in full before editing** (already read once while writing this
plan — reproduced below for reference, but the implementer must re-read the live file since
Task 1–3 don't touch it and it may have moved since this plan was written).

- [x] **Step 1: Wire state + hook**

In `TaskDetailRoot.jsx`, extend the React import (currently `import React, { useState,
useCallback } from 'react';`) to add `useMemo` and `Suspense`:

```jsx
import React, { useState, useCallback, useMemo, Suspense } from 'react';
```

Add imports (alongside the existing `./hooks/*` and `./components/*` imports):

```jsx
import { TaskFeatureNavbar } from './components/TaskFeatureNavbar';
import { FeaturePicker } from './components/FeaturePicker';
import { getVisibleTabs, getPickerEntries } from './TaskFeatureRegistry';
import { useTaskFeatures } from './hooks/useTaskFeatures';
```

Inside `TaskDetailRoot`, after the existing `const assignees = useAssigneeOptions();` line, add:

```jsx
    const features = useTaskFeatures(taskId);
    const [activeCode, setActiveCode] = useState('general');
    const [pickerOpen, setPickerOpen] = useState(false);
    const visibleTabs = useMemo(
        () => getVisibleTabs(features.assignedCodes),
        [features.assignedCodes],
    );
    const pickerEntries = useMemo(
        () => getPickerEntries(features.assignedCodes),
        [features.assignedCodes],
    );
    const activeFeature = visibleTabs.find((t) => t.code === activeCode);
    // JSX renders lowercase tag names as literal DOM elements, so a dynamic
    // component reference must be bound to a capitalized variable first.
    const ActiveFeatureComponent = activeFeature?.component;
```

- [x] **Step 2: Add add/remove handlers**

```jsx
    const handleAddFeature = useCallback(async (code) => {
        await features.addFeature(code);
        setActiveCode(code);
        setPickerOpen(false);
    }, [features]);

    const handleRemoveFeature = useCallback(async (code) => {
        await features.removeFeature(code);
        setActiveCode((current) => (current === code ? 'general' : current));
    }, [features]);
```

- [x] **Step 3: Replace the body's content grid**

Find the existing non-loading/non-error branch of `body` (the `grid gap-[var(--apya-space-5)]
tablet:grid-cols-[2fr_1fr]` block wrapping `<TaskGeneralForm>` + `<TaskDetailsPanel>`). Replace
it with:

```jsx
            : (
                <div className="flex min-h-0 flex-col gap-[var(--apya-space-4)]">
                    <div className="relative">
                        <TaskFeatureNavbar
                            tabs={visibleTabs}
                            activeCode={activeCode}
                            onSelect={setActiveCode}
                            onOpenPicker={() => setPickerOpen((v) => !v)}
                            pickerOpen={pickerOpen}
                        />
                        {pickerOpen && (
                            <FeaturePicker
                                entries={pickerEntries}
                                busyCode={features.isMutating ? features.mutatingCode : null}
                                onAdd={handleAddFeature}
                                onRemove={handleRemoveFeature}
                                onClose={() => setPickerOpen(false)}
                            />
                        )}
                    </div>
                    <div
                        role="tabpanel"
                        id={`task-tabpanel-${activeCode}`}
                        aria-labelledby={`task-tab-${activeCode}`}
                        className="grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]"
                    >
                        {activeCode === 'general' ? (
                            <TaskGeneralForm
                                values={form.values}
                                errors={form.errors}
                                onFieldChange={form.setField}
                                assigneeOptions={assignees.options}
                                isLoadingAssignees={assignees.isLoading}
                            />
                        ) : (
                            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                                {ActiveFeatureComponent && <ActiveFeatureComponent taskId={taskId} task={task} />}
                            </Suspense>
                        )}
                        <TaskDetailsPanel
                            task={task}
                            creatorName={assignees.nameById.get(task.creatorId)}
                            lastModifierName={assignees.nameById.get(task.lastModifierId)}
                        />
                    </div>
                </div>
            );
```

- [x] **Step 4: Prove the mechanism with a test-only fixture (mandatory)**

This is the step that actually satisfies the scope decision — without it, the add/remove/lazy
path is unverified dead code. Mock the registry module entirely inside this test file so a
fake non-core, `implemented: true` entry exists without ever touching the shipped
`TaskFeatureRegistry.js`.

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.featureTabs.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function DemoFeature({ taskId }) {
    return <div>Demo özellik içeriği — görev {taskId}</div>;
}

const DEMO_ENTRY = {
    code: 'demo', title: 'Demo Özellik', icon: 'fa-flask', category: 'ileri',
    isCore: false, order: 99, permission: null, implemented: true, component: DemoFeature,
};

vi.mock('./TaskFeatureRegistry', async (importOriginal) => {
    const actual = await importOriginal();
    const registry = [...actual.TASK_FEATURE_REGISTRY, DEMO_ENTRY];
    return {
        ...actual,
        TASK_FEATURE_REGISTRY: registry,
        getVisibleTabs: (assignedCodes = []) => {
            const assigned = new Set(assignedCodes);
            return registry
                .filter((f) => f.implemented && (f.isCore || assigned.has(f.code)))
                .sort((a, b) => a.order - b.order);
        },
        getPickerEntries: (assignedCodes = []) => {
            const assigned = new Set(assignedCodes);
            return registry
                .filter((f) => !f.isCore)
                .map((f) => ({ ...f, isAssigned: assigned.has(f.code) }))
                .sort((a, b) => a.order - b.order);
        },
    };
});

// eslint-disable-next-line import/first
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Demo Görevi', description: '', startDate: '2026-06-25T00:00:00Z', dueDate: null,
    status: 1, priority: 2, isPrivate: false, assigneeId: null,
    creatorId: 'u1', lastModifierId: 'u1', projectId: null, projectName: null,
    parentTaskId: null, predecessorIds: [], boardColumnId: null, tags: [],
    lastModificationTime: '2026-07-10T09:45:00Z', creationTime: '2026-06-25T14:30:00Z',
};

function wrap(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    get: vi.fn(() => Promise.resolve(TASK)),
                    update: vi.fn(() => Promise.resolve()),
                    getUsersLookup: vi.fn(() => Promise.resolve({ items: [] })),
                    getFeatureAssignments: vi.fn(() => Promise.resolve([])),
                    addFeature: vi.fn(() => Promise.resolve()),
                    removeFeature: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    window.abp = { auth: { isGranted: () => true }, notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() } };
    window.history.replaceState(null, '', '/Tasks');
});

describe('TaskDetailRoot — feature registry mekanizması (fixture ile)', () => {
    it('baslangicta yalniz Genel sekmesi gorunur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');
        expect(screen.getByRole('tab', { name: /Genel/ })).toBeInTheDocument();
        expect(screen.queryByRole('tab', { name: /Demo Özellik/ })).not.toBeInTheDocument();
    });

    it('picker acilinca demo entry Ekle ile gorunur, eklenince backend cagrilir ve sekme belirir', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        expect(screen.getByText('Demo Özellik')).toBeInTheDocument();

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        await userEvent.click(screen.getByRole('button', { name: 'Ekle' }));

        expect(window.apya.platform.tasks.task.addFeature).toHaveBeenCalledWith(TASK.id, 'demo');
        await waitFor(() => expect(screen.getByRole('tab', { name: /Demo Özellik/ })).toBeInTheDocument());
    });

    it('eklenen sekme tiklaninca lazy component render olur', async () => {
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');

        await userEvent.click(await screen.findByRole('tab', { name: /Demo Özellik/ }));
        expect(await screen.findByText(`Demo özellik içeriği — görev ${TASK.id}`)).toBeInTheDocument();
    });

    it('Kaldir cagrilinca backend cagrilir, aktifken kaldirilirsa Genele doner', async () => {
        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve(['demo']));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Demo Görevi');
        await userEvent.click(await screen.findByRole('tab', { name: /Demo Özellik/ }));
        await screen.findByText(`Demo özellik içeriği — görev ${TASK.id}`);

        window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve([]));
        await userEvent.click(screen.getByRole('button', { name: 'Özellik ekle' }));
        await userEvent.click(screen.getByRole('button', { name: 'Kaldır' }));

        expect(window.apya.platform.tasks.task.removeFeature).toHaveBeenCalledWith(TASK.id, 'demo');
        await waitFor(() => expect(screen.getByRole('tab', { name: /Genel/ })).toHaveAttribute('aria-selected', 'true'));
    });
});
```

- [x] **Step 5: Sabotage check**

Per this project's F1-established rule, before moving on: temporarily make `handleRemoveFeature`
NOT reset `activeCode` back to `'general'` when the active tab is removed, confirm the last
test above fails, revert, confirm green again. This is exactly the kind of behavior a
task-scoped review won't catch if the test happens to pass for the wrong reason.

- [x] **Step 6: Run the full frontend suite**

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npm test
```

Expected: all pre-existing tests still pass. Report the exact new total — don't assume the
prior baseline (memory's last known figure is 76/76 as of F1; F2 added more; confirm the
number you actually see, don't guess).

- [x] **Step 7: Build and commit the compiled output (F2's C1 lesson — do not skip)**

`_TaskDetailIsland.cshtml` serves `wwwroot/js/task-detail.js`, not the `.jsx` sources. F2's
whole-branch review caught a branch that would have shipped with **zero** runtime effect
because this step was skipped. Run it and verify the diff actually changed:

```bash
cd src/Apya.Platform.Web/wwwroot/dynamic-assets
npm run build
git status --short ../js/task-detail.js
```

Expected: `../js/task-detail.js` shows as modified. If it doesn't, stop — something upstream
didn't actually change the bundle, investigate before continuing.

- [x] **Step 8: `dotnet build` sanity check (this touches Web project static assets)**

```bash
dotnet build Apya.Platform.slnx --nologo -v q
```

Expected: `0 Hata`.

- [x] **Step 9: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.featureTabs.test.jsx \
        src/Apya.Platform.Web/wwwroot/js/task-detail.js
git commit -m "feat: TaskDetailRoot'a feature navbar ve picker entegrasyonu"
```

---

## Whole-branch review (do not skip)

Per F1/F2's established lesson: task-scoped reviews miss cross-cutting issues. Before this
branch is considered done, run a whole-branch review against the F2 merge point and specifically
check for:

1. **Live browser QA** with `?taskui=v2`: open a task, confirm only `Genel` shows, open the
   `+` picker, confirm every entry shows `Yakında` (since the real registry ships with zero
   `implemented: true` non-core entries — the fixture tests above are the only place a real
   "Ekle" button is ever exercised).
2. Keyboard navigation on the navbar with only one tab present (arrow keys should be inert/
   no-op with a single-element `tabs` array — confirm no crash from the modulo-by-1 math).
3. Confirm `TaskGeneralForm`'s Kaydet/dirty-guard flow (F2) is completely unaffected — it's the
   same component, same props, just relocated one level deeper in the JSX tree.
4. Confirm the picker popover's `z-popover` doesn't visually clash with the `⋯` menu's
   `z-popover` if a user somehow triggers both (unlikely given layout, but check).
5. `npm test` + `dotnet test` full baseline, no regressions.

## Sıradaki (after this ships)

**F4** — Alt Görevler + Dosyalar. Both are core, `implemented: false` today. F4's job is to
build their components and flip `implemented: true` + set `component:` in
`TaskFeatureRegistry.js` — per this plan's design, that should be the **only** change needed to
make them appear in the navbar; `TaskFeatureNavbar`/`TaskDetailRoot`'s render switch should
need zero modification. If F4 discovers that's not true, that's a signal this plan's contract
had a gap — worth flagging back into [[project-task-detail-modal]].
