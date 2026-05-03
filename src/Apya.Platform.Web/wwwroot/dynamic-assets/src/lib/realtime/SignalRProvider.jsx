import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

/**
 * SignalRProvider — tek persistent connection per dashboard mount.
 * Hub URL prop'u ile değiştirilebilir; default `/signalr-hubs/notifications`
 * (ABP'nin standardı + APYA-82 task hub'ı).
 *
 * Auth: cookie session (withCredentials). Token plumbing yok.
 *
 * Connection lifecycle:
 *   - mount → start
 *   - unmount → stop (idempotent)
 *   - ağ koparsa exponential backoff ile auto-reconnect
 */

const SignalRContext = createContext({
    connection: null,
    state: HubConnectionState.Disconnected,
});

export function SignalRProvider({ hubUrl = '/signalr-hubs/notifications', children, enabled = true }) {
    const [state, setState] = useState(HubConnectionState.Disconnected);
    const connectionRef = useRef(null);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return undefined;

        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl, { withCredentials: true })
            .withAutomaticReconnect([0, 2000, 5000, 10_000, 30_000])
            .configureLogging(LogLevel.Warning)
            .build();

        connectionRef.current = connection;
        setState(connection.state);

        const sync = () => setState(connection.state);
        connection.onreconnecting(sync);
        connection.onreconnected(sync);
        connection.onclose(sync);

        connection.start()
            .then(sync)
            .catch((err) => {
                /* ABP hub yoksa veya endpoint kapalıysa sessizce graceful degrade —
                   widget'lar polling'e (refetchOnWindowFocus) düşer. */
                console.warn('[SignalR] connect failed:', err?.message);
                sync();
            });

        return () => {
            connection.stop().catch(() => { /* unmount, ignore */ });
            connectionRef.current = null;
        };
    }, [hubUrl, enabled]);

    const value = useMemo(() => ({
        get connection() { return connectionRef.current; },
        state,
    }), [state]);

    return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>;
}

export function useSignalR() {
    return useContext(SignalRContext);
}
