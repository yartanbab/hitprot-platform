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
 * Görev detay arayüzü artık KULLANICI TERCİHİ ile seçilir (varsayılan: yeni modal = v2).
 * Tercih sunucuda ABP kullanıcı ayarı (`Platform.TaskDetail.Ui`) olarak saklanır ve
 * `_TaskDetailIsland.cshtml` mount div'ine `data-taskui` olarak yazar. Kullanıcı bunu
 * "Genel Ayarlar" (/Settings) sayfasından değiştirir.
 *
 * QA/geçici override (kaydı değiştirmeden): sayfaya ?taskui=v2 veya ?taskui=v1 ekle.
 */
function isV2Enabled() {
    try {
        const param = new URLSearchParams(window.location.search).get('taskui');
        if (param === 'v2') return true;
        if (param === 'v1') return false;
    } catch (_) { /* URL okunamadı → kullanıcı tercihine düş */ }
    // Sunucuda çözülen kullanıcı tercihi (data-taskui): tanımsız/'v2' → yeni modal,
    // yalnız 'v1' → eski drawer. localStorage tabanlı eski yolun yerini bu aldı.
    // Container'ı burada okuyoruz ki main'deki çağrı yeri (argümansız) değişmesin.
    const container = document.getElementById('task-detail-island');
    return container?.dataset?.taskui !== 'v1';
}

function isV3Enabled() {
    try {
        if (new URLSearchParams(window.location.search).get('taskui') === 'v3') return true;
        if (new URLSearchParams(window.location.search).get('taskui') === 'v2') return false;
        if (new URLSearchParams(window.location.search).get('taskui') === 'v1') return false;
        const enabled = window.localStorage.getItem('apya.taskDetail.v3') === '1';
        return enabled || true; /* V3 şimdilik varsayılan yapıyoruz! */
    } catch (_) {
        return true;
    }
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

