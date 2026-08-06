# F4 — Alt Görevler + Dosyalar + Kontrol Listesi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yeni görev detay modalında (`TaskDetailRoot.jsx`) üç core/opsiyonel sekmeyi
gerçek işlevle doldurmak — Alt Görevler (context-switch + breadcrumb), Dosyalar
(yükle/listele/sil) ve Kontrol Listesi (yeni entity, "+" picker'dan eklenebilir).

**Architecture:** Alt Görevler mevcut `ParentTaskId` self-referencing modelini ve
zaten `GetAsync`'te `.Include(x => x.SubTasks)` ile dolan `TaskDto.SubTasks`'ı
kullanır — yeni backend endpoint YOK. Dosyalar mevcut `TaskAttachment` +
`TaskAttachmentController` altyapısını kullanır, tek eksik olan silme metodunu
ekler. Kontrol Listesi tek başına yeni bir `TaskChecklistItem` entity + migration
gerektirir (bkz. Görev 7'deki onay noktası). Üçü de `TaskFeatureRegistry.js`
sözleşmesine göre (`{ taskId, task }` prop'u alan kendi kendine yeten component)
navbar'a bağlanır; `general` sekmesinin özel-case render yolu DEĞİŞMEZ.

**Tech Stack:** ABP Framework / .NET 10 (Domain/Application/Contracts/EF Core
katmanları), React 18 + Vite (`wwwroot/dynamic-assets/src/task-detail/`),
TanStack Query, Vitest + Testing Library, xUnit + Shouldly (backend testler).

## Global Constraints

- Kullanıcıya dönen tüm metinler Türkçe, koda gömülü (bu modülde ayrı
  localization dosyası kullanılmıyor — mevcut deseni izle).
- Yeni backend metotları `EnsureTaskAccessAllowedAsync` ile başlar, ayrı bir
  `PlatformPermissions` girdisi eklenmez (bu alandaki tüm görev-alt-kaynak
  metotlarının — yorum, ek, feature — mevcut konvansiyonu).
- DTO↔Entity dönüşümü AutoMapper ile (`ApyaPlatformApplicationAutoMapperProfile`),
  elle mapping yazma.
- Her yeni React component'i `{ taskId, task }` dışında dışarıdan prop almaz
  (registry sözleşmesi, `TaskFeatureRegistry.js` JSDoc'unda tanımlı).
- `npm run build` çıktısı (`wwwroot/js/task-detail.js`) HER görevin sonunda
  commit'lenir — F2'nin whole-branch review'ında bulunan kritik hata
  (derlenmemiş bundle) bu fazda TEKRARLANMAYACAK.
- Görev 7 (Kontrol Listesi migration'ı) çalıştırılmadan ÖNCE kullanıcıdan açık
  onay alınır (CLAUDE.md: yeni migration onay gerektirir).

---

## Görev Grubu A — Alt Görevler (context-switch + breadcrumb)

### Task 1: `SubtasksTab` component

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/SubtasksTab.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/SubtasksTab.test.jsx`

**Interfaces:**
- Consumes: `task.subTasks` (zaten `TaskDto`'da dolu geliyor, `{ id, title, status }[]`
  şekli — bkz. `TaskDto.cs`), `task.id` (yeni alt görev oluştururken `parentTaskId`
  olarak kullanılacak), global `window.apya.platform.tasks.task.create(dto)` /
  `.delete(id)` proxy'leri (ABP dinamik JS proxy, `CreateUpdateTaskDto` alanlarını
  camelCase bekler: `title` zorunlu, `startDate` zorunlu — `new Date().toISOString().slice(0,10)`
  ile bugünün tarihi gönderilir).
- Produces: `onOpenSubtask(subtaskId, subtaskTitle)` prop'unu çağırır (Task 3'te
  `TaskDetailRoot` bunu context-switch'e bağlayacak). Registry component sözleşmesi
  gereği asıl prop'lar `{ taskId, task, onOpenSubtask }` — `onOpenSubtask` registry
  sözleşmesinin dışında, `TaskDetailRoot` tarafından enjekte edilen tek istisna
  (Task 3'te `React.cloneElement` YERİNE doğrudan `<ActiveFeatureComponent taskId={taskId} task={task} onOpenSubtask={...} />` render edilerek eklenir).

- [ ] **Step 1: Write the failing test**

```jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubtasksTab } from './SubtasksTab';

const TASK = {
    id: 'parent-1',
    subTasks: [
        { id: 'sub-1', title: 'İlk alt görev', status: 0 },
        { id: 'sub-2', title: 'İkinci alt görev', status: 2 },
    ],
};

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    create: vi.fn(() => Promise.resolve('sub-3')),
                    delete: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('SubtasksTab', () => {
    it('mevcut alt gorevleri listeler', () => {
        render(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        expect(screen.getByText('İlk alt görev')).toBeInTheDocument();
        expect(screen.getByText('İkinci alt görev')).toBeInTheDocument();
    });

    it('alt gorev basligina tiklayinca onOpenSubtask cagirir', () => {
        const onOpenSubtask = vi.fn();
        render(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={onOpenSubtask} />);
        fireEvent.click(screen.getByText('İlk alt görev'));
        expect(onOpenSubtask).toHaveBeenCalledWith('sub-1', 'İlk alt görev');
    });

    it('bos baslikla yeni alt gorev eklenemez', async () => {
        render(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /alt görev ekle/i }));
        expect(window.apya.platform.tasks.task.create).not.toHaveBeenCalled();
    });

    it('yeni alt gorev eklenince create parentTaskId ile cagirilir', async () => {
        render(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.change(screen.getByPlaceholderText('Yeni alt görev başlığı'), {
            target: { value: 'Üçüncü alt görev' },
        });
        fireEvent.click(screen.getByRole('button', { name: /alt görev ekle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.create).toHaveBeenCalledTimes(1));
        const dto = window.apya.platform.tasks.task.create.mock.calls[0][0];
        expect(dto.title).toBe('Üçüncü alt görev');
        expect(dto.parentTaskId).toBe('parent-1');
    });

    it('sil butonuna basinca delete cagirir', async () => {
        render(<SubtasksTab taskId="parent-1" task={TASK} onOpenSubtask={vi.fn()} />);
        fireEvent.click(screen.getAllByRole('button', { name: /sil/i })[0]);
        await waitFor(() => expect(window.apya.platform.tasks.task.delete).toHaveBeenCalledWith('sub-1'));
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SubtasksTab` (proje kökü: `src/Apya.Platform.Web/wwwroot/dynamic-assets/`)
Expected: FAIL — `./SubtasksTab` modülü bulunamıyor.

- [ ] **Step 3: Write minimal implementation**

```jsx
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input, Badge } from '../../components/ui';
import { STATUS } from '../statusMaps';

export function SubtasksTab({ taskId, task, onOpenSubtask }) {
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const queryClient = useQueryClient();
    const subtasks = task?.subTasks ?? [];

    const invalidateParent = () => queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });

    const addSubtask = async () => {
        const title = draft.trim();
        if (!title) return;
        setBusy(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.create({
                title,
                startDate: new Date().toISOString().slice(0, 10),
                parentTaskId: taskId,
            }));
            setDraft('');
            await invalidateParent();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev eklenemedi.');
        } finally {
            setBusy(false);
        }
    };

    const deleteSubtask = async (subtaskId) => {
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(subtaskId));
            await invalidateParent();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Alt görev silinemedi.');
        }
    };

    return (
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }}
                    placeholder="Yeni alt görev başlığı"
                    disabled={busy}
                />
                <Button variant="secondary" onClick={addSubtask} disabled={busy || !draft.trim()}>
                    Alt Görev Ekle
                </Button>
            </div>

            {subtasks.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz alt görev yok.</p>
            ) : (
                <ul className="divide-y divide-border-default">
                    {subtasks.map((sub) => (
                        <li key={sub.id} className="flex items-center justify-between py-2">
                            <button
                                type="button"
                                onClick={() => onOpenSubtask?.(sub.id, sub.title)}
                                className="text-left text-sm font-medium text-text-primary hover:underline"
                            >
                                {sub.title}
                            </button>
                            <div className="flex items-center gap-2">
                                <Badge variant="neutral">{STATUS[sub.status]?.text ?? sub.status}</Badge>
                                <Button variant="ghost" onClick={() => deleteSubtask(sub.id)} aria-label={`${sub.title} alt görevini sil`}>
                                    Sil
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- SubtasksTab`
Expected: PASS (5/5)

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/SubtasksTab.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/SubtasksTab.test.jsx
git commit -m "feat: SubtasksTab bileseni ekle"
```

---

### Task 2: `TaskBreadcrumb` component

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskBreadcrumb.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskBreadcrumb.test.jsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `<TaskBreadcrumb trail={[{ id, title }]} current={{ id, title }} onNavigate={(id) => void} />`
  — Task 3 bunu `stack` state'inden besleyecek. `trail` boşsa component `null` render eder
  (kök görevde breadcrumb hiç görünmez).

- [ ] **Step 1: Write the failing test**

```jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskBreadcrumb } from './TaskBreadcrumb';

describe('TaskBreadcrumb', () => {
    it('trail bosken hicbir sey render etmez', () => {
        const { container } = render(<TaskBreadcrumb trail={[]} current={{ id: 'a', title: 'A' }} onNavigate={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('trail + current gorevleri sirayla gosterir', () => {
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={vi.fn()}
            />,
        );
        expect(screen.getByText('Kök Görev')).toBeInTheDocument();
        expect(screen.getByText('Alt Görev')).toBeInTheDocument();
    });

    it('gecmisteki bir crumb a tiklayinca onNavigate o id ile cagirilir', () => {
        const onNavigate = vi.fn();
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={onNavigate}
            />,
        );
        fireEvent.click(screen.getByText('Kök Görev'));
        expect(onNavigate).toHaveBeenCalledWith('root');
    });

    it('mevcut (son) crumb tiklanabilir DEGILDIR', () => {
        render(
            <TaskBreadcrumb
                trail={[{ id: 'root', title: 'Kök Görev' }]}
                current={{ id: 'sub-1', title: 'Alt Görev' }}
                onNavigate={vi.fn()}
            />,
        );
        expect(screen.getByText('Alt Görev').tagName).not.toBe('BUTTON');
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- TaskBreadcrumb`
Expected: FAIL — modül bulunamıyor.

- [ ] **Step 3: Write minimal implementation**

```jsx
import React from 'react';

export function TaskBreadcrumb({ trail = [], current, onNavigate }) {
    if (trail.length === 0) return null;
    return (
        <nav aria-label="Görev gezinme yolu" className="flex items-center gap-1.5 text-sm text-text-secondary">
            {trail.map((crumb) => (
                <React.Fragment key={crumb.id}>
                    <button
                        type="button"
                        onClick={() => onNavigate?.(crumb.id)}
                        className="hover:underline hover:text-text-primary"
                    >
                        {crumb.title}
                    </button>
                    <span aria-hidden="true">/</span>
                </React.Fragment>
            ))}
            <span className="font-medium text-text-primary">{current.title}</span>
        </nav>
    );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- TaskBreadcrumb`
Expected: PASS (4/4)

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskBreadcrumb.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/TaskBreadcrumb.test.jsx
git commit -m "feat: TaskBreadcrumb bileseni ekle"
```

---

### Task 3: `TaskDetailRoot` context-switch entegrasyonu + registry

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.featureTabs.test.jsx`
  (mevcut testlere context-switch senaryosu eklenir)

**Interfaces:**
- Consumes: `SubtasksTab` (Task 1), `TaskBreadcrumb` (Task 2), mevcut `useDirtyGuard`
  (`guard.requestClose(onProceed)` — dirty'yken onay dialog'u açar, temizken direkt
  çağırır; context-switch için de AYNEN reused edilir).
- Produces: kök `taskId` prop'u DEĞİŞMEZ (URL/dış API); iç state `currentTaskId`
  artık tüm veri çekme/kaydetme/silme işlemlerinin gerçek anahtarı.

- [ ] **Step 1: Mevcut context-switch testini failing halde yaz**

`TaskDetailRoot.featureTabs.test.jsx` dosyasının SONUNA ekle (mevcut `describe`
bloğunun mock kurulumunu — `window.apya...` — takip eden yeni bir `it`):

```jsx
it('alt gorev basligina tiklayinca ayni modalda o gorevin GENEL sekmesine gecer ve breadcrumb gorunur', async () => {
    const parent = { ...BASE_TASK, id: 'parent-1', title: 'Kök Görev', subTasks: [{ id: 'sub-1', title: 'Alt Görev', status: 0 }] };
    const sub = { ...BASE_TASK, id: 'sub-1', title: 'Alt Görev', subTasks: [] };
    window.apya.platform.tasks.task.get = vi.fn((id) => Promise.resolve(id === 'parent-1' ? parent : sub));
    window.apya.platform.tasks.task.getFeatureAssignments = vi.fn(() => Promise.resolve([]));

    render(<TaskDetailRoot taskId="parent-1" onClose={vi.fn()} />, { wrapper });
    await screen.findByText('Kök Görev');

    fireEvent.click(await screen.findByRole('tab', { name: /alt görevler/i }));
    fireEvent.click(await screen.findByText('Alt Görev'));

    await waitFor(() => expect(window.apya.platform.tasks.task.get).toHaveBeenCalledWith('sub-1'));
    expect(screen.getByRole('tab', { name: /genel/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('navigation', { name: /görev gezinme yolu/i })).toHaveTextContent('Kök Görev');

    fireEvent.click(screen.getByText('Kök Görev'));
    await waitFor(() => expect(window.apya.platform.tasks.task.get).toHaveBeenCalledWith('parent-1'));
});
```

Bu dosyada `BASE_TASK`, `wrapper` gibi yardımcılar zaten var — mevcut testlerin
üstündeki tanımları AYNEN kullan, tekrar tanımlama.

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu doğrula**

Run: `npm test -- TaskDetailRoot.featureTabs`
Expected: FAIL — `subtasks` implemented:false olduğu için "Alt Görevler" tab'ı hiç render olmuyor / breadcrumb navigation rolü yok.

- [ ] **Step 3: `TaskFeatureRegistry.js`'te `subtasks` entry'sini güncelle**

`TaskFeatureRegistry.js:25-29`'daki mevcut entry'yi değiştir:

```js
    {
        code: 'subtasks', title: 'Alt Görevler', icon: 'fa-list-check',
        category: 'gorev', isCore: true, order: 1, permission: null,
        implemented: true, component: SubtasksTab,
    },
```

Dosyanın başına import ekle:

```js
import { SubtasksTab } from './components/SubtasksTab';
```

- [ ] **Step 4: `TaskDetailRoot.jsx`'te context-switch state'ini ekle**

`TaskDetailRoot.jsx:1-18` importlarına ekle:

```jsx
import { TaskBreadcrumb } from './components/TaskBreadcrumb';
```

`TaskDetailRoot.jsx:27-32` civarındaki state kurulumunu değiştir — `taskId` prop'u
artık SADECE kök kimliği ve URL senkronu için kalır, veri çekme `currentTaskId`
üzerinden yapılır:

```jsx
export function TaskDetailRoot({ taskId, presentation = 'modal', onClose }) {
    const [currentTaskId, setCurrentTaskId] = useState(taskId);
    const [breadcrumbTrail, setBreadcrumbTrail] = useState([]); // [{id, title}]
    const { data: task, isLoading, isError, refetch } = useTaskDetail(currentTaskId);
    const guard = useDirtyGuard();
    const form = useTaskForm(task);
    const assignees = useAssigneeOptions();
    const features = useTaskFeatures(currentTaskId);
    const [activeCode, setActiveCode] = useState('general');
```

Aynı fonksiyon gövdesinde, `handleAddFeature`'dan hemen önce context-switch
handler'larını ekle (guard.requestClose'un generic `onClose` parametresini
"kapatma" DIŞINDA bir aksiyon için reuse ediyoruz — dirty'yken aynı
"Kaydedilmemiş değişiklikler" dialog'u açılır, temizken direkt geçer):

```jsx
    const switchToTask = useCallback((nextId, nextTitle) => {
        guard.requestClose(() => {
            setBreadcrumbTrail((trail) => [...trail, { id: currentTaskId, title: task?.title ?? '' }]);
            setCurrentTaskId(nextId);
            setActiveCode('general');
            guard.markClean();
        });
    }, [guard, currentTaskId, task]);

    const navigateBreadcrumb = useCallback((targetId) => {
        guard.requestClose(() => {
            setBreadcrumbTrail((trail) => {
                const idx = trail.findIndex((c) => c.id === targetId);
                return idx === -1 ? trail : trail.slice(0, idx);
            });
            setCurrentTaskId(targetId);
            setActiveCode('general');
            guard.markClean();
        });
    }, [guard]);
```

`taskId`, `closeNow`, `doSave`, `handleDelete` içindeki `window.apya...` çağrılarında
geçen `taskId` referanslarını `currentTaskId` ile değiştir (satır 93, 111, 113 —
`update`/`delete`/`invalidateQueries` çağrıları artık AKTİF görevi hedeflemeli):

```jsx
    const handleDelete = useCallback(async () => {
        setDeleting(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.delete(currentTaskId));
            window?.abp?.notify?.info?.('Başarıyla silindi.');
            setDeleteOpen(false);
            guard.markClean();
            closeNow();
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Görev silinemedi.');
        } finally {
            setDeleting(false);
        }
    }, [currentTaskId, guard, closeNow]);

    const doSave = useCallback(async () => {
        if (!form.validate()) return false;
        setIsSaving(true);
        try {
            await Promise.resolve(
                window.apya.platform.tasks.task.update(currentTaskId, form.toUpdateDto()),
            );
            await queryClient.invalidateQueries({ queryKey: ['task-detail', currentTaskId] });
            taskDetailStore.emitResult();
            window?.abp?.notify?.success?.('Kaydedildi.');
            return true;
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Kaydedilemedi.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [currentTaskId, form, guard, queryClient]);
```

`useTaskUrlSync(taskId, closeNow)` çağrısı DEĞİŞMEZ — dış URL kök görevin
kimliğini takip etmeye devam eder (alt göreve derin bağlantı bu fazın kapsamı DIŞINDA).

Render bloğunda (`activeFeature.code === 'general'` şubesinden hemen önce, navbar'ın
üstüne) breadcrumb'ı ve `SubtasksTab`'a özel `onOpenSubtask` prop'unu ekle:

```jsx
                <div className="flex min-h-0 flex-col gap-[var(--apya-space-4)]">
                    <TaskBreadcrumb
                        trail={breadcrumbTrail}
                        current={{ id: currentTaskId, title: task?.title ?? '' }}
                        onNavigate={navigateBreadcrumb}
                    />
                    <div className="relative" ref={pickerRef}>
```

Son olarak `ActiveFeatureComponent` render satırını (satır ~226) `onOpenSubtask`
prop'unu geçirecek şekilde güncelle — registry sözleşmesi dışı tek istisna, `general`
için zaten olduğu gibi kod satırında açıkça belirtilir:

```jsx
                            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                                {ActiveFeatureComponent && (
                                    <ActiveFeatureComponent
                                        taskId={currentTaskId}
                                        task={task}
                                        onOpenSubtask={switchToTask}
                                    />
                                )}
                            </Suspense>
```

Kalan `taskId` kullanımlarını (`canDelete` civarı, `title={task ? ... }`, header/footer
prop'ları) `currentTaskId`/`task` ile bırak — zaten `task` state'i doğru kaynaktan geliyor,
sadece açıkça `taskId` yazan satırları (varsa) `currentTaskId` yap.

- [ ] **Step 5: Testleri çalıştır, geçtiğini doğrula**

Run: `npm test -- TaskDetailRoot.featureTabs SubtasksTab TaskBreadcrumb`
Expected: PASS (hepsi)

- [ ] **Step 6: Tam frontend suite'i + build**

Run: `npm test`
Expected: PASS (mevcut 143 + bu görevin testleri)

Run: `npm run build` (proje kökü: `dynamic-assets/`)
Expected: 0 hata, `wwwroot/js/task-detail.js` yeniden üretilir.

- [ ] **Step 7: Commit (kaynak + derlenmiş bundle BİRLİKTE)**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskDetailRoot.featureTabs.test.jsx src/Apya.Platform.Web/wwwroot/js/task-detail.js
git commit -m "feat: alt gorev context-switch + breadcrumb entegrasyonu"
```

---

## Görev Grubu B — Dosyalar (yükle / listele / sil)

### Task 4: Backend — `DeleteAttachmentAsync`

**Files:**
- Modify: `src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs`
- Modify: `src/Apya.Platform.Application/Tasks/TaskAppService.cs`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Attachment_Tests.cs`

**Interfaces:**
- Consumes: mevcut `_attachmentRepository` (`IRepository<TaskAttachment, Guid>`,
  zaten constructor'da inject edilmiş — `TaskAppService.cs:28`), `EnsureTaskAccessAllowedAsync`.
- Produces: `Task DeleteAttachmentAsync(Guid attachmentId)` — imza Documents
  modülündeki `IDocumentAppService.DeleteAttachmentAsync(Guid attachmentId)` ile
  BİREBİR aynı şekilde (tek parametre, `taskId` attachment'tan okunur — çağıranın
  yanlış `taskId` geçip erişim kontrolünü atlatmasını yapısal olarak imkânsız kılar).

- [ ] **Step 1: Write the failing test**

```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Attachment_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskAttachment, Guid> _attachmentRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Attachment_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _attachmentRepository = GetRequiredService<IRepository<TaskAttachment, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(
            Guid.NewGuid(), "Ek silme test görevi",
            tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    [Fact]
    public async Task DeleteAttachmentAsync_var_olan_eki_siler()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        await _taskAppService.AddAttachmentAsync(taskId, "rapor.pdf", "stored-1.pdf", 1024);
        var before = await _taskAppService.GetAttachmentsAsync(taskId);
        var attachmentId = before.ShouldHaveSingleItem().Id;

        await _taskAppService.DeleteAttachmentAsync(attachmentId);

        var after = await _taskAppService.GetAttachmentsAsync(taskId);
        after.ShouldBeEmpty();
    }

    [Fact]
    public async Task DeleteAttachmentAsync_var_olmayan_ek_icin_EntityNotFoundException_verir()
    {
        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.DeleteAttachmentAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task DeleteAttachmentAsync_baska_tenantin_ekini_silmeye_calisinca_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        Guid attachmentId;
        using (_currentTenant.Change(otherTenantId))
        {
            var task = new TaskItem(Guid.NewGuid(), "Diğer tenant görevi", tenantId: otherTenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            await _taskAppService.AddAttachmentAsync(task.Id, "rapor.pdf", "stored-2.pdf", 1024);
            var atts = await _taskAppService.GetAttachmentsAsync(task.Id);
            attachmentId = atts.ShouldHaveSingleItem().Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.DeleteAttachmentAsync(attachmentId));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --filter TaskAppService_Attachment_Tests`
Expected: FAIL — build hatası, `DeleteAttachmentAsync` `ITaskAppService`'te yok.

- [ ] **Step 3: Write minimal implementation**

`ITaskAppService.cs:30-31` satırlarının hemen altına ekle:

```csharp
        Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize);
        Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId);
        Task DeleteAttachmentAsync(Guid attachmentId);
```

`TaskAppService.cs`'te `GetAttachmentsAsync`'in bitişinden (satır ~676) hemen sonra ekle:

```csharp
        public async Task DeleteAttachmentAsync(Guid attachmentId)
        {
            var attachment = await _attachmentRepository.GetAsync(attachmentId);
            await EnsureTaskAccessAllowedAsync(attachment.TaskId);

            await _attachmentRepository.DeleteAsync(attachment, autoSave: true);
        }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --filter TaskAppService_Attachment_Tests`
Expected: PASS (3/3)

Run: `dotnet build Apya.Platform.slnx`
Expected: 0 Hata

- [ ] **Step 5: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs src/Apya.Platform.Application/Tasks/TaskAppService.cs test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Attachment_Tests.cs
git commit -m "feat: gorev eki silme metodu ekle"
```

---

### Task 5: `useTaskAttachments` hook + antiforgery export

**Files:**
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/lib/api/httpClient.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskAttachments.js`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskAttachments.test.jsx`

**Interfaces:**
- Consumes: `window.apya.platform.tasks.task.getAttachments(taskId)` /
  `.deleteAttachment(attachmentId)` (Task 4'ün ABP dinamik proxy'si), ham
  `fetch` ile `POST /api/tasks/attachments/upload/{taskId}` (`TaskAttachmentController`,
  var olan endpoint — bkz. V1 `EditModal.cshtml:694-700` referans implementasyonu,
  `RequestVerificationToken` header'ı ZORUNLU).
- Produces: `{ attachments, isLoading, upload(file), remove(attachmentId), isUploading }`
  — Task 6 bunu tüketecek.

- [ ] **Step 1: `readAntiForgeryToken`'ı export et**

`httpClient.js:27`'deki fonksiyon imzasını değiştir:

```js
export function readAntiForgeryToken() {
```

(Gövde AYNEN kalır — sadece `export` eklendi, davranış değişmedi.)

- [ ] **Step 2: Write the failing test**

```jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTaskAttachments } from './useTaskAttachments';

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
                    getAttachments: vi.fn(() => Promise.resolve([
                        { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
    global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ success: true, storedFileName: 'stored-x.pdf' }),
    }));
    document.head.innerHTML = '<meta name="__RequestVerificationToken" content="tok-123">';
});

describe('useTaskAttachments', () => {
    it('ekleri yukler', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));
        expect(window.apya.platform.tasks.task.getAttachments).toHaveBeenCalledWith(TASK_ID);
    });

    it('upload dogru URL ve antiforgery header ile fetch cagirir', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));

        const file = new File(['x'], 'yeni.pdf', { type: 'application/pdf' });
        await act(async () => { await result.current.upload(file); });

        expect(global.fetch).toHaveBeenCalledWith(
            `/api/tasks/attachments/upload/${TASK_ID}`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ RequestVerificationToken: 'tok-123' }),
            }),
        );
    });

    it('remove deleteAttachment cagirir ve listeyi tazeler', async () => {
        const { result } = renderHook(() => useTaskAttachments(TASK_ID), { wrapper });
        await waitFor(() => expect(result.current.attachments).toHaveLength(1));

        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([]));
        await act(async () => { await result.current.remove('att-1'); });

        expect(window.apya.platform.tasks.task.deleteAttachment).toHaveBeenCalledWith('att-1');
        await waitFor(() => expect(result.current.attachments).toHaveLength(0));
    });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- useTaskAttachments`
Expected: FAIL — modül yok.

- [ ] **Step 4: Write minimal implementation**

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readAntiForgeryToken } from '../../lib/api/httpClient';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchAttachments(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getAttachments(taskId));
}

async function uploadAttachment(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    const token = readAntiForgeryToken();
    if (token) headers.RequestVerificationToken = token;

    const response = await fetch(`/api/tasks/attachments/upload/${taskId}`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
    });
    const result = await response.json();
    if (!response.ok || result?.success === false) {
        throw new Error(result?.error || 'Dosya yüklenemedi.');
    }
    return result;
}

/** Görev dosya ekleri — listele/yükle/sil. */
export function useTaskAttachments(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-attachments', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchAttachments(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const uploadMutation = useMutation({
        mutationFn: (file) => uploadAttachment(taskId, file),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (attachmentId) => Promise.resolve(svc().deleteAttachment(attachmentId)),
        onSuccess: invalidate,
    });

    return {
        attachments: query.data ?? [],
        isLoading: query.isLoading,
        upload: uploadMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
    };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- useTaskAttachments`
