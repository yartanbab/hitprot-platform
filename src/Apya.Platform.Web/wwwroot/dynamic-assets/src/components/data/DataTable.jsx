import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';

/**
 * DataTable — virtualize edilmiş, density-aware, sticky-header tablosu.
 *
 * Tasarım kararları (UX strategy doc § 3):
 *   - Tablo `analysis` ve `command` modlarının primitif'i; `decision`/`triage`
 *     modunda bu component KULLANILMAMALI (mobile'da tablo yasak — strategy § 3).
 *   - Virtualization 50+ satırda otomatik; küçük listelerde overhead'siz fallback.
 *   - Sticky leading column: tek column. Çoklu sticky için yatay scroll
 *     karmaşıklaşır — ileride ihtiyaç olursa ayrı flag (`stickyColumns: 2`) eklenir.
 *   - Sort: tek-column; çoklu sort B2B'de nadir, kullanıcıyı yorar.
 *   - Selection opsiyonel: caller `selectable={true}` derse leftmost'a checkbox
 *     ekler. State controlled (`selected`/`onSelectedChange`).
 *
 * Kolon tanımı (kontrat):
 *   {
 *     id: 'amount',                 // queryKey-friendly stable id
 *     header: 'Tutar',              // string ya da ReactNode
 *     accessor: row => row.amount,  // function veya string-key
 *     cell: (value, row) => <...>,  // custom renderer (opsiyonel)
 *     align: 'left'|'right'|'center',  // default 'left' (sayılar için 'right')
 *     width: '120px'|'1fr'|number,  // CSS grid track value
 *     sortable: true,                // default false
 *     sortFn: (a, b, dir) => number, // custom comparator (opsiyonel)
 *     numeric: true,                 // tabular-nums + sağ hizala otomatik
 *     sticky: true,                  // sticky leading column (sadece 1 kolona ver)
 *   }
 *
 * Kullanım örneği:
 *   <DataTable
 *     rows={expenses}
 *     columns={[
 *       { id: 'date', header: 'Tarih', accessor: 'date', sortable: true, width: '110px' },
 *       { id: 'vendor', header: 'Satıcı', accessor: 'vendor', sticky: true, width: '220px' },
 *       { id: 'amount', header: 'Tutar', accessor: 'amount', numeric: true, sortable: true, width: '140px',
 *         cell: (v) => formatMoney(v, 'TRY') },
 *     ]}
 *     density="cozy"
 *     getRowId={(r) => r.id}
 *   />
 */

const DENSITY = {
    compact:     { row: 32, header: 36, padX: 'px-2', padY: 'py-1', text: 'text-xs' },
    cozy:        { row: 44, header: 40, padX: 'px-3', padY: 'py-1.5', text: 'text-sm' },
    comfortable: { row: 56, header: 44, padX: 'px-4', padY: 'py-2', text: 'text-sm' },
};

const VIRTUALIZE_THRESHOLD = 50;

function resolveAccessor(accessor) {
    if (typeof accessor === 'function') return accessor;
    if (typeof accessor === 'string') return (row) => row[accessor];
    return () => undefined;
}

function defaultCompare(a, b) {
    if (a === b) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), 'tr');
}

