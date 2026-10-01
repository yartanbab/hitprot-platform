import React from 'react';
import { createRoot } from 'react-dom/client';
import { IslandErrorBoundary } from '../components/ui/IslandErrorBoundary';

/**
 * Ada açılış kapısı — TÜM React adaları buradan açılır (RES-11, CAL-24).
 *
 * Kök EN DIŞTA hata sınırıyla sarılır (ThemeProvider/QueryProvider/ToastProvider/
 * SignalRProvider'ın da dışında): sağlayıcı hataları da yakalanır ve çökmede QueryClient ile
 * önbellek kalıcılaştırıcısının aboneliği birlikte sökülür (içeride kalsaydı kalıcılaştırıcı
 * bozuk veriyi yeniden yazardı). Sınırsız kökte React 18 istisnada kökün tamamını söküyor,
 * ada bembeyaz kalıyordu.
 *
 * Adayı doğrudan createRoot ile açma — islandMount.wiring.test.js kırılır.
 *
 * @param {Element} container        bağlama noktası
 * @param {string} name              ada adı: telemetri '[ada:<name>]', kartta data-island-error
 * @param {React.ReactNode} element  ada ağacı (sağlayıcılar dahil)
 * @returns {import('react-dom/client').Root}
 */
export function mountIsland(container, name, element) {
    const root = createRoot(container);
    root.render(<IslandErrorBoundary name={name}>{element}</IslandErrorBoundary>);
    return root;
}