Expected: PASS (3/3)

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/lib/api/httpClient.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskAttachments.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskAttachments.test.jsx
git commit -m "feat: useTaskAttachments hook'u ekle"
```

---

### Task 6: `FilesTab` component + registry

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FilesTab.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FilesTab.test.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js`

**Interfaces:**
- Consumes: `useTaskAttachments(taskId)` (Task 5).
- Produces: registry `files` entry `implemented:true, component: FilesTab`.

- [ ] **Step 1: Write the failing test**

```jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilesTab } from './FilesTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getAttachments: vi.fn(() => Promise.resolve([
                        { id: 'att-1', fileName: 'rapor.pdf', fileSize: 2048, downloadUrl: '/file/get/x', uploaderName: 'ali' },
                    ])),
                    deleteAttachment: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('FilesTab', () => {
    it('dosya listesini gosterir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText('rapor.pdf')).toBeInTheDocument();
        expect(screen.getByText(/2 KB/)).toBeInTheDocument();
    });

    it('sil butonuna basinca deleteAttachment cagirir', async () => {
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('rapor.pdf');
        fireEvent.click(screen.getByRole('button', { name: /rapor\.pdf dosyasini sil/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteAttachment).toHaveBeenCalledWith('att-1'));
    });

    it('hic dosya yoksa bos durum mesaji gosterir', async () => {
        window.apya.platform.tasks.task.getAttachments = vi.fn(() => Promise.resolve([]));
        renderWithClient(<FilesTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText(/henüz dosya yüklenmemiş/i)).toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- FilesTab`
