import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createApyaQueryClient } from './queryClient';
import { createApyaPersistOptions } from './queryPersister';

/**
 * QueryProvider — module top-level singleton DEĞİL; useState ile per-mount
 * (HMR/test'te leak olmasın). Production'da tek instance.
 *
 * Önbellek sayfa yüklemeleri arasında sessionStorage'da yaşar (bkz.
 * queryPersister.js). Kalıcılaştırma mümkün değilse (gizli sekme, anonim
 * bağlam) düz QueryClientProvider'a düşülür — davranış eskisiyle aynı.
 */
export function QueryProvider({ children }) {
    const [client] = useState(() => createApyaQueryClient());
    const [persistOptions] = useState(() => createApyaPersistOptions());

    if (!persistOptions) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }

    return (
        <PersistQueryClientProvider client={client} persistOptions={persistOptions}>
            {children}
        </PersistQueryClientProvider>
    );
}
