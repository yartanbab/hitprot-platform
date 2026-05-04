import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { QueryProvider } from './lib/api/QueryProvider';
import { SignalRProvider } from './lib/realtime/SignalRProvider';
import { DeviceModeProvider } from './lib/device';
import { BentoDashboard } from './dashboard/BentoDashboard';
import { DashboardRealtimeBridge } from './dashboard/DashboardRealtimeBridge';
import { registerServiceWorker } from './lib/pwa/registerServiceWorker';
import './index.css';

/* PWA — install + push handler. Sessizce çalışır, hata UI'a yansımaz. */
registerServiceWorker();

/**
 * Dashboard entry — Razor sayfasından mount edilir.
 *
 * Provider sırası önemli:
 *   ThemeProvider       → DOM-level (data-theme), en dış
 *   DeviceModeProvider  → DOM-level (data-device-mode); UI'a hangi mod aktif
 *                         olduğunu yayınlar, alt component'lar useDeviceMode ile okur
 *   QueryProvider       → server state cache
 *   SignalRProvider     → realtime; QueryProvider'a bağımlı (invalidation hook'u
 *                         useQueryClient çağırır)
 *
 * DashboardRealtimeBridge — null render eden bridge component;
 * mapping'leri tek yerde tutar, BentoDashboard'ı kirletmez.
 */

const rootElement = document.getElementById('apya-dashboard-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <DeviceModeProvider>
                <QueryProvider>
                    <SignalRProvider>
                        <DashboardRealtimeBridge />
                        <BentoDashboard />
                    </SignalRProvider>
                </QueryProvider>
            </DeviceModeProvider>
        </ThemeProvider>,
    );
}
