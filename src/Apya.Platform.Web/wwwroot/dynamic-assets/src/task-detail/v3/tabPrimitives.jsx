import React from 'react';
import { initialsOf, avatarColorOf } from './taskMetaV3';

/**
 * Sekme içeriklerinin paylaşılan görsel parçaları (V4 tasarım dili).
 * Prototipteki tekrar eden kalıplar tek yerde: kart, kart başlığı, boş durum,
 * satır rozeti, avatar ve biçimlendiriciler.
 */

export const TAB_CARD = 'rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden';

/** Kart üstü başlık şeridi — sol tarafta başlık + isteğe bağlı rozet, sağda aksiyon. */
export function TabCardHeader({ title, badge, action }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle">
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[13px] font-bold text-text-primary truncate">{title}</span>
                {badge}
            </div>
            {action}
        </div>
    );
}

/** Sayı rozeti (mono) — "3/5" gibi oranlar için. */
export function RatioBadge({ children, tone = 'positive' }) {
    const cls = tone === 'positive'
        ? 'bg-success-subtle text-success'
        : 'bg-neutral-subtle text-text-secondary';
    return (
        <span className={`flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${cls}`}>
            {children}
        </span>
    );
}

/** Durum/etiket rozeti — satır sonlarında kullanılır. */
export function RowBadge({ children, bg, fg }) {
    return (
        <span className={`flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${bg} ${fg}`}>
            {children}
        </span>
    );
}

export function TabEmptyState({ icon, title, description }) {
    return (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <i className={`fa-solid ${icon} text-xl text-text-tertiary`} />
            <span className="text-[13px] font-semibold text-text-primary">{title}</span>
            {description && <span className="text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]">{description}</span>}
        </div>
    );
}

export function Avatar({ name, size = 24 }) {
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold"
            style={{ height: size, width: size, background: avatarColorOf(name), fontSize: size * 0.4 }}
            title={name || undefined}
        >
            {initialsOf(name)}
        </span>
    );
}

/* ─── Biçimlendiriciler ─────────────────────────────────────────────── */

export const fmtShortDate = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' }).format(new Date(iso))
    : '—');

export const fmtDateTime = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
    : '');

export function fmtSize(bytes) {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
}

/** "5s 42dk" — süreleri ondalık saat yerine okunur biçimde. */
export function fmtDuration(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (!h && !m) return `${s}sn`;
    if (!h) return `${m}dk`;
    return m ? `${h}s ${m}dk` : `${h}s`;
}

/** Sayaç görünümü — HH:MM:SS, tabular hizalı. */
export function fmtClock(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds || 0));
    const p = (n) => String(n).padStart(2, '0');
    return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
}

const FILE_KINDS = {
    pdf:   { icon: 'fa-file-pdf',   bg: 'bg-negative-subtle', fg: 'text-negative' },
    image: { icon: 'fa-image',      bg: 'bg-primary-subtle',  fg: 'text-primary' },
    doc:   { icon: 'fa-file-word',  bg: 'bg-primary-subtle',  fg: 'text-primary' },
    sheet: { icon: 'fa-file-excel', bg: 'bg-success-subtle',  fg: 'text-success' },
    code:  { icon: 'fa-file-code',  bg: 'bg-success-subtle',  fg: 'text-success' },
    zip:   { icon: 'fa-file-zipper', bg: 'bg-warning-subtle', fg: 'text-warning' },
    other: { icon: 'fa-file',       bg: 'bg-neutral-subtle',  fg: 'text-text-secondary' },
};

export function fileKindOf(fileName = '') {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'pdf') return FILE_KINDS.pdf;
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return FILE_KINDS.image;
    if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext)) return FILE_KINDS.doc;
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return FILE_KINDS.sheet;
    if (['json', 'js', 'ts', 'cs', 'xml', 'yml', 'yaml', 'sql'].includes(ext)) return FILE_KINDS.code;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FILE_KINDS.zip;
    return FILE_KINDS.other;
}