Expected: FAIL — modül yok.

- [ ] **Step 3: Write minimal implementation**

```jsx
import React, { useRef } from 'react';
import { Button } from '../../components/ui';
import { useTaskAttachments } from '../hooks/useTaskAttachments';

function formatSize(bytes) {
    return `${Math.round(bytes / 1024)} KB`;
}

export function FilesTab({ taskId }) {
    const { attachments, upload, remove, isUploading } = useTaskAttachments(taskId);
    const inputRef = useRef(null);

    const onFileChosen = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await upload(file);
            window?.abp?.notify?.success?.('Dosya yüklendi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Dosya yüklenemedi.');
        } finally {
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const onDelete = async (attachmentId, fileName) => {
        try {
            await remove(attachmentId);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || `${fileName} silinemedi.`);
        }
    };

    return (
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex items-center gap-2">
                <input ref={inputRef} type="file" onChange={onFileChosen} className="text-sm" disabled={isUploading} />
                {isUploading && <span className="text-sm text-text-tertiary">Yükleniyor…</span>}
            </div>

            {attachments.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz dosya yüklenmemiş.</p>
            ) : (
                <ul className="divide-y divide-border-default">
                    {attachments.map((att) => (
                        <li key={att.id} className="flex items-center justify-between py-2">
                            <div>
                                <a href={att.downloadUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-text-primary hover:underline">
                                    {att.fileName}
                                </a>
                                <p className="text-xs text-text-tertiary">{formatSize(att.fileSize)} — {att.uploaderName}</p>
                            </div>
                            <Button variant="ghost" onClick={() => onDelete(att.id, att.fileName)} aria-label={`${att.fileName} dosyasini sil`}>
                                Sil
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

- [ ] **Step 4: `TaskFeatureRegistry.js`'te `files` entry'sini güncelle**

`TaskFeatureRegistry.js:30-34`:

```js
    {
        code: 'files', title: 'Dosyalar', icon: 'fa-paperclip',
        category: 'gorev', isCore: true, order: 2, permission: null,
        implemented: true, component: FilesTab,
    },
