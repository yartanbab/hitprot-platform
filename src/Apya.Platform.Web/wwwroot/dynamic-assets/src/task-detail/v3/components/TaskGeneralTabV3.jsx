import React, { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { RichTextEditorV3 } from './RichTextEditorV3';
import { initialsOf, avatarColorOf } from '../taskMetaV3';
import { notifyError } from '../../../lib/api/abpErrors';
import { useTaskAttachments } from '../../hooks/useTaskAttachments';

const CARD_CLS = 'flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs';

function Avatar({ name, size = 32 }) {
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full text-[color:var(--apya-avatar-fg)] font-bold"
            style={{ height: size, width: size, background: avatarColorOf(name), fontSize: size * 0.34 }}
        >
            {initialsOf(name)}
        </span>
    );
}

function CollapseButton({ open, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-label={`${label} — ${open ? 'daralt' : 'genişlet'}`}
            title={open ? 'Daralt' : 'Genişlet'}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
        >
            <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'} text-[12px]`} />
        </button>
    );
}

/* P-09 · Bahsetme etiketi: görev atama menüleriyle aynı ad (ad soyad, yoksa kullanıcı adı). */
const personName = (u) => [u?.name, u?.surname].filter(Boolean).join(' ') || u?.userName || '';

/* UX-5 · Yorumdaki "📎 dosya adı" satırı, görevin eklerinde aynı adlı dosya varsa indirme bağlantısıdır. */
export const ATTACHMENT_MARK = '📎 ';

function CommentText({ text, attachments }) {
    const lines = String(text ?? '').split('\n');
    return (
        <p className="m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap">
            {lines.map((line, i) => {
                const name = line.startsWith(ATTACHMENT_MARK) ? line.slice(ATTACHMENT_MARK.length).trim() : null;
                const file = name ? attachments.find((a) => a.fileName === name) : null;
                return (
                    <React.Fragment key={i}>
                        {i > 0 && '\n'}
                        {file ? (
                            /* Bağlantı belirteci (text-text-link): koyu temada text-primary 4,3:1 kalıyordu (AA 4,5). */
                            <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 font-semibold text-text-link hover:underline">
                                <i className="fa-solid fa-paperclip text-[11px]" aria-hidden="true" />{name}
                            </a>
                        ) : line}
                    </React.Fragment>
                );
            })}
        </p>
    );
}

const fmtDate = (iso) => (iso
    ? new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
    : '');

