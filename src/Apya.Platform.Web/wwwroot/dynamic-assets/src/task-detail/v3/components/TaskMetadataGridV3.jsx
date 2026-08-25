import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import {
    STATUS_META, SELECTABLE_STATUSES, statusOf,
    PRIORITY_META, SELECTABLE_PRIORITIES, priorityOf,
    initialsOf, avatarColorOf, dueUrgency,
} from '../taskMetaV3';
import { dialogPortalContainer } from '../../../lib/dom/dialogPortalContainer';

/* Popover.Root'lara `modal` ŞART: içerik body'ye portal edildiği için non-modal
   popover, Dialog'un focus trap'inin DIŞINDA kalıyor. Açılışta odağı alır almaz trap
   odağı geri çekiyor, popover da bunu "focusOutside" sayıp kendini kapatıyordu.
   Masaüstünde görünmüyordu: Radix, odağın geri çekildiği öğe trigger'ın kendisiyse
   kapanmayı iptal ediyor ve tıklama zaten trigger'ı odaklıyor. iOS Safari dokunmada
   <button>'a odak VERMEDİĞİ için orada her açılış flash edip kapanıyordu. */
const POPOVER_CLS =
    'z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast';

const SEARCH_INPUT_CLS =
    'w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none';

/** Seçim yapan her satır Popover.Close ile sarılır — aksi halde popover açık kalır
 *  ve ikinci bir popover açıldığında ikisi üst üste binip tıklamaları yutar.
 *  (Prototipte karşılığı: her `pick` fonksiyonunda `pop: null`.) */
function PopoverItem({ children }) {
    return <Popover.Close asChild>{children}</Popover.Close>;
}

function Cell({ label, children }) {
    return (
        <div className="flex flex-col gap-[7px] min-w-0">
            <span className="text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none">
                {label}
            </span>
            {children}
        </div>
    );
}

function Avatar({ name, size = 26 }) {
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full text-white font-bold"
            style={{ height: size, width: size, background: avatarColorOf(name), fontSize: size * 0.38 }}
        >
            {initialsOf(name)}
        </span>
    );
}

/** "3s 30dk" — ondalık saat gösterimi B2B'de okunmuyor. */
function formatHours(hours) {
    if (hours == null) return '—';
    const total = Math.max(0, Math.round(Number(hours) * 60));
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (!h) return `${m}dk`;
    return m ? `${h}s ${m}dk` : `${h}s`;
}