```

Import ekle:

```js
import { FilesTab } from './components/FilesTab';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- FilesTab`
Expected: PASS (3/3)

Run: `npm test` (tam suite) + `npm run build`
Expected: hepsi PASS, `wwwroot/js/task-detail.js` yeniden üretildi.

- [ ] **Step 6: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FilesTab.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/FilesTab.test.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js src/Apya.Platform.Web/wwwroot/js/task-detail.js
git commit -m "feat: FilesTab bileseni ekle ve registry'e bagla"
```

---

## Görev Grubu C — Kontrol Listesi (yeni entity)

**Kapsam kararı (basit tutmak için):** checklist item'da yalnız Ekle / İşaretle
(done↔undone) / Sil var — metin düzenleme veya sürükle-bırak sıralama YOK (YAGNI;
sıra ekleme tarihine göre). Yanlış yazılan bir madde silinip yeniden eklenir. Bu
minimal kapsam roadmap spec'inin talep ettiğinin ötesine geçmiyor; ileride "düzenle"
istenirse ayrı bir küçük görev olarak eklenir.

### Task 7: Domain — `TaskChecklistItem` entity + migration

⚠️ **ONAY NOKTASI:** Bu görevin Step 3'ü (`dotnet ef migrations add` çalıştırmak
ve dev veritabanına uygulamak) CLAUDE.md'nin "Veritabanı şeması değişikliği / yeni
migration" onay kuralına giriyor. Step 1-2'yi (entity + EF config kodu) yazdıktan
sonra migration'ı ÇALIŞTIRMADAN ÖNCE kullanıcıya dur, tam olarak ne ekleneceğini
özetle (yeni tablo `ApyaTaskChecklistItems`: Id, TaskId, Text, IsDone, CreationTime,
CreatorId) ve açık onay al.

