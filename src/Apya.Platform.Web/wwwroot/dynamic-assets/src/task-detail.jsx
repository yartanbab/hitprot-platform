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
