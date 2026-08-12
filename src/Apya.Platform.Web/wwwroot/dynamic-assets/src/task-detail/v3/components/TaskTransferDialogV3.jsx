import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Projeler arası taşıma / kopyalama diyaloğu.
 *
 * Çoklu hedef destekler. Backend karşılığı tek toplu uç noktadır:
 *   POST /api/app/task/{id}/transfer  →  ITaskAppService.TransferAsync
 * Bu yüzden "Neler taşınsın?" anahtarları gerçekten uygulanır; arayüzde durup
 * etkisiz kalan bir seçenek yoktur.
 *
 * Move kipinde İLK seçilen proje hedeftir (görev oraya taşınır), kalanlara kopya
 * çıkar — sıralama `targets` dizisinin kendi sırasıdır, bu yüzden seçim sırası korunur.
 */

const OPTION_DEFS = [
    { key: 'subtasks',     label: 'Alt görevler',              countKey: 'subtasks',  unit: 'alt görev' },
    { key: 'checklist',    label: 'Kontrol listesi',           countKey: 'checklist', unit: 'madde' },
    { key: 'comments',     label: 'Yorumlar',                  countKey: 'comments',  unit: 'yorum' },
    { key: 'files',        label: 'Dosyalar',                  countKey: 'files',     unit: 'dosya' },
    { key: 'keepAssignee', label: 'Sorumluyu koru',            desc: 'Aksi halde atanmamış gelir' },
    { key: 'keepLinks',    label: 'Bağımlılıkları koru',       desc: 'Öncül / ardıl bağlantılar' },
    { key: 'shiftDates',   label: 'Tarihleri bugüne kaydır',   desc: 'Başlangıç ve son tarih ötelenir' },
];

const DEFAULT_OPTIONS = {
    subtasks: true, checklist: true, comments: false, files: true,
    keepAssignee: true, keepLinks: true, shiftDates: false,
};

function Toggle({ on, onClick, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={label}
            onClick={onClick}
            className={`relative shrink-0 h-[22px] w-[38px] p-0 border-0 rounded-full cursor-pointer transition-colors duration-fast ${
                on ? 'bg-primary' : 'bg-border-strong'
            }`}
        >
            <span
                className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]"
                style={{ left: on ? 19 : 3 }}
            />
        </button>
    );
}