**Files:**
- Create: `src/Apya.Platform.Domain/Tasks/TaskChecklistItem.cs`
- Modify: `src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs`
- Create (CLI ile üretilecek): `src/Apya.Platform.EntityFrameworkCore/Migrations/<timestamp>_Add_TaskChecklistItem.cs`

**Interfaces:**
- Produces: `TaskChecklistItem : CreationAuditedEntity<Guid> { TaskId, Text, IsDone }`
  — `TaskAttachment` ile birebir aynı temel sınıf (yükleyen/ekleyen bilgisi audit
  alanlarından gelir, ayrı bir "CreatedBy" alanı yok).

- [ ] **Step 1: Entity'yi yaz**

```csharp
using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks;

/// <summary>Görev kontrol listesi maddesi — TaskAttachment ile aynı desen (CreationAuditedEntity, IMultiTenant yok, tenant/gizlilik EnsureTaskAccessAllowedAsync guard'ından gelir).</summary>
public class TaskChecklistItem : CreationAuditedEntity<Guid>
{
    public Guid TaskId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsDone { get; set; }
}
```

- [ ] **Step 2: EF Core config ekle**

`PlatformDbContext.cs`'te `DbSet<TaskFeatureAssignment>` satırının (133) hemen
altına ekle:

```csharp
        public DbSet<TaskFeatureAssignment> TaskFeatureAssignments { get; set; }
        public DbSet<TaskChecklistItem> TaskChecklistItems { get; set; }
```

