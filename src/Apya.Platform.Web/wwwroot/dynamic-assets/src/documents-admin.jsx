/**
 * Documents Admin Island — Faz D (yonetim ekrani, 6 modul)
 * -----------------------------------------------------------------------
 * Bilesenler   : src/documents-admin/* (AdminRoot + RuleEditor)
 * Sunucu koprusu: src/documents-admin/api.js -> /Documents/Admin?handler=...
 * Stiller      : apya-shell.css §17/§17b + §17c (.apya-doc-rule-block)
 *
 * Vite ile ES modulu olarak derlenir -> /wwwroot/js/documents-admin.js
 * Razor mount  : <div id="documents-admin-island"></div>
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AdminRoot } from './documents-admin/AdminRoot';

const container = document.getElementById('documents-admin-island');
if (container) {
  createRoot(container).render(<AdminRoot />);
}