function DataTable({
    rows,
    columns,
    density = 'cozy',
    getRowId = (row, i) => row.id ?? i,
    onRowClick,
    selectable = false,
    selected,                /* Set<id> ya da Array<id> — controlled */
    onSelectedChange,
    initialSort = null,      /* { columnId, direction: 'asc'|'desc' } */
    emptyState,              /* ReactNode — boş durum */
    className,
    height = 480,            /* px — viewport height; virtualizer buna göre window'lar */
    'aria-label': ariaLabel = 'Veri tablosu',
}) {
    const dens = DENSITY[density] ?? DENSITY.cozy;
    const [sort, setSort] = useState(initialSort);
    const scrollRef = useRef(null);

    /* Sıralama — tek-column; null sıralama yok (kullanıcı 3 kez tıklarsa yine asc).
       Ham `rows` mutate edilmez; sıralı kopya tutulur. */
    const sortedRows = useMemo(() => {
        if (!sort) return rows;
        const col = columns.find((c) => c.id === sort.columnId);
        if (!col) return rows;
        const get = resolveAccessor(col.accessor);
        const cmp = col.sortFn ?? ((a, b) => defaultCompare(get(a), get(b)));
        const dir = sort.direction === 'desc' ? -1 : 1;
        return [...rows].sort((a, b) => cmp(a, b) * dir);
    }, [rows, columns, sort]);

    /* Selection set — caller Array da gönderse normalize ederiz */
    const selectedSet = useMemo(() => {
        if (selected instanceof Set) return selected;
        if (Array.isArray(selected)) return new Set(selected);
        return new Set();
    }, [selected]);

    const allSelected = selectable && rows.length > 0 && rows.every(
        (r, i) => selectedSet.has(getRowId(r, i)),
    );

    const handleHeaderSort = useCallback((col) => {
        if (!col.sortable) return;
        setSort((prev) => {
            if (!prev || prev.columnId !== col.id) return { columnId: col.id, direction: 'asc' };
            return { columnId: col.id, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    }, []);

    const handleToggleAll = useCallback(() => {
        if (!onSelectedChange) return;
        if (allSelected) {
            onSelectedChange(new Set());
        } else {
            const next = new Set(rows.map((r, i) => getRowId(r, i)));
            onSelectedChange(next);
        }
    }, [allSelected, rows, getRowId, onSelectedChange]);

    const handleToggleRow = useCallback((id) => {
        if (!onSelectedChange) return;
        const next = new Set(selectedSet);
        if (next.has(id)) next.delete(id); else next.add(id);
        onSelectedChange(next);
    }, [selectedSet, onSelectedChange]);

    /* Grid template — selection col + sticky col + diğerleri.
       react-grid-layout DEĞİL; CSS grid; her satır aynı template'i kullanır. */
    const gridTemplate = useMemo(() => {
        const tracks = [];
        if (selectable) tracks.push('40px');
        for (const col of columns) {
            const w = col.width;
            if (typeof w === 'number') tracks.push(`${w}px`);
            else if (typeof w === 'string') tracks.push(w);
            else tracks.push('minmax(120px, 1fr)');
        }
        return tracks.join(' ');
    }, [columns, selectable]);

    /* Virtualization yalnızca büyük listelerde — küçük listede React-tree
       overhead'i daha pahalı (<50 row için scroll-perf zaten iyi). */
    const shouldVirtualize = sortedRows.length > VIRTUALIZE_THRESHOLD;
    const virtualizer = useVirtualizer({
        count: sortedRows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => dens.row,
        overscan: 8,
        enabled: shouldVirtualize,
    });

    const isEmpty = sortedRows.length === 0;

    return (
        <div
            className={cn(
                'relative w-full',
                'border border-default rounded-md bg-surface-base',
                'overflow-hidden',                  /* scroll inner ref'te */
                className,
            )}
            role="region"
            aria-label={ariaLabel}
        >
            <div
                ref={scrollRef}
                className="overflow-auto"
                style={{ maxHeight: height }}
            >
                {/* Header — sticky top */}
                <div
                    role="row"
                    className={cn(
                        'sticky top-0 z-10',
                        'grid items-center',
                        'bg-surface-raised border-b border-default',
                        'font-medium text-text-secondary',
                        dens.text,
                    )}
                    style={{ gridTemplateColumns: gridTemplate, height: dens.header }}
                >
                    {selectable && (
                        <HeaderCell sticky padX={dens.padX} padY={dens.padY}>
                            <input
                                type="checkbox"
                                aria-label={allSelected ? 'Tüm seçimi kaldır' : 'Tümünü seç'}
                                checked={allSelected}
                                onChange={handleToggleAll}
                                className="h-4 w-4 accent-brand-500 cursor-pointer"
                            />
                        </HeaderCell>
                    )}
                    {columns.map((col) => (
                        <HeaderCell
                            key={col.id}
                            sticky={col.sticky}
                            align={col.align ?? (col.numeric ? 'right' : 'left')}
                            sortable={col.sortable}
                            sortDir={sort?.columnId === col.id ? sort.direction : null}
                            onSort={() => handleHeaderSort(col)}
                            padX={dens.padX}
                            padY={dens.padY}
                        >
                            {col.header}
                        </HeaderCell>
                    ))}
                </div>

                {/* Body */}
                {isEmpty ? (
                    <div className="p-6 text-center text-sm text-text-tertiary">
                        {emptyState ?? 'Görüntülenecek kayıt yok.'}
                    </div>
                ) : shouldVirtualize ? (
                    <div
                        style={{
                            height: virtualizer.getTotalSize(),
                            position: 'relative',
                        }}
                    >
                        {virtualizer.getVirtualItems().map((vRow) => {
                            const row = sortedRows[vRow.index];
                            const id = getRowId(row, vRow.index);
                            return (
                                <DataRow
                                    key={id}
                                    row={row}
                                    rowId={id}
                                    columns={columns}
                                    selectable={selectable}
                                    isSelected={selectedSet.has(id)}
                                    onToggleSelect={() => handleToggleRow(id)}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    gridTemplate={gridTemplate}
                                    dens={dens}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: vRow.size,
                                        transform: `translateY(${vRow.start}px)`,
                                    }}
                                />
                            );
                        })}
                    </div>
                ) : (
                    sortedRows.map((row, i) => {
                        const id = getRowId(row, i);
                        return (
                            <DataRow
                                key={id}
                                row={row}
                                rowId={id}
                                columns={columns}
                                selectable={selectable}
                                isSelected={selectedSet.has(id)}
                                onToggleSelect={() => handleToggleRow(id)}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                gridTemplate={gridTemplate}
                                dens={dens}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}

/* ------------------------------ Cells ------------------------------ */

function HeaderCell({ sticky, align = 'left', sortable, sortDir, onSort, padX, padY, children }) {
    const alignCls = align === 'right' ? 'justify-end text-right'
        : align === 'center' ? 'justify-center text-center'
        : 'justify-start text-left';

    const stickyCls = sticky ? cn(
        'sticky left-0 z-20 bg-surface-raised',
        /* Sağ kenarda subtle gölge — yatay scroll'da derinlik hissi.
           shadow utility yerine inline border-right; küçük detay. */
        'shadow-[1px_0_0_var(--apya-border-default)]',
    ) : null;

    const inner = (
        <span className={cn('flex items-center gap-1', alignCls, 'min-w-0')}>
            <span className="truncate">{children}</span>
            {sortable && (
                <span aria-hidden="true" className="text-text-tertiary text-xs leading-none">
                    {sortDir === 'asc' ? '▲' : sortDir === 'desc' ? '▼' : '↕'}
                </span>
            )}
        </span>
    );

    return (
        <div
            role="columnheader"
            aria-sort={sortDir ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
            className={cn(
                'flex items-center select-none',
                padX, padY,
                sortable && 'cursor-pointer hover:text-text-primary',
                stickyCls,
            )}
            onClick={sortable ? onSort : undefined}
            onKeyDown={sortable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSort(); } } : undefined}
            tabIndex={sortable ? 0 : -1}
        >
            {inner}
        </div>
    );
}

function DataRow({
    row, rowId, columns, selectable, isSelected, onToggleSelect, onClick, gridTemplate, dens, style,
}) {
    return (
        <div
            role="row"
            aria-selected={selectable ? isSelected : undefined}
            className={cn(
                'grid items-center',
                'border-b border-subtle',
                'transition-colors duration-fast',
                'hover:bg-surface-raised',
                isSelected && 'bg-brand-50',
                onClick && 'cursor-pointer',
                dens.text,
            )}
            style={{ gridTemplateColumns: gridTemplate, height: dens.row, ...style }}
            onClick={onClick}
        >
            {selectable && (
                <BodyCell sticky padX={dens.padX} padY={dens.padY}>
                    <input
                        type="checkbox"
                        aria-label="Bu satırı seç"
                        checked={isSelected}
                        onChange={onToggleSelect}
                        onClick={(e) => e.stopPropagation()}  /* Row onClick'i tetiklemesin */
                        className="h-4 w-4 accent-brand-500 cursor-pointer"
                    />
                </BodyCell>
            )}
            {columns.map((col) => {
                const get = resolveAccessor(col.accessor);
                const value = get(row);
                const align = col.align ?? (col.numeric ? 'right' : 'left');
                const content = col.cell ? col.cell(value, row) : value;
                return (
                    <BodyCell
                        key={col.id}
                        sticky={col.sticky}
                        align={align}
                        numeric={col.numeric}
                        padX={dens.padX}
                        padY={dens.padY}
                    >
                        {content}
                    </BodyCell>
                );
            })}
        </div>
    );
}

function BodyCell({ sticky, align = 'left', numeric, padX, padY, children }) {
    const alignCls = align === 'right' ? 'justify-end text-right'
        : align === 'center' ? 'justify-center text-center'
        : 'justify-start text-left';

    /* Sticky body cell'lerin bg'ını parent row'dan miras alamayız (overlay
       sorunu); kendi yüzeyini koy. Hover'da row hover-bg'ı da kapsasın diye
       group-hover kullan. */
    const stickyCls = sticky ? cn(
        'sticky left-0 z-[1] bg-surface-base',
        'shadow-[1px_0_0_var(--apya-border-subtle)]',
    ) : null;

    return (
        <div
            role="cell"
            className={cn(
                'flex items-center min-w-0',
                padX, padY,
                alignCls,
                numeric && 'font-tabular',
                stickyCls,
            )}
        >
            <span className="truncate">{children}</span>
        </div>
    );
}

export { DataTable };