`builder.Entity<TaskFeatureAssignment>(...)` bloğunun (595-601) hemen altına ekle:

```csharp
            builder.Entity<TaskChecklistItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskChecklistItems", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Text).IsRequired().HasMaxLength(500);
                b.HasIndex(x => x.TaskId);
            });
```

- [ ] **Step 3 (ONAY SONRASI): Migration üret ve uygula**

```bash
cd src/Apya.Platform.EntityFrameworkCore
dotnet ef migrations add Add_TaskChecklistItem --startup-project ../Apya.Platform.Web
dotnet ef database update --startup-project ../Apya.Platform.Web
```

Expected: migration dosyası oluşur, `dotnet build Apya.Platform.slnx` 0 hata,
yerel Postgres'te `ApyaTaskChecklistItems` tablosu görünür.

- [ ] **Step 4: Commit**

```bash
git add src/Apya.Platform.Domain/Tasks/TaskChecklistItem.cs src/Apya.Platform.EntityFrameworkCore/EntityFrameworkCore/PlatformDbContext.cs src/Apya.Platform.EntityFrameworkCore/Migrations/
git commit -m "feat: TaskChecklistItem entity ve migration ekle"
```

---

### Task 8: Contracts + Application — checklist CRUD

**Files:**
- Modify: `src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs`
- Create: `src/Apya.Platform.Application.Contracts/Tasks/TaskChecklistItemDto.cs`
- Modify: `src/Apya.Platform.Application/Tasks/TaskAppService.cs`
- Modify: `src/Apya.Platform.Application/PlatformApplicationAutoMapperProfile.cs`
- Test: `test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Checklist_Tests.cs`

**Interfaces:**
- Consumes: Task 7'nin `TaskChecklistItem` entity'si.
- Produces: `GetChecklistItemsAsync(taskId)` → `List<TaskChecklistItemDto>`,
  `AddChecklistItemAsync(taskId, text)` → `Guid`, `ToggleChecklistItemAsync(itemId)`
  (idempotent-DEĞİL — her çağrı `IsDone`'ı ters çevirir), `DeleteChecklistItemAsync(itemId)`.

- [ ] **Step 1: Write the failing test**

```csharp
using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Tasks;

[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TaskAppService_Checklist_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly ICurrentTenant _currentTenant;

    public TaskAppService_Checklist_Tests()
    {
        _taskAppService = GetRequiredService<ITaskAppService>();
        _taskRepository = GetRequiredService<IRepository<TaskItem, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> CreateTaskInCurrentTenantAsync()
    {
        var task = new TaskItem(Guid.NewGuid(), "Checklist test görevi", tenantId: _currentTenant.Id, now: DateTime.Now);
        await _taskRepository.InsertAsync(task, autoSave: true);
        return task.Id;
    }

    [Fact]
    public async Task AddChecklistItemAsync_eklenen_madde_GetChecklistItemsAsync_ile_gorunur()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await _taskAppService.AddChecklistItemAsync(taskId, "İlk madde");
        var result = await _taskAppService.GetChecklistItemsAsync(taskId);

        result.ShouldHaveSingleItem().Text.ShouldBe("İlk madde");
        result[0].IsDone.ShouldBeFalse();
    }

    [Fact]
    public async Task AddChecklistItemAsync_bos_metin_hata_verir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();

        await Should.ThrowAsync<UserFriendlyException>(
            async () => await _taskAppService.AddChecklistItemAsync(taskId, "   "));
    }

    [Fact]
    public async Task ToggleChecklistItemAsync_IsDone_u_ters_cevirir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        var itemId = await _taskAppService.AddChecklistItemAsync(taskId, "Madde");

        await _taskAppService.ToggleChecklistItemAsync(itemId);
        var afterFirst = await _taskAppService.GetChecklistItemsAsync(taskId);
        afterFirst.ShouldHaveSingleItem().IsDone.ShouldBeTrue();

        await _taskAppService.ToggleChecklistItemAsync(itemId);
        var afterSecond = await _taskAppService.GetChecklistItemsAsync(taskId);
        afterSecond.ShouldHaveSingleItem().IsDone.ShouldBeFalse();
    }

    [Fact]
    public async Task DeleteChecklistItemAsync_maddeyi_kaldirir()
    {
        var taskId = await CreateTaskInCurrentTenantAsync();
        var itemId = await _taskAppService.AddChecklistItemAsync(taskId, "Madde");

        await _taskAppService.DeleteChecklistItemAsync(itemId);
        var result = await _taskAppService.GetChecklistItemsAsync(taskId);

        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetChecklistItemsAsync_baska_tenantin_gorevinde_hata_verir()
    {
        var otherTenantId = Guid.NewGuid();
        Guid taskId;
        using (_currentTenant.Change(otherTenantId))
        {
            var task = new TaskItem(Guid.NewGuid(), "Diğer tenant görevi", tenantId: otherTenantId, now: DateTime.Now);
            await _taskRepository.InsertAsync(task, autoSave: true);
            taskId = task.Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(
            async () => await _taskAppService.GetChecklistItemsAsync(taskId));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --filter TaskAppService_Checklist_Tests`
Expected: FAIL — build hatası, metotlar/DTO yok.

- [ ] **Step 3: DTO'yu yaz**

```csharp
using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskChecklistItemDto : CreationAuditedEntityDto<Guid>
    {
        public string Text { get; set; } = string.Empty;
        public bool IsDone { get; set; }
    }
}
```

- [ ] **Step 4: `ITaskAppService`'e metotları ekle**

`ITaskAppService.cs`'te "Feature Registry (Faz 3)" bloğunun altına ekle:

```csharp
        // Kontrol Listesi (Faz 4)
        Task<List<TaskChecklistItemDto>> GetChecklistItemsAsync(Guid taskId);
        Task<Guid> AddChecklistItemAsync(Guid taskId, string text);
        Task ToggleChecklistItemAsync(Guid itemId);
        Task DeleteChecklistItemAsync(Guid itemId);
```

- [ ] **Step 5: `TaskAppService`'e implementasyonu ekle**

Constructor'a repository ekle (`_featureAssignmentRepository` alanının hemen
altına, satır 35 ve 49/62 civarı — field, parametre, atama üçlüsü):

