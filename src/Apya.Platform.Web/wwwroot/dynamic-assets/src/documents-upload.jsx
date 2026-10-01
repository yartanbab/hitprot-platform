/**
 * Yukleme kuyrugu adasi.
 *
 * Vite -> /wwwroot/js/documents-upload.js
 * Mount: #upload-queue-island (Documents/Upload.cshtml)
 */
import React from 'react';
import { mountIsland } from './lib/mountIsland';
import './index.css';
import { UploadRoot } from './documents-upload/UploadRoot';

const el = document.getElementById('upload-queue-island');
if (el) {
  mountIsland(el, 'documents-upload', <UploadRoot />);
}
