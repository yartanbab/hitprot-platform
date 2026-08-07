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
 * Görev detay arayüzü artık KULLANICI TERCİHİ ile seçilir (varsayılan: yeni modal = v2).
 * Tercih sunucuda ABP kullanıcı ayarı (`Platform.TaskDetail.Ui`) olarak saklanır ve
 * `_TaskDetailIsland.cshtml` mount div'ine `data-taskui` olarak yazar. Kullanıcı bunu
 * "Genel Ayarlar" (/Settings) sayfasından değiştirir.
 *
 * QA/geçici override (kaydı değiştirmeden): sayfaya ?taskui=v2 veya ?taskui=v1 ekle.
 */
function isV2Enabled(container) {
    try {
        const param = new URLSearchParams(window.location.search).get('taskui');
        if (param === 'v2') return true;
        if (param === 'v1') return false;
    } catch (_) { /* URL okunamadı → kullanıcı tercihine düş */ }
    // Sunucuda çözülen kullanıcı tercihi: tanımsız/'v2' → yeni modal, yalnız 'v1' → eski drawer.
    return container?.dataset?.taskui !== 'v1';
}

/* ─── Mount ─────────────────────────────────────────────────────────── */
const container = document.getElementById('task-detail-island');
if (container) {
    window.apya = window.apya || {};
    window.apya.taskDetailV2Enabled = isV2Enabled(container);
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
