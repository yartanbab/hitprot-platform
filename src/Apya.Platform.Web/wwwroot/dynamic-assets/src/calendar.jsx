import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { DeviceModeProvider } from './lib/device';
import { QueryProvider } from './lib/api/QueryProvider';
import { CalendarRoot } from './calendar/CalendarRoot';
import './index.css';

/**
 * Takvim island — /Calendars sayfasından mount edilir.
 *
 * Veri TEK uçtan gelir: /api/app/calendar/feed (CalendarAppService.GetFeedAsync).
 * Yerleşim kırılımları viewport'a DEĞİL, ölçülen KAP genişliğine bakar
 * (bkz. hooks/useContainerWidth.js) — kenar çubuğu açıkken viewport yanıltır.
 *
 * Vite çıktısı: /wwwroot/js/calendar.js
 */
const rootElement = document.getElementById('apya-calendar-root');
if (rootElement) {
    createRoot(rootElement).render(
        <ThemeProvider>
            <DeviceModeProvider>
                <QueryProvider>
                    <CalendarRoot />
                </QueryProvider>
            </DeviceModeProvider>
        </ThemeProvider>,
    );
}
