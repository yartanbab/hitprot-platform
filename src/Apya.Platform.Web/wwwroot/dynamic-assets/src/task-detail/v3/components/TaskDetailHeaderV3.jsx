import React, { useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { TaskPrivacyDialogV3 } from './TaskPrivacyDialogV3';
import { STATUS_META, SELECTABLE_STATUSES, statusOf } from '../taskMetaV3';
import { dialogPortalContainer } from '../../../lib/dom/dialogPortalContainer';

/* Popover.Root'lara `modal` ŞART: içerik body'ye portal edildiği için non-modal
   popover, Dialog'un focus trap'inin DIŞINDA kalıyor. Açılışta odağı alır almaz trap
   odağı geri çekiyor, popover da bunu "focusOutside" sayıp kendini kapatıyordu.
   Masaüstünde görünmüyordu: Radix, odağın geri çekildiği öğe trigger'ın kendisiyse
   kapanmayı iptal ediyor ve tıklama zaten trigger'ı odaklıyor. iOS Safari dokunmada
   <button>'a odak VERMEDİĞİ için orada her açılış flash edip kapanıyordu. */
/* max-h + overflow ŞART: popover modalın İÇİNE portal ediliyor (bkz.
   dialogPortalContainer) ve DialogContent hem `overflow-hidden` hem de kalıcı bir
   `transform` taşıyor (animate-dialog-in, fill-mode "both" → scale(1) kalır). Kalıcı
   transform, fixed konumlu popper sarmalayıcısının kapsayan bloğunu modal yapar;
   dolayısıyla popover modal sınırında KIRPILIR. ⋯ menüsü (11 madde + kısayol bloğu)
   alçak ekranlarda son satırlarını (kısayollar) böyle yutuyordu. Yükseklik Radix'in
   bildirdiği available-height'a sabitlenince taşan kısım kesilmek yerine KAYAR.
   Değişkenin doğru değeri taşıması `collisionBoundary`'ye bağlı — ⋯ menüsüne bak. */
const POPOVER_CLS =
    'z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast ' +
    'max-h-[var(--radix-popover-content-available-height)] overflow-y-auto';

const MENU_ROW_CLS =
    'flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover';

const SHORTCUTS = [
    { what: 'Kaydet', key: 'Ctrl S' },
    { what: 'Yorum gönder', key: 'Ctrl ↵' },
    { what: 'Kapat / iptal', key: 'Esc' },
    { what: 'Bağlantı kopyala', key: '⌘ L' },
];

/** Seçim satırı — Popover.Close ile sarılır ki tıklamadan sonra menü kapansın.
 *  Açık kalan popover'lar üst üste binip sonraki tıklamaları yutuyordu. */
function PopoverItem({ children }) {
    return <Popover.Close asChild>{children}</Popover.Close>;
}

function Kbd({ children }) {
    return (
        <kbd className="inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary">
            {children}
        </kbd>
    );
}

export function TaskDetailHeaderV3({
    task = {},
    presentation = 'modal',
    onClose,
    isFullscreen,
    onToggleFullscreen,
    onFieldChange = () => {},
    statusValue,
    titleValue,
    isPrivateValue,
    isFavorite,
    onToggleFavorite,
    isWatched,
    onToggleWatch,
    onDuplicate,
    onArchive,
    onDelete,
    onOpenTransfer,
    onSaveAsTemplate,
    onConvertToSubtask,
    onExportPdf,
}) {
    const [copied, setCopied] = useState(false);
    /* Kap DÜĞÜM olarak state'te tutulur, ref'te DEĞİL: `container` prop'u ana
       bileşenin render'ında hesaplanıyor ve ref ilk render'da henüz boş oluyor.
       Uncontrolled popover açıldığında ana bileşen yeniden render EDİLMEDİĞİ için
       kap sonsuza dek undefined kalırdı. State ile mount sonrası bir render daha
       olur ve düğüm yerine oturur. Bkz. dialogPortalContainer. */
    const [rootEl, setRootEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const titleRef = useRef(null);

    /* Popover'ların portal edildiği kap; `collisionBoundary` için de gerekli. */
    const portalContainer = dialogPortalContainer(rootEl);

    const status = statusOf(statusValue ?? task.status);
    const code = task.code || 'GRV-—';

    const copyCode = () => {
        navigator.clipboard?.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const copyLink = () => {
        navigator.clipboard?.writeText(`${window.location.origin}/Tasks?task=${task.id || ''}`);
        window?.abp?.notify?.success?.('Görev bağlantısı panoya kopyalandı.');
    };

    /* Menü eylemleri — her satır önce menüyü kapatır, sonra işi yapar. */
    const run = (fn) => () => { setMenuOpen(false); fn?.(); };

    const menuItems = [
        { label: 'Bağlantıyı kopyala', icon: 'fa-link', kbd: '⌘L', onClick: run(copyLink) },
        { label: 'Çoğalt', icon: 'fa-copy', kbd: '⌘D', onClick: run(onDuplicate) },
        { label: 'Başka projeye kopyala', icon: 'fa-clone', onClick: run(() => onOpenTransfer?.('copy')) },
        { label: 'Şablon olarak kaydet', icon: 'fa-bookmark', onClick: run(onSaveAsTemplate) },
        { label: 'Taşı (başka proje)', icon: 'fa-right-left', separator: true, onClick: run(() => onOpenTransfer?.('move')) },
        { label: 'Alt göreve dönüştür', icon: 'fa-diagram-project', onClick: run(onConvertToSubtask) },
        { label: isWatched ? 'Takibi bırak' : 'Takip et', icon: 'fa-eye', onClick: run(onToggleWatch) },
        { label: 'Arşivle', icon: 'fa-box-archive', separator: true, onClick: run(onArchive) },
        { label: 'Yazdır', icon: 'fa-print', kbd: '⌘P', onClick: run(() => window.print()) },
        { label: 'PDF olarak dışa aktar', icon: 'fa-file-pdf', onClick: run(onExportPdf) },
        { label: 'Sil', icon: 'fa-trash-can', kbd: '⌫', separator: true, danger: true, onClick: run(onDelete) },
    ];

    return (
        <header ref={setRootEl} className="shrink-0 px-6 lt-860:px-4 pt-[18px] pb-4 border-b border-subtle bg-surface-base">
            <div className="flex items-start justify-between gap-4">

                {/* ---- Sol: rozetler ---- */}
                <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                    <button
                        type="button"
                        onClick={copyCode}
                        title="Kodu kopyala"
                        className="flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer"
                    >
                        <i className="fa-solid fa-hashtag text-[9px] opacity-70" />
                        <span>{code}</span>
                        <i className={`${copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'} text-[9px] opacity-60`} />
                    </button>

                    {/* Durum */}
                    <Popover.Root modal>
                        <Popover.Trigger asChild>
                            <button
                                type="button"
                                className={`flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${status.bg} ${status.fg}`}
                            >
                                <span className="h-[7px] w-[7px] rounded-full bg-current animate-pulse" />
                                <span>{status.label}</span>
                                <i className="fa-solid fa-chevron-down text-[8px] opacity-60" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal container={portalContainer}>
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

                    {isWatched && (
                        <span className="flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold">
                            <i className="fa-regular fa-eye text-[10px]" />
                            Takip ediliyor
                        </span>
                    )}
                </div>

                {/* ---- Sağ: gizlilik · tam ekran · ⋯ · kapat ---- */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="lt-860:hidden">
                        <TaskPrivacyDialogV3
                            isPrivate={isPrivateValue ?? Boolean(task.isPrivate)}
                            onChange={(v) => onFieldChange('isPrivate', v)}
                        />
                    </div>

                    <div className="h-5 w-px bg-border-default mx-1" />

                    {/* Tam ekran ≤767.98px'te GİZLİ: modal orada zaten 100vw × 100svh
                        açılıyor (Dialog.jsx `mobile:` kuralları), düğme hiçbir şey
                        değiştirmiyordu. Eşik Dialog'un mobil eşiğiyle aynı olmalı. */}
                    {presentation === 'modal' && (
                        <button
                            type="button"
                            onClick={onToggleFullscreen}
                            title={isFullscreen ? 'Küçült' : 'Tam ekran'}
                            className={`mobile:hidden flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${
                                isFullscreen ? 'bg-primary-subtle text-primary' : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                            }`}
                        >
                            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-[12px]`} />
                        </button>
                    )}

                    <Popover.Root modal open={menuOpen} onOpenChange={setMenuOpen}>
                        <Popover.Trigger asChild>
                            <button
                                type="button"
                                title="Diğer seçenekler"
                                className={`flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${
                                    menuOpen ? 'bg-surface-hover text-text-primary' : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                            >
                                <i className="fa-solid fa-ellipsis text-sm" />
                            </button>
                        </Popover.Trigger>
                        <Popover.Portal container={portalContainer}>
                            <Popover.Content
                                sideOffset={6}
                                align="end"
                                /* Sınır AÇIKÇA modal: varsayılan (`clippingAncestors`) kırpan
                                   atayı bulamıyor — popper sarmalayıcısı `position:fixed`
                                   olduğu için Floating UI viewport'u baz alıyor ve
                                   available-height'ı 48px fazla bildiriyordu (ölçüm:
                                   modal 564px'te biterken menü 600px'e uzanıyordu). */
                                collisionBoundary={portalContainer ?? []}
                                collisionPadding={12}
                                className={`${POPOVER_CLS} w-[244px]`}
                            >
                                {menuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={item.onClick}
                                        className={[
                                            MENU_ROW_CLS,
                                            item.danger ? 'text-negative' : 'text-text-secondary',
                                            item.separator ? 'border-t border-subtle mt-[5px]' : '',
                                        ].join(' ')}
                                    >
                                        <i className={`fa-solid ${item.icon} text-[11px] w-[14px] opacity-75`} />
                                        <span className="flex-1">{item.label}</span>
                                        {item.kbd && <span className="font-mono text-[10px] text-text-tertiary">{item.kbd}</span>}
                                    </button>
                                ))}

                                {/* Kısayollar — sağ panelden buraya taşındı (tasarım kararı) */}
                                <div className="mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle">
                                    <div className="flex items-center gap-2 mb-[7px]">
                                        <i className="fa-solid fa-keyboard text-[11px] text-text-tertiary" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary">
                                            Kısayollar
                                        </span>
                                    </div>
                                    {SHORTCUTS.map((s) => (
                                        <div key={s.what} className="flex items-center justify-between gap-2.5 py-1">
                                            <span className="text-[11.5px] text-text-secondary">{s.what}</span>
                                            <Kbd>{s.key}</Kbd>
                                        </div>
                                    ))}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>

                    {presentation === 'modal' && (
                        <button
                            type="button"
                            onClick={onClose}
                            title="Kapat (Esc)"
                            className="flex items-center justify-center h-8 w-8 ml-0.5 rounded-[9px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark text-sm" />
                        </button>
                    )}
                </div>
            </div>

            {/* ---- Başlık: rozet/aksiyon satırının ALTINDA, tam genişlikte ----
                Başlık daha önce sol sütunun içindeydi; sağdaki 3-4 aksiyon düğmesi
                kadar dar kalıyordu ve dar ekranda iki-üç satıra kırılıyordu. Kendi
                satırına alınınca modalın tamamı kadar genişler. */}
            <div className="flex items-center gap-2 min-w-0 mt-[9px]">
                {/* contentEditable + onInput yerine onBlur: her tuş vuruşunda form
                    state'i güncellenirse React yeniden render eder ve caret metnin
                    başına atlar. Değer yalnız odak çıkışında forma yazılır; bu yüzden
                    initial content'i React değil DOM tutar (suppressContentEditableWarning). */}
                <div
                    ref={titleRef}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    onBlur={(e) => onFieldChange('title', e.currentTarget.textContent.trim())}
                    className="flex-1 min-w-0 text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none"
                >
                    {titleValue ?? task.title ?? 'Başlıksız görev'}
                </div>

                <button
                    type="button"
                    onClick={onToggleFavorite}
                    title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    className={`flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${
                        isFavorite ? 'bg-warning-subtle text-warning' : 'text-text-tertiary hover:bg-surface-hover'
                    }`}
                >
                    <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star text-[15px]`} />
                </button>
            </div>
        </header>
    );
}