export function TaskMetadataGridV3({
    task = {},
    assigneeOptions = [],
    projectOptions = [],
    onFieldChange = () => {},
    statusValue,
    priorityValue,
    assigneeValue,
    projectValue,
    dueDateValue,
    startDateValue,
    tagsValue = [],
    progressPercent = 0,
    progressNote = '',
    onOpenTransfer,
}) {
    const [assigneeQuery, setAssigneeQuery] = useState('');
    const [projectQuery, setProjectQuery] = useState('');
    const [tagDraft, setTagDraft] = useState('');
    const [addingTag, setAddingTag] = useState(false);
    /* Kap DÜĞÜM olarak state'te tutulur, ref'te DEĞİL: `container` prop'u ana
       bileşenin render'ında hesaplanıyor ve ref ilk render'da henüz boş oluyor.
       Uncontrolled popover açıldığında ana bileşen yeniden render EDİLMEDİĞİ için
       kap sonsuza dek undefined kalırdı. State ile mount sonrası bir render daha
       olur ve düğüm yerine oturur. Bkz. dialogPortalContainer. */
    const [rootEl, setRootEl] = useState(null);

    const status = statusOf(statusValue ?? task.status);
    const priority = priorityOf(priorityValue ?? task.priority);
    const assigneeId = assigneeValue ?? task.assigneeId ?? null;
    const projectId = projectValue ?? task.projectId ?? null;

    const assigneeName =
        assigneeOptions.find((o) => o.value === assigneeId)?.label || task.assigneeName || 'Atanmamış';
    const projectName =
        projectOptions.find((o) => o.value === projectId)?.label || task.projectName || 'Projesiz';

    const due = dueUrgency(dueDateValue ?? task.dueDate);

    const filteredAssignees = assigneeOptions.filter(
        (o) => !assigneeQuery || o.label.toLowerCase().includes(assigneeQuery.toLowerCase()));
    const filteredProjects = projectOptions.filter(
        (o) => !projectQuery || o.label.toLowerCase().includes(projectQuery.toLowerCase()));

    const commitTag = () => {
        const value = tagDraft.trim();
        if (value && !tagsValue.includes(value)) onFieldChange('tagNames', [...tagsValue, value]);
        setTagDraft('');
        setAddingTag(false);
    };

    return (
        <div ref={setRootEl} className="px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base">
            <div className="grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6">

                {/* 1 — Sorumlu */}
                <Cell label="Sorumlu">
                    <Popover.Root modal>
                        <Popover.Trigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer"
                            >
                                <Avatar name={assigneeId ? assigneeName : null} />
                                <span className="text-[13px] font-semibold text-text-primary truncate">{assigneeName}</span>
                                <i className="fa-solid fa-chevron-down text-[8px] text-text-tertiary" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal container={dialogPortalContainer(rootEl)}>
                            <Popover.Content sideOffset={6} align="start" className={`${POPOVER_CLS} w-[264px]`}>
                                <div className="relative mb-[7px]">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={assigneeQuery}
                                        onChange={(e) => setAssigneeQuery(e.target.value)}
                                        placeholder="Kişi ara…"
                                        className={SEARCH_INPUT_CLS}
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar">
                                    <PopoverItem>
                                        <button
                                            type="button"
                                            onClick={() => onFieldChange('assigneeId', null)}
                                            className={`flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${
                                                !assigneeId ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary">
                                                <i className="fa-solid fa-user-slash text-[9px]" />
                                            </span>
                                            <span>Atanmamış</span>
                                        </button>
                                    </PopoverItem>
                                    {assigneeOptions.length === 0 && (
                                        <div className="px-2 py-1.5 text-[12px] text-text-tertiary">Kullanıcı listesi yükleniyor…</div>
                                    )}
                                    {filteredAssignees.map((opt) => (
                                        <PopoverItem key={opt.value}>
                                            <button
                                                type="button"
                                                onClick={() => onFieldChange('assigneeId', opt.value)}
                                                className={`flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${
                                                    assigneeId === opt.value ? 'bg-primary-subtle' : 'hover:bg-surface-hover'
                                                }`}
                                            >
                                                <Avatar name={opt.label} size={24} />
                                                <span className="flex-1 text-[12.5px] font-semibold text-text-primary truncate">{opt.label}</span>
                                                {assigneeId === opt.value && <i className="fa-solid fa-check text-[10px] text-primary" />}
                                            </button>
                                        </PopoverItem>
                                    ))}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </Cell>

                {/* 2 — Son tarih (+ aciliyet) */}
                <Cell label="Son tarih">
                    <label className="flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer">
                        <i className={`fa-regular fa-calendar text-[13px] ${due.tone}`} />
                        <input
                            type="date"
                            value={(dueDateValue ?? task.dueDate ?? '').slice(0, 10)}
                            onChange={(e) => onFieldChange('dueDate', e.target.value)}
                            className="bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
                        />
                    </label>
                    {due.hint && <span className={`-mt-0.5 text-[10.5px] font-semibold ${due.tone}`}>{due.hint}</span>}
                </Cell>

                {/* 3 — Başlangıç */}
                <Cell label="Başlangıç">
                    <label className="flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer">
                        <i className="fa-regular fa-calendar text-[13px] text-text-tertiary" />
                        <input
                            type="date"
                            value={(startDateValue ?? task.startDate ?? '').slice(0, 10)}
                            onChange={(e) => onFieldChange('startDate', e.target.value)}
                            className="bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
                        />
                    </label>
                </Cell>

                {/* 4 — İlerleme (kontrol listesi tamamlanma oranı) */}
                <Cell label="İlerleme">
                    <div className="flex flex-col gap-1.5 pt-[5px]">
                        <div className="flex items-baseline justify-between">
                            <span className="font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary">
                                %{progressPercent}
                            </span>
                            <span className="text-[11px] font-medium text-text-tertiary">{progressNote}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-neutral-subtle overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </Cell>

                {/* 5 — Durum */}
                <Cell label="Durum">
                    <div className="flex items-center h-8">
                        <Popover.Root modal>
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    className={`flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${status.bg} ${status.fg}`}
                                >
                                    <i className={`fa-solid ${status.icon} text-[11px]`} />
                                    <span>{status.label}</span>
                                    <i className="fa-solid fa-chevron-down text-[8px] opacity-60" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal container={dialogPortalContainer(rootEl)}>
                                <Popover.Content sideOffset={6} align="start" className={`${POPOVER_CLS} w-[196px]`}>
                                    <div className="px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary">
                                        Durumu değiştir
                                    </div>
                                    {SELECTABLE_STATUSES.map((id) => {
                                        const meta = STATUS_META[id];
                                        const active = (statusValue ?? task.status) === id;
                                        return (
                                            <PopoverItem key={id}>
                                                <button
                                                    type="button"
                                                    onClick={() => onFieldChange('status', id)}
                                                    className={`flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${
                                                        active ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-hover'
                                                    }`}
                                                >
                                                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                                                    <span className="flex-1">{meta.label}</span>
                                                    {active && <i className="fa-solid fa-check text-[10px]" />}
                                                </button>
                                            </PopoverItem>
                                        );
                                    })}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </div>
                </Cell>

                {/* 6 — Öncelik (başlıktan buraya taşındı: başlık satırı rozetlerle
                       dolduğu için mobilde görev adına yer kalmıyordu) */}
                <Cell label="Öncelik">
                    <div className="flex items-center h-8">
                        <Popover.Root modal>
                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    className={`flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${priority.bg} ${priority.fg}`}
                                >
                                    <i className={`fa-solid ${priority.icon} text-[11px]`} />
                                    <span>{priority.label}</span>
                                    <i className="fa-solid fa-chevron-down text-[8px] opacity-60" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal container={dialogPortalContainer(rootEl)}>
                                <Popover.Content sideOffset={6} align="start" className={`${POPOVER_CLS} w-[184px]`}>
                                    <div className="px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary">
                                        Öncelik seç
                                    </div>
                                    {SELECTABLE_PRIORITIES.map((id) => {
                                        const meta = PRIORITY_META[id];
                                        const active = (priorityValue ?? task.priority) === id;
                                        return (
                                            <PopoverItem key={id}>
                                                <button
                                                    type="button"
                                                    onClick={() => onFieldChange('priority', id)}
                                                    className={`flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${
                                                        active ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-hover'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${meta.icon} text-[11px] w-[13px]`} />
                                                    <span className="flex-1">{meta.label}</span>
                                                    {active && <i className="fa-solid fa-check text-[10px]" />}
                                                </button>
                                            </PopoverItem>
                                        );
                                    })}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </div>
                </Cell>

                {/* 7 — Etiketler */}
                <Cell label="Etiketler">
                    <div className="flex items-center gap-1.5 flex-wrap min-h-8">
                        {tagsValue.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold"
                            >
                                <span>{tag}</span>
                                <button
                                    type="button"
                                    aria-label="Etiketi kaldır"
                                    onClick={() => onFieldChange('tagNames', tagsValue.filter((t) => t !== tag))}
                                    className="flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark text-[9px]" />
                                </button>
                            </span>
                        ))}

                        {addingTag ? (
                            <input
                                autoFocus
                                type="text"
                                value={tagDraft}
                                onChange={(e) => setTagDraft(e.target.value)}
                                onBlur={commitTag}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitTag();
                                    if (e.key === 'Escape') { setTagDraft(''); setAddingTag(false); }
                                }}
                                placeholder="Etiket…"
                                className="h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
                            />
                        ) : (
                            <button
                                type="button"
                                aria-label="Yeni etiket ekle"
                                onClick={() => setAddingTag(true)}
                                className="flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer"
                            >
                                <i className="fa-solid fa-plus text-[9px]" />
                                Etiket
                            </button>
                        )}
                    </div>
                </Cell>

                {/* 8 — Proje (+ taşı / kopyala) */}
                <Cell label="Proje">
                    <Popover.Root modal>
                        <Popover.Trigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer"
                            >
                                <i className="fa-regular fa-folder-open text-[13px] text-text-tertiary" />
                                <span className="text-[13px] font-semibold text-text-primary truncate">{projectName}</span>
                                <i className="fa-solid fa-chevron-down text-[8px] text-text-tertiary" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal container={dialogPortalContainer(rootEl)}>
                            <Popover.Content sideOffset={6} align="start" className={`${POPOVER_CLS} w-[250px]`}>
                                <div className="relative mb-[7px]">
                                    <i className="fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={projectQuery}
                                        onChange={(e) => setProjectQuery(e.target.value)}
                                        placeholder="Proje ara…"
                                        className={SEARCH_INPUT_CLS}
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar">
                                    <PopoverItem>
                                        <button
                                            type="button"
                                            onClick={() => onFieldChange('projectId', null)}
                                            className={`flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${
                                                !projectId ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <span className="h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" />
                                            <span className="flex-1">Projesiz</span>
                                        </button>
                                    </PopoverItem>
                                    {filteredProjects.map((opt) => (
                                        <PopoverItem key={opt.value}>
                                            <button
                                                type="button"
                                                onClick={() => onFieldChange('projectId', opt.value)}
                                                className={`flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${
                                                    projectId === opt.value ? 'bg-primary-subtle text-primary' : 'text-text-primary hover:bg-surface-hover'
                                                }`}
                                            >
                                                <span className="h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" />
                                                <span className="flex-1 truncate">{opt.label}</span>
                                                {projectId === opt.value && <i className="fa-solid fa-check text-[10px] text-primary" />}
                                            </button>
                                        </PopoverItem>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle">
                                    <PopoverItem>
                                        <button
                                            type="button"
                                            onClick={() => onOpenTransfer?.('move')}
                                            className="flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer"
                                        >
                                            <i className="fa-solid fa-right-left text-[11px] w-[14px] opacity-70" />
                                            <span className="flex-1">Başka projeye taşı…</span>
                                        </button>
                                    </PopoverItem>
                                    <PopoverItem>
                                        <button
                                            type="button"
                                            onClick={() => onOpenTransfer?.('copy')}
                                            className="flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer"
                                        >
                                            <i className="fa-solid fa-clone text-[11px] w-[14px] opacity-70" />
                                            <span className="flex-1">Başka projeye kopyala…</span>
                                        </button>
                                    </PopoverItem>
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                </Cell>

                {/* 9 — Harcanan / tahmin */}
                <Cell label="Harcanan / tahmin">
                    <div className="flex items-center gap-[9px] h-8">
                        <i className="fa-regular fa-clock text-[13px] text-text-tertiary" />
                        <span className="font-mono text-[13px] font-bold text-text-primary">
                            {formatHours(task.spentHours ?? 0)}
                        </span>
                        <span className="text-[12px] text-text-tertiary">
                            / {task.estimatedHours != null ? formatHours(task.estimatedHours) : '—'}
                        </span>
                    </div>
                </Cell>

            </div>
        </div>
    );
}