```csharp
        private readonly IRepository<TaskFeatureAssignment, Guid> _featureAssignmentRepository;
        private readonly IRepository<TaskChecklistItem, Guid> _checklistRepository;
```

```csharp
            IRepository<TaskFeatureAssignment, Guid> featureAssignmentRepository,
            IRepository<TaskChecklistItem, Guid> checklistRepository,
            ILocalEventBus localEventBus)
            : base(repository)
        {
            ...
            _featureAssignmentRepository = featureAssignmentRepository;
            _checklistRepository = checklistRepository;
```

`RemoveFeatureAsync`'in bitişinden (satır ~725) sonra ekle:

```csharp
        public async Task<List<TaskChecklistItemDto>> GetChecklistItemsAsync(Guid taskId)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            var items = await _checklistRepository.GetListAsync(x => x.TaskId == taskId);
            return items
                .OrderBy(x => x.CreationTime)
                .Select(x => new TaskChecklistItemDto
                {
                    Id = x.Id,
                    CreationTime = x.CreationTime,
                    Text = x.Text,
                    IsDone = x.IsDone,
                })
                .ToList();
        }

        public async Task<Guid> AddChecklistItemAsync(Guid taskId, string text)
        {
            await EnsureTaskAccessAllowedAsync(taskId);

            if (string.IsNullOrWhiteSpace(text))
            {
                throw new Volo.Abp.UserFriendlyException("Kontrol listesi maddesi boş olamaz.");
            }

            var item = await _checklistRepository.InsertAsync(new TaskChecklistItem
            {
                TaskId = taskId,
                Text = text.Trim(),
            }, autoSave: true);

            return item.Id;
        }

        public async Task ToggleChecklistItemAsync(Guid itemId)
        {
            var item = await _checklistRepository.GetAsync(itemId);
            await EnsureTaskAccessAllowedAsync(item.TaskId);

            item.IsDone = !item.IsDone;
            await _checklistRepository.UpdateAsync(item, autoSave: true);
        }

        public async Task DeleteChecklistItemAsync(Guid itemId)
        {
            var item = await _checklistRepository.GetAsync(itemId);
            await EnsureTaskAccessAllowedAsync(item.TaskId);

            await _checklistRepository.DeleteAsync(item, autoSave: true);
        }
```

`PlatformApplicationAutoMapperProfile.cs`'teki "3. Comments and Attachments"
bloğuna (satır 66-68) ekle — DTO'nun tüm alanları entity ile birebir eşleştiği
için `ForMember` gerekmez:

```csharp
            CreateMap<Apya.Platform.Tasks.TaskComment, Apya.Platform.Tasks.TaskCommentDto>();
            CreateMap<Apya.Platform.Tasks.TaskAttachment, Apya.Platform.Tasks.TaskAttachmentDto>();
            CreateMap<Apya.Platform.Tasks.TaskChecklistItem, Apya.Platform.Tasks.TaskChecklistItemDto>();
```

(Not: yukarıdaki elle-DTO-doldurma yaklaşımı `ObjectMapper` KULLANMIYOR — DTO'yu
doğrudan `new TaskChecklistItemDto { ... }` ile kuruyoruz, `GetAttachmentsAsync`
ile aynı desen. AutoMapper `CreateMap` yine de eklenir çünkü ileride
`CrudAppService` konvansiyonuyla tutarlılık ve olası tekil `MapToGetOutputDto`
kullanımı için gerekli olabilir — eklemek zararsız, YAGNI ihlali değil çünkü
mevcut `TaskAttachmentDto` haritası da aynı "kullanılmasa bile dursun" deseninde.)

- [ ] **Step 6: Run test to verify it passes**

Run: `dotnet test test/Apya.Platform.EntityFrameworkCore.Tests --filter TaskAppService_Checklist_Tests`
Expected: PASS (5/5)