export function TaskGeneralTabV3({
    task = {},
    onFieldChange = () => {},
    descriptionValue,
    checklist,
    currentUserName = 'Ben',
    /* Düzenleme yetkisi yoksa açıklama ve kontrol listesi salt okunur. Yorumlar açık
       kalır: görevi görebilen herkes yorum yazabilir (ürün kararı, 2026-09-28). */
    readOnly = false,
}) {
    const taskId = task?.id;
    const queryClient = useQueryClient();

    /* ---- Kontrol listesi (gerçek backend servisi, root ile paylaşılan hook) ---- */
    const [checklistOpen, setChecklistOpen] = useState(true);
    const [checklistDraft, setChecklistDraft] = useState('');
    const items = checklist?.items ?? [];
    const doneCount = items.filter((c) => c.isDone).length;
    const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;

    const addChecklistItem = async () => {
        const text = checklistDraft.trim();
        if (!text || !taskId) return;
        setChecklistDraft('');
        try {
            await checklist.addItem(text);
        } catch (err) {
            // Eklenemedi: yazılan madde kaybolmasın (kullanıcı arada yenisini yazmadıysa geri konur).
            setChecklistDraft((current) => current || text);
            notifyError(err, 'Madde eklenemedi.');
        }
    };

    /* ---- Yorumlar ---- */
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [commentDraft, setCommentDraft] = useState('');
    const [composerFocused, setComposerFocused] = useState(false);
    const [sending, setSending] = useState(false);
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyDraft, setReplyDraft] = useState('');

    /* P-09 · Kişi bahsetme. Seçilen kişi metne "@Ad Soyad " olarak girer; gönderimde yalnız
       metinde HÂLÂ duran bahsetmeler kimlikle sunucuya gider (yazarken silinen bahsetme bildirim
       üretmez). Kişi listesi atama menüsüyle aynı uçtan, seçici ilk açıldığında yüklenir. */
    const [mentions, setMentions] = useState([]);
    const [mentionOpen, setMentionOpen] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const { data: people, isFetched: peopleFetched } = useQuery({
        queryKey: ['task-users-lookup'],
        queryFn: () => Promise.resolve(window?.apya?.platform?.tasks?.task?.getUsersLookup())
            .then((res) => res?.items ?? []),
        enabled: mentionOpen,
        staleTime: 60_000,
        meta: { persist: false },
    });
    const mentionNeedle = mentionFilter.trim().toLocaleLowerCase('tr-TR');
    const mentionChoices = (people ?? []).filter((u) => !mentionNeedle
        || `${personName(u)} ${u.userName ?? ''}`.toLocaleLowerCase('tr-TR').includes(mentionNeedle));

    const addMention = (u) => {
        const label = personName(u);
        setCommentDraft((d) => `${d && !/\s$/.test(d) ? `${d} ` : d}@${label} `);
        setMentions((list) => (list.some((m) => m.id === u.id) ? list : [...list, { id: u.id, label }]));
        setMentionOpen(false);
        setMentionFilter('');
    };

    const { data: comments = [] } = useQuery({
        queryKey: ['task-comments', taskId],
        queryFn: () => Promise.resolve(window?.apya?.platform?.tasks?.task?.getComments(taskId)),
        enabled: Boolean(taskId),
        staleTime: 10_000,
        meta: { persist: false },
    });

    /* UX-5 · Yoruma dosya: Dosyalar sekmesiyle aynı yükleme ucu ve aynı ek listesi (önbellek paylaşılır). Liste
       yalnız bir yorumda ek bağlantısı varsa istenir. */
    const files = useTaskAttachments(taskId, {
        enabled: comments.some((c) => String(c.text ?? '').includes(ATTACHMENT_MARK)),
    });
    const attachFile = async (file) => {
        if (!file) return;
        try {
            await files.upload(file);
            setCommentDraft((d) => (d && !d.endsWith('\n') ? d + '\n' : d) + ATTACHMENT_MARK + file.name);
        } catch (err) {
            notifyError(err, 'Dosya eklenemedi.');
        }
    };

    const invalidateComments = async () => {
        await queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
        await queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
    };

    const sendComment = async () => {
        const text = commentDraft.trim();
        if (!text || !taskId || sending) return;
        setSending(true);
        try {
            const mentionedIds = mentions.filter((m) => text.includes(`@${m.label}`)).map((m) => m.id);
            await Promise.resolve(window.apya.platform.tasks.task.addComment(taskId, text, mentionedIds));
            await invalidateComments();
            setCommentDraft('');
            setMentions([]);
        } catch (err) {
            notifyError(err, 'Yorum gönderilemedi.');
        } finally {
            setSending(false);
        }
    };

    const sendReply = async (parentId) => {
        const text = replyDraft.trim();
        if (!text || !taskId) return;
        try {
            /* B-17 · Yanıtta "@Ad Soyad" yazılan kişiler gönderimde kişi listesinden eşlenir (yanıt kutusunda ayrı
               seçici yok); sunucu yalnız görevi görebilenlere bildirir. */
            let mentionedIds = [];
            if (text.includes('@')) {
                const all = await queryClient.fetchQuery({
                    queryKey: ['task-users-lookup'],
                    queryFn: () => Promise.resolve(window?.apya?.platform?.tasks?.task?.getUsersLookup())
                        .then((res) => res?.items ?? []),
                    staleTime: 60_000,
                });
                mentionedIds = (all ?? [])
                    .filter((u) => { const n = personName(u); return n && text.includes(`@${n}`); })
                    .map((u) => u.id);
            }
            await Promise.resolve(window.apya.platform.tasks.task.replyToComment(parentId, text, mentionedIds));
            await invalidateComments();
            setReplyDraft('');
            setReplyingToId(null);
        } catch (err) {
            notifyError(err, 'Yanıt gönderilemedi.');
        }
    };

    const canSend = Boolean(commentDraft.trim()) && !sending;

    return (
        <div className="flex flex-col gap-4 min-w-0">

            {/* ─── 1. Açıklama (WYSIWYG) ─── */}
            <section className="flex flex-col gap-[9px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[13.5px] font-bold text-text-primary">Açıklama</h2>
                    <span className="text-[11px] text-text-tertiary">Zengin metin · WYSIWYG</span>
                </div>
                {/* key=taskId ŞART: editör içeriğini caret'i korumak için yalnız
                    MOUNT anında basıyor. Görev yerinde değişebiliyor (alt görev
                    panelinden "tam ekran aç", "görevi çoğalt") — remount olmazsa
                    kullanıcı yeni görevde ESKİ görevin metnini görür ve kaydedince
                    yeni görevin açıklamasını onunla ezer. */}
                <RichTextEditorV3
                    key={taskId}
                    value={descriptionValue ?? task.description ?? ''}
                    onChange={(html) => onFieldChange('description', html)}
                    readOnly={readOnly}
                />
            </section>

            {/* ─── 2. Kontrol listesi ─── */}
            <section className={CARD_CLS}>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[13.5px] font-bold text-text-primary">Kontrol listesi</h2>
                        <span className="flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold">
                            {doneCount}/{items.length}
                        </span>
                    </div>
                    <CollapseButton label="Kontrol listesi" open={checklistOpen} onClick={() => setChecklistOpen((v) => !v)} />
                </div>

                {checklistOpen && (
                    <div className="flex flex-col gap-1 mt-3.5">
                        <div className="h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden">
                            <div
                                className="h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        {items.map((item) => (
                            <div key={item.id} className="group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised">
                                <button
                                    type="button"
                                    disabled={readOnly}
                                    aria-label={item.isDone ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı işaretle'}
                                    onClick={() => checklist.toggleItem(item.id).catch((err) =>
                                        notifyError(err, 'Durum güncellenemedi.'))}
                                    className={`flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white ${readOnly ? 'cursor-default' : 'cursor-pointer'} transition-colors duration-fast ${
                                        item.isDone ? 'bg-success border-success' : 'bg-transparent border-strong'
                                    }`}
                                >
                                    {item.isDone && <i className="fa-solid fa-check text-[9px]" />}
                                </button>

                                <span className={`flex-1 min-w-0 text-[13px] ${
                                    item.isDone ? 'line-through text-text-tertiary font-medium' : 'text-text-primary font-semibold'
                                }`}>
                                    {item.text}
                                </span>

                                {!readOnly && <button
                                    type="button"
                                    title="Sil"
                                    onClick={() => checklist.removeItem(item.id).catch((err) =>
                                        notifyError(err, 'Madde silinemedi.'))}
                                    className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                >
                                    <i className="fa-regular fa-trash-can text-[11px]" />
                                </button>}
                            </div>
                        ))}

                        {!readOnly && <input
                            type="text"
                            value={checklistDraft}
                            onChange={(e) => setChecklistDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') addChecklistItem(); }}
                            placeholder="Yeni madde yaz ve Enter'a bas…"
                            className="h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                        />}
                    </div>
                )}
            </section>

            {/* ─── 3. Yorumlar ─── */}
            <section className={CARD_CLS}>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[13.5px] font-bold text-text-primary">Yorumlar &amp; güncellemeler</h2>
                        <span className="flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold">
                            {comments.length}
                        </span>
                    </div>
                    <CollapseButton label="Yorumlar" open={commentsOpen} onClick={() => setCommentsOpen((v) => !v)} />
                </div>

                {commentsOpen && (
                    <div className="flex flex-col gap-[18px] mt-4">
                        {/* Yazma kutusu — odak durumu focus-within yerine state ile sürülür:
                            focus-within var() tabanlı gölge/kenarlık kombinasyonunda alt bardaki
                            düğmelere de sızıyordu. */}
                        <div className="relative flex gap-[11px] items-start">
                            <Avatar name={currentUserName} />
                            <div className={`flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${
                                composerFocused
                                    ? 'border-focus bg-surface-base shadow-focus'
                                    : 'border-default bg-surface-raised'
                            }`}>
                                <textarea
                                    rows={2}
                                    value={commentDraft}
                                    onChange={(e) => setCommentDraft(e.target.value)}
                                    onFocus={() => setComposerFocused(true)}
                                    onBlur={() => setComposerFocused(false)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); sendComment(); }
                                    }}
                                    placeholder="Bir yorum yazın… (Ctrl+Enter ile gönder)"
                                    className="w-full p-3 border-0 bg-transparent text-text-primary text-[13px] leading-[1.6] resize-none focus:outline-none"
                                />
                                <div className="flex items-center justify-between px-2.5 py-[7px] border-t border-subtle bg-surface-base">
                                    <div className="flex items-center gap-0.5">
                                        {/* Yalnız gerçekten iş yapan araç kalır (QA-18): "Dosya ekle" ve
                                            "Görsel ekle" yorum metnine " [Dosya] " / " [Görsel] " yazıyordu
                                            (dosya eklenmiyordu), "Bahset" seçicisi ve bildirimi olmayan bir
                                            "@" basıyordu. Ataç (UX-5) dosyayı görevin Dosyalar sekmesine yükler ve yoruma bağlantısını ekler. Kişi bahsetme
                                            artık seçici + bildirimle çalışıyor (P-09). */}
                                        <button
                                            type="button"
                                            title="Kişi bahset"
                                            aria-label="Kişi bahset"
                                            aria-haspopup="dialog"
                                            aria-expanded={mentionOpen}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => setMentionOpen((v) => !v)}
                                            className={`flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${mentionOpen ? 'text-primary' : 'text-text-tertiary'}`}
                                        >
                                            <i className="fa-solid fa-at text-[12px]" />
                                        </button>
                                        {/* UX-5 · Dosya görevin Dosyalar sekmesine yüklenir, yoruma bağlantısı düşer. */}
                                        <label
                                            title="Dosya ekle"
                                            onMouseDown={(e) => e.preventDefault()}
                                            className={`flex items-center justify-center h-7 w-7 rounded-[7px] hover:bg-surface-hover hover:text-primary cursor-pointer ${files.isUploading ? 'text-primary' : 'text-text-tertiary'}`}
                                        >
                                            <i className={`fa-solid ${files.isUploading ? 'fa-circle-notch fa-spin' : 'fa-paperclip'} text-[12px]`} />
                                            <input
                                                type="file"
                                                aria-label="Dosya ekle"
                                                className="sr-only"
                                                disabled={files.isUploading || !taskId}
                                                onChange={(e) => { attachFile(e.target.files?.[0]); e.target.value = ''; }}
                                            />
                                        </label>
                                        {[
                                            { icon: 'fa-regular fa-face-smile', title: '👍 ekle', add: ' 👍 ' },
                                        ].map((tool) => (
                                            <button
                                                key={tool.title}
                                                type="button"
                                                title={tool.title}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => setCommentDraft((d) => d + tool.add)}
                                                className="flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer"
                                            >
                                                <i className={`${tool.icon} text-[12px]`} />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={sendComment}
                                        disabled={!canSend}
                                        className={`flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${
                                            canSend
                                                ? 'bg-primary text-white cursor-pointer hover:bg-primary-hover'
                                                : 'bg-border-default text-text-tertiary cursor-not-allowed'
                                        }`}
                                    >
                                        <i className={`fa-solid ${sending ? 'fa-circle-notch fa-spin' : 'fa-paper-plane'} text-[10px]`} />
                                        Gönder
                                    </button>
                                </div>
                            </div>

                            {/* Seçici yazma kutusunun DIŞINDA: kutu overflow-hidden, içeride kırpılırdı. */}
                            {mentionOpen && (
                                <div
                                    role="dialog"
                                    aria-label="Bahsedilecek kişi"
                                    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMentionOpen(false); }}
                                    className="absolute left-[43px] top-full z-20 mt-1 w-64 min-w-[200px] max-w-[calc(100%-43px)] rounded-[11px] border border-default bg-surface-base p-1.5 shadow-lg"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        value={mentionFilter}
                                        onChange={(e) => setMentionFilter(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { e.preventDefault(); setMentionOpen(false); }
                                            if (e.key === 'Enter' && mentionChoices[0]) { e.preventDefault(); addMention(mentionChoices[0]); }
                                        }}
                                        placeholder="Kişi ara…"
                                        aria-label="Kişi ara"
                                        className="mb-1 h-8 w-full rounded-[8px] border border-default bg-surface-raised px-2.5 text-[12px] text-text-primary focus:border-focus focus:outline-none"
                                    />
                                    <ul className="m-0 max-h-56 list-none overflow-y-auto p-0">
                                        {mentionChoices.map((u) => (
                                            <li key={u.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => addMention(u)}
                                                    className="w-full rounded-[7px] px-2.5 py-1.5 text-left text-[12.5px] text-text-primary hover:bg-surface-hover cursor-pointer"
                                                >
                                                    {personName(u)}
                                                    {u.userName && personName(u) !== u.userName && (
                                                        <span className="ml-1 text-[11px] text-text-tertiary">({u.userName})</span>
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                        {!mentionChoices.length && (
                                            <li className="px-2.5 py-2 text-[12px] text-text-tertiary">
                                                {peopleFetched ? 'Eşleşen kişi yok' : 'Yükleniyor…'}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            {comments.map((c) => {
                                return (
                                    <div key={c.id} className="flex gap-[11px] items-start py-3 border-t border-subtle">
                                        <Avatar name={c.authorName} />
                                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                            <div className="flex items-baseline gap-2.5 flex-wrap">
                                                <span className="text-[12.5px] font-bold text-text-primary">{c.authorName}</span>
                                                <span className="font-mono text-[10.5px] text-text-tertiary">{fmtDate(c.creationTime)}</span>
                                            </div>
                                            <CommentText text={c.text} attachments={files.attachments} />

                                            <div className="flex items-center gap-1.5 mt-[3px]">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyingToId((id) => (id === c.id ? null : c.id));
                                                        setReplyDraft('');
                                                    }}
                                                    className="flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer"
                                                >
                                                    <i className="fa-solid fa-reply text-[10px]" />
                                                    Yanıtla
                                                </button>
                                            </div>

                                            {replyingToId === c.id && (
                                                <div className="flex gap-2 mt-2 animate-fade-in-fast">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={replyDraft}
                                                        onChange={(e) => setReplyDraft(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') sendReply(c.id); }}
                                                        placeholder={`@${c.authorName} kullanıcısına yanıt ver…`}
                                                        className="flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => sendReply(c.id)}
                                                        className="h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover"
                                                    >
                                                        Yanıtla
                                                    </button>
                                                </div>
                                            )}

                                            {(c.replies ?? []).map((r) => (
                                                <div key={r.id} className="flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default">
                                                    <Avatar name={r.authorName} size={24} />
                                                    <div className="min-w-0">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-[12px] font-bold text-text-primary">{r.authorName}</span>
                                                            <span className="font-mono text-[10px] text-text-tertiary">{fmtDate(r.creationTime)}</span>
                                                        </div>
                                                        <p className="mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap">{r.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
