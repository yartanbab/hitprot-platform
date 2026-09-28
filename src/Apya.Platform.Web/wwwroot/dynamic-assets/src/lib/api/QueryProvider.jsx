import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createApyaQueryClient } from './queryClient';
import { createApyaPersistOptions } from './queryPersister';
import { invalidateOlderThanLastChange } from './dataChanged';

/**
 * QueryProvider — module top-level singleton DEĞİL; useState ile per-mount
 * (HMR/test'te leak olmasın). Production'da tek instance.
 *
 * Önbellek sayfa yüklemeleri arasında sessionStorage'da yaşar (bkz.
 * queryPersister.js). Kalıcılaştırma mümkün değilse (gizli sekme, anonim
 * bağlam) düz QueryClientProvider'a düşülür — davranış eskisiyle aynı.
 * Restore edilen görev türevi sorgular son yazmadan (bkz. dataChanged.js)
 * eskiyse bayat işaretlenir; ilk kare önbellekten gelir, sonra tazelenir.
 * onSuccess bilerek promise DÖNDÜRMEZ: restore'un bitişi bunu beklemesin.
 */
export function QueryProvider({ children }) {
    const [client] = useState(() => createApyaQueryClient());
    const [persistOptions] = useState(() => createApyaPersistOptions());

    if (!persistOptions) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
    }

    return (
        <PersistQueryClientProvider
            client={client}
            persistOptions={persistOptions}
            onSuccess={() => { invalidateOlderThanLastChange(client); }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}
