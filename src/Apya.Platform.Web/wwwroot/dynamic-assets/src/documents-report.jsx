/**
 * Rapor Derleyici adasi — Bolumler / Onizleme / Dagitim.
 *
 * Vite -> /wwwroot/js/documents-report.js
 * Mount: #report-builder-island (Documents/ReportBuilder.cshtml)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ReportBuilderRoot } from './documents-report/ReportBuilderRoot';

const el = document.getElementById('report-builder-island');
if (el) {
  createRoot(el).render(<ReportBuilderRoot />);
}
