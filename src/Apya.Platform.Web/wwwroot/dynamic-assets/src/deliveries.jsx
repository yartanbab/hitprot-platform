/**
 * Deliveries Island — Faz C (teslim paketi kurucu + preflight + sürüm arşivi)
 * -----------------------------------------------------------------------
 * Bileşenler   : src/deliveries/* (DeliveriesRoot + PreflightDialog)
 * Sunucu köprüsü: src/deliveries/api.js → /Documents/Deliveries?handler=...
 * Stiller      : apya-shell.css §17/§17b (.apya-docs-*, .apya-doc-*), token-first
 *
 * Vite ile ES modülü olarak derlenir → /wwwroot/js/deliveries.js
 * Razor mount  : <div id="deliveries-island"></div>  (Documents/Deliveries.cshtml)
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { DeliveriesRoot } from './deliveries/DeliveriesRoot';

const container = document.getElementById('deliveries-island');
if (container) {
  createRoot(container).render(<DeliveriesRoot />);
}
