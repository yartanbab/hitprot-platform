import React from 'react';
import { mountIsland } from './lib/mountIsland';
import { ThemeProvider } from './lib/theme/ThemeProvider';
import { QueryProvider } from './lib/api/QueryProvider';
import { ToastProvider } from './lib/feedback';
import { ExpenseCaptureFlow } from './expense/ExpenseCaptureFlow';
import { registerServiceWorker } from './lib/pwa/registerServiceWorker';
import './index.css';

registerServiceWorker();

const rootElement = document.getElementById('apya-expense-capture-root');
if (rootElement) {
    mountIsland(rootElement, 'expense-capture',
        <ThemeProvider>
            <QueryProvider>
                <ToastProvider>
                    <ExpenseCaptureFlow />
                </ToastProvider>
            </QueryProvider>
        </ThemeProvider>,
    );
}
