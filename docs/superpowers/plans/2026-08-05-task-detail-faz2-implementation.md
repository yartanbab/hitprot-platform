# Görev Detay F2 — Genel Sekmesi ve Gerçek Kaydet Akışı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `"Genel sekmesi Faz 2'de eklenecek."` placeholder in the V2 task-detail
modal with a real, editable general-info form wired to a working Save flow, then flip the
`apya.taskDetail.v2` flag to default-on.

**Architecture:** Two new pure/presentational units (`useTaskForm` + `useAssigneeOptions`
hooks, `TaskGeneralForm` + `TaskDetailsPanel` components) feed into `TaskDetailRoot.jsx`,
which already has the dirty-guard, footer, and modal-shell wiring from Faz 1 — this plan only
fills the body and connects `onSave`.

**Tech Stack:** React 18, TanStack Query v5 (already used for the read path), existing
`components/ui` kit (`Input`, `Combobox`, `Badge`, `Button`), Vitest + React Testing Library.
No new npm dependency.

**Scope reference:** `docs/superpowers/plans/2026-08-05-task-detail-faz2-genel-sekmesi.md`
(analysis) and `docs/superpowers/plans/2026-08-05-task-detail-BIRLESIK-YOL-HARITASI.md`
(roadmap, F2 row) — this file is the executable breakdown of both.

## Global Constraints

- Backend `CreateUpdateTaskDto` fields (exact, `src/Apya.Platform.Application.Contracts/Tasks/CreateUpdateTaskDto.cs`): `title` (required, max 200), `description` (nullable string), `startDate` (required, date), `dueDate` (nullable date), `status` (int enum), `boardColumnId` (nullable guid — NOT edited by this plan, pass through from the loaded task), `priority` (int enum), `projectId` (nullable guid — NOT edited, pass through), `assigneeId` (nullable guid), `parentTaskId` (nullable guid — NOT edited, pass through), `isPrivate` (bool — NOT edited, pass through), `predecessorIds` (guid array — NOT edited, pass through), `tagNames` (nullable string array).
- Backend `TaskDto` fields relevant here (`src/Apya.Platform.Application.Contracts/Tasks/TaskDto.cs` + inherited `AuditedEntityDto<Guid>`): `id`, `title`, `description`, `startDate`, `dueDate`, `status`, `priority`, `assigneeId`, `assigneeName`, `projectId`, `projectName`, `isPrivate`, `tags` (array of `{id, name}`), `creationTime`, `creatorId`, `lastModificationTime`, `lastModifierId`. **No `creatorName`/`lastModifierName` field exists** — resolve client-side against the users-lookup list (§ Task 1).
- `TaskStatus` enum values (`src/Apya.Platform.Domain.Shared/Projects/Task/TaskEnums.cs`): `0=Cancelled, 1=Todo, 2=InProgress, 3=InReview, 4=Done`.
- `TaskPriority` enum values: `1=Low, 2=Medium, 3=High, 4=Critical`.
- Display labels for these enums (Turkish) already exist inline in `TaskDetailHeader.jsx` as `STATUS`/`PRIORITY` maps — Task 2 extracts them to a shared file so this plan does not duplicate the strings.
- ABP dynamic proxy call pattern (established in `useTaskDetail.js`, `TaskDetailRoot.jsx`): `window.apya.platform.tasks.task.<methodName>(...)` returns a jQuery Deferred — always wrap in `Promise.resolve(...)`. Method names are the C# method name camelCased with the `Async` suffix dropped (confirmed against existing calls: `GetUsersLookupAsync` → `getUsersLookup`, `UpdateCommentAsync` → `updateComment`). The inherited `ICrudAppService.UpdateAsync(id, dto)` → `.update(id, dto)`.
- Test stack: Vitest + `@testing-library/react` + `@testing-library/user-event`, behavioral assertions only — **no `.toMatchSnapshot()`**. Mock `window.apya`/`window.abp` per test file's `beforeEach`, matching the existing pattern in `TaskDetailRoot.test.jsx`.
- Styling: Tailwind utility classes + `var(--apya-space-*)`/`var(--apya-radius-*)` tokens, matching the exact style already used in `TaskDetailHeader.jsx`/`TaskDetailFooter.jsx`. No new CSS files. No `t()` i18n wrapper — this feature area uses hardcoded Turkish strings (matches existing task-detail files).
- File placement: new hooks in `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/`, new components in `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/`, shared enum-display maps in `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/statusMaps.js`.
- Do not touch: `useDirtyGuard.js`, `useTaskUrlSync.js`, `ModalShell.jsx`, `taskDetailStore.js`, `AccessBadge.jsx` — all already correct for this task, per the analysis in `2026-08-05-task-detail-faz2-genel-sekmesi.md`.
- Do not add: file/comment/subtask UI, navbar/tabs, embedded-page presentation mode, `Code`/favorite fields — all out of this plan's scope (see roadmap).

---

