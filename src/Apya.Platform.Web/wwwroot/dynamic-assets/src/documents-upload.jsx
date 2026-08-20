/**
 * Yukleme kuyrugu adasi.
 *
 * Vite -> /wwwroot/js/documents-upload.js
 * Mount: #upload-queue-island (Documents/Upload.cshtml)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { UploadRoot } from './documents-upload/UploadRoot';

const el = document.getElementById('upload-queue-island');
if (el) {
  createRoot(el).render(<UploadRoot />);
}
