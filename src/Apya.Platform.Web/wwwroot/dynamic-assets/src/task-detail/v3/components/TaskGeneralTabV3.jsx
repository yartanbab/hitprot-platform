import React, { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '../../../components/ui';
import { useTaskChecklist } from '../../hooks/useTaskChecklist';

// Interactive Rich Text Toolbar with Markdown formatting
function RichTextToolbar({ onFormat = () => {} }) {
    return (
        <div className="flex items-center gap-0.5 border-b border-subtle bg-surface-sunken/40 px-2 py-1.5 rounded-t-xl overflow-x-auto custom-scrollbar">
            <button type="button" onClick={() => onFormat('**', '**')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Kalın (Ctrl+B)">
                <i className="fa-solid fa-bold text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('*', '*')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="İtalik (Ctrl+I)">
                <i className="fa-solid fa-italic text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('<u>', '</u>')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Altı Çizili (Ctrl+U)">
                <i className="fa-solid fa-underline text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('~~', '~~')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Üstü Çizili">
                <i className="fa-solid fa-strikethrough text-xs" />
            </button>

            <div className="h-4 w-px bg-subtle mx-1 shrink-0" />

            <button type="button" onClick={() => onFormat('\n- ', '')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Madde İşaretli Liste">
                <i className="fa-solid fa-list-ul text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('\n1. ', '')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Numaralı Liste">
                <i className="fa-solid fa-list-ol text-xs" />
            </button>

            <div className="h-4 w-px bg-subtle mx-1 shrink-0" />

            <button type="button" onClick={() => onFormat('[', '](url)')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Bağlantı Ekle">
                <i className="fa-solid fa-link text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('![Resim](', ')')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Görsel Ekle">
                <i className="fa-regular fa-image text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('\n| Kolon 1 | Kolon 2 |\n|---|---|\n| Değer 1 | Değer 2 |\n', '')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Tablo Ekle">
                <i className="fa-solid fa-table-cells text-xs" />
            </button>
            <button type="button" onClick={() => onFormat('@', ' ')} className="h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" title="Kişi Bahset (@)">
                <i className="fa-solid fa-at text-xs" />
            </button>
        </div>
    );
}

export function TaskGeneralTabV3({ task = {}, onFieldChange = () => {} }) {
    const taskId = task?.id;
    const queryClient = useQueryClient();

    // 1. Açıklama State
    const [desc, setDesc] = useState(task.description || '');

    const handleFormat = (prefix, suffix = '') => {
        const textarea = document.getElementById('task-v3-desc-input');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = desc.substring(start, end) || 'metin';
        const replacement = `${prefix}${selected}${suffix}`;
        const next = desc.substring(0, start) + replacement + desc.substring(end);

        setDesc(next);
        onFieldChange('description', next);
    };

    // 2. Kontrol Listesi Hook (Gerçek ABP Backend Servisi)
    const checklistHook = useTaskChecklist(taskId);
    const [isChecklistOpen, setIsChecklistOpen] = useState(true);
    const [newChecklistText, setNewChecklistText] = useState('');
    const [isAddingChecklist, setIsAddingChecklist] = useState(false);
    const [busyChecklist, setBusyChecklist] = useState(false);

    const checklistItems = checklistHook.items ?? [];

    const completedCount = checklistItems.filter(c => c.isDone || c.done).length;

    const handleAddChecklist = async (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const trimmed = newChecklistText.trim();
            if (trimmed && taskId) {
                setBusyChecklist(true);
                try {
                    await checklistHook.addItem(trimmed);
                    window?.abp?.notify?.success?.('Madde eklendi.');
                } catch (err) {
                    window?.abp?.notify?.error?.(err?.message || 'Madde eklenemedi.');
                } finally {
                    setBusyChecklist(false);
                }
            }
            setNewChecklistText('');
            setIsAddingChecklist(false);
        }
    };

    const handleToggleChecklist = async (itemId) => {
        if (typeof itemId === 'string' && itemId.startsWith('mock-')) return;
        try {
            await checklistHook.toggleItem(itemId);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Durum güncellenemedi.');
        }
    };

    const handleRemoveChecklist = async (itemId) => {
        if (typeof itemId === 'string' && itemId.startsWith('mock-')) return;
        try {
            await checklistHook.removeItem(itemId);
            window?.abp?.notify?.info?.('Madde silindi.');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Madde silinemedi.');
        }
    };

    // 3. Yorumlar Hook & State (Gerçek ABP Backend Servisi)
    const { data: backendComments = [] } = useQuery({
        queryKey: ['task-comments', taskId],
        queryFn: async () => {
            const svc = window?.apya?.platform?.tasks?.task;
            if (!svc || !taskId) return [];
            return await Promise.resolve(svc.getComments(taskId));
        },
        enabled: Boolean(taskId),
        staleTime: 10_000
    });

    const [newComment, setNewComment] = useState('');
    const [isCommentsOpen, setIsCommentsOpen] = useState(true);
    const [isSendingComment, setIsSendingComment] = useState(false);
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const commentsList = backendComments.length > 0
        ? backendComments
        : (task.comments ?? []);

    const handleSendComment = async (e) => {
        e.preventDefault();
        const trimmed = newComment.trim();
        if (!trimmed || !taskId) return;

        setIsSendingComment(true);
        try {
            const svc = window?.apya?.platform?.tasks?.task;
            if (svc) {
                await Promise.resolve(svc.addComment(taskId, trimmed));
                await queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
                await queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
                window?.abp?.notify?.success?.('Yorum gönderildi.');
            }
            setNewComment('');
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yorum gönderilemedi.');
        } finally {
            setIsSendingComment(false);
        }
    };

    const handleSendReply = async (parentCommentId) => {
        const trimmed = replyText.trim();
        if (!trimmed || !taskId) return;

        try {
            const svc = window?.apya?.platform?.tasks?.task;
            if (svc) {
                await Promise.resolve(svc.replyToComment(parentCommentId, trimmed));
                await queryClient.invalidateQueries({ queryKey: ['task-comments', taskId] });
                window?.abp?.notify?.success?.('Yanıt gönderildi.');
            }
            setReplyText('');
            setReplyingToId(null);
        } catch (err) {
            window?.abp?.notify?.error?.(err?.message || 'Yanıt gönderilemedi.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* 1. Açıklama Kartı */}
            <section className="flex flex-col gap-2.5">
                <h2 className="text-[14px] font-bold text-text-primary">Açıklama</h2>
                <div className="rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs">
                    <RichTextToolbar onFormat={handleFormat} />
                    <textarea 
                        id="task-v3-desc-input"
                        className="w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y font-sans"
                        value={desc}
                        onChange={(e) => {
                            setDesc(e.target.value);
                            onFieldChange('description', e.target.value);
                        }}
                        placeholder="Bu görevin detayları nelerdir? (@kişi, #etiket)..."
                    />
                </div>
            </section>

            {/* 2. Kontrol Listesi Kartı */}
            <section className="flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all">
                <div 
                    onClick={() => setIsChecklistOpen(!isChecklistOpen)}
                    className="flex items-center justify-between cursor-pointer select-none group"
                >
                    <div className="flex items-center gap-3">
                        <h2 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors">
                            Kontrol Listesi
                        </h2>
                        {checklistItems.length > 0 && (
                            <span className="text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full">
                                {completedCount}/{checklistItems.length}
                            </span>
                        )}
                    </div>
                    <button type="button" className="text-text-tertiary group-hover:text-text-primary transition-colors">
                        <i className={`fa-solid fa-chevron-up transition-transform duration-200 ${isChecklistOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>
                
                {isChecklistOpen && (
                    <div className="mt-4 flex flex-col gap-2.5 animate-in fade-in-50">
                        {/* Progress Bar */}
                        {checklistItems.length > 0 && (
                            <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1">
                                <div 
                                    className="h-full bg-success transition-all duration-300"
                                    style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Checklist items */}
                        {checklistItems.map(item => {
                            const isDone = item.isDone ?? item.done ?? false;
                            return (
                                <div 
                                    key={item.id} 
                                    className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors"
                                >
                                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0">
                                        <input 
                                            type="checkbox"
                                            checked={isDone}
                                            onChange={() => handleToggleChecklist(item.id)}
                                            className="h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                        />
                                        <span className={`text-[13px] transition-all truncate ${
                                            isDone 
                                                ? 'line-through text-text-tertiary font-normal' 
                                                : 'text-text-primary font-medium'
                                        }`}>
                                            {item.text}
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveChecklist(item.id)}
                                        className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1"
                                        title="Maddeyi Sil"
                                    >
                                        <i className="fa-solid fa-trash-can text-xs" />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Add Item Button & Input */}
                        {isAddingChecklist ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newChecklistText}
                                    onChange={(e) => setNewChecklistText(e.target.value)}
                                    onKeyDown={handleAddChecklist}
                                    onBlur={handleAddChecklist}
                                    disabled={busyChecklist}
                                    placeholder="Yeni kontrol maddesi yazıp Enter'a basın..."
                                    className="w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                                />
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAddingChecklist(true)}
                                className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover transition-colors mt-1 px-2 py-1 w-max rounded-lg hover:bg-primary-subtle"
                            >
                                <i className="fa-solid fa-plus text-[11px]" />
                                <span>Yeni madde ekle</span>
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* 3. Yorumlar & Güncellemeler Kartı */}
            <section className="flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all">
                <div 
                    onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                    className="flex items-center justify-between cursor-pointer select-none group"
                >
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors">
                            Yorumlar & Güncellemeler
                        </h2>
                        <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold">
                            {commentsList.length}
                        </span>
                    </div>
                    <button type="button" className="text-text-tertiary group-hover:text-text-primary transition-colors">
                        <i className={`fa-solid fa-chevron-up transition-transform duration-200 ${isCommentsOpen ? '' : 'rotate-180'}`} />
                    </button>
                </div>

                {isCommentsOpen && (
                    <div className="mt-4 flex flex-col gap-5 animate-in fade-in-50">
                        {/* New Comment Input Box */}
                        <form onSubmit={handleSendComment} className="flex gap-3 items-start">
                            <img 
                                src="https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64" 
                                alt="Yakup" 
                                className="h-8 w-8 rounded-full border border-subtle mt-1 shrink-0 object-cover" 
                            />
                            <div className="flex-1 flex flex-col rounded-xl border border-subtle bg-surface-sunken/40 focus-within:bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Bir yorum yazın... (@bahset, #görev)"
                                    rows={2}
                                    className="w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handleSendComment(e);
                                        }
                                    }}
                                />
                                <div className="flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base">
                                    <div className="flex items-center gap-1 text-text-tertiary">
                                        <button type="button" onClick={() => setNewComment(prev => prev + ' [Dosya] ')} className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Dosya Ekle">
                                            <i className="fa-solid fa-paperclip text-xs" />
                                        </button>
                                        <button type="button" onClick={() => setNewComment(prev => prev + ' [Görsel] ')} className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Resim Ekle">
                                            <i className="fa-regular fa-image text-xs" />
                                        </button>
                                        <button type="button" onClick={() => setNewComment(prev => prev + ' 👍 ')} className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Emoji">
                                            <i className="fa-regular fa-face-smile text-xs" />
                                        </button>
                                        <button type="button" onClick={() => setNewComment(prev => prev + ' @Yakup B. ')} className="h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors" title="Bahset (@)">
                                            <i className="fa-solid fa-at text-xs" />
                                        </button>
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!newComment.trim() || isSendingComment}
                                        isLoading={isSendingComment}
                                        className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm"
                                        icon="fa-paper-plane"
                                    >
                                        Gönder
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {/* Comment Stream */}
                        <div className="flex flex-col gap-4 divide-y divide-subtle/50">
                            {commentsList.map(c => {
                                const author = c.creatorName || c.author || 'Yakup B.';
                                const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=6366f1&color=fff&size=64`;
                                const dateStr = c.creationTime 
                                    ? new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(c.creationTime))
                                    : (c.date || '10.07.2026 09:30');

                                return (
                                    <div key={c.id} className="flex gap-3 pt-3 items-start first:pt-0">
                                        <img src={avatar} alt={author} className="h-8 w-8 rounded-full border border-subtle shrink-0 object-cover" />
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-bold text-text-primary">{author}</span>
                                                    <span className="text-[11px] text-text-tertiary font-mono">{dateStr}</span>
                                                </div>
                                            </div>

                                            <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                                                {c.text.split(' ').map((word, i) => (
                                                    word.startsWith('@') 
                                                        ? <span key={i} className="font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1">{word} </span>
                                                        : word + ' '
                                                ))}
                                            </p>

                                            {/* Actions: Reply */}
                                            <div className="flex items-center gap-4 mt-1">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                                                    className="text-xs font-semibold text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
                                                >
                                                    <i className="fa-solid fa-reply text-[10px]" />
                                                    <span>Yanıtla</span>
                                                </button>
                                            </div>

                                            {/* Sub-reply inline form */}
                                            {replyingToId === c.id && (
                                                <div className="mt-2 flex gap-2 items-center animate-in fade-in-50">
                                                    <input 
                                                        autoFocus
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder={`@${author} kullanıcısına yanıt ver...`}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(c.id); }}
                                                        className="flex-1 h-8 px-3 text-[12px] rounded-lg border border-primary bg-surface-base focus:outline-none"
                                                    />
                                                    <Button size="sm" onClick={() => handleSendReply(c.id)} className="h-8 text-xs bg-primary text-white">
                                                        Yanıtla
                                                    </Button>
                                                </div>
                                            )}
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