export function TaskTransferDialogV3({
    open,
    mode: initialMode = 'move',
    onClose,
    onConfirm,
    projectOptions = [],
    currentProjectId,
    counts = {},
    onCreateProject,
}) {
    const [mode, setMode] = useState(initialMode);
    const [targets, setTargets] = useState([]);
    const [query, setQuery] = useState('');
    const [newName, setNewName] = useState('');
    const [options, setOptions] = useState(DEFAULT_OPTIONS);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!open) return;
        setMode(initialMode);
        setTargets([]);
        setQuery('');
        setNewName('');
        setOptions(DEFAULT_OPTIONS);
    }, [open, initialMode]);

    /* Kaynak proje hedef olamaz — taşınacak yer zaten orası. */
    const pool = useMemo(
        () => projectOptions.filter((p) => p.value && p.value !== currentProjectId),
        [projectOptions, currentProjectId],
    );

    const filtered = pool.filter((p) => !query || p.label.toLowerCase().includes(query.toLowerCase()));
    const allSelected = pool.length > 0 && targets.length === pool.length;

    if (!open) return null;

    const toggleTarget = (id) => setTargets((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const nameOf = (id) => projectOptions.find((p) => p.value === id)?.label ?? '';

    const createProject = async () => {
        const name = newName.trim();
        if (!name || busy) return;
        setBusy(true);
        try {
            const id = await onCreateProject?.(name);
            if (id) setTargets((prev) => [...prev, id]);
            setNewName('');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Proje oluşturulamadı.');
        } finally {
            setBusy(false);
        }
    };

    const confirm = async () => {
        if (!targets.length || busy) return;
        setBusy(true);
        try {
            await onConfirm?.({ mode, targetProjectIds: targets, include: options });
        } finally {
            setBusy(false);
        }
    };

    const isMove = mode === 'move';
    const n = targets.length;
    const cta = isMove ? (n > 1 ? 'Taşı ve kopyala' : 'Taşı') : (n > 1 ? `${n} projeye kopyala` : 'Kopyala');
    const openCount = Object.values(options).filter(Boolean).length;
    const names = targets.map(nameOf).filter(Boolean);
    const summary = names.length
        ? `${names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ')} · ${openCount} seçenek açık`
        : `Proje seçilmedi · ${openCount} seçenek açık`;

    const segmentCls = (active) =>
        `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${
            active ? 'bg-surface-base text-primary shadow-xs' : 'bg-transparent text-text-tertiary'
        }`;

    return createPortal(
        <div
            data-apya-overlay
            className="fixed inset-0 z-modal flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={isMove ? 'Başka projeye taşı' : 'Başka projelere kopyala'}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in"
            >
                {/* Başlık */}
                <div className="flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary">
                            <i className="fa-solid fa-folder-tree text-base" />
                        </span>
                        <div className="min-w-0">
                            <h3 className="m-0 text-base font-extrabold tracking-[-.02em] text-text-primary">
                                {isMove ? 'Başka projeye taşı' : 'Başka projelere kopyala'}
                            </h3>
                            <p className="mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary">
                                {isMove
                                    ? 'Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur.'
                                    : 'Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır.'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Kapat"
                        className="flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-[15px]" />
                    </button>
                </div>

                {/* Mod anahtarı */}
                <div className="px-[22px] pt-3.5">
                    <div className="flex items-center gap-1 p-[3px] w-max rounded-[11px] bg-neutral-subtle">
                        <button type="button" onClick={() => setMode('move')} className={segmentCls(isMove)}>
                            <i className="fa-solid fa-right-left text-[10px]" />Taşı
                        </button>
                        <button type="button" onClick={() => setMode('copy')} className={segmentCls(!isMove)}>
                            <i className="fa-solid fa-clone text-[10px]" />Kopyala
                        </button>
                    </div>
                </div>

                {/* Gövde */}
                <div className="flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar">

                    {/* Sol — hedef projeler */}
                    <div className="flex flex-col gap-[9px] min-w-0">
                        <div className="flex items-center justify-between gap-2.5">
                            <span className="text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary">
                                Hedef projeler · {n}
                            </span>
                            <button
                                type="button"
                                onClick={() => setTargets(allSelected ? [] : pool.map((p) => p.value))}
                                className="p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline"
                            >
                                {allSelected ? 'Seçimi temizle' : 'Tümünü seç'}
                            </button>
                        </div>

                        <div className="relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Proje ara…"
                                className="w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                            {filtered.map((p) => {
                                const on = targets.includes(p.value);
                                const isPrimaryTarget = isMove && targets[0] === p.value;
                                return (
                                    <button
                                        key={p.value}
                                        type="button"
                                        onClick={() => toggleTarget(p.value)}
                                        className={`flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${
                                            on ? 'border-primary bg-primary-subtle' : 'border-subtle bg-surface-base'
                                        }`}
                                    >
                                        <span className={`flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${
                                            on ? 'bg-primary border-primary' : 'bg-transparent border-strong'
                                        }`}>
                                            {on && <i className="fa-solid fa-check text-[9px]" />}
                                        </span>
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" />
                                        <span className="flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate">{p.label}</span>
                                        {isPrimaryTarget && (
                                            <span className="flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold">
                                                TAŞINACAK
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="py-6 text-center text-[12px] text-text-tertiary">Uygun proje bulunamadı.</div>
                            )}
                        </div>

                        <div className="flex gap-[7px] mt-1">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createProject(); } }}
                                placeholder="Yeni proje adı…"
                                className="flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                            />
                            <button
                                type="button"
                                title="Yeni proje oluştur"
                                onClick={createProject}
                                disabled={!newName.trim() || busy}
                                className="flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fa-solid fa-folder-plus text-[12px]" />
                            </button>
                        </div>

                        {isMove && n > 1 && (
                            <div className="flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle">
                                <i className="fa-solid fa-circle-info text-[12px] text-warning mt-px" />
                                <span className="text-[11.5px] leading-[1.5] text-text-secondary">
                                    Taşıma tek hedefe yapılır: <strong className="font-bold text-text-primary">ilk seçtiğiniz proje</strong> hedef
                                    olur, kalan projelere kopya oluşturulur.
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Sağ — neler taşınsın */}
                    <div className="flex flex-col gap-[9px] min-w-0">
                        <span className="text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary">
                            Neler taşınsın?
                        </span>
                        <div className="flex flex-col gap-0.5">
                            {OPTION_DEFS.map((o) => (
                                <div key={o.key} className="flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised">
                                    <div className="flex-1 min-w-0 flex flex-col gap-px">
                                        <span className="text-[12.5px] font-semibold text-text-primary">{o.label}</span>
                                        <span className="text-[11px] text-text-tertiary">
                                            {o.countKey ? `${counts[o.countKey] ?? 0} ${o.unit}` : o.desc}
                                        </span>
                                    </div>
                                    <Toggle
                                        on={options[o.key]}
                                        label={o.label}
                                        onClick={() => setOptions((prev) => ({ ...prev, [o.key]: !prev[o.key] }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alt bar */}
                <div className="flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised">
                    <span className="min-w-0 truncate text-[11.5px] text-text-tertiary">{summary}</span>
                    <div className="flex gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="button"
                            onClick={confirm}
                            disabled={!n || busy}
                            className={`flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${
                                n && !busy ? 'bg-primary hover:bg-primary-hover cursor-pointer' : 'bg-border-strong cursor-not-allowed'
                            }`}
                        >
                            <i className={`fa-solid ${busy ? 'fa-circle-notch fa-spin' : 'fa-arrow-right'} text-[10px]`} />
                            {cta}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