### Task 1: `useTaskForm` and `useAssigneeOptions` hooks

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.js`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.test.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.js`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.test.js`

**Interfaces:**
- Consumes: nothing from other tasks. `useAssigneeOptions` calls `window.apya.platform.tasks.task.getUsersLookup()` (existing backend method, see Global Constraints).
- Produces (used by Task 2 and Task 3):
  - `useTaskForm(task)` → `{ values: {title, description, startDate, dueDate, status, priority, assigneeId, tagNames}, setField(name, value), isDirty: boolean, errors: {title?, dueDate?}, validate(): boolean, toUpdateDto(): CreateUpdateTaskDto-shaped object, reset(): void }`. `task` may be `undefined` (loading state) — must not throw.
  - `useAssigneeOptions()` → `{ options: [{value, label}], nameById: Map<string,string>, isLoading: boolean }`.

- [ ] **Step 1: Write the failing tests for `useTaskForm`**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.test.js
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskForm } from './useTaskForm';

const TASK = {
    id: 't1',
    title: 'Otel Konaklama Anlaşması',
    description: 'Önce medine sonra mekke',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 4,
    priority: 4,
    assigneeId: 'u1',
    tags: [{ id: 'g1', name: 'Konaklama' }, { id: 'g2', name: 'Anlaşma' }],
    isPrivate: true,
    projectId: 'p1',
    parentTaskId: null,
    predecessorIds: [],
};

describe('useTaskForm', () => {
    it('başlangıç değerlerini task\'tan türetir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        expect(result.current.values.title).toBe('Otel Konaklama Anlaşması');
        expect(result.current.values.startDate).toBe('2026-06-25');
        expect(result.current.values.dueDate).toBe('2026-07-10');
        expect(result.current.values.tagNames).toEqual(['Konaklama', 'Anlaşma']);
        expect(result.current.isDirty).toBe(false);
    });

    it('task yokken (yükleniyor) çökmez, boş değerler döner', () => {
        const { result } = renderHook(() => useTaskForm(undefined));
        expect(result.current.values.title).toBe('');
        expect(result.current.values.tagNames).toEqual([]);
        expect(result.current.isDirty).toBe(false);
    });

    it('alan değişince dirty olur', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        expect(result.current.isDirty).toBe(true);
    });

    it('orijinal değere elle dönünce dirty temizlenir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        act(() => result.current.setField('title', 'Otel Konaklama Anlaşması'));
        expect(result.current.isDirty).toBe(false);
    });

    it('başlık boşsa validate false döner ve hata mesajı üretir', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', '   '));
        act(() => { expect(result.current.validate()).toBe(false); });
        expect(result.current.errors.title).toBeTruthy();
    });

    it('bitiş tarihi başlangıçtan önceyse validate false döner', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('dueDate', '2026-01-01'));
        act(() => { expect(result.current.validate()).toBe(false); });
        expect(result.current.errors.dueDate).toBeTruthy();
    });

    it('geçerli değerlerde validate true döner ve errors boşalır', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Yeni Başlık'));
        act(() => { expect(result.current.validate()).toBe(true); });
        expect(result.current.errors).toEqual({});
    });

    it('toUpdateDto düzenlenen alanları values\'tan, düzenlenmeyenleri task\'tan alır', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Güncellendi'));
        const dto = result.current.toUpdateDto();
        expect(dto.title).toBe('Güncellendi');
        expect(dto.projectId).toBe('p1');
        expect(dto.isPrivate).toBe(true);
        expect(dto.parentTaskId).toBe(null);
        expect(dto.predecessorIds).toEqual([]);
    });

    it('reset formu başlangıç değerlerine döndürür ve dirty temizler', () => {
        const { result } = renderHook(() => useTaskForm(TASK));
        act(() => result.current.setField('title', 'Değişti'));
        act(() => result.current.reset());
        expect(result.current.values.title).toBe('Otel Konaklama Anlaşması');
        expect(result.current.isDirty).toBe(false);
    });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run src/task-detail/hooks/useTaskForm.test.js`
Expected: FAIL — `useTaskForm.js` does not exist yet (`Cannot find module './useTaskForm'`).

- [ ] **Step 3: Implement `useTaskForm`**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.js
import { useState, useCallback, useMemo } from 'react';

const EMPTY_VALUES = {
    title: '', description: '', startDate: '', dueDate: '',
    status: 1, priority: 2, assigneeId: null, tagNames: [],
};

function toFormValues(task) {
    if (!task) return EMPTY_VALUES;
    return {
        title: task.title ?? '',
        description: task.description ?? '',
        startDate: task.startDate ? task.startDate.slice(0, 10) : '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        status: task.status ?? 1,
        priority: task.priority ?? 2,
        assigneeId: task.assigneeId ?? null,
        tagNames: (task.tags ?? []).map((t) => t.name),
    };
}

/**
 * Görev "Genel" sekmesi form state'i. `task` değişmez kabul edilir (aynı
 * taskId için TaskDetailRoot yeniden mount olur, bkz task-detail.jsx) —
 * bu yüzden başlangıç değerleri yalnız mount'ta hesaplanır, prop değişiminde
 * elle senkron kurulmaz.
 */
