import React, { useMemo, useState } from 'react';
import { statusOf, priorityOf, dueUrgency } from '../taskMetaV3';
import { TAB_CARD, RowBadge, Avatar, TabEmptyState, fmtShortDate } from '../tabPrimitives';

/**
 * Tablo sekmesi (V3) — alt görevlerin sıralanabilir, kolonlu görünümü.
 *
 * SALT OKUMA + tek yazma yolu: satıra tıklamak alt görev panelini açar (asıl
 * düzenleme orada yapılır). Veri kaynağı görevin kendi `subTasks` koleksiyonudur,
 * yani ek istek YOK — Alt Görevler sekmesiyle aynı veriyi farklı biçimde gösterir.
 * Yeni şema YOK.
 */

const COLUMNS = [
    { key: 'title',    label: 'Başlık',   align: 'left'  },
    { key: 'status',   label: 'Durum',    align: 'left'  },
    { key: 'priority', label: 'Öncelik',  align: 'left'  },
    { key: 'assignee', label: 'Atanan',   align: 'left'  },
    { key: 'dueDate',  label: 'Termin',   align: 'right' },
];

/** Sıralama anahtarı — null/undefined DAİMA sona düşsün diye ayrı işaretlenir. */
function sortValue(sub, key) {
    switch (key) {
        case 'title':    return (sub.title || '').toLocaleLowerCase('tr');
        case 'status':   return sub.status ?? -1;
        case 'priority': return sub.priority ?? -1;
        case 'assignee': return (sub.assigneeName || '').toLocaleLowerCase('tr');
        case 'dueDate':  return sub.dueDate ? new Date(sub.dueDate).getTime() : null;
        default:         return null;
    }
}

function compare(a, b, key, dir) {
    const va = sortValue(a, key);
    const vb = sortValue(b, key);
    const emptyA = va === null || va === '';
    const emptyB = vb === null || vb === '';
    if (emptyA && emptyB) return 0;
    if (emptyA) return 1;   // boşlar yönden BAĞIMSIZ olarak sonda
    if (emptyB) return -1;
    if (va === vb) return 0;
    return (va < vb ? -1 : 1) * (dir === 'asc' ? 1 : -1);
}

export function SubtaskTableTabV3({ task = {}, onOpenSubtask }) {
    const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });
    const subtasks = task?.subTasks ?? [];

    const rows = useMemo(
        () => [...subtasks].sort((a, b) => compare(a, b, sort.key, sort.dir)),
        [subtasks, sort.key, sort.dir],
    );

    const toggleSort = (key) => setSort((s) => (
        s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    ));

    if (subtasks.length === 0) {
        return (
            <TabEmptyState
                icon="fa-table"
                title="Alt görev yok"
                description="Alt Görevler sekmesinden ekledikleriniz burada tablo olarak listelenir."
            />
        );
    }

    return (
        <div className={`${TAB_CARD} overflow-x-auto`}>
            <table className="w-full border-collapse text-[12.5px]">
                <thead>
                    <tr className="bg-surface-raised">
                        {COLUMNS.map((col) => {
                            const active = sort.key === col.key;
                            return (
                                <th
                                    key={col.key}
                                    scope="col"
                                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    className={`px-3.5 py-2.5 border-b border-subtle font-bold text-text-secondary whitespace-nowrap ${
                                        col.align === 'right' ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSort(col.key)}
                                        className={`inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer font-bold ${
                                            active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        {col.label}
                                        <i className={`fa-solid text-[9px] ${
                                            active
                                                ? (sort.dir === 'asc' ? 'fa-arrow-up-short-wide' : 'fa-arrow-down-wide-short')
                                                : 'fa-sort opacity-40'
                                        }`} />
                                    </button>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((sub) => {
                        const st = statusOf(sub.status);
                        const pr = priorityOf(sub.priority);
                        const due = dueUrgency(sub.dueDate);
                        // Satırın tamamı fare için tıklanabilir, ama `role`u
                        // DEĞİŞTİRİLMEZ — `role="button"` konsaydı satır artık tablo
                        // satırı sayılmaz, ekran okuyucu ızgarayı kaybederdi. Klavye
                        // ve AT yolu başlık hücresindeki gerçek düğmedir.
                        return (
                            <tr
                                key={sub.id}
                                onClick={() => onOpenSubtask?.(sub.id)}
                                className="border-b border-subtle last:border-b-0 cursor-pointer hover:bg-surface-raised"
                            >
                                <td className="px-3.5 py-2.5 max-w-[320px]">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onOpenSubtask?.(sub.id); }}
                                        title={sub.title}
                                        className={`block w-full truncate bg-transparent border-0 p-0 text-left font-semibold cursor-pointer ${
                                            sub.status === 4 ? 'line-through text-text-tertiary' : 'text-text-primary'
                                        }`}
                                    >
                                        {sub.title}
                                    </button>
                                    {sub.code && <div className="font-mono text-[11px] text-text-tertiary">{sub.code}</div>}
                                </td>
                                {/* RowBadge `display:flex` — sarmalayıcı olmadan hücrenin
                                    tamamına yayılır; flex kabında içerik boyutunda kalır. */}
                                <td className="px-3.5 py-2.5">
                                    <span className="flex">
                                        <RowBadge bg={st.bg} fg={st.fg}>
                                            <i className={`fa-solid ${st.icon} text-[9px] mr-1`} />
                                            {st.label}
                                        </RowBadge>
                                    </span>
                                </td>
                                <td className="px-3.5 py-2.5">
                                    <span className="flex">
                                        <RowBadge bg={pr.bg} fg={pr.fg}>
                                            <i className={`fa-solid ${pr.icon} text-[9px] mr-1`} />
                                            {pr.label}
                                        </RowBadge>
                                    </span>
                                </td>
                                <td className="px-3.5 py-2.5">
                                    {sub.assigneeName ? (
                                        <span className="flex items-center gap-2 min-w-0">
                                            <Avatar name={sub.assigneeName} size={22} />
                                            <span className="truncate text-text-secondary">{sub.assigneeName}</span>
                                        </span>
                                    ) : (
                                        <span className="text-text-tertiary">Atanmadı</span>
                                    )}
                                </td>
                                <td className={`px-3.5 py-2.5 text-right whitespace-nowrap ${due.tone}`}>
                                    {sub.dueDate ? fmtShortDate(sub.dueDate) : '—'}
                                    {due.hint && <div className="text-[11px]">{due.hint}</div>}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
