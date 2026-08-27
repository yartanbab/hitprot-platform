import React, { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { RichTextEditorV3 } from './RichTextEditorV3';
import { initialsOf, avatarColorOf } from '../taskMetaV3';

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

function CollapseButton({ open, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
        >
            <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'} text-[12px]`} />
        </button>
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
            window?.abp?.notify?.error?.(err?.message || 'Madde eklenemedi.');
        }
    };

    /* ---- Yorumlar ---- */
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [commentDraft, setCommentDraft] = useState('');
    const [composerFocused, setComposerFocused] = useState(false);
    const [sending, setSending] = useState(false);
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyDraft, setReplyDraft] = useState('');
    /* Beğeni backend'de YOK — yalnız oturum içi. Kalıcı değil, bilinçli boşluk. */
    const [likes, setLikes] = useState({});

    const { data: comments = [] } = useQuery({
        queryKey: ['task-comments', taskId],
        queryFn: () => Promise.resolve(window?.apya?.platform?.tasks?.task?.getComments(taskId)),
        enabled: Boolean(taskId),
        staleTime: 10_000,
    });

    const invalidateComments = async () => {
        await queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
        await queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
    };

    const sendComment = async () => {
        const text = commentDraft.trim();
        if (!text || !taskId || sending) return;
        setSending(true);
        try {
            await Promise.resolve(window.apya.platform.tasks.task.addComment(taskId, text));
            await invalidateComments();
            setCommentDraft('');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yorum gönderilemedi.');
        } finally {
            setSending(false);
        }
    };

    const sendReply = async (parentId) => {
        const text = replyDraft.trim();
        if (!text || !taskId) return;
        try {
            await Promise.resolve(window.apya.platform.tasks.task.replyToComment(parentId, text));
            await invalidateComments();
            setReplyDraft('');
            setReplyingToId(null);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yanıt gönderilemedi.');
        }
    };

    const toggleLike = (id) => setLikes((prev) => {
        const cur = prev[id] ?? { liked: false, count: 0 };
        return { ...prev, [id]: { liked: !cur.liked, count: cur.count + (cur.liked ? -1 : 1) } };
    });

    const canSend = Boolean(commentDraft.trim()) && !sending;

    return (
        <div className="flex flex-col gap-4 min-w-0">

            {/* ─── 1. Açıklama (WYSIWYG) ─── */}
            <section className="flex flex-col gap-[9px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[13.5px] font-bold text-text-primary">Açıklama</h2>
                    <span className="text-[11px] text-text-tertiary">Zengin metin · WYSIWYG</span>
                </div>
                <RichTextEditorV3
                    value={descriptionValue ?? task.description ?? ''}
                    onChange={(html) => onFieldChange('description', html)}
                    mentionName={currentUserName}
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
                    <CollapseButton open={checklistOpen} onClick={() => setChecklistOpen((v) => !v)} />
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
                                    aria-label={item.isDone ? 'Tamamlandı işaretini kaldır' : 'Tamamlandı işaretle'}
                                    onClick={() => checklist.toggleItem(item.id).catch((err) =>
                                        window?.abp?.notify?.error?.(err?.message || 'Durum güncellenemedi.'))}
                                    className={`flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${
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

                                <button
                                    type="button"
                                    title="Sil"
                                    onClick={() => checklist.removeItem(item.id).catch((err) =>
                                        window?.abp?.notify?.error?.(err?.message || 'Madde silinemedi.'))}
                                    className="flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer"
                                >
                                    <i className="fa-regular fa-trash-can text-[11px]" />
                                </button>
                            </div>
                        ))}

                        <input
                            type="text"
                            value={checklistDraft}
                            onChange={(e) => setChecklistDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') addChecklistItem(); }}
                            placeholder="Yeni madde yaz ve Enter'a bas…"
                            className="h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                        />
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
                    <CollapseButton open={commentsOpen} onClick={() => setCommentsOpen((v) => !v)} />
                </div>

                {commentsOpen && (
                    <div className="flex flex-col gap-[18px] mt-4">
                        {/* Yazma kutusu — odak durumu focus-within yerine state ile sürülür:
                            focus-within var() tabanlı gölge/kenarlık kombinasyonunda alt bardaki
                            düğmelere de sızıyordu. */}
                        <div className="flex gap-[11px] items-start">
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
                                    placeholder="Bir yorum yazın… (@bahset, Ctrl+Enter ile gönder)"
                                    className="w-full p-3 border-0 bg-transparent text-text-primary text-[13px] leading-[1.6] resize-none focus:outline-none"
                                />
                                <div className="flex items-center justify-between px-2.5 py-[7px] border-t border-subtle bg-surface-base">
                                    <div className="flex items-center gap-0.5">
                                        {[
                                            { icon: 'fa-solid fa-paperclip', title: 'Dosya ekle', add: ' [Dosya] ' },
                                            { icon: 'fa-regular fa-image', title: 'Görsel ekle', add: ' [Görsel] ' },
                                            { icon: 'fa-regular fa-face-smile', title: 'Emoji', add: ' 👍 ' },
                                            { icon: 'fa-solid fa-at', title: 'Bahset', add: ' @' },
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
                        </div>

                        <div className="flex flex-col gap-1">
                            {comments.map((c) => {
                                const like = likes[c.id] ?? { liked: false, count: 0 };
                                return (
                                    <div key={c.id} className="flex gap-[11px] items-start py-3 border-t border-subtle">
                                        <Avatar name={c.authorName} />
                                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                            <div className="flex items-baseline gap-2.5 flex-wrap">
                                                <span className="text-[12.5px] font-bold text-text-primary">{c.authorName}</span>
                                                <span className="font-mono text-[10.5px] text-text-tertiary">{fmtDate(c.creationTime)}</span>
                                            </div>
                                            <p className="m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap">{c.text}</p>

                                            <div className="flex items-center gap-1.5 mt-[3px]">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleLike(c.id)}
                                                    className={`flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${
                                                        like.liked
                                                            ? 'border-primary bg-primary-subtle text-primary'
                                                            : 'border-default bg-transparent text-text-tertiary hover:border-focus'
                                                    }`}
                                                >
                                                    <i className="fa-regular fa-thumbs-up text-[10px]" />
                                                    {like.count}
                                                </button>
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
