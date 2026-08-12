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
import { TaskDetailRootV3 } from './task-detail/v3/TaskDetailRootV3';
import { taskDetailStore } from './task-detail/taskDetailStore';
import { readTaskIdFromUrl } from './task-detail/hooks/useTaskUrlSync';

function TaskDetailIsland() {
    const taskId = useSyncExternalStore(
        taskDetailStore.subscribe,
        taskDetailStore.getSnapshot,
        () => null,
    );

    if (!taskId) return null;

    if (window.apya?.taskDetailV3Enabled) {
        return (
            <QueryProvider>
                <TaskDetailRootV3
                    key={taskId}
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

    return (
        <QueryProvider>
            <TaskDetailRoot
                key={taskId}
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
 * Görev detay arayüzü KULLANICI TERCİHİ ile seçilir; tercih sunucuda ABP kullanıcı
 * ayarı (`Platform.TaskDetail.Ui`) olarak saklanır ve "Genel Ayarlar" (/Settings)
 * sayfasından değiştirilir.
 *
 * Etkin arayüz TEK yerden çözülür: sunucuda hesaplanan kullanıcı tercihi
 * (`Platform.TaskDetail.Ui` → `_TaskDetailIsland.cshtml`'in `data-taskui` özniteliği).
 * `?taskui=v1|v2|v3` yalnız QA içindir, kaydı değiştirmeden geçici olarak ezer.
 * Tanımsız/tanınmayan değer → 'v3' (PlatformSettingDefaults.TaskDetailUi ile aynı).
 */
function resolveTaskUi() {
    try {
        const param = new URLSearchParams(window.location.search).get('taskui');
        if (param === 'v1' || param === 'v2' || param === 'v3') return param;
    } catch (_) { /* URL okunamadı → kullanıcı tercihine düş */ }
    const container = document.getElementById('task-detail-island');
    const pref = container?.dataset?.taskui;
    return (pref === 'v1' || pref === 'v2') ? pref : 'v3';
}

function isV2Enabled() {
    return resolveTaskUi() === 'v2';
}

function isV3Enabled() {
    return resolveTaskUi() === 'v3';
}

/* ─── Global API & Auto-Mount ────────────────────────────────────────── */
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = isV3Enabled();
window.apya.taskDetailV2Enabled = isV2Enabled() && !window.apya.taskDetailV3Enabled;

// Gerçek API nesnesi
const taskDetailApi = {
    open: (arg) => { taskDetailStore.open(arg); },
    close: () => taskDetailStore.close(),
    onResult: (fn) => taskDetailStore.onResult(fn),
};

// Eğer _TaskDetailIsland'daki kuyruk köprüsü kurulduysa — gerçek API ile değiştir
// ve kuyruktaki bekleyen ID'yi hemen aç
if (typeof window.apya._taskDetailFlush === 'function') {
    window.apya._taskDetailFlush(taskDetailApi);
} else {
    // Köprü yoksa (sayfa başka yapıda) doğrudan bağla
    window.apya.taskDetail = taskDetailApi;
}

function mountIsland() {
    let container = document.getElementById('task-detail-island');
    if (!container) {
        container = document.createElement('div');
        container.id = 'task-detail-island';
        document.body.appendChild(container);
    }
    if (!container._reactRoot) {
        container._reactRoot = createRoot(container);
        container._reactRoot.render(<TaskDetailIsland />);
    }

    /* Derin bağlantı: /Tasks?task=<guid> ile gelindiyse doğrudan aç. */
    if (window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
        const deepLinkId = readTaskIdFromUrl();
        if (deepLinkId) taskDetailStore.open(deepLinkId);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountIsland);
} else {
    mountIsland();
}

function TaskDetailPageIsland({ taskId }) {
    const handleClose = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/Tasks';
        }
    };

    if (window.apya?.taskDetailV3Enabled) {
        return (
            <QueryProvider>
                <TaskDetailRootV3
                    taskId={taskId}
                    presentation="page"
                    onClose={handleClose}
                />
            </QueryProvider>
        );
    }

    return (
        <QueryProvider>
            <TaskDetailRoot
                taskId={taskId}
                presentation="page"
                onClose={handleClose}
            />
        </QueryProvider>
    );
}

const pageContainer = document.getElementById('task-detail-page-island');
if (pageContainer) {
    const pageTaskId = pageContainer.getAttribute('data-task-id');
    if (pageTaskId) {
        createRoot(pageContainer).render(<TaskDetailPageIsland taskId={pageTaskId} />);
    }
}

