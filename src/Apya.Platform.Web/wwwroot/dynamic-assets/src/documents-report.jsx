/**
 * Rapor Derleyici adasi — Bolumler / Onizleme / Dagitim.
 *
 * Vite -> /wwwroot/js/documents-report.js
 * Mount: #report-builder-island (Documents/ReportBuilder.cshtml)
 */
import React from 'react';
import { mountIsland } from './lib/mountIsland';
import './index.css';
import { ReportBuilderRoot } from './documents-report/ReportBuilderRoot';

const el = document.getElementById('report-builder-island');
if (el) {
  mountIsland(el, 'documents-report', <ReportBuilderRoot />);
}
