import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { QueryProvider } from './lib/api/QueryProvider';
import { ExpenseCaptureFlow } from './expense/ExpenseCaptureFlow';
import { registerServiceWorker } from './lib/pwa/registerServiceWorker';
import './index.css';

registerServiceWorker();

const rootElement = document.getElementById('apya-expense-capture-root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ThemeProvider>
            <QueryProvider>
                <ExpenseCaptureFlow />
            </QueryProvider>
        </ThemeProvider>,
    );
}
