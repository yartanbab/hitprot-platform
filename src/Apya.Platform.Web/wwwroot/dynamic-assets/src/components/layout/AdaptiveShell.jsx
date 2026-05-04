import React from 'react';
import { useDeviceMode } from '../../lib/device/useDeviceMode';
import { cn } from '../../lib/utils';

/**
 * AdaptiveShell — aktif device mode'a karşılık gelen sub-tree'yi mount eder.
 *
 * Tasarım kararı: CSS `display:none` ile gizleme YASAK.
 * Aksi halde mount edilmiş ama görünmeyen tree state taşır, query çağırır,
 * bundle'a gereksiz render maliyeti biner. Bu component yalnızca aktif slot'u
 * tree'ye koyar; diğerleri JSX olarak eval edilse de React tarafından mount
 * edilmez (slot prop'ları unmount olarak kalır).
 *
 * Fallback zinciri (dar → geniş): decision → triage → analysis → command
 * Aktif mod için slot verilmediyse bir alttaki en yakın slot kullanılır.
 * Böylece sadece "decision" verip diğer modlarda da çalışmasını sağlayabilirsin.
 *
 * Kullanım:
 *   <AdaptiveShell
 *     decision={<MobileExpenseCapture />}
 *     triage={<TabletApprovals />}
 *     analysis={<DesktopDashboard />}
 *   />
 */
export function AdaptiveShell({ decision, triage, analysis, command, className, ...rest }) {
    const mode = useDeviceMode();
    const slot = pickSlot(mode, { decision, triage, analysis, command });

    return (
        <div className={cn('apya-adaptive-shell', className)} data-mode={mode} {...rest}>
            {slot}
        </div>
    );
}

/* Geniş → dar yönde fallback. Aktif mod için slot tanımlıysa onu döner;
   yoksa bir alta düşerek ilk tanımlı slot'u bulur. Tüm slot'lar undefined ise
   null döner — caller'ın sorumluluğunda. */
function pickSlot(mode, slots) {
    const order = ['command', 'analysis', 'triage', 'decision'];
    const start = order.indexOf(mode);
    for (let i = start; i < order.length; i++) {
        const candidate = slots[order[i]];
        if (candidate !== undefined) return candidate;
    }
    return null;
}
