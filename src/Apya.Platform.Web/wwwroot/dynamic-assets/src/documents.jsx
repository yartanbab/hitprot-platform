/**
 * Documents Island — Faz A (belge listesi + meta şema)
 * -----------------------------------------------------------------------
 * Bileşenler   : src/documents/* (DocumentsRoot + components/)
 * Sunucu köprüsü: src/documents/api.js
 *   - Klasör/sayfa CRUD'u ABP dinamik proxy (window.apya.platform.documents.document)
 *   - Belge (DocumentFile) uçları Razor Page handler'ları (/Documents?handler=...)
 * Stiller      : apya-shell.css §17 (.apya-docs-*) + §17b (.apya-doc-*), token-first
 * İkonlar      : Font Awesome (LeptonX) — className="fa fa-..."
 *
 * Vite ile ES modülü olarak derlenir → /wwwroot/js/documents.js
 * Razor mount  : <div id="documents-island"></div>  (Documents/Index.cshtml)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DocumentsRoot } from './documents/DocumentsRoot';

const container = document.getElementById('documents-island');
if (container) {
  createRoot(container).render(<DocumentsRoot />);
}
