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
 * FAZ 2 BAYRAK: hâlâ VARSAYILAN KAPALI — bilinçli karar (whole-branch review, 2026-08-05).
 * Genel sekmesi artık çalışıyor ama eski `EditModal.cshtml` drawer'ında olup V2'de henüz
 * olmayan sekmeler var: Alt Görevler, Dosyalar, Finans, Bağımlılıklar, Zaman Takibi,
 * Yorumlar — bunlar Faz 3/4/6/7/8'de gelecek. Varsayılanı şimdi açmak tüm kullanıcılar
 * için bu özellikleri kaybettirir. Faz 4 (Alt Görevler + Dosyalar) bitince yeniden
 * değerlendirilecek.
 *
 * Açma yolları (opt-in, değişmedi):
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
