import React, { useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

/**
 * WYSIWYG açıklama editörü — markdown işareti GÖRÜNMEZ, biçim doğrudan uygulanır.
 *
 * `document.execCommand` kullanılır. Standartta deprecated olduğu bilinerek seçildi
 * (bkz. handoff): tüm hedef tarayıcılarda çalışıyor, sıfır bağımlılık getiriyor ve
 * araç çubuğu + çıktı HTML'i aynı kaldığı için ileride TipTap/Lexical'e geçiş bu
 * dosyayla sınırlı, izole bir iş oluyor.
 *
 * İçerik React tarafından KONTROL EDİLMEZ: contentEditable'ın innerHTML'ini her
 * render'da yeniden yazmak caret'i metnin başına atar. Başlangıç değeri bir kez
 * basılır, sonraki değişiklikler yalnız yukarı bildirilir (onChange).
 */

const TOOLBAR = [
    { icon: 'fa-bold',          title: 'Kalın (Ctrl+B)',   cmd: 'bold' },
    { icon: 'fa-italic',        title: 'İtalik (Ctrl+I)',  cmd: 'italic' },
    { icon: 'fa-underline',     title: 'Altı çizili',      cmd: 'underline' },
    { icon: 'fa-strikethrough', title: 'Üstü çizili',      cmd: 'strikeThrough' },

    { icon: 'fa-list-ul', title: 'Madde listesi',   cmd: 'insertUnorderedList', gap: true },
    { icon: 'fa-list-ol', title: 'Numaralı liste',  cmd: 'insertOrderedList' },

    { icon: 'fa-heading',    title: 'Başlık', cmd: 'formatBlock', arg: 'H3', gap: true },
    { icon: 'fa-quote-left', title: 'Alıntı', cmd: 'formatBlock', arg: 'BLOCKQUOTE' },
    { icon: 'fa-code',       title: 'Kod',    cmd: 'formatBlock', arg: 'PRE' },

    { icon: 'fa-link',        title: 'Bağlantı ekle', cmd: 'link', gap: true },
    { icon: 'fa-image',       title: 'Görsel ekle',   cmd: 'image', regular: true },
    { icon: 'fa-table-cells', title: 'Tablo ekle',    cmd: 'table' },
    { icon: 'fa-at',          title: 'Kişi bahset',   cmd: 'mention' },

    { icon: 'fa-eraser', title: 'Biçimi temizle', cmd: 'removeFormat', gap: true },
];

const TABLE_HTML =
    '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>';

const IMAGE_PLACEHOLDER_HTML =
    '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';

/** Kaydedilmiş düz metni güvenle HTML'e çevirir. V3 açıklamayı düz metin/markdown
 *  olarak saklıyordu; o kayıtlar innerHTML'e ham basılırsa hem biçim bozulur hem
 *  içerideki "<" işaretleri etiket sanılır. */
function toInitialHtml(value) {
    if (!value) return '';
    const looksLikeHtml = /<[a-z][\s\S]*>/i.test(value);
    if (looksLikeHtml) return value;
    const escaped = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
}

export function RichTextEditorV3({ value, onChange, mentionName = 'ekip arkadaşı' }) {
    const editorRef = useRef(null);
    const initialHtmlRef = useRef(toInitialHtml(value));
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('https://');
    const savedRangeRef = useRef(null);

    const exec = (cmd, arg) => {
        editorRef.current?.focus();
        try {
            document.execCommand(cmd, false, arg);
        } catch { /* desteklenmeyen komut — sessizce yut */ }
        onChange?.(editorRef.current?.innerHTML ?? '');
    };

    /** Bağlantı popover'ı açılırken seçim kaybolur (odak input'a geçer);
     *  Range saklanıp createLink öncesi geri yüklenir. */
    const saveSelection = () => {
        const sel = window.getSelection();
        savedRangeRef.current = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    };

    const restoreSelection = () => {
        const range = savedRangeRef.current;
        if (!range) return;
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const applyLink = () => {
        const url = linkUrl.trim();
        setLinkOpen(false);
        if (!url || url === 'https://') return;
        editorRef.current?.focus();
        restoreSelection();
        exec('createLink', url);
        setLinkUrl('https://');
    };

    const handleToolbarClick = (btn) => {
        switch (btn.cmd) {
            case 'link':
                saveSelection();
                setLinkOpen(true);
                return;
            case 'image':
                exec('insertHTML', IMAGE_PLACEHOLDER_HTML);
                return;
            case 'table':
                exec('insertHTML', TABLE_HTML);
                return;
            case 'mention':
                exec('insertHTML', `<span class="apya-rte-mention">@${mentionName}</span>&nbsp;`);
                return;
            default:
                exec(btn.cmd, btn.arg);
        }
    };

    const buttonCls =
        'flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs';

    return (
        <div className="rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs">
            <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar">
                {TOOLBAR.map((btn) => {
                    const node = (
                        <button
                            key={btn.cmd + btn.icon}
                            type="button"
                            title={btn.title}
                            /* mousedown'da preventDefault: odak editörden çıkmasın,
                               yoksa seçim kaybolur ve komut boşa gider. */
                            onMouseDown={(e) => { e.preventDefault(); handleToolbarClick(btn); }}
                            className={`${buttonCls} ${btn.gap ? 'ml-1.5' : ''}`}
                        >
                            <i className={`fa-${btn.regular ? 'regular' : 'solid'} ${btn.icon} text-[12px]`} />
                        </button>
                    );

                    if (btn.cmd !== 'link') return node;

                    return (
                        <Popover.Root key="link" open={linkOpen} onOpenChange={setLinkOpen}>
                            <Popover.Trigger asChild>{node}</Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    sideOffset={6}
                                    align="start"
                                    className="z-popover pointer-events-auto w-[290px] rounded-[13px] border border-default bg-surface-elevated p-3 shadow-float animate-fade-in-fast"
                                >
                                    <div className="text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary mb-2">
                                        Bağlantı adresi
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') applyLink(); }}
                                            className="flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={applyLink}
                                            className="h-[34px] px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover"
                                        >
                                            Ekle
                                        </button>
                                    </div>
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    );
                })}
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="Görev açıklaması"
                data-ph="Bu görevin detayları nelerdir? (@kişi, #etiket)…"
                onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
                className="apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none"
                dangerouslySetInnerHTML={{ __html: initialHtmlRef.current }}
            />
        </div>
    );
}
