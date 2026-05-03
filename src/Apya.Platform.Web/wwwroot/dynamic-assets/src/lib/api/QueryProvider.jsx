import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createApyaQueryClient } from './queryClient';

/**
 * QueryProvider — module top-level singleton DEĞİL; useState ile per-mount
 * (HMR/test'te leak olmasın). Production'da tek instance.
 */
export function QueryProvider({ children }) {
    const [client] = useState(() => createApyaQueryClient());
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