export function useTaskForm(task) {
    const initial = useMemo(() => toFormValues(task), [task]);
    const [values, setValues] = useState(initial);
    const [errors, setErrors] = useState({});

    const setField = useCallback((name, value) => {
        setValues((v) => ({ ...v, [name]: value }));
    }, []);

    const isDirty = useMemo(
        () => JSON.stringify(values) !== JSON.stringify(initial),
        [values, initial],
    );

    const validate = useCallback(() => {
        const next = {};
        if (!values.title.trim()) next.title = 'Başlık zorunlu.';
        if (values.dueDate && values.startDate && values.dueDate < values.startDate) {
            next.dueDate = 'Bitiş tarihi başlangıçtan önce olamaz.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [values]);

    const toUpdateDto = useCallback(() => ({
        title: values.title.trim(),
        description: values.description || null,
        startDate: values.startDate,
        dueDate: values.dueDate || null,
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId,
        boardColumnId: task?.boardColumnId ?? null,
        projectId: task?.projectId ?? null,
        parentTaskId: task?.parentTaskId ?? null,
        isPrivate: Boolean(task?.isPrivate),
        predecessorIds: task?.predecessorIds ?? [],
        tagNames: values.tagNames,
    }), [values, task]);

    const reset = useCallback(() => {
        setValues(initial);
        setErrors({});
    }, [initial]);

    return { values, setField, isDirty, errors, validate, toUpdateDto, reset };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/task-detail/hooks/useTaskForm.test.js`
Expected: PASS, 9/9.

- [ ] **Step 5: Write the failing tests for `useAssigneeOptions`**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.test.js
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssigneeOptions } from './useAssigneeOptions';

const USERS = {
    items: [
        { id: 'u1', userName: 'ybaba', name: 'Yakup', surname: 'Babaoğlu' },
        { id: 'u2', userName: 'noname', name: null, surname: null },
    ],
};

function wrapper({ children }) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

beforeEach(() => {
    window.apya = { platform: { tasks: { task: { getUsersLookup: vi.fn(() => Promise.resolve(USERS)) } } } };
});

describe('useAssigneeOptions', () => {
    it('yüklenirken isLoading true, boş options döner', () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        expect(result.current.isLoading).toBe(true);
        expect(result.current.options).toEqual([]);
    });

    it('ad+soyad varsa combobox etiketi olarak birleştirir', async () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.options).toEqual([
            { value: 'u1', label: 'Yakup Babaoğlu' },
            { value: 'u2', label: 'noname' },
        ]);
    });

    it('nameById ile id\'den isme çözümleme yapılabilir', async () => {
        const { result } = renderHook(() => useAssigneeOptions(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.nameById.get('u1')).toBe('Yakup Babaoğlu');
        expect(result.current.nameById.get('u2')).toBe('noname');
        expect(result.current.nameById.get('unknown')).toBeUndefined();
    });
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `npx vitest run src/task-detail/hooks/useAssigneeOptions.test.js`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement `useAssigneeOptions`**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.js
import { useQuery } from '@tanstack/react-query';

function displayName(u) {
    const full = [u.name, u.surname].filter(Boolean).join(' ');
    return full || u.userName;
}

function fetchUsers() {
    const svc = window?.apya?.platform?.tasks?.task;
    if (!svc) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(svc.getUsersLookup());
}

/** Atanan seçici + oluşturan/güncelleyen isim çözümü için tenant kullanıcı listesi. */
export function useAssigneeOptions() {
    const query = useQuery({
        queryKey: ['task-detail', 'users-lookup'],
        queryFn: fetchUsers,
        staleTime: 5 * 60_000,
        retry: false,
    });

    const users = query.data?.items ?? [];
    const options = users.map((u) => ({ value: u.id, label: displayName(u) }));
    const nameById = new Map(users.map((u) => [u.id, displayName(u)]));

    return { options, nameById, isLoading: query.isLoading };
}
```

- [ ] **Step 8: Run to verify it passes**

Run: `npx vitest run src/task-detail/hooks/useAssigneeOptions.test.js`
Expected: PASS, 3/3.

- [ ] **Step 9: Run the full existing task-detail suite to confirm no regression**

Run: `npx vitest run src/task-detail`
Expected: all previously-passing files still PASS (this task added two new files, touched nothing existing).

- [ ] **Step 10: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskForm.test.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useAssigneeOptions.test.js
git commit -m "feat: gorev detay Genel sekmesi icin form ve atanan-listesi hook'lari"
```

---

### Task 2: `statusMaps.js`, `TaskGeneralForm`, `TaskDetailsPanel` components

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/statusMaps.js`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailHeader.jsx` (remove inline `STATUS`/`PRIORITY`, import from `statusMaps.js`)
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.test.jsx`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.test.jsx`

**Interfaces:**
- Consumes: nothing from Task 1 at import time (pure presentational, receives data via props — Task 3 wires the hooks in).
- Produces (used by Task 3):
  - `TaskGeneralForm({ values, errors, onFieldChange, assigneeOptions, isLoadingAssignees })` — controlled form, calls `onFieldChange(name, value)` on every edit.
  - `TaskDetailsPanel({ task, creatorName, lastModifierName })` — read-only.
  - `STATUS`, `PRIORITY` exported from `statusMaps.js` (same shape as the maps Task 1's Global Constraints describe).

- [ ] **Step 1: Extract `statusMaps.js` and update `TaskDetailHeader.jsx`**

```js
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/statusMaps.js
/** Backend TaskStatus/TaskPriority enum değerlerinin (bkz TaskEnums.cs) Türkçe
 *  rozet karşılıkları — TaskDetailHeader ve TaskGeneralForm ortak kullanır. */
export const STATUS = {
    0: { text: 'İptal',      variant: 'neutral'  },
    1: { text: 'Yapılacak',  variant: 'neutral'  },
    2: { text: 'Sürüyor',    variant: 'warning'  },
    3: { text: 'Testte',     variant: 'brand'    },
    4: { text: 'Tamamlandı', variant: 'positive' },
};

export const PRIORITY = {
    1: { text: 'Düşük',  variant: 'positive' },
    2: { text: 'Orta',   variant: 'neutral'  },
    3: { text: 'Yüksek', variant: 'warning'  },
    4: { text: 'Kritik', variant: 'negative' },
};
```

In `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailHeader.jsx`, replace:

```js
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
```

with:

```js
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '../../components/ui';
import { AccessBadge } from './AccessBadge';
import { STATUS, PRIORITY } from '../statusMaps';
```

Rest of `TaskDetailHeader.jsx` is unchanged — `STATUS[task?.status]`/`PRIORITY[task?.priority]` usage stays identical.

Run: `npx vitest run src/task-detail/components/TaskDetailHeader.test.jsx`
Expected: PASS, unchanged (this is a pure extraction, no behavior change) — confirms the refactor didn't break the existing header.

- [ ] **Step 2: Write the failing tests for `TaskGeneralForm`**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskGeneralForm } from './TaskGeneralForm';

const VALUES = {
    title: 'Otel Konaklama Anlaşması',
    description: 'Detaylar',
    startDate: '2026-06-25',
    dueDate: '2026-07-10',
    status: 4,
    priority: 4,
    assigneeId: 'u1',
    tagNames: ['Konaklama', 'Anlaşma'],
};

const ASSIGNEE_OPTIONS = [
    { value: 'u1', label: 'Yakup Babaoğlu' },
    { value: 'u2', label: 'Elif A.' },
];

function setup(overrides = {}) {
    const onFieldChange = vi.fn();
    render(
        <TaskGeneralForm
            values={VALUES}
            errors={{}}
            onFieldChange={onFieldChange}
            assigneeOptions={ASSIGNEE_OPTIONS}
            isLoadingAssignees={false}
            {...overrides}
        />,
    );
    return { onFieldChange };
}

describe('TaskGeneralForm', () => {
    it('mevcut değerleri render eder', () => {
        setup();
        expect(screen.getByLabelText('Başlık')).toHaveValue('Otel Konaklama Anlaşması');
        expect(screen.getByLabelText('Açıklama')).toHaveValue('Detaylar');
        expect(screen.getByLabelText('Başlangıç Tarihi')).toHaveValue('2026-06-25');
        expect(screen.getByLabelText('Son Tarih')).toHaveValue('2026-07-10');
    });

    it('başlık değişince onFieldChange(title, ...) çağrılır', async () => {
        const { onFieldChange } = setup();
        const input = screen.getByLabelText('Başlık');
        await userEvent.clear(input);
        await userEvent.type(input, 'X');
        expect(onFieldChange).toHaveBeenCalledWith('title', 'X');
    });

    it('durum select değişince onFieldChange(status, sayı) çağrılır', async () => {
        const { onFieldChange } = setup();
        await userEvent.selectOptions(screen.getByLabelText('Durum'), '2');
        expect(onFieldChange).toHaveBeenCalledWith('status', 2);
    });

    it('öncelik select değişince onFieldChange(priority, sayı) çağrılır', async () => {
        const { onFieldChange } = setup();
        await userEvent.selectOptions(screen.getByLabelText('Öncelik'), '1');
        expect(onFieldChange).toHaveBeenCalledWith('priority', 1);
    });

    it('mevcut etiketler chip olarak görünür', () => {
        setup();
        expect(screen.getByText('Konaklama')).toBeInTheDocument();
        expect(screen.getByText('Anlaşma')).toBeInTheDocument();
    });

    it('yeni etiket yazip Enter\'a basinca onFieldChange(tagNames, [...+yeni]) çağrılır', async () => {
        const { onFieldChange } = setup();
        const tagInput = screen.getByPlaceholderText('Etiket yazıp Enter\'a basın');
        await userEvent.type(tagInput, 'Yeni{Enter}');
        expect(onFieldChange).toHaveBeenCalledWith('tagNames', ['Konaklama', 'Anlaşma', 'Yeni']);
    });

    it('etiket chip\'indeki kaldır butonuna basınca o etiket olmadan liste döner', async () => {
        const { onFieldChange } = setup();
        await userEvent.click(screen.getByLabelText('Konaklama etiketini kaldır'));
        expect(onFieldChange).toHaveBeenCalledWith('tagNames', ['Anlaşma']);
    });

    it('başlık hatası verilirse alan altında gösterilir', () => {
        setup({ errors: { title: 'Başlık zorunlu.' } });
        expect(screen.getByText('Başlık zorunlu.')).toBeInTheDocument();
    });

    it('atanan listesi yüklenirken combobox disabled olur', () => {
        setup({ isLoadingAssignees: true });
        expect(screen.getByLabelText('Atanan')).toBeDisabled();
    });
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx vitest run src/task-detail/components/TaskGeneralForm.test.jsx`
Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement `TaskGeneralForm`**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.jsx
import React, { useState } from 'react';
import { Input, Combobox, Badge } from '../../components/ui';
import { STATUS, PRIORITY } from '../statusMaps';

const selectClassName = 'block h-10 w-full rounded-md border border-default bg-surface-base '
    + 'px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus '
    + 'focus-visible:border-focus';

const textareaClassName = 'block w-full rounded-md border border-default bg-surface-base px-3 '
    + 'py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none '
    + 'focus-visible:shadow-focus focus-visible:border-focus';

function Field({ label, htmlFor, error, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1 block text-[13px] font-medium text-text-secondary">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-[13px] text-text-negative">{error}</p>}
        </div>
    );
}

function TagInput({ value, onChange }) {
    const [draft, setDraft] = useState('');

    const commit = () => {
        const name = draft.trim();
        if (name && !value.includes(name)) onChange([...value, name]);
        setDraft('');
    };

    return (
        <div>
            <div className="mb-1.5 flex flex-wrap gap-1.5">
                {value.map((name) => (
                    <Badge key={name} variant="neutral">
                        {name}
                        <button
                            type="button"
                            aria-label={`${name} etiketini kaldır`}
                            onClick={() => onChange(value.filter((t) => t !== name))}
                            className="ml-1"
                        >
                            ×
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        commit();
                    } else if (e.key === 'Backspace' && !draft && value.length) {
                        onChange(value.slice(0, -1));
                    }
                }}
                onBlur={commit}
                placeholder="Etiket yazıp Enter'a basın"
            />
        </div>
    );
}

export function TaskGeneralForm({
    values, errors, onFieldChange, assigneeOptions = [], isLoadingAssignees = false,
}) {
    return (
        <div className="space-y-[var(--apya-space-4)]">
            <Field label="Başlık" htmlFor="task-title" error={errors.title}>
                <Input
                    id="task-title"
                    value={values.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                    invalid={Boolean(errors.title)}
                />
            </Field>

            <div className="grid grid-cols-2 gap-[var(--apya-space-4)]">
                <Field label="Durum" htmlFor="task-status">
                    <select
                        id="task-status"
                        value={values.status}
                        onChange={(e) => onFieldChange('status', Number(e.target.value))}
                        className={selectClassName}
                    >
                        {Object.entries(STATUS).map(([v, s]) => (
                            <option key={v} value={v}>{s.text}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Öncelik" htmlFor="task-priority">
                    <select
                        id="task-priority"
                        value={values.priority}
                        onChange={(e) => onFieldChange('priority', Number(e.target.value))}
                        className={selectClassName}
                    >
                        {Object.entries(PRIORITY).map(([v, p]) => (
                            <option key={v} value={v}>{p.text}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Atanan" htmlFor="task-assignee">
                <Combobox
                    id="task-assignee"
                    options={assigneeOptions}
                    value={values.assigneeId}
                    onChange={(v) => onFieldChange('assigneeId', v)}
                    placeholder={isLoadingAssignees ? 'Yükleniyor…' : 'Atanacak kişi seç'}
                    disabled={isLoadingAssignees}
                />
            </Field>

            <div className="grid grid-cols-2 gap-[var(--apya-space-4)]">
                <Field label="Başlangıç Tarihi" htmlFor="task-start">
                    <Input
                        id="task-start"
                        type="date"
                        value={values.startDate}
                        onChange={(e) => onFieldChange('startDate', e.target.value)}
                    />
                </Field>
                <Field label="Son Tarih" htmlFor="task-due" error={errors.dueDate}>
                    <Input
                        id="task-due"
                        type="date"
                        value={values.dueDate}
                        onChange={(e) => onFieldChange('dueDate', e.target.value)}
                        invalid={Boolean(errors.dueDate)}
                    />
                </Field>
            </div>

            <Field label="Etiketler" htmlFor="task-tags-input">
                <TagInput value={values.tagNames} onChange={(v) => onFieldChange('tagNames', v)} />
            </Field>

            <Field label="Açıklama" htmlFor="task-description">
                <textarea
                    id="task-description"
                    rows={5}
                    value={values.description}
                    onChange={(e) => onFieldChange('description', e.target.value)}
                    className={textareaClassName}
                />
            </Field>
        </div>
    );
}
```

Note: `TagInput`'s text field has no `id`/`htmlFor` pairing with the "Etiketler" `<label>` (the
label wraps the whole `TagInput`, chips + text field together) — the test targets it by
`placeholder`, not `getByLabelText`, which is why `Field`'s `htmlFor="task-tags-input"` has no
matching `id` in `TagInput`. This is intentional: the label semantically covers the chip list,
not just the trailing input.

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run src/task-detail/components/TaskGeneralForm.test.jsx`
Expected: PASS, 9/9.

- [ ] **Step 6: Write the failing tests for `TaskDetailsPanel`**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.test.jsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskDetailsPanel } from './TaskDetailsPanel';

const TASK = {
    creationTime: '2026-06-25T14:30:00Z',
    lastModificationTime: '2026-06-26T16:20:00Z',
    projectName: 'Otel Projesi',
};

describe('TaskDetailsPanel', () => {
    it('oluşturan/güncelleyen isimlerini gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName="Yakup B." lastModifierName="Elif A." />);
        expect(screen.getByText('Yakup B.')).toBeInTheDocument();
        expect(screen.getByText('Elif A.')).toBeInTheDocument();
    });

    it('proje adını gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName="Yakup B." lastModifierName="Elif A." />);
        expect(screen.getByText('Otel Projesi')).toBeInTheDocument();
    });

    it('isim çözümlenemezse tire gösterir', () => {
        render(<TaskDetailsPanel task={TASK} creatorName={undefined} lastModifierName={undefined} />);
        const dashes = screen.getAllByText('—');
        expect(dashes.length).toBeGreaterThan(0);
    });

    it('proje yoksa tire gösterir', () => {
        render(<TaskDetailsPanel task={{ ...TASK, projectName: null }} creatorName="Y" lastModifierName="E" />);
        expect(screen.getByText('Proje').nextSibling).toHaveTextContent('—');
    });
});
```

- [ ] **Step 7: Run to verify it fails**

Run: `npx vitest run src/task-detail/components/TaskDetailsPanel.test.jsx`
Expected: FAIL — module does not exist.

- [ ] **Step 8: Implement `TaskDetailsPanel`**

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.jsx
import React from 'react';

const fmt = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
    : '—');

function Row({ label, value }) {
    return (
        <div>
            <dt className="text-[13px] text-text-tertiary">{label}</dt>
            <dd className="mt-0.5 text-text-primary">{value ?? '—'}</dd>
        </div>
    );
}

export function TaskDetailsPanel({ task, creatorName, lastModifierName }) {
    return (
        <aside className="space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]">
            <h3 className="text-[13px] font-semibold text-text-secondary">Detaylar</h3>
            <dl className="space-y-3 text-sm">
                <Row label="Oluşturan" value={creatorName} />
                <Row label="Oluşturulma zamanı" value={fmt(task.creationTime)} />
                <Row label="Güncelleyen" value={lastModifierName} />
                <Row label="Son güncelleme zamanı" value={fmt(task.lastModificationTime)} />
                <Row label="Proje" value={task.projectName} />
            </dl>
        </aside>
    );
}
```

- [ ] **Step 9: Run to verify it passes**

Run: `npx vitest run src/task-detail/components/TaskDetailsPanel.test.jsx`
Expected: PASS, 4/4.

- [ ] **Step 10: Run the full existing task-detail suite to confirm no regression**

Run: `npx vitest run src/task-detail`
Expected: all files PASS, including the unchanged-behavior `TaskDetailHeader.test.jsx`.

- [ ] **Step 11: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/statusMaps.js \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailHeader.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskGeneralForm.test.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskDetailsPanel.test.jsx
git commit -m "feat: Genel sekmesi form ve detay paneli componentleri"
```

---

### Task 3: Wire into `TaskDetailRoot.jsx`, real Save, "Kaydet ve çık", flip flag default

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.test.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail.entry.test.jsx` (verify unaffected, see Step 8 — no edit expected, run only)

**Interfaces:**
- Consumes: `useTaskForm` and `useAssigneeOptions` (Task 1), `TaskGeneralForm` and `TaskDetailsPanel` (Task 2).
- Produces: nothing further downstream — this is the last task before final review.

- [ ] **Step 1: Replace `TaskDetailRoot.jsx` in full**

The whole file changes shape (new imports, new hooks, new body branch, new save handlers,
extra dialog button). Replace the entire file content:

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx
import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalShell } from './shells/ModalShell';
import { TaskDetailHeader } from './components/TaskDetailHeader';
import { TaskDetailFooter } from './components/TaskDetailFooter';
import { TaskGeneralForm } from './components/TaskGeneralForm';
import { TaskDetailsPanel } from './components/TaskDetailsPanel';
import { useTaskDetail, isGranted } from './hooks/useTaskDetail';
import { useDirtyGuard } from './hooks/useDirtyGuard';
import { useTaskUrlSync, clearTaskUrl } from './hooks/useTaskUrlSync';
import { useTaskForm } from './hooks/useTaskForm';
import { useAssigneeOptions } from './hooks/useAssigneeOptions';
import { taskDetailStore } from './taskDetailStore';
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
    const form = useTaskForm(task);
    const assignees = useAssigneeOptions();
    const queryClient = useQueryClient();
    const [fullscreen, setFullscreen] = useState(
        () => window.localStorage?.getItem(FULLSCREEN_KEY) === '1',
    );
    const [isSaving, setIsSaving] = useState(false);

    const closeNow = useCallback(() => {
        clearTaskUrl();
        onClose?.();
    }, [onClose]);

    useTaskUrlSync(taskId, closeNow);

    /* Formun dirty durumu tek gerçek kaynak; guard'ı buna senkron tutuyoruz.
       guard.markDirty/markClean useCallback([])'la sabit, effect deps'e girmesi zararsız. */
    React.useEffect(() => {
        if (form.isDirty) guard.markDirty(); else guard.markClean();
    }, [form.isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

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

    /** Kaydeder; başarılıysa true döner (çağıran taraf kapatıp kapatmayacağına kendi karar verir). */
    const doSave = useCallback(async () => {
        if (!form.validate()) return false;
        setIsSaving(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.update(taskId, form.toUpdateDto()),
            );
            await queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
            guard.markClean();
            /* Modal açık kalabilir (yalnız Kaydet, kapatma yok) — bu yüzden liste/kanban
               tazelemesi burada tetiklenir, yalnız closeNow'a bağlı kalınmaz. "Kaydet ve
               çık" akışında closeNow'un kendi onClose zinciri de emitResult çağırır; bu
               çift-tetikleme zararsızdır (liste bir kez daha yenilenir), engellemek için
               ekstra state tutmaya değmez. */
            taskDetailStore.emitResult();
            window?.abp?.notify?.success?.('Kaydedildi.');
            return true;
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Kaydedilemedi.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [taskId, form, guard, queryClient]);

    const handleSaveClick = useCallback(() => { doSave(); }, [doSave]);

    const handleUnsavedSaveAndClose = useCallback(async () => {
        const doClose = guard.resolvePendingClose('save');
        const ok = await doSave();
        if (ok) doClose?.();
    }, [guard, doSave]);

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
                <div className="grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]">
                    <TaskGeneralForm
                        values={form.values}
                        errors={form.errors}
                        onFieldChange={form.setField}
                        assigneeOptions={assignees.options}
                        isLoadingAssignees={assignees.isLoading}
                    />
                    <TaskDetailsPanel
                        task={task}
                        creatorName={assignees.nameById.get(task.creatorId)}
                        lastModifierName={assignees.nameById.get(task.lastModifierId)}
                    />
                </div>
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
            /* Dialog'un erişilebilir adı (sr-only) header'daki görünür h2 ile
               BİREBİR AYNI metin OLAMAZ — ikisi de aynı textContent'e sahip
               olursa testing-library (ve ekran okuyucu gezinme) tekilliği
               kaybeder. "Görev Detayı: " ön eki hem tekilliği korur hem de
               ekran okuyucuya hangi görev olduğunu söyler. */
            title={task ? `Görev Detayı: ${task.title}` : 'Görev Detayı'}
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
                    isSaving={isSaving}
                    onCancel={requestClose}
                    onSave={handleSaveClick}
                />
            )}
        >
            {body}
            {guard.pendingClose && (
                <UnsavedChangesDialog
                    isSaving={isSaving}
                    onStay={() => guard.resolvePendingClose('stay')}
                    onDiscard={() => guard.resolvePendingClose('discard')}
                    onSaveAndClose={handleUnsavedSaveAndClose}
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

function UnsavedChangesDialog({ isSaving, onStay, onDiscard, onSaveAndClose }) {
    return (
        <AlertShell
            label="Kaydedilmemiş değişiklikler"
            title="Kaydedilmemiş değişiklikleriniz var."
            description="Çıkarsanız yaptığınız değişiklikler kaybolur."
            actions={(
                <>
                    <Button variant="secondary" onClick={onStay} disabled={isSaving}>Düzenlemeye devam et</Button>
                    <Button variant="destructive" onClick={onDiscard} disabled={isSaving}>Değişiklikleri iptal et</Button>
                    <Button variant="primary" onClick={onSaveAndClose} isLoading={isSaving} loadingText="Kaydediliyor…">
                        Kaydet ve çık
                    </Button>
                </>
            )}
        />
    );
}
```

- [ ] **Step 2: Update `TaskDetailRoot.test.jsx`**

The existing test `'Kaydet Faz 1de hep devre disi (duzenlenebilir alan yok)'` asserted a
Faz-1-only fact that Task 3 makes false by design — Kaydet must now become enabled once the
form is dirty. Replace that one test and extend `beforeEach`/`TASK` for the new save path.
Replace the entire file content:

```jsx
// src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.test.jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDetailRoot } from './TaskDetailRoot';

const TASK = {
    id: '11111111-2222-3333-4444-555555555555',
    title: 'Otel Konaklama Anlaşması',
    description: 'Detaylar',
    startDate: '2026-06-25T00:00:00Z',
    dueDate: '2026-07-10T00:00:00Z',
    status: 4, priority: 4, isPrivate: true,
    assigneeId: null,
    creatorId: 'u1', lastModifierId: 'u1',
    projectId: 'p1', projectName: 'Otel Projesi',
    parentTaskId: null, predecessorIds: [], boardColumnId: null,
    tags: [],
    lastModificationTime: '2026-07-10T09:45:00Z',
    creationTime: '2026-06-25T14:30:00Z',
};

const USERS = { items: [{ id: 'u1', userName: 'ybaba', name: 'Yakup', surname: 'Babaoğlu' }] };

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
                    getUsersLookup: vi.fn(() => Promise.resolve(USERS)),
                },
            },
        },
    };
    window.abp = {
        auth: { isGranted: () => true },
        notify: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
    };
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

    it('Kaydet temizken devre disi, alan degisince aktif olur', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled();

        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        expect(screen.getByRole('button', { name: 'Kaydet' })).toBeEnabled();
    });

    it('Kaydete basinca update cagrilir, cache invalidate olur, dirty temizlenir', async () => {
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalledWith(
            TASK.id,
            expect.objectContaining({ title: 'Otel Konaklama Anlaşması ek' }),
        ));
        await waitFor(() => expect(screen.getByRole('button', { name: 'Kaydet' })).toBeDisabled());
    });

    it('kayit hatasinda girilen deger form\'da kalir', async () => {
        window.apya.platform.tasks.task.update = vi.fn(() => Promise.reject(new Error('sunucu hatasi')));
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={() => {}} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

        await waitFor(() => expect(window.abp.notify.error).toHaveBeenCalled());
        expect(screen.getByLabelText('Başlık')).toHaveValue('Otel Konaklama Anlaşması ek');
    });

    it('kirliyken kapatinca uyari gosterir; Kaydet ve cik kaydedip kapatir', async () => {
        const onClose = vi.fn();
        wrap(<TaskDetailRoot taskId={TASK.id} presentation="modal" onClose={onClose} />);
        await screen.findByText('Otel Konaklama Anlaşması');
        await userEvent.type(screen.getByLabelText('Başlık'), ' ek');
        await userEvent.click(screen.getByRole('button', { name: 'Kapat' }));

        expect(await screen.findByText('Kaydedilmemiş değişiklikleriniz var.')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Kaydet ve çık' }));

        await waitFor(() => expect(window.apya.platform.tasks.task.update).toHaveBeenCalled());
        await waitFor(() => expect(onClose).toHaveBeenCalled());
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

- [ ] **Step 3: Run to verify Task 3's TaskDetailRoot tests pass**

Run: `npx vitest run src/task-detail/TaskDetailRoot.test.jsx`
Expected: PASS, 11/11.

- [ ] **Step 4: Flip the V2 flag default in `task-detail.jsx`**

In `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail.jsx`, replace:

```js
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
```

with:

```js
/**
 * FAZ 2 BAYRAK: yeni modal artık VARSAYILAN AÇIK — Genel sekmesi çalışır durumda.
 * Faz 9'da bayrak tamamen kaldırılacak.
 *
 * Kapatma yolları (geri alma):
 *   - Kalıcı : localStorage.setItem('apya.taskDetail.v2', '0')
 *   - Tek seferlik: sayfaya ?taskui=v1 ekle
 */
function isV2Enabled() {
    try {
        const param = new URLSearchParams(window.location.search).get('taskui');
        if (param === 'v2') return true;
        if (param === 'v1') return false;
        return window.localStorage.getItem('apya.taskDetail.v2') !== '0';
    } catch (_) {
        return false; /* localStorage kapalı (gizli mod / policy) → eski drawer */
    }
}
```

- [ ] **Step 5: Run the full dynamic-assets suite**

Run: `cd src/Apya.Platform.Web/wwwroot/dynamic-assets && npx vitest run`
Expected: ALL test files PASS (this is the full project suite, not just task-detail — confirms
no cross-feature regression, e.g. `dashboard/`, `expense/` remain green).

- [ ] **Step 6: `dotnet build` sanity check (no backend touched, confirms nothing else broke)**

Run (from repo root): `dotnet build Apya.Platform.slnx --nologo -v q`
Expected: `0 Hata`.

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.test.jsx \
        src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail.jsx
git commit -m "feat: Genel sekmesini TaskDetailRoot'a bagla, gercek Kaydet akisi, bayrak varsayilan acik"
```

---

## Manual/Live QA (after all tasks, before final review sign-off)

Not part of any task's automated tests — do this once, in the browser, before the final
whole-branch review, and report the result:

1. `npm run build` in `dynamic-assets/`, restart the dev server (Razor runtime compilation is
   off, but this only touches `.jsx`/`.js` — a rebuilt bundle is enough, no server restart
   needed unless testing server-rendered pages).
2. Open a task from `/Tasks` (flag now defaults on — no `?taskui=v2` needed). Confirm the
   modal shows the real Genel form, not the placeholder.
3. Edit the title, change status/priority, add a tag, save. Confirm: success toast, "Son
   kayıt" timestamp updates, Kaydet becomes disabled again, the underlying list/kanban row
   reflects the change (tests `emitResult()` wiring).
4. Edit a field, click the header × without saving — confirm the 3-button dialog appears and
   "Kaydet ve çık" both saves and closes.
5. Trigger a save error (e.g. temporarily disconnect network) — confirm the entered values are
   not lost and an error toast appears.
6. Confirm `localStorage.setItem('apya.taskDetail.v2','0')` (or `?taskui=v1`) still shows the
   old drawer — rollback path intact.
