/**
 * Project Panels Island — Proje Detayı'nın V3 katalog panelleri (PR-2b)
 * ---------------------------------------------------------------------
 * TEK bundle, DÖRT mount noktası (documents-project island'ıyla aynı desen):
 * Belge / Form / Kontrol Listesi / Bağımlılıklar —
 * Pages/Projects/ProjectDetails.cshtml'deki .view-panel kaplarına mount olur.
 *
 * TEMBEL yükleme: her panel, sekmesi İLK gösterildiğinde veri çeker.
 * ProjectDetails.js switchView'da `apya:project-panel-shown` olayı yayınlar;
 * kökler kendi kind'ını dinler (usePanel.js → usePanelShown).
 *
 * Vite → /wwwroot/js/project-panels.js
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DocumentsPanel } from './project-panels/DocumentsPanel';
import { FormsPanel } from './project-panels/FormsPanel';
import { ChecklistPanel } from './project-panels/ChecklistPanel';
import { DependenciesPanel } from './project-panels/DependenciesPanel';

const PANELS = [
    ['view-documents', 'documents', DocumentsPanel],
    ['view-forms', 'forms', FormsPanel],
    ['view-checklist', 'checklist', ChecklistPanel],
    ['view-dependencies', 'dependencies', DependenciesPanel],
];

for (const [elementId, kind, Panel] of PANELS) {
    const el = document.getElementById(elementId);
    const projectId = el?.getAttribute('data-project-id');
    if (el && projectId) {
        createRoot(el).render(<Panel projectId={projectId} kind={kind} mountEl={el} />);
    }
}
