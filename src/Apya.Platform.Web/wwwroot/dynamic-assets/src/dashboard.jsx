import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { BentoDashboard } from './dashboard/BentoDashboard';
import './index.css';

/**
 * Dashboard entry — Razor sayfasından mount edilir.
 *
 * Razor side kullanım:
 *   <div id="apya-dashboard-root"></div>
 *   <script type="module" src="~/js/dashboard.js"></script>
 *
 * FOUC engelleme için _Layout.cshtml'in <head>'ine inline script eklenmiş
 * olmalı (bk. styles/README.md).
 */

const rootElement = document.getElementById('apya-dashboard-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <BentoDashboard />
        </ThemeProvider>,
    );
}