Run: `dotnet test`
Expected: tüm suite PASS (mevcut 226 + bu görevin + Task 4'ün testleri)

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Application.Contracts/Tasks/ITaskAppService.cs src/Apya.Platform.Application.Contracts/Tasks/TaskChecklistItemDto.cs src/Apya.Platform.Application/Tasks/TaskAppService.cs src/Apya.Platform.Application/PlatformApplicationAutoMapperProfile.cs test/Apya.Platform.EntityFrameworkCore.Tests/EntityFrameworkCore/Tasks/TaskAppService_Checklist_Tests.cs
git commit -m "feat: kontrol listesi ekle/isaretle/sil AppService metotlari"
```

---

### Task 9: `ChecklistTab` component + registry

**Files:**
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskChecklist.js`
- Create: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/ChecklistTab.jsx`
- Test: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/ChecklistTab.test.jsx`
- Modify: `src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js`

**Interfaces:**
- Consumes: Task 8'in ABP proxy'leri (`getChecklistItems`/`addChecklistItem`/
  `toggleChecklistItem`/`deleteChecklistItem`).
- Produces: registry `checklist` entry `implemented:true, component: ChecklistTab`
  (`isCore` **false olarak kalır** — F3'ün "+" picker'ından eklenir/kaldırılır,
  navbar'da her zaman görünmez).

- [ ] **Step 1: hook'u `useTaskFeatures.js` deseniyle yaz (test dahil, aynı kalıp)**

`useTaskAttachments.test.jsx` ile birebir aynı yapıda (`renderHook` + `wrapper` +
`window.apya.platform.tasks.task.{getChecklistItems,addChecklistItem,
toggleChecklistItem,deleteChecklistItem}` mock'ları) 3 test yaz: liste yükleme,
ekleme sonrası tazeleme, toggle/silme sonrası tazeleme — `useTaskFeatures.test.jsx`
Step 1'deki testlerin metot adları değiştirilmiş hali. Ayrı kod bloğu tekrarlanmadı;
implementer bu iki dosyayı yan yana açıp isim eşlemesiyle uygulasın.

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function svc() {
    const s = window?.apya?.platform?.tasks?.task;
    if (!s) return null;
    return s;
}

function fetchItems(taskId) {
    const s = svc();
    if (!s) return Promise.reject(new Error('ABP görev servisi yüklenmedi.'));
    return Promise.resolve(s.getChecklistItems(taskId));
}

/** Görev kontrol listesi maddeleri — ekle/işaretle/sil. */
export function useTaskChecklist(taskId) {
    const queryClient = useQueryClient();
    const queryKey = ['task-checklist', taskId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchItems(taskId),
        enabled: Boolean(taskId),
        staleTime: 30_000,
        retry: false,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    const addMutation = useMutation({
        mutationFn: (text) => Promise.resolve(svc().addChecklistItem(taskId, text)),
        onSuccess: invalidate,
    });

    const toggleMutation = useMutation({
        mutationFn: (itemId) => Promise.resolve(svc().toggleChecklistItem(itemId)),
        onSuccess: invalidate,
    });

    const removeMutation = useMutation({
        mutationFn: (itemId) => Promise.resolve(svc().deleteChecklistItem(itemId)),
        onSuccess: invalidate,
    });

    return {
        items: query.data ?? [],
        isLoading: query.isLoading,
        addItem: addMutation.mutateAsync,
        toggleItem: toggleMutation.mutateAsync,
        removeItem: removeMutation.mutateAsync,
    };
}
```

- [ ] **Step 2: `ChecklistTab` component testini yaz (failing)**

```jsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChecklistTab } from './ChecklistTab';

function renderWithClient(ui) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
    window.apya = {
        platform: {
            tasks: {
                task: {
                    getChecklistItems: vi.fn(() => Promise.resolve([
                        { id: 'item-1', text: 'İlk madde', isDone: false },
                    ])),
                    addChecklistItem: vi.fn(() => Promise.resolve('item-2')),
                    toggleChecklistItem: vi.fn(() => Promise.resolve()),
                    deleteChecklistItem: vi.fn(() => Promise.resolve()),
                },
            },
        },
    };
});

describe('ChecklistTab', () => {
    it('maddeleri listeler', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        expect(await screen.findByText('İlk madde')).toBeInTheDocument();
    });

    it('checkbox tiklaninca toggleChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.click(screen.getByRole('checkbox'));
        await waitFor(() => expect(window.apya.platform.tasks.task.toggleChecklistItem).toHaveBeenCalledWith('item-1'));
    });

    it('yeni madde eklenince addChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.change(screen.getByPlaceholderText('Yeni madde'), { target: { value: 'İkinci madde' } });
        fireEvent.click(screen.getByRole('button', { name: /ekle/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.addChecklistItem).toHaveBeenCalledWith('t-1', 'İkinci madde'));
    });

    it('sil butonuna basinca deleteChecklistItem cagirir', async () => {
        renderWithClient(<ChecklistTab taskId="t-1" task={{ id: 't-1' }} />);
        await screen.findByText('İlk madde');
        fireEvent.click(screen.getByRole('button', { name: /ilk madde maddesini sil/i }));
        await waitFor(() => expect(window.apya.platform.tasks.task.deleteChecklistItem).toHaveBeenCalledWith('item-1'));
    });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- ChecklistTab`
Expected: FAIL — modül yok.

- [ ] **Step 4: `ChecklistTab`'ı yaz**

```jsx
import React, { useState } from 'react';
import { Button, Input } from '../../components/ui';
import { useTaskChecklist } from '../hooks/useTaskChecklist';

export function ChecklistTab({ taskId }) {
    const { items, addItem, toggleItem, removeItem } = useTaskChecklist(taskId);
    const [draft, setDraft] = useState('');

    const onAdd = async () => {
        const text = draft.trim();
        if (!text) return;
        await addItem(text);
        setDraft('');
    };

    return (
        <div className="space-y-[var(--apya-space-4)]">
            <div className="flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onAdd(); }}
                    placeholder="Yeni madde"
                />
                <Button variant="secondary" onClick={onAdd} disabled={!draft.trim()}>Ekle</Button>
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-text-tertiary">Henüz madde eklenmemiş.</p>
            ) : (
                <ul className="space-y-1.5">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between gap-2 py-1">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={item.isDone}
                                    onChange={() => toggleItem(item.id)}
                                />
                                <span className={item.isDone ? 'text-text-tertiary line-through' : 'text-text-primary'}>
                                    {item.text}
                                </span>
                            </label>
                            <Button variant="ghost" onClick={() => removeItem(item.id)} aria-label={`${item.text} maddesini sil`}>
                                Sil
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

- [ ] **Step 5: registry'yi güncelle**

`TaskFeatureRegistry.js:35-39`:

```js
    {
        code: 'checklist', title: 'Kontrol Listesi', icon: 'fa-square-check',
        category: 'gorev', isCore: false, order: 10, permission: null,
        implemented: true, component: ChecklistTab,
    },
```

Import ekle:

```js
import { ChecklistTab } from './components/ChecklistTab';
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- ChecklistTab useTaskChecklist`
Expected: PASS (hepsi)

Run: `npm test` + `npm run build`
Expected: tam suite PASS, bundle yeniden üretildi.

- [ ] **Step 7: Commit**

```bash
git add src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/hooks/useTaskChecklist.js src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/ChecklistTab.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/components/ChecklistTab.test.jsx src/Apya.Platform.Web/wwwroot/dynamic-assets/src/task-detail/TaskFeatureRegistry.js src/Apya.Platform.Web/wwwroot/js/task-detail.js
git commit -m "feat: ChecklistTab bileseni ekle ve registry'e bagla ("+" picker'dan eklenebilir)"
```

---

## Final: Whole-branch review + doğrulama

subagent-driven-development akışının gerektirdiği final adım — F1/F2/F3'te
task-scoped review'ların kaçırdığı sorunlar (derlenmemiş bundle, breadcrumb/dirty-guard
etkileşimi, cross-tab state tutarlılığı) burada da olabilir. Whole-branch review'da
özellikle şunlar kontrol edilmeli:

- `npm run build` çıktısı gerçekten son commit'te mi (`git status` temiz olmalı,
  `task-detail.js` diff'i her görev commit'ine dahil edilmiş olmalı).
- Context-switch sırasında dirty formda `switchToTask`/`navigateBreadcrumb`'ın
  `UnsavedChangesDialog`'u doğru tetiklediği (F2'nin dirty-guard dersi tekrarlanabilir).
- `dotnet build Apya.Platform.slnx` 0 hata, `dotnet test` tam yeşil, `npm test` tam yeşil.
- Canlı QA: `?taskui=v2` ile bir görev aç → alt görev ekle/tıkla/breadcrumb ile geri
  dön, dosya yükle/indir/sil, "+" picker'dan Kontrol Listesi ekle/madde
  ekle/işaretle/sil/kaldır — hepsi tarayıcıda ampirik doğrulanmalı (bu repoda
  "çalışıyor" demeden önce zorunlu, CLAUDE.md "Doğrulanabilir bitiş").

İlgili: [[project-task-detail-modal]], [[project-git-cleanup-2026-07-18]]
